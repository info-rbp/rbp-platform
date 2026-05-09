# Consolidated Repository Validation

## Purpose

This document records the validation state of the consolidated `rbp-platform` repository at the end of Phase 4.

## Required Paths

| Path | Expected |
|---|---:|
| `apps/rbp_app/pyproject.toml` | Present |
| `apps/rbp_app/rbp_app/hooks.py` | Present |
| `apps/rbp_app/rbp_app/doctype/` | Present |
| `apps/rbp_app/rbp_app/api/` | Present |
| `apps/rbp_app/rbp_app/services/` | Present |
| `apps/rbp_app/rbp_app/tests/` | Present |
| `frontend/portal/package.json` | Present |
| `frontend/portal/src/` | Present |
| `contracts/api/` | Present |
| `contracts/doctypes/` | Present |
| `contracts/workflows/` | Present |
| `contracts/permissions/` | Present |

## Forbidden Paths

| Path | Expected |
|---|---:|
| `frappe/` | Absent |
| `apps/frappe/` | Absent |
| `frontend/portal/node_modules/` | Absent |
| `frontend/portal/dist/` | Absent |
| `sites/` | Absent |
| `logs/` | Absent |
| local `.env` files | Absent |

## Validation Commands

The Phase 4 wrap-up branch should validate the repository shape with shell `test` commands before merge.

## Result

The repository is ready for Phase 5 integration planning and technical validation.
