"""Central admin workflow helpers for production Desk/admin actions."""

import json
from urllib.parse import quote

import frappe
from frappe.utils import now_datetime

from rbp_app.permissions import is_admin_user, is_system_manager
from rbp_app.services.audit import record_audit_event
from rbp_app.services.notifications import create_notification
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


ACTION_TARGETS = {
	"assign": "Assigned",
	"start_review": "In Review",
	"request_more_information": "More Information Required",
	"approve": "Completed",
	"reject": "Rejected",
	"publish": "Published",
	"close": "Closed",
	"cancel": "Cancelled",
	"archive": "Archived",
	"mark_outcome_ready": "Outcome Ready",
	"mark_completed": "Completed",
}

DOMAIN_DOCTYPES = {
	"decision_desk": {"RBP Decision Desk Request"},
	"docushare": {"RBP DocuShare Document"},
	"connectivity": {"RBP Connectivity Request"},
	"risk_advisor": {"RBP Risk Advisor Assessment"},
	"fixer": {"RBP Fixer Case"},
	"marketplace": {"RBP Marketplace Listing", "RBP Marketplace Order"},
	"membership": {"RBP Onboarding Flow"},
}

DOCTYPE_ALIASES = {
	"RBP Fixer Request": "RBP Fixer Case",
}

COMMON_TRANSITIONS = {
	"Draft": {"Submitted", "Cancelled", "Archived"},
	"Submitted": {"In Review", "Assigned", "More Information Required", "Rejected", "Cancelled", "Archived"},
	"In Review": {"Assigned", "In Progress", "More Information Required", "Outcome Ready", "Completed", "Rejected", "Cancelled", "Archived"},
	"More Information Required": {"Submitted", "In Review", "Cancelled", "Archived"},
	"Assigned": {"In Progress", "More Information Required", "Outcome Ready", "Completed", "Rejected", "Cancelled", "Archived"},
	"In Progress": {"More Information Required", "Outcome Ready", "Completed", "Rejected", "Cancelled", "Archived"},
	"Outcome Ready": {"Completed", "More Information Required", "Archived"},
	"Completed": {"Archived"},
	"Closed": {"Archived"},
	"Rejected": {"Archived"},
	"Cancelled": {"Archived"},
}

DOCTYPE_TRANSITIONS = {
	"RBP Marketplace Listing": {
		"Draft": {"Submitted", "Archived"},
		"Submitted": {"In Review", "More Information Required", "Published", "Rejected", "Archived"},
		"In Review": {"More Information Required", "Published", "Rejected", "Archived"},
		"More Information Required": {"Submitted", "In Review", "Archived"},
		"Published": {"Archived"},
		"Rejected": {"Archived"},
	},
	"RBP Marketplace Order": {
		"Created": {"Payment Pending", "Paid", "Cancelled"},
		"Payment Pending": {"Paid", "Cancelled"},
		"Paid": {"In Fulfilment", "Completed", "Refunded"},
		"In Fulfilment": {"Completed", "Cancelled", "Refunded"},
		"Completed": {"Refunded", "Archived"},
		"Cancelled": {"Archived"},
		"Refunded": {"Archived"},
	},
	"RBP Connectivity Request": {
		"Draft": {"Submitted", "Cancelled", "Archived"},
		"Submitted": {"Serviceability Review", "More Information Required", "Cancelled", "Archived"},
		"Serviceability Review": {"Quote Ready", "More Information Required", "Cancelled", "Archived"},
		"Quote Ready": {"Accepted", "Cancelled", "Archived"},
		"Accepted": {"Provisioning", "Cancelled"},
		"Provisioning": {"Completed", "Cancelled"},
		"Completed": {"Archived"},
		"Cancelled": {"Archived"},
	},
}

ACTION_TARGET_OVERRIDES = {
	("RBP Connectivity Request", "start_review"): "Serviceability Review",
	("RBP Connectivity Request", "mark_outcome_ready"): "Quote Ready",
	("RBP Connectivity Request", "approve"): "Accepted",
	("RBP Connectivity Request", "mark_completed"): "Completed",
	("RBP Marketplace Order", "start_review"): "Payment Pending",
	("RBP Marketplace Order", "approve"): "Paid",
	("RBP Marketplace Order", "publish"): "In Fulfilment",
	("RBP Marketplace Order", "mark_completed"): "Completed",
}


def _payload(value):
	if value is None:
		return {}
	if isinstance(value, str):
		return json.loads(value or "{}")
	return dict(value)


def _normalise_doctype(doctype):
	return DOCTYPE_ALIASES.get(doctype, doctype)


def _fieldnames(doctype):
	try:
		return {field.fieldname for field in frappe.get_meta(doctype).fields}
	except Exception:
		return set()


def _get_state(doc):
	return getattr(doc, "workflow_state", None) or getattr(doc, "status", None) or "Draft"


def _set_state(doc, state):
	fields = _fieldnames(doc.doctype)
	if "workflow_state" in fields or hasattr(doc, "workflow_state"):
		doc.workflow_state = state
	if "status" in fields or hasattr(doc, "status"):
		doc.status = state


def _target_for_action(doctype, action):
	return ACTION_TARGET_OVERRIDES.get((doctype, action)) or ACTION_TARGETS.get(action)


def _allowed_targets(doctype, current_state):
	transitions = DOCTYPE_TRANSITIONS.get(doctype, COMMON_TRANSITIONS)
	return transitions.get(current_state, set())


def _validate_domain(domain, doctype):
	if domain not in DOMAIN_DOCTYPES:
		raise frappe.ValidationError("Unsupported admin action domain.")
	if doctype not in DOMAIN_DOCTYPES[domain]:
		raise frappe.ValidationError("Record DocType is not valid for this admin domain.")


