# QA Smoke Tests

This runbook is retained from the superseded QA readiness artifacts because it is useful operational material not covered in full by `docs/qa/FINAL_QA_READINESS_ACTION_REGISTER.md`.

Do not mark any item passed unless it was actually executed and evidence was captured.

## Preconditions

- QA frontend URL is reachable.
- Appwrite QA endpoint, project, database, API key, and deployed Functions are reachable.
- Customer test account exists and has Appwrite user/profile records.
- Admin account is a member of the Appwrite admin team, or a trusted internal token is configured for QA-only verification.
- Stripe test product, price, and webhook are configured.
- Email sandbox and allowlist are configured.
- Candidate frontend and backend commits are known.

## Automated Appwrite smoke commands

Default mode is prerequisite-only and safe for non-live CI:

```bash
npm run test:smoke:dry-run
npm run smoke:qa:auth
npm run smoke:qa:billing
npm run smoke:qa:stripe-webhook
npm run smoke:qa:service-requests
npm run smoke:qa:admin
npm run smoke:qa:permissions
```

Real execution mode requires QA secrets and may create QA records:

```bash
npm run smoke:qa:auth -- --execute
npm run smoke:qa:billing -- --execute
npm run smoke:qa:stripe-webhook -- --execute
npm run smoke:qa:service-requests -- --execute
npm run smoke:qa:admin -- --execute
npm run smoke:qa:permissions -- --execute
npm run smoke:qa:email
```

In GitHub Actions, set `QA_SMOKE_EXECUTE=true` to pass `--execute`. Leave it unset or false for prerequisite-only validation.

## Evidence to capture

For every test, record:

- Date and tester.
- Route, endpoint, or record.
- User role.
- Expected result.
- Actual result.
- Status: Pass, Fail, or Blocked.
- Screenshot, log reference, record ID, or command output.

## Public route smoke matrix

Test as guest:

- `/`
- `/about`
- `/our-platform`
- `/discovery-call`
- `/work-with-us`
- `/work-for-us`
- `/contact`
- `/contact-us`
- `/offers`
- `/resources`
- `/help`
- `/marketplace`
- `/membership`
- `/applications`
- `/legal/privacy-policy`
- `/legal/terms`
- `/legal/terms-of-use`
- `/legal/services-policy`
- `/legal/terms-of-engagement`
- `/legal/payment-policy`
- `/signin`
- `/signup`
- `/robots.txt`
- `/sitemap.xml`

Expected:

- HTTP 200 or intended redirect.
- No fatal JavaScript error.
- Page title and metadata present where applicable.
- No placeholder-only copy.
- No live payment promise during QA.
- `/applications` remains delayed/register-interest only.
- Marketplace remains reviewed, gated, or enquiry-based.

## Protected route smoke matrix

Test as guest:

- `/portal/dashboard`
- `/admin/dashboard`
- `/admin/signin`

Expected:

- `/portal/dashboard` redirects or gates access.
- `/admin/dashboard` is blocked for guests and customers.
- `/admin/signin` is reachable if React admin sign-in remains in scope.
- Frappe Desk remains the operational admin backend.

## Membership and Stripe test-mode smoke

Required only after Stripe QA setup exists.

- Confirm membership plans exist in Appwrite.
- Confirm at least one free plan and one Stripe-backed paid plan exist.
- Confirm checkout starts through backend billing API.
- Confirm Stripe Checkout is in test mode.
- Complete with Stripe test card when dashboard/manual checkout proof is in scope.
- Execute fixture webhook proof for success, payment failure, subscription deletion, and duplicate replay.
- Confirm payment event, subscription, and entitlement records in Appwrite.
- Confirm notification is logged or sandbox-sent.

Do not accept mock success as Stripe proof.

## Applications interest smoke

- Confirm public `/applications` uses coming-soon/register-interest language.
- Submit public interest if enabled.
- Sign in and submit portal interest if enabled.
- Confirm `RBP Application Interest` or equivalent backend record exists.
- Confirm no provisioning request is created.

## Service and marketplace smoke

Run as authenticated customer/member where applicable:

- Decision Desk.
- DocuShare.
- Connectivity/NBN.
- Risk Advisor.
- The Fixer.
- Marketplace listing interest/request.
- Marketplace enquiry.
- Support request.

Expected:

- Account gates work where required.
- Submission creates a backend record.
- Confirmation shows reference ID where applicable.
- Frappe Desk/admin can inspect the record.
- Notification is logged or sandbox-sent if enabled.

## Result table

| Test area | Route or record | Role | Expected | Actual | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Public smoke | `/applications` | Guest | Interest-only messaging |  | Not Run |  |
| Auth | `/portal/dashboard` | Guest | Redirect or gate |  | Not Run |  |
| Billing | Membership checkout | Customer | Stripe test checkout starts |  | Not Run |  |
| Applications | Application interest record | Guest/customer | Interest record created, no provisioning |  | Not Run |  |
| Marketplace | Listing/enquiry | Customer/member | Reviewed/gated record flow |  | Not Run |  |
| Email | Notification delivery/log | Admin | Sandbox-safe delivery/log |  | Not Run |  |
| Admin | Frappe Desk | Admin | Records inspectable |  | Not Run |  |
