"""Available-app APIs for the RBP portal/frontend."""

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.apps import get_available_app_cards


@frappe.whitelist()
def get_available_apps():
	"""Return installed and role-available app cards for the current user."""

	user = require_login()
	return {
		"apps": get_available_app_cards(user),
	}
