import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


ACTION_STATUSES = {"Open", "In Progress", "Completed", "Cancelled"}


class RBPRiskAdvisorAction(Document):
    """Mitigation action attached to a Risk Advisor risk."""

    def validate(self):
        if self.status and self.status not in ACTION_STATUSES:
            frappe.throw("Invalid Risk Advisor action status.")

        if not self.status:
            self.status = "Open"

        if self.status == "Completed" and not self.completed_on:
            self.completed_on = now_datetime()
