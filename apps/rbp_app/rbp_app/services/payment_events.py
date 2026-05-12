"""Payment event and Stripe subscription synchronisation services."""

from __future__ import annotations

from typing import Any

import frappe

from rbp_app.services.audit import record_audit_event
from rbp_app.services.billing import record_payment_event
from rbp_app.services.entitlements import sync_entitlements_for_subscription
from rbp_app.services.notifications import create_notification
from rbp_app.services.stripe_gateway import timestamp_to_datetime
from rbp_app.services.tenancy import doctype_exists


STRIPE_EVENT_STATUS = {
    "checkout.session.completed": "Paid",
    "checkout.session.async_payment_succeeded": "Paid",
    "checkout.session.async_payment_failed": "Failed",
    "invoice.paid": "Paid",
    "invoice.payment_succeeded": "Paid",
    "invoice.payment_failed": "Failed",
    "customer.subscription.created": "Pending",
    "customer.subscription.updated": "Pending",
    "customer.subscription.deleted": "Cancelled",
}

STRIPE_SUBSCRIPTION_STATUS = {
    "trialing": "Trial",
    "active": "Active",
    "past_due": "Past Due",
    "unpaid": "Past Due",
    "canceled": "Cancelled",
    "cancelled": "Cancelled",
    "incomplete": "Draft",
    "incomplete_expired": "Cancelled",
    "paused": "Suspended",
}

STRIPE_PAYMENT_STATUS = {
    "trialing": "Authorised",
    "active": "Paid",
    "past_due": "Failed",
    "unpaid": "Failed",
    "canceled": "Cancelled",
    "cancelled": "Cancelled",
    "incomplete": "Pending",
    "incomplete_expired": "Cancelled",
    "paused": "Pending",
}


def _event_get(event: Any, key: str, default: Any = None) -> Any:
    if isinstance(event, dict):
        return event.get(key, default)
    return getattr(event, key, default)


def _object_from_event(event: Any) -> dict[str, Any]:
    data = _event_get(event, "data", {}) or {}
    if not isinstance(data, dict):
        data = dict(data)
    obj = data.get("object") or {}
    return dict(obj)


def _event_payload(event: Any) -> dict[str, Any]:
    if isinstance(event, dict):
        return event
    if hasattr(event, "to_dict_recursive"):
        return event.to_dict_recursive()
    if hasattr(event, "to_dict"):
        return event.to_dict()
    return {"id": _event_get(event, "id"), "type": _event_get(event, "type")}


def _metadata(obj: dict[str, Any]) -> dict[str, Any]:
    metadata = obj.get("metadata") or {}
    return dict(metadata)


def _first_line_item(obj: dict[str, Any]) -> dict[str, Any]:
    items = obj.get("items") or {}
    data = items.get("data") if isinstance(items, dict) else None
    if data:
        return dict(data[0])
    lines = obj.get("lines") or {}
    data = lines.get("data") if isinstance(lines, dict) else None
    if data:
        return dict(data[0])
    return {}


def _price_from_object(obj: dict[str, Any]) -> dict[str, Any]:
    line = _first_line_item(obj)
    price = line.get("price") or obj.get("price") or {}
    return dict(price)


def _provider_subscription_id(obj: dict[str, Any]) -> str | None:
    value = obj.get("subscription") or obj.get("id")
    if isinstance(value, dict):
        return value.get("id")
    return value


def _provider_customer_id(obj: dict[str, Any]) -> str | None:
    value = obj.get("customer")
    if isinstance(value, dict):
        return value.get("id")
    return value


def _provider_payment_id(obj: dict[str, Any]) -> str | None:
    value = obj.get("payment_intent") or obj.get("charge") or obj.get("id")
    if isinstance(value, dict):
        return value.get("id")
    return value


def _amount_from_object(obj: dict[str, Any]) -> float | None:
    amount = obj.get("amount_paid")
    if amount is None:
        amount = obj.get("amount_total")
    if amount is None:
        amount = obj.get("amount_due")
    if amount is None:
        return None
    try:
        return float(amount) / 100
    except Exception:
        return None


