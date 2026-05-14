"""Application interest APIs for register-only app rollout."""

from __future__ import annotations

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services.environment import (
    is_application_interest_enabled,
    is_application_provisioning_enabled,
)
from rbp_app.services.notifications import emit_event_notification
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


INTEREST_DOCTYPE = "RBP Application Interest"
APPLICATION_DOCTYPE = "RBP Application"
INTEREST_STATUSES = {"Received", "In Review", "Waitlisted", "Contacted", "Closed"}
FALLBACK_APPLICATIONS = [
    ("erpnext", "ERPNext", "Operations & Finance"),
    ("crm", "CRM", "Sales & Customer"),
    ("hrms", "HRMS", "People Operations"),
    ("helpdesk", "Helpdesk", "Support"),
    ("drive", "Drive", "Documents"),
    ("lms", "LMS", "Learning"),
    ("payments", "Payments", "Payments & Billing"),
    ("builder", "Builder", "Websites"),
    ("insights", "Insights", "Reporting"),
]


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


def _serialize_application(doc):
    provisioning_enabled = bool(getattr(doc, "provisioning_enabled", 0)) and is_application_provisioning_enabled()
    return {
        "name": getattr(doc, "name", None),
        "application_name": getattr(doc, "application_name", None),
        "application_key": getattr(doc, "application_key", None),
        "category": getattr(doc, "category", None),
        "short_description": getattr(doc, "short_description", None),
        "public_description": getattr(doc, "public_description", None),
        "portal_description": getattr(doc, "portal_description", None),
        "icon": getattr(doc, "icon", None),
        "status": getattr(doc, "status", None),
        "visibility": getattr(doc, "visibility", None),
        "interest_enabled": bool(getattr(doc, "interest_enabled", 1)) and is_application_interest_enabled(),
        "provisioning_enabled": provisioning_enabled,
        "public_cta_label": getattr(doc, "public_cta_label", None) or "Register interest",
        "portal_cta_label": getattr(doc, "portal_cta_label", None) or "Register interest",
    }


def _fallback_applications(visibility: str):
    return [
        {
            "name": key,
            "application_name": name,
            "application_key": key,
            "category": category,
            "short_description": f"{name} is planned for the RBP application rollout.",
            "public_description": "Coming soon. Register interest to be notified when this application is ready.",
            "portal_description": "Next rollout. Register interest and the RBP team will keep you updated.",
            "icon": None,
            "status": "Register Interest",
            "visibility": visibility,
            "interest_enabled": is_application_interest_enabled(),
            "provisioning_enabled": False,
            "public_cta_label": "Register interest",
            "portal_cta_label": "Register interest",
        }
        for key, name, category in FALLBACK_APPLICATIONS
    ]


def _list_applications(visibility_values: list[str], fallback_visibility: str):
    if not doctype_exists(APPLICATION_DOCTYPE):
        return _fallback_applications(fallback_visibility)

    try:
        if frappe.db.count(APPLICATION_DOCTYPE) <= 0:
            return _fallback_applications(fallback_visibility)
    except Exception:
        return _fallback_applications(fallback_visibility)

    rows = frappe.get_all(
        APPLICATION_DOCTYPE,
        filters={
            "visibility": ["in", visibility_values],
            "status": ["!=", "disabled"],
        },
        fields=[
            "name",
            "application_name",
            "application_key",
            "category",
            "short_description",
            "public_description",
            "portal_description",
            "icon",
            "status",
            "visibility",
            "interest_enabled",
            "provisioning_enabled",
            "public_cta_label",
            "portal_cta_label",
            "sort_order",
        ],
        order_by="sort_order asc, application_name asc",
    )
    return [_serialize_application(frappe._dict(row)) for row in rows]


def _application_name_for_key(application_key: str | None) -> str:
    if application_key and doctype_exists(APPLICATION_DOCTYPE):
        name = frappe.db.get_value(APPLICATION_DOCTYPE, {"application_key": application_key}, "application_name")
        if name:
            return name

    for key, name, _category in FALLBACK_APPLICATIONS:
        if key == application_key:
            return name

    return application_key or "Application"


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


@frappe.whitelist(allow_guest=True)
def list_public_applications():
    return _list_applications(["public", "Public", "Public and Portal"], "Public")


@frappe.whitelist()
def list_portal_applications():
    require_login()
    return _list_applications(["portal", "public", "Portal", "Public", "Public and Portal"], "Portal")


@frappe.whitelist(allow_guest=True)
def register_application_interest(
    application_key: str,
    email: str | None = None,
    phone: str | None = None,
    interest_notes: str | None = None,
    source_channel: str | None = None,
):
    if not is_application_interest_enabled():
        raise frappe.PermissionError
    if not application_key:
        raise frappe.ValidationError("Application key is required.")
    return submit_application_interest(
        application_name=_application_name_for_key(application_key),
        application_key=application_key,
        business_name=None,
        notes=interest_notes,
        email=email,
        source=source_channel or "applications",
    )


@frappe.whitelist()
def submit_application_interest(
    application_name: str,
    application_key: str | None = None,
    business_name: str | None = None,
    notes: str | None = None,
    email: str | None = None,
    source: str | None = None,
):
    user = frappe.session.user
    if user == "Guest" and not email:
        raise frappe.ValidationError("Email is required to register application interest.")
    if user != "Guest":
        user = require_login()
    if not application_name:
        raise frappe.ValidationError("Application name is required.")
    if not doctype_exists(INTEREST_DOCTYPE):
        raise frappe.DoesNotExistError

    doc = frappe.get_doc(
        {
            "doctype": INTEREST_DOCTYPE,
            "tenant": None if user == "Guest" else get_current_tenant_name(user),
            "user": user,
            "customer_email": email or (user if _is_email(user) else None),
            "business_name": business_name,
            "application_name": application_name,
            "application_key": application_key,
            "status": "Received",
            "notes": notes,
            "source": source or "portal",
        }
    )
    doc.insert(ignore_permissions=True)
    _emit_interest_notification(
        doc,
        event_type="application.interest_submitted",
        message="Your application interest has been received.",
        status="Received",
    )
    return {"ok": True, "interest_id": doc.name, "application": application_key or application_name, **_serialize(doc)}


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
