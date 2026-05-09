import frappe
from frappe.model.document import Document


REQUEST_STATUSES = {
    "Draft",
    "Submitted",
    "In Review",
    "Quoted",
    "Approved",
    "In Progress",
    "Completed",
    "Cancelled",
}


class RBPConnectivityRequest(Document):
    """Tenant-scoped connectivity request."""

    def validate(self):
        if self.status and self.status not in REQUEST_STATUSES:
            frappe.throw("Invalid connectivity request status.")
        if not self.status:
            self.status = "Draft"
        if not self.workflow_state:
            self.workflow_state = self.status
