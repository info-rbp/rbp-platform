"""Billing APIs for the RBP portal/frontend."""

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services.billing import (
    get_subscription_status as get_subscription_status_service,
    record_payment_event as record_payment_event_service,
)


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
