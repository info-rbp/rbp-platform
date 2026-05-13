"""Marketplace business services."""

import json
from decimal import Decimal

import frappe
from frappe.utils import now_datetime

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.reference_ids import ensure_reference_id as _ensure_reference_id, generate_reference_id
from rbp_app.services.notifications import create_notification, emit_event_notification, safe_emit_event_notification
from rbp_app.services.service_routes import service_routes
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


VENDOR_DOCTYPE = "RBP Marketplace Vendor"
LISTING_DOCTYPE = "RBP Marketplace Listing"
ORDER_DOCTYPE = "RBP Marketplace Order"

VENDOR_STATUSES = {"Draft", "Active", "Suspended", "Archived"}
VERIFICATION_STATUSES = {"Unverified", "Pending", "Verified", "Rejected"}
LISTING_STATUSES = {"Draft", "Submitted", "Under Review", "Active", "Paused", "Archived", "Rejected"}
VISIBILITY_VALUES = {"Private", "Tenant", "Public"}
BILLING_MODELS = {"One-off", "Recurring", "Quote"}
ORDER_STATUSES = {"Requested", "Approved", "In Progress", "Fulfilled", "Cancelled", "Rejected"}
ORDER_TRANSITIONS = {
    "Requested": {"Approved", "Rejected", "Cancelled"},
    "Approved": {"In Progress", "Cancelled"},
    "In Progress": {"Fulfilled", "Cancelled"},
    "Fulfilled": set(),
    "Cancelled": set(),
    "Rejected": set(),
}

VENDOR_FIELDS = {
    "vendor_name",
    "description",
    "contact_email",
    "contact_phone",
    "website",
    "status",
    "verification_status",
    "notes",
}
LISTING_FIELDS = {
    "title",
    "category",
    "description",
    "price",
    "currency",
    "billing_model",
    "status",
    "visibility",
    "notes",
}
ORDER_FIELDS = {"quantity", "notes"}


def ensure_reference_id(doc, doctype, prefix):
    return _ensure_reference_id(doc, doctype, prefix, generator=generate_reference_id)


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


def _require_tenant(user):
    tenant = get_current_tenant_name(user)
    if not tenant:
        raise frappe.PermissionError
    return tenant


def _get_doc(doctype, name):
    if not doctype_exists(doctype):
        raise frappe.DoesNotExistError
    return frappe.get_doc(doctype, name)


def _has_field(doctype, fieldname):
    try:
        return frappe.get_meta(doctype).has_field(fieldname)
    except Exception:
        return True


def _set_fields(doc, payload, fields):
    for field in fields:
        if field in payload:
            setattr(doc, field, payload.get(field))


def _validate_value(value, allowed, message):
    if value and value not in allowed:
        raise frappe.ValidationError(message)


def _assert_same_tenant(user, doc):
    if _is_admin(user):
        return True

    tenant = _require_tenant(user)
    if getattr(doc, "tenant", None) != tenant:
        raise frappe.PermissionError
    return True


def _assert_vendor_manage_access(user, vendor):
    _require_user(user)
    if _is_admin(user):
        return True
    _assert_same_tenant(user, vendor)
    if vendor.owner_user == user:
        return True
    raise frappe.PermissionError


def _assert_vendor_view_access(user, vendor):
    _require_user(user)
    if _is_admin(user):
        return True
    _assert_same_tenant(user, vendor)
    if vendor.owner_user == user or vendor.status == "Active":
        return True
    raise frappe.PermissionError


def _assert_listing_manage_access(user, listing, vendor=None):
    _require_user(user)
    if _is_admin(user):
        return True
    _assert_same_tenant(user, listing)
    vendor = vendor or _get_doc(VENDOR_DOCTYPE, listing.vendor)
    if vendor.owner_user == user:
        return True
    raise frappe.PermissionError


def _assert_listing_view_access(user, listing):
    _require_user(user)
    if _is_admin(user):
        return True
    _assert_same_tenant(user, listing)
    if listing.owner_user == user:
        return True
    if listing.status == "Active" and listing.visibility in {"Tenant", "Public"}:
        return True
    raise frappe.PermissionError


