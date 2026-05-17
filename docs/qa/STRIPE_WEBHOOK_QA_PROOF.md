# Stripe Webhook QA Proof

Timestamp: 2026-05-17T05:56:59.494529Z

## Result

Status: PASS.

## Commands

- `npm run appwrite:stripe-plan-mapping:validate`: PASS.
- `npm run smoke:qa:billing -- --execute`: PASS.
- `npm run smoke:qa:stripe-webhook -- --execute`: PASS.

## Stripe QA Mapping

- QA Stripe price ID: `price_1TXx7C0mYebE7B3JyCL64COg`.
- QA Stripe product ID: `prod_UX19mM8SidwDPS`.
- Plan code: `premium`.
- Currency: `AUD`.
- Amount: `25`.
- Billing cycle: `weekly`.

## Proof Checklist

- Stripe key mode verified as test mode: yes.
- Signed webhook verified: yes.
- `checkout.session.completed` fixture processed: yes.
- `invoice.payment_failed` fixture processed: yes.
- `customer.subscription.deleted` fixture processed: yes.
- Duplicate replay idempotency check: executed.
- QA tenant fixture exists: yes.
- Billing smoke passed: yes.

## Notes

- Secret values were not printed.
- `.env.qa.local` was updated locally only.
- This proof uses safe smoke fixture events against the AppWrite `stripe-webhook` function.
