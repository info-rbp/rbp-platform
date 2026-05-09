"""Capability registry for the RBP platform layer.

This module defines the backend capability model for the RBP master application.

It intentionally stores metadata only. It does not execute workflows, write records,
send messages, create payments, call AI services, or import optional Frappe apps.

The registry allows rbp_app to understand:

- primary white-labelled app modules
- supporting backend capability providers
- reusable capability keys
- cross-app workflow metadata
- app-to-capability relationships
- capability-to-app relationships

Optional apps must never be hard imported here. Use installed-app checks instead.
"""

from __future__ import annotations

from copy import deepcopy
from typing import Any

import frappe


PRIMARY_MODULES: dict[str, dict[str, Any]] = {
	"erpnext": {
		"key": "erpnext",
		"label": "ERPNext",
		"module": "Operations",
		"category": "Operations",
		"source_app": "erpnext",
		"route": "/portal/apps/erpnext",
		"description": "Finance, accounting, inventory, purchasing, sales, projects and business operations.",
		"module_type": "Frappe App",
		"classification": "Primary white-labelled module",
		"capabilities": [
			"company_management",
			"customer_management",
			"supplier_management",
			"sales_orders",
			"purchase_orders",
			"sales_invoices",
			"purchase_invoices",
			"inventory_management",
			"item_management",
			"project_management",
			"task_management",
			"asset_management",
			"accounting",
			"tax_compliance",
		],
		"adapter": "erpnext",
	},
	"hrms": {
		"key": "hrms",
		"label": "Frappe HR",
		"module": "People",
		"category": "People",
		"source_app": "hrms",
		"route": "/portal/apps/hrms",
		"description": "Employees, leave, attendance, payroll, expenses and HR workflows.",
		"module_type": "Frappe App",
		"classification": "Primary white-labelled module",
		"capabilities": [
			"employee_management",
			"leave_management",
			"attendance_tracking",
			"payroll",
			"expense_claims",
			"recruitment",
			"performance_management",
			"shift_management",
			"employee_onboarding",
			"employee_documents",
		],
		"adapter": "hrms",
	},
	"lms": {
		"key": "lms",
		"label": "Learning",
		"module": "Learning",
		"category": "Learning",
		"source_app": "lms",
		"route": "/portal/apps/lms",
		"description": "Courses, lessons, training, enrolments and learning progress.",
		"module_type": "Frappe App",
		"classification": "Primary white-labelled module",
		"capabilities": [
			"course_management",
			"lesson_management",
			"batch_management",
			"enrolment_tracking",
			"learning_progress",
			"quizzes",
			"assignments",
			"training_paths",
			"certifications",
		],
		"adapter": "lms",
	},
	"insights": {
		"key": "insights",
		"label": "Insights",
		"module": "Analytics",
		"category": "Analytics",
		"source_app": "insights",
		"route": "/portal/apps/insights",
		"description": "Dashboards, reporting, analytics and cross-app data exploration.",
		"module_type": "Frappe App",
		"classification": "Primary white-labelled module and shared analytics provider",
		"capabilities": [
			"dashboards",
			"reports",
			"charts",
			"data_exploration",
			"cross_app_reporting",
			"kpi_tracking",
			"embedded_analytics",
			"analytics_events",
		],
		"adapter": "insights",
	},
	"crm": {
		"key": "crm",
		"label": "CRM",
		"module": "Sales",
		"category": "Sales",
		"source_app": "crm",
		"route": "/portal/apps/crm",
		"description": "Leads, deals, contacts, organisations and sales pipeline.",
		"module_type": "Frappe App",
		"classification": "Primary white-labelled module",
		"capabilities": [
			"lead_management",
			"deal_management",
			"pipeline_management",
			"contact_management",
			"organisation_management",
			"sales_activity_tracking",
			"customer_communication",
			"sales_documents",
			"sales_meetings",
		],
		"adapter": "crm",
	},
	"helpdesk": {
		"key": "helpdesk",
		"label": "Helpdesk",
		"module": "Support",
		"category": "Support",
		"source_app": "helpdesk",
		"route": "/portal/apps/helpdesk",
		"description": "Tickets, support queues, customer service and SLA workflows.",
		"module_type": "Frappe App",
		"classification": "Primary white-labelled module",
		"capabilities": [
			"ticket_management",
			"support_queues",
			"sla_tracking",
			"agent_assignment",
			"customer_support_portal",
			"ticket_attachments",
		],
		"adapter": "helpdesk",
	},
	"lending": {
		"key": "lending",
		"label": "Lending",
		"module": "Lending",
		"category": "Finance",
		"source_app": "lending",
		"route": "/portal/apps/lending",
		"description": "Loan applications, loan accounts, repayments and lending workflows.",
		"module_type": "Frappe App",
		"classification": "Primary specialist module",
		"capabilities": [
			"loan_applications",
			"loan_accounts",
			"repayment_tracking",
			"borrower_management",
			"loan_documents",
			"payment_collection",
			"lending_reporting",
		],
		"adapter": "lending",
	},
	"gameplan": {
		"key": "gameplan",
		"label": "Gameplan",
		"module": "Collaboration",
		"category": "Collaboration",
		"source_app": "gameplan",
		"route": "/portal/apps/gameplan",
		"description": "Projects, discussions, planning, teams and collaboration.",
		"module_type": "Frappe App",
		"classification": "Primary white-labelled module",
		"capabilities": [
			"team_collaboration",
			"project_discussions",
			"planning_boards",
			"team_notifications",
			"project_documents",
		],
		"adapter": "gameplan",
	},
	"drive": {
		"key": "drive",
		"label": "Drive",
		"module": "Documents",
		"category": "Documents",
		"source_app": "drive",
		"route": "/portal/apps/drive",
		"description": "Files, folders, document storage, document sharing and attachments.",
		"module_type": "Frappe App",
		"classification": "Primary white-labelled module and shared document provider",
		"capabilities": [
			"file_storage",
			"folder_management",
			"document_upload",
			"document_download",
			"document_sharing",
			"record_attachments",
			"document_permissions",
			"client_document_exchange",
		],
		"adapter": "drive",
	},
}


