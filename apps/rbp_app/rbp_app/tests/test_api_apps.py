from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.api import apps as apps_api
from rbp_app.services import environment


class TestApiApps(TestCase):
	def test_guest_is_rejected(self):
		with patch.object(apps_api.frappe, "session", SimpleNamespace(user="Guest"), create=True):
			with self.assertRaises(frappe.PermissionError):
				apps_api.get_available_apps()

	def test_known_unknown_and_platform_modules_are_returned(self):
		with (
			patch.object(apps_api.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(apps_api.frappe, "get_roles", return_value=["Website User"]),
			patch.object(
				apps_api.frappe,
				"get_installed_apps",
				return_value=["frappe", "erpnext", "custom_portal"],
			),
			patch.dict(environment.os.environ, {"RBP_ENABLE_APPLICATION_PROVISIONING": "true"}),
		):
			result = apps_api.get_available_apps()

		apps_by_key = {card["key"]: card for card in result["apps"]}
		self.assertEqual(apps_by_key["frappe"]["label"], "Frappe Core")
		self.assertEqual(apps_by_key["erpnext"]["category"], "Operations")
		self.assertEqual(apps_by_key["custom_portal"]["category"], "Other")
		self.assertEqual(apps_by_key["custom_portal"]["module_type"], "Frappe App")
		self.assertIn("documents", apps_by_key)
		self.assertIn("notifications", apps_by_key)
		self.assertNotIn("hrms", apps_by_key)
		self.assertNotIn("billing", apps_by_key)

	def test_billing_is_admin_only(self):
		with (
			patch.object(apps_api.frappe, "session", SimpleNamespace(user="manager@example.com"), create=True),
			patch.object(apps_api.frappe, "get_roles", return_value=["System Manager"]),
			patch.object(apps_api.frappe, "get_installed_apps", return_value=["frappe"]),
			patch.dict(environment.os.environ, {"RBP_ENABLE_APPLICATION_PROVISIONING": "false"}),
		):
			result = apps_api.get_available_apps()

		self.assertIn("billing", {card["key"] for card in result["apps"]})

	def test_application_provisioning_flag_hides_customer_app_cards(self):
		with (
			patch.object(apps_api.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(apps_api.frappe, "get_roles", return_value=["Website User"]),
			patch.object(apps_api.frappe, "get_installed_apps", return_value=["frappe", "erpnext"]),
			patch.dict(environment.os.environ, {"RBP_ENABLE_APPLICATION_PROVISIONING": "false"}),
		):
			result = apps_api.get_available_apps()

		apps_by_key = {card["key"] for card in result["apps"]}
		self.assertNotIn("frappe", apps_by_key)
		self.assertNotIn("erpnext", apps_by_key)
		self.assertIn("documents", apps_by_key)
