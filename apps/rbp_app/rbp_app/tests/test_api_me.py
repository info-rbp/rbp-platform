from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.api import me


class TestApiMe(TestCase):
	def test_guest_is_rejected(self):
		with patch.object(me.frappe, "session", SimpleNamespace(user="Guest"), create=True):
			with self.assertRaises(frappe.PermissionError):
				me.get_current_user()

	def test_logged_in_user_receives_roles_and_admin_flags(self):
		with (
			patch.object(me.frappe, "session", SimpleNamespace(user="manager@example.com"), create=True),
			patch.object(me.frappe, "get_roles", return_value=["Website User", "System Manager"]),
			patch.object(
				me.frappe,
				"get_value",
				side_effect=lambda doctype, name, field: {
					"full_name": "Manager Example",
					"user_type": "System User",
				}[field],
			),
		):
			result = me.get_current_user()

		self.assertEqual(result["user"], "manager@example.com")
		self.assertEqual(result["roles"], ["Website User", "System Manager"])
		self.assertTrue(result["is_system_manager"])
		self.assertTrue(result["is_admin"])