SUPPORTING_CAPABILITIES: dict[str, dict[str, Any]] = {
	"payments": {
		"key": "payments",
		"label": "Payments",
		"category": "Finance",
		"source_app": "payments",
		"classification": "Supporting backend service",
		"description": "Payment requests, payment providers, payment records and billing support.",
		"capabilities": [
			"payment_requests",
			"payment_providers",
			"payment_collection",
			"payment_status_tracking",
		],
		"used_by": ["billing", "erpnext", "lending", "webshop", "subscriptions"],
	},
	"mail": {
		"key": "mail",
		"label": "Mail",
		"category": "Communications",
		"source_app": "mail",
		"classification": "Supporting backend service",
		"description": "Email sending, receiving, threading and communication history.",
		"capabilities": [
			"email_send",
			"email_receive",
			"email_threading",
			"transactional_email",
		],
		"used_by": ["crm", "helpdesk", "hrms", "lms", "billing", "lending", "gameplan"],
	},
	"frappe_whatsapp": {
		"key": "frappe_whatsapp",
		"label": "Frappe WhatsApp",
		"category": "Communications",
		"source_app": "frappe_whatsapp",
		"classification": "Supporting backend service",
		"description": "WhatsApp messages, templates and notifications.",
		"capabilities": [
			"whatsapp_send",
			"whatsapp_templates",
			"whatsapp_notifications",
		],
		"used_by": ["crm", "helpdesk", "hrms", "lending", "billing"],
	},
	"telephony": {
		"key": "telephony",
		"label": "Telephony",
		"category": "Communications",
		"source_app": "telephony",
		"classification": "Supporting backend service",
		"description": "Call handling, call logging and phone workflow support.",
		"capabilities": [
			"call_logging",
			"phone_workflows",
			"customer_calls",
		],
		"used_by": ["crm", "helpdesk"],
	},
	"meet": {
		"key": "meet",
		"label": "Meet",
		"category": "Communications",
		"source_app": "meet",
		"classification": "Supporting backend service",
		"description": "Video meetings and meeting links.",
		"capabilities": [
			"video_meetings",
			"meeting_links",
			"meeting_rooms",
		],
		"used_by": ["crm", "helpdesk", "lms", "gameplan", "hrms"],
	},
	"wiki": {
		"key": "wiki",
		"label": "Wiki",
		"category": "Knowledge",
		"source_app": "wiki",
		"classification": "Supporting backend service",
		"description": "Knowledge base, SOPs, help articles and internal documentation.",
		"capabilities": [
			"knowledge_base",
			"articles",
			"sops",
			"help_content",
		],
		"used_by": ["helpdesk", "lms", "hrms", "support", "internal_admin"],
	},
	"newsletter": {
		"key": "newsletter",
		"label": "Newsletter",
		"category": "Communications",
		"source_app": "newsletter",
		"classification": "Supporting backend service",
		"description": "Broadcasts, newsletters and campaign messaging.",
		"capabilities": [
			"broadcast_messaging",
			"campaigns",
			"subscriber_lists",
		],
		"used_by": ["crm", "lms", "marketing"],
	},
	"blog": {
		"key": "blog",
		"label": "Blog",
		"category": "Website",
		"source_app": "blog",
		"classification": "Supporting content service",
		"description": "Content publishing and articles.",
		"capabilities": [
			"content_publishing",
			"articles",
			"public_content",
		],
		"used_by": ["marketing", "lms", "public_website"],
	},
	"webshop": {
		"key": "webshop",
		"label": "Webshop",
		"category": "Commerce",
		"source_app": "webshop",
		"classification": "Supporting commerce service",
		"description": "Ecommerce storefront and online selling.",
		"capabilities": [
			"storefront",
			"cart",
			"products",
			"orders",
			"customer_checkout",
		],
		"used_by": ["erpnext", "payments", "crm"],
	},
	"ecommerce_integrations": {
		"key": "ecommerce_integrations",
		"label": "Ecommerce Integrations",
		"category": "Commerce",
		"source_app": "ecommerce_integrations",
		"classification": "Supporting commerce integration service",
		"description": "External commerce platform integration and sync.",
		"capabilities": [
			"commerce_sync",
			"external_orders",
			"external_products",
		],
		"used_by": ["erpnext", "webshop"],
	},
	"education": {
		"key": "education",
		"label": "Education",
		"category": "Learning",
		"source_app": "education",
		"classification": "Supporting specialist education service",
		"description": "Academic, student and institution workflows.",
		"capabilities": [
			"student_management",
			"academic_management",
			"course_programmes",
		],
		"used_by": ["lms", "education_clients"],
	},
	"ff_assignment_portal": {
		"key": "ff_assignment_portal",
		"label": "Assignment Portal",
		"category": "Learning",
		"source_app": "ff_assignment_portal",
		"classification": "Supporting learning service",
		"description": "Assignments, submissions and learner work tracking.",
		"capabilities": [
			"assignments",
			"submissions",
			"learning_tasks",
		],
		"used_by": ["lms", "education"],
	},
	"fc_saas_helper": {
		"key": "fc_saas_helper",
		"label": "Frappe SaaS Helper",
		"category": "Platform",
		"source_app": "fc_saas_helper",
		"classification": "Supporting SaaS infrastructure service",
		"description": "SaaS account lifecycle and provisioning support.",
		"capabilities": [
			"saas_provisioning",
			"account_lifecycle",
			"tenant_support",
		],
		"used_by": ["tenancy", "billing", "subscriptions"],
	},
	"frappe_openai_integration": {
		"key": "frappe_openai_integration",
		"label": "OpenAI Integration",
		"category": "AI",
		"source_app": "frappe_openai_integration",
		"classification": "Supporting AI service",
		"description": "AI-powered drafting, summarisation and assistant workflows.",
		"capabilities": [
			"text_summarisation",
			"draft_generation",
			"document_summarisation",
			"ticket_reply_suggestions",
			"lead_summary",
			"workflow_recommendations",
		],
		"used_by": ["crm", "helpdesk", "hrms", "lms", "drive", "lending"],
	},
	"erpnext_australian_localisation": {
		"key": "erpnext_australian_localisation",
		"label": "ERPNext Australian Localisation",
		"category": "Operations",
		"source_app": "erpnext_australian_localisation",
		"classification": "Supporting regional compliance service",
		"description": "Australian accounting, tax and regional compliance support.",
		"capabilities": [
			"regional_localisation",
			"tax_compliance",
			"accounting_support",
		],
		"used_by": ["erpnext", "billing"],
	},
}


