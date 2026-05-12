"""Stripe Checkout gateway for RBP memberships."""

from __future__ import annotations

import os
from datetime import datetime
from typing import Any

import frappe
from frappe.utils import get_url

from rbp_app.permissions import require_login
from rbp_app.services.audit import record_audit_event
from rbp_app.services.tenancy import get_current_tenant_name
from rbp_app.services.environment import (
    get_stripe_mode as runtime_get_stripe_mode,
    is_stripe_enabled as runtime_is_stripe_enabled,
)


STRIPE_API_VERSION = "2026-02-25.clover"
DEFAULT_SUCCESS_URL = "/portal/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}"
DEFAULT_CANCEL_URL = "/portal/billing?checkout=cancelled"


def _conf_value(*names: str, default: Any = None) -> Any:
    for name in names:
        value = os.environ.get(name)
        if value not in (None, ""):
            return value

    conf = getattr(frappe, "conf", None)
    for name in names:
        if conf is None:
            continue
        try:
            value = getattr(conf, name, None)
            if value in (None, "") and hasattr(conf, "get"):
                value = conf.get(name)
        except Exception:
            value = None
        if value not in (None, ""):
            return value

        lower_name = name.lower()
        try:
            value = getattr(conf, lower_name, None)
            if value in (None, "") and hasattr(conf, "get"):
                value = conf.get(lower_name)
        except Exception:
            value = None
        if value not in (None, ""):
            return value

    return default


def _as_bool(value: Any, default: bool = False) -> bool:
    if value in (None, ""):
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def get_stripe_mode() -> str:
    mode = runtime_get_stripe_mode()
    if mode not in {"test", "live"}:
        raise frappe.ValidationError("RBP_STRIPE_MODE must be test or live.")
    return mode


def is_stripe_enabled() -> bool:
    return runtime_is_stripe_enabled()


def get_stripe_secret_key() -> str:
    mode = get_stripe_mode()
    key = _conf_value(
        "RBP_STRIPE_SECRET_KEY",
        f"RBP_STRIPE_{mode.upper()}_SECRET_KEY",
        "stripe_secret_key",
        f"stripe_{mode}_secret_key",
    )
    if not key:
        raise frappe.ValidationError("Stripe secret key is not configured.")
    if mode == "test" and not str(key).startswith("sk_test_"):
        raise frappe.ValidationError("Stripe test mode requires a test secret key.")
    if mode == "live" and not str(key).startswith("sk_live_"):
        raise frappe.ValidationError("Stripe live mode requires a live secret key.")
    return str(key)


def get_stripe_webhook_secret() -> str:
    secret = _conf_value(
        "RBP_STRIPE_WEBHOOK_SECRET",
        f"RBP_STRIPE_{get_stripe_mode().upper()}_WEBHOOK_SECRET",
        "stripe_webhook_secret",
    )
    if not secret:
        raise frappe.ValidationError("Stripe webhook secret is not configured.")
    return str(secret)


def get_stripe_module():
    try:
        import stripe  # type: ignore
    except ImportError as exc:
        raise frappe.ValidationError("The stripe Python package is required for Stripe checkout.") from exc

    stripe.api_key = get_stripe_secret_key()
    stripe.api_version = STRIPE_API_VERSION
    return stripe


def timestamp_to_datetime(value: Any):
    if not value:
        return None
    try:
        return datetime.utcfromtimestamp(int(value))
    except Exception:
        return None


def _get_plan(plan_code: str):
    plan_code = (plan_code or "").strip().lower()
    if not plan_code:
        raise frappe.ValidationError("Membership plan is required.")
    if not frappe.db.exists("RBP Membership Plan", plan_code):
        raise frappe.DoesNotExistError("Membership plan not found.")

    plan = frappe.get_doc("RBP Membership Plan", plan_code)
    if getattr(plan, "status", None) != "Active":
        raise frappe.ValidationError("Membership plan is not active.")
    if not getattr(plan, "stripe_price_id", None):
        raise frappe.ValidationError("Membership plan is missing a Stripe price ID.")
    return plan


def _get_user_email(user: str) -> str:
    try:
        return frappe.db.get_value("User", user, "email") or user
    except Exception:
        return user


