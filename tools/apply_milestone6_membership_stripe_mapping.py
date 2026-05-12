from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path.cwd()


def find_app_roots() -> list[Path]:
    roots: list[Path] = []

    for doctype_json in ROOT.rglob("rbp_membership_plan.json"):
        if "node_modules" in doctype_json.parts or ".git" in doctype_json.parts:
            continue

        # Expected path:
        # <app_root>/rbp_app/rbp_app/doctype/rbp_membership_plan/rbp_membership_plan.json
        try:
            app_root = doctype_json.parents[4]
        except IndexError:
            continue

        service_file = app_root / "rbp_app" / "services" / "membership.py"
        api_file = app_root / "rbp_app" / "api" / "membership.py"

        if service_file.exists() and api_file.exists():
            roots.append(app_root)

    unique = []
    seen = set()
    for root in roots:
        resolved = root.resolve()
        if resolved not in seen:
            unique.append(root)
            seen.add(resolved)

    return unique


def ensure_field(fields: list[dict], fieldname: str, spec: dict) -> None:
    for field in fields:
        if field.get("fieldname") == fieldname:
            field.update(spec)
            return

    new_field = {"fieldname": fieldname}
    new_field.update(spec)
    fields.append(new_field)


def insert_after(field_order: list[str], after: str, fieldname: str) -> None:
    if fieldname in field_order:
        field_order.remove(fieldname)

    if after in field_order:
        field_order.insert(field_order.index(after) + 1, fieldname)
    else:
        field_order.append(fieldname)


def patch_doctype(app_root: Path) -> None:
    path = app_root / "rbp_app" / "rbp_app" / "doctype" / "rbp_membership_plan" / "rbp_membership_plan.json"
    data = json.loads(path.read_text())

    field_order = data.setdefault("field_order", [])
    fields = data.setdefault("fields", [])

    insert_after(field_order, "amount", "price")
    insert_after(field_order, "status", "active")
    insert_after(field_order, "included_capabilities", "included_entitlements")

    ensure_field(
        fields,
        "price",
        {
            "fieldtype": "Currency",
            "label": "Price",
            "description": "Canonical price used by frontend/API. Kept in sync with legacy Amount where applicable.",
            "in_list_view": 1,
        },
    )

    ensure_field(
        fields,
        "active",
        {
            "fieldtype": "Check",
            "label": "Active",
            "default": "1",
            "description": "Canonical active flag used by launch APIs.",
            "in_list_view": 1,
        },
    )

    ensure_field(
        fields,
        "included_entitlements",
        {
            "fieldtype": "Small Text",
            "label": "Included Entitlements",
            "description": "JSON array or newline-separated entitlement keys granted by this membership plan.",
        },
    )

    # Keep existing Stripe fields visible enough for QA/admin sanity.
    ensure_field(
        fields,
        "stripe_product_id",
        {
            "fieldtype": "Data",
            "label": "Stripe Product ID",
            "description": "Stripe product ID, for example prod_xxx.",
            "in_list_view": 0,
        },
    )

    ensure_field(
        fields,
        "stripe_price_id",
        {
            "fieldtype": "Data",
            "label": "Stripe Price ID",
            "description": "Stripe price ID, for example price_xxx. Required before checkout can start.",
            "in_list_view": 1,
        },
    )

    data["modified"] = "2026-05-12 00:00:00.000000"

    path.write_text(json.dumps(data, indent=1) + "\n")
    print(f"patched DocType: {path}")


