"""Billing services for the RBP platform layer."""

import json

import frappe

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.environment import get_runtime_settings, is_stripe_enabled
from rbp_app.services.entitlements import sync_entitlements_for_subscription
from rbp_app.services.notifications import create_notification
from rbp_app.services.tenancy import doctype_exists, get_rbp_tenant_for_user


PAYMENT_STATES = {
    "Not Required",
    "Pending",
    "Authorised",
    "Paid",
    "Failed",
    "Refunded",
    "Cancelled",
    "Disputed",
}


def _placeholder():
    runtime = get_runtime_settings()
    return {
        "status": "not_configured",
        "plan": None,
        "message": "Billing is not configured for this portal yet.",
        "billing_enabled": False,
        "stripe_enabled": runtime.enable_stripe,
        "stripe_mode": runtime.stripe_mode,
        "stripe_test_mode": runtime.stripe_test_mode,
    }


def _doctype_exists(doctype):
    """Backward-compatible wrapper around the tenancy DocType check."""

    return doctype_exists(doctype)


def _get_user_tenant(user=None):
    tenant = get_rbp_tenant_for_user(user)
    return getattr(tenant, "name", None)


def _coerce_payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload)
    return dict(payload)


def get_subscription_status(user=None):
    """Return current user's subscription status or a safe placeholder."""

    runtime = get_runtime_settings()

    if not runtime.enable_stripe:
        return _placeholder()

    if not _doctype_exists("RBP Subscription"):
        return _placeholder()

    try:
        if frappe.db.count("RBP Subscription") <= 0:
            return _placeholder()
    except Exception:
        return _placeholder()

    filters = {}
    tenant = _get_user_tenant(user)
    if tenant:
        filters["tenant"] = tenant
    elif not is_admin_user(user):
        return _placeholder()

    try:
        subscriptions = frappe.get_all(
            "RBP Subscription",
            filters=filters,
            fields=[
                "name",
                "tenant",
                "member",
                "status",
                "plan",
                "billing_cycle",
                "billing_provider",
                "provider_customer_id",
                "provider_subscription_id",
                "provider_product_id",
                "provider_price_id",
                "payment_status",
                "amount",
                "currency",
                "current_period_start",
                "current_period_end",
                "cancel_at_period_end",
                "last_payment_event",
            ],
            order_by="modified desc",
            limit_page_length=1,
        )
    except Exception:
        return _placeholder()

    if not subscriptions:
        return _placeholder()

    subscription = subscriptions[0]
    return {
        "status": subscription.get("status"),
        "plan": subscription.get("plan"),
        "message": "Subscription status is available.",
        "billing_enabled": True,
        "stripe_enabled": runtime.enable_stripe,
        "stripe_mode": runtime.stripe_mode,
        "stripe_test_mode": runtime.stripe_test_mode,
        "subscription": subscription,
    }


def record_payment_event(payload, user=None):
    """Record an idempotent payment event and optionally update a subscription."""

    if not is_stripe_enabled():
        raise frappe.ValidationError("Stripe billing is disabled for this environment.")

    payload = _coerce_payload(payload)

    if not _doctype_exists("RBP Payment Event"):
        raise frappe.ValidationError("RBP Payment Event is not installed.")

    provider_event_id = payload.get("provider_event_id")
    if provider_event_id:
        existing = frappe.db.exists("RBP Payment Event", {"provider_event_id": provider_event_id})
        if existing:
            return frappe.get_doc("RBP Payment Event", existing)

    status = payload.get("status") or "Pending"
    if status not in PAYMENT_STATES:
        raise frappe.ValidationError("Invalid payment status.")

    doc = frappe.get_doc(
        {
            "doctype": "RBP Payment Event",
            "tenant": payload.get("tenant"),
            "user": payload.get("user") or user,
            "related_doctype": payload.get("related_doctype"),
            "related_name": payload.get("related_name"),
            "payment_provider": payload.get("payment_provider") or "Stripe",
            "provider_event_id": provider_event_id,
            "provider_customer_id": payload.get("provider_customer_id"),
            "provider_payment_id": payload.get("provider_payment_id"),
            "amount": payload.get("amount"),
            "currency": payload.get("currency") or "AUD",
            "status": status,
            "event_type": payload.get("event_type"),
            "raw_payload": json.dumps(payload.get("raw_payload") or payload, default=str),
        }
    )
    doc.insert(ignore_permissions=True)

    if doc.related_doctype == "RBP Subscription" and doc.related_name:
        update_subscription_from_payment_event(doc)

    record_audit_event(
        "payment_event_recorded",
        actor=user,
        tenant=doc.tenant,
        subject_doctype=doc.related_doctype or "RBP Payment Event",
        subject_name=doc.related_name or doc.name,
        message="Payment event recorded.",
        metadata={"payment_event": doc.name, "status": doc.status, "provider_event_id": provider_event_id},
    )

    return doc


def update_subscription_from_payment_event(event):
    """Apply payment event state to a linked subscription."""

    if not event.related_name or not frappe.db.exists("RBP Subscription", event.related_name):
        return None

    subscription = frappe.get_doc("RBP Subscription", event.related_name)
    subscription.payment_status = event.status
    subscription.provider_customer_id = event.provider_customer_id or subscription.provider_customer_id
    subscription.provider_payment_id = event.provider_payment_id
    subscription.last_payment_event = event.name

    if event.status == "Paid" and subscription.status in {"Draft", "Trial", "Past Due"}:
        subscription.status = "Active"

    if event.status in {"Failed", "Disputed"} and subscription.status == "Active":
        subscription.status = "Past Due"

    subscription.save(ignore_permissions=True)

    if subscription.status in {"Active", "Trial"}:
        sync_entitlements_for_subscription(subscription, active=True)
        _notify_subscription_member(subscription, "Membership active", "Your RBP membership is active.")
    elif subscription.status == "Past Due":
        sync_entitlements_for_subscription(subscription, active=False, status="Suspended")
        _notify_subscription_member(subscription, "Payment failed", "Your membership payment needs attention.")
    elif subscription.status in {"Cancelled", "Suspended", "Archived"}:
        sync_entitlements_for_subscription(subscription, active=False, status="Cancelled")
        _notify_subscription_member(subscription, "Membership access updated", "Your membership access has changed.")

    return subscription


def _notify_subscription_member(subscription, title, message):
    if not getattr(subscription, "member", None):
        return None
    return create_notification(
        user=subscription.member,
        title=title,
        message=message,
        tenant=getattr(subscription, "tenant", None),
        route="/portal/billing",
        related_doctype="RBP Subscription",
        related_name=subscription.name,
        trigger_source="billing",
    )


def get_subscription_status_payload():
    """Backward-compatible alias for the subscription payload."""

    return get_subscription_status()
