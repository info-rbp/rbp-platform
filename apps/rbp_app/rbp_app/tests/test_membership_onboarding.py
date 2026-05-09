import json
from pathlib import Path
from unittest import TestCase


DOCTYPE_ROOT = Path(__file__).resolve().parents[1] / "rbp_app" / "doctype"


def fields(folder, filename):
    data = json.loads((DOCTYPE_ROOT / folder / filename).read_text())
    return {field["fieldname"] for field in data["fields"]}


class TestMembershipOnboardingContracts(TestCase):
    def test_membership_plan_doctype_exists_with_required_fields(self):
        plan_fields = fields("rbp_membership_plan", "rbp_membership_plan.json")
        self.assertIn("plan_code", plan_fields)
        self.assertIn("plan_name", plan_fields)
        self.assertIn("status", plan_fields)
        self.assertIn("billing_cycle", plan_fields)
        self.assertIn("amount", plan_fields)
        self.assertIn("stripe_product_id", plan_fields)
        self.assertIn("stripe_price_id", plan_fields)
        self.assertIn("included_apps", plan_fields)
        self.assertIn("included_capabilities", plan_fields)

    def test_onboarding_flow_doctype_exists_with_required_fields(self):
        flow_fields = fields("rbp_onboarding_flow", "rbp_onboarding_flow.json")
        self.assertIn("tenant", flow_fields)
        self.assertIn("business_profile", flow_fields)
        self.assertIn("user", flow_fields)
        self.assertIn("membership_plan", flow_fields)
        self.assertIn("subscription", flow_fields)
        self.assertIn("status", flow_fields)
        self.assertIn("current_step_key", flow_fields)
        self.assertIn("source_channel", flow_fields)
        self.assertIn("submitted_on", flow_fields)
        self.assertIn("completed_on", flow_fields)

    def test_onboarding_step_doctype_exists_with_required_fields(self):
        step_fields = fields("rbp_onboarding_step", "rbp_onboarding_step.json")
        self.assertIn("flow", step_fields)
        self.assertIn("tenant", step_fields)
        self.assertIn("user", step_fields)
        self.assertIn("step_key", step_fields)
        self.assertIn("step_label", step_fields)
        self.assertIn("status", step_fields)
        self.assertIn("payload_json", step_fields)

    def test_membership_service_exports_required_functions(self):
        from rbp_app.services import membership

        self.assertTrue(hasattr(membership, "list_membership_plans"))
        self.assertTrue(hasattr(membership, "start_onboarding"))
        self.assertTrue(hasattr(membership, "get_my_onboarding"))
        self.assertTrue(hasattr(membership, "update_onboarding_step"))
        self.assertTrue(hasattr(membership, "submit_onboarding"))
        self.assertTrue(hasattr(membership, "complete_onboarding"))

    def test_membership_api_exports_required_methods(self):
        from rbp_app.api import membership

        self.assertTrue(hasattr(membership, "list_membership_plans"))
        self.assertTrue(hasattr(membership, "start_onboarding"))
        self.assertTrue(hasattr(membership, "get_my_onboarding"))
        self.assertTrue(hasattr(membership, "update_onboarding_step"))
        self.assertTrue(hasattr(membership, "submit_onboarding"))
        self.assertTrue(hasattr(membership, "admin_complete_onboarding"))
