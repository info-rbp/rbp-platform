"""Document APIs for the RBP portal/frontend."""

import json

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.documents import (
    attach_document_reference as attach_document_reference_service,
    get_documents as get_documents_service,
)


def _coerce_payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload)
    return dict(payload)


@frappe.whitelist()
def get_documents():
    """Return tenant-aware file references."""

    user = require_login()
    return get_documents_service(user)


@frappe.whitelist()
def attach_file_reference(payload=None):
    """Attach an existing Frappe File to an RBP record."""

    user = require_login()
    payload = _coerce_payload(payload)
    return attach_document_reference_service(user=user, **payload)
