"""Decision Desk APIs."""

import json

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services import decision_desk as service
from rbp_app.services.admin_workflows import perform_domain_action


def _payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload or "{}")
    return dict(payload)


@frappe.whitelist()
def create_request(payload=None):
    user = require_login()
    return service.create_request(user, _payload(payload))


@frappe.whitelist()
def update_draft_request(request_name, payload=None):
    user = require_login()
    return service.update_draft_request(user, request_name, _payload(payload))


@frappe.whitelist()
def submit_request(request_name):
    user = require_login()
    return service.submit_request(user, request_name)


@frappe.whitelist()
def list_my_requests(filters=None):
    user = require_login()
    return service.list_my_requests(user, _payload(filters))


@frappe.whitelist()
def get_request(request_name):
    user = require_login()
    return service.get_request(user, request_name)


@frappe.whitelist()
def admin_assign_request(request_name, assigned_to):
    user = require_system_manager()
    return service.admin_assign_request(user, request_name, assigned_to)


@frappe.whitelist()
def admin_update_status(request_name, status, payload=None):
    user = require_system_manager()
    return service.admin_update_status(user, request_name, status, _payload(payload))


@frappe.whitelist()
def create_option(request_name, payload=None):
    user = require_login()
    return service.create_option(user, request_name, _payload(payload))


@frappe.whitelist()
def update_option(option_name, payload=None):
    user = require_login()
    return service.update_option(user, option_name, _payload(payload))


@frappe.whitelist()
def delete_option(option_name):
    user = require_login()
    return service.delete_option(user, option_name)


def _admin_action(action, request_name, **kwargs):
    user = require_system_manager()
    return perform_domain_action(user, "decision_desk", service.REQUEST_DOCTYPE, request_name, action, **kwargs)


@frappe.whitelist()
def admin_start_review(request_name, notes=None):
    return _admin_action("start_review", request_name, notes=notes)


@frappe.whitelist()
def admin_request_more_information(request_name, notes):
    return _admin_action("request_more_information", request_name, notes=notes)


@frappe.whitelist()
def admin_approve(request_name, notes=None):
    return _admin_action("approve", request_name, notes=notes)


@frappe.whitelist()
def admin_reject(request_name, notes):
    return _admin_action("reject", request_name, notes=notes)


@frappe.whitelist()
def admin_archive(request_name, notes=None):
    return _admin_action("archive", request_name, notes=notes)


@frappe.whitelist()
def admin_mark_outcome_ready(request_name, notes=None):
    return _admin_action("mark_outcome_ready", request_name, notes=notes)
