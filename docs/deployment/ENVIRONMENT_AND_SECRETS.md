# Environment and Secrets

## Purpose

This document defines the environment variables and secret handling rules for the RBP QA and production rollout.

## Environment files

Root backend/deployment examples:

- `.env.example`
- `.env.qa.example`
- `.env.production.example`

Frontend examples:

- `frontend/portal/.env.example`
- `frontend/portal/.env.qa.example`
- `frontend/portal/.env.production.example`

## Backend/server-only variables

These variables must never be exposed to the frontend bundle:

- `RBP_STRIPE_SECRET_KEY`
- `RBP_STRIPE_WEBHOOK_SECRET`
- SMTP username/password or Frappe Email Account credentials
- database credentials
- deploy SSH keys
- GitHub Actions deployment secrets

## Frontend-safe variables

Variables prefixed with `VITE_` are public at build time.

They may include:

- public site URL
- public API URL
- feature flags
- QA environment indicator
- mock-auth flag
- application rollout flags

They must not include:

- Stripe secret keys
- Stripe webhook secrets
- SMTP credentials
- database credentials
- deployment keys

## QA feature flags

QA should use:

- `RBP_ENVIRONMENT=qa`
- `RBP_ENABLE_STRIPE=true`
- `RBP_STRIPE_MODE=test`
- `RBP_ENABLE_EMAIL_NOTIFICATIONS=true`
- `RBP_EMAIL_SANDBOX_MODE=true`
- `RBP_ENABLE_APPLICATION_PROVISIONING=false`
- `RBP_ENABLE_APPLICATION_INTEREST=true`
- `RBP_ENABLE_ADMIN_APPLICATIONS=true`

Frontend QA should use:

- `VITE_QA_ENVIRONMENT=true`
- `VITE_ENABLE_APPLICATIONS=false`
- `VITE_ENABLE_APPLICATION_INTEREST=true`
- `VITE_ENABLE_APPLICATION_PROVISIONING=false`
- `VITE_ENABLE_ADMIN_APPLICATIONS=true`
- `VITE_ENABLE_STRIPE_CHECKOUT=true`
- `VITE_ENABLE_EMAIL_NOTIFICATIONS=true`
- `VITE_EMAIL_SANDBOX_MODE=true`
- `VITE_ENABLE_MOCK_AUTH=false`

## Production feature flags

Production must keep Applications provisioning disabled until the Applications rollout is explicitly launched:

- `RBP_ENABLE_APPLICATION_PROVISIONING=false`
- `VITE_ENABLE_APPLICATION_PROVISIONING=false`

## Required GitHub Actions secrets for QA deploy

The QA deploy workflow should use GitHub Actions secrets for:

- `QA_SSH_HOST`
- `QA_SSH_USER`
- `QA_SSH_KEY`
- `QA_FRONTEND_PATH`
- `QA_PUBLIC_SITE_URL`
- `QA_API_BASE_URL`

Backend deploy and Frappe site secrets should be configured on the QA server or bench site config, not committed to the repository.

## Stripe QA setup

Stripe QA requires:

- test-mode Stripe secret key
- test-mode Stripe webhook secret
- test product
- recurring AUD test price
- webhook endpoint configured for the QA backend
- subscribed webhook events for checkout, subscription, invoice, payment, refund, and dispute events

## Email QA setup

Email QA requires:

- Frappe Email Account or SMTP configuration
- sandbox mode enabled
- QA recipient allowlist
- admin notification recipient list
- no real customer email delivery unless explicitly approved

## Acceptance criteria

Milestone 3 is complete when:

- root backend environment examples exist
- frontend environment examples exist
- secret handling rules are documented
- QA environment variables are documented
- production environment variables are documented
- Applications provisioning is disabled by default
- Stripe test-mode boundaries are documented
- email sandbox boundaries are documented
- no real secrets are committed