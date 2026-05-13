# Milestone 9 Final Closeout

Milestone 9 closes the backend-owned email notification layer for QA. It builds on PRs #40, #41, #42, #43, and #44, and incorporates the useful work from PR #45 into this final branch.

## Scope

Finalized areas:

- Notification trigger map for account, billing, entitlement, service, marketplace, application-interest, and admin-status events.
- Deterministic Python template registry with escaped HTML and plain-text fallback.
- Email template stubs under `apps/rbp_app/rbp_app/templates/emails`.
- QA-safe email delivery defaults and recipient allowlist.
- Admin recipient handling via backend config.
- Persistent `RBP Notification Delivery` DocType.
- Best-effort delivery logging from notification orchestration.
- Admin notification event and delivery APIs.
- Billing and entitlement hooks from earlier Milestone 9 PRs.
- Service/request hooks for Decision Desk, Connectivity, Risk Advisor, and The Fixer.
- Marketplace listing and enquiry/order hooks.
- `RBP Application Interest` DocType plus register-interest API and notification hook.

Application provisioning remains disabled and excluded. Appwrite remains out of scope and any Appwrite failure is not a Milestone 9 blocker.

## Config Keys

- `rbp_enable_email_notifications`: email notifications are enabled unless explicitly disabled.
- `rbp_email_sandbox_mode`: sandbox mode is enabled by default.
- `rbp_email_subject_prefix`: defaults to `[RBP QA]` in sandbox mode.
- `rbp_qa_email_recipients`: primary QA recipient allowlist.
- `rbp_admin_notification_recipients`: admin notification recipient list.
- `rbp_email_sandbox_recipient`: deprecated single-recipient fallback when the QA allowlist is empty.

No SMTP/API/Stripe secrets or production recipient lists are committed.

## Email Service Behavior

Sandbox mode is the default. In sandbox mode, recipients are normalized, deduplicated, filtered against `rbp_qa_email_recipients`, and fake sent with a `sandbox:<event_type>:<recipient>` provider message id. Sandbox mode never calls `frappe.sendmail`.

Real email delivery only occurs when sandbox mode is disabled and Frappe email delivery is available. Send failures return failed delivery results and never raise into billing, entitlement, service, marketplace, DocuShare, application-interest, or admin-status business flows.

## Delivery Logging

`RBP Notification Delivery` persists safe delivery metadata:

- notification link when a portal notification exists
- event type
- channel
- recipient email
- status
- provider message id
- error summary
- sandbox flag
- related record reference
- sent timestamp when available
- short safe payload summary

It does not store email bodies, SMTP secrets, provider raw payloads, Stripe raw payloads, tokens, card data, or webhook payloads. Logging is best-effort and fail-open.

## Admin APIs

`rbp_app.api.notifications` exposes:

- `list_triggers()`
- `send_test_notification(event_type="account.created", recipient_email=None)`
- `admin_list_notification_events(limit=50)`
- `admin_list_notification_deliveries(limit=50)`

Admin-only methods require `System Manager`. Returned fields are safe QA/admin metadata only.

## Hooks

Implemented hooks:

- Decision Desk submit -> `service.request_submitted`
- Decision Desk admin status update -> `admin.status_updated`
- Connectivity submit -> `connectivity.nbn_order_submitted`
- Connectivity admin status update -> `admin.status_updated`
- Risk Advisor submit -> `risk_advisor.assessment_submitted`
- Risk Advisor admin status update -> `admin.status_updated`
- The Fixer submit -> `fixer.request_submitted`
- The Fixer admin status update -> `admin.status_updated`
- Marketplace listing creation -> `marketplace.listing_submitted`
- Marketplace order creation -> `marketplace.enquiry_submitted`
- Application interest submission -> `application.interest_submitted`
- Application interest admin status update -> `admin.status_updated`

DocuShare brief submission is deferred because this repository currently has folder/document/share flows but no clear brief-submission/create-request flow. No false hook is claimed.

## Application Interest

`RBP Application Interest` supports register-interest only. The API creates a Received interest record and emits `application.interest_submitted`. Admin status updates can emit `admin.status_updated`.

This does not enable application provisioning and does not emit any application provisioning event.

## Admin UI Visibility

Backend admin APIs are complete for QA/API verification. A dedicated admin UI for notification logs is deferred because the current admin frontend pattern is not clear enough to update without widening the milestone into frontend work.

## Live QA Checklist

1. Install/update the app in the Frappe bench.
2. Run `bench migrate`.
3. Confirm `RBP Notification` and `RBP Notification Delivery` DocTypes exist.
4. Configure sandbox mode:
   - `rbp_email_sandbox_mode = true`
   - `rbp_qa_email_recipients = <QA recipients>`
   - `rbp_email_subject_prefix = [RBP QA]`
5. Send a test notification as System Manager.
6. Confirm a portal notification record appears when a portal user is available.
7. Confirm a delivery log record appears.
8. Confirm no real email is sent outside the QA allowlist.
9. Submit service/request flows.
10. Submit marketplace listing and enquiry/order flows.
11. Submit application interest.
12. Confirm billing and entitlement notifications remain fail-open.
13. Confirm Appwrite failure is tracked separately and not treated as a Milestone 9 blocker.

## Production SMTP/Provider Guidance

For non-sandbox production delivery, configure SMTP/provider credentials only in backend Frappe/site configuration or the deployment secret manager. Then explicitly set `rbp_email_sandbox_mode = false`. Keep `rbp_admin_notification_recipients` limited to approved operational mailboxes. Never expose SMTP/API credentials, provider tokens, or production recipient lists in frontend code or static assets.

## Validation

```bash
python -m compileall apps/rbp_app/rbp_app
PYTHONPATH=apps/rbp_app python -m pytest apps/rbp_app/rbp_app/tests/test_milestone9_notifications.py
PYTHONPATH=apps/rbp_app python -m pytest apps/rbp_app/rbp_app/tests/test_milestone8_entitlements.py
git diff --check
git show --check --pretty=short HEAD
```

Local environments without `pytest` installed can use:

```bash
PYTHONPATH=apps/rbp_app uv run --with pytest python -m pytest apps/rbp_app/rbp_app/tests/test_milestone9_notifications.py
PYTHONPATH=apps/rbp_app uv run --with pytest python -m pytest apps/rbp_app/rbp_app/tests/test_milestone8_entitlements.py
```

## Regression Coverage

The final closeout keeps focused regression coverage for billing payment success/failure notification emission, subscription status-change notification gating, entitlement grant/suspend notification gating, and fail-open billing and entitlement notification behavior.

## Known Limitations

- DocuShare brief submission is deferred until a real brief-submission flow exists.
- Dedicated admin UI surfacing is deferred; QA can use backend APIs and DocType list/report views.
- Real SMTP/provider verification must be performed in a live Frappe environment with sandbox mode deliberately disabled.
