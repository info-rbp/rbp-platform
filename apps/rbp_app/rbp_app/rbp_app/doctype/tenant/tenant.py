import frappe
from frappe.model.document import Document
from frappe.permissions import add_user_permission

from rbp_app.services.tenancy import load_portal_tenant as load_platform_portal_tenant
from rbp_app.utils.portal import redirect_to_login


class Tenant(Document):
    pass


def _tenant_doctype_installed():
    return frappe.db.exists("DocType", "Tenant")


def get_tenant_for_user(user: str):
    if not user or not _tenant_doctype_installed():
        return None

    if frappe.db.exists("User", user):
        tenant_name = frappe.db.get_value("Tenant", {"primary_user": user}, "name")
        if tenant_name:
            return frappe.get_doc("Tenant", tenant_name)

    user_permissions = frappe.get_user_permissions(user)
    tenant_names = user_permissions.get("Tenant") or []
    if tenant_names:
        return frappe.get_doc("Tenant", tenant_names[0])

    return None


def get_tenant_names_for_user(user: str):
    if not user or user == "Guest" or not _tenant_doctype_installed():
        return []

    tenant_names = frappe.get_all("Tenant", filters={"primary_user": user}, pluck="name")
    user_permissions = frappe.get_user_permissions(user).get("Tenant") or []
    tenant_names.extend(user_permissions)

    return sorted(set(tenant_names))


def has_tenant_permission(doc, user=None, permission_type=None):
    user = user or frappe.session.user
    if user == "Guest":
        return False
    if "System Manager" in frappe.get_roles(user):
        return True

    return doc.name in get_tenant_names_for_user(user)


def tenant_query_conditions(user=None):
    user = user or frappe.session.user
    if user == "Guest":
        return "1=0"
    if "System Manager" in frappe.get_roles(user):
        return ""

    tenants = get_tenant_names_for_user(user)
    if not tenants:
        return "1=0"

    escaped = ", ".join(frappe.db.escape(tenant) for tenant in tenants)
    return f"`tabTenant`.`name` in ({escaped})"


def create_tenant_for_user(user: str, email: str, first_name: str = None, last_name: str = None):
    if not user or not email:
        return None

    if not _tenant_doctype_installed():
        return None

    existing_tenant = get_tenant_for_user(user)
    if existing_tenant:
        return existing_tenant

    tenant_name = email.strip().lower()
    workspace_name = f"{first_name or email.split('@', 1)[0]}'s Workspace"

    tenant = frappe.get_doc(
        {
            "doctype": "Tenant",
            "tenant_name": tenant_name,
            "workspace_name": workspace_name,
            "primary_user": user,
            "status": "Active",
        }
    )
    tenant.flags.ignore_permissions = True
    tenant.insert(ignore_permissions=True)

    add_user_permission("Tenant", tenant.name, user, ignore_permissions=True)

    return tenant


def load_portal_tenant(context):
    path = (getattr(context, "path", None) or getattr(frappe.local, "path", "") or "").strip("/")
    if (path == "portal" or path.startswith("portal/")) and frappe.session.user == "Guest":
        redirect_to_login(path)

    return load_platform_portal_tenant(context)
