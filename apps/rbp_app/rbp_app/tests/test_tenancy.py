from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

from rbp_app.services import tenancy


class TestTenancyCompatibility(TestCase):
	def test_get_current_tenant_prefers_rbp_tenant(self):
		rbp_tenant = SimpleNamespace(name="RBP-TENANT-1", doctype="RBP Tenant")
		legacy_tenant = SimpleNamespace(name="TENANT-1", doctype="Tenant")

		with (
			patch.object(tenancy, "get_rbp_tenant_for_user", return_value=rbp_tenant),
			patch.object(tenancy, "get_legacy_tenant_for_user", return_value=legacy_tenant),
		):
			result = tenancy.get_current_tenant("member@example.com")

		self.assertIs(result, rbp_tenant)

	def test_get_current_tenant_falls_back_to_legacy_tenant(self):
		legacy_tenant = SimpleNamespace(name="TENANT-1", doctype="Tenant")

		with (
			patch.object(tenancy, "get_rbp_tenant_for_user", return_value=None),
			patch.object(tenancy, "get_legacy_tenant_for_user", return_value=legacy_tenant),
		):
			result = tenancy.get_current_tenant("member@example.com")

		self.assertIs(result, legacy_tenant)

	def test_load_portal_tenant_sets_setup_required_when_missing(self):
		context = SimpleNamespace(path="portal/dashboard")

		with (
			patch.object(tenancy.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(tenancy.frappe, "local", SimpleNamespace(path="portal/dashboard"), create=True),
			patch.object(tenancy, "get_current_tenant", return_value=None),
		):
			result = tenancy.load_portal_tenant(context)

		self.assertIs(result, context)
		self.assertTrue(context.portal_setup_required)
		self.assertIsNone(context.tenant)
		self.assertIsNone(context.current_tenant)

	def test_load_portal_tenant_sets_current_tenant(self):
		context = SimpleNamespace(path="app")
		rbp_tenant = SimpleNamespace(name="RBP-TENANT-1", doctype="RBP Tenant")

		with (
			patch.object(tenancy.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(tenancy.frappe, "local", SimpleNamespace(path="app"), create=True),
			patch.object(tenancy, "get_current_tenant", return_value=rbp_tenant),
		):
			result = tenancy.load_portal_tenant(context)

		self.assertIs(result, context)
		self.assertFalse(context.portal_setup_required)
		self.assertIs(context.tenant, rbp_tenant)
		self.assertIs(context.current_tenant, rbp_tenant)
		self.assertEqual(context.current_tenant_doctype, "RBP Tenant")
