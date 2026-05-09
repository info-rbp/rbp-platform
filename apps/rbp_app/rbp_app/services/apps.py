"""Application entitlement and discovery services for installed Frappe apps."""

import frappe

from rbp_app.permissions import is_admin_user
from rbp_app.services.tenancy import doctype_exists, get_current_tenant_name


APP_CATEGORIES = (
	"Platform",
	"People",
	"Finance",
	"Sales",
	"Learning",
	"Support",
	"Analytics",
	"Documents",
	"Website",
	"Commerce",
	"Operations",
	"Knowledge",
	"Other",
)

KNOWN_APP_METADATA = {
	"frappe": {
		"label": "Frappe Core",
		"category": "Platform",
		"route": "/portal/apps/frappe",
		"description": "Framework, users, roles, permissions and system tools",
	},
	"erpnext": {
		"label": "ERPNext",
		"category": "Operations",
		"route": "/portal/apps/erpnext",
		"description": "ERP, company operations, finance and business management",
	},
	"hrms": {
		"label": "HRMS",
		"category": "People",
		"route": "/portal/apps/hrms",
		"description": "Employees, leave, attendance and payroll",
	},
	"crm": {
		"label": "CRM",
		"category": "Sales",
		"route": "/portal/apps/crm",
		"description": "Leads, deals, customers and sales pipeline",
	},
	"lms": {
		"label": "Learning",
		"category": "Learning",
		"route": "/portal/apps/lms",
		"description": "Courses, lessons and learning management",
	},
	"helpdesk": {
		"label": "Helpdesk",
		"category": "Support",
		"route": "/portal/apps/helpdesk",
		"description": "Tickets, support queues and customer service",
	},
	"insights": {
		"label": "Insights",
		"category": "Analytics",
		"route": "/portal/apps/insights",
		"description": "Analytics, dashboards and reporting",
	},
	"builder": {
		"label": "Builder",
		"category": "Website",
		"route": "/portal/apps/builder",
		"description": "Website and page builder tools",
	},
	"drive": {
		"label": "Drive",
		"category": "Documents",
		"route": "/portal/apps/drive",
		"description": "Files, folders and document storage",
	},
	"wiki": {
		"label": "Wiki",
		"category": "Knowledge",
		"route": "/portal/apps/wiki",
		"description": "Knowledge base and documentation",
	},
	"payments": {
		"label": "Payments",
		"category": "Finance",
		"route": "/portal/apps/payments",
		"description": "Payment processing and billing operations",
	},
	"webshop": {
		"label": "Webshop",
		"category": "Commerce",
		"route": "/portal/apps/webshop",
		"description": "Online store and ecommerce operations",
	},
}


def get_installed_app_names():
	"""Return installed app names normalized for capability checks."""

	try:
		return {app.lower() for app in frappe.get_installed_apps()}
	except Exception:
		return set()


def is_app_installed(app_name):
	"""Return whether an app is installed on the current site."""

	return app_name.lower() in get_installed_app_names()


def _readable_app_label(app_name):
	return app_name.replace("_", " ").replace("-", " ").title()


def get_known_app_metadata(app_name):
	"""Return first-class metadata for a known Frappe app, if available."""

	metadata = KNOWN_APP_METADATA.get(app_name.lower())
	return dict(metadata) if metadata else None


def get_generic_app_metadata(app_name):
	"""Return generic metadata for an unknown installed Frappe app."""

	app_key = app_name.lower()
	label = _readable_app_label(app_key)
	return {
		"label": label,
		"category": "Other",
		"route": f"/portal/apps/{app_key}",
		"description": f"{label} app capabilities",
	}


def _frappe_app_card(app_name):
	app_key = app_name.lower()
	metadata = get_known_app_metadata(app_key) or get_generic_app_metadata(app_key)
	return {
		"key": app_key,
		"label": metadata["label"],
		"description": metadata["description"],
		"route": metadata["route"],
		"enabled": True,
		"source_app": app_key,
		"category": metadata["category"],
		"module_type": "Frappe App",
	}


