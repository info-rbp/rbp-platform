# Phase 3 QA/UAT Readiness Plan

## Purpose

This document defines the manual QA and UAT readiness coverage required after Phase 3 backend/platform completion and before frontend integration, QA execution, or launch work begins.

The goal is to confirm that the completed Frappe backend modules can support role-based user flows, tenant isolation, permission boundaries, admin Desk operations, audit logging, notifications, file references, subscriptions, and entitlement behaviour.

## Scope

This plan covers:

- Membership and onboarding
- Tenant and business profile records
- Subscriptions and payment-state modelling
- App entitlements
- Decision Desk
- DocuShare
- Marketplace
- Connectivity
- Risk Advisor
- The Fixer
- Notifications
- Audit logging
- File references
- Portal and admin route guards
- Admin operations in Frappe Desk
- Negative permission scenarios
- Tenant isolation scenarios

## Explicit Exclusions

This plan does not implement:

- Frontend UI
- QA automation
- Deployment automation
- Live payment provider integration
- Repository consolidation
- Custom Frappe Desk replacement
- Frappe core changes
- New product backend modules

## Completed Backend Modules Covered

The following Phase 3 backend modules are covered by this readiness plan:

- Platform foundation
- Membership/onboarding
- Decision Desk
- DocuShare
- Marketplace
- Connectivity
- Risk Advisor
- The Fixer
- Notifications
- Entitlements
- Billing/payment modelling
- File references
- Audit logging
- App discovery/adapters
- Route guards

## Test Personas and Roles

| Persona | Purpose |
|---|---|
| Guest | Confirms protected APIs and routes reject unauthenticated access |
| Website User | Confirms authenticated portal access |
| Tenant Owner | Creates and manages own tenant/product records |
| Tenant Team Member | Confirms tenant-scoped access where allowed |
| Assigned Advisor | Confirms assigned-only access to operational records |
| Marketplace Seller | Confirms vendor/listing ownership paths |
| Marketplace Buyer | Confirms order ownership paths |
| Support Agent | Confirms assigned Fixer/operational case access |
| System Manager | Confirms admin workflow access |
| Administrator | Confirms unrestricted operational access |

## Tenant Isolation Scenarios

Minimum tenant isolation checks:

1. Create or identify Tenant A.
2. Create or identify Tenant B.
3. Create a user assigned to Tenant A.
4. Create a user assigned to Tenant B.
5. Create product records under Tenant A.
6. Attempt to access Tenant A records as the Tenant B user.
7. Confirm access is denied or records are excluded from list responses.
8. Assign an advisor to a Tenant A record.
9. Confirm only the assigned advisor, owner, System Manager, or Administrator can access the assigned record.
10. Confirm ordinary users cannot access audit logs or admin-only operational records.

Pass criteria:

- Tenant users cannot access records owned by another tenant.
- Assigned users can access only assigned operational records.
- Admin users can access operational records safely.
- Guests cannot access protected APIs or protected portal routes.

## Membership and Onboarding UAT Flows

Validate:

1. Authenticated user lists active membership plans.
2. Authenticated user starts onboarding.
3. User updates onboarding steps.
4. User retrieves current onboarding state.
5. User submits onboarding.
6. Admin completes onboarding.
7. Audit events are written for lifecycle actions.
8. Notifications are generated where implemented.
9. Tenant and business profile relationships are created or resolved where supported.

Negative checks:

- Guest cannot list protected onboarding data.
- Non-admin cannot complete onboarding.
- User cannot update another user's onboarding flow.
- Invalid flow or step references fail safely.

Expected result:

- Onboarding flow and step records persist.
- User can retrieve their onboarding state.
- Admin completion is restricted to System Manager or Administrator.
- No cross-tenant leakage occurs.

## Decision Desk UAT Flows

Validate:

