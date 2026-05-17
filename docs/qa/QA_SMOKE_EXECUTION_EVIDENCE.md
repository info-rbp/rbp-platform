# QA Smoke Execution Evidence

Timestamp: 2026-05-17T03:35:29Z

## Environment Check

All requested smoke keys were loaded: `QA_SMOKE_USER_EMAIL`, `QA_SMOKE_USER_PASSWORD`, `QA_SMOKE_USER_ID`, `QA_SMOKE_ADMIN_USER_ID`, `QA_SMOKE_TENANT_ID`, `QA_SMOKE_PLAN_CODE`, `QA_SMOKE_SERVICE_TYPE`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`, `QA_EMAIL_ALLOWLIST`, `QA_EMAIL_ALLOWED_RECIPIENT`, and `QA_EMAIL_BLOCKED_RECIPIENT`.

## Setup Evidence

- `npm run appwrite:functions:deploy -- --apply`: PASS. Created/updated all 14 configured functions, uploaded deployments, and reconciled runtime variables by key name only.
- Latest deployment status for all 14 configured functions: `ready`.
- `bootstrap-tenant` was executed for the configured smoke user after `user_profiles` lookup returned 0 matches. Result: PASS.
- `APPWRITE_ADMIN_TEAM_ID` lookup initially returned 404. The QA admin team and membership for the configured admin smoke user were created. No resources were deleted.
- `QA_SMOKE_USER_ID` and `QA_SMOKE_ADMIN_USER_ID` are the same value, so the admin smoke denial leg used a non-member sentinel user ID for the non-admin check.
- `QA_SMOKE_TENANT_ID` lookup returned 404; Stripe smoke remains blocked until the QA tenant fixture is corrected.

## Command Results

| Command | Result | Evidence |
| --- | --- | --- |
| `npm run smoke:qa:auth -- --execute` | FAIL | Appwrite returned `401 user_invalid_credentials`; configured smoke password is invalid. |
| `npm run smoke:qa:billing -- --execute` | BLOCKED | Safety check failed because `STRIPE_SECRET_KEY` is not a Stripe test-mode `sk_test_` key. |
| `npm run smoke:qa:stripe-webhook -- --execute` | NOT RUN | Blocked by non-test Stripe key; signed webhook proof not attempted. |
| `npm run smoke:qa:service-requests -- --execute` | PASS | `create-service-request` executed successfully after smoke user bootstrap. |
| `QA_SMOKE_USER_ID=qa-smoke-non-admin-deny-only npm run smoke:qa:admin -- --execute` | PASS | Non-admin denial passed and configured admin user passed through `APPWRITE_ADMIN_TEAM_ID`. |
| `npm run smoke:qa:permissions -- --execute` | PASS | Application provisioning remained disabled and customer notification path was scoped. |
| `npm run smoke:qa:email` | PASS | Allowlisted and blocked email proof executions completed; queue processing ran. |

## Blockers

- Auth smoke remains blocked until `QA_SMOKE_USER_PASSWORD` is corrected for the configured smoke user.
- Billing and Stripe webhook smoke remain blocked until QA uses a Stripe test-mode secret key and valid QA tenant fixture.
- `QA_SMOKE_USER_ID` and `QA_SMOKE_ADMIN_USER_ID` should be distinct for the default admin smoke command to run without a sentinel override.
- `QA_SMOKE_TENANT_ID` should point at an existing QA tenant before Stripe webhook smoke runs.
