"""Entitlement enforcement services for RBP apps and capabilities."""

import frappe
from frappe.utils import getdate, nowdate

from rbp_app.permissions import get_user_roles, is_admin_user
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


ACTIVE_STATUSES = {"Active"}


def _parse_roles(value):
    if not value:
        return set()
    return {item.strip() for item in value.replace(",", "\n").splitlines() if item.strip()}


def _within_date_window(row):
    today = getdate(nowdate())
    starts_on = row.get("starts_on")
    ends_on = row.get("ends_on")

    if starts_on and getdate(starts_on) > today:
        return False

    if ends_on and getdate(ends_on) < today:
        return False

    return True


def _entitlement_rows(app_key=None, user=None):
    if not doctype_exists("RBP App Entitlement"):
        return []

    filters = {
        "enabled": 1,
        "status": ["in", list(ACTIVE_STATUSES)],
    }

    if app_key:
        filters["app_key"] = app_key.strip().lower()

    try:
        return frappe.get_all(
            "RBP App Entitlement",
            filters=filters,
            fields=[
                "name",
                "tenant",
                "user",
                "app_key",
                "app_label",
                "entitlement_type",
                "status",
                "enabled",
                "roles_allowed",
                "starts_on",
                "ends_on",
                "source_subscription",
            ],
        )
    except Exception:
        return []


def get_user_entitlements(user=None):
    user = user or frappe.session.user
    if not user or user == "Guest":
        return []

    if is_admin_user(user):
        return _entitlement_rows(user=user)

    tenant = get_current_tenant_name(user)
    roles = set(get_user_roles(user))
    rows = []

    for row in _entitlement_rows(user=user):
        if not _within_date_window(row):
            continue

        if row.get("user") and row.get("user") != user:
            continue

        if row.get("tenant") and tenant and row.get("tenant") != tenant:
            continue

        allowed_roles = _parse_roles(row.get("roles_allowed"))
        if allowed_roles and not roles.intersection(allowed_roles):
            continue

        rows.append(row)

    return rows


def user_has_entitlement(app_key, user=None):
    user = user or frappe.session.user
    app_key = (app_key or "").strip().lower()

    if not app_key or not user or user == "Guest":
        return False

    if is_admin_user(user):
        return True

    all_rows = _entitlement_rows(user=user)
    if not all_rows:
        # Scaffold-safe default: if no entitlement records exist yet, do not
        # block the portal. Once records exist, they become authoritative.
        return True

    return any(row.get("app_key") == app_key for row in get_user_entitlements(user))


def require_entitlement(app_key, user=None):
    if not user_has_entitlement(app_key, user):
        raise frappe.PermissionError

    return True
