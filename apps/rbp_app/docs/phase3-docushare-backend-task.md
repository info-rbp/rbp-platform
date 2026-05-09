# Phase 3: DocuShare Backend Sprint

Repository:
info-rbp/frappe-project

App:
rbp_app

Branch:
phase3/docushare-backend

Scope:
Backend only. Do not implement frontend, UI/UX, launch, repo consolidation, Marketplace, Connectivity/NBN, Risk Advisor, or The Fixer.

Architecture:
- rbp_app.api.* = thin whitelisted API layer
- rbp_app.services.* = business logic, tenant checks, permissions, workflows, audit, notifications, file handling
- rbp_app.rbp_app.doctype.* = Frappe DocTypes, validation, persistence, workflow state

Do not modify:
- frappe/
- start/apps/*
- start/sites/*
- generated bench files
- Frappe core
- frontend repositories

Create these DocTypes:
1. RBP DocuShare Folder
2. RBP DocuShare Document
3. RBP DocuShare Share

RBP DocuShare Folder fields:
- tenant
- owner_user
- folder_name
- parent_folder
- description
- status
- visibility
- created_from
- notes

RBP DocuShare Document fields:
- tenant
- owner_user
- folder
- title
- description
- file_reference
- document_type
- status
- visibility
- version
- source_channel
- notes

RBP DocuShare Share fields:
- tenant
- owner_user
- share_target_user
- share_target_email
- folder
- document
- access_level
- status
- expires_on
- revoked_on
- notes

Folder statuses:
- Active
- Archived

Document statuses:
- Draft
- Active
- Archived
- Deleted

Share statuses:
- Active
- Revoked
- Expired

Visibility values:
- Private
- Tenant
- Shared

Access levels:
- View
- Comment
- Manage

Create service:
rbp_app/rbp_app/services/docushare.py

Service methods:
- create_folder(user, payload)
- update_folder(user, folder_name, payload)
- list_folders(user, filters=None)
- get_folder(user, folder_name)
- create_document(user, payload)
- update_document(user, document_name, payload)
- list_documents(user, filters=None)
- get_document(user, document_name)
- share_folder(user, folder_name, payload)
- share_document(user, document_name, payload)
- revoke_share(user, share_name)

Service responsibilities:
- tenant ownership
- owner/admin/shared-user access checks
- folder parent validation
- document-folder tenant consistency
- file_reference validation/linking
- share lifecycle
- audit logging
- notifications
- server-side permission checks

Create API:
rbp_app/rbp_app/api/docushare.py

Whitelisted API methods:
- create_folder
- update_folder
- list_folders
- get_folder
- create_document
- update_document
- list_documents
- get_document
- share_folder
- share_document
- revoke_share

API rules:
- APIs must be thin.
- APIs should coerce payloads.
- APIs should require login or admin where appropriate.
- APIs should call the service layer.
- APIs should not contain business logic.

Audit events:
- docushare_folder_created
- docushare_folder_updated
- docushare_document_created
- docushare_document_updated
- docushare_folder_shared
- docushare_document_shared
- docushare_share_revoked

Notification events:
- folder shared with user
- document shared with user
- share revoked

Permission rules:
- Owner can create folders and documents in own tenant.
- Owner can update own folders and documents.
- Admin/System Manager can manage all DocuShare records.
- Shared user can view shared folder or document.
- Cross-tenant access must hard-fail server-side.
- Document folder and file reference must belong to the same tenant where applicable.
- Shares inherit access from parent folder/document.

Tests:
Create rbp_app/rbp_app/tests/test_docushare.py

Tests must cover:
- DocType field definitions
- create folder
- update folder
- list folders
- get folder
- create document
- update document
- list documents
- get document
- share folder
- share document
- revoke share
- owner access
- shared-user access
- admin access
- cross-tenant denial
- audit event creation
- notification creation
- thin API payload coercion

Validation commands:
start/env/bin/python -m compileall -q rbp_app/rbp_app

start/env/bin/python -m unittest \
  rbp_app.tests.test_docushare \
  rbp_app.tests.test_decision_desk \
  rbp_app.tests.test_membership_onboarding \
  rbp_app.tests.test_phase3_partials \
  rbp_app.tests.test_platform_api \
  rbp_app.tests.test_tenancy \
  rbp_app.tests.test_api_integrations

Acceptance criteria:
- RBP DocuShare Folder DocType exists.
- RBP DocuShare Document DocType exists.
- RBP DocuShare Share DocType exists.
- Service layer exists.
- API layer exists.
- Tenant checks are enforced.
- Owner/admin/shared-user permission paths work.
- File reference linking is supported.
- Audit events are written.
- Notifications are created.
- Focused DocuShare tests pass.
- Existing Phase 3 tests still pass.
- No Frappe core changes.
- No start/apps/* changes.
- No start/sites/* changes.
