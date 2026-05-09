# RBP Phase 2 Backend Contracts
# 17-phase-2-acceptance-gate.md

## Document Status

| Field | Value |
|---|---|
| Document | Phase 2 Acceptance Gate |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Ready for review |
| Generated | 2026-05-07 |
| Source Repository | `info-rbp/Uiuxdesignassistance` |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/17-phase-2-acceptance-gate.md` |
| Intended Final Location | `rbp-platform/contracts/phase-2-acceptance-gate.md` |

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

This document defines the formal acceptance gate for Phase 2.

It determines when backend contract planning is complete enough for Phase 3 Frappe platform implementation to begin without guesswork, séances, or one developer yelling “just check the UI” across a room.

---

## 2. Required Phase 2 Documents

| # | Document | Status Required Before Phase 3 |
|---:|---|---|
| 01 | `01-api-response-envelope-standard.md` | Approved |
| 02 | `02-naming-conventions.md` | Approved |
| 03 | `03-role-matrix.md` | Approved |
| 04 | `04-permission-model-draft.md` | Approved / promoted from draft |
| 05 | `05-core-doctype-model.md` | Approved |
| 06 | `06-workflow-state-standards.md` | Approved |
| 07 | `07-error-catalogue.md` | Approved |
| 08 | `08-payment-state-model.md` | Approved |
| 09 | `09-upload-file-rules.md` | Approved |
| 10 | `10-contract-templates.md` | Approved |
| 11 | `11-route-to-endpoint-map.md` | Approved |
| 12 | `12-form-field-specifications.md` | Approved |
| 13 | `13-validation-rules.md` | Approved |
| 14 | `14-notification-triggers.md` | Approved |
| 15 | `15-admin-actions.md` | Approved |
| 16 | `16-mock-to-real-api-map.md` | Approved |
| 17 | `17-phase-2-acceptance-gate.md` | Approved |

---

## 3. Phase 2 Final Gate Checklist

| Gate Item | Required Evidence | Status |
|---|---|---|
| Every active route has backend mapping | `11-route-to-endpoint-map.md` | Pending review |
| Every major product flow has create/update/submit/get/list APIs | `11`, `16` | Pending review |
| Every form field maps to a backend field or DocType | `12-form-field-specifications.md` | Pending review |
| Every form has backend validation rules | `13-validation-rules.md` | Pending review |
| Every workflow has states, transitions, and role rules | `06-workflow-state-standards.md` | Pending review |
| Every role has permission rules | `03`, `04` | Pending review |
| Every upload maps to `RBP File Reference` | `09`, `12`, `16` | Pending review |
| Every payment touchpoint maps to `RBP Payment Event` | `08`, `12`, `16` | Pending review |
| Every notification trigger is defined | `14-notification-triggers.md` | Pending review |
| Every admin action has an endpoint, role, state, audit, and notification rule | `15-admin-actions.md` | Pending review |
| Every mock service has a real Frappe endpoint target | `16-mock-to-real-api-map.md` | Pending review |
| Every error path uses standard error envelope and catalogue | `01`, `07`, `13` | Pending review |
| Every DocType needed for Phase 3 is defined | `05-core-doctype-model.md` | Pending review |
| QA can write backend tests from the contracts | all documents | Pending review |

---

## 4. Phase 3 Readiness Criteria

Phase 3 may begin when all of the following are true:

```text
- API module names are approved.
- Service module names are approved.
- DocTypes are approved.
- Field specifications are approved.
- Validation rules are approved.
- Workflow states are approved.
- Permission rules are approved.
- Payment model is approved.
- Upload/file model is approved.
- Notification triggers are approved.
- Admin actions are approved.
- Error catalogue is approved.
- Mock-to-real API map is approved.
- Known open items are either resolved or explicitly deferred.
```

---

## 5. Open Items Register

| ID | Item | Owner | Required Before | Status |
|---|---|---|---|---|
| OI-001 | Confirm whether repo placeholder pages have matching completed UI work elsewhere or are accepted as contract-required flows | Product / Frontend | Phase 3 build | Open |
| OI-002 | Confirm final payment provider and payment-required products | Product / Backend | Billing implementation | Open |
| OI-003 | Confirm final file type/size limits | Product / Backend / Security | Upload implementation | Open |
| OI-004 | Confirm whether marketplace supports third-party seller onboarding at launch | Product | Marketplace implementation | Open |
| OI-005 | Confirm final team-member access policy | Product / Backend | Permission implementation | Open |
| OI-006 | Confirm whether content/admin CMS DocTypes are in Phase 3 or later | Product / Backend | Admin implementation | Open |
| OI-007 | Confirm final notification email vs portal-only triggers | Product / Ops | Notification implementation | Open |
| OI-008 | Confirm connectivity provider integration requirements | Product / Backend | Connectivity implementation | Open |
| OI-009 | Confirm whether Risk Advisor uses mock score, manual review, or real scoring | Product / Backend | Risk Advisor implementation | Open |

---

## 6. Sign-Off Table

| Area | Approver | Status | Notes |
|---|---|---|---|
| Product |  | Pending | Confirm product/commercial rules |
| Frontend |  | Pending | Confirm route and form-field accuracy |
| Backend / Frappe |  | Pending | Confirm DocTypes/API feasibility |
| QA |  | Pending | Confirm testability |
| Admin / Operations |  | Pending | Confirm admin queues/actions |
| Security / Permissions |  | Pending | Confirm tenant/file/payment rules |

---

## 7. Final Rule

Phase 2 is accepted only when Phase 3 can build from the contracts without inventing:

```text
- endpoint names
- field names
- DocTypes
- workflow states
- permission checks
- notification triggers
- admin actions
- payment rules
- file visibility rules
- error codes
```

If Phase 3 still has to guess, Phase 2 is not done. It is merely wearing a tie.
