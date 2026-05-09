# Phase 3 Integration Readiness Plan

Repository:
info-rbp/frappe-project

App:
rbp_app

Branch:
phase3/integration-readiness-plan

Scope:
Planning and documentation only. Do not implement frontend, UI/UX, QA automation, launch changes, repo consolidation, custom admin backend, Frappe core edits, or generated bench artifacts.

Current backend state:
- Platform foundation merged
- Membership/onboarding merged
- Decision Desk backend merged
- DocuShare backend merged
- Marketplace backend merged
- Connectivity backend merged
- Risk Advisor backend merged
- The Fixer backend merged
- Backend hardening validation merged

Current focused backend validation:
- 141 tests passing

Integration readiness goals:
- Inventory backend APIs available for integration.
- Map API modules to expected client/front-end use cases.
- Identify missing endpoint documentation.
- Identify authentication, tenant, and entitlement assumptions.
- Identify file reference and upload integration points.
- Identify notification and audit expectations.
- Identify Frappe Desk/admin operational workflows.
- Identify environment blockers for full bench validation.
- Define QA/UAT entry criteria.
- Define launch-readiness blockers.

Backend API inventory:
- rbp_app.api.membership
- rbp_app.api.decision_desk
- rbp_app.api.docushare
- rbp_app.api.marketplace
- rbp_app.api.connectivity
- rbp_app.api.risk_advisor
- rbp_app.api.the_fixer
- rbp_app.api.notifications
- rbp_app.api.entitlements
- rbp_app.api.documents

Known environment notes:
- bench migrate previously blocked when redis_cache was not running.
- full bench run-tests previously failed when Mail submodule was not aligned.
- focused rbp_app unittest suite now passes.
- no Frappe core changes should be introduced.
- no start/apps/* changes should be introduced.
- no start/sites/* generated artifacts should be committed.

Deliverables:
- endpoint inventory
- integration assumptions
- frontend handoff checklist
- QA/UAT readiness checklist
- environment validation checklist
- launch blocker list

Acceptance criteria:
- documentation-only PR
- no backend code changes unless explicitly approved
- no frontend changes
- no forbidden paths
- focused backend tests still pass
