import frappe
from frappe.model.document import Document


PLAN_STATUSES = {"Draft", "Active", "Inactive", "Archived"}


class RBPMembershipPlan(Document):
    """Membership plan catalogue item for RBP onboarding and billing."""

    def validate(self):
        if self.plan_code:
            self.plan_code = self.plan_code.strip().lower()

        if self.status and self.status not in PLAN_STATUSES:
            frappe.throw("Invalid membership plan status.")

        if self.amount and self.amount < 0:
            frappe.throw("Membership plan amount cannot be negative.")
