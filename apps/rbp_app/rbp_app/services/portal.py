"""Live member portal aggregation services."""

import json
from datetime import datetime

import frappe

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.notifications import create_notification
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


SERVICE_REGISTRY = {
    "decision-desk": {
        "label": "Decision Desk",
        "doctype": "RBP Decision Desk Request",
        "owner_field": "owner_user",
        "title_field": "title",
        "summary_field": "summary",
        "priority_field": "urgency",
        "category_field": "category",
        "create": "rbp_app.services.decision_desk.create_request",
        "submit": "rbp_app.services.decision_desk.submit_request",
    },
    "docushare": {
        "label": "DocuShare",
        "doctype": "RBP DocuShare Document",
        "owner_field": "owner_user",
        "title_field": "title",
        "summary_field": "description",
        "priority_field": None,
        "category_field": "document_type",
        "create": "rbp_app.services.docushare.create_document",
    },
    "connectivity": {
        "label": "Connectivity",
        "doctype": "RBP Connectivity Request",
        "owner_field": "owner_user",
        "title_field": "location_name",
        "summary_field": "notes",
        "priority_field": None,
        "category_field": "service_type",
        "create": "rbp_app.services.connectivity.create_request",
        "submit": "rbp_app.services.connectivity.submit_request",
    },
    "risk-advisor": {
        "label": "Risk Advisor",
        "doctype": "RBP Risk Advisor Assessment",
        "owner_field": "owner_user",
        "title_field": "title",
        "summary_field": "summary",
        "priority_field": "risk_level",
        "category_field": "assessment_type",
        "create": "rbp_app.services.risk_advisor.create_assessment",
        "submit": "rbp_app.services.risk_advisor.submit_assessment",
    },
    "the-fixer": {
        "label": "The Fixer",
        "doctype": "RBP Fixer Case",
        "owner_field": "owner_user",
        "title_field": "title",
        "summary_field": "issue_summary",
        "priority_field": "urgency",
        "category_field": "category",
        "create": "rbp_app.services.the_fixer.create_case",
        "submit": "rbp_app.services.the_fixer.submit_case",
    },
    "marketplace": {
        "label": "Marketplace",
        "doctype": "RBP Marketplace Order",
        "owner_field": "buyer_user",
        "title_field": "listing",
        "summary_field": "notes",
        "priority_field": None,
        "category_field": "vendor",
    },
    "membership": {
        "label": "Membership",
        "doctype": "RBP Onboarding Flow",
        "owner_field": "owner_user",
        "title_field": "plan_code",
        "summary_field": "source_channel",
        "priority_field": None,
        "category_field": "membership_plan",
    },
}


def _safe_payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload or "{}")
    return dict(payload)


def _get_meta_fields(doctype):
    try:
        return {field.fieldname for field in frappe.get_meta(doctype).fields}
    except Exception:
        return set()


def _field_value(doc_or_row, field, default=None):
    if not field:
        return default
    if isinstance(doc_or_row, dict):
        return doc_or_row.get(field, default)
    return getattr(doc_or_row, field, default)


def _require_tenant_for_portal_user(user):
    if is_admin_user(user):
        return None
    tenant = get_current_tenant_name(user)
    if not tenant:
        raise frappe.PermissionError
    return tenant


def _visible_row(user, row, config):
    if is_admin_user(user):
        return True

    tenant = _require_tenant_for_portal_user(user)
    if row.get("tenant") != tenant:
        return False

    owner_field = config.get("owner_field")
    if owner_field and row.get(owner_field) == user:
        return True

    if row.get("assigned_to") == user:
        return True

    return False


def _timeline_from_row(row):
    items = []
    for field, label in (
        ("creation", "Created"),
        ("submitted_on", "Submitted"),
        ("reviewed_on", "Reviewed"),
        ("approved_on", "Approved"),
        ("fulfilled_on", "Fulfilled"),
        ("resolved_on", "Resolved"),
        ("closed_on", "Closed"),
        ("modified", "Updated"),
    ):
        value = row.get(field)
        if value:
            items.append({"label": label, "at": value, "status": row.get("status")})
    return items


