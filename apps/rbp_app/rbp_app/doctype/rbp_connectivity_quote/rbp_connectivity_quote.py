import frappe
from frappe.model.document import Document


QUOTE_STATUSES = {"Draft", "Presented", "Accepted", "Rejected", "Expired"}


class RBPConnectivityQuote(Document):
    """Tenant-scoped connectivity quote."""

    def validate(self):
        if self.status and self.status not in QUOTE_STATUSES:
            frappe.throw("Invalid connectivity quote status.")
        if not self.status:
            self.status = "Draft"
        if self.recommended in (None, ""):
            self.recommended = 0
