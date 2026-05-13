import frappe

from rbp_app.permissions import require_launch_admin


def _doctype_exists(doctype):
    return bool(frappe.db.exists("DocType", doctype))


def _field_exists(doctype, fieldname):
    if not _doctype_exists(doctype):
        return False
    return bool(frappe.db.exists("DocField", {"parent": doctype, "fieldname": fieldname}))


def _count_if_doctype(doctype, filters=None):
    if not _doctype_exists(doctype):
        return 0
    return frappe.db.count(doctype, filters=filters or {})


def _open_count(doctype, closed_values=None):
    closed_values = closed_values or ["Closed", "Cancelled"]
    if not _doctype_exists(doctype):
        return 0
    if _field_exists(doctype, "status"):
        return _count_if_doctype(doctype, {"status": ["not in", closed_values]})
    if _field_exists(doctype, "workflow_state"):
        return _count_if_doctype(doctype, {"workflow_state": ["not in", closed_values]})
    return _count_if_doctype(doctype)


@frappe.whitelist()
def get_admin_launch_summary():
    require_launch_admin()

    subscription_filters = {}
    if _field_exists("RBP Subscription", "status"):
        subscription_filters = {"status": ["in", ["Active", "Trial", "Pending", "Current"]]}

    pending_payment_filters = {"status": "Pending"} if _field_exists("RBP Payment Event", "status") else {}
    failed_payment_filters = {"status": ["in", ["Failed", "Error", "Declined"]]} if _field_exists("RBP Payment Event", "status") else {}

    summary = {
        "tenants_count": _count_if_doctype("RBP Tenant"),
        "active_subscriptions_count": _count_if_doctype("RBP Subscription", subscription_filters),
        "pending_payment_events_count": _count_if_doctype("RBP Payment Event", pending_payment_filters),
        "failed_payment_events_count": _count_if_doctype("RBP Payment Event", failed_payment_filters),
        "application_interest_count": _count_if_doctype("RBP Application Interest"),
        "open_service_requests_count": sum([
            _open_count("RBP Decision Desk Request"),
            _open_count("RBP Connectivity Request"),
            _open_count("RBP Fixer Task"),
            _open_count("RBP Fixer Case"),
            _open_count("RBP Risk Advisor Assessment"),
            _open_count("RBP Docushare Document"),
        ]),
        "open_marketplace_items_count": _open_count("RBP Marketplace Listing"),
        "unread_notifications_count": _count_if_doctype("RBP Notification", {"is_read": 0} if _field_exists("RBP Notification", "is_read") else {}),
        "recent_audit_events": [],
    }

    if _doctype_exists("RBP Audit Log"):
        fields = ["name", "creation"]
        for candidate in ["actor", "action", "reference_doctype", "reference_name", "event"]:
            if _field_exists("RBP Audit Log", candidate):
                fields.append(candidate)
        summary["recent_audit_events"] = frappe.get_all("RBP Audit Log", fields=fields, order_by="creation desc", limit=10)

    return summary


@frappe.whitelist()
def get_admin_operations_links():
    require_launch_admin()
    return {
        "desk_url": "/desk",
        "workspaces": {
            "operations": "/app/workspace/rbp-operations",
            "membership": "/app/workspace/rbp-membership",
            "billing": "/app/workspace/rbp-billing",
            "applications": "/app/workspace/rbp-applications",
            "notifications": "/app/workspace/rbp-notifications",
            "marketplace": "/app/workspace/rbp-marketplace",
            "services": "/app/workspace/rbp-services",
            "support": "/app/workspace/rbp-support",
        },
    }


@frappe.whitelist()
def get_admin_environment_status():
    require_launch_admin()

    conf = frappe.get_conf() or {}
    return {
        "environment": conf.get("environment") or "unknown",
        "stripe_mode": "live" if conf.get("stripe_live_mode") else "test",
        "email_notification_mode": "enabled" if conf.get("mail_server") else "console_or_disabled",
        "application_provisioning_enabled": bool(conf.get("rbp_application_provisioning_enabled", 0)),
        "application_interest_enabled": bool(conf.get("rbp_application_interest_enabled", 1)),
        "backend_app_version": getattr(frappe, "__version__", None),
        "site_name": frappe.local.site,
    }
