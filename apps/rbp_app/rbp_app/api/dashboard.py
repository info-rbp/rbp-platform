"""Dashboard APIs for the RBP portal/frontend."""

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.dashboard import get_dashboard_payload


@frappe.whitelist()
def get_home():
	"""Return the authenticated portal home payload."""

	user = require_login()
	return get_dashboard_payload(user)
