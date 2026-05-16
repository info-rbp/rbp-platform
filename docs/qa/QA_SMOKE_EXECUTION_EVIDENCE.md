# QA Smoke Execution Evidence

Record the live execute-mode smoke test results here.

## Run Metadata

- Date:
- Operator:
- Branch or commit:
- QA environment loaded:
- Notes:

## Command Results

| Command | Timestamp | Result | Caveats |
|---|---|---|---|
| `npm run smoke:qa:auth -- --execute` |  |  |  |
| `npm run smoke:qa:billing -- --execute` |  |  |  |
| `npm run smoke:qa:stripe-webhook -- --execute` |  |  |  |
| `npm run smoke:qa:service-requests -- --execute` |  |  |  |
| `npm run smoke:qa:admin -- --execute` |  |  |  |
| `npm run smoke:qa:permissions -- --execute` |  |  |  |
| `npm run smoke:qa:email` |  |  |  |

## Expected Coverage

- QA user can authenticate.
- Stripe test configuration is valid.
- Webhook verification and idempotency work.
- Service requests persist with tenant scoping.
- Admin access is denied for non-admins and allowed for admins.
- Cross-tenant and notification isolation hold.
- Email allowlist and blocked-recipient behavior are recorded.

## Failures And Follow-Up

| Area | Failure | Likely Cause | Next Action |
|---|---|---|---|
| Auth |  |  |  |
| Billing |  |  |  |
| Stripe webhook |  |  |  |
| Service requests |  |  |  |
| Admin |  |  |  |
| Permissions |  |  |  |
| Email |  |  |  |

## Sign-Off

- Result:
- Reviewer:
- Remaining caveats:
