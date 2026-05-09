# RBP Platform

Source-of-truth repository for the Remote Business Partner Platform.

Status: Phase 5 integration is now active on top of the consolidated monorepo.

## Purpose

This repository is the single approved source for continuing platform work across:

- the custom Frappe backend app
- the React/Vite frontend portal
- API, DocType, workflow, and permission contracts
- onboarding and product-flow specifications
- infrastructure and deployment materials
- architecture and operational documentation
- backend, frontend, and integration test entry points

## Current Operating Strategy

The repository has already completed consolidation.

The active strategy is now Phase 5 integration:

- validate the consolidated frontend and backend in their real runtime contexts
- connect frontend flows to `rbp_app` APIs behind explicit integration boundaries
- use the contract set as the baseline for backend and frontend alignment
- expand CI from structure-only checks into Phase 5 guardrails
- keep old repositories as reference/source-history only

## Current Phase

```text
Phase 5 - Integration and validation in progress
```

Current priorities:

- frontend build validation from `frontend/portal/`
- backend syntax and installability validation from `apps/rbp_app/`
- mock-to-real API integration flow pilots
- contract-to-implementation reconciliation
- CI guardrails for repository safety, frontend build, and backend syntax

## Source of Truth

All active work must begin from:

```text
info-rbp/rbp-platform
branch: main
```

Previous repositories are now reference/source-history only:

- `info-rbp/Uiuxdesignassistance`
- `info-rbp/frappe-project`

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
├── scripts/
│   └── ci/
├── tests/
│   ├── backend/
│   ├── frontend/
│   └── integration/
└── .github/
    └── workflows/
```

## Key Documents

- `docs/architecture/ARCHITECTURE.md`
- `docs/architecture/REPOSITORY_STRATEGY.md`
- `docs/architecture/PHASE_5_SOURCE_FREEZE.md`
- `docs/architecture/PHASE_5_HANDOFF.md`
- `docs/qa/PHASE_5_CI_GUARDRAILS.md`
- `contracts/api/11-route-to-endpoint-map.md`
- `contracts/api/16-mock-to-real-api-map.md`
- `docs/product-flows/PRODUCT_FLOWS.md`
- `docs/runbook/RUNBOOK.md`
- `docs/launch/LAUNCH_PLAN.md`
- `docs/qa/QA_PLAN.md`
- `docs/deployment/DEPLOYMENT.md`

## Guardrails

Do not:

- re-import the source repositories wholesale
- copy Frappe framework core into this repository
- commit local `.env` files or secrets
- commit generated runtime output such as `node_modules/`, `dist/`, `build/`, or `logs/`
- change contracts without documenting the contract decision first

## Phase 5 Focus

Phase 5 is integration and validation work.

It is not a reset, a new consolidation pass, or a return to the old source repositories.
