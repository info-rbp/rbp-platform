"""The Fixer backend business services."""

import json

import frappe
from frappe.utils import now_datetime

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.reference_ids import generate_reference_id
from rbp_app.services.notifications import create_notification, emit_event_notification, safe_emit_event_notification
from rbp_app.services.service_routes import service_routes
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


CASE_DOCTYPE = "RBP Fixer Case"
TASK_DOCTYPE = "RBP Fixer Task"
UPDATE_DOCTYPE = "RBP Fixer Update"

CASE_STATUSES = {
    "Draft",
    "Submitted",
    "Triage",
    "Assigned",
    "In Progress",
    "Waiting on Customer",
    "Resolved",
    "Closed",
    "Cancelled",
}
TASK_STATUSES = {"Open", "In Progress", "Blocked", "Completed", "Cancelled"}
UPDATE_TYPES = {"Internal Note", "Customer Update", "Status Change", "Resolution Note"}

CASE_DRAFT_FIELDS = {
    "business_profile",
    "title",
    "category",
    "issue_summary",
    "issue_details",
    "urgency",
    "impact",
    "source_channel",
    "related_decision_request",
    "related_docushare_document",
    "related_marketplace_order",
    "related_connectivity_request",
    "related_risk_assessment",
    "notes",
}
CASE_ADMIN_FIELDS = {
    "assigned_to",
    "notes",
    "related_decision_request",
    "related_docushare_document",
    "related_marketplace_order",
    "related_connectivity_request",
    "related_risk_assessment",
}
TASK_FIELDS = {"title", "description", "priority", "status", "assigned_to", "due_date", "notes"}
UPDATE_FIELDS = {"update_type", "message", "visible_to_customer", "notes"}

RELATED_REFERENCE_DOCTYPES = {
    "related_decision_request": "RBP Decision Desk Request",
    "related_docushare_document": "RBP DocuShare Document",
    "related_marketplace_order": "RBP Marketplace Order",
    "related_connectivity_request": "RBP Connectivity Request",
    "related_risk_assessment": "RBP Risk Advisor Assessment",
}

STATUS_TRANSITIONS = {
    "Draft": {"Submitted", "Cancelled"},
    "Submitted": {"Triage", "Assigned", "In Progress", "Waiting on Customer", "Resolved", "Cancelled"},
    "Triage": {"Assigned", "In Progress", "Waiting on Customer", "Resolved", "Cancelled"},
    "Assigned": {"In Progress", "Waiting on Customer", "Resolved", "Cancelled"},
    "In Progress": {"Waiting on Customer", "Resolved", "Cancelled"},
    "Waiting on Customer": {"In Progress", "Resolved", "Cancelled"},
    "Resolved": {"Closed", "In Progress"},
    "Closed": set(),
    "Cancelled": set(),
}


def _safe_payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload or "{}")
    return dict(payload)


def _require_user(user):
    if not user or user == "Guest":
        raise frappe.PermissionError
    return user


def _require_tenant(user):
    tenant = get_current_tenant_name(user)
    if not tenant:
        raise frappe.PermissionError
    return tenant


def _is_admin(user):
    return is_admin_user(user)


def _get_doc(doctype, name):
    if not doctype_exists(doctype):
        raise frappe.DoesNotExistError
    return frappe.get_doc(doctype, name)


def _has_field(doctype, fieldname):
    try:
        return frappe.get_meta(doctype).has_field(fieldname)
    except Exception:
        return True


def _set_fields(doc, payload, allowed_fields):
    for field in allowed_fields:
        if field in payload:
            setattr(doc, field, payload.get(field))


def _validate_related_references(payload, tenant):
    for field, doctype in RELATED_REFERENCE_DOCTYPES.items():
        value = payload.get(field)
        if not value or not doctype_exists(doctype):
            continue
        related = frappe.get_doc(doctype, value)
        related_tenant = getattr(related, "tenant", None)
        if related_tenant and related_tenant != tenant:
            raise frappe.PermissionError


