# Step 10: Portal/Dashboard Mock Experience

## Goal

Implement the Phase 1 portal/dashboard mock experience using the existing React/Vite app structure, the Step 8 reusable components, Step 6 mock data, Step 7 mock services, and the Google Stitch RBP Application Portals workflow reference.

This is a frontend-only implementation.

## Current Branch

Work only on:

    feature/step-10-portal-dashboard-mock-experience

Do not work directly on main, develop, or phase/phase-1-uiux-completion.

## Important Scope Control

The RBP Application Portals Stitch export contains a large number of screens.

Do not implement every screen.

Use the Stitch export as visual and UX reference material to create a polished Phase 1 portal shell and dashboard experience.

The goal is a credible mock portal experience, not a complete ERP, CRM, HRIS, LMS, CMS, helpdesk, file manager, analytics suite, payments product, and admin platform all at once. That way lies the swamp.

## Source References

Use these files as references:

    docs/stitch/workflow-screen-map.md
    docs/stitch/component-patterns.md
    docs/stitch/stitch-to-phase-map.md
    docs/stitch/stitch-source-inventory.md
    docs/ui/reusable-flow-component-inventory.md
    docs/ui/mock-data-inventory.md
    docs/ui/mock-api-simulation-layer.md
    docs/ui/membership-flow-implementation.md

Use the local-only extracted Stitch reference if available:

    docs/stitch/_extracted/RBP Application Portals (3)/

Do not commit anything from:

    docs/stitch/_source-zips/
    docs/stitch/_extracted/

## Relevant Existing Infrastructure

Use reusable components from:

    src/app/components/flow/
    src/app/components/forms/
    src/app/components/domain/
    src/app/components/status/

Use mock data from:

    src/app/mock/portal.mock.ts
    src/app/mock/user.mock.ts
    src/app/mock/membership.mock.ts
    src/app/mock/documents.mock.ts
    src/app/mock/notifications.mock.ts
    src/app/mock/decisionDesk.mock.ts
    src/app/mock/docushare.mock.ts
    src/app/mock/marketplace.mock.ts
    src/app/mock/connectivity.mock.ts
    src/app/mock/riskAdvisor.mock.ts
    src/app/mock/fixer.mock.ts
    src/app/mock/offers.mock.ts
    src/app/mock/resources.mock.ts
    src/app/mock/applications.mock.ts

Use mock services from:

    src/app/services/mock/portal.mockService.ts
    src/app/services/mock/membership.mockService.ts
    src/app/services/mock/admin.mockService.ts

## Routes to Review and Update

Review existing routes before making changes:

    src/app/routes.tsx

Update existing portal routes where possible.

Required portal routes:

    /portal/dashboard
    /portal/services
    /portal/documents
    /portal/offers
    /portal/apps
    /portal/resources
    /portal/support
    /portal/settings

Preserve existing routes.

Do not remove existing routes.

Do not add real auth guards.

Do not require real login.

## Required Portal Experience

Create a polished mock portal/dashboard experience covering:

    Member welcome state
    Membership status
    Active service requests
    Recent submissions
    Documents activity
    Marketplace activity
    Connectivity order status
    Risk Advisor status
    The Fixer status
    Notifications
    Recommended next actions
    Application access tiles
    Offer cards
    Resource cards
    Support/help states
    Settings/profile mock state

## Page Expectations

### /portal/dashboard

Should show:

    welcome header
    mock member/business identity
    membership status card
    active request summary cards
    notification panel
    quick actions
    recent activity
    recommended next steps
    portal status cards for major Phase 1 flows

Use components such as:

    PortalStatusCard
    StatusBadge
    EntitlementBadge
    OrderSummaryCard
    ConfirmationPanel where appropriate

### /portal/services

Should show:

    active service requests
    Decision Desk request status
    DocuShare brief status
    Connectivity order status
    Risk Advisor assessment status
    The Fixer request status
    empty state if no records
    CTA links to start public/mock flows

Suggested CTAs:

    /on-demand/decision-desk
    /document-nucleus/overview
    /operations/connectivity
    /on-demand/risk-advisor
    /on-demand/the-fixer

### /portal/documents

Should show:

    mock documents
    document status
    mock file placeholders
    no live upload messaging
    document-related CTAs

Do not implement real file upload.

### /portal/offers

Should show:

    mock partner/member offers
    offer categories
    eligibility/entitlement style badges
    links back to /offers

