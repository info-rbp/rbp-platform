"""Entitlement APIs for RBP platform app/capability access."""

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.entitlements import get_user_entitlements, user_has_entitlement


@frappe.whitelist()
def get_my_entitlements():
    user = require_login()
    return {"entitlements": get_user_entitlements(user)}


@frappe.whitelist()
def can_access_app(app_key):
    user = require_login()
    return {"app_key": app_key, "can_access": user_has_entitlement(app_key, user)}
