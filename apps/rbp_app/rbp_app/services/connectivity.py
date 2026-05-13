"""Connectivity business services."""

import json

import frappe
from frappe.utils import now_datetime

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.notifications import create_notification, emit_event_notification
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


REQUEST_DOCTYPE = "RBP Connectivity Request"
PROVIDER_DOCTYPE = "RBP Connectivity Provider"
QUOTE_DOCTYPE = "RBP Connectivity Quote"

REQUEST_STATUSES = {
    "Draft",
    "Submitted",
    "In Review",
    "Quoted",
    "Approved",
    "In Progress",
    "Completed",
    "Cancelled",
}
REQUEST_TRANSITIONS = {
    "Draft": {"Submitted", "Cancelled"},
    "Submitted": {"In Review", "Cancelled"},
    "In Review": {"Quoted", "Approved", "Cancelled"},
    "Quoted": {"Approved", "Cancelled"},
    "Approved": {"In Progress", "Cancelled"},
    "In Progress": {"Completed", "Cancelled"},
    "Completed": set(),
    "Cancelled": set(),
}
PROVIDER_STATUSES = {"Active", "Inactive", "Archived"}
QUOTE_STATUSES = {"Draft", "Presented", "Accepted", "Rejected", "Expired"}

REQUEST_FIELDS = {
    "business_profile",
    "location_name",
    "address_line_1",
    "address_line_2",
    "suburb",
    "state",
    "postcode",
    "service_type",
    "current_provider",
    "current_plan",
    "desired_speed",
    "budget",
    "notes",
}
ADMIN_REQUEST_FIELDS = {"assigned_to", "notes"}
PROVIDER_FIELDS = {
    "provider_name",
    "contact_email",
    "contact_phone",
    "website",
    "service_regions",
    "service_types",
    "status",
    "notes",
}
QUOTE_FIELDS = {
    "provider",
    "quote_title",
    "speed_down",
    "speed_up",
    "monthly_cost",
    "setup_cost",
    "contract_months",
    "status",
    "recommended",
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


def _is_admin(user):
    return is_admin_user(user)


def _require_admin(user):
    _require_user(user)
    if not _is_admin(user):
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


def _set_fields(doc, payload, fields):
    for field in fields:
        if field in payload:
            setattr(doc, field, payload.get(field))


def _validate_value(value, allowed, message):
    if value and value not in allowed:
        raise frappe.ValidationError(message)


def _validate_provider_payload(payload):
    _validate_value(payload.get("status"), PROVIDER_STATUSES, "Invalid connectivity provider status.")


def _validate_quote_payload(payload):
    _validate_value(payload.get("status"), QUOTE_STATUSES, "Invalid connectivity quote status.")


def _assert_same_tenant(user, doc):
    if _is_admin(user):
        return True

    if getattr(doc, "tenant", None) != _require_tenant(user):
        raise frappe.PermissionError
    return True


def _assert_request_access(user, doc, *, owner_only=False, manage=False):
    _require_user(user)
    if _is_admin(user):
        return True

    _assert_same_tenant(user, doc)
    is_owner = doc.owner_user == user
    is_assigned = getattr(doc, "assigned_to", None) == user

    if manage:
        raise frappe.PermissionError
    if owner_only and not is_owner:
        raise frappe.PermissionError
    if is_owner or is_assigned:
        return True
    raise frappe.PermissionError


def _assert_quote_manage_access(user, request_doc):
    _require_user(user)
    if _is_admin(user):
        return True
    _assert_same_tenant(user, request_doc)
    if getattr(request_doc, "assigned_to", None) == user:
        return True
    raise frappe.PermissionError


def _audit(event_type, user, doc, message=None, metadata=None):
    return record_audit_event(
        event_type,
        actor=user,
        tenant=getattr(doc, "tenant", None),
        subject_doctype=getattr(doc, "doctype", None),
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
        route=f"/portal/connectivity/{doc.name}",
        related_doctype=getattr(doc, "doctype", None),
        related_name=doc.name,
        trigger_source=trigger_source,
        created_by_workflow="connectivity",
    )


def _admin_recipients():
    recipients = {"Administrator"}
    try:
        rows = frappe.get_all("Has Role", filters={"role": "System Manager"}, fields=["parent"])
        recipients.update(row.get("parent") for row in rows if row.get("parent"))
    except Exception:
        pass
    return sorted(recipients)


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
        frappe.log_error(frappe.get_traceback(), "RBP connectivity notification hook failed")


def _serialize_request(doc, quotes=None):
    return {
        "name": doc.name,
        "tenant": doc.tenant,
        "owner_user": doc.owner_user,
        "business_profile": getattr(doc, "business_profile", None),
        "location_name": getattr(doc, "location_name", None),
        "address_line_1": getattr(doc, "address_line_1", None),
        "address_line_2": getattr(doc, "address_line_2", None),
        "suburb": getattr(doc, "suburb", None),
        "state": getattr(doc, "state", None),
        "postcode": getattr(doc, "postcode", None),
        "service_type": getattr(doc, "service_type", None),
        "current_provider": getattr(doc, "current_provider", None),
        "current_plan": getattr(doc, "current_plan", None),
        "desired_speed": getattr(doc, "desired_speed", None),
        "budget": getattr(doc, "budget", None),
        "status": getattr(doc, "status", None),
        "workflow_state": getattr(doc, "workflow_state", None),
        "assigned_to": getattr(doc, "assigned_to", None),
        "submitted_on": getattr(doc, "submitted_on", None),
        "reviewed_on": getattr(doc, "reviewed_on", None),
        "closed_on": getattr(doc, "closed_on", None),
        "notes": getattr(doc, "notes", None),
        "quotes": quotes or [],
    }


def _serialize_provider(doc):
    return {
        "name": doc.name,
        "tenant": doc.tenant,
        "provider_name": getattr(doc, "provider_name", None),
        "contact_email": getattr(doc, "contact_email", None),
        "contact_phone": getattr(doc, "contact_phone", None),
        "website": getattr(doc, "website", None),
        "service_regions": getattr(doc, "service_regions", None),
        "service_types": getattr(doc, "service_types", None),
        "status": getattr(doc, "status", None),
        "notes": getattr(doc, "notes", None),
    }


def _serialize_quote(doc):
    return {
        "name": doc.name,
        "tenant": doc.tenant,
        "connectivity_request": doc.connectivity_request,
        "provider": doc.provider,
        "quote_title": getattr(doc, "quote_title", None),
        "speed_down": getattr(doc, "speed_down", None),
        "speed_up": getattr(doc, "speed_up", None),
        "monthly_cost": getattr(doc, "monthly_cost", None),
        "setup_cost": getattr(doc, "setup_cost", None),
        "contract_months": getattr(doc, "contract_months", None),
        "status": getattr(doc, "status", None),
        "recommended": getattr(doc, "recommended", None),
        "notes": getattr(doc, "notes", None),
    }


def _request_quotes(request_name):
    if not doctype_exists(QUOTE_DOCTYPE):
        return []
    return frappe.get_all(
        QUOTE_DOCTYPE,
        filters={"connectivity_request": request_name},
        fields=[
            "name",
            "tenant",
            "connectivity_request",
            "provider",
            "quote_title",
            "speed_down",
            "speed_up",
            "monthly_cost",
            "setup_cost",
            "contract_months",
            "status",
            "recommended",
            "notes",
        ],
        order_by="modified desc",
    )


def _set_request_status_dates(doc, status):
    timestamp = now_datetime()
    if status == "Submitted" and not getattr(doc, "submitted_on", None):
        doc.submitted_on = timestamp
    if status in {"In Review", "Quoted", "Approved"} and not getattr(doc, "reviewed_on", None):
        doc.reviewed_on = timestamp
    if status in {"Completed", "Cancelled"} and not getattr(doc, "closed_on", None):
        doc.closed_on = timestamp


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
        }
    )
    _set_fields(doc, payload, REQUEST_FIELDS)
    doc.insert(ignore_permissions=True)

    _audit("connectivity_request_created", user, doc, "Connectivity request created.")
    return _serialize_request(doc)


