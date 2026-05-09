"""Portal app detail context for /portal/apps/<app_key>."""

import frappe

from rbp_app.api.integrations import get_app_summary
from rbp_app.permissions import require_login
from rbp_app.services.apps import get_available_app_cards, get_known_app_metadata


HRMS_SUMMARY_CARDS = (
    ("employees_count", "Employees"),
    ("leave_applications_count", "Leave Applications"),
    ("attendance_count", "Attendance Records"),
    ("expense_claims_count", "Expense Claims"),
    ("salary_slips_count", "Salary Slips"),
)

HRMS_ACTION_LINKS = (
    {"label": "HR Workspace", "route": "/app/hr"},
    {"label": "Employees", "route": "/app/employee"},
    {"label": "Leave Applications", "route": "/app/leave-application"},
    {"label": "Attendance", "route": "/app/attendance"},
    {"label": "Expense Claims", "route": "/app/expense-claim"},
    {"label": "Salary Slips", "route": "/app/salary-slip"},
)


def _get_app_key():
    """Return the app key from route params, form data, or request path."""

    route_options = getattr(frappe.local, "route_options", None) or {}
    form_dict = getattr(frappe.local, "form_dict", None) or {}

    app_key = route_options.get("app_key") or form_dict.get("app_key")
    if app_key:
        return str(app_key).strip().lower()

    request = getattr(frappe.local, "request", None)
    path = getattr(request, "path", "") or ""
    marker = "/portal/apps/"
    if marker in path:
        return path.split(marker, 1)[1].strip("/").split("/")[0].lower()

    return ""


def _find_app_card(app_key, user):
    """Find the app card visible to the current user."""

    for card in get_available_app_cards(user):
        if card.get("key") == app_key:
            return card
    return None


def _hrms_fallback_card():
    metadata = get_known_app_metadata("hrms") or {}
    return {
        "key": "hrms",
        "label": metadata.get("label") or "HRMS",
        "description": metadata.get("description") or "Employees, leave, attendance and payroll",
        "route": metadata.get("route") or "/portal/apps/hrms",
        "enabled": False,
        "source_app": "hrms",
        "category": metadata.get("category") or "People",
        "module_type": "Frappe App",
    }


def _get_hrms_summary_cards(app_summary):
    summary = (app_summary or {}).get("summary") or {}
    return [
        {
            "key": key,
            "label": label,
            "value": summary.get(key, 0),
        }
        for key, label in HRMS_SUMMARY_CARDS
        if key in summary
    ]


def get_context(context):
    """Build context for a dedicated portal app detail page."""

    user = require_login()
    app_key = _get_app_key()
    app_card = _find_app_card(app_key, user)
    is_hrms_detail = app_key == "hrms"

    if app_card or is_hrms_detail:
        app_card = app_card or _hrms_fallback_card()
        app_summary = get_app_summary(app_key)
    else:
        app_summary = {
            "available": False,
            "app_key": app_key,
            "summary": {},
            "message": "This app is not available for the current user.",
        }

    context.no_cache = 1
    context.app_key = app_key
    context.app_card = app_card
    context.app_summary = app_summary
    context.is_hrms_detail = is_hrms_detail
    context.hrms_summary_cards = _get_hrms_summary_cards(app_summary) if is_hrms_detail else []
    context.hrms_action_links = HRMS_ACTION_LINKS if is_hrms_detail and app_summary.get("available") else []
    return context
