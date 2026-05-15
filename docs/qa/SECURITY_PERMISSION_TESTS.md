# Security and Permission Tests

This runbook is retained from the superseded QA readiness artifacts because it gives the human QA operator concrete security checks that are not fully duplicated by `docs/qa/FINAL_QA_READINESS_ACTION_REGISTER.md`.

## Rules

- Use dedicated QA accounts only.
- Never record passwords, secret keys, webhook secrets, SMTP passwords, or raw card data.
- Mark blocked checks as `Blocked`, not `Pass`.
- Capture evidence for each test.

## Test matrix

| ID | Test | Expected |
| --- | --- | --- |
| SEC-001 | Guest calls protected portal APIs. | Request is rejected with auth/permission error. |
| SEC-002 | Guest calls billing APIs. | Checkout/session/payment summary actions are denied or return no sensitive data. |
| SEC-003 | Guest calls admin APIs. | Request is rejected. |
| SEC-004 | Customer opens `/admin/dashboard` or Frappe Desk. | Access is denied. |
| SEC-005 | Customer calls admin APIs. | Permission denial. |
| SEC-006 | Customer A requests Customer B tenant records by ID. | Access denied or record not found. |
| SEC-007 | Customer list endpoint is called with foreign tenant filters. | Foreign tenant data is not returned. |
| SEC-008 | Stripe webhook is called without signature. | Request rejected; no payment/subscription/entitlement mutation. |
| SEC-009 | Stripe webhook is called with invalid signature. | Request rejected. |
| SEC-010 | Same Stripe webhook event is delivered twice. | Idempotent handling; no duplicate payment event or duplicate entitlement grant. |
| SEC-011 | Applications provisioning action is attempted by customer. | Action absent or denied; no provisioning record created. |
| SEC-012 | Application interest is submitted by public guest. | Only the approved interest endpoint is allowed. |
| SEC-013 | Application interest is submitted by customer. | Interest record is linked to expected user/tenant where applicable. |
| SEC-014 | Customer attempts to read raw payment event/webhook payload. | Raw provider payload is not exposed. |
| SEC-015 | Runtime config endpoint is inspected. | No secret key, webhook secret, SMTP password, token, or raw `.env` value is exposed. |
| SEC-016 | Protected route metadata is inspected. | Portal/admin/signin/signup/signout protections and noindex behavior match the SEO/security plan. |

## Evidence template

| ID | Actor | Route/API | Method | Expected | Actual | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-001 | Guest | Protected portal API | HTTP | Denied |  | Not Run |  |
| SEC-008 | Stripe test replay | Webhook endpoint | HTTP POST | Rejected without valid signature |  | Not Run |  |
| SEC-011 | Customer | Applications provisioning | UI/API | Denied or unavailable |  | Not Run |  |

## Required supporting proof

- Two separate customer accounts from different tenants.
- One admin/Frappe Desk account.
- Stripe CLI or dashboard test webhook replay path.
- QA logs or Frappe Desk record IDs for denied/accepted actions.
- Confirmation that Applications remain delayed/register-interest only.
- Confirmation that no live payment behavior is enabled in QA.