SERVICE_HELPERS = r'''

def _plan_has_column(fieldname):
    try:
        return frappe.db.has_column("RBP Membership Plan", fieldname)
    except Exception:
        return False


def _decode_membership_list(value):
    if not value:
        return []
    if isinstance(value, (list, tuple)):
        return list(value)
    if isinstance(value, str):
        raw = value.strip()
        if not raw:
            return []
        try:
            decoded = json.loads(raw)
            if isinstance(decoded, list):
                return decoded
        except Exception:
            pass
        return [line.strip() for line in raw.replace(",", "\n").splitlines() if line.strip()]
    return []


def _membership_plan_fields():
    fields = [
        "name",
        "plan_code",
        "plan_name",
        "description",
        "billing_cycle",
        "currency",
        "stripe_product_id",
        "stripe_price_id",
        "is_public",
        "sort_order",
        "status",
    ]

    for optional_field in ["amount", "price", "active", "included_apps", "included_capabilities", "included_entitlements"]:
        if _plan_has_column(optional_field):
            fields.append(optional_field)

    return fields


def _normalise_membership_plan(plan):
    if not plan:
        return None

    price = plan.get("price")
    if price is None:
        price = plan.get("amount")

    active = plan.get("active")
    if active is None:
        active = 1 if plan.get("status") == "Active" else 0

    included_entitlements = _decode_membership_list(plan.get("included_entitlements"))
    if not included_entitlements:
        included_entitlements = _decode_membership_list(plan.get("included_capabilities"))

    payload = dict(plan)
    payload["price"] = price
    payload["amount"] = plan.get("amount", price)
    payload["active"] = 1 if active else 0
    payload["included_entitlements"] = included_entitlements
    payload["checkout_ready"] = is_membership_plan_checkout_ready(payload)

    return payload


def is_membership_plan_checkout_ready(plan):
    stripe_price_id = None

    if isinstance(plan, dict):
        stripe_price_id = plan.get("stripe_price_id")
        active = plan.get("active")
        status = plan.get("status")
    else:
        stripe_price_id = getattr(plan, "stripe_price_id", None)
        active = getattr(plan, "active", None)
        status = getattr(plan, "status", None)

    if active is not None and not int(active):
        return False

    if status and status != "Active":
        return False

    if not stripe_price_id:
        return False

    stripe_price_id = str(stripe_price_id).strip()

    if not stripe_price_id.startswith("price_"):
        return False

    blocked_tokens = ["REPLACE", "PLACEHOLDER", "TODO", "DUMMY", "FAKE"]
    if any(token in stripe_price_id.upper() for token in blocked_tokens):
        return False

    return True
'''


NEW_LIST_MEMBERSHIP_PLANS = r'''

def list_membership_plans(user=None, public_only=True):
    """Return active membership plans with Stripe mapping fields."""

    if not doctype_exists("RBP Membership Plan"):
        return {"plans": [], "count": 0}

    filters = {}

    if _plan_has_column("status"):
        filters["status"] = "Active"

    if _plan_has_column("active"):
        filters["active"] = 1

    if public_only and _plan_has_column("is_public"):
        filters["is_public"] = 1

    plans = frappe.get_all(
        "RBP Membership Plan",
        filters=filters,
        fields=_membership_plan_fields(),
        order_by="sort_order asc, plan_name asc",
    )

    normalised_plans = [_normalise_membership_plan(plan) for plan in plans]

    return {"plans": normalised_plans, "count": len(normalised_plans)}
'''


NEW_GET_MEMBERSHIP_PLAN = r'''

def get_membership_plan(plan_code=None, name=None):
    """Return one membership plan by code or name."""

    if not doctype_exists("RBP Membership Plan"):
        return None

    filters = {}
    if name:
        filters["name"] = name
    elif plan_code:
        filters["plan_code"] = plan_code.strip().lower()
    else:
        return None

    plan_name = frappe.db.get_value("RBP Membership Plan", filters, "name")
    if not plan_name:
        return None

    return frappe.get_doc("RBP Membership Plan", plan_name)


def validate_membership_plan_for_checkout(plan_code=None, name=None):
    """Return a membership plan only when it is active and has a usable Stripe price ID."""

    plan = get_membership_plan(plan_code=plan_code, name=name)

    if not plan:
        raise frappe.ValidationError("Membership plan was not found.")

    if hasattr(plan, "status") and plan.status != "Active":
        raise frappe.ValidationError("Membership plan is not active.")

    if hasattr(plan, "active") and not int(plan.active or 0):
        raise frappe.ValidationError("Membership plan is not active.")

    if not is_membership_plan_checkout_ready(plan):
        raise frappe.ValidationError("Membership plan is missing a valid Stripe price ID.")

    return plan
'''


