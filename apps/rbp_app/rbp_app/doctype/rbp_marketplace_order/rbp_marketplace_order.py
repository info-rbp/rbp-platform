import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


ORDER_STATUSES = {"Requested", "Approved", "In Progress", "Fulfilled", "Cancelled", "Rejected"}


class RBPMarketplaceOrder(Document):
    """Tenant-scoped marketplace order."""

    def validate(self):
        if self.status and self.status not in ORDER_STATUSES:
            frappe.throw("Invalid marketplace order status.")
        if not self.status:
            self.status = "Requested"
        if not self.quantity:
            self.quantity = 1
        if not self.currency:
            self.currency = "AUD"
        if not self.requested_on:
            self.requested_on = now_datetime()
