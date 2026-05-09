# Step 18 Design System Rules

Manual implementation completed because Codex credits were unavailable.

## Goal

Document and centralise Phase 1 UI/UX design rules.

## Scope

This step creates:

- Design tokens
- Status tone mapping
- Component class variants
- Design system documentation
- QA checklist

## Files Created

- src/app/design/tokens.ts
- src/app/design/status.ts
- src/app/design/variants.ts
- src/app/design/index.ts
- docs/ui/design-system.md
- docs/qa/step-18-design-system-rules-checklist.md
- docs/implementation/step-18-design-system-rules.codex.md

## What This Step Does

- Defines colour rules.
- Defines typography rules.
- Defines spacing and layout rules.
- Defines button/card/form/badge variants.
- Defines wizard/review/confirmation/status rules.
- Documents responsive breakpoints.
- Documents Phase 1 mock-only safety rules.

## What This Step Does Not Do

- Does not refactor the whole application.
- Does not introduce backend logic.
- Does not introduce auth.
- Does not introduce payment processing.
- Does not introduce upload/storage.
- Does not introduce Frappe APIs.

## Completion Criteria

- Design files exist.
- Design system documentation exists.
- QA checklist exists.
- npm run build passes.
- dist is removed before commit.
- Working tree is clean after commit and merge.
