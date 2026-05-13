import json
import re
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import frappe

from rbp_app.api import docushare as docushare_api
from rbp_app.api import marketplace as marketplace_api
from rbp_app.patches import backfill_service_request_reference_ids as backfill_patch
from rbp_app.services import connectivity, decision_desk, docushare, marketplace, risk_advisor, the_fixer


DOCTYPE_ROOT = Path(__file__).resolve().parents[1] / "doctype"

TARGET_DOCTYPES = {
    "rbp_decision_desk_request/rbp_decision_desk_request.json": "owner_user",
    "rbp_docushare_document/rbp_docushare_document.json": "owner_user",
    "rbp_connectivity_request/rbp_connectivity_request.json": "owner_user",
    "rbp_risk_advisor_assessment/rbp_risk_advisor_assessment.json": "owner_user",
    "rbp_fixer_case/rbp_fixer_case.json": "owner_user",
    "rbp_marketplace_listing/rbp_marketplace_listing.json": "owner_user",
    "rbp_marketplace_order/rbp_marketplace_order.json": "buyer_user",
}

REFERENCE_REGEX = {
    "decision_desk": r"^RBP-DD-\d{4}-\d{4}$",
    "docushare": r"^RBP-DOC-\d{4}-\d{4}$",
    "connectivity": r"^RBP-NBN-\d{4}-\d{4}$",
    "risk_advisor": r"^RBP-RISK-\d{4}-\d{4}$",
    "the_fixer": r"^RBP-FIX-\d{4}-\d{4}$",
    "marketplace_listing": r"^RBP-MKT-\d{4}-\d{4}$",
    "marketplace_enquiry": r"^RBP-MKT-ENQ-\d{4}-\d{4}$",
}


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
    PREFIXES = {
        decision_desk.REQUEST_DOCTYPE: "DDR",
        docushare.DOCUMENT_DOCTYPE: "DOC",
        connectivity.REQUEST_DOCTYPE: "NBN",
        risk_advisor.ASSESSMENT_DOCTYPE: "RISK",
        the_fixer.CASE_DOCTYPE: "FIX",
        marketplace.VENDOR_DOCTYPE: "MPV",
        marketplace.LISTING_DOCTYPE: "MPL",
        marketplace.ORDER_DOCTYPE: "MPO",
    }

    def __init__(self):
        self.docs = {doctype: {} for doctype in self.PREFIXES}
        self.counters = {doctype: 0 for doctype in self.PREFIXES}

    def next_name(self, doctype):
        self.counters[doctype] += 1
        return f"RBP-{self.PREFIXES[doctype]}-{self.counters[doctype]:04d}"

    def get_doc(self, doctype_or_payload, name=None):
        if isinstance(doctype_or_payload, dict):
            return FakeDoc(self, **doctype_or_payload)
        try:
            return self.docs[doctype_or_payload][name]
        except KeyError:
            raise frappe.DoesNotExistError

    def get_all(self, doctype, filters=None, fields=None, order_by=None, **kwargs):
        if doctype == "Has Role":
            return [{"parent": "manager@example.com"}]
        rows = []
        for doc in self.docs.get(doctype, {}).values():
            if not self._matches(doc, filters or {}):
                continue
            row = {}
            for field in fields or []:
                row[field] = getattr(doc, field, None)
            rows.append(row)
        return rows

    def _matches(self, doc, filters):
        if isinstance(filters, list):
            return True
        for field, expected in filters.items():
            actual = getattr(doc, field, None)
            if isinstance(expected, list) and expected[0] == "!=":
                if actual == expected[1]:
                    return False
            elif actual != expected:
                return False
        return True


