# Cloudflare Frontend QA Evidence

Last updated: 2026-05-17 16:29 AWST

## Scope

- QA URL tested: `https://rbp-platform.pages.dev/`
- Working branch: `fix/cloudflare-auth-fetch-failure`
- Base commit tested before local code changes: `7b0201a`
- Browser: Playwright Chromium
- Diagnostic report: `tmp/qa/cloudflare-auth-fetch-diagnostic.json`
- Console log: `tmp/qa/cloudflare-auth-fetch-console.log`
- Network log: `tmp/qa/cloudflare-auth-fetch-network.log`

## Result

`Failed to fetch` is reproduced on the deployed Cloudflare Pages site.

Sign-in and signup both fail before an Appwrite response is available to the browser:

- `POST https://syd.cloud.appwrite.io/v1/account/sessions/email`
- `POST https://syd.cloud.appwrite.io/v1/account`

Both requests fail as browser `fetch` requests with `net::ERR_FAILED`. The browser console reports that requests from origin `https://rbp-platform.pages.dev` were blocked by CORS because the Appwrite response did not include `Access-Control-Allow-Origin`.

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

## Fix Applied In Code

Code changes were applied to improve diagnosability and prevent this class of failure from being hidden:

- Added safe frontend diagnostics for public Appwrite config state.
- Extended the QA banner with Appwrite endpoint host and loaded/missing booleans for project, database, storage, and mock fallback.
- Updated Appwrite auth error handling so browser network/CORS failures are surfaced as Appwrite network/CORS diagnostics instead of only `Failed to fetch`.
- Added runtime tests proving required Appwrite config detection, mock fallback disabled state, secret-safe diagnostics, and Appwrite auth network error messaging.

## Deployment / Redeploy Evidence

No Cloudflare redeploy was triggered from this session.

Cloudflare Pages CLI inspection was blocked because `CLOUDFLARE_API_TOKEN` is not set in this non-interactive environment. The deployed bundle was inspected directly with `curl`, which confirmed the live Cloudflare build already contains the expected public Appwrite configuration.

## Retest Status

Retest against `https://rbp-platform.pages.dev/` still fails until Appwrite allows the Cloudflare Pages origin.

- Signup: FAIL, blocked by Appwrite CORS/origin handling.
- Sign-in: FAIL, blocked by Appwrite CORS/origin handling.
- Portal/admin/Stripe UI testing: BLOCKED by auth.

## Screenshots

- `docs/qa/screenshots/cloudflare-frontend-qa/auth-fetch-failure-signin.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/auth-fetch-failure-signup.png`

## Required Next Action

In Appwrite Console, confirm the QA project has a Web platform entry for:

- `rbp-platform.pages.dev`

After saving that platform/origin setting, retest the deployed Cloudflare site. Do not mark frontend QA as PASS until browser sign-in or signup succeeds on `https://rbp-platform.pages.dev/`.
