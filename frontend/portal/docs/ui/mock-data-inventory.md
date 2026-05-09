# Phase 1 Mock Data Inventory

## Purpose

This document records the central mock data layer created for Phase 1 UI/UX Completion.

Mock data is stored under:

    src/app/mock/

The mock data layer is frontend-only and must not connect to real backend services.

## Files

    src/app/mock/types.mock.ts
    src/app/mock/user.mock.ts
    src/app/mock/membership.mock.ts
    src/app/mock/decisionDesk.mock.ts
    src/app/mock/docushare.mock.ts
    src/app/mock/marketplace.mock.ts
    src/app/mock/connectivity.mock.ts
    src/app/mock/riskAdvisor.mock.ts
    src/app/mock/fixer.mock.ts
    src/app/mock/portal.mock.ts
    src/app/mock/admin.mock.ts
    src/app/mock/documents.mock.ts
    src/app/mock/billing.mock.ts
    src/app/mock/notifications.mock.ts
    src/app/mock/public.mock.ts
    src/app/mock/applications.mock.ts
    src/app/mock/resources.mock.ts
    src/app/mock/offers.mock.ts
    src/app/mock/index.ts

## Covered Areas

    Public website
    Membership
    Decision Desk
    DocuShare / Document Nucleus
    Marketplace
    Connectivity / NBN
    Risk Advisor
    The Fixer
    Portal dashboard
    Admin review concepts
    Documents
    Billing simulation
    Notifications
    Applications
    Offers
    Resources

## Phase 1 Rule

This mock data must remain frontend-only.

Do not add:

    Firebase Auth
    Firestore writes
    Frappe API calls
    Real payment processing
    Real file uploads
    Real email sending
    Real backend integrations
