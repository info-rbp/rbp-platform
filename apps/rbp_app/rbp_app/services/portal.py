"""Portal service activity aggregation."""

import frappe

from rbp_app.permissions import is_admin_user
from rbp_app.services.service_routes import SERVICE_ROUTES
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


_ACTIVITY_CONFIG = [
    {
        "item_type": "decision_desk",
        "label": "Decision Desk",
        "doctype": "RBP Decision Desk Request",
        "title_field": "title",
        "route_key": "decision_desk",
        "owner_candidates": ("owner_user", "owner", "customer", "user"),
        "requires_tenant_for_customer": True,
        "allow_owner_only_without_tenant": False,
    },
    {
        "item_type": "docushare",
        "label": "DocuShare",
        "doctype": "RBP DocuShare Document",
        "title_field": "title",
        "route_key": "docushare",
        "owner_candidates": ("owner_user", "owner", "customer", "user"),
        "requires_tenant_for_customer": True,
        "allow_owner_only_without_tenant": False,
    },
    {
        "item_type": "connectivity",
        "label": "Connectivity",
        "doctype": "RBP Connectivity Request",
        "title_field": "location_name",
        "route_key": "connectivity",
        "owner_candidates": ("owner_user", "owner", "customer", "user"),
        "requires_tenant_for_customer": True,
        "allow_owner_only_without_tenant": False,
    },
    {
        "item_type": "risk_advisor",
        "label": "Risk Advisor",
        "doctype": "RBP Risk Advisor Assessment",
        "title_field": "title",
        "route_key": "risk_advisor",
        "owner_candidates": ("owner_user", "owner", "customer", "user"),
        "requires_tenant_for_customer": True,
        "allow_owner_only_without_tenant": False,
    },
    {
        "item_type": "fixer",
        "label": "The Fixer",
        "doctype": "RBP Fixer Case",
        "title_field": "title",
        "route_key": "the_fixer",
        "owner_candidates": ("owner_user", "owner", "customer", "user"),
        "requires_tenant_for_customer": True,
        "allow_owner_only_without_tenant": False,
    },
    {
        "item_type": "marketplace_listing",
        "label": "Marketplace Listing",
        "doctype": "RBP Marketplace Listing",
        "title_field": "title",
        "route_key": "marketplace_listing",
        "owner_candidates": ("owner_user", "owner", "customer", "user"),
        "requires_tenant_for_customer": True,
        "allow_owner_only_without_tenant": False,
    },
    {
        "item_type": "marketplace_enquiry",
        "label": "Marketplace Enquiry",
        "doctype": "RBP Marketplace Order",
        "title_field": "name",
        "route_key": "marketplace_enquiry",
        "owner_candidates": ("buyer_user", "owner_user", "owner", "customer", "user"),
        "requires_tenant_for_customer": True,
        "allow_owner_only_without_tenant": False,
    },
]


def _existing_fields(doctype):
    meta = frappe.get_meta(doctype)
    return {field.fieldname for field in meta.fields} | {"name", "owner", "modified", "creation"}


def _first_present(candidates, existing_fields):
    for candidate in candidates:
        if candidate in existing_fields:
            return candidate
    return None


def get_my_service_activity(user):
    if not user or user == "Guest":
        raise frappe.PermissionError

    tenant = get_current_tenant_name(user)
    is_admin = is_admin_user(user)
    rows = []
    for config in _ACTIVITY_CONFIG:
        item_type = config["item_type"]
        label = config["label"]
        doctype = config["doctype"]
        if not doctype_exists(doctype):
            continue
        existing_fields = _existing_fields(doctype)
        has_tenant = "tenant" in existing_fields
        if not is_admin:
            if config.get("requires_tenant_for_customer") and not has_tenant:
                continue
            if has_tenant and not tenant:
                continue
            if not has_tenant and not config.get("allow_owner_only_without_tenant"):
                continue

        owner_candidates = config["owner_candidates"]
        owner_field = _first_present(owner_candidates, existing_fields)
        assigned_field = _first_present(("assigned_to",), existing_fields)
        if not is_admin and not owner_field and not assigned_field:
            continue

        submitted_field = _first_present(("submitted_on", "created_on", "creation", "modified"), existing_fields)
        reference_field = _first_present(("reference_id",), existing_fields)
        status_field = _first_present(("status", "workflow_state"), existing_fields)
        workflow_field = _first_present(("workflow_state", "status"), existing_fields)
        resolved_title_field = config["title_field"] if config["title_field"] in existing_fields else "name"

        filters = {}
        if not is_admin and has_tenant:
            filters["tenant"] = tenant
        fields = ["name", "modified", resolved_title_field]
        for optional_field in [owner_field, assigned_field, submitted_field, reference_field, status_field, workflow_field]:
            if optional_field and optional_field not in fields:
                fields.append(optional_field)
        result = frappe.get_all(
            doctype,
            filters=filters,
            fields=fields,
            order_by="modified desc",
            limit_page_length=20,
        )
        for row in result:
            owner_value = row.get(owner_field) if owner_field else None
            assigned_value = row.get(assigned_field) if assigned_field else None
            if not is_admin and owner_value != user and assigned_value != user:
                continue
            portal_route, admin_route = SERVICE_ROUTES[config["route_key"]]
            rows.append({
                "type": item_type,
                "label": label,
                "name": row.get("name"),
                "reference_id": row.get(reference_field) if reference_field else None,
                "title": row.get(resolved_title_field) or row.get("name"),
                "status": row.get(status_field) if status_field else None,
                "workflow_state": (row.get(workflow_field) if workflow_field else None) or (row.get(status_field) if status_field else None),
                "submitted_on": row.get(submitted_field) if submitted_field else row.get("modified"),
                "updated_on": row.get("modified"),
                "portal_route": portal_route.format(name=row.get("name")),
                "admin_route": admin_route.format(name=row.get("name")),
            })

    rows.sort(key=lambda x: x.get("updated_on") or "", reverse=True)
    return {"records": rows, "count": len(rows)}