CROSS_APP_WORKFLOWS: dict[str, dict[str, Any]] = {
	"employee_onboarding": {
		"key": "employee_onboarding",
		"label": "Employee Onboarding",
		"category": "People",
		"primary_app": "hrms",
		"description": "Coordinate HRMS, Learning, Drive, Mail, Gameplan and Insights for employee onboarding.",
		"required_apps": ["hrms", "lms", "drive"],
		"optional_apps": ["mail", "gameplan", "insights"],
		"required_capabilities": [
			"employee_management",
			"employee_onboarding",
			"course_management",
			"file_storage",
		],
		"optional_capabilities": [
			"email_send",
			"team_collaboration",
			"analytics_events",
		],
	},
	"sales_follow_up": {
		"key": "sales_follow_up",
		"label": "CRM Sales Follow-Up",
		"category": "Sales",
		"primary_app": "crm",
		"description": "Coordinate CRM, Mail, WhatsApp, Meet, Drive, Insights and ERPNext for sales follow-up.",
		"required_apps": ["crm"],
		"optional_apps": ["mail", "frappe_whatsapp", "meet", "drive", "insights", "erpnext"],
		"required_capabilities": [
			"lead_management",
			"deal_management",
			"customer_communication",
		],
		"optional_capabilities": [
			"email_send",
			"whatsapp_send",
			"meeting_links",
			"file_storage",
			"analytics_events",
			"customer_management",
		],
	},
	"support_ticket_resolution": {
		"key": "support_ticket_resolution",
		"label": "Helpdesk Ticket Resolution",
		"category": "Support",
		"primary_app": "helpdesk",
		"description": "Coordinate Helpdesk, Mail, Drive, Wiki, AI, Insights and Meet for ticket resolution.",
		"required_apps": ["helpdesk"],
		"optional_apps": ["mail", "drive", "wiki", "frappe_openai_integration", "insights", "meet"],
		"required_capabilities": [
			"ticket_management",
			"support_queues",
		],
		"optional_capabilities": [
			"support_email",
			"file_storage",
			"knowledge_base",
			"ticket_reply_suggestions",
			"analytics_events",
			"video_meetings",
		],
	},
	"lending_application_processing": {
		"key": "lending_application_processing",
		"label": "Lending Application Processing",
		"category": "Finance",
		"primary_app": "lending",
		"description": "Coordinate Lending, ERPNext, Payments, Drive, Mail, WhatsApp, Insights and AI for loan application processing.",
		"required_apps": ["lending", "drive"],
		"optional_apps": ["erpnext", "payments", "mail", "frappe_whatsapp", "insights", "frappe_openai_integration"],
		"required_capabilities": [
			"loan_applications",
			"borrower_management",
			"file_storage",
		],
		"optional_capabilities": [
			"customer_management",
			"payment_collection",
			"email_send",
			"whatsapp_send",
			"analytics_events",
			"document_summarisation",
		],
	},
	"project_collaboration_workspace": {
		"key": "project_collaboration_workspace",
		"label": "Project Collaboration Workspace",
		"category": "Collaboration",
		"primary_app": "gameplan",
		"description": "Coordinate Gameplan, Drive, Meet, Mail, Insights, CRM, ERPNext and Helpdesk for project workspaces.",
		"required_apps": ["gameplan", "drive"],
		"optional_apps": ["meet", "mail", "insights", "crm", "erpnext", "helpdesk"],
		"required_capabilities": [
			"team_collaboration",
			"project_documents",
			"file_storage",
		],
		"optional_capabilities": [
			"meeting_links",
			"email_send",
			"analytics_events",
			"customer_management",
			"project_management",
			"ticket_management",
		],
	},
	"document_attachment_exchange": {
		"key": "document_attachment_exchange",
		"label": "Document Attachment and Exchange",
		"category": "Documents",
		"primary_app": "drive",
		"description": "Provide a standard way for primary modules to attach, retrieve and share files through Drive.",
		"required_apps": ["drive"],
		"optional_apps": ["erpnext", "hrms", "crm", "helpdesk", "lending", "lms", "gameplan"],
		"required_capabilities": [
			"file_storage",
			"document_upload",
			"record_attachments",
			"document_permissions",
		],
		"optional_capabilities": [
			"customer_management",
			"employee_management",
			"deal_management",
			"ticket_management",
			"loan_documents",
			"course_management",
			"team_collaboration",
		],
	},
	"subscription_entitlement_sync": {
		"key": "subscription_entitlement_sync",
		"label": "Subscription and App Entitlement Sync",
		"category": "Platform",
		"primary_app": "rbp_app",
		"description": "Synchronise billing and subscription state with app entitlements.",
		"required_apps": ["rbp_app"],
		"optional_apps": ["payments", "erpnext", "mail"],
		"required_capabilities": [
			"subscription_management",
			"app_entitlements",
			"tenant_access_control",
		],
		"optional_capabilities": [
			"payment_status_tracking",
			"customer_management",
			"email_send",
		],
	},
}


