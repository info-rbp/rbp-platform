# Email Sandbox QA Proof

Use this document to record allowlisted and blocked-recipient email behavior in QA.

## Preconditions

- `notification_deliveries` schema diff is clean.
- `QA_EMAIL_ALLOWLIST` is set.
- `QA_EMAIL_ALLOWED_RECIPIENT` is set.
- `QA_EMAIL_BLOCKED_RECIPIENT` is set.
- SMTP or sandbox delivery mode is known.

## Execution

- `npm run smoke:qa:email`:
- Timestamp:
- Result:

## Expected Outcomes

| Scenario | Expected Status | Recorded Outcome | Notes |
|---|---|---|---|
| Allowlisted recipient | `sent` or `queued` |  |  |
| Blocked recipient | `blocked`, `skipped`, or `failed` according to implementation |  |  |

## Record Checks

Inspect and record evidence from:

- `notifications`
- `notification_deliveries`
- `audit_events`

## Delivery Details

| Check | Allowed Recipient | Blocked Recipient |
|---|---|---|
| Recipient recorded |  |  |
| Attempt count |  |  |
| `sent_at` populated |  |  |
| `provider_message_id` populated |  |  |
| `error_message` explains block |  |  |

## Sign-Off

- Result:
- Reviewer:
- Remaining caveats:
