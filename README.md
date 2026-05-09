# RBP Platform

Final source-of-truth repository for the Remote Business Partner Platform.

Status: Phase 4 consolidation complete; Phase 5 handoff ready.

## Purpose

This repository is the consolidation target for the completed Remote Business Partner Platform workstreams.

It is intended to become the structured production repository for:

- the custom Frappe backend app
- the React/Vite frontend portal
- Phase 2 API, DocType, workflow, and permission contracts
- onboarding and product-flow specifications
- infrastructure and deployment materials
- architecture and operational documentation
- backend, frontend, and integration test entry points

## Current Phase

Current phase:

```text
Phase 4 - Consolidation complete
```

Completed in this branch:

- source repository states confirmed
- `docs/architecture/ARCHITECTURE.md`
- `docs/architecture/SOURCE_MANIFEST.md` finalized
- base repository structure created
- environment examples added
- root `.gitignore` added
- Phase 4A validation workflow added
- placeholder targets created for future imports

Completed in Phase 4:

- frontend migration
- Phase 2 contract migration
- `rbp_app` import

Not yet performed:

- backend/frontend integration
- production deployment
- QA launch validation

## Source Repositories

### UI/UX and Phase 2 contract source

```text
info-rbp/Uiuxdesignassistance
```

Current known source commit:

```text
6165346d4fc29fba6b78ec84e32285159a182c82
```

Expected future targets:

- `frontend/portal/`
- `contracts/`
- `specs/onboarding-flows/`
- `docs/product-flows/`
- `docs/api-contracts/`

### Backend source

```text
info-rbp/frappe-project
```

Current known source commit:

```text
bf8dc2c1bb14107c52a4eef9f3743d4580d0e5a1
```

Expected future target:

```text
apps/rbp_app/
```

Only the custom Frappe app `rbp_app/` is eligible for import.

Do not copy:

- `frappe/`
- `apps/frappe/`
- Frappe framework core
- local bench runtime files
- generated reports
- secrets
- local environment files

## Repository Structure

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
└── .github/
    └── workflows/
```

## Key Documents

- `docs/architecture/ARCHITECTURE.md`
- `docs/architecture/SOURCE_MANIFEST.md`
- `docs/architecture/REPOSITORY_STRATEGY.md`
- `docs/architecture/PHASE_4A_STATUS.md`
- `docs/architecture/CONSOLIDATION_CHECKLIST.md`
- `docs/architecture/PHASE_4_COMPLETION_REPORT.md`
- `docs/architecture/PHASE_5_HANDOFF.md`
- `docs/api-contracts/API_CONTRACTS.md`
- `docs/product-flows/PRODUCT_FLOWS.md`
- `docs/product-flows/ONBOARDING_FLOWS.md`
- `docs/architecture/CONSOLIDATED_REPO_VALIDATION.md`
- `docs/runbook/RUNBOOK.md`
- `docs/launch/LAUNCH_PLAN.md`
- `docs/qa/QA_PLAN.md`
- `docs/deployment/DEPLOYMENT.md`

## Phase 4A Rule

This phase is structured consolidation.

It is not integration, rewrite, QA, launch, or production deployment.

Do not turn this repository into a junk drawer.

## Phase 5 Source Freeze

As of the Phase 5 preparation gate, this repository is the only approved candidate source for Phase 5 Integration.

Previous repositories are reference/source-history only:

- `info-rbp/Uiuxdesignassistance`
- `info-rbp/frappe-project`

See:

```text
docs/architecture/PHASE_5_SOURCE_FREEZE.md

