# Portal Route Guards

The React/Vite portal now has frontend route guards around account and admin
areas. These guards are for user experience only. Frappe backend permissions
must enforce real access control for every protected document, method, and API.

## Public routes

- Public marketing, service, membership, marketplace, operations, legal, and
  confirmation pages remain public.
- `/sign-in`, `/signin`, `/signup`, and `/signout` remain public.
- `/admin/signin` remains public so admin users can create a mock admin session.

## Authenticated portal routes

- `/portal/*` is wrapped by `RequireAuth`.
- Unauthenticated visitors are redirected to
  `/sign-in?returnTo=<current-path>`.
- The `returnTo` value preserves the current path, query string, and hash.

## Admin routes

- `/admin/signin` is public.
- `/admin/dashboard` and all other admin management routes are wrapped by
  `RequireAdmin`.
- Unauthenticated visitors are redirected to
  `/admin/signin?returnTo=<current-path>`.
- Authenticated non-admin users see an access denied page with links back to
  the member dashboard or home.

## Mock auth bridge

The current frontend phase uses a development-only mock session in
`sessionStorage` under `rbp_mock_auth_session`.

- Member sign-in creates a mock session with member/business roles.
- Admin sign-in creates a mock session with the `RBP Admin` role.
- Sign out clears the mock session.

This mock storage must be replaced by real Frappe session/API integration during
backend integration. Do not treat the client guard or mock roles as security.

## Role model

Admin roles:

- `Administrator`
- `System Manager`
- `RBP Admin`

Authenticated member/business roles:

- `Website User`
- `RBP Member`
- `RBP Business Owner`
- `RBP Team Member`
- `RBP Advisor`
- `RBP Support Agent`

## Audit

Run `npm run audit:route-guards` from `frontend/portal` to statically verify the
router still imports the guards, wraps `/portal/*`, wraps protected `/admin/*`,
and keeps `/admin/signin` outside the admin guard.
