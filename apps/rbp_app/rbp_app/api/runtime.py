"""Frontend-safe runtime configuration API."""

import frappe

from rbp_app.services.environment import get_safe_public_runtime_config


@frappe.whitelist(allow_guest=True)
def get_public_runtime_config():
	"""Return sanitized environment and feature flags for public UI use."""

	return get_safe_public_runtime_config()
