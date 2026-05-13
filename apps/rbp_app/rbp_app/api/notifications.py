from __future__ import annotations
import frappe
from rbp_app.services.notification_triggers import list_notification_triggers
from rbp_app.services.notifications import emit_event_notification
from rbp_app.services.tenancy import doctype_exists

def _require_system_manager():
    if "System Manager" not in frappe.get_roles():
        frappe.throw("Not permitted", frappe.PermissionError)

@frappe.whitelist()
def list_triggers():
    return {"triggers": list_notification_triggers()}

@frappe.whitelist()
def send_test_notification(event_type: str = "account.created", recipient_email: str | None = None):
    _require_system_manager()
    return emit_event_notification(event_type=event_type, user=frappe.session.user, customer_email=recipient_email or frappe.session.user, context={"customer_name":"QA Tester","business_name":"Remote Business Partner QA","reference_id":"RBP-QA-NOTIFICATION","portal_url":"/portal/dashboard","status":"qa-test"})

@frappe.whitelist()
def admin_list_notification_events(limit: int = 50):
    _require_system_manager()
    limit=max(1,min(int(limit or 50),200))
    events=[]; deliveries=[]
    if doctype_exists("RBP Notification"):
        events=frappe.get_all("RBP Notification", fields=["name","creation","modified","user","title","status","delivery_channel","related_doctype","related_name","trigger_source","created_by_workflow"], order_by="modified desc", limit_page_length=limit)
    if doctype_exists("RBP Notification Delivery"):
        deliveries=frappe.get_all("RBP Notification Delivery", fields=["name","creation","notification","recipient_email","status","sandboxed"], order_by="creation desc", limit_page_length=limit)
    return {"events":events, "deliveries":deliveries}