def _currency_from_object(obj: dict[str, Any]) -> str:
    return (obj.get("currency") or "aud").upper()


def _find_plan_by_price(price_id: str | None):
    if not price_id or not doctype_exists("RBP Membership Plan"):
        return None
    name = frappe.db.get_value("RBP Membership Plan", {"stripe_price_id": price_id}, "name")
    if name:
        return frappe.get_doc("RBP Membership Plan", name)
    return None


def _find_subscription(obj: dict[str, Any]):
    metadata = _metadata(obj)
    subscription_name = metadata.get("rbp_subscription") or obj.get("client_reference_id")
    if subscription_name and frappe.db.exists("RBP Subscription", subscription_name):
        return frappe.get_doc("RBP Subscription", subscription_name)

    provider_subscription_id = _provider_subscription_id(obj)
    if provider_subscription_id:
        name = frappe.db.get_value(
            "RBP Subscription",
            {"provider_subscription_id": provider_subscription_id},
            "name",
        )
        if name:
            return frappe.get_doc("RBP Subscription", name)

    customer_id = _provider_customer_id(obj)
    if customer_id:
        name = frappe.db.get_value("RBP Subscription", {"provider_customer_id": customer_id}, "name")
        if name:
            return frappe.get_doc("RBP Subscription", name)

    return None


def _create_subscription_from_stripe(obj: dict[str, Any]):
    metadata = _metadata(obj)
    price = _price_from_object(obj)
    plan = _find_plan_by_price(price.get("id")) if price else None
    plan_code = metadata.get("rbp_plan_code") or getattr(plan, "plan_code", None)
    if not plan_code:
        return None

    subscription = frappe.get_doc(
        {
            "doctype": "RBP Subscription",
            "tenant": metadata.get("rbp_tenant") or None,
            "member": metadata.get("rbp_user") or None,
            "status": "Draft",
            "plan": plan_code,
            "billing_cycle": getattr(plan, "billing_cycle", None) or "Monthly",
            "billing_provider": "Stripe",
            "payment_status": "Pending",
            "provider_product_id": price.get("product") or getattr(plan, "stripe_product_id", None),
            "provider_price_id": price.get("id") or getattr(plan, "stripe_price_id", None),
            "amount": getattr(plan, "amount", None),
            "currency": getattr(plan, "currency", None) or _currency_from_object(obj),
        }
    )
    subscription.insert(ignore_permissions=True)
    return subscription


def sync_subscription_from_stripe_object(obj: dict[str, Any], payment_event=None):
    if not doctype_exists("RBP Subscription"):
        return None

    subscription = _find_subscription(obj) or _create_subscription_from_stripe(obj)
    if not subscription:
        return None

    price = _price_from_object(obj)
    provider_subscription_id = _provider_subscription_id(obj)
    if provider_subscription_id and str(provider_subscription_id).startswith("sub_"):
        subscription.provider_subscription_id = provider_subscription_id
    subscription.provider_customer_id = _provider_customer_id(obj) or subscription.provider_customer_id
    subscription.provider_payment_id = _provider_payment_id(obj) or subscription.provider_payment_id
    subscription.provider_product_id = price.get("product") or subscription.provider_product_id
    subscription.provider_price_id = price.get("id") or subscription.provider_price_id
    subscription.billing_provider = "Stripe"

    stripe_status = obj.get("status")
    if stripe_status:
        subscription.status = STRIPE_SUBSCRIPTION_STATUS.get(str(stripe_status).lower(), subscription.status)
        subscription.payment_status = STRIPE_PAYMENT_STATUS.get(str(stripe_status).lower(), subscription.payment_status)

    if obj.get("payment_status") == "paid":
        subscription.payment_status = "Paid"
        if subscription.status in {"Draft", "Trial", "Past Due"}:
            subscription.status = "Active"

    if obj.get("current_period_start"):
        subscription.current_period_start = timestamp_to_datetime(obj.get("current_period_start"))
    if obj.get("current_period_end"):
        subscription.current_period_end = timestamp_to_datetime(obj.get("current_period_end"))
    if "cancel_at_period_end" in obj:
        subscription.cancel_at_period_end = 1 if obj.get("cancel_at_period_end") else 0
    if payment_event:
        subscription.last_payment_event = payment_event.name

    subscription.save(ignore_permissions=True)

    if subscription.status in {"Active", "Trial"} and subscription.payment_status in {"Paid", "Authorised"}:
        sync_entitlements_for_subscription(subscription, active=True)
        _notify_member(subscription, "Membership activated", "Your RBP membership is active.")
    elif subscription.status in {"Cancelled", "Suspended", "Archived"}:
        sync_entitlements_for_subscription(subscription, active=False, status="Cancelled")
        _notify_member(subscription, "Membership access updated", "Your RBP membership access has changed.")
    elif subscription.status == "Past Due":
        sync_entitlements_for_subscription(subscription, active=False, status="Suspended")
        _notify_member(subscription, "Payment failed", "Your RBP membership payment needs attention.")

    return subscription


