import json
from pathlib import Path
from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.api import the_fixer as api
from rbp_app.services import the_fixer as service


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
            service.CASE_DOCTYPE: {},
            service.TASK_DOCTYPE: {},
            service.UPDATE_DOCTYPE: {},
            "RBP Decision Desk Request": {},
            "RBP DocuShare Document": {},
            "RBP Marketplace Order": {},
            "RBP Connectivity Request": {},
            "RBP Risk Advisor Assessment": {},
        }
        self.counters = {doctype: 0 for doctype in self.docs}

    def next_name(self, doctype):
        self.counters[doctype] += 1
        prefix = {
            service.CASE_DOCTYPE: "RBP-FIX",
            service.TASK_DOCTYPE: "RBP-FIX-TASK",
            service.UPDATE_DOCTYPE: "RBP-FIX-UPD",
            "RBP Decision Desk Request": "RBP-DDR",
            "RBP DocuShare Document": "RBP-DSD",
            "RBP Marketplace Order": "RBP-MPO",
            "RBP Connectivity Request": "RBP-CONN",
            "RBP Risk Advisor Assessment": "RBP-RA",
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


class TheFixerTestCase(TestCase):
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

    def create_case(self, user="owner@example.com", payload=None):
        return service.create_case(
            user,
            payload
            or {
                "title": "Fix payroll issue",
                "issue_summary": "Payroll export is broken.",
                "category": "Operations",
            },
        )

    def assign_case(self, case_name, assigned_to="advisor@example.com"):
        return service.admin_assign_case("manager@example.com", case_name, assigned_to)


class TestTheFixerDoctypes(TestCase):
    def test_case_task_and_update_doctypes_have_required_fields(self):
        case_fields = doctype_fields("rbp_fixer_case", "rbp_fixer_case.json")
        task_fields = doctype_fields("rbp_fixer_task", "rbp_fixer_task.json")
        update_fields = doctype_fields("rbp_fixer_update", "rbp_fixer_update.json")

        for field in {
            "tenant",
            "owner_user",
            "business_profile",
            "title",
            "category",
            "issue_summary",
            "issue_details",
            "urgency",
            "impact",
            "status",
            "workflow_state",
            "assigned_to",
            "submitted_on",
            "reviewed_on",
            "resolved_on",
            "closed_on",
            "source_channel",
            "related_decision_request",
            "related_docushare_document",
            "related_marketplace_order",
            "related_connectivity_request",
            "related_risk_assessment",
            "notes",
        }:
            self.assertIn(field, case_fields)

        for field in {"tenant", "fixer_case", "title", "description", "priority", "status", "assigned_to", "due_date", "completed_on", "notes"}:
            self.assertIn(field, task_fields)

        for field in {"tenant", "fixer_case", "update_type", "message", "status_snapshot", "created_by_user", "visible_to_customer", "notes"}:
            self.assertIn(field, update_fields)


class TestTheFixerService(TheFixerTestCase):
    def test_create_case_sets_owner_tenant_defaults_and_audit(self):
        result = self.create_case()

        self.assertEqual(result["owner_user"], "owner@example.com")
        self.assertEqual(result["tenant"], "TENANT-1")
        self.assertEqual(result["status"], "Draft")
        self.assertEqual(result["workflow_state"], "Draft")
        self.assertEqual(result["urgency"], "Medium")
        self.assertEqual(result["impact"], "Medium")
        self.assertEqual(self.audit_events[-1][0], "fixer_case_created")

    def test_update_draft_case_updates_allowed_fields_only(self):
        case = self.create_case()

        result = service.update_draft_case("owner@example.com", case["name"], {"title": "Updated", "status": "Closed"})

        self.assertEqual(result["title"], "Updated")
        self.assertEqual(result["status"], "Draft")
        self.assertEqual(self.audit_events[-1][0], "fixer_case_updated")

    def test_cannot_update_case_after_submit(self):
        case = self.create_case()
        service.submit_case("owner@example.com", case["name"])

        with self.assertRaises(frappe.ValidationError):
            service.update_draft_case("owner@example.com", case["name"], {"title": "Too late"})

    def test_submit_case_changes_status_and_notifies_owner_and_admin(self):
        case = self.create_case()

        result = service.submit_case("owner@example.com", case["name"])

        self.assertEqual(result["status"], "Submitted")
        self.assertEqual(result["submitted_on"], "2026-05-08 10:00:00")
        self.assertEqual(self.audit_events[-1][0], "fixer_case_submitted")
        notified_users = {notification["user"] for notification in self.notifications}
        self.assertIn("owner@example.com", notified_users)
        self.assertIn("manager@example.com", notified_users)

    def test_list_my_cases_returns_owned_and_assigned_cases(self):
        own = self.create_case("owner@example.com", {"title": "Own case"})
        assigned = self.create_case("owner@example.com", {"title": "Assigned case"})
        other = self.create_case("other@example.com", {"title": "Other case"})
        self.assign_case(assigned["name"])

        owner_result = service.list_my_cases("owner@example.com")
        advisor_result = service.list_my_cases("advisor@example.com")

        self.assertEqual({row["name"] for row in owner_result["cases"]}, {own["name"], assigned["name"]})
        self.assertEqual({row["name"] for row in advisor_result["cases"]}, {assigned["name"]})
        self.assertNotIn(other["name"], {row["name"] for row in advisor_result["cases"]})

    def test_get_case_includes_tasks_and_visible_updates(self):
        case = self.create_case()
        self.assign_case(case["name"])
        task = service.create_task("advisor@example.com", case["name"], {"title": "Investigate"})
        update = service.add_case_update("advisor@example.com", case["name"], {"message": "We are looking.", "visible_to_customer": 1, "update_type": "Customer Update"})

        result = service.get_case("owner@example.com", case["name"])

        self.assertEqual(result["tasks"][0]["name"], task["name"])
        self.assertEqual(result["updates"][0]["name"], update["name"])

    def test_admin_assign_case_sets_assignee_and_notifies(self):
        case = self.create_case()

        result = self.assign_case(case["name"])

        self.assertEqual(result["assigned_to"], "advisor@example.com")
        self.assertEqual(result["status"], "Assigned")
        self.assertEqual(self.audit_events[-1][0], "fixer_case_assigned")
        self.assertEqual(self.notifications[-1]["user"], "advisor@example.com")

    def test_admin_update_case_status_sets_dates_and_resolution_notifications(self):
        case = self.create_case()
        service.submit_case("owner@example.com", case["name"])

        result = service.admin_update_case_status("manager@example.com", case["name"], "Resolved", {"notes": "Fixed."})

        self.assertEqual(result["status"], "Resolved")
        self.assertEqual(result["resolved_on"], "2026-05-08 10:00:00")
        self.assertEqual(result["notes"], "Fixed.")
        self.assertEqual(self.audit_events[-1][0], "fixer_case_status_updated")
        self.assertEqual([n["title"] for n in self.notifications[-2:]], ["Fixer case status changed", "Fixer case resolved"])

    def test_invalid_status_transition_is_rejected(self):
        case = self.create_case()

        with self.assertRaises(frappe.ValidationError):
            service.admin_update_case_status("manager@example.com", case["name"], "Closed")

    def test_create_update_and_complete_task_lifecycle(self):
        case = self.create_case()
        self.assign_case(case["name"])

        task = service.create_task("advisor@example.com", case["name"], {"title": "Investigate", "assigned_to": "advisor@example.com"})
        updated = service.update_task("advisor@example.com", task["name"], {"status": "In Progress", "notes": "Started"})
        completed = service.complete_task("advisor@example.com", task["name"])

        self.assertEqual(task["tenant"], "TENANT-1")
        self.assertEqual(updated["status"], "In Progress")
        self.assertEqual(completed["status"], "Completed")
        self.assertEqual(completed["completed_on"], "2026-05-08 10:00:00")
        self.assertEqual([event for event, _kwargs in self.audit_events[-3:]], ["fixer_task_created", "fixer_task_updated", "fixer_task_completed"])

    def test_add_case_update_and_visibility_rules(self):
        case = self.create_case()
        self.assign_case(case["name"])
        internal = service.add_case_update("advisor@example.com", case["name"], {"message": "Internal only."})
        customer = service.add_case_update(
            "advisor@example.com",
            case["name"],
            {"message": "Customer can see this.", "visible_to_customer": 1, "update_type": "Customer Update"},
        )

        owner_result = service.list_case_updates("owner@example.com", case["name"])
        advisor_result = service.list_case_updates("advisor@example.com", case["name"])

        self.assertEqual({row["name"] for row in owner_result["updates"]}, {customer["name"]})
        self.assertEqual({row["name"] for row in advisor_result["updates"]}, {internal["name"], customer["name"]})
        self.assertEqual(self.audit_events[-1][0], "fixer_update_added")
        self.assertEqual(self.notifications[-1]["title"], "Fixer customer update added")

    def test_owner_assigned_admin_access_and_cross_tenant_denial(self):
        case = self.create_case()
        self.assign_case(case["name"])

        self.assertEqual(service.get_case("owner@example.com", case["name"])["name"], case["name"])
        self.assertEqual(service.get_case("advisor@example.com", case["name"])["name"], case["name"])
        self.assertEqual(service.get_case("manager@example.com", case["name"])["name"], case["name"])

        with self.assertRaises(frappe.PermissionError):
            service.get_case("other@example.com", case["name"])
        with self.assertRaises(frappe.PermissionError):
            service.create_task("owner@example.com", case["name"], {"title": "Owner cannot internal manage"})

    def test_related_reference_cross_tenant_denial(self):
        related = FakeDoc(self.store, doctype="RBP Decision Desk Request", tenant="TENANT-2")
        related.insert(ignore_permissions=True)

        with self.assertRaises(frappe.PermissionError):
            self.create_case(payload={"title": "Bad reference", "related_decision_request": related.name})

    def test_audit_and_notification_events_cover_required_lifecycle(self):
        case = self.create_case()
        service.update_draft_case("owner@example.com", case["name"], {"issue_summary": "Updated"})
        service.submit_case("owner@example.com", case["name"])
        self.assign_case(case["name"])
        service.admin_update_case_status("manager@example.com", case["name"], "In Progress")
        task = service.create_task("advisor@example.com", case["name"], {"title": "Investigate", "assigned_to": "advisor@example.com"})
        service.update_task("advisor@example.com", task["name"], {"notes": "Updated"})
        service.complete_task("advisor@example.com", task["name"])
        service.add_case_update("advisor@example.com", case["name"], {"message": "Visible", "visible_to_customer": 1, "update_type": "Customer Update"})

        self.assertEqual(
            [event for event, _kwargs in self.audit_events],
            [
                "fixer_case_created",
                "fixer_case_updated",
                "fixer_case_submitted",
                "fixer_case_assigned",
                "fixer_case_status_updated",
                "fixer_task_created",
                "fixer_task_updated",
                "fixer_task_completed",
                "fixer_update_added",
            ],
        )

        titles = [notification["title"] for notification in self.notifications]
        self.assertIn("Fixer case submitted", titles)
        self.assertIn("New Fixer case submitted", titles)
        self.assertIn("Fixer case assigned", titles)
        self.assertIn("Fixer case status changed", titles)
        self.assertIn("Fixer task assigned", titles)
        self.assertIn("Fixer task completed", titles)
        self.assertIn("Fixer customer update added", titles)


class TestTheFixerApi(TestCase):
    def test_api_methods_are_thin_and_coerce_payloads(self):
        with (
            patch.object(api, "require_login", return_value="owner@example.com"),
            patch.object(api.service, "create_case", return_value={"name": "RBP-FIX-0001"}) as create_case,
            patch.object(api.service, "update_draft_case", return_value={"name": "RBP-FIX-0001"}) as update_case,
            patch.object(api.service, "list_my_cases", return_value={"cases": [], "count": 0}) as list_cases,
            patch.object(api.service, "add_case_update", return_value={"name": "RBP-FIX-UPD-0001"}) as add_update,
        ):
            self.assertEqual(api.create_case('{"title": "A"}'), {"name": "RBP-FIX-0001"})
            self.assertEqual(api.update_draft_case("RBP-FIX-0001", '{"title": "B"}'), {"name": "RBP-FIX-0001"})
            self.assertEqual(api.list_my_cases('{"status": "Draft"}'), {"cases": [], "count": 0})
            self.assertEqual(api.add_case_update("RBP-FIX-0001", '{"message": "Hi"}'), {"name": "RBP-FIX-UPD-0001"})

        create_case.assert_called_once_with("owner@example.com", {"title": "A"})
        update_case.assert_called_once_with("owner@example.com", "RBP-FIX-0001", {"title": "B"})
        list_cases.assert_called_once_with("owner@example.com", {"status": "Draft"})
        add_update.assert_called_once_with("owner@example.com", "RBP-FIX-0001", {"message": "Hi"})

    def test_admin_api_requires_system_manager(self):
        with (
            patch.object(api, "require_system_manager", return_value="manager@example.com"),
            patch.object(api.service, "admin_assign_case", return_value={"assigned_to": "advisor@example.com"}) as assign_case,
            patch.object(api.service, "admin_update_case_status", return_value={"status": "Resolved"}) as update_status,
        ):
            assign_result = api.admin_assign_case("RBP-FIX-0001", "advisor@example.com")
            update_result = api.admin_update_case_status("RBP-FIX-0001", "Resolved", '{"notes": "Done"}')

        self.assertEqual(assign_result["assigned_to"], "advisor@example.com")
        self.assertEqual(update_result["status"], "Resolved")
        assign_case.assert_called_once_with("manager@example.com", "RBP-FIX-0001", "advisor@example.com")
        update_status.assert_called_once_with("manager@example.com", "RBP-FIX-0001", "Resolved", {"notes": "Done"})
