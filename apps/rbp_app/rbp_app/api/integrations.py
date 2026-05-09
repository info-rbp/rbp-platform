"""Integration status APIs for the RBP portal/frontend."""

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.adapters import (
	crm,
	drive,
	erpnext,
	gameplan,
	generic,
	helpdesk,
	hrms,
	insights,
	lending,
	lms,
)
from rbp_app.services.integrations import get_integrations_status as get_integrations_status_service


ADAPTERS = {
	"crm": crm,
	"drive": drive,
	"erpnext": erpnext,
	"gameplan": gameplan,
	"helpdesk": helpdesk,
	"hrms": hrms,
	"insights": insights,
	"lending": lending,
	"lms": lms,
}


@frappe.whitelist()
def get_integrations_status():
	"""Return installed app and RBP platform module integration status."""

	user = require_login()
	return get_integrations_status_service(user)


@frappe.whitelist()
def get_app_summary(app_key):
	"""Return an adapter summary for an installed app, with generic fallback."""

	user = require_login()
	normalized_key = (app_key or "").strip().lower()
	if not normalized_key:
		return {
			"available": False,
			"app_key": "",
			"summary": {},
			"message": "No app key was provided.",
		}

	adapter = ADAPTERS.get(normalized_key)
	if adapter:
		try:
			return adapter.get_summary(user)
		except Exception as exc:
			return {
				"available": False,
				"app_key": normalized_key,
				"summary": {},
				"message": f"App summary is unavailable: {exc}",
			}

	return generic.get_app_summary(normalized_key, user)