def _validate_admin_visibility(user, doc):
	if not user or user == "Guest" or not is_admin_user(user):
		raise frappe.PermissionError
	if is_system_manager(user):
		return

	user_tenant = get_current_tenant_name(user)
	doc_tenant = getattr(doc, "tenant", None)
	if doc_tenant and user_tenant and doc_tenant != user_tenant:
		raise frappe.PermissionError


def _validate_required(action, payload):
	if action == "assign" and not payload.get("assigned_to"):
		raise frappe.ValidationError("Assign requires an assignee.")
	if action in {"reject", "request_more_information"} and not (payload.get("notes") or payload.get("reason")):
		raise frappe.ValidationError("This action requires notes.")


def _recipient_for(doc):
	for fieldname in ("owner_user", "user", "buyer_user", "member", "primary_owner"):
		value = getattr(doc, fieldname, None)
		if value:
			return value
	return None


def _desk_url(doctype, name):
	return f"/desk#Form/{quote(doctype)}/{quote(name)}"


def _serialize_doc(doc):
	fields = _fieldnames(doc.doctype)
	return {
		"name": doc.name,
		"doctype": doc.doctype,
		"status": getattr(doc, "status", None),
		"workflow_state": getattr(doc, "workflow_state", None),
		"assigned_to": getattr(doc, "assigned_to", None),
		"tenant": getattr(doc, "tenant", None),
		"title": getattr(doc, "title", None) or getattr(doc, "quote_title", None) or getattr(doc, "folder_name", None),
		"modified": getattr(doc, "modified", None),
		"desk_url": _desk_url(doc.doctype, doc.name),
		"fields": {field: getattr(doc, field, None) for field in fields if field in {"owner_user", "user", "buyer_user", "vendor", "listing"}},
	}


def perform_admin_action(user, payload):
	"""Validate and apply a production admin workflow action."""

	payload = _payload(payload)
	action = payload.get("action")
	doctype = _normalise_doctype(payload.get("record_doctype"))
	name = payload.get("record_name")
	domain = payload.get("domain")
	action_payload = _payload(payload.get("payload"))
	notes = payload.get("notes") or action_payload.get("notes") or payload.get("reason")
	assigned_to = payload.get("assigned_to") or action_payload.get("assigned_to")

	if action not in ACTION_TARGETS:
		raise frappe.ValidationError("Unsupported admin action.")
	if not doctype or not name:
		raise frappe.ValidationError("Record DocType and name are required.")
	if not doctype_exists(doctype):
		raise frappe.DoesNotExistError

	_validate_domain(domain, doctype)
	_validate_required(action, {"notes": notes, "assigned_to": assigned_to})

	doc = frappe.get_doc(doctype, name)
	_validate_admin_visibility(user, doc)

	current_state = _get_state(doc)
	target_state = _target_for_action(doctype, action)
	if not target_state:
		raise frappe.ValidationError("Unsupported admin workflow target.")
	if target_state not in _allowed_targets(doctype, current_state):
		raise frappe.ValidationError(f"Cannot move {doctype} from {current_state} to {target_state}.")

	fields = _fieldnames(doctype)
	if assigned_to and "assigned_to" in fields:
		doc.assigned_to = assigned_to
	if notes and "notes" in fields:
		existing = getattr(doc, "notes", None)
		stamp = now_datetime()
		doc.notes = f"{existing}\n\n[{stamp}] {user}: {notes}" if existing else f"[{stamp}] {user}: {notes}"
	if action in {"close", "cancel", "archive", "mark_completed"}:
		for fieldname in ("closed_on", "completed_on", "resolved_on", "cancelled_on", "fulfilled_on"):
			if fieldname in fields and not getattr(doc, fieldname, None):
				setattr(doc, fieldname, now_datetime())
	if action in {"start_review", "assign"} and "reviewed_on" in fields and not getattr(doc, "reviewed_on", None):
		doc.reviewed_on = now_datetime()

	_set_state(doc, target_state)
	doc.save(ignore_permissions=True)

	audit = record_audit_event(
		f"admin_{action}",
		actor=user,
		tenant=getattr(doc, "tenant", None),
		subject_doctype=doctype,
		subject_name=doc.name,
		workflow_state=target_state,
		message=f"Admin action {action} moved {doctype} to {target_state}.",
		metadata={
			"action": action,
			"from_state": current_state,
			"to_state": target_state,
			"assigned_to": assigned_to,
			"notes": notes,
		},
	)

	notifications = []
	recipient = _recipient_for(doc)
	if recipient:
		notification = create_notification(
			user=recipient,
			tenant=getattr(doc, "tenant", None),
			title=f"{doctype} updated",
			message=f"Your request is now {target_state}.",
			priority="High" if action in {"request_more_information", "reject"} else "Normal",
			notification_type="Action" if action == "request_more_information" else "Info",
			route=_desk_url(doctype, doc.name),
			related_doctype=doctype,
			related_name=doc.name,
			trigger_source=f"admin.{action}",
			created_by_workflow="admin_workflow",
		)
		if notification:
			notifications.append(notification.name)

	return {
		"ok": True,
		"updated_record": _serialize_doc(doc),
		"new_status": target_state,
		"audit_log_name": getattr(audit, "name", None),
		"notification_names": notifications,
		"message": f"{doctype} moved to {target_state}.",
	}


def perform_domain_action(user, domain, record_doctype, record_name, action, **kwargs):
	return perform_admin_action(
		user,
		{
			"domain": domain,
			"record_doctype": record_doctype,
			"record_name": record_name,
			"action": action,
			**kwargs,
		},
	)