def _notify_member(subscription, title: str, message: str) -> None:
    if not getattr(subscription, "member", None):
        return
    create_notification(
        user=subscription.member,
        title=title,
        message=message,
        tenant=getattr(subscription, "tenant", None),
        notification_type="Info",
        priority="Normal",
        route="/portal/billing",
        related_doctype="RBP Subscription",
        related_name=subscription.name,
        trigger_source="stripe",
    )


def process_stripe_webhook_event(event: Any):
    """Record and apply a verified Stripe webhook event idempotently."""

    provider_event_id = _event_get(event, "id")
    event_type = _event_get(event, "type")
    obj = _object_from_event(event)

    if not provider_event_id:
        raise frappe.ValidationError("Stripe event ID is required.")

    if frappe.db.exists("RBP Payment Event", {"provider_event_id": provider_event_id}):
        existing = frappe.get_doc(
            "RBP Payment Event",
            frappe.db.get_value("RBP Payment Event", {"provider_event_id": provider_event_id}, "name"),
        )
        return {"status": "duplicate", "payment_event": existing.name}

    subscription = _find_subscription(obj)
    status = STRIPE_EVENT_STATUS.get(event_type, "Pending")
    payload = {
        "tenant": getattr(subscription, "tenant", None) if subscription else _metadata(obj).get("rbp_tenant"),
        "user": getattr(subscription, "member", None) if subscription else _metadata(obj).get("rbp_user"),
        "related_doctype": "RBP Subscription" if subscription else None,
        "related_name": getattr(subscription, "name", None) if subscription else None,
        "payment_provider": "Stripe",
        "provider_event_id": provider_event_id,
        "provider_customer_id": _provider_customer_id(obj),
        "provider_payment_id": _provider_payment_id(obj),
        "amount": _amount_from_object(obj),
        "currency": _currency_from_object(obj),
        "status": status,
        "event_type": event_type,
        "raw_payload": _event_payload(event),
    }
    payment_event = record_payment_event(payload, user="Stripe")

    subscription = sync_subscription_from_stripe_object(obj, payment_event=payment_event)
    if subscription and not payment_event.related_name:
        payment_event.related_doctype = "RBP Subscription"
        payment_event.related_name = subscription.name
        payment_event.tenant = subscription.tenant
        payment_event.user = subscription.member
        payment_event.save(ignore_permissions=True)

    record_audit_event(
        "stripe_webhook_processed",
        actor="Stripe",
        tenant=getattr(subscription, "tenant", None) if subscription else payload.get("tenant"),
        subject_doctype="RBP Payment Event",
        subject_name=payment_event.name,
        message=f"Stripe webhook processed: {event_type}",
        metadata={"provider_event_id": provider_event_id, "subscription": getattr(subscription, "name", None)},
    )

    return {
        "status": "processed",
        "payment_event": payment_event.name,
        "subscription": getattr(subscription, "name", None),
    }
