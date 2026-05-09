# Phase 5 CI Plan

## Purpose

This document defines the recommended CI/CD validation plan for Phase 5 Integration of the Remote Business Partner Platform.

Phase 4 created the consolidated source-of-truth repository. Phase 5 should expand validation from structural checks into build, install, smoke, and integration checks.

This document is a plan only. It does not implement production CI/CD.

## Current CI State

The current repository includes a Phase 4A validation workflow:

```text
.github/workflows/phase4a-validation.yml
```

That workflow validates the required repository structure and guards against accidental Frappe framework core import.

It checks that key paths exist, including:

- `apps/rbp_app/`
- `frontend/portal/`
- `contracts/`
- `specs/onboarding-flows/`
- `infra/`
- `docs/`
- `tests/`

It also blocks accidental import of:

- `frappe/`
- `apps/frappe/`

## Phase 5 CI Goal

Phase 5 CI should validate that the consolidated repository is not only structurally correct, but also technically usable for integration.

The goal is to introduce CI checks in stages, avoiding a giant brittle pipeline that fails for mysterious reasons and ruins everyones afternoon.

## Recommended CI Stages

### Stage 1 - Repository Structure Guard

Status:

```text
Already present from Phase 4
```

Purpose:

- confirm required repository paths exist
- block Frappe core import
- block accidental structural regression

Existing workflow:

```text
.github/workflows/phase4a-validation.yml
```

Recommended future name:

```text
.github/workflows/repository-structure.yml
```

### Stage 2 - Frontend Validation

Target path:

```text
frontend/portal/
```

Recommended checks:

- install frontend dependencies
- run frontend build
- add lint check if a lint script exists or is added
- add typecheck check if a typecheck script exists or is added

Recommended initial commands:

```text
cd frontend/portal
npm ci
npm run build
```

Optional future commands:

```text
npm run lint
npm run typecheck
```

Notes:

- `npm ci` should be preferred in CI because `package-lock.json` is present.
- If frontend scripts are missing, Phase 5 should add them before enforcing the check.
- Generated output such as `dist/` must not be committed.

### Stage 3 - Backend Static Validation

Target path:

```text
apps/rbp_app/
```

Recommended checks:

- Python syntax compile check
- Ruff lint check if dependencies are available
- verify app metadata exists
- verify hooks file exists

Recommended initial commands:

```text
python3 -m compileall apps/rbp_app/rbp_app
test -f apps/rbp_app/pyproject.toml
test -f apps/rbp_app/rbp_app/hooks.py
```

Optional future command:

```text
ruff check apps/rbp_app/rbp_app
```

Notes:

- Static validation can run before full Frappe bench setup.
- Ruff should be added only when dependency installation is stable in CI.

### Stage 4 - Frappe App Install Smoke Test

Target path:

```text
apps/rbp_app/
```

Recommended checks:

- initialize a bench-compatible test environment
- install the custom app
- confirm app registration
- fail if Frappe core is copied into this repository instead of installed externally

Recommended logical flow:

```text
bench get-app rbp_app ./apps/rbp_app
bench new-site test.localhost --admin-password admin --mariadb-root-password root
bench --site test.localhost install-app rbp_app
bench --site test.localhost list-apps
```

Notes:

- Exact commands may vary depending on the CI runner, database service, Redis service, and Frappe version.
- This should be introduced after the backend app install path is validated locally.
- This check is higher cost and should not block early documentation-only PRs until stable.

### Stage 5 - Frappe Migrate Smoke Test

Recommended checks:

- run migrations after installing `rbp_app`
- validate DocType metadata can load
- detect broken patches early

Recommended logical command:

```text
bench --site test.localhost migrate
```

Notes:

- This should become required before production deployment work.
- Failures here should block Phase 5 integration completion.

### Stage 6 - Backend Test Smoke

Target path:

```text
apps/rbp_app/rbp_app/tests/
```

Recommended checks:

