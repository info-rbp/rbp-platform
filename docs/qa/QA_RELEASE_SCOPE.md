# QA Release Scope

## Purpose

This document defines the scope for the live QA release of the Remote Business Partner platform.

The goal of this QA release is to validate the public website, customer account flow, member portal, membership checkout, service request flows, admin backend workflow, email notifications, SEO baseline, and live QA deployment readiness.

This release is not intended to launch customer-facing Frappe Application provisioning or full production payment capture.

## QA Release Position

The QA release is a controlled live-environment validation release.

It should prove that:

- the public website operates correctly;
- customers can create and access accounts;
- members can access the member portal;
- membership checkout can be tested through Stripe test mode;
- service request flows operate through authenticated portal journeys;
- marketplace enquiry and listing request flows operate in QA mode;
- offers, resources, documents, and support pages are available to members;
- admin users can operate core backend records through Frappe Desk;
- Applications can be managed by admin but not provisioned by customers;
- email notifications can be triggered and tested safely;
- SEO baseline metadata, sitemap, robots rules, and public page copy are present;
- the application can be deployed and tested in a live QA environment.

## Included in QA Release

The following functionality is included in this QA release.

### Public Website

- Public marketing website
- Public service pages
- Public membership pages
- Public marketplace pages
- Public offers/resources/help/legal pages
- Public Applications page in delayed/register-interest mode only

### Customer Authentication

- Customer sign-up
- Customer sign-in
- Customer sign-out
- Account-gated transactional CTAs
- Return-to flow after authentication

### Customer and Member Portal

- Member dashboard
- Portal services
- Portal documents
- Portal offers
- Portal resources
- Portal support
- Portal settings
- Portal Applications page in delayed/register-interest mode only

### Membership

- Membership checkout flow
- Stripe test-mode checkout
- Membership confirmation flow
- Subscription status display
- Membership entitlement activation in QA mode

### Service Request Flows

- Decision Desk request flow
- DocuShare brief/request flow
- NBN/connectivity request flow
- Risk Advisor request flow
- The Fixer request flow
- Marketplace listing request flow
- Marketplace enquiry/offer request flow

### Admin Backend

- Frappe Desk is the operational admin backend for launch QA
- Admin can inspect and manage backend records through Frappe Desk
- Admin can manage Applications as backend/admin records
- Admin can view application interest submissions
- Admin can inspect membership, subscription, entitlement, payment, notification, tenant, and service request records where implemented

### Applications

Applications are included only as backend/admin-managed records and public/member register-interest experiences.

Applications are not included as customer-facing provisioned apps in this release.

### Stripe

Stripe is included in test mode only for QA.

Included Stripe scope:

- test-mode membership checkout;
- Stripe Checkout Session creation;
- Stripe webhook testing;
- payment event logging;
- subscription status update;
- entitlement activation after successful test payment;
- payment success/failure notification testing.

### Email Notifications

Email notifications are included for QA validation.

Email notification behavior must use QA-safe configuration:

- QA subject prefix where appropriate;
- restricted QA recipient allowlist where appropriate;
- notification event logging;
- no accidental production customer sending.

### SEO Baseline

SEO baseline is included for public routes.

Included SEO scope:

- public page titles;
- meta descriptions;
- canonical URL handling;
- Open Graph metadata;
- robots rules;
- sitemap;
- portal/admin noindex behavior;
- Applications copy reflecting delayed rollout.

### Deployment

The release must be deployable to a live QA environment.

The QA deployment must support:

- HTTPS;
- frontend routing and SPA fallback;
- backend Frappe site access;
- Frappe Desk admin access;
- Stripe test-mode webhook endpoint;
- email sandbox or restricted sending;
- environment-specific configuration.

## Delayed Until Later Rollout

The following functionality is deliberately excluded from this QA release.

### Customer-Facing Frappe Application Provisioning

Customers must not be able to provision, open, or launch Frappe Applications from the public website or member portal.

Excluded:

- ERPNext provisioning;
- CRM provisioning;
- HRMS provisioning;
- Helpdesk provisioning;
- LMS provisioning;
- Drive provisioning;
- Payments app provisioning;
- any automatic app workspace/site provisioning.

### Opening or Launching Applications From Portal

The portal must not display customer-facing actions such as:

- Open app;
- Launch app;
- Provision now;
- Activate application;
- Start using application.

Approved customer-facing actions are limited to:

- Register interest;
- Learn more;
- Coming soon;
- Contact support.

### Production Payment Capture

Production payment capture is excluded.

Stripe must remain in test mode for QA.