def _next_action(status):
    status_text = (status or "").lower()
    if status_text in {"draft"}:
        return "Complete and submit the request."
    if "waiting" in status_text:
        return "RBP is waiting on your response."
    if status_text in {"submitted", "requested"}:
        return "RBP will review this request."
    if "review" in status_text or "progress" in status_text or "assigned" in status_text:
        return "RBP is working on this service."
    if "ready" in status_text or "quoted" in status_text:
        return "Review the latest update."
    if status_text in {"completed", "closed", "fulfilled", "resolved"}:
        return "Service complete."
    return "Open for details."


def _normalise_item(row, service_type, config):
    name = row.get("name")
    status = row.get("status")
    priority = _field_value(row, config.get("priority_field")) or row.get("priority")
    title = _field_value(row, config.get("title_field")) or name
    summary = _field_value(row, config.get("summary_field")) or _field_value(row, config.get("category_field")) or ""

    return {
        "id": f"{service_type}:{name}",
        "reference": name,
        "service_type": service_type,
        "service_label": config["label"],
        "title": title,
        "summary": summary,
        "status": status,
        "workflow_state": row.get("workflow_state") or status,
        "priority": priority or "Normal",
        "created_on": row.get("creation"),
        "modified_on": row.get("modified"),
        "submitted_on": row.get("submitted_on") or row.get("requested_on"),
        "assigned_to": row.get("assigned_to"),
        "next_action": _next_action(status),
        "detail_route": f"/portal/services/{service_type}:{name}",
        "source_doctype": config["doctype"],
        "source_name": name,
    }


def _query_service_rows(user, service_type, config, filters):
    doctype = config["doctype"]
    if not doctype_exists(doctype):
        return []

    meta_fields = _get_meta_fields(doctype)
    fields = [
        "name",
        "creation",
        "modified",
        "tenant",
        "status",
        "workflow_state",
        "assigned_to",
        "submitted_on",
        "requested_on",
        "reviewed_on",
        "approved_on",
        "fulfilled_on",
        "resolved_on",
        "closed_on",
        config.get("owner_field"),
        config.get("title_field"),
        config.get("summary_field"),
        config.get("priority_field"),
        config.get("category_field"),
    ]
    fields = sorted({field for field in fields if field and (field == "name" or field in meta_fields)})

    query_filters = {}
    if filters.get("status") and "status" in meta_fields:
        query_filters["status"] = filters["status"]
    if filters.get("priority") and config.get("priority_field") in meta_fields:
        query_filters[config["priority_field"]] = filters["priority"]
    if filters.get("from_date") and "modified" in meta_fields:
        query_filters["modified"] = [">=", filters["from_date"]]
    if filters.get("to_date") and "modified" in meta_fields:
        existing = query_filters.get("modified")
        query_filters["modified"] = ["between", [existing[1], filters["to_date"]]] if existing else ["<=", filters["to_date"]]
    if not is_admin_user(user) and "tenant" in meta_fields:
        query_filters["tenant"] = _require_tenant_for_portal_user(user)

    rows = frappe.get_all(doctype, filters=query_filters, fields=fields, order_by="modified desc", limit_page_length=100)
    rows = [row for row in rows if _visible_row(user, row, config)]

    search = (filters.get("search") or "").strip().lower()
    if search:
        rows = [
            row
            for row in rows
            if search in " ".join(str(row.get(field) or "") for field in fields).lower()
        ]

    return [_normalise_item(row, service_type, config) for row in rows]


def _sort_key(item):
    priority_weight = {"Urgent": 0, "Critical": 0, "High": 1, "Medium": 2, "Normal": 3, "Low": 4}
    status_weight = 0 if str(item.get("status") or "").lower() in {"outcome ready", "quoted", "waiting on customer"} else 1
    modified = item.get("modified_on") or item.get("submitted_on") or item.get("created_on")
    if isinstance(modified, str):
        try:
            modified = datetime.fromisoformat(modified.replace("Z", "+00:00"))
        except Exception:
            modified = datetime.min
    return (priority_weight.get(item.get("priority"), 3), status_weight, -(modified.timestamp() if modified else 0))


