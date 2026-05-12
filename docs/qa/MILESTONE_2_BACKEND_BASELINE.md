# Milestone 2: Confirm Backend Baseline

## Purpose

Milestone 2 proves that the existing `rbp_app` backend is healthy before later launch work is added. It is a backend health-confirmation gate only.

This milestone does not implement Stripe, email notification delivery, Applications, admin enhancements, frontend integration, or new product functionality.

## Why This Must Pass First

Stripe, email, admin, Application, and launch work should build on a stable backend. A passing baseline means the current app compiles, migrates on the minimal site, clears Frappe cache, runs the app test suite, and does not leave generated runtime artifacts in source control.

If this gate fails, later feature work may hide existing backend breakage or create ambiguous failures.

## Single Entry Point

Run the validator through:

```sh
scripts/confirm_backend_baseline.sh
```

The script writes Markdown and JSON reports under `reports/backend-baseline/`. That directory is generated output and is ignored by git.

## Expected Layout

The default app name is `rbp_app`.

The default backend source path is `rbp_app/rbp_app`. The validator records the detected source path in every report.

The default bench root is `start`.

The default minimal site is `rbp-minimal.localhost`, expected under `start/sites/rbp-minimal.localhost`.

The script does not create a bench or site automatically.

## Supported Environment Variables

`RBP_BENCH_ROOT` overrides the bench root. The default is `start`.

`RBP_BASELINE_SITE` overrides the target site. The default is `rbp-minimal.localhost`.

`RBP_APP_NAME` overrides the app name. The default is `rbp_app`.

## Validation Checks

The validator runs these stages in order:

| Stage | Purpose |
| --- | --- |
| Git working tree snapshot | Records initial `git status --short` and continues if unrelated changes already exist. |
| Python compile | Runs Python `compileall` against the backend source. |
| Bench/site check | Confirms the bench root, `sites/`, and configured minimal site exist. |
| Frappe migrate | Runs `bench --site <site> migrate` from the bench root. |
| Frappe clear-cache | Runs `bench --site <site> clear-cache` from the bench root. |
| rbp_app tests | Runs `bench --site <site> run-tests --app rbp_app`. |
| Artifact check | Fails if generated bench, site, build, log, cache, or bytecode artifacts appear in git status. |

## Passing Result

A passing result means the configured backend source compiles, the configured minimal Frappe site migrates, Frappe cache clearing succeeds, the `rbp_app` test suite passes, and no generated artifacts are visible in git status.

It does not mean new launch functionality exists. It only confirms the backend baseline is safe to build on.

## Failing Result

A failing result means the report and raw logs should be treated as the source of truth. Do not mark Milestone 2 as complete until the failing stage is fixed and the validator passes.

If the Frappe site is missing, restore or create the minimal local QA site outside this milestone and rerun the script. The script intentionally does not create sites. If the bench root has `sites/` but no runnable bench environment, restore the bench runtime before rerunning.

If migration fails, inspect the migration log for the failing patch, DocType, or module. Apply the smallest valid backend fix and rerun the script.

If tests fail, determine whether the failure is a real backend baseline issue or an environment problem. Fix real baseline issues without weakening tests.

If generated files appear in git status, remove safe generated output from the working tree or update `.gitignore` precisely. Do not commit generated bench, site, cache, log, bytecode, or build artifacts.

## Generated Reports

Each run writes:

| Output | Meaning |
| --- | --- |
| `reports/backend-baseline/backend-baseline-YYYYMMDD-HHMMSS.md` | Human-readable milestone report. |
| `reports/backend-baseline/latest.json` | Machine-readable latest summary. |
| `reports/backend-baseline/logs/` | Raw stage logs and git status snapshots. |

Reports include repository root, bench root, site name, app name, git branch, git commit, Python version, bench/Frappe versions when available, start/end times, stage results, initial/final git status, failure reason, and log locations.

## Artifacts That Must Not Be Committed

Do not commit generated artifacts such as:

- `__pycache__/`
- `*.pyc`
- `.pytest_cache/`
- `.coverage`
- `htmlcov/`
- `node_modules/`
- `dist/`
- `build/`
- `start/sites/*/private/backups/`
- `start/sites/*/logs/`
- `start/logs/`
- `*.log`

Source files, DocTypes, patches, tests, fixtures, and app code remain valid source-controlled material.
