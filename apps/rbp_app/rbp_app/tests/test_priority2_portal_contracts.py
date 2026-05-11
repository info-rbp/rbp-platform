import importlib.util
from unittest import TestCase, skipIf

from rbp_app import hooks


class TestPriority2PortalContracts(TestCase):
    def test_compatibility_redirects_are_registered(self):
        expected = [
            {"source": "/portal/account", "target": "/portal/settings"},
            {"source": "/portal/library", "target": "/portal/documents"},
            {"source": "/portal/decision-desk", "target": "/portal/services?type=decision-desk"},
            {"source": "/portal/decision-desk/history", "target": "/portal/services?type=decision-desk"},
            {"source": "/portal/finance", "target": "/portal/services?type=finance"},
            {"source": "/portal/finance/enquiries", "target": "/portal/services?type=finance"},
            {"source": "/portal/sessions", "target": "/portal/services?type=session"},
        ]

        for redirect in expected:
            self.assertIn(redirect, hooks.website_redirects)

    @skipIf(importlib.util.find_spec("frappe") is None, "Frappe is required for portal service imports.")
    def test_portal_service_registry_covers_live_domains(self):
        from rbp_app.services import portal

        self.assertIn("decision-desk", portal.SERVICE_REGISTRY)
        self.assertIn("docushare", portal.SERVICE_REGISTRY)
        self.assertIn("connectivity", portal.SERVICE_REGISTRY)
        self.assertIn("risk-advisor", portal.SERVICE_REGISTRY)
        self.assertIn("the-fixer", portal.SERVICE_REGISTRY)
        self.assertIn("marketplace", portal.SERVICE_REGISTRY)

    @skipIf(importlib.util.find_spec("frappe") is None, "Frappe is required for portal API imports.")
    def test_portal_api_methods_exist(self):
        from rbp_app.api import documents, notifications, portal as portal_api

        self.assertTrue(hasattr(portal_api, "list_my_services"))
        self.assertTrue(hasattr(portal_api, "get_service_record"))
        self.assertTrue(hasattr(portal_api, "create_service_request_router"))
        self.assertTrue(hasattr(documents, "list_my_documents"))
        self.assertTrue(hasattr(documents, "get_document_reference"))
        self.assertTrue(hasattr(documents, "get_document_download_url"))
        self.assertTrue(hasattr(notifications, "list_my_notifications"))
        self.assertTrue(hasattr(notifications, "get_unread_count"))
