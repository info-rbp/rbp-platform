from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

from rbp_app.services import signup


class TestSignupService(TestCase):
    def test_create_signup_returns_provisioned_context(self):
        provisioning = {
            "tenant": SimpleNamespace(name="TENANT-1"),
            "business_profile": SimpleNamespace(name="BUSINESS-1"),
            "subscription": SimpleNamespace(name="SUB-1"),
            "entitlements": [SimpleNamespace(name="ENT-1")],
        }

        with (
            patch.object(signup, "ensure_customer_user", return_value=SimpleNamespace(name="member@example.com")),
            patch.object(signup, "provision_customer_account", return_value=provisioning),
            patch.object(signup, "get_portal_context", return_value={"portal_ready": True}),
        ):
            result = signup.create_signup(
                {
                    "email": "member@example.com",
                    "primary_contact_name": "Member Example",
                    "business_name": "Example Business",
                }
            )

        self.assertTrue(result["ok"])
        self.assertEqual(result["tenant"], "TENANT-1")
        self.assertEqual(result["business_profile"], "BUSINESS-1")
        self.assertEqual(result["subscription"], "SUB-1")
        self.assertEqual(result["entitlements"], ["ENT-1"])
        self.assertEqual(result["context"], {"portal_ready": True})

    def test_create_or_update_account_context_returns_existing_user_context(self):
        provisioning = {
            "tenant": SimpleNamespace(name="TENANT-2"),
            "business_profile": SimpleNamespace(name="BUSINESS-2"),
            "subscription": SimpleNamespace(name="SUB-2"),
            "entitlements": [],
        }

        with (
            patch.object(signup, "provision_customer_account", return_value=provisioning),
            patch.object(signup, "get_portal_context", return_value={"portal_ready": True, "tenant": {"name": "TENANT-2"}}),
        ):
            result = signup.create_or_update_account_context(
                "member@example.com",
                {"business_name": "Example Business"},
            )

        self.assertTrue(result["ok"])
        self.assertEqual(result["user"], "member@example.com")
        self.assertEqual(result["tenant"], "TENANT-2")
        self.assertEqual(result["business_profile"], "BUSINESS-2")
        self.assertEqual(result["subscription"], "SUB-2")
        self.assertEqual(result["context"], {"portal_ready": True, "tenant": {"name": "TENANT-2"}})
