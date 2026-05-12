"""Admin-managed Application catalogue services."""

from __future__ import annotations

import json
import re
from typing import Any

import frappe
from frappe.utils import now_datetime

from rbp_app.permissions import require_login
from rbp_app.services.audit import record_audit_event
from rbp_app.services.notifications import create_notification
from rbp_app.services.tenancy import get_current_tenant_name
from rbp_app.services.environment import (
    is_application_interest_enabled as runtime_is_application_interest_enabled,
    is_application_provisioning_enabled as runtime_is_application_provisioning_enabled,
)


APPLICATION_STATUSES = {
    "draft",
    "internal",
    "coming_soon",
    "register_interest",
    "qa_preview",
    "available_later",
    "disabled",
}

PUBLIC_SAFE_APPLICATION_STATUSES = {
    "coming_soon",
    "register_interest",
    "available_later",
}

PORTAL_SAFE_APPLICATION_STATUSES = {
    "coming_soon",
    "register_interest",
    "qa_preview",
    "available_later",
}

APPLICATION_VISIBILITIES = {
    "public",
    "portal",
    "admin",
    "hidden",
}

APPLICATION_PROVIDERS = {
    "frappe",
    "external",
    "manual",
    "other",
}

INTEREST_STATUSES = {
    "new",
    "reviewed",
    "contacted",
    "converted",
    "closed",
}

INTEREST_SOURCE_CHANNELS = {
    "public_site",
    "portal",
    "admin",
    "import",
    "api",
}

PROVISIONING_STATUSES = {
    "requested",
    "under_review",
    "approved",
    "provisioning",
    "provisioned",
    "failed",
    "cancelled",
}

PUBLIC_INTEREST_STATUSES = {
    "coming_soon",
    "register_interest",
    "qa_preview",
    "available_later",
}

APPLICATION_ADMIN_ROLES = {
    "System Manager",
    "RBP Admin",
    "RBP Operations Manager",
}

APPLICATION_ADMIN_FIELDS = (
    "name",
    "application_name",
    "application_key",
    "category",
    "description",
    "short_description",
    "status",
    "visibility",
    "provider",
    "installed_app_key",
    "icon",
    "admin_notes",
    "public_summary",
    "portal_summary",
    "sort_order",
    "requires_subscription",
    "requires_manual_approval",
    "provisioning_enabled",
    "interest_enabled",
    "archived",
    "archived_on",
    "archived_by",
    "created_by_admin",
    "updated_by_admin",
    "creation",
    "modified",
)

APPLICATION_PUBLIC_FIELDS = (
    "name",
    "application_name",
    "application_key",
    "category",
    "status",
    "short_description",
    "public_summary",
    "icon",
    "interest_enabled",
    "sort_order",
)

APPLICATION_PORTAL_FIELDS = APPLICATION_PUBLIC_FIELDS + (
    "portal_summary",
    "requires_subscription",
    "requires_manual_approval",
)

INTEREST_ADMIN_FIELDS = (
    "name",
    "application",
    "tenant",
    "user",
    "business_name",
    "contact_name",
    "email",
    "phone",
    "interest_notes",
    "status",
    "source_channel",
    "created_on",
    "reviewed_by",
    "reviewed_on",
    "internal_notes",
)

APPLICATION_ALLOWED_UPDATE_FIELDS = {
    "application_name",
    "application_key",
    "category",
    "description",
    "short_description",
    "status",
    "visibility",
    "provider",
    "installed_app_key",
    "icon",
    "admin_notes",
    "public_summary",
    "portal_summary",
    "sort_order",
    "requires_subscription",
    "requires_manual_approval",
    "provisioning_enabled",
    "interest_enabled",
    "archived",
}


def normalize_key(value: str) -> str:
    """Normalize a human value into an rbp-safe slug key."""

    value = (value or "").strip().lower()
    value = re.sub(r"[^a-z0-9]+", "_", value)
    value = re.sub(r"_+", "_", value).strip("_")
    return value


def is_application_provisioning_enabled() -> bool:
    """Return the centralized server-side provisioning flag."""

    return runtime_is_application_provisioning_enabled()


def get_current_user() -> str:
    return getattr(getattr(frappe, "session", None), "user", None) or "Guest"