def _absolute_url(value: str) -> str:
    if value.startswith("http://") or value.startswith("https://"):
        return value
    return get_url(value)


def _get_or_create_pending_subscription(plan, user: str, tenant: str | None):
    filters = {
        "member": user,
        "plan": plan.plan_code,
        "billing_provider": "Stripe",
        "status": ["in", ["Draft", "Trial", "Past Due"]],
    }
    if tenant:
        filters["tenant"] = tenant

    existing = frappe.get_all(
        "RBP Subscription",
        filters=filters,
        pluck="name",
        limit_page_length=1,
        order_by="modified desc",
    )
    if existing:
        subscription = frappe.get_doc("RBP Subscription", existing[0])
    else:
        subscription = frappe.get_doc(
            {
                "doctype": "RBP Subscription",
                "tenant": tenant,
                "member": user,
                "status": "Draft",
                "plan": plan.plan_code,
                "billing_cycle": plan.billing_cycle or "Monthly",
                "billing_provider": "Stripe",
                "payment_status": "Pending",
            }
        )

    subscription.provider_product_id = getattr(plan, "stripe_product_id", None)
    subscription.provider_price_id = plan.stripe_price_id
    subscription.amount = getattr(plan, "amount", None)
    subscription.currency = getattr(plan, "currency", None) or "AUD"
    subscription.billing_cycle = getattr(plan, "billing_cycle", None) or "Monthly"
    subscription.payment_status = "Pending"
    subscription.save(ignore_permissions=True) if getattr(subscription, "name", None) else subscription.insert(ignore_permissions=True)
    return subscription


def create_membership_checkout_session(
    plan_code: str,
    *,
    success_url: str | None = None,
    cancel_url: str | None = None,
    user: str | None = None,
):
    """Create a Stripe-hosted Checkout Session for a membership subscription."""

    if not is_stripe_enabled():
        raise frappe.ValidationError("Stripe checkout is disabled.")

    user = user or require_login()
    if not user or user == "Guest":
        raise frappe.PermissionError

    plan = _get_plan(plan_code)
    tenant = get_current_tenant_name(user)
    subscription = _get_or_create_pending_subscription(plan, user, tenant)
    stripe = get_stripe_module()

    metadata = {
        "rbp_subscription": subscription.name,
        "rbp_plan_code": plan.plan_code,
        "rbp_tenant": tenant or "",
        "rbp_user": user,
        "rbp_stripe_mode": get_stripe_mode(),
    }
    session = stripe.checkout.Session.create(
        mode="subscription",
        customer_email=_get_user_email(user),
        client_reference_id=subscription.name,
        line_items=[{"price": plan.stripe_price_id, "quantity": 1}],
        success_url=_absolute_url(
            success_url or _conf_value("RBP_STRIPE_SUCCESS_URL", "rbp_stripe_success_url", default=DEFAULT_SUCCESS_URL)
        ),
        cancel_url=_absolute_url(
            cancel_url or _conf_value("RBP_STRIPE_CANCEL_URL", "rbp_stripe_cancel_url", default=DEFAULT_CANCEL_URL)
        ),
        metadata=metadata,
        subscription_data={"metadata": metadata},
    )

    record_audit_event(
        "stripe_checkout_session_created",
        actor=user,
        tenant=tenant,
        subject_doctype="RBP Subscription",
        subject_name=subscription.name,
        message="Stripe checkout session created.",
        metadata={
            "checkout_session": getattr(session, "id", None) or session.get("id"),
            "plan": plan.plan_code,
            "mode": get_stripe_mode(),
        },
    )

    return {
        "checkout_session_id": getattr(session, "id", None) or session.get("id"),
        "checkout_url": getattr(session, "url", None) or session.get("url"),
        "subscription": subscription.name,
        "plan": plan.plan_code,
        "stripe_mode": get_stripe_mode(),
    }


def verify_webhook_event(payload: bytes | str, signature: str | None):
    """Verify a Stripe webhook signature and return the Stripe event object."""

    if not signature:
        raise frappe.PermissionError

    stripe = get_stripe_module()
    secret = get_stripe_webhook_secret()
    return stripe.Webhook.construct_event(payload, signature, secret)
