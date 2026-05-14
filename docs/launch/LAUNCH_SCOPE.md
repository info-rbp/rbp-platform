# Launch Scope

## Purpose

This document locks the Milestone 0 launch scope for the Remote Business Partner Platform QA release.

The launch scope is a QA launch scope, not a production commercial launch. It defines what may be exposed in the QA deployment, what remains admin-only, what is test-mode only, and what must be delayed before production go-live.

## Launch Type

The Milestone 0 launch is:

- A live QA deployment readiness release.
- A controlled validation release for internal, admin, and approved QA testers.
- A release for proving the public website, customer auth, member portal, selected customer workflows, admin operations, Stripe test-mode checkout, email notification testing, SEO baseline, and rollback readiness.

The Milestone 0 launch is not:

- A production go-live.
- A live payment launch.
- A customer-provisioned Applications launch.
- A public marketplace seller launch.
- A final production operations handover.

## Included in Launch Scope

The QA launch scope includes:

- Public website.
- Customer auth.
- Member portal.
- Membership checkout through Stripe test mode.
- Service request flows.
- Marketplace enquiry and listing request flows.
- Offers, resources, documents, and support.
- Admin backend through Frappe Desk.
- Admin Applications management.
- Email notification testing.
- SEO baseline.
- Live QA deployment readiness.

## Live

The following can be live in the QA deployment:

- Public website pages and navigation.
- Customer registration and sign-in for QA users.
- Authenticated member portal access.
- Stripe test-mode membership checkout.
- Service request intake.
- Marketplace enquiry and listing request intake.
- Application interest registration.
- Offers, resources, documents, and support views.
- Admin operational workflows in Frappe Desk.
- Admin Applications management.
- QA-safe notification tests.
- SEO baseline metadata for public routes.

Live means present in the QA deployment for validation. It does not authorize production marketing, production payment capture, unmanaged public onboarding, or real fulfilment commitments.

## Mocked or QA-Only

The following are mocked, sandboxed, seeded, or QA-only:

- Stripe products, prices, Checkout Sessions, cards, and webhooks.
- Email sending configuration, allowlists, subject prefixes, and notification recipients.
- Any fixture-backed or seeded content in public, portal, or admin views.
- Marketplace listing and enquiry handling before final production moderation and seller operations.
- Offer discovery and request/interest states before live redemption.
- Documents and support flows before final production document operations.
- React `/admin` screens that are not fully connected to backend persistence.

QA-only functionality must be labelled or operated so testers do not confuse it with production capability.

## Admin-Only

Applications are admin-managed only for this release.

Admin-only launch scope includes:

- Creating, editing, reviewing, enabling, disabling, or operationally managing Applications.
- Reviewing Application interest registrations.
- Service request triage and status handling.
- Marketplace listing request review and follow-up.
- Membership plan and payment-event review.
- Stripe webhook/payment event inspection.
- Offer, resource, document, help, support, and site content administration.
- Email notification configuration and QA verification.
- Frappe Desk operational review.

Customers can register interest in Applications but cannot provision, open, launch, or activate Applications.

## Test-Mode Only

Stripe is enabled only in test mode for QA.

The launch scope permits:

- Stripe test-mode checkout for membership validation.
- Stripe test products and prices.
- Stripe test cards.
- Stripe test webhooks.
- QA-only payment success and failure notification checks.

Production payment capture is excluded.

The launch scope does not permit:

- Live Stripe secret keys.
- Live customer payment methods.
- Production subscriptions.
- Production invoices or settlement.
- Any code path that captures real money.

## Delayed

The following are delayed and must not be treated as part of the Milestone 0 launch:

- Production launch/go-live.
- Production payment capture.
- Customer-provisioned Applications.
- Customer ability to open, launch, activate, operate, or self-manage Applications.
- Live marketplace seller onboarding and public listing publication without admin review.
- Live offer redemption and partner settlement.
- Production email sending outside QA-safe controls.
- Final production observability, alerting, incident response, and support handover.
- Full production UAT signoff, load testing, and security certification.
- React `/admin` as a standalone operational source of truth unless fully connected to backend persistence.

## Admin Backend Source of Truth

Frappe Desk is the operational admin backend for QA.

For launch-scope purposes, Frappe Desk is the authoritative operational admin backend for persisted QA records and admin review. This includes Applications, Application interest, service requests, marketplace requests, membership/payment records, notification records, and persisted admin-managed content.

React `/admin` is not the only source of truth unless fully connected to backend persistence. A React `/admin` view that is scaffolded, mock-backed, fixture-backed, or only partially connected must be treated as a QA/admin preview surface, not the definitive operational backend.

## Applications Rollout Boundary

Applications remain a controlled admin-managed capability in this release.

Allowed:

- Customers browse Application information where exposed.
- Customers register interest in Applications.
- Admins review and manage Applications through the admin backend.
- Admins review Application interest and decide follow-up outside customer self-provisioning.

Not allowed:

- Customer self-provisioning.
- Customer opening or launching an Application.
- Customer activating an Application.
- Customer operating a live Application from the portal.
- Public launch claims that Applications are available for immediate customer activation.

## Go/No-Go Acceptance Criteria

Go for QA launch requires:

- `docs/qa/QA_RELEASE_SCOPE.md` and this document exist and are readable.
- Public website smoke tests are passable.
- Customer auth and member portal smoke tests are passable.
- Stripe is configured for test mode only.
- Membership checkout uses Stripe test mode and cannot capture production payments.
- Service request flows can be submitted and reviewed.
- Marketplace enquiry and listing request flows can be submitted and reviewed.
- Customers can register Application interest but cannot provision, open, launch, or activate Applications.
- Applications management is admin-only.
- Frappe Desk is available as the operational admin backend for QA.
- React `/admin` limitations are documented for any unpersisted or partially connected admin views.
- Offers, resources, documents, and support surfaces are available for QA validation.
- Email notification testing is constrained to QA-safe controls.
- SEO baseline is complete for public routes.
- Deployment readiness and rollback references are available for QA.
- No unrelated application code changes are included in this milestone.

No-go for QA launch if:

- Any production payment capture path is enabled.
- Stripe live mode is configured or required for QA.
- Customers can provision, open, launch, or activate Applications.
- Application controls are available to non-admin users.
- Frappe Desk cannot be used for operational admin review.
- React `/admin` is presented as authoritative while backed by mocks or unpersisted state.
- Critical public website, auth, portal, checkout, service request, marketplace request, or admin review flows cannot be validated.
