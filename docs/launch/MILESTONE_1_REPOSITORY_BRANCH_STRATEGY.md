# Milestone 1: Repository and Branch Strategy

## Status

Milestone 1 is complete when the repository source-of-truth model, branch ownership, merge order, and validation rules are documented and accepted.

## Repository source of truth

### Backend source of truth

`info-rbp/frappe-project` is the backend implementation base.

It owns:

- Frappe app implementation
- Backend DocTypes
- Backend APIs
- Stripe backend services
- Email notification backend services
- Entitlement logic
- Tenant/account provisioning
- Frappe Desk admin operations
- Backend migrations and bench validation

### Consolidated launch repository

`info-rbp/rbp-platform` is the consolidated launch repository.

It owns:

- Public frontend
- Customer portal frontend
- React admin preview or connected admin UI
- Frontend API integration layer
- SEO/copy/deployment documentation
- QA deployment workflows
- Consolidated launch documentation

Backend code may be mirrored into `rbp-platform/apps/rbp_app` only after it is validated in `frappe-project`.

## Admin source of truth

For QA and launch-readiness work, Frappe Desk is the operational admin backend.

React `/admin` is not the only source of truth unless a specific screen is fully connected to Frappe persistence.

Any React admin screen that is mock, preview, local-state only, or not persisted to Frappe must be labelled accordingly.

## Branch groups

### Backend branches

Backend implementation and validation branches belong in `info-rbp/frappe-project`.

Known backend branch groups:

- `launch/backend-baseline-validation`
- `launch/backend-stripe-applications-email`
- `launch/milestone-8-entitlements-member-benefits`
- `final/backend-stripe-applications`
- `complete/milestones-6-to-11-backend-membership-entitlements-email-admin`

### Frontend branches

Frontend integration branches belong in `info-rbp/rbp-platform`.

Known frontend branch groups:

- `launch/frontend-api-integration`
- `launch/frontend-qa-integration`
- `complete/milestones-12-to-17-frontend-qa-deployment-readiness`

### Deployment and documentation branches

Deployment, QA, scope, and strategy branches belong in `info-rbp/rbp-platform`.

Known deployment/documentation branch groups:

- `launch/qa-deployment`
- `launch/milestone-0-lock-launch-scope`
- `complete/milestone-0-launch-scope`
- `complete/milestone-1-repository-branch-strategy`

## Merge order

Use this order to avoid source-of-truth drift:

1. Validate backend baseline in `frappe-project`.
2. Complete backend Stripe, Applications, email, tenant, subscription, and entitlement work in `frappe-project`.
3. Run backend compile and bench validation in `frappe-project`.
4. Merge backend work into `frappe-project/main`.
5. Mirror or consolidate validated backend work into `rbp-platform/apps/rbp_app` only after backend validation.
6. Merge frontend API integration work into `rbp-platform/main`.
7. Merge QA/deployment workflows and documentation into `rbp-platform/main`.
8. Run full frontend build, SEO audit, backend static validation, and QA smoke checks.

## Pull request rules

- No direct commits to `main`.
- Every milestone branch must have a pull request.
- Every pull request must state which milestone it completes.
- Backend PRs must include compile, migrate, and test notes.
- Frontend PRs must include build and audit notes.
- Deployment PRs must include rollback notes.
- If a command cannot be run, the PR must explicitly say why and list the command still required.
- Do not mark bench validation complete unless it was run against the actual target Frappe site.
- Do not mark Stripe validation complete unless it was run with Stripe test-mode configuration.
- Do not mark email validation complete unless QA sandbox or allowlist behaviour was tested.

## Backend validation requirements

Backend PRs should run, where available:

    python3 -m compileall rbp_app/rbp_app
    bench --site <qa-site> migrate
    bench --site <qa-site> clear-cache
    bench --site <qa-site> run-tests --app rbp_app

If bench is unavailable, record that explicitly in the PR.

## Frontend validation requirements

Frontend PRs should run:

    cd frontend/portal
    npm ci
    npm run build
    npm run audit:seo

## Deployment validation requirements

Deployment PRs should document:

- Target QA domain
- Backend site name
- Frontend host
- Stripe test-mode status
- Email sandbox status
- Required GitHub Actions secrets
- Rollback path
- Smoke test commands

## Acceptance criteria

Milestone 1 is complete when:

- `frappe-project` is documented as the backend implementation base.
- `rbp-platform` is documented as the consolidated launch repository.
- Backend, frontend, deployment, and documentation branch responsibilities are clear.
- Existing milestone branches are inventoried.
- Merge order is documented.
- Validation expectations are documented.
- Frappe Desk is documented as the operational admin backend for QA.
- React `/admin` limitations are documented.
- No application code is modified for this milestone.
