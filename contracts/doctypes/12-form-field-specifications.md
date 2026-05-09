# RBP Phase 2 Backend Contracts
# 12-form-field-specifications.md

## Document Status

| Field | Value |
|---|---|
| Document | Final Form Field Specifications |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Ready for backend review |
| Generated | 2026-05-07 |
| Source Repository | `info-rbp/Uiuxdesignassistance` |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/12-form-field-specifications.md` |
| Intended Final Location | `rbp-platform/contracts/forms/form-field-specifications.md` |

## Repository Review Basis

This file was generated after reviewing the connected `info-rbp/Uiuxdesignassistance` repository.

Key repository facts used:

```text
- `src/app/routes.tsx` contains the live React route tree.
- `src/app/config/routes.registry.ts` is a Phase 1 route registry and explicitly says it supports later backend contract mapping.
- `docs/ui/route-audit.md` lists route groups, access types, mock data, mock service needs, confirmation/status states, and build risk.
- `docs/phase-1-exclusions.md` confirms Phase 1 intentionally excluded real Frappe APIs, real payment processing, real file upload persistence, real auth, real notification delivery, and real admin permissions.
- `docs/phase-1-definition-of-done.md` defines the intended completed mock flows and required Phase 1 states.
- Current product pages include a mix of placeholder/public service pages and one more concrete portal request form. Where a field is not literally present in the code but is required by the Phase 1 completion gate and previous Phase 2 planning, it is marked as `contract-required`.
```

### Source Confidence Labels

| Label | Meaning |
|---|---|
| `repo-observed` | Directly visible in the reviewed repository source. |
| `route-audit-observed` | Present in the route audit or route registry. |
| `definition-of-done-required` | Required by the Phase 1 definition of done. |
| `contract-required` | Required for Phase 2 backend buildability even if the current UI source still uses placeholders. |
| `phase-3-target` | Intended Frappe backend target for implementation. |


## 1. Purpose

This document defines the backend field requirements for every major Phase 1 product and portal flow.

Some current source files still show placeholder pages. Those fields are marked as `contract-required` because Phase 1 is externally confirmed complete and the Phase 1 definition-of-done requires complete mock flows for membership, Decision Desk, DocuShare, marketplace, connectivity, Risk Advisor, and The Fixer. This avoids pretending placeholder copy is a backend contract. A novel idea: honesty, but with tables.

---

## 2. Shared Field Groups

### 2.1 Shared Product Record Fields

| Fieldname | Type | Required | Applies To | Backend Mapping |
|---|---|---:|---|---|
| `tenant` | Link | Yes | All authenticated product records | `RBP Tenant` |
| `owner` | User | Yes | All user-created records | record owner/user |
| `status` | select/string | Yes | All product records | frontend-safe status |
| `workflow_state` | select/string | Yes | Workflow-enabled records | Frappe workflow state |
| `submitted_on` | datetime | Conditional | Submitted records | submission timestamp |
| `assigned_to` | user link | Conditional | Advisor/support/admin workflows | assigned advisor/support |
| `priority` | select | Conditional | Service requests | operational priority |
| `source_channel` | select | Yes | All records | website/portal/admin/api |
| `created_from_flow` | string | Conditional | Product flow tracking | frontend route/flow source |

### 2.2 Shared Contact Fields

| Fieldname | Type | Required | Backend Mapping |
|---|---|---:|---|
| `primary_contact_name` | string | Conditional | contact DTO / Business Profile |
| `email` | email | Conditional | contact DTO / Business Profile |
| `phone` | string | Conditional | contact DTO / Business Profile |
| `preferred_contact_method` | select | Conditional | product request contact field |

### 2.3 Shared File Fields

| UI Field | Backend Mapping | Notes |
|---|---|---|
| `supporting_documents` | `RBP File Reference` | Customer-supplied product documents |
| `reference_files` | `RBP File Reference` | DocuShare source/reference files |
| `media` | `RBP File Reference` | Marketplace media, public only after approval |
| `payment_evidence` | `RBP File Reference` | Admin-only unless explicitly visible |

---

## Membership Field Specification

| Fieldname | UI Label | Type | Required | Source Confidence | Backend Mapping | Validation |
|---|---|---|---:|---|---|---|
| `selected_plan` | Selected Plan | string/link | Yes | contract-required | `RBP Membership Plan.plan_code` | required |
| `billing_cycle` | Billing Cycle | select | Yes | contract-required | `RBP Subscription.billing_cycle` | required, allowed value |
| `business_name` | Business Name | string | Yes | contract-required | `RBP Business Profile.business_name` | required, max length |
| `business_identifier` | ABN / Business Identifier | string | Conditional | contract-required | `RBP Business Profile.business_identifier` | format by jurisdiction |
| `industry` | Industry | string/select | Conditional | contract-required | `RBP Business Profile.industry` | allowed value |
| `business_size` | Business Size | select | Conditional | contract-required | `RBP Business Profile.business_size` | allowed value |
| `primary_contact_name` | Primary Contact Name | string | Yes | contract-required | `RBP Business Profile.primary_contact` | required |
| `email` | Email | email | Yes | contract-required | `RBP Business Profile.email` | required, email |
| `phone` | Phone | string | Conditional | contract-required | `RBP Business Profile.phone` | phone format |
| `billing_address` | Billing Address | object/text | Conditional | contract-required | `RBP Subscription.billing_address or billing account` | required if live billing |
| `payment_method` | Payment Method | provider token | Conditional | contract-required | `RBP Payment Event` | required if payment required |
| `accepted_terms` | Accepted Terms | boolean | Yes | contract-required | `RBP Subscription.accepted_terms` | must be true |
| `marketing_consent` | Marketing Consent | boolean | No | contract-required | `RBP Business Profile.marketing_consent` | boolean |

### Backend Ownership

```text
Primary DocType: RBP Subscription
Related DocTypes: RBP Tenant, RBP Business Profile, RBP Membership Plan, RBP App Entitlement, RBP Payment Event
Primary API Module: rbp_app.api.membership
Primary Route(s): /membership, /membership/overview, /membership/pricing, /membership/payment-terms, /membership/sign-up-now, /membership/confirmation
```

### Field Editability

| Workflow State | Customer Edit | Advisor/Support Edit | Admin Edit |
|---|---:|---:|---:|
| Draft | Yes | No | Yes |
| Submitted | No, except supplemental files | Conditional | Yes |
| More Information Required | Yes, requested fields only | Conditional | Yes |
| In Review / Assigned / In Progress | No | Assigned fields only | Yes |
| Outcome Ready / Closed | No | No, unless reopened | Limited/admin only |

---

## Decision Desk Field Specification

| Fieldname | UI Label | Type | Required | Source Confidence | Backend Mapping | Validation |
|---|---|---|---:|---|---|---|
| `decision_title` | Decision Title | string | Yes | contract-required | `RBP Decision Desk Request.decision_title` | required |
| `decision_category` | Decision Category | select | Conditional | contract-required | `RBP Decision Desk Request.decision_category` | allowed value |
| `decision_summary` | Decision Summary | textarea | Yes | contract-required | `RBP Decision Desk Request.decision_summary` | required, min length |
| `urgency` | Urgency | select | Yes | repo-observed via portal priority | `RBP Decision Desk Request.urgency` | low/normal/high/urgent |
| `deadline` | Deadline | date | Conditional | contract-required | `RBP Decision Desk Request.deadline` | valid date |
| `business_context` | Business Context | textarea | Yes | repo-observed via portal request context | `RBP Decision Desk Request.business_context` | required, min 20 chars |
| `options_considered` | Options Considered | array/table | Conditional | contract-required | `RBP Decision Desk Option` | optional until final UI decides |
| `constraints` | Constraints | textarea | Conditional | contract-required | `RBP Decision Desk Request.constraints` | max length |
| `desired_outcome` | Desired Outcome | textarea | Conditional | contract-required | `RBP Decision Desk Request.desired_outcome` | max length |
| `supporting_documents` | Supporting Documents | file[] | No | repo-observed via portal file upload | `RBP File Reference` | allowed type/size/count |
| `preferred_contact_method` | Preferred Contact Method | select | Yes | repo-observed via portal contact | `RBP Decision Desk Request.preferred_contact_method` | email/phone/video/no_pref |

### Backend Ownership

```text
Primary DocType: RBP Decision Desk Request
Related DocTypes: RBP Decision Desk Option, RBP File Reference, RBP Notification, RBP Audit Log
Primary API Module: rbp_app.api.decision_desk
Primary Route(s): /on-demand/decision-desk, /portal/services/request, /portal/services/:id
```

### Field Editability

| Workflow State | Customer Edit | Advisor/Support Edit | Admin Edit |
|---|---:|---:|---:|
| Draft | Yes | No | Yes |
| Submitted | No, except supplemental files | Conditional | Yes |
| More Information Required | Yes, requested fields only | Conditional | Yes |
| In Review / Assigned / In Progress | No | Assigned fields only | Yes |
| Outcome Ready / Closed | No | No, unless reopened | Limited/admin only |

---

## DocuShare / Document Nucleus Field Specification

| Fieldname | UI Label | Type | Required | Source Confidence | Backend Mapping | Validation |
|---|---|---|---:|---|---|---|
| `document_type` | Document Type | string/link | Yes | repo-observed via DocumentProductPage document selection | `RBP Document Brief.document_type` | required |
| `document_category` | Document Category | string/select | Yes | repo-observed via category route | `RBP Document Brief.document_category` | required |
| `selected_format` | Selected Format | select | Conditional | repo-observed | `RBP Document Brief.selected_format` | allowed document format |
| `business_context` | Business Context | textarea | Yes | contract-required | `RBP Document Brief.business_context` | required before submit |
| `jurisdiction` | Jurisdiction | select/string | Conditional | contract-required | `RBP Document Brief.jurisdiction` | required where legal/compliance doc |
| `intended_use` | Intended Use | textarea | Conditional | contract-required | `RBP Document Brief.intended_use` | max length |
| `required_sections` | Required Sections | array/text | Conditional | contract-required | `RBP Document Brief.required_sections` | section list |
| `reference_files` | Reference Files | file[] | No | definition-of-done-required | `RBP File Reference` | allowed type/size/count |
| `deadline` | Deadline | date | Conditional | contract-required | `RBP Document Brief.deadline` | valid date |
| `review_required` | Review Required | boolean | No | contract-required | `RBP Document Brief.review_required` | boolean |

### Backend Ownership

```text
Primary DocType: RBP Document Brief
Related DocTypes: RBP File Reference, RBP Notification, RBP Audit Log, RBP Payment Event
Primary API Module: rbp_app.api.docushare
Primary Route(s): /document-nucleus/overview, /document-nucleus/category/:id, /document-nucleus/product/:id, /on-demand/documents
```

### Field Editability

| Workflow State | Customer Edit | Advisor/Support Edit | Admin Edit |
|---|---:|---:|---:|
| Draft | Yes | No | Yes |
| Submitted | No, except supplemental files | Conditional | Yes |
| More Information Required | Yes, requested fields only | Conditional | Yes |
| In Review / Assigned / In Progress | No | Assigned fields only | Yes |
| Outcome Ready / Closed | No | No, unless reopened | Limited/admin only |

---

## Marketplace Field Specification

| Fieldname | UI Label | Type | Required | Source Confidence | Backend Mapping | Validation |
|---|---|---|---:|---|---|---|
| `listing_title` | Listing Title | string | Yes | repo-observed as product name | `RBP Marketplace Listing.listing_title` | required |
| `listing_category` | Listing Category | select | Yes | repo-observed categories | `RBP Marketplace Listing.listing_category` | required |
| `description` | Description | textarea | Yes | repo-observed product desc | `RBP Marketplace Listing.description` | required |
| `price` | Price | currency/string | Conditional | repo-observed | `RBP Marketplace Listing.price` | valid amount or price label |
| `currency` | Currency | string | Conditional | contract-required | `RBP Marketplace Listing.currency` | currency code |
| `location` | Location | string | No | contract-required | `RBP Marketplace Listing.location` | optional |
| `media` | Media | file[] | No | definition-of-done-required | `RBP File Reference` | public only after approval |
| `seller_contact` | Seller Contact | object | Conditional | contract-required | `RBP Marketplace Listing.seller_user/contact fields` | required for third-party listing |
| `listing_fee` | Listing Fee | payment | Conditional | contract-required | `RBP Payment Event` | if fee applies |
| `buyer_enquiry_message` | Buyer Enquiry Message | textarea | Conditional | route-audit-observed | `RBP Marketplace Enquiry.message` | required for enquiry |

### Backend Ownership

```text
Primary DocType: RBP Marketplace Listing
Related DocTypes: RBP Marketplace Enquiry, RBP File Reference, RBP Payment Event, RBP Notification, RBP Audit Log
Primary API Module: rbp_app.api.marketplace
Primary Route(s): /marketplace, /marketplace/product/:id
```

### Field Editability

| Workflow State | Customer Edit | Advisor/Support Edit | Admin Edit |
|---|---:|---:|---:|
| Draft | Yes | No | Yes |
| Submitted | No, except supplemental files | Conditional | Yes |
| More Information Required | Yes, requested fields only | Conditional | Yes |
| In Review / Assigned / In Progress | No | Assigned fields only | Yes |
| Outcome Ready / Closed | No | No, unless reopened | Limited/admin only |

---

## Connectivity / NBN Field Specification

| Fieldname | UI Label | Type | Required | Source Confidence | Backend Mapping | Validation |
|---|---|---|---:|---|---|---|
| `service_address` | Service Address | textarea | Yes | definition-of-done-required | `RBP Connectivity Order.service_address` | required |
| `service_type` | Service Type | select | Yes | repo-observed route variants | `RBP Connectivity Order.service_type` | connectivity/nbn_phone/superloop |
| `selected_plan` | Selected Plan | string/link | Yes | repo-observed Superloop plans | `RBP Connectivity Order.selected_plan` | required |
| `hardware_option` | Hardware Option | select/string | Conditional | contract-required | `RBP Connectivity Order.hardware_option` | allowed value |
| `installation_preference` | Installation Preference | select/string | Conditional | contract-required | `RBP Connectivity Order.installation_preference` | allowed value |
| `contact_details` | Contact Details | object | Yes | contract-required | `RBP Connectivity Order.contact_details` | email/phone required |
| `payment_method` | Payment Method | payment | Conditional | contract-required | `RBP Payment Event` | if payment required |
| `serviceability_status` | Serviceability Status | select | Conditional | definition-of-done-required | `RBP Connectivity Order.serviceability_status` | serviceable/not_serviceable/manual_review |
| `order_status` | Order Status | select | Yes | route-audit-observed | `RBP Connectivity Order.order_status` | workflow-derived |

### Backend Ownership

```text
Primary DocType: RBP Connectivity Order
Related DocTypes: RBP File Reference, RBP Payment Event, RBP Notification, RBP Audit Log
Primary API Module: rbp_app.api.connectivity
Primary Route(s): /operations/connectivity, /operations/connectivity/nbn-phone, /operations/connectivity/superloop, /operations/superloop
```

### Field Editability

| Workflow State | Customer Edit | Advisor/Support Edit | Admin Edit |
|---|---:|---:|---:|
| Draft | Yes | No | Yes |
| Submitted | No, except supplemental files | Conditional | Yes |
| More Information Required | Yes, requested fields only | Conditional | Yes |
| In Review / Assigned / In Progress | No | Assigned fields only | Yes |
| Outcome Ready / Closed | No | No, unless reopened | Limited/admin only |

---

## Risk Advisor Field Specification

| Fieldname | UI Label | Type | Required | Source Confidence | Backend Mapping | Validation |
|---|---|---|---:|---|---|---|
| `business_name` | Business Name | string | Yes | contract-required | `RBP Risk Assessment.business_name` | required |
| `industry` | Industry | string/select | Conditional | contract-required | `RBP Risk Assessment.industry` | allowed value |
| `risk_categories` | Risk Categories | array/select | Yes | route-audit-observed | `RBP Risk Assessment.risk_categories` | at least one |
| `current_controls` | Current Controls | textarea | Conditional | contract-required | `RBP Risk Assessment.current_controls` | max length |
| `known_incidents` | Known Incidents | textarea | No | contract-required | `RBP Risk Assessment.known_incidents` | max length |
| `compliance_requirements` | Compliance Requirements | textarea | Conditional | contract-required | `RBP Risk Assessment.compliance_requirements` | max length |
| `risk_appetite` | Risk Appetite | select | Conditional | contract-required | `RBP Risk Assessment.risk_appetite` | low/medium/high |
| `assessment_answers` | Assessment Answers | json/table | Yes | definition-of-done-required | `RBP Risk Assessment.assessment_answers` | required before submit |
| `mock_score` | Mock Score | number | Conditional | definition-of-done-required | `RBP Risk Assessment.mock_score/calculated_score` | 0-100 |

### Backend Ownership

```text
Primary DocType: RBP Risk Assessment
Related DocTypes: RBP File Reference, RBP Notification, RBP Audit Log, RBP Payment Event
Primary API Module: rbp_app.api.risk_advisor
Primary Route(s): /on-demand/risk-advisor
```

### Field Editability

| Workflow State | Customer Edit | Advisor/Support Edit | Admin Edit |
|---|---:|---:|---:|
| Draft | Yes | No | Yes |
| Submitted | No, except supplemental files | Conditional | Yes |
| More Information Required | Yes, requested fields only | Conditional | Yes |
| In Review / Assigned / In Progress | No | Assigned fields only | Yes |
| Outcome Ready / Closed | No | No, unless reopened | Limited/admin only |

---

## The Fixer Field Specification

| Fieldname | UI Label | Type | Required | Source Confidence | Backend Mapping | Validation |
|---|---|---|---:|---|---|---|
| `issue_title` | Issue Title | string | Yes | contract-required | `RBP Fixer Request.issue_title` | required |
| `issue_description` | Issue Description | textarea | Yes | contract-required | `RBP Fixer Request.issue_description` | required |
| `urgency` | Urgency | select | Yes | repo-observed via portal priority | `RBP Fixer Request.urgency` | low/normal/high/urgent |
| `business_impact` | Business Impact | textarea | Conditional | contract-required | `RBP Fixer Request.business_impact` | required if urgent |
| `desired_resolution` | Desired Resolution | textarea | Conditional | contract-required | `RBP Fixer Request.desired_resolution` | max length |
| `scope_constraints` | Scope Constraints | textarea | No | contract-required | `RBP Fixer Request.scope_constraints` | max length |
| `supporting_documents` | Supporting Documents | file[] | No | repo-observed via portal file upload | `RBP File Reference` | allowed type/size/count |
| `preferred_contact_method` | Preferred Contact Method | select | Yes | repo-observed via portal contact | `RBP Fixer Request.preferred_contact_method` | email/phone/video/no_pref |

### Backend Ownership

```text
Primary DocType: RBP Fixer Request
Related DocTypes: RBP File Reference, RBP Notification, RBP Audit Log, RBP Payment Event
Primary API Module: rbp_app.api.fixer
Primary Route(s): /on-demand/the-fixer, /portal/services/request
```

### Field Editability

| Workflow State | Customer Edit | Advisor/Support Edit | Admin Edit |
|---|---:|---:|---:|
| Draft | Yes | No | Yes |
| Submitted | No, except supplemental files | Conditional | Yes |
| More Information Required | Yes, requested fields only | Conditional | Yes |
| In Review / Assigned / In Progress | No | Assigned fields only | Yes |
| Outcome Ready / Closed | No | No, unless reopened | Limited/admin only |

---

## Portal / Dashboard Field Specification

| Fieldname | UI Label | Type | Required | Source Confidence | Backend Mapping | Validation |
|---|---|---|---:|---|---|---|
| `active_services` | Active Services | number/list | Yes | repo-observed | `computed DTO` | tenant scoped |
| `pending_requests` | Pending Requests | number/list | Yes | repo-observed | `computed DTO` | tenant scoped |
| `documents` | Documents | number/list | Yes | repo-observed | `computed DTO` | visibility scoped |
| `action_items` | Action Items | number/list | Yes | repo-observed | `computed DTO` | tenant/user scoped |
| `recent_activity` | Recent Activity | array | Yes | repo-observed | `RBP Audit Log / activity DTO` | safe visibility |
| `upcoming_sessions` | Upcoming Sessions | array | Conditional | repo-observed | `future session DocType` | safe visibility |
| `consultant` | Consultant | object | Conditional | repo-observed | `assigned advisor/user DTO` | safe visibility |
| `notifications` | Notifications | array | Yes | definition-of-done-required | `RBP Notification` | recipient scoped |

### Backend Ownership

```text
Primary DocType: Multiple customer-facing records
Related DocTypes: RBP Notification, RBP File Reference, RBP Subscription, RBP App Entitlement
Primary API Module: rbp_app.api.portal
Primary Route(s): /portal/dashboard, /portal/services, /portal/services/request, /portal/services/:id, /portal/sessions, /portal/documents, /portal/offers, /portal/apps, /portal/resources, /portal/support, /portal/settings
```

### Field Editability

| Workflow State | Customer Edit | Advisor/Support Edit | Admin Edit |
|---|---:|---:|---:|
| Draft | Yes | No | Yes |
| Submitted | No, except supplemental files | Conditional | Yes |
| More Information Required | Yes, requested fields only | Conditional | Yes |
| In Review / Assigned / In Progress | No | Assigned fields only | Yes |
| Outcome Ready / Closed | No | No, unless reopened | Limited/admin only |

---

## 11. Field Specification Sign-Off Criteria

```text
Every form field is mapped to a backend field or DocType.
Every backend field has a type.
Every required field is marked.
Every placeholder-derived field is marked as contract-required.
Every repo-observed field is preserved.
Every upload field maps to RBP File Reference.
Every payment field maps to RBP Payment Event or provider checkout.
Every field has validation coverage in 13-validation-rules.md.
```
