# Phase 1 Decisions Log

## Purpose

This log records implementation decisions made during Phase 1 UI/UX Completion.

## Decisions

### Decision 001: Keep raw Stitch files ignored

Raw Stitch zip files and extracted screenshots/code are kept locally only.

Reason:

- Prevent repository bloat
- Avoid raw generated HTML becoming production code
- Keep the app repo focused on source code and documentation

### Decision 002: Rebuild Stitch designs in repo-native React

Stitch files are treated as visual and UX references only.

Reason:

- Existing app uses React/Vite structure
- Shared components and mock services need to remain consistent
- Raw HTML would create maintenance debt

### Decision 003: Use central mock data

Mock data should live under:

    src/app/mock

Reason:

- Keeps flows consistent
- Makes Phase 2 contract planning easier
- Avoids duplicated hard-coded data inside pages

### Decision 004: Use mock API simulation layer

Mock submissions should use:

    src/app/services/mock

Reason:

- Provides standard response envelopes
- Simulates validation, loading, reference numbers, and statuses
- Avoids real backend dependency in Phase 1

### Decision 005: Keep Phase 1 frontend-only

Phase 1 does not implement real backend services.

Reason:

- The stage is UI/UX completion
- Backend contract planning begins after frontend flows are complete
- Prevents accidental production integrations

### Decision 006: External files require registration

External files should be recorded in:

    docs/source-material/external-files-register.md

Reason:

- Maintains traceability
- Helps identify legal review needs
- Helps Phase 2 planning
