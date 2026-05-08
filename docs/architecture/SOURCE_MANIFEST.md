# Source Manifest

This file records the source repository states used to initialize the Phase 4A foundation of `info-rbp/rbp-platform`.

## Target Repository

Repository: `info-rbp/rbp-platform`

Default branch: `main`

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

Default branch: `main`

Source branch: `main`

Source commit: `6165346d4fc29fba6b78ec84e32285159a182c82`

Status: Phase 1 complete

Planned import target:

```text
frontend/portal/
```

Expected imported content:

- React/Vite frontend
- route configuration
- navigation configuration
- UI components
- product flow UI
- mock data
- mock services
- frontend audit scripts
- frontend documentation

Detected source indicators:

- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `index.html`
- `src/main.tsx`
- `src/app/App.tsx`
- `src/app/routes.tsx`
- `src/app/config/navigation.ts`
- `src/app/config/routes.registry.ts`
- `src/app/services/mock/`
- `scripts/phase1-audit.mjs`

Notes:

- This source is expected to become the canonical frontend source inside `rbp-platform`.
- No frontend files were migrated during Step 1.

## Phase 2 Contract Source

Repository: `info-rbp/Uiuxdesignassistance`

Default branch: `main`

Source branch: `main`

Source commit: `6165346d4fc29fba6b78ec84e32285159a182c82`

Status: Phase 2 complete

Detected source path or paths:

```text
Pending detailed Phase 2 source path audit.
```

Planned import targets:

```text
contracts/
specs/onboarding-flows/
docs/product-flows/
docs/api-contracts/
```

Expected imported content:

- API contracts
- DocType contracts
- workflow contracts
- permission contracts
- onboarding flow specs
- mock-to-real API mapping
- product flow documentation

Notes:

- Phase 2 contract material is expected to live inside `info-rbp/Uiuxdesignassistance`.
- Phase 2 contracts are to be treated as the authoritative baseline for Phase 3 backend completion and Phase 5 integration.
- No contract files were migrated during Step 1.
- Detailed Phase 2 source path detection will be completed in the Phase 2 contract source path audit step.

## Phase 3 Backend Source

Repository: `info-rbp/frappe-project`

Default branch: `unknown (pending backend source verification)`

Source branch: `main`

Source commit: `unknown (pending backend source verification)`

Status: Phase 3 in progress

Current `rbp_app` location:

```text
Pending backend source verification.
```

Final import target:

```text
apps/rbp_app/
```

Import status:

```text
Pending Phase 3 acceptance gate / Phase 4B
```

Backend source state:

- `rbp_app` exists: `pending backend source verification`
- `rbp_app` location: `pending backend source verification`
- `frappe/` core exists in source repo: `pending backend source verification`
- `rbp_app` import status: `pending for Phase 4B (not imported in Phase 4A)`

Known handoff/validation files to verify later:

- `rbp_app/README.md`
- `rbp_app/HANDOFF.md`
- `rbp_app/docs/platform-validation-report.md`
- `rbp_app/pyproject.toml`
- `rbp_app/rbp_app/hooks.py`

Important exclusions:

- Do not copy the full Frappe framework into `rbp-platform`.
- Do not copy `frappe/`.
- Do not copy local bench/runtime files.
- Do not import `rbp_app` into `main` during Phase 4A.
- Only the custom app `rbp_app/` is eligible for final import after Phase 3 validation.

Notes:

- Final backend import will occur during Phase 4B after Phase 3 validation passes.
- `rbp_app` must be imported as the custom Frappe app only.
- Frappe core must remain an external framework dependency.

## Phase 4A Step 1 Scope Confirmation

This step intentionally performed only source-state confirmation and manifest initialization in the target repository.

Explicitly **not** performed:

- frontend code migration
- contract migration
- `rbp_app` import
- `frappe/` core copy
- destructive changes to any source repository

## Step 1 Result

Step 1 status:

`In progress - source manifest correction underway`

Summary:

- Target repository state confirmed.
- Phase 1 UI/UX source state confirmed.
- Phase 2 contract source is expected inside `info-rbp/Uiuxdesignassistance`.
- Phase 3 backend reference state still requires detailed verification.
- Source manifest created in `docs/architecture/SOURCE_MANIFEST.md`.
- No source code migration performed.
- No backend import performed.
- No destructive changes performed.