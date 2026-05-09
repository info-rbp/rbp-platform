# Step 15 Risk Advisor Flow Checklist

## Route Smoke List

- /on-demand/risk-advisor
- /portal/services
- /portal/dashboard
- /admin/requests

## Flow Checks

- User can view Risk Advisor overview.
- User can enter business profile.
- User can select risk categories.
- User can select control maturity.
- User can enter current controls.
- User can enter incident history.
- User can enter compliance concerns.
- User can choose risk appetite.
- User can enter priority outcome.
- User can preview mock score.
- User can review assessment.
- User can submit mock assessment.
- Confirmation shows mock reference.
- Status timeline is visible.
- Portal handoff link is present.

## Safety Checks

- No real backend logic.
- No real auth logic.
- No real payment processing.
- No real upload/storage.
- No real scoring API.
- No real advisor assignment.
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
