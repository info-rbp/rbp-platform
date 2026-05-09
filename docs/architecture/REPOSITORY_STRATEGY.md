# Repository Strategy

## Current Strategy

The platform now operates as a structured monorepo with Phase 5 integration work in progress.

```text
rbp-platform/
├── apps/rbp_app/
├── frontend/portal/
├── contracts/
├── specs/
├── infra/
├── docs/
├── scripts/
└── tests/
```

## Why This Strategy Still Holds

A structured monorepo remains the right shape because the platform has tightly related product, frontend, backend, contract, and deployment concerns.

This approach keeps:

- one active source-of-truth repository
- clear separation between backend, frontend, contracts, docs, infra, scripts, and tests
- one place to validate contracts against implementation
- one place to connect frontend flows to backend APIs in a controlled way
- reduced drift between UI, backend, and API contracts

## Phase 5 Execution Priorities

Phase 5 work should now focus on:

- validating the consolidated frontend in `frontend/portal/`
- validating the consolidated backend app in `apps/rbp_app/`
- replacing or isolating mock services behind explicit integration adapters
- reconciling contracts with the imported backend implementation
- expanding CI from structure checks to integration-era guardrails

## Source-of-Truth Rule

All active implementation work must start from:

```text
info-rbp/rbp-platform
branch: main
```

The previous repositories remain reference/source-history only:

- `info-rbp/Uiuxdesignassistance`
- `info-rbp/frappe-project`

## Migration Boundary

Do not copy whole repositories back into `rbp-platform`.

Selective imports and follow-on implementation must continue to respect the current monorepo boundaries.

## What Must Not Be Committed

Do not commit:

- the full Frappe framework
- top-level `frappe/`
- `apps/frappe/`
- local bench runtime directories
- local `.env` files
- secrets
- logs
- generated reports
- cache directories
- frontend generated output such as `node_modules/`, `dist/`, and `build/`

## Backend Strategy

The production backend unit is the custom Frappe app:

```text
apps/rbp_app/
```

Frappe itself remains an external framework dependency installed by bench or deployment tooling.

Phase 5 backend work should validate:

- app installability
- migrate behavior
- route and permission guards
- DocType behavior
- API module coverage against the contracts

## Frontend Strategy

The React/Vite frontend remains staged under:

```text
frontend/portal/
```

Phase 5 frontend work should:

- keep mock mode available where helpful
- introduce explicit API adapters for real backend calls
- validate build behavior in CI
- map routes and flows to backend endpoints deliberately

## Contracts Strategy

Contracts remain the baseline for integration review, but they now need active reconciliation against the imported backend implementation.

The primary contract targets remain:

```text
contracts/api/
contracts/doctypes/
contracts/workflows/
contracts/permissions/
```

Contract changes should be documented before implementation starts depending on the changed contract.

## CI Strategy

The repository should no longer rely only on the original Phase 4A structure validation workflow.

Phase 5 CI should cover:

1. repository guardrails
2. frontend install and build
3. backend static validation
4. static smoke checks for critical integration files

## Current Status

The repository has moved past consolidation.

Phase 5 integration and validation is the active operating strategy on `main`.
