# Phase 2 Starting Brief

## Purpose

This brief provides a starting point for Phase 2 backend contract planning after Phase 1 UI/UX Completion.

## Phase 1 Outcome

Phase 1 delivers complete frontend mock flows for:

- Public website route coverage
- Portal/dashboard mock experience
- Membership purchase and onboarding
- Decision Desk request
- DocuShare / Document Nucleus brief
- Marketplace enquiry and seller listing
- NBN/connectivity order simulation
- Risk Advisor assessment
- The Fixer urgent request
- Admin UI concepts
- Central mock data
- Mock API simulation
- Reusable wizard/flow components
- Design system rules
- Responsive QA documentation
- Phase 1 audit script
- Smoke-test documentation

## Phase 2 Objective

Convert Phase 1 mock frontend behaviour into real backend contracts, workflows, data models, permissions, and integrations.

## Phase 2 Planning Inputs

Use these documents:

- docs/phase-2-handoff/route-to-contract-map.md
- docs/phase-2-handoff/flow-field-inventory.md
- docs/phase-2-handoff/mock-api-inventory.md
- docs/phase-2-handoff/workflow-state-map.md
- docs/phase-2-handoff/admin-action-map.md
- docs/phase-2-handoff/portal-status-map.md
- docs/phase-2-handoff/backend-assumptions.md

Use these source areas:

- src/app/routes.tsx
- src/app/mock/
- src/app/services/mock/
- src/app/features/
- src/app/pages/
- docs/ui/
- docs/qa/

## Recommended Phase 2 Workstreams

### Workstream 1: Data Model and Frappe DocTypes

Define:

- DocTypes
- fields
- relationships
- child tables
- workflow states
- permissions
- audit requirements

### Workstream 2: API Contracts

Define:

- endpoint/method names
- request payloads
- response payloads
- error shapes
- validation rules
- auth rules

### Workstream 3: Auth and Permissions

Define:

- user roles
- organisation ownership
- member roles
- admin roles
- route protection
- API permissions

### Workstream 4: Workflow and Admin Actions

Define:

- workflow transitions
- admin actions
- assignment rules
- request-more-info flows
- close/reopen flows
- audit records

### Workstream 5: Portal Aggregation

Define:

- portal dashboard aggregate response
- status cards
- notifications
- recent activity
- recommended actions
- entitlements

### Workstream 6: Uploads and Files

Define:

- storage provider
- file metadata
- upload endpoints
- permissions
- scanning
- retention
- document request linkage

### Workstream 7: Payments and Billing

Define:

- payment provider
- subscription states
- failed payment states
- marketplace fee states
- connectivity billing states
- legal wording and compliance

### Workstream 8: Notifications

Define:

- notification events
- email templates
- portal notification model
- user preferences
- delivery failures

## Recommended Build Order

1. Membership backend contracts
2. User/account/organisation model
3. Portal aggregate model
4. Decision Desk request backend
5. DocuShare request backend
6. Marketplace enquiry/listing backend
7. Connectivity order backend
8. Risk Advisor assessment backend
9. The Fixer request backend
10. Admin review/action backend
11. Audit and notification layer
12. Upload/payment integrations after legal and contract signoff

## Phase 2 Guardrails

Do not begin real integrations until contracts are approved for:

- auth
- payment
- uploads
- Frappe DocTypes
- admin actions
- workflow states
- audit trail
- notification triggers

## Immediate Next Step

Run a backend contract planning workshop using:

- route-to-contract-map.md
- flow-field-inventory.md
- workflow-state-map.md
- backend-assumptions.md

Produce:

- Phase 2 backend scope
- DocType list
- endpoint list
- workflow diagrams
- permission matrix
- integration backlog
