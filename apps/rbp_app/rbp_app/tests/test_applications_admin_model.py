from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import MagicMock, patch

import frappe

from rbp_app.api import applications as applications_api
from rbp_app.rbp_app.doctype.rbp_application.rbp_application import RBPApplication
from rbp_app.rbp_app.doctype.rbp_application_category.rbp_application_category import (
	RBPApplicationCategory,
)
from rbp_app.rbp_app.doctype.rbp_application_interest.rbp_application_interest import (
	RBPApplicationInterest,
)
from rbp_app.rbp_app.doctype.rbp_application_provisioning_request.rbp_application_provisioning_request import (
	RBPApplicationProvisioningRequest,
)
from rbp_app.services import applications


def _raise_frappe_exception(message, exc=Exception, *args, **kwargs):
	raise exc(message)


class ApplicationTestCase(TestCase):
	def setUp(self):
		super().setUp()
		throw_patcher = patch.object(
			applications.frappe,
			"throw",
			side_effect=_raise_frappe_exception,
		)
		throw_patcher.start()
		self.addCleanup(throw_patcher.stop)


class FakeDoc(SimpleNamespace):
	def insert(self, ignore_permissions=False):
		self.inserted = True
		if not getattr(self, "name", None):
			self.name = getattr(self, "application_key", None) or "fake-doc"
		if getattr(self, "doctype", None) == "RBP Application Interest" and not getattr(self, "status", None):
			self.status = "new"
		return self

	def save(self, ignore_permissions=False):
		self.saved = True
		return self


class TestApplicationDocTypeValidation(ApplicationTestCase):
	def test_application_and_category_keys_are_generated(self):
		category = FakeDoc(category_name="Accounting & Finance", category_key=None, name=None)
		application = FakeDoc(
			application_name="Customer Portal Plus",
			application_key=None,
			provisioning_enabled=1,
			name=None,
		)

		with (
			patch.object(applications.frappe, "db", SimpleNamespace(exists=MagicMock(return_value=None)), create=True),
			patch.object(applications.frappe, "session", SimpleNamespace(user="admin@example.com"), create=True),
			patch.object(applications.frappe, "get_roles", return_value=["System Manager"]),
		):
			RBPApplicationCategory.validate(category)
			RBPApplication.validate(application)

		self.assertEqual(category.category_key, "accounting_finance")
		self.assertEqual(application.application_key, "customer_portal_plus")
		self.assertEqual(application.status, "draft")
		self.assertEqual(application.visibility, "admin")
		self.assertEqual(application.provider, "manual")
		self.assertEqual(application.provisioning_enabled, 0)

	def test_invalid_application_status_and_visibility_are_rejected(self):
		application = FakeDoc(
			application_name="Bad App",
			application_key="bad_app",
			status="launched",
			visibility="public",
			name=None,
		)

		with patch.object(applications.frappe, "db", SimpleNamespace(exists=MagicMock(return_value=None)), create=True):
			with self.assertRaises(frappe.ValidationError):
				RBPApplication.validate(application)

		application.status = "draft"
		application.visibility = "customer"
		with patch.object(applications.frappe, "db", SimpleNamespace(exists=MagicMock(return_value=None)), create=True):
			with self.assertRaises(frappe.ValidationError):
				RBPApplication.validate(application)

	def test_interest_defaults_and_email_validation(self):
		interest = FakeDoc(
			application="crm",
			email="person@example.com",
			status=None,
			source_channel=None,
			created_on=None,
		)
		application = FakeDoc(
			name="crm",
			status="register_interest",
			visibility="public",
			archived=0,
			interest_enabled=1,
		)

		with (
			patch.object(applications.frappe, "db", SimpleNamespace(exists=MagicMock(return_value=True)), create=True),
			patch.object(applications.frappe, "get_doc", return_value=application),
			patch(
				"rbp_app.rbp_app.doctype.rbp_application_interest.rbp_application_interest.now_datetime",
				return_value="2026-05-12 12:00:00",
			),
		):
			RBPApplicationInterest.validate(interest)

		self.assertEqual(interest.status, "new")
		self.assertEqual(interest.source_channel, "public_site")
		self.assertIsNotNone(interest.created_on)

		interest.email = "not-an-email"
		with (
			patch.object(applications.frappe, "db", SimpleNamespace(exists=MagicMock(return_value=True)), create=True),
			patch.object(applications.frappe, "get_doc", return_value=application),
		):
			with self.assertRaises(frappe.ValidationError):
				RBPApplicationInterest.validate(interest)