def update_draft_request(user, request_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    doc = _get_doc(REQUEST_DOCTYPE, request_name)
    _assert_request_access(user, doc, owner_only=True)
    if doc.status != "Draft":
        raise frappe.ValidationError("Only draft Connectivity requests can be updated by the owner.")

    _set_fields(doc, payload, REQUEST_FIELDS)
    doc.workflow_state = doc.status
    doc.save(ignore_permissions=True)

    _audit("connectivity_request_updated", user, doc, "Connectivity request updated.")
    return _serialize_request(doc)


def submit_request(user, request_name):
    user = _require_user(user)
    doc = _get_doc(REQUEST_DOCTYPE, request_name)
    _assert_request_access(user, doc, owner_only=True)
    if doc.status != "Draft":
        raise frappe.ValidationError("Only draft Connectivity requests can be submitted.")

    doc.status = "Submitted"
    doc.workflow_state = "Submitted"
    doc.submitted_on = now_datetime()
    doc.save(ignore_permissions=True)

    _notify(user, "Connectivity request submitted", "Your connectivity request was submitted.", doc, "connectivity.submit_request")
    for recipient in _admin_recipients():
        _notify(
            recipient,
            "Connectivity request submitted",
            f"{doc.owner_user} submitted a connectivity request.",
            doc,
            "connectivity.submit_request.admin",
            priority="High",
        )
    _emit_notification_event(
        "connectivity.nbn_order_submitted",
        doc,
        "Your connectivity order has been received.",
        {
            "reference_id": doc.name,
            "service_name": getattr(doc, "service_type", None) or "Connectivity",
            "status": doc.status,
            "portal_url": "/portal/services/nbn/start",
        },
    )
    _audit("connectivity_request_submitted", user, doc, "Connectivity request submitted.")
    return _serialize_request(doc)


def list_my_requests(user, filters=None):
    user = _require_user(user)
    filters = _safe_payload(filters)
    if not doctype_exists(REQUEST_DOCTYPE):
        return {"requests": [], "count": 0}

    query_filters = {}
    for field in ("status", "assigned_to", "service_type"):
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
            "business_profile",
            "location_name",
            "address_line_1",
            "address_line_2",
            "suburb",
            "state",
            "postcode",
            "service_type",
            "current_provider",
            "current_plan",
            "desired_speed",
            "budget",
            "status",
            "workflow_state",
            "assigned_to",
            "submitted_on",
            "reviewed_on",
            "closed_on",
            "notes",
            "modified",
        ],
        order_by="modified desc",
    )
    if not _is_admin(user):
        rows = [
            row
            for row in rows
            if row.get("owner_user") == user or row.get("assigned_to") == user
        ]
    return {"requests": rows, "count": len(rows)}


