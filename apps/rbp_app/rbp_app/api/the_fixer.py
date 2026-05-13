"""The Fixer APIs."""

import json

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services import the_fixer as service


def _payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload or "{}")
    return dict(payload)


@frappe.whitelist()
def create_case(payload=None):
    user = require_login()
    return service.create_case(user, _payload(payload))


@frappe.whitelist()
def create_request(payload=None):
    data = _payload(payload)
    data["submit"] = True
    user = require_login()
    return service.create_case(user, data)


@frappe.whitelist()
def update_draft_case(case_name, payload=None):
    user = require_login()
    return service.update_draft_case(user, case_name, _payload(payload))


@frappe.whitelist()
def submit_case(case_name):
    user = require_login()
    return service.submit_case(user, case_name)


@frappe.whitelist()
def list_my_cases(filters=None):
    user = require_login()
    return service.list_my_cases(user, _payload(filters))


@frappe.whitelist()
def list_my_requests(filters=None):
    return list_my_cases(filters)


@frappe.whitelist()
def get_case(case_name):
    user = require_login()
    return service.get_case(user, case_name)


@frappe.whitelist()
def get_request(request_name):
    return get_case(request_name)


@frappe.whitelist()
def admin_assign_case(case_name, assigned_to):
    user = require_system_manager()
    return service.admin_assign_case(user, case_name, assigned_to)


@frappe.whitelist()
def admin_update_case_status(case_name, status, payload=None):
    user = require_system_manager()
    return service.admin_update_case_status(user, case_name, status, _payload(payload))


@frappe.whitelist()
def admin_update_status(request_name, status, payload=None):
    user = require_system_manager()
    return service.admin_update_case_status(user, request_name, status, _payload(payload))


@frappe.whitelist()
def create_task(case_name, payload=None):
    user = require_login()
    return service.create_task(user, case_name, _payload(payload))


@frappe.whitelist()
def update_task(task_name, payload=None):
    user = require_login()
    return service.update_task(user, task_name, _payload(payload))


@frappe.whitelist()
def complete_task(task_name):
    user = require_login()
    return service.complete_task(user, task_name)


@frappe.whitelist()
def add_case_update(case_name, payload=None):
    user = require_login()
    return service.add_case_update(user, case_name, _payload(payload))


@frappe.whitelist()
def list_case_updates(case_name, filters=None):
    user = require_login()
    return service.list_case_updates(user, case_name, _payload(filters))
