# RBP Phase 2 Backend Contracts
# 11-route-to-endpoint-map.md

## Document Status

| Field | Value |
|---|---|
| Document | Final Route-to-Endpoint Map |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Ready for backend review |
| Generated | 2026-05-07 |
| Source Repository | `info-rbp/Uiuxdesignassistance` |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/11-route-to-endpoint-map.md` |
| Intended Final Location | `rbp-platform/contracts/api/route-to-endpoint-map.md` |

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

This document maps the completed Phase 1 frontend route structure to the backend endpoints required for Phase 3 Frappe implementation.

The route registry says it is a Phase 1 planning artifact for route auditing, completion tracking, and later backend contract mapping. The live router defines public, portal, admin, confirmation, and fallback routes. The route audit identifies the route groups, mock data, mock services, confirmation/status states, and backend risk for each route.

This file converts those UI routes into backend contract targets. In an ideal universe, this is the document that stops `/portal/services/request` from becoming seven unrelated backend methods with the emotional stability of a shopping cart wheel.

---

## 2. Endpoint Naming Standard

```text
/api/method/rbp_app.api.<domain>.<action>_<resource>
```

Examples:

```text
POST /api/method/rbp_app.api.decision_desk.create_request
GET  /api/method/rbp_app.api.decision_desk.get_request
POST /api/method/rbp_app.api.decision_desk.attach_file
POST /api/method/rbp_app.api.decision_desk.admin_assign_advisor
```

All endpoints must return the standard Phase 2 API response envelope.

---

## 3. Route-to-Endpoint Table

| Frontend Route | Component / Page | Domain | Access | Backend Endpoint | Method | Primary DocType / DTO |
|---|---|---|---|---|---|---|
| `/membership` | `MembershipSignUpPage` | Membership | public | `/api/method/rbp_app.api.membership.get_subscription` | GET | RBP Subscription |
| `/membership/overview` | `MembershipSignUpPage` | Membership | public | `/api/method/rbp_app.api.membership.get_subscription` | GET | RBP Subscription |
| `/membership/pricing` | `MembershipSignUpPage` | Membership | public | `/api/method/rbp_app.api.membership.get_subscription` | GET | RBP Subscription |
| `/membership/payment-terms` | `MembershipSignUpPage` | Membership | public | `/api/method/rbp_app.api.membership.get_subscription` | GET | RBP Subscription |
| `/membership/sign-up-now` | `MembershipSignUpPage` | Membership | public | `/api/method/rbp_app.api.membership.create_signup` | POST | RBP Subscription |
| `/membership/confirmation` | `MembershipSignUpPage` | Membership | public | `/api/method/rbp_app.api.membership.get_subscription` | GET | RBP Subscription |
| `/on-demand/decision-desk` | `DecisionDeskPage / PortalServiceRequest` | Decision Desk | public | `/api/method/rbp_app.api.decision_desk.get_request` | GET | RBP Decision Desk Request |
| `/portal/services/request` | `DecisionDeskPage / PortalServiceRequest` | Decision Desk | public | `/api/method/rbp_app.api.decision_desk.get_request` | GET | RBP Decision Desk Request |
| `/portal/services/:id` | `DecisionDeskPage / PortalServiceRequest` | Decision Desk | public | `/api/method/rbp_app.api.decision_desk.get_request` | GET | RBP Decision Desk Request |
| `/document-nucleus/overview` | `DocumentProductPage / DocumentOverviewPage / DocumentCategoryPage` | DocuShare / Document Nucleus | public | `/api/method/rbp_app.api.docushare.get_brief` | GET | RBP Document Brief |
| `/document-nucleus/category/:id` | `DocumentProductPage / DocumentOverviewPage / DocumentCategoryPage` | DocuShare / Document Nucleus | public | `/api/method/rbp_app.api.docushare.get_brief` | GET | RBP Document Brief |
| `/document-nucleus/product/:id` | `DocumentProductPage / DocumentOverviewPage / DocumentCategoryPage` | DocuShare / Document Nucleus | public | `/api/method/rbp_app.api.docushare.get_brief` | GET | RBP Document Brief |
| `/on-demand/documents` | `DocumentProductPage / DocumentOverviewPage / DocumentCategoryPage` | DocuShare / Document Nucleus | public | `/api/method/rbp_app.api.docushare.get_brief` | GET | RBP Document Brief |
| `/marketplace` | `MarketplacePage` | Marketplace | public | `/api/method/rbp_app.api.marketplace.get_listing` | GET | RBP Marketplace Listing |
| `/marketplace/product/:id` | `MarketplacePage` | Marketplace | public | `/api/method/rbp_app.api.marketplace.get_listing` | GET | RBP Marketplace Listing |
| `/operations/connectivity` | `ConnectivityPage / NbnPhonePage / SuperloopPage` | Connectivity / NBN | public | `/api/method/rbp_app.api.connectivity.get_order` | GET | RBP Connectivity Order |
| `/operations/connectivity/nbn-phone` | `ConnectivityPage / NbnPhonePage / SuperloopPage` | Connectivity / NBN | public | `/api/method/rbp_app.api.connectivity.get_order` | GET | RBP Connectivity Order |
| `/operations/connectivity/superloop` | `ConnectivityPage / NbnPhonePage / SuperloopPage` | Connectivity / NBN | public | `/api/method/rbp_app.api.connectivity.get_order` | GET | RBP Connectivity Order |
| `/operations/superloop` | `ConnectivityPage / NbnPhonePage / SuperloopPage` | Connectivity / NBN | public | `/api/method/rbp_app.api.connectivity.get_order` | GET | RBP Connectivity Order |
| `/on-demand/risk-advisor` | `RiskAdvisorPage` | Risk Advisor | public | `/api/method/rbp_app.api.risk_advisor.get_assessment` | GET | RBP Risk Assessment |
| `/on-demand/the-fixer` | `TheFixerPage / PortalServiceRequest` | The Fixer | public | `/api/method/rbp_app.api.fixer.get_request` | GET | RBP Fixer Request |
| `/portal/services/request` | `TheFixerPage / PortalServiceRequest` | The Fixer | public | `/api/method/rbp_app.api.fixer.get_request` | GET | RBP Fixer Request |
| `/portal/dashboard` | `Portal page` | Portal | portal | `/api/method/rbp_app.api.portal.get_dashboard` | GET/POST | Portal DTO / related DocTypes |
| `/portal/services` | `Portal page` | Portal | portal | `/api/method/rbp_app.api.portal.get_services` | GET/POST | Portal DTO / related DocTypes |
| `/portal/services/request` | `Portal page` | Portal | portal | `/api/method/rbp_app.api.portal.create_service_request_router` | GET/POST | Portal DTO / related DocTypes |
| `/portal/services/:id` | `Portal page` | Portal | portal | `/api/method/rbp_app.api.portal.get_service_record` | GET/POST | Portal DTO / related DocTypes |
| `/portal/sessions` | `Portal page` | Portal | portal | `/api/method/rbp_app.api.portal.get_sessions` | GET/POST | Portal DTO / related DocTypes |
| `/portal/documents` | `Portal page` | Portal | portal | `/api/method/rbp_app.api.files.list_my_documents` | GET/POST | Portal DTO / related DocTypes |
| `/portal/offers` | `Portal page` | Portal | portal | `/api/method/rbp_app.api.portal.get_offers` | GET/POST | Portal DTO / related DocTypes |
| `/portal/apps` | `Portal page` | Portal | portal | `/api/method/rbp_app.api.portal.get_apps` | GET/POST | Portal DTO / related DocTypes |
| `/portal/resources` | `Portal page` | Portal | portal | `/api/method/rbp_app.api.portal.get_resources` | GET/POST | Portal DTO / related DocTypes |
| `/portal/support` | `Portal page` | Portal | portal | `/api/method/rbp_app.api.portal.get_support` | GET/POST | Portal DTO / related DocTypes |
| `/portal/settings` | `Portal page` | Portal | portal | `/api/method/rbp_app.api.me.update_profile` | GET/POST | Portal DTO / related DocTypes |
| `/admin/signin` | `AdminSignInPage` | Admin Auth | admin | `/api/method/rbp_app.api.me.admin_get_context` | GET | User/Role context |
| `/admin/dashboard` | `AdminDashboard` | Admin Dashboard | admin | `/api/method/rbp_app.api.admin.get_dashboard` | GET | Admin dashboard DTO |
| `/admin/on-demand` | `AdminCrudPage` | On-Demand Admin | admin | `/api/method/rbp_app.api.admin.list_records?domain=on_demand` | GET | Product records |
| `/admin/on-demand/*` | `AdminCrudPage` | On-Demand Admin | admin | `/api/method/rbp_app.api.admin.perform_action` | POST | Product records |
| `/admin/operations/*` | `AdminCrudPage` | Operations Admin | admin | `/api/method/rbp_app.api.admin.perform_action` | POST | Connectivity/operations records |
| `/admin/marketplace/*` | `AdminCrudPage` | Marketplace Admin | admin | `/api/method/rbp_app.api.marketplace.admin_<action>` | POST | RBP Marketplace Listing |
| `/admin/membership/*` | `AdminCrudPage` | Membership Admin | admin | `/api/method/rbp_app.api.membership.admin_<action>` | POST | Subscription/Tenant/Profile |
| `/admin/resources/*` | `AdminCrudPage` | Resources Admin | admin | `/api/method/rbp_app.api.admin_content.<action>` | GET/POST | Future content DocTypes |
| `/admin/help-center/*` | `AdminCrudPage` | Help Center Admin | admin | `/api/method/rbp_app.api.admin_content.<action>` | GET/POST | Future help content DocTypes |
| `/admin/site-content/*` | `AdminCrudPage` | Site Content Admin | admin | `/api/method/rbp_app.api.admin_content.<action>` | GET/POST | Future site content DocTypes |
| `/admin/settings/*` | `AdminCrudPage` | Settings Admin | admin | `/api/method/rbp_app.api.admin_settings.<action>` | GET/POST | Config/User/Role records |

---

## 4. Product Submit Endpoint Map

| Product Flow | Create Draft | Update Draft | Submit | Get One | List Mine | Attach File | Admin Action Prefix |
|---|---|---|---|---|---|---|---|
| Membership | `POST /api/method/rbp_app.api.membership.create_signup` | `POST /api/method/rbp_app.api.membership.update_signup` | `POST /api/method/rbp_app.api.membership.submit_signup` | `GET /api/method/rbp_app.api.membership.get_subscription` | `GET /api/method/rbp_app.api.membership.list_my_subscriptions` | Not applicable | `POST /api/method/rbp_app.api.membership.admin_<action>` |
| Decision Desk | `POST /api/method/rbp_app.api.decision_desk.create_request` | `POST /api/method/rbp_app.api.decision_desk.update_request` | `POST /api/method/rbp_app.api.decision_desk.submit_request` | `GET /api/method/rbp_app.api.decision_desk.get_request` | `GET /api/method/rbp_app.api.decision_desk.list_my_requests` | `POST /api/method/rbp_app.api.decision_desk.attach_file` | `POST /api/method/rbp_app.api.decision_desk.admin_<action>` |
| DocuShare / Document Nucleus | `POST /api/method/rbp_app.api.docushare.create_brief` | `POST /api/method/rbp_app.api.docushare.update_brief` | `POST /api/method/rbp_app.api.docushare.submit_brief` | `GET /api/method/rbp_app.api.docushare.get_brief` | `GET /api/method/rbp_app.api.docushare.list_my_briefs` | `POST /api/method/rbp_app.api.docushare.attach_file` | `POST /api/method/rbp_app.api.docushare.admin_<action>` |
| Marketplace | `POST /api/method/rbp_app.api.marketplace.create_listing` | `POST /api/method/rbp_app.api.marketplace.update_listing` | `POST /api/method/rbp_app.api.marketplace.submit_listing` | `GET /api/method/rbp_app.api.marketplace.get_listing` | `GET /api/method/rbp_app.api.marketplace.list_public_listings` | `POST /api/method/rbp_app.api.marketplace.attach_file` | `POST /api/method/rbp_app.api.marketplace.admin_<action>` |
| Connectivity / NBN | `POST /api/method/rbp_app.api.connectivity.create_order` | `POST /api/method/rbp_app.api.connectivity.update_order` | `POST /api/method/rbp_app.api.connectivity.submit_order` | `GET /api/method/rbp_app.api.connectivity.get_order` | `GET /api/method/rbp_app.api.connectivity.list_my_orders` | `POST /api/method/rbp_app.api.connectivity.attach_file` | `POST /api/method/rbp_app.api.connectivity.admin_<action>` |
| Risk Advisor | `POST /api/method/rbp_app.api.risk_advisor.create_assessment` | `POST /api/method/rbp_app.api.risk_advisor.update_assessment` | `POST /api/method/rbp_app.api.risk_advisor.submit_assessment` | `GET /api/method/rbp_app.api.risk_advisor.get_assessment` | `GET /api/method/rbp_app.api.risk_advisor.list_my_assessments` | `POST /api/method/rbp_app.api.risk_advisor.attach_file` | `POST /api/method/rbp_app.api.risk_advisor.admin_<action>` |
| The Fixer | `POST /api/method/rbp_app.api.fixer.create_request` | `POST /api/method/rbp_app.api.fixer.update_request` | `POST /api/method/rbp_app.api.fixer.submit_request` | `GET /api/method/rbp_app.api.fixer.get_request` | `GET /api/method/rbp_app.api.fixer.list_my_requests` | `POST /api/method/rbp_app.api.fixer.attach_file` | `POST /api/method/rbp_app.api.fixer.admin_<action>` |

---

## 5. Portal Endpoint Map

| Portal Area | Backend Endpoint | Purpose | Required Server-Side Filters |
|---|---|---|---|
| Dashboard | `/api/method/rbp_app.api.portal.get_dashboard` | Member dashboard cards, activity, status, notifications | user, tenant, entitlement |
| Services | `/api/method/rbp_app.api.portal.list_my_services` | Aggregated service records | user, tenant, workflow visibility |
| Service Request | `/api/method/rbp_app.api.portal.create_service_request_router` | Routes generic portal service request into specific product DocType | service id, entitlement, tenant |
| Service Detail | `/api/method/rbp_app.api.portal.get_service_record` | Fetch one product/service record safely | owner, tenant, assignment |
| Documents | `/api/method/rbp_app.api.files.list_my_documents` | Customer-visible file references | tenant, visibility, related record |
| Offers | `/api/method/rbp_app.api.portal.list_my_offers` | Member/public offers | membership, entitlement, offer visibility |
| Apps | `/api/method/rbp_app.api.portal.list_my_apps` | Entitled applications | tenant, user, entitlement |
| Resources | `/api/method/rbp_app.api.portal.list_my_resources` | Resources and downloads | role, membership visibility |
| Support | `/api/method/rbp_app.api.portal.list_my_support_items` | Support/ticket-like records | owner, tenant |
| Settings | `/api/method/rbp_app.api.me.get_context` and `/api/method/rbp_app.api.me.update_profile` | User profile and safe account settings | current user only |

---

## 6. Legacy / Compatibility Route Rules

| Route | Rule |
|---|---|
| `/operations/superloop` | Keep compatible or redirect to `/operations/connectivity/superloop`. |
| `/services` | Treat as legacy public shortcut to on-demand services. |
| `/business-advisor` | Treat as legacy public shortcut to `/on-demand/business-advisor`. |
| `/docushare` | Treat as legacy shortcut to Document Nucleus / DocuShare. |
| `/applications-legacy` | Keep only if required for old links; otherwise redirect to `/applications`. |
| `/confirmation/*` | Preserve compatibility confirmation routes, but do not treat them as proof of backend success. |

---

## 7. Backend Build Notes

```text
- Public informational routes usually need content/catalogue APIs, not transactional APIs.
- Submit routes must create or update Frappe DocTypes.
- Portal routes must be authenticated and tenant-scoped.
- Admin routes must require RBP Admin/System Manager/Administrator roles.
- Confirmation routes must verify backend state where tied to payment/submission.
- Dynamic routes such as :id must safely handle unknown IDs with standard not_found errors.
- No frontend route should depend on mock data after Phase 5 integration.
```

---

## 8. Sign-Off Criteria

This route map is ready for Phase 3 build when:

```text
Every active frontend route has either:
  - a backend endpoint,
  - a content/source endpoint,
  - a redirect rule,
  - or a deliberate no-backend decision.

Every transactional route maps to a Frappe API.
Every dynamic route has get/list and not_found behaviour.
Every portal route has an authenticated endpoint.
Every admin route has an admin endpoint or admin scaffold action.
Every legacy route has a redirect/compatibility rule.
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