def list_my_services(user, filters=None):
    filters = _safe_payload(filters)
    requested_type = filters.get("service_type")
    items = []
    groups = {}

    for service_type, config in SERVICE_REGISTRY.items():
        if requested_type and requested_type != service_type:
            continue
        rows = _query_service_rows(user, service_type, config, filters)
        groups[service_type] = {
            "service_type": service_type,
            "service_label": config["label"],
            "source_doctype": config["doctype"],
            "available": doctype_exists(config["doctype"]),
            "count": len(rows),
        }
        items.extend(rows)

    items = sorted(items, key=_sort_key)
    return {"services": items, "groups": groups, "count": len(items)}


def _split_service_id(service_type, name=None):
    if name:
        return service_type, name
    if ":" not in service_type:
        raise frappe.ValidationError("Service record id must include service_type:name.")
    return service_type.split(":", 1)


def _assert_record_visible(user, doc, config):
    row = {field: getattr(doc, field, None) for field in _get_meta_fields(doc.doctype)}
    row["name"] = doc.name
    if not _visible_row(user, row, config):
        raise frappe.PermissionError


def get_service_record(user, service_type, name=None):
    service_type, name = _split_service_id(service_type, name)
    config = SERVICE_REGISTRY.get(service_type)
    if not config:
        raise frappe.ValidationError("Unsupported service_type.")
    if not doctype_exists(config["doctype"]):
        raise frappe.DoesNotExistError

    doc = frappe.get_doc(config["doctype"], name)
    _assert_record_visible(user, doc, config)
    meta_fields = _get_meta_fields(config["doctype"])
    row = {field: getattr(doc, field, None) for field in meta_fields}
    row["name"] = doc.name
    item = _normalise_item(row, service_type, config)

    files = []
    if doctype_exists("RBP File Reference"):
        try:
            from rbp_app.services.files import list_file_references

            files = list_file_references(user=user, related_doctype=config["doctype"], related_name=name)
        except Exception:
            files = []

    return {
        "metadata": item,
        "record": row,
        "status_timeline": _timeline_from_row(row),
        "attached_files": files,
        "notes": [{"message": row.get("notes")}] if row.get("notes") else [],
        "allowed_actions": [{"action": "view", "label": "View"}],
        "source_doctype": config["doctype"],
        "source_name": name,
    }


def _call(path, *args):
    module_path, function_name = path.rsplit(".", 1)
    module = frappe.get_module(module_path)
    return getattr(module, function_name)(*args)


def create_service_request_router(user, service_type, payload=None):
    payload = _safe_payload(payload)
    config = SERVICE_REGISTRY.get(service_type)
    if not config or not config.get("create"):
        raise frappe.ValidationError("Unsupported service_type.")

    doc_payload = payload.get("payload") if isinstance(payload.get("payload"), dict) else payload
    created = _call(config["create"], user, doc_payload)
    name = created.get("name")

    if payload.get("submit") and config.get("submit") and name:
        created = _call(config["submit"], user, name)

    if name:
        try:
            create_notification(
                user=user,
                tenant=created.get("tenant"),
                title=f"{config['label']} request created",
                message="Your request has been created.",
                route=f"/portal/services/{service_type}:{name}",
                related_doctype=config["doctype"],
                related_name=name,
                trigger_source="portal.create_service_request_router",
            )
        except Exception:
            pass
        record_audit_event(
            "portal_service_request_created",
            actor=user,
            tenant=created.get("tenant"),
            subject_doctype=config["doctype"],
            subject_name=name,
            message="Portal service request routed.",
            metadata={"service_type": service_type},
        )

    return get_service_record(user, service_type, name) if name else {"record": created}