def patch_service(app_root: Path) -> None:
    path = app_root / "rbp_app" / "services" / "membership.py"
    text = path.read_text()

    if "def _plan_has_column(" not in text:
        marker = "def list_membership_plans("
        text = text.replace(marker, SERVICE_HELPERS + "\n\n" + marker)

    text = re.sub(
        r'\ndef list_membership_plans\(.*?\n\ndef get_membership_plan\(',
        NEW_LIST_MEMBERSHIP_PLANS + "\n\ndef get_membership_plan(",
        text,
        flags=re.S,
    )

    text = re.sub(
        r'\ndef get_membership_plan\(.*?\n\ndef start_onboarding\(',
        NEW_GET_MEMBERSHIP_PLAN + "\n\ndef start_onboarding(",
        text,
        flags=re.S,
    )

    path.write_text(text)
    print(f"patched service: {path}")


def patch_api(app_root: Path) -> None:
    path = app_root / "rbp_app" / "api" / "membership.py"
    text = path.read_text()

    if "validate_membership_plan_for_checkout as validate_membership_plan_for_checkout_service" not in text:
        text = text.replace(
            "    update_onboarding_step as update_onboarding_step_service,\n)",
            "    update_onboarding_step as update_onboarding_step_service,\n"
            "    validate_membership_plan_for_checkout as validate_membership_plan_for_checkout_service,\n)",
        )

    if "def validate_membership_plan_checkout(" not in text:
        text += r'''


@frappe.whitelist()
def validate_membership_plan_checkout(plan_code=None, name=None):
    """Validate that a membership plan can start Stripe checkout."""

    user = require_login()
    plan = validate_membership_plan_for_checkout_service(plan_code=plan_code, name=name)

    return {
        "user": user,
        "name": plan.name,
        "plan_code": plan.plan_code,
        "plan_name": plan.plan_name,
        "billing_cycle": plan.billing_cycle,
        "price": getattr(plan, "price", None) if getattr(plan, "price", None) is not None else getattr(plan, "amount", None),
        "currency": plan.currency,
        "stripe_product_id": plan.stripe_product_id,
        "stripe_price_id": plan.stripe_price_id,
        "checkout_ready": True,
    }
'''

    path.write_text(text)
    print(f"patched API: {path}")


PATCH_CONTENT = '''"""Seed QA membership plans for Stripe mapping.

This patch is intentionally idempotent. It creates/updates:
- Free Account
- Premium Membership

Stripe IDs are read from site config or environment variables:
- rbp_stripe_premium_product_id / RBP_STRIPE_PREMIUM_PRODUCT_ID
- rbp_stripe_premium_price_id / RBP_STRIPE_PREMIUM_PRICE_ID
"""

from __future__ import annotations

import json
import os

import frappe


def _has_column(fieldname):
    try:
        return frappe.db.has_column("RBP Membership Plan", fieldname)
    except Exception:
        return False


def _get_config(key, env_key=None, fallback=None):
    return (
        frappe.conf.get(key)
        or os.environ.get(env_key or key.upper())
        or fallback
    )


def _upsert_plan(values):
    name = frappe.db.get_value("RBP Membership Plan", {"plan_code": values["plan_code"]}, "name")

    if name:
        doc = frappe.get_doc("RBP Membership Plan", name)
    else:
        doc = frappe.new_doc("RBP Membership Plan")
        doc.plan_code = values["plan_code"]

    for fieldname, value in values.items():
        if fieldname == "plan_code" or fieldname == "name":
            continue
        if fieldname in {"price", "active", "included_entitlements"} and not _has_column(fieldname):
            continue
        if hasattr(doc, fieldname):
            setattr(doc, fieldname, value)

    # Backward compatibility with the existing Phase 3 schema.
    if hasattr(doc, "amount"):
        doc.amount = values.get("amount", values.get("price", 0))
    if hasattr(doc, "status"):
        doc.status = values.get("status", "Active")
    if hasattr(doc, "is_public"):
        doc.is_public = values.get("is_public", 1)
    if hasattr(doc, "included_capabilities"):
        doc.included_capabilities = values.get("included_capabilities") or values.get("included_entitlements")

    doc.save(ignore_permissions=True) if not doc.is_new() else doc.insert(ignore_permissions=True)

    return doc


def execute():
    if not frappe.db.exists("DocType", "RBP Membership Plan"):
        return

    premium_product_id = _get_config(
        "rbp_stripe_premium_product_id",
        "RBP_STRIPE_PREMIUM_PRODUCT_ID",
        "prod_REPLACE_WITH_STRIPE_TEST_PRODUCT_ID",
    )

    premium_price_id = _get_config(
        "rbp_stripe_premium_price_id",
        "RBP_STRIPE_PREMIUM_PRICE_ID",
        "price_REPLACE_WITH_STRIPE_TEST_PRICE_ID",
    )

    free_entitlements = [
        "portal",
        "applications_interest",
        "resources_preview",
    ]

    premium_entitlements = [
        "membership",
        "portal",
        "offers",
        "resources",
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
'''


