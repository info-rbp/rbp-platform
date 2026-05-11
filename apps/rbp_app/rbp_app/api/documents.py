"""Document APIs for the RBP portal/frontend."""

import json

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.documents import (
    attach_document_reference as attach_document_reference_service,
    get_document as get_document_service,
    get_document_download as get_document_download_service,
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
def list_my_documents(filters=None):
    """Return visible RBP File Reference records for the current portal user."""

    user = require_login()
    return get_documents_service(user, _coerce_payload(filters))


@frappe.whitelist()
def get_document_reference(name):
    """Return a single visible RBP File Reference DTO."""

    user = require_login()
    return get_document_service(user=user, name=name)


@frappe.whitelist()
def get_document_download_url(name):
    """Return a permission-checked download URL for a file reference."""

    user = require_login()
    return get_document_download_service(user=user, name=name)


@frappe.whitelist()
def attach_file_reference(payload=None):
    """Attach an existing Frappe File to an RBP record."""

    user = require_login()
    payload = _coerce_payload(payload)
    return attach_document_reference_service(user=user, **payload)
