# Phase 3: The Fixer Backend Sprint

Repository:
info-rbp/frappe-project

App:
rbp_app

Branch:
phase3/the-fixer-backend

Scope:
Backend only. Do not implement frontend, UI/UX, launch, QA, repo consolidation, or custom Frappe Desk replacement.

Architecture:
- rbp_app.api.* = thin whitelisted API layer
- rbp_app.services.* = business logic, tenant checks, permissions, workflows, audit, notifications
- rbp_app.rbp_app.doctype.* = Frappe DocTypes, validation, persistence, workflow state

Do not modify:
- frappe/
- start/apps/*
- start/sites/*
- generated bench files
- Frappe core
- frontend repositories

Create these DocTypes:
1. RBP Fixer Case
2. RBP Fixer Task
3. RBP Fixer Update

RBP Fixer Case fields:
- tenant
- owner_user
- business_profile
- title
- category
- issue_summary
- issue_details
- urgency
- impact
- status
- workflow_state
- assigned_to
- submitted_on
- reviewed_on
- resolved_on
- closed_on
- source_channel
- related_decision_request
- related_docushare_document
- related_marketplace_order
- related_connectivity_request
- related_risk_assessment
- notes

RBP Fixer Task fields:
- tenant
- fixer_case
- title
- description
- priority
- status
- assigned_to
- due_date
- completed_on
- notes

RBP Fixer Update fields:
- tenant
- fixer_case
- update_type
- message
- status_snapshot
- created_by_user
- visible_to_customer
- notes

Case statuses:
- Draft
- Submitted
- Triage
- Assigned
- In Progress
- Waiting on Customer
- Resolved
- Closed
- Cancelled

Task statuses:
- Open
- In Progress
- Blocked
- Completed
- Cancelled

Update types:
- Internal Note
- Customer Update
- Status Change
- Resolution Note

Urgency values:
- Low
- Medium
- High
- Critical

Impact values:
- Low
- Medium
- High
- Business Critical

Create service:
rbp_app/rbp_app/services/the_fixer.py

Service methods:
- create_case(user, payload)
- update_draft_case(user, case_name, payload)
- submit_case(user, case_name)
- list_my_cases(user, filters=None)
- get_case(user, case_name)
- admin_assign_case(user, case_name, assigned_to)
- admin_update_case_status(user, case_name, status, payload=None)
- create_task(user, case_name, payload)
- update_task(user, task_name, payload)
- complete_task(user, task_name)
- add_case_update(user, case_name, payload)
- list_case_updates(user, case_name, filters=None)

Service responsibilities:
- tenant ownership
- owner/admin/assigned-user access checks
- draft-only owner edits
- case status transition validation
- task lifecycle
- case update lifecycle
- related Phase 3 object references where applicable
- audit logging
- notifications
- server-side permission checks

Create API:
rbp_app/rbp_app/api/the_fixer.py

Whitelisted API methods:
- create_case
- update_draft_case
- submit_case
- list_my_cases
- get_case
- admin_assign_case
- admin_update_case_status
- create_task
- update_task
- complete_task
- add_case_update
- list_case_updates

API rules:
- APIs must be thin.
- APIs should coerce payloads.
- APIs should require login or admin where appropriate.
- APIs should call the service layer.
- APIs should not contain business logic.

Audit events:
- fixer_case_created
- fixer_case_updated
- fixer_case_submitted
- fixer_case_assigned
- fixer_case_status_updated
- fixer_task_created
- fixer_task_updated
- fixer_task_completed
- fixer_update_added

Notification events:
- fixer case submitted
- fixer case assigned
- fixer case status changed
- fixer task assigned
- fixer task completed
- fixer customer update added
- fixer case resolved

Permission rules:
- Owner can create Draft cases.
- Owner can update only Draft cases.
- Owner can submit own Draft cases.
- Owner can list/get own tenant cases.
- Assigned user can view assigned tenant cases.
- Admin/System Manager can manage all Fixer records.
- Tasks inherit access from parent case.
- Updates inherit access from parent case.
- Customer-visible updates can be listed by the case owner.
- Internal updates must be restricted to admin/assigned users.
- Cross-tenant access must hard-fail server-side.

Tests:
Create rbp_app/rbp_app/tests/test_the_fixer.py

Tests must cover:
- DocType field definitions
- create case
- update draft case
- cannot update case after submit
- submit case
- list my cases
- get case
- admin assign case
- admin update case status
- create task
- update task
- complete task
- add case update
- list customer-visible updates
- restrict internal updates
- owner access
- assigned-user access
- admin access
- cross-tenant denial
- audit event creation
- notification creation
- thin API payload coercion

Validation commands:
start/env/bin/python -m compileall -q rbp_app/rbp_app

start/env/bin/python -m unittest \
  rbp_app.tests.test_the_fixer \
  rbp_app.tests.test_risk_advisor \
  rbp_app.tests.test_connectivity \
  rbp_app.tests.test_marketplace \
  rbp_app.tests.test_docushare \
  rbp_app.tests.test_decision_desk \
  rbp_app.tests.test_membership_onboarding \
  rbp_app.tests.test_phase3_partials \
  rbp_app.tests.test_platform_api \
  rbp_app.tests.test_tenancy \
  rbp_app.tests.test_api_integrations

Acceptance criteria:
- RBP Fixer Case DocType exists.
- RBP Fixer Task DocType exists.
- RBP Fixer Update DocType exists.
- Service layer exists.
- API layer exists.
- Tenant checks are enforced.
- Owner/admin/assigned-user permission paths work.
- Case lifecycle works.
- Task lifecycle works.
- Case update lifecycle works.
- Internal/customer-visible update permissions work.
- Audit events are written.
- Notifications are created.
- Focused The Fixer tests pass.
- Existing Phase 3 tests still pass.
- No Frappe core changes.
- No start/apps/* changes.
- No start/sites/* changes.
