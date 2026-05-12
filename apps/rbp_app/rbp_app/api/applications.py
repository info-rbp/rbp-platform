"""Whitelisted Application catalogue APIs."""

from __future__ import annotations

from typing import Any

import frappe

from rbp_app.services import applications as application_service


def _payload(payload: Any = None, **kwargs: Any) -> dict[str, Any]:
    return application_service.coerce_payload(payload, **kwargs)


@frappe.whitelist()
def admin_list_applications(filters=None, limit_start=0, limit_page_length=50):
    return application_service.admin_list_applications(filters, limit_start, limit_page_length)


@frappe.whitelist()
def admin_get_application(name_or_key=None, application=None, application_key=None):
    return application_service.admin_get_application(name_or_key or application or application_key)


@frappe.whitelist()
def admin_create_application(payload=None, **kwargs):
    return application_service.admin_create_application(_payload(payload, **kwargs))


@frappe.whitelist()
def admin_update_application(name_or_key=None, payload=None, application=None, application_key=None, **kwargs):
    return application_service.admin_update_application(
        name_or_key or application or application_key,
        _payload(payload, **kwargs),
    )


@frappe.whitelist()
def admin_archive_application(name_or_key=None, application=None, application_key=None):
    return application_service.admin_archive_application(name_or_key or application or application_key)


@frappe.whitelist(allow_guest=True)
def list_public_applications(filters=None):
    return application_service.list_public_applications(filters)


@frappe.whitelist()
def list_portal_applications(filters=None):
    return application_service.list_portal_applications(filters)


@frappe.whitelist(allow_guest=True)
def register_application_interest(payload=None, **kwargs):
    return application_service.register_application_interest(_payload(payload, **kwargs))


@frappe.whitelist()
def admin_list_application_interest(filters=None, limit_start=0, limit_page_length=50):
    return application_service.admin_list_application_interest(filters, limit_start, limit_page_length)


@frappe.whitelist()
def admin_update_application_interest(interest_name=None, payload=None, **kwargs):
    return application_service.admin_update_application_interest(
        interest_name,
        _payload(payload, **kwargs),
    )
