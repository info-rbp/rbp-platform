"""Milestone 8 entitlement and member-benefit tests.

These tests intentionally run without a live Frappe site. They isolate the
entitlement and billing services with lightweight in-memory fakes so the
Milestone 8 business rules can be validated in CI without summoning the full
bench creature from its cave.
"""

from __future__ import annotations

import importlib
import sys
import types
from pathlib import Path
from typing import Any


APP_ROOT = Path(__file__).resolve().parents[2]

if str(APP_ROOT) not in sys.path:
	sys.path.insert(0, str(APP_ROOT))


def _install_fake_frappe() -> types.ModuleType:
	frappe = types.ModuleType("frappe")

	class ValidationError(Exception):
		pass

	class PermissionError(Exception):
		pass

	class _Session:
		user = "member@example.com"

	class _Meta:
		def __init__(self, fields: set[str]):
			self._fields = fields

		def has_field(self, fieldname: str) -> bool:
			return fieldname in self._fields

	class _FakeDoc:
		def __init__(self, data: dict[str, Any] | None = None):
			data = data or {}
			self.__dict__.update(data)
			self.doctype = data.get("doctype", getattr(self, "doctype", None))

		def as_dict(self) -> dict[str, Any]:
			return dict(self.__dict__)

		def insert(self, ignore_permissions: bool = False):
			store = frappe._store.setdefault(self.doctype, {})
			if not getattr(self, "name", None):
				self.name = f"{self.doctype}-{len(store) + 1}"
			store[self.name] = self
			return self

		def save(self, ignore_permissions: bool = False):
			store = frappe._store.setdefault(self.doctype, {})
			if not getattr(self, "name", None):
				self.name = f"{self.doctype}-{len(store) + 1}"
			store[self.name] = self
			return self

	class _FakeDB:
		def exists(self, doctype: str, filters: str | dict[str, Any]):
			if isinstance(filters, str):
				return filters if filters in frappe._store.get(doctype, {}) else None

			for name, doc in frappe._store.get(doctype, {}).items():
				if all(getattr(doc, key, None) == value for key, value in filters.items()):
					return name

			return None

		def count(self, doctype: str) -> int:
			return len(frappe._store.get(doctype, {}))

	def _match_filter(actual: Any, expected: Any) -> bool:
		if isinstance(expected, list) and len(expected) == 2 and expected[0] == "in":
			return actual in expected[1]

		return actual == expected

	def get_all(
		doctype: str,
		filters: dict[str, Any] | None = None,
		fields: list[str] | None = None,
		pluck: str | None = None,
		order_by: str | None = None,
		limit_page_length: int | None = None,
	):
		rows = []

		for doc in frappe._store.get(doctype, {}).values():
			row = doc.as_dict()

			if filters and not all(_match_filter(row.get(key), value) for key, value in filters.items()):
				continue

			if pluck:
				rows.append(row.get(pluck))
				continue

			if fields:
				rows.append({field: row.get(field) for field in fields})
			else:
				rows.append(row)

		if limit_page_length is not None:
			return rows[:limit_page_length]

		return rows

	def get_doc(doctype_or_data: str | dict[str, Any], name: str | None = None):
		if isinstance(doctype_or_data, dict):
			return _FakeDoc(doctype_or_data)

		if name is not None:
			return frappe._store[doctype_or_data][name]

		raise KeyError(doctype_or_data)

	def get_meta(doctype: str):
		fields = {
			"name",
			"tenant",
			"user",
			"app_key",
			"app_label",
			"app_category",
			"module_type",
			"entitlement_type",
			"status",
			"enabled",
			"visible_in_launcher",
			"roles_allowed",
			"starts_on",
			"ends_on",
			"source_subscription",
			"route",
			"plan_required",
			"notes",
		}
		return _Meta(fields)

	def whitelist(*args, **kwargs):
		def decorator(fn):
			return fn

		if args and callable(args[0]):
			return args[0]

		return decorator

	frappe._store = {}
	frappe.db = _FakeDB()
	frappe.session = _Session()
	frappe.ValidationError = ValidationError
	frappe.PermissionError = PermissionError
	frappe.get_doc = get_doc
	frappe.get_all = get_all
	frappe.get_meta = get_meta
	frappe.whitelist = whitelist
	frappe.log_error = lambda *args, **kwargs: None
	frappe.get_traceback = lambda: "fake traceback"

	sys.modules["frappe"] = frappe

	frappe_utils = types.ModuleType("frappe.utils")
	frappe_utils.getdate = lambda value: value
	frappe_utils.nowdate = lambda: "2026-01-01"
	sys.modules["frappe.utils"] = frappe_utils

	return frappe


