"""Notification trigger catalog for Milestone 9 backend hooks."""

from __future__ import annotations

from dataclasses import dataclass

ALLOWED_CATEGORIES = {
    "customer",
    "membership",
    "subscription",
    "entitlement",
    "service",
    "marketplace",
    "application",
    "admin",
}

ALLOWED_DELIVERY_CHANNELS = {
    "Portal",
    "Email",
}

ALLOWED_SENSITIVITY_LEVELS = {
    "standard",
    "billing",
    "entitlement",
    "service",
    "admin",
}

SAFE_CONTEXT_KEYS = {
    "customer_name",
    "business_name",
    "reference_id",
    "portal_url",
    "status",
    "amount",
    "currency",
    "plan_name",
    "service_name",
    "application_name",
    "marketplace_item",
    "admin_note",
}

DISALLOWED_CONTEXT_KEYS = {
    "password",
    "secret",
    "token",
    "api_key",
    "stripe_secret",
    "raw_payload",
    "provider_payload",
    "card_number",
    "cvc",
}

REQUIRED_EVENT_KEYS = frozenset(
    {
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
)


@dataclass(frozen=True)
class NotificationTrigger:
    """Static definition for an event notification trigger."""

    event_type: str
    template_key: str
    default_subject: str
    customer_enabled: bool = True
    admin_enabled: bool = False
    category: str = "platform"
    portal_enabled: bool = True
    email_enabled: bool = True
    default_portal_url: str = "/portal/dashboard"
    required_context_keys: tuple[str, ...] = ()
    optional_context_keys: tuple[str, ...] = ()
    delivery_channels: tuple[str, ...] = ("Portal", "Email")
    sensitivity: str = "standard"


TRIGGERS: dict[str, NotificationTrigger] = {
    "account.created": NotificationTrigger(
        "account.created",
        "account_created",
        "Welcome to RBP",
        category="customer",
        required_context_keys=("customer_name", "reference_id"),
        optional_context_keys=("business_name", "portal_url"),
    ),
    "membership.payment_succeeded": NotificationTrigger(
        "membership.payment_succeeded",
        "membership_payment_succeeded",
        "Membership payment received",
        admin_enabled=True,
        category="membership",
        required_context_keys=("reference_id", "status"),
        optional_context_keys=("customer_name", "business_name", "amount", "currency", "plan_name", "portal_url"),
        sensitivity="billing",
    ),
    "membership.payment_failed": NotificationTrigger(
        "membership.payment_failed",
        "membership_payment_failed",
        "Membership payment failed",
        admin_enabled=True,
        category="membership",
        default_portal_url="/portal/membership/checkout",
        required_context_keys=("reference_id", "status"),
        optional_context_keys=("customer_name", "business_name", "amount", "currency", "plan_name", "portal_url"),
        sensitivity="billing",
    ),
    "subscription.status_changed": NotificationTrigger(
        "subscription.status_changed",
        "subscription_status_changed",
        "Subscription status updated",
        admin_enabled=True,
        category="subscription",
        required_context_keys=("reference_id", "status"),
        optional_context_keys=("customer_name", "business_name", "plan_name", "portal_url"),
        sensitivity="billing",
    ),
    "entitlement.granted": NotificationTrigger(
        "entitlement.granted",
        "entitlement_granted",
        "Membership access granted",
        category="entitlement",
        required_context_keys=("reference_id", "status"),
        optional_context_keys=("customer_name", "business_name", "portal_url"),
        sensitivity="entitlement",
    ),
    "entitlement.suspended": NotificationTrigger(
        "entitlement.suspended",
        "entitlement_suspended",
        "Membership access updated",
        admin_enabled=True,
        category="entitlement",
        required_context_keys=("reference_id", "status"),
        optional_context_keys=("customer_name", "business_name", "portal_url"),
        sensitivity="entitlement",
    ),
    "service.request_submitted": NotificationTrigger(
        "service.request_submitted",
        "service_request_submitted",
        "Service request received",
        admin_enabled=True,
        category="service",
        default_portal_url="/portal/services",
        required_context_keys=("reference_id", "service_name"),
        optional_context_keys=("customer_name", "business_name", "status", "portal_url"),
        sensitivity="service",
    ),
    "docushare.brief_submitted": NotificationTrigger(
        "docushare.brief_submitted",
        "docushare_brief_submitted",
        "DocuShare brief submitted",
        admin_enabled=True,
        category="service",
        default_portal_url="/portal/services/docushare/start",
        required_context_keys=("reference_id",),
        optional_context_keys=("customer_name", "business_name", "service_name", "status", "portal_url"),
        sensitivity="service",
    ),
    "connectivity.nbn_order_submitted": NotificationTrigger(
        "connectivity.nbn_order_submitted",
        "connectivity_nbn_order_submitted",
        "Connectivity order submitted",
        admin_enabled=True,
        category="service",
        default_portal_url="/portal/services/nbn/start",
        required_context_keys=("reference_id",),
        optional_context_keys=("customer_name", "business_name", "service_name", "status", "portal_url"),
        sensitivity="service",
    ),
    "risk_advisor.assessment_submitted": NotificationTrigger(
        "risk_advisor.assessment_submitted",
        "risk_advisor_assessment_submitted",
        "Risk assessment submitted",
        admin_enabled=True,
        category="service",
        default_portal_url="/portal/services/risk-advisor/start",
        required_context_keys=("reference_id",),
        optional_context_keys=("customer_name", "business_name", "service_name", "status", "portal_url"),
        sensitivity="service",
    ),
    "fixer.request_submitted": NotificationTrigger(
        "fixer.request_submitted",
        "fixer_request_submitted",
        "Fixer request submitted",
        admin_enabled=True,
        category="service",
        default_portal_url="/portal/services/the-fixer/start",
        required_context_keys=("reference_id",),
        optional_context_keys=("customer_name", "business_name", "service_name", "status", "portal_url"),
        sensitivity="service",
    ),
    "marketplace.listing_submitted": NotificationTrigger(
        "marketplace.listing_submitted",
        "marketplace_listing_submitted",
        "Marketplace listing submitted",
        admin_enabled=True,
        category="marketplace",
        default_portal_url="/portal/marketplace/listings/new",
        required_context_keys=("reference_id",),
        optional_context_keys=("customer_name", "business_name", "marketplace_item", "status", "portal_url"),
        sensitivity="service",
    ),
    "marketplace.enquiry_submitted": NotificationTrigger(
        "marketplace.enquiry_submitted",
        "marketplace_enquiry_submitted",
        "Marketplace enquiry received",
        admin_enabled=True,
        category="marketplace",
        default_portal_url="/portal/marketplace/offers/new",
        required_context_keys=("reference_id",),
        optional_context_keys=("customer_name", "business_name", "marketplace_item", "status", "portal_url"),
        sensitivity="service",
    ),
    "application.interest_submitted": NotificationTrigger(
        "application.interest_submitted",
        "application_interest_submitted",
        "Application interest received",
        admin_enabled=True,
        category="application",
        default_portal_url="/portal/apps",
        required_context_keys=("reference_id", "application_name"),
        optional_context_keys=("customer_name", "business_name", "status", "portal_url"),
    ),
    "admin.status_updated": NotificationTrigger(
        "admin.status_updated",
        "admin_status_updated",
        "Status updated by admin",
        category="admin",
        required_context_keys=("reference_id", "status"),
        optional_context_keys=("customer_name", "business_name", "admin_note", "portal_url"),
        sensitivity="admin",
    ),
}


def get_trigger(event_type: str) -> NotificationTrigger:
    if event_type not in TRIGGERS:
        raise ValueError(f"Unsupported notification event_type: {event_type}")
    return TRIGGERS[event_type]


def list_trigger_keys() -> tuple[str, ...]:
    return tuple(sorted(TRIGGERS.keys()))


def trigger_to_dict(trigger: NotificationTrigger) -> dict[str, object]:
    return {
        "event_type": trigger.event_type,
        "template_key": trigger.template_key,
        "default_subject": trigger.default_subject,
        "customer_enabled": trigger.customer_enabled,
        "admin_enabled": trigger.admin_enabled,
        "portal_enabled": trigger.portal_enabled,
        "email_enabled": trigger.email_enabled,
        "category": trigger.category,
        "default_portal_url": trigger.default_portal_url,
        "required_context_keys": list(trigger.required_context_keys),
        "optional_context_keys": list(trigger.optional_context_keys),
        "delivery_channels": list(trigger.delivery_channels),
        "sensitivity": trigger.sensitivity,
    }


def list_notification_triggers() -> list[dict[str, object]]:
    return [trigger_to_dict(TRIGGERS[key]) for key in list_trigger_keys()]


def get_triggers_by_category(category: str) -> tuple[NotificationTrigger, ...]:
    return tuple(sorted((t for t in TRIGGERS.values() if t.category == category), key=lambda t: t.event_type))


def get_customer_enabled_triggers() -> tuple[NotificationTrigger, ...]:
    return tuple(sorted((t for t in TRIGGERS.values() if t.customer_enabled), key=lambda t: t.event_type))


def get_admin_enabled_triggers() -> tuple[NotificationTrigger, ...]:
    return tuple(sorted((t for t in TRIGGERS.values() if t.admin_enabled), key=lambda t: t.event_type))


def get_email_enabled_triggers() -> tuple[NotificationTrigger, ...]:
    return tuple(sorted((t for t in TRIGGERS.values() if t.email_enabled), key=lambda t: t.event_type))


def get_portal_enabled_triggers() -> tuple[NotificationTrigger, ...]:
    return tuple(sorted((t for t in TRIGGERS.values() if t.portal_enabled), key=lambda t: t.event_type))


def validate_trigger_catalog() -> list[str]:
    errors: list[str] = []
    seen_event_types: set[str] = set()
    for event_key, trigger in TRIGGERS.items():
        if event_key in seen_event_types:
            errors.append(f"Duplicate event key in trigger map: {event_key}")
        seen_event_types.add(event_key)
        if event_key != trigger.event_type:
            errors.append(f"Trigger map key mismatch: {event_key} != {trigger.event_type}")
        if not trigger.event_type:
            errors.append(f"Trigger has empty event_type for key: {event_key}")
        if not trigger.template_key:
            errors.append(f"Trigger has empty template_key: {event_key}")
        if not trigger.default_subject:
            errors.append(f"Trigger has empty default_subject: {event_key}")
        if trigger.category not in ALLOWED_CATEGORIES:
            errors.append(f"Trigger has unsupported category '{trigger.category}': {event_key}")
        if trigger.sensitivity not in ALLOWED_SENSITIVITY_LEVELS:
            errors.append(f"Trigger has unsupported sensitivity '{trigger.sensitivity}': {event_key}")
        unknown_channels = set(trigger.delivery_channels) - ALLOWED_DELIVERY_CHANNELS
        if unknown_channels:
            errors.append(f"Trigger has unsupported delivery channels {sorted(unknown_channels)}: {event_key}")

        required_set = set(trigger.required_context_keys)
        optional_set = set(trigger.optional_context_keys)
        disallowed_required = required_set & DISALLOWED_CONTEXT_KEYS
        disallowed_optional = optional_set & DISALLOWED_CONTEXT_KEYS
        if disallowed_required:
            errors.append(f"Trigger has disallowed required context keys {sorted(disallowed_required)}: {event_key}")
        if disallowed_optional:
            errors.append(f"Trigger has disallowed optional context keys {sorted(disallowed_optional)}: {event_key}")

        unsafe_required = required_set - SAFE_CONTEXT_KEYS
        unsafe_optional = optional_set - SAFE_CONTEXT_KEYS
        if unsafe_required:
            errors.append(f"Trigger has unsafe required context keys {sorted(unsafe_required)}: {event_key}")
        if unsafe_optional:
            errors.append(f"Trigger has unsafe optional context keys {sorted(unsafe_optional)}: {event_key}")

        if "applications_provisioning" in event_key or event_key == "applications.provisioning_requested":
            errors.append(f"Application provisioning event is not permitted in this rollout: {event_key}")

        if any(event_key.startswith(prefix) for prefix in ("membership.payment", "subscription.")):
            blocked = required_set & {"raw_payload", "provider_payload", "token", "secret", "card_number", "cvc", "api_key", "stripe_secret"}
            if blocked:
                errors.append(f"Billing trigger must not require raw provider fields {sorted(blocked)}: {event_key}")

    missing_required = REQUIRED_EVENT_KEYS - set(TRIGGERS.keys())
    if missing_required:
        errors.append(f"Missing required trigger event keys: {sorted(missing_required)}")
    return errors


def assert_valid_trigger_catalog() -> None:
    errors = validate_trigger_catalog()
    if errors:
        raise AssertionError("; ".join(errors))
