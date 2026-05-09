import json

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


STEP_STATUSES = {"Not Started", "In Progress", "Completed", "Skipped", "Blocked"}


class RBPOnboardingStep(Document):
    """Individual step state for an onboarding flow."""

    def validate(self):
        if self.status and self.status not in STEP_STATUSES:
            frappe.throw("Invalid onboarding step status.")

        if self.payload_json:
            try:
                json.loads(self.payload_json)
            except Exception:
                frappe.throw("Payload JSON must be valid JSON.")

        if self.status == "In Progress" and not self.started_on:
            self.started_on = now_datetime()

        if self.status == "Completed" and not self.completed_on:
            self.completed_on = now_datetime()
