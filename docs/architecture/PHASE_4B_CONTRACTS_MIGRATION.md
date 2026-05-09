# Phase 4B Contracts and Specs Migration

## Purpose

This document records the Phase 2 contract and specification migration from `info-rbp/Uiuxdesignassistance` into `info-rbp/rbp-platform`.

This migration establishes the Phase 2 contract baseline inside the consolidated repository structure.

## Source

Repository:

```text
info-rbp/Uiuxdesignassistance
```

Branch:

```text
main
```

Source commit:

```text
6165346d4fc29fba6b78ec84e32285159a182c82
```

Primary source package:

```text
RBP_Phase_2_Backend_Contracts/
```

Supporting source package:

```text
docs/phase-2-handoff/
```

## Migration Targets

The Phase 2 contract and handoff material is migrated into the following target paths:

```text
contracts/
contracts/api/
contracts/doctypes/
contracts/workflows/
contracts/permissions/
specs/onboarding-flows/phase-2-handoff/
docs/api-contracts/
docs/product-flows/
docs/architecture/PHASE_4B_CONTRACTS_MIGRATION.md
```

## Source-to-Target Mapping

| Source | Target |
|---|---|
| `RBP_Phase_2_Backend_Contracts/00-final-ui-dependent-pack-index.md` | `contracts/phase-2-pack-index.md` |
| `RBP_Phase_2_Backend_Contracts/index.md` | `contracts/phase-2-source-index.md` |
| `RBP_Phase_2_Backend_Contracts/01-api-response-envelope-standard.md` | `contracts/api/01-api-response-envelope-standard.md` |
| `RBP_Phase_2_Backend_Contracts/02-naming-conventions.md` | `contracts/naming-conventions.md` |
| `RBP_Phase_2_Backend_Contracts/03-role-matrix.md` | `contracts/permissions/03-role-matrix.md` |
| `RBP_Phase_2_Backend_Contracts/04-permission-model-draft.md` | `contracts/permissions/04-permission-model-draft.md` |
| `RBP_Phase_2_Backend_Contracts/05-core-doctype-model.md` | `contracts/doctypes/05-core-doctype-model.md` |
| `RBP_Phase_2_Backend_Contracts/06-workflow-state-standards.md` | `contracts/workflows/06-workflow-state-standards.md` |
| `RBP_Phase_2_Backend_Contracts/07-error-catalogue.md` | `contracts/api/07-error-catalogue.md` |
| `RBP_Phase_2_Backend_Contracts/08-payment-state-model.md` | `contracts/workflows/08-payment-state-model.md` |
| `RBP_Phase_2_Backend_Contracts/09-upload-file-rules.md` | `contracts/api/09-upload-file-rules.md` |
| `RBP_Phase_2_Backend_Contracts/10-contract-templates.md` | `contracts/contract-templates.md` |
| `RBP_Phase_2_Backend_Contracts/11-route-to-endpoint-map.md` | `contracts/api/11-route-to-endpoint-map.md` |
| `RBP_Phase_2_Backend_Contracts/12-form-field-specifications.md` | `contracts/doctypes/12-form-field-specifications.md` |
| `RBP_Phase_2_Backend_Contracts/13-validation-rules.md` | `contracts/doctypes/13-validation-rules.md` |
| `RBP_Phase_2_Backend_Contracts/14-notification-triggers.md` | `contracts/workflows/14-notification-triggers.md` |
| `RBP_Phase_2_Backend_Contracts/15-admin-actions.md` | `contracts/permissions/15-admin-actions.md` |
| `RBP_Phase_2_Backend_Contracts/16-mock-to-real-api-map.md` | `contracts/api/16-mock-to-real-api-map.md` |
| `RBP_Phase_2_Backend_Contracts/17-phase-2-acceptance-gate.md` | `contracts/phase-2-acceptance-gate.md` |
| `docs/phase-2-handoff/admin-action-map.md` | `specs/onboarding-flows/phase-2-handoff/admin-action-map.md` |
| `docs/phase-2-handoff/backend-assumptions.md` | `specs/onboarding-flows/phase-2-handoff/backend-assumptions.md` |
| `docs/phase-2-handoff/flow-field-inventory.md` | `specs/onboarding-flows/phase-2-handoff/flow-field-inventory.md` |
| `docs/phase-2-handoff/mock-api-inventory.md` | `specs/onboarding-flows/phase-2-handoff/mock-api-inventory.md` |
| `docs/phase-2-handoff/phase-2-starting-brief.md` | `specs/onboarding-flows/phase-2-handoff/phase-2-starting-brief.md` |
| `docs/phase-2-handoff/portal-status-map.md` | `specs/onboarding-flows/phase-2-handoff/portal-status-map.md` |
| `docs/phase-2-handoff/route-to-contract-map.md` | `specs/onboarding-flows/phase-2-handoff/route-to-contract-map.md` |
| `docs/phase-2-handoff/workflow-state-map.md` | `specs/onboarding-flows/phase-2-handoff/workflow-state-map.md` |
| `docs/backend-collection-contracts.md` | `docs/api-contracts/backend-collection-contracts.md` |
| `docs/backend-collection-contracts-audit.md` | `docs/api-contracts/backend-collection-contracts-audit.md` |
| `docs/backend-resources-help-center.md` | `docs/api-contracts/backend-resources-help-center.md` |
| `docs/backend-resources-help-center-audit.md` | `docs/api-contracts/backend-resources-help-center-audit.md` |
| `docs/admin-permissions-model.md` | `docs/product-flows/admin-permissions-model.md` |
| `docs/ui/mock-api-simulation-layer.md` | `docs/product-flows/mock-api-simulation-layer.md` |

