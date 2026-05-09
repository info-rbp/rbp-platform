"""Dashboard composition services for the RBP portal home."""

import frappe

from rbp_app.permissions import get_user_roles, is_admin_user, is_guest, is_system_manager
from rbp_app.services.apps import get_available_app_cards
from rbp_app.services.apps import get_enabled_platform_modules
from rbp_app.services.apps import group_app_cards_by_category
from rbp_app.services.billing import get_subscription_status
from rbp_app.services.integrations import get_integrations_status
from rbp_app.services.notifications import get_notifications


def _current_user_payload(user):
	full_name = frappe.get_value("User", user, "full_name") or user
	user_type = frappe.get_value("User", user, "user_type")
	return {
		"user": user,
		"name": user,
		"email": user,
		"full_name": full_name,
		"user_type": user_type,
		"roles": get_user_roles(user),
		"is_guest": is_guest(user),
		"is_system_manager": is_system_manager(user),
		"is_admin": is_admin_user(user),
	}


def get_quick_links(user=None):
	"""Return default portal quick links."""

	links = [
		{"label": "Dashboard", "route": "/portal/dashboard"},
		{"label": "Apps", "route": "/portal/apps"},
		{"label": "Documents", "route": "/portal/apps/documents"},
		{"label": "Notifications", "route": "/portal/apps/notifications"},
		{"label": "Support", "route": "/portal/support"},
	]

	if is_admin_user(user):
		links.append({"label": "Billing", "route": "/portal/apps/billing"})

	return links


def get_dashboard_payload(user=None):
	"""Compose the initial portal dashboard payload."""

	user = user or frappe.session.user
	available_apps = get_available_app_cards(user)
	platform_modules = get_enabled_platform_modules(user)
	return {
		"current_user": _current_user_payload(user),
		"available_apps": available_apps,
		"apps_by_category": group_app_cards_by_category(available_apps),
		"quick_links": get_quick_links(user),
		"platform_modules": platform_modules,
		"notifications": get_notifications(user),
		"billing": get_subscription_status(user),
		"integrations": get_integrations_status(user),
	}
