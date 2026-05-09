# Phase 3 Backend Hardening and Validation Sprint

Repository:
info-rbp/frappe-project

App:
rbp_app

Branch:
phase3/backend-hardening-validation

Scope:
Backend-only hardening and validation. Do not add new product modules. Do not implement frontend, UI/UX, launch, repo consolidation, custom admin backend, Frappe core edits, or generated bench artifacts.

Modules now merged:
- Platform foundation
- Membership/onboarding
- Decision Desk
- DocuShare
- Marketplace
- Connectivity
- Risk Advisor
- The Fixer

Review targets:
- rbp_app.api.*
- rbp_app.services.*
- rbp_app.rbp_app.doctype.*
- rbp_app.tests.*

Hardening checklist:
- Confirm APIs remain thin and delegate to services.
- Confirm service layers own business logic, tenant checks, permissions, workflow transitions, audit events, and notifications.
- Confirm DocTypes contain persistence/validation only.
- Confirm tenant ownership checks are consistent across all product modules.
- Confirm owner/admin/assigned/shared/vendor/buyer access patterns are consistent where applicable.
- Confirm audit event names are consistent and useful.
- Confirm notification creation is consistent.
- Confirm status constants and transitions are explicit.
- Confirm no Frappe core, start/apps/*, or start/sites/* files are touched.
- Confirm no frontend work is included.
- Confirm focused tests still pass.
- Identify any missing coverage or consistency gaps.
- Produce a backend validation report.

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
- 141 focused tests pass.
- Backend module structure is consistent.
- No forbidden paths are changed.
- Any hardening changes are limited to rbp_app.
- A final backend validation report is produced.
