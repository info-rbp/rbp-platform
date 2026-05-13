import json
from pathlib import Path
from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.api import connectivity as api
from rbp_app.services import connectivity as service


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
        self._store.docs.setdefault(self.doctype, {})[self.name] = self
        return self

    def save(self, ignore_permissions=False):
        self._store.docs.setdefault(self.doctype, {})[self.name] = self
        return self


class FakeStore:
    def __init__(self):
        self.docs = {
            service.REQUEST_DOCTYPE: {},
            service.PROVIDER_DOCTYPE: {},
            service.QUOTE_DOCTYPE: {},
        }
        self.counters = {
            service.REQUEST_DOCTYPE: 0,
            service.PROVIDER_DOCTYPE: 0,
            service.QUOTE_DOCTYPE: 0,
        }

    def next_name(self, doctype):
        self.counters[doctype] += 1
        prefix = {
            service.REQUEST_DOCTYPE: "RBP-CON-REQ",
            service.PROVIDER_DOCTYPE: "RBP-CON-PROV",
            service.QUOTE_DOCTYPE: "RBP-CON-QUOTE",
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
            if not self._matches(doc, filters or {}):
                continue
            row = {}
            for field in fields or []:
                row[field] = getattr(doc, field, None)
            rows.append(row)
        return rows

    def _matches(self, doc, filters):
        for field, expected in filters.items():
            actual = getattr(doc, field, None)
            if isinstance(expected, list) and expected[0] == "!=":
                if actual == expected[1]:
                    return False
            elif isinstance(expected, list) and expected[0] == "in":
                if actual not in expected[1]:
                    return False
            elif actual != expected:
                return False
        return True


class ConnectivityTestCase(TestCase):
    def setUp(self):
        self.store = FakeStore()
        self.audit_events = []
        self.notifications = []
        self.tenants = {
            "owner@example.com": "TENANT-1",
            "advisor@example.com": "TENANT-1",
            "other@example.com": "TENANT-2",
            "manager@example.com": "TENANT-ADMIN",
            "Administrator": "TENANT-ADMIN",
        }
        self.patchers = [
            patch.object(service, "doctype_exists", return_value=True),
            patch.object(service.frappe, "get_doc", side_effect=self.store.get_doc),
            patch.object(service.frappe, "get_all", side_effect=self.store.get_all),
            patch.object(service, "get_current_tenant_name", side_effect=lambda user=None: self.tenants.get(user)),
            patch.object(service, "is_admin_user", side_effect=lambda user=None: user in {"manager@example.com", "Administrator"}),
            patch.object(service, "now_datetime", return_value="2026-05-08 12:00:00"),
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
                "location_name": "Perth office",
                "address_line_1": "1 St Georges Terrace",
                "service_type": "NBN",
                "desired_speed": "100/40",
            },
        )

    def create_provider(self, tenant="TENANT-1", payload=None):
        data = {"tenant": tenant, "provider_name": "Fast Fibre", "service_types": "NBN", "status": "Active"}
        data.update(payload or {})
        return service.create_provider("manager@example.com", data)

    def create_quote(self, request=None, provider=None, user="manager@example.com", payload=None):
        request = request or self.create_request()
        provider = provider or self.create_provider(request["tenant"])
        data = {
            "provider": provider["name"],
            "quote_title": "Business fibre",
            "speed_down": "100",
            "speed_up": "40",
            "monthly_cost": 99,
            "setup_cost": 0,
            "contract_months": 24,
            "status": "Presented",
        }
        data.update(payload or {})
        return service.create_quote(user, request["name"], data)


class TestConnectivityDoctypes(TestCase):
    def test_request_provider_and_quote_doctype_fields(self):
        request_fields = doctype_fields("rbp_connectivity_request", "rbp_connectivity_request.json")
        provider_fields = doctype_fields("rbp_connectivity_provider", "rbp_connectivity_provider.json")
        quote_fields = doctype_fields("rbp_connectivity_quote", "rbp_connectivity_quote.json")

        for field in {
            "tenant",
            "owner_user",
            "business_profile",
            "location_name",
            "address_line_1",
            "address_line_2",
            "suburb",
            "state",
            "postcode",
            "service_type",
            "current_provider",
            "current_plan",
            "desired_speed",
            "budget",
            "status",
            "workflow_state",
            "assigned_to",
            "submitted_on",
            "reviewed_on",
            "closed_on",
            "notes",
        }:
            self.assertIn(field, request_fields)

        for field in {
            "tenant",
            "provider_name",
            "contact_email",
            "contact_phone",
            "website",
            "service_regions",
            "service_types",
            "status",
            "notes",
        }:
            self.assertIn(field, provider_fields)

        for field in {
            "tenant",
            "connectivity_request",
            "provider",
            "quote_title",
            "speed_down",
            "speed_up",
            "monthly_cost",
            "setup_cost",
            "contract_months",
            "status",
            "recommended",
            "notes",
        }:
            self.assertIn(field, quote_fields)


