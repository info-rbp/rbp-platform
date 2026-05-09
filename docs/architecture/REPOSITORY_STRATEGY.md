# Repository Strategy

## Recommended Strategy

The recommended structure for `info-rbp/rbp-platform` is a structured monorepo.

```text
rbp-platform/
├── apps/rbp_app/
├── frontend/portal/
├── contracts/
├── specs/
├── infra/
├── docs/
└── tests/
```

## Why Structured Monorepo

A structured monorepo is preferred because the platform has tightly related product, frontend, backend, contract, and deployment concerns.

This approach gives the project:

- one final source-of-truth repository
- clear separation between backend, frontend, contracts, docs, infra, and tests
- simpler Phase 5 integration handoff
- one place to validate contracts against implementation
- one place to document deployment assumptions
- reduced drift between UI, backend, and API contracts

## What Must Be Migrated Later

Future migration work should selectively import:

- `rbp_app/` from `info-rbp/frappe-project` into `apps/rbp_app/`
- React/Vite portal source from `info-rbp/Uiuxdesignassistance` into `frontend/portal/`
- Phase 2 contracts from `RBP_Phase_2_Backend_Contracts/` into `contracts/`
- onboarding/product flow specs into `specs/` and `docs/product-flows/`
- deployment and bench scripts into `infra/`

## What Must Not Be Migrated

Do not copy:

- the full Frappe framework
- top-level `frappe/`
- `apps/frappe/`
- local bench runtime directories
- local `.env` files
- secrets
- logs
- generated reports
- cache directories
- experimental throwaway files

## Backend Strategy

The production backend unit is the custom Frappe app:

```text
rbp_app/
```

The final target is:

```text
apps/rbp_app/
```

Frappe itself must remain an external framework dependency installed by bench or deployment tooling.

## Frontend Strategy

The React/Vite frontend should be staged under:

```text
frontend/portal/
```

The frontend should remain separate until Phase 5 integration determines whether it is:

- separately deployed
- Frappe-served
- embedded alongside Frappe
- retained as a reference implementation

## Contracts Strategy

Phase 2 contracts are authoritative for Phase 5 integration.

The expected contract targets are:

```text
contracts/api/
contracts/doctypes/
contracts/workflows/
contracts/permissions/
```

The current known source package is:

```text
RBP_Phase_2_Backend_Contracts/
```

## Current Status

Phase 4A foundation is being staged on:

```text
phase/phase-4a-foundation
```

This branch should be merged into `main` only after the foundation documents and skeleton structure are reviewed.
