"""Entitlement APIs for portal, admin, and member-benefit access."""

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services.entitlements import (
	admin_grant_entitlement as admin_grant_entitlement_service,
	admin_revoke_entitlement as admin_revoke_entitlement_service,
	entitlement_catalog as entitlement_catalog_service,
	grant_membership_entitlements as grant_membership_entitlements_service,
	has_entitlement as has_entitlement_service,
	list_my_entitlements as list_my_entitlements_service,
	sync_subscription_entitlements,
)


def _as_bool(value: bool | int | str | None) -> bool:
	"""Coerce Frappe request values into a safe boolean."""

	if isinstance(value, bool):
		return value

	if value is None:
		return False

	if isinstance(value, int):
		return bool(value)

	return value.strip().lower() in {"1", "true", "yes", "y", "on"}


@frappe.whitelist()
def list_my_entitlements(include_inactive: bool | int | str | None = 0) -> object:
	user = require_login()
	return list_my_entitlements_service(
		user=user,
		include_inactive=_as_bool(include_inactive),
	)


@frappe.whitelist()
def has_entitlement(app_key: str) -> dict[str, object]:
	user = require_login()
	return {
		"app_key": app_key,
		"has_entitlement": has_entitlement_service(app_key=app_key, user=user),
	}


@frappe.whitelist()
def entitlement_catalog() -> object:
	require_login()
	return entitlement_catalog_service()


@frappe.whitelist()
def admin_grant_entitlement(payload: dict[str, object] | str | None = None, **kwargs: object) -> object:
	require_system_manager()
	return admin_grant_entitlement_service(payload=payload, **kwargs)


@frappe.whitelist()
def admin_revoke_entitlement(payload: dict[str, object] | str | None = None, **kwargs: object) -> object:
	require_system_manager()
	return admin_revoke_entitlement_service(payload=payload, **kwargs)


@frappe.whitelist()
def admin_grant_membership_entitlements(subscription: str) -> dict[str, object]:
	require_system_manager()
	entitlements = grant_membership_entitlements_service(subscription=subscription)
	return {"ok": True, "entitlements": entitlements}


@frappe.whitelist()
def admin_sync_subscription_entitlements(subscription: str) -> dict[str, object]:
	require_system_manager()
	subscription_doc = frappe.get_doc("RBP Subscription", subscription)
	return {"ok": True, "result": sync_subscription_entitlements(subscription_doc)}


# Backward-compatible aliases for existing frontend/API callers.
@frappe.whitelist()
def get_my_entitlements() -> object:
	user = require_login()
	return list_my_entitlements_service(user=user)


@frappe.whitelist()
def can_access_app(app_key: str) -> dict[str, object]:
	user = require_login()
	return {
		"app_key": app_key,
		"can_access": has_entitlement_service(app_key=app_key, user=user),
	}
