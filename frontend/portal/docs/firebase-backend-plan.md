# Firebase Backend Implementation Plan

This document plans the Firebase backend implementation before any Firebase SDK, Firestore reads, Firestore writes, Firebase Auth, Firebase Storage, or security rules are connected.

## Purpose

The frontend currently has public content pages, admin scaffolding, local mock CRUD, table controls, utility helpers, and backend collection contracts.

The next backend step is to define how Firebase will be introduced safely.

## Backend implementation principles

1. Start with low-risk content collections.
2. Do not connect payments, legal approval, marketplace workflows, or membership entitlements first.
3. Use Firestore for structured content.
4. Use Firebase Auth for identity.
5. Use Firebase Storage for media assets.
6. Use Firestore security rules for direct client access.
7. Use Cloud Functions later for trusted system actions.
8. Use audit logs for admin changes before restricted workflows go live.
9. Archive records instead of deleting them wherever possible.
10. Keep public reads limited to published public-safe records.

## Firebase services

### Firestore

Firestore will store:

- business categories
- resources
- help center articles
- applications
- services
- operations
- offers
- marketplace listings
- membership pages
- legal pages
- media metadata
- audit logs
- admin user metadata

### Firebase Auth

Firebase Auth will handle:

- admin login
- user identity
- member identity later
- password reset flows
- account disablement

Admin authorization should be layered on top of Firebase Auth using either:

- custom claims, or
- an `adminUsers` Firestore collection, or
- a hybrid approach using both

Recommended first implementation:

- Firebase Auth for login
- `adminUsers` collection for role metadata
- custom claims later if server-enforced role performance becomes necessary

### Firebase Storage

Firebase Storage will store:

- resource downloads
- marketplace listing images
- marketplace listing documents
- service collateral
- future media assets

Storage metadata should be stored in Firestore under `mediaAssets`.

## Implementation phases

### Phase 1: Foundation content backend

Implement these first:

1. `businessCategories`
2. `resources`
3. `helpArticles`
4. `applications`
5. `services`
6. `operations`

Why these first:

- lower risk
- mostly public content
- no payment logic
- no legal approval
- no marketplace supplier workflows
- good place to prove CRUD, validation, publishing, and audit patterns

### Phase 2: Admin identity and audit logging

Implement:

1. Firebase Auth admin login
2. `adminUsers`
3. `auditLogs`

Why this comes before commercial/legal workflows:

- restricted actions need audit history
- role-based permissions need a source of truth
- publish/approval actions need traceability

### Phase 3: Commercial content

Implement:

1. `offers`
2. `marketplaceListings`
3. `mediaAssets`
4. Firebase Storage integration

Why this waits:

- offers may be member-only
- marketplace listings may involve suppliers
- media upload needs storage rules
- publishing may require commercial approval

### Phase 4: Membership content

Implement:

1. `membershipPages`
2. member visibility rules
3. member-only read rules
4. future entitlement mapping

Why this waits:

- membership content can affect pricing
- payment expectations need commercial approval
- member-only visibility needs tested auth rules

### Phase 5: Legal governance

Implement:

1. `legalPages`
2. legal approval workflow
3. immutable published legal versions
4. audit logging for every change
5. restricted legal-admin permissions

Why this is last:

- legal content has the highest governance risk
- version history and audit logs must already be stable
- only legal-admin and super-admin should be able to publish

## Firestore collection naming

Collection names should match `collectionName` from `src/app/data/backendCollectionContracts.ts`.

Planned collections:

- `businessCategories`
- `resources`
- `helpArticles`
- `applications`
- `services`
- `operations`
- `offers`
- `marketplaceListings`
- `membershipPages`
- `legalPages`
- `mediaAssets`
- `auditLogs`
- `adminUsers`

## Standard document metadata

Most content documents should include:

- `id`
- `title`
- `slug`
- `summary`
- `href`
- `status`
- `sortOrder`
- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`
- `publishedAt`
- `publishedBy`
- `archivedAt`
- `archivedBy`

## Standard status lifecycle

Recommended content lifecycle:

1. `draft`
2. `review`
3. `ready`
4. `published`
5. `archived`

Public reads should only expose records with:

- `ready`
- `published`

Restricted legal records should require:

- `approved`
- `published`

## Admin CRUD implementation order

Recommended coding order:

1. Firebase app config wrapper
2. Firestore collection references
3. read-only list queries for Resources
4. create Resource
5. update Resource
6. archive Resource
7. repeat for Help Center
8. extract reusable backend CRUD service
9. connect Applications, Services, Operations
10. add Admin Auth
11. add audit logs
12. add Offers and Marketplace
13. add Membership
14. add Legal Pages

## Migration/seeding plan

Initial migration should seed Firestore from existing static data files:

- `src/app/data/resources.ts`
- `src/app/data/helpCenter.ts`
- `src/app/data/applications.ts`
- `src/app/data/onDemandServices.ts`
- `src/app/data/managedServices.ts`
- `src/app/data/operations.ts`
- `src/app/data/offers.ts`
- `src/app/data/marketplace.ts`
- `src/app/data/membership.ts`
- `src/app/data/legalPages.ts`

Seeding should be idempotent.

Seed logic must:

- preserve stable IDs
- preserve slugs
- avoid duplicate records
- not overwrite newer admin edits unless forced
- log migration results

## Environment variables

Expected frontend environment variables later:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Do not commit real secrets.

## What this phase does not implement

- Firebase SDK installation
- Firebase config
- Firestore queries
- Firestore writes
- Firebase Auth login
- Firebase Storage upload
- deployed security rules
- Cloud Functions
- production credentials

## Next implementation step

After this planning phase, implement Firebase read-only integration for the lowest-risk collections:

1. `resources`
2. `helpArticles`

Keep static data fallback until backend reads are stable.
