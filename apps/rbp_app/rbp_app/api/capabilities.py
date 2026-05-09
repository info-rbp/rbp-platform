"""Capability registry APIs for the RBP platform layer.

These endpoints expose capability metadata to authenticated portal/admin
consumers.

The API layer must stay thin:
- require login
- call service functions
- return dictionaries
- fail safely
- avoid business logic
- avoid registry metadata duplication

The actual capability registry lives in rbp_app.services.capabilities.
"""

from __future__ import annotations

from typing import Any

import frappe

from rbp_app.permissions import require_login
from rbp_app.services import capabilities as capabilities_service


def _success(data: Any, message: str | None = None) -> dict[str, Any]:
	"""Return a standard successful API response."""

	response = {
		"ok": True,
		"data": data,
	}

	if message:
		response["message"] = message

	return response


def _failure(message: str, data: Any | None = None) -> dict[str, Any]:
	"""Return a standard safe API failure response."""

	return {
		"ok": False,
		"data": data if data is not None else {},
		"message": message,
	}


def _safe_service_call(service_function, failure_message: str) -> dict[str, Any]:
	"""Call a capability service function and return a safe API response.

	Permission errors are intentionally re-raised so Guest users are rejected
	consistently by Frappe.

	Unexpected service errors are converted into safe structured responses so
	the frontend does not receive raw stack traces.
	"""

	require_login()

	try:
		return _success(service_function())
	except frappe.PermissionError:
		raise
	except Exception:
		return _failure(failure_message)


@frappe.whitelist()
def get_capability_registry() -> dict[str, Any]:
	"""Return the full RBP capability registry.

	The registry includes:
	- primary white-labelled modules
	- supporting backend capabilities
	- cross-app workflow metadata
	"""

	return _safe_service_call(
		capabilities_service.get_capability_registry,
		"Capability registry is unavailable.",
	)


@frappe.whitelist()
def get_primary_modules() -> dict[str, Any]:
	"""Return primary white-labelled RBP module metadata."""

	return _safe_service_call(
		capabilities_service.get_primary_modules,
		"Primary module registry is unavailable.",
	)


@frappe.whitelist()
def get_supporting_capabilities() -> dict[str, Any]:
	"""Return supporting backend capability provider metadata."""

	return _safe_service_call(
		capabilities_service.get_supporting_capabilities,
		"Supporting capability registry is unavailable.",
	)


@frappe.whitelist()
def get_cross_app_workflows() -> dict[str, Any]:
	"""Return cross-app workflow metadata.

	This endpoint returns metadata only. It does not execute workflows.
	"""

	return _safe_service_call(
		capabilities_service.get_cross_app_workflows,
		"Cross-app workflow registry is unavailable.",
	)