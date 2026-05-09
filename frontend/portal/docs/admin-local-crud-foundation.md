# Admin Local CRUD Foundation

This phase extracts reusable local CRUD behaviour from the admin mock CRUD workspace.

## What this adds

- `useAdminLocalCrud`
- Generic local record state
- Generic editing state
- Generic draft update handling
- Generic save behaviour
- Generic delete behaviour
- Generic reset behaviour

## What this changes

`AdminMockCrudWorkspace` now uses `useAdminLocalCrud` for Resources and Help Center instead of duplicating create, edit, delete, and reset state logic inside each section.

## Why this matters

The admin portal can now reuse the same local CRUD foundation when adding more mock admin areas, such as Applications, Services, Offers, and Marketplace.

## What is still not implemented

- Backend persistence
- Firebase integration
- Real validation schemas
- Server-side permissions
- File uploads
- Draft/publish persistence
- Audit logging

## Next step

The next phase should add local mock CRUD support for Applications and Services using the same hook.
