"""Notification APIs for the RBP portal/frontend."""

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.notifications import (
    get_unread_count as get_unread_count_service,
    get_notifications as get_notifications_service,
    mark_all_notifications_read as mark_all_notifications_read_service,
    mark_notification_read as mark_notification_read_service,
)


@frappe.whitelist()
def get_notifications():
    """Return portal notifications for the current user."""

    user = require_login()
    return get_notifications_service(user)


@frappe.whitelist()
def list_my_notifications(filters=None):
    """Return portal notifications for the current user."""

    user = require_login()
    payload = {}
    # Filters are accepted for forward compatibility; current service enforces user visibility.
    if filters:
        payload = filters
    data = get_notifications_service(user)
    notifications = data.get("notifications", [])
    if isinstance(payload, str):
        import json

        payload = json.loads(payload or "{}")
    if payload.get("is_read") in (0, 1, True, False):
        wanted = bool(payload.get("is_read"))
        notifications = [item for item in notifications if bool(item.get("is_read")) == wanted]
    if payload.get("priority"):
        notifications = [item for item in notifications if item.get("priority") == payload.get("priority")]
    if payload.get("notification_type"):
        notifications = [item for item in notifications if item.get("notification_type") == payload.get("notification_type")]
    return {"notifications": notifications, "unread_count": data.get("unread_count", 0), "count": len(notifications)}


@frappe.whitelist()
def get_unread_count():
    """Return unread notification count for the current user."""

    user = require_login()
    return get_unread_count_service(user)


@frappe.whitelist()
def mark_notification_read(name):
    """Mark a single notification as read."""

    user = require_login()
    return mark_notification_read_service(name, user)


@frappe.whitelist()
def mark_all_notifications_read():
    """Mark all current-user notifications as read."""

    user = require_login()
    return mark_all_notifications_read_service(user)
