# Phase 1 Starting Point

## Purpose

This document records the controlled source-material summary for Phase 1 UI/UX Completion.

Raw external files should not be committed directly unless they are small, approved, and intentionally required by the application. Source files should first be reviewed, summarised, and registered.

## Phase 1 Context

Phase 1 is focused on completing the frontend UI/UX experience for the Remote Business Partner application.

The Phase 1 frontend must support:

- Complete or intentionally redirected public website routes
- Polished portal/dashboard mock screens
- Membership purchase and onboarding mock flow
- Decision Desk mock submission flow
- DocuShare / Document Nucleus mock brief flow
- Marketplace enquiry and listing mock flow
- NBN/connectivity mock order flow
- Risk Advisor mock assessment flow
- The Fixer mock request flow
- Admin UI concepts
- Review, submit, confirmation, and status states
- Central mock data
- Mock API simulation
- Reusable flow/wizard components
- Documented design rules
- Responsive QA review
- Phase 1 audit script
- Phase 2 backend contract planning readiness

## External Source Handling Rule

External files should be handled in this sequence:

1. Place raw files locally in an ignored folder.
2. Review the file.
3. Extract relevant content into markdown notes or mock seed files.
4. Register the file in the external files register.
5. Commit only approved source-material summaries, documentation, seed data, or intentionally used assets.

## Ignored Local Folders

The following folders are local-only and ignored by Git:

    docs/source-material/_incoming/
    docs/source-material/_raw/

## Phase 1 Non-Goals

Do not introduce:

- Real backend services
- Real authentication
- Real payment processing
- Real uploads
- Real Frappe APIs
- Real carrier APIs
- Real marketplace checkout
- Real support ticketing
- Real email sending
