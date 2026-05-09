"""HRMS-facing APIs for the RBP portal/frontend."""

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.adapters import hrms


@frappe.whitelist()
def get_employee_summary():
	"""Return a safe HRMS employee summary for the authenticated user."""

	user = require_login()
	return hrms.get_employee_summary(user)


@frappe.whitelist()
def get_leave_summary():
	"""Return a safe HRMS leave summary for the authenticated user."""

	user = require_login()
	return hrms.get_leave_summary(user)


@frappe.whitelist()
def get_summary():
	"""Return a safe combined HRMS summary for the authenticated user."""

	user = require_login()
	return hrms.get_summary(user)
