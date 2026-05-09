import json
from pathlib import Path
from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.api import marketplace as api
from rbp_app.services import marketplace as service


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
            service.VENDOR_DOCTYPE: {},
            service.LISTING_DOCTYPE: {},
            service.ORDER_DOCTYPE: {},
        }
        self.counters = {
            service.VENDOR_DOCTYPE: 0,
            service.LISTING_DOCTYPE: 0,
            service.ORDER_DOCTYPE: 0,
        }

    def next_name(self, doctype):
        self.counters[doctype] += 1
        prefix = {
            service.VENDOR_DOCTYPE: "RBP-MPV",
            service.LISTING_DOCTYPE: "RBP-MPL",
            service.ORDER_DOCTYPE: "RBP-MPO",
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
            elif actual != expected:
                return False
        return True


class MarketplaceTestCase(TestCase):
    def setUp(self):
        self.store = FakeStore()
        self.audit_events = []
        self.notifications = []
        self.tenants = {
            "owner@example.com": "TENANT-1",
            "buyer@example.com": "TENANT-1",
            "other@example.com": "TENANT-2",
            "manager@example.com": "TENANT-ADMIN",
        }
        self.patchers = [
            patch.object(service, "doctype_exists", return_value=True),
            patch.object(service.frappe, "get_doc", side_effect=self.store.get_doc),
            patch.object(service.frappe, "get_all", side_effect=self.store.get_all),
            patch.object(service, "get_current_tenant_name", side_effect=lambda user=None: self.tenants.get(user)),
            patch.object(service, "is_admin_user", side_effect=lambda user=None: user == "manager@example.com"),
            patch.object(service, "now_datetime", return_value="2026-05-08 11:00:00"),
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

    def create_vendor(self, user="owner@example.com", payload=None):
        return service.create_vendor(user, payload or {"vendor_name": "RBP Partners", "status": "Active"})

    def create_listing(self, user="owner@example.com", vendor=None, payload=None):
        vendor = vendor or self.create_vendor(user)
        data = {
            "vendor": vendor["name"],
            "title": "Bookkeeping setup",
            "price": 120,
            "status": "Active",
            "visibility": "Tenant",
        }
        data.update(payload or {})
        return service.create_listing(user, data)

    def create_order(self, buyer="buyer@example.com", listing=None, payload=None):
        listing = listing or self.create_listing()
        return service.create_order(buyer, listing["name"], payload or {"quantity": 2})


class TestMarketplaceDoctypes(TestCase):
    def test_vendor_listing_and_order_doctype_fields(self):
        vendor_fields = doctype_fields("rbp_marketplace_vendor", "rbp_marketplace_vendor.json")
        listing_fields = doctype_fields("rbp_marketplace_listing", "rbp_marketplace_listing.json")
        order_fields = doctype_fields("rbp_marketplace_order", "rbp_marketplace_order.json")

        for field in {
            "tenant",
            "owner_user",
            "vendor_name",
            "description",
            "contact_email",
            "contact_phone",
            "website",
            "status",
            "verification_status",
            "notes",
        }:
            self.assertIn(field, vendor_fields)

        for field in {
            "tenant",
            "vendor",
            "owner_user",
            "title",
            "category",
            "description",
            "price",
            "currency",
            "billing_model",
            "status",
            "visibility",
            "notes",
        }:
            self.assertIn(field, listing_fields)

        for field in {
            "tenant",
            "listing",
            "vendor",
            "buyer_user",
            "status",
            "quantity",
            "total_amount",
            "currency",
            "requested_on",
            "approved_on",
            "fulfilled_on",
            "cancelled_on",
            "notes",
        }:
            self.assertIn(field, order_fields)


class TestMarketplaceService(MarketplaceTestCase):
    def test_create_update_list_and_get_vendor(self):
        vendor = self.create_vendor(payload={"vendor_name": "Alpha", "contact_email": "alpha@example.com", "status": "Active"})

        updated = service.update_vendor("owner@example.com", vendor["name"], {"description": "Updated", "verification_status": "Pending"})
        listed = service.list_vendors("buyer@example.com", {"status": "Active"})
        detail = service.get_vendor("buyer@example.com", vendor["name"])

        self.assertEqual(vendor["tenant"], "TENANT-1")
        self.assertEqual(vendor["owner_user"], "owner@example.com")
        self.assertEqual(updated["verification_status"], "Pending")
        self.assertEqual({row["name"] for row in listed["vendors"]}, {vendor["name"]})
        self.assertEqual(detail["vendor_name"], "Alpha")
        self.assertEqual([event for event, _kwargs in self.audit_events], ["marketplace_vendor_created", "marketplace_vendor_updated"])
        self.assertEqual(self.notifications[0]["title"], "Marketplace vendor created")

    def test_create_update_list_and_get_listing_through_vendor_owner(self):
        vendor = self.create_vendor()
        listing = self.create_listing(vendor=vendor)

        updated = service.update_listing("owner@example.com", listing["name"], {"title": "Updated listing", "billing_model": "Quote"})
        listed = service.list_listings("buyer@example.com", {"status": "Active"})
        detail = service.get_listing("buyer@example.com", listing["name"])

        self.assertEqual(listing["tenant"], "TENANT-1")
        self.assertEqual(listing["owner_user"], "owner@example.com")
        self.assertEqual(updated["billing_model"], "Quote")
        self.assertEqual({row["name"] for row in listed["listings"]}, {listing["name"]})
        self.assertEqual(detail["title"], "Updated listing")
        self.assertEqual(self.audit_events[-1][0], "marketplace_listing_updated")
        self.assertEqual(self.notifications[-1]["title"], "Marketplace listing created")

    def test_create_order_update_status_list_and_get_order(self):
        order = self.create_order(payload={"quantity": 3, "notes": "Please confirm timing"})

        approved = service.update_order_status("owner@example.com", order["name"], "Approved", {"notes": "Approved"})
        listed_for_buyer = service.list_my_orders("buyer@example.com")
        listed_for_vendor = service.list_my_orders("owner@example.com")
        detail = service.get_order("owner@example.com", order["name"])

        self.assertEqual(order["buyer_user"], "buyer@example.com")
        self.assertEqual(order["status"], "Requested")
        self.assertEqual(order["total_amount"], 360)
        self.assertEqual(approved["status"], "Approved")
        self.assertEqual(approved["approved_on"], "2026-05-08 11:00:00")
        self.assertEqual({row["name"] for row in listed_for_buyer["orders"]}, {order["name"]})
        self.assertEqual({row["name"] for row in listed_for_vendor["orders"]}, {order["name"]})
        self.assertEqual(detail["name"], order["name"])
        self.assertEqual(self.audit_events[-2][0], "marketplace_order_created")
        self.assertEqual(self.audit_events[-1][0], "marketplace_order_status_updated")
        self.assertIn("Marketplace order requested", [notification["title"] for notification in self.notifications])
        self.assertIn("Marketplace order status changed", [notification["title"] for notification in self.notifications])

    def test_owner_vendor_buyer_and_admin_access_paths(self):
        vendor = self.create_vendor()
        listing = self.create_listing(vendor=vendor)
        order = self.create_order(listing=listing)

        service.update_vendor("owner@example.com", vendor["name"], {"notes": "Owner edit"})
        service.update_listing("owner@example.com", listing["name"], {"notes": "Vendor edit"})
        buyer_detail = service.get_order("buyer@example.com", order["name"])
        admin_listing = service.update_listing("manager@example.com", listing["name"], {"title": "Admin edit"})
        admin_orders = service.list_my_orders("manager@example.com")

        self.assertEqual(buyer_detail["name"], order["name"])
        self.assertEqual(admin_listing["title"], "Admin edit")
        self.assertIn(order["name"], {row["name"] for row in admin_orders["orders"]})

    def test_cross_tenant_access_is_denied(self):
        other_vendor = self.create_vendor("other@example.com", {"vendor_name": "Other", "status": "Active"})
        other_listing = self.create_listing("other@example.com", other_vendor)
        own_listing = self.create_listing()

        with self.assertRaises(frappe.PermissionError):
            service.get_vendor("owner@example.com", other_vendor["name"])
        with self.assertRaises(frappe.PermissionError):
            service.create_listing("owner@example.com", {"vendor": other_vendor["name"], "title": "Bad"})
        with self.assertRaises(frappe.PermissionError):
            service.get_listing("owner@example.com", other_listing["name"])
        with self.assertRaises(frappe.PermissionError):
            service.create_order("other@example.com", own_listing["name"], {"quantity": 1})

    def test_permission_and_transition_failures(self):
        vendor = self.create_vendor()
        listing = self.create_listing(vendor=vendor)
        order = self.create_order(listing=listing)

        with self.assertRaises(frappe.PermissionError):
            service.update_vendor("buyer@example.com", vendor["name"], {"notes": "Nope"})
        with self.assertRaises(frappe.PermissionError):
            service.update_listing("buyer@example.com", listing["name"], {"notes": "Nope"})
        with self.assertRaises(frappe.PermissionError):
            service.update_order_status("buyer@example.com", order["name"], "Approved")
        with self.assertRaises(frappe.ValidationError):
            service.update_order_status("owner@example.com", order["name"], "Fulfilled")

    def test_audit_and_notification_events_cover_required_lifecycle(self):
        vendor = self.create_vendor()
        service.update_vendor("owner@example.com", vendor["name"], {"description": "Updated"})
        listing = self.create_listing(vendor=vendor)
        service.update_listing("owner@example.com", listing["name"], {"description": "Updated"})
        order = self.create_order(listing=listing)
        service.update_order_status("owner@example.com", order["name"], "Approved")

        self.assertEqual(
            [event for event, _kwargs in self.audit_events],
            [
                "marketplace_vendor_created",
                "marketplace_vendor_updated",
                "marketplace_listing_created",
                "marketplace_listing_updated",
                "marketplace_order_created",
                "marketplace_order_status_updated",
            ],
        )
        self.assertEqual(
            [
                "Marketplace vendor created",
                "Marketplace listing created",
                "Marketplace order requested",
                "Marketplace order status changed",
                "Marketplace order status changed",
            ],
            [notification["title"] for notification in self.notifications],
        )


class TestMarketplaceApi(TestCase):
    def test_api_methods_are_thin_and_coerce_payloads(self):
        with (
            patch.object(api, "require_login", return_value="owner@example.com"),
            patch.object(api.service, "create_vendor", return_value={"name": "RBP-MPV-0001"}) as create_vendor,
            patch.object(api.service, "update_vendor", return_value={"name": "RBP-MPV-0001"}) as update_vendor,
            patch.object(api.service, "list_vendors", return_value={"vendors": [], "count": 0}) as list_vendors,
            patch.object(api.service, "get_vendor", return_value={"name": "RBP-MPV-0001"}) as get_vendor,
            patch.object(api.service, "create_listing", return_value={"name": "RBP-MPL-0001"}) as create_listing,
            patch.object(api.service, "update_listing", return_value={"name": "RBP-MPL-0001"}) as update_listing,
            patch.object(api.service, "list_listings", return_value={"listings": [], "count": 0}) as list_listings,
            patch.object(api.service, "get_listing", return_value={"name": "RBP-MPL-0001"}) as get_listing,
            patch.object(api.service, "create_order", return_value={"name": "RBP-MPO-0001"}) as create_order,
            patch.object(api.service, "update_order_status", return_value={"name": "RBP-MPO-0001"}) as update_order_status,
            patch.object(api.service, "list_my_orders", return_value={"orders": [], "count": 0}) as list_my_orders,
            patch.object(api.service, "get_order", return_value={"name": "RBP-MPO-0001"}) as get_order,
        ):
            self.assertEqual(api.create_vendor('{"vendor_name": "A"}'), {"name": "RBP-MPV-0001"})
            self.assertEqual(api.update_vendor("RBP-MPV-0001", '{"description": "B"}'), {"name": "RBP-MPV-0001"})
            self.assertEqual(api.list_vendors('{"status": "Active"}'), {"vendors": [], "count": 0})
            self.assertEqual(api.get_vendor("RBP-MPV-0001"), {"name": "RBP-MPV-0001"})
            self.assertEqual(api.create_listing('{"vendor": "RBP-MPV-0001"}'), {"name": "RBP-MPL-0001"})
            self.assertEqual(api.update_listing("RBP-MPL-0001", '{"title": "B"}'), {"name": "RBP-MPL-0001"})
            self.assertEqual(api.list_listings('{"category": "Ops"}'), {"listings": [], "count": 0})
            self.assertEqual(api.get_listing("RBP-MPL-0001"), {"name": "RBP-MPL-0001"})
            self.assertEqual(api.create_order("RBP-MPL-0001", '{"quantity": 2}'), {"name": "RBP-MPO-0001"})
            self.assertEqual(api.update_order_status("RBP-MPO-0001", "Approved", '{"notes": "ok"}'), {"name": "RBP-MPO-0001"})
            self.assertEqual(api.list_my_orders('{"status": "Requested"}'), {"orders": [], "count": 0})
            self.assertEqual(api.get_order("RBP-MPO-0001"), {"name": "RBP-MPO-0001"})

        create_vendor.assert_called_once_with("owner@example.com", {"vendor_name": "A"})
        update_vendor.assert_called_once_with("owner@example.com", "RBP-MPV-0001", {"description": "B"})
        list_vendors.assert_called_once_with("owner@example.com", {"status": "Active"})
        get_vendor.assert_called_once_with("owner@example.com", "RBP-MPV-0001")
        create_listing.assert_called_once_with("owner@example.com", {"vendor": "RBP-MPV-0001"})
        update_listing.assert_called_once_with("owner@example.com", "RBP-MPL-0001", {"title": "B"})
        list_listings.assert_called_once_with("owner@example.com", {"category": "Ops"})
        get_listing.assert_called_once_with("owner@example.com", "RBP-MPL-0001")
        create_order.assert_called_once_with("owner@example.com", "RBP-MPL-0001", {"quantity": 2})
        update_order_status.assert_called_once_with("owner@example.com", "RBP-MPO-0001", "Approved", {"notes": "ok"})
        list_my_orders.assert_called_once_with("owner@example.com", {"status": "Requested"})
        get_order.assert_called_once_with("owner@example.com", "RBP-MPO-0001")