def _install_fake_rbp_dependencies() -> None:
	permissions = types.ModuleType("rbp_app.permissions")
	permissions.get_user_roles = lambda user=None: ["RBP Member"]
	permissions.is_admin_user = lambda user=None: user in {"Administrator", "admin@example.com"}

	def require_system_manager():
		import frappe

		if frappe.session.user not in {"Administrator", "admin@example.com"}:
			raise frappe.PermissionError

		return frappe.session.user

	def require_login():
		import frappe

		if not frappe.session.user or frappe.session.user == "Guest":
			raise frappe.PermissionError

		return frappe.session.user

	permissions.require_system_manager = require_system_manager
	permissions.require_login = require_login
	sys.modules["rbp_app.permissions"] = permissions

	tenancy = types.ModuleType("rbp_app.services.tenancy")
	tenancy.doctype_exists = lambda doctype: True
	tenancy.get_current_tenant_name = lambda user=None: "Tenant A"

	class _Tenant:
		name = "Tenant A"

	tenancy.get_rbp_tenant_for_user = lambda user=None: _Tenant()
	sys.modules["rbp_app.services.tenancy"] = tenancy

	audit = types.ModuleType("rbp_app.services.audit")
	audit.record_audit_event = lambda *args, **kwargs: None
	sys.modules["rbp_app.services.audit"] = audit

	environment = types.ModuleType("rbp_app.services.environment")

	class _RuntimeSettings:
		enable_stripe = True
		stripe_mode = "test"
		stripe_test_mode = True

	environment.get_runtime_settings = lambda: _RuntimeSettings()
	environment.is_stripe_enabled = lambda: True
	sys.modules["rbp_app.services.environment"] = environment


def _load_modules():
	_install_fake_frappe()
	_install_fake_rbp_dependencies()

	for module_name in [
		"rbp_app.services.entitlements",
		"rbp_app.services.billing",
		"rbp_app.api.entitlements",
	]:
		sys.modules.pop(module_name, None)

	entitlements = importlib.import_module("rbp_app.services.entitlements")
	billing = importlib.import_module("rbp_app.services.billing")
	entitlements_api = importlib.import_module("rbp_app.api.entitlements")

	return sys.modules["frappe"], entitlements, billing, entitlements_api


def test_membership_grants_expected_entitlement_keys():
	frappe, entitlements, _billing, _api = _load_modules()

	subscription = frappe.get_doc(
		{
			"doctype": "RBP Subscription",
			"name": "SUB-001",
			"user": "member@example.com",
			"member": "member@example.com",
			"tenant": "Tenant A",
			"plan": "Premium Membership",
			"status": "Active",
			"payment_status": "Paid",
			"current_period_start": "2026-01-01",
			"current_period_end": "2026-12-31",
		}
	)
	subscription.insert(ignore_permissions=True)

	granted = entitlements.grant_membership_entitlements(subscription=subscription)
	granted_keys = {row["app_key"] for row in granted}

	assert set(entitlements.MEMBERSHIP_ENTITLEMENT_KEYS).issubset(granted_keys)
	assert "membership" in granted_keys
	assert "portal" in granted_keys
	assert "offers" in granted_keys
	assert "resources" in granted_keys


def test_applications_provisioning_is_never_granted_by_membership_defaults():
	frappe, entitlements, _billing, _api = _load_modules()

	subscription = frappe.get_doc(
		{
			"doctype": "RBP Subscription",
			"name": "SUB-002",
			"user": "member@example.com",
			"member": "member@example.com",
			"tenant": "Tenant A",
			"plan": "Premium Membership",
			"status": "Active",
			"payment_status": "Paid",
		}
	)
	subscription.insert(ignore_permissions=True)

	granted = entitlements.grant_membership_entitlements(subscription=subscription)
	granted_keys = {row["app_key"] for row in granted}

	assert "applications_provisioning" not in entitlements.MEMBERSHIP_ENTITLEMENT_KEYS
	assert "applications_provisioning" not in granted_keys
	assert entitlements.has_entitlement("applications_provisioning", user="member@example.com") is False


def test_admin_grant_entitlement_requires_admin_permission():
	frappe, _entitlements, _billing, entitlements_api = _load_modules()

	frappe.session.user = "member@example.com"

	try:
		entitlements_api.admin_grant_entitlement(
			payload={
				"app_key": "offers",
				"user": "member@example.com",
				"tenant": "Tenant A",
			}
		)
	except frappe.PermissionError:
		pass
	else:
		raise AssertionError("admin_grant_entitlement should require admin permission")

	frappe.session.user = "admin@example.com"
	result = entitlements_api.admin_grant_entitlement(
		payload={
			"app_key": "offers",
			"user": "member@example.com",
			"tenant": "Tenant A",
		}
	)

	assert result["ok"] is True
	assert result["entitlement"]["app_key"] == "offers"


