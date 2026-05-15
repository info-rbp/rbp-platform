# QA Release Scope

## Purpose

This document locks the Milestone 0 QA release scope for Remote Business Partner Platform.

The QA release is a controlled validation release. It proves the public site, customer auth, member portal, selected customer workflows, Stripe test-mode membership checkout, email notification testing, Appwrite-backed admin operations, and deployment readiness. It is not a production commercial launch and does not enable production payment capture or customer-provisioned Applications.

## Included in the QA Release

The QA release includes:

- Public website routes and content readiness checks.
- Customer registration, sign-in, sign-out, and member portal access.
- Member portal dashboard and authenticated portal navigation.
- Membership checkout through Stripe test mode only.
- Service request flows for customer/member intake and admin review.
- Marketplace enquiry and listing request flows.
- Offers, resources, documents, and support surfaces.
- React `/admin` operations backed by Appwrite Functions.
- Admin Applications management.
- Email notification testing in QA/sandbox mode.
- SEO baseline validation for public routes.
- Live QA deployment readiness, including route smoke tests, backend smoke checks, and rollback readiness references.

## Live in QA

The following functionality is live for QA validation:

- Public website browsing.
- Customer auth and member portal access.
- Membership checkout initiation against Stripe test-mode configuration.
- Service request submission and review.
- Marketplace enquiry and listing request submission and review.
- Application interest registration.
- Offers, resources, documents, and support content review.
- Admin operational review in React `/admin` where backed by Appwrite-authenticated access and Appwrite Functions.
- Email notification testing with QA-safe configuration.
- SEO metadata and indexing baseline checks.

Live in QA means available for testers in the QA environment. It does not mean production-ready, publicly marketed, or enabled for real customer fulfilment.

## Mocked or QA-Only

The following areas are mocked, seeded, sandboxed, or QA-only:

- Stripe checkout uses test-mode products, prices, cards, sessions, and webhooks.
- Email notifications use QA/sandbox controls, QA sender settings, allowlists, or test recipients.
- Some public, portal, and admin content may be seeded or fixture-backed for validation.
- Marketplace listing and enquiry flows validate intake and review, not an open public marketplace.
- Offers validate discovery and request/interest behavior, not live redemption settlement.
- Documents and support validate access, routing, and request handling, not a final production document operations process.
- React `/admin` views may be used as QA-facing operational screens only where they are fully connected to backend persistence.

## Admin-Only

The following areas are admin-only for this release:

- Applications management.
- Application provisioning decisions and operational follow-up.
- Membership plan, payment event, and Stripe webhook review.
- Service request triage and status changes.
- Marketplace listing review, approval, and follow-up.
- Offer, resource, document, help, and support administration.
- Email notification configuration and test verification.
- Production-like operational review through the Appwrite-backed admin surface.

Applications are admin-managed only for this release.

Customers can register interest in Applications, but customers cannot provision, open, launch, or activate Applications in this release.

## Test-Mode Only

Stripe is enabled only in test mode for QA.

Test-mode scope includes:

- Stripe test products and recurring AUD test prices.
- Stripe test Checkout Sessions for membership checkout.
- Stripe test cards and test webhook events.
- Backend Stripe secrets and webhook secrets configured only for QA/test mode.
- QA verification of payment success, failure, idempotency, and admin payment-event visibility.

Production payment capture is excluded.

No live Stripe keys, live payment methods, production subscriptions, or production payment settlement are in scope for this milestone.

## Delayed

The following are delayed until a later release:

- Production launch.
- Production payment capture.
- Customer-provisioned Applications.
- Customer ability to open, launch, activate, or operate Applications.
- Live marketplace publishing and public seller onboarding.
- Live offer redemption, settlement, or partner fulfilment.
- Production email delivery outside QA-safe controls.
- Final production monitoring, incident response, and post-launch support operations.
- React `/admin` as a standalone source of truth unless every relevant workflow is fully connected to backend persistence.
- Load testing, full security review, and final UAT signoff beyond the QA gates documented here.

## Source-of-Truth Rules

React `/admin` backed by Appwrite Functions is the target operational admin surface for QA.

Appwrite collections are the QA source of truth for persisted operational records, including Applications, membership and payment records, service requests, marketplace requests, notification records, and admin-controlled content where backend persistence exists.

Appwrite Console may be used as a technical fallback for inspection or configuration only. If a React `/admin` view is scaffolded, mocked, fixture-backed, or partially connected, it must be treated as a QA aid or future admin surface, not the authoritative operational record.

Frappe assets remain historical reference only and are not part of the active Appwrite QA backend path.

## Go/No-Go Acceptance Criteria

Go for QA release requires:

- Public website routes load and pass smoke checks.
- Customer auth and member portal routes work for QA users.
- Membership checkout creates Stripe test-mode checkout sessions only.
- Stripe test webhooks can be verified without exposing raw payloads to customers.
- Production payment capture remains disabled and unavailable.
- Service request flows create reviewable records.
- Marketplace enquiry and listing request flows create reviewable records.
- Application interest registration works while Application provisioning remains disabled.
- Customers cannot provision, open, launch, or activate Applications.
- Admin Applications management is available only to admins.
- Appwrite-backed admin workflows exist for any capability presented as active in QA.
- React `/admin` source-of-truth limitations are documented and understood by QA.
- Offers, resources, documents, and support surfaces are available for QA review.
- Email notification testing uses QA-safe sender, recipient, sandbox, or allowlist controls.
- SEO baseline checks pass for public website routes.
- Live QA deployment readiness checks and rollback references are complete.
- No unrelated application code changes are included in Milestone 0.

No-go conditions include:

- Any live Stripe or production payment capture path is enabled.
- Customers can provision, open, launch, or activate Applications.
- Application admin controls are exposed to non-admin users.
- React `/admin` is treated as authoritative while backed by mocks or unpersisted state.
- The active QA admin path still depends on Frappe Desk or legacy Frappe endpoints.
- Critical public website, auth, portal, checkout, service request, or marketplace request routes cannot be smoke tested.