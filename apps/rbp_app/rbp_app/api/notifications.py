"""Notification APIs for the RBP portal/frontend."""

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.notifications import (
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
def mark_notification_read(name):
    """Mark a single notification as read."""

    user = require_login()
    return mark_notification_read_service(name, user)


@frappe.whitelist()
def mark_all_notifications_read():
    """Mark all current-user notifications as read."""

    user = require_login()
    return mark_all_notifications_read_service(user)
