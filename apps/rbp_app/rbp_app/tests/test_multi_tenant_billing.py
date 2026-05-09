from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import MagicMock, patch

import frappe

from rbp_app.utils import auth
from rbp_app.rbp_app.doctype.rbp_account import rbp_account
from rbp_app.rbp_app.doctype.tenant import tenant as tenant_module
from rbp_app.www.portal import billing


class TestSignupOnboarding(TestCase):
    def test_signup_commits_only_after_tenant_and_account_are_created(self):
        user = SimpleNamespace(name="test@example.com", flags=SimpleNamespace(), insert=MagicMock())
        tenant = SimpleNamespace(name="test@example.com")
        account = SimpleNamespace(name="test@example.com")

        with (
            patch.object(auth, "validate_email_address", return_value="test@example.com"),
            patch.object(auth.frappe.db, "exists", return_value=False),
            patch.object(auth.frappe, "get_doc", return_value=user),
            patch.object(auth, "create_tenant_for_user", return_value=tenant) as create_tenant,
            patch.object(auth, "create_rbp_account_for_user", return_value=account) as create_account,
            patch.object(auth.frappe.db, "commit") as commit,
            patch.object(auth.frappe.db, "rollback") as rollback,
            patch.object(auth.frappe.local, "form_dict", SimpleNamespace(), create=True),
            patch.object(auth.frappe.local, "login_manager", None, create=True),
            patch.object(auth, "LoginManager") as login_manager,
        ):
            result = auth.signup("TEST@example.com", "password", "Test", "User")

        user.insert.assert_called_once_with(ignore_permissions=True)
        create_tenant.assert_called_once_with("test@example.com", "test@example.com", "Test", "User")
        create_account.assert_called_once_with(
            "test@example.com",
            "test@example.com",
            "Test",
            "User",
            tenant=tenant,
        )
        commit.assert_called_once()
        rollback.assert_not_called()
        login_manager.return_value.login.assert_called_once()
        self.assertEqual(result["redirect_to"], "/portal/dashboard")

    def test_signup_rolls_back_when_account_creation_fails(self):
        user = SimpleNamespace(name="test@example.com", flags=SimpleNamespace(), insert=MagicMock())
        tenant = SimpleNamespace(name="test@example.com")

        with (
            patch.object(auth, "validate_email_address", return_value="test@example.com"),
            patch.object(auth.frappe.db, "exists", return_value=False),
            patch.object(auth.frappe, "get_doc", return_value=user),
            patch.object(auth, "create_tenant_for_user", return_value=tenant),
            patch.object(auth, "create_rbp_account_for_user", return_value=None),
            patch.object(auth.frappe.db, "commit") as commit,
            patch.object(auth.frappe.db, "rollback") as rollback,
        ):
            with self.assertRaises(frappe.ValidationError):
                auth.signup("test@example.com", "password")

        commit.assert_not_called()
        rollback.assert_called_once()


