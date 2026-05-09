import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


FLOW_STATUSES = {"Draft", "In Progress", "Submitted", "Completed", "Abandoned", "Cancelled"}


class RBPOnboardingFlow(Document):
    """Tracks a user's membership/business onboarding journey."""

    def validate(self):
        if self.status and self.status not in FLOW_STATUSES:
            frappe.throw("Invalid onboarding flow status.")

        if not self.started_on:
            self.started_on = now_datetime()

        self.last_activity_on = now_datetime()
