import json

import frappe
from frappe.model.document import Document


class RBPAuditLog(Document):
    """Append-only operational audit record for RBP platform events."""

    def validate(self):
        if self.metadata_json:
            try:
                json.loads(self.metadata_json)
            except Exception:
                frappe.throw("Metadata JSON must be valid JSON.")

    def before_delete(self):
        frappe.throw("Audit logs cannot be deleted.")
