# QA Plan

## Purpose

This document is the placeholder QA plan for the Remote Business Partner Platform after Phase 4 Consolidation.

Phase 4 was responsible for structured consolidation only. It did not perform production QA, user acceptance testing, security testing, load testing, or launch validation.

This document defines the QA areas that Phase 5 and later phases must expand before production readiness.

## Current Status

```text
Phase 4 status: QA placeholder present
Phase 5 status: QA planning and validation required
```

## QA Scope for Phase 5+

Phase 5 and later QA should cover:

- frontend build validation
- frontend route smoke testing
- backend syntax and lint validation
- Frappe app install smoke testing
- Frappe migrate smoke testing
- backend API smoke testing
- DocType validation
- permission and role validation
- workflow state validation
- frontend mock-to-real API replacement validation
- onboarding flow validation
- admin action validation
- upload/file handling validation
- regression testing
- deployment smoke testing

## Required Inputs

QA planning should use:

```text
docs/architecture/ARCHITECTURE.md
docs/architecture/PHASE_5_HANDOFF.md
docs/architecture/PHASE_5_CI_PLAN.md
docs/api-contracts/API_CONTRACTS.md
docs/product-flows/PRODUCT_FLOWS.md
docs/product-flows/ONBOARDING_FLOWS.md
contracts/
frontend/portal/
apps/rbp_app/
```

## Initial QA Checklist

| Area | Required Later? | Notes |
|---|---:|---|
| Repository structure validation | Yes | Already started in Phase 4 CI guard |
| Frontend install/build | Yes | Add to Phase 5 CI |
| Backend static validation | Yes | Add compile/lint checks |
| Frappe install smoke | Yes | Requires bench environment |
| Frappe migrate smoke | Yes | Required before deployment readiness |
| API smoke tests | Yes | Validate backend endpoint behavior |
| Route smoke tests | Yes | Validate frontend route behavior |
| Contract alignment testing | Yes | Compare implementation against `contracts/` |
| Permission testing | Yes | Validate role and admin boundaries |
| Workflow testing | Yes | Validate workflow and state transitions |
| UAT | Yes | Later phase, after integration stabilizes |
| Load/performance testing | Yes | Later phase, before production launch |
| Security review | Yes | Later phase, before production launch |

## Non-Goals for Phase 4

Phase 4 did not complete:

- full QA execution
- production QA signoff
- UAT
- performance testing
- security testing
- accessibility certification
- launch validation

## Status

This placeholder completes the Phase 4 documentation surface for QA planning.

Detailed QA planning and execution belong to Phase 5 and later phases.
