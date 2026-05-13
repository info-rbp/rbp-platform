# Milestone 9 Billing and Entitlement Hooks

## Background
After PR #40, billing and entitlement notification hooks were present but incomplete:
- `subscription.status_changed` could be emitted even when status did not change.
- entitlement notifications could be emitted when no entitlement records changed.
- notification failures were not consistently fail-open at hook call sites.

## What this PR changes

### Billing hooks (`services/billing.py`)
- Captures `previous_status` and `previous_payment_status` before subscription mutation.
- Emits `membership.payment_succeeded` only for `Paid` payment events.
- Emits `membership.payment_failed` only for `Failed` and `Disputed` payment events.
- Emits `subscription.status_changed` only when status actually changed.
- Adds safe context builder with structured keys only:
  - `reference_id`, `status`, `payment_status`, `previous_status`, `previous_payment_status`,
    `portal_url`, `amount`, `currency`, `plan_name`, `provider`.
- Wraps notification sends with `_safe_emit_billing_notification` so notification failures are logged and do not break billing flow.

### Entitlement hooks (`services/entitlements.py`)
- Adds `_has_changed_entitlements` and `_changed_entitlement_count` helpers.
- `sync_subscription_entitlements` now emits:
  - `entitlement.granted` only when there are changed entitlements.
  - `entitlement.suspended` only when there are changed entitlements.
- Adds entitlement context builder with:
  - `reference_id`, `status`, `action`, `changed_count`, `portal_url`, `plan_name`, `business_name`.
- Wraps notification sends with `_safe_emit_entitlement_notification` so entitlement sync remains fail-open for notification failures.

## Duplicate-notification prevention
- Billing: `subscription.status_changed` is gated by `subscription.status != previous_status`.
- Entitlements: grant/suspend notifications are gated by changed-entitlement detection.

## Fail-open behavior
- Notification calls are isolated behind safe wrappers.
- Wrapper catches/logs notification exceptions with `frappe.log_error` and returns a non-throwing status payload.
- Billing and entitlement business operations continue even if notification delivery fails.

## Intentionally not included
- Appwrite configuration changes.
- Frontend changes.
- Stripe provider implementation changes.
- Raw provider/webhook payloads in notification context.
- Secrets or API keys.

## Validation commands
- `python -m compileall apps/rbp_app/rbp_app`
- `python -m pytest apps/rbp_app/rbp_app/tests/test_milestone9_notifications.py`
- `python -m pytest apps/rbp_app/rbp_app/tests/test_milestone8_entitlements.py`
- `git diff --check`
- `git show --check --pretty=short HEAD`
