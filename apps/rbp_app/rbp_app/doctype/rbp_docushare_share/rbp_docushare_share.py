import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


SHARE_STATUSES = {"Active", "Revoked", "Expired"}
ACCESS_LEVELS = {"View", "Comment", "Manage"}


class RBPDocuShareShare(Document):
    """Share grant for a DocuShare folder or document."""

    def validate(self):
        if self.status and self.status not in SHARE_STATUSES:
            frappe.throw("Invalid DocuShare share status.")
        if self.access_level and self.access_level not in ACCESS_LEVELS:
            frappe.throw("Invalid DocuShare access level.")
        if self.folder and self.document:
            frappe.throw("A DocuShare share can target either a folder or a document, not both.")
        if not self.folder and not self.document:
            frappe.throw("A DocuShare share must target a folder or a document.")
        if not self.share_target_user and not self.share_target_email:
            frappe.throw("A DocuShare share requires a user or email target.")
        if not self.status:
            self.status = "Active"
        if not self.access_level:
            self.access_level = "View"
        if self.status == "Revoked" and not self.revoked_on:
            self.revoked_on = now_datetime()
