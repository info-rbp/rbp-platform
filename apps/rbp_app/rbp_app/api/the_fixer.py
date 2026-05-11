"""The Fixer APIs."""

import json

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services import the_fixer as service
from rbp_app.services.admin_workflows import perform_domain_action


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
def get_case(case_name):
    user = require_login()
    return service.get_case(user, case_name)


@frappe.whitelist()
def admin_assign_case(case_name, assigned_to):
    user = require_system_manager()
    return service.admin_assign_case(user, case_name, assigned_to)


@frappe.whitelist()
def admin_update_case_status(case_name, status, payload=None):
    user = require_system_manager()
    return service.admin_update_case_status(user, case_name, status, _payload(payload))


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


def _admin_action(action, case_name, **kwargs):
    user = require_system_manager()
    return perform_domain_action(user, "fixer", service.CASE_DOCTYPE, case_name, action, **kwargs)


@frappe.whitelist()
def admin_start_review(case_name, notes=None):
    return _admin_action("start_review", case_name, notes=notes)


@frappe.whitelist()
def admin_request_more_information(case_name, notes):
    return _admin_action("request_more_information", case_name, notes=notes)


@frappe.whitelist()
def admin_reject(case_name, notes):
    return _admin_action("reject", case_name, notes=notes)


@frappe.whitelist()
def admin_mark_outcome_ready(case_name, notes=None):
    return _admin_action("mark_outcome_ready", case_name, notes=notes)


@frappe.whitelist()
def admin_mark_completed(case_name, notes=None):
    return _admin_action("mark_completed", case_name, notes=notes)


@frappe.whitelist()
def admin_archive(case_name, notes=None):
    return _admin_action("archive", case_name, notes=notes)
