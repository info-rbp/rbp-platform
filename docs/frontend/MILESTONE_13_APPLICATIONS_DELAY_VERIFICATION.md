# Milestone 13: Applications Customer-Facing Delay Verification

## Repository

`info-rbp/rbp-platform`

## Completed scope

Applications remain customer-facing delayed and register-interest only.

## Required behaviour

- No customer-facing provisioning.
- No open, launch, or start-using CTA.
- Register interest remains available.
- Backend provisioning flag remains disabled.
- Applications copy says coming soon or next rollout.

## Validation commands

    grep -R "Open app\|Launch app\|Provision now\|Activate application\|Available now\|Start using" frontend/portal/src/app || true
    cd frontend/portal
    npm ci
    npm run build
    npm run audit:seo

## Completion criteria

Milestone 13 is complete when forbidden provisioning language is absent or justified, build passes, SEO audit passes, and backend Milestone 4 is complete.
