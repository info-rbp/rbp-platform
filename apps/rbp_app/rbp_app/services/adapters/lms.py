"""LMS adapter placeholder for future learning integrations."""

from rbp_app.services.apps import is_app_installed


def get_summary(user=None):
	"""Return a safe LMS availability summary."""

	if not is_app_installed("lms"):
		return {
			"available": False,
			"app_key": "lms",
			"summary": {},
			"message": "LMS is not installed.",
		}

	return {
		"available": True,
		"app_key": "lms",
		"summary": {},
		"message": "LMS summary is not implemented yet.",
	}
