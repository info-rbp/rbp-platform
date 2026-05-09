import frappe
from frappe.model.document import Document


SUBSCRIPTION_STATUSES = {"Draft", "Trial", "Active", "Past Due", "Suspended", "Cancelled", "Archived"}
PAYMENT_STATES = {"Not Required", "Pending", "Authorised", "Paid", "Failed", "Refunded", "Cancelled", "Disputed"}


class RBPSubscription(Document):
    """Subscription state for an RBP tenant."""

    def validate(self):
        if self.status and self.status not in SUBSCRIPTION_STATUSES:
            frappe.throw("Invalid subscription status.")

        if self.payment_status and self.payment_status not in PAYMENT_STATES:
            frappe.throw("Invalid payment status.")

        if self.provider_customer_id:
            self.provider_customer_id = self.provider_customer_id.strip()

        if self.provider_subscription_id:
            self.provider_subscription_id = self.provider_subscription_id.strip()
