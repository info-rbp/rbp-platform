"""Tenant-aware file reference services for RBP platform records."""

import frappe

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


def create_file_reference(
    *,
    file,
    user=None,
    tenant=None,
    related_doctype=None,
    related_name=None,
    visibility="Private To Owner",
    file_type=None,
    notes=None,
):
    user = user or frappe.session.user
    tenant = tenant or get_current_tenant_name(user)

    if not doctype_exists("RBP File Reference"):
        raise frappe.ValidationError("RBP File Reference is not installed.")

    doc = frappe.get_doc(
        {
            "doctype": "RBP File Reference",
            "tenant": tenant,
            "owner_user": user,
            "related_doctype": related_doctype,
            "related_name": related_name,
            "file": file,
            "file_type": file_type,
            "visibility": visibility or "Private To Owner",
            "uploaded_by": user,
            "status": "Active",
            "notes": notes,
        }
    )
    doc.insert(ignore_permissions=True)

    record_audit_event(
        "file_reference_created",
        actor=user,
        tenant=tenant,
        subject_doctype=related_doctype or "RBP File Reference",
        subject_name=related_name or doc.name,
        message="File reference created.",
        metadata={"file_reference": doc.name, "file": file, "visibility": visibility},
    )

    return doc


def can_access_file_reference(name, user=None):
    user = user or frappe.session.user
    if is_admin_user(user):
        return True

    if not doctype_exists("RBP File Reference"):
        return False

    doc = frappe.get_doc("RBP File Reference", name)

    if doc.visibility == "Public":
        return True

    if doc.owner_user == user or doc.uploaded_by == user:
        return True

    user_tenant = get_current_tenant_name(user)
    if doc.visibility in {"Tenant Visible", "Advisor Visible"} and doc.tenant and doc.tenant == user_tenant:
        return True

    return False


def list_file_references(user=None, related_doctype=None, related_name=None):
    user = user or frappe.session.user
    if not doctype_exists("RBP File Reference"):
        return []

    filters = {"status": ["!=", "Archived"]}
    if related_doctype:
        filters["related_doctype"] = related_doctype
    if related_name:
        filters["related_name"] = related_name

    if not is_admin_user(user):
        tenant = get_current_tenant_name(user)
        if tenant:
            filters["tenant"] = tenant
        else:
            filters["owner_user"] = user

    try:
        return frappe.get_all(
            "RBP File Reference",
            filters=filters,
            fields=[
                "name",
                "tenant",
                "owner_user",
                "related_doctype",
                "related_name",
                "file",
                "file_type",
                "visibility",
                "uploaded_by",
                "uploaded_on",
                "status",
                "modified",
            ],
            order_by="modified desc",
            limit_page_length=100,
        )
    except Exception:
        return []