class TestConnectivityService(ConnectivityTestCase):
    def test_create_and_update_draft_request(self):
        request = self.create_request()

        updated = service.update_draft_request("owner@example.com", request["name"], {"location_name": "Updated office", "status": "Completed"})

        self.assertEqual(request["tenant"], "TENANT-1")
        self.assertEqual(request["owner_user"], "owner@example.com")
        self.assertEqual(updated["location_name"], "Updated office")
        self.assertEqual(updated["status"], "Draft")
        self.assertEqual([event for event, _kwargs in self.audit_events], ["connectivity_request_created", "connectivity_request_updated"])

    def test_submit_request_and_cannot_update_after_submit(self):
        request = self.create_request()

        submitted = service.submit_request("owner@example.com", request["name"])

        self.assertEqual(submitted["status"], "Submitted")
        self.assertEqual(submitted["submitted_on"], "2026-05-08 12:00:00")
        self.assertEqual(self.audit_events[-1][0], "connectivity_request_submitted")
        self.assertIn("Connectivity request submitted", [notification["title"] for notification in self.notifications])
        with self.assertRaises(frappe.ValidationError):
            service.update_draft_request("owner@example.com", request["name"], {"location_name": "Too late"})

    def test_list_and_get_request_for_owner_and_assigned_user(self):
        own = self.create_request()
        assigned = self.create_request(payload={"location_name": "Branch"})
        other = self.create_request("other@example.com", {"location_name": "Other tenant"})
        service.submit_request("owner@example.com", assigned["name"])
        service.admin_assign_request("manager@example.com", assigned["name"], "advisor@example.com")

        owner_result = service.list_my_requests("owner@example.com")
        advisor_result = service.list_my_requests("advisor@example.com")
        detail = service.get_request("advisor@example.com", assigned["name"])

        self.assertEqual({row["name"] for row in owner_result["requests"]}, {own["name"], assigned["name"]})
        self.assertEqual({row["name"] for row in advisor_result["requests"]}, {assigned["name"]})
        self.assertNotIn(other["name"], {row["name"] for row in advisor_result["requests"]})
        self.assertEqual(detail["name"], assigned["name"])

    def test_admin_assign_and_update_status(self):
        request = self.create_request()
        service.submit_request("owner@example.com", request["name"])

        assigned = service.admin_assign_request("manager@example.com", request["name"], "advisor@example.com")
        updated = service.admin_update_status("manager@example.com", request["name"], "Quoted", {"notes": "Quotes ready"})

        self.assertEqual(assigned["assigned_to"], "advisor@example.com")
        self.assertEqual(assigned["status"], "In Review")
        self.assertEqual(updated["status"], "Quoted")
        self.assertEqual(updated["reviewed_on"], "2026-05-08 12:00:00")
        self.assertEqual(self.audit_events[-2][0], "connectivity_request_assigned")
        self.assertEqual(self.audit_events[-1][0], "connectivity_status_updated")
        self.assertIn("Connectivity request assigned", [notification["title"] for notification in self.notifications])
        self.assertIn("Connectivity status changed", [notification["title"] for notification in self.notifications])

    def test_create_update_and_list_provider_are_admin_managed(self):
        provider = self.create_provider(payload={"provider_name": "Provider A", "contact_email": "a@example.com"})

        updated = service.update_provider("manager@example.com", provider["name"], {"status": "Inactive", "website": "https://example.com"})
        listed_admin = service.list_providers("manager@example.com")
        listed_owner = service.list_providers("owner@example.com")

        self.assertEqual(updated["status"], "Inactive")
        self.assertIn(provider["name"], {row["name"] for row in listed_admin["providers"]})
        self.assertNotIn(provider["name"], {row["name"] for row in listed_owner["providers"]})
        self.assertEqual(self.audit_events[-2][0], "connectivity_provider_created")
        self.assertEqual(self.audit_events[-1][0], "connectivity_provider_updated")
        with self.assertRaises(frappe.PermissionError):
            service.create_provider("owner@example.com", {"provider_name": "Nope"})

    def test_create_update_and_accept_quote(self):
        request = self.create_request()
        service.submit_request("owner@example.com", request["name"])
        service.admin_assign_request("manager@example.com", request["name"], "advisor@example.com")
        provider = self.create_provider()

        quote = service.create_quote(
            "advisor@example.com",
            request["name"],
            {"provider": provider["name"], "quote_title": "NBN Pro", "status": "Draft"},
        )
        updated = service.update_quote("advisor@example.com", quote["name"], {"status": "Presented", "recommended": 1})
        accepted = service.accept_quote("owner@example.com", quote["name"])
        detail = service.get_request("owner@example.com", request["name"])

        self.assertEqual(quote["status"], "Draft")
        self.assertEqual(updated["status"], "Presented")
        self.assertEqual(updated["recommended"], 1)
        self.assertEqual(accepted["status"], "Accepted")
        self.assertEqual(detail["status"], "Approved")
        self.assertEqual(detail["quotes"][0]["name"], quote["name"])
        self.assertEqual(self.audit_events[-3][0], "connectivity_quote_created")
        self.assertEqual(self.audit_events[-2][0], "connectivity_quote_updated")
        self.assertEqual(self.audit_events[-1][0], "connectivity_quote_accepted")
        self.assertIn("Connectivity quote presented", [notification["title"] for notification in self.notifications])
        self.assertIn("Connectivity quote accepted", [notification["title"] for notification in self.notifications])

    def test_owner_assigned_admin_access_and_cross_tenant_denial(self):
        request = self.create_request()
        service.submit_request("owner@example.com", request["name"])
        service.admin_assign_request("manager@example.com", request["name"], "advisor@example.com")
        provider = self.create_provider()
        quote = self.create_quote(request=request, provider=provider, user="advisor@example.com", payload={"status": "Draft"})

        owner_detail = service.get_request("owner@example.com", request["name"])
        advisor_detail = service.get_request("advisor@example.com", request["name"])
        admin_result = service.admin_update_status("manager@example.com", request["name"], "Quoted")

        self.assertEqual(owner_detail["name"], request["name"])
        self.assertEqual(advisor_detail["name"], request["name"])
        self.assertEqual(admin_result["status"], "Quoted")
        with self.assertRaises(frappe.PermissionError):
            service.get_request("other@example.com", request["name"])
        with self.assertRaises(frappe.PermissionError):
            service.update_quote("other@example.com", quote["name"], {"notes": "No"})
        with self.assertRaises(frappe.PermissionError):
            service.accept_quote("other@example.com", quote["name"])

    def test_cross_tenant_provider_linking_is_denied(self):
        request = self.create_request()
        service.submit_request("owner@example.com", request["name"])
        service.admin_assign_request("manager@example.com", request["name"], "advisor@example.com")
        other_provider = self.create_provider("TENANT-2", {"provider_name": "Other Provider"})

        with self.assertRaises(frappe.PermissionError):
            service.create_quote("advisor@example.com", request["name"], {"provider": other_provider["name"], "quote_title": "Bad"})

    def test_audit_and_notification_events_cover_required_lifecycle(self):
        request = self.create_request()
        service.update_draft_request("owner@example.com", request["name"], {"notes": "Updated"})
        service.submit_request("owner@example.com", request["name"])
        service.admin_assign_request("manager@example.com", request["name"], "advisor@example.com")
        service.admin_update_status("manager@example.com", request["name"], "Quoted")
        provider = self.create_provider()
        service.update_provider("manager@example.com", provider["name"], {"notes": "Updated"})
        quote = service.create_quote("advisor@example.com", request["name"], {"provider": provider["name"], "quote_title": "Quote"})
        service.update_quote("advisor@example.com", quote["name"], {"status": "Presented"})
        service.accept_quote("owner@example.com", quote["name"])

        self.assertEqual(
            [event for event, _kwargs in self.audit_events],
            [
                "connectivity_request_created",
                "connectivity_request_updated",
                "connectivity_request_submitted",
                "connectivity_request_assigned",
                "connectivity_status_updated",
                "connectivity_provider_created",
                "connectivity_provider_updated",
                "connectivity_quote_created",
                "connectivity_quote_updated",
                "connectivity_quote_accepted",
            ],
        )
        for title in {
            "Connectivity request submitted",
            "Connectivity request assigned",
            "Connectivity status changed",
            "Connectivity quote presented",
            "Connectivity quote accepted",
        }:
            self.assertIn(title, [notification["title"] for notification in self.notifications])


