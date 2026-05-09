# Phase 5 CI Guardrails

## Status

Phase 5 CI guardrails have been added for the consolidated `rbp-platform` repository.

## Scope

These checks move the repository from a Phase 4 structure-only validation model toward Phase 5 integration safety.

The guardrails validate:

- repository structure and source-of-truth boundaries
- Frappe core exclusion
- generated runtime output exclusion
- frontend install and build
- backend Python syntax
- static smoke coverage for critical integration-era files

## Workflow

GitHub Actions workflow:

```text
.github/workflows/phase5-ci-guardrails.yml
```

## Local Scripts

| Script | Purpose |
|---|---|
| `scripts/ci/check_repository_guardrails.sh` | Verifies required source-of-truth paths exist and forbidden generated/runtime paths are absent. |
| `scripts/ci/check_backend_syntax.sh` | Runs Python compileall against `apps/rbp_app/rbp_app`. |
| `scripts/ci/phase5_static_smoke.sh` | Verifies Phase 5-critical backend, frontend, contract, and handoff files exist. |

## CI Jobs

| Job | Purpose |
|---|---|
| `repository-guardrails` | Runs repository guardrails and static smoke tests. |
| `frontend-build` | Runs `npm ci` and `npm run build` from `frontend/portal`. |
| `backend-syntax` | Runs Python compileall against `rbp_app` source. |

## Review Note

This workflow is intentionally focused on repository safety and fast validation.

Full Frappe bench install, migrate, and runtime testing still need a bench-capable environment and should remain a separate validation track.
