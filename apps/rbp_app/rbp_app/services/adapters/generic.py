"""Generic adapter for installed apps without first-class RBP integrations."""


def get_app_summary(app_key, user=None):
	"""Return a safe placeholder summary for any installed app."""

	return {
		"available": True,
		"app_key": app_key,
		"summary": {},
		"message": "Generic app summary is not implemented yet.",
	}
