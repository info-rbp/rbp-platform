# Milestone 12: Frontend API Integration Verification

## Repository

`info-rbp/rbp-platform`

## Completed scope

Frontend API integration foundation is merged. This milestone records final build and QA API verification requirements.

## Required QA checks

- Frontend points to the QA backend API.
- Mock auth is disabled.
- Signup calls backend.
- Signin and session flow uses backend.
- Portal dashboard loads backend state.
- Stripe checkout starts through the backend billing API.
- Applications interest submits to backend.
- Notifications read from backend where enabled.

## Validation commands

    cd frontend/portal
    npm ci
    npm run build
    npm run audit:seo

## Completion criteria

Milestone 12 is complete when local validation passes and live QA browser and API smoke confirms frontend-to-backend connectivity.
