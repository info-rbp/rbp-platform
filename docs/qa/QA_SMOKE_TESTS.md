# QA Smoke Tests

## Public Route Checks

| Route | Expected |
| --- | --- |
| `/` | Home loads without console errors. |
| `/applications` | Applications show coming soon or register interest states. |
| `/membership` | Membership content loads and Stripe QA/test wording is visible where applicable. |
| `/offers` | Offers listing loads. |
| `/help` | Help content loads. |

## Auth Checks

| Scenario | Expected |
| --- | --- |
| Guest opens portal route | Redirected or blocked by auth gate. |
| QA free user signs in | Portal dashboard loads with free membership state. |
| QA premium user signs in | Portal dashboard loads with premium membership state. |
| Sign out | Session clears and protected routes are blocked. |

## Portal Checks

| Route | Expected |
| --- | --- |
| `/portal/dashboard` | Dashboard loads current membership, billing, and service activity. |
| `/portal/apps` | Applications show next rollout/register interest only. |
| `/portal/membership/checkout` | Checkout form validates required fields and terms acceptance. |
| `/portal/notifications` | Notifications list loads for authenticated users. |

## Stripe Checkout Checks

| Scenario | Expected |
| --- | --- |
| Premium checkout submitted | Backend creates a Stripe Checkout Session in test mode. |
| Successful test card checkout | User returns to confirmation state and payment event is recorded. |
| Failed payment test card | Failure state is recorded and notification is queued/sent to QA allowlist only. |
| Cancel checkout | User returns to checkout without activating paid benefits. |

## Application Interest Checks

| Scenario | Expected |
| --- | --- |
| Guest registers interest with email | Interest record is created and notification uses sandbox/allowlist controls. |
| Authenticated user registers interest | Interest record is linked to user and tenant where available. |
| Duplicate interest review | Admin can identify existing interest before contacting customer. |

## Email Checks

| Scenario | Expected |
| --- | --- |
| Payment success | QA inbox receives `[RBP QA]` payment success email. |
| Payment failure | QA inbox receives `[RBP QA]` payment failure email. |
| Application interest | QA inbox receives `[RBP QA]` application interest email. |
| Service request | QA inbox receives `[RBP QA]` service request email. |
| Unapproved recipient | Email is blocked or redirected and logged. |

## Admin/Frappe Desk Checks

| Area | Expected |
| --- | --- |
| Applications | Seeded records are visible and provisioning is disabled. |
| Membership Plan | Premium plan has the Stripe test price ID. |
| Payment Event | Raw Stripe payload is visible only to admin roles. |
| Notification Delivery | Delivery attempts and failures are logged. |