def _assert_order_view_access(user, order):
    _require_user(user)
    if _is_admin(user):
        return True
    _assert_same_tenant(user, order)
    if order.buyer_user == user:
        return True
    vendor = _get_doc(VENDOR_DOCTYPE, order.vendor)
    if vendor.owner_user == user:
        return True
    raise frappe.PermissionError


def _audit(event_type, user, doc, message=None, metadata=None):
    return record_audit_event(
        event_type,
        actor=user,
        tenant=getattr(doc, "tenant", None),
        subject_doctype=getattr(doc, "doctype", None),
        subject_name=doc.name,
        workflow_state=getattr(doc, "status", None),
        message=message,
        metadata=metadata or {},
    )


def _notify(user, title, message, doc, trigger_source, *, priority="Normal", notification_type="Info"):
    if not user:
        return None

    route_key = "marketplace_enquiry" if getattr(doc, "doctype", None) == ORDER_DOCTYPE else "marketplace_listing"
    try:
        return create_notification(
            user=user,
            tenant=getattr(doc, "tenant", None),
            title=title,
            message=message,
            priority=priority,
            notification_type=notification_type,
            route=service_routes(route_key, doc.name)["portal_route"],
            related_doctype=getattr(doc, "doctype", None),
            related_name=doc.name,
            trigger_source=trigger_source,
            created_by_workflow="marketplace",
        )
    except Exception:
        frappe.log_error(frappe.get_traceback(), "RBP marketplace notification failed")
        return None


def _emit_notification_event(event_type, doc, message, context, *, customer_email=None):
    return safe_emit_event_notification(
        log_title="RBP marketplace notification hook failed",
        emit=emit_event_notification,
        event_type=event_type,
        user=None,
        tenant=getattr(doc, "tenant", None),
        customer_email=customer_email or getattr(doc, "owner_user", None),
        related_doctype=getattr(doc, "doctype", None),
        related_name=doc.name,
        message=message,
        context=context,
    )


def _serialize_vendor(doc):
    return {
        "name": doc.name,
        "reference_id": getattr(doc, "reference_id", None),
        "tenant": doc.tenant,
        "owner_user": doc.owner_user,
        "vendor_name": getattr(doc, "vendor_name", None),
        "description": getattr(doc, "description", None),
        "contact_email": getattr(doc, "contact_email", None),
        "contact_phone": getattr(doc, "contact_phone", None),
        "website": getattr(doc, "website", None),
        "status": getattr(doc, "status", None),
        "verification_status": getattr(doc, "verification_status", None),
        "notes": getattr(doc, "notes", None),
    }


def _serialize_listing(doc):
    return {
        "name": doc.name,
        "reference_id": getattr(doc, "reference_id", None),
        "tenant": doc.tenant,
        "vendor": doc.vendor,
        "owner_user": doc.owner_user,
        "title": getattr(doc, "title", None),
        "category": getattr(doc, "category", None),
        "description": getattr(doc, "description", None),
        "price": getattr(doc, "price", None),
        "currency": getattr(doc, "currency", None),
        "billing_model": getattr(doc, "billing_model", None),
        "status": getattr(doc, "status", None),
        "workflow_state": getattr(doc, "workflow_state", None),
        "visibility": getattr(doc, "visibility", None),
        "submitted_on": getattr(doc, "submitted_on", None),
        "source_channel": getattr(doc, "source_channel", None),
        "assigned_to": getattr(doc, "assigned_to", None),
        "reviewed_on": getattr(doc, "reviewed_on", None),
        "closed_on": getattr(doc, "closed_on", None),
        "notes": getattr(doc, "notes", None),
        **service_routes("marketplace_listing", doc.name),
    }


