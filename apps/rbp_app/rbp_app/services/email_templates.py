"""Deterministic backend email template rendering for RBP notifications."""

from __future__ import annotations

from html import escape
from typing import Any


TEMPLATE_TITLES = {
    "account_created": "Welcome to RBP",
    "membership_payment_succeeded": "Membership payment received",
    "membership_payment_failed": "Membership payment failed",
    "subscription_status_changed": "Subscription status updated",
    "entitlement_granted": "Membership access granted",
    "entitlement_suspended": "Membership access updated",
    "service_request_submitted": "Service request received",
    "docushare_brief_submitted": "DocuShare brief submitted",
    "connectivity_nbn_order_submitted": "Connectivity order submitted",
    "risk_advisor_assessment_submitted": "Risk assessment submitted",
    "fixer_request_submitted": "Fixer request submitted",
    "marketplace_listing_submitted": "Marketplace listing submitted",
    "marketplace_enquiry_submitted": "Marketplace enquiry received",
    "application_interest_submitted": "Application interest received",
    "admin_status_updated": "Status updated by admin",
}

TEMPLATE_INTROS = {
    "account_created": "Your Remote Business Partner account has been created.",
    "membership_payment_succeeded": "We have received your membership payment.",
    "membership_payment_failed": "We could not complete your membership payment.",
    "subscription_status_changed": "Your subscription status has changed.",
    "entitlement_granted": "Your membership access has been granted.",
    "entitlement_suspended": "Your membership access has been updated.",
    "service_request_submitted": "Your service request has been received.",
    "docushare_brief_submitted": "Your DocuShare brief has been received.",
    "connectivity_nbn_order_submitted": "Your connectivity order has been received.",
    "risk_advisor_assessment_submitted": "Your Risk Advisor assessment has been received.",
    "fixer_request_submitted": "Your Fixer request has been received.",
    "marketplace_listing_submitted": "Your marketplace listing has been received.",
    "marketplace_enquiry_submitted": "Your marketplace enquiry has been received.",
    "application_interest_submitted": "Your application interest has been received.",
    "admin_status_updated": "An admin has updated the status of your request.",
}

DETAIL_LABELS = (
    ("reference_id", "Reference"),
    ("business_name", "Business"),
    ("plan_name", "Plan"),
    ("service_name", "Service"),
    ("application_name", "Application"),
    ("marketplace_item", "Marketplace item"),
    ("status", "Status"),
    ("submitted_at", "Submitted"),
    ("admin_note", "Admin note"),
    ("support_email", "Support"),
)


def _value(context: dict[str, Any], key: str, default: str = "") -> str:
    value = context.get(key)
    if value is None:
        return default
    return str(value)


def _escape(value: object) -> str:
    return escape(str(value), quote=True)


def _title_for_template(template_key: str) -> str:
    return TEMPLATE_TITLES.get(template_key) or "RBP notification"


def _intro_for_template(template_key: str, context: dict[str, Any]) -> str:
    return _value(context, "message") or TEMPLATE_INTROS.get(
        template_key,
        "There is a new update from Remote Business Partner.",
    )


def _amount_line(context: dict[str, Any]) -> str | None:
    amount = context.get("amount")
    currency = context.get("currency")
    if amount is None and currency is None:
        return None
    return " ".join(part for part in (str(amount or ""), str(currency or "")) if part).strip()


def _details_for_template(template_key: str, context: dict[str, Any]) -> list[tuple[str, str]]:
    details: list[tuple[str, str]] = []
    for key, label in DETAIL_LABELS:
        value = _value(context, key)
        if value:
            details.append((label, value))

    amount = _amount_line(context)
    if amount:
        details.append(("Amount", amount))

    if not any(label == "Reference" for label, _ in details):
        details.insert(0, ("Reference", "Not assigned yet"))
    return details


def render_template(template_key: str, context: dict[str, Any] | None = None) -> dict[str, str]:
    """Render a safe HTML and plain-text notification without Frappe state."""

    context = context or {}
    title = _title_for_template(template_key)
    customer_name = _value(context, "customer_name", "there") or "there"
    intro = _intro_for_template(template_key, context)
    portal_url = _value(context, "portal_url", "/portal/dashboard") or "/portal/dashboard"

    detail_rows = _details_for_template(template_key, context)
    detail_html = "".join(
        f"<p><strong>{_escape(label)}:</strong> {_escape(value)}</p>"
        for label, value in detail_rows
    )
    detail_text = "\n".join(f"{label}: {value}" for label, value in detail_rows)

    html = (
        f"<p>Hi {_escape(customer_name)},</p>"
        f"<p>{_escape(intro)}</p>"
        f"{detail_html}"
        "<p>You can view updates in your RBP portal:</p>"
        f'<p><a href="{_escape(portal_url)}">{_escape(portal_url)}</a></p>'
        "<p>Regards,<br>Remote Business Partner</p>"
    )
    text = (
        f"Hi {customer_name},\n\n"
        f"{intro}\n"
        f"{detail_text}\n"
        f"Portal: {portal_url}\n\n"
        "Regards,\nRemote Business Partner"
    )
    return {"title": title, "html": html, "text": text}
