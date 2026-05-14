"""Tenant and account provisioning helpers for the RBP platform.

Milestone 7 responsibilities:
- Resolve the current user's RBP Tenant.
- Create/link RBP Tenant records for customers.
- Create/link RBP Business Profile records.
- Create/link a pending/free RBP Subscription.
- Grant baseline portal entitlements.
- Return a frontend-safe portal context payload.
"""

from __future__ import annotations

import re
from typing import Any

import frappe
from frappe import _
from frappe.utils import nowdate


BASELINE_ENTITLEMENTS = (
    {
        "app_key": "portal",
        "app_label": "Member Portal",
        "app_category": "Platform",
        "module_type": "RBP Platform Module",
        "entitlement_type": "Tenant",
        "route": "/portal/dashboard",
    },
    {
        "app_key": "membership",
        "app_label": "Membership",
        "app_category": "Platform",
        "module_type": "RBP Platform Module",
        "entitlement_type": "Tenant",
        "route": "/portal/membership",
    },
    {
        "app_key": "notifications",
        "app_label": "Notifications",
        "app_category": "Platform",
        "module_type": "RBP Platform Module",
        "entitlement_type": "Tenant",
        "route": "/portal/dashboard",
    },
    {
        "app_key": "applications_interest",
        "app_label": "Applications Interest",
        "app_category": "Platform",
        "module_type": "RBP Platform Module",
        "entitlement_type": "Tenant",
        "route": "/portal/apps",
    },
)


def doctype_exists(doctype: str) -> bool:
    """Return whether a DocType is available on the current site."""

    try:
        return bool(frappe.db.exists("DocType", doctype))
    except Exception:
        return False


def _has_field(doctype: str, fieldname: str) -> bool:
    """Return whether a DocType has a field."""

    try:
        return any(df.fieldname == fieldname for df in frappe.get_meta(doctype).fields)
    except Exception:
        return False


def _set_if_has_field(doc: Any, fieldname: str, value: Any) -> None:
    """Set a value only when the target DocType supports the field."""

    if value is not None and _has_field(doc.doctype, fieldname):
        doc.set(fieldname, value)


def _clean_text(value: Any, fallback: str = "") -> str:
    """Normalise user-provided text."""

    if value is None:
        return fallback

    text = str(value).strip()
    return text or fallback


def _slug(value: str) -> str:
    """Create a stable slug for tenant names."""

    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", value or "").strip("-").lower()
    return cleaned or "business"


def _unique_tenant_name(business_name: str) -> str:
    """Return a unique tenant_name value for RBP Tenant autoname."""

    base = _slug(business_name)
    candidate = base
    counter = 1

    while frappe.db.exists("RBP Tenant", {"tenant_name": candidate}):
        counter += 1
        candidate = f"{base}-{counter}"

    return candidate


def _safe_user_email(user: str | None = None) -> str | None:
    """Return the effective user email unless the session is guest."""

    selected = user or getattr(frappe.session, "user", None)
    if not selected or selected == "Guest":
        return None
    return selected


def get_rbp_tenant_for_user(user: str | None = None):
    """Return the canonical RBP Tenant for a user, if one exists."""

    user = _safe_user_email(user)
    if not user or not doctype_exists("RBP Tenant"):
        return None

    try:
        tenant_name = frappe.db.get_value("RBP Tenant", {"primary_owner": user}, "name")

        if not tenant_name:
            tenant_name = frappe.db.get_value("RBP Tenant", {"owner_user": user}, "name")

        if not tenant_name and doctype_exists("RBP Tenant Member"):
            tenant_name = frappe.db.get_value(
                "RBP Tenant Member",
                {"user": user, "status": "Active"},
                "tenant",
            )

        if tenant_name:
            return frappe.get_doc("RBP Tenant", tenant_name)
    except Exception:
        return None

    return None


def get_legacy_tenant_for_user(user: str | None = None):
    """Return a legacy Tenant record for backward compatibility."""

    user = _safe_user_email(user)
    if not user or not doctype_exists("Tenant"):
        return None

    try:
        if frappe.db.exists("User", user):
            tenant_name = frappe.db.get_value("Tenant", {"primary_user": user}, "name")
            if tenant_name:
                return frappe.get_doc("Tenant", tenant_name)

        user_permissions = frappe.get_user_permissions(user)
        tenant_names = user_permissions.get("Tenant") or []
        if tenant_names:
            return frappe.get_doc("Tenant", tenant_names[0])
    except Exception:
        return None

    return None


