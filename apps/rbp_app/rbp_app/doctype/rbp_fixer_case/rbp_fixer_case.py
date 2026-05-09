import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


CASE_STATUSES = {
    "Draft",
    "Submitted",
    "Triage",
    "Assigned",
    "In Progress",
    "Waiting on Customer",
    "Resolved",
    "Closed",
    "Cancelled",
}

URGENCY_VALUES = {"Low", "Medium", "High", "Critical"}
IMPACT_VALUES = {"Low", "Medium", "High", "Business Critical"}


class RBPFixerCase(Document):
    """Tenant-scoped support/fixer case managed from Frappe Desk."""

    def validate(self):
        if self.status and self.status not in CASE_STATUSES:
            frappe.throw("Invalid Fixer case status.")
        if self.urgency and self.urgency not in URGENCY_VALUES:
            frappe.throw("Invalid Fixer case urgency.")
        if self.impact and self.impact not in IMPACT_VALUES:
            frappe.throw("Invalid Fixer case impact.")

        if not self.status:
            self.status = "Draft"
        if not self.workflow_state:
            self.workflow_state = self.status
        if not self.urgency:
            self.urgency = "Medium"
        if not self.impact:
            self.impact = "Medium"

        if self.status == "Submitted" and not self.submitted_on:
            self.submitted_on = now_datetime()
        if self.status in {"Triage", "Assigned", "In Progress", "Waiting on Customer"} and not self.reviewed_on:
            self.reviewed_on = now_datetime()
        if self.status == "Resolved" and not self.resolved_on:
            self.resolved_on = now_datetime()
        if self.status in {"Closed", "Cancelled"} and not self.closed_on:
            self.closed_on = now_datetime()