1. Tenant owner creates a draft Decision Desk request.
2. Tenant owner updates the draft.
3. Tenant owner submits the request.
4. Admin assigns an advisor.
5. Assigned advisor can view the assigned request.
6. Admin updates status through review/progress/outcome/closed states.
7. User can retrieve the latest status.
8. Options can be created, updated, and deleted.
9. Audit events are written.
10. Notifications are created for submit, assign, and status events.

Negative checks:

- Guest is rejected.
- Non-owner cannot update another user's draft.
- Cross-tenant user cannot view the request.
- Non-admin cannot assign or update admin status.
- Submitted records cannot be edited through draft-only methods.

## DocuShare UAT Flows

Validate:

1. User creates a DocuShare folder.
2. User creates a document linked to a file reference.
3. User updates folder/document metadata.
4. User shares a folder or document.
5. Shared user can access the shared record.
6. Share can be revoked.
7. Revoked user loses access.
8. Admin can view/manage operational records.
9. Audit events are written.
10. Notifications are created for share/revoke events.

Negative checks:

- Cross-tenant file reference linking is rejected.
- Cross-tenant folder/document access is rejected.
- Guest is rejected.
- Revoked users cannot continue accessing shared records.

## Marketplace UAT Flows

Validate:

1. Seller creates a vendor profile.
2. Seller creates a listing.
3. Seller updates listing metadata.
4. Buyer creates an order.
5. Buyer can retrieve their order.
6. Vendor can retrieve relevant vendor/listing/order records.
7. Admin can update operational order/listing status where supported.
8. Audit events are written.
9. Notifications are created for lifecycle actions.

Negative checks:

- Cross-tenant listing/order access is rejected.
- Non-owner cannot manage vendor/listing records.
- Invalid order status transitions are rejected.
- Guest is rejected.

## Connectivity UAT Flows

Validate:

1. User creates a connectivity request.
2. User updates draft request.
3. User submits request.
4. Admin assigns request.
5. Admin creates or manages providers.
6. Admin creates quotes.
7. User can view quotes for their request.
8. User accepts quote where supported.
9. Request status updates are visible.
10. Audit and notification records are created.

Negative checks:

- Cross-tenant provider or quote linking is rejected.
- Non-admin provider management is rejected.
- Draft-only edits are enforced.
- Guest is rejected.

## Risk Advisor UAT Flows

Validate:

1. User creates a risk assessment.
2. User updates draft assessment.
3. User submits assessment.
4. Admin assigns advisor.
5. Risk records can be created.
6. Risk score and risk level are calculated/stored.
7. Action records can be created.
8. Actions can be updated or completed.
9. Assessment status is visible to the owner and assigned advisor.
10. Audit and notification records are created.

Negative checks:

- Cross-tenant risks/actions are rejected.
- Invalid status transitions are rejected.
- Non-admin admin actions are rejected.
- Submitted assessments cannot be edited through draft-only methods.

## The Fixer UAT Flows

Validate:

1. User creates a draft Fixer case.
2. User updates draft case.
3. User submits case.
4. Admin assigns case.
5. Task records can be created.
6. Tasks can be updated and completed.
7. Case updates can be added.
8. Customer-visible and internal update rules are enforced.
9. Related Phase 3 object references validate tenant ownership.
10. Audit and notification records are created.

Negative checks:

- Cross-tenant related references are rejected.
- Non-assigned users cannot view assigned records unless owner/admin.
- Internal updates are hidden from users who should not see them.
- Guest is rejected.

## Notifications UAT Coverage

Validate:

- Notifications are created for major lifecycle events.
- Notifications are tenant-aware.
- Notifications are user-aware.
- Current user can list their notifications.
- Current user can mark one notification as read.
- Current user can mark all notifications as read.
- Ordinary users cannot mark another user's notification as read.
- Admin users can inspect notification records in Frappe Desk.

## Entitlements UAT Coverage

Validate:

- RBP App Entitlement records can be created for tenant, user, role, or plan access.
- Active entitlements appear in app discovery.
- Disabled entitlements are hidden.
- Expired entitlements are hidden.
- Date windows are respected.
- Admin users can access operational modules.
- App launcher visibility reflects entitlement records.

Open decision carried forward:

- Whether Phase 5 requires all product APIs to hard-block users without matching app entitlement records.

## File Reference Lifecycle Coverage

Validate:

- File references can be created for existing Frappe File records.
- File references include tenant, owner, related doctype, related name, visibility, uploaded_by, and status.
- Private owner visibility is respected.
- Tenant-visible access is restricted to tenant users.
- Advisor-visible access is restricted appropriately.
- Admin access is allowed.
- Archived file references are not returned in active document lists.

## Admin Desk Operational Scenarios

Validate in Frappe Desk:

- Admin can view RBP Tenant records.
- Admin can view business profiles.
- Admin can view membership plans.
- Admin can view onboarding flows and steps.
- Admin can view subscriptions and payment events.
- Admin can manage entitlements.
- Admin can view product submissions.
- Admin can assign advisors/operators where fields exist.
- Admin can update operational status fields where appropriate.
- Admin can view audit logs.
- Admin can view notifications.
- No custom admin backend is required to replace Frappe Desk.

## Negative Permission Scenarios

Minimum negative checks:

- Guest API access fails.
- Guest portal access redirects to login.
- Non-admin admin API access fails.
- Non-admin `/admin` and `/desk` access fails.
- Cross-tenant product access fails.
- Cross-tenant file reference access fails.
- Unassigned advisor access fails.
- Owner-only draft edits are enforced.
- Submitted records cannot be edited through draft-only methods.
- Ordinary users cannot access audit logs.

## Real HTTP/API Validation Plan

Real HTTP smoke testing should be run later through `/api/method/...` endpoints after frontend/session assumptions are confirmed.

For Phase 3 closeout, the current validation baseline is:

- focused backend unit tests
- bench migrate
- bench app test suite
- forbidden-path checks
- manual review of backend/API/service/DocType structure

## Data Setup Assumptions

Minimum data required for UAT:

- At least two tenants
- At least one tenant owner per tenant
- At least one System Manager
- Optional assigned advisor/support user
- Optional seller/buyer users
- At least one file record for file reference checks
- Optional entitlement records for app launcher checks

## Environment Assumptions

Validated environment:

- Site: `rbp-minimal.localhost`
- App: `rbp_app`
- Bench root: `start`
- Focused backend suite: 141 tests OK
- Bench rbp_app suite: 173 tests OK

Generated files under `start/sites/*` are local bench artifacts and must not be committed.

## Pass Criteria

Phase 3 QA/UAT readiness passes when:

- All focused backend tests pass.
- Bench migrate passes.
- Bench rbp_app tests pass.
- No forbidden paths are committed.
- Manual UAT scenarios are executable using existing APIs and DocTypes.
- Known deferrals are documented.
- Admin workflows remain supported through Frappe Desk.

## Fail Criteria

Phase 3 QA/UAT readiness fails if:

- Cross-tenant access succeeds incorrectly.
- Guest access exposes protected data.
- Admin actions are available to non-admin users.
- Product flows cannot create required backend records.
- Generated bench artifacts are committed.
- Frappe core is modified.

## Open Questions

- Should product APIs hard-enforce entitlements before Phase 5?
- Should APIs adopt a standard response envelope before frontend integration?
- Should `rbp_app.api.the_fixer` receive a compatibility alias as `rbp_app.api.fixer`?
- Which role fixtures should become canonical for RBP Advisor, Support Agent, Seller, Buyer, and RBP Admin?
- Which real HTTP smoke tests must become automated before launch?

## Recommended Next Validation Lane

After Phase 3 closeout:

1. Repository consolidation planning
2. Frontend/API integration planning
3. Real HTTP/API smoke test implementation
4. Manual QA/UAT execution
5. Deployment/environment hardening