class ServicePersistenceTest(unittest.TestCase):
    def setUp(self):
        self.store = FakeStore()
        self.audit_events = []
        self.notifications = []
        self.email_events = []
        self.tenants = {
            "customer@example.com": "TENANT-1",
            "buyer@example.com": "TENANT-1",
            "owner@example.com": "TENANT-1",
            "other@example.com": "TENANT-2",
            "manager@example.com": "TENANT-ADMIN",
            "Administrator": "TENANT-ADMIN",
        }
        self.modules = [decision_desk, docushare, connectivity, risk_advisor, the_fixer, marketplace]
        self.patchers = []
        for module in self.modules:
            self.patchers.extend(
                [
                    patch.object(module, "doctype_exists", return_value=True),
                    patch.object(module.frappe, "get_doc", side_effect=self.store.get_doc),
                    patch.object(module.frappe, "get_all", side_effect=self.store.get_all),
                    patch.object(module, "get_current_tenant_name", side_effect=lambda user=None: self.tenants.get(user)),
                    patch.object(module, "is_admin_user", side_effect=lambda user=None: user in {"manager@example.com", "Administrator"}),
                    patch.object(module, "now_datetime", return_value="2026-05-13 09:30:00"),
                    patch.object(module, "generate_reference_id", side_effect=lambda prefix: f"{prefix}-2026-0001"),
                    patch.object(module, "record_audit_event", side_effect=lambda event_type, **kwargs: self.audit_events.append((event_type, kwargs))),
                    patch.object(module, "create_notification", side_effect=lambda **kwargs: self.notifications.append(kwargs)),
                    patch.object(module, "emit_event_notification", side_effect=lambda **kwargs: self.email_events.append(kwargs)),
                ]
            )
            if hasattr(module, "_has_field"):
                self.patchers.append(patch.object(module, "_has_field", return_value=True))
        for patcher in self.patchers:
            patcher.start()

    def tearDown(self):
        for patcher in reversed(self.patchers):
            patcher.stop()

    def assert_normalized_submission(self, result, key, owner_field="owner_user", owner="customer@example.com"):
        self.assertRegex(result["reference_id"], REFERENCE_REGEX[key])
        self.assertEqual(result["tenant"], "TENANT-1")
        self.assertEqual(result[owner_field], owner)
        self.assertIn(result["status"], {"Submitted", "Under Review", "Requested"})
        self.assertEqual(result["source_channel"], "portal")
        self.assertTrue(result["submitted_on"])
        self.assertTrue(result["portal_route"])
        self.assertTrue(result["admin_route"])

    def test_target_doctype_schema_fields_exist(self):
        required = {"tenant", "reference_id", "status", "workflow_state", "submitted_on", "source_channel", "assigned_to", "reviewed_on", "closed_on"}
        for relative_path, owner_field in TARGET_DOCTYPES.items():
            data = json.loads((DOCTYPE_ROOT / relative_path).read_text())
            fields = {field["fieldname"] for field in data["fields"]}
            self.assertTrue(required.issubset(fields), relative_path)
            self.assertIn(owner_field, fields)

    def test_guest_create_rejected_for_all_services(self):
        with self.assertRaises(frappe.PermissionError):
            decision_desk.create_request("Guest", {"submit": True})
        with self.assertRaises(frappe.PermissionError):
            docushare.create_document("Guest", {"submit": True})
        with self.assertRaises(frappe.PermissionError):
            connectivity.create_request("Guest", {"submit": True})
        with self.assertRaises(frappe.PermissionError):
            risk_advisor.create_assessment("Guest", {"submit": True})
        with self.assertRaises(frappe.PermissionError):
            the_fixer.create_case("Guest", {"submit": True})
        with self.assertRaises(frappe.PermissionError):
            marketplace.create_listing("Guest", {"submit": True})

    def test_submitted_create_flows_are_persisted_and_normalized(self):
        decision = decision_desk.create_request("customer@example.com", {"title": "Decision", "tenant": "EVIL", "submit": True})
        doc = docushare.create_document("customer@example.com", {"title": "Brief", "tenant": "EVIL", "submit": True})
        nbn = connectivity.create_request("customer@example.com", {"location_name": "Office", "service_type": "NBN", "tenant": "EVIL", "submit": True})
        risk = risk_advisor.create_assessment("customer@example.com", {"title": "Risk", "tenant": "EVIL", "submit": True})
        fixer = the_fixer.create_case("customer@example.com", {"title": "Fix", "tenant": "EVIL", "submit": True})

        vendor = marketplace.create_vendor("owner@example.com", {"vendor_name": "Vendor", "status": "Active"})
        listing = marketplace.create_listing("owner@example.com", {"vendor": vendor["name"], "title": "Listing", "price": 10, "tenant": "EVIL"})
        active_listing = marketplace.admin_update_listing_status("manager@example.com", listing["name"], "Active", {"visibility": "Tenant"})
        enquiry = marketplace.create_order("buyer@example.com", active_listing["name"], {"quantity": 1, "tenant": "EVIL"})

        self.assert_normalized_submission(decision, "decision_desk")
        self.assert_normalized_submission(doc, "docushare")
        self.assert_normalized_submission(nbn, "connectivity")
        self.assert_normalized_submission(risk, "risk_advisor")
        self.assert_normalized_submission(fixer, "the_fixer")
        self.assert_normalized_submission(listing, "marketplace_listing", owner="owner@example.com")
        self.assert_normalized_submission(enquiry, "marketplace_enquiry", owner_field="buyer_user", owner="buyer@example.com")
        self.assertGreaterEqual(len(self.notifications), 14)
        self.assertGreaterEqual(len(self.email_events), 7)

    def test_notification_hook_failure_does_not_block_persistence(self):
        with patch.object(decision_desk, "emit_event_notification", side_effect=RuntimeError("email down")):
            result = decision_desk.create_request("customer@example.com", {"title": "Decision", "submit": True})
        self.assertEqual(result["status"], "Submitted")
        self.assertIn(result["name"], self.store.docs[decision_desk.REQUEST_DOCTYPE])

    def test_admin_status_update_changes_workflow_dates_and_rejects_customer(self):
        request = connectivity.create_request("customer@example.com", {"location_name": "Office", "service_type": "NBN", "submit": True})
        with self.assertRaises(frappe.PermissionError):
            connectivity.admin_update_status("customer@example.com", request["name"], "In Review", {})

        updated = connectivity.admin_update_status("manager@example.com", request["name"], "In Review", {"assigned_to": "manager@example.com"})

        self.assertEqual(updated["status"], "In Review")
        self.assertEqual(updated["workflow_state"], "In Review")
        self.assertEqual(updated["reviewed_on"], "2026-05-13 09:30:00")
        activity_row = connectivity.get_request("customer@example.com", request["name"])
        self.assertEqual(activity_row["status"], "In Review")

    def test_admin_api_wrappers_require_system_manager(self):
        with patch.object(docushare_api, "require_system_manager", side_effect=frappe.PermissionError):
            with self.assertRaises(frappe.PermissionError):
                docushare_api.admin_update_status("DOC-1", "Active")
        with patch.object(marketplace_api, "require_system_manager", side_effect=frappe.PermissionError):
            with self.assertRaises(frappe.PermissionError):
                marketplace_api.admin_update_listing_status("MPL-1", "Active")
            with self.assertRaises(frappe.PermissionError):
                marketplace_api.admin_update_enquiry_status("MPO-1", "Approved")


