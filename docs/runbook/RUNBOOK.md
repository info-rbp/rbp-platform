# Runbook

## Purpose

This document is now the Phase 5 operational baseline for the Remote Business Partner Platform repository.

It does not pretend production operations are complete, but it does define the minimum working commands, safety rules, and expected validation path for the current integration phase.

## Current Operational State

```text
Repository consolidation: complete
Integration work: active
Production operations: not yet ready
```

## Safety Rules

Never commit:

- local `.env` files
- secrets
- `frontend/portal/node_modules/`
- `frontend/portal/dist/`
- `frontend/portal/build/`
- bench runtime files
- `sites/common_site_config.json`
- logs

Use the committed examples and templates instead:

- `.env.example`
- `.env.local.example`
- `.env.production.example`
- `frontend/portal/.env.example`
- `sites/common_site_config.template.json`
- `infra/bench/Procfile.template`

## Current Working Validation Path

### Frontend build check

```text
cd frontend/portal
npm ci
npm run build
```

Remove generated output after local validation if needed:

```text
rm -rf frontend/portal/dist
```

### Backend syntax check

```text
python3 -m compileall apps/rbp_app/rbp_app
```

### Frappe bench validation path

Use a bench-capable environment and validate:

```text
bench get-app rbp_app /path/to/rbp-platform/apps/rbp_app
bench new-site rbp.localhost
bench --site rbp.localhost install-app rbp_app
bench --site rbp.localhost migrate
bench --site rbp.localhost list-apps
```

### Current integration references

During Phase 5, operators and developers should cross-check:

- `contracts/api/11-route-to-endpoint-map.md`
- `contracts/api/16-mock-to-real-api-map.md`
- `docs/architecture/PHASE_IMPLEMENTATION_REVIEW.md`
- `docs/qa/QA_PLAN.md`

## Common Current Failure Modes

| Failure mode | Likely cause | First response |
|---|---|---|
| Frontend build fails | missing dependencies or broken app import | run `npm ci`, then rerun `npm run build` |
| Backend syntax check fails | imported backend module error | run `python3 -m compileall apps/rbp_app/rbp_app` and inspect the failing module |
| Frappe app will not install | bench/site dependency mismatch | confirm bench environment, app path, and required services |
| Frappe migrate fails | DocType, patch, or dependency issue | inspect migrate output and compare against contract and backend changes |
| Integrated frontend flow fails against backend | wrong API endpoint, auth issue, or payload mismatch | compare frontend adapter with `contracts/api/16-mock-to-real-api-map.md` and backend API module |
| Repository guardrails fail | runtime files or forbidden paths are present | remove generated/runtime files and rerun checks |

## Still Missing Before Production Use

The following are still not complete enough for a production runbook:

- deployment execution procedure
- rollback procedure
- backup and restore procedure
- monitoring and alerting setup
- incident response path
- support escalation path
- environment-specific host and secret setup

## Next Runbook Actions

1. Keep this baseline aligned with the merged Phase 5 validation work.
2. Add bench install and migrate evidence references once the validation PR is merged.
3. Add troubleshooting notes for the first integrated flows after they are merged.
4. Expand this into a production-grade runbook only after deployment and QA paths stabilize.