## Imported Contract Areas

### API Contracts

Imported to:

```text
contracts/api/
```

Includes:

- API response envelope standard
- error catalogue
- upload/file rules
- route-to-endpoint map
- mock-to-real API map

### DocType Contracts

Imported to:

```text
contracts/doctypes/
```

Includes:

- core DocType model
- form field specifications
- validation rules

### Workflow Contracts

Imported to:

```text
contracts/workflows/
```

Includes:

- workflow state standards
- payment state model
- notification triggers

### Permission Contracts

Imported to:

```text
contracts/permissions/
```

Includes:

- role matrix
- permission model draft
- admin actions

### Onboarding and Handoff Specs

Imported to:

```text
specs/onboarding-flows/phase-2-handoff/
```

Includes:

- admin action map
- backend assumptions
- flow field inventory
- mock API inventory
- Phase 2 starting brief
- portal status map
- route-to-contract map
- workflow state map

### Supporting API and Product Flow Docs

Imported to:

```text
docs/api-contracts/
docs/product-flows/
```

Includes:

- backend collection contracts
- backend collection contracts audit
- backend resources/help center contracts
- backend resources/help center audit
- admin permissions model
- mock API simulation layer

## Explicitly Not Migrated

This migration does not include:

- frontend source code
- `frontend/portal/src/`
- frontend `package.json`
- frontend lockfiles
- backend source code
- `rbp_app/`
- Frappe framework core
- `frappe/`
- `apps/frappe/`
- `node_modules/`
- local `.env` files
- generated/runtime files
- build artifacts
- cache directories
- local development-only files

## Validation Expectations

The migration is valid when the following are true:

- Phase 2 contracts exist under `contracts/`
- API contracts exist under `contracts/api/`
- DocType contracts exist under `contracts/doctypes/`
- workflow contracts exist under `contracts/workflows/`
- permission contracts exist under `contracts/permissions/`
- handoff specs exist under `specs/onboarding-flows/phase-2-handoff/`
- supporting API docs exist under `docs/api-contracts/`
- supporting product-flow docs exist under `docs/product-flows/`
- no frontend source has been migrated
- no backend source has been migrated
- no Frappe core has been migrated
- no local environment files or generated runtime files have been committed

## Status

Phase 2 contracts and handoff specs migrated into the Phase 4 consolidation repository structure.

This migration prepares the repository for later frontend and backend integration work, but does not perform that integration.
