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

Detected source paths:

- `RBP_Phase_2_Backend_Contracts/`
- `docs/phase-2-handoff/`
- `docs/backend-collection-contracts.md`
- `docs/backend-collection-contracts-audit.md`
- `docs/backend-resources-help-center.md`
- `docs/backend-resources-help-center-audit.md`
- `docs/admin-permissions-model.md`
- `docs/ui/mock-api-simulation-layer.md`
- `src/app/config/routes.registry.ts`
- `src/app/config/phase1FlowStates.ts`
- `src/app/services/mock/`
- `src/app/mock/`
- `scripts/audit-backend-collection-contracts.mjs`
- `scripts/audit-backend-resources-help-center.mjs`
- `scripts/audit-admin-content-model.mjs`
- `scripts/audit-admin-crud-schema.mjs`

Primary Phase 2 contract package:

- `RBP_Phase_2_Backend_Contracts/00-final-ui-dependent-pack-index.md`
- `RBP_Phase_2_Backend_Contracts/01-api-response-envelope-standard.md`
- `RBP_Phase_2_Backend_Contracts/02-naming-conventions.md`
- `RBP_Phase_2_Backend_Contracts/03-role-matrix.md`
- `RBP_Phase_2_Backend_Contracts/04-permission-model-draft.md`
- `RBP_Phase_2_Backend_Contracts/05-core-doctype-model.md`
- `RBP_Phase_2_Backend_Contracts/06-workflow-state-standards.md`
- `RBP_Phase_2_Backend_Contracts/07-error-catalogue.md`
- `RBP_Phase_2_Backend_Contracts/08-payment-state-model.md`
- `RBP_Phase_2_Backend_Contracts/09-upload-file-rules.md`
- `RBP_Phase_2_Backend_Contracts/10-contract-templates.md`
- `RBP_Phase_2_Backend_Contracts/11-route-to-endpoint-map.md`
- `RBP_Phase_2_Backend_Contracts/12-form-field-specifications.md`
- `RBP_Phase_2_Backend_Contracts/13-validation-rules.md`
- `RBP_Phase_2_Backend_Contracts/14-notification-triggers.md`
- `RBP_Phase_2_Backend_Contracts/15-admin-actions.md`
- `RBP_Phase_2_Backend_Contracts/16-mock-to-real-api-map.md`
- `RBP_Phase_2_Backend_Contracts/17-phase-2-acceptance-gate.md`
- `RBP_Phase_2_Backend_Contracts/index.md`

Relevant supporting paths:

- `docs/implementation/step-24-phase-2-handoff-docs.codex.md`
- `docs/phase-2-handoff/admin-action-map.md`
- `docs/phase-2-handoff/backend-assumptions.md`
- `docs/phase-2-handoff/flow-field-inventory.md`
- `docs/phase-2-handoff/mock-api-inventory.md`
- `docs/phase-2-handoff/phase-2-starting-brief.md`
- `docs/phase-2-handoff/portal-status-map.md`
- `docs/phase-2-handoff/route-to-contract-map.md`
- `docs/phase-2-handoff/workflow-state-map.md`

Searched but not found:

- `contracts/`
- `docs/contracts/`
- `docs/api-contracts/`
- `docs/backend/`
- `docs/phase-2/`
- `docs/product-flows/`
- `specs/`

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

- Phase 2 contract material lives inside `info-rbp/Uiuxdesignassistance`.
- The primary Phase 2 source package is `RBP_Phase_2_Backend_Contracts/`.
- The supporting handoff package is `docs/phase-2-handoff/`.
- Phase 2 contracts are to be treated as the authoritative baseline for Phase 3 backend completion and Phase 5 integration.
- No contract files were migrated during Step 1.

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

`In progress - backend source verification pending`

Summary:

- Target repository state confirmed.
- Phase 1 UI/UX source state confirmed.
- Phase 2 contract source paths confirmed inside `info-rbp/Uiuxdesignassistance`.
- Phase 3 backend reference state still requires detailed verification.
- Source manifest created in `docs/architecture/SOURCE_MANIFEST.md`.
- No source code migration performed.
- No contract migration performed.
- No backend import performed.
- No destructive changes performed.