def get_request(user, request_name):
    user = _require_user(user)
    doc = _get_doc(REQUEST_DOCTYPE, request_name)
    _assert_request_access(user, doc)
    return _serialize_request(doc, _request_quotes(doc.name))


def admin_assign_request(user, request_name, assigned_to):
    user = _require_admin(user)
    doc = _get_doc(REQUEST_DOCTYPE, request_name)

    doc.assigned_to = assigned_to
    if doc.status == "Submitted":
        doc.status = "In Review"
        doc.workflow_state = "In Review"
        doc.reviewed_on = now_datetime()
    else:
        doc.workflow_state = doc.status
    doc.save(ignore_permissions=True)

    _notify(assigned_to, "Connectivity request assigned", "A connectivity request was assigned to you.", doc, "connectivity.admin_assign_request", priority="High")
    _audit("connectivity_request_assigned", user, doc, "Connectivity request assigned.", {"assigned_to": assigned_to})
    return _serialize_request(doc)


def admin_update_status(user, request_name, status, payload=None):
    user = _require_admin(user)
    payload = _safe_payload(payload)
    _validate_value(status, REQUEST_STATUSES, "Invalid connectivity request status.")
    doc = _get_doc(REQUEST_DOCTYPE, request_name)

    current_status = getattr(doc, "status", None) or "Draft"
    if status != current_status and status not in REQUEST_TRANSITIONS.get(current_status, set()):
        raise frappe.ValidationError("Invalid connectivity request status transition.")

    _set_fields(doc, payload, ADMIN_REQUEST_FIELDS)
    doc.status = status
    doc.workflow_state = status
    _set_request_status_dates(doc, status)
    doc.save(ignore_permissions=True)

    _notify(doc.owner_user, "Connectivity status changed", f"Your connectivity request is now {status}.", doc, "connectivity.admin_update_status")
    if getattr(doc, "assigned_to", None):
        _notify(doc.assigned_to, "Connectivity status changed", f"Connectivity request {doc.name} is now {status}.", doc, "connectivity.admin_update_status")
    _emit_notification_event(
        "admin.status_updated",
        doc,
        f"Your connectivity request is now {status}.",
        {
            "reference_id": doc.name,
            "service_name": getattr(doc, "service_type", None) or "Connectivity",
            "status": status,
            "admin_note": payload.get("notes"),
            "portal_url": "/portal/services/nbn/start",
        },
    )
    _audit("connectivity_status_updated", user, doc, "Connectivity status updated.", {"from_status": current_status, "to_status": status})
    return _serialize_request(doc)


