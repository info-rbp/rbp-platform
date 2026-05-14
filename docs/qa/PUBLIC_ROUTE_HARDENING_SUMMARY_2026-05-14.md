# Public Route Hardening Summary

Date: 2026-05-14

## Purpose

This note records the public route stability and compatibility work completed after the Cloudflare Pages QA review.

## What changed

### Friendly route failure handling

- Added `frontend/portal/src/app/components/RouteErrorBoundary.tsx`.
- Wired `errorElement: <RouteErrorBoundary />` into the top-level browser router.
- Public users now see a normal recovery page instead of the default React Router stack trace screen.
- Technical error details remain limited to development mode.

### Public company route compatibility

The following public aliases now redirect safely to their live destinations:

- `/about-us` -> `/about`
- `/contact-us` -> `/contact`
- `/discovery-call` -> `/about/discovery-call`
- `/our-platform` -> `/about/our-platform`
- `/work-with-us` -> `/about/work-with-us`
- `/work-for-us` -> `/about/work-for-us`

### Additional legacy public redirects

The following documented legacy paths were also hardened during the repo review:

- `/membership/sign-up` -> `/membership/sign-up-now`
- `/privacy-policy` -> `/legal/privacy-policy`
- `/terms-of-use` -> `/legal/terms-of-use`
- `/terms-of-engagement` -> `/legal/terms-of-engagement`
- `/payment-policy` -> `/legal/payment-policy`
- `/services-policy` -> `/legal/services-policy`

## Review notes

- Shared public navigation sources already pointed at live routes after the router updates.
- The Cloudflare SPA fallback file `frontend/portal/public/_redirects` was already present and already correct.
- This follow-up review focused on visible public-company links plus older documented compatibility paths.

## Commits recorded on main

- `bd4e3d1` Add friendly public route error boundary
- `a2a0eee` Add public route aliases and friendly route error boundary
- `a2b1d19` Add remaining legacy public route redirects
