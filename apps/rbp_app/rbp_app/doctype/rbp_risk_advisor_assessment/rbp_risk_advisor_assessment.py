import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


ASSESSMENT_STATUSES = {
    "Draft",
    "Submitted",
    "In Review",
    "Reviewed",
    "Closed",
    "Cancelled",
}

RISK_LEVELS = {"Low", "Medium", "High", "Critical"}


class RBPRiskAdvisorAssessment(Document):
    """Tenant-scoped Risk Advisor assessment."""

    def validate(self):
        if self.status and self.status not in ASSESSMENT_STATUSES:
            frappe.throw("Invalid Risk Advisor assessment status.")
        if self.risk_level and self.risk_level not in RISK_LEVELS:
            frappe.throw("Invalid Risk Advisor assessment risk level.")

        if not self.status:
            self.status = "Draft"
        if not self.workflow_state:
            self.workflow_state = self.status

        if self.status == "Submitted" and not self.submitted_on:
            self.submitted_on = now_datetime()
        if self.status in {"In Review", "Reviewed"} and not self.reviewed_on:
            self.reviewed_on = now_datetime()
        if self.status in {"Closed", "Cancelled"} and not self.closed_on:
            self.closed_on = now_datetime()
