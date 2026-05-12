"""RBP Application Provisioning Request controller."""

from __future__ import annotations

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime

from rbp_app.services.applications import validate_provisioning_status


class RBPApplicationProvisioningRequest(Document):
    def validate(self):
        user = getattr(getattr(frappe, "session", None), "user", None) or "Guest"
        if user == "Guest":
            frappe.throw("Guest users cannot create provisioning requests.", frappe.PermissionError)

        self.status = getattr(self, "status", None) or "requested"
        self.requested_on = getattr(self, "requested_on", None) or now_datetime()
        validate_provisioning_status(self.status)

        application_name = getattr(self, "application", None)
        if not application_name or not frappe.db.exists("RBP Application", application_name):
            frappe.throw("A valid application is required.", frappe.ValidationError)

        if self.status == "approved":
            if not getattr(self, "approved_by", None):
                self.approved_by = user
            if not getattr(self, "approved_on", None):
                self.approved_on = now_datetime()

        if self.status == "provisioned" and not getattr(self, "provisioned_on", None):
            self.provisioned_on = now_datetime()
