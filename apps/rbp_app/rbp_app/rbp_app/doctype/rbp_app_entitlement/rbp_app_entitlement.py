import frappe
from frappe.model.document import Document
from frappe.utils import getdate


class RBPAppEntitlement(Document):
    """Controls tenant/user access to apps, modules and integrations."""

    def validate(self):
        if self.app_key:
            self.app_key = self.app_key.strip().lower()

        if self.source_app:
            self.source_app = self.source_app.strip().lower()

        if self.entitlement_type == "User" and not self.user:
            frappe.throw("User is required for a user-specific entitlement.")

        if self.entitlement_type == "Tenant" and not self.tenant:
            frappe.throw("Tenant is required for a tenant entitlement.")

        if self.starts_on and self.ends_on and getdate(self.starts_on) > getdate(self.ends_on):
            frappe.throw("Entitlement start date cannot be after end date.")
