# Admin Applications and Services Mock CRUD

This phase expands local mock CRUD support beyond Resources and Help Center.

## Enabled sections

- Applications
- Services
- On-Demand Services
- Managed Services

## What this adds

- Local mock CRUD for application catalogue records
- Local mock CRUD for combined service records
- Reuse of `useAdminLocalCrud`
- Continued in-memory-only create, edit, and delete behaviour

## Why this matters

The admin portal now has mock CRUD coverage for the core low-risk content catalogue areas before backend persistence is introduced.

## What this does not add

- Firebase persistence
- Backend collections
- Server validation
- Authentication changes
- Role-based permissions
- File uploads
- Audit logs
- Draft/publish persistence

## Next step

After this phase, the next step should be preparing backend collection contracts for Resources, Help Center, Applications, and Services.
