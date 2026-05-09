# Phase 5 Source Freeze

## Status

`info-rbp/rbp-platform` on `main` is the only approved candidate source for Phase 5 Integration.

## Source of Truth

All Phase 5 work must start from:

```text
https://github.com/info-rbp/rbp-platform
branch: main
Old Repository Roles

The previous repositories are now reference/source-history repositories only.

Repository	Phase Role	Phase 5 Role
info-rbp/Uiuxdesignassistance	Phase 1 UI/UX and Phase 2 contract source	Reference only
info-rbp/frappe-project	Phase 3 Frappe backend source	Reference only
info-rbp/rbp-platform	Phase 4 consolidation target	Active Phase 5 source of truth
Rules
Do not begin Phase 5 work from Uiuxdesignassistance.
Do not begin Phase 5 work from frappe-project.
Do not copy whole source repositories back into rbp-platform.
Do not re-import Frappe core.
Do not commit generated files, local environment files, bench runtime files, secrets, node_modules, dist, or logs.
Contract changes must be documented before integration code depends on them.
Phase 5 branches must be created from rbp-platform/main.
Required First Phase 5 Checks

Before implementation starts:

Run frontend install/build from frontend/portal.
Run backend syntax validation from apps/rbp_app.
Run Frappe install/migrate/test validation from a bench environment.
Compare frontend mock services against contracts/api/16-mock-to-real-api-map.md.
Compare routes against contracts/api/11-route-to-endpoint-map.md.
Freeze Decision

Phase 5 may use rbp-platform/main as the starting point only after this document is merged.
