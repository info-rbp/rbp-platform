"""Notification services for the RBP platform layer."""

import frappe
from frappe.utils import now_datetime

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


def _doctype_exists(doctype):
    return doctype_exists(doctype)


def create_notification(
    *,
    user,
    title,
    message=None,
    tenant=None,
    notification_type="Info",
    priority="Normal",
    delivery_channel="Portal",
    route=None,
    related_doctype=None,
    related_name=None,
    trigger_source=None,
    created_by_workflow=None,
):
    if not _doctype_exists("RBP Notification"):
        return None

    tenant = tenant or get_current_tenant_name(user)

    doc = frappe.get_doc(
        {
            "doctype": "RBP Notification",
            "tenant": tenant,
            "user": user,
            "title": title,
            "message": message,
            "notification_type": notification_type or "Info",
            "priority": priority or "Normal",
            "delivery_channel": delivery_channel or "Portal",
            "route": route,
            "related_doctype": related_doctype,
            "related_name": related_name,
            "trigger_source": trigger_source,
            "created_by_workflow": created_by_workflow,
            "status": "Unread",
            "is_read": 0,
        }
    )
    doc.insert(ignore_permissions=True)

    record_audit_event(
        "notification_created",
        actor=frappe.session.user,
        tenant=tenant,
        subject_doctype=related_doctype or "RBP Notification",
        subject_name=related_name or doc.name,
        message="Notification created.",
        metadata={"notification": doc.name, "recipient": user, "title": title},
    )

    return doc


def get_notifications(user=None):
    """Return portal notifications for a user."""

    if not user or user == "Guest" or not _doctype_exists("RBP Notification"):
        return {
            "notifications": [],
            "unread_count": 0,
        }

    filters = {"user": user, "status": ["!=", "Archived"]}

    try:
        rows = frappe.get_all(
            "RBP Notification",
            filters=filters,
            fields=[
                "name",
                "tenant",
                "title",
                "message",
                "notification_type",
                "priority",
                "delivery_channel",
                "route",
                "related_doctype",
                "related_name",
                "trigger_source",
                "created_by_workflow",
                "status",
                "is_read",
                "read_on",
                "creation",
                "modified",
            ],
            order_by="is_read asc, modified desc",
            limit_page_length=20,
        )
        notifications = [_serialize_notification(row) for row in rows]
        unread_count = frappe.db.count(
            "RBP Notification",
            {"user": user, "is_read": 0, "status": ["!=", "Archived"]},
        )
    except Exception:
        notifications = []
        unread_count = 0

    return {
        "notifications": notifications,
        "unread_count": unread_count,
    }


def _serialize_notification(row):
    return {
        "name": row.get("name"),
        "title": row.get("title"),
        "message": row.get("message"),
        "notification_type": row.get("notification_type"),
        "status": row.get("status"),
        "is_read": bool(row.get("is_read")),
        "related_doctype": row.get("related_doctype"),
        "related_name": row.get("related_name"),
        "related_route": row.get("route"),
        "route": row.get("route"),
        "priority": row.get("priority"),
        "created_on": row.get("creation") or row.get("modified"),
        "read_on": row.get("read_on"),
        "actor": row.get("trigger_source") or row.get("created_by_workflow"),
    }


def get_unread_count(user=None):
    user = user or frappe.session.user
    if not user or user == "Guest" or not _doctype_exists("RBP Notification"):
        return {"unread_count": 0}
    return {
        "unread_count": frappe.db.count(
            "RBP Notification",
            {"user": user, "is_read": 0, "status": ["!=", "Archived"]},
        )
    }


def mark_notification_read(name, user=None):
    user = user or frappe.session.user

    if not _doctype_exists("RBP Notification"):
        raise frappe.DoesNotExistError

    doc = frappe.get_doc("RBP Notification", name)
    if doc.user != user and not is_admin_user(user):
        raise frappe.PermissionError

    doc.is_read = 1
    doc.status = "Read"
    doc.read_on = now_datetime()
    doc.save(ignore_permissions=True)

    return {
        "name": doc.name,
        "is_read": doc.is_read,
        "status": doc.status,
        "read_on": doc.read_on,
    }


def mark_all_notifications_read(user=None):
    user = user or frappe.session.user

    if not user or user == "Guest" or not _doctype_exists("RBP Notification"):
        return {"updated": 0}

    names = frappe.get_all(
        "RBP Notification",
        filters={"user": user, "is_read": 0, "status": ["!=", "Archived"]},
        pluck="name",
    )

    for name in names:
        frappe.db.set_value(
            "RBP Notification",
            name,
            {
                "is_read": 1,
                "status": "Read",
                "read_on": now_datetime(),
            },
            update_modified=True,
        )

    return {"updated": len(names)}


def get_notifications_payload():
    """Backward-compatible alias for the notification payload."""

    return get_notifications()
