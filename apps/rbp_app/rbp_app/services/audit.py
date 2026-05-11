"""Audit logging services for RBP platform operations."""

import json
import uuid

import frappe

from rbp_app.permissions import is_admin_user
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


AUDIT_VISIBLE_DOCTYPES = {
    "RBP Decision Desk Request",
    "RBP DocuShare Document",
    "RBP Connectivity Request",
    "RBP Risk Advisor Assessment",
    "RBP Fixer Case",
    "RBP Marketplace Listing",
    "RBP Marketplace Order",
    "RBP Onboarding Flow",
    "RBP Subscription",
}


def _request_meta():
    request = getattr(frappe.local, "request", None)
    if not request:
        return None, None

    ip_address = getattr(request, "remote_addr", None)
    user_agent = None

    try:
        user_agent = request.headers.get("User-Agent")
    except Exception:
        user_agent = None

    return ip_address, user_agent


def record_audit_event(
    event_type,
    *,
    actor=None,
    tenant=None,
    subject_doctype=None,
    subject_name=None,
    workflow_state=None,
    message=None,
    metadata=None,
    severity="Info",
    request_id=None,
):
    """Create an append-only audit record if the DocType exists."""

    if not doctype_exists("RBP Audit Log"):
        return None

    actor = actor or getattr(frappe.session, "user", None)
    tenant = tenant or get_current_tenant_name(actor)
    request_id = request_id or str(uuid.uuid4())
    ip_address, user_agent = _request_meta()

    doc = frappe.get_doc(
        {
            "doctype": "RBP Audit Log",
            "tenant": tenant,
            "event_type": event_type,
            "actor": actor,
            "subject_doctype": subject_doctype,
            "subject_name": subject_name,
            "workflow_state": workflow_state,
            "request_id": request_id,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "message": message,
            "metadata_json": json.dumps(metadata or {}, default=str),
            "severity": severity or "Info",
        }
    )
    doc.insert(ignore_permissions=True)
    return doc


def _decode_metadata(value):
    if not value:
        return {}
    try:
        return json.loads(value)
    except Exception:
        return {}


def _serialize_audit(row, *, admin=False):
    dto = {
        "name": row.get("name"),
        "event_type": row.get("event_type"),
        "action": row.get("event_type"),
        "actor": row.get("actor"),
        "actor_label": row.get("actor"),
        "target_doctype": row.get("subject_doctype"),
        "target_name": row.get("subject_name"),
        "tenant": row.get("tenant"),
        "timestamp": row.get("creation"),
        "summary": row.get("message"),
        "metadata": _decode_metadata(row.get("metadata_json")),
        "workflow_state": row.get("workflow_state"),
        "severity": row.get("severity"),
    }
    if admin:
        dto["internal_notes"] = row.get("message")
    return dto


def _audit_fields():
    return [
        "name",
        "tenant",
        "event_type",
        "actor",
        "subject_doctype",
        "subject_name",
        "workflow_state",
        "message",
        "metadata_json",
        "severity",
        "creation",
    ]


def _require_audit_doctype():
    if not doctype_exists("RBP Audit Log"):
        raise frappe.DoesNotExistError


def list_audit_logs(filters=None, user=None):
    """Return admin-visible audit log records."""

    if not is_admin_user(user):
        raise frappe.PermissionError
    _require_audit_doctype()

    filters = filters or {}
    frappe_filters = {}
    if filters.get("event_type"):
        frappe_filters["event_type"] = filters["event_type"]
    if filters.get("actor"):
        frappe_filters["actor"] = filters["actor"]
    if filters.get("target_doctype"):
        frappe_filters["subject_doctype"] = filters["target_doctype"]
    if filters.get("from_date") and filters.get("to_date"):
        frappe_filters["creation"] = ["between", [filters["from_date"], filters["to_date"]]]
    elif filters.get("from_date"):
        frappe_filters["creation"] = [">=", filters["from_date"]]
    elif filters.get("to_date"):
        frappe_filters["creation"] = ["<=", filters["to_date"]]

    rows = frappe.get_all(
        "RBP Audit Log",
        fields=_audit_fields(),
        filters=frappe_filters,
        order_by="creation desc",
        limit_page_length=int(filters.get("limit") or 50),
    )
    search = (filters.get("search") or "").lower()
    if search:
        rows = [
            row
            for row in rows
            if search in " ".join(str(row.get(field) or "") for field in ("event_type", "actor", "subject_doctype", "subject_name", "message")).lower()
        ]
    return {"audit_logs": [_serialize_audit(row, admin=True) for row in rows], "count": len(rows)}


def get_audit_log(name, user=None):
    if not is_admin_user(user):
        raise frappe.PermissionError
    _require_audit_doctype()
    doc = frappe.get_doc("RBP Audit Log", name)
    row = {field: getattr(doc, field, None) for field in _audit_fields()}
    return _serialize_audit(row, admin=True)


def list_record_audit_trail(doctype, name, user=None):
    if not is_admin_user(user):
        raise frappe.PermissionError
    _require_audit_doctype()
    rows = frappe.get_all(
        "RBP Audit Log",
        fields=_audit_fields(),
        filters={"subject_doctype": doctype, "subject_name": name},
        order_by="creation asc",
        limit_page_length=100,
    )
    return {"timeline": [_serialize_audit(row, admin=True) for row in rows], "count": len(rows)}


def _assert_member_record_visibility(user, doctype, name):
    if doctype not in AUDIT_VISIBLE_DOCTYPES:
        raise frappe.PermissionError
    if not user or user == "Guest" or not doctype_exists(doctype):
        raise frappe.PermissionError

    doc = frappe.get_doc(doctype, name)
    if is_admin_user(user):
        return doc

    tenant = get_current_tenant_name(user)
    doc_tenant = getattr(doc, "tenant", None)
    if doc_tenant and tenant and doc_tenant != tenant:
        raise frappe.PermissionError

    for fieldname in ("owner_user", "user", "buyer_user", "member", "primary_owner"):
        if getattr(doc, fieldname, None) == user:
            return doc

    raise frappe.PermissionError


def list_my_record_timeline(doctype, name, user=None):
    """Return a member-safe timeline without internal audit notes."""

    _require_audit_doctype()
    _assert_member_record_visibility(user, doctype, name)
    rows = frappe.get_all(
        "RBP Audit Log",
        fields=_audit_fields(),
        filters={"subject_doctype": doctype, "subject_name": name},
        order_by="creation asc",
        limit_page_length=100,
    )
    return {"timeline": [_serialize_audit(row, admin=False) for row in rows], "count": len(rows)}
