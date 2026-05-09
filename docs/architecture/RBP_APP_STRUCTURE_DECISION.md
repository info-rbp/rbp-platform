# rbp_app Structure Decision

## Purpose

This document records the Phase 4 decision for top-level backend folders imported with the custom Frappe app.

The Phase 4 completion report flagged the following paths for confirmation:

```text
apps/rbp_app/services/
apps/rbp_app/tests/
```

The purpose of this review is to determine whether these folders should be removed during Phase 4 or retained for Phase 5 backend validation.

## Decision

```text
Decision: keep for Phase 5 validation
```

The top-level `apps/rbp_app/services/` and `apps/rbp_app/tests/` paths should be retained at the end of Phase 4.

They were imported as part of the `rbp_app/` source package from `info-rbp/frappe-project` and are not Frappe framework core, bench runtime files, generated frontend output, local environment files, or secrets.

Removing them during Phase 4 would be premature because Phase 4 is a consolidation phase, not a backend refactor phase.

## Source Context

Backend source repository:

```text
info-rbp/frappe-project
```

Source commit recorded for Phase 4:

```text
bf8dc2c1bb14107c52a4eef9f3743d4580d0e5a1
```

Imported backend target:

```text
apps/rbp_app/
```

## Current Structure Observed

The consolidated backend app contains the expected package-internal app structure:

```text
apps/rbp_app/rbp_app/
apps/rbp_app/rbp_app/api/
apps/rbp_app/rbp_app/doctype/
apps/rbp_app/rbp_app/services/
apps/rbp_app/rbp_app/tests/
```

The imported app may also contain top-level support folders:

```text
apps/rbp_app/services/
apps/rbp_app/tests/
```

These paths are retained as imported source/reference material until Phase 5 validates whether they are active source, compatibility shims, or redundant scaffolding.

## File Count Snapshot

The following counts were captured when this decision document was created:

| Path | File Count |
|---|---:|
| `apps/rbp_app/services/` | 3 |
| `apps/rbp_app/tests/` | 1 |
| `apps/rbp_app/rbp_app/services/` | 66 |
| `apps/rbp_app/rbp_app/tests/` | 38 |

## Why This Is Not a Phase 4 Blocker

Phase 4 was responsible for structured consolidation, source extraction, and clean repository organization.

The top-level `services/` and `tests/` folders do not violate Phase 4 constraints because:

- they are inside the imported custom app boundary `apps/rbp_app/`
- they are not Frappe framework core
- they are not `frappe/`
- they are not `apps/frappe/`
- they are not bench runtime directories
- they are not generated build output
- they are not local environment files
- they are not secrets

## Phase 5 Required Review

Phase 5 backend validation should determine whether these top-level paths are:

1. active support folders required by the app
2. compatibility shims used by tests or scripts
3. duplicated source that should be folded into `apps/rbp_app/rbp_app/`
4. redundant scaffolding that can be removed safely

Phase 5 should not delete these paths blindly. The review should check imports, test references, app packaging behavior, and bench install behavior first.

## Validation Commands Used

The following commands were used during this review:

```text
find apps/rbp_app -maxdepth 2 -type d | sort
find apps/rbp_app/services -maxdepth 3 -type f | sort
find apps/rbp_app/tests -maxdepth 3 -type f | sort
find apps/rbp_app/rbp_app/services -maxdepth 3 -type f | sort
find apps/rbp_app/rbp_app/tests -maxdepth 3 -type f | sort
```

## Final Phase 4 Position

```text
Phase 4 decision: retain top-level apps/rbp_app/services/ and apps/rbp_app/tests/ as imported source/reference material.
Phase 5 decision required: validate whether to keep, move, merge, or remove them after backend install/test review.
```

This closes the Phase 4 structure-decision follow-up without performing backend refactoring during consolidation.
