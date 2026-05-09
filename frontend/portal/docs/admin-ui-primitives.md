# Admin UI Primitives

This phase introduces reusable admin interface primitives.

## Components added

- `AdminPageHeader`
- `AdminStatCard`
- `AdminStatusBadge`
- `AdminEmptyState`
- `AdminTable`
- `AdminFormShell`
- `AdminFieldRenderer`

## Purpose

The admin portal now has reusable UI building blocks for CRUD pages. These components provide a consistent layout foundation before backend persistence, live forms, permissions, and Firebase integration are implemented.

## Refactored page

`src/app/pages/admin/AdminCrudPage.tsx` now uses the shared primitives instead of carrying local table, status, and stats UI directly inside the page.

## Not included yet

This phase does not implement:

- Real create/edit/delete actions
- Firebase persistence
- Form validation
- File uploads
- Role-based permissions
- Draft/publish workflows
- Audit logging

## Next step

The next phase should introduce a reusable admin record form scaffold using `AdminFormShell` and `AdminFieldRenderer`, then connect it to the planned CRUD schema.
