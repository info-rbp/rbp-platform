# Cloudflare Frontend QA Evidence

Last updated: 2026-05-17 18:05 AWST

## Scope

- QA URL tested: `https://rbp-platform.pages.dev/`
- Working branch: `fix/appwrite-permission-reconciliation-clean`
- Commit tested: `1d93da5`
- Browser: Playwright Chromium
- Diagnostic report: `tmp/qa/cloudflare-auth-fetch-diagnostic.json`
- Console log: `tmp/qa/cloudflare-auth-fetch-console.log`
- Network log: `tmp/qa/cloudflare-auth-fetch-network.log`

## Cloudflare Deployment Verification - 2026-05-17 18:05 AWST

Build environment validation:

- `VITE_BACKEND_PROVIDER`: loaded
- `VITE_APPWRITE_ENDPOINT`: loaded
- `VITE_APPWRITE_PROJECT_ID`: loaded
- `VITE_APPWRITE_DATABASE_ID`: loaded
- `VITE_APPWRITE_STORAGE_BUCKET_ID`: loaded
- `VITE_ENABLE_MOCK_FALLBACK`: loaded
- `VITE_QA_ENVIRONMENT`: loaded
- `VITE_CLOUDFLARE_ENVIRONMENT`: loaded
- `npm run cloudflare:env:validate`: PASS

Local fixed build:

- Build command: `npm run build` in `frontend/portal`
- JS asset: `/assets/index-CATcRwLF.js`
- CSS asset: `/assets/index-1Dz620UT.css`

Cloudflare Pages deployment:

- Wrangler command: `npx wrangler pages deploy dist --project-name rbp-platform`
- Immutable preview URL: `https://64907e02.rbp-platform.pages.dev`
- Alias URL: `https://fix-appwrite-permission-reco-44v1.rbp-platform.pages.dev`
- Cloudflare deployment environment: Preview
- Cloudflare deployment branch: `fix/appwrite-permission-reconciliation-clean`
- Cloudflare deployment source: `1d93da5`

Bundle checks:

- Immutable preview serves `/assets/index-CATcRwLF.js`.
- Alias preview serves `/assets/index-CATcRwLF.js`.
- Root production URL `https://rbp-platform.pages.dev/` still serves `/assets/index-CjyNwKW7.js`.
- Preview bundle differs from old root production bundle `index-CjyNwKW7.js`.
- The fixed preview bundle contains dashboard fallback/storage markers including `RBP Member`, `Your business`, and `rbp.mockPortalState`.

Browser preview QA:

- Target tested first: `https://64907e02.rbp-platform.pages.dev`
- Alias tested second: `https://fix-appwrite-permission-reco-44v1.rbp-platform.pages.dev`
- Result: FAIL before login completes.
- Cause: Appwrite CORS blocks both preview origins.
- Failed immutable preview requests:
  - `GET https://syd.cloud.appwrite.io/v1/account`
  - `POST https://syd.cloud.appwrite.io/v1/account/sessions/email`
- Failed alias preview requests:
  - `GET https://syd.cloud.appwrite.io/v1/account`
  - `POST https://syd.cloud.appwrite.io/v1/account/sessions/email`
- Browser console reports no `Access-Control-Allow-Origin` header for the preview origins.
- Active-session sign-in handling: not browser-proven on preview, because Appwrite CORS blocks sign-in before the active-session path can complete.

Dashboard state check:

- `portal.customer`: not available, because preview login is blocked by Appwrite CORS before redirect.
- `activities` array: not available, because preview login is blocked by Appwrite CORS before redirect.
- `notifications` array: not available, because preview login is blocked by Appwrite CORS before redirect.
- Old wrapper present: not checkable in preview browser state, because dashboard is not reached.

Screenshot:

- `docs/qa/screenshots/cloudflare-frontend-qa/preview-signin.png`

Current deployment conclusion:

- The fixed code is present in Cloudflare preview.
- Root production is not fixed because it still serves `index-CjyNwKW7.js`.
- Preview browser auth/dashboard QA is blocked until Appwrite allows the preview origins.
- Root browser dashboard QA must not continue until root production serves the fixed bundle.

## Result

`Failed to fetch` is reproduced on the deployed Cloudflare Pages site.

Sign-in and signup both fail before an Appwrite response is available to the browser:

- `POST https://syd.cloud.appwrite.io/v1/account/sessions/email`
- `POST https://syd.cloud.appwrite.io/v1/account`

Both requests fail as browser `fetch` requests with `net::ERR_FAILED`. The browser console reports that requests from origin `https://rbp-platform.pages.dev` were blocked by CORS because the Appwrite response did not include `Access-Control-Allow-Origin`.

