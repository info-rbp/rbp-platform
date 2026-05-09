# Admin Table Controls

This phase adds reusable search, filter, and sort state for admin mock CRUD tables.

## What this adds

- `useAdminTableControls`
- `AdminTableControls`
- Search input for mock CRUD records
- Status filtering
- Category/type filtering
- Sort option selection
- Sort direction toggle
- Reset controls action
- Result count display

## Where it is used

`AdminMockCrudWorkspace` now applies shared table controls before rendering mock CRUD tables.

The controls are designed to work across:

- Resources
- Help Center
- Applications
- Services
- Operations
- Offers
- Marketplace
- Membership
- Legal Pages

## Why this matters

Mock CRUD sections now behave more like real admin lists. This makes the frontend admin experience easier to test before Firebase persistence, backend queries, permissions, and server-side validation are introduced.

## What this does not add

- Backend search
- Firestore query filters
- Server-side sorting
- Pagination
- Saved views
- Role-based filtering
- Audit logs

## Next step

After this phase, the next practical step is defining backend collection contracts for the low-risk entities first.
