# Email QA Sandbox

Date: 2026-05-15
Scope: Milestone 9 email notification QA proof

## Purpose

Email notifications must be QA-safe before deployment. Milestone 9 is not complete just because notification code and docs exist. It is complete only after sandbox configuration, focused tests, allowlisted delivery or fake-send proof, blocked-recipient proof, and fail-open logging are recorded on the QA bench/site. Astonishingly, emails still need somewhere safe to go.

## Required QA settings

Set these values in the QA site configuration or server environment. Do not commit real values.

```bash
RBP_ENABLE_EMAIL_NOTIFICATIONS=true
RBP_EMAIL_SANDBOX_MODE=true
RBP_QA_EMAIL_RECIPIENTS=<allowlisted QA emails>
RBP_ADMIN_NOTIFICATION_RECIPIENTS=<admin QA emails>
QA_EMAIL_ALLOWLIST=<allowlisted QA emails>
QA_EMAIL_ALLOWED_RECIPIENT=<one allowlisted QA email>
QA_EMAIL_BLOCKED_RECIPIENT=<non-allowlisted proof email>
```

## Frappe Email Account / SMTP setup checklist

Record the configured values in the private deployment runbook, not in Git.

- SMTP host: required
- SMTP port: required
- SMTP username: required, stored outside Git
- SMTP password/token: required, stored outside Git
- Sender email: required
- Reply-to email: required
- Sandbox recipient allowlist: required
- Admin/support notification recipients: required
- Blocked-recipient test case: required
- Delivery log location: required, for example Frappe Email Queue, Email Log, Notification Log, or the provider sandbox log
- Rollback/disable switch: set `RBP_ENABLE_EMAIL_NOTIFICATIONS=false` or `RBP_EMAIL_SANDBOX_MODE=true` with an empty allowlist, depending on the incident

## Source-of-truth alignment check

Before marking Milestone 9 as validated, confirm whether the notification implementation is in the backend source-of-truth repo used by the QA bench. If notification services exist only in `info-rbp/rbp-platform`, carry the required backend pieces into `info-rbp/frappe-project` or document why the QA backend is intentionally using the platform repo app source.

Required implementation evidence:

- Notification trigger catalog exists.
- `emit_event_notification` or equivalent event service exists.
- Portal/admin notification logging exists.
- Sandbox recipient routing exists.
- Billing hooks emit email-safe notifications.
- Entitlement hooks emit email-safe notifications.
- Notification failures are logged and fail open.
- Tests cover allowlisted recipient, blocked recipient, and failure paths.

## Required automated validation

Run from the QA bench/site after configuration is present:

```bash
python3 -m compileall rbp_app/rbp_app
bench --site hrms.localhost migrate
bench --site hrms.localhost clear-cache
bench --site hrms.localhost run-tests --app rbp_app --module rbp_app.tests.test_milestone9_notifications
bench --site hrms.localhost run-tests --app rbp_app
```

For the Appwrite QA runtime, run:

```bash
npm run test:integration
npm run smoke:qa:email
```

`smoke:qa:email` creates one allowlisted notification delivery and one blocked-recipient delivery through Appwrite Functions. If `APPWRITE_TRUSTED_FUNCTION_TOKEN` or `RBP_INTERNAL_FUNCTION_TOKEN` is available, it also processes the notification queue. It never prints the token or SMTP credentials.

If `hrms.localhost` is not the QA site, run `bench list-sites` and record the actual site used. If the focused module name differs, record the replacement module and command.

## Manual QA proof required

Record evidence for each item:

1. Send or fake-send a notification to an allowlisted QA recipient.
2. Attempt a notification to a non-allowlisted recipient.
3. Confirm the non-allowlisted recipient did not receive email.
4. Confirm a notification log record exists for the allowed delivery/fake-send.
5. Confirm a notification log record exists for the blocked recipient.
6. Confirm an email delivery failure does not break billing, entitlement, service request, or application-interest flow.
7. Confirm no SMTP usernames, passwords, API tokens, webhook secrets, or `.env` values are committed.

## Current status

Status: PARTIALLY AUTOMATED, BLOCKED for live provider proof.

The repository now contains Appwrite runtime tests for allowlisted and blocked recipients plus a QA live-proof script. This environment still cannot configure the QA Email Account or prove real SMTP/provider delivery. The remaining live provider proof must run from the QA environment with sandbox access.

## Completion criteria

Milestone 9 can move to PASS only when:

- QA email settings are configured.
- Focused and full backend tests pass.
- Allowlisted send or fake-send proof is recorded.
- Blocked-recipient proof is recorded.
- Notification failure is proven fail-open.
- The backend source-of-truth alignment is confirmed.
- No secrets are committed.
