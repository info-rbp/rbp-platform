# Firebase Security Rules Plan

This document plans the Firestore and Firebase Storage security rules before implementation.

## Purpose

Security rules must protect public content, admin-managed content, commercial content, membership content, legal pages, media assets, audit logs, and admin user records.

This is a planning document only. No Firebase rules are deployed in this phase.

## Security model

The security model has four layers:

1. Public read rules
2. Authenticated member read rules
3. Admin write rules
4. Restricted governance rules

## Planned roles

Roles:

- public
- member
- editor
- admin
- commercial-admin
- legal-admin
- super-admin
- system

## public read

Public users may read:

- published resources
- published help articles
- published applications
- published services
- published operations
- published offers where memberOnly is not true
- published marketplace listings
- published membership pages where memberVisibility is public
- published legal pages

Public users must not read:

- draft records
- archived records
- member-only offers
- member-only membership content
- admin user records
- audit logs
- private media storage paths
- unpublished legal pages

## member read

Authenticated members may read:

- all public-readable records
- member-only offers
- membership pages where memberVisibility is members
- member-visible marketplace records later

Members must not write admin content.

## admin write

Admins may write:

- businessCategories
- resources
- helpArticles
- applications
- services
- operations
- membershipPages with restrictions
- mediaAssets metadata

Admins must not directly write:

- auditLogs
- legalPages unless also legal-admin
- adminUsers unless super-admin
- restricted commercial fields unless commercial-admin

## commercial-admin

Commercial admins may write and approve:

- offers
- marketplaceListings
- marketplace media metadata

Commercial admins must not write:

- legalPages
- adminUsers
- auditLogs directly

## legal-admin

Legal admins may write and approve:

- legalPages

Legal admins must not write:

- adminUsers
- auditLogs directly
- commercial approval state unless separately assigned

## super-admin

Super-admins may:

- manage adminUsers
- assign roles
- archive restricted records
- read auditLogs
- override approval workflows
- manage all content areas

Super-admin actions must be audited.

## Storage rules

Storage rules should cover:

- authenticated upload only
- role-based path access
- file size limits
- allowed MIME types
- no executable uploads
- metadata record creation
- legal uploads restricted to legal-admin or super-admin

Storage paths should be separated by purpose:

- /public/resources/{fileId}
- /public/marketplace/{fileId}
- /admin/uploads/{userId}/{fileId}
- /legal/{fileId}

## Draft security rule pseudocode

Use helper functions equivalent to:

- isSignedIn
- hasRole
- isAdmin
- isEditor
- isCommercialAdmin
- isLegalAdmin
- isPublishedPublicContent

The actual firestore.rules file should only be created after this plan is accepted.

## Collection planning

### Low-risk content

Collections:

- businessCategories
- resources
- helpArticles
- applications
- services
- operations

Public users may read ready or published records only.

Editors, admins, and super-admins may write according to their roles.

### Commercial content

Collections:

- offers
- marketplaceListings

Commercial-admin and super-admin roles can approve and publish. Public users must not see unpublished or member-only records.

### Membership content

Collection:

- membershipPages

Public users may read public membership records. Members may read member-only records. Admin and super-admin roles can write.

### Legal content

Collection:

- legalPages

Only legal-admin and super-admin roles can write. Public users may only read approved and published legal pages.

### Audit logs

Collection:

- auditLogs

Only system writes should be allowed. Only super-admin reads should be allowed.

### Admin users

Collection:

- adminUsers

Only super-admins should manage admin users and roles.

## Validation planning

Rules should validate:

- required fields exist
- status is an allowed value
- immutable fields are not changed by normal users
- createdAt is not edited
- updatedAt is set correctly
- archived records cannot be publicly read
- legal pages cannot publish without approval
- member-only records cannot leak to public reads

## What this phase does not implement

- actual firestore.rules
- actual storage.rules
- Firebase project configuration
- custom claims
- Cloud Functions
- deployed rules
- emulator tests

## Next implementation step

Create draft firestore.rules and storage.rules files only after the Firebase backend integration plan is accepted.