def is_admin_user(user: str | None = None) -> bool:
    user = user or get_current_user()
    if user in {"Administrator", "System Manager"}:
        return True

    try:
        roles = set(frappe.get_roles(user) or [])
    except Exception:
        roles = set()

    return bool(roles.intersection(APPLICATION_ADMIN_ROLES))


def get_current_tenant() -> str | None:
    try:
        return get_current_tenant_name()
    except Exception:
        return None


def require_admin() -> str:
    user = get_current_user()
    if not is_admin_user(user):
        frappe.throw("Administrator access is required.", frappe.PermissionError)
    return user


def require_authenticated_user() -> str:
    return require_login()


def coerce_payload(payload: Any = None, **kwargs: Any) -> dict[str, Any]:
    if payload is None:
        return {key: value for key, value in kwargs.items() if value is not None}
    if isinstance(payload, str):
        payload = json.loads(payload or "{}")
    if not isinstance(payload, dict):
        frappe.throw("Payload must be a JSON object.", frappe.ValidationError)
    payload = dict(payload)
    payload.update({key: value for key, value in kwargs.items() if value is not None})
    return payload


def validate_application_status(status: str | None) -> None:
    if status and status not in APPLICATION_STATUSES:
        frappe.throw("Invalid application status: {0}".format(status), frappe.ValidationError)


def validate_application_visibility(visibility: str | None) -> None:
    if visibility and visibility not in APPLICATION_VISIBILITIES:
        frappe.throw("Invalid application visibility: {0}".format(visibility), frappe.ValidationError)


def validate_application_provider(provider: str | None) -> None:
    if provider and provider not in APPLICATION_PROVIDERS:
        frappe.throw("Invalid application provider: {0}".format(provider), frappe.ValidationError)


def validate_interest_status(status: str | None) -> None:
    if status and status not in INTEREST_STATUSES:
        frappe.throw("Invalid interest status: {0}".format(status), frappe.ValidationError)


def validate_source_channel(source_channel: str | None) -> None:
    if source_channel and source_channel not in INTEREST_SOURCE_CHANNELS:
        frappe.throw("Invalid source channel: {0}".format(source_channel), frappe.ValidationError)


def validate_provisioning_status(status: str | None) -> None:
    if status and status not in PROVISIONING_STATUSES:
        frappe.throw("Invalid provisioning status: {0}".format(status), frappe.ValidationError)


def validate_email(email: str | None) -> str:
    email = (email or "").strip()
    if not email:
        frappe.throw("Email is required.", frappe.ValidationError)
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        frappe.throw("Enter a valid email address.", frappe.ValidationError)
    return email


def get_application_or_throw(name_or_key: str):
    if not name_or_key:
        frappe.throw("Application is required.", frappe.ValidationError)

    if frappe.db.exists("RBP Application", name_or_key):
        return frappe.get_doc("RBP Application", name_or_key)

    name = frappe.db.get_value("RBP Application", {"application_key": name_or_key}, "name")
    if not name:
        frappe.throw("Application not found.", frappe.DoesNotExistError)
    return frappe.get_doc("RBP Application", name)


def serialize_application(doc, audience: str) -> dict[str, Any]:
    field_map = {
        "admin": APPLICATION_ADMIN_FIELDS,
        "public": APPLICATION_PUBLIC_FIELDS,
        "portal": APPLICATION_PORTAL_FIELDS,
    }
    fields = field_map.get(audience, APPLICATION_PUBLIC_FIELDS)
    data = {field: getattr(doc, field, None) for field in fields}
    if audience in {"public", "portal"}:
        data["provisioning_enabled"] = False
    return data


def serialize_interest(doc) -> dict[str, Any]:
    data = {field: getattr(doc, field, None) for field in INTEREST_ADMIN_FIELDS}
    if data.get("application"):
        app_values = frappe.db.get_value(
            "RBP Application",
            data["application"],
            ["application_name", "application_key"],
            as_dict=True,
        )
        if app_values:
            data["application_name"] = app_values.get("application_name")
            data["application_key"] = app_values.get("application_key")
    return data


def _as_int(value: Any, default: int = 0) -> int:
    if value in (None, ""):
        return default
    return int(value)


