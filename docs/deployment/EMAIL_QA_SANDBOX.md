# Email QA Sandbox

## Purpose

Email notifications must be QA-safe before deployment.

## Required QA settings

- `RBP_ENABLE_EMAIL_NOTIFICATIONS=true`
- `RBP_EMAIL_SANDBOX_MODE=true`
- `RBP_QA_EMAIL_RECIPIENTS=<allowlisted QA emails>`
- `RBP_ADMIN_NOTIFICATION_RECIPIENTS=<admin QA emails>`

## Required server setup

Configure either:

- Frappe Email Account, or
- SMTP provider credentials through server environment or site config.

Do not commit SMTP usernames, passwords, or tokens.

## Validation checklist

- Account-created notification can be fake-sent or sandbox-sent.
- Payment success notification can be fake-sent or sandbox-sent.
- Payment failed notification can be fake-sent or sandbox-sent.
- Application interest notification can be fake-sent or sandbox-sent.
- Blocked non-allowlisted recipient produces a safe delivery result.
- Delivery logs are visible to admin.

## Completion criteria

Milestone 9 is complete when QA sandbox email settings are configured, email tests pass, and at least one sandbox or fake-send delivery is recorded.
