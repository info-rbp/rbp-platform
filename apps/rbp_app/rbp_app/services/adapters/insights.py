"""Insights adapter placeholder for future analytics integrations."""

from rbp_app.services.apps import is_app_installed


APP_KEY = "insights"

CAPABILITIES = [
    "dashboards",
    "reports",
    "charts",
    "data_exploration",
    "cross_app_reporting",
    "kpi_tracking",
    "embedded_analytics",
    "analytics_events",
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
            "message": "Insights is not installed.",
        }

    return {
        "available": True,
        "app_key": APP_KEY,
        "actions": [
            "view_analytics_summary",
            "open_insights",
        ],
        "message": "Insights actions are available as metadata only.",
    }


def get_summary(user=None):
    if not is_available(user):
        return _unavailable("Insights is not installed.")

    return {
        "available": True,
        "app_key": APP_KEY,
        "summary": {
            "dashboards_count": None,
            "reports_count": None,
            "charts_count": None,
        },
        "message": "Insights summary is not implemented yet.",
    }