def get_current_tenant(user: str | None = None):
    """Return the current tenant, preferring RBP Tenant over legacy Tenant."""

    return get_rbp_tenant_for_user(user) or get_legacy_tenant_for_user(user)


def get_current_tenant_name(user: str | None = None) -> str | None:
    """Return the current tenant name, preferring RBP Tenant."""

    tenant = get_current_tenant(user)
    return getattr(tenant, "name", None)


def ensure_rbp_tenant(
    user: str,
    business_name: str | None = None,
    company_name: str | None = None,
    created_from_signup: bool = False,
    created_from_membership: bool = False,
):
    """Create or return the user's RBP Tenant."""

    if not doctype_exists("RBP Tenant"):
        raise frappe.ValidationError(_("RBP Tenant DocType is not installed."))

    if not user or user == "Guest":
        raise frappe.PermissionError(_("A signed-in user is required to create a tenant."))

    existing = get_rbp_tenant_for_user(user)
    if existing:
        changed = False

        if company_name and _has_field("RBP Tenant", "company_name") and not existing.get("company_name"):
            existing.company_name = company_name
            changed = True

        if created_from_signup and _has_field("RBP Tenant", "created_from_signup"):
            existing.created_from_signup = 1
            changed = True

        if created_from_membership and _has_field("RBP Tenant", "created_from_membership"):
            existing.created_from_membership = 1
            changed = True

        if changed:
            existing.save(ignore_permissions=True)

        return existing

    resolved_business_name = _clean_text(business_name or company_name, "My Business")
    resolved_company_name = _clean_text(company_name or resolved_business_name, resolved_business_name)

    tenant = frappe.get_doc(
        {
            "doctype": "RBP Tenant",
            "tenant_name": _unique_tenant_name(resolved_business_name),
            "company_name": resolved_company_name,
            "status": "Active",
            "primary_owner": user,
            "owner_user": user,
            "created_from_signup": 1 if created_from_signup else 0,
            "created_from_membership": 1 if created_from_membership else 0,
        }
    )
    tenant.insert(ignore_permissions=True)
    return tenant


def ensure_business_profile(
    tenant,
    user: str,
    payload: dict[str, Any] | None = None,
):
    """Create or update the RBP Business Profile linked to a tenant."""

    if not doctype_exists("RBP Business Profile"):
        return None

    payload = payload or {}
    tenant_name = getattr(tenant, "name", tenant)

    existing_name = None
    if tenant_name:
        existing_name = frappe.db.get_value("RBP Business Profile", {"tenant": tenant_name}, "name")

    if not existing_name and tenant and getattr(tenant, "business_profile", None):
        existing_name = tenant.business_profile

    business_name = _clean_text(
        payload.get("business_name") or payload.get("company_name") or getattr(tenant, "company_name", None),
        "My Business",
    )

    if existing_name:
        profile = frappe.get_doc("RBP Business Profile", existing_name)
    else:
        profile = frappe.get_doc(
            {
                "doctype": "RBP Business Profile",
                "tenant": tenant_name,
                "business_name": business_name,
            }
        )

    updates = {
        "tenant": tenant_name,
        "business_name": business_name,
        "legal_name": payload.get("legal_name"),
        "business_identifier": payload.get("business_identifier") or payload.get("abn"),
        "industry": payload.get("industry"),
        "business_size": payload.get("business_size"),
        "country": payload.get("country") or "Australia",
        "region": payload.get("region") or payload.get("state"),
        "primary_contact_user": user,
        "primary_contact_name": payload.get("primary_contact_name") or payload.get("full_name"),
        "email": payload.get("email") or user,
        "phone": payload.get("phone"),
        "website": payload.get("website"),
        "membership_status": payload.get("membership_status") or "Pending",
        "status": payload.get("status") or "Active",
        "notes": payload.get("notes"),
    }

    for fieldname, value in updates.items():
        _set_if_has_field(profile, fieldname, value)

    if profile.is_new():
        profile.insert(ignore_permissions=True)
    else:
        profile.save(ignore_permissions=True)

    if tenant and _has_field("RBP Tenant", "business_profile") and getattr(tenant, "business_profile", None) != profile.name:
        tenant.business_profile = profile.name
        tenant.save(ignore_permissions=True)

    return profile