def _serialize_case(doc, tasks=None, updates=None):
    return {
        "name": doc.name,
        "reference_id": getattr(doc, "reference_id", None),
        "tenant": doc.tenant,
        "owner_user": doc.owner_user,
        "business_profile": getattr(doc, "business_profile", None),
        "title": getattr(doc, "title", None),
        "category": getattr(doc, "category", None),
        "issue_summary": getattr(doc, "issue_summary", None),
        "issue_details": getattr(doc, "issue_details", None),
        "urgency": getattr(doc, "urgency", None),
        "impact": getattr(doc, "impact", None),
        "status": doc.status,
        "workflow_state": getattr(doc, "workflow_state", None),
        "assigned_to": getattr(doc, "assigned_to", None),
        "submitted_on": getattr(doc, "submitted_on", None),
        "reviewed_on": getattr(doc, "reviewed_on", None),
        "resolved_on": getattr(doc, "resolved_on", None),
        "closed_on": getattr(doc, "closed_on", None),
        "source_channel": getattr(doc, "source_channel", None),
        "related_decision_request": getattr(doc, "related_decision_request", None),
        "related_docushare_document": getattr(doc, "related_docushare_document", None),
        "related_marketplace_order": getattr(doc, "related_marketplace_order", None),
        "related_connectivity_request": getattr(doc, "related_connectivity_request", None),
        "related_risk_assessment": getattr(doc, "related_risk_assessment", None),
        "notes": getattr(doc, "notes", None),
        "tasks": tasks or [],
        "updates": updates or [],
        **service_routes("the_fixer", doc.name),
    }


def _serialize_task(doc):
    return {
        "name": doc.name,
        "tenant": doc.tenant,
        "fixer_case": doc.fixer_case,
        "title": getattr(doc, "title", None),
        "description": getattr(doc, "description", None),
        "priority": getattr(doc, "priority", None),
        "status": doc.status,
        "assigned_to": getattr(doc, "assigned_to", None),
        "due_date": getattr(doc, "due_date", None),
        "completed_on": getattr(doc, "completed_on", None),
        "notes": getattr(doc, "notes", None),
    }


def _serialize_update(doc):
    return {
        "name": doc.name,
        "tenant": doc.tenant,
        "fixer_case": doc.fixer_case,
        "update_type": doc.update_type,
        "message": getattr(doc, "message", None),
        "status_snapshot": getattr(doc, "status_snapshot", None),
        "created_by_user": getattr(doc, "created_by_user", None),
        "visible_to_customer": getattr(doc, "visible_to_customer", 0),
        "notes": getattr(doc, "notes", None),
    }


def _assert_case_access(user, doc, *, owner_only=False, manage=False, internal=False):
    _require_user(user)

    if _is_admin(user):
        return True

    user_tenant = _require_tenant(user)
    if doc.tenant != user_tenant:
        raise frappe.PermissionError

    is_owner = doc.owner_user == user
    is_assigned = getattr(doc, "assigned_to", None) == user

    if manage:
        raise frappe.PermissionError
    if owner_only and not is_owner:
        raise frappe.PermissionError
    if internal and not is_assigned:
        raise frappe.PermissionError
    if is_owner or is_assigned:
        return True

    raise frappe.PermissionError


def _get_task_parent(task):
    if not task.fixer_case:
        raise frappe.ValidationError("Fixer task is missing its parent case.")
    case_doc = _get_doc(CASE_DOCTYPE, task.fixer_case)
    if task.tenant != case_doc.tenant:
        raise frappe.PermissionError
    return case_doc


def _get_update_parent(update):
    if not update.fixer_case:
        raise frappe.ValidationError("Fixer update is missing its parent case.")
    case_doc = _get_doc(CASE_DOCTYPE, update.fixer_case)
    if update.tenant != case_doc.tenant:
        raise frappe.PermissionError
    return case_doc


def _audit(event_type, user, doc, message=None, metadata=None):
    return record_audit_event(
        event_type,
        actor=user,
        tenant=getattr(doc, "tenant", None),
        subject_doctype=getattr(doc, "doctype", None) or CASE_DOCTYPE,
        subject_name=doc.name,
        workflow_state=getattr(doc, "workflow_state", None) or getattr(doc, "status", None),
        message=message,
        metadata=metadata or {},
    )


def _notify(user, title, message, doc, trigger_source, *, priority="Normal", notification_type="Info"):
    if not user:
        return None
    try:
        return create_notification(
            user=user,
            tenant=getattr(doc, "tenant", None),
            title=title,
            message=message,
            priority=priority,
            notification_type=notification_type,
            route=service_routes("the_fixer", doc.name)["portal_route"],
            related_doctype=CASE_DOCTYPE,
            related_name=doc.name,
            trigger_source=trigger_source,
            created_by_workflow="the_fixer",
        )
    except Exception:
        frappe.log_error(frappe.get_traceback(), "RBP Fixer notification failed")
        return None


def _admin_recipients():
    recipients = {"Administrator"}
    try:
        rows = frappe.get_all("Has Role", filters={"role": "System Manager"}, fields=["parent"])
        recipients.update(row.get("parent") for row in rows if row.get("parent"))
    except Exception:
        pass
    return sorted(recipients)


