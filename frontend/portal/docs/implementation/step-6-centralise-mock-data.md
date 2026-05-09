# Step 6: Centralise Mock Data

## Goal

Create a central mock data foundation for Phase 1 UI/UX Completion.

This step creates frontend-only mock data files that can be used by public pages, portal screens, admin concepts, and future mock service simulations.

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

## Deliverables

Mock data is centralised under:

    src/app/mock/

The mock data layer includes:

    user.mock.ts
    membership.mock.ts
    decisionDesk.mock.ts
    docushare.mock.ts
    marketplace.mock.ts
    connectivity.mock.ts
    riskAdvisor.mock.ts
    fixer.mock.ts
    portal.mock.ts
    admin.mock.ts
    documents.mock.ts
    billing.mock.ts
    notifications.mock.ts
    public.mock.ts
    applications.mock.ts
    resources.mock.ts
    offers.mock.ts
    types.mock.ts
    index.ts

## Completion Criteria

Step 6 is complete when:

- Mock data files exist under src/app/mock.
- Shared mock types exist.
- Mock data is frontend-only.
- No backend/Firebase/Frappe/payment/upload logic is introduced.
- npm run build passes.
- dist/ is removed before commit.
