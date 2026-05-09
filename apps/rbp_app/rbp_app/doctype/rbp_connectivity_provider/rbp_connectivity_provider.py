import frappe
from frappe.model.document import Document


PROVIDER_STATUSES = {"Active", "Inactive", "Archived"}


class RBPConnectivityProvider(Document):
    """Tenant-scoped connectivity provider."""

    def validate(self):
        if self.status and self.status not in PROVIDER_STATUSES:
            frappe.throw("Invalid connectivity provider status.")
        if not self.status:
            self.status = "Active"
