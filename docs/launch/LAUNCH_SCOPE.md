# Launch Scope

## Purpose

This document defines the launch boundary for the Remote Business Partner platform and aligns product, frontend, backend, admin, QA, Stripe, email, SEO, and deployment expectations.

The launch approach is staged.

The immediate objective is to reach a live QA deployment that validates the operational product experience without prematurely exposing customer-facing Frappe Application provisioning.

## Launch Strategy

The launch strategy is:

1. Use `frappe-project` as the backend operational base.
2. Use the frontend application as the public website, customer account, member portal, and portal flow experience.
3. Use Frappe Desk as the operational admin backend for launch.
4. Use Stripe in test mode for QA membership checkout.
5. Use email notifications in QA-safe mode.
6. Keep Applications admin-managed but not customer-provisionable.
7. Complete copy and SEO for the current product reality.
8. Deploy to a live QA environment before production.

## Backend Base

The backend launch base is `frappe-project`.

The backend is responsible for:

- users;
- tenants;
- business profiles;
- memberships;
- subscriptions;
- payment events;
- entitlements;
- notifications;
- Application records;
- Application interest;
- service request records;
- admin operations through Frappe Desk;
- audit logging where implemented.

## Frontend Scope

The frontend is responsible for:

- public website pages;
- public navigation;
- account-gated CTAs;
- customer sign-up/sign-in;
- member portal access;
- member dashboard;
- service request forms;
- marketplace enquiry/listing request flows;
- membership checkout start;
- Stripe checkout redirect handling;
- portal status display;
- Applications delayed/register-interest experience;
- SEO metadata;
- copy reflecting current functionality.

## Admin Scope

Frappe Desk is the operational admin backend for launch.

Admin launch responsibilities include:

- manage tenants and business profiles;
- inspect users;
- manage membership plans;
- inspect subscriptions;
- inspect payment events;
- inspect and adjust entitlements where required;
- manage Applications;
- view Application interest;
- inspect service requests;
- inspect marketplace requests;
- inspect notifications;
- inspect audit logs.

React `/admin` may exist but must not be considered the complete admin source of truth unless connected to the backend.

## Applications Scope

Applications are included only as backend/admin-managed records during this launch stage.

Admin may manage:

- Application name;
- Application key;
- Application category;
- Application description;
- Application status;
- rollout visibility;
- interest availability;
- admin notes;
- provisioning status for future rollout planning.

Customers may:

- view Applications as coming soon or planned;
- register interest;
- contact support.

Customers may not:

- launch Applications;
- open Applications;
- provision Applications;
- activate Applications;
- access Application workspaces;
- trigger automatic app installation.

## Stripe Scope

Stripe is included for QA in test mode only.

Stripe QA scope includes:

- test-mode membership checkout;
- Stripe Checkout Session creation;
- Stripe webhook handling;
- payment event logging;
- subscription status update;
- membership entitlement activation;
- customer/admin notification triggers;
- payment success and failure QA validation.

Stripe production scope is delayed until after QA validation.

Production payment capture must not be enabled in QA.

## Email Notification Scope

Email notifications are included for QA validation.

Email notification scope includes:

- membership payment success;
- membership payment failure;
- service request submitted;
- marketplace request submitted;
- Application interest submitted;
- admin status update where implemented;
- notification event logging.

QA email delivery must be sandboxed or restricted to approved recipients.

## Membership Scope

Membership launch scope includes:

- membership plan display;
- account-gated membership checkout;
- Stripe test-mode payment;
- subscription record update;
- entitlement activation;
- member portal access;
- membership status display;
- membership confirmation messaging.

## Services Scope

Service request launch scope includes:

- Decision Desk;
- DocuShare;
- NBN/connectivity;
- Risk Advisor;
- The Fixer;
- Marketplace listing requests;
- Marketplace enquiry/offer requests.

Each service flow should create or simulate an authenticated request record suitable for QA validation.

Where backend persistence is implemented, the record must be visible to admin.

## SEO Scope

SEO launch scope includes public route metadata and technical baseline.

Included:

- page titles;
- meta descriptions;
- canonical URLs;
- Open Graph metadata;
- robots rules;
- sitemap;
- portal/admin noindex;
- Applications delayed-rollout copy;
- service and membership page copy aligned to actual product functionality.

Excluded from SEO indexing:

- `/portal/*`;
- `/admin/*`;
- `/signin`;
- `/signup`;
- `/signout`;
- QA-only test routes;
- private customer/member content.

## Deployment Scope

The live QA deployment must include:

- frontend deployment;
- backend Frappe site;
- HTTPS;
- SPA fallback routing;
- Frappe Desk access;
- Stripe test-mode webhook URL;
- QA email configuration;
- environment variable configuration;
- deployment validation;
- smoke testing;
- rollback path.

## Live, Mocked, Admin-Only, Delayed, and Test-Mode Definitions

### Live

A feature is live when it is expected to operate in the QA environment as part of the tested release.

Live QA features include:

- public website;
- account authentication;
- member portal;
- membership checkout in Stripe test mode;
- service request flows;
- email notification testing;
- Frappe Desk admin operations;
- Application interest capture;
- SEO baseline;
- deployment validation.

### Mocked

A feature is mocked when it simulates a real behavior but does not complete the full production workflow.

Mocked or simulated areas may include:

- advanced billing;
- advanced fulfilment;
- advanced marketplace publishing;
- advanced dashboard analytics;
- Application provisioning;
- React admin CRUD if not backend-connected.

Mocked behavior must not be described to users as fully live.

### Admin-Only

A feature is admin-only when it exists for backend setup, review, or operations but is not exposed as customer self-service.

Admin-only items include:

- Application management;
- entitlement inspection;
- payment event inspection;
- notification inspection;
- audit log inspection;
- backend request review.

### Delayed

A feature is delayed when it is explicitly excluded from the release.

Delayed items include:

- customer-facing Frappe Application provisioning;
- opening/launching Applications from the portal;
- production payment capture;
- advanced marketplace fees;
- full React admin CMS;
- full app-specific adapters.

### Test-Mode Only

A feature is test-mode only when it is available only for QA validation.

Test-mode only items include:

- Stripe payments;
- Stripe webhooks;
- payment event QA;
- subscription activation from test payments;
- QA email delivery.

## Launch Acceptance Criteria

The launch scope is accepted when:

- QA release scope is documented;
- delayed features are documented;
- Applications are confirmed as admin-managed only;
- Stripe is confirmed as test-mode only for QA;
- Frappe Desk is confirmed as operational admin backend;
- React `/admin` is not treated as the only admin source of truth;
- SEO and copy must reflect what actually exists;
- the team has a shared definition of live, mocked, admin-only, delayed, and test-mode only functionality.

## Final QA Readiness Statement

The platform is ready to move toward live QA when a tester can:

- visit the public website;
- understand the current product offer;
- create or sign into an account;
- access the member portal;
- complete membership checkout through Stripe test mode;
- receive QA-safe email notifications;
- submit service and marketplace requests;
- view member dashboard state;
- see Applications clearly marked as delayed/register-interest only;
- and admin can inspect/manage backend records through Frappe Desk.

The platform is not ready for production until Stripe live mode, production email delivery, production copy, deployment hardening, security review, and go-live validation are completed.
