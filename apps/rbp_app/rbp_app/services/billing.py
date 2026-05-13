"""Billing services for the RBP platform layer."""

import json

import frappe

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.entitlements import sync_subscription_entitlements
from rbp_app.services.environment import get_runtime_settings, is_stripe_enabled
from rbp_app.services.notifications import emit_event_notification
from rbp_app.services.tenancy import doctype_exists, get_rbp_tenant_for_user


PAYMENT_STATES = {
	"Not Required",
	"Pending",
	"Authorised",
	"Paid",
	"Failed",
	"Refunded",
	"Cancelled",
	"Disputed",
}


def _subscription_user(subscription) -> str | None:
	return getattr(subscription, "user", None) or getattr(subscription, "member", None)


def _subscription_tenant(subscription) -> str | None:
	return getattr(subscription, "tenant", None)


def _build_subscription_notification_context(
	*,
	subscription,
	event,
	previous_status: str | None = None,
	previous_payment_status: str | None = None,
) -> dict[str, object]:
	return {
		"reference_id": getattr(subscription, "name", None),
		"status": getattr(subscription, "status", None),
		"payment_status": getattr(event, "status", None),
		"previous_status": previous_status,
		"previous_payment_status": previous_payment_status,
		"portal_url": "/portal/dashboard",
		"amount": getattr(event, "amount", None),
		"currency": getattr(event, "currency", None),
		"plan_name": getattr(subscription, "plan", None),
		"provider": getattr(event, "payment_provider", None),
	}


def _safe_emit_billing_notification(**kwargs):
	try:
		return emit_event_notification(**kwargs)
	except Exception:
		frappe.log_error(frappe.get_traceback(), "RBP billing notification hook failed")
		return {"ok": False, "reason": "notification_failed"}


def _placeholder() -> dict[str, object]:
	runtime = get_runtime_settings()
	return {
		"status": "not_configured",
		"plan": None,
		"message": "Billing is not configured for this portal yet.",
		"billing_enabled": False,
		"stripe_enabled": runtime.enable_stripe,
		"stripe_mode": runtime.stripe_mode,
		"stripe_test_mode": runtime.stripe_test_mode,
	}


def _doctype_exists(doctype: str) -> bool:
	"""Backward-compatible wrapper around the tenancy DocType check."""

	return doctype_exists(doctype)


def _get_user_tenant(user: str | None = None) -> str | None:
	tenant = get_rbp_tenant_for_user(user)
	return getattr(tenant, "name", None)


def _coerce_payload(payload: dict[str, object] | str | None) -> dict[str, object]:
	if payload is None:
		return {}

	if isinstance(payload, str):
		return json.loads(payload or "{}")

	return dict(payload)


def get_subscription_status(user: str | None = None) -> dict[str, object]:
	"""Return current user's subscription status or a safe placeholder."""

	runtime = get_runtime_settings()

	if not runtime.enable_stripe:
		return _placeholder()

	if not _doctype_exists("RBP Subscription"):
		return _placeholder()

	try:
		if frappe.db.count("RBP Subscription") <= 0:
			return _placeholder()
	except Exception:
		return _placeholder()

	filters: dict[str, object] = {}
	tenant = _get_user_tenant(user)

	if tenant:
		filters["tenant"] = tenant
	elif not is_admin_user(user):
		return _placeholder()

	try:
		subscriptions = frappe.get_all(
			"RBP Subscription",
			filters=filters,
			fields=[
				"name",
				"tenant",
				"member",
				"status",
				"plan",
				"billing_cycle",
				"billing_provider",
				"provider_customer_id",
				"provider_subscription_id",
				"provider_product_id",
				"provider_price_id",
				"payment_status",
				"amount",
				"currency",
				"current_period_start",
				"current_period_end",
				"cancel_at_period_end",
				"last_payment_event",
			],
			order_by="modified desc",
			limit_page_length=1,
		)
	except Exception:
		return _placeholder()

	if not subscriptions:
		return _placeholder()

	subscription = subscriptions[0]
	return {
		"status": subscription.get("status"),
		"plan": subscription.get("plan"),
		"message": "Subscription status is available.",
		"billing_enabled": True,
		"stripe_enabled": runtime.enable_stripe,
		"stripe_mode": runtime.stripe_mode,
		"stripe_test_mode": runtime.stripe_test_mode,
		"subscription": subscription,
	}


