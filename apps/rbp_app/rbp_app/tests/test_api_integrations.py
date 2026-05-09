from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.api import integrations


class TestApiIntegrations(TestCase):
	def test_guest_is_rejected(self):
		with patch.object(integrations, "require_login", side_effect=frappe.PermissionError):
			with self.assertRaises(frappe.PermissionError):
				integrations.get_integrations_status()

	def test_known_app_adapter_returns_safe_response(self):
		with (
			patch.object(integrations, "require_login", return_value="member@example.com"),
			patch.object(integrations.hrms, "get_summary", return_value={"available": False, "app_key": "hrms"}),
		):
			result = integrations.get_app_summary("hrms")

		self.assertFalse(result["available"])
		self.assertEqual(result["app_key"], "hrms")

	def test_unknown_app_uses_generic_adapter(self):
		with patch.object(integrations, "require_login", return_value="member@example.com"):
			result = integrations.get_app_summary("custom_app")

		self.assertTrue(result["available"])
		self.assertEqual(result["app_key"], "custom_app")
		self.assertEqual(result["summary"], {})

	def test_missing_optional_app_is_safe(self):
		with (
			patch.object(integrations, "require_login", return_value="member@example.com"),
			patch.object(integrations.crm, "get_summary", return_value={"available": False, "app_key": "crm"}),
		):
			result = integrations.get_app_summary("crm")

		self.assertFalse(result["available"])
		self.assertEqual(result["app_key"], "crm")
