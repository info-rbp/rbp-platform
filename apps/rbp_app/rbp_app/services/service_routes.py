"""Route helpers for service request records."""

SERVICE_ROUTES = {
    "decision_desk": (
        "/portal/services/decision-desk/{name}",
        "/app/rbp-decision-desk-request/{name}",
    ),
    "docushare": (
        "/portal/services/docushare/{name}",
        "/app/rbp-docushare-document/{name}",
    ),
    "connectivity": (
        "/portal/services/nbn/{name}",
        "/app/rbp-connectivity-request/{name}",
    ),
    "risk_advisor": (
        "/portal/services/risk-advisor/{name}",
        "/app/rbp-risk-advisor-assessment/{name}",
    ),
    "the_fixer": (
        "/portal/services/the-fixer/{name}",
        "/app/rbp-fixer-case/{name}",
    ),
    "marketplace_listing": (
        "/portal/marketplace/listings/{name}",
        "/app/rbp-marketplace-listing/{name}",
    ),
    "marketplace_enquiry": (
        "/portal/marketplace/offers/{name}",
        "/app/rbp-marketplace-order/{name}",
    ),
}


def service_routes(service_key, name):
    """Return normalized portal/admin routes for a service record."""

    portal_route, admin_route = SERVICE_ROUTES[service_key]
    return {
        "portal_route": portal_route.format(name=name),
        "admin_route": admin_route.format(name=name),
    }

