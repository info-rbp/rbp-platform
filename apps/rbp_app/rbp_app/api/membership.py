"""Membership, onboarding, and account provisioning APIs for the RBP portal/frontend."""

from __future__ import annotations

import json
from typing import Any

import frappe
from frappe import _

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services.membership import (
    complete_onboarding as complete_onboarding_service,
    get_my_onboarding as get_my_onboarding_service,
    list_membership_plans as list_membership_plans_service,
    start_onboarding as start_onboarding_service,
    submit_onboarding as submit_onboarding_service,
    update_onboarding_step as update_onboarding_step_service,
    validate_membership_plan_for_checkout as validate_membership_plan_for_checkout_service,
)
from rbp_app.services.signup import (
    create_or_update_account_context,
    create_signup as create_signup_service,
)
from rbp_app.services.tenancy import (
    get_business_profile_for_user,
    get_portal_context,
    provision_customer_account,
    serialize_doc,
)


def _coerce_payload(payload: Any = None) -> dict[str, Any]:
    if payload is None:
        return {}
    if isinstance(payload, str):
        if not payload.strip():
            return {}
        return json.loads(payload)
    return dict(payload)


def _require_user() -> str:
    user = getattr(frappe.session, "user", None)
    if not user or user == "Guest":
        raise frappe.PermissionError(_("Authentication required."))
    return user


@frappe.whitelist(allow_guest=True)
def create_signup(**kwargs):
    payload = _coerce_payload(kwargs.get("payload") or kwargs)
    result = create_signup_service(payload)
    frappe.db.commit()
    return result


@frappe.whitelist()
def ensure_my_account_context(**kwargs):
    user = _require_user()
    payload = _coerce_payload(kwargs.get("payload") or kwargs)
    result = create_or_update_account_context(user, payload)
    frappe.db.commit()
    return result


@frappe.whitelist()
def get_my_context():
    user = _require_user()
    return get_portal_context(user)


@frappe.whitelist()
def get_business_profile():
    user = _require_user()
    profile = get_business_profile_for_user(user)
    return {"ok": True, "business_profile": serialize_doc(profile)}


@frappe.whitelist()
def update_business_profile(**kwargs):
    user = _require_user()
    payload = _coerce_payload(kwargs.get("payload") or kwargs)

    provisioning = provision_customer_account(
        user=user,
        payload=payload,
        created_from_signup=False,
        created_from_membership=bool(payload.get("created_from_membership")),
    )

    frappe.db.commit()

    return {
        "ok": True,
        "tenant": provisioning["tenant"].name if provisioning.get("tenant") else None,
        "business_profile": serialize_doc(provisioning.get("business_profile")),
        "subscription": serialize_doc(provisioning.get("subscription")),
        "entitlements": [item.name for item in provisioning.get("entitlements") or []],
        "context": get_portal_context(user),
    }


@frappe.whitelist(allow_guest=True)
def list_membership_plans():
    """Return public active membership plans."""

    user = getattr(frappe.session, "user", None)
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


@frappe.whitelist()
def validate_membership_plan_checkout(plan_code=None, name=None):
    """Validate that a membership plan can start Stripe checkout."""

    user = require_login()
    plan = validate_membership_plan_for_checkout_service(plan_code=plan_code, name=name)

    return {
        "user": user,
        "name": plan.name,
        "plan_code": plan.plan_code,
        "plan_name": plan.plan_name,
        "billing_cycle": plan.billing_cycle,
        "price": getattr(plan, "price", None) if getattr(plan, "price", None) is not None else getattr(plan, "amount", None),
        "currency": plan.currency,
        "stripe_product_id": plan.stripe_product_id,
        "stripe_price_id": plan.stripe_price_id,
        "checkout_ready": True,
    }
