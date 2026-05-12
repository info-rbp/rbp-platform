from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

from rbp_app.services import environment


class TestRuntimeEnvironmentFlags(TestCase):
	def test_defaults_are_safe_for_frontend(self):
		with (
			patch.dict(environment.os.environ, {}, clear=True),
			patch.object(environment.frappe, "conf", {}, create=True),
		):
			payload = environment.get_safe_public_runtime_config()

		self.assertEqual(payload["environment"], "local")
		self.assertFalse(payload["stripe"]["enabled"])
		self.assertEqual(payload["stripe"]["mode"], "test")
		self.assertTrue(payload["email"]["sandbox_mode"])
		self.assertFalse(payload["features"]["application_provisioning"])
		self.assertTrue(payload["features"]["application_interest"])
		self.assertTrue(payload["features"]["admin_applications"])

	def test_environment_variables_override_site_config(self):
		with (
			patch.dict(
				environment.os.environ,
				{
					"RBP_ENVIRONMENT": "qa",
					"RBP_ENABLE_STRIPE": "true",
					"RBP_STRIPE_MODE": "test",
					"RBP_ENABLE_EMAIL_NOTIFICATIONS": "true",
					"RBP_EMAIL_SANDBOX_MODE": "true",
					"RBP_ENABLE_APPLICATION_PROVISIONING": "false",
					"RBP_ENABLE_APPLICATION_INTEREST": "true",
					"RBP_ENABLE_ADMIN_APPLICATIONS": "true",
				},
				clear=True,
			),
			patch.object(
				environment.frappe,
				"conf",
				{"rbp_environment": "production", "rbp_enable_stripe": "false"},
				create=True,
			),
		):
			settings = environment.get_runtime_settings()

		self.assertEqual(settings.environment, "qa")
		self.assertTrue(settings.enable_stripe)
		self.assertEqual(settings.stripe_mode, "test")
		self.assertTrue(settings.enable_email_notifications)
		self.assertTrue(settings.email_sandbox_mode)
		self.assertFalse(settings.enable_application_provisioning)
		self.assertTrue(settings.enable_application_interest)
		self.assertTrue(settings.enable_admin_applications)

	def test_site_config_supports_lowercase_keys(self):
		conf = SimpleNamespace(
			rbp_environment="staging",
			rbp_enable_stripe="1",
			rbp_stripe_mode="live",
			rbp_enable_application_provisioning="yes",
		)

		with (
			patch.dict(environment.os.environ, {}, clear=True),
			patch.object(environment.frappe, "conf", conf, create=True),
		):
			settings = environment.get_runtime_settings()

		self.assertEqual(settings.environment, "staging")
		self.assertTrue(settings.enable_stripe)
		self.assertEqual(settings.stripe_mode, "live")
		self.assertTrue(settings.enable_application_provisioning)

	def test_public_payload_does_not_expose_secret_like_keys(self):
		with (
			patch.dict(
				environment.os.environ,
				{"RBP_STRIPE_SECRET_KEY": "sk_test_secret", "RBP_ENABLE_STRIPE": "true"},
				clear=True,
			),
			patch.object(environment.frappe, "conf", {}, create=True),
		):
			payload = environment.get_safe_public_runtime_config()

		self.assertNotIn("RBP_STRIPE_SECRET_KEY", str(payload))
		self.assertNotIn("sk_test_secret", str(payload))
