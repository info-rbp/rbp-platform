# Contract to Phase 3 Implementation Reconciliation

## Status

Complete for Phase 5 preflight once this document and the referenced contract addenda are merged.

## Repository

    info-rbp/rbp-platform

## Scope

This document reconciles Phase 2 contracts against the Phase 3 rbp_app implementation.

Areas reconciled:

- Endpoint names
- API response shapes
- DocType naming
- Roles and permissions
- Files and uploads
- Payments and subscriptions

## Automated Inventory Summary

| Area | Count | Notes |
|---|---:|---|
| API modules | 18 | apps/rbp_app/rbp_app/api |
| Service modules | 19 | apps/rbp_app/rbp_app/services |
| DocTypes | 17 | apps/rbp_app/rbp_app/doctype |

## API Module Reconciliation

| Expected canonical API module | Implementation status | Notes |
|---|---|---|
| rbp_app.api.membership | Present | Canonical for Phase 5. |
| rbp_app.api.decision_desk | Present | Canonical for Phase 5. |
| rbp_app.api.docushare | Present | Canonical for Phase 5. |
| rbp_app.api.marketplace | Present | Canonical for Phase 5. |
| rbp_app.api.connectivity | Present | Canonical for Phase 5. |
| rbp_app.api.risk_advisor | Present | Canonical for Phase 5. |
| rbp_app.api.the_fixer | Present | Canonical for Phase 5. |
| rbp_app.api.me | Present | Canonical for Phase 5. |
| rbp_app.api.apps | Present | Canonical for Phase 5. |
| rbp_app.api.dashboard | Present | Canonical for Phase 5. |
| rbp_app.api.billing | Present | Canonical for Phase 5. |
| rbp_app.api.documents | Present | Canonical for Phase 5. |
| rbp_app.api.notifications | Present | Canonical for Phase 5. |
| rbp_app.api.entitlements | Present | Canonical for Phase 5. |
| rbp_app.api.integrations | Present | Canonical for Phase 5. |

### API Naming Decision

The canonical Phase 3 Fixer API module is:

    rbp_app.api.the_fixer

The frontend may use shorter route labels such as /the-fixer or /fixer, but backend calls must use the canonical Phase 3 API module unless an explicit alias is later added.

## Service Module Reconciliation

| Expected canonical service module | Implementation status | Notes |
|---|---|---|
| rbp_app.services.membership | Present | Canonical for Phase 5. |
| rbp_app.services.decision_desk | Present | Canonical for Phase 5. |
| rbp_app.services.docushare | Present | Canonical for Phase 5. |
| rbp_app.services.marketplace | Present | Canonical for Phase 5. |
| rbp_app.services.connectivity | Present | Canonical for Phase 5. |
| rbp_app.services.risk_advisor | Present | Canonical for Phase 5. |
| rbp_app.services.the_fixer | Present | Canonical for Phase 5. |
| rbp_app.services.tenancy | Present | Canonical for Phase 5. |
| rbp_app.services.entitlements | Present | Canonical for Phase 5. |
| rbp_app.services.billing | Present | Canonical for Phase 5. |
| rbp_app.services.files | Present | Canonical for Phase 5. |
| rbp_app.services.documents | Present | Canonical for Phase 5. |
| rbp_app.services.notifications | Present | Canonical for Phase 5. |
| rbp_app.services.audit | Present | Canonical for Phase 5. |
| rbp_app.services.apps | Present | Canonical for Phase 5. |

## Response Shape Reconciliation

| Contract area | Phase 2 planning position | Phase 3 implementation position | Phase 5 decision |
|---|---|---|---|
| API response envelope | Standard envelope was planned in Phase 2 | Phase 3 returns mostly raw dictionaries / serialized DocType payloads | Phase 5 client must integrate against Phase 3 raw dictionary responses unless a future contract-change PR introduces an envelope |

Raw dictionary decision found in Phase 3 docs: Yes

## DocType Reconciliation

Phase 3 implemented several more specific canonical DocTypes than the early Phase 2 planning names.

| Phase 2 planning name | Phase 3 canonical implementation | Phase 5 decision |
|---|---|---|
| RBP Document Brief | RBP DocuShare Folder / RBP DocuShare Document / RBP DocuShare Share | Use Phase 3 canonical implementation names for integration mapping. |
| RBP Marketplace Enquiry | RBP Marketplace Order | Use Phase 3 canonical implementation names for integration mapping. |
| RBP Connectivity Order | RBP Connectivity Request / RBP Connectivity Provider / RBP Connectivity Quote | Use Phase 3 canonical implementation names for integration mapping. |
| RBP Risk Assessment | RBP Risk Advisor Assessment / RBP Risk Advisor Risk / RBP Risk Advisor Action | Use Phase 3 canonical implementation names for integration mapping. |
| RBP Fixer Request | RBP Fixer Case / RBP Fixer Task / RBP Fixer Update | Use Phase 3 canonical implementation names for integration mapping. |

