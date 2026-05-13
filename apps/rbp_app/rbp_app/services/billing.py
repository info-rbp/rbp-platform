"""Billing services for the RBP platform layer."""

import json
import os
import urllib.error
import urllib.parse
import urllib.request

import frappe

from rbp_app.permissions import is_admin_user
from rbp_app.services.audit import record_audit_event
from rbp_app.services.entitlements import sync_subscription_entitlements
from rbp_app.services.environment import get_runtime_settings, is_stripe_enabled
from rbp_app.services.notifications import safe_emit_event_notification
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
	result = safe_emit_event_notification(log_title="RBP billing notification hook failed", **kwargs)
	return result or {"ok": False, "reason": "notification_failed"}


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


def _backend_config_value(*keys: str) -> str | None:
	conf = getattr(frappe, "conf", None)
	for key in keys:
		if key in os.environ:
			return os.environ[key]
		if conf is None:
			continue
		candidates = (key, key.lower(), key.removeprefix("RBP_").lower())
		for candidate in candidates:
			value = conf.get(candidate) if hasattr(conf, "get") else getattr(conf, candidate, None)
			if value:
				return str(value)
	return None


def get_stripe_secret_key() -> str | None:
	"""Return the backend-only Stripe secret key from site config or env."""

	return _backend_config_value("STRIPE_SECRET_KEY", "RBP_STRIPE_SECRET_KEY", "rbp_stripe_secret_key")


def get_stripe_webhook_secret() -> str | None:
	"""Return the backend-only Stripe webhook signing secret from site config or env."""

	return _backend_config_value("STRIPE_WEBHOOK_SECRET", "RBP_STRIPE_WEBHOOK_SECRET", "rbp_stripe_webhook_secret")


def _get_public_site_url() -> str:
	return (
		_backend_config_value("RBP_PUBLIC_SITE_URL", "VITE_PUBLIC_SITE_URL", "public_site_url", "host_name")
		or "https://qa.remotebusinesspartner.com.au"
	).rstrip("/")


def _validate_stripe_secret_for_mode(secret_key: str):
	runtime = get_runtime_settings()
	if runtime.stripe_mode == "test" and not secret_key.startswith("sk_test_"):
		raise frappe.ValidationError("Stripe test mode requires a test secret key.")
	if runtime.stripe_mode == "live" and not secret_key.startswith("sk_live_"):
		raise frappe.ValidationError("Stripe live mode requires a live secret key.")


def _get_membership_plan(plan_code: str | None):
	if not plan_code:
		raise frappe.ValidationError("Membership plan is required.")
	if not _doctype_exists("RBP Membership Plan"):
		raise frappe.ValidationError("RBP Membership Plan is not installed.")

	plan_name = frappe.db.exists("RBP Membership Plan", plan_code)
	if not plan_name:
		plan_name = frappe.db.get_value("RBP Membership Plan", {"plan_code": plan_code}, "name")
	if not plan_name:
		plan_name = frappe.db.get_value("RBP Membership Plan", {"stripe_price_id": plan_code}, "name")
	if not plan_name:
		raise frappe.ValidationError("Please choose a valid membership plan.")

	return frappe.get_doc("RBP Membership Plan", plan_name)


def _get_or_create_subscription(user: str, plan) -> object | None:
	if not _doctype_exists("RBP Subscription"):
		return None

	tenant = _get_user_tenant(user)
	filters = {
		"member": user,
		"plan": getattr(plan, "plan_code", None) or getattr(plan, "name", None),
	}
	if tenant:
		filters["tenant"] = tenant

	existing = frappe.db.get_value("RBP Subscription", filters, "name")
	if existing:
		return frappe.get_doc("RBP Subscription", existing)

	subscription = frappe.get_doc(
		{
			"doctype": "RBP Subscription",
			"tenant": tenant,
			"member": user,
			"status": "Draft",
			"plan": getattr(plan, "plan_code", None) or getattr(plan, "name", None),
			"billing_cycle": getattr(plan, "billing_cycle", None) or "Monthly",
			"billing_provider": "Stripe",
			"provider_product_id": getattr(plan, "stripe_product_id", None),
			"provider_price_id": getattr(plan, "stripe_price_id", None),
			"payment_status": "Pending",
			"amount": getattr(plan, "amount", None),
			"currency": getattr(plan, "currency", None) or "AUD",
		}
	)
	subscription.insert(ignore_permissions=True)
	return subscription


def _stripe_api_post(path: str, fields: list[tuple[str, object]], secret_key: str) -> dict[str, object]:
	data = urllib.parse.urlencode([(key, "" if value is None else str(value)) for key, value in fields]).encode()
	request = urllib.request.Request(
		f"https://api.stripe.com/v1/{path.lstrip('/')}",
		data=data,
		headers={
			"Authorization": f"Bearer {secret_key}",
			"Content-Type": "application/x-www-form-urlencoded",
		},
		method="POST",
	)

	try:
		with urllib.request.urlopen(request, timeout=20) as response:
			return json.loads(response.read().decode("utf-8"))
	except urllib.error.HTTPError as exc:
		body = exc.read().decode("utf-8")
		try:
			error_payload = json.loads(body)
			message = error_payload.get("error", {}).get("message") or body
		except Exception:
			message = body
		raise frappe.ValidationError(f"Stripe request failed: {message}") from exc


