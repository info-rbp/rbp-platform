# Cloudflare Frontend QA Evidence

Last updated: 2026-05-17 20:40 AWST

## Scope

- QA URL tested previously: `https://rbp-platform.pages.dev/`
- Working branch: `fix/appwrite-permission-reconciliation-clean`
- Browser evidence currently documented from earlier pass: commit `0e1462b`
- This document now includes a later remote source-code remediation pass performed against the same branch.

## Remote Source-Code Remediation Pass

This pass updated repository source and test coverage through remote GitHub patching only. It did not run live Cloudflare, Appwrite, Stripe, or browser commands from the current environment.

Files updated in the remote remediation pass:

- `frontend/portal/src/app/lib/appwrite/functions.ts`
- `frontend/portal/src/app/services/api/appwrite/appwriteBillingApi.ts`
- `frontend/portal/src/app/components/Navbar.tsx`
- `frontend/portal/src/app/data/publicNavigation.ts`
- `frontend/portal/src/app/services/api/appwrite/appwriteApplicationsApi.ts`
- `frontend/portal/src/app/services/api/appwrite/appwriteNotificationsApi.ts`
- `frontend/portal/src/app/pages/BusinessApplicationsPage.tsx`
- `frontend/portal/src/app/pages/portal/PortalLayout.tsx`
- `frontend/portal/src/app/routes.tsx`
- `frontend/portal/src/app/types/portal.ts`
- `frontend/portal/public/sitemap.xml`
- `tests/runtime/appwrite-function-response.test.ts`
- `tests/runtime/frontend-qa-remediation.test.ts`
- `tests/schema/sitemap.test.mjs`
- `docs/qa/CLOUDFLARE_FRONTEND_QA_DEFECTS.md`
- `docs/qa/CLOUDFLARE_FRONTEND_QA_EVIDENCE.md`

## Tests Added Or Updated In Source

Added:

- `tests/runtime/appwrite-function-response.test.ts`
- `tests/runtime/frontend-qa-remediation.test.ts`
- `tests/schema/sitemap.test.mjs`

Covered behaviors:

- Appwrite Function raw payload, success envelope, failure envelope, and invalid JSON handling.
- Navbar authenticated vs guest CTA resolution.
- Application-interest success/error helper messaging.
- Operations navigation protected-link regression coverage.
- Portal notification normalisation and unread counting helpers.
- Portal identity helper.
- Sitemap public-route inclusion and protected-route exclusion.

## Validation Status

Validated in this pass:

- Repository source updated remotely.
- Static test coverage added for the source changes listed above.

Not validated in this pass:

- `npm run test:unit`
- `npm run test:integration`
- `npm run appwrite:schema:validate`
- `npm run appwrite:permissions:validate`
- `npm run appwrite:functions:validate`
- `npm run appwrite:seed:validate`
- `npm run appwrite:stripe-plan-mapping:validate`
- `npm run cloudflare:env:validate`
- `cd frontend/portal && npm run build`
- browser QA
- Stripe checkout redirect
- Stripe webhook return flow
- Appwrite live notification reads/writes
- Cloudflare `/sitemap.xml` HTTP 200 verification

Reason:

- The current environment did not have a runnable local checkout or live QA access for Cloudflare/Appwrite/Stripe execution.

## What Still Requires Live QA

- Premium membership checkout must redirect to Stripe test checkout from deployed QA.
- Free membership must activate without Stripe when `requires_checkout: false` is returned.
- Logged-in public header must show `Go to Account` on deployed QA for desktop and mobile.
- Application-interest registration must create a live Appwrite record, success notification, and admin-visible entry.
- Portal bell must list live notifications and allow mark-read/mark-all-read actions.
- `/admin` must be checked in browser for logged-out, customer, and admin states.
- `/sitemap.xml` must return 200 from Cloudflare QA and match the updated route list.

## Existing Browser Evidence

The earlier root QA evidence below remains historically useful, but it does not cover the new source fixes in this later remote pass:

- Appwrite CORS passed on root.
- Sign-in completed and redirected to `/portal/dashboard`.
- Dashboard remained visible after hydration and refresh.
- Logout redirected to `/signin`.

Historical evidence artifacts:

- `tmp/qa/cloudflare-root-dashboard-verification.json`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-signin.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-dashboard-stable.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-dashboard-state-check.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-dashboard-refresh.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-logout.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-signin-retest.png`

## Conclusion

The branch now contains additional source-code remediation and static coverage for several frontend P0/P1 defects, but live QA evidence has not yet been refreshed for these new changes. The application is not ready for QA sign-off or production readiness from this pass alone. It is ready for a targeted QA re-test once the branch is built and deployed to the live QA environment.
