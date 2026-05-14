# Milestone 17: CI/CD Finalisation

## Repository

`info-rbp/rbp-platform`

## Current workflows

Expected workflows:

- Frontend validation
- SEO validation
- Backend static validation
- Frappe smoke
- QA deploy

## Required behaviour

Frontend validation must run:

    npm ci
    npm run build
    npm run audit:seo

Backend static validation must run:

    python3 -m compileall apps/rbp_app/rbp_app

Frappe smoke must either:

- run against a configured QA bench, or
- explicitly skip when no QA bench is configured.

QA deploy must:

- build frontend
- run SEO audit
- deploy static frontend using GitHub Actions secrets
- avoid printing secrets
- keep backend deploy manual unless a backend deploy workflow is explicitly added

## External secrets required

- `QA_HOST`
- `QA_USER`
- `QA_SSH_KEY`
- `QA_FRONTEND_PATH`
- `QA_PUBLIC_SITE_URL`
- `QA_API_BASE_URL`

## Completion criteria

Milestone 17 is complete when workflows exist, validation passes, QA deploy secrets are configured, and either backend deploy automation exists or the manual backend deploy path is explicitly documented.
