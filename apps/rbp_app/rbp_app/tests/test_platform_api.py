from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import MagicMock, patch

import frappe
from frappe.exceptions import Redirect

from rbp_app import guards, permissions
from rbp_app.api import apps as apps_api
from rbp_app.api import billing, dashboard, documents, hr, integrations, me, notifications
from rbp_app.services import apps as apps_service
from rbp_app.services import billing as billing_service
from rbp_app.services import notifications as notifications_service
from rbp_app.services.adapters import erpnext


class TestPlatformRouteGuards(TestCase):
	def test_customer_routes_redirect_guests_to_login(self):
		for path in ("portal", "portal/apps/hrms", "app", "app/dashboard"):
			context = SimpleNamespace(path=path)
			flags = SimpleNamespace()

			with (
				patch.object(guards.frappe, "session", SimpleNamespace(user="Guest"), create=True),
				patch.object(guards.frappe, "flags", flags, create=True),
			):
				with self.assertRaises(Redirect):
					guards.protect_platform_routes(context)

			self.assertTrue(flags.redirect_location.startswith("/login?"))
			self.assertIn("redirect-to", flags.redirect_location)

	def test_public_routes_remain_public(self):
		for path in ("", "about", "contact", "faq", "services", "resources", "membership", "login", "signup"):
			context = SimpleNamespace(path=path)
			with patch.object(guards.frappe, "session", SimpleNamespace(user="Guest"), create=True):
				self.assertIs(guards.protect_platform_routes(context), context)

	def test_admin_routes_require_admin_user(self):
		for path in ("admin", "admin/settings", "desk"):
			context = SimpleNamespace(path=path)

			with (
				patch.object(guards.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
				patch.object(guards, "is_admin_user", return_value=False),
			):
				with self.assertRaises(frappe.PermissionError):
					guards.protect_platform_routes(context)

			with (
				patch.object(guards.frappe, "session", SimpleNamespace(user="manager@example.com"), create=True),
				patch.object(guards, "is_admin_user", return_value=True),
			):
				self.assertIs(guards.protect_platform_routes(context), context)

	def test_admin_routes_redirect_guests_to_login(self):
		context = SimpleNamespace(path="admin")
		flags = SimpleNamespace()

		with (
			patch.object(guards.frappe, "session", SimpleNamespace(user="Guest"), create=True),
			patch.object(guards.frappe, "flags", flags, create=True),
		):
			with self.assertRaises(Redirect):
				guards.protect_platform_routes(context)

		self.assertTrue(flags.redirect_location.startswith("/login?"))

	def test_customer_routes_add_dynamic_app_context_for_logged_in_users(self):
		context = SimpleNamespace(path="portal/dashboard")
		cards = [{"key": "crm", "label": "CRM", "category": "Sales", "enabled": True}]

		with (
			patch.object(guards.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(guards, "get_available_app_cards", return_value=cards),
			patch.object(guards, "group_app_cards_by_category", return_value={"Sales": cards}),
		):
			result = guards.protect_platform_routes(context)

		self.assertIs(result, context)
		self.assertEqual(context.portal_available_apps, cards)
		self.assertEqual(context.portal_apps_by_category, {"Sales": cards})


class TestPlatformPermissions(TestCase):
	def test_require_login_rejects_guest(self):
		with patch.object(permissions.frappe, "session", SimpleNamespace(user="Guest"), create=True):
			with self.assertRaises(frappe.PermissionError):
				permissions.require_login()

	def test_is_system_manager_uses_roles(self):
		with patch.object(permissions.frappe, "get_roles", return_value=["Website User", "System Manager"]):
			self.assertTrue(permissions.is_system_manager("admin@example.com"))

	def test_administrator_is_admin_user(self):
		with patch.object(permissions.frappe, "get_roles", return_value=[]):
			self.assertTrue(permissions.is_admin_user("Administrator"))


class TestCurrentUserApi(TestCase):
	def test_get_current_user_returns_session_payload(self):
		with (
			patch.object(me.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(me.frappe, "get_roles", return_value=["Website User"]),
			patch.object(
				me.frappe,
				"get_value",
				side_effect=lambda doctype, name, field: {
					"full_name": "Member Example",
					"user_type": "Website User",
				}[field],
			),
		):
			result = me.get_current_user()

		self.assertEqual(result["user"], "member@example.com")
		self.assertEqual(result["name"], "member@example.com")
		self.assertEqual(result["email"], "member@example.com")
		self.assertEqual(result["full_name"], "Member Example")
		self.assertEqual(result["roles"], ["Website User"])
		self.assertEqual(result["user_type"], "Website User")
		self.assertFalse(result["is_guest"])
		self.assertFalse(result["is_system_manager"])
		self.assertFalse(result["is_admin"])


class TestAvailableAppsApi(TestCase):
	def test_get_available_apps_returns_known_unknown_and_platform_cards(self):
		with (
			patch.object(apps_api.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(
				apps_api.frappe,
				"get_installed_apps",
				return_value=["frappe", "rbp_app", "erpnext", "custom_portal"],
			),
			patch.object(apps_api.frappe, "get_roles", return_value=["Website User"]),
		):
			result = apps_api.get_available_apps()

		apps_by_key = {app["key"]: app for app in result["apps"]}
		self.assertIn("frappe", apps_by_key)
		self.assertIn("erpnext", apps_by_key)
		self.assertIn("custom_portal", apps_by_key)
		self.assertIn("documents", apps_by_key)
		self.assertIn("notifications", apps_by_key)
		self.assertNotIn("billing", apps_by_key)
		self.assertEqual(apps_by_key["erpnext"]["label"], "ERPNext")
		self.assertEqual(apps_by_key["custom_portal"]["category"], "Other")
		self.assertEqual(apps_by_key["custom_portal"]["module_type"], "Frappe App")
		self.assertEqual(apps_by_key["custom_portal"]["source_app"], "custom_portal")
		self.assertEqual(apps_by_key["documents"]["module_type"], "RBP Platform Module")
		self.assertEqual(apps_by_key["documents"]["route"], "/portal/apps/documents")

	def test_missing_hrms_does_not_crash_app_discovery(self):
		with (
			patch.object(apps_api.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(apps_api.frappe, "get_installed_apps", return_value=["frappe", "rbp_app"]),
			patch.object(apps_api.frappe, "get_roles", return_value=["Website User"]),
		):
			result = apps_api.get_available_apps()

		self.assertNotIn("hrms", {app["key"] for app in result["apps"]})

	def test_group_app_cards_by_category(self):
		grouped = apps_service.group_app_cards_by_category(
			[
				{"key": "hrms", "category": "People"},
				{"key": "custom_app", "category": "Made Up"},
			]
		)

		self.assertEqual(grouped["People"][0]["key"], "hrms")
		self.assertEqual(grouped["Other"][0]["key"], "custom_app")

	def test_entitlement_records_can_drive_app_cards(self):
		rows = [
			{
				"tenant": None,
				"app_key": "crm",
				"app_label": "CRM",
				"source_app": "crm",
				"app_category": "Sales",
				"module_type": "Frappe App",
				"enabled": 1,
				"visible_in_launcher": 1,
				"route": "/portal/apps/crm",
				"roles_allowed": None,
				"plan_required": None,
			}
		]

		with (
			patch.object(apps_service, "_entitlement_records_exist", return_value=True),
			patch.object(apps_service, "_get_user_tenant", return_value=None),
			patch.object(apps_service.frappe, "get_all", return_value=rows),
			patch.object(apps_service, "is_app_installed", return_value=True),
			patch.object(apps_service, "is_admin_user", return_value=False),
		):
			result = apps_service.get_available_app_cards("member@example.com")

		self.assertEqual(result[0]["key"], "crm")
		self.assertTrue(result[0]["enabled"])

	def test_get_available_apps_returns_billing_for_system_manager(self):
		with (
			patch.object(apps_api.frappe, "session", SimpleNamespace(user="manager@example.com"), create=True),
			patch.object(apps_api.frappe, "get_installed_apps", return_value=["frappe", "rbp_app", "erpnext"]),
			patch.object(apps_api.frappe, "get_roles", return_value=["System Manager"]),
		):
			result = apps_api.get_available_apps()

		keys = {app["key"] for app in result["apps"]}
		self.assertIn("erpnext", keys)
		self.assertIn("billing", keys)


class TestDashboardApi(TestCase):
	def test_get_home_returns_expected_payload(self):
		with (
			patch.object(dashboard, "require_login", return_value="member@example.com"),
			patch.object(dashboard.frappe, "get_installed_apps", return_value=["frappe", "rbp_app"]),
			patch.object(dashboard.frappe, "get_roles", return_value=["Website User"]),
			patch.object(
				dashboard.frappe,
				"get_value",
				side_effect=lambda doctype, name, field: {
					"full_name": "Member Example",
					"user_type": "Website User",
				}[field],
			),
		):
			result = dashboard.get_home()

		self.assertEqual(result["current_user"]["user"], "member@example.com")
		self.assertIn("available_apps", result)
		self.assertIn("apps_by_category", result)
		self.assertIn("quick_links", result)
		self.assertIn("platform_modules", result)
		self.assertIn("notifications", result)
		self.assertIn("billing", result)
		self.assertIn("integrations", result)


class TestPlaceholderApis(TestCase):
	def test_billing_documents_and_notifications_return_dicts(self):
		with patch.object(billing, "require_login", return_value="member@example.com"):
			billing_result = billing.get_subscription_status()

		with patch.object(documents, "require_login", return_value="member@example.com"):
			documents_result = documents.get_documents()

		with patch.object(notifications, "require_login", return_value="member@example.com"):
			notifications_result = notifications.get_notifications()

		self.assertEqual(set(billing_result), {"status", "plan", "message", "billing_enabled"})
		self.assertEqual(set(documents_result), {"documents", "count", "module_enabled"})
		self.assertEqual(set(notifications_result), {"notifications", "unread_count"})

	def test_billing_service_uses_subscription_when_available(self):
		subscription = {
			"name": "RBP-SUB-0001",
			"tenant": "TENANT-1",
			"status": "Active",
			"plan": "Pro",
			"billing_provider": "Manual",
			"current_period_start": None,
			"current_period_end": None,
		}

		with (
			patch.object(billing_service, "_doctype_exists", return_value=True),
			patch.object(billing_service, "_get_user_tenant", return_value="TENANT-1"),
			patch.object(billing_service.frappe, "db", SimpleNamespace(count=MagicMock(return_value=1)), create=True),
			patch.object(billing_service.frappe, "get_all", return_value=[subscription]),
		):
			result = billing_service.get_subscription_status("member@example.com")

		self.assertTrue(result["billing_enabled"])
		self.assertEqual(result["status"], "Active")
		self.assertEqual(result["plan"], "Pro")

	def test_notifications_service_reads_current_user_notifications(self):
		rows = [
			{
				"name": "RBP-NOTIF-0001",
				"title": "Welcome",
				"message": "Hello",
				"notification_type": "Info",
				"route": "/portal",
				"is_read": 0,
				"read_on": None,
				"modified": None,
			}
		]

		with (
			patch.object(notifications_service, "_doctype_exists", return_value=True),
			patch.object(notifications_service.frappe, "get_all", return_value=rows),
			patch.object(notifications_service.frappe, "db", SimpleNamespace(count=MagicMock(return_value=1)), create=True),
		):
			result = notifications_service.get_notifications("member@example.com")

		self.assertEqual(result["unread_count"], 1)
		self.assertEqual(result["notifications"][0]["title"], "Welcome")

	def test_integrations_status_returns_counts(self):
		with (
			patch.object(integrations, "require_login", return_value="member@example.com"),
			patch.object(integrations.frappe, "get_installed_apps", return_value=["frappe", "hrms", "custom_app"]),
			patch.object(integrations.frappe, "get_roles", return_value=["Website User"]),
		):
			result = integrations.get_integrations_status()

		self.assertEqual(result["installed_app_count"], 3)
		self.assertEqual(result["known_app_count"], 2)
		self.assertEqual(result["unknown_app_count"], 1)
		self.assertEqual(result["platform_module_count"], 2)

	def test_generic_app_summary_endpoint_returns_placeholder(self):
		with patch.object(integrations, "require_login", return_value="member@example.com"):
			result = integrations.get_app_summary("custom_app")

		self.assertTrue(result["available"])
		self.assertEqual(result["app_key"], "custom_app")
		self.assertEqual(result["summary"], {})

	def test_hrms_summary_fails_safely_when_hrms_missing(self):
		with (
			patch.object(hr, "require_login", return_value="member@example.com"),
			patch.object(hr.frappe, "get_installed_apps", return_value=["frappe", "rbp_app"]),
		):
			result = hr.get_summary()

		self.assertFalse(result["available"])
		self.assertEqual(result["app_key"], "hrms")

	def test_hrms_summary_fails_safely_when_doctypes_missing(self):
		with (
			patch.object(hr, "require_login", return_value="member@example.com"),
			patch.object(hr.frappe, "get_installed_apps", return_value=["frappe", "rbp_app", "hrms"]),
			patch.object(hr.hrms, "_doctype_exists", return_value=False),
		):
			result = hr.get_employee_summary()

		self.assertFalse(result["available"])
		self.assertEqual(result["app_key"], "hrms")

	def test_hrms_app_summary_returns_aggregate_counts_only(self):
		with (
			patch.object(integrations, "require_login", return_value="member@example.com"),
			patch.object(integrations.hrms, "is_app_installed", return_value=True),
			patch.object(integrations.hrms, "_doctype_exists", return_value=True),
			patch.object(integrations.hrms, "_can_read", return_value=True),
			patch.object(
				integrations.hrms.frappe,
				"db",
				SimpleNamespace(count=MagicMock(side_effect=[3, 4, 5, 6, 7])),
				create=True,
			),
		):
			result = integrations.get_app_summary("hrms")

		self.assertTrue(result["available"])
		self.assertEqual(
			set(result["summary"]),
			{
				"employees_count",
				"leave_applications_count",
				"attendance_count",
				"expense_claims_count",
				"salary_slips_count",
			},
		)
		self.assertNotIn("employee_name", result["summary"])
		self.assertNotIn("records", result["summary"])

	def test_erpnext_placeholder_adapter_checks_installation(self):
		with patch.object(erpnext, "is_app_installed", return_value=False):
			missing = erpnext.get_summary("member@example.com")

		with patch.object(erpnext, "is_app_installed", return_value=True):
			installed = erpnext.get_summary("member@example.com")

		self.assertFalse(missing["available"])
		self.assertTrue(installed["available"])
