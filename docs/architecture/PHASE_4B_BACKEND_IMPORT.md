# Phase 4B Backend App Import

## Purpose

This document records the import of the custom Frappe app `rbp_app` from `info-rbp/frappe-project` into `info-rbp/rbp-platform`.

This import stages the backend application source inside the consolidated repository structure without importing Frappe framework core.

## Source

Repository:

```text
info-rbp/frappe-project

Branch:

main

Source commit:

bf8dc2c1bb14107c52a4eef9f3743d4580d0e5a1

Source path:

rbp_app/
Target
apps/rbp_app/
Imported Content

Expected imported content includes:

custom Frappe app package
pyproject.toml
app hooks
DocTypes
API modules
service modules
permission/guard logic
tests
app documentation
validation and handoff documents
Explicitly Not Imported

This import does not include:

Frappe framework core
frappe/
apps/frappe/
bench runtime files
sites/
logs
generated reports
local environment files
cache directories
frontend source code
node_modules/
generated frontend build output
Validation Expectations

The backend import is valid when the following are true:

apps/rbp_app/pyproject.toml exists
apps/rbp_app/rbp_app/hooks.py exists
apps/rbp_app/rbp_app/doctype/ exists
apps/rbp_app/rbp_app/api/ exists
apps/rbp_app/rbp_app/services/ exists
apps/rbp_app/rbp_app/tests/ exists
no top-level frappe/ exists
no apps/frappe/ exists
no bench runtime files are imported
no secrets or local env files are imported
Status

Backend custom Frappe app imported into the consolidated repository structure.

This import does not perform Phase 5 frontend/backend integration.


---