Excluded:

- live Stripe secret keys;
- live payment collection;
- live subscription billing;
- live marketplace payment capture;
- live refunds;
- live disputes;
- production customer billing.

### Advanced Marketplace Fees

Excluded:

- marketplace listing fees;
- success fees;
- commission automation;
- settlement workflows;
- marketplace payout logic.

### Full Custom React Admin CMS

The React `/admin` area is not the only admin source of truth for this release.

Frappe Desk is the operational backend/admin system.

React `/admin` may exist as:

- guarded scaffold;
- preview dashboard;
- summary interface;
- future admin surface.

It must not be represented as the complete admin CMS unless it is fully connected to backend persistence.

### Full App-Specific Adapters

Excluded:

- complete ERPNext adapter;
- complete CRM adapter;
- complete HRMS adapter;
- complete Helpdesk adapter;
- complete LMS adapter;
- complete Drive adapter;
- full app-specific provisioning workflows.

Basic/admin modelling of Applications is included, but functional provisioning is delayed.

## What Is Live

For QA, the following can be treated as live QA functionality:

- public website rendering;
- public navigation;
- customer sign-up/sign-in;
- protected portal access;
- member dashboard access;
- authenticated service request journeys;
- Stripe test-mode checkout;
- email notification testing;
- Frappe Desk backend administration;
- admin-managed Application records;
- application interest capture;
- SEO metadata validation;
- live QA deployment.

## What Is Mocked or QA-Only

The following may remain mocked, simulated, or QA-only:

- payment capture outside Stripe test mode;
- advanced billing states;
- some portal dashboard activity summaries;
- service fulfilment outcomes;
- advanced admin reporting;
- customer-facing application availability;
- advanced marketplace publishing;
- full application provisioning;
- advanced entitlement automation if not yet backend-complete.

Any mocked or QA-only behavior must be clearly identified in copy, UI state, or QA documentation.

## What Is Admin-Only

The following are admin-only for this release:

- Application record creation and management;
- Application rollout status;
- Application interest review;
- backend subscription/payment inspection;
- entitlement inspection or manual adjustment;
- tenant/business profile inspection;
- service request review;
- notification event review;
- audit log review.

## What Is Delayed

The following must be clearly labelled as delayed or coming in a later rollout:

- customer-facing Frappe Application provisioning;
- opening Applications from the portal;
- live app activation;
- advanced marketplace payment/commission features;
- production payment capture;
- full React admin CMS;
- full app-specific adapters.

## What Is Test-Mode Only

The following must be test-mode only during QA:

- Stripe checkout;
- Stripe payment events;
- Stripe webhooks;
- subscription activation from Stripe test payments;
- payment success/failure notification testing;
- QA email delivery.

## Applications Release Rule

Applications are admin-managed only for this release.

Customers may register interest in Applications, but they must not be able to provision, open, launch, or activate Applications.

Approved customer-facing wording:

- Coming soon;
- Register interest;
- Planned for next rollout;
- Available in a future release;
- Contact us to discuss application needs.

Disallowed customer-facing wording for Applications:

- Available now;
- Open app;
- Launch app;
- Provision now;
- Activate now;
- Start using;
- Request setup, unless it creates only an interest record and not a provisioning request.

## Stripe Release Rule

Stripe is enabled only in test mode for QA.

Stripe must not use live keys, live products, live prices, or live payment capture during QA.

The platform may create test-mode checkout sessions, receive test-mode webhooks, record payment events, activate test subscriptions, and grant test entitlements.

## Admin Release Rule

Frappe Desk is the operational admin backend for launch QA.

React `/admin` is not treated as the only admin source of truth unless and until it is fully connected to persisted backend records.

## Acceptance Criteria

Milestone 0 is complete when:

- the QA release scope is documented;
- the launch scope is documented;
- Applications are explicitly admin-managed only for this release;
- customer-facing Application provisioning is explicitly delayed;
- Stripe is explicitly limited to test mode for QA;
- Frappe Desk is explicitly accepted as the operational admin backend;
- React `/admin` is explicitly not the only source of truth;
- every team member can understand what is live, mocked, admin-only, delayed, and test-mode only.

## QA Go/No-Go Statement

The application can proceed toward live QA only if the team agrees that:

- Stripe is test-mode only;
- Applications are not customer-provisionable;
- Frappe Desk is the admin backend source of truth;
- React `/admin` is not relied on as the complete admin CMS;
- customer-facing copy does not overpromise delayed features;
- all QA-only or mocked behavior is clearly identified.
