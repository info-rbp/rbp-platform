# Step 19: Incorporate External Files Safely

Manual implementation completed because Codex credits were unavailable.

## Goal

Create a controlled structure for external files, source material, imported content, assets, and decisions.

## Scope

This step creates:

- Source material documentation
- External files register
- Decisions log
- Safe asset folders
- Imported mock seed placeholders
- Ignored local folders for raw external material

## Created Documentation

- docs/source-material/phase-1-starting-point.md
- docs/source-material/sitemap-notes.md
- docs/source-material/app-integration-strategy.md
- docs/source-material/external-files-register.md
- docs/source-material/decisions-log.md

## Created Asset Folders

- src/app/assets/logos/
- src/app/assets/illustrations/
- src/app/assets/icons/
- src/app/assets/placeholders/

Each folder includes a .gitkeep file.

## Created Imported Mock Seed Files

- src/app/mock/imported/marketplaceSeed.mock.ts
- src/app/mock/imported/resourcesSeed.mock.ts
- src/app/mock/imported/offersSeed.mock.ts
- src/app/mock/imported/documentsSeed.mock.ts
- src/app/mock/imported/index.ts

## Ignored Local Folders

- docs/source-material/_incoming/
- docs/source-material/_raw/

## Non-Goals

This step does not:

- Commit raw external files
- Add production assets without review
- Implement backend integrations
- Add real uploads
- Add real authentication
- Add real payments
- Add Frappe APIs
- Replace existing mock data with unreviewed external content

## Completion Criteria

- Source material docs exist.
- External file register exists.
- Decisions log exists.
- Safe asset folders exist.
- Imported mock seed files exist.
- Raw external staging folders are ignored.
- npm run build passes.
- dist is removed before commit.
