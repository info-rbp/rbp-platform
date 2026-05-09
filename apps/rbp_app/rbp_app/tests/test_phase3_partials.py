import json
from pathlib import Path
from unittest import TestCase


DOCTYPE_ROOT = Path(__file__).resolve().parents[1] / "rbp_app" / "doctype"


def doctype_fields(folder, filename):
    data = json.loads((DOCTYPE_ROOT / folder / filename).read_text())
    return {field["fieldname"] for field in data["fields"]}


class TestPhase3PartialDoctypeContracts(TestCase):
    def test_tenant_fields_are_expanded(self):
        fields = doctype_fields("rbp_tenant", "rbp_tenant.json")
        self.assertIn("business_profile", fields)
        self.assertIn("primary_owner", fields)
        self.assertIn("billing_account", fields)
        self.assertIn("created_from_membership", fields)
        self.assertIn("legacy_tenant_reference", fields)

    def test_subscription_fields_are_expanded(self):
        fields = doctype_fields("rbp_subscription", "rbp_subscription.json")
        self.assertIn("member", fields)
        self.assertIn("billing_cycle", fields)
        self.assertIn("provider_product_id", fields)
        self.assertIn("provider_price_id", fields)
        self.assertIn("payment_status", fields)
        self.assertIn("cancel_at_period_end", fields)
        self.assertIn("last_payment_event", fields)

    def test_entitlement_fields_are_expanded(self):
        fields = doctype_fields("rbp_app_entitlement", "rbp_app_entitlement.json")
        self.assertIn("user", fields)
        self.assertIn("entitlement_type", fields)
        self.assertIn("status", fields)
        self.assertIn("source_subscription", fields)
        self.assertIn("starts_on", fields)
        self.assertIn("ends_on", fields)

    def test_notification_fields_are_expanded(self):
        fields = doctype_fields("rbp_notification", "rbp_notification.json")
        self.assertIn("tenant", fields)
        self.assertIn("related_doctype", fields)
        self.assertIn("related_name", fields)
        self.assertIn("trigger_source", fields)
        self.assertIn("priority", fields)
        self.assertIn("delivery_channel", fields)
        self.assertIn("created_by_workflow", fields)

    def test_audit_fields_are_expanded(self):
        fields = doctype_fields("rbp_audit_log", "rbp_audit_log.json")
        self.assertIn("tenant", fields)
        self.assertIn("request_id", fields)
        self.assertIn("ip_address", fields)
        self.assertIn("user_agent", fields)
        self.assertIn("workflow_state", fields)

    def test_new_supporting_doctypes_exist(self):
        self.assertTrue((DOCTYPE_ROOT / "rbp_business_profile" / "rbp_business_profile.json").exists())
        self.assertTrue((DOCTYPE_ROOT / "rbp_tenant_member" / "rbp_tenant_member.json").exists())
        self.assertTrue((DOCTYPE_ROOT / "rbp_payment_event" / "rbp_payment_event.json").exists())
        self.assertTrue((DOCTYPE_ROOT / "rbp_file_reference" / "rbp_file_reference.json").exists())


class TestPhase3PartialServiceContracts(TestCase):
    def test_new_services_export_required_functions(self):
        from rbp_app.services import audit, entitlements, files, notifications, billing

        self.assertTrue(hasattr(audit, "record_audit_event"))
        self.assertTrue(hasattr(entitlements, "user_has_entitlement"))
        self.assertTrue(hasattr(entitlements, "require_entitlement"))
        self.assertTrue(hasattr(files, "create_file_reference"))
        self.assertTrue(hasattr(files, "list_file_references"))
        self.assertTrue(hasattr(notifications, "create_notification"))
        self.assertTrue(hasattr(notifications, "mark_notification_read"))
        self.assertTrue(hasattr(billing, "record_payment_event"))
