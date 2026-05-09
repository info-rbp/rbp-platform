"""Risk Advisor APIs."""

import json

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services import risk_advisor as service


def _payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload or "{}")
    return dict(payload)


@frappe.whitelist()
def create_assessment(payload=None):
    user = require_login()
    return service.create_assessment(user, _payload(payload))


@frappe.whitelist()
def update_draft_assessment(assessment_name, payload=None):
    user = require_login()
    return service.update_draft_assessment(user, assessment_name, _payload(payload))


@frappe.whitelist()
def submit_assessment(assessment_name):
    user = require_login()
    return service.submit_assessment(user, assessment_name)


@frappe.whitelist()
def list_my_assessments(filters=None):
    user = require_login()
    return service.list_my_assessments(user, _payload(filters))


@frappe.whitelist()
def get_assessment(assessment_name):
    user = require_login()
    return service.get_assessment(user, assessment_name)


@frappe.whitelist()
def admin_assign_assessment(assessment_name, assigned_to):
    user = require_system_manager()
    return service.admin_assign_assessment(user, assessment_name, assigned_to)


@frappe.whitelist()
def admin_update_assessment_status(assessment_name, status, payload=None):
    user = require_system_manager()
    return service.admin_update_assessment_status(user, assessment_name, status, _payload(payload))


@frappe.whitelist()
def create_risk(assessment_name, payload=None):
    user = require_login()
    return service.create_risk(user, assessment_name, _payload(payload))


@frappe.whitelist()
def update_risk(risk_name, payload=None):
    user = require_login()
    return service.update_risk(user, risk_name, _payload(payload))


@frappe.whitelist()
def create_action(risk_name, payload=None):
    user = require_login()
    return service.create_action(user, risk_name, _payload(payload))


@frappe.whitelist()
def update_action(action_name, payload=None):
    user = require_login()
    return service.update_action(user, action_name, _payload(payload))


@frappe.whitelist()
def complete_action(action_name):
    user = require_login()
    return service.complete_action(user, action_name)
