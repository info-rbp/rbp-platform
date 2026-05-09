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

Default branch: `main`

Source branch: `main`

Source commit: `bf8dc2c1bb14107c52a4eef9f3743d4580d0e5a1`

Status: Phase 3 in progress

Current `rbp_app` location:

```text
rbp_app/
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

- `rbp_app` exists: `verified`
- `rbp_app` location: `rbp_app/`
- `frappe/` core exists in source repo: `verified - present and must be excluded from migration`
- `apps/frappe/` core exists in source repo: `verified - not present`
- `rbp_app` import status: `pending for Phase 4B (not imported in Phase 4A)`

Backend source metadata verified:

- Repository access: `verified`
- Default branch: `main`
- Source branch: `main`
- Source commit: `bf8dc2c1bb14107c52a4eef9f3743d4580d0e5a1`
- Clone target used for verification: `/tmp/rbp-phase4a/frappe-project`

Verified backend indicators:

- `rbp_app/`
- `rbp_app/README.md`
- `rbp_app/pyproject.toml`
- `rbp_app/rbp_app/hooks.py`
- `rbp_app/HANDOFF.md`
- `rbp_app/docs/platform-validation-report.md`

Detected backend app structure:

- `rbp_app/rbp_app/api/`
- `rbp_app/rbp_app/services/`
- `rbp_app/rbp_app/doctype/`
- `rbp_app/rbp_app/tests/`
- `rbp_app/rbp_app/www/`
- `rbp_app/rbp_app/config/`
- `rbp_app/rbp_app/patches/`
- `rbp_app/rbp_app/templates/`
- `rbp_app/rbp_app/utils/`

Detected backend documentation and validation material:

- `rbp_app/ADMIN_APPROACH.md`
- `rbp_app/ARCHITECTURE.md`
- `rbp_app/AUTHENTICATION.md`
- `rbp_app/HANDOFF.md`
- `rbp_app/docs/app-capability-register.md`
- `rbp_app/docs/cross-app-workflow-register.md`
- `rbp_app/docs/phase3-api-endpoint-inventory.md`
- `rbp_app/docs/phase3-api-smoke-test-plan.md`
- `rbp_app/docs/phase3-backend-environment-validation.md`
- `rbp_app/docs/phase3-backend-validation-report.md`
- `rbp_app/docs/phase3-completion-report.md`
- `rbp_app/docs/phase3-frontend-api-handoff-checklist.md`
- `rbp_app/docs/phase3-integration-readiness-plan.md`
- `rbp_app/docs/phase3-launch-readiness-runbook.md`
- `rbp_app/docs/phase3-qa-uat-readiness-plan.md`
- `rbp_app/docs/platform-validation-report.md`

Detected backend tests:

- `rbp_app/rbp_app/tests/test_api_apps.py`
- `rbp_app/rbp_app/tests/test_api_dashboard.py`
- `rbp_app/rbp_app/tests/test_api_hrms_adapter.py`
- `rbp_app/rbp_app/tests/test_api_integrations.py`
- `rbp_app/rbp_app/tests/test_api_me.py`
- `rbp_app/rbp_app/tests/test_connectivity.py`
- `rbp_app/rbp_app/tests/test_decision_desk.py`
- `rbp_app/rbp_app/tests/test_docushare.py`
- `rbp_app/rbp_app/tests/test_guards.py`
- `rbp_app/rbp_app/tests/test_marketplace.py`
- `rbp_app/rbp_app/tests/test_membership_onboarding.py`
- `rbp_app/rbp_app/tests/test_multi_tenant_billing.py`
- `rbp_app/rbp_app/tests/test_phase3_partials.py`
- `rbp_app/rbp_app/tests/test_platform_api.py`
- `rbp_app/rbp_app/tests/test_portal_app_routes.py`
- `rbp_app/rbp_app/tests/test_risk_advisor.py`
- `rbp_app/rbp_app/tests/test_tenancy.py`
- `rbp_app/rbp_app/tests/test_the_fixer.py`

Important exclusions:

- Do not copy the full Frappe framework into `rbp-platform`.
- Do not copy `frappe/`.
- Do not copy `apps/frappe/`.
- Do not copy local bench/runtime files.
- Do not copy generated runtime output such as `test_reports/`.
- Do not import `rbp_app` into `main` during Phase 4A.
- Only the custom app `rbp_app/` is eligible for final import after Phase 3 validation.

Notes:

- Backend repository access, default branch, source commit, and file-level indicators have been verified.
- The source repository contains a top-level `frappe/` framework directory; this must not be migrated into `rbp-platform`.
- The source repository does not contain `apps/frappe/`.
- The expected production backend unit remains the custom Frappe app only: `rbp_app/`.
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

`Complete - source states verified and manifest updated`

Summary:

- Target repository state confirmed.
- Phase 1 UI/UX source state confirmed.
- Phase 2 contract source paths confirmed inside `info-rbp/Uiuxdesignassistance`.
- Phase 3 backend repository access, default branch, source commit, and file-level indicators confirmed.
- Source manifest created and updated in `docs/architecture/SOURCE_MANIFEST.md`.
- No source code migration performed.
- No contract migration performed.
- No backend import performed.
- No destructive changes performed.
