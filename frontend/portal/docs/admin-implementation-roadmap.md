# Admin Implementation Roadmap

## Phase 1: Admin content model foundation

Create the entity map between public static data and future admin-managed records.

Deliverables:

- `src/app/data/adminContentModel.ts`
- `docs/admin-content-model.md`
- `docs/admin-implementation-roadmap.md`
- `scripts/audit-admin-content-model.mjs`
- `npm run audit:admin-content-model`

## Phase 2: Admin data schema design

Define the backend schema for:

- Pages
- Navigation
- Services
- Applications
- Operations
- Marketplace listings
- Membership plans
- Offers
- Resources
- Help articles
- Legal pages
- Media/files
- Audit logs

## Phase 3: Admin CRUD scaffolding

Create admin CRUD screens for low-risk entities first:

1. Business Categories
2. Resources
3. Help Center
4. Offers
5. Applications
6. Services
7. Marketplace
8. Membership
9. Legal Pages

## Phase 4: Backend integration

Connect admin CRUD screens to Firebase or the chosen backend layer.

Required backend concerns:

- Authentication
- Role-based access control
- Draft/publish workflow
- Validation
- Audit logs
- File storage
- Search/indexing
- Slug management

## Phase 5: Member portal integration

Only after admin content management is stable, connect selected entities to the member portal:

- Member-only resources
- Member offers
- Support requests
- Service requests
- Membership usage
- Documents
- Applications
- Sessions

## Phase 6: Final public launch QA

Before launch:

- Run public audit
- Run admin model audit
- Run build
- Test route navigation
- Test query filters
- Test anchor links
- Test legal pages
- Test Firebase hosting rewrites