def _copy(value: Any) -> Any:
	"""Return a defensive copy of registry metadata."""

	return deepcopy(value)


def normalize_key(value: str | None) -> str:
	"""Normalise app, capability and workflow keys."""

	return (value or "").strip().lower()


def get_installed_app_names() -> set[str]:
	"""Return installed app names for availability checks.

	This function must fail safely because it can run in tests or contexts where
	Frappe may not have a fully bound site.
	"""

	try:
		return {app.lower() for app in frappe.get_installed_apps()}
	except Exception:
		return set()


def is_app_installed(app_key: str | None) -> bool:
	"""Return whether an app is installed on the current site."""

	normalised_key = normalize_key(app_key)
	if not normalised_key:
		return False
	return normalised_key in get_installed_app_names()


def get_primary_modules() -> dict[str, dict[str, Any]]:
	"""Return primary white-labelled module metadata."""

	return _copy(PRIMARY_MODULES)


def get_supporting_capabilities() -> dict[str, dict[str, Any]]:
	"""Return supporting app capability metadata."""

	return _copy(SUPPORTING_CAPABILITIES)


def get_cross_app_workflows() -> dict[str, dict[str, Any]]:
	"""Return cross-app workflow metadata."""

	return _copy(CROSS_APP_WORKFLOWS)


