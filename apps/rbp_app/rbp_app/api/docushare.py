"""DocuShare APIs."""

import json

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services import docushare as service


def _payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload or "{}")
    return dict(payload)


@frappe.whitelist()
def create_folder(payload=None):
    user = require_login()
    return service.create_folder(user, _payload(payload))


@frappe.whitelist()
def update_folder(folder_name, payload=None):
    user = require_login()
    return service.update_folder(user, folder_name, _payload(payload))


@frappe.whitelist()
def list_folders(filters=None):
    user = require_login()
    return service.list_folders(user, _payload(filters))


@frappe.whitelist()
def get_folder(folder_name):
    user = require_login()
    return service.get_folder(user, folder_name)


@frappe.whitelist()
def create_document(payload=None):
    user = require_login()
    return service.create_document(user, _payload(payload))


@frappe.whitelist()
def create_brief(payload=None):
    data = _payload(payload)
    data["submit"] = True
    user = require_login()
    return service.create_document(user, data)


@frappe.whitelist()
def update_document(document_name, payload=None):
    user = require_login()
    return service.update_document(user, document_name, _payload(payload))


@frappe.whitelist()
def list_documents(filters=None):
    user = require_login()
    return service.list_documents(user, _payload(filters))


@frappe.whitelist()
def list_my_briefs(filters=None):
    return list_documents(filters)


@frappe.whitelist()
def get_document(document_name):
    user = require_login()
    return service.get_document(user, document_name)


@frappe.whitelist()
def get_brief(brief_name):
    return get_document(brief_name)


@frappe.whitelist()
def admin_update_status(brief_name, status, payload=None):
    user = require_system_manager()
    return service.admin_update_status(user, brief_name, status, _payload(payload))


@frappe.whitelist()
def share_folder(folder_name, payload=None):
    user = require_login()
    return service.share_folder(user, folder_name, _payload(payload))


@frappe.whitelist()
def share_document(document_name, payload=None):
    user = require_login()
    return service.share_document(user, document_name, _payload(payload))


@frappe.whitelist()
def revoke_share(share_name):
    user = require_login()
    return service.revoke_share(user, share_name)