def _serialize_order(doc):
    return {
        "name": doc.name,
        "reference_id": getattr(doc, "reference_id", None),
        "tenant": doc.tenant,
        "listing": doc.listing,
        "vendor": doc.vendor,
        "buyer_user": doc.buyer_user,
        "owner_user": doc.buyer_user,
        "status": getattr(doc, "status", None),
        "workflow_state": getattr(doc, "workflow_state", None),
        "quantity": getattr(doc, "quantity", None),
        "total_amount": getattr(doc, "total_amount", None),
        "currency": getattr(doc, "currency", None),
        "requested_on": getattr(doc, "requested_on", None),
        "submitted_on": getattr(doc, "submitted_on", None),
        "source_channel": getattr(doc, "source_channel", None),
        "assigned_to": getattr(doc, "assigned_to", None),
        "reviewed_on": getattr(doc, "reviewed_on", None),
        "approved_on": getattr(doc, "approved_on", None),
        "fulfilled_on": getattr(doc, "fulfilled_on", None),
        "cancelled_on": getattr(doc, "cancelled_on", None),
        "closed_on": getattr(doc, "closed_on", None),
        "notes": getattr(doc, "notes", None),
        **service_routes("marketplace_enquiry", doc.name),
    }


def _validate_vendor_payload(payload):
    _validate_value(payload.get("status"), VENDOR_STATUSES, "Invalid marketplace vendor status.")
    _validate_value(
        payload.get("verification_status"),
        VERIFICATION_STATUSES,
        "Invalid marketplace vendor verification status.",
    )


def _validate_listing_payload(payload):
    _validate_value(payload.get("status"), LISTING_STATUSES, "Invalid marketplace listing status.")
    _validate_value(payload.get("visibility"), VISIBILITY_VALUES, "Invalid marketplace listing visibility.")
    _validate_value(payload.get("billing_model"), BILLING_MODELS, "Invalid marketplace listing billing model.")


def _visible_vendors(user, rows):
    if _is_admin(user):
        return rows
    tenant = _require_tenant(user)
    return [row for row in rows if row.get("tenant") == tenant and (row.get("owner_user") == user or row.get("status") == "Active")]


def _visible_listings(user, rows):
    if _is_admin(user):
        return rows
    tenant = _require_tenant(user)
    return [
        row
        for row in rows
        if row.get("tenant") == tenant
        and (
            row.get("owner_user") == user
            or (row.get("status") == "Active" and row.get("visibility") in {"Tenant", "Public"})
        )
    ]


def _calculate_total(price, quantity):
    price = Decimal(str(price or 0))
    quantity = int(quantity or 1)
    if quantity < 1:
        raise frappe.ValidationError("Quantity must be at least 1.")
    return price * Decimal(quantity)


def _set_order_status_dates(order, status):
    timestamp = now_datetime()
    if status in {"Approved", "In Progress"} and not getattr(order, "reviewed_on", None):
        order.reviewed_on = timestamp
    if status == "Approved" and not getattr(order, "approved_on", None):
        order.approved_on = timestamp
    if status == "Fulfilled" and not getattr(order, "fulfilled_on", None):
        order.fulfilled_on = timestamp
        order.closed_on = timestamp
    if status in {"Cancelled", "Rejected"} and not getattr(order, "cancelled_on", None):
        order.cancelled_on = timestamp
        order.closed_on = timestamp


def _set_listing_status_dates(listing, status):
    timestamp = now_datetime()
    if status in {"Submitted", "Under Review"} and not getattr(listing, "submitted_on", None):
        listing.submitted_on = timestamp
    if status in {"Under Review", "Active", "Rejected"} and not getattr(listing, "reviewed_on", None):
        listing.reviewed_on = timestamp
    if status in {"Archived", "Rejected"}:
        listing.closed_on = timestamp


def _admin_recipients():
    recipients = {"Administrator"}
    try:
        rows = frappe.get_all("Has Role", filters={"role": "System Manager"}, fields=["parent"])
        recipients.update(row.get("parent") for row in rows if row.get("parent"))
    except Exception:
        pass
    return sorted(recipients)


def _listing_context(doc, vendor=None):
    routes = service_routes("marketplace_listing", doc.name)
    return {
        "reference_id": getattr(doc, "reference_id", None) or doc.name,
        "service_name": "Marketplace Listing",
        "marketplace_item": getattr(doc, "title", None),
        "business_name": getattr(vendor, "vendor_name", None),
        "status": getattr(doc, "status", None),
        "portal_url": routes["portal_route"],
        "admin_url": routes["admin_route"],
    }


