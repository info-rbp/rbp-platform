import frappe
from frappe.model.document import Document


FOLDER_STATUSES = {"Active", "Archived"}
VISIBILITY_VALUES = {"Private", "Tenant", "Shared"}


class RBPDocuShareFolder(Document):
    """Tenant-scoped DocuShare folder."""

    def validate(self):
        if self.status and self.status not in FOLDER_STATUSES:
            frappe.throw("Invalid DocuShare folder status.")
        if self.visibility and self.visibility not in VISIBILITY_VALUES:
            frappe.throw("Invalid DocuShare folder visibility.")
        if not self.status:
            self.status = "Active"
        if not self.visibility:
            self.visibility = "Private"
