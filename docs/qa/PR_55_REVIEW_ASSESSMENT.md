# PR #55 Review Assessment

## Summary

- PR URL: https://github.com/info-rbp/rbp-platform/pull/55
- Branch: `qa-remediation-review`
- PR head SHA at review baseline: `de4f7af7f4401faba5709831369823f3234c34b3`
- Assessment follow-up commit: this document is committed on top of the baseline branch; use PR metadata for the latest branch head.
- Overall recommendation: READY FOR HUMAN MERGE REVIEW if GitHub Actions remain passing and no new code blockers are found.

PR #55 is open, ready for review, mergeable from GitHub's PR metadata, and targets `main` from `qa-remediation-review`. The local branch matches `origin/qa-remediation-review` before this assessment follow-up.

Per project owner instruction, the external Appwrite status named `rbp-platform (New project)` was created accidentally and is stale/non-blocking for the current QA path. Do not use Appwrite for this QA deployment. Do not configure Appwrite, deploy through Appwrite, or block merge solely because of this status. The relevant repository validation checks are the GitHub Actions checks listed below.

QA deployment should use the configured GitHub Actions `deploy-qa.yml` workflow or the selected manual deployment process after the required external setup is complete. This assessment does not mean live QA has passed.

## GitHub Status

| Check | Status | Notes |
| --- | --- | --- |
| Backend Static Validation / `compile` | Pass | GitHub Actions check run succeeded. |
| Backend Static Validation / `method-contract-check` | Pass | GitHub Actions check run succeeded. |
| Frontend Validation / `frontend` | Pass | GitHub Actions check run succeeded. |
| SEO Validation / `seo` | Pass | GitHub Actions check run succeeded. |
| Phase 4A Foundation Validation / `Validate repository structure` | Pass | GitHub Actions check run succeeded. |
| External Appwrite-style status: `rbp-platform (New project)` | Ignored / Non-blocking | Accidental stale external status per project owner instruction. Not a GitHub Actions check run and not part of this QA deployment path. |

External status assessment:

- Type: external commit status context (`StatusContext`), not a GitHub Actions check run.
- Provider target: `https://cloud.appwrite.io/console/project-syd-69ff55980009b1cd7dbe/functions/function-69ff594b000beaeee38e`.
- GitHub deployment record: none found for this commit through the GitHub deployments API.
- Branch protection: GitHub API reports `main` is not protected, and no repository rulesets were visible to the authenticated token.
- Required status: not shown as required by branch protection from available GitHub API access.
- Ownership/configuration: Appwrite target logs/configuration require external owner/admin access.
- Classification: NON-BLOCKING: accidental stale external status per project owner instruction.

Recommended external-check action: ignore for this QA path and remove or disable the Appwrite integration later after the GitHub Actions/manual QA deployment path is stable.

## Code Review Findings

Billing API:

- Expected Frappe methods exist: `create_membership_checkout_session`, `get_subscription_status`, `get_my_payment_summary`, and `cancel_subscription`.
- Billing methods are whitelisted and call `require_login()` before customer actions.
- Manual `record_payment_event` remains admin-only through `require_system_manager()`.

Stripe Checkout:

- Checkout Session creation is backend-side in `rbp_app.services.billing`.
- Stripe secret key is read from site config/environment only.
- Runtime mode validation requires `sk_test_` in test mode and `sk_live_` in live mode.
- Checkout uses Stripe subscription mode with success/cancel URLs based on backend public site config.
- Metadata includes user, tenant, subscription, plan code, and runtime environment where available.
- Live Stripe test configuration is still required before proving this flow against Stripe.

Stripe webhook:

- Webhook method exists as guest-callable POST because Stripe calls it externally.
- Missing, stale, or invalid `Stripe-Signature` is rejected before processing.
- Webhook secret is backend-only.
- Raw Stripe payload is stored only in admin-restricted `RBP Payment Event`.
- Payment event IDs are idempotent through `provider_event_id`.
- Follow-up fix added in this assessment: duplicate webhook event IDs now return early before subscription update/notification side effects.

