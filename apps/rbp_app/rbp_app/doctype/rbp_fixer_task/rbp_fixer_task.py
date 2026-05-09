import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


TASK_STATUSES = {"Open", "In Progress", "Blocked", "Completed", "Cancelled"}
TASK_PRIORITIES = {"Low", "Medium", "High", "Critical"}


class RBPFixerTask(Document):
    """Operational task attached to a Fixer case."""

    def validate(self):
        if self.status and self.status not in TASK_STATUSES:
            frappe.throw("Invalid Fixer task status.")
        if self.priority and self.priority not in TASK_PRIORITIES:
            frappe.throw("Invalid Fixer task priority.")

        if not self.status:
            self.status = "Open"
        if not self.priority:
            self.priority = "Medium"
        if self.status == "Completed" and not self.completed_on:
            self.completed_on = now_datetime()
