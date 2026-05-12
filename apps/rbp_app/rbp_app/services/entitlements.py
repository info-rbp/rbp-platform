"""Entitlement enforcement services for RBP apps and capabilities."""

import re

import frappe
from frappe.utils import getdate, nowdate

from rbp_app.permissions import get_user_roles, is_admin_user
from rbp_app.services.audit import record_audit_event
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


def _parse_app_keys(value):
    if not value:
        return []
    return [item.strip().lower() for item in re.split(r"[\n,]+", value) if item.strip()]


def _plan_for_subscription(subscription):
    plan_code = getattr(subscription, "plan", None)
    if not plan_code or not doctype_exists("RBP Membership Plan"):
        return None
    if frappe.db.exists("RBP Membership Plan", plan_code):
        return frappe.get_doc("RBP Membership Plan", plan_code)
    name = frappe.db.get_value("RBP Membership Plan", {"plan_code": plan_code}, "name")
    return frappe.get_doc("RBP Membership Plan", name) if name else None


def sync_entitlements_for_subscription(subscription, *, active=True, status=None):
    """Create/update app entitlements from a subscription's membership plan."""

    if not doctype_exists("RBP App Entitlement"):
        return []

    plan = _plan_for_subscription(subscription)
    app_keys = _parse_app_keys(getattr(plan, "included_apps", None)) if plan else []
    if not app_keys:
        return []

    entitlement_status = status or ("Active" if active else "Suspended")
    enabled = 1 if active else 0
    synced = []

    for app_key in app_keys:
        filters = {
            "source_subscription": subscription.name,
            "app_key": app_key,
        }
        existing = frappe.db.get_value("RBP App Entitlement", filters, "name")
        if existing:
            doc = frappe.get_doc("RBP App Entitlement", existing)
        else:
            doc = frappe.get_doc(
                {
                    "doctype": "RBP App Entitlement",
                    "tenant": getattr(subscription, "tenant", None),
                    "user": getattr(subscription, "member", None),
                    "app_key": app_key,
                    "app_label": app_key.replace("_", " ").replace("-", " ").title(),
                    "source_app": app_key,
                    "app_category": "Platform",
                    "module_type": "RBP Platform Module",
                    "entitlement_type": "Tenant" if getattr(subscription, "tenant", None) else "User",
                    "source_subscription": subscription.name,
                }
            )

        doc.tenant = getattr(subscription, "tenant", None)
        doc.user = getattr(subscription, "member", None)
        doc.status = entitlement_status
        doc.enabled = enabled
        doc.visible_in_launcher = enabled
        doc.plan_required = getattr(subscription, "plan", None)
        doc.starts_on = (
            getdate(getattr(subscription, "current_period_start", None))
            if getattr(subscription, "current_period_start", None)
            else None
        )
        doc.ends_on = (
            getdate(getattr(subscription, "current_period_end", None))
            if getattr(subscription, "current_period_end", None)
            else None
        )
        doc.notes = f"Synced from subscription {subscription.name}."
        doc.save(ignore_permissions=True) if getattr(doc, "name", None) else doc.insert(ignore_permissions=True)
        synced.append(doc.name)

    record_audit_event(
        "subscription_entitlements_synced",
        actor="Stripe",
        tenant=getattr(subscription, "tenant", None),
        subject_doctype="RBP Subscription",
        subject_name=subscription.name,
        message="Subscription entitlements synced.",
        metadata={"entitlements": synced, "active": active, "status": entitlement_status},
    )
    return synced
