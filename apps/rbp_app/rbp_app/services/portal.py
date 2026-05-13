"""Portal service activity aggregation."""

import frappe

from rbp_app.permissions import is_admin_user
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


_ACTIVITY_CONFIG = [
    ("decision_desk", "Decision Desk", "RBP Decision Desk Request", "title", "/portal/services/decision-desk/{name}", "/app/rbp-decision-desk-request/{name}", ("owner_user", "owner", "customer", "user")),
    ("docushare", "DocuShare", "RBP DocuShare Document", "title", "/portal/services/docushare/{name}", "/app/rbp-docushare-document/{name}", ("owner_user", "owner", "customer", "user")),
    ("connectivity", "Connectivity", "RBP Connectivity Request", "location_name", "/portal/services/nbn/{name}", "/app/rbp-connectivity-request/{name}", ("owner_user", "owner", "customer", "user")),
    ("risk_advisor", "Risk Advisor", "RBP Risk Advisor Assessment", "title", "/portal/services/risk-advisor/{name}", "/app/rbp-risk-advisor-assessment/{name}", ("owner_user", "owner", "customer", "user")),
    ("fixer", "The Fixer", "RBP Fixer Case", "title", "/portal/services/the-fixer/{name}", "/app/rbp-fixer-case/{name}", ("owner_user", "owner", "customer", "user")),
    ("marketplace_listing", "Marketplace Listing", "RBP Marketplace Listing", "title", "/portal/marketplace/listings/{name}", "/app/rbp-marketplace-listing/{name}", ("owner_user", "owner", "customer", "user")),
    ("marketplace_enquiry", "Marketplace Enquiry", "RBP Marketplace Order", "name", "/portal/marketplace/offers/{name}", "/app/rbp-marketplace-order/{name}", ("buyer_user", "owner_user", "owner", "customer", "user")),
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
    rows = []
    for item_type, label, doctype, title_field, portal_route, admin_route, owner_candidates in _ACTIVITY_CONFIG:
        if not doctype_exists(doctype):
            continue
        existing_fields = _existing_fields(doctype)
        owner_field = _first_present(owner_candidates, existing_fields)
        assigned_field = _first_present(("assigned_to",), existing_fields)
        submitted_field = _first_present(("submitted_on", "created_on", "creation", "modified"), existing_fields)
        reference_field = _first_present(("reference_id",), existing_fields)
        status_field = _first_present(("status", "workflow_state"), existing_fields)
        workflow_field = _first_present(("workflow_state", "status"), existing_fields)
        resolved_title_field = title_field if title_field in existing_fields else "name"

        filters = {}
        if not is_admin_user(user) and tenant and "tenant" in existing_fields:
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
            if not is_admin_user(user) and owner_value != user and assigned_value != user:
                continue
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
