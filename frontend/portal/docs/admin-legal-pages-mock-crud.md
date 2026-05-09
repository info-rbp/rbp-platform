# Admin Legal Pages Mock CRUD

This phase adds local mock CRUD support for Legal Pages.

## Enabled section

- Legal Pages

## Route coverage

- `/admin/site-content/legal`
- `/admin/site-content/legal/*`
- `/admin/legal`
- `/admin/legal/*`

## What this adds

- Local mock CRUD for legal page records
- Reuse of `useAdminLocalCrud`
- Create, edit, and delete behaviour for legal content
- Policy type selection
- Effective date field
- Version field
- Approval status field
- Approved by field
- Approved at field
- Legal-review-aware status support
- In-memory-only state for legal content

## Why this matters

Legal content needs tighter controls than ordinary content. This mock CRUD phase allows the admin experience to be shaped before adding backend persistence, version history, restricted permissions, legal approval workflows, audit logs, or publication controls.

## What this does not add

- Firebase persistence
- Backend collections
- Legal version history
- Approval workflow enforcement
- Role-based legal permissions
- Publication locking
- Audit logs
- Legal sign-off automation

## Next step

After this phase, the next practical step is extracting shared admin mock CRUD utilities and preparing backend collection contracts for the low-risk entities first.
