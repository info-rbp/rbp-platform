# Copyright (c) 2026, Remote Business Partner
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

from rbp_app.rbp_app.doctype.tenant.tenant import get_tenant_names_for_user


class RBPAccount(Document):
    def validate(self):
        if self.website_user and not self.account_name:
            self.account_name = self.website_user

        if self.website_user and not self.payer_email:
            self.payer_email = self.website_user

        if not self.account_name and self.payer_email:
            self.account_name = self.payer_email

        if self.payer_email:
            self.payer_email = self.payer_email.strip().lower()


def has_rbp_account_permission(doc, user=None, permission_type=None):
    user = user or frappe.session.user
    if user == "Guest":
        return False
    if "System Manager" in frappe.get_roles(user):
        return True

    if doc.website_user == user:
        return True

    return bool(doc.tenant and doc.tenant in get_tenant_names_for_user(user))


def rbp_account_query_conditions(user=None):
    user = user or frappe.session.user
    if user == "Guest":
        return "1=0"
    if "System Manager" in frappe.get_roles(user):
        return ""

    conditions = [f"`tabRBP Account`.`website_user` = {frappe.db.escape(user)}"]
    tenant_names = get_tenant_names_for_user(user)
    if tenant_names:
        escaped = ", ".join(frappe.db.escape(tenant) for tenant in tenant_names)
        conditions.append(f"`tabRBP Account`.`tenant` in ({escaped})")

    return "(" + " or ".join(conditions) + ")"
