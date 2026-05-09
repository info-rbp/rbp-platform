# Phase 1 Smoke Test

## Purpose

This document records the Phase 1 build, audit, and smoke-test pass.

Step 23 verifies that:

- npm install completes
- npm run audit:phase1 passes
- npm run build passes
- dist is removed before commit
- Major public, portal, admin, and product-flow routes are listed for manual browser review
- No real backend/auth/payment/upload/Frappe logic is introduced

## Validation Commands

Run:

    npm install
    npm run audit:phase1
    npm run build
    rm -rf dist
    git status

## Route Helper

Run:

    node scripts/phase1-smoke-routes.mjs

This prints the route matrix for manual browser review.

## Manual Smoke Groups

### Public Navigation

- /
- /membership
- /membership/overview
- /membership/remote-business-partner-membership
- /offers
- /resources
- /help
- /contact

### Membership Purchase Flow

- /membership/sign-up-now
- /membership/confirmation
- /portal/dashboard

Expected checks:

- Membership flow renders.
- Plan selection is visible.
- Mock payment notice is visible.
- Review/submit/confirmation states are present.
- Portal dashboard can represent membership status.

### Decision Desk Flow

- /on-demand/decision-desk
- /portal/services
- /admin/requests/decision-desk

Expected checks:

- Decision Desk mock wizard renders.
- Review and submit state exists.
- Confirmation/status state exists.
- Portal/admin handoff is represented.

### DocuShare Flow

- /document-nucleus/overview
- /document-nucleus/brief
- /document-nucleus/category/templates
- /document-nucleus/product/template-policy-001
- /portal/documents
- /admin/requests/docushare

Expected checks:

- Document Nucleus public pages render.
- DocuShare brief flow renders.
- Mock upload notice is visible.
- Review/submit/confirmation/status states are present.

### Marketplace Flow

- /marketplace
- /marketplace/product/market-001
- /marketplace/enquiry/market-001
- /marketplace/listing/new
- /admin/marketplace

Expected checks:

- Marketplace browse renders.
- Listing detail renders.
- Buyer enquiry flow renders.
- Seller listing flow renders.
- Mock upload/payment/admin review states are visible.

### Connectivity Flow

- /operations/connectivity
- /operations/connectivity/nbn-phone
- /operations/connectivity/superloop
- /operations/superloop
- /portal/services
- /admin/requests/connectivity

Expected checks:

- Connectivity order flow renders.
- Serviceability simulation is clear.
- Plan/hardware/mock payment states are present.
- Confirmation/provisioning status is visible.

### Risk Advisor Flow

- /on-demand/risk-advisor
- /portal/services
- /admin/requests/risk-advisor

Expected checks:

- Risk Advisor flow renders.
- Mock score preview is visible.
- Review/submit/confirmation/status states are present.

### The Fixer Flow

- /on-demand/the-fixer
- /portal/services
- /admin/requests/fixer

Expected checks:

- The Fixer request flow renders.
- Urgency/impact/supporting information states are visible.
- Mock upload notice is visible.
- Review/submit/confirmation/triage states are present.

### Portal Dashboard and Status Views

- /portal/dashboard
- /portal/services
- /portal/documents
- /portal/offers
- /portal/apps
- /portal/resources
- /portal/support
- /portal/settings

Expected checks:

- Portal shell renders.
- Cards stack responsively.
- Status cards are visible.
- Mock-only states are clear.

### Admin Review Concepts

- /admin/dashboard
- /admin/content
- /admin/requests
- /admin/marketplace
- /admin/membership
- /admin/audit-review
- /admin/settings

Expected checks:

- Admin concept shell renders.
- Queue cards render.
- Tables or review lists render.
- Mock admin action states are visible.
- No real admin auth or persistence exists.

### Legal and Fallback

- /legal/privacy-policy
- /legal/terms-of-use
- /legal/payment-policy
- /not-a-real-route

Expected checks:

- Legal pages render or intentionally redirect.
- Unknown route shows a safe fallback or not-found state.

## Build Result

Record after running commands:

    npm install: Passed
    npm run audit:phase1: Passed
    npm run build: Passed
    dist removed: Passed
    final git status clean: To be confirmed after commit

## Known Allowed Warning

The existing Vite large chunk warning is acceptable unless it becomes a build failure.

## Safety Confirmation

Step 23 must not introduce:

- Real backend logic
- Real authentication
- Real payment processing
- Real uploads
- Real Frappe APIs
- Real marketplace checkout
- Real support ticketing
- Real email sending
- Real carrier serviceability
- Real advisor assignment

## Result

Status:

    Audit and build passed. Manual browser smoke testing remains documented in the route matrix.
