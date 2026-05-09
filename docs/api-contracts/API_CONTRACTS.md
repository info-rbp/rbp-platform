# API Contracts

## Purpose

This document is the top-level index for API contract documentation in the consolidated Remote Business Partner Platform repository.

The API contracts define how Phase 5 Integration should align the frontend portal, backend `rbp_app`, route mappings, response envelopes, error handling, upload rules, and mock-to-real API replacement.

Phase 4 migrated the Phase 2 API contract baseline into `rbp-platform`. Phase 5 should consume these contracts as the integration reference, not reinvent them in a spreadsheet-shaped fever dream.

## Source

Source repository:

```text
info-rbp/Uiuxdesignassistance
```

Source commit:

```text
6165346d4fc29fba6b78ec84e32285159a182c82
```

Primary source package:

```text
RBP_Phase_2_Backend_Contracts/
```

Supporting source documents:

```text
docs/backend-collection-contracts.md
docs/backend-collection-contracts-audit.md
docs/backend-resources-help-center.md
docs/backend-resources-help-center-audit.md
docs/ui/mock-api-simulation-layer.md
```

## Primary API Contract Location

The primary API contracts live in:

```text
contracts/api/
```

Primary API contract files:

```text
contracts/api/01-api-response-envelope-standard.md
contracts/api/07-error-catalogue.md
contracts/api/09-upload-file-rules.md
contracts/api/11-route-to-endpoint-map.md
contracts/api/16-mock-to-real-api-map.md
```

## Supporting API Documentation Location

Supporting API documentation lives in:

```text
docs/api-contracts/
```

Supporting API documents:

```text
docs/api-contracts/backend-collection-contracts.md
docs/api-contracts/backend-collection-contracts-audit.md
docs/api-contracts/backend-resources-help-center.md
docs/api-contracts/backend-resources-help-center-audit.md
docs/api-contracts/API_CONTRACTS.md
```

## Contract File Index

| File | Purpose | Phase 5 Usage |
|---|---|---|
| `contracts/api/01-api-response-envelope-standard.md` | Defines standard API response envelope expectations | Validate backend API response shape and frontend response parsing |
| `contracts/api/07-error-catalogue.md` | Defines expected error names, categories, and handling behavior | Align backend error responses and frontend error display states |
| `contracts/api/09-upload-file-rules.md` | Defines upload/file handling rules | Validate upload endpoints, file validation, and frontend upload behavior |
| `contracts/api/11-route-to-endpoint-map.md` | Maps frontend/product routes to backend endpoint expectations | Drive frontend-to-backend route integration |
| `contracts/api/16-mock-to-real-api-map.md` | Maps mocked frontend APIs/services to real backend APIs | Guide replacement or isolation of mock services in Phase 5 |
| `docs/api-contracts/backend-collection-contracts.md` | Supporting backend collection contract documentation | Validate backend collection/resource API coverage |
| `docs/api-contracts/backend-collection-contracts-audit.md` | Audit notes for backend collection contracts | Identify contract coverage gaps and implementation risks |
| `docs/api-contracts/backend-resources-help-center.md` | Supporting resources/help center backend contract documentation | Validate help center/resource API behavior |
| `docs/api-contracts/backend-resources-help-center-audit.md` | Audit notes for resources/help center contracts | Identify content/resource contract gaps |

## Related Source Areas

Frontend API consumers:

```text
frontend/portal/src/app/services/mock/
frontend/portal/src/app/config/routes.registry.ts
frontend/portal/src/app/routes.tsx
```

Backend API implementation candidates:

```text
apps/rbp_app/rbp_app/api/
apps/rbp_app/rbp_app/services/
```

Backend app metadata and route behavior:

```text
apps/rbp_app/rbp_app/hooks.py
```

## Phase 5 Consumption Model

Phase 5 should consume the API contracts in this order:

1. Review `contracts/api/11-route-to-endpoint-map.md` against frontend routes.
2. Review `contracts/api/16-mock-to-real-api-map.md` against frontend mock services.
3. Review backend API modules under `apps/rbp_app/rbp_app/api/`.
4. Identify missing, renamed, or incompatible backend endpoints.
5. Confirm response shapes against `contracts/api/01-api-response-envelope-standard.md`.
6. Confirm error behavior against `contracts/api/07-error-catalogue.md`.
7. Confirm upload behavior against `contracts/api/09-upload-file-rules.md`.
8. Update implementation or document contract changes explicitly.

## Validation Expectations

Phase 5 API validation should confirm:

- frontend routes have matching backend endpoint decisions
- mock services are either replaced, wrapped, or explicitly retained for non-production use
- backend API responses follow the agreed envelope standard
- backend errors map to the error catalogue
- upload/file behavior follows the upload rules
- backend API modules are covered by smoke tests
- route-to-endpoint mismatches are documented before implementation changes

## Recommended Phase 5 Checks

Recommended checks to add during Phase 5:

```text
compare contracts/api/11-route-to-endpoint-map.md with frontend route registry
compare contracts/api/16-mock-to-real-api-map.md with frontend mock services
compare contracts/api/11-route-to-endpoint-map.md with apps/rbp_app/rbp_app/api/
run backend API smoke tests in a Frappe bench site
run frontend build after API boundary changes
```

## Contract Change Rule

After Phase 4, API contract changes should be explicit and reviewed.

If Phase 5 discovers that implementation must differ from the Phase 2 contract baseline, the change should update the relevant contract file and explain:

- what changed
- why it changed
- frontend impact
- backend impact
- test impact
- migration or compatibility impact

Do not silently drift from the contracts. Silent drift is how integrations become haunted houses with JSON.

## Related Documents

```text
contracts/README.md
docs/architecture/PHASE_4B_CONTRACTS_MIGRATION.md
docs/architecture/PHASE_5_HANDOFF.md
docs/architecture/PHASE_5_CI_PLAN.md
docs/architecture/ARCHITECTURE.md
```

## Status

The API contract index is ready for Phase 5 Integration.

Phase 5 should use this document as the entry point for API contract validation and frontend/backend API alignment.
