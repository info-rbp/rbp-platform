import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


PAYMENT_STATES = {
    "Not Required",
    "Pending",
    "Authorised",
    "Paid",
    "Failed",
    "Refunded",
    "Cancelled",
    "Disputed",
}


class RBPPaymentEvent(Document):
    """Idempotent payment-provider event record."""

    def validate(self):
        if self.status and self.status not in PAYMENT_STATES:
            frappe.throw("Invalid payment event status.")

        if not self.processed_on:
            self.processed_on = now_datetime()
