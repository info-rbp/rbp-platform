from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.services import billing


class TestMembershipStripeMapping(TestCase):
    def test_checkout_rejects_inactive_plan(self):
        with (
            patch.object(billing, "_doctype_exists", return_value=True),
            patch.object(billing.frappe.db, "exists", return_value="premium_membership"),
            patch.object(billing.frappe, "get_doc", return_value=SimpleNamespace(status="Inactive", active=1)),
        ):
            with self.assertRaises(frappe.ValidationError):
                billing._get_membership_plan("premium_membership")

    def test_checkout_rejects_plan_without_price_id(self):
        runtime = SimpleNamespace(enable_stripe=True, stripe_mode="test", environment="qa")
        plan = SimpleNamespace(
            status="Active",
            active=1,
            stripe_price_id="",
            stripe_product_id="prod_test_replace_me",
            billing_cycle="Monthly",
            amount=99,
            currency="AUD",
            plan_code="premium_membership",
            name="premium_membership",
        )

        with (
            patch.object(billing, "get_runtime_settings", return_value=runtime),
            patch.object(billing, "get_stripe_secret_key", return_value="sk_test_123"),
            patch.object(billing, "_validate_stripe_secret_for_mode"),
            patch.object(billing, "_get_membership_plan", return_value=plan),
        ):
            with self.assertRaises(frappe.ValidationError):
                billing.create_membership_checkout_session({"plan_code": "premium_membership"}, user="member@example.com")

    def test_checkout_allows_active_plan_lookup(self):
        plan = SimpleNamespace(status="Active", active=1)

        with (
            patch.object(billing, "_doctype_exists", return_value=True),
            patch.object(billing.frappe.db, "exists", return_value="premium_membership"),
            patch.object(billing.frappe, "get_doc", return_value=plan),
        ):
            result = billing._get_membership_plan("premium_membership")

        self.assertIs(result, plan)