def _application_filters(filters: dict[str, Any] | None, admin: bool) -> tuple[list[list[Any]], list[list[Any]]]:
    filters = filters or {}
    query_filters: list[list[Any]] = []
    or_filters: list[list[Any]] = []

    for field in ("status", "visibility", "category", "provider"):
        if filters.get(field):
            query_filters.append(["RBP Application", field, "=", filters[field]])

    if "archived" in filters and filters.get("archived") not in (None, ""):
        query_filters.append(["RBP Application", "archived", "=", _as_int(filters.get("archived"))])
    elif not admin:
        query_filters.append(["RBP Application", "archived", "=", 0])

    query = (filters.get("q") or filters.get("query") or filters.get("search") or "").strip()
    if query:
        like = f"%{query}%"
        or_filters.extend(
            [
                ["RBP Application", "application_name", "like", like],
                ["RBP Application", "application_key", "like", like],
                ["RBP Application", "short_description", "like", like],
            ]
        )

    return query_filters, or_filters


def admin_list_applications(filters=None, limit_start=0, limit_page_length=50):
    require_admin()
    filters = coerce_payload(filters) if isinstance(filters, str) else (filters or {})
    query_filters, or_filters = _application_filters(filters, admin=True)
    rows = frappe.get_all(
        "RBP Application",
        filters=query_filters,
        or_filters=or_filters or None,
        fields=list(APPLICATION_ADMIN_FIELDS),
        order_by="sort_order asc, modified desc",
        limit_start=_as_int(limit_start),
        limit_page_length=_as_int(limit_page_length, 50),
    )
    return {"applications": rows}


def admin_get_application(name_or_key):
    require_admin()
    return serialize_application(get_application_or_throw(name_or_key), "admin")


def _prepare_application_payload(payload: dict[str, Any]) -> dict[str, Any]:
    payload = dict(payload)
    if payload.get("application_key"):
        payload["application_key"] = normalize_key(payload["application_key"])
    elif payload.get("application_name"):
        payload["application_key"] = normalize_key(payload["application_name"])

    validate_application_status(payload.get("status"))
    validate_application_visibility(payload.get("visibility"))
    validate_application_provider(payload.get("provider"))

    if payload.get("provisioning_enabled") and not is_application_provisioning_enabled():
        payload["provisioning_enabled"] = 0

    return payload


def admin_create_application(payload):
    user = require_admin()
    payload = _prepare_application_payload(coerce_payload(payload))
    payload["doctype"] = "RBP Application"
    payload["provisioning_enabled"] = 1 if is_application_provisioning_enabled() and payload.get("provisioning_enabled") else 0
    doc = frappe.get_doc(payload)
    doc.insert(ignore_permissions=True)

    record_audit_event(
        "application_created",
        actor=user,
        subject_doctype="RBP Application",
        subject_name=doc.name,
        message=f"Application created: {doc.application_name}",
    )
    return serialize_application(doc, "admin")


def admin_update_application(name_or_key, payload):
    user = require_admin()
    doc = get_application_or_throw(name_or_key)
    payload = _prepare_application_payload(coerce_payload(payload))

    for field, value in payload.items():
        if field in APPLICATION_ALLOWED_UPDATE_FIELDS:
            setattr(doc, field, value)

    if getattr(doc, "provisioning_enabled", 0) and not is_application_provisioning_enabled():
        doc.provisioning_enabled = 0

    doc.save(ignore_permissions=True)
    record_audit_event(
        "application_updated",
        actor=user,
        subject_doctype="RBP Application",
        subject_name=doc.name,
        message=f"Application updated: {doc.application_name}",
    )
    return serialize_application(doc, "admin")


def admin_archive_application(name_or_key):
    user = require_admin()
    doc = get_application_or_throw(name_or_key)
    doc.archived = 1
    doc.status = "disabled"
    doc.visibility = "hidden"
    doc.provisioning_enabled = 0
    doc.archived_on = now_datetime()
    doc.archived_by = user
    doc.save(ignore_permissions=True)
    record_audit_event(
        "application_archived",
        actor=user,
        subject_doctype="RBP Application",
        subject_name=doc.name,
        message=f"Application archived: {doc.application_name}",
    )
    return serialize_application(doc, "admin")


