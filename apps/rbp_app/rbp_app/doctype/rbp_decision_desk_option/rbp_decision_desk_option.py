import frappe
from frappe.model.document import Document


RISK_LEVELS = {"Low", "Medium", "High", "Critical"}


class RBPDecisionDeskOption(Document):
    """Decision option attached to a Decision Desk request."""

    def validate(self):
        if self.risk_level and self.risk_level not in RISK_LEVELS:
            frappe.throw("Invalid Decision Desk option risk level.")

        if not self.risk_level:
            self.risk_level = "Medium"
