import json
from pathlib import Path
from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.api import decision_desk as api
from rbp_app.services import decision_desk as service


DOCTYPE_ROOT = Path(__file__).resolve().parents[1] / "doctype"


def doctype_fields(folder, filename):
    data = json.loads((DOCTYPE_ROOT / folder / filename).read_text())
    return {field["fieldname"] for field in data["fields"]}


class FakeDoc(SimpleNamespace):
    def __init__(self, store, **values):
        super().__init__(**values)
        self._store = store

    def insert(self, ignore_permissions=False):
        if not getattr(self, "name", None):
            self.name = self._store.next_name(self.doctype)
        self._store.docs[self.doctype][self.name] = self
        return self

    def save(self, ignore_permissions=False):
        self._store.docs[self.doctype][self.name] = self
        return self

    def delete(self, ignore_permissions=False):
        self._store.docs[self.doctype].pop(self.name, None)
        return self


class FakeStore:
    def __init__(self):
        self.docs = {
            service.REQUEST_DOCTYPE: {},
            service.OPTION_DOCTYPE: {},
        }
        self.counters = {
            service.REQUEST_DOCTYPE: 0,
            service.OPTION_DOCTYPE: 0,
        }

    def next_name(self, doctype):
        self.counters[doctype] += 1
        prefix = {
            service.REQUEST_DOCTYPE: "RBP-DDR",
            service.OPTION_DOCTYPE: "RBP-DDO",
        }[doctype]
        return f"{prefix}-{self.counters[doctype]:04d}"

    def get_doc(self, doctype_or_payload, name=None):
        if isinstance(doctype_or_payload, dict):
            return FakeDoc(self, **doctype_or_payload)
        try:
            return self.docs[doctype_or_payload][name]
        except KeyError:
            raise frappe.DoesNotExistError

    def get_all(self, doctype, filters=None, fields=None, order_by=None):
        if doctype == "Has Role":
            return [{"parent": "manager@example.com"}]

        rows = []
        for doc in self.docs[doctype].values():
            if self._matches(doc, filters or {}):
                row = {}
                for field in fields or []:
                    row[field] = getattr(doc, field, None)
                rows.append(row)
        return rows

    def _matches(self, doc, filters):
        for field, expected in filters.items():
            actual = getattr(doc, field, None)
            if isinstance(expected, list) and expected[0] == "in":
                if actual not in expected[1]:
                    return False
            elif isinstance(expected, list) and expected[0] == "!=":
                if actual == expected[1]:
                    return False
            elif actual != expected:
                return False
        return True


class DecisionDeskTestCase(TestCase):
    def setUp(self):
        self.store = FakeStore()
        self.audit_events = []
        self.notifications = []
        self.tenants = {
            "owner@example.com": "TENANT-1",
            "other@example.com": "TENANT-2",
            "advisor@example.com": "TENANT-1",
            "manager@example.com": "TENANT-ADMIN",
            "Administrator": "TENANT-ADMIN",
        }
        self.patchers = [
            patch.object(service, "doctype_exists", return_value=True),
            patch.object(service.frappe, "get_doc", side_effect=self.store.get_doc),
            patch.object(service.frappe, "get_all", side_effect=self.store.get_all),
            patch.object(service, "get_current_tenant_name", side_effect=lambda user=None: self.tenants.get(user)),
            patch.object(service, "is_admin_user", side_effect=lambda user=None: user in {"manager@example.com", "Administrator"}),
            patch.object(service, "now_datetime", return_value="2026-05-08 10:00:00"),
            patch.object(service, "_has_field", return_value=True),
            patch.object(service, "generate_reference_id", side_effect=lambda prefix: f"{prefix}-2026-0001"),
            patch.object(service, "emit_event_notification", return_value=None),
            patch.object(
                service,
                "record_audit_event",
                side_effect=lambda event_type, **kwargs: self.audit_events.append((event_type, kwargs)),
            ),
            patch.object(
                service,
                "create_notification",
                side_effect=lambda **kwargs: self.notifications.append(kwargs),
            ),
        ]
        for patcher in self.patchers:
            patcher.start()

    def tearDown(self):
        for patcher in reversed(self.patchers):
            patcher.stop()

    def create_request(self, user="owner@example.com", payload=None):
        return service.create_request(
            user,
            payload
            or {
                "title": "Choose payroll platform",
                "summary": "Need a decision on payroll tooling.",
                "category": "Technology",
            },
        )


