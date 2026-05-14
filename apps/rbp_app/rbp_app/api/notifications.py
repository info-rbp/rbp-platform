from __future__ import annotations

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.notification_triggers import list_notification_triggers
from rbp_app.services.notifications import (
    emit_event_notification,
    get_notifications as get_notifications_service,
    mark_all_notifications_read as mark_all_notifications_read_service,
    mark_notification_read as mark_notification_read_service,
)
from rbp_app.services.tenancy import doctype_exists


def _require_system_manager():
    if "System Manager" not in frappe.get_roles():
        frappe.throw("Not permitted", frappe.PermissionError)


def _limit(value) -> int:
    try:
        return max(1, min(int(value or 50), 200))
    except Exception:
        return 50


@frappe.whitelist()
def get_notifications():
    user = require_login()
    return get_notifications_service(user)


@frappe.whitelist()
def mark_notification_read(name: str):
    user = require_login()
    return mark_notification_read_service(name, user=user)


@frappe.whitelist()
def mark_all_notifications_read():
    user = require_login()
    return mark_all_notifications_read_service(user=user)


@frappe.whitelist()
def list_triggers():
    return {"triggers": list_notification_triggers()}


@frappe.whitelist()
def send_test_notification(event_type: str = "account.created", recipient_email: str | None = None):
    _require_system_manager()
    return emit_event_notification(
        event_type=event_type,
        user=frappe.session.user,
        customer_email=recipient_email or frappe.session.user,
        related_name="RBP-QA-NOTIFICATION",
        context={
            "customer_name": "QA Tester",
            "business_name": "Remote Business Partner QA",
            "reference_id": "RBP-QA-NOTIFICATION",
            "portal_url": "/portal/dashboard",
            "status": "qa-test",
        },
    )


@frappe.whitelist()
def admin_list_notification_events(limit: int = 50):
    _require_system_manager()
    if not doctype_exists("RBP Notification"):
        return {"events": [], "deliveries": []}

    row_limit = _limit(limit)
    events = frappe.get_all(
        "RBP Notification",
        fields=[
            "name",
            "creation",
            "modified",
            "user",
            "tenant",
            "title",
            "status",
            "delivery_channel",
            "related_doctype",
            "related_name",
            "trigger_source",
            "created_by_workflow",
        ],
        order_by="modified desc",
        limit_page_length=row_limit,
    )

    deliveries = []
    if doctype_exists("RBP Notification Delivery"):
        deliveries = frappe.get_all(
            "RBP Notification Delivery",
            fields=["notification", "status", "channel"],
            order_by="creation desc",
            limit_page_length=row_limit,
        )
    return {"events": events, "deliveries": deliveries}


@frappe.whitelist()
def admin_list_notification_deliveries(limit: int = 50):
    _require_system_manager()
    if not doctype_exists("RBP Notification Delivery"):
        return {"deliveries": []}

    deliveries = frappe.get_all(
        "RBP Notification Delivery",
        fields=[
            "name",
            "creation",
            "modified",
            "notification",
            "event_type",
            "channel",
            "recipient_email",
            "status",
            "provider_message_id",
            "error_message",
            "sandboxed",
            "related_doctype",
            "related_name",
            "sent_on",
        ],
        order_by="creation desc",
        limit_page_length=_limit(limit),
    )
    return {"deliveries": deliveries}