def patch_seed(app_root: Path) -> None:
    package_root = app_root / "rbp_app"
    patches_dir = package_root / "patches"
    patches_dir.mkdir(parents=True, exist_ok=True)

    patch_file = patches_dir / "milestone6_seed_membership_plans.py"
    patch_file.write_text(PATCH_CONTENT)

    patches_txt = package_root / "patches.txt"
    patch_line = "rbp_app.patches.milestone6_seed_membership_plans"

    existing = patches_txt.read_text() if patches_txt.exists() else ""

    if patch_line not in existing:
        if existing and not existing.endswith("\n"):
            existing += "\n"
        existing += patch_line + "\n"
        patches_txt.write_text(existing)

    print(f"patched seed: {patch_file}")
    print(f"patched patches.txt: {patches_txt}")


def patch_tests(app_root: Path) -> None:
    tests_dir = app_root / "rbp_app" / "tests"
    tests_dir.mkdir(parents=True, exist_ok=True)

    path = tests_dir / "test_milestone6_membership_stripe_mapping.py"
    path.write_text(
        '''import frappe


def test_membership_plans_are_seeded():
    plans = frappe.get_all(
        "RBP Membership Plan",
        filters={"status": "Active"},
        fields=["plan_code", "plan_name", "stripe_price_id"],
    )

    codes = {plan.plan_code for plan in plans}

    assert "free_account" in codes
    assert "premium_membership" in codes


def test_premium_membership_has_stripe_price_mapping():
    plan = frappe.get_doc("RBP Membership Plan", "premium_membership")

    assert plan.stripe_price_id
    assert plan.stripe_price_id.startswith("price_")
    assert "REPLACE" not in plan.stripe_price_id.upper()


def test_checkout_validation_rejects_free_plan_without_stripe_price():
    from rbp_app.services.membership import validate_membership_plan_for_checkout

    try:
        validate_membership_plan_for_checkout(plan_code="free_account")
    except frappe.ValidationError:
        return

    raise AssertionError("Free Account should not be checkout-ready because it has no Stripe price ID.")


def test_checkout_validation_accepts_premium_plan():
    from rbp_app.services.membership import validate_membership_plan_for_checkout

    plan = validate_membership_plan_for_checkout(plan_code="premium_membership")

    assert plan.plan_code == "premium_membership"
    assert plan.stripe_price_id.startswith("price_")
'''
    )

    print(f"patched tests: {path}")


def main() -> None:
    app_roots = find_app_roots()

    if not app_roots:
        raise SystemExit("No rbp_app app roots found. Run this from the frappe-project repository root.")

    for app_root in app_roots:
        print(f"\\nApplying Milestone 6 patches to: {app_root}")
        patch_doctype(app_root)
        patch_service(app_root)
        patch_api(app_root)
        patch_seed(app_root)
        patch_tests(app_root)

    print("\\nMilestone 6 code patches applied.")


if __name__ == "__main__":
    main()
