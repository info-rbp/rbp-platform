"""Helpdesk adapter placeholder for future support integrations."""

from rbp_app.services.apps import is_app_installed


APP_KEY = "helpdesk"

CAPABILITIES = [
    "ticket_management",
    "support_queues",
    "sla_tracking",
    "agent_assignment",
    "customer_support_portal",
    "ticket_attachments",
]


def _unavailable(message):
    return {
        "available": False,
        "app_key": APP_KEY,
        "summary": {},
        "message": message,
    }


def is_available(user=None):
    return is_app_installed(APP_KEY)


def get_capabilities(user=None):
    return {
        "available": is_available(user),
        "app_key": APP_KEY,
        "capabilities": list(CAPABILITIES),
    }


def get_allowed_actions(user=None):
    if not is_available(user):
        return {
            "available": False,
            "app_key": APP_KEY,
            "actions": [],
            "message": "Helpdesk is not installed.",
        }

    return {
        "available": True,
        "app_key": APP_KEY,
        "actions": [
            "view_ticket_summary",
            "open_helpdesk",
        ],
        "message": "Helpdesk actions are available as metadata only.",
    }


def get_summary(user=None):
    if not is_available(user):
        return _unavailable("Helpdesk is not installed.")

    return {
        "available": True,
        "app_key": APP_KEY,
        "summary": {
            "tickets_count": None,
            "open_tickets_count": None,
            "resolved_tickets_count": None,
            "overdue_tickets_count": None,
            "high_priority_tickets_count": None,
        },
        "message": "Helpdesk summary is not implemented yet.",
    }
