# QA Plan

## Purpose

This document is now the active Phase 5 QA execution plan for the consolidated Remote Business Partner Platform repository.

It replaces the earlier placeholder-only posture with a checklist that makes clear what is already covered, what is currently in review, and what must still be proven before the platform can be considered launch-ready.

## Current QA State

```text
Phase 4: consolidation complete
Phase 5: QA execution in progress
Launch readiness: not yet achieved
```

## QA Execution Matrix

| Area | Current status | Evidence source | Action to close |
|---|---|---|---|
| Repository structure validation | Complete | Existing structure validation docs and workflow history | Keep as baseline guard |
| Frontend install/build validation | In review | Open Phase 5 frontend validation workstream | Merge evidence and keep in CI |
| Backend syntax validation | In review | Open Phase 5 CI guardrails workstream | Merge and keep in CI |
| Frappe install smoke | In review | Open backend bench validation workstream | Merge evidence and automate later |
| Frappe migrate smoke | In review | Open backend bench validation workstream | Merge evidence and automate later |
| Contract alignment review | In review | Open contract reconciliation workstream | Merge and treat as integration baseline |
| Frontend mock-to-real mapping | In review | Open integration map workstream | Merge and keep updated as real APIs replace mocks |
| First integrated user flow | In review | Open membership integration workstream | Merge and extend to additional flows |
| API smoke testing | Outstanding | Not yet automated in `main` | Add route/API smoke checks |
| Frontend route smoke testing | Outstanding | Not yet automated in `main` | Add route smoke coverage |
| Permission and role validation | Outstanding | Contracts exist, execution evidence missing | Add targeted validation evidence |
| Workflow state validation | Outstanding | Contracts exist, execution evidence missing | Add targeted validation evidence |
| Upload/file validation | Outstanding | Contract baseline exists | Add smoke coverage against backend APIs |
| Regression testing | Outstanding | Not yet formalized | Define a Phase 5 regression sweep |
| UAT | Outstanding | No execution evidence yet | Run after integration stabilizes |
| Load/performance testing | Outstanding | Later-stage work | Plan before production |
| Security review | Outstanding | Later-stage work | Plan before production |

## Required QA Inputs

The Phase 5 QA execution track should work from:

```text
docs/architecture/PHASE_IMPLEMENTATION_REVIEW.md
docs/architecture/PHASE_5_HANDOFF.md
docs/architecture/PHASE_5_CI_PLAN.md
contracts/
frontend/portal/
apps/rbp_app/
docs/qa/evidence/
```

## Phase 5 Exit Criteria For QA

Phase 5 QA should not be considered complete until all of the following are true:

- frontend build validation is merged and repeatable
- backend syntax validation is merged and repeatable
- Frappe install and migrate evidence is merged
- contract reconciliation is merged
- at least one integrated frontend-to-backend flow is merged
- API and route smoke checks exist or equivalent evidence is attached
- critical permission, workflow, and upload scenarios have explicit validation evidence

## Evidence Rules

QA evidence should live under:

```text
docs/qa/evidence/
```

Evidence should be attached for:

- frontend build output
- backend bench validation
- integrated flow validation
- smoke test output
- any deferred item that blocks launch readiness

## Remaining Phase 5 QA Actions

1. Merge the open validation and integration workstreams already prepared.
2. Add API and route smoke coverage.
3. Record permission, workflow, and file-handling validation evidence.
4. Run a regression pass after the next integrated flows land.
5. Promote the final Phase 5 evidence set into launch-readiness gating.