- run a small backend smoke test subset first
- expand to unit and integration tests once the bench site is stable

Recommended logical commands:

```text
bench --site test.localhost run-tests --app rbp_app
```

Potential phased approach:

1. import/syntax checks
2. smoke tests only
3. full app tests
4. integration tests

### Stage 7 - API Smoke Test

Recommended checks:

- validate key backend API routes load
- compare implemented routes against `contracts/api/11-route-to-endpoint-map.md`
- confirm error response format aligns with `contracts/api/01-api-response-envelope-standard.md`

Recommended inputs:

```text
contracts/api/01-api-response-envelope-standard.md
contracts/api/07-error-catalogue.md
contracts/api/11-route-to-endpoint-map.md
contracts/api/16-mock-to-real-api-map.md
apps/rbp_app/rbp_app/api/
```

### Stage 8 - Frontend Route Smoke Test

Recommended checks:

- build frontend
- validate major routes are registered
- compare frontend route registry against Phase 2 route contracts
- ensure mock-to-real replacement boundaries are known

Recommended inputs:

```text
frontend/portal/src/app/routes.tsx
frontend/portal/src/app/config/routes.registry.ts
frontend/portal/src/app/services/mock/
contracts/api/11-route-to-endpoint-map.md
contracts/api/16-mock-to-real-api-map.md
```

## Recommended Workflow Files

Phase 5 may introduce separate workflows rather than one enormous pipeline.

Recommended files:

```text
.github/workflows/repository-structure.yml
.github/workflows/frontend-validation.yml
.github/workflows/backend-static-validation.yml
.github/workflows/frappe-smoke.yml
.github/workflows/integration-smoke.yml
```

Recommended order of implementation:

1. keep or rename structure guard
2. add frontend install/build validation
3. add backend static validation
4. add Frappe install smoke once local bench validation succeeds
5. add Frappe migrate smoke
6. add backend test smoke
7. add API and route smoke checks

## Required Versus Optional Checks

| Check | Required For Early Phase 5 | Required Before Phase 5 Completion | Notes |
|---|---:|---:|---|
| Repository structure guard | Yes | Yes | Already present from Phase 4 |
| Frappe core exclusion guard | Yes | Yes | Already present from Phase 4 |
| Frontend install | Yes | Yes | Use `npm ci` |
| Frontend build | Yes | Yes | Use `npm run build` |
| Frontend lint | No | Yes, if script exists | Add script first if missing |
| Frontend typecheck | No | Yes, if TypeScript config supports it | Add script first if missing |
| Backend syntax compile | Yes | Yes | Use `python3 -m compileall` |
| Backend lint | No | Yes | Use Ruff once dependency setup is stable |
| Frappe app install smoke | No | Yes | Requires bench/test site setup |
| Frappe migrate smoke | No | Yes | Required before deployment readiness |
| Backend app tests | No | Yes | Requires bench site |
| API smoke test | No | Yes | Requires running backend |
| Route smoke test | No | Yes | Requires frontend/backend route mapping |

## Non-Goals

Phase 5 CI planning does not mean:

- production deployment is ready
- QA/UAT is complete
- frontend/backend integration is complete
- all tests must be fully implemented immediately
- Frappe core should be copied into the repository

## Secret and Runtime Safety

CI must not commit or expose:

- `.env` files
- database passwords
- API keys
- private keys
- bench runtime directories
- `sites/`
- logs
- generated build output
- `node_modules/`

Use GitHub Actions secrets or deployment secret managers for sensitive values.

## Recommended Phase 5 First PR

The first Phase 5 CI PR should add frontend and backend static validation only:

```text
frontend: npm ci && npm run build
backend: python3 -m compileall apps/rbp_app/rbp_app
guards: no frappe/, no apps/frappe/, no node_modules, no dist
```

This gives fast confidence before adding heavier bench-based checks.

## Status

This document completes the Phase 4 final-polish item for a dedicated Phase 5 CI plan.

The CI implementation itself belongs to Phase 5.
