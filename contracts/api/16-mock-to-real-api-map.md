# RBP Phase 2 Backend Contracts
# 16-mock-to-real-api-map.md

## Document Status

| Field | Value |
|---|---|
| Document | Final Mock-to-Real API Map |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Ready for backend review |
| Generated | 2026-05-07 |
| Source Repository | `info-rbp/Uiuxdesignassistance` |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/16-mock-to-real-api-map.md` |
| Intended Final Location | `rbp-platform/contracts/api/mock-to-real-api-map.md` |

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

This document maps Phase 1 mock services, mock status states, local forms, and placeholder behaviours to Phase 3/5 real Frappe APIs.

Phase 1 explicitly allowed mock sessions, mock membership status, mock payment simulation, mock file upload placeholders, mock submissions, mock status timelines, mock admin queues, mock portal dashboard records, and mock notification records. It also explicitly excluded real Frappe APIs, payments, uploads, auth, notifications, and admin permissions. This file is the bridge from that mock world to backend reality. Sadly, bridges require bolts.

---

## 2. Mock Endpoint to Real Endpoint Map

| Mock / Frontend Behaviour | Real Endpoint | Method | Primary DocType / DTO | Notes |
|---|---|---|---|---|
| `/mock/membership/signup` | `/api/method/rbp_app.api.membership.create_signup` | POST | RBP Subscription | Create draft or initial record. |
| mock submit for Membership | `/api/method/rbp_app.api.membership.submit_signup` | POST | RBP Subscription | Validate and transition workflow. |
| mock get/list for Membership | `/api/method/rbp_app.api.membership.get_subscription` / `list_my_subscriptions` | GET | RBP Subscription DTO | Replace local status/timeline. |
| `/mock/decision-desk/request` | `/api/method/rbp_app.api.decision_desk.create_request` | POST | RBP Decision Desk Request | Create draft or initial record. |
| mock submit for Decision Desk | `/api/method/rbp_app.api.decision_desk.submit_request` | POST | RBP Decision Desk Request | Validate and transition workflow. |
| mock get/list for Decision Desk | `/api/method/rbp_app.api.decision_desk.get_request` / `list_my_requests` | GET | RBP Decision Desk Request DTO | Replace local status/timeline. |
| mock upload for Decision Desk | `/api/method/rbp_app.api.decision_desk.attach_file` | POST | RBP File Reference | Replace mock file placeholder. |
| `/mock/docushare/brief` | `/api/method/rbp_app.api.docushare.create_brief` | POST | RBP Document Brief | Create draft or initial record. |
| mock submit for DocuShare / Document Nucleus | `/api/method/rbp_app.api.docushare.submit_brief` | POST | RBP Document Brief | Validate and transition workflow. |
| mock get/list for DocuShare / Document Nucleus | `/api/method/rbp_app.api.docushare.get_brief` / `list_my_briefs` | GET | RBP Document Brief DTO | Replace local status/timeline. |
| mock upload for DocuShare / Document Nucleus | `/api/method/rbp_app.api.docushare.attach_file` | POST | RBP File Reference | Replace mock file placeholder. |
| `/mock/marketplace/listing` | `/api/method/rbp_app.api.marketplace.create_listing` | POST | RBP Marketplace Listing | Create draft or initial record. |
| mock submit for Marketplace | `/api/method/rbp_app.api.marketplace.submit_listing` | POST | RBP Marketplace Listing | Validate and transition workflow. |
| mock get/list for Marketplace | `/api/method/rbp_app.api.marketplace.get_listing` / `list_public_listings` | GET | RBP Marketplace Listing DTO | Replace local status/timeline. |
| mock upload for Marketplace | `/api/method/rbp_app.api.marketplace.attach_file` | POST | RBP File Reference | Replace mock file placeholder. |
| `/mock/connectivity/order` | `/api/method/rbp_app.api.connectivity.create_order` | POST | RBP Connectivity Order | Create draft or initial record. |
| mock submit for Connectivity / NBN | `/api/method/rbp_app.api.connectivity.submit_order` | POST | RBP Connectivity Order | Validate and transition workflow. |
| mock get/list for Connectivity / NBN | `/api/method/rbp_app.api.connectivity.get_order` / `list_my_orders` | GET | RBP Connectivity Order DTO | Replace local status/timeline. |
| mock upload for Connectivity / NBN | `/api/method/rbp_app.api.connectivity.attach_file` | POST | RBP File Reference | Replace mock file placeholder. |
| `/mock/risk-advisor/assessment` | `/api/method/rbp_app.api.risk_advisor.create_assessment` | POST | RBP Risk Assessment | Create draft or initial record. |
| mock submit for Risk Advisor | `/api/method/rbp_app.api.risk_advisor.submit_assessment` | POST | RBP Risk Assessment | Validate and transition workflow. |
| mock get/list for Risk Advisor | `/api/method/rbp_app.api.risk_advisor.get_assessment` / `list_my_assessments` | GET | RBP Risk Assessment DTO | Replace local status/timeline. |
| mock upload for Risk Advisor | `/api/method/rbp_app.api.risk_advisor.attach_file` | POST | RBP File Reference | Replace mock file placeholder. |
| `/mock/fixer/request` | `/api/method/rbp_app.api.fixer.create_request` | POST | RBP Fixer Request | Create draft or initial record. |
| mock submit for The Fixer | `/api/method/rbp_app.api.fixer.submit_request` | POST | RBP Fixer Request | Validate and transition workflow. |
| mock get/list for The Fixer | `/api/method/rbp_app.api.fixer.get_request` / `list_my_requests` | GET | RBP Fixer Request DTO | Replace local status/timeline. |
| mock upload for The Fixer | `/api/method/rbp_app.api.fixer.attach_file` | POST | RBP File Reference | Replace mock file placeholder. |
| `/mock/portal/dashboard` | `/api/method/rbp_app.api.portal.get_dashboard` | GET | Portal dashboard DTO | Replace mock dashboard cards/activity/status. |

---

## 3. Mock Field to Real Backend Mapping

| Mock Field / UI State | Real Backend Mapping | Notes |
|---|---|---|
| `payment_method_mock` | provider checkout/session + `RBP Payment Event` | Frontend never marks payment paid. |
| `payment_simulated_success` | `RBP Payment Event.status = paid` in dev/test only | Production comes from provider/backend event. |
| `payment_simulated_failure` | `RBP Payment Event.status = failed` in dev/test only | Must trigger `payment_failed`. |
| `supporting_documents_mock` | `RBP File Reference` | Linked to related product record. |
| `reference_files_mock` | `RBP File Reference` | Linked to `RBP Document Brief`. |
| `media_mock` | `RBP File Reference` | Public only after marketplace approval. |
| `serviceability_status_mock` | `RBP Connectivity Order.serviceability_status` | Backend/provider/admin controlled. |
| `mock_score` | `RBP Risk Assessment.mock_score` then `calculated_score` if real scoring exists | Mock score must be labelled if retained. |
| mock portal dashboard stats | `rbp_app.api.portal.get_dashboard` DTO | Computed from real records. |
| mock notifications | `RBP Notification` | Recipient and tenant scoped. |
| mock admin queues | product list/admin APIs | Server-filtered, not local arrays. |

---

## 4. Mock Status to Workflow Mapping

| Mock Status | Backend `status` | Backend `workflow_state` |
|---|---|---|
| `draft` | `draft` | Draft |
| `ready_to_submit` | `draft` | Draft |
| `submitted` | `submitted` | Submitted |
| `in_review` | `in_review` | In Review |
| `advisor_assigned` | `advisor_assigned` / `assigned` | Assigned / Advisor Assigned |
| `in_progress` | `in_progress` | In Progress |
| `recommendation_ready` | `recommendation_ready` / `outcome_ready` | Recommendation Ready / Outcome Ready |
| `outcome_ready` | `outcome_ready` | Outcome Ready |
| `payment_pending` | `payment_pending` | Payment Pending |
| `payment_failed` | `payment_failed` | Payment Failed |
| `closed` | `closed` | Closed |
| `rejected` | `rejected` | Rejected |
| `cancelled` | `cancelled` | Cancelled |
| `archived` | `archived` | Archived |

---

## 5. Integration Replacement Rules

```text
- Replace local mock submit handlers with API client service interfaces.
- Keep adapter pattern: mock service and Frappe service should implement same frontend interface.
- Do not hardcode Frappe URLs directly in page components.
- Use `src/api/<domain>.api.ts` or equivalent service layer.
- Normalize standard response envelope.
- Map validation errors to form fields.
- Map permission errors to access-denied/upgrade/login states.
- Map workflow states to common status badges.
- Replace mock files with upload API and RBP File Reference DTOs.
- Replace payment simulation with backend checkout/payment summary APIs.
```

---

## 6. Phase 5 Integration Checklist

```text
Membership mock signup replaced with real membership API.
Decision Desk mock request replaced with real request API.
DocuShare mock document/order/brief replaced with real DocuShare API.
Marketplace mock listing/enquiry replaced with real marketplace APIs.
Connectivity mock order/serviceability replaced with real connectivity APIs.
Risk Advisor mock assessment replaced with real assessment API.
Fixer mock request replaced with real fixer API.
Portal mock dashboard replaced with real portal aggregation API.
Admin mock queues replaced with Frappe admin list/action APIs.
Mock notifications replaced with RBP Notification APIs.
Mock uploads replaced with RBP File Reference APIs.
Mock payment states replaced with RBP Payment Event and provider flow.
```

---

## Phase 5 Contract Reconciliation Addendum

This contract has been reconciled against the Phase 3 rbp_app implementation for Phase 5 preflight.

Authoritative reconciliation record:

    docs/architecture/phase5-reconciliation/CONTRACT_PHASE3_RECONCILIATION.md

If this document conflicts with the Phase 3 implementation in endpoint names, response shapes, DocType names, role behavior, file handling, or payment behavior, the reconciliation record governs Phase 5 integration until a later contract-change PR updates the underlying contract.

Key Phase 5 decisions:

- rbp_app.api.the_fixer is the canonical backend API module for The Fixer.
- Phase 5 frontend integration will use the Phase 3 raw dictionary / serialized DocType response shape unless a later contract-change PR introduces a shared envelope.
- Phase 3 canonical DocType names may differ from early Phase 2 planning names.
- RBP File Reference is the canonical file wrapper.
- RBP Subscription and RBP Payment Event are the canonical payment/subscription models.
- Live payment provider integration and raw upload implementation remain deferred unless explicitly opened in Phase 5.

