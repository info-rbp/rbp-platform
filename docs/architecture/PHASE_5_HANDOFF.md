# Phase 5 Handoff

## Purpose

This document defines what Phase 5 Integration receives from Phase 4 Consolidation.

## Phase 5 Starting Point

- Repository: `info-rbp/rbp-platform`
- Branch: `main`
- Phase 4 status: complete

## Inputs Available

| Area | Path | Status |
|---|---|---:|
| Backend custom Frappe app | `apps/rbp_app/` | Available |
| Frontend React/Vite portal | `frontend/portal/` | Available |
| API contracts | `contracts/api/` | Available |
| DocType contracts | `contracts/doctypes/` | Available |
| Workflow contracts | `contracts/workflows/` | Available |
| Permission contracts | `contracts/permissions/` | Available |
| Onboarding handoff specs | `specs/onboarding-flows/phase-2-handoff/` | Available |
| API supporting docs | `docs/api-contracts/` | Available |
| Product-flow supporting docs | `docs/product-flows/` | Available |

## Phase 5 Primary Goals

1. Validate backend app installability in a Frappe bench environment.
2. Validate backend DocTypes, permissions, hooks, and route guards.
3. Map frontend routes and mock services to real backend endpoints.
4. Replace or isolate mock data behind real API integration boundaries.
5. Decide whether frontend remains separately deployed, Frappe-served, or embedded alongside Frappe.
6. Add CI checks for frontend build, backend syntax/lint, Frappe install smoke, and integration smoke tests.

## Phase 5 Guardrails

- Do not re-import the source repositories wholesale.
- Do not copy Frappe framework core.
- Do not commit local `.env` files or secrets.
- Do not commit generated build/runtime output.
- Do not overwrite Phase 2 contracts without documenting the contract change.
- Do not bypass the consolidated repository structure.

## Phase 5 First Technical Checks

- Run frontend install and build from `frontend/portal/`.
- Run Python syntax check for `apps/rbp_app/rbp_app/`.
- Attempt Frappe app install in a bench site.
- Run Frappe migrate smoke test.
- Compare `contracts/api/11-route-to-endpoint-map.md` with backend API modules.
- Compare `contracts/api/16-mock-to-real-api-map.md` with frontend mock services.

## Handoff Status

Phase 5 can begin after this wrap-up document is merged into `main`.
