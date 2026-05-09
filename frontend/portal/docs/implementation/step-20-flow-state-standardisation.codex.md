# Step 20: Flow State Standardisation

Manual implementation completed because Codex credits were unavailable.

## Goal

Ensure every major Phase 1 flow has clear review, submit, confirmation, and status expectations.

## Scope

This step creates:

- Central Phase 1 flow-state registry
- Reusable FlowStateSummary component
- Lightweight flow-state audit script
- Flow-state standardisation documentation
- QA checklist

## Files Created

- src/app/config/phase1FlowStates.ts
- src/app/components/flow/FlowStateSummary.tsx
- scripts/phase1-flow-state-audit.mjs
- docs/ui/flow-state-standardisation.md
- docs/qa/step-20-flow-state-checklist.md
- docs/implementation/step-20-flow-state-standardisation.codex.md

## Files Updated

- src/app/components/flow/index.ts

## Major Flows Covered

- Membership
- Decision Desk
- DocuShare
- Marketplace enquiry
- Marketplace listing
- Connectivity
- Risk Advisor
- The Fixer
- Contact/discovery
- Application setup

## What This Step Does

- Standardises expected flow states.
- Documents required review/submit/confirmation/status behaviour.
- Provides a registry for Phase 2 planning.
- Adds a reusable component for displaying state expectations.
- Adds a lightweight audit helper.

## What This Step Does Not Do

- Does not rebuild all flows.
- Does not add backend services.
- Does not add real authentication.
- Does not add real payment processing.
- Does not add real uploads.
- Does not add Frappe APIs.
- Does not add real admin workflow persistence.

## Completion Criteria

- Flow state registry exists.
- Flow state documentation exists.
- QA checklist exists.
- Audit script runs.
- npm run build passes.
- dist is removed before commit.
- Working tree is clean after merge.
