# Phase 3: Decision Desk Backend Sprint

Repository:
info-rbp/frappe-project

App:
rbp_app

Branch:
phase3/decision-desk-backend

Scope:
Backend only. Do not implement frontend, UI/UX, launch, QA, consolidation, DocuShare, Marketplace, Connectivity/NBN, Risk Advisor, or The Fixer.

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
1. RBP Decision Desk Request
2. RBP Decision Desk Option

RBP Decision Desk Request fields:
- tenant
- owner_user
- business_profile
- title
- category
- summary
- business_context
- urgency
- deadline
- desired_outcome
- constraints
- status
- workflow_state
- assigned_to
- submitted_on
- reviewed_on
- closed_on
- source_channel
- supporting_file_reference
- notes

RBP Decision Desk Option fields:
- decision_request
- tenant
- option_label
- option_summary
- pros
- cons
- estimated_cost
- risk_level
- recommended
- sort_order
- notes

Request states:
- Draft
- Submitted
- In Review
- Assigned
- In Progress
- Outcome Ready
- Closed
- Cancelled

Create service:
rbp_app/rbp_app/services/decision_desk.py

Service methods:
- create_request(user, payload)
- update_draft_request(user, request_name, payload)
- submit_request(user, request_name)
- list_my_requests(user, filters=None)
- get_request(user, request_name)
- admin_assign_request(user, request_name, assigned_to)
- admin_update_status(user, request_name, status, payload=None)
- create_option(user, request_name, payload)
- update_option(user, option_name, payload)
- delete_option(user, option_name)

Service responsibilities:
- tenant ownership
- draft-only update rules
- submit transition rules
- admin-only review, assignment and status updates
- option ownership through parent request
- audit logging
- notifications
- server-side permission checks
- file reference linking where needed

Create API:
rbp_app/rbp_app/api/decision_desk.py

Whitelisted API methods:
- create_request
- update_draft_request
- submit_request
- list_my_requests
- get_request
- admin_assign_request
- admin_update_status
- create_option
- update_option
- delete_option

API rules:
- APIs must be thin.
- APIs should coerce payloads.
- APIs should require login or admin where appropriate.
- APIs should call the service layer.
- APIs should not contain business logic.

Audit events:
- decision_desk_request_created
- decision_desk_request_updated
- decision_desk_request_submitted
- decision_desk_request_assigned
- decision_desk_status_updated
- decision_desk_option_created
- decision_desk_option_updated
- decision_desk_option_deleted

Notification events:
- user request submitted
- admin/advisor new request submitted
- assigned advisor request assigned
- user status changed
- user outcome ready

Permission rules:
- Owner can create draft requests.
- Owner can update only Draft requests.
- Owner can submit own Draft requests.
- Owner can list/get own tenant requests.
- Admin/System Manager can view and manage all Decision Desk requests.
- Assigned advisor can view assigned requests.
- Options inherit access from parent request.
- Tenant mismatch must hard-fail server-side.

Create tests:
rbp_app/rbp_app/tests/test_decision_desk.py

Tests must cover:
- create request
- update draft request
- cannot update after submit
- submit request
- list my requests
- get own request
- cannot get another user or tenant request
- admin assign request
- admin update status
- create option
- update option
- delete option
- audit event creation
- notification creation
- permission failures

Validation commands:
start/env/bin/python -m compileall -q rbp_app/rbp_app

start/env/bin/python -m unittest \
  rbp_app.tests.test_decision_desk \
  rbp_app.tests.test_membership_onboarding \
  rbp_app.tests.test_phase3_partials \
  rbp_app.tests.test_platform_api \
  rbp_app.tests.test_tenancy \
  rbp_app.tests.test_api_integrations

Acceptance criteria:
- RBP Decision Desk Request DocType exists.
- RBP Decision Desk Option DocType exists.
- Service layer exists.
- API layer exists.
- Tenant checks are enforced.
- Owner/admin permission paths work.
- Basic workflow/status transitions work.
- Audit events are written.
- Notifications are created.
- Focused tests pass.
- Existing Phase 3 tests still pass.
- No Frappe core changes.
- No start/apps/* changes.
- No start/sites/* changes.
