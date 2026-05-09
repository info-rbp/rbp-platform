# Phase 2 Workflow State Map

## Purpose

This document maps Phase 1 frontend states to future backend workflow states.

## Standard States

Recommended shared states:

- draft
- submitted
- pending
- in-review
- needs-info
- approved
- rejected
- assigned
- active
- outcome-ready
- complete
- cancelled
- failed

## Membership Workflow

| Phase 1 State | Phase 2 Backend State |
|---|---|
| Plan selected | draft |
| Mock payment pending | payment_pending |
| Mock payment simulated success | payment_confirmed |
| Signup submitted | submitted |
| Membership active | active |
| Onboarding in progress | onboarding_in_progress |
| Onboarding complete | onboarding_complete |
| Portal access available | active |

## Decision Desk Workflow

| Phase 1 State | Phase 2 Backend State |
|---|---|
| Draft/input | draft |
| Review | ready_to_submit |
| Submitted | submitted |
| Admin review | in_review |
| More information needed | needs_info |
| Advisor assigned | assigned |
| Outcome ready | outcome_ready |
| Closed | complete |

## DocuShare Workflow

| Phase 1 State | Phase 2 Backend State |
|---|---|
| Brief started | draft |
| Mock upload placeholder | awaiting_files |
| Review | ready_to_submit |
| Submitted | submitted |
| Admin review | in_review |
| Document in progress | in_progress |
| Document ready | outcome_ready |
| Completed | complete |

## Marketplace Workflow

### Buyer Enquiry

| Phase 1 State | Phase 2 Backend State |
|---|---|
| Enquiry draft | draft |
| Review | ready_to_submit |
| Submitted | submitted |
| Seller/admin review | in_review |
| Response sent | response_sent |
| Closed | complete |

### Seller Listing

| Phase 1 State | Phase 2 Backend State |
|---|---|
| Listing draft | draft |
| Media placeholder | awaiting_media |
| Mock fee/payment | payment_pending or fee_acknowledged |
| Submitted | submitted |
| Admin review | in_review |
| Needs info | needs_info |
| Approved | approved |
| Published | published |
| Rejected | rejected |

## Connectivity Workflow

| Phase 1 State | Phase 2 Backend State |
|---|---|
| Address entered | draft |
| Serviceability simulated | serviceability_checked |
| Plan selected | plan_selected |
| Mock payment pending | payment_pending |
| Submitted | submitted |
| Provisioning review | provisioning_review |
| Provisioning in progress | provisioning_in_progress |
| Active | active |
| Failed/cancelled | failed or cancelled |

## Risk Advisor Workflow

| Phase 1 State | Phase 2 Backend State |
|---|---|
| Assessment started | draft |
| Controls reviewed | input_complete |
| Mock score generated | score_generated |
| Submitted | submitted |
| Admin review | in_review |
| Outcome ready | outcome_ready |
| Closed | complete |

## The Fixer Workflow

| Phase 1 State | Phase 2 Backend State |
|---|---|
| Request started | draft |
| Submitted | submitted |
| Mock triage | triage |
| Assigned | assigned |
| In progress | in_progress |
| Needs info | needs_info |
| Resolved | complete |
| Closed | closed |

## Admin Review Workflow

| Phase 1 State | Phase 2 Backend State |
|---|---|
| Queue item visible | pending |
| Review opened | in_review |
| Request more info | needs_info |
| Approve | approved |
| Reject | rejected |
| Assign | assigned |
| Close | complete |
| Audit recorded | audit_logged |

## State Machine Requirement

Phase 2 should define allowed transitions per flow.

Examples:

- submitted to in_review
- in_review to needs_info
- in_review to approved
- approved to active or outcome_ready
- assigned to in_progress
- in_progress to complete
- any non-final state to cancelled where allowed

## Audit Requirement

Every admin workflow transition should record:

- actor
- action
- previous state
- next state
- timestamp
- notes
- source route or UI action
