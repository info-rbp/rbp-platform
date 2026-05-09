# Admin Marketplace Mock CRUD

This phase adds local mock CRUD support for Marketplace.

## Enabled section

- Marketplace

## Route coverage

- `/admin/marketplace`
- `/admin/marketplace/*`

## What this adds

- Local mock CRUD for marketplace listing records
- Reuse of `useAdminLocalCrud`
- Create, edit, and delete behaviour for marketplace content
- Listing type selection for RBP products, RBP assets, third-party products, third-party assets, services, and process content
- Supplier name field
- Price/display price field
- Enquiry required field
- In-memory-only state for marketplace listing content

## Why this matters

Marketplace is a commercial content area with more structure than simple public content. This mock CRUD phase allows the admin experience to be shaped before adding backend persistence, supplier records, media uploads, pricing logic, approval workflows, enquiry tracking, or listing moderation.

## What this does not add

- Firebase persistence
- Backend collections
- Supplier management
- Media uploads
- Product detail pages
- Listing approval workflows
- Payment workflows
- Marketplace enquiries
- Role-based permissions
- Audit logs

## Next step

After this phase, the next practical step is adding local mock CRUD for Membership, because membership introduces pricing, inclusions, access, payment terms, and member-facing content.
