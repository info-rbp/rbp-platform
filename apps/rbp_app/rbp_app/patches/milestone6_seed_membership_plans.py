"""Seed QA membership plans for Stripe mapping.

This patch is intentionally idempotent. It creates or updates:
- Free Account
- Premium Membership

QA placeholders are used unless the environment provides explicit Stripe test IDs.
"""

from __future__ import annotations

import json
import os

import frappe


PLACEHOLDER_PRODUCT_ID = "prod_test_replace_me"
PLACEHOLDER_PRICE_ID = "price_test_replace_me"


def _has_column(fieldname):
    try:
        return frappe.db.has_column("RBP Membership Plan", fieldname)
    except Exception:
        return False


def _get_config(key, env_key=None, fallback=None):
    return frappe.conf.get(key) or os.environ.get(env_key or key.upper()) or fallback


def _upsert_plan(values):
    name = frappe.db.get_value("RBP Membership Plan", {"plan_code": values["plan_code"]}, "name")

    if name:
        doc = frappe.get_doc("RBP Membership Plan", name)
    else:
        doc = frappe.new_doc("RBP Membership Plan")
        doc.plan_code = values["plan_code"]

    for fieldname, value in values.items():
        if fieldname in {"plan_code", "name"}:
            continue
        if fieldname in {"price", "active", "included_entitlements"} and not _has_column(fieldname):
            continue
        if hasattr(doc, fieldname):
            setattr(doc, fieldname, value)

    if hasattr(doc, "amount"):
        doc.amount = values.get("amount", values.get("price", 0))
    if hasattr(doc, "status"):
        doc.status = values.get("status", "Active")
    if hasattr(doc, "is_public"):
        doc.is_public = values.get("is_public", 1)
    if hasattr(doc, "included_capabilities"):
        doc.included_capabilities = values.get("included_capabilities") or values.get("included_entitlements")

    if doc.is_new():
        doc.insert(ignore_permissions=True)
    else:
        doc.save(ignore_permissions=True)

    return doc


def execute():
    if not frappe.db.exists("DocType", "RBP Membership Plan"):
        return

    premium_product_id = _get_config(
        "rbp_stripe_premium_product_id",
        "RBP_STRIPE_PREMIUM_PRODUCT_ID",
        PLACEHOLDER_PRODUCT_ID,
    )
    premium_price_id = _get_config(
        "rbp_stripe_premium_price_id",
        "RBP_STRIPE_PREMIUM_PRICE_ID",
        PLACEHOLDER_PRICE_ID,
    )

    free_entitlements = [
        "portal",
        "applications_interest",
        "resources",
    ]

    premium_entitlements = [
        "membership",
        "portal",
        "billing",
        "notifications",
        "offers",
        "resources",
        "documents",
        "decision_desk",
        "docushare",
        "marketplace",
        "connectivity",
        "risk_advisor",
        "fixer",
        "applications_interest",
    ]

    _upsert_plan(
        {
            "plan_code": "free_account",
            "plan_name": "Free Account",
            "description": "Free account access for portal registration, application interest, and introductory resources.",
            "billing_cycle": "Manual",
            "amount": 0,
            "price": 0,
            "currency": "AUD",
            "status": "Active",
            "active": 1,
            "is_public": 1,
            "stripe_product_id": "",
            "stripe_price_id": "",
            "included_apps": "",
            "included_capabilities": json.dumps(free_entitlements),
            "included_entitlements": json.dumps(free_entitlements),
            "sort_order": 10,
        }
    )

    _upsert_plan(
        {
            "plan_code": "premium_membership",
            "plan_name": "Premium Membership",
            "description": "Paid RBP membership for service access, member benefits, marketplace support, and advisory pathways.",
            "billing_cycle": "Monthly",
            "amount": 99,
            "price": 99,
            "currency": "AUD",
            "status": "Active",
            "active": 1,
            "is_public": 1,
            "stripe_product_id": premium_product_id,
            "stripe_price_id": premium_price_id,
            "included_apps": "",
            "included_capabilities": json.dumps(premium_entitlements),
            "included_entitlements": json.dumps(premium_entitlements),
            "sort_order": 20,
        }
    )
