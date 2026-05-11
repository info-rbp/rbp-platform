"""Tenant-aware file reference services for RBP platform records."""

from urllib.parse import quote

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


def _normalise_visibility(value):
    return (value or "").strip().lower().replace(" ", "_").replace("-", "_")


def _file_metadata(file_name):
    if not file_name:
        return {}
    try:
        file_doc = frappe.get_doc("File", file_name)
    except Exception:
        return {}

    filename = getattr(file_doc, "file_name", None) or getattr(file_doc, "file_url", None) or file_name
    extension = ""
    if filename and "." in filename:
        extension = filename.rsplit(".", 1)[-1].lower()

    return {
        "file_name": filename,
        "file_url": getattr(file_doc, "file_url", None),
        "is_private": bool(getattr(file_doc, "is_private", None)),
        "file_size": getattr(file_doc, "file_size", None),
        "extension": extension,
        "mime": getattr(file_doc, "content_hash", None),
    }


def serialize_file_reference(row, user=None):
    """Return the portal document DTO without leaking private URLs."""

    user = user or frappe.session.user
    file_meta = _file_metadata(row.get("file"))
    visibility = row.get("visibility")
    is_private = file_meta.get("is_private")
    can_download = can_access_file_reference(row.get("name"), user=user)
    title = row.get("title") or file_meta.get("file_name") or row.get("file") or row.get("name")

    return {
        "name": row.get("name"),
        "title": title,
        "file_name": file_meta.get("file_name") or row.get("file"),
        "file_type": row.get("file_type"),
        "related_doctype": row.get("related_doctype"),
        "related_name": row.get("related_name"),
        "related_label": row.get("related_doctype"),
        "visibility": _normalise_visibility(visibility),
        "status": row.get("status"),
        "uploaded_by": row.get("uploaded_by"),
        "uploaded_on": row.get("uploaded_on"),
        "modified": row.get("modified"),
        "download_allowed": can_download,
        "preview_allowed": can_download and not is_private,
        "file_size": file_meta.get("file_size"),
        "extension": file_meta.get("extension"),
        "mime": file_meta.get("mime"),
    }


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
        rows = frappe.get_all(
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
        return [serialize_file_reference(row, user=user) for row in rows if can_access_file_reference(row.get("name"), user=user)]
    except Exception:
        return []


def get_file_reference(name, user=None):
    user = user or frappe.session.user
    if not can_access_file_reference(name, user=user):
        raise frappe.PermissionError
    row = frappe.get_value(
        "RBP File Reference",
        name,
        [
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
        as_dict=True,
    )
    if not row:
        raise frappe.DoesNotExistError
    return serialize_file_reference(row, user=user)


def get_file_reference_download_url(name, user=None):
    user = user or frappe.session.user
    if not can_access_file_reference(name, user=user):
        raise frappe.PermissionError

    reference = frappe.get_doc("RBP File Reference", name)
    file_doc = frappe.get_doc("File", reference.file)
    if getattr(file_doc, "is_private", None):
        return {
            "name": name,
            "download_url": f"/api/method/frappe.utils.file_manager.download_file?file_url={quote(getattr(file_doc, 'file_url', '') or '')}",
            "private": True,
        }

    return {
        "name": name,
        "download_url": getattr(file_doc, "file_url", None),
        "private": False,
    }
