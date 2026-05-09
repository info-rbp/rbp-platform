# Phase 3: Risk Advisor Backend Sprint

Repository:
info-rbp/frappe-project

App:
rbp_app

Branch:
phase3/risk-advisor-backend

Scope:
Backend only. Do not implement frontend, UI/UX, launch, repo consolidation, or The Fixer.

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
1. RBP Risk Advisor Assessment
2. RBP Risk Advisor Risk
3. RBP Risk Advisor Action

RBP Risk Advisor Assessment fields:
- tenant
- owner_user
- business_profile
- title
- assessment_type
- business_area
- summary
- status
- workflow_state
- risk_score
- risk_level
- assigned_to
- submitted_on
- reviewed_on
- closed_on
- notes

RBP Risk Advisor Risk fields:
- tenant
- assessment
- title
- category
- description
- likelihood
- impact
- risk_score
- risk_level
- status
- owner_user
- notes

RBP Risk Advisor Action fields:
- tenant
- assessment
- risk
- title
- description
- priority
- status
- assigned_to
- due_date
- completed_on
- notes

Assessment statuses:
- Draft
- Submitted
- In Review
- Reviewed
- Closed
- Cancelled

Risk statuses:
- Open
- Monitoring
- Mitigated
- Accepted
- Closed

Action statuses:
- Open
- In Progress
- Completed
- Cancelled

Risk levels:
- Low
- Medium
- High
- Critical

Create service:
rbp_app/rbp_app/services/risk_advisor.py

Service methods:
- create_assessment(user, payload)
- update_draft_assessment(user, assessment_name, payload)
- submit_assessment(user, assessment_name)
- list_my_assessments(user, filters=None)
- get_assessment(user, assessment_name)
- admin_assign_assessment(user, assessment_name, assigned_to)
- admin_update_assessment_status(user, assessment_name, status, payload=None)
- create_risk(user, assessment_name, payload)
- update_risk(user, risk_name, payload)
- create_action(user, risk_name, payload)
- update_action(user, action_name, payload)
- complete_action(user, action_name)

Service responsibilities:
- tenant ownership
- owner/admin/assigned-user access checks
- draft-only owner edits
- assessment status transition validation
- risk scoring and risk level derivation
- risk/action ownership through parent assessment
- audit logging
- notifications
- server-side permission checks

Create API:
rbp_app/rbp_app/api/risk_advisor.py

Whitelisted API methods:
- create_assessment
- update_draft_assessment
- submit_assessment
- list_my_assessments
- get_assessment
- admin_assign_assessment
- admin_update_assessment_status
- create_risk
- update_risk
- create_action
- update_action
- complete_action

API rules:
- APIs must be thin.
- APIs should coerce payloads.
- APIs should require login or admin where appropriate.
- APIs should call the service layer.
- APIs should not contain business logic.

Audit events:
- risk_advisor_assessment_created
- risk_advisor_assessment_updated
- risk_advisor_assessment_submitted
- risk_advisor_assessment_assigned
- risk_advisor_assessment_status_updated
- risk_advisor_risk_created
- risk_advisor_risk_updated
- risk_advisor_action_created
- risk_advisor_action_updated
- risk_advisor_action_completed

Notification events:
- risk assessment submitted
- risk assessment assigned
- risk assessment status changed
- risk created
- risk action assigned
- risk action completed

Permission rules:
- Owner can create Draft assessments.
- Owner can update only Draft assessments.
- Owner can submit own Draft assessments.
- Owner can list/get own tenant assessments.
- Assigned user can view assigned tenant assessments.
- Admin/System Manager can manage all Risk Advisor records.
- Risks inherit access from parent assessment.
- Actions inherit access from parent risk/assessment.
- Cross-tenant access must hard-fail server-side.

Tests:
Create rbp_app/rbp_app/tests/test_risk_advisor.py

Tests must cover:
- DocType field definitions
- create assessment
- update draft assessment
- cannot update assessment after submit
- submit assessment
- list my assessments
- get assessment
- admin assign assessment
- admin update assessment status
- create risk
- update risk
- risk score and level calculation
- create action
- update action
- complete action
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
- RBP Risk Advisor Assessment DocType exists.
- RBP Risk Advisor Risk DocType exists.
- RBP Risk Advisor Action DocType exists.
- Service layer exists.
- API layer exists.
- Tenant checks are enforced.
- Owner/admin/assigned-user permission paths work.
- Risk scoring works.
- Risk/action lifecycle works.
- Audit events are written.
- Notifications are created.
- Focused Risk Advisor tests pass.
- Existing Phase 3 tests still pass.
- No Frappe core changes.
- No start/apps/* changes.
- No start/sites/* changes.