def create_provider(user, payload):
    user = _require_admin(user)
    payload = _safe_payload(payload)
    tenant = payload.get("tenant") or _require_tenant(user)
    if not doctype_exists(PROVIDER_DOCTYPE):
        raise frappe.DoesNotExistError

    _validate_provider_payload(payload)
    doc = frappe.get_doc(
        {
            "doctype": PROVIDER_DOCTYPE,
            "tenant": tenant,
            "status": "Active",
        }
    )
    _set_fields(doc, payload, PROVIDER_FIELDS)
    doc.insert(ignore_permissions=True)

    _audit("connectivity_provider_created", user, doc, "Connectivity provider created.")
    return _serialize_provider(doc)


def update_provider(user, provider_name, payload):
    user = _require_admin(user)
    payload = _safe_payload(payload)
    doc = _get_doc(PROVIDER_DOCTYPE, provider_name)
    _validate_provider_payload(payload)

    _set_fields(doc, payload, PROVIDER_FIELDS)
    doc.save(ignore_permissions=True)

    _audit("connectivity_provider_updated", user, doc, "Connectivity provider updated.")
    return _serialize_provider(doc)


def list_providers(user, filters=None):
    user = _require_user(user)
    filters = _safe_payload(filters)
    if not doctype_exists(PROVIDER_DOCTYPE):
        return {"providers": [], "count": 0}

    query_filters = {}
    for field in ("status", "service_regions", "service_types"):
        if filters.get(field):
            query_filters[field] = filters[field]
    if not _is_admin(user):
        query_filters["tenant"] = _require_tenant(user)

    rows = frappe.get_all(
        PROVIDER_DOCTYPE,
        filters=query_filters,
        fields=[
            "name",
            "tenant",
            "provider_name",
            "contact_email",
            "contact_phone",
            "website",
            "service_regions",
            "service_types",
            "status",
            "notes",
            "modified",
        ],
        order_by="modified desc",
    )
    if not _is_admin(user):
        tenant = _require_tenant(user)
        rows = [row for row in rows if row.get("tenant") == tenant and row.get("status") == "Active"]
    return {"providers": rows, "count": len(rows)}


