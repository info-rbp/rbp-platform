# Admin Permissions Model

This document defines the planned admin permissions model for Firebase Auth, Firestore, and future admin workflows.

## Purpose

The admin portal needs a clear permissions model before backend CRUD is connected.

## Roles

### public

Can read published public content.

Cannot access admin routes, write content, read member-only content, or read audit logs.

### member

Can read public content, member-only membership content, and member-only offers later.

Cannot access admin routes or write admin content.

### editor

Can create and update:

- resources
- helpArticles
- applications
- services
- operations

Cannot edit offers, marketplace listings, membership pricing, legal pages, admin users, or audit logs.

### admin

Can create, update, and publish low-risk content:

- businessCategories
- resources
- helpArticles
- applications
- services
- operations

Can manage selected membership content later.

### commercial-admin

Can create, update, approve, and publish:

- offers
- marketplaceListings
- commercial marketplace media

### legal-admin

Can create, update, approve, and publish:

- legalPages

### super-admin

Can:

- manage admin users
- assign roles
- archive restricted records
- read auditLogs
- override approval workflows
- manage all content areas

### system

Used by trusted backend functions, migrations, scheduled jobs, and audit log writers.

## Permission matrix

| Collection | public | member | editor | admin | commercial-admin | legal-admin | super-admin | system |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| businessCategories | read published | read published | write | write | read | read | write | migrate |
| resources | read published | read published | write | write | read | read | write | migrate |
| helpArticles | read published | read published | write | write | read | read | write | migrate |
| applications | read published | read published | write | write | read | read | write | migrate |
| services | read published | read published | write | write | read | read | write | migrate |
| operations | read published | read published | write | write | read | read | write | migrate |
| offers | read public | read member-only | no | limited | write/approve | no | write | expire |
| marketplaceListings | read published | read published | no | limited | write/approve | no | write | migrate |
| membershipPages | read public | read members | no | write | no | no | write | migrate |
| legalPages | read published | read published | no | no | no | write/approve | write | migrate |
| mediaAssets | read public-safe | read allowed | upload | upload | upload | limited upload | manage | process |
| auditLogs | no | no | no | no | no | no | read | write |
| adminUsers | no | own profile later | no | no | no | no | manage | sync |

## Admin route access

General admin routes are available to:

- editor
- admin
- commercial-admin
- legal-admin
- super-admin

Content routes are available to:

- editor
- admin
- super-admin

Commercial routes are available to:

- commercial-admin
- super-admin

Membership routes are available to:

- admin
- super-admin

Legal routes are available to:

- legal-admin
- super-admin

Settings and admin user routes are available to:

- super-admin

## Audit requirements

Audit logs are required for:

- create
- update
- publish
- approve
- archive
- delete
- role assignment
- permission changes
- legal page edits
- membership price edits
- offer publication
- marketplace publication

## What this phase does not implement

- Firebase Auth
- route guards
- Firestore security rules
- custom claims
- admin invitation flow
- audit log writes
- role management UI
