# Phase 3 Launch Readiness Runbook

## Purpose

This runbook defines the operational readiness checks required before the Phase 3 backend/platform foundation can be treated as launch-ready or handed to later implementation phases.

This document does not launch the platform. It records what must be true before launch implementation begins.

## Scope

This runbook covers:

- Bench and site readiness
- Migration readiness
- Cache readiness
- Scheduler and worker readiness
- Email and notification readiness
- File storage readiness
- Billing/payment readiness
- Admin Desk readiness
- Permission and tenant isolation readiness
- Backup and rollback considerations
- Launch blocker categories
- Post-launch observation checklist

## Explicit Exclusions

This runbook does not implement:

- Deployment automation
- Infrastructure provisioning
- CI/CD pipelines
- Frontend implementation
- QA automation
- Live payment provider wiring
- Frappe Desk replacement
- Frappe core changes

## Current Backend State

Phase 3 backend modules completed:

- Platform foundation
- Membership/onboarding
- Decision Desk
- DocuShare
- Marketplace
- Connectivity
- Risk Advisor
- The Fixer
- Notifications
- Entitlements
- Audit logging
- File references
- Billing/payment modelling
- Route guards
- Installed app discovery/adapters

Known validation:

- Focused backend suite: 141 tests OK
- Bench rbp_app suite: 173 tests OK
- Bench migrate passed on `rbp-minimal.localhost`
- Generated bench artifacts must be excluded from commits

## Environment Assumptions

Expected repository root:

```bash
frappe-1
```

Expected bench root:

```bash
cd start
```

Expected validation site:

```text
rbp-minimal.localhost
```

Expected app:

```text
rbp_app
```

Known forbidden paths for committed changes:

```text
frappe/
start/apps/*
start/sites/*
```

## Required Validation Before Launch

Run from the repository root:

```bash
git switch main
git pull --ff-only origin main
git status --short

start/env/bin/python -m compileall -q rbp_app/rbp_app

start/env/bin/python -m unittest \
  rbp_app.tests.test_the_fixer \
  rbp_app.tests.test_risk_advisor \
  rbp_app.tests.test_connectivity \
  rbp_app.tests.test_marketplace \
  rbp_app.tests.test_docushare \
  rbp_app.tests.test_decision_desk \
  rbp_app.tests.test_membership_onboarding \
  rbp_app.tests.test_phase3_partials \
  rbp_app.tests.test_platform_api \
  rbp_app.tests.test_tenancy \
  rbp_app.tests.test_api_integrations
```

Run bench validation from the bench root:

```bash
cd start
bench --site rbp-minimal.localhost migrate
bench --site rbp-minimal.localhost clear-cache
bench --site rbp-minimal.localhost run-tests --app rbp_app
cd ..
```

Clean generated local artifacts after bench commands:

```bash
git restore -- start/sites/frappe.localhost/learning.db 2>/dev/null || true
git restore -- start/sites/rbp-minimal.localhost 2>/dev/null || true
rm -f start/config/helpdesk_corpus_download.lock
git status --short
```

## Bench and Site Readiness

Readiness checks:

- Bench command runs from `start/`.
- Site exists and can load `rbp_app`.
- Migrations complete.
- Tests run against `rbp_app`.
- Logs are available under `start/logs`.
- Generated search index and touched table artifacts are not committed.

Failure handling:

- If `bench --site` fails with "No such option: --site", rerun from the bench root.
- If migration generates local site artifacts, restore them before committing.
- If tests fail, do not proceed to launch readiness.

## Migration Readiness

Migration must confirm:

- Frappe DocTypes update successfully.
- rbp_app DocTypes update successfully.
- Fixtures sync without errors.
- Dashboards sync without errors.
- after_migrate hooks execute.
- Search index rebuild queuing does not fail.

Pass criteria:

```text
bench --site rbp-minimal.localhost migrate
```

completes without errors.

## Cache Readiness

Before launch implementation:

```bash
cd start
bench --site rbp-minimal.localhost clear-cache
cd ..
```

Pass criteria:

- Cache clears without errors.
- Portal routes still load afterward.
- API tests still pass after cache clearing.

## Scheduler and Worker Readiness

Before production launch:

- Confirm scheduler is enabled where required.
- Confirm background workers can process queues.
- Confirm notification/email tasks do not fail.
- Confirm long-running workflows do not require unavailable workers.
- Confirm no Phase 3 module depends on unavailable scheduled jobs for correctness.

Phase 3 status:

- Backend services are synchronous enough for current tests.
- Scheduler and worker production tuning is deferred to deployment hardening.

## Email and Notification Readiness

Phase 3 implements portal notification records.

Before launch:

- Confirm email provider configuration if emails are required.
- Confirm notifications are visible through portal APIs.
- Confirm lifecycle events create RBP Notification records.
- Confirm read/unread actions work.
- Confirm admin users can inspect notification records.

Known deferral:

- Email delivery templates and provider-specific behaviour are not launch-implemented in Phase 3.

## File Storage Readiness

Phase 3 supports tenant-aware file references linked to Frappe File records.

Before launch:

- Confirm Frappe File storage path/provider.
- Confirm private file settings.
- Confirm file reference visibility values.
- Confirm owner, tenant, advisor, and admin access.
- Confirm archived file references are hidden from active views.

Known deferral:

- Raw file upload API/client integration is deferred to Phase 5 unless explicitly pulled forward.

## Payment and Billing Readiness

Phase 3 models:

- RBP Subscription
- RBP Payment Event
- Payment status values
- Provider customer/subscription/payment ID fields
- Provider event idempotency using provider event ID

Before live billing launch:

- Select payment provider.
- Wire checkout/session creation.
- Wire provider webhooks.
- Validate subscription transitions.
- Validate failed/refunded/disputed handling.
- Validate idempotency under repeated webhook delivery.

Known deferral:

- Live Stripe/payment provider integration is not completed in Phase 3.

## Admin Desk Operational Readiness

Admin workflows remain in Frappe Desk.

Before launch:

- Confirm System Manager can access relevant DocTypes.
- Confirm admin can view tenants, profiles, subscriptions, entitlements, product records, notifications, audit logs, and payment events.
- Confirm admin assignment/status fields are visible.
- Confirm no custom admin backend is required.
- Confirm `/admin` remains scaffold-only and does not duplicate Desk.

## Security and Permission Readiness

Required checks:

- Guests cannot access protected portal data.
- Guests are redirected from protected routes.
- Non-admin users cannot access admin routes.
- Cross-tenant access is denied.
- Draft-only edits are restricted.
- Admin actions require System Manager or Administrator.
- File references respect visibility.
- Audit records are not exposed to ordinary users.

## Backup and Restore Readiness

Before launch implementation:

- Confirm database backup command.
- Confirm files backup strategy.
- Confirm restoration has been tested on a non-production site.
- Confirm rollback point exists before migrations.
- Confirm generated bench artifacts are not treated as source-controlled recovery material.

## Rollback Planning

| Category | Rollback Action |
|---|---|
| Bad migration | Restore database backup and revert app commit |
| Broken API | Revert rbp_app commit or disable route/API exposure |
| Broken permissions | Revert permission change or apply emergency admin-only lock |
| Broken file handling | Disable upload/client entrypoint and preserve Frappe File records |
| Broken payment integration | Disable provider webhook/checkout and preserve payment events |
| Broken frontend integration | Revert frontend changes without changing rbp_app backend |

## Launch Blocker Categories

P0 launch blockers:

- Failed migration
- Failed rbp_app bench tests
- Cross-tenant data leakage
- Guest access to protected data
- Admin permissions unavailable
- Frappe Desk unusable for operations
- Payment provider corruption if live billing is enabled
- File access leakage

P1 launch blockers:

- Missing UAT coverage
- Incomplete smoke test results
- Unresolved entitlement gating decision
- Unresolved API response contract decision
- Missing rollback checklist

P2 launch blockers:

- Optional app adapter placeholders
- Non-critical notification trigger gaps
- Non-critical admin Desk UX refinements

## Launch No-Go Checklist

Do not launch if:

- `git status --short` is not clean.
- Any `start/sites/*` generated file is staged.
- Any Frappe core file is modified.
- Focused backend tests fail.
- Bench app tests fail.
- Migration fails.
- Cross-tenant tests fail.
- Guest protection fails.
- Admin access fails.
- Payment provider integration is partially enabled without validation.
- File visibility rules are unclear.

## Post-Launch Observation Checklist

Observe:

- Error logs
- Worker failures
- Failed API calls
- Permission errors
- Unexpected guest access attempts
- Tenant mismatch exceptions
- Payment event failures
- Notification creation failures
- File reference access failures
- Slow queries
- Repeated failing jobs

## Open Risks

- Entitlement behaviour is scaffold-safe when no entitlement records exist.
- Raw upload integration is deferred.
- Optional app adapters are mostly safe placeholders.
- RBP-specific role fixtures need final product decision.
- Strict workflow transition matrices are not universal.
- Fresh install validation should be repeated before production launch.

## Recommended Next Implementation Lanes

After Phase 3:

1. Repository consolidation planning
2. Phase 5 frontend/backend integration planning
3. Real HTTP/API smoke test implementation
4. QA/UAT execution
5. Deployment/environment hardening
6. Payment provider integration