def list_public_applications(filters=None):
    filters = coerce_payload(filters) if isinstance(filters, str) else (filters or {})
    query_filters, or_filters = _application_filters(filters, admin=False)
    query_filters.extend(
        [
            ["RBP Application", "visibility", "=", "public"],
            ["RBP Application", "status", "in", sorted(PUBLIC_SAFE_APPLICATION_STATUSES)],
        ]
    )
    rows = frappe.get_all(
        "RBP Application",
        filters=query_filters,
        or_filters=or_filters or None,
        fields=list(APPLICATION_PUBLIC_FIELDS),
        order_by="sort_order asc, modified desc",
    )
    for row in rows:
        row["provisioning_enabled"] = False
    return {"applications": rows}


def list_portal_applications(filters=None):
    require_authenticated_user()
    filters = coerce_payload(filters) if isinstance(filters, str) else (filters or {})
    query_filters, or_filters = _application_filters(filters, admin=False)
    query_filters.extend(
        [
            ["RBP Application", "visibility", "in", ["public", "portal"]],
            ["RBP Application", "status", "in", sorted(PORTAL_SAFE_APPLICATION_STATUSES)],
        ]
    )
    rows = frappe.get_all(
        "RBP Application",
        filters=query_filters,
        or_filters=or_filters or None,
        fields=list(APPLICATION_PORTAL_FIELDS),
        order_by="sort_order asc, modified desc",
    )
    for row in rows:
        row["provisioning_enabled"] = False
    return {"applications": rows}


def _assert_interest_allowed(application, source_channel: str) -> None:
    admin_source = source_channel in {"admin", "import"} and is_admin_user()
    if not runtime_is_application_interest_enabled() and not admin_source:
        frappe.throw("Application interest registration is disabled.", frappe.PermissionError)
    if getattr(application, "archived", 0):
        frappe.throw("Interest is not available for archived applications.", frappe.PermissionError)
    if getattr(application, "status", None) == "disabled":
        frappe.throw("Interest is not available for disabled applications.", frappe.PermissionError)
    if not getattr(application, "interest_enabled", 0):
        frappe.throw("Interest registration is disabled for this application.", frappe.PermissionError)
    if getattr(application, "status", None) not in PUBLIC_INTEREST_STATUSES:
        frappe.throw("Interest registration is not available for this application.", frappe.PermissionError)
    if getattr(application, "visibility", None) not in {"public", "portal"} and not admin_source:
        frappe.throw("Interest registration is not available for this application.", frappe.PermissionError)


def _update_existing_interest(existing, payload):
    changed = False
    for field in ("business_name", "contact_name", "phone"):
        if payload.get(field) and not getattr(existing, field, None):
            setattr(existing, field, payload[field])
            changed = True
    if payload.get("interest_notes"):
        existing.interest_notes = payload["interest_notes"]
        changed = True
    if changed:
        existing.save(ignore_permissions=True)
    return existing


def _notify_admins(title: str, message: str, related_doctype: str, related_name: str) -> None:
    try:
        users = frappe.get_all(
            "Has Role",
            filters={"role": "System Manager", "parenttype": "User"},
            pluck="parent",
        ) or ["Administrator"]
    except Exception:
        users = ["Administrator"]

    for user in set(users):
        create_notification(
            user=user,
            title=title,
            message=message,
            notification_type="Info",
            priority="Normal",
            related_doctype=related_doctype,
            related_name=related_name,
            trigger_source="applications",
        )


def register_application_interest(payload):
    payload = coerce_payload(payload)
    application_ref = payload.get("application") or payload.get("application_key")
    application = get_application_or_throw(application_ref)
    source_channel = payload.get("source_channel") or ("portal" if get_current_user() != "Guest" else "public_site")
    validate_source_channel(source_channel)
    _assert_interest_allowed(application, source_channel)
    email = validate_email(payload.get("email"))

    existing_names = frappe.get_all(
        "RBP Application Interest",
        filters={"application": application.name, "email": email, "status": ["!=", "closed"]},
        pluck="name",
        limit_page_length=1,
    )

    existing = bool(existing_names)
    if existing_names:
        doc = frappe.get_doc("RBP Application Interest", existing_names[0])
        doc = _update_existing_interest(doc, payload)
    else:
        user = get_current_user()
        doc = frappe.get_doc(
            {
                "doctype": "RBP Application Interest",
                "application": application.name,
                "tenant": get_current_tenant(),
                "user": None if user == "Guest" else user,
                "business_name": payload.get("business_name"),
                "contact_name": payload.get("contact_name"),
                "email": email,
                "phone": payload.get("phone"),
                "interest_notes": payload.get("interest_notes"),
                "source_channel": source_channel,
            }
        )
        doc.insert(ignore_permissions=True)

    record_audit_event(
        "application_interest_registered",
        actor=get_current_user(),
        tenant=getattr(doc, "tenant", None),
        subject_doctype="RBP Application Interest",
        subject_name=doc.name,
        message=f"Application interest registered for {application.application_name}",
    )
    _notify_admins(
        "Application interest registered",
        f"{email} registered interest in {application.application_name}.",
        "RBP Application Interest",
        doc.name,
    )

    return {
        "interest_id": doc.name,
        "application_key": application.application_key,
        "application_name": application.application_name,
        "status": doc.status,
        "existing": existing,
    }


