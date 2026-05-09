# Step 7: Build the Mock API Simulation Layer

## Goal

Create a frontend-only mock API simulation layer for Phase 1 UI/UX Completion.

The mock API layer sits between UI flows and central mock data. It simulates request/response behaviour without connecting to real backend services.

## Scope

This is frontend-only.

Do not implement:

- Firebase Auth
- Firestore persistence
- Frappe APIs
- Real payment processing
- Real uploads
- Real email sending
- Real booking systems
- Real marketplace checkout
- Real support tickets
- Real backend integrations

## Mock Services

The mock service layer lives under:

    src/app/services/mock/

Created services:

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

## Simulated Endpoints

The services simulate:

    GET  /mock/me
    GET  /mock/membership/plans
    POST /mock/membership/signup
    POST /mock/decision-desk/request
    POST /mock/docushare/brief
    POST /mock/marketplace/listing
    POST /mock/marketplace/enquiry
    POST /mock/connectivity/serviceability
    POST /mock/connectivity/order
    POST /mock/risk-advisor/assessment
    POST /mock/fixer/request
    GET  /mock/portal/dashboard
    GET  /mock/portal/notifications
    GET  /mock/admin/review-queues
    POST /mock/admin/review-action

## Completion Criteria

Step 7 is complete when:

- Mock service files exist under src/app/services/mock.
- Mock services use src/app/mock data.
- Mock services return standard response envelopes.
- Mock services simulate loading, validation failure, success, references, and statuses.
- No real backend/Firebase/Frappe/payment/upload logic is introduced.
- npm run build passes.
- dist/ is removed before commit.
