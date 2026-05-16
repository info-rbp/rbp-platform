# Milestone Review Status

Reviewed date: 2026-05-16
Branch: `launch/appwrite-runtime-completion`
Latest validated non-live CI commit: `0515a4c87b4f3901bc7167b42aafb147ccbabf3b`

## Current CI Snapshot

Latest non-live GitHub Actions status on the branch:

- Repository Tests: passing
- Cloudflare Preview Validation: passing
- Frontend Build Validation: passing
- Frontend Validation: passing
- SEO Validation: passing
- Backend Static Validation: passing
- Appwrite Functions Validation: passing
- Appwrite Schema Validation: passing
- Phase 4A Foundation Validation: passing

Live Appwrite, Stripe, and Cloudflare validation are still blocked until secrets are configured and the guarded workflows are run.

## 0. Freeze backend direction

Repo-side actions completed in this branch:

- added `docs/architecture/LEGACY_FRAPPE_REFERENCE_POLICY.md`
- preserved Appwrite-only provider defaults and test coverage for env examples

Still blocked:

- exhaustive live or indexed search across every remaining historical Frappe reference outside the available repository evidence

## 1. Lock launch scope

Repo-side actions completed in this branch:

- added `docs/launch/LAUNCH_SCOPE_ACCEPTANCE_CHECKLIST.md`
- added executable doc consistency tests for launch and QA scope

Still blocked:

- final human QA signoff after live validation

## 2. Confirm backend baseline

Repo-side actions completed in this branch:

- updated Appwrite and Cloudflare baseline docs to record required commands, inputs, and blockers
- improved `scripts/appwrite/validate-connection.ts` so database, bucket, and Functions status are reported clearly
- non-live Cloudflare preview validation now runs with safe PR-time placeholder environment values

Still blocked:

- live Appwrite baseline validation still requires real QA credentials and environment-backed execution

## 3. Add feature flags

Repo-side actions completed in this branch:

- added executable config tests for provider defaults, mock fallback, and application flags
- latest frontend-related non-live workflows are passing with Appwrite-first defaults and mock fallback disabled

Still blocked:

- live frontend runtime validation in deployed QA was not performed in this session

## 4. Schema deployment framework

Repo-side actions completed in this branch:

- strengthened schema and permission validation coverage
- latest Appwrite Schema Validation workflow is passing

Still blocked:

- deploy and drift scripts remain incomplete for real live mutations and live drift remediation

## 5. Auth and tenant provisioning

Repo-side actions completed in this branch:

- `bootstrap-tenant` now requires authenticated Appwrite user context unless a trusted internal invocation token is supplied
- runtime handlers persist tenant, business profile, user profile, membership, subscription, notification, and audit records
- public bootstrap ignores client-supplied role values, never accepts `admin`, and creates duplicate business names as distinct tenant records instead of linking unrelated users by name
- admin access is granted by Appwrite admin team membership or an explicitly configured trusted internal invocation token, not by user-controlled profile role

Still blocked:

- full live signup, signin, signout, and tenant-isolation validation against Appwrite QA

## 6. Membership and Stripe mapping

Repo-side actions completed in this branch:

- strengthened Stripe plan mapping validation for seed data
- added optional live Appwrite and Stripe validation paths when credentials are present
- expanded QA seed validation coverage

Still blocked:

- real Appwrite and Stripe test-mode validation still requires credentials and runnable execution

## 7. Stripe checkout and webhooks

Repo-side actions completed in this branch:

- free plans now activate without creating a fake Stripe checkout session
- Stripe helper status mapping and webhook handling are less scaffold-like than before
- fixture tests cover checkout success, payment failure, subscription deletion, and duplicate webhook replay idempotency
- execute-mode smoke can send signed Stripe test fixtures to the deployed webhook Function when QA Stripe/Appwrite env vars are present

Still blocked:

- live Stripe test-mode checkout, webhook delivery, and broader subscription lifecycle proof remain unverified

## 8. Entitlements

Repo-side actions completed in this branch:

- tenant entitlements are granted for free-plan activation and can be updated through the admin Function path

Still blocked:

- full payment-triggered grant and revoke behavior still needs live proof against Stripe and Appwrite

## 9. Applications model

Repo-side actions completed in this branch:

- executable tests enforce provisioning-disabled and interest-only boundaries

Still blocked:

- live application-interest write-path validation and broader admin behavior validation

## 10. Notifications and email

Repo-side actions completed in this branch:

- notification records and queue-processing handlers exist in runtime
- direct notification reads are admin-only at collection level
- customer notification list/mark actions are Function-mediated and scoped to the current user/tenant
- notification delivery records now include provider/message, error, sent time, attempt count, and last-attempt metadata for QA proof
- allowlist and blocked-recipient behavior has executable runtime coverage plus an Appwrite QA live-proof script

Still blocked:

- live SMTP/provider delivery and email-sandbox validation remain unverified until QA provider secrets and allowlists are configured

## 11. Service request persistence

Repo-side actions completed in this branch:

- service-request runtime handlers persist request and detail records in the repo-defined model

Still blocked:

- live end-to-end validation for customer and admin service-request flows

## 12. Admin operations

Repo-side actions completed in this branch:

- admin operations handlers exist for applications, notifications, subscriptions, payment events, and service requests
- safer update flows now strip Appwrite system fields before document updates
- admin-only operations are denied for non-admin customers in executable runtime coverage

Still blocked:

- live admin-access and authorization validation still needs Appwrite QA execution

## 13. Frontend API integration

Repo-side actions completed in this branch:

- config and smoke dry-run coverage verifies Appwrite-only defaults and blocked fallback paths
- latest frontend validation workflows are passing in non-live CI

Still blocked:

- runtime auth, billing, and live function integration still need deployed QA validation

## 14. Disable app provisioning

Repo-side actions completed in this branch:

- executable disabled-provisioning integration tests are present
- smoke dry-run coverage is present

Still blocked:

- live Function and Appwrite permission validation still need runtime execution

## 15. Copy completion

Repo-side actions completed in this branch:

- refreshed `docs/content/PAGE_COPY_AUDIT.md` with Appwrite-first QA wording and current limitations

Still blocked:

- exhaustive repo-wide copy sweep requires broader search or runnable checkout review

## 16. SEO and Cloudflare headers

Repo-side actions completed in this branch:

- updated Cloudflare deployment docs with route-control requirements
- Cloudflare Preview Validation, frontend build, and SEO-related non-live checks are now passing

Still blocked:

- live Cloudflare QA deployment, routes, headers, and production-like preview validation remain unverified

## 17. QA infrastructure

Repo-side actions completed in this branch:

- updated QA deploy and baseline docs with required live inputs and checklist coverage

Still blocked:

- live Appwrite, Cloudflare, Stripe webhook, and email sandbox setup

## 18. CI and CD

Repo-side actions completed in this branch:

- repository test workflow is passing
- frontend build validation workflow is passing
- Cloudflare preview validation workflow is passing
- existing validation and smoke workflows are passing in non-live CI
- QA deploy workflow remains guarded behind the `qa` environment

Still blocked:

- live deploy workflows and live runtime proof still depend on environment secrets and guarded execution

## 19. QA seed data

Repo-side actions completed in this branch:

- expanded QA seed validation coverage for users, tenants, plans, applications, interest, notifications, and service requests

Still blocked:

- live seed application and validation against Appwrite QA remain unexecuted in this session
