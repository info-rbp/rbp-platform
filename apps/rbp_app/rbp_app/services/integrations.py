"""Integration status services for installed Frappe apps and RBP modules."""

from rbp_app.services.apps import KNOWN_APP_METADATA
from rbp_app.services.apps import get_enabled_platform_modules
from rbp_app.services.apps import get_installed_app_names
from rbp_app.services.apps import get_known_app_metadata


def get_integrations_status(user=None):
	"""Return a safe summary of installed apps and platform module coverage."""

	installed_apps = sorted(get_installed_app_names())
	known_apps = [app for app in installed_apps if get_known_app_metadata(app)]
	unknown_apps = [app for app in installed_apps if not get_known_app_metadata(app)]
	platform_modules = get_enabled_platform_modules(user)

	return {
		"installed_apps": installed_apps,
		"installed_app_count": len(installed_apps),
		"known_apps": known_apps,
		"known_app_count": len(known_apps),
		"unknown_apps": unknown_apps,
		"unknown_app_count": len(unknown_apps),
		"platform_modules": platform_modules,
		"platform_module_count": len(platform_modules),
		"known_first_class_apps": sorted(KNOWN_APP_METADATA),
	}
