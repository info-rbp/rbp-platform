"""CRM adapter placeholder for future customer and sales integrations."""

from rbp_app.services.apps import is_app_installed


def get_summary(user=None):
	"""Return a safe CRM availability summary."""

	if not is_app_installed("crm"):
		return {
			"available": False,
			"app_key": "crm",
			"summary": {},
			"message": "CRM is not installed.",
		}

	return {
		"available": True,
		"app_key": "crm",
		"summary": {},
		"message": "CRM summary is not implemented yet.",
	}
