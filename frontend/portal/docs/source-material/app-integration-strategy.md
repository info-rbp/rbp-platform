# App Integration Strategy

## Purpose

This document records Phase 1 integration strategy notes for the Remote Business Partner application.

Phase 1 remains frontend-only. Integration work is deferred to Phase 2 and later.

## Phase 1 Rule

The application must simulate flows without depending on real backend services.

Phase 1 must not implement:

- Firebase Auth
- Firestore persistence
- Frappe APIs
- Real payment processing
- Real file uploads
- Real carrier APIs
- Real marketplace checkout
- Real support ticketing
- Real email sending
- Real admin permissions

## Current Frontend Integration Pattern

Phase 1 uses:

- Central mock data under src/app/mock
- Mock API simulation under src/app/services/mock
- Reusable flow components under src/app/components
- Feature-level flow components under src/app/features
- Route-level pages under src/app/pages
- Documentation under docs/ui, docs/qa, docs/implementation, and docs/source-material

## Future Phase 2 Integration Direction

Phase 2 should use the completed frontend flows to plan backend contracts.

Backend planning should cover:

- Flow-to-endpoint mapping
- Request/response schemas
- Frappe DocTypes
- Workflow states
- Admin actions
- Portal status mapping
- Payment state modelling
- Upload/file storage assumptions
- Notification triggers
- Permission and role assumptions
- Audit trail expectations

## Integration Boundaries

Frontend flows should remain backend-agnostic until Phase 2 contracts are documented.

Mock services should be treated as contract prototypes, not production APIs.

## External Files Rule

External files should be converted into:

- Source-material notes
- Approved assets
- Mock seed data
- Phase 2 planning documentation

Raw external files should not be committed unless explicitly approved.