def ensure_subscription(
    tenant,
    user: str,
    plan: str | None = None,
    status: str = "Trial",
    created_from_membership: bool = False,
):
    """Create or return a tenant/user subscription record."""

    if not doctype_exists("RBP Subscription"):
        return None

    tenant_name = getattr(tenant, "name", tenant)
    filters = {"tenant": tenant_name, "member": user}
    existing_name = frappe.db.get_value("RBP Subscription", filters, "name")

    if existing_name:
        subscription = frappe.get_doc("RBP Subscription", existing_name)
        changed = False

        if plan and _has_field("RBP Subscription", "plan") and not subscription.get("plan"):
            subscription.plan = plan
            changed = True

        if created_from_membership and _has_field("RBP Tenant", "created_from_membership") and tenant:
            tenant.created_from_membership = 1
            tenant.save(ignore_permissions=True)

        if changed:
            subscription.save(ignore_permissions=True)

        return subscription

    subscription = frappe.get_doc(
        {
            "doctype": "RBP Subscription",
            "tenant": tenant_name,
            "member": user,
            "status": status,
            "plan": plan or "Free Account",
            "billing_cycle": "Manual",
            "billing_provider": "None",
            "payment_status": "Not Required",
            "currency": "AUD",
        }
    )
    subscription.insert(ignore_permissions=True)

    if created_from_membership and tenant and _has_field("RBP Tenant", "created_from_membership"):
        tenant.created_from_membership = 1
        tenant.save(ignore_permissions=True)

    return subscription


def grant_entitlement(
    tenant,
    user: str,
    app_key: str,
    app_label: str | None = None,
    app_category: str | None = None,
    module_type: str = "RBP Platform Module",
    entitlement_type: str = "Tenant",
    route: str | None = None,
    source_subscription: str | None = None,
):
    """Grant an idempotent RBP App Entitlement."""

    if not doctype_exists("RBP App Entitlement"):
        return None

    tenant_name = getattr(tenant, "name", tenant)
    filters = {
        "tenant": tenant_name,
        "user": user,
        "app_key": app_key,
    }
    existing_name = frappe.db.get_value("RBP App Entitlement", filters, "name")

    if existing_name:
        entitlement = frappe.get_doc("RBP App Entitlement", existing_name)
    else:
        entitlement = frappe.get_doc(
            {
                "doctype": "RBP App Entitlement",
                "tenant": tenant_name,
                "user": user,
                "app_key": app_key,
            }
        )

    updates = {
        "app_label": app_label or app_key.replace("_", " ").title(),
        "app_category": app_category or "Platform",
        "module_type": module_type,
        "entitlement_type": entitlement_type,
        "status": "Active",
        "enabled": 1,
        "visible_in_launcher": 1,
        "route": route,
        "source_subscription": source_subscription,
        "starts_on": nowdate(),
    }

    for fieldname, value in updates.items():
        _set_if_has_field(entitlement, fieldname, value)

    if entitlement.is_new():
        entitlement.insert(ignore_permissions=True)
    else:
        entitlement.save(ignore_permissions=True)

    return entitlement


def ensure_baseline_entitlements(tenant, user: str, subscription=None):
    """Grant the baseline entitlements required for a working member portal."""

    granted = []
    source_subscription = getattr(subscription, "name", None)

    for item in BASELINE_ENTITLEMENTS:
        entitlement = grant_entitlement(
            tenant=tenant,
            user=user,
            app_key=item["app_key"],
            app_label=item["app_label"],
            app_category=item["app_category"],
            module_type=item["module_type"],
            entitlement_type=item["entitlement_type"],
            route=item["route"],
            source_subscription=source_subscription,
        )
        if entitlement:
            granted.append(entitlement)

    return granted


