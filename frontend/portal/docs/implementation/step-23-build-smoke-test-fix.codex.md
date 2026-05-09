# Step 23: Build, Smoke Test, and Fix

Manual implementation completed because Codex credits were unavailable.

## Goal

Confirm the Phase 1 application builds, the Phase 1 audit passes, and major public, portal, admin, and flow routes are documented for smoke testing.

## Files Created

- docs/qa/phase-1-smoke-test.md
- docs/implementation/step-23-build-smoke-test-fix.codex.md
- scripts/phase1-smoke-routes.mjs

## What This Step Does

- Adds a Phase 1 smoke-test record.
- Adds a route matrix helper script.
- Runs the Phase 1 audit.
- Runs the production build.
- Provides a place to record build/audit/smoke-test status.

## What This Step Does Not Do

- Does not add backend code.
- Does not add authentication.
- Does not add payment processing.
- Does not add uploads.
- Does not add Frappe APIs.
- Does not redesign the app.
- Does not replace manual browser testing.

## Validation Commands

Run:

    npm install
    npm run audit:phase1
    node scripts/phase1-smoke-routes.mjs
    npm run build
    rm -rf dist
    git status

## Manual Smoke Testing

Optional local smoke run:

    npm run dev

Then manually open the routes listed in:

    docs/qa/phase-1-smoke-test.md

## Completion Criteria

- npm run audit:phase1 passes.
- npm run build passes.
- Smoke-test route matrix exists.
- Smoke-test documentation exists.
- dist is removed before commit.
- Feature branch is merged into phase/phase-1-uiux-completion.
- Working tree is clean.
