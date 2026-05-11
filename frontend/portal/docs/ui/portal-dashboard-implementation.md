# Portal Dashboard Implementation

## Routes

- `/portal` redirects to `/portal/dashboard`.
- `/portal/dashboard` renders the member dashboard inside `PortalLayout`.
- Existing portal child routes for services, sessions, documents, offers, apps, resources, support, and settings are preserved.

## Live Dashboard Source

The frontend dashboard now calls the Frappe method:

`/api/method/rbp_app.api.dashboard.get_home`

The client uses a relative URL by default, sends session cookies with `credentials: "include"`, and unwraps standard Frappe method responses shaped as `{ message: ... }`. It also accepts a direct payload envelope if an endpoint returns data without `message`.

Mock portal dashboard fallback is disabled by default. It is only allowed when explicitly enabled with:

`VITE_USE_MOCK_PORTAL=true`

## Response DTO Summary

`PortalDashboardPayload` contains:

- `current_user`: user, email, full name, user type, roles, guest/admin flags.
- `available_apps`: app launcher cards returned by the backend app entitlement layer.
- `apps_by_category`: app cards grouped by category.
- `quick_links`: backend quick links for the portal.
- `platform_modules`: enabled platform modules.
- `notifications`: either a notification array or `{ notifications, unread_count }`.
- `billing`: subscription or membership billing summary.
- `integrations`: integration statuses as an array or keyed object.

`PortalLayout` derives the portal session from this payload and uses it for the user pill, initials, notification count, membership/billing label, guest redirect, and sign-out.

## Validation Steps

Frontend:

1. `cd frontend/portal`
2. `npm install`
3. `npm run build`
4. If scripts are added later, also run `npm run lint`, `npm run typecheck`, and `npm test`.

Backend/Frappe:

1. Run `bench --site <site> migrate`.
2. Run `bench --site <site> clear-cache`.
3. Confirm an authenticated request to `/api/method/rbp_app.api.dashboard.get_home` returns the DTO above.
4. Confirm an unauthenticated request returns 401/403 or a Frappe login/guest response that the frontend treats as unauthenticated.
