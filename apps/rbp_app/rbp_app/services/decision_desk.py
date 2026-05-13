"""Decision Desk business services."""

import json

import frappe
from frappe.utils import now_datetime

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.notifications import create_notification, emit_event_notification
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


REQUEST_DOCTYPE = "RBP Decision Desk Request"
OPTION_DOCTYPE = "RBP Decision Desk Option"

REQUEST_STATUSES = {
    "Draft",
    "Submitted",
    "In Review",
    "Assigned",
    "In Progress",
    "Outcome Ready",
    "Closed",
    "Cancelled",
}

DRAFT_FIELDS = {
    "business_profile",
    "title",
    "category",
    "summary",
    "business_context",
    "urgency",
    "deadline",
    "desired_outcome",
    "constraints",
    "source_channel",
    "supporting_file_reference",
    "notes",
}
ADMIN_UPDATE_FIELDS = {"assigned_to", "notes", "supporting_file_reference"}
OPTION_FIELDS = {
    "option_label",
    "option_summary",
    "pros",
    "cons",
    "estimated_cost",
    "risk_level",
    "recommended",
    "sort_order",
    "notes",
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


def _get_doc(doctype, name):
    if not doctype_exists(doctype):
        raise frappe.DoesNotExistError
    return frappe.get_doc(doctype, name)


def _is_admin(user):
    return is_admin_user(user)


def _serialize_request(doc, options=None):
    return {
        "name": doc.name,
        "tenant": doc.tenant,
        "owner_user": doc.owner_user,
        "business_profile": getattr(doc, "business_profile", None),
        "title": getattr(doc, "title", None),
        "category": getattr(doc, "category", None),
        "summary": getattr(doc, "summary", None),
        "business_context": getattr(doc, "business_context", None),
        "urgency": getattr(doc, "urgency", None),
        "deadline": getattr(doc, "deadline", None),
        "desired_outcome": getattr(doc, "desired_outcome", None),
        "constraints": getattr(doc, "constraints", None),
        "status": doc.status,
        "workflow_state": getattr(doc, "workflow_state", None),
        "assigned_to": getattr(doc, "assigned_to", None),
        "submitted_on": getattr(doc, "submitted_on", None),
        "reviewed_on": getattr(doc, "reviewed_on", None),
        "closed_on": getattr(doc, "closed_on", None),
        "source_channel": getattr(doc, "source_channel", None),
        "supporting_file_reference": getattr(doc, "supporting_file_reference", None),
        "notes": getattr(doc, "notes", None),
        "options": options or [],
    }


def _serialize_option(doc):
    return {
        "name": doc.name,
        "decision_request": doc.decision_request,
        "tenant": doc.tenant,
        "option_label": getattr(doc, "option_label", None),
        "option_summary": getattr(doc, "option_summary", None),
        "pros": getattr(doc, "pros", None),
        "cons": getattr(doc, "cons", None),
        "estimated_cost": getattr(doc, "estimated_cost", None),
        "risk_level": getattr(doc, "risk_level", None),
        "recommended": getattr(doc, "recommended", None),
        "sort_order": getattr(doc, "sort_order", None),
        "notes": getattr(doc, "notes", None),
    }


def _assert_request_access(user, doc, *, owner_only=False, manage=False):
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
    if is_owner or is_assigned:
        return True

    raise frappe.PermissionError


def _get_option_parent(option):
    if not option.decision_request:
        raise frappe.ValidationError("Decision option is missing its parent request.")
    return _get_doc(REQUEST_DOCTYPE, option.decision_request)


def _set_fields(doc, payload, allowed_fields):
    for field in allowed_fields:
        if field in payload:
            setattr(doc, field, payload.get(field))


def _audit(event_type, user, doc, message=None, metadata=None):
    return record_audit_event(
        event_type,
        actor=user,
        tenant=getattr(doc, "tenant", None),
        subject_doctype=getattr(doc, "doctype", None) or REQUEST_DOCTYPE,
        subject_name=doc.name,
        workflow_state=getattr(doc, "workflow_state", None) or getattr(doc, "status", None),
        message=message,
        metadata=metadata or {},
    )


def _notify(user, title, message, doc, trigger_source, *, priority="Normal", notification_type="Info"):
    if not user:
        return None
    return create_notification(
        user=user,
        tenant=getattr(doc, "tenant", None),
        title=title,
        message=message,
        priority=priority,
        notification_type=notification_type,
        route=f"/portal/decision-desk/{doc.name}",
        related_doctype=REQUEST_DOCTYPE,
        related_name=doc.name,
        trigger_source=trigger_source,
        created_by_workflow="decision_desk",
    )


def _admin_recipients():
    recipients = {"Administrator"}
    try:
        rows = frappe.get_all("Has Role", filters={"role": "System Manager"}, fields=["parent"])
        recipients.update(row.get("parent") for row in rows if row.get("parent"))
    except Exception:
        pass
    return sorted(recipients)


def _notify_admins_new_request(doc):
    for recipient in _admin_recipients():
        _notify(
            recipient,
            "New Decision Desk request",
            f"{doc.owner_user} submitted a Decision Desk request.",
            doc,
            "decision_desk.submit_request.admin",
            priority="High",
        )


def _emit_notification_event(event_type, doc, message, context):
    try:
        emit_event_notification(
            event_type=event_type,
            user=None,
            tenant=getattr(doc, "tenant", None),
            customer_email=getattr(doc, "owner_user", None),
            related_doctype=getattr(doc, "doctype", None) or REQUEST_DOCTYPE,
            related_name=doc.name,
            message=message,
            context=context,
        )
    except Exception:
        frappe.log_error(frappe.get_traceback(), "RBP service request notification hook failed")


def create_request(user, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    tenant = _require_tenant(user)

    if not doctype_exists(REQUEST_DOCTYPE):
        raise frappe.DoesNotExistError

    doc = frappe.get_doc(
        {
            "doctype": REQUEST_DOCTYPE,
            "tenant": tenant,
            "owner_user": user,
            "status": "Draft",
            "workflow_state": "Draft",
            "urgency": "Normal",
            "source_channel": payload.get("source_channel") or "portal",
        }
    )
    _set_fields(doc, payload, DRAFT_FIELDS)
    doc.insert(ignore_permissions=True)

    _audit("decision_desk_request_created", user, doc, "Decision Desk request created.")
    return _serialize_request(doc)


def update_draft_request(user, request_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    doc = _get_doc(REQUEST_DOCTYPE, request_name)
    _assert_request_access(user, doc, owner_only=True)

    if doc.status != "Draft":
        raise frappe.ValidationError("Only draft Decision Desk requests can be updated by the owner.")

    _set_fields(doc, payload, DRAFT_FIELDS)
    doc.workflow_state = doc.status
    doc.save(ignore_permissions=True)

    _audit("decision_desk_request_updated", user, doc, "Decision Desk request updated.")
    return _serialize_request(doc)


def submit_request(user, request_name):
    user = _require_user(user)
    doc = _get_doc(REQUEST_DOCTYPE, request_name)
    _assert_request_access(user, doc, owner_only=True)

    if doc.status != "Draft":
        raise frappe.ValidationError("Only draft Decision Desk requests can be submitted.")

    doc.status = "Submitted"
    doc.workflow_state = "Submitted"
    doc.submitted_on = now_datetime()
    doc.save(ignore_permissions=True)

    _notify(
        doc.owner_user,
        "Decision Desk request submitted",
        "Your Decision Desk request has been submitted.",
        doc,
        "decision_desk.submit_request.user",
    )
    _notify_admins_new_request(doc)
    _emit_notification_event(
        "service.request_submitted",
        doc,
        "Your service request has been received.",
        {
            "reference_id": doc.name,
            "service_name": "Decision Desk",
            "status": doc.status,
            "portal_url": "/portal/services",
        },
    )
    _audit("decision_desk_request_submitted", user, doc, "Decision Desk request submitted.")
    return _serialize_request(doc)


def list_my_requests(user, filters=None):
    user = _require_user(user)
    filters = _safe_payload(filters)

    if not doctype_exists(REQUEST_DOCTYPE):
        return {"requests": [], "count": 0}

    query_filters = {}
    for field in ("status", "category", "urgency"):
        if filters.get(field):
            query_filters[field] = filters[field]

    if not _is_admin(user):
        query_filters["tenant"] = _require_tenant(user)

    rows = frappe.get_all(
        REQUEST_DOCTYPE,
        filters=query_filters,
        fields=[
            "name",
            "tenant",
            "owner_user",
            "title",
            "category",
            "urgency",
            "status",
            "workflow_state",
            "assigned_to",
            "submitted_on",
            "reviewed_on",
            "closed_on",
            "modified",
        ],
        order_by="modified desc",
    )

    if not _is_admin(user):
        rows = [row for row in rows if row.get("owner_user") == user or row.get("assigned_to") == user]

    return {"requests": rows, "count": len(rows)}


def get_request(user, request_name):
    user = _require_user(user)
    doc = _get_doc(REQUEST_DOCTYPE, request_name)
    _assert_request_access(user, doc)

    options = []
    if doctype_exists(OPTION_DOCTYPE):
        option_rows = frappe.get_all(
            OPTION_DOCTYPE,
            filters={"decision_request": doc.name},
            fields=[
                "name",
                "decision_request",
                "tenant",
                "option_label",
                "option_summary",
                "pros",
                "cons",
                "estimated_cost",
                "risk_level",
                "recommended",
                "sort_order",
                "notes",
            ],
            order_by="sort_order asc, modified asc",
        )
        options = option_rows

    return _serialize_request(doc, options=options)


def admin_assign_request(user, request_name, assigned_to):
    user = _require_user(user)
    if not _is_admin(user):
        raise frappe.PermissionError
    if not assigned_to:
        raise frappe.ValidationError("Assigned advisor is required.")

    doc = _get_doc(REQUEST_DOCTYPE, request_name)
    doc.assigned_to = assigned_to
    doc.status = "Assigned"
    doc.workflow_state = "Assigned"
    doc.reviewed_on = now_datetime()
    doc.save(ignore_permissions=True)

    _notify(
        assigned_to,
        "Decision Desk request assigned",
        "A Decision Desk request has been assigned to you.",
        doc,
        "decision_desk.admin_assign_request",
        priority="High",
    )
    _audit(
        "decision_desk_request_assigned",
        user,
        doc,
        "Decision Desk request assigned.",
        {"assigned_to": assigned_to},
    )
    return _serialize_request(doc)


def admin_update_status(user, request_name, status, payload=None):
    user = _require_user(user)
    if not _is_admin(user):
        raise frappe.PermissionError
    if status not in REQUEST_STATUSES:
        raise frappe.ValidationError("Invalid Decision Desk request status.")

    payload = _safe_payload(payload)
    doc = _get_doc(REQUEST_DOCTYPE, request_name)
    previous_status = doc.status

    _set_fields(doc, payload, ADMIN_UPDATE_FIELDS)
    doc.status = status
    doc.workflow_state = status

    if status in {"In Review", "Assigned", "In Progress", "Outcome Ready"} and not getattr(doc, "reviewed_on", None):
        doc.reviewed_on = now_datetime()
    if status in {"Closed", "Cancelled"}:
        doc.closed_on = now_datetime()

    doc.save(ignore_permissions=True)

    if status != previous_status:
        _notify(
            doc.owner_user,
            "Decision Desk status changed",
            f"Your Decision Desk request is now {status}.",
            doc,
            "decision_desk.admin_update_status",
        )
        if status == "Outcome Ready":
            _notify(
                doc.owner_user,
                "Decision Desk outcome ready",
                "Your Decision Desk outcome is ready to review.",
                doc,
                "decision_desk.admin_update_status.outcome_ready",
                priority="High",
                notification_type="Success",
            )
        _emit_notification_event(
            "admin.status_updated",
            doc,
            f"Your Decision Desk request is now {status}.",
            {
                "reference_id": doc.name,
                "service_name": "Decision Desk",
                "status": status,
                "admin_note": payload.get("notes"),
                "portal_url": "/portal/services",
            },
        )

    _audit(
        "decision_desk_status_updated",
        user,
        doc,
        "Decision Desk status updated.",
        {"from": previous_status, "to": status},
    )
    return _serialize_request(doc)


def create_option(user, request_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    request_doc = _get_doc(REQUEST_DOCTYPE, request_name)
    _assert_request_access(user, request_doc)

    if not doctype_exists(OPTION_DOCTYPE):
        raise frappe.DoesNotExistError

    option = frappe.get_doc(
        {
            "doctype": OPTION_DOCTYPE,
            "decision_request": request_doc.name,
            "tenant": request_doc.tenant,
            "risk_level": "Medium",
            "recommended": 0,
            "sort_order": 0,
        }
    )
    _set_fields(option, payload, OPTION_FIELDS)
    option.insert(ignore_permissions=True)

    _audit(
        "decision_desk_option_created",
        user,
        option,
        "Decision Desk option created.",
        {"decision_request": request_doc.name},
    )
    return _serialize_option(option)


def update_option(user, option_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    option = _get_doc(OPTION_DOCTYPE, option_name)
    request_doc = _get_option_parent(option)
    _assert_request_access(user, request_doc)

    if option.tenant != request_doc.tenant:
        raise frappe.PermissionError

    _set_fields(option, payload, OPTION_FIELDS)
    option.save(ignore_permissions=True)

    _audit(
        "decision_desk_option_updated",
        user,
        option,
        "Decision Desk option updated.",
        {"decision_request": request_doc.name},
    )
    return _serialize_option(option)


def delete_option(user, option_name):
    user = _require_user(user)
    option = _get_doc(OPTION_DOCTYPE, option_name)
    request_doc = _get_option_parent(option)
    _assert_request_access(user, request_doc)

    if option.tenant != request_doc.tenant:
        raise frappe.PermissionError

    option_name = option.name
    option.delete(ignore_permissions=True)

    _audit(
        "decision_desk_option_deleted",
        user,
        option,
        "Decision Desk option deleted.",
        {"decision_request": request_doc.name},
    )
    return {"deleted": True, "name": option_name}
