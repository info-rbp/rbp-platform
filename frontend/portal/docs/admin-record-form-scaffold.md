# Admin Record Form Scaffold

This phase adds a schema-driven admin record form preview.

## What this adds

- `AdminRecordFormPreview`
- Schema-driven field rendering from `adminCrudSchema.ts`
- Read-only preview forms inside `AdminCrudPage`
- Route-to-schema matching for admin sections
- Audit coverage for the record form scaffold

## Why this matters

The admin portal now has the beginning of a reusable form system.

Instead of writing one-off forms for Resources, Offers, Help Center, Membership, Marketplace, and Legal Pages, the form preview reads from the planned CRUD schema and renders the appropriate field layout.

## What is still not implemented

- Real create/edit/delete actions
- Backend persistence
- Validation
- Permissions
- File uploads
- Rich text editing
- Draft/publish workflow
- Audit logging

## Next step

The next phase should introduce local mock create/edit state for low-risk content entities, starting with Resources and Help Center.
