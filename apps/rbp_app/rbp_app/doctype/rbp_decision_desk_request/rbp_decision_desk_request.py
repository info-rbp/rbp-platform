import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


REQUEST_STATUSES = {
    "Draft",
    "Submitted",
    "In Review",
    "Assigned",
    "In Progress",
    "Outcome Ready",
    "Closed",
    "Cancelled",
}


class RBPDecisionDeskRequest(Document):
    """Tenant-scoped decision request for advisor review."""

    def validate(self):
        if self.status and self.status not in REQUEST_STATUSES:
            frappe.throw("Invalid Decision Desk request status.")

        if not self.status:
            self.status = "Draft"

        if not self.workflow_state:
            self.workflow_state = self.status

        if self.status == "Submitted" and not self.submitted_on:
            self.submitted_on = now_datetime()

        if self.status in {"In Review", "Assigned", "In Progress", "Outcome Ready"} and not self.reviewed_on:
            self.reviewed_on = now_datetime()

        if self.status in {"Closed", "Cancelled"} and not self.closed_on:
            self.closed_on = now_datetime()
