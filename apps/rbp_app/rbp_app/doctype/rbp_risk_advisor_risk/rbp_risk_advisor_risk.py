import frappe
from frappe.model.document import Document


RISK_STATUSES = {"Open", "Monitoring", "Mitigated", "Accepted", "Closed"}
RISK_LEVELS = {"Low", "Medium", "High", "Critical"}


class RBPRiskAdvisorRisk(Document):
    """Risk item attached to a Risk Advisor assessment."""

    def validate(self):
        if self.status and self.status not in RISK_STATUSES:
            frappe.throw("Invalid Risk Advisor risk status.")
        if self.risk_level and self.risk_level not in RISK_LEVELS:
            frappe.throw("Invalid Risk Advisor risk level.")

        if not self.status:
            self.status = "Open"
