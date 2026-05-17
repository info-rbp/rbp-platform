# Cloudflare Frontend QA Evidence

Last updated: 2026-05-17 18:24 AWST

## Scope

- QA URL tested: `https://rbp-platform.pages.dev/`
- Working branch: `fix/appwrite-permission-reconciliation-clean`
- Commit tested and deployed: `0e1462b`
- Browser: Playwright Chromium
- Verification report: `tmp/qa/cloudflare-root-dashboard-verification.json`

## Build And Deploy

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
- Old root bundle before production deployment: `/assets/index-CjyNwKW7.js`

Cloudflare production branch:

- Project: `rbp-platform`
- Production branch identified from Cloudflare production deployment history: `main`
- Previous production deployments listed branch `main`

Production deployment:

- Deploy command: `npx wrangler pages deploy dist --project-name rbp-platform --branch main`
- Immutable deployment URL: `https://b6a3ee55.rbp-platform.pages.dev`
- Cloudflare environment: Production
- Cloudflare branch: `main`
- Cloudflare source: `0e1462b`

Root bundle verification after deployment:

- Root URL: `https://rbp-platform.pages.dev/`
- Root JS asset after deployment: `/assets/index-CATcRwLF.js`
- Root no longer serves old bundle `/assets/index-CjyNwKW7.js`
- Root bundle contains dashboard fallback/storage markers including `RBP Member`, `Your business`, and `rbp.mockPortalState`
- Function names `normalisePortalDashboardState` and `unwrapPortalDashboardPayload` were not found in the deployed JS, likely due to minification

## Browser QA Result

Target: `https://rbp-platform.pages.dev/`

Result: PASS

Observed:

- Appwrite CORS passed on root.
- Sign-in completed and redirected to `/portal/dashboard`.
- The active-session sign-in retest passed.
- No `Creation of a session is prohibited when a session is active` error was seen.
- Dashboard remained visible after 10 seconds of async hydration.
- Refreshing `/portal/dashboard` kept the dashboard stable.
- Logout redirected to `/signin`.
- Signing in again after logout returned to `/portal/dashboard`.

Non-blocking browser noise:

- Two console 401 resource messages were observed during account/session checks.
- One `net::ERR_ABORTED` Appwrite Function execution request was captured during navigation.
- These did not block login, dashboard render, hydration, refresh, logout, or sign-in retest.

## Dashboard State Check

State after 10-second hydration:

```json
{
  "keys": [
    "membershipStatus",
    "membershipPlan",
    "customer",
    "activities",
    "notifications"
  ],
  "customer": {
    "id": "6a080f29488f13d9f923",
    "name": "info@remotebusinesspartner.com.au",
    "email": "info@remotebusinesspartner.com.au",
    "businessName": "info@remotebusinesspartner.com.au"
  },
  "activitiesArray": true,
  "notificationsArray": true,
  "oldWrapperPresent": false
}
```

State after refresh:

```json
{
  "keys": [
    "membershipStatus",
    "membershipPlan",
    "customer",
    "activities",
    "notifications"
  ],
  "customer": {
    "id": "6a080f29488f13d9f923",
    "name": "info@remotebusinesspartner.com.au",
    "email": "info@remotebusinesspartner.com.au",
    "businessName": "info@remotebusinesspartner.com.au"
  },
  "activitiesArray": true,
  "notificationsArray": true,
  "oldWrapperPresent": false
}
```

## Screenshots

- `docs/qa/screenshots/cloudflare-frontend-qa/root-signin.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-dashboard-stable.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-dashboard-state-check.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-dashboard-refresh.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-logout.png`
- `docs/qa/screenshots/cloudflare-frontend-qa/root-signin-retest.png`

Historical preview-only evidence remains relevant for deployment troubleshooting:

- Preview fixed bundle was available at `https://64907e02.rbp-platform.pages.dev`
- Preview alias was `https://fix-appwrite-permission-reco-44v1.rbp-platform.pages.dev`
- Both preview URLs served `/assets/index-CATcRwLF.js`
- Preview browser QA was blocked by Appwrite CORS because Appwrite did not allow those preview origins

## Conclusion

The root Cloudflare QA URL now serves the fixed frontend bundle and passes browser auth/dashboard verification. The portal dashboard envelope crash is resolved on root. Active-session sign-in handling is browser-verified on root. Cloudflare frontend QA can proceed to the remaining portal/admin/Stripe UI areas.
