"""Lending adapter placeholder for future lending and finance integrations."""

from rbp_app.services.apps import is_app_installed


APP_KEY = "lending"

CAPABILITIES = [
    "loan_applications",
    "loan_accounts",
    "repayment_tracking",
    "borrower_management",
    "loan_documents",
    "payment_collection",
    "lending_reporting",
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
            "message": "Lending is not installed.",
        }

    return {
        "available": True,
        "app_key": APP_KEY,
        "actions": [
            "view_lending_summary",
            "open_lending",
        ],
        "message": "Lending actions are available as metadata only.",
    }


def get_summary(user=None):
    if not is_available(user):
        return _unavailable("Lending is not installed.")

    return {
        "available": True,
        "app_key": APP_KEY,
        "summary": {
            "loan_applications_count": None,
            "loan_accounts_count": None,
            "active_loans_count": None,
            "overdue_loans_count": None,
            "repayments_count": None,
        },
        "message": "Lending summary is not implemented yet.",
    }
