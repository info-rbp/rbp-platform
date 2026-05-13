"""Notification services for the RBP platform layer."""

import frappe
try:
    from frappe.utils import now_datetime
except Exception:
    from datetime import datetime
    def now_datetime():
        return datetime.utcnow()

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



from rbp_app.services.email_notifications import (
    admin_notification_recipients,
    as_dict_rows,
    send_event_email,
)


def _is_email(value: str | None) -> bool:
    return bool(value and "@" in value and "." in value)


def _record_delivery_logs(notification_name, deliveries, related_doctype=None, related_name=None):
    if not _doctype_exists("RBP Notification Delivery"):
        return
    for row in deliveries:
        try:
            frappe.get_doc({"doctype":"RBP Notification Delivery","notification":notification_name,"channel":"Email","recipient_email":row.get("recipient_email"),"status":row.get("status"),"provider_message_id":row.get("provider_message_id"),"error_message":row.get("error_message"),"sandboxed":1 if row.get("sandboxed") else 0,"related_doctype":related_doctype,"related_name":related_name}).insert(ignore_permissions=True)
        except Exception:
            frappe.log_error(frappe.get_traceback(), "RBP notification delivery log failed")


def emit_event_notification(*,event_type:str,user:str|None=None,tenant:str|None=None,subject:str|None=None,message:str|None=None,related_doctype:str|None=None,related_name:str|None=None,metadata:dict|None=None,customer_email:str|None=None,admin_recipients=None,context:dict|None=None,send_email:bool=True):
    from rbp_app.services.notification_triggers import get_trigger
    metadata = metadata or {}
    context = {**metadata, **(context or {})}
    context.setdefault("message", message or f"Event {event_type} occurred.")
    context.setdefault("reference_id", context.get("reference_id") or related_name)
    context.setdefault("portal_url", "/portal/dashboard")
    try:
        trigger = get_trigger(event_type)
    except Exception:
        frappe.log_error(f"Unknown notification trigger: {event_type}", "RBP notification trigger")
        return {"ok":False,"event_type":event_type,"portal":None,"email":"failed","deliveries":[],"metadata":metadata,"reason":"unknown_trigger"}
    portal_doc=None
    try:
        portal_doc=create_notification(user=user,tenant=tenant,title=subject or trigger.default_subject,message=context["message"],delivery_channel="Portal",related_doctype=related_doctype,related_name=related_name,trigger_source=event_type,created_by_workflow=trigger.template_key)
    except Exception:
        frappe.log_error(frappe.get_traceback(), "RBP notification portal delivery failed")
    deliveries=[]
    if send_email:
        recipients=[]
        if trigger.customer_enabled:
            c = customer_email or (user if _is_email(user) else None)
            if c: recipients.append(c)
        if trigger.admin_enabled:
            recipients.extend(list(admin_recipients or admin_notification_recipients()))
        recipients=list(dict.fromkeys([r for r in recipients if r]))
        deliveries=as_dict_rows(send_event_email(event_type=event_type, recipients=recipients, context=context, subject=subject))
    summary="not_requested" if not send_email else ("disabled" if deliveries and all(d["status"]=="disabled" for d in deliveries) else "blocked" if deliveries and all(d["status"]=="blocked" for d in deliveries) else "failed" if any(d["status"]=="failed" for d in deliveries) else "sent" if deliveries and all(d["status"]=="sent" for d in deliveries) else "partial")
    _record_delivery_logs(getattr(portal_doc,"name",None), deliveries, related_doctype, related_name)
    return {"ok":True,"event_type":event_type,"portal":getattr(portal_doc,"name",None),"email":summary,"deliveries":deliveries,"metadata":metadata}
