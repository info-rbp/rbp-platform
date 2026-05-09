app_name = "rbp_app"
app_title = "Remote Business Partner"
app_publisher = "Remote Business Partner"
app_description = "RBP custom application shell - public website, portal, and admin scaffold"
app_email = "dev@rbp.example.com"
app_license = "MIT"

# ---------------------------------------------------------------------------
# Required apps
# ---------------------------------------------------------------------------
required_apps = ["frappe"]

# ---------------------------------------------------------------------------
# Website assets
# ---------------------------------------------------------------------------
# Do not inject RBP assets globally through web_include_css/web_include_js.
# Global website assets also affect native Frappe pages such as /login.
# RBP-owned shell templates load rbp.css and rbp.js directly instead.
web_include_css = []
web_include_js = []

# ---------------------------------------------------------------------------
# Desk assets (uncomment when needed)
# ---------------------------------------------------------------------------
# app_include_css = "/assets/rbp_app/css/rbp_desk.css"
# app_include_js = "/assets/rbp_app/js/rbp_desk.js"

# ---------------------------------------------------------------------------
# Home page - override Website Settings home page
# Uncomment to make the RBP index the site home page
# ---------------------------------------------------------------------------
home_page = "index"

# ---------------------------------------------------------------------------
# Website redirects
# ---------------------------------------------------------------------------
# Auth-like placeholder routes should never own account flows. Route them to
# the active authentication surface so RBP does not hijack native auth.
website_redirects = [
    {"source": "/register", "target": "/signup"},
    {"source": "/join", "target": "/signup"},
    {"source": "/forgot-password", "target": "/login"},
    {"source": "/reset-password", "target": "/login"},
    {"source": "/verify-account", "target": "/login"},
]

# ---------------------------------------------------------------------------
# Website route rules
# ---------------------------------------------------------------------------
# Dynamic route mappings for parameterized URLs.
# These map URL patterns to www page handlers.
website_route_rules = [
    # Auth aliases avoid conflicts with other installed apps that may own
    # global /login or /signup redirects on shared benches.
    # Native Frappe owns /login. RBP should not override it with www/login.html.
    {"from_route": "/rbp-signup", "to_route": "signup"},

    # Services dynamic routes
    {"from_route": "/services/<category>", "to_route": "services/category"},
    # Safe shell-phase placeholder for slug-based service detail URLs.
    {"from_route": "/service/<slug>", "to_route": "service/index"},

    # Resources dynamic routes
    # Category/detail placeholders do not exist yet. Keep disabled until
    # dedicated category/detail shell pages are added.
    # {"from_route": "/resources/<category>", "to_route": "resources/category"},
    # {"from_route": "/resources/<category>/<slug>", "to_route": "resources/detail"},

    # Offers dynamic route
    # Offers only has a listing shell today; a slug route would imply
    # content-backed offer detail behavior that does not exist yet.
    # {"from_route": "/offers/<slug>", "to_route": "offers/detail"},

    # Product dynamic route
    # Safe shell-phase placeholder for slug-based product detail URLs.
    {"from_route": "/product/<slug>", "to_route": "product/index"},

    # Portal app launcher and app detail routes.
    {"from_route": "/portal/apps", "to_route": "portal/apps/index"},
    {"from_route": "/portal/apps/<app_key>", "to_route": "portal/apps/app"},
]

# ---------------------------------------------------------------------------
# Jinja context helpers (uncomment when needed)
# ---------------------------------------------------------------------------
# jinja = {
#     "methods": "rbp_app.utils.jinja_methods",
#     "filters": "rbp_app.utils.jinja_filters",
# }

# ---------------------------------------------------------------------------
# Website context
# ---------------------------------------------------------------------------
# Adds values to every website page context
# website_context = {
#     "rbp_navigation": "rbp_app.config.navigation.get_navigation",
# }

update_website_context = [
    "rbp_app.guards.protect_platform_routes",
    "rbp_app.services.tenancy.load_portal_tenant",
]

before_request = [
    "rbp_app.guards.protect_platform_request",
]

user_permission_doctypes = [
    "Tenant",
    "RBP Tenant",
]

permission_query_conditions = {
    "Tenant": "rbp_app.rbp_app.doctype.tenant.tenant.tenant_query_conditions",
    "RBP Tenant": "rbp_app.rbp_app.doctype.rbp_tenant.rbp_tenant.rbp_tenant_query_conditions",
    "RBP Account": "rbp_app.rbp_app.doctype.rbp_account.rbp_account.rbp_account_query_conditions",
}

has_permission = {
    "Tenant": "rbp_app.rbp_app.doctype.tenant.tenant.has_tenant_permission",
    "RBP Tenant": "rbp_app.rbp_app.doctype.rbp_tenant.rbp_tenant.has_rbp_tenant_permission",
    "RBP Account": "rbp_app.rbp_app.doctype.rbp_account.rbp_account.has_rbp_account_permission",
}

# ---------------------------------------------------------------------------
# Installation hooks
# ---------------------------------------------------------------------------
# before_install = "rbp_app.install.before_install"
after_install = "rbp_app.install.after_install"

# ---------------------------------------------------------------------------
# Export annotations
# ---------------------------------------------------------------------------
export_python_type_annotations = True

# ---------------------------------------------------------------------------
# ARCHITECTURAL NOTES
# ---------------------------------------------------------------------------
# 1. This app owns all RBP business-specific website pages, templates,
#    and public assets.
# 2. Shell templates (public, auth, portal, admin) extend Frappe's
#    base.html but keep all RBP structure isolated here.
# 3. Admin functionality uses Frappe Desk (not a custom admin shell).
#    See ADMIN_APPROACH.md for details.
# 4. Dynamic routes are commented out until business logic phase.
# 5. Framework-core changes are minimized to zero where possible.
