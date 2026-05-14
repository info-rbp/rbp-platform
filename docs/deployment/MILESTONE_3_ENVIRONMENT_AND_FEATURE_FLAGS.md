# Milestone 3: Environment and Feature Flags

## Status

Milestone 3 documents the backend and frontend environment variable examples, feature flag defaults, and secret handling rules required for QA and production readiness.

## Completed files

Backend/deployment examples:

- `.env.example`
- `.env.qa.example`
- `.env.production.example`

Frontend examples:

- `frontend/portal/.env.example`
- `frontend/portal/.env.qa.example`
- `frontend/portal/.env.production.example`

Deployment documentation:

- `docs/deployment/ENVIRONMENT_AND_SECRETS.md`
- `docs/deployment/MILESTONE_3_ENVIRONMENT_AND_FEATURE_FLAGS.md`

## Launch rules

Applications provisioning remains disabled:

- `RBP_ENABLE_APPLICATION_PROVISIONING=false`
- `VITE_ENABLE_APPLICATION_PROVISIONING=false`

Application interest remains enabled:

- `RBP_ENABLE_APPLICATION_INTEREST=true`
- `VITE_ENABLE_APPLICATION_INTEREST=true`

Admin application management remains enabled:

- `RBP_ENABLE_ADMIN_APPLICATIONS=true`
- `VITE_ENABLE_ADMIN_APPLICATIONS=true`

Stripe is enabled in QA test mode only:

- `RBP_ENABLE_STRIPE=true`
- `RBP_STRIPE_MODE=test`
- `VITE_ENABLE_STRIPE_CHECKOUT=true`

Email notifications are QA sandboxed:

- `RBP_ENABLE_EMAIL_NOTIFICATIONS=true`
- `RBP_EMAIL_SANDBOX_MODE=true`
- `VITE_ENABLE_EMAIL_NOTIFICATIONS=true`
- `VITE_EMAIL_SANDBOX_MODE=true`

Mock auth is disabled for QA:

- `VITE_ENABLE_MOCK_AUTH=false`

## Validation performed

The files were added as examples only. Real secrets must be supplied through GitHub Actions, Frappe bench site config, or server environment variables.

## Acceptance criteria

Milestone 3 is complete when:

- backend environment examples exist
- frontend environment examples exist
- QA and production examples exist
- secret handling rules are documented
- frontend-safe versus server-only variables are clearly separated
- Applications provisioning remains disabled
- no secrets are committed