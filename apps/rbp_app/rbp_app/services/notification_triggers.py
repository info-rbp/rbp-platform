"""Notification trigger catalog for Milestone 9."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class NotificationTrigger:
    event_type: str
    template_key: str
    default_subject: str
    customer_enabled: bool = True
    admin_enabled: bool = False
    category: str = "platform"


TRIGGERS: dict[str, NotificationTrigger] = {
    "account.created": NotificationTrigger("account.created", "account_created", "Welcome to RBP", customer_enabled=True, admin_enabled=False, category="customer"),
    "membership.payment_succeeded": NotificationTrigger("membership.payment_succeeded", "membership_payment_succeeded", "Membership payment received", customer_enabled=True, admin_enabled=True, category="membership"),
    "membership.payment_failed": NotificationTrigger("membership.payment_failed", "membership_payment_failed", "Membership payment failed", customer_enabled=True, admin_enabled=True, category="membership"),
    "subscription.status_changed": NotificationTrigger("subscription.status_changed", "subscription_status_changed", "Subscription status updated", customer_enabled=True, admin_enabled=True, category="subscription"),
    "entitlement.granted": NotificationTrigger("entitlement.granted", "entitlement_granted", "Membership access granted", customer_enabled=True, admin_enabled=False, category="entitlement"),
    "entitlement.suspended": NotificationTrigger("entitlement.suspended", "entitlement_suspended", "Membership access updated", customer_enabled=True, admin_enabled=True, category="entitlement"),
    "service.request_submitted": NotificationTrigger("service.request_submitted", "service_request_submitted", "Service request received", customer_enabled=True, admin_enabled=True, category="service"),
    "docushare.brief_submitted": NotificationTrigger("docushare.brief_submitted", "docushare_brief_submitted", "DocuShare brief submitted", customer_enabled=True, admin_enabled=True, category="service"),
    "connectivity.nbn_order_submitted": NotificationTrigger("connectivity.nbn_order_submitted", "connectivity_nbn_order_submitted", "Connectivity order submitted", customer_enabled=True, admin_enabled=True, category="service"),
    "risk_advisor.assessment_submitted": NotificationTrigger("risk_advisor.assessment_submitted", "risk_advisor_assessment_submitted", "Risk assessment submitted", customer_enabled=True, admin_enabled=True, category="service"),
    "fixer.request_submitted": NotificationTrigger("fixer.request_submitted", "fixer_request_submitted", "Fixer request submitted", customer_enabled=True, admin_enabled=True, category="service"),
    "marketplace.listing_submitted": NotificationTrigger("marketplace.listing_submitted", "marketplace_listing_submitted", "Marketplace listing submitted", customer_enabled=True, admin_enabled=True, category="marketplace"),
    "marketplace.enquiry_submitted": NotificationTrigger("marketplace.enquiry_submitted", "marketplace_enquiry_submitted", "Marketplace enquiry received", customer_enabled=True, admin_enabled=True, category="marketplace"),
    "application.interest_submitted": NotificationTrigger("application.interest_submitted", "application_interest_submitted", "Application interest received", customer_enabled=True, admin_enabled=True, category="application"),
    "admin.status_updated": NotificationTrigger("admin.status_updated", "admin_status_updated", "Status updated by admin", customer_enabled=True, admin_enabled=False, category="admin"),
}


def get_trigger(event_type: str) -> NotificationTrigger:
    if event_type not in TRIGGERS:
        raise KeyError(f"Unsupported notification event_type: {event_type}")
    return TRIGGERS[event_type]


def list_trigger_keys() -> tuple[str, ...]:
    return tuple(sorted(TRIGGERS.keys()))
