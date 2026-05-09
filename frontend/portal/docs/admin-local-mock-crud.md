# Admin Local Mock CRUD

This phase adds local mock create, edit, and delete behaviour for low-risk admin content areas.

## Enabled sections

- Resources
- Help Center

## What this adds

- `AdminMockCrudWorkspace`
- Local in-memory create/edit/delete state
- Resource mock CRUD table and form
- Help Center mock CRUD table and form
- Integration into `AdminCrudPage`

## What this does not add

- Firebase persistence
- Backend collections
- Real validation
- Authentication changes
- Role-based permissions
- File uploads
- Audit logs
- Draft/publish persistence

## Why Resources and Help Center first

Resources and Help Center are low-risk content areas. They do not involve payments, legal approval, partner offer redemption, marketplace listings, or member entitlements.

## Next step

After this phase, the next step should be extracting the local CRUD behaviour into reusable hooks and utilities before connecting any backend.
