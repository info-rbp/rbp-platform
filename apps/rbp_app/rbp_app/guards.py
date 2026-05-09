"""Website route guards for the RBP platform layer.

Website navigation protection happens here through Frappe's
``before_request`` and ``update_website_context`` hooks. API protection still
happens inside each whitelisted API method with helpers from
``rbp_app.permissions``.

``/portal`` and ``/app`` are customer-facing protected routes. ``/desk``
remains Frappe's backend/admin surface, while the RBP ``/admin`` scaffold is
restricted to Administrator/System Manager users.
"""

from urllib.parse import urlencode

import frappe
from frappe.exceptions import Redirect
from werkzeug.exceptions import HTTPException

from rbp_app.permissions import is_admin_user as user_is_admin_user
from rbp_app.services.apps import get_available_app_cards, group_app_cards_by_category


CUSTOMER_ROUTE_PREFIXES = ("portal", "app")
ADMIN_ROUTE_PREFIXES = ("admin", "desk")
RBP_HOME_ROUTE = "index"


class TemporaryRedirect(HTTPException):
	"""Small HTTP redirect exception for early request hooks."""

	code = 302

	def __init__(self, location):
		super().__init__()
		self.location = location

	def get_headers(self, environ=None, scope=None):
		return [("Location", self.location), ("Content-Type", "text/html; charset=utf-8")]


def get_request_path():
	"""Return the current website request path without leading/trailing slashes."""

	path = getattr(frappe.local, "path", "") or ""
	if not path and getattr(frappe.local, "request", None):
		path = getattr(frappe.local.request, "path", "") or ""
	return path.strip("/")


def is_guest():
	"""Return whether the current request is from a guest session."""

	return getattr(frappe.session, "user", "Guest") == "Guest"


def redirect_guest_to_login(path=None):
	"""Redirect a guest to login with the original route as redirect target."""

	path = path if path is not None else get_request_path()
	frappe.flags.redirect_location = get_login_redirect_url(path)
	raise Redirect(302)


def get_login_redirect_url(path=None):
	"""Return the login URL preserving the originally requested path."""

	path = path if path is not None else get_request_path()
	target = f"/{path.lstrip('/')}" if path else "/portal"
	return f"/login?{urlencode({'redirect-to': target})}"


def is_admin_user(user=None):
	"""Return whether the supplied or current user may access admin routes."""

	user = user or getattr(frappe.session, "user", "Guest")
	return user_is_admin_user(user)


def _path_from_context(context):
	return (getattr(context, "path", None) or get_request_path()).strip("/")


def _matches_path(path, prefixes):
	return any(path == prefix or path.startswith(f"{prefix}/") for prefix in prefixes)


def _is_customer_route(path):
	return _matches_path(path, CUSTOMER_ROUTE_PREFIXES)


def _is_admin_route(path):
	return _matches_path(path, ADMIN_ROUTE_PREFIXES)


def protect_platform_request():
	"""Protect platform routes before Frappe website redirects are resolved.

	The website context guard only runs after a route has resolved. This request
	guard catches protected prefixes such as ``/app`` and ``/portal/apps/<key>``
	before core redirects or 404 handling can bypass the RBP platform rules.
	"""

	path = get_request_path()
	if not path:
		# Mail installs a global "/" -> "/mail" website redirect.
		# RBP owns the public entry point, so intercept root before
		# Frappe website redirects are resolved.
		raise TemporaryRedirect(f"/{RBP_HOME_ROUTE}")

	if _is_customer_route(path):
		if is_guest():
			raise TemporaryRedirect(get_login_redirect_url(path))

		if path == "app":
			raise TemporaryRedirect("/portal")

		if path.startswith("app/"):
			app_key = path.split("/", 1)[1]
			raise TemporaryRedirect(f"/portal/apps/{app_key}")

	if _is_admin_route(path):
		if is_guest():
			raise TemporaryRedirect(get_login_redirect_url(path))

		if not is_admin_user():
			raise frappe.PermissionError


def protect_portal_routes(context):
	"""Require login for customer-facing RBP portal/app routes."""

	path = _path_from_context(context)
	if not _is_customer_route(path):
		return context

	context.no_cache = 1
	if is_guest():
		redirect_guest_to_login(path)

	try:
		app_cards = get_available_app_cards(getattr(frappe.session, "user", None))
	except Exception:
		app_cards = []

	context.portal_available_apps = app_cards
	context.portal_apps_by_category = group_app_cards_by_category(app_cards)

	return context


def protect_admin_routes(context):
	"""Require Administrator/System Manager for RBP admin and Frappe Desk routes."""

	path = _path_from_context(context)
	if not _is_admin_route(path):
		return context

	context.no_cache = 1
	if is_guest():
		redirect_guest_to_login(path)

	if not is_admin_user():
		raise frappe.PermissionError

	return context


def protect_platform_routes(context):
	"""Protect all RBP customer/admin platform website routes."""

	protect_portal_routes(context)
	protect_admin_routes(context)
	return context
