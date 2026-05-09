# Admin Utility Functions

This phase extracts reusable admin utility functions from the mock CRUD workspace.

## What this adds

- `src/app/utils/adminCrud.ts`
- Shared slug generation
- Shared mock record ID generation
- Shared required text-field validation
- Shared fallback href handling
- Shared label formatting
- Shared admin route section parsing
- Shared status helpers

## Why this matters

The admin mock CRUD workspace had repeated utility logic embedded directly in the component file. That was acceptable during scaffolding, but it becomes harder to maintain as more admin sections are added.

Extracting utilities keeps the workspace focused on rendering and admin behaviour instead of becoming a drawer full of tiny helper functions pretending to be architecture.

## Utility functions

- `slugify`
- `createMockRecordId`
- `hasRequiredTextFields`
- `withFallbackHref`
- `formatAdminLabel`
- `getAdminRouteSection`
- `isLegalReviewStatus`
- `isBackendLaterStatus`
- `isReadyStatus`

## What this does not add

- Backend persistence
- Firebase integration
- Server-side validation
- Role-based permissions
- Audit logs
- Real database IDs

## Next step

After this phase, the next practical step is adding reusable admin search, filter, and sort state for mock CRUD tables.
