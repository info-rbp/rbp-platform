from unittest import TestCase
from types import SimpleNamespace
from unittest.mock import patch

from rbp_app import hooks
from rbp_app.www.portal.apps import app as portal_app_detail


class TestPortalAppRoutes(TestCase):
    def test_portal_app_routes_use_dedicated_pages(self):
        self.assertIn(
            {"from_route": "/portal/apps", "to_route": "portal/apps/index"},
            hooks.website_route_rules,
        )
        self.assertIn(
            {"from_route": "/portal/apps/<app_key>", "to_route": "portal/apps/app"},
            hooks.website_route_rules,
        )
        self.assertNotIn(
            {"from_route": "/portal/apps/<app_key>", "to_route": "portal/dashboard"},
            hooks.website_route_rules,
        )

    def test_hrms_detail_route_uses_dedicated_context_when_absent(self):
        with (
            patch.object(portal_app_detail, "require_login", return_value="member@example.com"),
            patch.object(portal_app_detail, "_get_app_key", return_value="hrms"),
            patch.object(portal_app_detail, "_find_app_card", return_value=None),
            patch.object(
                portal_app_detail,
                "get_app_summary",
                return_value={
                    "available": False,
                    "app_key": "hrms",
                    "summary": {},
                    "message": "HRMS is not installed.",
                },
            ),
        ):
            context = portal_app_detail.get_context(SimpleNamespace())

        self.assertTrue(context.is_hrms_detail)
        self.assertEqual(context.app_card["key"], "hrms")
        self.assertFalse(context.app_summary["available"])
        self.assertEqual(context.hrms_summary_cards, [])
        self.assertEqual(context.hrms_action_links, [])

    def test_hrms_detail_context_builds_count_cards_only(self):
        app_card = {
            "key": "hrms",
            "label": "HRMS",
            "description": "Employees, leave, attendance and payroll",
            "route": "/portal/apps/hrms",
            "enabled": True,
            "source_app": "hrms",
            "category": "People",
            "module_type": "Frappe App",
        }

        with (
            patch.object(portal_app_detail, "require_login", return_value="member@example.com"),
            patch.object(portal_app_detail, "_get_app_key", return_value="hrms"),
            patch.object(portal_app_detail, "_find_app_card", return_value=app_card),
            patch.object(
                portal_app_detail,
                "get_app_summary",
                return_value={
                    "available": True,
                    "app_key": "hrms",
                    "summary": {
                        "employees_count": 3,
                        "leave_applications_count": 4,
                        "attendance_count": 5,
                        "expense_claims_count": 6,
                        "salary_slips_count": 7,
                    },
                    "message": "HRMS summary is available.",
                },
            ),
        ):
            context = portal_app_detail.get_context(SimpleNamespace())

        self.assertTrue(context.is_hrms_detail)
        self.assertEqual([card["key"] for card in context.hrms_summary_cards], [
            "employees_count",
            "leave_applications_count",
            "attendance_count",
            "expense_claims_count",
            "salary_slips_count",
        ])
        self.assertTrue(context.hrms_action_links)
