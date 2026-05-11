"""Production admin APIs for the RBP command centre."""

import json

import frappe

from rbp_app.permissions import require_admin_user
from rbp_app.services.admin_dashboard import get_dashboard as get_dashboard_service
from rbp_app.services.admin_workflows import perform_admin_action


def _payload(payload):
	if payload is None:
		return {}
	if isinstance(payload, str):
		return json.loads(payload or "{}")
	return dict(payload)


@frappe.whitelist()
def get_dashboard():
	user = require_admin_user()
	return get_dashboard_service(user=user)


@frappe.whitelist()
def perform_action(payload=None):
	user = require_admin_user()
	return perform_admin_action(user, _payload(payload))
