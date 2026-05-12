# Milestone 5: Stripe Foundation

Milestone 5 adds a backend-only Stripe foundation for RBP membership billing. It supports Stripe Checkout Sessions in subscription mode, signed webhook verification, idempotent payment event recording, subscription synchronisation, entitlement updates, notifications, and audit logs.

This milestone is QA/test-mode safe. It does not implement marketplace billing, live app provisioning, coupons, tax automation, refunds, or Stripe Customer Portal.

## Configuration

Server-side configuration values:

- `RBP_ENABLE_STRIPE=true`
- `RBP_STRIPE_MODE=test`
- `RBP_STRIPE_SECRET_KEY=sk_test_...`
- `RBP_STRIPE_WEBHOOK_SECRET=whsec_...`
- `RBP_STRIPE_SUCCESS_URL=/portal/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`
- `RBP_STRIPE_CANCEL_URL=/portal/billing?checkout=cancelled`

Live mode requires a live secret key. Test mode requires a test secret key. Stripe secret and webhook keys are read only on the backend and are never returned to frontend APIs.

## Checkout

Authenticated users create Checkout Sessions through:

- `rbp_app.api.billing.create_membership_checkout_session`

The frontend passes a membership `plan_code`. Amount, currency, product ID, and price ID are loaded from `RBP Membership Plan`; frontend-provided amounts and Stripe IDs are ignored.

The checkout service creates or reuses a pending `RBP Subscription`, then creates a Stripe Checkout Session with:

- `mode = subscription`
- one server-side Stripe Price from the membership plan
- RBP metadata for subscription, tenant, user, plan, and Stripe mode

The API returns the Checkout Session ID and hosted checkout URL only.

## Webhooks

Stripe webhooks are handled by:

- `rbp_app.api.stripe_webhooks.handle_stripe_webhook`

The endpoint allows guest access because Stripe calls it server-to-server. Security is enforced by Stripe signature verification using `RBP_STRIPE_WEBHOOK_SECRET`.

Supported event families include:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `invoice.paid`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Webhook replay is idempotent. If an `RBP Payment Event` already exists for `provider_event_id`, processing returns the existing event and does not resynchronise subscription state.

## Records Updated

Stripe webhooks create `RBP Payment Event` records with the raw Stripe event payload stored in the admin-restricted backend DocType.

Webhook processing updates `RBP Subscription` fields including:

- Stripe customer ID
- Stripe subscription ID
- Stripe payment ID
- product and price IDs
- payment status
- subscription status
- period start/end
- cancel-at-period-end
- last payment event

Subscription states then sync `RBP App Entitlement` records from the membership plan’s `included_apps` field.

## Notifications And Audit

Successful activation, failed payment, and access changes create internal `RBP Notification` records when the notification DocType is available. Payment and Stripe processing also write `RBP Audit Log` entries when audit logging is installed.

No email delivery is implemented here beyond existing notification hooks.

## Security Notes

- Stripe secret keys are backend-only.
- Webhooks must pass Stripe signature verification.
- Membership plans are the source of truth for price IDs and amounts.
- Customer APIs require authenticated users.
- Admin payment event recording remains restricted to System Manager.
- No card data is logged.
- Customer-facing application provisioning remains disabled.
