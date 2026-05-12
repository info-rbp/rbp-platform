"""RBP Application Category controller."""

from __future__ import annotations

import frappe
from frappe.model.document import Document

from rbp_app.services.applications import normalize_key


class RBPApplicationCategory(Document):
    def validate(self):
        if not getattr(self, "category_key", None):
            self.category_key = normalize_key(getattr(self, "category_name", ""))
        else:
            self.category_key = normalize_key(self.category_key)

        if not self.category_key:
            frappe.throw("Category key is required.", frappe.ValidationError)

        self.sort_order = getattr(self, "sort_order", None) or 0
        if getattr(self, "enabled", None) in (None, ""):
            self.enabled = 1

        existing = frappe.db.exists("RBP Application Category", {"category_key": self.category_key})
        if existing and existing != getattr(self, "name", None):
            frappe.throw("Application category key must be unique.", frappe.DuplicateEntryError)
