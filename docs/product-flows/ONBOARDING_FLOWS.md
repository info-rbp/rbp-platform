# Onboarding Flows

## Purpose

This document is the top-level onboarding flow index for the consolidated Remote Business Partner Platform repository.

The onboarding flow material was consolidated during Phase 4 from the Phase 2 handoff work in `info-rbp/Uiuxdesignassistance`.

Phase 5 should use this document as the entry point for validating onboarding routes, fields, workflow states, mock-to-real API mappings, backend assumptions, and frontend/backend integration boundaries.

## Source

Primary source repository:

```text
info-rbp/Uiuxdesignassistance
```

Source commit:

```text
6165346d4fc29fba6b78ec84e32285159a182c82
```

Primary source package:

```text
docs/phase-2-handoff/
```

Consolidated target:

```text
specs/onboarding-flows/phase-2-handoff/
```

## Consolidated Onboarding Spec Location

The migrated onboarding and handoff specifications live in:

```text
specs/onboarding-flows/phase-2-handoff/
```

Expected files:

```text
specs/onboarding-flows/phase-2-handoff/admin-action-map.md
specs/onboarding-flows/phase-2-handoff/backend-assumptions.md
specs/onboarding-flows/phase-2-handoff/flow-field-inventory.md
specs/onboarding-flows/phase-2-handoff/mock-api-inventory.md
specs/onboarding-flows/phase-2-handoff/phase-2-starting-brief.md
specs/onboarding-flows/phase-2-handoff/portal-status-map.md
specs/onboarding-flows/phase-2-handoff/route-to-contract-map.md
specs/onboarding-flows/phase-2-handoff/workflow-state-map.md
```

## Onboarding Document Index

| Document | Purpose | Phase 5 Usage |
|---|---|---|
| `phase-2-starting-brief.md` | Establishes the Phase 2 handoff context and assumptions | Use as the onboarding integration starting point |
| `flow-field-inventory.md` | Records fields used across product and onboarding flows | Validate frontend forms, backend DocTypes, and validation rules |
| `route-to-contract-map.md` | Maps routes and screens to contract expectations | Align frontend routes with API and backend implementation |
| `workflow-state-map.md` | Documents workflow states and status transitions | Validate frontend state assumptions and backend workflow behavior |
| `portal-status-map.md` | Maps portal/user status expectations | Validate dashboard, portal, and account state behavior |
| `mock-api-inventory.md` | Lists mocked APIs and mock service coverage | Drive mock-to-real API replacement in Phase 5 |
| `backend-assumptions.md` | Records backend expectations from Phase 2 | Validate Phase 3 backend implementation assumptions |
| `admin-action-map.md` | Maps admin actions and expected behavior | Validate admin permissions, backend actions, and UI affordances |

## Related Contract Areas

Onboarding flows depend on the Phase 2 contract baseline.

Relevant contract paths:

```text
contracts/api/11-route-to-endpoint-map.md
contracts/api/16-mock-to-real-api-map.md
contracts/doctypes/05-core-doctype-model.md
contracts/doctypes/12-form-field-specifications.md
contracts/doctypes/13-validation-rules.md
contracts/workflows/06-workflow-state-standards.md
contracts/workflows/08-payment-state-model.md
contracts/workflows/14-notification-triggers.md
contracts/permissions/03-role-matrix.md
contracts/permissions/04-permission-model-draft.md
contracts/permissions/15-admin-actions.md
```

## Related Frontend Areas

Phase 5 onboarding validation should inspect these frontend paths:

```text
frontend/portal/src/app/routes.tsx
frontend/portal/src/app/config/navigation.ts
frontend/portal/src/app/config/routes.registry.ts
frontend/portal/src/app/config/phase1FlowStates.ts
frontend/portal/src/app/services/mock/
frontend/portal/src/app/mock/
```

These files are expected to contain route definitions, navigation assumptions, flow state assumptions, mock services, and mock data used during the frontend/UI phases.

## Related Backend Areas

Phase 5 onboarding validation should inspect these backend paths:

```text
apps/rbp_app/rbp_app/api/
apps/rbp_app/rbp_app/doctype/
apps/rbp_app/rbp_app/services/
apps/rbp_app/rbp_app/hooks.py
```

These backend areas should be checked against onboarding fields, workflow states, permissions, API expectations, and route behavior.

