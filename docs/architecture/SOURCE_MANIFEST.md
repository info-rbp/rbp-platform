# Source Manifest

This file records the source repository states used to initialize the Phase 4A foundation of `info-rbp/rbp-platform`.

## Target Repository

Repository: `info-rbp/rbp-platform`

Default branch: `main`

Phase 4A branch: `phase/phase-4a-foundation`

Repository state at start:

- Initialized: `yes`
- Starting commit: `88d2176`

Purpose:

- final source-of-truth repository foundation
- completed Phase 1 frontend migration target
- completed Phase 2 contract/spec migration target
- backend import placeholder pending Phase 3 completion

## Phase 1 UI/UX Source

Repository: `info-rbp/Uiuxdesignassistance`

Repository access: `reachable metadata check attempted; clone/list blocked by GitHub HTTP 403 in this environment`

Default branch: `main` (project requirement baseline)

Source branch: `main`

Status: Phase 1 complete

Detected source indicators (verification run blocked in this environment):

- `package.json` (not verified locally)
- `package-lock.json` (not verified locally)
- `vite.config.ts` (not verified locally)
- `index.html` (not verified locally)
- `src/main.tsx` (not verified locally)
- `src/app/App.tsx` (not verified locally)
- `src/app/routes.tsx` (not verified locally)
- `src/app/config/navigation.ts` (not verified locally)
- `src/app/config/routes.registry.ts` (not verified locally)
- `src/app/services/mock/` (not verified locally)
- `scripts/phase1-audit.mjs` (not verified locally)

Planned import target:

```text
frontend/portal/
```

Verification notes:

- Attempted source inspection command: `git ls-remote https://github.com/info-rbp/Uiuxdesignassistance.git`
- Result: `CONNECT tunnel failed, response 403`
- No files were copied or migrated into `info-rbp/rbp-platform` during this update.

## Phase 3 Backend Source

Repository: `info-rbp/frappe-project`

Default branch: `unknown (repository not accessible from current environment)`

Source branch: `main`

Source commit: `unknown (repository not accessible from current environment)`

Backend source state:

- `rbp_app` exists: `unverified (repository not accessible from current environment)`
- `rbp_app` location: `unverified`
- `frappe/` core exists in repo: `unverified`
- `rbp_app` import status: `pending for Phase 4B (not imported in Phase 4A)`

Known handoff/validation files to verify later:

- `rbp_app/README.md`
- `rbp_app/HANDOFF.md`
- `rbp_app/docs/platform-validation-report.md`
- `rbp_app/pyproject.toml`

## Phase 4A Step 1 Scope Confirmation

This step intentionally performed only source-state confirmation and manifest initialization in the target repository.

Explicitly **not** performed:

- frontend code migration
- contract migration
- `rbp_app` import
- `frappe/` core copy
- destructive changes to any source repository