Follow-up browser evidence after the Appwrite platform/origin correction shows login now succeeds and redirects to `/portal/dashboard`. The previous CORS issue appears resolved. The next blocker is a portal dashboard crash after login.

Session storage key `rbp.mockPortalState` contained an Appwrite function response envelope:

```json
{
  "ok": true,
  "message": "ok",
  "data": {}
}
```

The dashboard expected the actual portal state at the top level, for example `portalState.customer.name`, but the persisted top-level keys were `ok`, `message`, and `data`.

## Deployed Bundle Evidence

Downloaded Cloudflare assets under `tmp/qa/deployed-cloudflare/`.

The deployed frontend bundle contains:

- Backend provider: `appwrite`
- Appwrite endpoint host: `syd.cloud.appwrite.io`
- QA environment flag: loaded
- Mock auth/fallback: disabled
- Appwrite project, database, and storage bucket IDs: loaded as public Vite build values
- No active Frappe request target found in the deployed bundle search
- No localhost Appwrite endpoint found in the deployed bundle search

The bundle inspection rules out stale frontend Appwrite endpoint/project configuration as the cause of the current deployed browser auth failure.

## Root Cause

The deployed Cloudflare origin is not currently accepted by the Appwrite project for browser requests. Evidence: Appwrite requests from `https://rbp-platform.pages.dev` are blocked by CORS before any API status is exposed to the application.

In Appwrite Cloud this is resolved by adding or correcting the Web platform/origin for `rbp-platform.pages.dev` in the Appwrite project settings. This could not be changed from this terminal because the Appwrite CLI project/platform commands require an authenticated Appwrite Console session.

Follow-up root cause for the `/portal/dashboard` crash: `appwritePortalApi.getDashboardState()` and `mockPortalService.getDashboard()` allowed an Appwrite response envelope shaped like `{ ok, message, data }` to be treated as `PortalDashboardState` and persisted directly into `rbp.mockPortalState`.

## Fix Applied In Code

Code changes were applied to improve diagnosability and prevent this class of failure from being hidden:

- Added safe frontend diagnostics for public Appwrite config state.
- Extended the QA banner with Appwrite endpoint host and loaded/missing booleans for project, database, storage, and mock fallback.
- Updated Appwrite auth error handling so browser network/CORS failures are surfaced as Appwrite network/CORS diagnostics instead of only `Failed to fetch`.
- Added runtime tests proving required Appwrite config detection, mock fallback disabled state, secret-safe diagnostics, and Appwrite auth network error messaging.
- Added portal dashboard payload unwrapping and normalisation for raw dashboard state, `{ data }`, `{ result }`, `{ portalState }`, and Appwrite `{ ok, message, data }` envelopes.
- Updated Appwrite portal API and mock portal service so only normalised `PortalDashboardState` is written into `rbp.mockPortalState`.
- Hardened `PortalDashboard` customer, business name, activities, and notifications reads with safe fallbacks.

## Deployment / Redeploy Evidence

Cloudflare preview deploys were triggered and verified from this session. Cloudflare CLI access is available for Pages listing and preview deployment inspection.

Appwrite Console/platform inspection is still blocked from this terminal because `appwrite whoami` reports that no Appwrite user is signed in. The available project API key is not sufficient to inspect or update Web platform origin settings.

## Retest Status

Retest evidence after the Appwrite origin correction and dashboard normalisation deployment work:

- Root sign-in: not retested with the fixed code because root still serves old bundle `/assets/index-CjyNwKW7.js`.
- Preview sign-in: FAIL, blocked by Appwrite CORS for preview origins.
- Dashboard: fixed in code and present in preview bundle, but not browser-proven because preview login is blocked before `/portal/dashboard`.
- Local automated tests for the dashboard normalisation fix: PASS.
- Deployed dashboard browser retest: pending.

## Screenshots

- `docs/qa/screenshots/cloudflare-frontend-qa/auth-fetch-failure-signin.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/auth-fetch-failure-signup.png`

## Required Next Action

Required next actions:

- Add Appwrite Web platform/origin entries for the preview hosts if preview browser QA is required:
  - `64907e02.rbp-platform.pages.dev`
  - `fix-appwrite-permission-reco-44v1.rbp-platform.pages.dev`
- Promote or deploy the fixed build to the Cloudflare production/root branch only after confirming the intended production branch.
- After root serves the fixed bundle, retest `https://rbp-platform.pages.dev/`:
  - login succeeds
  - redirect reaches `/portal/dashboard`
  - dashboard appears
  - dashboard stays visible after async hydration
  - refresh `/portal/dashboard`
  - logout works
