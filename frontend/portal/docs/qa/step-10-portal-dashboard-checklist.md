# Step 10 Portal Dashboard Checklist

## Build Check

- [x] `npm run build` passes.
- [x] `dist/` is removed after build verification.

## Scope Checks

- [ ] No real auth guards were added.
- [ ] No Firebase Auth implementation was added.
- [ ] No Firestore, Frappe, fetch, or production backend integration was added.
- [ ] No real upload implementation was added.
- [ ] No real support ticket creation was added.
- [ ] No real app provisioning or entitlement enforcement was added.
- [ ] No real payment, Stripe, marketplace checkout, email, or booking workflow was added.
- [ ] No raw Stitch exports, source zips, extracted folders, or `dist/` files are committed.

## Route Smoke List

- [ ] `/portal/dashboard`
- [ ] `/portal/services`
- [ ] `/portal/documents`
- [ ] `/portal/offers`
- [ ] `/portal/apps`
- [ ] `/portal/resources`
- [ ] `/portal/support`
- [ ] `/portal/settings`

## Experience Checks

- [ ] Dashboard shows welcome state, membership status, notifications, quick actions, recent activity, next steps, and Phase 1 flow status cards.
- [ ] Services shows Decision Desk, DocuShare, Connectivity, Risk Advisor, The Fixer, active request states, and public/mock flow CTAs.
- [ ] Documents shows mock document activity, document statuses, file placeholders, no-live-upload messaging, and document CTAs.
- [ ] Offers shows mock partner/member offers, categories, entitlement badges, and links back to `/offers`.
- [ ] Apps shows application tiles with included, available, locked, and coming-soon states plus mock access CTA.
- [ ] Resources shows mock resources, category/type chips, public resource links, search, and empty state.
- [ ] Support shows support cards, knowledge base cards, mock support request status, and links to `/help?section=support`.
- [ ] Settings shows mock profile/business details, membership summary, notification preferences, and frontend-only save confirmation.

## Responsive Review Placeholders

- [ ] Mobile review of portal sidebar, header, cards, lists, and tables.
- [ ] Tablet review of portal grids and settings tabs.
- [ ] Desktop review of dashboard density, app detail panel, and portal navigation.
