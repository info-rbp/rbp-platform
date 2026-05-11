"""DocuShare APIs."""

import json

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services import docushare as service
from rbp_app.services.admin_workflows import perform_domain_action


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
def update_document(document_name, payload=None):
    user = require_login()
    return service.update_document(user, document_name, _payload(payload))


@frappe.whitelist()
def list_documents(filters=None):
    user = require_login()
    return service.list_documents(user, _payload(filters))


@frappe.whitelist()
def get_document(document_name):
    user = require_login()
    return service.get_document(user, document_name)


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


def _admin_action(action, document_name, **kwargs):
    user = require_system_manager()
    return perform_domain_action(user, "docushare", service.DOCUMENT_DOCTYPE, document_name, action, **kwargs)


@frappe.whitelist()
def admin_start_review(document_name, notes=None):
    return _admin_action("start_review", document_name, notes=notes)


@frappe.whitelist()
def admin_request_more_information(document_name, notes):
    return _admin_action("request_more_information", document_name, notes=notes)


@frappe.whitelist()
def admin_approve(document_name, notes=None):
    return _admin_action("approve", document_name, notes=notes)


@frappe.whitelist()
def admin_reject(document_name, notes):
    return _admin_action("reject", document_name, notes=notes)


@frappe.whitelist()
def admin_archive(document_name, notes=None):
    return _admin_action("archive", document_name, notes=notes)
