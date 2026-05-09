# Phase 1 Flow State Standardisation

## Purpose

Step 20 standardises review, submit, confirmation, and status expectations across major Phase 1 flows.

This is a consistency and audit step. It does not rebuild every flow from scratch.

## Source Files

- src/app/config/phase1FlowStates.ts
- src/app/components/flow/FlowStateSummary.tsx
- scripts/phase1-flow-state-audit.mjs

## Major Flows Covered

- Membership purchase and onboarding
- Decision Desk
- DocuShare / Document Nucleus
- Marketplace buyer enquiry
- Marketplace seller listing
- NBN/connectivity order
- Risk Advisor
- The Fixer
- Contact/discovery enquiry
- Application setup enquiry

## Standard Required States

Each major Phase 1 flow should support:

1. Start
2. Draft
3. Input
4. Validation error
5. Review
6. Submitting/loading
7. Submit success
8. Submit failure
9. Confirmation
10. Status timeline
11. Portal status
12. Admin review
13. Mock-only notice

Empty states are recommended where lists, detail screens, dashboards, or unknown IDs can occur.

## Component Expectations

Use these shared components where appropriate:

- ReviewSubmit
- ConfirmationPanel
- MockSubmissionState
- StatusTimeline
- PortalStatusCard
- AdminReviewQueueCard
- StatusBadge
- ReviewStatusBadge
- FlowStateSummary

## Flow Expectations

### Membership

Must show plan selection, account details, mock payment, review, confirmation, onboarding completion, and portal status.

### Decision Desk

Must show business context, issue/decision, situation, options/urgency, supporting info, review, submit, confirmation, and status.

### DocuShare

Must show document group, purpose/audience, group questions, style/branding, mock uploads, review, submit, confirmation, and document status.

### Marketplace

Must show listing browse/detail, buyer enquiry, seller listing, mock uploads, fee/payment simulation, review, submit, confirmation, and admin review status.

### Connectivity

Must show serviceability, plan selection, hardware, business/contact details, mock payment, review, submit, confirmation, and provisioning status.

### Risk Advisor

Must show business profile, risk categories, controls, incidents/compliance, risk appetite, mock score, review, submit, confirmation, and outcome status.

### The Fixer

Must show problem intake, impact, urgency/scope, supporting info, desired resolution, review, submit, confirmation, and triage status.

### Contact/Discovery

Must show enquiry input, review or confirmation, submit state, confirmation, and admin/request visibility where applicable.

### Application Setup

Must show app access state, request access or entitlement state, confirmation/status, and future admin review concept.

## Phase 1 Safety Rules

No standard flow state may introduce:

- Real backend writes
- Real authentication
- Real payment processing
- Real file upload
- Real Frappe API
- Real marketplace checkout
- Real carrier serviceability
- Real advisor assignment
- Real support ticketing
- Real email sending

Mock states must make simulation clear.

## Audit

Run:

    node scripts/phase1-flow-state-audit.mjs

This audit checks the presence of Step 20 registry/docs and scans common flow files for expected state-related components and keywords.

The script is intentionally lightweight and should be treated as a QA helper, not a replacement for manual route smoke testing.
