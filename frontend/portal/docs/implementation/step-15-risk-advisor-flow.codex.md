# Step 15 Risk Advisor Flow

Manual implementation completed because Codex credits were unavailable.

## Goal

Implement a frontend-only Risk Advisor mock assessment flow using Phase 1 mock data, mock services, and reusable flow components.

## Scope

This implementation covers:

- Risk Advisor overview
- Business profile
- Risk category selection
- Control maturity
- Incident/compliance questions
- Risk appetite
- Mock score preview
- Review and submit
- Confirmation/reference state
- Portal status handoff

## Non-Goals

- Real backend
- Real auth
- Real scoring API
- Real advisor assignment
- Real upload
- Real payment
- Frappe integration

## Files

- src/app/features/risk-advisor/RiskAdvisorFlow.tsx
- src/app/features/risk-advisor/index.ts
- src/app/pages/on-demand/RiskAdvisorPage.tsx
- src/app/mock/riskAdvisor.mock.ts
- src/app/services/mock/riskAdvisor.mockService.ts
- docs/ui/risk-advisor-flow-implementation.md
- docs/qa/step-15-risk-advisor-flow-checklist.md
