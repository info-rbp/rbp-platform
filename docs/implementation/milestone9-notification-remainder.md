# Milestone 9 Notification Remainder

This PR completes the remaining backend-owned notification work for Milestone 9. The previous state had a trigger map, partial email delivery helpers, portal notification orchestration, and billing/entitlement hooks. The missing pieces were deterministic template rendering, QA-safe recipient policy coverage, admin recipient support, best-effort delivery logging, admin APIs, additional backend hooks, expanded tests, and closeout documentation.

## Template registry

`rbp_app.services.email_templates.render_template` is the active renderer for this milestone. It works without a live Frappe site, uses only the Python standard library, escapes user-controlled values with `html.escape`, and returns:

```python
{"title": "...", "html": "...", "text": "..."}
```

Supported templates cover all Milestone 9 event keys, including account, membership, subscription, entitlement, service, marketplace, application-interest, and admin-status notifications. Unknown template keys render a generic safe notification instead of raising.

## Email template files

`apps/rbp_app/rbp_app/templates/emails` contains `base-notification.html` plus one stub per Milestone 9 template key. The Python registry remains the active renderer. The HTML files are a migration path for future Frappe Email Template records and contain no secrets or real recipient addresses.

## QA recipient allowlist

Email delivery is backend-owned and QA-safe by default.

Config keys:

- `rbp_enable_email_notifications`: enabled unless explicitly disabled.
- `rbp_email_sandbox_mode`: enabled by default.
- `rbp_email_subject_prefix`: defaults to `[RBP QA]`.
- `rbp_qa_email_recipients`: primary QA allowlist.
- `rbp_email_sandbox_recipient`: deprecated single-recipient fallback, only used when the allowlist is empty.

Sandbox mode normalizes recipients, filters to the QA allowlist, blocks delivery if no recipients remain, and never calls `frappe.sendmail`.

## Admin recipients

`rbp_admin_notification_recipients` defines admin notification email recipients. Admin recipients are only included for triggers marked `admin_enabled=True` in the trigger registry. Recipients are normalized, lowercased, deduplicated, and merged with the customer recipient by the orchestration layer.

## Delivery logging

`emit_event_notification` records email delivery rows through `_record_delivery_logs` on a best-effort basis. If Frappe is unavailable, if `RBP Notification Delivery` does not exist, or if a schema mismatch occurs, logging fails open and the business flow continues.

This repository currently has `RBP Notification` but does not include a clear `RBP Notification Delivery` DocType. Persistent delivery logging is therefore optional until that DocType is added in a future schema-focused PR.

## Admin APIs

`rbp_app.api.notifications` exposes:

- `list_triggers()`
- `send_test_notification(event_type="account.created", recipient_email=None)`
- `admin_list_notification_events(limit=50)`
- `admin_list_notification_deliveries(limit=50)`

Admin mutation/readback methods require the `System Manager` role. Returned rows are limited to safe metadata fields and do not expose email bodies, SMTP secrets, Stripe payloads, provider payloads, tokens, or frontend secrets.

## Hooks

Implemented fail-open hooks:

- Decision Desk submit: `service.request_submitted`
- Decision Desk admin status update: `admin.status_updated`
- Connectivity submit: `connectivity.nbn_order_submitted`
- Connectivity admin status update: `admin.status_updated`
- Risk Advisor submit: `risk_advisor.assessment_submitted`
- Risk Advisor admin status update: `admin.status_updated`
- The Fixer submit: `fixer.request_submitted`
- The Fixer admin status update: `admin.status_updated`
- Marketplace listing creation: `marketplace.listing_submitted`
- Marketplace order creation: `marketplace.enquiry_submitted`

Deferred hooks:

- DocuShare brief submission: the current DocuShare service has folder/document/share creation, but no clear brief-submission flow.
- Application interest submission: this repo exposes application discovery and entitlement flags, but no clear application-interest record creation API or DocType.

## Security and scope

- Appwrite remains out of scope and was not modified.
- SMTP/API/Stripe secrets were not added.
- Real production recipient lists were not added.
- Frontend email dependencies were not added.
- Real email sending remains disabled by sandbox defaults.
- Notification failures never block billing, entitlement, service, marketplace, application-interest, or admin-status flows.

## Validation

```bash
python -m compileall apps/rbp_app/rbp_app
python -m pytest apps/rbp_app/rbp_app/tests/test_milestone9_notifications.py
python -m pytest apps/rbp_app/rbp_app/tests/test_milestone8_entitlements.py
git diff --check
git show --check --pretty=short HEAD
```
