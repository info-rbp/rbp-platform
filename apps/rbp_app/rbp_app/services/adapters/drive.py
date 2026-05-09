"""Drive adapter placeholder for future document and file integrations."""

from rbp_app.services.apps import is_app_installed


APP_KEY = "drive"

CAPABILITIES = [
    "file_storage",
    "folder_management",
    "document_upload",
    "document_download",
    "document_sharing",
    "record_attachments",
    "document_permissions",
    "client_document_exchange",
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
            "message": "Drive is not installed.",
        }

    return {
        "available": True,
        "app_key": APP_KEY,
        "actions": [
            "view_document_summary",
            "open_drive",
        ],
        "message": "Drive actions are available as metadata only.",
    }


def get_summary(user=None):
    if not is_available(user):
        return _unavailable("Drive is not installed.")

    return {
        "available": True,
        "app_key": APP_KEY,
        "summary": {
            "files_count": None,
            "folders_count": None,
            "recent_files_count": None,
            "shared_files_count": None,
        },
        "message": "Drive summary is not implemented yet.",
    }
