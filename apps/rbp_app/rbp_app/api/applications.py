"""Application interest APIs for register-only app rollout."""

from __future__ import annotations

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services.notifications import emit_event_notification
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


INTEREST_DOCTYPE = "RBP Application Interest"
INTEREST_STATUSES = {"Received", "In Review", "Waitlisted", "Contacted", "Closed"}


def _is_email(value: str | None) -> bool:
    return bool(value and "@" in value)


def _serialize(doc):
    return {
        "name": doc.name,
        "application_name": getattr(doc, "application_name", None),
        "application_key": getattr(doc, "application_key", None),
        "status": getattr(doc, "status", None),
        "business_name": getattr(doc, "business_name", None),
        "creation": getattr(doc, "creation", None),
    }


def _emit_interest_notification(
    doc,
    *,
    event_type: str,
    message: str,
    status: str,
    admin_note: str | None = None,
):
    try:
        emit_event_notification(
            event_type=event_type,
            user=getattr(doc, "user", None),
            tenant=getattr(doc, "tenant", None),
            customer_email=getattr(doc, "customer_email", None),
            related_doctype=INTEREST_DOCTYPE,
            related_name=doc.name,
            message=message,
            context={
                "reference_id": doc.name,
                "application_name": getattr(doc, "application_name", None),
                "business_name": getattr(doc, "business_name", None),
                "status": status,
                "admin_note": admin_note,
                "portal_url": "/portal/apps",
            },
        )
    except Exception:
        frappe.log_error(frappe.get_traceback(), "RBP application interest notification hook failed")


@frappe.whitelist()
def submit_application_interest(
    application_name: str,
    application_key: str | None = None,
    business_name: str | None = None,
    notes: str | None = None,
):
    user = require_login()
    if not application_name:
        raise frappe.ValidationError("Application name is required.")
    if not doctype_exists(INTEREST_DOCTYPE):
        raise frappe.DoesNotExistError

    doc = frappe.get_doc(
        {
            "doctype": INTEREST_DOCTYPE,
            "tenant": get_current_tenant_name(user),
            "user": user,
            "customer_email": user if _is_email(user) else None,
            "business_name": business_name,
            "application_name": application_name,
            "application_key": application_key,
            "status": "Received",
            "notes": notes,
            "source": "portal",
        }
    )
    doc.insert(ignore_permissions=False)
    _emit_interest_notification(
        doc,
        event_type="application.interest_submitted",
        message="Your application interest has been received.",
        status="Received",
    )
    return _serialize(doc)


@frappe.whitelist()
def admin_update_application_interest_status(name: str, status: str, notes: str | None = None):
    require_system_manager()
    if status not in INTEREST_STATUSES:
        raise frappe.ValidationError("Invalid application interest status.")
    if not doctype_exists(INTEREST_DOCTYPE):
        raise frappe.DoesNotExistError

    doc = frappe.get_doc(INTEREST_DOCTYPE, name)
    doc.status = status
    if notes is not None:
        doc.notes = notes
    doc.save(ignore_permissions=True)
    _emit_interest_notification(
        doc,
        event_type="admin.status_updated",
        message=f"Your application interest is now {status}.",
        status=status,
        admin_note=notes,
    )
    return _serialize(doc)
