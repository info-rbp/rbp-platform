# Admin CRUD Implementation Plan

## Current position

The repository now has:

- Public sitemap
- Public navigation
- Public static content data
- Public content readiness audit
- Admin content model
- Admin content model audit
- Admin CRUD schema planning

## Recommended implementation order

Build low-risk CRUD areas before high-risk commercial or legal workflows.

## Phase 1: Low-risk content CRUD

Start with:

1. Business Categories
2. Resources
3. Help Center
4. Applications
5. Services

These are relatively safe because they mostly involve content and taxonomy.

## Phase 2: Commercial CRUD

Then build:

1. Offers
2. Marketplace
3. Membership

These need extra care because they touch partners, pricing, member visibility, redemptions, listings, and payment-related logic.

## Phase 3: Legal CRUD

Build legal page management last, with:

- Version history
- Approval status
- Effective dates
- Restricted permissions
- Audit logs

## Phase 4: Backend persistence

Backend design should include:

- Firestore or selected database collections
- Validation
- Slug uniqueness
- Draft and published states
- Role-based access
- Audit logs
- File/media storage
- Search/indexing

## Phase 5: Member portal linkage

Once admin-managed records exist, selected content can power the member portal:

- Member-only resources
- Member-only offers
- Service requests
- Support requests
- Documents
- Sessions
- Applications
- Membership usage

## Do not build yet

Do not implement payments, live member permissions, partner redemption tracking, or legal approval workflows until the basic CRUD foundation works.
