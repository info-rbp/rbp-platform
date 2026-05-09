# Backend Collection Contracts

This document defines the planned backend collection contracts before Firebase implementation begins.

## Purpose

The frontend admin portal now has local mock CRUD coverage for the public content areas. The next step is to define the backend collection contracts so Firebase work can be implemented deliberately instead of turning into a haunted cabinet of undocumented collections.

## What this phase adds

- `src/app/data/backendCollectionContracts.ts`
- Collection IDs and Firestore collection names
- Field contracts
- Required fields
- Public readability
- Admin writability
- Sensitive-field flags
- Index planning
- Workflow rules
- Access role planning
- Migration notes
- Firebase notes
- Audit coverage

## Collections defined

### Phase 1 Foundation

These should be implemented first.

- `businessCategories`
- `resources`
- `helpArticles`
- `applications`
- `services`
- `operations`

These are lower-risk content collections and should establish the CRUD, validation, publishing, and audit patterns.

### Phase 2 Commercial

These should come after the low-risk content backend pattern is stable.

- `offers`
- `marketplaceListings`

These involve commercial content, partners, suppliers, pricing, offers, expiry, media, and potential member-only visibility.

### Phase 3 Membership

This comes after commercial content contracts are stable.

- `membershipPages`

Membership introduces pricing, payment expectations, access rules, and member-facing content.

### Phase 4 Governance

This should be implemented with tighter permissions and audit logging.

- `legalPages`

Legal content requires versioning, approval workflow, restricted permissions, and audit history.

### Platform Support

These support the rest of the backend.

- `mediaAssets`
- `auditLogs`
- `adminUsers`

## Recommended backend implementation order

1. `businessCategories`
2. `resources`
3. `helpArticles`
4. `applications`
5. `services`
6. `operations`
7. `mediaAssets`
8. `offers`
9. `marketplaceListings`
10. `membershipPages`
11. `auditLogs`
12. `adminUsers`
13. `legalPages`

## Firebase implementation notes

### Firestore

Use Firestore collections matching the `collectionName` property in `backendCollectionContracts`.

### Firebase Auth

Use Firebase Auth for identity. Use either custom claims or an `adminUsers` collection for admin roles.

### Firebase Storage

Use Firebase Storage for media assets. Store file metadata in `mediaAssets`.

### Security rules

Security rules should enforce:

- Public reads only for published public-safe records
- Admin writes only for authenticated admin roles
- Commercial writes restricted to commercial-admin or admin roles
- Legal writes restricted to legal-admin and super-admin roles
- Audit logs restricted to system writes and super-admin reads
- Admin role changes restricted to super-admin

### Audit logging

Audit logging should be required for:

- Creates
- Updates
- Archive/delete actions
- Publish actions
- Approval actions
- Permission changes
- Legal content changes
- Membership pricing changes
- Offer and marketplace publishing

## What this phase does not implement

- Firebase connection
- Firestore queries
- Security rules
- Firebase Auth
- Firebase Storage
- Backend CRUD services
- Server-side validation
- Admin role enforcement
- Audit log writes

## Next step

After this phase, the next practical step is creating a Firebase backend implementation plan covering:

- Firestore collection structure
- Security rules
- Admin roles
- Draft/publish workflow
- Audit logging
- Storage buckets
- Migration/seeding order

## security

This section exists to make the security requirements explicit for audit coverage.

Security planning must cover:

- public read access
- member read access
- admin write access
- commercial admin permissions
- legal admin permissions
- super-admin restricted actions
- Firestore rules
- Firebase Auth role mapping
- audit logging requirements
