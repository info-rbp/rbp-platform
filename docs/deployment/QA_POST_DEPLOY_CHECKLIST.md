# QA Post Deploy Checklist

## Appwrite

- Appwrite auth can create and sign in a QA user.
- tenant bootstrap creates tenant, business profile, and user profile records.
- public tenant bootstrap ignores client-supplied role and cannot create admins.
- duplicate business names do not link unrelated users to the same tenant.
- membership plans load from Appwrite.
- application interest writes to Appwrite.
- service request submission writes to Appwrite.
- admin operations require Appwrite admin team membership or a QA-only trusted internal token.
- `npm run appwrite:functions:verify` confirms every configured Function exists after deployment.
- membership plans load from Appwrite.
- application interest writes to Appwrite.
- service request submission writes to Appwrite.
- admin operations require admin role or team checks.

## Stripe

- Stripe test checkout can start.
- webhook delivery is verified in test mode.
- fixture webhook proof covers success, payment failure, subscription deletion, and duplicate replay.
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
- direct notification collection reads are admin-only; customer notification access is Function-scoped.
- notification delivery logs remain admin-only.

## Automated command gate

Run these before manual UAT:

```bash
npm run test:unit
npm run test:integration
npm run test:smoke:dry-run
npm run appwrite:schema:validate
npm run appwrite:permissions:validate
npm run appwrite:functions:validate
npm run appwrite:seed:validate
npm run appwrite:stripe-plan-mapping:validate
```

Run live checks only when QA variables and secrets are configured:

```bash
npm run appwrite:connection:validate
npm run appwrite:inspect
npm run appwrite:schema:diff
npm run appwrite:functions:verify
npm run smoke:qa:auth -- --execute
npm run smoke:qa:billing -- --execute
npm run smoke:qa:stripe-webhook -- --execute
npm run smoke:qa:service-requests -- --execute
npm run smoke:qa:admin -- --execute
npm run smoke:qa:permissions -- --execute
npm run smoke:qa:email
```

## Session Status In This Run

This checklist was updated to reflect the required QA checks. Live post-deploy Appwrite, Stripe, and email checks still require QA secrets and reachable deployed Functions.

## Session Status In This Run

This checklist was updated to reflect the required QA checks, but the live post-deploy run was not executed in this session because QA credentials and a runnable checkout were unavailable.