def _interest_filters(filters: dict[str, Any] | None) -> tuple[list[list[Any]], list[list[Any]]]:
    filters = filters or {}
    query_filters: list[list[Any]] = []
    or_filters: list[list[Any]] = []

    for field in ("application", "status", "email", "source_channel"):
        if filters.get(field):
            query_filters.append(["RBP Application Interest", field, "=", filters[field]])

    if filters.get("application_key"):
        app_name = frappe.db.get_value("RBP Application", {"application_key": filters["application_key"]}, "name")
        if app_name:
            query_filters.append(["RBP Application Interest", "application", "=", app_name])
        else:
            query_filters.append(["RBP Application Interest", "application", "=", "__missing__"])

    query = (filters.get("q") or filters.get("query") or filters.get("search") or "").strip()
    if query:
        like = f"%{query}%"
        or_filters.extend(
            [
                ["RBP Application Interest", "business_name", "like", like],
                ["RBP Application Interest", "contact_name", "like", like],
                ["RBP Application Interest", "email", "like", like],
            ]
        )

    return query_filters, or_filters


def admin_list_application_interest(filters=None, limit_start=0, limit_page_length=50):
    require_admin()
    filters = coerce_payload(filters) if isinstance(filters, str) else (filters or {})
    query_filters, or_filters = _interest_filters(filters)
    rows = frappe.get_all(
        "RBP Application Interest",
        filters=query_filters,
        or_filters=or_filters or None,
        fields=list(INTEREST_ADMIN_FIELDS),
        order_by="created_on desc",
        limit_start=_as_int(limit_start),
        limit_page_length=_as_int(limit_page_length, 50),
    )
    for row in rows:
        if row.get("application"):
            app_values = frappe.db.get_value(
                "RBP Application",
                row["application"],
                ["application_name", "application_key"],
                as_dict=True,
            )
            if app_values:
                row["application_name"] = app_values.get("application_name")
                row["application_key"] = app_values.get("application_key")
    return {"interests": rows}


def admin_update_application_interest(interest_name, payload):
    user = require_admin()
    payload = coerce_payload(payload)
    doc = frappe.get_doc("RBP Application Interest", interest_name)

    if payload.get("status"):
        validate_interest_status(payload["status"])
        doc.status = payload["status"]
    if "internal_notes" in payload:
        doc.internal_notes = payload.get("internal_notes")
    if payload.get("reviewed_by"):
        doc.reviewed_by = payload["reviewed_by"]
    if payload.get("reviewed_on"):
        doc.reviewed_on = payload["reviewed_on"]

    if getattr(doc, "status", None) != "new" and not getattr(doc, "reviewed_by", None):
        doc.reviewed_by = user
    if getattr(doc, "status", None) != "new" and not getattr(doc, "reviewed_on", None):
        doc.reviewed_on = now_datetime()

    doc.save(ignore_permissions=True)
    record_audit_event(
        "application_interest_updated",
        actor=user,
        tenant=getattr(doc, "tenant", None),
        subject_doctype="RBP Application Interest",
        subject_name=doc.name,
        message=f"Application interest updated: {doc.name}",
    )
    if getattr(doc, "user", None):
        create_notification(
            user=doc.user,
            title="Application interest updated",
            message="Your application interest status has been updated.",
            notification_type="Info",
            related_doctype="RBP Application Interest",
            related_name=doc.name,
            trigger_source="applications",
        )
    return serialize_interest(doc)
