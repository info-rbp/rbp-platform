"""Signed Stripe webhook endpoint for RBP billing events."""

from __future__ import annotations

import hashlib
import hmac
import json
import time
from typing import Any

import frappe

from rbp_app.services.billing import (
	get_stripe_webhook_secret,
	record_payment_event,
	update_subscription_from_payment_event,
)
from rbp_app.services.environment import is_stripe_enabled
from rbp_app.services.tenancy import doctype_exists


EVENT_STATUS = {
	"checkout.session.completed": "Paid",
	"customer.subscription.created": "Pending",
	"customer.subscription.updated": "Pending",
	"customer.subscription.deleted": "Cancelled",
	"invoice.payment_succeeded": "Paid",
	"invoice.payment_failed": "Failed",
	"payment_intent.succeeded": "Paid",
	"payment_intent.payment_failed": "Failed",
	"charge.refunded": "Refunded",
	"charge.dispute.created": "Disputed",
}


def _parse_signature(signature: str) -> tuple[int | None, list[str]]:
	timestamp = None
	signatures: list[str] = []
	for part in signature.split(","):
		key, _, value = part.partition("=")
		if key == "t":
			try:
				timestamp = int(value)
			except ValueError:
				timestamp = None
		elif key == "v1" and value:
			signatures.append(value)
	return timestamp, signatures


def _verify_signature(payload: str, signature: str, secret: str, tolerance_seconds: int = 300):
	timestamp, signatures = _parse_signature(signature or "")
	if not timestamp or not signatures:
		raise frappe.PermissionError
	if abs(int(time.time()) - timestamp) > tolerance_seconds:
		raise frappe.PermissionError

	signed_payload = f"{timestamp}.{payload}".encode("utf-8")
	expected = hmac.new(secret.encode("utf-8"), signed_payload, hashlib.sha256).hexdigest()
	if not any(hmac.compare_digest(expected, candidate) for candidate in signatures):
		raise frappe.PermissionError


def _stripe_object(event: dict[str, Any]) -> dict[str, Any]:
	data = event.get("data") or {}
	obj = data.get("object") or {}
	return obj if isinstance(obj, dict) else {}


def _metadata(obj: dict[str, Any]) -> dict[str, Any]:
	value = obj.get("metadata") or {}
	return value if isinstance(value, dict) else {}


def _amount(obj: dict[str, Any]) -> float | None:
	for key in ("amount_total", "amount_paid", "amount_due", "amount", "amount_refunded"):
		value = obj.get(key)
		if isinstance(value, (int, float)):
			return float(value) / 100
	return None


def _find_subscription(obj: dict[str, Any]) -> str | None:
	if not doctype_exists("RBP Subscription"):
		return None

	metadata = _metadata(obj)
	subscription_name = metadata.get("subscription")
	if subscription_name and frappe.db.exists("RBP Subscription", subscription_name):
		return str(subscription_name)

	provider_subscription_id = obj.get("subscription") or obj.get("id")
	if provider_subscription_id:
		found = frappe.db.get_value(
			"RBP Subscription",
			{"provider_subscription_id": provider_subscription_id},
			"name",
		)
		if found:
			return found

	customer_id = obj.get("customer")
	if customer_id:
		found = frappe.db.get_value("RBP Subscription", {"provider_customer_id": customer_id}, "name")
		if found:
			return found

	return None


def _sync_subscription_ids(subscription_name: str | None, obj: dict[str, Any]):
	if not subscription_name:
		return

	doc = frappe.get_doc("RBP Subscription", subscription_name)
	if obj.get("customer"):
		doc.provider_customer_id = obj.get("customer")
	if obj.get("subscription"):
		doc.provider_subscription_id = obj.get("subscription")
	elif str(obj.get("object")) == "subscription" and obj.get("id"):
		doc.provider_subscription_id = obj.get("id")
	if obj.get("payment_intent"):
		doc.provider_payment_id = obj.get("payment_intent")
	if obj.get("currency"):
		doc.currency = str(obj.get("currency")).upper()
	doc.save(ignore_permissions=True)


@frappe.whitelist(allow_guest=True, methods=["POST"])
def handle_stripe_webhook():
	"""Validate and process Stripe webhook events.

	Stripe webhooks are guest-callable by design but must pass signature validation.
	Raw payloads are stored only in the admin-restricted RBP Payment Event DocType.
	"""

	if not is_stripe_enabled():
		raise frappe.PermissionError

	secret = get_stripe_webhook_secret()
	if not secret:
		raise frappe.ValidationError("Stripe webhook secret is not configured.")

	payload = frappe.request.get_data(as_text=True)
	signature = frappe.get_request_header("Stripe-Signature") or ""
	_verify_signature(payload, signature, secret)

	event = json.loads(payload or "{}")
	event_type = event.get("type")
	if event_type not in EVENT_STATUS:
		return {"ok": True, "ignored": True, "event_type": event_type}
	provider_event_id = event.get("id")
	if provider_event_id and doctype_exists("RBP Payment Event"):
		existing_event = frappe.db.exists("RBP Payment Event", {"provider_event_id": provider_event_id})
		if existing_event:
			return {
				"ok": True,
				"duplicate": True,
				"event_type": event_type,
				"payment_event": existing_event,
			}

	obj = _stripe_object(event)
	subscription_name = _find_subscription(obj)
	_sync_subscription_ids(subscription_name, obj)

	payment_event = record_payment_event(
		{
			"provider_event_id": provider_event_id,
			"provider_customer_id": obj.get("customer"),
			"provider_payment_id": obj.get("payment_intent") or obj.get("id"),
			"related_doctype": "RBP Subscription" if subscription_name else None,
			"related_name": subscription_name,
			"amount": _amount(obj),
			"currency": str(obj.get("currency") or "AUD").upper(),
			"status": EVENT_STATUS[event_type],
			"event_type": event_type,
			"raw_payload": event,
		},
		user=None,
	)

	if subscription_name and getattr(payment_event, "related_name", None):
		update_subscription_from_payment_event(payment_event)

	frappe.db.commit()
	return {
		"ok": True,
		"event_type": event_type,
		"payment_event": payment_event.name,
		"subscription": subscription_name,
	}