Applications API:

- Public and portal application listing methods exist.
- Portal listing requires login.
- `register_application_interest` is intentionally guest-callable, but guest interest requires an email through delegated `submit_application_interest`.
- Interest records use `RBP Application Interest`; authenticated records include tenant where available.

Application DocTypes:

- `RBP Application`, `RBP Application Category`, and `RBP Application Provisioning Request` metadata exists and parses.
- Customer read/create permissions are not granted on admin catalogue/provisioning DocTypes.
- `provisioning_enabled` defaults false and `interest_enabled` defaults true.

Seed patch:

- Patch is registered once in `patches.txt`.
- Seed logic upserts by stable keys and is idempotent on repeated migrate.
- Seeded apps are ERPNext, CRM, HRMS, Helpdesk, Drive, LMS, Payments, Builder, and Insights.
- Seeded applications default to `register_interest`, CTA `Register interest`, and provisioning disabled.

Membership checkout fallback:

- Stripe-enabled frontend checkout no longer falls back to mock signup when checkout creation fails.
- Failure to start Stripe Checkout surfaces an error to the user.

Deployment workflow:

- `.github/workflows/deploy-qa.yml` triggers only on `workflow_dispatch` and push to `qa`.
- It does not trigger on `pull_request`.
- It builds with QA Vite env vars, runs `npm ci`, `npm run build`, and `npm run audit:seo`.
- It uses `QA_HOST`, `QA_USER`, `QA_SSH_KEY`, and optional `QA_FRONTEND_PATH`.
- It rejects unsafe target paths before using `rsync --delete`.
- It backs up the previous frontend release before replacement.
- It deploys frontend only; backend deployment remains manual.

QA docs:

- QA smoke, security, backup/rollback, external setup, handoff, and UAT defect docs exist.
- A live QA smoke gate was added for subscription activation, entitlement grant, and duplicate webhook behavior.
- Docs continue to state that this is review readiness only and not live QA completion.

## Security Review

- Secret scan found no real secrets. Hits were secret names/placeholders and test literals only.
- `.env.example` and `.env.qa.example` use safe QA/test defaults; mock auth is disabled.
- Stripe keys and webhook secrets are backend-only.
- Webhook signature verification is implemented before processing.
- Raw Stripe payload is not returned by customer payment summary and is stored in admin-restricted `RBP Payment Event`.
- Application provisioning remains disabled for customers by default and by runtime flag.
- Guest exposure is limited to public application listing, guest interest registration with email, and signed Stripe webhook endpoint.

## Validation Results

| Command | Result |
| --- | --- |
| `npm ci` | Passed; npm reported 1 high severity audit finding that is not introduced by this review follow-up. |
| `npm run build` | Passed with existing large chunk warning. |
| `npm run audit:seo` | Passed. |
| `python3 -m compileall apps/rbp_app/rbp_app` | Passed. |
| `bench --site rbp-minimal.localhost migrate` | Passed after starting local bench services. |
| `bench --site rbp-minimal.localhost clear-cache` | Passed. |
| `bench --site rbp-minimal.localhost run-tests --app rbp_app` | Passed: 199 tests, 2 skipped. |

## Remaining External Setup

- Configure GitHub Actions QA deploy secrets: `QA_HOST`, `QA_USER`, `QA_SSH_KEY`, optional `QA_FRONTEND_PATH`.
- Configure Stripe test product, recurring AUD price, and webhook.
- Save the Stripe price ID into `RBP Membership Plan`.
- Apply QA bench config and backend Stripe/webhook secrets.
- Configure QA SMTP/email sandbox, subject prefix, and allowlist.
- Verify QA public/API URL reachability.
- Perform backend manual deploy, migrate, clear cache, test, and restart.

## Merge Recommendation

PR #55 can proceed to human merge review if GitHub Actions pass and no code blockers are found. The accidental Appwrite status `rbp-platform (New project)` is non-blocking for this decision. Do not promote `main` to `qa` until required external setup is complete and live QA gates are ready to run.
