# Security and Permission Tests

## Scope
This runbook verifies guest, customer, admin, tenant, billing, webhook, and application-provisioning controls for the QA launch candidate.

## Execution rules
- Use dedicated QA test accounts.
- Never record passwords, secret keys, or webhook secrets.
- Record evidence for every check.
- If a control cannot be exercised because access is missing, mark it `Blocked: access required`.

## Evidence fields
- Test name
- Endpoint or route
- Role or actor
- Method used
- Expected result
- Actual result
- Status
- Evidence reference

## 1. Guest API Access Checks
Goal:
- Guests must be denied from customer-only or admin-only APIs unless an endpoint is explicitly public.

Test steps:
- Call protected portal APIs as guest.
- Call billing APIs as guest.
- Call admin APIs as guest.
- Call application-interest admin APIs as guest.

Expected:
- Protected endpoints return permission denial or unauthenticated response.
- Public endpoints return only public-safe data.

## 2. Customer Admin Access Denial
Goal:
- Customer accounts must not be able to access admin routes or admin APIs.

Test steps:
- Sign in as customer.
- Open `/admin/dashboard`.
- Call admin APIs used by admin pages.
- Attempt to access Frappe Desk.

Expected:
- Admin routes are denied or redirected.
- Admin APIs return permission denial.
- Frappe Desk is inaccessible to customer role.

## 3. Cross-Tenant Access Checks
Goal:
- One customer must not be able to access another customer’s records.

Test steps:
- Use two QA customer accounts tied to different tenants.
- Attempt to open or query another tenant’s request, membership, notification, application-interest, or document record by ID.
- Attempt any list endpoint with foreign tenant identifiers where possible.

Expected:
- Access is denied or record is not found.
- No foreign tenant data is returned in list or detail views.

## 4. Unauthenticated Billing Call Checks
Goal:
- Billing actions must require authentication.

Test steps:
- As guest, call `rbp_app.api.billing.create_membership_checkout_session`.
- As guest, call subscription-status and payment-summary APIs.
- As guest, call cancel-subscription API.

Expected:
- Checkout-session creation is denied.
- Subscription and payment summary are denied or return no sensitive data.
- Cancel subscription is denied.

## 5. Unsigned Stripe Webhook Rejection
Goal:
- Stripe webhook processing must reject requests without a valid `Stripe-Signature`.

Test steps:
- POST a realistic but unsigned payload to the webhook endpoint.
- Inspect response, logs, and any payment-event records.

Expected:
- Request is rejected.
- No payment event, subscription update, entitlement update, or notification is created.

## 6. Duplicate Stripe Webhook Handling
Goal:
- Replayed Stripe events must be idempotent.

Test steps:
- Trigger or replay the same Stripe test event twice.
- Inspect `RBP Payment Event`, `RBP Subscription`, and entitlement records.

Expected:
- One event is recorded for the provider event ID.
- Subscription state is not duplicated or incorrectly mutated.
- Notification delivery is not duplicated without reason.

## 7. Applications Provisioning Denial
Goal:
- Customers must not be able to provision Applications in launch QA.

Test steps:
- Inspect public `/applications` UI.
- Inspect `/portal/apps` UI as customer.
- Attempt any known provisioning endpoint or action.
- Inspect created records after interest submission.

Expected:
- Provisioning actions are absent or denied.
- Only register-interest behavior is available.
- No provisioning request record is created from customer interaction.

## 8. Route Protection and Noindex Checks
Goal:
- Protected routes are not publicly indexable and are not accessible to the wrong role.

Routes:
- `/portal/dashboard`
- `/admin/dashboard`
- `/signin`
- `/signup`
- `/signout`

Expected:
- Role protection works.
- Protected routes include `noindex,nofollow` metadata.
- `robots.txt` disallows `/portal/`, `/admin/`, `/signin`, `/signup`, and `/signout`.

## Result Table
| Test | Method | Expected | Actual | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| Guest portal API access | Guest HTTP call | Denied |  | Not Run |  |
| Customer admin route access | Customer browser test | Denied |  | Not Run |  |
| Cross-tenant record access | Two-customer record lookup | Denied or not found |  | Not Run |  |
| Guest billing checkout call | Guest HTTP call | Denied |  | Not Run |  |
| Unsigned Stripe webhook | POST without signature | Rejected |  | Not Run |  |
| Duplicate Stripe webhook | Replay same test event | Idempotent |  | Not Run |  |
| Application provisioning attempt | UI and API attempt | Denied or unavailable |  | Not Run |  |
| Protected route noindex | Route and metadata inspection | `noindex,nofollow` present |  | Not Run |  |