def _notify_admins_new_case(doc):
    for recipient in _admin_recipients():
        _notify(
            recipient,
            "New Fixer case submitted",
            f"{doc.owner_user} submitted a Fixer case.",
            doc,
            "the_fixer.submit_case.admin",
            priority="High",
        )


def _emit_notification_event(event_type, doc, message, context):
    return safe_emit_event_notification(
        log_title="RBP fixer notification hook failed",
        emit=emit_event_notification,
        event_type=event_type,
        user=None,
        tenant=getattr(doc, "tenant", None),
        customer_email=getattr(doc, "owner_user", None),
        related_doctype=CASE_DOCTYPE,
        related_name=doc.name,
        message=message,
        context=context,
    )


def _notification_context(doc):
    routes = service_routes("the_fixer", doc.name)
    return {
        "reference_id": getattr(doc, "reference_id", None) or doc.name,
        "service_name": "The Fixer",
        "status": getattr(doc, "status", None),
        "portal_url": routes["portal_route"],
        "admin_url": routes["admin_route"],
    }


def _notify_case_submitted(user, doc):
    _notify(doc.owner_user, "Fixer case submitted", "Your Fixer case has been submitted.", doc, "the_fixer.submit_case.user")
    _notify_admins_new_case(doc)
    _emit_notification_event(
        "fixer.request_submitted",
        doc,
        "Your Fixer request has been received.",
        _notification_context(doc),
    )
    _audit("fixer_case_submitted", user, doc, "Fixer case submitted.")


