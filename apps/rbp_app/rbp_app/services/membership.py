"""Membership and onboarding services for the RBP platform layer."""

import json

import frappe
from frappe.utils import now_datetime

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.notifications import create_notification
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


DEFAULT_ONBOARDING_STEPS = [
    ("account", "Account"),
    ("business_profile", "Business Profile"),
    ("plan", "Membership Plan"),
    ("billing", "Billing"),
    ("review", "Review"),
]


def _safe_json(value):
    if value is None:
        return {}
    if isinstance(value, str):
        return json.loads(value or "{}")
    return dict(value)



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


def start_onboarding(user=None, plan_code=None, source_channel="portal"):
    """Create or return an active onboarding flow for the user."""

    user = user or frappe.session.user
    if not user or user == "Guest":
        raise frappe.PermissionError

    if not doctype_exists("RBP Onboarding Flow"):
        raise frappe.ValidationError("RBP Onboarding Flow is not installed.")

    existing = frappe.db.get_value(
        "RBP Onboarding Flow",
        {
            "user": user,
            "status": ["in", ["Draft", "In Progress", "Submitted"]],
        },
        "name",
    )
    if existing:
        return frappe.get_doc("RBP Onboarding Flow", existing)

    plan = get_membership_plan(plan_code=plan_code) if plan_code else None

    flow = frappe.get_doc(
        {
            "doctype": "RBP Onboarding Flow",
            "user": user,
            "membership_plan": getattr(plan, "name", None),
            "status": "In Progress",
            "current_step_key": "account",
            "source_channel": source_channel or "portal",
            "started_on": now_datetime(),
            "last_activity_on": now_datetime(),
        }
    )
    flow.insert(ignore_permissions=True)

    ensure_onboarding_steps(flow.name, user=user)

    record_audit_event(
        "onboarding_started",
        actor=user,
        subject_doctype="RBP Onboarding Flow",
        subject_name=flow.name,
        message="Onboarding flow started.",
        metadata={"plan_code": plan_code, "source_channel": source_channel},
    )

    return flow


def ensure_onboarding_steps(flow_name, user=None):
    """Create default onboarding steps if they do not already exist."""

    if not doctype_exists("RBP Onboarding Step"):
        return []

    flow = frappe.get_doc("RBP Onboarding Flow", flow_name)
    created = []

    for index, (step_key, step_label) in enumerate(DEFAULT_ONBOARDING_STEPS, start=1):
        existing = frappe.db.exists(
            "RBP Onboarding Step",
            {
                "flow": flow.name,
                "step_key": step_key,
            },
        )
        if existing:
            continue

        step = frappe.get_doc(
            {
                "doctype": "RBP Onboarding Step",
                "flow": flow.name,
                "tenant": flow.tenant,
                "user": flow.user,
                "step_key": step_key,
                "step_label": step_label,
                "status": "In Progress" if step_key == flow.current_step_key else "Not Started",
                "sort_order": index,
            }
        )
        step.insert(ignore_permissions=True)
        created.append(step)

    return created


def get_my_onboarding(user=None):
    """Return current user's onboarding flow and steps."""

    user = user or frappe.session.user
    if not user or user == "Guest":
        raise frappe.PermissionError

    if not doctype_exists("RBP Onboarding Flow"):
        return {"flow": None, "steps": []}

    flow_name = frappe.db.get_value(
        "RBP Onboarding Flow",
        {"user": user},
        "name",
        order_by="modified desc",
    )

    if not flow_name:
        return {"flow": None, "steps": []}

    flow = frappe.get_doc("RBP Onboarding Flow", flow_name)

    steps = []
    if doctype_exists("RBP Onboarding Step"):
        steps = frappe.get_all(
            "RBP Onboarding Step",
            filters={"flow": flow.name},
            fields=[
                "name",
                "step_key",
                "step_label",
                "status",
                "sort_order",
                "started_on",
                "completed_on",
                "modified",
            ],
            order_by="sort_order asc",
        )

    return {
        "flow": {
            "name": flow.name,
            "tenant": flow.tenant,
            "business_profile": flow.business_profile,
            "membership_plan": flow.membership_plan,
            "subscription": flow.subscription,
            "status": flow.status,
            "current_step_key": flow.current_step_key,
            "source_channel": flow.source_channel,
            "started_on": flow.started_on,
            "submitted_on": flow.submitted_on,
            "completed_on": flow.completed_on,
            "last_activity_on": flow.last_activity_on,
        },
        "steps": steps,
    }


def update_onboarding_step(flow_name, step_key, payload=None, status="Completed", user=None):
    """Update one onboarding step payload and status."""

    user = user or frappe.session.user
    payload = _safe_json(payload)

    flow = frappe.get_doc("RBP Onboarding Flow", flow_name)
    if flow.user != user and not is_admin_user(user):
        raise frappe.PermissionError

    step_name = frappe.db.get_value(
        "RBP Onboarding Step",
        {
            "flow": flow.name,
            "step_key": step_key,
        },
        "name",
    )
    if not step_name:
        raise frappe.DoesNotExistError

    step = frappe.get_doc("RBP Onboarding Step", step_name)
    step.payload_json = json.dumps(payload, default=str)
    step.status = status or "Completed"
    step.save(ignore_permissions=True)

    flow.current_step_key = step_key
    flow.status = "In Progress"
    flow.last_activity_on = now_datetime()
    flow.save(ignore_permissions=True)

    record_audit_event(
        "onboarding_step_updated",
        actor=user,
        subject_doctype="RBP Onboarding Flow",
        subject_name=flow.name,
        workflow_state=flow.status,
        message=f"Onboarding step updated: {step_key}",
        metadata={"step": step.name, "step_key": step_key, "status": step.status},
    )

    return step


def submit_onboarding(flow_name, user=None):
    """Submit an onboarding flow for admin/platform review."""

    user = user or frappe.session.user
    flow = frappe.get_doc("RBP Onboarding Flow", flow_name)

    if flow.user != user and not is_admin_user(user):
        raise frappe.PermissionError

    flow.status = "Submitted"
    flow.submitted_on = now_datetime()
    flow.last_activity_on = now_datetime()
    flow.save(ignore_permissions=True)

    create_notification(
        user=user,
        title="Onboarding submitted",
        message="Your RBP onboarding has been submitted.",
        related_doctype="RBP Onboarding Flow",
        related_name=flow.name,
        trigger_source="membership.submit_onboarding",
        created_by_workflow="membership_onboarding",
    )

    record_audit_event(
        "onboarding_submitted",
        actor=user,
        subject_doctype="RBP Onboarding Flow",
        subject_name=flow.name,
        workflow_state=flow.status,
        message="Onboarding flow submitted.",
    )

    return flow


def complete_onboarding(flow_name, user=None):
    """Admin completion action for onboarding."""

    user = user or frappe.session.user
    if not is_admin_user(user):
        raise frappe.PermissionError

    flow = frappe.get_doc("RBP Onboarding Flow", flow_name)
    flow.status = "Completed"
    flow.completed_on = now_datetime()
    flow.last_activity_on = now_datetime()
    flow.save(ignore_permissions=True)

    create_notification(
        user=flow.user,
        title="Onboarding completed",
        message="Your RBP onboarding has been completed.",
        related_doctype="RBP Onboarding Flow",
        related_name=flow.name,
        trigger_source="membership.complete_onboarding",
        created_by_workflow="membership_onboarding",
    )

    record_audit_event(
        "onboarding_completed",
        actor=user,
        subject_doctype="RBP Onboarding Flow",
        subject_name=flow.name,
        workflow_state=flow.status,
        message="Onboarding flow completed.",
    )

    return flow
