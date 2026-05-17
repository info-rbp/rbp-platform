# QA Smoke Execution Evidence

Timestamp: 2026-05-17T03:35:29Z

## Environment Check

All requested smoke keys were loaded: `QA_SMOKE_USER_EMAIL`, `QA_SMOKE_USER_PASSWORD`, `QA_SMOKE_USER_ID`, `QA_SMOKE_ADMIN_USER_ID`, `QA_SMOKE_TENANT_ID`, `QA_SMOKE_PLAN_CODE`, `QA_SMOKE_SERVICE_TYPE`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`, `QA_EMAIL_ALLOWLIST`, `QA_EMAIL_ALLOWED_RECIPIENT`, and `QA_EMAIL_BLOCKED_RECIPIENT`.

## Setup Evidence

- `npm run appwrite:functions:deploy -- --apply`: PASS. Created/updated all 14 configured functions, uploaded deployments, and reconciled runtime variables by key name only.
- Latest deployment status for all 14 configured functions: `ready`.
- `bootstrap-tenant` was executed for the configured smoke user after `user_profiles` lookup returned 0 matches. Result: PASS.
- `APPWRITE_ADMIN_TEAM_ID` lookup initially returned 404. The QA admin team and membership for the configured admin smoke user were created. No resources were deleted.
- `QA_SMOKE_USER_ID` and `QA_SMOKE_ADMIN_USER_ID` were separated after the initial evidence run. Admin smoke now passes without sentinel override.
- `QA_SMOKE_TENANT_ID` lookup returned 404; Stripe smoke remains blocked until the QA tenant fixture is corrected.

## Command Results

| Command | Result | Evidence |
| --- | --- | --- |
| `npm run smoke:qa:auth -- --execute` | PASS | AppWrite session created successfully for the configured QA smoke user after password reset. |
| `npm run smoke:qa:billing -- --execute` | BLOCKED | Safety check failed because `STRIPE_SECRET_KEY` is not a Stripe test-mode `sk_test_` key. |
| `npm run smoke:qa:stripe-webhook -- --execute` | NOT RUN | Blocked by non-test Stripe key; signed webhook proof not attempted. |
| `npm run smoke:qa:service-requests -- --execute` | PASS | `create-service-request` executed successfully after smoke user bootstrap. |
| `npm run smoke:qa:admin -- --execute` | PASS | Non-admin denial passed with distinct `QA_SMOKE_USER_ID`; configured admin user passed through `APPWRITE_ADMIN_TEAM_ID`. |
| `npm run smoke:qa:permissions -- --execute` | PASS | Application provisioning remained disabled and customer notification path was scoped. |
| `npm run smoke:qa:email` | PASS | Allowlisted and blocked email proof executions completed; queue processing ran. |

## Blockers

- Billing and Stripe webhook smoke remain blocked until QA uses a Stripe test-mode secret key and valid QA tenant fixture.


## Auth smoke rerun

`npm run smoke:qa:auth -- --execute`: PASS.

Evidence:

- AppWrite health endpoint reachable.
- AppWrite database reachable.
- Email/password session created for configured QA smoke user.
- Smoke user ID returned: `6a080f29488f13d9f923`.

Note:

- `.env.qa.local` was updated locally only.
- The smoke password must not be committed.


## Smoke fixture separation rerun

`npm run smoke:qa:admin -- --execute`: PASS.

Evidence:

- `QA_SMOKE_USER_ID` now points to a distinct non-admin AppWrite user.
- `QA_SMOKE_ADMIN_USER_ID` remains a separate AppWrite admin-team user.
- Non-admin admin-operation denial passed.
- Admin operation passed through `APPWRITE_ADMIN_TEAM_ID`.

`npm run smoke:qa:permissions -- --execute`: PASS.

Evidence:

- Application provisioning remains disabled.
- Customer notification path remains scoped.

`QA_SMOKE_TENANT_ID` was updated locally to the tenant linked to the non-admin smoke profile.

Note:

- `.env.qa.local` was updated locally only.
- No secrets were committed.
