# Phase 2 Backend Assumptions

## Purpose

This document captures backend assumptions and open questions arising from Phase 1 UI/UX Completion.

## High-Level Assumptions

- Phase 2 will introduce real backend contracts after frontend flows are complete.
- Frappe may be used for DocTypes, workflows, permissions, and admin operations.
- Authentication and permissions are deferred until backend contract planning is ready.
- Payment processing is deferred until billing, legal wording, and state machines are defined.
- Uploads are deferred until storage, virus scanning, permissions, retention and file ownership are defined.
- Admin workflows require audit trail support.
- Portal status should aggregate canonical backend records.

## Frappe / DocType Assumptions

Potential DocTypes:

- Customer Account
- Organisation
- Membership Application
- Membership
- Membership Onboarding
- Billing Profile
- Decision Desk Request
- Document Product
- Document Brief
- Document Request
- Marketplace Listing
- Marketplace Enquiry
- Connectivity Order
- Risk Assessment
- Fixer Request
- App Entitlement
- App Access Request
- Offer
- Resource
- Support Request
- Admin Review Action
- Audit Log
- Notification

## Identity and Permissions

Open questions:

- Will users belong to organisations?
- Can one user manage multiple businesses?
- What roles exist inside a business account?
- Who can view billing/membership?
- Who can view submitted requests?
- Who can access documents?
- Which admin roles can approve/reject/assign?
- Are support/admin users managed inside Frappe or another identity provider?

## Payment Assumptions

Open questions:

- Which provider will handle payments?
- Are memberships subscription-based?
- Are marketplace listings paid?
- Are marketplace transactions processed or enquiry-only?
- Are connectivity orders billed through RBP, supplier, or third-party provider?
- What are the failure, refund, cancellation, and retry states?
- What legal wording is required before payment implementation?

## Upload and File Assumptions

Open questions:

- Which storage provider will be used?
- What file types are allowed?
- What file size limits apply?
- Is virus scanning required?
- How are files linked to DocTypes?
- Who can download/view files?
- What retention rules apply?
- Are uploaded files ever shared with third parties?

## Notifications

Potential triggers:

- submission received
- admin requests more info
- admin approves/rejects
- advisor assigned
- document ready
- connectivity provisioning update
- risk outcome ready
- fixer triage update
- marketplace enquiry response
- membership activated

Open questions:

- Email, portal notification, or both?
- Are SMS notifications required?
- Who can configure notification preferences?
- How are failed notifications handled?

## Audit

Audit should capture:

- actor
- action
- target object
- previous state
- next state
- timestamp
- notes
- route/source UI
- request ID or correlation ID

Open questions:

- Is audit immutable?
- Who can view audit?
- Are exports required?
- How long are audit logs retained?

## Integration Assumptions

Potential integrations:

- Frappe backend
- Payment provider
- Email provider
- File storage provider
- Carrier/connectivity provider
- Marketplace supplier workflows
- Support/ticketing system
- Analytics/reporting

## Recommended Phase 2 Sequence

1. Finalise route-to-contract map.
2. Finalise field inventory.
3. Finalise workflow state machines.
4. Define roles and permissions.
5. Define audit log model.
6. Define notification events.
7. Define upload/file contracts.
8. Define payment state contracts.
9. Define Frappe DocTypes.
10. Implement backend incrementally by flow.
