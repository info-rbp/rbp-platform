"""Member portal service hub APIs."""

import json

import frappe

from rbp_app.permissions import require_login
from rbp_app.services.portal import (
    create_service_request_router as create_service_request_router_service,
    get_service_record as get_service_record_service,
    list_my_services as list_my_services_service,
)


def _payload(value):
    if value is None:
        return {}
    if isinstance(value, str):
        return json.loads(value or "{}")
    return dict(value)


@frappe.whitelist()
def list_my_services(filters=None):
    """Return live tenant-aware member service records."""

    user = require_login()
    return list_my_services_service(user, _payload(filters))


@frappe.whitelist()
def get_service_record(service_type, name=None):
    """Return a single normalized portal service record."""

    user = require_login()
    return get_service_record_service(user, service_type, name)


@frappe.whitelist()
def create_service_request_router(service_type, payload=None):
    """Create a domain service request through the service hub."""

    user = require_login()
    return create_service_request_router_service(user, service_type, _payload(payload))
