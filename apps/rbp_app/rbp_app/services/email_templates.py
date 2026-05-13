from __future__ import annotations
from html import escape
from typing import Any

TITLES = {k: v for k, v in {
"account_created":"Welcome to RBP","membership_payment_succeeded":"Membership payment received","membership_payment_failed":"Membership payment failed","subscription_status_changed":"Subscription status updated","entitlement_granted":"Membership access granted","entitlement_suspended":"Membership access updated","service_request_submitted":"Service request received","docushare_brief_submitted":"DocuShare brief submitted","connectivity_nbn_order_submitted":"Connectivity order submitted","risk_advisor_assessment_submitted":"Risk assessment submitted","fixer_request_submitted":"Fixer request submitted","marketplace_listing_submitted":"Marketplace listing submitted","marketplace_enquiry_submitted":"Marketplace enquiry received","application_interest_submitted":"Application interest received","admin_status_updated":"Status updated by admin"}.items()}


def render_template(template_key: str, context: dict[str, Any] | None = None) -> dict[str, str]:
    context = context or {}
    if template_key not in TITLES:
        raise ValueError(f"Unsupported notification template_key: {template_key}")
    name = escape(str(context.get("customer_name") or "there"))
    message = escape(str(context.get("message") or TITLES[template_key]))
    ref = escape(str(context.get("reference_id") or "Not assigned yet"))
    portal = escape(str(context.get("portal_url") or "/portal/dashboard"))
    status = context.get("status")
    amount = context.get("amount")
    currency = context.get("currency")
    extra = ""
    if amount is not None:
        extra += f"<p><strong>Amount:</strong> {escape(str(amount))} {escape(str(currency or ''))}</p>"
    if status:
        extra += f"<p><strong>Status:</strong> {escape(str(status))}</p>"
    html = f"<p>Hi {name},</p><p>{message}</p><p><strong>Reference:</strong> {ref}</p>{extra}<p>You can view updates in your RBP portal:</p><p><a href=\"{portal}\">{portal}</a></p><p>Regards,<br>Remote Business Partner</p>"
    text = f"Hi {name},\n\n{message}\nReference: {ref}\n" + (f"Amount: {amount} {currency or ''}\n" if amount is not None else "") + (f"Status: {status}\n" if status else "") + f"Portal: {portal}\n\nRegards,\nRemote Business Partner"
    return {"title": TITLES[template_key], "html": html, "text": text}
