"""Membership and account provisioning API methods."""

from __future__ import annotations

import json
from typing import Any

import frappe
from frappe import _

from rbp_app.services.signup import create_or_update_account_context, create_signup as create_signup_service
from rbp_app.services.tenancy import (
    get_business_profile_for_user,
    get_portal_context,
    provision_customer_account,
    serialize_doc,
)


def _payload(value: Any = None) -> dict[str, Any]:
    """Coerce JSON/string/dict payloads into a dictionary."""

    if value is None:
        return {}
    if isinstance(value, str):
        if not value.strip():
            return {}
        return json.loads(value)
    return dict(value)


def _require_user() -> str:
    """Return the current user or raise."""

    user = getattr(frappe.session, "user", None)
    if not user or user == "Guest":
        raise frappe.PermissionError(_("Authentication required."))
    return user


@frappe.whitelist(allow_guest=True)
def create_signup(**kwargs):
    """Create a customer account, tenant, business profile, subscription and baseline entitlements."""

    payload = _payload(kwargs.get("payload") or kwargs)
    result = create_signup_service(payload)
    frappe.db.commit()
    return result


@frappe.whitelist()
def ensure_my_account_context(**kwargs):
    """Ensure the signed-in user has tenant/account context."""

    user = _require_user()
    payload = _payload(kwargs.get("payload") or kwargs)
    result = create_or_update_account_context(user, payload)
    frappe.db.commit()
    return result


@frappe.whitelist()
def get_my_context():
    """Return the signed-in user's tenant, profile, subscription and entitlements."""

    user = _require_user()
    return get_portal_context(user)


@frappe.whitelist()
def get_business_profile():
    """Return the signed-in user's business profile."""

    user = _require_user()
    profile = get_business_profile_for_user(user)
    return {"ok": True, "business_profile": serialize_doc(profile)}


@frappe.whitelist()
def update_business_profile(**kwargs):
    """Update the signed-in user's business profile and ensure tenant context exists."""

    user = _require_user()
    payload = _payload(kwargs.get("payload") or kwargs)

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
