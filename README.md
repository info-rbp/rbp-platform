# RBP Platform

Source-of-truth repository for the Remote Business Partner platform.

Status: Phase 5 Appwrite transition foundation in progress on top of the consolidated Phase 4 repository.

## Active Runtime Direction

RBP V.4 now treats the repository as the operational source of truth for the launchable QA stack:

- Appwrite is the active backend runtime.
- Cloudflare is the active frontend deployment/runtime layer.
- GitHub is the source of truth for schema, functions, permissions, seeds, docs, and deployment workflows.
- Stripe is the payment runtime for QA and later production mapping.
- React/Vite remains the frontend application deployed through Cloudflare.
- Frappe assets remain reference and archive material only.

No new active backend implementation work should continue in Frappe for this QA release path.

## Purpose

This repository defines the RBP QA application and the transition path away from legacy Frappe-shaped APIs, Firebase remnants, and ad hoc mocks.

The repository is intended to contain:

- the React/Vite frontend portal
- Appwrite schema, seed, permissions, and function definitions
- API and workflow contracts
- launch, QA, deployment, and architecture documentation
- CI/CD workflows for validation and QA deployment
- tests and smoke checks for the QA release path

## Current Phase

Current phase:

```text
Phase 5 - Appwrite transition foundation and QA hardening
```

Established in this branch:

- backend direction freeze documentation
- Appwrite QA scope and baseline structure
- Appwrite provider/runtime configuration
- Appwrite schema/function/seeding framework scaffolding
- Appwrite-oriented frontend API integration seam
- Cloudflare QA and CI/CD documentation/workflow scaffolding

Still not proven in this branch alone:

- live Appwrite inspection and deployment
- live Cloudflare QA validation
- live Stripe test checkout and webhook execution
- live QA seeding and smoke execution
- fully implemented Appwrite Function business logic
- executable end-to-end tests for the migration path

## Runtime Boundaries

### Appwrite

Appwrite is the active backend runtime for:

- Auth
- Databases
- Storage
- Functions
- Teams and admin boundaries
- notification and email integration where applicable

Appwrite resources must be defined and validated from this repository.

Target operational admin path for the Appwrite QA release:

```text
React /admin -> Appwrite session -> admin role or team check -> Appwrite Function -> Appwrite server-side writes
```

Appwrite Console may be used as a technical fallback for inspection or configuration only. It is not the primary operational admin surface for the QA release path.

### Cloudflare

Cloudflare is the active frontend deployment/runtime layer for:

- preview and QA builds
- SPA routing fallback
- public route headers and redirects
- frontend environment variable injection

### Frappe

Frappe code remains in the repository only as reference or archive material imported during consolidation. It is not the active backend target for the QA release path.

Historical Frappe docs are preserved where useful, but active architecture, launch, QA, and deployment documents must now describe Appwrite as the backend target.

## Repository Structure

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

## Key Documents

- `docs/architecture/BACKEND_FREEZE_DECISION.md`
- `docs/architecture/APPWRITE_TRANSITION_DECISION.md`
- `docs/architecture/FRAPPE_DEPRECATION_PLAN.md`
- `docs/appwrite/APPWRITE_SOURCE_OF_TRUTH.md`
- `docs/launch/LAUNCH_SCOPE.md`
- `docs/qa/QA_RELEASE_SCOPE.md`
- `docs/appwrite/APPWRITE_QA_SCOPE.md`
- `docs/implementation/APPWRITE_TRANSITION_IMPLEMENTATION_REPORT.md`

## Operating Rules

- Do not commit secrets.
- Do not give the browser broad admin write access.
- Route privileged actions through Appwrite Functions.
- Keep mock behavior behind explicit feature flags only.
- Keep customer-facing application provisioning disabled for QA.
- Use repository-defined scripts and workflows instead of undocumented manual runtime changes.
- Do not treat scaffolding, placeholder tests, or dry-run-only scripts as proof of live runtime completion.

## Historical Sources

Reference-only source history:

- `info-rbp/Uiuxdesignassistance`
- `info-rbp/frappe-project`

See `docs/architecture/PHASE_5_SOURCE_FREEZE.md` and the Appwrite transition documents for the current operating model.