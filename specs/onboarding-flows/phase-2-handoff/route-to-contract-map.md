# Phase 2 Route to Contract Map

## Purpose

This document maps completed Phase 1 frontend routes to future Phase 2 backend contracts.

Phase 1 remains frontend-only. This map is planning material for Phase 2 backend, Frappe, API, workflow, role, notification, upload, payment, and audit design.

## Contract Planning Rules

Phase 2 contract planning should define:

- Endpoint or Frappe DocType ownership
- Request payload
- Response payload
- Validation rules
- Auth and permissions
- Workflow states
- Admin actions
- Portal status mapping
- Notification triggers
- Audit trail requirements
- File/upload assumptions where relevant

## Public Website Routes

| Route | Phase 1 Purpose | Phase 2 Contract Need | Backend Notes |
|---|---|---|---|
| / | Public website landing page | Content/page configuration | CMS or Frappe Website/Page model may be needed. |
| /membership | Membership public page | Membership plan catalogue | Plans, pricing, inclusions and offer states. |
| /membership/overview | Membership overview | Membership product detail | Same source as membership catalogue. |
| /membership/remote-business-partner-membership | Membership product page | Membership product contract | Pricing, inclusions, entitlements, eligibility. |
| /membership/sign-up-now | Membership purchase/onboarding | Membership application, payment state, onboarding profile | Requires user/account, membership, billing and onboarding contracts. |
| /membership/confirmation | Membership confirmation | Membership application status | Confirmation reference and payment/onboarding status. |
| /on-demand/decision-desk | Decision Desk request | Decision Desk request DocType/API | Advisory request fields, status, admin review, notes. |
| /on-demand/risk-advisor | Risk Advisor assessment | Risk assessment DocType/API | Assessment answers, scoring, outcome, review status. |
| /on-demand/the-fixer | The Fixer urgent request | Urgent request/ticket DocType/API | Triage state, priority, assignment and admin actions. |
| /document-nucleus/overview | Document Nucleus overview | Document catalogue | Categories, products, availability and eligibility. |
| /document-nucleus/category/:id | Document category page | Document category/product query | Category lookup and fallback handling. |
| /document-nucleus/product/:id | Document product page | Document product detail | Product metadata, requirements, pricing if applicable. |
| /document-nucleus/brief | DocuShare brief flow | Document brief/request DocType/API | Brief fields, uploads, review and status. |
| /marketplace | Marketplace listing browse | Marketplace listing search/query | Listings, categories, filters, status and visibility. |
| /marketplace/product/:id | Marketplace listing detail | Marketplace listing detail | Listing metadata, seller, price, availability. |
| /marketplace/enquiry/:id | Marketplace buyer enquiry | Marketplace enquiry DocType/API | Buyer details, listing reference, message, status. |
| /marketplace/listing/new | Marketplace seller listing | Marketplace listing submission DocType/API | Seller fields, media, fee/payment state, admin review. |
| /operations/connectivity | Connectivity order | Connectivity order DocType/API | Serviceability, plan, hardware, billing, provisioning. |
| /operations/connectivity/nbn-phone | NBN/phone variant | Connectivity product route | Variant maps to same order contract. |
| /operations/connectivity/superloop | Superloop variant | Connectivity product route | Variant maps to same order contract. |
| /operations/superloop | Superloop compatibility route | Redirect or product route | Should map to connectivity product contract. |
| /offers | Offers page | Offer catalogue | Offer eligibility, terms and redemption planning. |
| /resources | Resources page | Resource library | Resource type, category, access rules. |
| /help | Help centre | Help article/support content | Article categories, search and support handoff. |
| /contact | Contact/discovery enquiry | Contact enquiry DocType/API | General enquiry, routing, admin review. |
| /legal/privacy-policy | Legal page | Static/legal content | Content governance and versioning. |
| /legal/terms-of-use | Legal page | Static/legal content | Content governance and versioning. |
| /legal/payment-policy | Legal page | Static/legal content | Content governance and versioning. |

## Portal Routes

| Route | Phase 1 Purpose | Phase 2 Contract Need | Backend Notes |
|---|---|---|---|
| /portal/dashboard | Member dashboard | Portal aggregate endpoint | Membership, requests, documents, offers, apps, notifications. |
| /portal/services | Service status | User request/status query | Decision Desk, DocuShare, Connectivity, Risk Advisor, Fixer. |
| /portal/documents | Document activity | User documents/briefs/files query | Document requests, generated docs, upload/download permissions. |
| /portal/offers | Member offers | Eligible offers query | Membership entitlement and offer terms. |
| /portal/apps | App access | App entitlement/provisioning query | Access states, request access, admin approval. |
| /portal/resources | Member resources | Resource entitlement query | Access permissions and resource metadata. |
| /portal/support | Support/help state | Support ticket/query planning | Future support ticket integration. |
| /portal/settings | Profile/settings | User/business profile update | Profile, notification preferences, organisation settings. |

## Admin Routes

| Route | Phase 1 Purpose | Phase 2 Contract Need | Backend Notes |
|---|---|---|---|
| /admin/dashboard | Admin overview | Admin aggregate endpoint | Queues, metrics, review summaries. |
| /admin/content | Content review | Content admin API | Pages, resources, offers, legal content states. |
| /admin/requests | Request queue | Admin request query | Cross-service queue and filtering. |
| /admin/requests/decision-desk | Decision Desk queue | Decision Desk admin API | Assign, review, request info, close. |
| /admin/requests/docushare | DocuShare queue | Document request admin API | Review brief, files, assignment, status. |
| /admin/requests/connectivity | Connectivity queue | Connectivity admin API | Review order, provisioning, status updates. |
| /admin/requests/risk-advisor | Risk Advisor queue | Risk admin API | Review score, outcome, notes, status. |
| /admin/requests/fixer | The Fixer queue | Fixer/ticket admin API | Triage, assign, escalate, close. |
| /admin/marketplace | Marketplace admin | Listing/enquiry admin API | Approve, reject, request info, publish. |
| /admin/membership | Membership admin | Membership admin API | Review account, onboarding, billing states. |
| /admin/audit-review | Audit/review | Audit log query | Immutable action history and review trail. |
| /admin/settings | Admin settings | Admin config/roles | Roles, permissions, notifications. |

## Phase 2 Output Needed

Before backend build starts, each route group should have:

- Contract owner
- Request schema
- Response schema
- Status enum
- Validation rules
- Permissions
- Admin actions
- Portal display rules
- Audit log rules
- Notification rules
