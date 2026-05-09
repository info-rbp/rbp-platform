import frappe
from frappe.model.document import Document


DOCUMENT_STATUSES = {"Draft", "Active", "Archived", "Deleted"}
VISIBILITY_VALUES = {"Private", "Tenant", "Shared"}


class RBPDocuShareDocument(Document):
    """Tenant-scoped DocuShare document."""

    def validate(self):
        if self.status and self.status not in DOCUMENT_STATUSES:
            frappe.throw("Invalid DocuShare document status.")
        if self.visibility and self.visibility not in VISIBILITY_VALUES:
            frappe.throw("Invalid DocuShare document visibility.")
        if not self.status:
            self.status = "Draft"
        if not self.visibility:
            self.visibility = "Private"
        if not self.version:
            self.version = "1"
