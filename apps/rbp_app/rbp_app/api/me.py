"""Current-user APIs for the RBP portal/frontend."""

import frappe

from rbp_app.permissions import get_user_roles, is_admin_user, is_guest, is_system_manager, require_login


@frappe.whitelist()
def get_current_user():
	"""Return the authenticated user's profile and role flags."""

	user = require_login()
	full_name = frappe.get_value("User", user, "full_name") or user
	user_type = frappe.get_value("User", user, "user_type")
	roles = get_user_roles(user)

	return {
		"user": user,
		"name": user,
		"email": user,
		"full_name": full_name,
		"user_type": user_type,
		"roles": roles,
		"is_guest": is_guest(user),
		"is_system_manager": is_system_manager(user),
		"is_admin": is_admin_user(user),
	}
