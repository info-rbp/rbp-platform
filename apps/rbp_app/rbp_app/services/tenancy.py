"""Tenant compatibility helpers for RBP platform and legacy tenant records."""

import frappe


def doctype_exists(doctype):
    """Return whether a DocType is available on the current site."""

    try:
        return bool(frappe.db.exists("DocType", doctype))
    except Exception:
        return False


def get_rbp_tenant_for_user(user=None):
    """Return the canonical RBP Tenant for a user, if one exists."""

    user = user or getattr(frappe.session, "user", None)
    if not user or user == "Guest" or not doctype_exists("RBP Tenant"):
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


def get_legacy_tenant_for_user(user=None):
    """Return a legacy Tenant record for backward compatibility."""

    user = user or getattr(frappe.session, "user", None)
    if not user or user == "Guest" or not doctype_exists("Tenant"):
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


def get_current_tenant(user=None):
    """Return the current tenant, preferring RBP Tenant over legacy Tenant."""

    return get_rbp_tenant_for_user(user) or get_legacy_tenant_for_user(user)


def get_current_tenant_name(user=None):
    """Return the current tenant name, preferring RBP Tenant."""

    tenant = get_current_tenant(user)
    return getattr(tenant, "name", None)


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
