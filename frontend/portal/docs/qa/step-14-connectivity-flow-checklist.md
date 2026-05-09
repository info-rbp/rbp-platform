# Step 14 Connectivity Flow Checklist

## Route Smoke List

- /operations/connectivity
- /operations/connectivity/nbn-phone
- /operations/connectivity/superloop
- /operations/superloop
- /portal/services

## Flow Checks

- User can view connectivity overview.
- User can select TotalBiz or ProBiz.
- User can enter service address.
- User can run mock serviceability check.
- User can select a plan.
- User can select modem/hardware option.
- User can enter business/contact details.
- User can select mock payment method.
- User can accept mock terms.
- User can review order.
- User can submit mock order.
- Confirmation shows mock reference.
- Portal handoff link is present.

## Business Rule Checks

- TotalBiz appears.
- ProBiz appears.
- 36-month mock contract appears.
- 14-day provisioning lead time appears.
- Premium customer 10% discount display is referenced.
- BYO hardware appears.
- TP-Link hardware appears.
- Amazon eero hardware appears.

## Safety Checks

- No real backend logic.
- No real auth logic.
- No real payment processing.
- No real NBN API.
- No real Superloop API.
- No real upload.
- No Frappe APIs.

## Responsive QA Placeholders

- Mobile layout reviewed.
- Tablet layout reviewed.
- Desktop layout reviewed.

## Build

Run:

    npm run build
    rm -rf dist
    git status
