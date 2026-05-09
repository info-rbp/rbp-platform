# Launch Plan

## Purpose

This document is the placeholder launch plan for the Remote Business Partner Platform after Phase 4 Consolidation.

Phase 4 did not perform launch preparation or production release. It created the consolidated source-of-truth repository so later launch planning can happen from a clean structure instead of a digital junk drawer wearing a README.

## Current Status

```text
Phase 4 status: launch placeholder present
Phase 5+ status: launch planning required
```

## Launch Scope for Later Phases

Launch planning should eventually cover:

- target environments
- release ownership
- deployment process
- rollback process
- production configuration
- secret management
- database readiness
- Redis/cache readiness
- frontend hosting model
- Frappe bench deployment model
- domain and DNS setup
- SSL/TLS setup
- monitoring and alerting
- incident response
- user acceptance testing
- go/no-go criteria
- post-launch support process

## Required Inputs Before Launch Planning Can Be Finalized

Launch planning depends on:

```text
docs/architecture/ARCHITECTURE.md
docs/deployment/DEPLOYMENT.md
docs/qa/QA_PLAN.md
docs/runbook/RUNBOOK.md
docs/architecture/PHASE_5_HANDOFF.md
docs/architecture/PHASE_5_CI_PLAN.md
infra/
apps/rbp_app/
frontend/portal/
```

## Initial Launch Readiness Checklist

| Area | Required Before Launch? | Notes |
|---|---:|---|
| Phase 5 integration complete | Yes | Frontend/backend integration must be validated |
| Frappe app install validated | Yes | Bench install must pass |
| Frappe migrate validated | Yes | Migration smoke must pass |
| Frontend build validated | Yes | CI build must pass |
| API smoke tests passing | Yes | Backend API behavior must be proven |
| Route smoke tests passing | Yes | Major frontend routes must be proven |
| QA plan executed | Yes | QA cannot remain a placeholder at launch |
| Deployment runbook complete | Yes | Operators need actual steps, not vibes |
| Rollback plan complete | Yes | Required before production release |
| Secrets externalized | Yes | No secrets in repository |
| Monitoring defined | Yes | Required before production launch |

## Non-Goals for Phase 4

Phase 4 did not complete:

- production launch planning
- release calendar
- go-live decision
- deployment execution
- rollback validation
- production monitoring setup
- incident response process

## Status

This placeholder completes the Phase 4 documentation surface for launch planning.

Detailed launch planning belongs to Phase 5 and later phases after integration, QA, and deployment validation.