def _platform_module_card(key, label, description, route, category):
	return {
		"key": key,
		"label": label,
		"description": description,
		"route": route,
		"enabled": True,
		"source_app": "rbp_app",
		"category": category,
		"module_type": "RBP Platform Module",
	}


def _get_user_tenant(user=None):
	return get_current_tenant_name(user)


def _entitlement_records_exist():
	if not doctype_exists("RBP App Entitlement"):
		return False

	try:
		return frappe.db.count("RBP App Entitlement") > 0
	except Exception:
		return False


def _get_entitlement_rows(user=None):
	if not _entitlement_records_exist():
		return []

	fields = [
		"tenant",
		"app_key",
		"app_label",
		"source_app",
		"app_category",
		"module_type",
		"enabled",
		"visible_in_launcher",
		"route",
		"roles_allowed",
		"plan_required",
	]
	tenant = _get_user_tenant(user)

	try:
		rows = frappe.get_all(
			"RBP App Entitlement",
			filters={"visible_in_launcher": 1},
			fields=fields,
			order_by="app_category asc, app_label asc",
		)
	except Exception:
		return []

	if not tenant:
		return [row for row in rows if not row.get("tenant")]

	return [row for row in rows if not row.get("tenant") or row.get("tenant") == tenant]


def _entitlement_card(row):
	app_key = (row.get("app_key") or row.get("source_app") or "").lower()
	source_app = (row.get("source_app") or app_key or "rbp_app").lower()
	metadata = get_known_app_metadata(app_key) or get_known_app_metadata(source_app) or get_generic_app_metadata(app_key)
	module_type = row.get("module_type") or "Frappe App"
	enabled = bool(row.get("enabled"))

	if module_type == "Frappe App" and source_app:
		enabled = enabled and is_app_installed(source_app)

	return {
		"key": app_key,
		"label": row.get("app_label") or metadata["label"],
		"description": metadata["description"],
		"route": row.get("route") or metadata["route"],
		"enabled": enabled,
		"source_app": source_app,
		"category": row.get("app_category") or metadata["category"] or "Other",
		"module_type": module_type,
		"roles_allowed": row.get("roles_allowed"),
		"plan_required": row.get("plan_required"),
	}


def get_available_app_cards(user=None):
	"""Build portal app cards from installed apps and enabled RBP modules."""

	entitlement_rows = _get_entitlement_rows(user)
	if entitlement_rows:
		cards = [_entitlement_card(row) for row in entitlement_rows]
		if not is_admin_user(user):
			cards = [card for card in cards if card["key"] != "billing"]
		return cards

	installed_apps = get_installed_app_names()
	cards = [_frappe_app_card(app_name) for app_name in sorted(installed_apps)]
	cards.extend(get_enabled_platform_modules(user))
	return cards


def get_enabled_platform_modules(user=None):
	"""Return RBP-owned platform module cards for the current user."""

	modules = [
		_platform_module_card(
			key="documents",
			label="Documents",
			description="RBP documents, files and resources",
			route="/portal/apps/documents",
			category="Documents",
		),
		_platform_module_card(
			key="notifications",
			label="Notifications",
			description="Portal alerts, updates and activity notifications",
			route="/portal/apps/notifications",
			category="Platform",
		),
	]

	if is_admin_user(user):
		modules.append(
			_platform_module_card(
				key="billing",
				label="Billing",
				description="Billing, subscription and payment placeholders",
				route="/portal/apps/billing",
				category="Finance",
			)
		)

	return modules


def group_app_cards_by_category(cards):
	"""Group app cards by the platform category taxonomy."""

	grouped = {category: [] for category in APP_CATEGORIES}

	for card in cards or []:
		category = card.get("category") or "Other"
		if category not in grouped:
			category = "Other"
		grouped[category].append(card)

	return {category: items for category, items in grouped.items() if items}
