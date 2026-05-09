"""ERPNext adapter placeholder for future operations and finance integrations."""

from rbp_app.services.apps import is_app_installed


def get_summary(user=None):
	"""Return a safe ERPNext availability summary."""

	if not is_app_installed("erpnext"):
		return {
			"available": False,
			"app_key": "erpnext",
			"summary": {},
			"message": "ERPNext is not installed.",
		}

	return {
		"available": True,
		"app_key": "erpnext",
		"summary": {},
		"message": "ERPNext summary is not implemented yet.",
	}
