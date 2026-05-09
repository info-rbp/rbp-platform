# Step 14 Connectivity Order Flow

Manual implementation completed because Codex credits were unavailable.

## Goal

Implement a frontend-only NBN/connectivity mock order flow using Phase 1 mock data, mock services, and reusable flow components.

## Scope

This implementation covers:

- Connectivity overview
- Service family selection
- Mock serviceability check
- Plan selection
- Hardware selection
- Business/contact details
- Mock payment simulation
- Review and submit
- Confirmation/reference state
- Portal status handoff

## Non-Goals

- Real backend
- Real NBN API
- Real Superloop API
- Real carrier order
- Real payment
- Real upload
- Real auth
- Frappe integration

## Files

- src/app/features/connectivity/ConnectivityOrderFlow.tsx
- src/app/features/connectivity/index.ts
- src/app/pages/operations/ConnectivityPage.tsx
- src/app/pages/operations/NbnPhonePage.tsx
- src/app/pages/operations/SuperloopPage.tsx
- src/app/mock/connectivity.mock.ts
- src/app/services/mock/connectivity.mockService.ts
- docs/ui/connectivity-flow-implementation.md
- docs/qa/step-14-connectivity-flow-checklist.md
