"""Live Desk-first admin dashboard metrics."""

from urllib.parse import quote, urlencode

import frappe

from rbp_app.permissions import is_admin_user
from rbp_app.services.tenancy import doctype_exists


METRIC_DEFS = [
	("active_subscriptions", "Active subscriptions", "RBP Subscription", {"status": "Active"}, "good"),
	("pending_onboarding", "Pending onboarding flows", "RBP Onboarding Flow", {"status": ["in", ["Draft", "Submitted", "In Review"]]}, "attention"),
	("submitted_decision_desk", "Submitted Decision Desk requests", "RBP Decision Desk Request", {"status": ["in", ["Submitted", "In Review", "Assigned", "In Progress", "Outcome Ready"]]}, "attention"),
	("open_docushare", "Open DocuShare documents", "RBP DocuShare Document", {"status": ["not in", ["Closed", "Archived", "Cancelled"]]}, "neutral"),
	("open_connectivity", "Open Connectivity requests", "RBP Connectivity Request", {"status": ["not in", ["Completed", "Closed", "Archived", "Cancelled"]]}, "attention"),
	("pending_risk", "Pending Risk Advisor assessments", "RBP Risk Advisor Assessment", {"status": ["not in", ["Completed", "Closed", "Archived", "Cancelled"]]}, "attention"),
	("open_fixer", "Open Fixer cases", "RBP Fixer Case", {"status": ["not in", ["Completed", "Closed", "Archived", "Cancelled"]]}, "urgent"),
	("pending_marketplace_listings", "Pending Marketplace listings", "RBP Marketplace Listing", {"status": ["in", ["Submitted", "In Review", "More Information Required"]]}, "attention"),
	("open_marketplace_orders", "Open Marketplace orders", "RBP Marketplace Order", {"status": ["not in", ["Completed", "Cancelled", "Refunded", "Archived"]]}, "attention"),
	("failed_payments", "Failed payment events", "RBP Payment Event", {"status": ["in", ["Failed", "Error"]]}, "urgent"),
	("unread_notifications", "Unread notifications", "RBP Notification", {"is_read": 0}, "attention"),
	("recent_audit_events", "Recent audit events", "RBP Audit Log", {}, "neutral"),
]

RECENT_SERVICE_DOCTYPES = [
	"RBP Decision Desk Request",
	"RBP DocuShare Document",
	"RBP Connectivity Request",
	"RBP Risk Advisor Assessment",
	"RBP Fixer Case",
	"RBP Marketplace Listing",
	"RBP Marketplace Order",
	"RBP Onboarding Flow",
]


def _desk_list_url(doctype, filters=None):
	url = f"/desk#List/{quote(doctype)}/List"
	if filters:
		url = f"{url}?{urlencode({'filters': frappe.as_json(filters)})}"
	return url


def _desk_form_url(doctype, name):
	return f"/desk#Form/{quote(doctype)}/{quote(name)}"


def _safe_count(doctype, filters=None):
	if not doctype_exists(doctype):
		return 0, "DocType is not installed."
	try:
		return frappe.db.count(doctype, filters or {}), None
	except Exception as exc:
		return 0, str(exc)


def _safe_rows(doctype, fields, filters=None, limit=5, order_by="modified desc"):
	if not doctype_exists(doctype):
		return []
	try:
		return frappe.get_all(
			doctype,
			fields=fields,
			filters=filters or {},
			order_by=order_by,
			limit_page_length=limit,
		)
	except Exception:
		return []


def _metric(definition):
	key, label, doctype, filters, status = definition
	value, warning = _safe_count(doctype, filters)
	item = {
		"key": key,
		"label": label,
		"value": value,
		"status": "warning" if warning else status,
		"desk_url": _desk_list_url(doctype, filters) if not warning else None,
		"description": warning or f"Live count from {doctype}.",
	}
	if warning:
		item["warning"] = warning
	return item


def _queues(metrics):
	queues = []
	for metric in metrics:
		if metric["key"] in {"recent_audit_events", "active_subscriptions"}:
			continue
		queues.append(
			{
				"key": metric["key"],
				"label": metric["label"],
				"count": metric["value"],
				"desk_url": metric.get("desk_url"),
				"items": [],
			}
		)
	return queues


def _recent_audit():
	rows = _safe_rows(
		"RBP Audit Log",
		["name", "event_type", "actor", "subject_doctype", "subject_name", "workflow_state", "message", "creation"],
		limit=10,
		order_by="creation desc",
	)
	return [
		{
			"name": row.get("name"),
			"event_type": row.get("event_type"),
			"actor": row.get("actor"),
			"target_doctype": row.get("subject_doctype"),
			"target_name": row.get("subject_name"),
			"workflow_state": row.get("workflow_state"),
			"summary": row.get("message"),
			"timestamp": row.get("creation"),
			"desk_url": _desk_form_url(row.get("subject_doctype"), row.get("subject_name")) if row.get("subject_doctype") and row.get("subject_name") else None,
		}
		for row in rows
	]


def _recent_service_records():
	records = []
	for doctype in RECENT_SERVICE_DOCTYPES:
		for row in _safe_rows(doctype, ["name", "status", "workflow_state", "modified"], limit=3):
			records.append(
				{
					"doctype": doctype,
					"name": row.get("name"),
					"status": row.get("workflow_state") or row.get("status"),
					"modified": row.get("modified"),
					"desk_url": _desk_form_url(doctype, row.get("name")),
				}
			)
	return sorted(records, key=lambda item: item.get("modified") or "", reverse=True)[:10]


def get_dashboard(user=None):
	"""Return live admin dashboard DTO for the React command centre."""

	if not is_admin_user(user):
		raise frappe.PermissionError

	metrics = [_metric(definition) for definition in METRIC_DEFS]
	alerts = [
		{
			"key": metric["key"],
			"label": metric["label"],
			"message": metric.get("warning") or metric["description"],
			"status": metric["status"],
			"desk_url": metric.get("desk_url"),
		}
		for metric in metrics
		if metric["status"] in {"urgent", "warning"} and metric["value"]
	]
	desk_links = [
		{"label": "Remote Business Partner Desk", "desk_url": "/desk"},
		*[
			{"label": definition[1], "desk_url": _desk_list_url(definition[2], definition[3])}
			for definition in METRIC_DEFS
			if doctype_exists(definition[2])
		],
	]
	return {
		"metrics": metrics,
		"queues": _queues(metrics),
		"recent_activity": _recent_audit(),
		"recent_service_records": _recent_service_records(),
		"alerts": alerts,
		"desk_links": desk_links,
	}
