import frappe
from frappe.model.document import Document


TENANT_STATUSES = {"Draft", "Provisioning", "Active", "Suspended", "Cancelled", "Archived"}


class RBPTenant(Document):
    """Tenant workspace record for the RBP platform layer."""

    def validate(self):
        if self.owner_user and not self.primary_owner:
            self.primary_owner = self.owner_user

        if self.primary_owner and not self.owner_user:
            self.owner_user = self.primary_owner

        if not self.tenant_name:
            self.tenant_name = self.company_name or self.primary_owner or self.owner_user

        if self.status and self.status not in TENANT_STATUSES:
            frappe.throw("Invalid RBP Tenant status.")

    def after_insert(self):
        self.ensure_primary_member()

    def on_update(self):
        self.ensure_primary_member()

    def ensure_primary_member(self):
        if not self.primary_owner or not frappe.db.exists("DocType", "RBP Tenant Member"):
            return

        existing = frappe.db.exists(
            "RBP Tenant Member",
            {
                "tenant": self.name,
                "user": self.primary_owner,
            },
        )
        if existing:
            member = frappe.get_doc("RBP Tenant Member", existing)
            changed = False
            if member.role_in_tenant != "Owner":
                member.role_in_tenant = "Owner"
                changed = True
            if not member.is_primary_owner:
                member.is_primary_owner = 1
                changed = True
            if member.status != "Active":
                member.status = "Active"
                changed = True
            if changed:
                member.save(ignore_permissions=True)
            return

        member = frappe.get_doc(
            {
                "doctype": "RBP Tenant Member",
                "tenant": self.name,
                "user": self.primary_owner,
                "role_in_tenant": "Owner",
                "status": "Active",
                "is_primary_owner": 1,
            }
        )
        member.insert(ignore_permissions=True)


def rbp_tenant_query_conditions(user=None):
    user = user or frappe.session.user
    if user == "Administrator" or "System Manager" in frappe.get_roles(user):
        return ""

    escaped_user = frappe.db.escape(user)
    return (
        f"(`tabRBP Tenant`.`primary_owner` = {escaped_user} "
        f"or `tabRBP Tenant`.`owner_user` = {escaped_user} "
        f"or `tabRBP Tenant`.`name` in ("
        f"select tenant from `tabRBP Tenant Member` "
        f"where user = {escaped_user} and status = 'Active'"
        f"))"
    )


def has_rbp_tenant_permission(doc, user=None, permission_type=None):
    user = user or frappe.session.user
    if user == "Administrator" or "System Manager" in frappe.get_roles(user):
        return True

    if doc.primary_owner == user or doc.owner_user == user:
        return True

    if frappe.db.exists(
        "RBP Tenant Member",
        {
            "tenant": doc.name,
            "user": user,
            "status": "Active",
        },
    ):
        return True

    return False