def get_capability_registry() -> dict[str, Any]:
	"""Return the full RBP capability registry."""

	return {
		"primary_modules": get_primary_modules(),
		"supporting_capabilities": get_supporting_capabilities(),
		"cross_app_workflows": get_cross_app_workflows(),
	}


def get_capabilities_for_app(app_key: str | None) -> list[str]:
	"""Return capabilities provided by a primary or supporting app."""

	normalised_key = normalize_key(app_key)
	if not normalised_key:
		return []

	if normalised_key in PRIMARY_MODULES:
		return list(PRIMARY_MODULES[normalised_key].get("capabilities") or [])

	if normalised_key in SUPPORTING_CAPABILITIES:
		return list(SUPPORTING_CAPABILITIES[normalised_key].get("capabilities") or [])

	return []


def get_apps_for_capability(capability_key: str | None) -> list[str]:
	"""Return app keys that provide a capability."""

	normalised_key = normalize_key(capability_key)
	if not normalised_key:
		return []

	apps: list[str] = []

	for app_key, metadata in PRIMARY_MODULES.items():
		if normalised_key in metadata.get("capabilities", []):
			apps.append(app_key)

	for app_key, metadata in SUPPORTING_CAPABILITIES.items():
		if normalised_key in metadata.get("capabilities", []):
			apps.append(app_key)

	return apps


def get_workflows_for_app(app_key: str | None) -> list[dict[str, Any]]:
	"""Return workflow metadata involving an app."""

	normalised_key = normalize_key(app_key)
	if not normalised_key:
		return []

	workflows = []

	for workflow in CROSS_APP_WORKFLOWS.values():
		apps = {workflow.get("primary_app")}
		apps.update(workflow.get("required_apps") or [])
		apps.update(workflow.get("optional_apps") or [])

		if normalised_key in apps:
			workflows.append(_copy(workflow))

	return workflows


def get_app_availability(app_key: str | None) -> dict[str, Any]:
	"""Return safe app availability metadata for registry consumers."""

	normalised_key = normalize_key(app_key)
	if not normalised_key:
		return {
			"available": False,
			"app_key": "",
			"installed": False,
			"message": "No app key was provided.",
		}

	return {
		"available": is_app_installed(normalised_key),
		"app_key": normalised_key,
		"installed": is_app_installed(normalised_key),
		"message": (
			f"{normalised_key} is installed."
			if is_app_installed(normalised_key)
			else f"{normalised_key} is not installed."
		),
	}


def get_registry_status() -> dict[str, Any]:
	"""Return a lightweight status summary for diagnostics."""

	installed_apps = get_installed_app_names()

	return {
		"ok": True,
		"primary_module_count": len(PRIMARY_MODULES),
		"supporting_capability_count": len(SUPPORTING_CAPABILITIES),
		"cross_app_workflow_count": len(CROSS_APP_WORKFLOWS),
		"installed_primary_modules": sorted(app for app in PRIMARY_MODULES if app in installed_apps),
		"missing_primary_modules": sorted(app for app in PRIMARY_MODULES if app not in installed_apps),
	}