## Implemented DocTypes

- RBP Connectivity Provider
- RBP Connectivity Quote
- RBP Connectivity Request
- RBP Decision Desk Option
- RBP Decision Desk Request
- RBP DocuShare Document
- RBP DocuShare Folder
- RBP DocuShare Share
- RBP Fixer Case
- RBP Fixer Task
- RBP Fixer Update
- RBP Marketplace Listing
- RBP Marketplace Order
- RBP Marketplace Vendor
- RBP Risk Advisor Action
- RBP Risk Advisor Assessment
- RBP Risk Advisor Risk

## Roles and Permissions Reconciliation

| Area | Reconciliation decision |
|---|---|
| Authenticated user access | Use Phase 3 permission helpers and service-level owner / assigned-user / tenant checks. |
| Admin access | System Manager and Administrator remain authoritative admin roles unless RBP-specific role fixtures are later hardened. |
| RBP-specific role fixtures | Deferred to QA/UAT or launch hardening if required by operating model. |
| Tenant access | Phase 5 must treat backend tenant checks as authoritative. Frontend visibility is not a security boundary. |
| Entitlements | App discovery and launcher visibility use entitlements. Product APIs are not globally hard-gated by entitlement records unless a later hardening PR changes that behavior. |

## Files and Uploads Reconciliation

| Area | Reconciliation decision |
|---|---|
| File model | RBP File Reference is the canonical file wrapper. |
| Raw upload | Raw upload client/API integration remains Phase 5 or later work. |
| Visibility | Phase 5 must preserve tenant, owner, and related-record visibility rules from RBP File Reference. |
| Contract status | Upload contracts are accepted for mapping, with final file size/type limits carried forward if not already finalized. |

## Payments and Subscriptions Reconciliation

| Area | Reconciliation decision |
|---|---|
| Subscription model | RBP Subscription is canonical. |
| Payment event model | RBP Payment Event is canonical. |
| Live provider | Live payment provider checkout/webhook integration remains deferred. |
| Phase 5 behavior | Frontend should map payment states to backend subscription/payment event states without assuming live payment execution unless that scope is explicitly opened. |

## Contract References Updated

The following contracts should carry a Phase 5 reconciliation addendum pointing here:

- contracts/api/01-api-response-envelope-standard.md
- contracts/api/11-route-to-endpoint-map.md
- contracts/api/16-mock-to-real-api-map.md
- contracts/doctypes/05-core-doctype-model.md
- contracts/permissions/04-permission-model-draft.md
- contracts/api/09-upload-file-rules.md
- contracts/workflows/08-payment-state-model.md

## Known Carry-Forward Items

| Area | Carry-forward item | Target lane |
|---|---|---|
| API client | Raw dictionary response handling | Phase 5 integration |
| Fixer naming | Use rbp_app.api.the_fixer | Phase 5 integration |
| Uploads | Raw upload implementation and final limits | Phase 5 or security hardening |
| Payments | Live payment provider integration | Payment/deployment hardening |
| Roles | RBP-specific role fixture refinement | QA/UAT or launch hardening |
| Workflows | Strict transition matrix hardening where required | QA/UAT or launch hardening |
| Entitlements | Service-level hard gates if required | Launch hardening |

## Automated Findings

| Finding | Result |
|---|---|
| Missing expected API modules | None |
| Missing expected service modules | None |
| Phase 3 raw response decision found | Yes |
| Phase 3 the_fixer decision found | Yes |
| Legacy API references found in contracts/docs | 9 |
| Legacy DocType planning references found in contracts/docs | 42 |

Legacy references are not automatically blockers if this reconciliation document records the canonical Phase 3 mapping and relevant contracts link to this decision.

## Acceptance

This reconciliation step is accepted when:

- Endpoint names are documented against the Phase 3 implementation.
- rbp_app.api.the_fixer is confirmed as the canonical Fixer API module.
- Raw dictionary API responses are confirmed as the Phase 5 integration baseline.
- Phase 3 canonical DocType names are mapped from Phase 2 planning names.
- Roles, tenant checks, entitlements, files, and payments are documented with carry-forward items.
- Key contract documents include a Phase 5 reconciliation addendum.
- No backend or frontend implementation changes are included in this PR.
