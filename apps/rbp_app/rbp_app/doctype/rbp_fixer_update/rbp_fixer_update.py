import frappe
from frappe.model.document import Document


UPDATE_TYPES = {"Internal Note", "Customer Update", "Status Change", "Resolution Note"}


class RBPFixerUpdate(Document):
    """Case timeline update for internal/admin or customer-visible use."""

    def validate(self):
        if self.update_type and self.update_type not in UPDATE_TYPES:
            frappe.throw("Invalid Fixer update type.")
        if not self.update_type:
            self.update_type = "Internal Note"
        if self.visible_to_customer is None:
            self.visible_to_customer = 0
