# Source Manifest

This file records the source repository states used to initialize the Phase 4A foundation of `info-rbp/rbp-platform`.

## Target Repository

Repository: `info-rbp/rbp-platform`

Default branch: `work` (environment-local; remote default branch not available in this environment)

Phase 4A branch: `phase/phase-4a-foundation`

Repository state at start:

- Initialized: `yes`
- Starting commit: `88d2176`

Purpose:

- final source-of-truth repository foundation
- completed Phase 1 frontend migration target
- completed Phase 2 contract/spec migration target
- backend import placeholder pending Phase 3 completion

## Phase 1 UI/UX Source

Repository: `info-rbp/Uiuxdesignassistance`

Default branch: `unknown (repository not accessible from current environment)`

Source branch: `main`

Source commit: `unknown (repository not accessible from current environment)`

Status: Phase 1 complete

Planned import target:

```text
frontend/portal/
```

Discovery notes (Phase 2 contract/source material):

- Could not inspect repository contents in this environment due network access restrictions to GitHub (HTTP 403 on clone).
- Expected locations to validate when source access is available:
  - `contracts/`
  - `docs/contracts/`
  - `docs/api-contracts/`
  - `docs/backend/`
  - `docs/phase-2/`
  - `docs/product-flows/`
  - `specs/`
  - `src/app/config/routes.registry.ts`
  - `src/app/services/mock/`

## Phase 3 Backend Source

Repository: `info-rbp/frappe-project`

Default branch: `unknown (repository not accessible from current environment)`

Source branch: `main`

Source commit: `unknown (repository not accessible from current environment)`

Backend source state:

- `rbp_app` exists: `unverified (repository not accessible from current environment)`
- `rbp_app` location: `unverified`
- `frappe/` core exists in repo: `unverified`
- `rbp_app` import status: `pending for Phase 4B (not imported in Phase 4A)`

Known handoff/validation files to verify later:

- `rbp_app/README.md`
- `rbp_app/HANDOFF.md`
- `rbp_app/docs/platform-validation-report.md`
- `rbp_app/pyproject.toml`

## Phase 4A Step 1 Scope Confirmation

This step intentionally performed only source-state confirmation and manifest initialization in the target repository.

Explicitly **not** performed:

- frontend code migration
- contract migration
- `rbp_app` import
- `frappe/` core copy
- destructive changes to any source repository