def create_case(user, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    tenant = _require_tenant(user)

    if not doctype_exists(CASE_DOCTYPE):
        raise frappe.DoesNotExistError

    _validate_related_references(payload, tenant)
    doc = frappe.get_doc(
        {
            "doctype": CASE_DOCTYPE,
            "tenant": tenant,
            "owner_user": user,
            "status": "Draft",
            "workflow_state": "Draft",
            "urgency": payload.get("urgency") or "Medium",
            "impact": payload.get("impact") or "Medium",
            "source_channel": "portal",
        }
    )
    _set_fields(doc, payload, CASE_DRAFT_FIELDS)
    doc.source_channel = "portal"
    if _has_field(CASE_DOCTYPE, "reference_id") and not getattr(doc, "reference_id", None):
        doc.reference_id = generate_reference_id("RBP-FIX")
    if payload.get("submit"):
        doc.status = "Submitted"
        doc.workflow_state = "Submitted"
        doc.submitted_on = now_datetime()
    doc.insert(ignore_permissions=True)

    _audit("fixer_case_created", user, doc, "Fixer case created.")
    if payload.get("submit"):
        _notify_case_submitted(user, doc)
    return _serialize_case(doc)


def update_draft_case(user, case_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    doc = _get_doc(CASE_DOCTYPE, case_name)
    _assert_case_access(user, doc, owner_only=True)

    if doc.status != "Draft":
        raise frappe.ValidationError("Only draft Fixer cases can be updated by the owner.")

    _validate_related_references(payload, doc.tenant)
    _set_fields(doc, payload, CASE_DRAFT_FIELDS)
    doc.workflow_state = doc.status
    doc.save(ignore_permissions=True)

    _audit("fixer_case_updated", user, doc, "Fixer case updated.")
    return _serialize_case(doc)


def submit_case(user, case_name):
    user = _require_user(user)
    doc = _get_doc(CASE_DOCTYPE, case_name)
    _assert_case_access(user, doc, owner_only=True)

    if doc.status != "Draft":
        raise frappe.ValidationError("Only draft Fixer cases can be submitted.")

    doc.status = "Submitted"
    doc.workflow_state = "Submitted"
    if _has_field(CASE_DOCTYPE, "reference_id") and not getattr(doc, "reference_id", None):
        doc.reference_id = generate_reference_id("RBP-FIX")
    if _has_field(CASE_DOCTYPE, "source_channel") and not getattr(doc, "source_channel", None):
        doc.source_channel = "portal"
    doc.submitted_on = now_datetime()
    doc.save(ignore_permissions=True)

    _notify_case_submitted(user, doc)
    return _serialize_case(doc)


def list_my_cases(user, filters=None):
    user = _require_user(user)
    filters = _safe_payload(filters)

    if not doctype_exists(CASE_DOCTYPE):
        return {"cases": [], "count": 0}

    query_filters = {}
    for field in ("status", "category", "urgency", "impact"):
        if filters.get(field):
            query_filters[field] = filters[field]

    if not _is_admin(user):
        query_filters["tenant"] = _require_tenant(user)

    rows = frappe.get_all(
        CASE_DOCTYPE,
        filters=query_filters,
        fields=[
            "name",
            "reference_id",
            "tenant",
            "owner_user",
            "title",
            "category",
            "urgency",
            "impact",
            "status",
            "workflow_state",
            "assigned_to",
            "submitted_on",
            "reviewed_on",
            "resolved_on",
            "closed_on",
            "source_channel",
            "modified",
        ],
        order_by="modified desc",
    )

    if not _is_admin(user):
        rows = [row for row in rows if row.get("owner_user") == user or row.get("assigned_to") == user]

    rows = [{**row, **service_routes("the_fixer", row.get("name"))} for row in rows]
    return {"cases": rows, "count": len(rows)}


def get_case(user, case_name):
    user = _require_user(user)
    doc = _get_doc(CASE_DOCTYPE, case_name)
    _assert_case_access(user, doc)

    tasks = []
    if doctype_exists(TASK_DOCTYPE):
        tasks = frappe.get_all(
            TASK_DOCTYPE,
            filters={"fixer_case": doc.name},
            fields=["name", "tenant", "fixer_case", "title", "description", "priority", "status", "assigned_to", "due_date", "completed_on", "notes"],
            order_by="modified asc",
        )

    updates = list_case_updates(user, case_name)["updates"] if doctype_exists(UPDATE_DOCTYPE) else []
    return _serialize_case(doc, tasks=tasks, updates=updates)


def admin_assign_case(user, case_name, assigned_to):
    user = _require_user(user)
    if not _is_admin(user):
        raise frappe.PermissionError
    if not assigned_to:
        raise frappe.ValidationError("Assigned user is required.")

    doc = _get_doc(CASE_DOCTYPE, case_name)
    previous_status = doc.status
    doc.assigned_to = assigned_to
    doc.status = "Assigned"
    doc.workflow_state = "Assigned"
    doc.reviewed_on = now_datetime()
    doc.save(ignore_permissions=True)

    _notify(assigned_to, "Fixer case assigned", "A Fixer case has been assigned to you.", doc, "the_fixer.admin_assign_case", priority="High")
    _audit("fixer_case_assigned", user, doc, "Fixer case assigned.", {"assigned_to": assigned_to, "from": previous_status})
    return _serialize_case(doc)


def admin_update_case_status(user, case_name, status, payload=None):
    user = _require_user(user)
    if not _is_admin(user):
        raise frappe.PermissionError
    if status not in CASE_STATUSES:
        raise frappe.ValidationError("Invalid Fixer case status.")

    payload = _safe_payload(payload)
    doc = _get_doc(CASE_DOCTYPE, case_name)
    previous_status = doc.status
    if status != previous_status and status not in STATUS_TRANSITIONS.get(previous_status, set()):
        raise frappe.ValidationError("Invalid Fixer case status transition.")

    _validate_related_references(payload, doc.tenant)
    _set_fields(doc, payload, CASE_ADMIN_FIELDS)
    doc.status = status
    doc.workflow_state = status
    if status in {"Triage", "Assigned", "In Progress", "Waiting on Customer"} and not getattr(doc, "reviewed_on", None):
        doc.reviewed_on = now_datetime()
    if status == "Resolved":
        doc.resolved_on = now_datetime()
    if status in {"Closed", "Cancelled"}:
        doc.closed_on = now_datetime()
    doc.save(ignore_permissions=True)

    if status != previous_status:
        _notify(doc.owner_user, "Fixer case status changed", f"Your Fixer case is now {status}.", doc, "the_fixer.admin_update_case_status")
        if status == "Resolved":
            _notify(
                doc.owner_user,
                "Fixer case resolved",
                "Your Fixer case has been marked resolved.",
                doc,
                "the_fixer.admin_update_case_status.resolved",
                priority="High",
                notification_type="Success",
            )
        _emit_notification_event(
            "admin.status_updated",
            doc,
            f"Your Fixer case is now {status}.",
            {**_notification_context(doc), "admin_note": payload.get("notes")},
        )

    _audit("fixer_case_status_updated", user, doc, "Fixer case status updated.", {"from": previous_status, "to": status})
    return _serialize_case(doc)


def create_task(user, case_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    case_doc = _get_doc(CASE_DOCTYPE, case_name)
    _assert_case_access(user, case_doc, internal=True)

    if not doctype_exists(TASK_DOCTYPE):
        raise frappe.DoesNotExistError

    task = frappe.get_doc(
        {
            "doctype": TASK_DOCTYPE,
            "tenant": case_doc.tenant,
            "fixer_case": case_doc.name,
            "status": payload.get("status") or "Open",
            "priority": payload.get("priority") or "Medium",
        }
    )
    _set_fields(task, payload, TASK_FIELDS)
    task.insert(ignore_permissions=True)

    if getattr(task, "assigned_to", None):
        _notify(task.assigned_to, "Fixer task assigned", "A Fixer task has been assigned to you.", case_doc, "the_fixer.create_task", priority="High")
    _audit("fixer_task_created", user, task, "Fixer task created.", {"fixer_case": case_doc.name})
    return _serialize_task(task)


def update_task(user, task_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    task = _get_doc(TASK_DOCTYPE, task_name)
    case_doc = _get_task_parent(task)
    _assert_case_access(user, case_doc, internal=True)

    previous_status = task.status
    _set_fields(task, payload, TASK_FIELDS)
    if task.status == "Completed" and not getattr(task, "completed_on", None):
        task.completed_on = now_datetime()
    task.save(ignore_permissions=True)

    if getattr(task, "assigned_to", None) and payload.get("assigned_to"):
        _notify(task.assigned_to, "Fixer task assigned", "A Fixer task has been assigned to you.", case_doc, "the_fixer.update_task.assigned", priority="High")
    if task.status == "Completed" and previous_status != "Completed":
        _notify(case_doc.owner_user, "Fixer task completed", "A Fixer task has been completed.", case_doc, "the_fixer.update_task.completed", notification_type="Success")
    _audit("fixer_task_updated", user, task, "Fixer task updated.", {"fixer_case": case_doc.name})
    return _serialize_task(task)


def complete_task(user, task_name):
    user = _require_user(user)
    task = _get_doc(TASK_DOCTYPE, task_name)
    case_doc = _get_task_parent(task)
    _assert_case_access(user, case_doc, internal=True)

    task.status = "Completed"
    task.completed_on = now_datetime()
    task.save(ignore_permissions=True)

    _notify(case_doc.owner_user, "Fixer task completed", "A Fixer task has been completed.", case_doc, "the_fixer.complete_task", notification_type="Success")
    _audit("fixer_task_completed", user, task, "Fixer task completed.", {"fixer_case": case_doc.name})
    return _serialize_task(task)


def add_case_update(user, case_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    case_doc = _get_doc(CASE_DOCTYPE, case_name)
    update_type = payload.get("update_type") or "Internal Note"
    visible_to_customer = 1 if payload.get("visible_to_customer") else 0

    _assert_case_access(user, case_doc, internal=not visible_to_customer)
    if update_type not in UPDATE_TYPES:
        raise frappe.ValidationError("Invalid Fixer update type.")
    if not doctype_exists(UPDATE_DOCTYPE):
        raise frappe.DoesNotExistError

    update = frappe.get_doc(
        {
            "doctype": UPDATE_DOCTYPE,
            "tenant": case_doc.tenant,
            "fixer_case": case_doc.name,
            "update_type": update_type,
            "status_snapshot": case_doc.status,
            "created_by_user": user,
            "visible_to_customer": visible_to_customer,
        }
    )
    _set_fields(update, payload, UPDATE_FIELDS)
    update.visible_to_customer = visible_to_customer
    update.status_snapshot = case_doc.status
    update.created_by_user = user
    update.insert(ignore_permissions=True)

    if visible_to_customer:
        _notify(case_doc.owner_user, "Fixer customer update added", "A new update is available on your Fixer case.", case_doc, "the_fixer.add_case_update.customer")
    _audit("fixer_update_added", user, update, "Fixer update added.", {"fixer_case": case_doc.name})
    return _serialize_update(update)


def list_case_updates(user, case_name, filters=None):
    user = _require_user(user)
    filters = _safe_payload(filters)
    case_doc = _get_doc(CASE_DOCTYPE, case_name)
    _assert_case_access(user, case_doc)

    if not doctype_exists(UPDATE_DOCTYPE):
        return {"updates": [], "count": 0}

    query_filters = {"fixer_case": case_doc.name}
    if filters.get("update_type"):
        query_filters["update_type"] = filters["update_type"]

    can_view_internal = _is_admin(user) or getattr(case_doc, "assigned_to", None) == user
    if not can_view_internal:
        query_filters["visible_to_customer"] = 1

    rows = frappe.get_all(
        UPDATE_DOCTYPE,
        filters=query_filters,
        fields=["name", "tenant", "fixer_case", "update_type", "message", "status_snapshot", "created_by_user", "visible_to_customer", "notes"],
        order_by="modified asc",
    )
    rows = [row for row in rows if row.get("tenant") == case_doc.tenant]

    return {"updates": rows, "count": len(rows)}