def _order_context(doc, listing=None, vendor=None):
    routes = service_routes("marketplace_enquiry", doc.name)
    return {
        "reference_id": getattr(doc, "reference_id", None) or doc.name,
        "service_name": "Marketplace Enquiry",
        "marketplace_item": getattr(listing, "title", None),
        "business_name": getattr(vendor, "vendor_name", None),
        "status": getattr(doc, "status", None),
        "portal_url": routes["portal_route"],
        "admin_url": routes["admin_route"],
    }


def create_vendor(user, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    tenant = _require_tenant(user)

    if not doctype_exists(VENDOR_DOCTYPE):
        raise frappe.DoesNotExistError

    _validate_vendor_payload(payload)
    doc = frappe.get_doc(
        {
            "doctype": VENDOR_DOCTYPE,
            "tenant": tenant,
            "owner_user": user,
            "status": "Draft",
            "verification_status": "Unverified",
        }
    )
    _set_fields(doc, payload, VENDOR_FIELDS)
    doc.insert(ignore_permissions=True)

    _notify(user, "Marketplace vendor created", "Your marketplace vendor profile was created.", doc, "marketplace.create_vendor")
    _audit("marketplace_vendor_created", user, doc, "Marketplace vendor created.")
    return _serialize_vendor(doc)


def update_vendor(user, vendor_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    doc = _get_doc(VENDOR_DOCTYPE, vendor_name)
    _assert_vendor_manage_access(user, doc)
    _validate_vendor_payload(payload)

    _set_fields(doc, payload, VENDOR_FIELDS)
    doc.save(ignore_permissions=True)

    _audit("marketplace_vendor_updated", user, doc, "Marketplace vendor updated.")
    return _serialize_vendor(doc)


def list_vendors(user, filters=None):
    user = _require_user(user)
    filters = _safe_payload(filters)
    if not doctype_exists(VENDOR_DOCTYPE):
        return {"vendors": [], "count": 0}

    query_filters = {}
    for field in ("status", "verification_status"):
        if filters.get(field):
            query_filters[field] = filters[field]
    if not _is_admin(user):
        query_filters["tenant"] = _require_tenant(user)

    rows = frappe.get_all(
        VENDOR_DOCTYPE,
        filters=query_filters,
        fields=[
            "name",
            "tenant",
            "owner_user",
            "vendor_name",
            "description",
            "contact_email",
            "contact_phone",
            "website",
            "status",
            "verification_status",
            "notes",
            "modified",
        ],
        order_by="modified desc",
    )
    rows = _visible_vendors(user, rows)
    return {"vendors": rows, "count": len(rows)}


def get_vendor(user, vendor_name):
    user = _require_user(user)
    doc = _get_doc(VENDOR_DOCTYPE, vendor_name)
    _assert_vendor_view_access(user, doc)
    return _serialize_vendor(doc)


def create_listing(user, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    tenant = _require_tenant(user)

    if not doctype_exists(LISTING_DOCTYPE):
        raise frappe.DoesNotExistError
    if not payload.get("vendor"):
        raise frappe.ValidationError("Vendor is required.")

    vendor = _get_doc(VENDOR_DOCTYPE, payload.get("vendor"))
    _assert_vendor_manage_access(user, vendor)
    if _is_admin(user):
        tenant = vendor.tenant
    elif vendor.tenant != tenant:
        raise frappe.PermissionError
    if vendor.status in {"Suspended", "Archived"}:
        raise frappe.ValidationError("Cannot create listings for this vendor.")

    _validate_listing_payload(payload)
    requested_status = payload.get("status")
    if not _is_admin(user) and requested_status and requested_status not in {"Draft", "Submitted", "Under Review"}:
        requested_status = "Under Review"
    status = requested_status or "Under Review"
    doc = frappe.get_doc(
        {
            "doctype": LISTING_DOCTYPE,
            "tenant": tenant,
            "vendor": vendor.name,
            "owner_user": vendor.owner_user,
            "status": status,
            "workflow_state": status,
            "visibility": "Private",
            "currency": payload.get("currency") or "AUD",
            "billing_model": "One-off",
            "source_channel": "portal",
        }
    )
    _set_fields(doc, payload, LISTING_FIELDS)
    doc.status = status
    doc.workflow_state = status
    doc.visibility = "Private" if status in {"Submitted", "Under Review"} else getattr(doc, "visibility", None)
    doc.source_channel = "portal"
    ensure_reference_id(doc, LISTING_DOCTYPE, "RBP-MKT")
    _set_listing_status_dates(doc, status)
    doc.insert(ignore_permissions=True)

    _notify(vendor.owner_user, "Marketplace listing submitted", "Your marketplace listing was submitted for review.", doc, "marketplace.create_listing")
    for recipient in _admin_recipients():
        _notify(
            recipient,
            "Marketplace listing submitted",
            f"{vendor.owner_user} submitted a marketplace listing.",
            doc,
            "marketplace.create_listing.admin",
            priority="High",
        )
    _emit_notification_event(
        "marketplace.listing_submitted",
        doc,
        "Your marketplace listing has been received.",
        _listing_context(doc, vendor),
        customer_email=vendor.owner_user,
    )
    _audit("marketplace_listing_created", user, doc, "Marketplace listing created.")
    return _serialize_listing(doc)


def update_listing(user, listing_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    doc = _get_doc(LISTING_DOCTYPE, listing_name)
    vendor = _get_doc(VENDOR_DOCTYPE, doc.vendor)
    _assert_listing_manage_access(user, doc, vendor)
    if not _is_admin(user) and vendor.tenant != doc.tenant:
        raise frappe.PermissionError
    _validate_listing_payload(payload)

    _set_fields(doc, payload, LISTING_FIELDS)
    doc.workflow_state = doc.status
    _set_listing_status_dates(doc, doc.status)
    doc.save(ignore_permissions=True)

    _audit("marketplace_listing_updated", user, doc, "Marketplace listing updated.")
    return _serialize_listing(doc)


def admin_update_listing_status(user, listing_name, status, payload=None):
    user = _require_user(user)
    if not _is_admin(user):
        raise frappe.PermissionError
    _validate_value(status, LISTING_STATUSES, "Invalid marketplace listing status.")

    payload = _safe_payload(payload)
    doc = _get_doc(LISTING_DOCTYPE, listing_name)
    vendor = _get_doc(VENDOR_DOCTYPE, doc.vendor)
    previous_status = getattr(doc, "status", None)

    _set_fields(doc, payload, {"assigned_to", "notes", "visibility"})
    doc.status = status
    doc.workflow_state = status
    _set_listing_status_dates(doc, status)
    doc.save(ignore_permissions=True)

    if status != previous_status:
        _notify(
            doc.owner_user,
            "Marketplace listing status changed",
            f"Your marketplace listing is now {status}.",
            doc,
            "marketplace.admin_update_listing_status",
        )
        context = _listing_context(doc, vendor)
        context["admin_note"] = payload.get("notes")
        _emit_notification_event(
            "admin.status_updated",
            doc,
            f"Your marketplace listing is now {status}.",
            context,
            customer_email=doc.owner_user,
        )

    _audit(
        "marketplace_listing_status_updated",
        user,
        doc,
        "Marketplace listing status updated.",
        {"from_status": previous_status, "to_status": status},
    )
    return _serialize_listing(doc)


def list_listings(user, filters=None):
    user = _require_user(user)
    filters = _safe_payload(filters)
    if not doctype_exists(LISTING_DOCTYPE):
        return {"listings": [], "count": 0}

    query_filters = {}
    for field in ("vendor", "status", "visibility", "category", "billing_model"):
        if filters.get(field):
            query_filters[field] = filters[field]
    if not _is_admin(user):
        query_filters["tenant"] = _require_tenant(user)

    rows = frappe.get_all(
        LISTING_DOCTYPE,
        filters=query_filters,
        fields=[
            "name",
            "reference_id",
            "tenant",
            "vendor",
            "owner_user",
            "title",
            "category",
            "description",
            "price",
            "currency",
            "billing_model",
            "status",
            "workflow_state",
            "visibility",
            "submitted_on",
            "source_channel",
            "assigned_to",
            "reviewed_on",
            "closed_on",
            "notes",
            "modified",
        ],
        order_by="modified desc",
    )
    rows = _visible_listings(user, rows)
    rows = [{**row, **service_routes("marketplace_listing", row.get("name"))} for row in rows]
    return {"listings": rows, "count": len(rows)}


def get_listing(user, listing_name):
    user = _require_user(user)
    doc = _get_doc(LISTING_DOCTYPE, listing_name)
    _assert_listing_view_access(user, doc)
    return _serialize_listing(doc)


def create_order(user, listing_name, payload):
    user = _require_user(user)
    payload = _safe_payload(payload)
    tenant = _require_tenant(user)

    if not doctype_exists(ORDER_DOCTYPE):
        raise frappe.DoesNotExistError

    listing = _get_doc(LISTING_DOCTYPE, listing_name)
    _assert_listing_view_access(user, listing)
    if not _is_admin(user) and listing.tenant != tenant:
        raise frappe.PermissionError
    if listing.status != "Active":
        raise frappe.ValidationError("Only active listings can be ordered.")
    if listing.visibility == "Private" and listing.owner_user != user and not _is_admin(user):
        raise frappe.PermissionError

    vendor = _get_doc(VENDOR_DOCTYPE, listing.vendor)
    if vendor.tenant != listing.tenant:
        raise frappe.PermissionError
    if vendor.status != "Active":
        raise frappe.ValidationError("Only active vendors can accept orders.")

    quantity = int(payload.get("quantity") or 1)
    total = _calculate_total(getattr(listing, "price", 0), quantity)
    doc = frappe.get_doc(
        {
            "doctype": ORDER_DOCTYPE,
            "tenant": listing.tenant,
            "listing": listing.name,
            "vendor": vendor.name,
            "buyer_user": user,
            "status": "Requested",
            "workflow_state": "Requested",
            "quantity": quantity,
            "total_amount": total,
            "currency": getattr(listing, "currency", None) or "AUD",
            "requested_on": now_datetime(),
            "submitted_on": now_datetime(),
            "source_channel": "portal",
        }
    )
    _set_fields(doc, payload, ORDER_FIELDS)
    ensure_reference_id(doc, ORDER_DOCTYPE, "RBP-MKT-ENQ")
    doc.insert(ignore_permissions=True)

    _notify(user, "Marketplace enquiry submitted", "Your marketplace enquiry has been submitted.", doc, "marketplace.create_order.customer")
    _notify(vendor.owner_user, "Marketplace enquiry received", "A marketplace enquiry was submitted.", doc, "marketplace.create_order.vendor", priority="High")
    for recipient in _admin_recipients():
        _notify(
            recipient,
            "Marketplace enquiry submitted",
            f"{user} submitted a marketplace enquiry.",
            doc,
            "marketplace.create_order.admin",
            priority="High",
        )
    _emit_notification_event(
        "marketplace.enquiry_submitted",
        doc,
        "Your marketplace enquiry has been received.",
        _order_context(doc, listing, vendor),
        customer_email=user,
    )
    _audit("marketplace_order_created", user, doc, "Marketplace order created.")
    return _serialize_order(doc)


def update_order_status(user, order_name, status, payload=None):
    user = _require_user(user)
    payload = _safe_payload(payload)
    _validate_value(status, ORDER_STATUSES, "Invalid marketplace order status.")

    order = _get_doc(ORDER_DOCTYPE, order_name)
    _assert_order_view_access(user, order)
    vendor = _get_doc(VENDOR_DOCTYPE, order.vendor)

    can_manage = _is_admin(user) or vendor.owner_user == user
    can_buyer_cancel = order.buyer_user == user and status == "Cancelled"
    if not can_manage and not can_buyer_cancel:
        raise frappe.PermissionError
    if not _is_admin(user):
        _assert_same_tenant(user, order)

    current_status = getattr(order, "status", None) or "Requested"
    if status != current_status and status not in ORDER_TRANSITIONS.get(current_status, set()):
        raise frappe.ValidationError("Invalid marketplace order status transition.")

    order.status = status
    order.workflow_state = status
    if "notes" in payload:
        order.notes = payload.get("notes")
    _set_order_status_dates(order, status)
    order.save(ignore_permissions=True)

    recipients = {order.buyer_user, vendor.owner_user}
    for recipient in recipients:
        _notify(
            recipient,
            "Marketplace order status changed",
            f"Marketplace order {order.name} is now {status}.",
            order,
            "marketplace.update_order_status",
        )
    _audit(
        "marketplace_order_status_updated",
        user,
        order,
        "Marketplace order status updated.",
        {"from_status": current_status, "to_status": status},
    )
    return _serialize_order(order)


def admin_update_enquiry_status(user, order_name, status, payload=None):
    user = _require_user(user)
    if not _is_admin(user):
        raise frappe.PermissionError
    payload = _safe_payload(payload)
    _validate_value(status, ORDER_STATUSES, "Invalid marketplace order status.")

    order = _get_doc(ORDER_DOCTYPE, order_name)
    listing = _get_doc(LISTING_DOCTYPE, order.listing)
    vendor = _get_doc(VENDOR_DOCTYPE, order.vendor)
    current_status = getattr(order, "status", None) or "Requested"
    if status != current_status and status not in ORDER_TRANSITIONS.get(current_status, set()):
        raise frappe.ValidationError("Invalid marketplace order status transition.")

    if "assigned_to" in payload:
        order.assigned_to = payload.get("assigned_to")
    if "notes" in payload:
        order.notes = payload.get("notes")
    order.status = status
    order.workflow_state = status
    _set_order_status_dates(order, status)
    order.save(ignore_permissions=True)

    if status != current_status:
        for recipient in {order.buyer_user, vendor.owner_user}:
            _notify(
                recipient,
                "Marketplace enquiry status changed",
                f"Marketplace enquiry {order.name} is now {status}.",
                order,
                "marketplace.admin_update_enquiry_status",
            )
        context = _order_context(order, listing, vendor)
        context["admin_note"] = payload.get("notes")
        _emit_notification_event(
            "admin.status_updated",
            order,
            f"Your marketplace enquiry is now {status}.",
            context,
            customer_email=order.buyer_user,
        )

    _audit(
        "marketplace_enquiry_status_updated",
        user,
        order,
        "Marketplace enquiry status updated.",
        {"from_status": current_status, "to_status": status},
    )
    return _serialize_order(order)


def list_my_orders(user, filters=None):
    user = _require_user(user)
    filters = _safe_payload(filters)
    if not doctype_exists(ORDER_DOCTYPE):
        return {"orders": [], "count": 0}

    query_filters = {}
    for field in ("status", "listing", "vendor"):
        if filters.get(field):
            query_filters[field] = filters[field]
    if not _is_admin(user):
        query_filters["tenant"] = _require_tenant(user)

    rows = frappe.get_all(
        ORDER_DOCTYPE,
        filters=query_filters,
        fields=[
            "name",
            "reference_id",
            "tenant",
            "listing",
            "vendor",
            "buyer_user",
            "status",
            "workflow_state",
            "quantity",
            "total_amount",
            "currency",
            "requested_on",
            "submitted_on",
            "source_channel",
            "assigned_to",
            "reviewed_on",
            "approved_on",
            "fulfilled_on",
            "cancelled_on",
            "closed_on",
            "notes",
            "modified",
        ],
        order_by="modified desc",
    )
    if not _is_admin(user):
        vendor_names = {
            row.get("name")
            for row in frappe.get_all(VENDOR_DOCTYPE, filters={"tenant": _require_tenant(user), "owner_user": user}, fields=["name"])
        }
        rows = [
            row
            for row in rows
            if row.get("buyer_user") == user or row.get("vendor") in vendor_names
        ]
    rows = [{**row, "owner_user": row.get("buyer_user"), **service_routes("marketplace_enquiry", row.get("name"))} for row in rows]
    return {"orders": rows, "count": len(rows)}


def get_order(user, order_name):
    user = _require_user(user)
    doc = _get_doc(ORDER_DOCTYPE, order_name)
    _assert_order_view_access(user, doc)
    return _serialize_order(doc)
