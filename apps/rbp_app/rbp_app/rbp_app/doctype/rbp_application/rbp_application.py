"""RBP Application controller."""

from __future__ import annotations

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime

from rbp_app.services.applications import (
    validate_application_provider,
    validate_application_status,
    validate_application_visibility,
    is_application_provisioning_enabled,
    normalize_key,
)


def _session_user() -> str:
    return getattr(getattr(frappe, "session", None), "user", None) or "Guest"


class RBPApplication(Document):
    def validate(self):
        if not getattr(self, "application_key", None):
            self.application_key = normalize_key(getattr(self, "application_name", ""))
        else:
            self.application_key = normalize_key(self.application_key)

        if not self.application_key:
            frappe.throw("Application key is required.", frappe.ValidationError)

        self.status = getattr(self, "status", None) or "draft"
        self.visibility = getattr(self, "visibility", None) or "admin"
        self.provider = getattr(self, "provider", None) or "manual"
        self.sort_order = getattr(self, "sort_order", None) or 0

        if getattr(self, "requires_manual_approval", None) in (None, ""):
            self.requires_manual_approval = 1
        if getattr(self, "interest_enabled", None) in (None, ""):
            self.interest_enabled = 1
        if getattr(self, "requires_subscription", None) in (None, ""):
            self.requires_subscription = 0
        if getattr(self, "archived", None) in (None, ""):
            self.archived = 0

        validate_application_status(self.status)
        validate_application_visibility(self.visibility)
        validate_application_provider(self.provider)

        if getattr(self, "provisioning_enabled", 0) and not is_application_provisioning_enabled():
            self.provisioning_enabled = 0
        if getattr(self, "provisioning_enabled", None) in (None, ""):
            self.provisioning_enabled = 0

        existing = frappe.db.exists("RBP Application", {"application_key": self.application_key})
        if existing and existing != getattr(self, "name", None):
            frappe.throw("Application key must be unique.", frappe.DuplicateEntryError)

        user = _session_user()
        if user != "Guest":
            if not getattr(self, "created_by_admin", None):
                self.created_by_admin = user
            self.updated_by_admin = user

        if getattr(self, "archived", 0):
            if not getattr(self, "archived_on", None):
                self.archived_on = now_datetime()
            if not getattr(self, "archived_by", None) and user != "Guest":
                self.archived_by = user
