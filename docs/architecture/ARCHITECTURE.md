# RBP Platform Architecture

## Purpose

This document provides the top-level architecture roll-up for the Remote Business Partner Platform after Phase 4 Consolidation.

It links the consolidated backend, frontend, contracts, specs, infrastructure, documentation, tests, and Phase 5 integration boundaries.

Phase 4 created the structured source-of-truth repository. Phase 5 is responsible for integration, runtime validation, CI expansion, deployment decisions, QA, and launch readiness.

## Source of Truth

The production source-of-truth repository is:

```text
info-rbp/rbp-platform
```

The previous source repositories are now source/reference repositories:

```text
info-rbp/Uiuxdesignassistance
info-rbp/frappe-project
```

The consolidated repository contains the migrated frontend, contracts/specs, and backend custom app source.

## Repository Strategy

The platform uses a structured monorepo strategy.

Primary structure:

```text
rbp-platform/
├── apps/
│   └── rbp_app/
├── frontend/
│   └── portal/
├── contracts/
│   ├── api/
│   ├── doctypes/
│   ├── workflows/
│   └── permissions/
├── specs/
│   └── onboarding-flows/
├── infra/
│   ├── bench/
│   ├── docker/
│   └── deployment/
├── docs/
│   ├── architecture/
│   ├── api-contracts/
│   ├── product-flows/
│   ├── deployment/
│   ├── qa/
│   ├── launch/
│   └── runbook/
├── tests/
│   ├── backend/
│   ├── frontend/
│   └── integration/
└── README.md
```

Rationale:

- one consolidated source-of-truth repository
- clear separation between backend, frontend, contracts, specs, docs, infra, and tests
- reduced drift between UI, API contracts, and backend implementation
- cleaner Phase 5 integration path
- explicit boundary between custom app source and Frappe framework core

See also:

```text
docs/architecture/REPOSITORY_STRATEGY.md
docs/architecture/SOURCE_MANIFEST.md
docs/architecture/PHASE_4_COMPLETION_REPORT.md
docs/architecture/PHASE_5_HANDOFF.md
```

## Backend Architecture

The backend production unit is the custom Frappe app:

```text
apps/rbp_app/
```

Key backend paths:

```text
apps/rbp_app/pyproject.toml
apps/rbp_app/rbp_app/hooks.py
apps/rbp_app/rbp_app/api/
apps/rbp_app/rbp_app/doctype/
apps/rbp_app/rbp_app/services/
apps/rbp_app/rbp_app/tests/
apps/rbp_app/rbp_app/templates/
apps/rbp_app/rbp_app/public/
apps/rbp_app/rbp_app/www/
```

Backend responsibilities:

- custom Frappe app metadata and hooks
- DocTypes and backend data model
- backend API modules
- service modules
- permission and route guard logic
- website route handlers and templates
- backend tests
- Phase 3 validation and handoff documentation

Frappe framework boundary:

```text
frappe/
apps/frappe/
```

These paths must not be copied into `rbp-platform`.

Frappe remains an external framework dependency installed and managed through bench or deployment tooling.

Backend follow-up for Phase 5:

- validate app installability in a Frappe bench environment
- validate `bench --site <site> install-app rbp_app`
- validate `bench --site <site> migrate`
- run backend tests in a bench context
- validate permissions, guards, DocTypes, and routes
- confirm whether top-level `apps/rbp_app/services/` and `apps/rbp_app/tests/` are active support folders, compatibility shims, or redundant scaffolding

See also:

```text
docs/architecture/PHASE_4B_BACKEND_IMPORT.md
docs/architecture/RBP_APP_STRUCTURE_DECISION.md
apps/rbp_app/ARCHITECTURE.md
apps/rbp_app/HANDOFF.md
```

## Frontend Architecture

The frontend portal is staged as a React/Vite application:

```text
frontend/portal/
```

Key frontend paths:

```text
frontend/portal/package.json
frontend/portal/package-lock.json
frontend/portal/vite.config.ts
frontend/portal/index.html
frontend/portal/src/main.tsx
frontend/portal/src/app/App.tsx
frontend/portal/src/app/routes.tsx
frontend/portal/src/app/config/navigation.ts
frontend/portal/src/app/config/routes.registry.ts
frontend/portal/src/app/services/mock/
```

Frontend responsibilities:

- portal UI shell
- public website UI
- dashboard and portal routes
- onboarding flow UI
- navigation and route registry
- reusable UI components
- frontend mock services used before Phase 5 API integration

Frontend generated files must stay out of the repository:

```text
frontend/portal/node_modules/
frontend/portal/dist/
frontend/portal/build/
frontend/portal/.vite/
```

Frontend follow-up for Phase 5:

- run `npm ci` and `npm run build` in CI
- map route registry to backend endpoints
- replace or isolate mock services
- confirm environment-specific API base URL handling
- decide final serving strategy

