from contextlib import ExitStack
from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.api import admin as admin_api
from rbp_app.services import admin_dashboard, audit, admin_workflows as workflows


class FakeWorkflowDoc(SimpleNamespace):
	def save(self, ignore_permissions=False):
		self.saved = True
		return self


class TestAdminDashboardApi(TestCase):
	def test_admin_can_fetch_dashboard(self):
		payload = {"metrics": [], "queues": [], "recent_activity": [], "alerts": [], "desk_links": []}
		with (
			patch.object(admin_api, "require_admin_user", return_value="admin@example.com"),
			patch.object(admin_api, "get_dashboard_service", return_value=payload),
		):
			self.assertEqual(admin_api.get_dashboard(), payload)

	def test_member_cannot_fetch_dashboard(self):
		with patch.object(admin_api, "require_admin_user", side_effect=frappe.PermissionError):
			with self.assertRaises(frappe.PermissionError):
				admin_api.get_dashboard()

	def test_missing_doctype_count_is_graceful(self):
		with patch.object(admin_dashboard, "doctype_exists", return_value=False):
			value, warning = admin_dashboard._safe_count("Missing DocType")
		self.assertEqual(value, 0)
		self.assertIn("not installed", warning)


class TestAdminWorkflowActions(TestCase):
	def setUp(self):
		self.doc = FakeWorkflowDoc(
			doctype="RBP Decision Desk Request",
			name="DDR-001",
			tenant="TENANT-1",
			owner_user="member@example.com",
			status="Submitted",
			workflow_state="Submitted",
			notes=None,
			assigned_to=None,
		)
		self.audit_doc = SimpleNamespace(name="AUDIT-001")
		self.notification_doc = SimpleNamespace(name="NOTICE-001")

	def _patches(self):
		return (
			patch.object(workflows, "doctype_exists", return_value=True),
			patch.object(workflows, "is_admin_user", return_value=True),
			patch.object(workflows, "is_system_manager", return_value=True),
			patch.object(workflows.frappe, "get_doc", return_value=self.doc),
			patch.object(workflows, "_fieldnames", return_value={"status", "workflow_state", "notes", "assigned_to", "reviewed_on"}),
			patch.object(workflows, "record_audit_event", return_value=self.audit_doc),
			patch.object(workflows, "create_notification", return_value=self.notification_doc),
			patch.object(workflows, "now_datetime", return_value="2026-05-11 09:00:00"),
		)

	def test_valid_transition_writes_audit_and_notification(self):
		with ExitStack() as stack:
			for patcher in self._patches():
				stack.enter_context(patcher)
			result = workflows.perform_admin_action(
				"admin@example.com",
				{
					"domain": "decision_desk",
					"record_doctype": "RBP Decision Desk Request",
					"record_name": "DDR-001",
					"action": "start_review",
				},
			)
		self.assertTrue(result["ok"])
		self.assertEqual(result["new_status"], "In Review")
		self.assertEqual(result["audit_log_name"], "AUDIT-001")
		self.assertEqual(result["notification_names"], ["NOTICE-001"])

	def test_invalid_transition_fails(self):
		self.doc.status = "Completed"
		self.doc.workflow_state = "Completed"
		with ExitStack() as stack:
			for patcher in self._patches():
				stack.enter_context(patcher)
			with self.assertRaises(frappe.ValidationError):
				workflows.perform_admin_action(
					"admin@example.com",
					{
						"domain": "decision_desk",
						"record_doctype": "RBP Decision Desk Request",
						"record_name": "DDR-001",
						"action": "start_review",
					},
				)

	def test_unauthorised_user_cannot_transition(self):
		with (
			patch.object(workflows, "doctype_exists", return_value=True),
			patch.object(workflows, "is_admin_user", return_value=False),
			patch.object(workflows.frappe, "get_doc", return_value=self.doc),
		):
			with self.assertRaises(frappe.PermissionError):
				workflows.perform_admin_action(
					"member@example.com",
					{
						"domain": "decision_desk",
						"record_doctype": "RBP Decision Desk Request",
						"record_name": "DDR-001",
						"action": "start_review",
					},
				)


class TestAuditVisibility(TestCase):
	def test_member_timeline_hides_internal_notes(self):
		doc = SimpleNamespace(doctype="RBP Decision Desk Request", name="DDR-001", tenant="TENANT-1", owner_user="member@example.com")
		rows = [
			{
				"name": "AUDIT-001",
				"event_type": "admin_start_review",
				"actor": "admin@example.com",
				"subject_doctype": "RBP Decision Desk Request",
				"subject_name": "DDR-001",
				"tenant": "TENANT-1",
				"message": "Internal note",
				"metadata_json": "{}",
				"creation": "2026-05-11 09:00:00",
			}
		]
		with (
			patch.object(audit, "doctype_exists", return_value=True),
			patch.object(audit.frappe, "get_doc", return_value=doc),
			patch.object(audit.frappe, "get_all", return_value=rows),
			patch.object(audit, "get_current_tenant_name", return_value="TENANT-1"),
			patch.object(audit, "is_admin_user", return_value=False),
		):
			result = audit.list_my_record_timeline("RBP Decision Desk Request", "DDR-001", user="member@example.com")

		self.assertEqual(result["count"], 1)
		self.assertNotIn("internal_notes", result["timeline"][0])
