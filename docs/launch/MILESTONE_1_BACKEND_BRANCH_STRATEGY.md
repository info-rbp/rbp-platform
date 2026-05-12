# Milestone 1: Backend Launch Branch Strategy

## Repository role

This repository, `rbp-platform`, is the active Phase 5 source-of-truth repository.

Backend launch work will be implemented from the consolidated backend app located at:

`apps/rbp_app/`

The historical `info-rbp/frappe-project` repository is reference/source-history only for Phase 5. It must not be used as the active implementation repository.

## Branch

Backend launch work will be isolated in:

`launch/backend-stripe-applications-email`

## Backend launch scope

This branch will contain backend work for:

- Stripe checkout and webhook integration
- Membership subscriptions
- Payment event logging
- Entitlements
- Email notifications
- Application backend/admin management
- Application interest capture
- Tenant and account provisioning
- Service request persistence
- QA backend validation

## Rules

- Do not commit backend launch work directly to `main`.
- Do not begin Phase 5 backend work from `frappe-project`.
- Do not copy the full `frappe-project` repository into `rbp-platform`.
- Do not copy Frappe framework core.
- Do not commit `frappe/`, `apps/frappe/`, generated bench files, sites, logs, secrets, `.env` files, `node_modules`, or frontend build output.
- Backend launch work must stay inside the consolidated repository structure.
- The backend implementation target is `apps/rbp_app/`.

## Acceptance criteria

- Backend work is isolated inside `rbp-platform`.
- The backend launch branch exists locally and remotely.
- The branch is ready for Stripe, Applications, email, entitlement, tenancy, and QA backend implementation.
