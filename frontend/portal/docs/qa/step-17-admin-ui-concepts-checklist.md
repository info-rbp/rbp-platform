# Step 17 Admin UI Concepts Checklist

## Route Smoke List

- /admin/dashboard
- /admin/content
- /admin/requests
- /admin/requests/decision-desk
- /admin/requests/docushare
- /admin/requests/connectivity
- /admin/requests/risk-advisor
- /admin/requests/fixer
- /admin/marketplace
- /admin/membership
- /admin/audit-review
- /admin/settings
- /admin/site-content
- /admin/the-fixer

## Dashboard Checks

- Summary metrics render.
- Queue cards render.
- Review records render.
- Mock action panel renders.
- Mock action can be submitted.

## Queue Checks

- Content review concept exists.
- Service requests concept exists.
- Decision Desk queue concept exists.
- DocuShare queue concept exists.
- Connectivity queue concept exists.
- Risk Advisor queue concept exists.
- The Fixer queue concept exists.
- Marketplace queue concept exists.
- Membership queue concept exists.
- Audit/review concept exists.

## Safety Checks

- No real backend logic.
- No real auth logic.
- No real permission enforcement.
- No real persistence.
- No real notifications.
- No real payment processing.
- No real upload/storage.
- No real Frappe APIs.

## Responsive QA Placeholders

- Mobile layout reviewed.
- Tablet layout reviewed.
- Desktop layout reviewed.

## Build

Run:

    npm run build
    rm -rf dist
    git status
