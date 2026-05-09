# Step 8: Reusable Flow and Wizard Components

## Goal

Create reusable flow, wizard, form, status, and domain-pattern components based on the Stitch workflow patterns mapped in Step 8A.

This step creates shared infrastructure only.

## Source References

    docs/stitch/component-patterns.md
    docs/stitch/workflow-screen-map.md
    docs/stitch/stitch-to-phase-map.md

## Created Component Areas

    src/app/components/flow/
    src/app/components/forms/
    src/app/components/status/
    src/app/components/domain/

## What This Step Does

Creates reusable components for:

    wizard shells
    step indicators
    step navigation
    review and submit screens
    confirmation panels
    status timelines
    mock submission states
    form sections
    text inputs
    textarea inputs
    selects
    checkboxes
    radio card groups
    selectable cards
    mock upload placeholders
    terms acceptance
    status badges
    entitlement badges
    review status badges
    payment simulation panels
    serviceability check panels
    plan selection cards
    order summaries
    portal status cards
    admin review queue cards
    marketplace listing cards
    document product cards
    risk score summaries

## What This Step Does Not Do

This step does not implement:

    full Membership flow
    full Portal/dashboard experience
    full Decision Desk flow
    full DocuShare flow
    full Marketplace flow
    full NBN/connectivity flow
    full Risk Advisor flow
    full The Fixer flow

Those are handled in Steps 9 to 16.

## Phase 1 Safety Rules

No real backend logic is introduced.

Do not add:

    Firebase Auth
    Firestore persistence
    Frappe APIs
    real payment processing
    real uploads
    real email sending
    real booking systems
    real marketplace checkout
    real support tickets
