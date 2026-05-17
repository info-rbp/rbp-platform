# Cloudflare Frontend QA Defects

Last updated: 2026-05-17 20:40 AWST

## Current status

This document now separates source-code remediation from live QA proof.

Source-code remediation completed in branch `fix/appwrite-permission-reconciliation-clean`:

- Appwrite Function response handling now unwraps `{ ok, message, data }` envelopes and throws structured failures.
- Public Operations navigation no longer links directly to `/portal/services/nbn/start`.
- Application-interest API responses are normalised for `interest_id`, `application`, and duplicate registration handling.
- Portal notification API adapters are normalised for `list_my_notifications`, `mark_notification_read`, and `mark_all_notifications_read`.
- Public navbar source is now auth-aware and supports a logged-in `Go to Account` state.
- Portal layout source now uses live auth API lookups for current user identity and sign-out, and includes a wired notification panel.
- `/admin` source handling now has explicit index behavior instead of falling through to a blank admin outlet.
- Sitemap source coverage and static validation have been expanded.

Live validation is still required for all Appwrite, Stripe, Cloudflare, and browser behaviors listed below.

## DEFECT: Appwrite function envelope handling breaks frontend function-backed flows

Severity: Critical

Status: SOURCE FIXED, LIVE QA REQUIRED

Affected areas:
- membership checkout
- application-interest registration
- notifications actions
- any Appwrite Function consumer expecting direct payloads

Root cause:
- The frontend helper returned the full Appwrite envelope instead of the nested `data` payload.

Source fix:
- `frontend/portal/src/app/lib/appwrite/functions.ts`
- Added `AppwriteFunctionEnvelope` and `AppwriteFunctionError`.
- `invokeAppwriteFunction()` now unwraps `{ ok, message, data }` responses, preserves raw payload support, supports direct `data`, and fails clearly on invalid JSON or empty responses.

Added tests:
- `tests/runtime/appwrite-function-response.test.ts`

Still requires live QA validation:
- Premium checkout receives `checkout_url` and redirects in browser.
- Application interest confirms success in deployed QA.
- Notification actions return live Appwrite data in deployed QA.

## DEFECT: Operations menu links directly into a protected portal route

Severity: High

Status: SOURCE FIXED, LIVE QA REQUIRED

Root cause:
- Public navigation linked directly to `/portal/services/nbn/start`.

Source fix:
- `frontend/portal/src/app/data/publicNavigation.ts`
- Replaced the public Operations CTA with `/operations/connectivity/nbn-phone/connect-now`.

Added tests:
- `tests/runtime/frontend-qa-remediation.test.ts`

Still requires live QA validation:
- Desktop and mobile Operations menus render the corrected route in Cloudflare QA.
- Public route smoke confirms no stale deployed menu bundle remains.

## DEFECT: Logged-in public header still shows Sign In / Join Now

Severity: High

Status: SOURCE FIXED, LIVE QA REQUIRED

Root cause:
- The public navbar was rendering static guest CTAs without checking the active auth provider.

Source fix:
- `frontend/portal/src/app/components/Navbar.tsx`
- Navbar now checks `authApi.getCurrentUser()`, supports a loading-safe state, and swaps guest CTAs for `Go to Account` / `Portal Dashboard` when a session exists.

Added tests:
- `tests/runtime/frontend-qa-remediation.test.ts`

Still requires live QA validation:
- Sign in -> return to home -> `Go to Account` visible.
- Mobile menu shows the same authenticated state.
- Sign out -> return home -> guest CTAs visible again.

## DEFECT: Application interest confirmation is weak and duplicate intent is not handled well

Severity: High

Status: SOURCE FIXED, LIVE QA REQUIRED

Root cause:
- The Appwrite response shape was not normalised and the public page did not lock the selected application after success.

Source fix:
- `frontend/portal/src/app/services/api/appwrite/appwriteApplicationsApi.ts`
- `frontend/portal/src/app/pages/BusinessApplicationsPage.tsx`
- Normalised `interest_id`, `application`, and `already_registered` handling.
- Added user-facing success/error message helpers.
- Added duplicate-click protection and persistent selected-card success state in-page.

Added tests:
- `tests/runtime/frontend-qa-remediation.test.ts`

Still requires live QA validation:
- Deployed page shows success message after registration.
- `application_interest` record exists in Appwrite.
- Admin list view exposes the created record.
- Notification is created for the current user or tenant.

## DEFECT: Portal bell is inert and notification list is not wired

Severity: High

Status: SOURCE FIXED, LIVE QA REQUIRED

Root cause:
- Portal layout showed a static bell without live notification API integration.

Source fix:
- `frontend/portal/src/app/services/api/appwrite/appwriteNotificationsApi.ts`
- `frontend/portal/src/app/pages/portal/PortalLayout.tsx`
- Normalised notification list responses and write actions.
- Portal header now opens a dropdown panel with loading, empty, error, unread count, mark-read, and mark-all-read states.

Added tests:
- `tests/runtime/frontend-qa-remediation.test.ts`

Still requires live QA validation:
- Welcome notification appears after signup.
- Service request notification appears after submission.
- Application interest notification appears after registration.
- Stripe success/failure notifications appear after webhook processing.

## DEFECT: Portal layout uses static user identity and mock-only sign-out

Severity: High

Status: SOURCE FIXED, LIVE QA REQUIRED

Root cause:
- Portal layout used a hardcoded `USER` object and `mockAuthService.signOut()`.

Source fix:
- `frontend/portal/src/app/pages/portal/PortalLayout.tsx`
- Current portal identity now comes from `authApi.getCurrentUser()`.
- Sign-out now calls the active auth API, clears cached customer auth state, clears pending intent, and emits an auth-change event.

Added tests:
- `tests/runtime/frontend-qa-remediation.test.ts`

Still requires live QA validation:
- Sign-out removes the Appwrite current session.
- Protected portal routes redirect after sign-out.
- Public navbar returns to guest state after sign-out.

## DEFECT: /admin index behavior is unclear

Severity: High

Status: SOURCE FIXED, LIVE QA REQUIRED

Root cause:
- `/admin` could fall through to an empty admin outlet rather than an explicit index behavior.

Source fix:
- `frontend/portal/src/app/routes.tsx`
- Added explicit admin index handling and protected admin dashboard redirect behavior.

Still requires live QA validation:
- Logged-out `/admin` redirects to `/admin/signin`.
- Non-admin customer sees a clear denial state.
- Admin user reaches `/admin/dashboard` from `/admin`.

## DEFECT: sitemap coverage is incomplete and static validation is missing

Severity: High

Status: SOURCE FIXED, LIVE QA REQUIRED

Root cause:
- Sitemap coverage was narrow and there was no repository check proving protected routes stayed excluded.

Source fix:
- `frontend/portal/public/sitemap.xml`
- `tests/schema/sitemap.test.mjs`
- Expanded public route coverage.
- Added automated sitemap include/exclude checks.

Still requires live QA validation:
- `/sitemap.xml` returns HTTP 200 from Cloudflare QA.
- XML validates in deployed QA.
- Cloudflare is serving the updated asset rather than a stale bundle or bad gateway path.

## Existing live-only defects still open

The following items remain unresolved until browser and environment validation is completed:

- Premium Stripe checkout redirect and browser proof.
- Free-plan activation path in deployed QA.
- Stripe return route, subscription state, webhook effects, entitlements, and notifications.
- Cloudflare menu bundle freshness across desktop and mobile.
- Admin browser QA with seeded admin credentials.
- Email sandbox delivery evidence.
- Sitemap 200/Cloudflare route verification.
- Full UAT and QA sign-off.
