# Launch Scope Acceptance Checklist

## Foundation Complete

- Appwrite is the active backend direction in architecture, launch, and QA docs.
- React `/admin` backed by Appwrite Functions is the target QA admin surface.
- Frappe is reference-only and not an active runtime dependency.
- Environment examples default to `VITE_BACKEND_PROVIDER=appwrite`.
- Application provisioning remains disabled.
- Application interest remains enabled.
- Cloudflare route controls and protected-route noindex rules exist in the repo.

## Runtime Implemented

- Appwrite deploy scripts perform real schema, function, and seed operations.
- Appwrite Functions perform real reads and writes instead of returning scaffolding responses.
- Frontend auth, billing, applications, portal, services, notifications, and entitlements paths compile against the Appwrite runtime.
- Admin operations are enforced through Appwrite-authenticated Function calls only.
- Executable tests exist for config, schema, integration, and smoke boundaries.

## QA Validated

- Appwrite connection validation ran with real QA credentials.
- Appwrite inventory and baseline docs record live results.
- Cloudflare QA env validation ran with real project values.
- Frontend build and SEO audit ran successfully.
- Stripe test checkout and webhook flows were exercised end to end.
- QA smoke checks ran against reachable QA services.

## Production Blocked

Production remains blocked until all of the following are true:

- QA validation is complete and recorded.
- Production secrets are configured separately from QA.
- Production payment capture is intentionally enabled and tested.
- Application provisioning is explicitly approved for release.
- Security, operational readiness, and post-deploy support checks are signed off.