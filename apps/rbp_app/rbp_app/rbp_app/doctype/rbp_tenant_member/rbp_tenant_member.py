import frappe
from frappe.model.document import Document


class RBPTenantMember(Document):
    """User membership within an RBP tenant/workspace."""

    def validate(self):
        if not self.tenant:
            frappe.throw("Tenant is required.")

        if not self.user:
            frappe.throw("User is required.")

        existing = frappe.db.exists(
            "RBP Tenant Member",
            {
                "tenant": self.tenant,
                "user": self.user,
                "name": ["!=", self.name],
            },
        )
        if existing:
            frappe.throw("This user is already linked to this tenant.")
