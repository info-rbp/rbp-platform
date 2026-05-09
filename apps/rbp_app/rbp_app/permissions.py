"""Shared permission helpers for the RBP platform layer."""

import frappe


def _current_session_user():
	"""Return the current Frappe session user, defaulting safely to Guest."""

	try:
		return getattr(frappe.session, "user", None) or "Guest"
	except RuntimeError:
		return "Guest"


def get_user_roles(user=None):
	"""Return Frappe roles for the supplied user or current session user."""

	user = user or _current_session_user()
	if user == "Guest":
		return ["Guest"]

	roles = frappe.get_roles(user) or []
	if user == "Administrator" and "Administrator" not in roles:
		roles.append("Administrator")

	return roles


def is_guest(user=None):
	"""Return whether the supplied user or current session user is Guest."""

	return (user or _current_session_user()) == "Guest"


def require_login():
	"""Require an authenticated Frappe website/API session."""

	if is_guest():
		raise frappe.PermissionError

	return _current_session_user()


def is_system_manager(user=None):
	"""Return whether the supplied user or current session user is a System Manager."""

	user = user or _current_session_user()
	return user == "Administrator" or "System Manager" in get_user_roles(user)


def require_system_manager():
	"""Require the current user to have the System Manager role."""

	require_login()
	if not is_system_manager():
		raise frappe.PermissionError

	return _current_session_user()


def is_admin_user(user=None):
	"""Return whether the supplied user or current session user is an admin/system user."""

	return is_system_manager(user)