class TestDecisionDeskDoctypes(TestCase):
    def test_request_doctype_has_required_fields(self):
        fields = doctype_fields("rbp_decision_desk_request", "rbp_decision_desk_request.json")

        for field in {
            "tenant",
            "owner_user",
            "business_profile",
            "title",
            "category",
            "summary",
            "business_context",
            "urgency",
            "deadline",
            "desired_outcome",
            "constraints",
            "status",
            "workflow_state",
            "assigned_to",
            "submitted_on",
            "reviewed_on",
            "closed_on",
            "source_channel",
            "supporting_file_reference",
            "notes",
        }:
            self.assertIn(field, fields)

    def test_option_doctype_has_required_fields(self):
        fields = doctype_fields("rbp_decision_desk_option", "rbp_decision_desk_option.json")

        for field in {
            "decision_request",
            "tenant",
            "option_label",
            "option_summary",
            "pros",
            "cons",
            "estimated_cost",
            "risk_level",
            "recommended",
            "sort_order",
            "notes",
        }:
            self.assertIn(field, fields)


class TestDecisionDeskService(DecisionDeskTestCase):
    def test_create_request_sets_owner_tenant_and_audit(self):
        result = self.create_request()

        self.assertEqual(result["owner_user"], "owner@example.com")
        self.assertEqual(result["tenant"], "TENANT-1")
        self.assertEqual(result["status"], "Draft")
        self.assertEqual(result["workflow_state"], "Draft")
        self.assertEqual(self.audit_events[-1][0], "decision_desk_request_created")

    def test_update_draft_request_updates_allowed_fields(self):
        request = self.create_request()

        result = service.update_draft_request(
            "owner@example.com",
            request["name"],
            {"title": "Updated title", "status": "Closed"},
        )

        self.assertEqual(result["title"], "Updated title")
        self.assertEqual(result["status"], "Draft")
        self.assertEqual(self.audit_events[-1][0], "decision_desk_request_updated")

    def test_cannot_update_after_submit(self):
        request = self.create_request()
        service.submit_request("owner@example.com", request["name"])

        with self.assertRaises(frappe.ValidationError):
            service.update_draft_request("owner@example.com", request["name"], {"title": "Too late"})

    def test_submit_request_changes_status_and_notifies_user_and_admin(self):
        request = self.create_request()

        result = service.submit_request("owner@example.com", request["name"])

        self.assertEqual(result["status"], "Submitted")
        self.assertEqual(result["submitted_on"], "2026-05-08 10:00:00")
        self.assertEqual(self.audit_events[-1][0], "decision_desk_request_submitted")
        notified_users = {notification["user"] for notification in self.notifications}
        self.assertIn("owner@example.com", notified_users)
        self.assertIn("manager@example.com", notified_users)

    def test_list_my_requests_returns_own_and_assigned_requests_only(self):
        own = self.create_request("owner@example.com", {"title": "Own request"})
        assigned = self.create_request("owner@example.com", {"title": "Assigned request"})
        other_tenant = self.create_request("other@example.com", {"title": "Other tenant"})
        service.admin_assign_request("manager@example.com", assigned["name"], "advisor@example.com")

        owner_result = service.list_my_requests("owner@example.com")
        advisor_result = service.list_my_requests("advisor@example.com")

        self.assertEqual({row["name"] for row in owner_result["requests"]}, {own["name"], assigned["name"]})
        self.assertEqual({row["name"] for row in advisor_result["requests"]}, {assigned["name"]})
        self.assertNotIn(other_tenant["name"], {row["name"] for row in advisor_result["requests"]})

    def test_get_own_request_includes_options(self):
        request = self.create_request()
        option = service.create_option("owner@example.com", request["name"], {"option_label": "Option A"})

        result = service.get_request("owner@example.com", request["name"])

        self.assertEqual(result["name"], request["name"])
        self.assertEqual(result["options"][0]["name"], option["name"])

    def test_cannot_get_another_user_or_tenant_request(self):
        request = self.create_request("other@example.com", {"title": "Other tenant"})

        with self.assertRaises(frappe.PermissionError):
            service.get_request("owner@example.com", request["name"])

    def test_admin_assign_request_sets_assignee_and_notifies_advisor(self):
        request = self.create_request()

        result = service.admin_assign_request("manager@example.com", request["name"], "advisor@example.com")

        self.assertEqual(result["assigned_to"], "advisor@example.com")
        self.assertEqual(result["status"], "Assigned")
        self.assertEqual(self.audit_events[-1][0], "decision_desk_request_assigned")
        self.assertEqual(self.notifications[-1]["user"], "advisor@example.com")

    def test_admin_update_status_sets_status_and_outcome_notifications(self):
        request = self.create_request()

        result = service.admin_update_status(
            "manager@example.com",
            request["name"],
            "Outcome Ready",
            {"notes": "Review complete."},
        )

        self.assertEqual(result["status"], "Outcome Ready")
        self.assertEqual(result["notes"], "Review complete.")
        self.assertEqual(self.audit_events[-1][0], "decision_desk_status_updated")
        self.assertEqual([n["title"] for n in self.notifications[-2:]], ["Decision Desk status changed", "Decision Desk outcome ready"])

    def test_create_option_inherits_parent_tenant(self):
        request = self.create_request()

        result = service.create_option(
            "owner@example.com",
            request["name"],
            {"option_label": "Option A", "risk_level": "Low"},
        )

        self.assertEqual(result["decision_request"], request["name"])
        self.assertEqual(result["tenant"], "TENANT-1")
        self.assertEqual(self.audit_events[-1][0], "decision_desk_option_created")

    def test_update_option_uses_parent_access(self):
        request = self.create_request()
        option = service.create_option("owner@example.com", request["name"], {"option_label": "Option A"})

        result = service.update_option("owner@example.com", option["name"], {"option_summary": "Updated"})

        self.assertEqual(result["option_summary"], "Updated")
        self.assertEqual(self.audit_events[-1][0], "decision_desk_option_updated")

    def test_delete_option_removes_record(self):
        request = self.create_request()
        option = service.create_option("owner@example.com", request["name"], {"option_label": "Option A"})

        result = service.delete_option("owner@example.com", option["name"])

        self.assertTrue(result["deleted"])
        self.assertNotIn(option["name"], self.store.docs[service.OPTION_DOCTYPE])
        self.assertEqual(self.audit_events[-1][0], "decision_desk_option_deleted")

    def test_permission_failures_for_guest_non_admin_and_tenant_mismatch(self):
        request = self.create_request()

        with self.assertRaises(frappe.PermissionError):
            service.create_request("Guest", {"title": "Nope"})
        with self.assertRaises(frappe.PermissionError):
            service.admin_assign_request("owner@example.com", request["name"], "advisor@example.com")

        request_doc = self.store.docs[service.REQUEST_DOCTYPE][request["name"]]
        request_doc.tenant = "TENANT-2"
        with self.assertRaises(frappe.PermissionError):
            service.submit_request("owner@example.com", request["name"])

    def test_audit_events_cover_required_lifecycle(self):
        request = self.create_request()
        service.update_draft_request("owner@example.com", request["name"], {"summary": "Updated"})
        service.submit_request("owner@example.com", request["name"])
        service.admin_assign_request("manager@example.com", request["name"], "advisor@example.com")
        service.admin_update_status("manager@example.com", request["name"], "In Progress")
        option = service.create_option("advisor@example.com", request["name"], {"option_label": "Option A"})
        service.update_option("advisor@example.com", option["name"], {"recommended": 1})
        service.delete_option("advisor@example.com", option["name"])

        self.assertEqual(
            [event for event, _kwargs in self.audit_events],
            [
                "decision_desk_request_created",
                "decision_desk_request_updated",
                "decision_desk_request_submitted",
                "decision_desk_request_assigned",
                "decision_desk_status_updated",
                "decision_desk_option_created",
                "decision_desk_option_updated",
                "decision_desk_option_deleted",
            ],
        )

    def test_notification_creation_for_submit_assign_and_status(self):
        request = self.create_request()
        service.submit_request("owner@example.com", request["name"])
        service.admin_assign_request("manager@example.com", request["name"], "advisor@example.com")
        service.admin_update_status("manager@example.com", request["name"], "Outcome Ready")

        titles = [notification["title"] for notification in self.notifications]
        self.assertIn("Decision Desk request submitted", titles)
        self.assertIn("New Decision Desk request", titles)
        self.assertIn("Decision Desk request assigned", titles)
        self.assertIn("Decision Desk status changed", titles)
        self.assertIn("Decision Desk outcome ready", titles)


