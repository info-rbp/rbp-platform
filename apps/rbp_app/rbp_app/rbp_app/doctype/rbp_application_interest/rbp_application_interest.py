<<<<<<< HEAD
"""RBP Application Interest controller."""

from __future__ import annotations

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime

from rbp_app.services.applications import (
    PUBLIC_INTEREST_STATUSES,
    is_admin_user,
    validate_email,
    validate_interest_status,
    validate_source_channel,
)


class RBPApplicationInterest(Document):
    def validate(self):
        self.email = validate_email(getattr(self, "email", None))
        self.status = getattr(self, "status", None) or "new"
        self.source_channel = getattr(self, "source_channel", None) or "public_site"
        self.created_on = getattr(self, "created_on", None) or now_datetime()

        validate_interest_status(self.status)
        validate_source_channel(self.source_channel)

        application_name = getattr(self, "application", None)
        if not application_name or not frappe.db.exists("RBP Application", application_name):
            frappe.throw("A valid application is required.", frappe.ValidationError)

        application = frappe.get_doc("RBP Application", application_name)
        admin_source = self.source_channel in {"admin", "import"} and is_admin_user()
        if getattr(application, "archived", 0):
            frappe.throw("Interest is not available for archived applications.", frappe.PermissionError)
        if getattr(application, "status", None) == "disabled":
            frappe.throw("Interest is not available for disabled applications.", frappe.PermissionError)
        if not getattr(application, "interest_enabled", 0):
            frappe.throw("Interest registration is disabled for this application.", frappe.PermissionError)
        if getattr(application, "status", None) not in PUBLIC_INTEREST_STATUSES:
            frappe.throw("Interest registration is not available for this application.", frappe.PermissionError)
        if getattr(application, "visibility", None) not in {"public", "portal"} and not admin_source:
            frappe.throw("Interest registration is not available for this application.", frappe.PermissionError)

        if self.status != "new":
            user = getattr(getattr(frappe, "session", None), "user", None) or "Guest"
            if not getattr(self, "reviewed_by", None) and user != "Guest":
                self.reviewed_by = user
            if not getattr(self, "reviewed_on", None):
                self.reviewed_on = now_datetime()
=======
from frappe.model.document import Document


class RBPApplicationInterest(Document):
    pass
>>>>>>> origin/codex/implement-admin-operations-for-launch
