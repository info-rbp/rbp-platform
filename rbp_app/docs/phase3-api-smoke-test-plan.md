# Phase 3 API Smoke Test Plan

## Purpose

This document defines the real HTTP/API smoke coverage required after Phase 3 backend completion and before Phase 5 frontend integration.

This is a planning document. It does not implement automated smoke tests.

## Scope

Smoke tests should verify that whitelisted backend APIs can be called over Frappe HTTP routes, enforce authentication, enforce permissions, enforce tenant isolation, return usable payloads, and trigger expected audit/notification side effects.

## Explicit Exclusions

This plan does not implement:

- Automated tests
- Frontend code
- Deployment scripts
- Load testing
- Security penetration testing
- Live payment provider tests
- Frappe core changes

## Required Test Environments

Minimum:

- Bench site with `rbp_app` installed
- One System Manager or Administrator
- Two tenant owners across two tenants
- One assigned advisor/support user
- Optional seller/buyer users
- At least one existing Frappe File for file reference tests

Recommended validation site:

```text
rbp-minimal.localhost
```

## Authentication Assumptions

Smoke calls should be made against:

```text
/api/method/<method.path>
```

Authentication should use an authenticated Frappe session or API credentials, depending on the test runner.

Expected behaviour:

- Guest calls to protected APIs fail.
- Authenticated user calls to own records succeed.
- Cross-tenant calls fail.
- Admin calls succeed for admin endpoints.

## Test User Roles

| User Type | Purpose |
|---|---|
| Guest | Confirm rejection |
| Tenant A owner | Create and manage own records |
| Tenant B owner | Confirm cross-tenant denial |
| Assigned advisor | Confirm assigned-only operational access |
| Marketplace seller | Confirm vendor/listing ownership |
| Marketplace buyer | Confirm order ownership |
| System Manager | Confirm admin endpoints |
| Administrator | Confirm full operational access |

## Shared Response Expectations

Current APIs generally return plain dictionaries or serialized DocType payloads.

Before Phase 5, decide whether to keep this contract or wrap responses in a standard envelope such as:

```json
{
  "ok": true,
  "data": {},
  "errors": [],
  "meta": {}
}
```

Until changed, smoke tests should assert the current raw dictionary payloads.

## Membership API Smoke Tests

Endpoints:

- `rbp_app.api.membership.list_membership_plans`
- `rbp_app.api.membership.start_onboarding`
- `rbp_app.api.membership.get_my_onboarding`
- `rbp_app.api.membership.update_onboarding_step`
- `rbp_app.api.membership.submit_onboarding`
- `rbp_app.api.membership.admin_complete_onboarding`

Smoke checks:

1. Guest is rejected.
2. Authenticated user can list plans.
3. Authenticated user can start onboarding.
4. Authenticated user can update a step.
5. Authenticated user can submit onboarding.
6. Non-admin cannot complete onboarding.
7. System Manager can complete onboarding.

Payload example:

```json
{
  "business_name": "Tenant A Business",
  "industry": "Consulting",
  "business_size": "1-10"
}
```

Expected side effects:

- Onboarding flow exists.
- Onboarding step records exist.
- Audit events exist where implemented.
- Notifications exist where implemented.

## Decision Desk API Smoke Tests

Endpoints:

- `rbp_app.api.decision_desk.create_request`
- `rbp_app.api.decision_desk.update_draft_request`
- `rbp_app.api.decision_desk.submit_request`
- `rbp_app.api.decision_desk.list_my_requests`
- `rbp_app.api.decision_desk.get_request`
- `rbp_app.api.decision_desk.admin_assign_request`
- `rbp_app.api.decision_desk.admin_update_status`
- `rbp_app.api.decision_desk.create_option`
- `rbp_app.api.decision_desk.update_option`
- `rbp_app.api.decision_desk.delete_option`

Payload example:

```json
{
  "title": "Choose payroll platform",
  "category": "Technology",
  "summary": "Need support selecting a platform.",
  "urgency": "Normal",
  "source_channel": "portal"
}
```

Smoke checks:

1. Owner creates draft.
2. Owner updates draft.
3. Owner submits draft.
4. Admin assigns advisor.
5. Advisor can view assigned request.
6. Cross-tenant user cannot view request.
7. Options lifecycle works.
8. Notifications and audit events exist.

## DocuShare API Smoke Tests

Smoke checks:

1. Create folder.
2. Create document linked to file reference.
3. Update folder/document.
4. Share folder/document.
5. Shared user can access.
6. Revoke share.
7. Revoked user loses access.
8. Cross-tenant linking fails.
9. Audit and notification records exist.