def create_membership_checkout_session(payload: dict[str, object] | str | None, user: str) -> dict[str, object]:
	"""Create a Stripe Checkout Session for an authenticated membership purchase."""

	runtime = get_runtime_settings()
	if not runtime.enable_stripe:
		raise frappe.ValidationError("Stripe checkout is disabled for this environment.")

	payload = _coerce_payload(payload)
	if payload.get("accepted_terms") is False:
		raise frappe.ValidationError("Membership terms must be accepted before checkout.")

	secret_key = get_stripe_secret_key()
	if not secret_key:
		raise frappe.ValidationError("Stripe secret key is not configured.")
	_validate_stripe_secret_for_mode(secret_key)

	plan = _get_membership_plan(str(payload.get("plan_code") or payload.get("selected_plan_id") or ""))
	price_id = getattr(plan, "stripe_price_id", None)
	if not price_id:
		raise frappe.ValidationError("The selected membership plan is missing a Stripe Price ID.")

	subscription = _get_or_create_subscription(user, plan)
	site_url = _get_public_site_url()
	email = str(payload.get("email") or user)
	tenant = _get_user_tenant(user)

	fields: list[tuple[str, object]] = [
		("mode", "subscription"),
		("line_items[0][price]", price_id),
		("line_items[0][quantity]", 1),
		("success_url", f"{site_url}/portal/membership/confirmation?session_id={{CHECKOUT_SESSION_ID}}"),
		("cancel_url", f"{site_url}/portal/membership/checkout?cancelled=true"),
		("customer_email", email),
		("client_reference_id", getattr(subscription, "name", None) or user),
		("metadata[user]", user),
		("metadata[tenant]", tenant or ""),
		("metadata[subscription]", getattr(subscription, "name", None) or ""),
		("metadata[plan_code]", getattr(plan, "plan_code", None) or plan.name),
		("metadata[environment]", runtime.environment),
	]
	session = _stripe_api_post("checkout/sessions", fields, secret_key)

	if subscription:
		subscription.provider_price_id = price_id
		subscription.payment_status = "Pending"
		subscription.save(ignore_permissions=True)
		frappe.db.commit()

	return {
		"checkout_url": session.get("url"),
		"url": session.get("url"),
		"checkout_session_id": session.get("id"),
		"session_id": session.get("id"),
		"status": session.get("status") or "created",
		"message": "Stripe Checkout session created.",
	}


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


def get_payment_summary(user: str) -> dict[str, object]:
	"""Return payment metadata for the current user without exposing raw provider payloads."""

	status = get_subscription_status(user)
	tenant = _get_user_tenant(user)
	filters: dict[str, object] = {"user": user}
	if tenant:
		filters = {"tenant": tenant}

	events = []
	if _doctype_exists("RBP Payment Event"):
		events = frappe.get_all(
			"RBP Payment Event",
			filters=filters,
			fields=[
				"name",
				"creation",
				"payment_provider",
				"provider_event_id",
				"provider_customer_id",
				"provider_payment_id",
				"amount",
				"currency",
				"status",
				"event_type",
				"related_doctype",
				"related_name",
			],
			order_by="creation desc",
			limit_page_length=10,
		)

	return {
		"subscription_status": status,
		"recent_payment_events": events,
		"raw_payload_visible": False,
	}


def cancel_subscription(user: str) -> dict[str, object]:
	"""Request cancellation at period end for the current user's subscription."""

	status = get_subscription_status(user)
	subscription_payload = status.get("subscription") if isinstance(status, dict) else None
	subscription_name = subscription_payload.get("name") if isinstance(subscription_payload, dict) else None
	if not subscription_name:
		raise frappe.ValidationError("No active subscription was found for this user.")

	subscription = frappe.get_doc("RBP Subscription", subscription_name)
	subscription.cancel_at_period_end = 1

	provider_subscription_id = getattr(subscription, "provider_subscription_id", None)
	if provider_subscription_id:
		secret_key = get_stripe_secret_key()
		if secret_key:
			_validate_stripe_secret_for_mode(secret_key)
			_stripe_api_post(
				f"subscriptions/{urllib.parse.quote(str(provider_subscription_id))}",
				[("cancel_at_period_end", "true")],
				secret_key,
			)

	subscription.save(ignore_permissions=True)
	record_audit_event(
		"subscription_cancel_requested",
		actor=user,
		tenant=getattr(subscription, "tenant", None),
		subject_doctype="RBP Subscription",
		subject_name=subscription.name,
		message="Subscription cancellation requested.",
		metadata={"cancel_at_period_end": True},
	)
	frappe.db.commit()

	return {
		"ok": True,
		"status": subscription.status,
		"cancel_at_period_end": bool(subscription.cancel_at_period_end),
		"subscription": subscription.name,
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
