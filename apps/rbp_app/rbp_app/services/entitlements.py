"""Entitlement enforcement and member-benefit services for RBP."""

import json

import frappe
from frappe.utils import getdate, nowdate

from rbp_app.permissions import get_user_roles, is_admin_user, require_system_manager
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name
from rbp_app.services.notifications import emit_event_notification


ACTIVE_STATUSES = {"Active"}
DISABLED_ENTITLEMENT_KEYS = {"applications_provisioning"}

MEMBERSHIP_ENTITLEMENT_KEYS = [
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

ENTITLEMENT_CATALOG = {
	"membership": {
		"label": "Membership",
		"category": "Platform",
		"route": "/portal/dashboard",
		"visible": 1,
	},
	"portal": {
		"label": "Member Portal",
		"category": "Platform",
		"route": "/portal/dashboard",
		"visible": 1,
	},
	"billing": {
		"label": "Billing",
		"category": "Finance",
		"route": "/portal/settings",
		"visible": 1,
	},
	"notifications": {
		"label": "Notifications",
		"category": "Platform",
		"route": "/portal/dashboard",
		"visible": 1,
	},
	"offers": {
		"label": "Member Offers",
		"category": "Commerce",
		"route": "/portal/offers",
		"visible": 1,
	},
	"resources": {
		"label": "Member Resources",
		"category": "Knowledge",
		"route": "/portal/resources",
		"visible": 1,
	},
	"documents": {
		"label": "Documents",
		"category": "Documents",
		"route": "/portal/documents",
		"visible": 1,
	},
	"decision_desk": {
		"label": "Decision Desk",
		"category": "Operations",
		"route": "/portal/services/decision-desk/start",
		"visible": 1,
	},
	"docushare": {
		"label": "DocuShare",
		"category": "Documents",
		"route": "/portal/services/docushare/start",
		"visible": 1,
	},
	"marketplace": {
		"label": "Marketplace",
		"category": "Commerce",
		"route": "/portal/marketplace/listings/new",
		"visible": 1,
	},
	"connectivity": {
		"label": "Connectivity",
		"category": "Operations",
		"route": "/portal/services/nbn/start",
		"visible": 1,
	},
	"risk_advisor": {
		"label": "Risk Advisor",
		"category": "Operations",
		"route": "/portal/services/risk-advisor/start",
		"visible": 1,
	},
	"fixer": {
		"label": "The Fixer",
		"category": "Operations",
		"route": "/portal/services/the-fixer/start",
		"visible": 1,
	},
	"applications_interest": {
		"label": "Applications Interest",
		"category": "Platform",
		"route": "/portal/apps",
		"visible": 1,
	},
	"applications_provisioning": {
		"label": "Applications Provisioning",
		"category": "Platform",
		"route": "/portal/apps",
		"visible": 0,
	},
}


def _parse_roles(value: object) -> set[str]:
	if not value:
		return set()

	return {item.strip() for item in str(value).replace(",", "\n").splitlines() if item.strip()}


def _within_date_window(row: dict[str, object]) -> bool:
	today = getdate(nowdate())
	starts_on = row.get("starts_on")
	ends_on = row.get("ends_on")

	if starts_on and getdate(starts_on) > today:
		return False

	if ends_on and getdate(ends_on) < today:
		return False

	return True


def _normalize_entitlement_key(app_key: object) -> str:
	return str(app_key or "").strip().lower().replace("-", "_").replace(" ", "_")


def _coerce_payload(payload: dict[str, object] | str | None) -> dict[str, object]:
	if payload is None:
		return {}

	if isinstance(payload, str):
		return json.loads(payload or "{}")

	if isinstance(payload, dict):
		return payload

	return dict(payload)


def _catalog_entry(app_key: object) -> dict[str, object]:
	return ENTITLEMENT_CATALOG.get(_normalize_entitlement_key(app_key), {})


def _doctype_has_field(doctype: str, fieldname: str) -> bool:
	try:
		meta = frappe.get_meta(doctype)
		return bool(meta.has_field(fieldname))
	except Exception:
		return False


def _set_if_supported(doc, fieldname: str, value: object) -> None:
	if _doctype_has_field(doc.doctype, fieldname):
		setattr(doc, fieldname, value)


def _entitlement_fields() -> list[str]:
	base_fields = [
		"name",
		"tenant",
		"user",
		"app_key",
		"app_label",
		"entitlement_type",
		"status",
		"enabled",
		"roles_allowed",
		"starts_on",
		"ends_on",
		"source_subscription",
	]

	optional_fields = [
		"app_category",
		"module_type",
		"visible_in_launcher",
		"route",
		"plan_required",
		"notes",
	]

	return [
		fieldname
		for fieldname in [*base_fields, *optional_fields]
		if fieldname in base_fields or _doctype_has_field("RBP App Entitlement", fieldname)
	]


def _entitlement_rows(
	app_key: str | None = None,
	user: str | None = None,
	include_inactive: bool = False,
) -> list[dict[str, object]]:
	if not doctype_exists("RBP App Entitlement"):
		return []

	filters: dict[str, object] = {}

	if not include_inactive:
		filters.update(
			{
				"enabled": 1,
				"status": ["in", list(ACTIVE_STATUSES)],
			}
		)

	if app_key:
		filters["app_key"] = _normalize_entitlement_key(app_key)

	try:
		return frappe.get_all(
			"RBP App Entitlement",
			filters=filters,
			fields=_entitlement_fields(),
		)
	except Exception:
		return []


def _serialize_entitlement_doc(doc) -> dict[str, object]:
	row = doc.as_dict() if hasattr(doc, "as_dict") else dict(doc)
	app_key = _normalize_entitlement_key(row.get("app_key"))
	catalog = _catalog_entry(app_key)

	return {
		"name": row.get("name"),
		"tenant": row.get("tenant"),
		"user": row.get("user"),
		"app_key": app_key,
		"app_label": row.get("app_label") or catalog.get("label") or app_key,
		"app_category": row.get("app_category") or catalog.get("category"),
		"module_type": row.get("module_type") or "RBP Platform Module",
		"entitlement_type": row.get("entitlement_type"),
		"status": row.get("status"),
		"enabled": bool(row.get("enabled")),
		"visible_in_launcher": bool(row.get("visible_in_launcher", catalog.get("visible", 1))),
		"route": row.get("route") or catalog.get("route"),
		"roles_allowed": row.get("roles_allowed"),
		"plan_required": row.get("plan_required"),
		"source_subscription": row.get("source_subscription"),
		"starts_on": row.get("starts_on"),
		"ends_on": row.get("ends_on"),
		"notes": row.get("notes"),
	}


def _entitlement_exists(
	app_key: str,
	user: str | None = None,
	tenant: str | None = None,
	source_subscription: str | None = None,
) -> str | None:
	filters: dict[str, object] = {"app_key": _normalize_entitlement_key(app_key)}

	if user:
		filters["user"] = user

	if tenant:
		filters["tenant"] = tenant

	if source_subscription:
		filters["source_subscription"] = source_subscription

	return frappe.db.exists("RBP App Entitlement", filters)


def get_user_entitlements(user: str | None = None, include_inactive: bool = False) -> list[dict[str, object]]:
	user = user or frappe.session.user

	if not user or user == "Guest":
		return []

	if is_admin_user(user):
		return _entitlement_rows(user=user, include_inactive=include_inactive)

	tenant = get_current_tenant_name(user)
	roles = set(get_user_roles(user))
	rows = []

	for row in _entitlement_rows(user=user, include_inactive=include_inactive):
		if not include_inactive and not _within_date_window(row):
			continue

		if row.get("user") and row.get("user") != user:
			continue

		if row.get("tenant") and tenant and row.get("tenant") != tenant:
			continue

		allowed_roles = _parse_roles(row.get("roles_allowed"))
		if allowed_roles and not roles.intersection(allowed_roles):
			continue

		rows.append(_serialize_entitlement_doc(row))

	return rows


def user_has_entitlement(app_key: str, user: str | None = None) -> bool:
	user = user or frappe.session.user
	app_key = _normalize_entitlement_key(app_key)

	if not app_key or not user or user == "Guest":
		return False

	if app_key in DISABLED_ENTITLEMENT_KEYS:
		return False

	if is_admin_user(user):
		return True

	active_rows = get_user_entitlements(user=user, include_inactive=False)

	if active_rows:
		return any(row.get("app_key") == app_key for row in active_rows)

	inactive_rows = get_user_entitlements(user=user, include_inactive=True)

	if inactive_rows:
		# Entitlements exist for this user, but none are currently active.
		# That means access should be denied, not scaffold-granted.
		return False

	# Scaffold-safe default: if no entitlement records exist yet at all,
	# do not block the portal. Once entitlement records exist, they become
	# authoritative.
	return True


def require_entitlement(app_key: str, user: str | None = None) -> bool:
	if not user_has_entitlement(app_key, user):
		raise frappe.PermissionError

	return True


def grant_entitlement(
	app_key: str,
	user: str | None = None,
	tenant: str | None = None,
	entitlement_type: str = "Tenant",
	source_subscription: str | None = None,
	starts_on: object = None,
	ends_on: object = None,
	plan_required: str | None = None,
	roles_allowed: str | None = None,
	notes: str | None = None,
	visible_in_launcher: int | bool | None = None,
	ignore_disabled: bool = False,
) -> dict[str, object]:
	app_key = _normalize_entitlement_key(app_key)

	if not app_key:
		raise frappe.ValidationError("Entitlement key is required.")

	if app_key in DISABLED_ENTITLEMENT_KEYS and not ignore_disabled:
		raise frappe.ValidationError(f"Entitlement '{app_key}' is disabled for this rollout.")

	if not doctype_exists("RBP App Entitlement"):
		raise frappe.ValidationError("RBP App Entitlement is not installed.")

	if not tenant and user:
		tenant = get_current_tenant_name(user)

	catalog = _catalog_entry(app_key)

	existing_name = _entitlement_exists(
		app_key=app_key,
		user=user,
		tenant=tenant,
		source_subscription=source_subscription,
	)

	if existing_name:
		doc = frappe.get_doc("RBP App Entitlement", existing_name)
	else:
		doc = frappe.get_doc({"doctype": "RBP App Entitlement"})

	doc.tenant = tenant
	doc.user = user
	doc.app_key = app_key
	doc.app_label = catalog.get("label") or app_key.replace("_", " ").title()
	doc.entitlement_type = entitlement_type or "Tenant"
	doc.status = "Active"
	doc.enabled = 1
	doc.roles_allowed = roles_allowed
	doc.source_subscription = source_subscription
	doc.starts_on = starts_on
	doc.ends_on = ends_on

	_set_if_supported(doc, "app_category", catalog.get("category") or "Platform")
	_set_if_supported(doc, "module_type", catalog.get("module_type") or "RBP Platform Module")
	_set_if_supported(
		doc,
		"visible_in_launcher",
		visible_in_launcher if visible_in_launcher is not None else catalog.get("visible", 1),
	)
	_set_if_supported(doc, "route", catalog.get("route"))
	_set_if_supported(doc, "plan_required", plan_required)
	_set_if_supported(doc, "notes", notes)

	if existing_name:
		doc.save(ignore_permissions=True)
	else:
		doc.insert(ignore_permissions=True)

	return _serialize_entitlement_doc(doc)


def revoke_entitlement(
	app_key: str,
	user: str | None = None,
	tenant: str | None = None,
	source_subscription: str | None = None,
	status: str = "Suspended",
	notes: str | None = None,
) -> list[dict[str, object]]:
	app_key = _normalize_entitlement_key(app_key)

	if not app_key:
		raise frappe.ValidationError("Entitlement key is required.")

	if not doctype_exists("RBP App Entitlement"):
		return []

	filters: dict[str, object] = {"app_key": app_key}

	if user:
		filters["user"] = user

	if tenant:
		filters["tenant"] = tenant

	if source_subscription:
		filters["source_subscription"] = source_subscription

	names = frappe.get_all("RBP App Entitlement", filters=filters, pluck="name")
	revoked = []

	for name in names:
		doc = frappe.get_doc("RBP App Entitlement", name)
		doc.status = status
		doc.enabled = 0
		_set_if_supported(doc, "notes", notes)
		doc.save(ignore_permissions=True)
		revoked.append(_serialize_entitlement_doc(doc))

	return revoked


def grant_membership_entitlements(
	subscription=None,
	user: str | None = None,
	tenant: str | None = None,
	plan: str | None = None,
	starts_on: object = None,
	ends_on: object = None,
) -> list[dict[str, object]]:
	if isinstance(subscription, str):
		subscription = frappe.get_doc("RBP Subscription", subscription)

	if subscription:
		user = user or getattr(subscription, "user", None) or getattr(subscription, "member", None)
		tenant = tenant or getattr(subscription, "tenant", None)
		plan = plan or getattr(subscription, "plan", None)
		starts_on = starts_on or getattr(subscription, "current_period_start", None)
		ends_on = ends_on or getattr(subscription, "current_period_end", None)
		source_subscription = getattr(subscription, "name", None)
	else:
		source_subscription = None

	granted = []

	for key in MEMBERSHIP_ENTITLEMENT_KEYS:
		granted.append(
			grant_entitlement(
				app_key=key,
				user=user,
				tenant=tenant,
				entitlement_type="Plan",
				source_subscription=source_subscription,
				starts_on=starts_on,
				ends_on=ends_on,
				plan_required=plan,
				notes="Granted from active membership subscription.",
			)
		)

	return granted


def suspend_membership_entitlements(
	subscription=None,
	user: str | None = None,
	tenant: str | None = None,
	status: str = "Suspended",
) -> list[dict[str, object]]:
	if isinstance(subscription, str):
		subscription = frappe.get_doc("RBP Subscription", subscription)

	source_subscription = None

	if subscription:
		user = user or getattr(subscription, "user", None) or getattr(subscription, "member", None)
		tenant = tenant or getattr(subscription, "tenant", None)
		source_subscription = getattr(subscription, "name", None)

	revoked = []

	for key in MEMBERSHIP_ENTITLEMENT_KEYS:
		revoked.extend(
			revoke_entitlement(
				app_key=key,
				user=user,
				tenant=tenant,
				source_subscription=source_subscription,
				status=status,
				notes=f"Membership entitlement {status.lower()} due to subscription state.",
			)
		)

	return revoked


def sync_subscription_entitlements(subscription) -> dict[str, object]:
	status = getattr(subscription, "status", None)
	payment_status = getattr(subscription, "payment_status", None)

	should_grant = status in {"Active", "Trial"} and payment_status in {
		None,
		"",
		"Not Required",
		"Authorised",
		"Paid",
	}

	if should_grant:
		granted = grant_membership_entitlements(subscription=subscription)
		if granted:
			emit_event_notification(
				event_type="entitlement.granted",
			user=getattr(subscription, "user", None) or getattr(subscription, "member", None),
			tenant=getattr(subscription, "tenant", None),
			related_doctype="RBP Subscription",
			related_name=getattr(subscription, "name", None),
			message="Membership entitlements have been granted.",
		)
		return {"action": "granted", "entitlements": granted}

	inactive_status = "Suspended"

	if status == "Expired":
		inactive_status = "Expired"

	if status == "Cancelled":
		inactive_status = "Cancelled"

	suspended = suspend_membership_entitlements(subscription=subscription, status=inactive_status)
	if suspended:
		emit_event_notification(
		event_type="entitlement.suspended",
		user=getattr(subscription, "user", None) or getattr(subscription, "member", None),
		tenant=getattr(subscription, "tenant", None),
		related_doctype="RBP Subscription",
		related_name=getattr(subscription, "name", None),
		message=f"Membership entitlements were updated to {inactive_status}.",
	)

	return {"action": "suspended", "entitlements": suspended}


def has_entitlement(app_key: str, user: str | None = None) -> bool:
	return user_has_entitlement(app_key, user=user)


def list_my_entitlements(user: str | None = None, include_inactive: bool = False) -> dict[str, object]:
	rows = get_user_entitlements(user=user, include_inactive=include_inactive)

	active_keys = sorted(
		row.get("app_key")
		for row in rows
		if row.get("enabled")
		and row.get("status") == "Active"
		and row.get("app_key") not in DISABLED_ENTITLEMENT_KEYS
	)

	return {
		"entitlements": rows,
		"active_keys": active_keys,
		"disabled_keys": sorted(DISABLED_ENTITLEMENT_KEYS),
	}


def admin_grant_entitlement(payload: dict[str, object] | str | None = None, **kwargs: object) -> dict[str, object]:
	require_system_manager()
	data = _coerce_payload(payload)
	data.update({key: value for key, value in kwargs.items() if value is not None})

	return {
		"ok": True,
		"entitlement": grant_entitlement(
			app_key=data.get("app_key"),
			user=data.get("user"),
			tenant=data.get("tenant"),
			entitlement_type=data.get("entitlement_type") or "Tenant",
			source_subscription=data.get("source_subscription"),
			starts_on=data.get("starts_on"),
			ends_on=data.get("ends_on"),
			plan_required=data.get("plan_required"),
			roles_allowed=data.get("roles_allowed"),
			notes=data.get("notes") or "Granted manually by admin.",
			visible_in_launcher=data.get("visible_in_launcher"),
		),
	}


def admin_revoke_entitlement(payload: dict[str, object] | str | None = None, **kwargs: object) -> dict[str, object]:
	require_system_manager()
	data = _coerce_payload(payload)
	data.update({key: value for key, value in kwargs.items() if value is not None})

	return {
		"ok": True,
		"revoked": revoke_entitlement(
			app_key=data.get("app_key"),
			user=data.get("user"),
			tenant=data.get("tenant"),
			source_subscription=data.get("source_subscription"),
			status=data.get("status") or "Suspended",
			notes=data.get("notes") or "Revoked manually by admin.",
		),
	}


def entitlement_catalog() -> dict[str, object]:
	return {
		"keys": sorted(ENTITLEMENT_CATALOG.keys()),
		"membership_keys": list(MEMBERSHIP_ENTITLEMENT_KEYS),
		"disabled_keys": sorted(DISABLED_ENTITLEMENT_KEYS),
		"catalog": ENTITLEMENT_CATALOG,
	}
