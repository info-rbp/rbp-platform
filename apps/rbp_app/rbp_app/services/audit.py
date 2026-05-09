"""Audit logging services for RBP platform operations."""

import json
import uuid

import frappe

from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


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
