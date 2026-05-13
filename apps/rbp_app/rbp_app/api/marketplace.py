"""Marketplace APIs."""

import json

import frappe

from rbp_app.permissions import require_login
from rbp_app.services import marketplace as service


def _payload(payload):
    if payload is None:
        return {}
    if isinstance(payload, str):
        return json.loads(payload or "{}")
    return dict(payload)


@frappe.whitelist()
def create_vendor(payload=None):
    user = require_login()
    return service.create_vendor(user, _payload(payload))


@frappe.whitelist()
def update_vendor(vendor_name, payload=None):
    user = require_login()
    return service.update_vendor(user, vendor_name, _payload(payload))


@frappe.whitelist()
def list_vendors(filters=None):
    user = require_login()
    return service.list_vendors(user, _payload(filters))


@frappe.whitelist()
def get_vendor(vendor_name):
    user = require_login()
    return service.get_vendor(user, vendor_name)


@frappe.whitelist()
def create_listing(payload=None):
    user = require_login()
    return service.create_listing(user, _payload(payload))


@frappe.whitelist()
def update_listing(listing_name, payload=None):
    user = require_login()
    return service.update_listing(user, listing_name, _payload(payload))


@frappe.whitelist()
def list_listings(filters=None):
    user = require_login()
    return service.list_listings(user, _payload(filters))


@frappe.whitelist()
def get_listing(listing_name):
    user = require_login()
    return service.get_listing(user, listing_name)


@frappe.whitelist()
def create_order(listing_name, payload=None):
    user = require_login()
    return service.create_order(user, listing_name, _payload(payload))


@frappe.whitelist()
def create_enquiry(payload=None):
    data = _payload(payload)
    listing_name = data.pop("listing", None) or data.pop("listing_name", None)
    if not listing_name:
        raise frappe.ValidationError("listing is required")
    return service.create_order(require_login(), listing_name, data)


@frappe.whitelist()
def update_order_status(order_name, status, payload=None):
    user = require_login()
    return service.update_order_status(user, order_name, status, _payload(payload))


@frappe.whitelist()
def admin_update_listing_status(listing_name, status, payload=None):
    data = _payload(payload)
    data["status"] = status
    return update_listing(listing_name, data)


@frappe.whitelist()
def admin_update_enquiry_status(enquiry_name, status, payload=None):
    return update_order_status(enquiry_name, status, payload)


@frappe.whitelist()
def list_my_orders(filters=None):
    user = require_login()
    return service.list_my_orders(user, _payload(filters))


@frappe.whitelist()
def get_order(order_name):
    user = require_login()
    return service.get_order(user, order_name)