## Marketplace API Smoke Tests

Smoke checks:

1. Create vendor.
2. Create listing.
3. Update listing.
4. Create order.
5. Update order status.
6. Seller access path works.
7. Buyer access path works.
8. Admin access path works.
9. Cross-tenant access fails.
10. Invalid transitions fail.

## Connectivity API Smoke Tests

Smoke checks:

1. Create request.
2. Update draft request.
3. Submit request.
4. Admin assigns request.
5. Admin creates provider.
6. Admin creates quote.
7. User accepts quote where supported.
8. Cross-tenant provider/quote links fail.
9. Audit and notification records exist.

## Risk Advisor API Smoke Tests

Smoke checks:

1. Create assessment.
2. Update draft assessment.
3. Submit assessment.
4. Admin assigns advisor.
5. Create risk.
6. Validate risk score and level.
7. Create action.
8. Complete action.
9. Cross-tenant risk/action links fail.
10. Audit and notification records exist.

## The Fixer API Smoke Tests

Canonical module:

```text
rbp_app.api.the_fixer
```

Smoke checks:

1. Create case.
2. Update draft case.
3. Submit case.
4. Admin assigns case.
5. Create task.
6. Update task.
7. Complete task.
8. Add case update.
9. Confirm internal/customer-visible update permissions.
10. Cross-tenant related references fail.

Open contract item:

- Decide whether to add compatibility alias `rbp_app.api.fixer`.

## Notifications API Smoke Tests

Endpoints:

- `rbp_app.api.notifications.get_notifications`
- `rbp_app.api.notifications.mark_notification_read`
- `rbp_app.api.notifications.mark_all_notifications_read`

Smoke checks:

1. User can list own notifications.
2. User can mark own notification read.
3. User can mark all own notifications read.
4. User cannot mark another user's notification read.
5. Admin can inspect operational notification records in Desk.

## Entitlements API Smoke Tests

Endpoints:

- `rbp_app.api.entitlements.get_my_entitlements`
- `rbp_app.api.entitlements.can_access_app`

Smoke checks:

1. Active tenant entitlement appears.
2. Active user entitlement appears.
3. Expired entitlement is hidden.
4. Disabled entitlement is hidden.
5. App launcher reflects entitlements.
6. Scaffold-safe behaviour is documented if no entitlement rows exist.

## File Reference API Smoke Tests

Endpoints:

- `rbp_app.api.documents.get_documents`
- `rbp_app.api.documents.attach_file_reference`

Smoke checks:

1. Existing Frappe File can be linked.
2. File reference includes tenant, owner, and visibility.
3. Owner can retrieve file reference.
4. Tenant-visible reference is visible to tenant users.
5. Cross-tenant user cannot retrieve reference.
6. Admin can inspect file references.

## Negative Permission Smoke Tests

Required failures:

- Guest protected API calls fail.
- Non-admin admin API calls fail.
- Cross-tenant access fails.
- Non-owner draft edits fail.
- Submitted draft-only edits fail.
- Unassigned advisor access fails.
- Invalid status values fail.
- Invalid cross-tenant file references fail.

## Tenant Isolation Smoke Tests

For each product domain:

1. Tenant A creates record.
2. Tenant B attempts list/get/update.
3. Tenant B receives permission failure or empty list.
4. System Manager can access where appropriate.
5. Assigned advisor access works only when assigned.

## Audit Side-Effect Checks

After lifecycle actions, verify `RBP Audit Log` records exist for:

- Product record created
- Product record submitted
- Admin assignment
- Status update
- File reference created
- Payment event recorded
- Notification created

## Notification Side-Effect Checks

After lifecycle actions, verify `RBP Notification` records exist for:

- Request submitted
- Admin/assigned user notification
- Status changed
- Outcome ready
- Share/revoke
- Case/task/action lifecycle where implemented

## Manual Execution Checklist

Before executing smoke tests:

- Confirm clean working tree.
- Confirm site exists.
- Confirm `rbp_app` is installed.
- Confirm migrations pass.
- Confirm test users exist.
- Confirm tenants exist.
- Confirm at least one Frappe File exists.
- Confirm `bench --site rbp-minimal.localhost run-tests --app rbp_app` passes.

## Future Automation Recommendations

Automate smoke tests after Phase 5 API session assumptions are confirmed.

Recommended approach:

- Use a small Python or pytest HTTP client.
- Seed users, tenants, and records.
- Execute API methods through `/api/method`.
- Assert status codes, response bodies, side effects, and permissions.
- Run against a disposable local site.
