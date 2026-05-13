"""Portal activity APIs."""

import frappe

from rbp_app.permissions import require_login
from rbp_app.services import portal as service


@frappe.whitelist()
def get_my_service_activity():
    user = require_login()
    return service.get_my_service_activity(user)
