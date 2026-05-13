# QA Remediation Handoff

Final status: READY FOR PR REVIEW.

Do not treat QA as passed from this document. This handoff only covers local review-branch readiness.

## Current Status

- Local remediation reviewed.
- Review branch: `qa-remediation-review`.
- Commit SHA: see the review branch commit and PR metadata after commit creation.
- PR URL: see final operator report or GitHub PR metadata.

## Validation Results

| Check | Result |
| --- | --- |
| `npm ci` | Passed. |
| `npm run build` | Passed with existing large chunk warning. |
| `npm run audit:seo` | Passed. |
| `python3 -m compileall apps/rbp_app/rbp_app` | Passed. |
| Backend JSON metadata parse | Passed. |
| `bench --site rbp-minimal.localhost migrate` | Passed after starting local bench services. |
| `bench --site rbp-minimal.localhost clear-cache` | Passed. |
| `bench --site rbp-minimal.localhost run-tests --app rbp_app` | Passed: 199 tests, 2 skipped. |

## Backend Method Verification

- `rbp_app.api.billing.create_membership_checkout_session`: present, whitelisted POST, authenticated only.
- `rbp_app.api.billing.get_my_payment_summary`: present, whitelisted, authenticated only, excludes raw Stripe payload.
- `rbp_app.api.billing.cancel_subscription`: present, whitelisted POST, authenticated only.
- `rbp_app.api.applications.register_application_interest`: present, whitelisted guest endpoint, delegates to interest creation with email required for guests.
- `rbp_app.api.stripe_webhooks.handle_stripe_webhook`: present, whitelisted guest POST, verifies Stripe signatures.

## Security Review

- No real secrets found in repository scan.
- Stripe secret key and webhook secret are read from backend config/environment only.
- QA frontend env uses test/sandbox settings and mock auth is disabled.
- Applications provisioning defaults disabled.
- Stripe-enabled membership checkout no longer falls back to mock signup on failure.
- Stripe webhook events are idempotent by `provider_event_id`.

## Deployment Review

- `.github/workflows/deploy-qa.yml` triggers only on `workflow_dispatch` and push to `qa`.
- The workflow builds the frontend with QA Vite env values, runs `npm ci`, `npm run build`, and `npm run audit:seo`.
- The deploy step uses `QA_HOST`, `QA_USER`, `QA_SSH_KEY`, and optional `QA_FRONTEND_PATH`.
- The deploy step backs up the previous frontend release and rejects unsafe target paths before `rsync --delete`.
- Backend deploy remains manual: pull latest app, migrate, clear cache, run tests, restart.

## External Blockers Remaining

- GitHub Actions QA deploy secrets are not verified.
- Stripe test product, recurring AUD price, and webhook endpoint still need dashboard setup.
- QA bench site config and backend Stripe/webhook secrets still need to be applied.
- QA SMTP/email account, sandbox mode, and allowlist still need Desk/server setup.
- QA public/API URL reachability still needs live verification.

## Next Human/Operator Actions

- Configure GitHub QA deploy secrets.
- Configure Stripe test product, price, and webhook.
- Configure QA bench site settings and backend secrets.
- Configure QA email sandbox and allowlist.
- Review and merge the remediation PR when external setup is ready.
- Promote `main` to `qa` only when deployment is intentionally approved.
- Deploy backend and run live QA gates.