Do not implement real offer redemption.

### /portal/apps

Should show:

    application tiles
    entitlement/access states
    available/planned/locked/coming soon states
    mock access request CTA

Do not implement real app provisioning.

### /portal/resources

Should show:

    mock resources
    resource type/category chips
    links to /resources
    empty/search placeholder states if useful

Do not implement real downloads requiring backend permission.

### /portal/support

Should show:

    support cards
    knowledge base cards
    mock support request status
    links to /help?section=support

Do not implement real support tickets.

### /portal/settings

Should show:

    mock profile/business details
    membership account summary
    notification preferences
    mock save confirmation or frontend-only state

Do not implement real account changes.

## Shared Layout

If a portal layout/sidebar/header component already exists, use it.

If not, create a simple reusable portal layout, for example:

    src/app/components/portal/PortalLayout.tsx
    src/app/components/portal/PortalSidebar.tsx
    src/app/components/portal/PortalHeader.tsx

Only create these if they fit the existing codebase.

Keep the portal layout frontend-only.

## Suggested Files

Likely files to update:

    src/app/pages/portal/PortalDashboard.tsx
    src/app/pages/portal/PortalServices.tsx
    src/app/pages/portal/PortalDocuments.tsx
    src/app/pages/portal/PortalOffers.tsx
    src/app/pages/portal/PortalApps.tsx
    src/app/pages/portal/PortalResources.tsx
    src/app/pages/portal/PortalSupport.tsx
    src/app/pages/portal/PortalSettings.tsx

Possible files to create:

    src/app/features/portal/PortalDashboardExperience.tsx
    src/app/features/portal/PortalServicesExperience.tsx
    src/app/features/portal/PortalDocumentsExperience.tsx
    src/app/features/portal/PortalAppsExperience.tsx
    src/app/features/portal/PortalSupportExperience.tsx
    src/app/features/portal/portalExperience.types.ts

Only create a feature folder if it improves organisation and matches the existing project direction.

## Mock Data Updates

You may extend:

    src/app/mock/portal.mock.ts
    src/app/mock/documents.mock.ts
    src/app/mock/notifications.mock.ts
    src/app/mock/applications.mock.ts
    src/app/mock/offers.mock.ts
    src/app/mock/resources.mock.ts

Only add frontend mock fields needed for the portal experience.

Do not introduce real backend models.

## Mock Service Updates

You may extend:

    src/app/services/mock/portal.mockService.ts

Only add frontend-only mock methods if needed.

Mock service responses must use the existing standard response shape.

Do not add fetch calls.

Do not add real APIs.

## Required States

The portal should visibly support:

    active membership
    pending membership
    no membership / guest-like fallback
    active requests
    no active requests
    submitted requests
    in review
    outcome ready
    documents available
    no documents
    apps available
    apps locked
    apps coming soon
    notifications present
    no notifications
    mock settings saved

## Documentation Requirement

Create:

    docs/ui/portal-dashboard-implementation.md
    docs/qa/step-10-portal-dashboard-checklist.md

The implementation doc should include:

    routes touched
    components used
    mock data used
    mock services used
    Stitch screens/patterns referenced
    states implemented
    known placeholders
    deferred items

The QA checklist should include:

    build check
    no real auth check
    no real backend check
    no real upload check
    no real support ticket check
    no real app provisioning check
    route smoke list
    mobile/tablet/desktop review placeholders

## Smoke Test Routes

Include these in the QA checklist:

    /portal/dashboard
    /portal/services
    /portal/documents
    /portal/offers
    /portal/apps
    /portal/resources
    /portal/support
    /portal/settings

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

Step 10 is complete when:

    Portal dashboard route renders a polished mock dashboard.
    Portal services route renders mock request/status experience.
    Portal documents route renders mock document activity.
    Portal offers route renders mock offer/member value experience.
    Portal apps route renders mock app access/entitlement experience.
    Portal resources route renders mock resource experience.
    Portal support route renders mock help/support experience.
    Portal settings route renders mock profile/settings experience.
    Portal pages use central mock data or mock services.
    Portal pages use reusable Step 8 components where appropriate.
    No real auth/backend/payment/upload/Frappe logic is introduced.
    docs/ui/portal-dashboard-implementation.md exists.
    docs/qa/step-10-portal-dashboard-checklist.md exists.
    npm run build passes.
    dist is removed before commit.
