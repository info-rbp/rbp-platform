import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


class RBPFileReference(Document):
    """Tenant-aware reference to a Frappe File record."""

    def validate(self):
        if not self.uploaded_by:
            self.uploaded_by = frappe.session.user

        if not self.owner_user:
            self.owner_user = self.uploaded_by

        if not self.uploaded_on:
            self.uploaded_on = now_datetime()