## Phase 5 Onboarding Validation Model

Phase 5 should validate onboarding flows in this order:

1. Review `phase-2-starting-brief.md` for scope and assumptions.
2. Review `flow-field-inventory.md` for field expectations.
3. Review `route-to-contract-map.md` for route and API expectations.
4. Review `workflow-state-map.md` and `portal-status-map.md` for state behavior.
5. Review `mock-api-inventory.md` for mocked API coverage.
6. Review frontend route and mock service implementation.
7. Review backend API, DocType, service, permission, and guard implementation.
8. Identify mismatches between frontend, backend, and contracts.
9. Document any required contract changes before changing implementation behavior.
10. Add smoke tests for the highest-risk onboarding paths.

## Onboarding Areas to Validate

Phase 5 should explicitly validate:

- user registration or signup entry points
- account or tenant onboarding states
- membership/application flows
- dashboard or portal first-use flows
- profile or account setup fields
- role and permission gates
- workflow state transitions
- admin review or admin action flows
- payment/billing state handoff where applicable
- notification-triggered transitions
- upload/file requirements where applicable

## Mock-to-Real Boundary

The frontend may still include mock services and mock data from the UI/UX phase.

Phase 5 must decide, for every onboarding-related mock, whether it should be:

1. replaced with a real backend API call
2. wrapped behind a service adapter
3. retained only for local/demo mode
4. removed after backend integration

Primary references:

```text
specs/onboarding-flows/phase-2-handoff/mock-api-inventory.md
contracts/api/16-mock-to-real-api-map.md
frontend/portal/src/app/services/mock/
```

## Field and DocType Boundary

Onboarding form fields should be validated against:

```text
specs/onboarding-flows/phase-2-handoff/flow-field-inventory.md
contracts/doctypes/05-core-doctype-model.md
contracts/doctypes/12-form-field-specifications.md
contracts/doctypes/13-validation-rules.md
apps/rbp_app/rbp_app/doctype/
```

Phase 5 should confirm that frontend-visible fields have a matching backend model, validation behavior, or documented reason for being frontend-only.

## Workflow and Status Boundary

Onboarding status behavior should be validated against:

```text
specs/onboarding-flows/phase-2-handoff/workflow-state-map.md
specs/onboarding-flows/phase-2-handoff/portal-status-map.md
contracts/workflows/06-workflow-state-standards.md
contracts/workflows/08-payment-state-model.md
contracts/workflows/14-notification-triggers.md
frontend/portal/src/app/config/phase1FlowStates.ts
```

Phase 5 must confirm that frontend state names, backend workflow states, notification triggers, and portal status behavior align.

## Permission and Admin Boundary

Admin and permission behavior for onboarding should be validated against:

```text
specs/onboarding-flows/phase-2-handoff/admin-action-map.md
docs/product-flows/admin-permissions-model.md
contracts/permissions/03-role-matrix.md
contracts/permissions/04-permission-model-draft.md
contracts/permissions/15-admin-actions.md
apps/rbp_app/rbp_app/hooks.py
apps/rbp_app/rbp_app/doctype/
```

Phase 5 should confirm that any onboarding/admin actions exposed in the UI have corresponding backend permission enforcement.

## Contract Change Rule

If Phase 5 changes an onboarding flow assumption, the relevant source-of-truth document must be updated.

Document the following for each change:

- onboarding flow affected
- source document changed
- frontend impact
- backend impact
- contract impact
- test impact
- migration or compatibility impact

Do not silently change onboarding behavior only in frontend or backend code. That is how product flows become folklore.

## Related Documents

```text
docs/architecture/ARCHITECTURE.md
docs/architecture/PHASE_5_HANDOFF.md
docs/architecture/PHASE_5_CI_PLAN.md
docs/api-contracts/API_CONTRACTS.md
docs/product-flows/PRODUCT_FLOWS.md
contracts/README.md
docs/architecture/PHASE_4B_CONTRACTS_MIGRATION.md
docs/architecture/PHASE_4B_FRONTEND_MIGRATION.md
docs/architecture/PHASE_4B_BACKEND_IMPORT.md
```

## Status

The onboarding flow index is ready for Phase 5 Integration.

Phase 5 should use this document as the entry point for onboarding validation, field mapping, workflow validation, mock-to-real API replacement, permission checks, and frontend/backend alignment.
