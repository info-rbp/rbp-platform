import unittest
from unittest.mock import patch

import frappe

from rbp_app.services import portal


class TestPortalServiceActivity(unittest.TestCase):
    def test_guest_denied(self):
        with self.assertRaises(frappe.PermissionError):
            portal.get_my_service_activity("Guest")

    def test_customer_sees_own_and_not_other(self):
        with (
            patch("rbp_app.services.portal.doctype_exists", return_value=True),
            patch("rbp_app.services.portal.get_current_tenant_name", return_value="TEN-1"),
            patch("rbp_app.services.portal.is_admin_user", return_value=False),
            patch("rbp_app.services.portal._existing_fields", return_value={"name", "owner_user", "tenant", "status", "submitted_on", "modified", "title"}),
            patch("rbp_app.services.portal.frappe.get_all", return_value=[
                {"name": "A", "owner_user": "owner@example.com", "status": "Submitted", "submitted_on": "2026-01-01", "modified": "2026-01-01", "title": "Own"},
                {"name": "B", "owner_user": "other@example.com", "status": "Submitted", "submitted_on": "2026-01-01", "modified": "2026-01-01", "title": "Other"},
            ]),
        ):
            result = portal.get_my_service_activity("owner@example.com")
            self.assertTrue(any(r["name"] == "A" for r in result["records"]))
            self.assertFalse(any(r["name"] == "B" for r in result["records"]))

    def test_admin_can_see_all(self):
        with (
            patch("rbp_app.services.portal.doctype_exists", return_value=True),
            patch("rbp_app.services.portal.get_current_tenant_name", return_value="TEN-1"),
            patch("rbp_app.services.portal.is_admin_user", return_value=True),
            patch("rbp_app.services.portal._existing_fields", return_value={"name", "owner", "status", "creation", "modified"}),
            patch("rbp_app.services.portal.frappe.get_all", return_value=[{"name": "A", "owner": "u1", "status": "Submitted", "creation": "2026-01-01", "modified": "2026-01-01"}]),
        ):
            result = portal.get_my_service_activity("admin@example.com")
            self.assertGreaterEqual(result["count"], 1)

    def test_missing_optional_doctype_does_not_crash(self):
        with (
            patch("rbp_app.services.portal.doctype_exists", side_effect=lambda d: d == "RBP Decision Desk Request"),
            patch("rbp_app.services.portal.get_current_tenant_name", return_value="TEN-1"),
            patch("rbp_app.services.portal.is_admin_user", return_value=False),
            patch("rbp_app.services.portal._existing_fields", return_value={"name", "owner_user", "status", "modified"}),
            patch("rbp_app.services.portal.frappe.get_all", return_value=[]),
        ):
            result = portal.get_my_service_activity("owner@example.com")
            self.assertIn("records", result)

    def test_missing_optional_fields_do_not_crash(self):
        with (
            patch("rbp_app.services.portal.doctype_exists", return_value=True),
            patch("rbp_app.services.portal.get_current_tenant_name", return_value="TEN-1"),
            patch("rbp_app.services.portal.is_admin_user", return_value=False),
            patch("rbp_app.services.portal._existing_fields", return_value={"name", "tenant", "owner", "modified"}),
            patch("rbp_app.services.portal.frappe.get_all", return_value=[{"name": "A", "tenant": "TEN-1", "owner": "owner@example.com", "modified": "2026-01-01"}]),
        ):
            result = portal.get_my_service_activity("owner@example.com")
            self.assertEqual(result["records"][0]["name"], "A")

    def test_customer_skips_doctype_without_tenant_protection(self):
        with (
            patch("rbp_app.services.portal.doctype_exists", return_value=True),
            patch("rbp_app.services.portal.get_current_tenant_name", return_value="TEN-1"),
            patch("rbp_app.services.portal.is_admin_user", return_value=False),
            patch("rbp_app.services.portal._existing_fields", return_value={"name", "owner", "modified"}),
            patch("rbp_app.services.portal.frappe.get_all") as get_all,
        ):
            result = portal.get_my_service_activity("owner@example.com")
            self.assertEqual(result["records"], [])
            get_all.assert_not_called()


if __name__ == "__main__":
    unittest.main()
