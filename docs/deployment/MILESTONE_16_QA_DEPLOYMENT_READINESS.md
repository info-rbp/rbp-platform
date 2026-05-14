# Milestone 16: QA Deployment Infrastructure Readiness

## Repository

`info-rbp/rbp-platform`

## Required external setup

- GitHub Actions QA deploy secrets configured.
- QA frontend host reachable.
- QA backend and Frappe bench reachable.
- QA site configured.
- Stripe test product and recurring AUD test price created.
- Stripe webhook endpoint configured.
- QA backend Stripe secret and webhook secret configured outside Git.
- SMTP or Frappe Email Account configured.
- QA email sandbox allowlist configured.
- HTTPS enabled.
- Rollback path documented.

## Required validation

Frontend:

    cd frontend/portal
    npm ci
    npm run build
    npm run audit:seo

Backend:

    bench --site <qa-site> migrate
    bench --site <qa-site> clear-cache
    bench --site <qa-site> run-tests --app rbp_app

Smoke:

    curl -I https://qa.remotebusinesspartner.com.au
    curl -I https://qa.remotebusinesspartner.com.au/signin
    curl -I https://qa.remotebusinesspartner.com.au/portal/dashboard
    curl -I https://qa.remotebusinesspartner.com.au/admin/signin

## Completion criteria

Milestone 16 is complete only when the QA environment is live, reachable, configured with test-mode Stripe and sandbox email, and smoke tests pass.
