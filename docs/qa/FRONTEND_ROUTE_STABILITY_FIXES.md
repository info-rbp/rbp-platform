# Frontend Route Stability Fixes

Date: 2026-05-15
Branch: `fix-public-route-stability-final`

## Summary

This branch replaces the useful route-hardening parts of PR #58 without merging the stale/non-mergeable PR directly.

## Extracted work

- Hardened `/offers` against mixed offer data shapes.
- Added safe array handling for offer category filters and offer feature lists.
- Fixed offer filtering to use category identifiers instead of display labels.
- Added a friendly empty state when no offers match.
- Hardened `/resources` against missing backend content.
- Added safe array fallbacks for resource filters and resources.
- Added fallback usage of curated static resources when backend content is empty or unavailable.
- Added loading, error, fallback, and empty-state messaging.
- Prevented resource CTAs from routing to empty, undefined, null, or `#` hrefs.

## Work not duplicated

Route error boundary and root route `errorElement` work were not duplicated because current `main` already has route-level error handling.

## Boundaries preserved

- Applications remain delayed/register-interest only.
- No customer-facing Application provisioning is enabled.
- No live payment behavior is introduced.
- Offers remain review/member/partner benefit pathways, not instant redemption or checkout flows.
- Marketplace behavior is unchanged.
- No backend files were changed.

## Validation status

Local validation could not be executed in this environment because direct repository checkout is unavailable. The human operator still needs to run:

```bash
cd frontend/portal
npm ci
npm run build
npm run audit:seo
cd ../..

grep -R "Content update in progress" frontend/portal/src/app -n || true
grep -R "Open app\|Launch app\|Provision now\|Activate application\|Available now\|Start using" frontend/portal/src/app -n || true
grep -R "live payment\|production payment\|Buy now\|Publish listing" frontend/portal/src/app -n || true
```

## Manual retest routes

- `/`
- `/offers`
- `/resources`
- `/help`
- `/applications`
- `/membership`
- `/portal/dashboard` as guest
- `/admin/dashboard` as guest
