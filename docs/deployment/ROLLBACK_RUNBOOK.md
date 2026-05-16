# Rollback Runbook

Use this runbook for production rollback only after a launch issue or failed production gate.

## Triggers

- Critical customer-facing regression.
- Broken signup, auth, billing, or admin path.
- Appwrite schema drift with user impact.
- Failed function deployment or webhook processing.
- Cloudflare environment misconfiguration.

## Owners

- Incident lead:
- Backend owner:
- Frontend owner:
- Billing owner:
- Communications owner:

## Rollback Steps

### Frontend Deployment

- Identify last known good deployment.
- Re-promote or redeploy the last known good frontend build.
- Confirm QA and production env parity for required frontend vars.
- Re-run smoke checks for auth, dashboard, billing entry, and admin access.

### Appwrite Schema Deployment

- Stop further schema apply attempts.
- Compare live schema against repository definitions.
- Restore the last known good schema state using approved manual or scripted procedure.
- Re-run `npm run appwrite:schema:diff` against the restored target.

### Appwrite Function Deployment

- Identify the last known good deployment for each affected function.
- Re-activate the prior deployment or re-deploy the prior artifact.
- Confirm function env vars and execution permissions remain correct.
- Re-run `npm run appwrite:functions:verify`.

### Stripe Webhook Configuration

- Disable or redirect the affected endpoint if events are being processed incorrectly.
- Restore the last known good endpoint configuration.
- Confirm webhook secret alignment.
- Send a controlled Stripe test event before reopening traffic.

### Email Provider Configuration

- Revert sender, provider, or allowlist changes.
- Confirm blocked-recipient protection still works.
- Re-run the QA email proof command or manual proof.

### Cloudflare Environment Variables

- Restore the last known good Cloudflare Pages env set.
- Confirm `VITE_BACKEND_PROVIDER=appwrite` and `VITE_ENABLE_MOCK_FALLBACK=false`.
- Rebuild and validate the frontend.

## Evidence

- Incident link:
- Commands run:
- Rollback completed at:
- Verification evidence:

## Closure

- Final status:
- Follow-up actions:
- Owner:
