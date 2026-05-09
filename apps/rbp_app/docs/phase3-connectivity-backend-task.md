# Phase 3: Connectivity Backend Sprint

Repository:
info-rbp/frappe-project

App:
rbp_app

Branch:
phase3/connectivity-backend

Scope:
Backend only. Do not implement frontend, UI/UX, launch, repo consolidation, Risk Advisor, or The Fixer.

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
1. RBP Connectivity Request
2. RBP Connectivity Provider
3. RBP Connectivity Quote

RBP Connectivity Request fields:
- tenant
- owner_user
- business_profile
- location_name
- address_line_1
- address_line_2
- suburb
- state
- postcode
- service_type
- current_provider
- current_plan
- desired_speed
- budget
- status
- workflow_state
- assigned_to
- submitted_on
- reviewed_on
- closed_on
- notes

RBP Connectivity Provider fields:
- tenant
- provider_name
- contact_email
- contact_phone
- website
- service_regions
- service_types
- status
- notes

RBP Connectivity Quote fields:
- tenant
- connectivity_request
- provider
- quote_title
- speed_down
- speed_up
- monthly_cost
- setup_cost
- contract_months
- status
- recommended
- notes

Request statuses:
- Draft
- Submitted
- In Review
- Quoted
- Approved
- In Progress
- Completed
- Cancelled

Provider statuses:
- Active
- Inactive
- Archived

Quote statuses:
- Draft
- Presented
- Accepted
- Rejected
- Expired

Create service:
rbp_app/rbp_app/services/connectivity.py

Service methods:
- create_request(user, payload)
- update_draft_request(user, request_name, payload)
- submit_request(user, request_name)
- list_my_requests(user, filters=None)
- get_request(user, request_name)
- admin_assign_request(user, request_name, assigned_to)
- admin_update_status(user, request_name, status, payload=None)
- create_provider(user, payload)
- update_provider(user, provider_name, payload)
- list_providers(user, filters=None)
- create_quote(user, request_name, payload)
- update_quote(user, quote_name, payload)
- accept_quote(user, quote_name)

Service responsibilities:
- tenant ownership
- owner/admin/assigned-user access checks
- draft-only owner updates
- status transition validation
- provider management by admin
- quote management by admin or assigned user
- quote visibility through parent request
- audit logging
- notifications
- server-side permission checks

Create API:
rbp_app/rbp_app/api/connectivity.py

Whitelisted API methods:
- create_request
- update_draft_request
- submit_request
- list_my_requests
- get_request
- admin_assign_request
- admin_update_status
- create_provider
- update_provider
- list_providers
- create_quote
- update_quote
- accept_quote

API rules:
- APIs must be thin.
- APIs should coerce payloads.
- APIs should require login or admin where appropriate.
- APIs should call the service layer.
- APIs should not contain business logic.

Audit events:
- connectivity_request_created
- connectivity_request_updated
- connectivity_request_submitted
- connectivity_request_assigned
- connectivity_status_updated
- connectivity_provider_created
- connectivity_provider_updated
- connectivity_quote_created
- connectivity_quote_updated
- connectivity_quote_accepted

Notification events:
- connectivity request submitted
- connectivity request assigned
- connectivity status changed
- connectivity quote presented
- connectivity quote accepted

Permission rules:
- Owner can create Draft requests.
- Owner can update only Draft requests.
- Owner can submit own Draft requests.
- Owner can list/get own tenant requests.
- Assigned user can view assigned tenant requests.
- Admin/System Manager can manage all Connectivity records.
- Providers are admin-managed.
- Quotes inherit access from parent request.
- Cross-tenant access must hard-fail server-side.

Tests:
Create rbp_app/rbp_app/tests/test_connectivity.py

Tests must cover:
- DocType field definitions
- create request
- update draft request
- cannot update after submit
- submit request
- list my requests
- get request
- admin assign request
- admin update status
- create provider
- update provider
- list providers
- create quote
- update quote
- accept quote
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
- RBP Connectivity Request DocType exists.
- RBP Connectivity Provider DocType exists.
- RBP Connectivity Quote DocType exists.
- Service layer exists.
- API layer exists.
- Tenant checks are enforced.
- Owner/admin/assigned-user permission paths work.
- Quote lifecycle works.
- Audit events are written.
- Notifications are created.
- Focused Connectivity tests pass.
- Existing Phase 3 tests still pass.
- No Frappe core changes.
- No start/apps/* changes.
- No start/sites/* changes.
