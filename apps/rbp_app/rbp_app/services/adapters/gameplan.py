"""Gameplan adapter placeholder for future collaboration integrations."""

from rbp_app.services.apps import is_app_installed


APP_KEY = "gameplan"

CAPABILITIES = [
    "team_collaboration",
    "project_discussions",
    "planning_boards",
    "team_notifications",
    "project_documents",
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
            "message": "Gameplan is not installed.",
        }

    return {
        "available": True,
        "app_key": APP_KEY,
        "actions": [
            "view_collaboration_summary",
            "open_gameplan",
        ],
        "message": "Gameplan actions are available as metadata only.",
    }


def get_summary(user=None):
    if not is_available(user):
        return _unavailable("Gameplan is not installed.")

    return {
        "available": True,
        "app_key": APP_KEY,
        "summary": {
            "projects_count": None,
            "discussions_count": None,
            "teams_count": None,
            "open_items_count": None,
        },
        "message": "Gameplan summary is not implemented yet.",
    }
