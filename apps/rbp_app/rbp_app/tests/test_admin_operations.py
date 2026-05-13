import json

import frappe
from frappe.tests.utils import FrappeTestCase


class TestAdminOperations(FrappeTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        if not frappe.db.exists("Role", "RBP Admin"):
            frappe.get_doc({"doctype": "Role", "role_name": "RBP Admin", "desk_access": 1}).insert(ignore_permissions=True)

    def _ensure_user(self, email, roles):
        if not frappe.db.exists("User", email):
            user = frappe.get_doc({
                "doctype": "User",
                "email": email,
                "first_name": "RBP",
                "last_name": "User",
                "enabled": 1,
                "new_password": "Password@123",
                "send_welcome_email": 0,
            })
            user.insert(ignore_permissions=True)
        user = frappe.get_doc("User", email)
        existing = {r.role for r in user.roles}
        for role in roles:
            if role not in existing:
                user.append("roles", {"role": role})
        user.save(ignore_permissions=True)
        return email

    def test_admin_summary_rejects_guest(self):
        frappe.set_user("Guest")
        with self.assertRaises(frappe.PermissionError):
            frappe.call("rbp_app.api.admin.get_admin_launch_summary")

    def test_admin_summary_rejects_non_admin(self):
        email = self._ensure_user("rbp-user@example.com", ["Website User"])
        frappe.set_user(email)
        with self.assertRaises(frappe.PermissionError):
            frappe.call("rbp_app.api.admin.get_admin_launch_summary")

    def test_admin_summary_allows_rbp_admin(self):
        email = self._ensure_user("rbp-admin@example.com", ["RBP Admin"])
        frappe.set_user(email)
        payload = frappe.call("rbp_app.api.admin.get_admin_launch_summary")
        self.assertIn("tenants_count", payload)

    def test_admin_links_contract(self):
        frappe.set_user("Administrator")
        payload = frappe.call("rbp_app.api.admin.get_admin_operations_links")
        self.assertEqual(payload.get("desk_url"), "/desk")
        self.assertIn("workspaces", payload)
        for key in ["operations", "membership", "billing", "applications", "notifications", "marketplace", "services", "support"]:
            self.assertIn(key, payload["workspaces"])

    def test_admin_environment_status_no_secret_keys_and_provisioning_flag(self):
        frappe.set_user("Administrator")
        payload = frappe.call("rbp_app.api.admin.get_admin_environment_status")
        joined = json.dumps(payload).lower()
        self.assertNotIn("secret", joined)
        self.assertNotIn("sk_live", joined)
        self.assertIn("application_provisioning_enabled", payload)

    def test_workspace_fixture_parses(self):
        with open("apps/rbp_app/rbp_app/fixtures/workspace.json", "r", encoding="utf-8") as f:
            fixtures = json.load(f)
        names = {entry.get("name") for entry in fixtures}
        self.assertIn("RBP Operations", names)
        self.assertIn("RBP Billing", names)

    def test_workspace_fixture_can_instantiate_docs(self):
        with open("apps/rbp_app/rbp_app/fixtures/workspace.json", "r", encoding="utf-8") as f:
            fixtures = json.load(f)

        for entry in fixtures:
            doc = frappe.get_doc({
                "doctype": "Workspace",
                "title": f"{entry['title']} Fixture Test",
                "module": entry.get("module") or "RBP App",
                "public": 0,
                "is_hidden": 1,
            })
            doc.insert(ignore_permissions=True)
            self.assertTrue(doc.name)
            doc.delete(ignore_permissions=True)
