# Stripe Webhook QA Proof

Use this document to prove Stripe test events reach the deployed `stripe-webhook` Appwrite Function and update QA records correctly.

## Endpoint Setup

- Date:
- Operator:
- Stripe mode: test
- Endpoint URL recorded:
- Function target confirmed:
- Webhook secret loaded in `.env.qa.local`:
- Webhook secret loaded in Appwrite Function env:

## Required Events

| Event | Sent | 2xx Received | Records Updated | Notes |
|---|---|---|---|---|
| `checkout.session.completed` |  |  |  |  |
| `invoice.payment_failed` |  |  |  |  |
| `customer.subscription.deleted` |  |  |  |  |
| `customer.subscription.updated` |  |  |  |  |

## Local Validation

- `npm run smoke:qa:stripe-webhook -- --execute`:
- Timestamp:
- Result:

## Appwrite Record Checks

Inspect and record the affected collections:

- `payment_events`
- `subscriptions`
- `tenant_entitlements`
- `user_entitlements`
- `audit_events`
- `notifications`

## Idempotency Proof

- Event replay attempted:
- Duplicate side effects observed:
- Evidence:

## Sign-Off

- Result:
- Reviewer:
- Remaining caveats:
