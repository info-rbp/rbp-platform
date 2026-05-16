# QA Post Deploy Checklist

## Appwrite

- Appwrite auth can create and sign in a QA user.
- tenant bootstrap creates tenant, business profile, and user profile records.
- membership plans load from Appwrite.
- application interest writes to Appwrite.
- service request submission writes to Appwrite.
- admin operations require admin role or team checks.

## Stripe

- Stripe test checkout can start.
- webhook delivery is verified in test mode.
- payment events are recorded.
- subscriptions are updated.
- entitlements are granted or revoked correctly.

## Cloudflare

- frontend loads on Cloudflare QA.
- protected routes remain noindex.
- SPA fallback works.
- QA environment variables are applied correctly.

## Boundary Checks

- application pages remain interest-only.
- customer provisioning remains disabled.
- mock auth and mock fallback remain disabled in QA.
- admin route protection remains in place.

## Session Status In This Run

This checklist was updated to reflect the required QA checks, but the live post-deploy run was not executed in this session because QA credentials and a runnable checkout were unavailable.