# Portal Dashboard Implementation

## Routes Touched

- `/portal` redirects to `/portal/dashboard`.
- `/portal/dashboard`
- `/portal/services`
- `/portal/documents`
- `/portal/offers`
- `/portal/apps`
- `/portal/resources`
- `/portal/support`
- `/portal/settings`

Existing portal child routes for sessions and service detail/request pages were preserved.

## Components Used

- `PortalLayout`
- `PortalStatusCard`
- `StatusBadge`
- `EntitlementBadge`
- `OrderSummaryCard`
- `ConfirmationPanel`
- Existing portal page shells and `PortalAdminReference`

## Mock Data Used

- `src/app/mock/portal.mock.ts`
- `src/app/mock/user.mock.ts`
- `src/app/mock/membership.mock.ts`
- `src/app/mock/documents.mock.ts`
- `src/app/mock/notifications.mock.ts`
- `src/app/mock/decisionDesk.mock.ts`
- `src/app/mock/docushare.mock.ts`
- `src/app/mock/connectivity.mock.ts`
- `src/app/mock/riskAdvisor.mock.ts`
- `src/app/mock/fixer.mock.ts`
- `src/app/mock/applications.mock.ts`
- `src/app/mock/offers.mock.ts`
- `src/app/mock/resources.mock.ts`

## Mock Services Used

- `getMockPortalDashboard`
- `getMockPortalNotifications`
- `getMockPortalServices`
- `getMockPortalDocuments`
- `getMockPortalOffers`
- `getMockPortalApplications`
- `getMockPortalResources`
- `getMockPortalSupport`
- `getMockPortalSettings`

These remain frontend-only mock helpers using the existing standard mock response shape.

## Stitch Screens And Patterns Referenced

- `docs/stitch/stitch-to-phase-map.md`
- `docs/stitch/workflow-screen-map.md`
- `docs/stitch/component-patterns.md`
- Step 10 RBP Application Portals references for dashboard cards, application access tiles, support/help views, knowledge base patterns, document directories, app entitlement states, and portal settings/account surfaces.

No raw Stitch HTML, screenshots, extracted files, or source zips were copied into `src/app`.

## States Implemented

- Active, pending, and guest-like membership mock scenarios in portal mock data.
- Active requests, no-record empty states, submitted requests, in-review requests, and outcome-ready requests.
- Documents available, document review states, file placeholders, and no real upload messaging.
- Application states for included, available, locked, and coming soon.
- Notifications present plus no-notification fallback copy.
- Recommended next actions.
- Partner offer eligibility and entitlement-style badges.
- Support request status cards and knowledge base entries.
- Settings mock save confirmation and profile/preference state.

## Known Placeholders

- Portal data is static mock data and optional session storage from the membership flow.
- Application access actions are mock CTAs only.
- Document preview and download buttons do not access real files.
- Support actions route to help content and do not create tickets.
- Settings saves are local UI confirmation only.

## Deferred Items

- Firebase Auth and real portal login.
- Firestore/Frappe persistence.
- Real uploads, downloads, support tickets, email, bookings, payments, app provisioning, and entitlement enforcement.
- Dedicated integration management route beyond the placeholder table in `/portal/apps`.
