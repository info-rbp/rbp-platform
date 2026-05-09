from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

import frappe
from frappe.exceptions import Redirect

from rbp_app import guards


class TestGuards(TestCase):
	def test_root_redirects_to_rbp_index_before_mail_redirect(self):
		with patch.object(guards, "get_request_path", return_value=""):
			with self.assertRaises(guards.TemporaryRedirect) as exc:
				guards.protect_platform_request()

		self.assertEqual(exc.exception.location, "/index")

	def test_portal_redirects_guest(self):
		self._assert_guest_redirect("portal")
		self._assert_guest_redirect("portal/dashboard")

	def test_app_redirects_guest(self):
		self._assert_guest_redirect("app")
		self._assert_guest_redirect("app/dashboard")

	def test_portal_apps_redirects_guest(self):
		self._assert_guest_redirect("portal/apps/hrms")

	def test_portal_allows_logged_in_user(self):
		context = SimpleNamespace(path="portal")
		with (
			patch.object(guards.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(guards, "get_available_app_cards", return_value=[]),
			patch.object(guards, "group_app_cards_by_category", return_value={}),
		):
			self.assertIs(guards.protect_platform_routes(context), context)

	def test_admin_redirects_guest(self):
		self._assert_guest_redirect("admin")

	def test_admin_rejects_normal_user(self):
		context = SimpleNamespace(path="admin")
		with (
			patch.object(guards.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(guards, "is_admin_user", return_value=False),
		):
			with self.assertRaises(frappe.PermissionError):
				guards.protect_platform_routes(context)

	def test_admin_allows_administrator_or_system_manager(self):
		for user in ("Administrator", "manager@example.com"):
			context = SimpleNamespace(path="admin/settings")
			with (
				patch.object(guards.frappe, "session", SimpleNamespace(user=user), create=True),
				patch.object(guards, "is_admin_user", return_value=True),
			):
				self.assertIs(guards.protect_platform_routes(context), context)

	def _assert_guest_redirect(self, path):
		context = SimpleNamespace(path=path)
		flags = SimpleNamespace()
		with (
			patch.object(guards.frappe, "session", SimpleNamespace(user="Guest"), create=True),
			patch.object(guards.frappe, "flags", flags, create=True),
		):
			with self.assertRaises(Redirect):
				guards.protect_platform_routes(context)

		self.assertTrue(flags.redirect_location.startswith("/login?"))