class TestDecisionDeskApi(TestCase):
    def test_api_methods_are_thin_and_coerce_payloads(self):
        with (
            patch.object(api, "require_login", return_value="owner@example.com"),
            patch.object(api.service, "create_request", return_value={"name": "RBP-DDR-0001"}) as create_request,
            patch.object(api.service, "update_draft_request", return_value={"name": "RBP-DDR-0001"}) as update_request,
            patch.object(api.service, "list_my_requests", return_value={"requests": [], "count": 0}) as list_requests,
        ):
            self.assertEqual(api.create_request('{"title": "A"}'), {"name": "RBP-DDR-0001"})
            self.assertEqual(api.update_draft_request("RBP-DDR-0001", '{"title": "B"}'), {"name": "RBP-DDR-0001"})
            self.assertEqual(api.list_my_requests('{"status": "Draft"}'), {"requests": [], "count": 0})

        create_request.assert_called_once_with("owner@example.com", {"title": "A"})
        update_request.assert_called_once_with("owner@example.com", "RBP-DDR-0001", {"title": "B"})
        list_requests.assert_called_once_with("owner@example.com", {"status": "Draft"})

    def test_admin_api_requires_system_manager(self):
        with (
            patch.object(api, "require_system_manager", return_value="manager@example.com"),
            patch.object(api.service, "admin_update_status", return_value={"status": "Closed"}) as update_status,
        ):
            result = api.admin_update_status("RBP-DDR-0001", "Closed", '{"notes": "Done"}')

        self.assertEqual(result["status"], "Closed")
        update_status.assert_called_once_with("manager@example.com", "RBP-DDR-0001", "Closed", {"notes": "Done"})