class BackfillPatchTest(unittest.TestCase):
    def test_backfill_updates_only_missing_reference_ids(self):
        rows = [
            {"name": "A", "reference_id": None},
            {"name": "B", "reference_id": ""},
            {"name": "C", "reference_id": "RBP-DD-2026-9999"},
        ]
        updates = []
        meta = SimpleNamespace(has_field=lambda fieldname: fieldname == "reference_id")
        with (
            patch.object(backfill_patch, "doctype_exists", return_value=True),
            patch.object(backfill_patch.frappe, "get_meta", return_value=meta),
            patch.object(backfill_patch.frappe, "get_all", return_value=rows),
            patch.object(backfill_patch.frappe.db, "set_value", side_effect=lambda *args, **kwargs: updates.append((args, kwargs))),
            patch.object(backfill_patch, "generate_reference_id", side_effect=lambda prefix: f"{prefix}-2026-0001"),
        ):
            updated = backfill_patch.backfill_doctype_reference_ids("RBP Decision Desk Request", "RBP-DD")

        self.assertEqual(updated, 2)
        self.assertEqual([args[1] for args, _kwargs in updates], ["A", "B"])

    def test_backfill_skips_missing_doctype_or_field(self):
        with patch.object(backfill_patch, "doctype_exists", return_value=False):
            self.assertEqual(backfill_patch.backfill_doctype_reference_ids("Missing", "RBP-X"), 0)


if __name__ == "__main__":
    unittest.main()