def record_payment_event(payload: dict[str, object] | str | None, user: str | None = None):
	"""Record an idempotent payment event and optionally update a subscription."""

	if not is_stripe_enabled():
		raise frappe.ValidationError("Stripe billing is disabled for this environment.")

	payload = _coerce_payload(payload)

	if not _doctype_exists("RBP Payment Event"):
		raise frappe.ValidationError("RBP Payment Event is not installed.")

	provider_event_id = payload.get("provider_event_id")

	if provider_event_id:
		existing = frappe.db.exists("RBP Payment Event", {"provider_event_id": provider_event_id})
		if existing:
			return frappe.get_doc("RBP Payment Event", existing)

	status = payload.get("status") or "Pending"

	if status not in PAYMENT_STATES:
		raise frappe.ValidationError("Invalid payment status.")

	doc = frappe.get_doc(
		{
			"doctype": "RBP Payment Event",
			"tenant": payload.get("tenant"),
			"user": payload.get("user") or user,
			"related_doctype": payload.get("related_doctype"),
			"related_name": payload.get("related_name"),
			"payment_provider": payload.get("payment_provider") or "Stripe",
			"provider_event_id": provider_event_id,
			"provider_customer_id": payload.get("provider_customer_id"),
			"provider_payment_id": payload.get("provider_payment_id"),
			"amount": payload.get("amount"),
			"currency": payload.get("currency") or "AUD",
			"status": status,
			"event_type": payload.get("event_type"),
			"raw_payload": json.dumps(payload.get("raw_payload") or payload, default=str),
		}
	)
	doc.insert(ignore_permissions=True)

	if doc.related_doctype == "RBP Subscription" and doc.related_name:
		update_subscription_from_payment_event(doc)

	record_audit_event(
		"payment_event_recorded",
		actor=user,
		tenant=doc.tenant,
		subject_doctype=doc.related_doctype or "RBP Payment Event",
		subject_name=doc.related_name or doc.name,
		message="Payment event recorded.",
		metadata={
			"payment_event": doc.name,
			"status": doc.status,
			"provider_event_id": provider_event_id,
		},
	)

	return doc


def update_subscription_from_payment_event(event):
	"""Apply payment event state to a linked subscription and sync member entitlements."""

	if not event.related_name or not frappe.db.exists("RBP Subscription", event.related_name):
		return None

	subscription = frappe.get_doc("RBP Subscription", event.related_name)
	previous_status = getattr(subscription, "status", None)
	previous_payment_status = getattr(subscription, "payment_status", None)
	subscription.payment_status = event.status
	subscription.provider_customer_id = event.provider_customer_id or subscription.provider_customer_id
	subscription.provider_payment_id = event.provider_payment_id
	subscription.last_payment_event = event.name

	if event.status == "Paid" and subscription.status in {"Draft", "Trial", "Past Due"}:
		subscription.status = "Active"

	if event.status in {"Failed", "Disputed"} and subscription.status == "Active":
		subscription.status = "Past Due"

	if event.status in {"Cancelled", "Refunded"} and subscription.status == "Active":
		subscription.status = "Cancelled"

	subscription.save(ignore_permissions=True)
	notification_context = _build_subscription_notification_context(
		subscription=subscription,
		event=event,
		previous_status=previous_status,
		previous_payment_status=previous_payment_status,
	)

	if event.status == "Paid":
		_safe_emit_billing_notification(
			event_type="membership.payment_succeeded",
			user=_subscription_user(subscription),
			tenant=_subscription_tenant(subscription),
			related_doctype="RBP Subscription",
			related_name=subscription.name,
			message="Your membership payment was successful.",
			context=notification_context,
		)
	elif event.status in {"Failed", "Disputed"}:
		_safe_emit_billing_notification(
			event_type="membership.payment_failed",
			user=_subscription_user(subscription),
			tenant=_subscription_tenant(subscription),
			related_doctype="RBP Subscription",
			related_name=subscription.name,
			message="Your membership payment failed and needs attention.",
			context=notification_context | {"portal_url": "/portal/membership/checkout"},
		)

	if subscription.status != previous_status:
		_safe_emit_billing_notification(
			event_type="subscription.status_changed",
			user=_subscription_user(subscription),
			tenant=_subscription_tenant(subscription),
			related_doctype="RBP Subscription",
			related_name=subscription.name,
			message=f"Subscription status is now {subscription.status}.",
			context=notification_context,
		)

	try:
		sync_subscription_entitlements(subscription)
	except Exception:
		frappe.log_error(frappe.get_traceback(), "RBP entitlement sync failed")

	return subscription


def get_subscription_status_payload() -> dict[str, object]:
	"""Backward-compatible alias for the subscription payload."""

	return get_subscription_status()
