"""Membership and onboarding APIs for the RBP portal/frontend."""

import json

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services.membership import (
    complete_onboarding as complete_onboarding_service,
    get_my_onboarding as get_my_onboarding_service,
    list_membership_plans as list_membership_plans_service,
    start_onboarding as start_onboarding_service,
    submit_onboarding as submit_onboarding_service,
    update_onboarding_step as update_onboarding_step_service,
)


def _coerce_payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload or "{}")
    return dict(payload)


@frappe.whitelist()
def list_membership_plans():
    """Return public active membership plans."""

    user = require_login()
    return list_membership_plans_service(user=user, public_only=True)


@frappe.whitelist()
def start_onboarding(plan_code=None, source_channel="portal"):
    """Start or return the current user's onboarding flow."""

    user = require_login()
    flow = start_onboarding_service(user=user, plan_code=plan_code, source_channel=source_channel)
    return {
        "name": flow.name,
        "status": flow.status,
        "current_step_key": flow.current_step_key,
        "membership_plan": flow.membership_plan,
    }


@frappe.whitelist()
def get_my_onboarding():
    """Return current user's onboarding flow and steps."""

    user = require_login()
    return get_my_onboarding_service(user=user)


@frappe.whitelist()
def update_onboarding_step(flow_name, step_key, payload=None, status="Completed"):
    """Update a step in the current user's onboarding flow."""

    user = require_login()
    step = update_onboarding_step_service(
        flow_name=flow_name,
        step_key=step_key,
        payload=_coerce_payload(payload),
        status=status,
        user=user,
    )
    return {
        "name": step.name,
        "step_key": step.step_key,
        "status": step.status,
    }


@frappe.whitelist()
def submit_onboarding(flow_name):
    """Submit current user's onboarding flow."""

    user = require_login()
    flow = submit_onboarding_service(flow_name=flow_name, user=user)
    return {
        "name": flow.name,
        "status": flow.status,
        "submitted_on": flow.submitted_on,
    }


@frappe.whitelist()
def admin_complete_onboarding(flow_name):
    """Admin action to complete an onboarding flow."""

    user = require_system_manager()
    flow = complete_onboarding_service(flow_name=flow_name, user=user)
    return {
        "name": flow.name,
        "status": flow.status,
        "completed_on": flow.completed_on,
    }
