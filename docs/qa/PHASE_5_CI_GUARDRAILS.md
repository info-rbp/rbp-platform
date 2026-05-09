# Phase 5 CI Guardrails

## Status

Phase 5 CI guardrails have been added for the consolidated rbp-platform repository.

## Repository

    info-rbp/rbp-platform

## Scope

This change adds CI checks for Phase 5 preflight and integration safety.

The CI guardrails validate:

- repository structure
- Frappe core exclusion
- generated/runtime file exclusion
- frontend install and build
- backend Python syntax
- static Phase 5 smoke checks

## Workflow

GitHub Actions workflow:

    .github/workflows/phase5-ci-guardrails.yml

## Local Scripts

| Script | Purpose |
|---|---|
| scripts/ci/check_repository_guardrails.sh | Verifies required source-of-truth paths exist and forbidden generated/runtime paths are absent. |
| scripts/ci/check_backend_syntax.sh | Runs Python compileall against apps/rbp_app/rbp_app. |
| scripts/ci/phase5_static_smoke.sh | Verifies Phase 5-critical backend, frontend, contract, and handoff files exist. |
| scripts/ci/run_phase5_ci_locally.sh | Runs the local CI guardrail sequence including frontend install/build. |

## CI Jobs

| Job | Purpose |
|---|---|
| repository-guardrails | Runs repository guardrails and static smoke tests. |
| frontend-build | Runs npm ci and npm run build from frontend/portal. |
| backend-syntax | Runs Python compileall against rbp_app source. |
| ci-summary | Confirms all guardrail jobs passed. |

## Acceptance Criteria

| Item | Status | Evidence |
|---|---|---|
| Frontend build check added | Pass | .github/workflows/phase5-ci-guardrails.yml |
| Backend syntax check added | Pass | scripts/ci/check_backend_syntax.sh |
| Frappe core exclusion check added | Pass | scripts/ci/check_repository_guardrails.sh |
| Generated/runtime exclusion check added | Pass | scripts/ci/check_repository_guardrails.sh |
| Static smoke tests added | Pass | scripts/ci/phase5_static_smoke.sh |
| Local CI runner added | Pass | scripts/ci/run_phase5_ci_locally.sh |
| Local evidence captured | Pass | docs/qa/evidence/phase5-ci-guardrails-local-output.txt |

## Important Note

This CI does not run full Frappe bench install/migrate tests inside GitHub Actions.

Full Frappe bench validation remains documented separately because it requires a working bench environment with Redis, database services, and site setup.

## Final Decision

The CI guardrails are accepted once this workflow, scripts, report, and evidence are merged.