class TestConnectivityApi(TestCase):
    def test_api_methods_are_thin_and_coerce_payloads(self):
        with (
            patch.object(api, "require_login", return_value="owner@example.com"),
            patch.object(api, "require_system_manager", return_value="manager@example.com"),
            patch.object(api.service, "create_request", return_value={"name": "RBP-CON-REQ-0001"}) as create_request,
            patch.object(api.service, "update_draft_request", return_value={"name": "RBP-CON-REQ-0001"}) as update_draft_request,
            patch.object(api.service, "submit_request", return_value={"name": "RBP-CON-REQ-0001"}) as submit_request,
            patch.object(api.service, "list_my_requests", return_value={"requests": [], "count": 0}) as list_my_requests,
            patch.object(api.service, "get_request", return_value={"name": "RBP-CON-REQ-0001"}) as get_request,
            patch.object(api.service, "admin_assign_request", return_value={"name": "RBP-CON-REQ-0001"}) as admin_assign_request,
            patch.object(api.service, "admin_update_status", return_value={"name": "RBP-CON-REQ-0001"}) as admin_update_status,
            patch.object(api.service, "create_provider", return_value={"name": "RBP-CON-PROV-0001"}) as create_provider,
            patch.object(api.service, "update_provider", return_value={"name": "RBP-CON-PROV-0001"}) as update_provider,
            patch.object(api.service, "list_providers", return_value={"providers": [], "count": 0}) as list_providers,
            patch.object(api.service, "create_quote", return_value={"name": "RBP-CON-QUOTE-0001"}) as create_quote,
            patch.object(api.service, "update_quote", return_value={"name": "RBP-CON-QUOTE-0001"}) as update_quote,
            patch.object(api.service, "accept_quote", return_value={"name": "RBP-CON-QUOTE-0001"}) as accept_quote,
        ):
            self.assertEqual(api.create_request('{"location_name": "A"}'), {"name": "RBP-CON-REQ-0001"})
            self.assertEqual(api.update_draft_request("RBP-CON-REQ-0001", '{"notes": "B"}'), {"name": "RBP-CON-REQ-0001"})
            self.assertEqual(api.submit_request("RBP-CON-REQ-0001"), {"name": "RBP-CON-REQ-0001"})
            self.assertEqual(api.list_my_requests('{"status": "Draft"}'), {"requests": [], "count": 0})
            self.assertEqual(api.get_request("RBP-CON-REQ-0001"), {"name": "RBP-CON-REQ-0001"})
            self.assertEqual(api.admin_assign_request("RBP-CON-REQ-0001", "advisor@example.com"), {"name": "RBP-CON-REQ-0001"})
            self.assertEqual(api.admin_update_status("RBP-CON-REQ-0001", "In Review", '{"notes": "ok"}'), {"name": "RBP-CON-REQ-0001"})
            self.assertEqual(api.create_provider('{"provider_name": "A"}'), {"name": "RBP-CON-PROV-0001"})
            self.assertEqual(api.update_provider("RBP-CON-PROV-0001", '{"status": "Inactive"}'), {"name": "RBP-CON-PROV-0001"})
            self.assertEqual(api.list_providers('{"status": "Active"}'), {"providers": [], "count": 0})
            self.assertEqual(api.create_quote("RBP-CON-REQ-0001", '{"quote_title": "Q"}'), {"name": "RBP-CON-QUOTE-0001"})
            self.assertEqual(api.update_quote("RBP-CON-QUOTE-0001", '{"status": "Presented"}'), {"name": "RBP-CON-QUOTE-0001"})
            self.assertEqual(api.accept_quote("RBP-CON-QUOTE-0001"), {"name": "RBP-CON-QUOTE-0001"})

        create_request.assert_called_once_with("owner@example.com", {"location_name": "A"})
        update_draft_request.assert_called_once_with("owner@example.com", "RBP-CON-REQ-0001", {"notes": "B"})
        submit_request.assert_called_once_with("owner@example.com", "RBP-CON-REQ-0001")
        list_my_requests.assert_called_once_with("owner@example.com", {"status": "Draft"})
        get_request.assert_called_once_with("owner@example.com", "RBP-CON-REQ-0001")
        admin_assign_request.assert_called_once_with("manager@example.com", "RBP-CON-REQ-0001", "advisor@example.com")
        admin_update_status.assert_called_once_with("manager@example.com", "RBP-CON-REQ-0001", "In Review", {"notes": "ok"})
        create_provider.assert_called_once_with("manager@example.com", {"provider_name": "A"})
        update_provider.assert_called_once_with("manager@example.com", "RBP-CON-PROV-0001", {"status": "Inactive"})
        list_providers.assert_called_once_with("owner@example.com", {"status": "Active"})
        create_quote.assert_called_once_with("owner@example.com", "RBP-CON-REQ-0001", {"quote_title": "Q"})
        update_quote.assert_called_once_with("owner@example.com", "RBP-CON-QUOTE-0001", {"status": "Presented"})
        accept_quote.assert_called_once_with("owner@example.com", "RBP-CON-QUOTE-0001")
