# Product Flows

## Purpose

This document is the top-level index for product-flow documentation in the consolidated Remote Business Partner Platform repository.

The product-flow documentation connects the Phase 1 UI/UX work, Phase 2 handoff/spec material, frontend route structure, backend contract expectations, and Phase 5 integration planning.

Phase 4 migrated the relevant product-flow and supporting documentation into `rbp-platform`. Phase 5 should use this document as the entry point for product-flow validation and frontend/backend integration alignment.

## Source

Primary source repository:

```text
info-rbp/Uiuxdesignassistance
```

Source commit:

```text
6165346d4fc29fba6b78ec84e32285159a182c82
```

Supporting source paths:

```text
docs/admin-permissions-model.md
docs/ui/mock-api-simulation-layer.md
docs/phase-2-handoff/
src/app/config/routes.registry.ts
src/app/config/phase1FlowStates.ts
src/app/services/mock/
src/app/mock/
```

## Consolidated Locations

Product-flow material now lives across these consolidated paths:

```text
docs/product-flows/
specs/onboarding-flows/phase-2-handoff/
contracts/api/
contracts/doctypes/
contracts/workflows/
contracts/permissions/
frontend/portal/src/app/config/
frontend/portal/src/app/services/mock/
apps/rbp_app/rbp_app/
```

## Product-Flow Document Index

| Document | Purpose | Phase 5 Usage |
|---|---|---|
| `docs/product-flows/admin-permissions-model.md` | Documents admin permission and role model expectations | Validate backend permissions, admin surfaces, and role behavior |
| `docs/product-flows/mock-api-simulation-layer.md` | Documents the frontend mock API simulation approach | Guide mock-to-real API replacement and integration boundaries |
| `specs/onboarding-flows/phase-2-handoff/phase-2-starting-brief.md` | Starting brief for Phase 2 handoff context | Orient Phase 5 integration around known assumptions and scope |
| `specs/onboarding-flows/phase-2-handoff/portal-status-map.md` | Maps portal state/status expectations | Validate portal route and state behavior |
| `specs/onboarding-flows/phase-2-handoff/route-to-contract-map.md` | Maps product routes to backend contract references | Align frontend routes with API contracts |
| `specs/onboarding-flows/phase-2-handoff/workflow-state-map.md` | Maps workflow states across product flows | Validate backend workflow implementation and UI state transitions |
| `specs/onboarding-flows/phase-2-handoff/flow-field-inventory.md` | Records field expectations across flows | Validate forms, DocTypes, and frontend field usage |
| `specs/onboarding-flows/phase-2-handoff/mock-api-inventory.md` | Records mocked API coverage | Identify mocks that require real backend API mapping |
| `specs/onboarding-flows/phase-2-handoff/admin-action-map.md` | Maps admin actions and expected behavior | Validate admin actions against permissions and backend behavior |
| `specs/onboarding-flows/phase-2-handoff/backend-assumptions.md` | Records backend assumptions from Phase 2 | Validate whether Phase 3 backend implementation matches assumptions |

## Related Contract Areas

Product flows are supported by the migrated Phase 2 contracts.

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

Product-flow validation should inspect these frontend paths:

```text
frontend/portal/src/app/routes.tsx
frontend/portal/src/app/config/navigation.ts
frontend/portal/src/app/config/routes.registry.ts
frontend/portal/src/app/config/phase1FlowStates.ts
frontend/portal/src/app/services/mock/
frontend/portal/src/app/mock/
```

The frontend source contains route definitions, navigation structure, mocked services, and product-flow state assumptions that Phase 5 must align with backend implementation.

## Related Backend Areas

Product-flow validation should inspect these backend paths:

```text
apps/rbp_app/rbp_app/api/
apps/rbp_app/rbp_app/doctype/
apps/rbp_app/rbp_app/services/
apps/rbp_app/rbp_app/hooks.py
```

The backend source contains APIs, DocTypes, service modules, permission behavior, and route guards that Phase 5 must align with the product-flow and contract baseline.

## Phase 5 Product-Flow Validation Model

Phase 5 should validate product flows in this order:

1. Review frontend routes and route registry.
2. Review product-flow handoff specs.
3. Review route-to-contract map.
4. Review mock-to-real API map.
5. Review backend API modules and DocTypes.
6. Identify missing or mismatched backend coverage.
7. Validate role and permission behavior.
8. Validate workflow states and payment states.
9. Validate forms and field-level behavior.
10. Document any contract or implementation deltas.

## Product-Flow Areas to Validate in Phase 5

Phase 5 should explicitly validate:

- public website flows
- onboarding flows
- portal/dashboard flows
- admin action flows
- marketplace or service discovery flows
- resources/help center flows
- membership/application flows
- payment and billing state flows
- upload/file flows
- notification-triggered flows
- permission-gated flows

## Mock-to-Real Boundary

The migrated frontend includes mock services and mock data that supported Phase 1 and Phase 2 UI work.

Phase 5 must decide for each mocked behavior whether it should be:

1. replaced with a real backend API call
2. wrapped behind a service adapter
3. retained only for local/demo mode
4. removed after backend integration

The primary reference for this work is:

```text
contracts/api/16-mock-to-real-api-map.md
docs/product-flows/mock-api-simulation-layer.md
frontend/portal/src/app/services/mock/
```

## Permission and Admin Flow Boundary

Admin and permission behavior should be validated against:

```text
docs/product-flows/admin-permissions-model.md
contracts/permissions/03-role-matrix.md
contracts/permissions/04-permission-model-draft.md
contracts/permissions/15-admin-actions.md
apps/rbp_app/rbp_app/hooks.py
apps/rbp_app/rbp_app/doctype/
```

Phase 5 must confirm that UI-visible admin actions are backed by appropriate backend permission checks.

## Workflow and State Boundary

Workflow and state behavior should be validated against:

```text
specs/onboarding-flows/phase-2-handoff/workflow-state-map.md
contracts/workflows/06-workflow-state-standards.md
contracts/workflows/08-payment-state-model.md
contracts/workflows/14-notification-triggers.md
frontend/portal/src/app/config/phase1FlowStates.ts
```

Phase 5 must confirm that frontend state assumptions and backend workflow behavior do not drift apart, because state drift is where product flows go to become ghost stories.

## Contract Change Rule

If Phase 5 changes a product-flow assumption, the change should update the relevant source-of-truth document.

Document the following for each change:

- product flow affected
- source document changed
- frontend impact
- backend impact
- contract impact
- test impact
- migration or compatibility impact

Product-flow changes should not be made silently in frontend or backend code only.

## Related Documents

```text
docs/architecture/ARCHITECTURE.md
docs/architecture/PHASE_5_HANDOFF.md
docs/architecture/PHASE_5_CI_PLAN.md
docs/api-contracts/API_CONTRACTS.md
contracts/README.md
docs/architecture/PHASE_4B_CONTRACTS_MIGRATION.md
docs/architecture/PHASE_4B_FRONTEND_MIGRATION.md
docs/architecture/PHASE_4B_BACKEND_IMPORT.md
```

## Status

The product-flow index is ready for Phase 5 Integration.

Phase 5 should use this document as the entry point for product-flow validation, mock-to-real mapping, role/permission validation, workflow validation, and frontend/backend alignment.