Possible future serving models:

1. separately deployed React/Vite app
2. Frappe-served frontend assets
3. React portal embedded alongside Frappe
4. partial reference implementation if Frappe-rendered routes supersede parts of the UI

See also:

```text
docs/architecture/PHASE_4B_FRONTEND_MIGRATION.md
frontend/portal/README.md
```

## Contracts and Specs Architecture

Phase 2 contracts are the authoritative baseline for Phase 5 frontend/backend integration.

Primary contract paths:

```text
contracts/api/
contracts/doctypes/
contracts/workflows/
contracts/permissions/
```

Supporting specs and docs:

```text
specs/onboarding-flows/phase-2-handoff/
docs/api-contracts/
docs/product-flows/
```

Contract responsibilities:

- define API response standards
- define error catalogue expectations
- define upload and file rules
- map frontend routes to backend endpoints
- map mock services to real APIs
- define DocType expectations
- define workflow and payment states
- define permissions, roles, and admin action boundaries

Phase 5 should use these contracts to validate backend implementation and frontend integration.

See also:

```text
contracts/README.md
docs/architecture/PHASE_4B_CONTRACTS_MIGRATION.md
contracts/api/11-route-to-endpoint-map.md
contracts/api/16-mock-to-real-api-map.md
```

## Infrastructure and Deployment Architecture

Infrastructure skeleton paths:

```text
infra/bench/
infra/docker/
infra/deployment/
docs/deployment/DEPLOYMENT.md
```

Current Phase 4 status:

- infrastructure directories exist
- deployment documentation placeholder exists
- production deployment implementation is not part of Phase 4

Phase 5 and later deployment work should define:

- Frappe bench setup
- site configuration templates
- Docker packaging
- frontend serving model
- environment variable handling
- secret management
- database and Redis dependencies
- migration process
- rollback process
- deployment runbook

Expected future config examples may include:

```text
sites/common_site_config.template.json
infra/bench/Procfile.template
```

## Environment Configuration

Committed environment examples:

```text
.env.example
.env.local.example
.env.production.example
frontend/portal/.env.example
```

Local environment files must not be committed:

```text
.env
.env.*
```

Secrets must be provided through local environment files, GitHub Actions secrets, deployment secret managers, or infrastructure-specific secret stores.

## Tests and Validation Architecture

Test entry points:

```text
tests/backend/
tests/frontend/
tests/integration/
apps/rbp_app/rbp_app/tests/
```

Current Phase 4 status:

- test folder structure exists
- backend app tests were imported with `rbp_app`
- frontend build was manually validated during migration
- backend syntax was manually smoke checked during migration
- full integration test execution is deferred to Phase 5

Phase 5 validation should add:

- frontend install/build CI
- backend syntax and lint CI
- Frappe app install smoke test
- Frappe migrate smoke test
- backend app test smoke
- API smoke tests
- route smoke tests
- contract alignment checks

See also:

```text
docs/architecture/PHASE_5_CI_PLAN.md
docs/architecture/CONSOLIDATED_REPO_VALIDATION.md
```

## CI/CD Architecture

Current workflow:

```text
.github/workflows/phase4a-validation.yml
```

Current CI scope:

- validate required repository structure
- guard against accidental `frappe/` import
- guard against accidental `apps/frappe/` import

Phase 5 should expand CI in stages:

1. repository structure guard
2. frontend install/build
3. backend static validation
4. Frappe install smoke
5. Frappe migrate smoke
6. backend tests
7. API and route smoke tests

## Exclusion Boundaries

The following must not be committed:

```text
frappe/
apps/frappe/
frontend/portal/node_modules/
frontend/portal/dist/
frontend/portal/build/
sites/
logs/
.env
.env.*
__pycache__/
test_reports/
```

Only safe examples such as `.env.example` files should be committed.

## Phase Boundaries

### Phase 4 Completed

Phase 4 completed:

- final repository structure
- source manifest
- contracts/specs migration
- frontend portal migration
- backend `rbp_app` import
- Frappe core exclusion
- environment examples
- architecture and handoff docs
- final verification checklist

### Phase 5 Begins

Phase 5 should begin from `main` and focus on:

- runtime validation
- frontend/backend integration
- API contract alignment
- Frappe bench install and migrate checks
- CI expansion
- deployment strategy decisions
- QA planning

Phase 5 must not re-import the old repositories wholesale.

## Architecture Summary

```text
Frontend: frontend/portal/
Backend: apps/rbp_app/
Contracts: contracts/
Specs: specs/onboarding-flows/
Infrastructure: infra/
Documentation: docs/
Tests: tests/ and apps/rbp_app/rbp_app/tests/
Source of truth: info-rbp/rbp-platform
Frappe framework: external dependency, not copied into repo
```

## Status

This architecture roll-up completes the Phase 4 final-polish architecture documentation item.

The repository is structurally ready for Phase 5 Integration.
