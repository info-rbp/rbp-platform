# Cloudflare Frontend QA Defects

Last updated: 2026-05-17 16:29 AWST

## DEFECT: Signup/sign-in fail with Failed to fetch

Severity: Critical

Route:
- sign-in
- signup / Join Now

Expected:
- Browser can create/login Appwrite session against QA Appwrite project.

Actual:
- Browser shows `Failed to fetch`.
- Playwright Chromium captured failed Appwrite browser requests from `https://rbp-platform.pages.dev`.
- `POST https://syd.cloud.appwrite.io/v1/account/sessions/email` fails with `net::ERR_FAILED`.
- `POST https://syd.cloud.appwrite.io/v1/account` fails with `net::ERR_FAILED`.
- Browser console reports CORS blocking for origin `https://rbp-platform.pages.dev` because no `Access-Control-Allow-Origin` header is present on the Appwrite response.

Root cause:
- Appwrite is not allowing the deployed Cloudflare Pages origin for browser requests. The deployed frontend bundle contains the expected Appwrite endpoint/provider config, so the failure is not caused by an old Frappe endpoint, localhost endpoint, malformed URL, or missing public Vite Appwrite config.

Fix:
- Code fix applied for diagnostics only: frontend auth now reports Appwrite network/CORS failures clearly, and the QA banner exposes safe public Appwrite config state.
- Operational fix still required: add or correct the Appwrite Web platform/origin for `rbp-platform.pages.dev` in the QA Appwrite project, then retest the deployed Cloudflare site.

Retest:
- FAIL at 2026-05-17 16:29 AWST.
- Sign-in and signup remain blocked until Appwrite platform/CORS is corrected.

Evidence:
- `tmp/qa/cloudflare-auth-fetch-diagnostic.json`
- `tmp/qa/cloudflare-auth-fetch-console.log`
- `tmp/qa/cloudflare-auth-fetch-network.log`
- `docs/qa/screenshots/cloudflare-frontend-qa/auth-fetch-failure-signin.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/auth-fetch-failure-signup.png`

## DEFECT: Cloudflare/Appwrite platform verification blocked from terminal

Severity: Medium

Route:
- Appwrite Console / Cloudflare Pages settings

Expected:
- CLI access can verify deployed Cloudflare Pages env vars and Appwrite platform/origin settings.

Actual:
- `npx wrangler pages project list` fails because `CLOUDFLARE_API_TOKEN` is not set.
- Appwrite CLI project/platform inspection requires an authenticated Appwrite Console session; the available project API key is not sufficient for platform settings.

Root cause:
- Required provider console credentials are not available in this terminal session.

Fix:
- Provide temporary CLI access or perform the Appwrite Web platform update manually in Appwrite Console.

Retest:
- FAIL at 2026-05-17 16:29 AWST for CLI verification.
