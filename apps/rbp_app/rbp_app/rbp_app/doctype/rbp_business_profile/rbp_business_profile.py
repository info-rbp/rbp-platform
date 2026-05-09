import frappe
from frappe.model.document import Document


class RBPBusinessProfile(Document):
    """Business identity and onboarding profile for an RBP tenant."""

    def validate(self):
        if self.email:
            self.email = self.email.strip().lower()

        if self.website:
            self.website = self.website.strip()

        if self.status not in {"Draft", "Active", "Archived"}:
            frappe.throw("Invalid business profile status.")
