# Phase 5 Frappe App Validation

## Status

Consolidated Frappe app validation for Phase 5 preflight.

## Repository

    info-rbp/rbp-platform

## App Path

    apps/rbp_app

## Validation Scope

This validation confirms that the consolidated rbp_app can be validated from a Frappe bench environment.

This step does not implement frontend/backend integration, deployment, payment provider integration, or production launch changes.

## Commands Validated

| Check | Command | Status | Evidence |
|---|---|---|---|
| Bench environment captured | bench --version and bench version | Pass | docs/qa/evidence/phase5-frappe-validation-environment.txt |
| App available to bench | bench get-app or existing bench app | Pass | docs/qa/evidence/phase5-frappe-get-app-output.txt |
| Validation site available | bench new-site or existing site | Pass | docs/qa/evidence/phase5-frappe-new-site-output.txt |
| Install app | bench --site SITE_NAME install-app rbp_app | Pass | docs/qa/evidence/phase5-frappe-install-app-output.txt |
| Migrate | bench --site SITE_NAME migrate | Pass | docs/qa/evidence/phase5-frappe-migrate-output.txt |
| Clear cache | bench --site SITE_NAME clear-cache | Pass | docs/qa/evidence/phase5-frappe-clear-cache-output.txt |
| Allow tests enabled | bench --site SITE_NAME set-config allow_tests true | Pass | docs/qa/evidence/phase5-frappe-allow-tests-output.txt |
| Run tests | bench --site SITE_NAME run-tests --app rbp_app | Pass | docs/qa/evidence/phase5-frappe-run-tests-output.txt |
| Python syntax validation | python3 -m compileall -q apps/rbp_app/rbp_app | Pass | docs/qa/evidence/phase5-rbp-app-compileall-output.txt |
| Installed app confirmation | bench --site SITE_NAME list-apps | Pass | docs/qa/evidence/phase5-frappe-installed-app-confirmation.txt |

## Acceptance Criteria

| Item | Status | Notes |
|---|---|---|
| apps/rbp_app exists | Pass | Consolidated custom Frappe app is present. |
| rbp_app can be made available to bench | Pass | App is present in bench apps directory. |
| install-app passes or app is already installed | Pass | Install step succeeded or existing install confirmed. |
| migrate passes | Pass | Site migration completed successfully after bench services were started. |
| clear-cache passes | Pass | Cache cleared successfully. |
| run-tests passes | Pass | rbp_app test suite completed successfully. |
| compileall passes | Pass | Consolidated Python source compiles. |
| No Frappe core copied into rbp-platform | Pass | Validation used bench-managed Frappe core outside rbp-platform. |
| No generated bench runtime committed | Pending final review | Confirmed by git status before commit. |

## Environment Note

Initial migrate attempt failed because redis_cache was not running. The bench services were started with bench start, then migrate was rerun successfully.

## Evidence Files

- docs/qa/evidence/phase5-frappe-validation-environment.txt
- docs/qa/evidence/phase5-frappe-get-app-output.txt
- docs/qa/evidence/phase5-frappe-new-site-output.txt
- docs/qa/evidence/phase5-frappe-install-app-output.txt
- docs/qa/evidence/phase5-frappe-migrate-output.txt
- docs/qa/evidence/phase5-frappe-clear-cache-output.txt
- docs/qa/evidence/phase5-frappe-allow-tests-output.txt
- docs/qa/evidence/phase5-frappe-run-tests-output.txt
- docs/qa/evidence/phase5-rbp-app-compileall-output.txt
- docs/qa/evidence/phase5-frappe-installed-app-confirmation.txt
- docs/qa/evidence/phase5-frappe-migrate-diagnostic.txt

## Final Decision

Frappe app validation is accepted for Phase 5 preflight once this report and evidence are merged.
