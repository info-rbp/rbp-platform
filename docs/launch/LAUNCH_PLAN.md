# Launch Plan

## Purpose

This document is now the Phase 5 launch-readiness tracker for the Remote Business Partner Platform repository.

It replaces the older placeholder-only stance with explicit launch gates so the repository can show what still blocks go-live work.

## Launch Status

```text
Current state: not launch-ready
Reason: Phase 5 integration and validation are still in progress
```

## Launch Gates

| Gate | Current status | Close condition |
|---|---|---|
| Repository source-of-truth alignment | In review | Merge the repository strategy and CI alignment work |
| Frontend build validation | In review | Merge repeatable frontend build evidence and CI |
| Backend bench install validation | In review | Merge install and migrate evidence |
| Contract reconciliation | In review | Merge the contract reconciliation workstream |
| Mock-to-real API mapping | In review | Merge the integration map workstream |
| First integrated user flow | In review | Merge at least one frontend-to-backend pilot flow |
| API and route smoke coverage | Outstanding | Add automated or clearly recorded smoke coverage |
| QA execution evidence | Outstanding | Close the QA execution matrix in `docs/qa/QA_PLAN.md` |
| Operational runbook baseline | Complete | This baseline now exists and must be kept current |
| Frontend serving strategy decision | Outstanding | Choose and document the serving model |
| Rollback and recovery plan | Outstanding | Add rollback, restore, and incident recovery steps |
| Monitoring and alerting plan | Outstanding | Define pre-launch monitoring checks |
| Secrets externalization | Outstanding | Confirm runtime secret handling outside the repo |

## Immediate Launch Blockers

The repository should not be treated as launch-ready until the following are closed:

- Phase 5 validation PRs are merged
- bench install and migrate validation is accepted
- at least one integrated flow is merged
- API and route smoke coverage exists
- QA evidence is attached for critical user and admin paths
- serving strategy and rollback plan are documented

## Recommended Launch Sequence

1. Merge the current Phase 5 validation and integration workstreams.
2. Decide the frontend serving strategy.
3. Add smoke automation for backend APIs and frontend routes.
4. Execute the QA plan and collect evidence.
5. Finalize rollback, monitoring, and support procedures.
6. Run a go/no-go review only after the above are complete.

## Related Working Documents

```text
docs/architecture/PHASE_IMPLEMENTATION_REVIEW.md
docs/architecture/PHASE_5_HANDOFF.md
docs/qa/QA_PLAN.md
docs/runbook/RUNBOOK.md
docs/deployment/DEPLOYMENT.md
```
