# Security Permission Tests

| ID | Test | Expected |
| --- | --- | --- |
| SEC-001 | Guest calls portal APIs such as subscription status. | Request is rejected with auth/permission error. |
| SEC-002 | Guest calls admin APIs. | Request is rejected with auth/permission error. |
| SEC-003 | Customer opens admin route or Desk workspace. | Access is denied. |
| SEC-004 | Customer requests another tenant's records by ID. | Access is denied or returns no data. |
| SEC-005 | Guest submits application interest with email. | Allowed only for the public interest endpoint. |
| SEC-006 | Customer submits application interest. | Record is linked to that user/tenant. |
| SEC-007 | Customer reads payment summary. | Raw Stripe payload is not returned. |
| SEC-008 | Customer opens Payment Event raw payload in Desk/API. | Access is denied. |
| SEC-009 | Stripe webhook is called without signature. | Request is rejected. |
| SEC-010 | Stripe webhook is called with invalid signature. | Request is rejected. |
| SEC-011 | Same Stripe webhook event is delivered twice. | Duplicate event is idempotent and does not create a second payment event. |
| SEC-012 | Applications provisioning flag is disabled. | No customer provisioning action is visible or executable. |
| SEC-013 | Backend config exposes runtime metadata. | No secret key, webhook secret, SMTP password, token, or raw payload is exposed. |
