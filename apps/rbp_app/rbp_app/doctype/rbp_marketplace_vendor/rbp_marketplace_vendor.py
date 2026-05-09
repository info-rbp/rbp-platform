import frappe
from frappe.model.document import Document


VENDOR_STATUSES = {"Draft", "Active", "Suspended", "Archived"}
VERIFICATION_STATUSES = {"Unverified", "Pending", "Verified", "Rejected"}


class RBPMarketplaceVendor(Document):
    """Tenant-scoped marketplace vendor."""

    def validate(self):
        if self.status and self.status not in VENDOR_STATUSES:
            frappe.throw("Invalid marketplace vendor status.")
        if self.verification_status and self.verification_status not in VERIFICATION_STATUSES:
            frappe.throw("Invalid marketplace vendor verification status.")
        if not self.status:
            self.status = "Draft"
        if not self.verification_status:
            self.verification_status = "Unverified"
