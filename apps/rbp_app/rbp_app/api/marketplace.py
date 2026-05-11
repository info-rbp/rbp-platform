"""Marketplace APIs."""

import json

import frappe

from rbp_app.permissions import require_login, require_system_manager
from rbp_app.services import marketplace as service
from rbp_app.services.admin_workflows import perform_domain_action


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
def update_order_status(order_name, status, payload=None):
    user = require_login()
    return service.update_order_status(user, order_name, status, _payload(payload))


@frappe.whitelist()
def list_my_orders(filters=None):
    user = require_login()
    return service.list_my_orders(user, _payload(filters))


@frappe.whitelist()
def get_order(order_name):
    user = require_login()
    return service.get_order(user, order_name)


def _admin_listing_action(action, listing_name, **kwargs):
    user = require_system_manager()
    return perform_domain_action(user, "marketplace", service.LISTING_DOCTYPE, listing_name, action, **kwargs)


def _admin_order_action(action, order_name, **kwargs):
    user = require_system_manager()
    return perform_domain_action(user, "marketplace", service.ORDER_DOCTYPE, order_name, action, **kwargs)


@frappe.whitelist()
def admin_start_review(listing_name, notes=None):
    return _admin_listing_action("start_review", listing_name, notes=notes)


@frappe.whitelist()
def admin_request_more_information(listing_name, notes):
    return _admin_listing_action("request_more_information", listing_name, notes=notes)


@frappe.whitelist()
def admin_publish(listing_name, notes=None):
    return _admin_listing_action("publish", listing_name, notes=notes)


@frappe.whitelist()
def admin_reject(listing_name, notes):
    return _admin_listing_action("reject", listing_name, notes=notes)


@frappe.whitelist()
def admin_archive(listing_name, notes=None):
    return _admin_listing_action("archive", listing_name, notes=notes)


@frappe.whitelist()
def admin_mark_order_paid(order_name, notes=None):
    return _admin_order_action("approve", order_name, notes=notes)


@frappe.whitelist()
def admin_mark_order_completed(order_name, notes=None):
    return _admin_order_action("mark_completed", order_name, notes=notes)


@frappe.whitelist()
def admin_cancel_order(order_name, notes=None):
    return _admin_order_action("cancel", order_name, notes=notes)
