# RBP Platform Architecture

## Purpose

This document describes the active architecture for the Remote Business Partner QA release path after consolidation and during the Appwrite transition.

The repository remains the source of truth. Runtime implementation now targets Appwrite for backend services and Cloudflare for frontend delivery.

## Source of Truth

The source-of-truth repository is:

```text
info-rbp/rbp-platform
```

Reference-only historical repositories:

```text
info-rbp/Uiuxdesignassistance
info-rbp/frappe-project
```

## Runtime Summary

```text
Frontend runtime: Cloudflare Pages
Frontend app: React/Vite in frontend/portal/
Backend runtime: Appwrite
Payments runtime: Stripe
Source of truth: GitHub repository
Historical backend reference: apps/rbp_app/ (archive/reference only)
```

## Repository Strategy

The platform uses a structured monorepo strategy.

Primary structure:

```text
rbp-platform/
├── appwrite/
│   ├── appwrite.config.json
│   ├── databases/
│   ├── collections/
│   ├── buckets/
│   ├── functions/
│   ├── seeds/
│   └── templates/
├── apps/
│   └── rbp_app/
├── frontend/
│   └── portal/
├── contracts/
├── docs/
├── scripts/
│   ├── appwrite/
│   └── cloudflare/
├── tests/
└── .github/workflows/
```

Rationale:

- one operational source-of-truth repository
- reviewable Appwrite schema, functions, permissions, and seed state
- explicit Cloudflare deployment controls for the frontend
- reduced drift between docs, runtime definitions, and CI/CD
- preservation of historical Frappe work without treating it as the active backend path

## Backend Architecture

The active backend runtime is Appwrite.

Primary backend surfaces:

```text
appwrite/appwrite.config.json
appwrite/databases/
appwrite/collections/
appwrite/buckets/
appwrite/functions/
appwrite/seeds/
scripts/appwrite/
```

Backend responsibilities:

- customer auth and session management
- tenant, business profile, and user profile records
- membership plans, subscriptions, payment events, and entitlements
- application catalogue and application-interest records
- service request persistence and admin operations
- notifications and email delivery orchestration
- privileged writes through Functions using server-side credentials

### Appwrite Rules

- schema lives in the repository
- functions live in the repository
- permissions live in the repository
- seed data lives in the repository
- deployment and validation happen through scripts and workflows
- destructive operations require explicit opt-in

### Admin Runtime Model

The target admin runtime for the Appwrite QA path is:

```text
React /admin -> Appwrite session -> admin role or team check -> Appwrite Function -> Appwrite server-side writes -> Appwrite collections
```

Appwrite Console may be used as a technical fallback for inspection or configuration only. Frappe Desk is not the active operational admin backend for the Appwrite QA path.

## Frontend Architecture

The frontend portal remains a React/Vite application in:

```text
frontend/portal/
```

Key frontend responsibilities:

- public site and member portal UI
- runtime feature-flag evaluation
- Appwrite auth and session handoff
- Appwrite-backed portal data loading
- admin routes backed by Appwrite Functions
- SEO metadata and Cloudflare routing controls

The frontend integration strategy is to preserve component-facing API contracts while replacing Frappe-shaped implementations with Appwrite-oriented providers.

## Legacy Frappe Boundary

The repository still contains Frappe artifacts under `apps/rbp_app/` and related docs from consolidation.

Those materials are now treated as one of:

- historical reference
- migration evidence
- archive of earlier contracts or behavior

They are not the active backend target for QA launch. No new feature work should extend the QA release path through `/api/method/*`, Frappe Desk, or Frappe DocTypes as the system of record.

## Contracts and Specs Architecture

Contracts and specs remain useful migration references in:

```text
contracts/
specs/onboarding-flows/
docs/api-contracts/
docs/product-flows/
```

They should now be interpreted against Appwrite collections, Appwrite Functions, Cloudflare deployment, and Stripe checkout and webhook flows.

## Infrastructure and Deployment Architecture

Deployment is split cleanly:

- Cloudflare Pages serves the frontend.
- Appwrite runs backend data, auth, and function infrastructure.
- Stripe provides payment processing.
- GitHub Actions validates and deploys repository-defined state.

Supporting documents:

```text
docs/cloudflare/CLOUDFLARE_BASELINE.md
docs/deployment/CLOUDFLARE_QA_DEPLOYMENT.md
docs/deployment/APPWRITE_QA_SETUP.md
docs/deployment/QA_DEPLOYMENT_RUNBOOK.md
```

## Environment Configuration

Committed examples:

```text
.env.example
.env.local.example
.env.production.example
frontend/portal/.env.example
```

The frontend only receives public `VITE_*` values. Secrets for Appwrite admin access, Stripe, and Cloudflare remain server-side or CI/CD managed.

## Tests and Validation Architecture

Validation is split across:

```text
scripts/appwrite/
scripts/cloudflare/
frontend/portal/scripts/
tests/integration/
tests/smoke/
.github/workflows/
```

Expected validation categories:

- frontend build
- SEO audit
- Appwrite baseline validation
- schema validation and diffing
- permissions and functions validation
- Cloudflare environment validation
- QA seed validation
- smoke tests for disabled provisioning and QA flows

Foundation limitation:

- repository-side validation assets may exist before they are fully wired into executable local or CI validation
- stub Functions, dry-run-only scripts, or placeholder smoke definitions are not proof of runtime completion

## CI/CD Architecture

CI/CD must validate repository-defined state before QA is affected.

Primary workflow areas:

- frontend validation
- Appwrite schema validation
- Appwrite functions validation
- Cloudflare preview validation
- QA deploy orchestration
- QA smoke validation

## Architecture Summary

```text
Frontend runtime: Cloudflare Pages
Backend runtime: Appwrite
Payments: Stripe
Source of truth: GitHub repository
Customer provisioning of applications: disabled for QA
Legacy Frappe assets: preserved as reference only
```

## Status

The repository has transitioned from a Frappe-first Phase 5 handoff plan to an Appwrite-first QA foundation model. Follow-up implementation work is still required before the runtime migration can be treated as complete.