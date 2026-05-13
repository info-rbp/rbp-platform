"""Notification services for the RBP platform layer."""

import frappe
from frappe.utils import now_datetime

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.environment import get_runtime_settings
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
    runtime = get_runtime_settings()
    if not _doctype_exists("RBP Notification"):
        return None

    tenant = tenant or get_current_tenant_name(user)
    if not runtime.enable_email_notifications and delivery_channel == "Email":
        delivery_channel = "Portal"
    if runtime.email_sandbox_mode and delivery_channel == "Email":
        delivery_channel = "Portal"

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

    runtime = get_runtime_settings()
    if not user or user == "Guest" or not _doctype_exists("RBP Notification"):
        return {
            "notifications": [],
            "unread_count": 0,
            "email_notifications_enabled": runtime.enable_email_notifications,
            "email_sandbox_mode": runtime.email_sandbox_mode,
            "email_delivery_mode": runtime.email_delivery_mode,
        }

    filters = {"user": user, "status": ["!=", "Archived"]}

    try:
        notifications = frappe.get_all(
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
                "modified",
            ],
            order_by="is_read asc, modified desc",
            limit_page_length=20,
        )
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
        "email_notifications_enabled": runtime.enable_email_notifications,
        "email_sandbox_mode": runtime.email_sandbox_mode,
        "email_delivery_mode": runtime.email_delivery_mode,
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


def emit_event_notification(
    *,
    event_type: str,
    user: str | None = None,
    tenant: str | None = None,
    subject: str | None = None,
    message: str | None = None,
    related_doctype: str | None = None,
    related_name: str | None = None,
    metadata: dict | None = None,
):
    """Best-effort backend-owned notification hook for Milestone 9 events."""

    from rbp_app.services.notification_triggers import get_trigger

    try:
        trigger = get_trigger(event_type)
    except Exception:
        frappe.log_error(f"Unknown notification trigger: {event_type}", "RBP notification trigger")
        return {"ok": False, "reason": "unknown_trigger"}

    title = subject or trigger.default_subject
    body = message or f"Event {event_type} occurred."

    try:
        portal_doc = create_notification(
            user=user,
            tenant=tenant,
            title=title,
            message=body,
            delivery_channel="Portal",
            related_doctype=related_doctype,
            related_name=related_name,
            trigger_source=event_type,
            created_by_workflow=trigger.template_key,
        )
    except Exception:
        frappe.log_error(frappe.get_traceback(), "RBP notification portal delivery failed")
        portal_doc = None

    runtime = get_runtime_settings()
    email_result = "disabled"

    if runtime.enable_email_notifications and trigger.customer_enabled and user:
        email_recipient = user
        sandbox_recipient = getattr(getattr(frappe, "conf", {}), "get", lambda *_: None)("rbp_email_sandbox_recipient")
        if runtime.email_sandbox_mode and sandbox_recipient:
            email_recipient = sandbox_recipient
            email_result = "sandbox"

        if runtime.email_sandbox_mode and not sandbox_recipient:
            email_result = "sandbox_no_recipient"
        else:
            try:
                frappe.sendmail(
                    recipients=[email_recipient],
                    subject=title,
                    message=body,
                    delayed=False,
                )
                email_result = "sent"
            except Exception:
                frappe.log_error(frappe.get_traceback(), "RBP notification email send failed")
                email_result = "failed"

    return {"ok": True, "portal": getattr(portal_doc, "name", None), "email": email_result, "metadata": metadata or {}}
