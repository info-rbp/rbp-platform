from rbp_app.services.notification_triggers import get_trigger, list_trigger_keys


def test_trigger_catalog_contains_required_events():
    required = {
        "account.created",
        "membership.payment_succeeded",
        "membership.payment_failed",
        "subscription.status_changed",
        "entitlement.granted",
        "entitlement.suspended",
        "service.request_submitted",
        "docushare.brief_submitted",
        "connectivity.nbn_order_submitted",
        "risk_advisor.assessment_submitted",
        "fixer.request_submitted",
        "marketplace.listing_submitted",
        "marketplace.enquiry_submitted",
        "application.interest_submitted",
        "admin.status_updated",
    }
    assert required.issubset(set(list_trigger_keys()))


def test_trigger_lookup_returns_defaults():
    trigger = get_trigger("membership.payment_succeeded")
    assert trigger.template_key == "membership_payment_succeeded"
    assert trigger.customer_enabled is True