def test_admin_revoke_entitlement_disables_and_suspends_records():
	frappe, _entitlements, _billing, entitlements_api = _load_modules()

	frappe.session.user = "admin@example.com"

	entitlements_api.admin_grant_entitlement(
		payload={
			"app_key": "resources",
			"user": "member@example.com",
			"tenant": "Tenant A",
		}
	)

	result = entitlements_api.admin_revoke_entitlement(
		payload={
			"app_key": "resources",
			"user": "member@example.com",
			"tenant": "Tenant A",
			"status": "Suspended",
		}
	)

	assert result["ok"] is True
	assert result["revoked"]
	assert result["revoked"][0]["enabled"] is False
	assert result["revoked"][0]["status"] == "Suspended"


def test_payment_success_triggers_subscription_activation_and_entitlement_grant():
	frappe, entitlements, billing, _api = _load_modules()

	subscription = frappe.get_doc(
		{
			"doctype": "RBP Subscription",
			"name": "SUB-003",
			"user": "member@example.com",
			"member": "member@example.com",
			"tenant": "Tenant A",
			"plan": "Premium Membership",
			"status": "Draft",
			"payment_status": "Pending",
		}
	)
	subscription.insert(ignore_permissions=True)

	billing.record_payment_event(
		{
			"provider_event_id": "evt_paid_001",
			"tenant": "Tenant A",
			"user": "member@example.com",
			"related_doctype": "RBP Subscription",
			"related_name": "SUB-003",
			"status": "Paid",
			"event_type": "invoice.payment_succeeded",
			"provider_customer_id": "cus_test",
			"provider_payment_id": "pi_test",
			"amount": 9900,
			"currency": "AUD",
		},
		user="member@example.com",
	)

	updated = frappe.get_doc("RBP Subscription", "SUB-003")

	assert updated.status == "Active"
	assert updated.payment_status == "Paid"
	assert entitlements.has_entitlement("membership", user="member@example.com") is True
	assert entitlements.has_entitlement("applications_provisioning", user="member@example.com") is False


def test_failed_cancelled_and_expired_subscriptions_suspend_or_revoke_entitlements():
	frappe, entitlements, billing, _api = _load_modules()

	subscription = frappe.get_doc(
		{
			"doctype": "RBP Subscription",
			"name": "SUB-004",
			"user": "member@example.com",
			"member": "member@example.com",
			"tenant": "Tenant A",
			"plan": "Premium Membership",
			"status": "Active",
			"payment_status": "Paid",
		}
	)
	subscription.insert(ignore_permissions=True)

	entitlements.grant_membership_entitlements(subscription=subscription)

	failed_event = frappe.get_doc(
		{
			"doctype": "RBP Payment Event",
			"name": "PAY-FAILED-001",
			"related_doctype": "RBP Subscription",
			"related_name": "SUB-004",
			"status": "Failed",
			"provider_customer_id": "cus_test",
			"provider_payment_id": "pi_failed",
		}
	)
	failed_event.insert(ignore_permissions=True)

	billing.update_subscription_from_payment_event(failed_event)
	updated = frappe.get_doc("RBP Subscription", "SUB-004")

	assert updated.status == "Past Due"
	assert entitlements.has_entitlement("membership", user="member@example.com") is False

	updated.status = "Cancelled"
	updated.payment_status = "Cancelled"
	updated.save(ignore_permissions=True)

	cancelled = entitlements.sync_subscription_entitlements(updated)
	assert cancelled["action"] == "suspended"
	assert all(row["status"] == "Cancelled" for row in cancelled["entitlements"])

	updated.status = "Expired"
	updated.payment_status = "Cancelled"
	updated.save(ignore_permissions=True)

	expired = entitlements.sync_subscription_entitlements(updated)
	assert expired["action"] == "suspended"


def test_portal_list_include_inactive_does_not_leak_unrelated_users():
	frappe, entitlements, _billing, entitlements_api = _load_modules()

	frappe.session.user = "admin@example.com"
	entitlements_api.admin_grant_entitlement(
		payload={
			"app_key": "offers",
			"user": "member@example.com",
			"tenant": "Tenant A",
		}
	)
	entitlements_api.admin_revoke_entitlement(
		payload={
			"app_key": "offers",
			"user": "member@example.com",
			"tenant": "Tenant A",
			"status": "Suspended",
		}
	)

	entitlements.grant_entitlement(
		app_key="resources",
		user="other@example.com",
		tenant="Tenant B",
		notes="Different user should not leak into member portal response.",
	)

	frappe.session.user = "member@example.com"
	result = entitlements_api.list_my_entitlements(include_inactive=1)

	keys = {row["app_key"] for row in result["entitlements"]}
	users = {row["user"] for row in result["entitlements"]}

	assert "offers" in keys
	assert "other@example.com" not in users
	assert users == {"member@example.com"}
