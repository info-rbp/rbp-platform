import frappe
from frappe.model.document import Document


LISTING_STATUSES = {"Draft", "Active", "Paused", "Archived"}
VISIBILITY_VALUES = {"Private", "Tenant", "Public"}
BILLING_MODELS = {"One-off", "Recurring", "Quote"}


class RBPMarketplaceListing(Document):
    """Tenant-scoped marketplace listing."""

    def validate(self):
        if self.status and self.status not in LISTING_STATUSES:
            frappe.throw("Invalid marketplace listing status.")
        if self.visibility and self.visibility not in VISIBILITY_VALUES:
            frappe.throw("Invalid marketplace listing visibility.")
        if self.billing_model and self.billing_model not in BILLING_MODELS:
            frappe.throw("Invalid marketplace listing billing model.")
        if not self.status:
            self.status = "Draft"
        if not self.visibility:
            self.visibility = "Private"
        if not self.currency:
            self.currency = "AUD"
        if not self.billing_model:
            self.billing_model = "One-off"
