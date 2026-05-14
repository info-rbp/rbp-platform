# Frontend Route Stability Fixes

- Date: 2026-05-14
- Repository: `info-rbp/rbp-platform`
- Branch: `fix/public-route-crashes-and-error-boundary`

## Summary

### /offers
- Replaced the brittle render path that mixed imported offer data with a different local card shape.
- Added explicit `categoryId` values to the rendered offer cards so category filtering stays stable.
- Guarded category filters and card feature arrays with safe array handling.
- Added a friendly empty state with links to `/membership` and `/` when no offers match or no offers are available.

### /resources
- Added safe fallbacks for resource filters, backend-loaded resources, and static placeholder resources.
- Added non-crashing loading and fallback messaging so the page remains usable while backend content is loading or unavailable.
- Added a friendly empty state with links to `/help` and `/contact` when no resources match the current view.
- Kept `/resources` active and stable without removing the route.

### Route Error Boundary
- Added `frontend/portal/src/app/components/RouteErrorBoundary.tsx`.
- Wired `errorElement: <RouteErrorBoundary />` into the root browser router so route failures no longer expose the default React Router stack-trace page to public users.
- The boundary shows a friendly recovery page with links to `/` and `/help`.
- Technical details are only shown in development mode.

### Shared Content Hardening
- Normalised the public backend content hook so resource and help arrays always resolve to arrays before rendering.
- Hardened the static public content service to tolerate missing arrays before any `.map()` work is done.
- Added the same safe-array treatment to help-centre derived label maps so shared public content paths stay resilient.

## Commands Requested
- `npm run build`
- `npm run audit:seo`

## Validation Results
- Local execution of the requested build and audit commands was not possible in this environment because the repository could not be checked out over the available network path.
- The implementation was completed directly against the GitHub repository branch using repository contents access instead.
- `frontend/portal/public/_redirects` already existed and already matched the required Cloudflare SPA fallback:
  - `/* /index.html 200`

## Known Remaining Limitations
- Build, audit, and local manual route verification still need to be run from a network-enabled checkout or CI environment.
- This change set focuses on the reported public route stability issues and obvious shared-content guards only; it does not attempt a broad refactor of all public page data flows.

## Rollout Confirmations
- Applications delayed/register-interest rollout rules were not changed.
- No live payment or production checkout behaviour was introduced.
- No backend code was changed.
