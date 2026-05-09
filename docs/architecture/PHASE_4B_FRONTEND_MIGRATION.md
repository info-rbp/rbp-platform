# Phase 4B Frontend Portal Migration

## Purpose

This document records the migration of the React/Vite frontend from `info-rbp/Uiuxdesignassistance` into `info-rbp/rbp-platform`.

The frontend is staged as a separate portal under `frontend/portal/`.

## Source

Repository:

```text
info-rbp/Uiuxdesignassistance

Branch:

main

Source commit:

6165346d4fc29fba6b78ec84e32285159a182c82
Target
frontend/portal/
Migrated Content

Expected migrated content includes:

React/Vite application files
package.json
package-lock.json
vite.config.ts
index.html
src/
frontend route configuration
navigation configuration
mock service layer
frontend scripts
UI documentation and implementation notes where applicable
Explicitly Not Migrated

This migration does not include:

node_modules/
frontend build output
local .env files
generated caches
backend source code
rbp_app/
Frappe framework core
frappe/
apps/frappe/
Notes

Phase 2 contracts were migrated separately into contracts/, specs/, docs/api-contracts/, and docs/product-flows/.

This frontend migration does not perform Phase 5 integration. Backend API wiring, environment-specific API configuration, and production deployment remain later work.

Status

Frontend portal source migrated into the consolidated repository structure.
