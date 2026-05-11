"""Audit trail APIs for admin and member-visible timelines."""

import json

import frappe

from rbp_app.permissions import require_admin_user, require_login
from rbp_app.services import audit as service


def _payload(payload):
	if payload is None:
		return {}
	if isinstance(payload, str):
		return json.loads(payload or "{}")
	return dict(payload)


@frappe.whitelist()
def list_audit_logs(filters=None):
	user = require_admin_user()
	return service.list_audit_logs(_payload(filters), user=user)


@frappe.whitelist()
def get_audit_log(name):
	user = require_admin_user()
	return service.get_audit_log(name, user=user)


@frappe.whitelist()
def list_record_audit_trail(doctype, name):
	user = require_admin_user()
	return service.list_record_audit_trail(doctype, name, user=user)


@frappe.whitelist()
def list_my_record_timeline(doctype, name):
	user = require_login()
	return service.list_my_record_timeline(doctype, name, user=user)
