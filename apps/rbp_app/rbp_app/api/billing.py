"""Billing APIs for the RBP portal/frontend."""

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services.billing import (
    get_subscription_status as get_subscription_status_service,
    record_payment_event as record_payment_event_service,
)
from rbp_app.services.stripe_gateway import create_membership_checkout_session as create_checkout_session_service


@frappe.whitelist()
def get_subscription_status():
    """Return the current user's subscription status or a safe placeholder."""

    user = require_login()
    return get_subscription_status_service(user)


@frappe.whitelist()
def record_payment_event(payload=None):
    """Record a manual/admin payment event.

    Live provider webhooks should get a dedicated signed webhook endpoint later.
    """

    user = require_system_manager()
    event = record_payment_event_service(payload or {}, user=user)
    return {
        "name": event.name,
        "status": event.status,
        "provider_event_id": event.provider_event_id,
        "related_doctype": event.related_doctype,
        "related_name": event.related_name,
    }


@frappe.whitelist()
def create_membership_checkout_session(plan_code=None, success_url=None, cancel_url=None):
    """Create a Stripe Checkout Session for the logged-in user's membership plan."""

    user = require_login()
    return create_checkout_session_service(
        plan_code,
        success_url=success_url,
        cancel_url=cancel_url,
        user=user,
    )
