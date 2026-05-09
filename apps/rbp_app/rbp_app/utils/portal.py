"""Backward-compatible wrappers for legacy portal route guard imports."""

from rbp_app import guards


def redirect_to_login(path):
    return guards.redirect_guest_to_login(path)


def protect_portal_routes(context):
    """Require login for all RBP portal shell routes.

    This keeps portal gating aligned with Frappe's native website permission
    flow without introducing a custom auth system.
    """

    return guards.protect_platform_routes(context)


def protect_admin_routes(context):
    """Keep the temporary RBP admin scaffold behind System Manager access."""

    return guards.protect_admin_routes(context)
