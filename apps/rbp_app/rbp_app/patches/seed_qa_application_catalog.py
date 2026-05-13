"""Seed baseline application catalogue records for QA/UAT."""

from __future__ import annotations

import os

import frappe


CATEGORIES = [
	("operations-finance", "Operations & Finance"),
	("sales-customer", "Sales & Customer"),
	("people-operations", "People Operations"),
	("support", "Support"),
	("documents", "Documents"),
	("learning", "Learning"),
	("payments-billing", "Payments & Billing"),
	("websites", "Websites"),
	("reporting", "Reporting"),
]

APPLICATIONS = [
	("erpnext", "ERPNext", "operations-finance"),
	("crm", "CRM", "sales-customer"),
	("hrms", "HRMS", "people-operations"),
	("helpdesk", "Helpdesk", "support"),
	("drive", "Drive", "documents"),
	("lms", "LMS", "learning"),
	("payments", "Payments", "payments-billing"),
	("builder", "Builder", "websites"),
	("insights", "Insights", "reporting"),
]


def _doctype_exists(doctype: str) -> bool:
	return bool(frappe.db.exists("DocType", doctype))


def _config_value(*keys: str) -> str | None:
	for key in keys:
		if os.environ.get(key):
			return os.environ[key]
		for candidate in (key, key.lower(), key.removeprefix("RBP_").lower()):
			value = frappe.conf.get(candidate)
			if value:
				return str(value)
	return None


def _upsert_category(key: str, name: str, sort_order: int):
	docname = frappe.db.exists("RBP Application Category", key)
	if docname:
		doc = frappe.get_doc("RBP Application Category", docname)
	else:
		doc = frappe.get_doc({"doctype": "RBP Application Category", "category_key": key})
	doc.category_name = name
	doc.description = f"{name} applications for the RBP rollout catalogue."
	doc.sort_order = sort_order
	doc.enabled = 1
	doc.save(ignore_permissions=True) if docname else doc.insert(ignore_permissions=True)


def _upsert_application(key: str, name: str, category: str, sort_order: int):
	docname = frappe.db.exists("RBP Application", key)
	if docname:
		doc = frappe.get_doc("RBP Application", docname)
	else:
		doc = frappe.get_doc({"doctype": "RBP Application", "application_key": key})
	doc.application_name = name
	doc.category = category
	doc.short_description = f"{name} is planned for the RBP application rollout."
	doc.public_description = "Coming soon. Register interest to be notified when this application is ready."
	doc.portal_description = "Next rollout. Register interest and the RBP team will keep you updated."
	doc.provider = "other"
	doc.status = "register_interest"
	doc.visibility = "public"
	doc.sort_order = sort_order
	doc.requires_manual_approval = 1
	doc.interest_enabled = 1
	doc.provisioning_enabled = 0
	doc.public_cta_label = "Register interest"
	doc.portal_cta_label = "Register interest"
	doc.save(ignore_permissions=True) if docname else doc.insert(ignore_permissions=True)


def _ensure_membership_plan():
	if not _doctype_exists("RBP Membership Plan"):
		return

	premium_price_id = _config_value("RBP_STRIPE_PREMIUM_PRICE_ID", "STRIPE_PREMIUM_PRICE_ID")
	plans = [
		("free", "RBP Free Membership", "Active", "Manual", 0, None),
		("premium", "RBP Premium Membership", "Active", "Monthly", 0, premium_price_id),
	]
	for code, name, status, cycle, amount, price_id in plans:
		docname = frappe.db.exists("RBP Membership Plan", code)
		if docname:
			doc = frappe.get_doc("RBP Membership Plan", docname)
		else:
			doc = frappe.get_doc({"doctype": "RBP Membership Plan", "plan_code": code})
		doc.plan_name = name
		doc.status = status
		doc.billing_cycle = cycle
		doc.amount = amount
		doc.currency = "AUD"
		doc.is_public = 1
		if price_id:
			doc.stripe_price_id = price_id
		doc.save(ignore_permissions=True) if docname else doc.insert(ignore_permissions=True)


def execute():
	if _doctype_exists("RBP Application Category"):
		for index, (key, name) in enumerate(CATEGORIES, start=1):
			_upsert_category(key, name, index)

	if _doctype_exists("RBP Application"):
		for index, (key, name, category) in enumerate(APPLICATIONS, start=1):
			_upsert_application(key, name, category, index)

	_ensure_membership_plan()
