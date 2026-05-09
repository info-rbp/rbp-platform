# Admin Offers Mock CRUD

This phase adds local mock CRUD support for Offers.

## Enabled section

- Offers

## Route coverage

- `/admin/offers`
- `/admin/offers/*`

## What this adds

- Local mock CRUD for public offer records
- Reuse of `useAdminLocalCrud`
- Create, edit, and delete behaviour for offer content
- Category selection using `offerCategoryFilters`
- Offer type selection for exclusive, top, and standard offers
- In-memory-only state for partner and offer content

## Why this matters

Offers are a commercial content area. This mock CRUD phase allows the admin experience to be shaped before adding backend persistence, partner records, expiry logic, redemption tracking, member visibility, or approval workflows.

## What this does not add

- Firebase persistence
- Backend collections
- Partner management
- Redemption tracking
- Offer expiry automation
- Member-only visibility rules
- Commercial approval workflows
- Role-based permissions
- Audit logs

## Next step

After this phase, the next practical step is adding local mock CRUD for Marketplace, because marketplace listings are the next commercial content area and require more structure before backend work begins.
