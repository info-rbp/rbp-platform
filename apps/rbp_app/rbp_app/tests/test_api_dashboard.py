from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.api import dashboard


class TestApiDashboard(TestCase):
	def test_guest_is_rejected(self):
		with patch.object(dashboard, "require_login", side_effect=frappe.PermissionError):
			with self.assertRaises(frappe.PermissionError):
				dashboard.get_home()

	def test_logged_in_user_receives_dashboard_payload(self):
		payload = {
			"current_user": {"user": "member@example.com"},
			"available_apps": [{"key": "frappe"}],
			"apps_by_category": {"Platform": [{"key": "frappe"}]},
			"quick_links": [{"label": "Dashboard"}],
			"notifications": {"notifications": [], "unread_count": 0},
			"billing": {"status": "not_configured", "billing_enabled": False},
		}

		with (
			patch.object(dashboard, "require_login", return_value="member@example.com"),
			patch.object(dashboard, "get_dashboard_payload", return_value=payload),
		):
			result = dashboard.get_home()

		self.assertEqual(result["current_user"]["user"], "member@example.com")
		self.assertIn("available_apps", result)
		self.assertIn("apps_by_category", result)
		self.assertIn("quick_links", result)
		self.assertIn("notifications", result)
		self.assertIn("billing", result)
