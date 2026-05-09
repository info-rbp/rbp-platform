"""Workflow metadata APIs for the RBP platform layer.

These endpoints expose safe cross-app workflow metadata and status checks to
authenticated portal/admin consumers.

The API layer must stay thin:
- require login
- validate inputs
- call workflow registry services
- return dictionaries
- fail safely
- avoid workflow execution

Important:
This module does not execute workflows.
It does not create records.
It does not send emails.
It does not create payments.
It does not create Drive folders.
It does not call AI services.

Real workflow execution should be added later, after tenant, subscription,
entitlement, role and record-permission checks are mature.
"""

from __future__ import annotations

from typing import Any

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.workflows import registry as workflow_registry


def _success(data: Any, message: str | None = None) -> dict[str, Any]:
	"""Return a standard successful API response."""

	response = {
		"ok": True,
		"data": data,
	}

	if message:
		response["message"] = message

	return response


def _failure(message: str, data: Any | None = None, status: str = "error") -> dict[str, Any]:
	"""Return a standard safe API failure response."""

	return {
		"ok": False,
		"status": status,
		"data": data if data is not None else {},
		"message": message,
	}


def _normalise_key(value: str | None) -> str:
	"""Normalise a workflow key for lookup."""

	return (value or "").strip().lower()


@frappe.whitelist()
def get_available_workflows() -> dict[str, Any]:
	"""Return workflow metadata available to the current user.

	This endpoint returns metadata/status only.

	It does not execute workflows.
	It does not perform writes.
	It does not send notifications.
	It does not create payments.
	It does not create files or folders.
	"""

	user = require_login()

	try:
		result = workflow_registry.get_available_workflows(user=user)
	except frappe.PermissionError:
		raise
	except Exception:
		return _failure(
			message="Workflow metadata is unavailable.",
			status="unavailable",
		)

	return _success(
		data=result,
		message="Workflow metadata is available.",
	)


@frappe.whitelist()
def get_workflow_status(workflow_key: str | None = None) -> dict[str, Any]:
	"""Return safe status metadata for one workflow.

	This endpoint validates the workflow key, then delegates to the workflow
	registry service.

	It does not execute the workflow.
	"""

	user = require_login()
	normalised_key = _normalise_key(workflow_key)

	if not normalised_key:
		return _failure(
			message="No workflow key was provided.",
			data=workflow_registry.get_workflow_status("", user=user),
			status="invalid",
		)

	try:
		result = workflow_registry.get_workflow_status(normalised_key, user=user)
	except frappe.PermissionError:
		raise
	except Exception:
		return _failure(
			message=f"Workflow status for {normalised_key} is unavailable.",
			status="unavailable",
		)

	return _success(
		data=result,
		message=f"Workflow status for {normalised_key} is available.",
	)