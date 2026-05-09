# Step 8A: Stitch Intake And Mapping

## Goal

Capture the uploaded Google Stitch workflow exports for Steps 9 to 16 as controlled local reference material and map them to the Phase 1 UI/UX implementation plan.

## Scope

- Locate the eight provided Stitch zip exports.
- Copy them into an ignored local source folder.
- Extract them into an ignored local reference folder.
- Generate committed documentation that inventories the sources, maps screens to implementation steps, and identifies reusable Step 8 component patterns.
- Confirm the app still builds.

## Source Files

| Source file | Phase step | Flow area |
| --- | --- | --- |
| Membership Purchase Onboarding.zip | Step 9 | Membership purchase and onboarding |
| RBP Application Portals (3).zip | Step 10 | Portal/dashboard mock experience |
| Decision Desk Sign Up Process.zip | Step 11 | Decision Desk flow |
| DocuShare Onboarding Process.zip | Step 12 | DocuShare / Document Nucleus flow |
| Marketplace Listing Process and Pages.zip | Step 13 | Marketplace listing/enquiry flow |
| NBN Sign Up Process.zip | Step 14 | NBN/connectivity flow |
| Risk Advisor Onboarding Proces.zip | Step 15 | Risk Advisor flow |
| The Fixer Onboarding Process.zip | Step 16 | The Fixer flow |

## Local-Only Ignored Folders

- docs/stitch/_source-zips/
- docs/stitch/_extracted/

These folders are ignored by Git and are not part of the committed repository state.

## Committed Outputs

- docs/stitch/stitch-source-inventory.md
- docs/stitch/stitch-to-phase-map.md
- docs/stitch/workflow-screen-map.md
- docs/stitch/component-patterns.md
- docs/implementation/step-8a-stitch-intake-and-mapping.md
- docs/qa/step-8a-stitch-intake-checklist.md

## How This Affects Steps 8 To 16

Step 8A provides the reference map. Step 8 should build the reusable flow and wizard infrastructure surfaced by the Stitch screens. Steps 9 to 16 should then rebuild each workflow as repo-native React UI using Step 6 mock data and Step 7 mock services.

## Explicit Non-Goals

- Do not bulk-copy raw Stitch HTML into src/app.
- Do not commit raw zip files.
- Do not commit extracted screenshots.
- Do not commit extracted Stitch code.html files.
- Do not add real backend logic.
- Do not add Firebase Auth.
- Do not add Firestore.
- Do not add Frappe APIs.
- Do not add real payment processing.
- Do not add real uploads.
- Do not add real email, booking, marketplace checkout, or support ticket logic.
- Do not install new dependencies.
- Do not modify package.json or package-lock.json.
- Do not modify live routes or pages.
- Do not implement Steps 9 to 16 yet.

## Completion Criteria

- Raw Stitch exports are ignored.
- Extracted Stitch exports are ignored.
- Stitch source inventory exists.
- Stitch-to-phase map exists.
- Workflow screen map exists.
- Component pattern map exists.
- npm run build passes.
- dist is removed before commit.
- working tree is clean.
