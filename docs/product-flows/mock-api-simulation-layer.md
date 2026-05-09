# Phase 1 Mock API Simulation Layer

## Purpose

The mock API simulation layer provides frontend-only request/response behaviour for Phase 1 UI/UX Completion.

It is designed to make major product journeys feel complete without relying on real backend services.

## Location

    src/app/services/mock/

## Files

    mockClient.ts
    membership.mockService.ts
    decisionDesk.mockService.ts
    docushare.mockService.ts
    marketplace.mockService.ts
    connectivity.mockService.ts
    riskAdvisor.mockService.ts
    fixer.mockService.ts
    portal.mockService.ts
    admin.mockService.ts
    index.ts

## Standard Response Shape

Every mock service returns:

    ok
    data
    message
    errors
    meta

The meta object includes:

    requestId
    timestamp
    mockEndpoint
    simulated

## Covered Product Areas

    Membership purchase simulation
    Decision Desk request simulation
    DocuShare brief simulation
    Marketplace enquiry simulation
    Marketplace listing simulation
    Connectivity serviceability simulation
    Connectivity order simulation
    Risk Advisor assessment simulation
    The Fixer request simulation
    Portal dashboard simulation
    Admin review queue simulation

## Phase 1 Rule

This layer must remain frontend-only.

Do not add:

    fetch calls
    Firebase calls
    Firestore writes
    Frappe API calls
    Stripe/payment calls
    real file uploads
    real auth logic
    production backend integrations
