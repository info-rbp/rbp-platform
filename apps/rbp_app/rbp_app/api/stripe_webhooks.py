"""Signed Stripe webhook endpoint for RBP billing events."""

from __future__ import annotations

import frappe

from rbp_app.services.payment_events import process_stripe_webhook_event
from rbp_app.services.stripe_gateway import verify_webhook_event


def _request_payload():
    request = getattr(frappe.local, "request", None)
    if request and hasattr(request, "get_data"):
        return request.get_data(as_text=False)
    return b""


def _stripe_signature():
    request = getattr(frappe.local, "request", None)
    if not request:
        return None
    try:
        return request.headers.get("Stripe-Signature")
    except Exception:
        return None


@frappe.whitelist(allow_guest=True)
def handle_stripe_webhook():
    """Verify and process a Stripe webhook event.

    This method intentionally accepts Guest access because Stripe calls it
    server-to-server. Authentication is the Stripe signature verification.
    """

    payload = _request_payload()
    event = verify_webhook_event(payload, _stripe_signature())
    result = process_stripe_webhook_event(event)
    frappe.local.response["http_status_code"] = 200
    return {"ok": True, **result}
