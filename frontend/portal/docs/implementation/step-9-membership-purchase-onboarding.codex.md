# Step 9: Membership Purchase Onboarding Flow

## Goal

Implement the Phase 1 Membership Purchase Onboarding mock flow using the existing React/Vite app structure, the Step 8 reusable components, Step 6 mock data, Step 7 mock services, and the Google Stitch membership workflow reference.

This is a frontend-only implementation.

## Current Branch

Work only on:

    feature/step-9-membership-purchase-onboarding

Do not work directly on main, develop, or phase/phase-1-uiux-completion.

## Source References

Use these files as references:

    docs/stitch/workflow-screen-map.md
    docs/stitch/component-patterns.md
    docs/stitch/stitch-to-phase-map.md
    docs/stitch/stitch-source-inventory.md
    docs/ui/reusable-flow-component-inventory.md
    docs/ui/mock-data-inventory.md
    docs/ui/mock-api-simulation-layer.md

Use the local-only extracted Stitch reference if available:

    docs/stitch/_extracted/Membership Purchase Onboarding/

Do not commit anything from:

    docs/stitch/_source-zips/
    docs/stitch/_extracted/

## Relevant Existing Infrastructure

Use the existing reusable components:

    src/app/components/flow/
    src/app/components/forms/
    src/app/components/domain/
    src/app/components/status/

Use the existing mock data:

    src/app/mock/membership.mock.ts
    src/app/mock/user.mock.ts
    src/app/mock/billing.mock.ts
    src/app/mock/portal.mock.ts

Use the existing mock service:

    src/app/services/mock/membership.mockService.ts

## Membership Stitch Screens

Use the Membership Purchase Onboarding Stitch export as the UX reference. Expected screens include:

    public_membership_page
    signup_account_creation
    signup_inclusions_confirmation
    signup_extras_selection
    signup_payment_details
    signup_payment_success
    onboarding_business_details
    onboarding_business_profile
    onboarding_goals_priorities
    onboarding_managed_services_details
    onboarding_team_setup
    onboarding_completion_confirmation
    portal_membership_dashboard

If exact names differ, infer the equivalent screens from the extracted Stitch folders and workflow map.

## Required User Journey

Implement a repo-native React mock flow for:

    Membership overview / entry
        ↓
    Plan selection
        ↓
    Account creation / contact details
        ↓
    Inclusions confirmation
        ↓
    Extras selection
        ↓
    Mock payment details
        ↓
    Review
        ↓
    Mock submit
        ↓
    Payment success / membership confirmation
        ↓
    Business onboarding
        ↓
    Business profile
        ↓
    Goals and priorities
        ↓
    Managed services interests
        ↓
    Team setup
        ↓
    Onboarding completion
        ↓
    Portal membership dashboard handoff

## Routes to Review and Update

Review existing routes before making changes:

    src/app/routes.tsx

Implement or improve the membership flow on existing membership routes where possible.

Primary routes should include or preserve:

    /membership
    /membership/overview
    /membership/remote-business-partner-membership
    /membership/sign-up-now
    /membership/confirmation
    /portal/dashboard

If adding additional frontend-only route paths is needed, prefer nested membership paths such as:

    /membership/onboarding
    /membership/onboarding/confirmation

Do not remove existing routes.

Do not remove legacy compatibility routes.

## Implementation Requirements

Use existing app conventions.

Use Step 8 components, including where appropriate:

    WizardShell
    Stepper
    StepNavigation
    ReviewSubmit
    ConfirmationPanel
    MockSubmissionState
    FormSection
    TextField
    TextAreaField
    SelectField
    CheckboxField
    RadioCardGroup
    SelectableCardGrid
    TermsAcceptance
    PaymentSimulationPanel
    PlanSelectionCard
    OrderSummaryCard
    PortalStatusCard
    StatusBadge

Use the mock membership service:

    getMockMembershipPlans
    submitMockMembershipSignup

The membership sign-up submission must be mock-only.

The payment step must clearly state that no real payment is processed.

The onboarding completion must return a mock confirmation/reference state.

## Suggested Files

Create or update files under existing conventions.

Likely files:

    src/app/pages/MembershipPage.tsx
    src/app/pages/MembershipOverviewPage.tsx
    src/app/pages/MembershipSignUpPage.tsx
    src/app/pages/MembershipConfirmationPage.tsx
    src/app/pages/PortalDashboard.tsx

If the repo already has equivalent page names, use those instead.

You may create a dedicated membership flow component folder if useful:

    src/app/features/membership/
    src/app/features/membership/MembershipPurchaseOnboardingFlow.tsx
    src/app/features/membership/membershipFlow.types.ts

Only create this folder if it fits the existing app structure.

## Mock Data Updates

You may extend:

    src/app/mock/membership.mock.ts
    src/app/mock/billing.mock.ts
    src/app/mock/portal.mock.ts

Only add frontend mock fields needed by the Stitch membership flow.

Do not introduce real backend models.

## Mock Service Updates

You may extend:

    src/app/services/mock/membership.mockService.ts

Only add frontend-only methods if needed, for example:

    submitMockMembershipOnboarding

Mock service responses must use the existing standard response shape.

Do not add fetch calls.

Do not add real APIs.

## Required States

The flow must support visible states for:

    Plan selected
    Form incomplete
    Validation errors
    Mock payment pending
    Mock payment simulated success
    Mock payment simulated failure
    Account created
    Membership active
    Onboarding in progress
    Onboarding complete
    Portal access available

## Documentation Requirement

Create:

    docs/ui/membership-flow-implementation.md
    docs/qa/step-9-membership-flow-checklist.md

The implementation doc should include:

    routes touched
    components used
    mock data used
    mock services used
    Stitch screens referenced
    states implemented
    known placeholders
    deferred items

The QA checklist should include:

    build check
    mock payment check
    no real backend check
    route smoke list
    mobile/tablet/desktop review placeholders

## Smoke Test Routes

Include these in the QA checklist:

    /membership
    /membership/overview
    /membership/remote-business-partner-membership
    /membership/sign-up-now
    /membership/confirmation
    /portal/dashboard

If new onboarding routes are added, include them too.

## Critical Prohibitions

Do not implement:

    Firebase Auth
    Firestore persistence
    Frappe APIs
    real payment processing
    Stripe
    real uploads
    real email sending
    real booking systems
    real marketplace checkout
    real support tickets
    real authentication guards
    real member entitlements
    production backend integrations

Do not commit:

    docs/stitch/_source-zips/
    docs/stitch/_extracted/
    dist/

## Acceptance Criteria

Step 9 is complete when:

    Membership sign-up route renders a polished mock flow.
    User can select a membership plan.
    User can enter mock account/contact/business details.
    User can confirm inclusions.
    User can select mock extras or skip them.
    User can complete mock payment simulation.
    User can review and submit.
    Mock submission uses the mock membership service.
    User sees confirmation with mock reference/status.
    User can continue into onboarding.
    User can complete mock onboarding screens.
    User sees onboarding completion.
    Portal dashboard reflects mock membership state or provides a membership status card.
    No real backend/auth/payment/upload/Frappe logic is introduced.
    docs/ui/membership-flow-implementation.md exists.
    docs/qa/step-9-membership-flow-checklist.md exists.
    npm run build passes.
    dist is removed before commit.
