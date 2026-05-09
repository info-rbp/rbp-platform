# Step 19 External Files Register Checklist

## Source Material

- phase-1-starting-point.md exists.
- sitemap-notes.md exists.
- app-integration-strategy.md exists.
- external-files-register.md exists.
- decisions-log.md exists.

## Raw File Safety

- docs/source-material/_incoming/ is ignored.
- docs/source-material/_raw/ is ignored.
- Raw source files are not committed.
- Large binary files are not committed.
- Production credentials are not committed.

## Asset Folders

- src/app/assets/logos/ exists.
- src/app/assets/illustrations/ exists.
- src/app/assets/icons/ exists.
- src/app/assets/placeholders/ exists.

## Imported Mock Seeds

- marketplaceSeed.mock.ts exists.
- resourcesSeed.mock.ts exists.
- offersSeed.mock.ts exists.
- documentsSeed.mock.ts exists.
- imported/index.ts exists.

## Safety Checks

- No backend logic added.
- No auth logic added.
- No payment logic added.
- No upload/storage logic added.
- No Frappe APIs added.
- No raw external source dump added to src.

## Build

Run:

    npm run build
    rm -rf dist
    git status
