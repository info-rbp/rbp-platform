# Milestone 9 Notification Trigger Map

## Purpose
The trigger map is the backend-owned registry that defines which Milestone 9 events are supported, which template key is used, who can receive notifications, which channels are allowed, and what context fields are safe.

## Supported event keys
- `account.created`
- `membership.payment_succeeded`
- `membership.payment_failed`
- `subscription.status_changed`
- `entitlement.granted`
- `entitlement.suspended`
- `service.request_submitted`
- `docushare.brief_submitted`
- `connectivity.nbn_order_submitted`
- `risk_advisor.assessment_submitted`
- `fixer.request_submitted`
- `marketplace.listing_submitted`
- `marketplace.enquiry_submitted`
- `application.interest_submitted`
- `admin.status_updated`

## Trigger metadata contract
Each trigger includes:
- `event_type`, `template_key`, `default_subject`
- `customer_enabled`, `admin_enabled`
- `portal_enabled`, `email_enabled`
- `category`
- `default_portal_url`
- `required_context_keys`, `optional_context_keys`
- `delivery_channels`
- `sensitivity`

## Categories
Allowed categories:
- `customer`
- `membership`
- `subscription`
- `entitlement`
- `service`
- `marketplace`
- `application`
- `admin`

## Delivery flags and channels
- `portal_enabled` controls default portal notification generation.
- `email_enabled` controls default email delivery eligibility.
- Allowed `delivery_channels` are `Portal` and `Email`.

## Safe context policy
Trigger definitions must use only approved context fields:
- `customer_name`
- `business_name`
- `reference_id`
- `portal_url`
- `status`
- `amount`
- `currency`
- `plan_name`
- `service_name`
- `application_name`
- `marketplace_item`
- `admin_note`

Disallowed context keys include:
- `password`
- `secret`
- `token`
- `api_key`
- `stripe_secret`
- `raw_payload`
- `provider_payload`
- `card_number`
- `cvc`

Raw payment/provider payload fields are forbidden to avoid leaking sensitive data into templates, APIs, logs, or notification payloads.

## Rollout guardrails
- `applications.provisioning_requested` is intentionally excluded from this rollout.
- Any accidental `applications_provisioning` event key is treated as invalid.

## Helper functions
The trigger module provides:
- `get_trigger(event_type)`
- `list_trigger_keys()`
- `trigger_to_dict(trigger)`
- `list_notification_triggers()`
- `get_triggers_by_category(category)`
- `get_customer_enabled_triggers()`
- `get_admin_enabled_triggers()`
- `get_email_enabled_triggers()`
- `get_portal_enabled_triggers()`
- `validate_trigger_catalog()`
- `assert_valid_trigger_catalog()`

## Validation commands
```bash
python -m compileall apps/rbp_app/rbp_app
python -m pytest apps/rbp_app/rbp_app/tests/test_milestone9_notifications.py
python -m pytest apps/rbp_app/rbp_app/tests/test_milestone8_entitlements.py
git diff --check
git show --check --pretty=short HEAD
```
