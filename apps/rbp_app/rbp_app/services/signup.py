"""Signup services for RBP customer account provisioning."""

from __future__ import annotations

from typing import Any

import frappe
from frappe.utils import validate_email_address

from rbp_app.services.tenancy import get_portal_context, provision_customer_account


def _normalise_payload(payload: dict[str, Any] | None = None) -> dict[str, Any]:
    """Return a safe payload dictionary."""

    return dict(payload or {})


def _split_name(full_name: str | None, email: str) -> tuple[str, str | None]:
    """Split a display name into first and last names for Frappe User."""

    value = (full_name or "").strip()
    if not value:
        return email.split("@")[0], None

    parts = value.split()
    if len(parts) == 1:
        return parts[0], None

    return parts[0], " ".join(parts[1:])


def ensure_customer_user(
    email: str,
    full_name: str | None = None,
    password: str | None = None,
    enabled: bool = True,
):
    """Create or return a Frappe User for a customer signup."""

    email = (email or "").strip().lower()
    if not email:
        raise frappe.ValidationError("Email is required.")

    validate_email_address(email, throw=True)

    if frappe.db.exists("User", email):
        user = frappe.get_doc("User", email)
        changed = False

        if enabled and not user.enabled:
            user.enabled = 1
            changed = True

        if full_name and not user.full_name:
            user.first_name, user.last_name = _split_name(full_name, email)
            changed = True

        if changed:
            user.save(ignore_permissions=True)

        if password:
            user.new_password = password
            user.save(ignore_permissions=True)

        return user

    first_name, last_name = _split_name(full_name, email)
    user = frappe.get_doc(
        {
            "doctype": "User",
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "enabled": 1 if enabled else 0,
            "send_welcome_email": 0,
            "user_type": "Website User",
        }
    )
    user.insert(ignore_permissions=True)

    if password:
        user.new_password = password
        user.save(ignore_permissions=True)

    return user


def create_signup(payload: dict[str, Any] | None = None):
    """Create a customer signup and provision tenant/account records."""

    payload = _normalise_payload(payload)

    email = payload.get("email")
    full_name = payload.get("full_name") or payload.get("primary_contact_name")
    password = payload.get("password")

    user = ensure_customer_user(email=email, full_name=full_name, password=password)

    provisioning = provision_customer_account(
        user=user.name,
        payload={
            **payload,
            "email": user.name,
            "full_name": full_name,
            "primary_contact_name": payload.get("primary_contact_name") or full_name,
            "business_name": payload.get("business_name") or payload.get("company_name") or "My Business",
            "company_name": payload.get("company_name") or payload.get("business_name") or "My Business",
            "subscription_status": payload.get("subscription_status") or "Trial",
            "plan": payload.get("plan") or payload.get("membership_plan") or "Free Account",
        },
        created_from_signup=True,
        created_from_membership=bool(payload.get("created_from_membership")),
    )

    return {
        "ok": True,
        "user": user.name,
        "tenant": provisioning["tenant"].name if provisioning.get("tenant") else None,
        "business_profile": provisioning["business_profile"].name if provisioning.get("business_profile") else None,
        "subscription": provisioning["subscription"].name if provisioning.get("subscription") else None,
        "entitlements": [item.name for item in provisioning.get("entitlements") or []],
        "context": get_portal_context(user.name),
    }


def create_or_update_account_context(user: str, payload: dict[str, Any] | None = None):
    """Ensure an existing signed-in user has tenant/account context."""

    provisioning = provision_customer_account(
        user=user,
        payload=_normalise_payload(payload),
        created_from_signup=False,
        created_from_membership=bool((payload or {}).get("created_from_membership")),
    )

    return {
        "ok": True,
        "user": user,
        "tenant": provisioning["tenant"].name if provisioning.get("tenant") else None,
        "business_profile": provisioning["business_profile"].name if provisioning.get("business_profile") else None,
        "subscription": provisioning["subscription"].name if provisioning.get("subscription") else None,
        "entitlements": [item.name for item in provisioning.get("entitlements") or []],
        "context": get_portal_context(user),
    }