def provision_customer_account(
    user: str,
    payload: dict[str, Any] | None = None,
    created_from_signup: bool = False,
    created_from_membership: bool = False,
):
    """Create or link all core customer account records."""

    payload = payload or {}

    if not user or user == "Guest":
        raise frappe.PermissionError(_("A signed-in user is required."))

    if not frappe.db.exists("User", user):
        raise frappe.DoesNotExistError(_("User does not exist: {0}").format(user))

    tenant = ensure_rbp_tenant(
        user=user,
        business_name=payload.get("business_name") or payload.get("company_name"),
        company_name=payload.get("company_name") or payload.get("business_name"),
        created_from_signup=created_from_signup,
        created_from_membership=created_from_membership,
    )

    business_profile = ensure_business_profile(tenant, user, payload)

    subscription = ensure_subscription(
        tenant=tenant,
        user=user,
        plan=payload.get("plan") or payload.get("membership_plan") or "Free Account",
        status=payload.get("subscription_status") or "Trial",
        created_from_membership=created_from_membership,
    )

    entitlements = ensure_baseline_entitlements(tenant, user, subscription)

    return {
        "tenant": tenant,
        "business_profile": business_profile,
        "subscription": subscription,
        "entitlements": entitlements,
    }


def get_business_profile_for_user(user: str | None = None):
    """Return the business profile document for a user, if available."""

    tenant = get_rbp_tenant_for_user(user)
    if not tenant or not doctype_exists("RBP Business Profile"):
        return None

    if getattr(tenant, "business_profile", None):
        return frappe.get_doc("RBP Business Profile", tenant.business_profile)

    profile_name = frappe.db.get_value("RBP Business Profile", {"tenant": tenant.name}, "name")
    if profile_name:
        return frappe.get_doc("RBP Business Profile", profile_name)

    return None


def serialize_doc(doc):
    """Return a frontend-safe dictionary for a Frappe document."""

    if not doc:
        return None

    data = doc.as_dict()
    blocked = {
        "docstatus",
        "idx",
        "owner",
        "creation",
        "modified",
        "modified_by",
        "_user_tags",
        "_comments",
        "_assign",
        "_liked_by",
    }
    return {key: value for key, value in data.items() if key not in blocked}


def get_portal_context(user: str | None = None):
    """Return the current user's tenant, profile, subscription, and entitlements."""

    user = _safe_user_email(user)
    if not user:
        raise frappe.PermissionError(_("Authentication required."))

    tenant = get_rbp_tenant_for_user(user)
    profile = get_business_profile_for_user(user)

    subscription = None
    if tenant and doctype_exists("RBP Subscription"):
        subscription_name = frappe.db.get_value(
            "RBP Subscription",
            {"tenant": tenant.name, "member": user},
            "name",
        )
        if subscription_name:
            subscription = frappe.get_doc("RBP Subscription", subscription_name)

    entitlements = []
    if tenant and doctype_exists("RBP App Entitlement"):
        entitlements = frappe.get_all(
            "RBP App Entitlement",
            filters={"tenant": tenant.name, "user": user, "status": "Active"},
            fields=[
                "name",
                "app_key",
                "app_label",
                "app_category",
                "module_type",
                "entitlement_type",
                "enabled",
                "visible_in_launcher",
                "route",
                "source_subscription",
                "starts_on",
                "ends_on",
            ],
            order_by="app_label asc",
        )

    return {
        "user": user,
        "tenant": serialize_doc(tenant),
        "business_profile": serialize_doc(profile),
        "subscription": serialize_doc(subscription),
        "entitlements": entitlements,
        "portal_ready": bool(tenant and profile),
    }


def load_portal_tenant(context):
    """Attach tenant context for portal pages without provisioning records."""

    path = (getattr(context, "path", None) or getattr(frappe.local, "path", "") or "").strip("/")
    if not (path == "portal" or path.startswith("portal/") or path == "app" or path.startswith("app/")):
        return context

    user = getattr(frappe.session, "user", "Guest")
    if user == "Guest":
        context.tenant = None
        context.current_tenant = None
        context.portal_setup_required = True
        frappe.local.tenant = None
        return context

    tenant = get_current_tenant(user)
    if not tenant:
        context.portal_setup_required = True
        context.portal_setup_message = (
            "Your portal account exists, but no workspace is linked yet. "
            "Please contact support to complete setup."
        )
        context.tenant = None
        context.current_tenant = None
        frappe.local.tenant = None
        return context

    context.portal_setup_required = False
    context.tenant = tenant
    context.current_tenant = tenant
    context.current_tenant_doctype = getattr(tenant, "doctype", None)
    frappe.local.tenant = tenant
    return context
