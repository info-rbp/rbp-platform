# Phase 1 Exclusions

This document protects Phase 1 from backend creep.

Phase 1 is frontend/UI-UX completion only. Anything listed here must not be implemented during Phase 1 unless the project scope is formally changed.

## Not Allowed in Phase 1

    Real Firebase Auth
    Real Firestore persistence
    Real Frappe APIs
    Real payment processing
    Real file upload persistence
    Real email sending
    Real booking system
    Real CRM integration
    Real admin permissions
    Real member entitlements
    Real production authentication guards
    Real marketplace checkout
    Real offer redemption
    Real document download control
    Real support ticket backend
    Real notification delivery

## Allowed Instead

Use these Phase 1-safe alternatives:

    Mock user session
    Mock membership status
    Mock payment simulation
    Mock file upload placeholders
    Mock submission handlers
    Mock status timelines
    Mock admin queues
    Mock portal dashboard records
    Mock notification records
    Static frontend data
    Local frontend validation
    Frontend-only confirmation pages

## Backend Work Deferred to Later Phases

Backend work belongs in later phases:

    Phase 2: Backend contract planning
    Phase 3: Frappe platform completion
    Phase 4: Repository consolidation
    Phase 5: Frontend/backend integration
    Phase 6: QA
    Phase 7: Launch

## Rule

If a feature requires a real database, real authentication, real payment provider, real file storage, real Frappe endpoint, or real external integration, it is not a Phase 1 implementation task.

In Phase 1, build the user experience and simulate the system behaviour.

## Examples of Phase 1-Safe Implementation

Allowed:

    A membership signup form that validates locally and returns a mock confirmation number.
    A Decision Desk request flow that submits to a mock service.
    A DocuShare brief flow with mock file upload placeholders.
    A marketplace enquiry form that creates a mock enquiry status.
    A connectivity order simulation with mock serviceability results.
    A Risk Advisor assessment that calculates a mock score.
    A Fixer request flow that creates a mock request reference.
    An admin review queue populated from mock records.
    A portal dashboard showing mock user status and activity.

Not allowed:

    Creating real users in Firebase Auth.
    Writing membership records to Firestore.
    Calling Frappe API endpoints.
    Charging a payment method.
    Uploading files to real storage.
    Sending real emails.
    Creating real support tickets.
    Enforcing real permissions.
    Building production integrations.
