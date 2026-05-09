"""Workflow registry and safe availability checks for RBP cross-app workflows.

This module exposes workflow metadata and status checks only.

It does not execute workflows.
It does not write records.
It does not send emails.
It does not create payment requests.
It does not create Drive folders.
It does not call AI services.

Real workflow execution should be added later in dedicated workflow modules after
tenant, subscription, entitlement, role and record-permission checks are mature.
"""

from __future__ import annotations

from copy import deepcopy
from typing import Any

from rbp_app.services import capabilities


def _copy(value: Any) -> Any:
	"""Return a defensive copy of workflow metadata."""

	return deepcopy(value)


def _base_response(
	workflow_key: str,
	ok: bool,
	status: str,
	message: str,
	workflow: dict[str, Any] | None = None,
	missing_apps: list[str] | None = None,
	missing_entitlements: list[str] | None = None,
	warnings: list[str] | None = None,
) -> dict[str, Any]:
	"""Return a standard workflow status response."""

	return {
		"ok": ok,
		"workflow_key": workflow_key,
		"status": status,
		"message": message,
		"workflow": _copy(workflow or {}),
		"missing_apps": missing_apps or [],
		"missing_entitlements": missing_entitlements or [],
		"warnings": warnings or [],
		"actions": [],
	}


def get_available_workflows(user: str | None = None) -> dict[str, Any]:
	"""Return all configured workflow metadata and safe availability status.

	The user argument is accepted for future entitlement-aware filtering. It is not
	used for writes or workflow execution.
	"""

	workflow_registry = capabilities.get_cross_app_workflows()

	return {
		"ok": True,
		"workflows": [
			get_workflow_status(workflow_key, user=user)
			for workflow_key in sorted(workflow_registry)
		],
		"count": len(workflow_registry),
		"message": "Workflow metadata is available.",
	}


def get_workflow_status(workflow_key: str | None, user: str | None = None) -> dict[str, Any]:
	"""Return safe status metadata for one workflow.

	The user argument is accepted for future tenant/entitlement filtering. The
	initial implementation only checks registry metadata and installed app state.
	"""

	normalised_key = capabilities.normalize_key(workflow_key)

	if not normalised_key:
		return _base_response(
			workflow_key="",
			ok=False,
			status="invalid",
			message="No workflow key was provided.",
		)

	workflow_registry = capabilities.get_cross_app_workflows()
	workflow = workflow_registry.get(normalised_key)

	if not workflow:
		return _base_response(
			workflow_key=normalised_key,
			ok=False,
			status="not_found",
			message=f"Workflow {normalised_key} is not registered.",
		)

	required_apps = workflow.get("required_apps") or []
	optional_apps = workflow.get("optional_apps") or []

	missing_required_apps = [
		app_key for app_key in required_apps if not capabilities.is_app_installed(app_key)
	]
	missing_optional_apps = [
		app_key for app_key in optional_apps if not capabilities.is_app_installed(app_key)
	]

	if missing_required_apps:
		return _base_response(
			workflow_key=normalised_key,
			ok=False,
			status="unavailable",
			message="Workflow cannot run because required apps are unavailable.",
			workflow=workflow,
			missing_apps=missing_required_apps,
			warnings=[
				"Workflow execution is not implemented yet.",
				"Entitlement checks are not implemented in the workflow registry yet.",
			],
		)

	if missing_optional_apps:
		return _base_response(
			workflow_key=normalised_key,
			ok=True,
			status="partial",
			message="Workflow metadata is available, but some optional apps are unavailable.",
			workflow=workflow,
			missing_apps=missing_optional_apps,
			warnings=[
				"Workflow execution is not implemented yet.",
				"Some optional capabilities are unavailable.",
				"Entitlement checks are not implemented in the workflow registry yet.",
			],
		)

	return _base_response(
		workflow_key=normalised_key,
		ok=True,
		status="ready",
		message="Workflow metadata is available. Execution is not implemented yet.",
		workflow=workflow,
		warnings=[
			"Workflow execution is not implemented yet.",
			"Entitlement checks are not implemented in the workflow registry yet.",
		],
	)


def get_workflows_for_app(app_key: str | None, user: str | None = None) -> dict[str, Any]:
	"""Return workflow statuses involving an app."""

	normalised_key = capabilities.normalize_key(app_key)

	if not normalised_key:
		return {
			"ok": False,
			"app_key": "",
			"workflows": [],
			"count": 0,
			"message": "No app key was provided.",
		}

	workflows = capabilities.get_workflows_for_app(normalised_key)

	return {
		"ok": True,
		"app_key": normalised_key,
		"workflows": [
			get_workflow_status(workflow["key"], user=user)
			for workflow in workflows
			if workflow.get("key")
		],
		"count": len(workflows),
		"message": f"Workflow metadata for {normalised_key} is available.",
	}


def workflow_exists(workflow_key: str | None) -> bool:
	"""Return whether a workflow is registered."""

	normalised_key = capabilities.normalize_key(workflow_key)
	if not normalised_key:
		return False

	return normalised_key in capabilities.get_cross_app_workflows()


def get_required_apps_for_workflow(workflow_key: str | None) -> list[str]:
	"""Return required apps for a workflow."""

	normalised_key = capabilities.normalize_key(workflow_key)
	if not normalised_key:
		return []

	workflow = capabilities.get_cross_app_workflows().get(normalised_key) or {}
	return list(workflow.get("required_apps") or [])


def get_optional_apps_for_workflow(workflow_key: str | None) -> list[str]:
	"""Return optional apps for a workflow."""

	normalised_key = capabilities.normalize_key(workflow_key)
	if not normalised_key:
		return []

	workflow = capabilities.get_cross_app_workflows().get(normalised_key) or {}
	return list(workflow.get("optional_apps") or [])