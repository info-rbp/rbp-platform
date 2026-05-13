# QA Smoke Tests

## Scope
This runbook is for launch-readiness validation of `info-rbp/rbp-platform` against the QA environment. Record evidence for every step. Do not mark a test as passed when it was not executed.

## Preconditions
- QA URL is known and reachable.
- Customer test account is available.
- Admin/Frappe Desk account is available.
- Stripe test products, prices, and webhook are configured.
- Email sandbox/allowlist is configured.
- QA backend and frontend are deployed from the intended candidate commit.

## Evidence to capture for every test
- Date and tester
- URL or route
- User role used
- Expected result
- Actual result
- Pass, Fail, or Blocked
- Screenshot, console note, log note, or record ID where applicable

## 1. Public Route Smoke Tests
Test these routes as guest:
- `/`
- `/about`
- `/contact`
- `/core-services`
- `/core-services/decision-desk`
- `/core-services/risk-advisor`
- `/core-services/the-fixer`
- `/docushare`
- `/document-nucleus/overview`
- `/operations/connectivity/nbn-phone`
- `/marketplace`
- `/membership`
- `/applications`
- `/offers`
- `/resources`
- `/help`
- `/legal/privacy-policy`
- `/legal/terms`

Checks:
- Page returns HTTP 200.
- No fatal JavaScript error is shown.
- Page title is present.
- Meta description is present.
- Canonical tag is present.
- Page is indexable unless intentionally protected.
- `/applications` shows coming-soon or register-interest messaging only.
- `/applications` does not show `Open app`, `Launch app`, `Available now`, `Request setup`, or `Provision instantly`.

## 2. Auth and Route Protection Tests
Guest checks:
- `/signin` is accessible.
- `/signup` is accessible.
- `/portal/dashboard` redirects to sign-in or sign-up with `returnTo`.
- `/admin/signin` is accessible.
- `/admin/dashboard` is blocked.

Customer checks:
- Customer can sign in.
- Customer can access `/portal/dashboard`.
- Customer cannot access `/admin/dashboard`.
- `returnTo` returns the user to the original protected route after sign-in.

Admin checks:
- Admin can sign in at `/admin/signin` or through Frappe Desk.
- Admin can access admin routes or Frappe Desk.
- Admin auth is separate from customer auth.
- Admin and customer sessions do not grant each other’s permissions.

## 3. Stripe Membership Checkout Tests
Route:
- `/portal/membership/checkout`

Checks:
- Membership plan can be selected.
- Frontend calls `rbp_app.api.billing.create_membership_checkout_session`.
- Response includes `checkout_url` or `url`.
- Stripe Checkout opens in test mode.
- Stripe test card completes payment.
- Success redirect returns to the expected confirmation route.
- Webhook is received and verified.
- `RBP Payment Event` record exists.
- `RBP Subscription` becomes active.
- `RBP App Entitlement` is granted.
- Email is sent or logged to sandbox allowlist.
- Portal dashboard reflects active membership.

Mandatory note:
- If Stripe is enabled, mock checkout or mock success is not acceptable evidence.

## 4. Applications Interest Tests
Admin setup:
- Create or edit an Application in Frappe Desk or admin tools.
- Set status to `Register Interest` or `Coming Soon`.
- Set `provisioning_enabled=false`.
- Set `interest_enabled=true`.

Public checks:
- `/applications` shows the Application in coming-soon or register-interest state.
- Public user can submit interest.
- Success message is shown.

Portal checks:
- Signed-in customer can open `/portal/apps`.
- Portal shows next-rollout or register-interest messaging.
- Signed-in customer can submit interest.
- Success message is shown.

Admin verification:
- `RBP Application Interest` record exists for public and portal submissions.
- No provisioning request was created.

## 5. Service Request Flow Tests
Run as authenticated customer or member:
- Decision Desk
- DocuShare
- NBN or connectivity
- Risk Advisor
- The Fixer
- Marketplace listing
- Marketplace enquiry
- Support request

Checks per flow:
- Public CTA leads to account gate when required.
- Sign-in returns the user to the intended flow.
- Form can be submitted.
- Backend record is created.
- Reference ID is generated and shown on confirmation screen.
- Portal dashboard reflects the request.
- Admin/Frappe Desk can inspect the request.
- Notification or email is created when enabled.

## 6. Email Notification Tests
Scenarios:
- Membership payment success
- Membership payment failure
- Application interest submitted
- Service request submitted
- Admin status update where applicable

Checks:
- Email notification feature is enabled.
- Sandbox mode is enabled.
- Delivery goes only to QA allowlist.
- `RBP Notification` and `RBP Notification Delivery` records are created where expected.
- No production recipient receives QA traffic.

## 7. Admin and Frappe Desk Checks
Checks:
- Frappe Desk is reachable.
- Admin can inspect subscriptions, payment events, application interest, notifications, and service requests.
- Admin-facing state does not contradict customer-facing state.
- If React `/admin` is enabled, it must not claim capabilities that are not backed by Frappe.

## Result Summary Template
| Test Area | Route or Record | Role | Expected | Actual | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Public smoke | `/applications` | Guest | Interest-only messaging |  | Not Run |  |
| Auth | `/portal/dashboard` | Guest | Redirect with `returnTo` |  | Not Run |  |
| Billing | `/portal/membership/checkout` | Customer | Stripe Checkout opens |  | Not Run |  |
| Applications | `RBP Application Interest` | Customer | Record created |  | Not Run |  |
| Service flow | `Decision Desk` | Customer | Backend record created |  | Not Run |  |
| Email | `RBP Notification Delivery` | Admin | Sandbox delivery logged |  | Not Run |  |
| Admin | `Frappe Desk` | Admin | Records inspectable |  | Not Run |  |