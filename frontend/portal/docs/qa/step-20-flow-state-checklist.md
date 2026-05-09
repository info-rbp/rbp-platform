# Step 20 Flow State Checklist

## Files

- src/app/config/phase1FlowStates.ts exists.
- src/app/components/flow/FlowStateSummary.tsx exists.
- scripts/phase1-flow-state-audit.mjs exists.
- docs/ui/flow-state-standardisation.md exists.
- docs/qa/step-20-flow-state-checklist.md exists.
- docs/implementation/step-20-flow-state-standardisation.codex.md exists.

## Required Flow States

Each major flow should support:

- Start state
- Draft/input state
- Validation error state
- Review state
- Submitting/loading state
- Success state
- Failure state
- Confirmation state
- Status timeline
- Portal status card or handoff
- Admin review concept where relevant
- Mock-only notice

## Major Flow Checks

- Membership has review, submit, confirmation, onboarding and portal status.
- Decision Desk has review, submit, confirmation and status.
- DocuShare has review, submit, confirmation, mock upload notice and document status.
- Marketplace enquiry has review, submit and confirmation.
- Marketplace listing has review, submit, mock upload, mock payment/fee notice and admin review.
- Connectivity has review, submit, mock payment, confirmation and provisioning status.
- Risk Advisor has review, submit, mock score, confirmation and status.
- The Fixer has review, submit, mock upload notice, confirmation and triage status.
- Contact/discovery has submit/confirmation coverage or documented placeholder.
- Application setup has entitlement/request/status coverage or documented placeholder.

## Safety Checks

- No real backend logic added.
- No real auth logic added.
- No real payment processing added.
- No real upload/storage logic added.
- No real Frappe APIs added.
- No real marketplace checkout added.
- No real support ticketing added.
- No real email sending added.

## Validation Commands

Run:

    node scripts/phase1-flow-state-audit.mjs
    npm run build
    rm -rf dist
    git status

## Responsive QA Placeholders

- Mobile flow states reviewed.
- Tablet flow states reviewed.
- Desktop flow states reviewed.
