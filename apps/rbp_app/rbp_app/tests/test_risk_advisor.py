import json
from pathlib import Path
from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.api import risk_advisor as api
from rbp_app.services import risk_advisor as service


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


class FakeStore:
    def __init__(self):
        self.docs = {
            service.ASSESSMENT_DOCTYPE: {},
            service.RISK_DOCTYPE: {},
            service.ACTION_DOCTYPE: {},
        }
        self.counters = {
            service.ASSESSMENT_DOCTYPE: 0,
            service.RISK_DOCTYPE: 0,
            service.ACTION_DOCTYPE: 0,
        }

    def next_name(self, doctype):
        self.counters[doctype] += 1
        prefix = {
            service.ASSESSMENT_DOCTYPE: "RBP-RAA",
            service.RISK_DOCTYPE: "RBP-RAR",
            service.ACTION_DOCTYPE: "RBP-RAACT",
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


class RiskAdvisorTestCase(TestCase):
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

    def create_assessment(self, user="owner@example.com", payload=None):
        return service.create_assessment(
            user,
            payload
            or {
                "title": "Annual operating risk review",
                "summary": "Review key operating risks.",
                "assessment_type": "Operational",
                "business_area": "Operations",
            },
        )

    def create_risk(self, user="owner@example.com", assessment=None, payload=None):
        assessment = assessment or self.create_assessment(user)
        return service.create_risk(
            user,
            assessment["name"],
            payload or {"title": "Supplier outage", "likelihood": 4, "impact": 5},
        )


class TestRiskAdvisorDoctypes(TestCase):
    def test_assessment_doctype_has_required_fields(self):
        fields = doctype_fields("rbp_risk_advisor_assessment", "rbp_risk_advisor_assessment.json")

        for field in {
            "tenant",
            "owner_user",
            "business_profile",
            "title",
            "assessment_type",
            "business_area",
            "summary",
            "status",
            "workflow_state",
            "risk_score",
            "risk_level",
            "assigned_to",
            "submitted_on",
            "reviewed_on",
            "closed_on",
            "notes",
        }:
            self.assertIn(field, fields)

    def test_risk_doctype_has_required_fields(self):
        fields = doctype_fields("rbp_risk_advisor_risk", "rbp_risk_advisor_risk.json")

        for field in {
            "tenant",
            "assessment",
            "title",
            "category",
            "description",
            "likelihood",
            "impact",
            "risk_score",
            "risk_level",
            "status",
            "owner_user",
            "notes",
        }:
            self.assertIn(field, fields)

    def test_action_doctype_has_required_fields(self):
        fields = doctype_fields("rbp_risk_advisor_action", "rbp_risk_advisor_action.json")

        for field in {
            "tenant",
            "assessment",
            "risk",
            "title",
            "description",
            "priority",
            "status",
            "assigned_to",
            "due_date",
            "completed_on",
            "notes",
        }:
            self.assertIn(field, fields)


class TestRiskAdvisorService(RiskAdvisorTestCase):
    def test_create_assessment_sets_owner_tenant_and_audit(self):
        result = self.create_assessment()

        self.assertEqual(result["owner_user"], "owner@example.com")
        self.assertEqual(result["tenant"], "TENANT-1")
        self.assertEqual(result["status"], "Draft")
        self.assertEqual(result["workflow_state"], "Draft")
        self.assertEqual(self.audit_events[-1][0], "risk_advisor_assessment_created")

    def test_update_draft_assessment_updates_allowed_fields(self):
        assessment = self.create_assessment()

        result = service.update_draft_assessment(
            "owner@example.com",
            assessment["name"],
            {"title": "Updated title", "status": "Closed"},
        )

        self.assertEqual(result["title"], "Updated title")
        self.assertEqual(result["status"], "Draft")
        self.assertEqual(self.audit_events[-1][0], "risk_advisor_assessment_updated")

    def test_cannot_update_assessment_after_submit(self):
        assessment = self.create_assessment()
        service.submit_assessment("owner@example.com", assessment["name"])

        with self.assertRaises(frappe.ValidationError):
            service.update_draft_assessment("owner@example.com", assessment["name"], {"title": "Too late"})

    def test_submit_assessment_changes_status_and_notifies_user_and_admin(self):
        assessment = self.create_assessment()

        result = service.submit_assessment("owner@example.com", assessment["name"])

        self.assertEqual(result["status"], "Submitted")
        self.assertEqual(result["submitted_on"], "2026-05-08 10:00:00")
        self.assertEqual(self.audit_events[-1][0], "risk_advisor_assessment_submitted")
        notified_users = {notification["user"] for notification in self.notifications}
        self.assertIn("owner@example.com", notified_users)
        self.assertIn("manager@example.com", notified_users)

    def test_list_my_assessments_returns_own_and_assigned_records_only(self):
        own = self.create_assessment("owner@example.com", {"title": "Own assessment"})
        assigned = self.create_assessment("owner@example.com", {"title": "Assigned assessment"})
        other_tenant = self.create_assessment("other@example.com", {"title": "Other tenant"})
        service.admin_assign_assessment("manager@example.com", assigned["name"], "advisor@example.com")

        owner_result = service.list_my_assessments("owner@example.com")
        advisor_result = service.list_my_assessments("advisor@example.com")

        self.assertEqual({row["name"] for row in owner_result["assessments"]}, {own["name"], assigned["name"]})
        self.assertEqual({row["name"] for row in advisor_result["assessments"]}, {assigned["name"]})
        self.assertNotIn(other_tenant["name"], {row["name"] for row in advisor_result["assessments"]})

    def test_get_assessment_includes_risks_and_actions(self):
        assessment = self.create_assessment()
        risk = service.create_risk("owner@example.com", assessment["name"], {"title": "Risk", "likelihood": 2, "impact": 3})
        action = service.create_action("owner@example.com", risk["name"], {"title": "Mitigate"})

        result = service.get_assessment("owner@example.com", assessment["name"])

        self.assertEqual(result["name"], assessment["name"])
        self.assertEqual(result["risks"][0]["name"], risk["name"])
        self.assertEqual(result["actions"][0]["name"], action["name"])

    def test_admin_assign_assessment_sets_assignee_and_notifies_advisor(self):
        assessment = self.create_assessment()

        result = service.admin_assign_assessment("manager@example.com", assessment["name"], "advisor@example.com")

        self.assertEqual(result["assigned_to"], "advisor@example.com")
        self.assertEqual(result["status"], "In Review")
        self.assertEqual(self.audit_events[-1][0], "risk_advisor_assessment_assigned")
        self.assertEqual(self.notifications[-1]["user"], "advisor@example.com")

    def test_admin_update_assessment_status_sets_status_and_notifies_owner(self):
        assessment = self.create_assessment()
        service.admin_assign_assessment("manager@example.com", assessment["name"], "advisor@example.com")

        result = service.admin_update_assessment_status(
            "manager@example.com",
            assessment["name"],
            "Reviewed",
            {"notes": "Review complete."},
        )

        self.assertEqual(result["status"], "Reviewed")
        self.assertEqual(result["notes"], "Review complete.")
        self.assertEqual(self.audit_events[-1][0], "risk_advisor_assessment_status_updated")
        self.assertEqual(self.notifications[-1]["title"], "Risk assessment status changed")

    def test_invalid_assessment_status_transition_is_rejected(self):
        assessment = self.create_assessment()

        with self.assertRaises(frappe.ValidationError):
            service.admin_update_assessment_status("manager@example.com", assessment["name"], "Closed")

    def test_create_risk_inherits_parent_tenant_and_scores(self):
        assessment = self.create_assessment()

        result = service.create_risk(
            "owner@example.com",
            assessment["name"],
            {"title": "Supplier outage", "likelihood": 4, "impact": 5},
        )

        self.assertEqual(result["assessment"], assessment["name"])
        self.assertEqual(result["tenant"], "TENANT-1")
        self.assertEqual(result["risk_score"], 20)
        self.assertEqual(result["risk_level"], "Critical")
        self.assertEqual(self.audit_events[-1][0], "risk_advisor_risk_created")

    def test_update_risk_recalculates_score_and_validates_status(self):
        risk = self.create_risk(payload={"title": "Risk", "likelihood": 2, "impact": 2})

        result = service.update_risk("owner@example.com", risk["name"], {"likelihood": 3, "impact": 4, "status": "Monitoring"})

        self.assertEqual(result["risk_score"], 12)
        self.assertEqual(result["risk_level"], "High")
        self.assertEqual(result["status"], "Monitoring")
        self.assertEqual(self.audit_events[-1][0], "risk_advisor_risk_updated")

    def test_risk_score_and_level_calculation_boundaries(self):
        self.assertEqual(service.calculate_risk_score(3, 5), 15)
        self.assertEqual(service.derive_risk_level(4), "Low")
        self.assertEqual(service.derive_risk_level(5), "Medium")
        self.assertEqual(service.derive_risk_level(12), "High")
        self.assertEqual(service.derive_risk_level(20), "Critical")

    def test_create_action_inherits_parent_tenant_and_notifies_assignee(self):
        risk = self.create_risk()

        result = service.create_action(
            "owner@example.com",
            risk["name"],
            {"title": "Contact backup supplier", "assigned_to": "advisor@example.com"},
        )

        self.assertEqual(result["risk"], risk["name"])
        self.assertEqual(result["tenant"], "TENANT-1")
        self.assertEqual(self.audit_events[-1][0], "risk_advisor_action_created")
        self.assertEqual(self.notifications[-1]["title"], "Risk action assigned")

    def test_update_action_changes_status_and_completed_timestamp(self):
        risk = self.create_risk()
        action = service.create_action("owner@example.com", risk["name"], {"title": "Mitigate"})

        result = service.update_action("owner@example.com", action["name"], {"status": "Completed", "notes": "Done"})

        self.assertEqual(result["status"], "Completed")
        self.assertEqual(result["completed_on"], "2026-05-08 10:00:00")
        self.assertEqual(result["notes"], "Done")
        self.assertEqual(self.audit_events[-1][0], "risk_advisor_action_updated")

    def test_complete_action_sets_status_audit_and_notification(self):
        risk = self.create_risk()
        action = service.create_action("owner@example.com", risk["name"], {"title": "Mitigate", "assigned_to": "advisor@example.com"})

        result = service.complete_action("owner@example.com", action["name"])

        self.assertEqual(result["status"], "Completed")
        self.assertEqual(result["completed_on"], "2026-05-08 10:00:00")
        self.assertEqual(self.audit_events[-1][0], "risk_advisor_action_completed")
        self.assertIn("Risk action completed", [notification["title"] for notification in self.notifications])

    def test_owner_assigned_user_admin_access_and_cross_tenant_denial(self):
        assessment = self.create_assessment()
        service.admin_assign_assessment("manager@example.com", assessment["name"], "advisor@example.com")

        self.assertEqual(service.get_assessment("owner@example.com", assessment["name"])["name"], assessment["name"])
        self.assertEqual(service.get_assessment("advisor@example.com", assessment["name"])["name"], assessment["name"])
        self.assertEqual(service.get_assessment("manager@example.com", assessment["name"])["name"], assessment["name"])

        with self.assertRaises(frappe.PermissionError):
            service.get_assessment("other@example.com", assessment["name"])
        with self.assertRaises(frappe.PermissionError):
            service.admin_assign_assessment("owner@example.com", assessment["name"], "advisor@example.com")

        doc = self.store.docs[service.ASSESSMENT_DOCTYPE][assessment["name"]]
        doc.tenant = "TENANT-2"
        with self.assertRaises(frappe.PermissionError):
            service.submit_assessment("owner@example.com", assessment["name"])

    def test_cross_tenant_risk_and_action_links_are_denied(self):
        risk = self.create_risk()
        action = service.create_action("owner@example.com", risk["name"], {"title": "Mitigate"})
        risk_doc = self.store.docs[service.RISK_DOCTYPE][risk["name"]]
        action_doc = self.store.docs[service.ACTION_DOCTYPE][action["name"]]

        risk_doc.tenant = "TENANT-2"
        with self.assertRaises(frappe.PermissionError):
            service.update_risk("owner@example.com", risk["name"], {"title": "Blocked"})

        risk_doc.tenant = "TENANT-1"
        action_doc.tenant = "TENANT-2"
        with self.assertRaises(frappe.PermissionError):
            service.update_action("owner@example.com", action["name"], {"title": "Blocked"})

    def test_audit_events_cover_required_lifecycle(self):
        assessment = self.create_assessment()
        service.update_draft_assessment("owner@example.com", assessment["name"], {"summary": "Updated"})
        service.submit_assessment("owner@example.com", assessment["name"])
        service.admin_assign_assessment("manager@example.com", assessment["name"], "advisor@example.com")
        service.admin_update_assessment_status("manager@example.com", assessment["name"], "Reviewed")
        risk = service.create_risk("advisor@example.com", assessment["name"], {"title": "Risk", "likelihood": 2, "impact": 3})
        service.update_risk("advisor@example.com", risk["name"], {"status": "Monitoring"})
        action = service.create_action("advisor@example.com", risk["name"], {"title": "Action", "assigned_to": "advisor@example.com"})
        service.update_action("advisor@example.com", action["name"], {"status": "In Progress"})
        service.complete_action("advisor@example.com", action["name"])

        self.assertEqual(
            [event for event, _kwargs in self.audit_events],
            [
                "risk_advisor_assessment_created",
                "risk_advisor_assessment_updated",
                "risk_advisor_assessment_submitted",
                "risk_advisor_assessment_assigned",
                "risk_advisor_assessment_status_updated",
                "risk_advisor_risk_created",
                "risk_advisor_risk_updated",
                "risk_advisor_action_created",
                "risk_advisor_action_updated",
                "risk_advisor_action_completed",
            ],
        )

    def test_notification_creation_for_required_events(self):
        assessment = self.create_assessment()
        service.submit_assessment("owner@example.com", assessment["name"])
        service.admin_assign_assessment("manager@example.com", assessment["name"], "advisor@example.com")
        service.admin_update_assessment_status("manager@example.com", assessment["name"], "Reviewed")
        risk = service.create_risk("advisor@example.com", assessment["name"], {"title": "Risk"})
        action = service.create_action("advisor@example.com", risk["name"], {"title": "Action", "assigned_to": "advisor@example.com"})
        service.complete_action("advisor@example.com", action["name"])

        titles = [notification["title"] for notification in self.notifications]
        self.assertIn("Risk assessment submitted", titles)
        self.assertIn("Risk assessment assigned", titles)
        self.assertIn("Risk assessment status changed", titles)
        self.assertIn("Risk created", titles)
        self.assertIn("Risk action assigned", titles)
        self.assertIn("Risk action completed", titles)


class TestRiskAdvisorApi(TestCase):
    def test_api_methods_are_thin_and_coerce_payloads(self):
        with (
            patch.object(api, "require_login", return_value="owner@example.com"),
            patch.object(api.service, "create_assessment", return_value={"name": "RBP-RAA-0001"}) as create_assessment,
            patch.object(api.service, "update_draft_assessment", return_value={"name": "RBP-RAA-0001"}) as update_assessment,
            patch.object(api.service, "list_my_assessments", return_value={"assessments": [], "count": 0}) as list_assessments,
            patch.object(api.service, "create_risk", return_value={"name": "RBP-RAR-0001"}) as create_risk,
            patch.object(api.service, "create_action", return_value={"name": "RBP-RAACT-0001"}) as create_action,
        ):
            self.assertEqual(api.create_assessment('{"title": "A"}'), {"name": "RBP-RAA-0001"})
            self.assertEqual(api.update_draft_assessment("RBP-RAA-0001", '{"title": "B"}'), {"name": "RBP-RAA-0001"})
            self.assertEqual(api.list_my_assessments('{"status": "Draft"}'), {"assessments": [], "count": 0})
            self.assertEqual(api.create_risk("RBP-RAA-0001", '{"title": "Risk"}'), {"name": "RBP-RAR-0001"})
            self.assertEqual(api.create_action("RBP-RAR-0001", '{"title": "Action"}'), {"name": "RBP-RAACT-0001"})

        create_assessment.assert_called_once_with("owner@example.com", {"title": "A"})
        update_assessment.assert_called_once_with("owner@example.com", "RBP-RAA-0001", {"title": "B"})
        list_assessments.assert_called_once_with("owner@example.com", {"status": "Draft"})
        create_risk.assert_called_once_with("owner@example.com", "RBP-RAA-0001", {"title": "Risk"})
        create_action.assert_called_once_with("owner@example.com", "RBP-RAR-0001", {"title": "Action"})

    def test_admin_api_requires_system_manager(self):
        with (
            patch.object(api, "require_system_manager", return_value="manager@example.com"),
            patch.object(api.service, "admin_assign_assessment", return_value={"assigned_to": "advisor@example.com"}) as assign,
            patch.object(api.service, "admin_update_assessment_status", return_value={"status": "Closed"}) as update_status,
        ):
            assign_result = api.admin_assign_assessment("RBP-RAA-0001", "advisor@example.com")
            status_result = api.admin_update_assessment_status("RBP-RAA-0001", "Closed", '{"notes": "Done"}')

        self.assertEqual(assign_result["assigned_to"], "advisor@example.com")
        self.assertEqual(status_result["status"], "Closed")
        assign.assert_called_once_with("manager@example.com", "RBP-RAA-0001", "advisor@example.com")
        update_status.assert_called_once_with("manager@example.com", "RBP-RAA-0001", "Closed", {"notes": "Done"})