class TestBillingCheckout(TestCase):
    def test_start_subscription_checkout_creates_payment_request_for_account(self):
        account = SimpleNamespace(name="ACC-1", payer_email="test@example.com", account_name="Test Account")
        tenant = SimpleNamespace(name="TENANT-1")
        plan = SimpleNamespace(
            name="Pro Plan",
            plan_name="Pro",
            payment_gateway="Stripe Gateway Account",
            product_price_id="price_123",
            currency="AUD",
            cost=49,
        )
        gateway_account = SimpleNamespace(
            name="Stripe Gateway Account",
            payment_gateway="Stripe-RBP",
            payment_account="Stripe Clearing - RBP",
            payment_channel="Email",
            company="Remote Business Partner",
            currency="AUD",
            message="Please complete checkout.",
        )
        gateway = SimpleNamespace(gateway_settings="Stripe Settings", gateway_controller="RBP")
        stripe_settings = SimpleNamespace(get_payment_url=MagicMock(return_value="/stripe_checkout?x=1"))
        payment_request = SimpleNamespace(name="ACC-PRQ-0001", flags=SimpleNamespace(), insert=MagicMock())

        def get_doc(doctype, name=None):
            if isinstance(doctype, dict):
                self.assertEqual(doctype["reference_doctype"], "RBP Account")
                self.assertEqual(doctype["reference_name"], "ACC-1")
                self.assertEqual(doctype["subscription_plans"][0]["plan"], "Pro Plan")
                return payment_request
            if doctype == "Subscription Plan":
                return plan
            if doctype == "Payment Gateway Account":
                return gateway_account
            if doctype == "Payment Gateway":
                return gateway
            if doctype == "Stripe Settings":
                return stripe_settings
            raise AssertionError(f"Unexpected get_doc call: {doctype} {name}")

        with (
            patch.object(billing.frappe, "session", SimpleNamespace(user="test@example.com"), create=True),
            patch.object(billing, "get_tenant_for_user", return_value=tenant),
            patch.object(billing, "_get_or_create_account", return_value=account),
            patch.object(billing, "_get_plan_amount", return_value=49),
            patch.object(billing, "nowdate", return_value="2026-04-28"),
            patch.object(billing.frappe.db, "exists", return_value=True),
            patch.object(billing.frappe, "get_doc", side_effect=get_doc),
            patch.object(billing.frappe.db, "set_value") as set_value,
            patch.object(billing.frappe.db, "commit") as commit,
        ):
            result = billing.start_subscription_checkout("Pro Plan")

        payment_request.insert.assert_called_once_with(ignore_permissions=True)
        stripe_settings.get_payment_url.assert_called_once()
        self.assertEqual(result["redirect_to"], "/stripe_checkout?x=1")
        self.assertEqual(result["payment_request"], "ACC-PRQ-0001")
        self.assertEqual(set_value.call_count, 2)
        commit.assert_called_once()


class TestTenantAccess(TestCase):
    def test_rbp_account_permission_allows_current_tenant_only(self):
        doc = SimpleNamespace(website_user="owner@example.com", tenant="TENANT-1")

        with (
            patch.object(rbp_account.frappe, "get_roles", return_value=["Website User"]),
            patch.object(rbp_account, "get_tenant_names_for_user", return_value=["TENANT-1"]),
        ):
            self.assertTrue(rbp_account.has_rbp_account_permission(doc, user="member@example.com"))

        with (
            patch.object(rbp_account.frappe, "get_roles", return_value=["Website User"]),
            patch.object(rbp_account, "get_tenant_names_for_user", return_value=["TENANT-2"]),
        ):
            self.assertFalse(rbp_account.has_rbp_account_permission(doc, user="member@example.com"))

    def test_tenant_permission_rejects_unrelated_website_user(self):
        doc = SimpleNamespace(name="TENANT-1")

        with (
            patch.object(tenant_module.frappe, "get_roles", return_value=["Website User"]),
            patch.object(tenant_module, "get_tenant_names_for_user", return_value=["TENANT-2"]),
        ):
            self.assertFalse(tenant_module.has_tenant_permission(doc, user="member@example.com"))

    def test_portal_tenant_loader_sets_setup_state_when_user_has_no_tenant(self):
        context = SimpleNamespace(path="portal/dashboard")

        with (
            patch.object(tenant_module.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
            patch.object(tenant_module, "get_tenant_for_user", return_value=None),
        ):
            result = tenant_module.load_portal_tenant(context)

        self.assertIs(result, context)
        self.assertTrue(context.portal_setup_required)
        self.assertIsNone(context.tenant)
        self.assertIsNone(context.current_tenant)


class TestSharedBenchAuthAllowlist(TestCase):
    def test_mail_does_not_claim_global_auth_routes(self):
        from mail import hooks as mail_hooks

        redirect_sources = {rule["source"] for rule in mail_hooks.website_redirects}
        self.assertNotIn("/login", redirect_sources)
        self.assertNotIn("/signup", redirect_sources)

    def test_mail_auth_allows_rbp_portal_api_methods(self):
        from mail import auth as mail_auth

        self.assertIn("/api/method/frappe.translate.get_boot_translations", mail_auth.ALLOWED_PATHS)
        self.assertIn("/api/method/rbp_app.utils.auth.signup", mail_auth.ALLOWED_PATHS)
        self.assertIn(
            "/api/method/rbp_app.www.portal.billing.start_subscription_checkout",
            mail_auth.ALLOWED_PATHS,
        )
        self.assertIn(
            "/api/method/payments.payment_gateways.doctype.stripe_settings.webhooks",
            mail_auth.ALLOWED_PATHS,
        )
