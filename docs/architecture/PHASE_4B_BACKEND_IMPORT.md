# Phase 4B Backend rbp_app Import

## Purpose

This document records the Phase 4B import of the custom Frappe app `rbp_app` from `info-rbp/frappe-project` into `info-rbp/rbp-platform`.

The import stages the backend application source inside the consolidated repository structure without importing Frappe framework core.

This was a structured consolidation step only. It did not perform Phase 5 frontend/backend integration, production deployment, QA, or launch validation.

## Source Repository

Repository:

```text
info-rbp/frappe-project
```

Branch:

```text
main
```

Source commit:

```text
bf8dc2c1bb14107c52a4eef9f3743d4580d0e5a1
```

Source path:

```text
rbp_app/
```

## Target Location

The backend custom app was imported into:

```text
apps/rbp_app/
```

## Imported Content

The imported backend content includes the custom Frappe app source and supporting documentation.

Expected imported content includes:

- custom Frappe app package
- `pyproject.toml`
- app hooks
- DocTypes
- API modules
- service modules
- permission and guard logic
- install hooks and patches
- templates
- public assets
- website route files
- backend tests
- backend documentation
- Phase 3 validation and handoff documents

Key expected backend files and directories include:

```text
apps/rbp_app/pyproject.toml
apps/rbp_app/README.md
apps/rbp_app/HANDOFF.md
apps/rbp_app/docs/platform-validation-report.md
apps/rbp_app/rbp_app/hooks.py
apps/rbp_app/rbp_app/api/
apps/rbp_app/rbp_app/services/
apps/rbp_app/rbp_app/doctype/
apps/rbp_app/rbp_app/tests/
apps/rbp_app/rbp_app/templates/
apps/rbp_app/rbp_app/public/
apps/rbp_app/rbp_app/www/
```

## Explicitly Not Imported

The backend import did not include:

- Frappe framework core
- `frappe/`
- `apps/frappe/`
- bench runtime files
- `sites/`
- logs
- generated reports
- local environment files
- cache directories
- frontend source code
- `node_modules/`
- generated frontend build output
- local development-only files
- secrets

## Frappe Core Boundary

The production backend unit for this repository is the custom Frappe app only:

```text
apps/rbp_app/
```

Frappe itself remains an external framework dependency installed and managed through bench or deployment tooling.

The consolidation must not copy the Frappe framework into `rbp-platform`.

## Validation Performed During Import

The backend import was validated during Phase 4B by checking that expected app files were present and forbidden framework/runtime paths were absent.

Validation included confirming:

- `apps/rbp_app/` exists
- `apps/rbp_app/pyproject.toml` exists
- `apps/rbp_app/rbp_app/hooks.py` exists
- `apps/rbp_app/rbp_app/doctype/` exists
- `apps/rbp_app/rbp_app/api/` exists
- `apps/rbp_app/rbp_app/services/` exists
- `apps/rbp_app/rbp_app/tests/` exists
- `apps/rbp_app/README.md` exists
- `apps/rbp_app/HANDOFF.md` exists
- `apps/rbp_app/docs/platform-validation-report.md` exists
- no top-level `frappe/` directory exists
- no `apps/frappe/` directory exists
- no bench `sites/` directory was imported
- no logs directory was imported
- no backend `.env` file was imported
- no generated test reports were imported

During migration validation, a Python syntax smoke check was also run with:

```text
python3 -m compileall apps/rbp_app/rbp_app
```

## Known Follow-Up Items

The Phase 4 completion report records one backend structure follow-up:

- confirm whether top-level `apps/rbp_app/services/` and `apps/rbp_app/tests/` are intentional long-term files or legacy compatibility shims

That review belongs to Phase 5 backend validation unless these files are found to be incorrect or unsafe.

## Phase 5 Usage

Phase 5 should use this backend app as the integration starting point for:

- Frappe bench app install validation
- Frappe migrate smoke testing
- DocType validation
- permission and guard validation
- API endpoint validation
- route smoke testing
- frontend-to-backend integration
- contract alignment against `contracts/`

Phase 5 should not re-import the full `frappe-project` repository.

## Status

The custom Frappe app `rbp_app` has been imported into the consolidated `rbp-platform` repository under `apps/rbp_app/`.

This document is the Phase 4B migration record for the backend app import.