class TestAdminApplicationServices(ApplicationTestCase):
	def test_system_manager_can_create_update_and_archive_application(self):
		created = FakeDoc(
			doctype="RBP Application",
			name="crm",
			application_name="CRM",
			application_key="crm",
			provisioning_enabled=1,
			status="register_interest",
			visibility="public",
		)
		existing = FakeDoc(
			name="crm",
			application_name="CRM",
			application_key="crm",
			status="register_interest",
			visibility="public",
			provisioning_enabled=0,
			archived=0,
		)

		def get_doc(*args):
			if len(args) == 1 and isinstance(args[0], dict):
				created.__dict__.update(args[0])
				return created
			return existing

		with (
			patch.object(applications.frappe, "session", SimpleNamespace(user="manager@example.com"), create=True),
			patch.object(applications.frappe, "get_roles", return_value=["System Manager"]),
			patch.object(applications.frappe, "get_doc", side_effect=get_doc),
			patch.object(
				applications.frappe,
				"db",
				SimpleNamespace(
					exists=MagicMock(return_value=True),
					get_value=MagicMock(return_value="crm"),
				),
				create=True,
			),
			patch.object(applications, "record_audit_event"),
			patch.object(applications, "now_datetime", return_value="2026-05-12 12:00:00"),
		):
			result = applications.admin_create_application(
				{
					"application_name": "CRM",
					"status": "register_interest",
					"visibility": "public",
					"provisioning_enabled": 1,
				}
			)
			updated = applications.admin_update_application("crm", {"short_description": "Updated"})
			archived = applications.admin_archive_application("crm")

		self.assertEqual(result["provisioning_enabled"], 0)
		self.assertTrue(created.inserted)
		self.assertEqual(updated["short_description"], "Updated")
		self.assertEqual(archived["archived"], 1)
		self.assertEqual(archived["status"], "disabled")
		self.assertEqual(archived["visibility"], "hidden")
		self.assertEqual(archived["provisioning_enabled"], 0)

	def test_regular_user_cannot_administer_applications(self):
		with (
			patch.object(applications.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(applications.frappe, "get_roles", return_value=["Website User"]),
		):
			with self.assertRaises(frappe.PermissionError):
				applications.admin_create_application({"application_name": "CRM"})


class TestApplicationListingsAndInterest(ApplicationTestCase):
	def test_public_listing_uses_only_public_safe_filters(self):
		rows = [
			{
				"name": "crm",
				"application_name": "CRM",
				"application_key": "crm",
				"visibility": "public",
				"status": "register_interest",
			}
		]
		with patch.object(applications.frappe, "get_all", return_value=rows) as get_all:
			result = applications.list_public_applications()

		filters = get_all.call_args.kwargs["filters"]
		self.assertIn(["RBP Application", "archived", "=", 0], filters)
		self.assertIn(["RBP Application", "visibility", "=", "public"], filters)
		self.assertIn(
			["RBP Application", "status", "in", sorted(applications.PUBLIC_SAFE_APPLICATION_STATUSES)],
			filters,
		)
		self.assertFalse(result["applications"][0]["provisioning_enabled"])

	def test_portal_listing_requires_login_and_uses_portal_safe_filters(self):
		with patch.object(applications, "require_login", side_effect=frappe.PermissionError):
			with self.assertRaises(frappe.PermissionError):
				applications.list_portal_applications()

		with (
			patch.object(applications, "require_login", return_value="member@example.com"),
			patch.object(applications.frappe, "get_all", return_value=[]) as get_all,
		):
			applications.list_portal_applications()

		filters = get_all.call_args.kwargs["filters"]
		self.assertIn(["RBP Application", "visibility", "in", ["public", "portal"]], filters)
		self.assertIn(
			["RBP Application", "status", "in", sorted(applications.PORTAL_SAFE_APPLICATION_STATUSES)],
			filters,
		)

	def test_guest_and_authenticated_users_can_register_interest_without_duplicates(self):
		application = FakeDoc(
			name="crm",
			application_name="CRM",
			application_key="crm",
			status="register_interest",
			visibility="public",
			archived=0,
			interest_enabled=1,
		)
		existing_interest = FakeDoc(
			name="RBP-APP-INT-0001",
			application="crm",
			email="person@example.com",
			status="new",
			phone=None,
			business_name=None,
			contact_name=None,
			interest_notes=None,
		)

		def get_doc(*args):
			if args == ("RBP Application", "crm"):
				return application
			if args == ("RBP Application Interest", "RBP-APP-INT-0001"):
				return existing_interest
			return FakeDoc(**args[0])

		with (
			patch.object(applications.frappe, "session", SimpleNamespace(user="Guest"), create=True),
			patch.object(
				applications.frappe,
				"db",
				SimpleNamespace(
					exists=MagicMock(return_value=True),
					get_value=MagicMock(return_value="crm"),
				),
				create=True,
			),
			patch.object(applications.frappe, "get_doc", side_effect=get_doc),
			patch.object(
				applications.frappe,
				"get_all",
				side_effect=[["RBP-APP-INT-0001"], ["Administrator"]],
			),
			patch.object(applications, "get_current_tenant", return_value=None),
			patch.object(applications, "record_audit_event"),
			patch.object(applications, "create_notification"),
		):
			result = applications.register_application_interest(
				{
					"application_key": "crm",
					"email": "person@example.com",
					"phone": "123",
					"interest_notes": "Please tell me more.",
				}
			)

		self.assertTrue(result["existing"])
		self.assertTrue(existing_interest.saved)
		self.assertEqual(existing_interest.phone, "123")
		self.assertEqual(existing_interest.interest_notes, "Please tell me more.")

	def test_interest_rejects_disabled_hidden_or_interest_disabled_apps(self):
		for application in (
			FakeDoc(name="crm", status="disabled", visibility="public", archived=0, interest_enabled=1),
			FakeDoc(name="crm", status="register_interest", visibility="hidden", archived=0, interest_enabled=1),
			FakeDoc(name="crm", status="register_interest", visibility="public", archived=0, interest_enabled=0),
		):
			with self.assertRaises(frappe.PermissionError):
				applications._assert_interest_allowed(application, "public_site")


class TestAdminInterestAndProvisioningSafeguards(ApplicationTestCase):
	def test_admin_can_list_and_update_interest_records(self):
		interest = FakeDoc(
			name="RBP-APP-INT-0001",
			application="crm",
			email="person@example.com",
			status="new",
			tenant=None,
			user=None,
		)
		with (
			patch.object(applications.frappe, "session", SimpleNamespace(user="manager@example.com"), create=True),
			patch.object(applications.frappe, "get_roles", return_value=["System Manager"]),
			patch.object(applications.frappe, "get_all", return_value=[interest.__dict__]),
			patch.object(
				applications.frappe,
				"db",
				SimpleNamespace(get_value=MagicMock(return_value={"application_name": "CRM", "application_key": "crm"})),
				create=True,
			),
		):
			listed = applications.admin_list_application_interest()

		self.assertEqual(listed["interests"][0]["application_key"], "crm")

		with (
			patch.object(applications.frappe, "session", SimpleNamespace(user="manager@example.com"), create=True),
			patch.object(applications.frappe, "get_roles", return_value=["System Manager"]),
			patch.object(applications.frappe, "get_doc", return_value=interest),
			patch.object(
				applications.frappe,
				"db",
				SimpleNamespace(get_value=MagicMock(return_value={"application_name": "CRM", "application_key": "crm"})),
				create=True,
			),
			patch.object(applications, "record_audit_event"),
			patch.object(applications, "now_datetime", return_value="2026-05-12 12:00:00"),
		):
			updated = applications.admin_update_application_interest(
				"RBP-APP-INT-0001",
				{"status": "reviewed", "internal_notes": "Reviewed"},
			)

		self.assertEqual(updated["status"], "reviewed")
		self.assertEqual(updated["reviewed_by"], "manager@example.com")
		self.assertIsNotNone(updated["reviewed_on"])

	def test_regular_user_cannot_list_interest_records(self):
		with (
			patch.object(applications.frappe, "session", SimpleNamespace(user="member@example.com"), create=True),
			patch.object(applications.frappe, "get_roles", return_value=["Website User"]),
		):
			with self.assertRaises(frappe.PermissionError):
				applications.admin_list_application_interest()

	def test_provisioning_remains_disabled_and_has_no_public_api(self):
		self.assertFalse(applications.is_application_provisioning_enabled())
		self.assertFalse(hasattr(applications_api, "create_application_provisioning_request"))
		self.assertFalse(hasattr(applications, "create_application_provisioning_request"))

		request = FakeDoc(application="crm", status=None, requested_on=None)
		with patch.object(applications.frappe, "session", SimpleNamespace(user="Guest"), create=True):
			with self.assertRaises(frappe.PermissionError):
				RBPApplicationProvisioningRequest.validate(request)
