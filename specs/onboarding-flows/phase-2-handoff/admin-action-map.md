# Phase 2 Admin Action Map

## Purpose

This document maps Phase 1 admin concept actions to future backend actions.

## Common Admin Actions

| Action | Purpose | Backend Requirement |
|---|---|---|
| Open review | Admin views request detail | Read permission, audit optional |
| Approve | Move record forward | Workflow transition and audit log |
| Reject | End or return record | Workflow transition, reason, audit log |
| Request more info | Ask user for clarification | Workflow transition, notification trigger |
| Assign | Allocate owner/advisor/team | Assignment field, notification trigger |
| Add note | Internal admin comment | Note table/child record and audit |
| Change priority | Update urgency | Permission, field update, audit |
| Close | Complete request | Workflow transition and audit |
| Reopen | Reopen completed/cancelled request | Permission-gated transition |

## Admin Areas

### Content

Actions:

- approve content
- request legal review
- mark needs rewrite
- publish
- archive
- view version history

Backend needs:

- content status
- versioning
- legal review flag
- publishing workflow
- audit trail

### Requests

Actions:

- filter queue
- open request
- assign reviewer
- request more info
- approve outcome
- reject request
- close request

Backend needs:

- cross-flow queue
- status enum
- assignment
- admin notes
- workflow actions
- notifications

### Marketplace

Actions:

- approve listing
- reject listing
- request listing changes
- mark enquiry responded
- publish listing
- unpublish listing

Backend needs:

- listing status
- seller account
- media/file references
- fee/payment state
- publishing controls
- audit trail

### Membership

Actions:

- review application
- activate membership
- mark payment issue
- update onboarding status
- suspend/cancel membership
- view billing state

Backend needs:

- account/membership model
- billing state
- plan and entitlement mapping
- onboarding status
- audit trail

### Audit and Review

Actions:

- view audit trail
- filter by actor/action/target
- export or report
- review state changes

Backend needs:

- immutable audit log
- actor identity
- target reference
- timestamp
- action metadata

## Permissions Planning

Phase 2 should define admin roles such as:

- super_admin
- content_admin
- request_reviewer
- marketplace_admin
- membership_admin
- audit_viewer
- support_admin

Each role should define:

- allowed routes
- allowed read operations
- allowed workflow actions
- allowed export/report actions
- audit visibility

## Notification Planning

Admin actions may trigger:

- user email
- portal notification
- internal admin alert
- assigned reviewer alert
- escalation alert

Notification rules should be contract-defined before implementation.
