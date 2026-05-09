# Runbook

## Purpose

This document is the placeholder operational runbook for the Remote Business Partner Platform after Phase 4 Consolidation.

Phase 4 created the consolidated repository and deployment skeleton. It did not create a production operations runbook, because operating a system that is not yet integrated would be performance art with logs.

## Current Status

```text
Phase 4 status: runbook placeholder present
Phase 5+ status: operational runbook required
```

## Runbook Scope for Later Phases

The production runbook should eventually cover:

- local development startup
- Frappe bench startup
- frontend startup
- app install process
- migration process
- deployment process
- rollback process
- backup and restore process
- environment variable management
- secret management
- monitoring checks
- common failure modes
- incident response process
- support escalation process

## Required Inputs

The runbook should be built from:

```text
docs/architecture/ARCHITECTURE.md
docs/deployment/DEPLOYMENT.md
docs/qa/QA_PLAN.md
docs/launch/LAUNCH_PLAN.md
docs/architecture/PHASE_5_CI_PLAN.md
infra/bench/Procfile.template
sites/common_site_config.template.json
apps/rbp_app/
frontend/portal/
```

## Initial Operational Sections to Complete Later

| Section | Required Before Production? | Notes |
|---|---:|---|
| Local development setup | Yes | Include backend and frontend setup |
| Frappe bench setup | Yes | Include app install and migrate |
| Frontend build/run | Yes | Include `npm ci`, `npm run build`, and dev server notes |
| Environment configuration | Yes | Link env examples and secret rules |
| Deployment steps | Yes | Must be concrete before launch |
| Rollback steps | Yes | Required before launch |
| Backup/restore steps | Yes | Required before launch |
| Monitoring checks | Yes | Required before launch |
| Incident response | Yes | Required before launch |
| Troubleshooting | Yes | Add known failure modes during Phase 5/QA |

## Non-Goals for Phase 4

Phase 4 did not complete:

- production operations runbook
- deployment execution procedure
- incident response process
- backup/restore validation
- monitoring configuration
- support escalation process

## Status

This placeholder completes the Phase 4 documentation surface for operational runbook planning.

Detailed runbook content belongs to Phase 5 and later phases after integration and deployment validation.