def create_quote(user, request_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    if not doctype_exists(QUOTE_DOCTYPE):
        raise frappe.DoesNotExistError

    request_doc = _get_doc(REQUEST_DOCTYPE, request_name)
    _assert_quote_manage_access(user, request_doc)
    if not payload.get("provider"):
        raise frappe.ValidationError("Provider is required.")
    provider = _get_doc(PROVIDER_DOCTYPE, payload.get("provider"))
    if provider.tenant != request_doc.tenant:
        raise frappe.PermissionError
    if provider.status != "Active":
        raise frappe.ValidationError("Provider must be active.")

    _validate_quote_payload(payload)
    doc = frappe.get_doc(
        {
            "doctype": QUOTE_DOCTYPE,
            "tenant": request_doc.tenant,
            "connectivity_request": request_doc.name,
            "provider": provider.name,
            "status": "Draft",
            "recommended": 0,
        }
    )
    _set_fields(doc, payload, QUOTE_FIELDS)
    doc.insert(ignore_permissions=True)

    if doc.status == "Presented":
        request_doc.status = "Quoted"
        request_doc.workflow_state = "Quoted"
        request_doc.reviewed_on = request_doc.reviewed_on or now_datetime()
        request_doc.save(ignore_permissions=True)
        _notify(request_doc.owner_user, "Connectivity quote presented", "A connectivity quote is ready for review.", request_doc, "connectivity.create_quote")
    _audit("connectivity_quote_created", user, doc, "Connectivity quote created.")
    return _serialize_quote(doc)


def update_quote(user, quote_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    quote = _get_doc(QUOTE_DOCTYPE, quote_name)
    request_doc = _get_doc(REQUEST_DOCTYPE, quote.connectivity_request)
    _assert_quote_manage_access(user, request_doc)
    _validate_quote_payload(payload)

    old_status = getattr(quote, "status", None)
    if payload.get("provider"):
        provider = _get_doc(PROVIDER_DOCTYPE, payload.get("provider"))
        if provider.tenant != request_doc.tenant:
            raise frappe.PermissionError
    _set_fields(quote, payload, QUOTE_FIELDS)
    quote.save(ignore_permissions=True)

    if quote.status == "Presented" and old_status != "Presented":
        request_doc.status = "Quoted"
        request_doc.workflow_state = "Quoted"
        request_doc.reviewed_on = request_doc.reviewed_on or now_datetime()
        request_doc.save(ignore_permissions=True)
        _notify(request_doc.owner_user, "Connectivity quote presented", "A connectivity quote is ready for review.", request_doc, "connectivity.update_quote")
    _audit("connectivity_quote_updated", user, quote, "Connectivity quote updated.")
    return _serialize_quote(quote)


def accept_quote(user, quote_name):
    user = _require_user(user)
    quote = _get_doc(QUOTE_DOCTYPE, quote_name)
    request_doc = _get_doc(REQUEST_DOCTYPE, quote.connectivity_request)
    _assert_request_access(user, request_doc, owner_only=True)
    if quote.tenant != request_doc.tenant:
        raise frappe.PermissionError
    if quote.status not in {"Presented", "Draft"}:
        raise frappe.ValidationError("Only draft or presented connectivity quotes can be accepted.")

    quote.status = "Accepted"
    quote.save(ignore_permissions=True)
    request_doc.status = "Approved"
    request_doc.workflow_state = "Approved"
    request_doc.reviewed_on = request_doc.reviewed_on or now_datetime()
    request_doc.save(ignore_permissions=True)

    if getattr(request_doc, "assigned_to", None):
        _notify(request_doc.assigned_to, "Connectivity quote accepted", "A connectivity quote was accepted.", request_doc, "connectivity.accept_quote")
    _notify(request_doc.owner_user, "Connectivity quote accepted", "Your connectivity quote was accepted.", request_doc, "connectivity.accept_quote")
    _audit("connectivity_quote_accepted", user, quote, "Connectivity quote accepted.")
    return _serialize_quote(quote)
