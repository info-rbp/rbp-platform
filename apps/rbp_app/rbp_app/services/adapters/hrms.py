"""HRMS adapter for safe people-module summaries."""

import frappe

from rbp_app.services.apps import is_app_installed


SUMMARY_DOCTYPES = {
	"employees_count": "Employee",
	"leave_applications_count": "Leave Application",
	"attendance_count": "Attendance",
	"expense_claims_count": "Expense Claim",
	"salary_slips_count": "Salary Slip",
}


def _doctype_exists(doctype):
	try:
		return bool(frappe.db.exists("DocType", doctype))
	except Exception:
		return False


def _can_read(doctype, user=None):
	try:
		return bool(frappe.has_permission(doctype, "read", user=user))
	except TypeError:
		try:
			return bool(frappe.has_permission(doctype, ptype="read", user=user))
		except Exception:
			return False
	except Exception:
		return False


def _unavailable(message):
	return {
		"available": False,
		"app_key": "hrms",
		"summary": {},
		"message": message,
	}


def is_available():
	"""Return whether HRMS and the minimum HRMS DocTypes are available."""

	return is_app_installed("hrms") and _doctype_exists("Employee")


def _get_count_summary(user=None, doctypes=None):
	if not is_app_installed("hrms"):
		return _unavailable("HRMS is not installed.")

	doctypes = doctypes or SUMMARY_DOCTYPES
	missing_doctypes = [doctype for doctype in doctypes.values() if not _doctype_exists(doctype)]
	if missing_doctypes:
		return _unavailable("HRMS summary is unavailable because required DocTypes are missing.")

	inaccessible_doctypes = [doctype for doctype in doctypes.values() if not _can_read(doctype, user)]
	if inaccessible_doctypes:
		return _unavailable("HRMS summary is unavailable for the current user.")

	try:
		summary = {key: frappe.db.count(doctype) for key, doctype in doctypes.items()}
	except Exception:
		return _unavailable("HRMS summary is unavailable.")

	return {
		"available": True,
		"app_key": "hrms",
		"summary": summary,
		"message": "HRMS summary is available.",
	}


def get_employee_summary(user=None):
	"""Return a safe employee aggregate without exposing employee records."""

	return _get_count_summary(user, {"employees_count": "Employee"})


def get_leave_summary(user=None):
	"""Return a safe leave aggregate without exposing leave details."""

	return _get_count_summary(user, {"leave_applications_count": "Leave Application"})


def get_summary(user=None):
	"""Return the combined safe HRMS adapter summary."""

	return _get_count_summary(user)
