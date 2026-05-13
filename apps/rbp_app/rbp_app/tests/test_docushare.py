import json
from pathlib import Path
from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

import frappe

from rbp_app.api import docushare as api
from rbp_app.services import docushare as service


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
            service.FOLDER_DOCTYPE: {},
            service.DOCUMENT_DOCTYPE: {},
            service.SHARE_DOCTYPE: {},
            service.FILE_REFERENCE_DOCTYPE: {},
        }
        self.counters = {
            service.FOLDER_DOCTYPE: 0,
            service.DOCUMENT_DOCTYPE: 0,
            service.SHARE_DOCTYPE: 0,
            service.FILE_REFERENCE_DOCTYPE: 0,
        }

    def next_name(self, doctype):
        self.counters[doctype] += 1
        prefix = {
            service.FOLDER_DOCTYPE: "RBP-DSF",
            service.DOCUMENT_DOCTYPE: "RBP-DSD",
            service.SHARE_DOCTYPE: "RBP-DSS",
            service.FILE_REFERENCE_DOCTYPE: "RBP-FILE",
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

    def file_reference(self, tenant="TENANT-1", owner_user="owner@example.com"):
        doc = FakeDoc(
            self,
            doctype=service.FILE_REFERENCE_DOCTYPE,
            tenant=tenant,
            owner_user=owner_user,
            uploaded_by=owner_user,
            visibility="Private To Owner",
            status="Active",
        )
        return doc.insert(ignore_permissions=True)


class DocuShareTestCase(TestCase):
    def setUp(self):
        self.store = FakeStore()
        self.audit_events = []
        self.notifications = []
        self.tenants = {
            "owner@example.com": "TENANT-1",
            "shared@example.com": "TENANT-1",
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

    def create_folder(self, user="owner@example.com", payload=None):
        return service.create_folder(user, payload or {"folder_name": "Board papers"})

    def create_document(self, user="owner@example.com", payload=None):
        return service.create_document(user, payload or {"title": "April board pack"})


class TestDocuShareDoctypes(TestCase):
    def test_folder_doctype_fields(self):
        fields = doctype_fields("rbp_docushare_folder", "rbp_docushare_folder.json")
        for field in {
            "tenant",
            "owner_user",
            "folder_name",
            "parent_folder",
            "description",
            "status",
            "visibility",
            "created_from",
            "notes",
        }:
            self.assertIn(field, fields)

    def test_document_doctype_fields(self):
        fields = doctype_fields("rbp_docushare_document", "rbp_docushare_document.json")
        for field in {
            "tenant",
            "owner_user",
            "folder",
            "title",
            "description",
            "file_reference",
            "document_type",
            "status",
            "visibility",
            "version",
            "source_channel",
            "notes",
        }:
            self.assertIn(field, fields)

    def test_share_doctype_fields(self):
        fields = doctype_fields("rbp_docushare_share", "rbp_docushare_share.json")
        for field in {
            "tenant",
            "owner_user",
            "share_target_user",
            "share_target_email",
            "folder",
            "document",
            "access_level",
            "status",
            "expires_on",
            "revoked_on",
            "notes",
        }:
            self.assertIn(field, fields)


class TestDocuShareService(DocuShareTestCase):
    def test_create_folder_sets_owner_tenant_defaults_and_audit(self):
        result = self.create_folder()

        self.assertEqual(result["tenant"], "TENANT-1")
        self.assertEqual(result["owner_user"], "owner@example.com")
        self.assertEqual(result["status"], "Active")
        self.assertEqual(result["visibility"], "Private")
        self.assertEqual(self.audit_events[-1][0], "docushare_folder_created")

    def test_update_folder_validates_parent_tenant(self):
        parent = self.create_folder(payload={"folder_name": "Parent"})
        child = self.create_folder(payload={"folder_name": "Child"})

        result = service.update_folder("owner@example.com", child["name"], {"parent_folder": parent["name"]})

        self.assertEqual(result["parent_folder"], parent["name"])
        self.assertEqual(self.audit_events[-1][0], "docushare_folder_updated")

    def test_list_and_get_folder_respect_owner_access(self):
        own = self.create_folder()
        self.create_folder("other@example.com", {"folder_name": "Other tenant"})

        result = service.list_folders("owner@example.com")
        detail = service.get_folder("owner@example.com", own["name"])

        self.assertEqual({row["name"] for row in result["folders"]}, {own["name"]})
        self.assertEqual(detail["name"], own["name"])

    def test_create_document_validates_folder_and_file_reference_tenant(self):
        folder = self.create_folder()
        file_reference = self.store.file_reference()

        result = service.create_document(
            "owner@example.com",
            {
                "title": "Signed contract",
                "folder": folder["name"],
                "file_reference": file_reference.name,
                "status": "Active",
                "visibility": "Tenant",
            },
        )

        self.assertEqual(result["folder"], folder["name"])
        self.assertEqual(result["file_reference"], file_reference.name)
        self.assertEqual(self.audit_events[-1][0], "docushare_document_created")

    def test_update_document_and_get_document(self):
        document = self.create_document()

        result = service.update_document(
            "owner@example.com",
            document["name"],
            {"title": "Updated pack", "version": "2", "status": "Active"},
        )
        detail = service.get_document("owner@example.com", document["name"])

        self.assertEqual(result["title"], "Updated pack")
        self.assertEqual(detail["version"], "2")
        self.assertEqual(self.audit_events[-1][0], "docushare_document_updated")

    def test_list_documents_returns_visible_documents(self):
        own = self.create_document(payload={"title": "Own"})
        tenant_visible = self.create_document(payload={"title": "Tenant visible", "visibility": "Tenant"})
        self.create_document("other@example.com", {"title": "Other tenant"})

        result = service.list_documents("shared@example.com")

        self.assertEqual({row["name"] for row in result["documents"]}, {tenant_visible["name"]})
        owner_result = service.list_documents("owner@example.com")
        self.assertEqual({row["name"] for row in owner_result["documents"]}, {own["name"], tenant_visible["name"]})

    def test_share_folder_grants_shared_user_access_and_notifies(self):
        folder = self.create_folder()

        share = service.share_folder(
            "owner@example.com",
            folder["name"],
            {"share_target_user": "shared@example.com", "access_level": "View"},
        )
        detail = service.get_folder("shared@example.com", folder["name"])

        self.assertEqual(share["folder"], folder["name"])
        self.assertEqual(detail["name"], folder["name"])
        self.assertEqual(self.audit_events[-1][0], "docushare_folder_shared")
        self.assertEqual(self.notifications[-1]["user"], "shared@example.com")

    def test_share_document_grants_shared_user_access_and_notifies(self):
        document = self.create_document()

        share = service.share_document(
            "owner@example.com",
            document["name"],
            {"share_target_user": "shared@example.com", "access_level": "Comment"},
        )
        detail = service.get_document("shared@example.com", document["name"])

        self.assertEqual(share["document"], document["name"])
        self.assertEqual(detail["name"], document["name"])
        self.assertEqual(self.audit_events[-1][0], "docushare_document_shared")
        self.assertEqual(self.notifications[-1]["title"], "DocuShare document shared")

    def test_revoke_share_removes_shared_access_and_notifies(self):
        document = self.create_document()
        share = service.share_document(
            "owner@example.com",
            document["name"],
            {"share_target_user": "shared@example.com"},
        )

        result = service.revoke_share("owner@example.com", share["name"])

        self.assertEqual(result["status"], "Revoked")
        self.assertEqual(result["revoked_on"], "2026-05-08 11:00:00")
        self.assertEqual(self.audit_events[-1][0], "docushare_share_revoked")
        self.assertEqual(self.notifications[-1]["title"], "DocuShare access revoked")
        with self.assertRaises(frappe.PermissionError):
            service.get_document("shared@example.com", document["name"])

    def test_admin_can_access_and_manage_all_records(self):
        folder = self.create_folder("other@example.com", {"folder_name": "Other tenant"})

        result = service.update_folder("manager@example.com", folder["name"], {"description": "Admin edit"})
        listed = service.list_folders("manager@example.com")

        self.assertEqual(result["description"], "Admin edit")
        self.assertIn(folder["name"], {row["name"] for row in listed["folders"]})

    def test_cross_tenant_access_and_linking_are_denied(self):
        other_folder = self.create_folder("other@example.com", {"folder_name": "Other tenant"})
        own_folder = self.create_folder()
        other_file = self.store.file_reference(tenant="TENANT-2", owner_user="other@example.com")

        with self.assertRaises(frappe.PermissionError):
            service.get_folder("owner@example.com", other_folder["name"])
        with self.assertRaises(frappe.PermissionError):
            service.create_folder("owner@example.com", {"folder_name": "Bad child", "parent_folder": other_folder["name"]})
        with self.assertRaises(frappe.PermissionError):
            service.create_document("owner@example.com", {"title": "Bad folder", "folder": other_folder["name"]})
        with self.assertRaises(frappe.PermissionError):
            service.create_document(
                "owner@example.com",
                {"title": "Bad file", "folder": own_folder["name"], "file_reference": other_file.name},
            )

    def test_audit_events_cover_required_lifecycle(self):
        folder = self.create_folder()
        service.update_folder("owner@example.com", folder["name"], {"description": "Updated"})
        document = self.create_document(payload={"title": "Doc", "folder": folder["name"]})
        service.update_document("owner@example.com", document["name"], {"title": "Doc updated"})
        folder_share = service.share_folder("owner@example.com", folder["name"], {"share_target_user": "shared@example.com"})
        service.share_document("owner@example.com", document["name"], {"share_target_user": "shared@example.com"})
        service.revoke_share("owner@example.com", folder_share["name"])

        self.assertEqual(
            [event for event, _kwargs in self.audit_events],
            [
                "docushare_folder_created",
                "docushare_folder_updated",
                "docushare_document_created",
                "docushare_document_updated",
                "docushare_folder_shared",
                "docushare_document_shared",
                "docushare_share_revoked",
            ],
        )

    def test_notification_creation_for_share_and_revoke(self):
        folder = self.create_folder()
        document = self.create_document()
        folder_share = service.share_folder("owner@example.com", folder["name"], {"share_target_user": "shared@example.com"})
        service.share_document("owner@example.com", document["name"], {"share_target_user": "shared@example.com"})
        service.revoke_share("owner@example.com", folder_share["name"])

        self.assertEqual(
            [notification["title"] for notification in self.notifications],
            ["DocuShare folder shared", "DocuShare document shared", "DocuShare access revoked"],
        )


class TestDocuShareApi(TestCase):
    def test_api_methods_are_thin_and_coerce_payloads(self):
        with (
            patch.object(api, "require_login", return_value="owner@example.com"),
            patch.object(api.service, "create_folder", return_value={"name": "RBP-DSF-0001"}) as create_folder,
            patch.object(api.service, "update_document", return_value={"name": "RBP-DSD-0001"}) as update_document,
            patch.object(api.service, "list_documents", return_value={"documents": [], "count": 0}) as list_documents,
            patch.object(api.service, "share_document", return_value={"name": "RBP-DSS-0001"}) as share_document,
        ):
            self.assertEqual(api.create_folder('{"folder_name": "A"}'), {"name": "RBP-DSF-0001"})
            self.assertEqual(api.update_document("RBP-DSD-0001", '{"title": "B"}'), {"name": "RBP-DSD-0001"})
            self.assertEqual(api.list_documents('{"status": "Active"}'), {"documents": [], "count": 0})
            self.assertEqual(api.share_document("RBP-DSD-0001", '{"share_target_user": "u@example.com"}'), {"name": "RBP-DSS-0001"})

        create_folder.assert_called_once_with("owner@example.com", {"folder_name": "A"})
        update_document.assert_called_once_with("owner@example.com", "RBP-DSD-0001", {"title": "B"})
        list_documents.assert_called_once_with("owner@example.com", {"status": "Active"})
        share_document.assert_called_once_with("owner@example.com", "RBP-DSD-0001", {"share_target_user": "u@example.com"})
