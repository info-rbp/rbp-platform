"""RBP Application Interest controller."""

from __future__ import annotations

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime

from rbp_app.services.applications import (
    INTEREST_STATUSES,
    PUBLIC_INTEREST_STATUSES,
    is_admin_user,
    validate_email,
    validate_source_channel,
)


ROLLOUT_INTEREST_STATUSES = {"Received", "In Review", "Waitlisted", "Contacted", "Closed"}


class RBPApplicationInterest(Document):
    def validate(self):
        if not getattr(self, "user", None):
            self.user = getattr(getattr(frappe, "session", None), "user", None) or "Guest"

        self.status = getattr(self, "status", None) or "new"

        if getattr(self, "email", None):
            self.email = validate_email(getattr(self, "email", None))
            if not getattr(self, "customer_email", None):
                self.customer_email = self.email

        if getattr(self, "source_channel", None):
            validate_source_channel(self.source_channel)
        else:
            self.source_channel = "portal" if getattr(self, "source", None) == "portal" else "public_site"

        if self.status not in INTEREST_STATUSES and self.status not in ROLLOUT_INTEREST_STATUSES:
            frappe.throw("Invalid interest status: {0}".format(self.status), frappe.ValidationError)

        if not getattr(self, "created_on", None):
            self.created_on = now_datetime()

        application_name = getattr(self, "application", None)
        if application_name:
            self._validate_catalog_application(application_name)

        if self.status != "new" and self.status not in {"Received"}:
            user = getattr(getattr(frappe, "session", None), "user", None) or "Guest"
            if not getattr(self, "reviewed_by", None) and user != "Guest":
                self.reviewed_by = user
            if not getattr(self, "reviewed_on", None):
                self.reviewed_on = now_datetime()

    def _validate_catalog_application(self, application_name: str) -> None:
        if not frappe.db.exists("RBP Application", application_name):
            frappe.throw("A valid application is required.", frappe.ValidationError)

        application = frappe.get_doc("RBP Application", application_name)
        if not getattr(self, "application_name", None):
            self.application_name = getattr(application, "application_name", None)
        if not getattr(self, "application_key", None):
            self.application_key = getattr(application, "application_key", None)

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
