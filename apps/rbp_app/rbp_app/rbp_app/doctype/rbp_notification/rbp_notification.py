from frappe.model.document import Document
from frappe.utils import now_datetime


class RBPNotification(Document):
    """Portal/admin notification for RBP platform events."""

    def validate(self):
        if self.is_read and self.status == "Unread":
            self.status = "Read"

        if self.status == "Read" and not self.is_read:
            self.is_read = 1

        if self.is_read and not self.read_on:
            self.read_on = now_datetime()
