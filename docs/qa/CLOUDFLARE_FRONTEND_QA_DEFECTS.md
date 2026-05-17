# Cloudflare Frontend QA Defects

Last updated: 2026-05-17 18:24 AWST

## DEFECT: Signup/sign-in fail with Failed to fetch

Severity: Critical

Status: RESOLVED on root QA URL

Route:
- sign-in
- signup / Join Now

Expected:
- Browser can create/login Appwrite session against QA Appwrite project.

Actual:
- Earlier root testing showed browser `Failed to fetch` and Appwrite CORS failures.

Root cause:
- Appwrite origin/platform configuration initially did not allow the Cloudflare root origin.

Fix:
- Appwrite origin/platform configuration was corrected outside this terminal session.
- Frontend auth diagnostics were also improved to surface Appwrite network/CORS failures clearly.

Retest:
- PASS at 2026-05-17 18:24 AWST on `https://rbp-platform.pages.dev/`.
- Login completed and redirected to `/portal/dashboard`.

Evidence:
- `tmp/qa/cloudflare-root-dashboard-verification.json`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-signin.png`

## DEFECT: Portal dashboard crashes after login because Appwrite envelope is persisted as portal state

Severity: Critical

Status: RESOLVED on root QA URL

Route:
- `/portal/dashboard`

Expected:
- After login, the portal dashboard receives or reads a `PortalDashboardState` with `customer`, `activities`, `notifications`, `membershipStatus`, and `membershipPlan`.
- The dashboard remains visible after async hydration and refresh.

Actual:
- Earlier browser evidence showed `rbp.mockPortalState` containing `{ ok, message, data }`.
- `portal.customer`, `portal.activities`, and `portal.notifications` were undefined.
- `PortalDashboard` crashed when reading `portalState.customer.name`.

Root cause:
- `appwritePortalApi.getDashboardState()` / `mockPortalService.getDashboard()` treated the Appwrite function response envelope as the dashboard state and persisted it directly into `rbp.mockPortalState`.

Fix:
- Added `frontend/portal/src/app/services/api/portalDashboardState.ts` with `unwrapPortalDashboardPayload()` and `normalisePortalDashboardState()`.
- Handles raw dashboard state, Appwrite `{ ok, message, data }` envelopes, `{ data }`, `{ result }`, and `{ portalState }`.
- Updated `appwritePortalApi.getDashboardState()` to unwrap function responses before returning dashboard data.
- Updated `mockPortalService.getDashboard()` and `readPortalState()` to normalise before writing or returning session storage state.
- Hardened `PortalDashboard` with safe customer, business name, activities, and notifications fallbacks.

Retest:
- PASS in local automated tests.
- PASS in browser on `https://rbp-platform.pages.dev/` after production/root deployment.
- Dashboard remained visible after 10 seconds of hydration.
- Refresh kept `/portal/dashboard` stable.
- State check showed `customer` present, `activities` array true, `notifications` array true, and old wrapper false.

Evidence:
- `tests/runtime/portal-dashboard-state.test.ts`
- `tmp/qa/cloudflare-root-dashboard-verification.json`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-dashboard-stable.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-dashboard-state-check.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-dashboard-refresh.png`

## DEFECT: Active Appwrite session blocks sign-in

Severity: Critical

Status: RESOLVED on root QA URL

Route:
- `/signin`

Expected:
- If Appwrite already has an active session for the same email, sign-in reuses it.
- If Appwrite has an active session for a different email, the frontend deletes it before creating the new session.

Actual:
- Earlier testing could fail with an active-session creation error.

Root cause:
- The sign-in flow tried to create an Appwrite email/password session without first handling an existing active Appwrite session.

Fix:
- `appwriteAuthApi.signIn()` now checks the current Appwrite account.
- It returns success when the active account email matches the submitted email.
- It deletes a different active session before creating a new one.

Retest:
- PASS at 2026-05-17 18:24 AWST on `https://rbp-platform.pages.dev/`.
- Active-session sign-in retest passed.
- No `Creation of a session is prohibited when a session is active` error was observed.

Evidence:
- `tmp/qa/cloudflare-root-dashboard-verification.json`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-signin-retest.png`

## DEFECT: Root production still serves old Cloudflare bundle

Severity: Critical

Status: RESOLVED

Route:
- `https://rbp-platform.pages.dev/`

Expected:
- Root production serves the fixed frontend bundle containing dashboard normalisation and active-session sign-in handling.

Actual:
- Earlier root production served `/assets/index-CjyNwKW7.js`.
- The fixed local/preview build served `/assets/index-CATcRwLF.js`.

Root cause:
- Initial Wrangler deployments created Preview deployments only; the fixed build had not been deployed to the Cloudflare production/root URL.

Fix:
- Confirmed Cloudflare Pages production branch is `main`.
- Deployed fixed build with `npx wrangler pages deploy dist --project-name rbp-platform --branch main`.

Retest:
- PASS at 2026-05-17 18:24 AWST.
- Root now serves `/assets/index-CATcRwLF.js`.
- Root no longer serves old bundle `/assets/index-CjyNwKW7.js`.

Evidence:
- `tmp/cloudflare-root-check/index.html`
- `tmp/cloudflare-root-check/js-assets.txt`

## DEFECT: Cloudflare preview fixed bundle is blocked by Appwrite CORS

Severity: Medium

Status: OPEN, not blocking root QA

Route:
- preview `/signin`
- preview `/portal/dashboard`

Expected:
- Browser can sign in against fixed Cloudflare preview deployments when preview QA is required.

Actual:
- Immutable preview `https://64907e02.rbp-platform.pages.dev` served fixed bundle `/assets/index-CATcRwLF.js`.
- Alias preview `https://fix-appwrite-permission-reco-44v1.rbp-platform.pages.dev` served fixed bundle `/assets/index-CATcRwLF.js`.
- Both preview origins failed before login completed because Appwrite CORS blocked:
  - `GET https://syd.cloud.appwrite.io/v1/account`
  - `POST https://syd.cloud.appwrite.io/v1/account/sessions/email`

Root cause:
- Appwrite Web platform/origin settings do not allow the Cloudflare preview hostnames.

Fix:
- Add Appwrite Web platform/origin entries for preview hostnames if preview browser QA is required.
- Root QA can proceed because `https://rbp-platform.pages.dev/` now serves the fixed bundle and is accepted by Appwrite.

Retest:
- FAIL for preview at 2026-05-17 18:05 AWST.
- PASS for root at 2026-05-17 18:24 AWST.

Evidence:
- `tmp/qa/cloudflare-preview-dashboard-verification.json`
- `docs/qa/screenshots/cloudflare-frontend-qa/preview-signin.png`

## DEFECT: Cloudflare/Appwrite platform verification blocked from terminal

Severity: Medium

Status: PARTIAL

Route:
- Appwrite Console / Cloudflare Pages settings

Expected:
- CLI access can verify Cloudflare Pages settings and Appwrite platform/origin settings.

Actual:
- Cloudflare CLI verification works and confirmed the `rbp-platform` Pages project plus production branch `main`.
- Appwrite CLI project/platform inspection still requires an authenticated Appwrite Console session.

Root cause:
- Required Appwrite Console credentials are not available in this terminal session.

Fix:
- Use Appwrite Console or an authenticated Appwrite CLI session for platform/origin checks.

Retest:
- PARTIAL at 2026-05-17 18:24 AWST.
