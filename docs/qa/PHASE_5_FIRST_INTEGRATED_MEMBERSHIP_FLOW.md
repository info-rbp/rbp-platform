cd ~/rbp-work/rbp-platform

if git status --short | grep -E "contracts/"; then
  echo "FAIL contract files changed"
  exit 1
else
  echo "PASS no contract files changed"
fi# Phase 5 First Integrated Flow - Membership / Onboarding

## Status

First mock-to-real API integration pilot for Phase 5.

## Repository

    info-rbp/rbp-platform

## Branch

    phase5/integrate-membership-pilot

## Flow

    Membership / Onboarding

## Routes Reviewed

- /membership/sign-up-now
- /membership/confirmation
- /portal/dashboard

## Backend APIs Used

- rbp_app.api.membership.list_membership_plans
- rbp_app.api.membership.get_my_onboarding
- rbp_app.api.membership.start_onboarding
- rbp_app.api.membership.update_onboarding_step
- rbp_app.api.membership.submit_onboarding

## Frontend Files Updated

- frontend/portal/src/api/client.ts
- frontend/portal/src/api/membership.api.ts
- frontend/portal/src/app/services/membershipService.ts
- frontend/portal/src/app/features/membership/MembershipPurchaseOnboardingFlow.tsx
- frontend/portal/vite.config.ts
- frontend/portal/.env.local.example

## Integration Pattern

The membership flow now uses a switchable service adapter.

Local mock mode remains available through:

    VITE_RBP_API_MODE=mock

Frappe integration mode is enabled through:

    VITE_RBP_API_MODE=frappe

## Validation Evidence

| Check | Status | Evidence |
|---|---|---|
| Frontend build | Pending update | docs/qa/evidence/phase5-membership-frontend-build-output.txt |
| API smoke - list plans | Pending update | docs/qa/evidence/phase5-membership-list-plans-api-smoke.json |
| API smoke - start onboarding | Pending update | docs/qa/evidence/phase5-membership-start-onboarding-api-smoke.json |
| API smoke - update onboarding step | Pending update | docs/qa/evidence/phase5-membership-update-step-api-smoke.json |
| API smoke - submit onboarding | Pending update | docs/qa/evidence/phase5-membership-submit-onboarding-api-smoke.json |
| Browser flow completed manually | Pending update | Manual VS Code/browser validation |

## Manual Browser Validation

| Step | Status | Notes |
|---|---|---|
| Open /membership/sign-up-now | Pending |  |
| Load plan options | Pending |  |
| Complete account details | Pending |  |
| Simulate payment success | Pending |  |
| Submit membership sign-up | Pending |  |
| Continue to onboarding | Pending |  |
| Complete onboarding | Pending |  |
| Reach portal handoff | Pending |  |

## Contract Change Check

No contract files should be changed by this PR.

## Deferred Items

| Item | Reason | Owner / Workstream | Target Phase |
|---|---|---|---|
| Live payment provider | Payment simulation remains frontend-only for this pilot. | Billing / Backend | Payment hardening |
| Real account registration | This pilot uses existing authenticated Frappe session/API token. | Auth / Platform | Auth integration |
| Entitlement provisioning | Backend handoff says completion/provisioning may be later scope. | Backend / Product | Launch hardening |

## Final Decision

This first integrated flow is accepted when:

- npm run build passes.
- Backend API smoke checks pass.
- Browser membership/onboarding flow reaches completion.
- No contract files are changed.
- No Frappe core files are changed.
- Evidence is committed.
