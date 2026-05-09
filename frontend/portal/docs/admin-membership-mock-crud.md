# Admin Membership Mock CRUD

This phase adds local mock CRUD support for Membership.

## Enabled section

- Membership

## Route coverage

- `/admin/membership`
- `/admin/membership/*`

## What this adds

- Local mock CRUD for membership content records
- Reuse of `useAdminLocalCrud`
- Create, edit, and delete behaviour for membership pages
- Membership page type selection
- Plan name field
- Price/display price field
- Billing period field
- Requires payment field
- Member visibility field
- Legal-review-aware status support
- In-memory-only state for membership content

## Why this matters

Membership introduces pricing, inclusions, access rules, payment terms, member-facing content, and sign-up workflows. This mock CRUD phase allows the admin experience to be shaped before adding backend persistence, payments, member entitlements, or access control.

## What this does not add

- Firebase persistence
- Backend collections
- Payment integration
- Member entitlement logic
- Sign-up workflow
- Billing automation
- Role-based permissions
- Audit logs
- Legal approval workflows

## Next step

After this phase, the next practical step is adding local mock CRUD for Legal Pages, because legal content needs versioning, effective dates, approval status, and stricter admin controls.
