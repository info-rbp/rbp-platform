"""Connectivity APIs."""

import json

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services import connectivity as service


def _payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload or "{}")
    return dict(payload)


@frappe.whitelist()
def create_request(payload=None):
    user = require_login()
    return service.create_request(user, _payload(payload))


@frappe.whitelist()
def create_order(payload=None):
    """Compatibility alias for portal NBN order submission."""
    return create_request(payload)


@frappe.whitelist()
def update_draft_request(request_name, payload=None):
    user = require_login()
    return service.update_draft_request(user, request_name, _payload(payload))


@frappe.whitelist()
def submit_request(request_name):
    user = require_login()
    return service.submit_request(user, request_name)


@frappe.whitelist()
def list_my_requests(filters=None):
    user = require_login()
    return service.list_my_requests(user, _payload(filters))


@frappe.whitelist()
def list_my_orders(filters=None):
    return list_my_requests(filters)


@frappe.whitelist()
def get_request(request_name):
    user = require_login()
    return service.get_request(user, request_name)


@frappe.whitelist()
def get_order(order_name):
    return get_request(order_name)


@frappe.whitelist()
def admin_assign_request(request_name, assigned_to):
    user = require_system_manager()
    return service.admin_assign_request(user, request_name, assigned_to)


@frappe.whitelist()
def admin_update_status(request_name, status, payload=None):
    user = require_system_manager()
    return service.admin_update_status(user, request_name, status, _payload(payload))


@frappe.whitelist()
def create_provider(payload=None):
    user = require_system_manager()
    return service.create_provider(user, _payload(payload))


@frappe.whitelist()
def update_provider(provider_name, payload=None):
    user = require_system_manager()
    return service.update_provider(user, provider_name, _payload(payload))


@frappe.whitelist()
def list_providers(filters=None):
    user = require_login()
    return service.list_providers(user, _payload(filters))


@frappe.whitelist()
def create_quote(request_name, payload=None):
    user = require_login()
    return service.create_quote(user, request_name, _payload(payload))


@frappe.whitelist()
def update_quote(quote_name, payload=None):
    user = require_login()
    return service.update_quote(user, quote_name, _payload(payload))


@frappe.whitelist()
def accept_quote(quote_name):
    user = require_login()
    return service.accept_quote(user, quote_name)
