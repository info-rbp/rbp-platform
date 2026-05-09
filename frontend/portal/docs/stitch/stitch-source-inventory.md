# Stitch Source Inventory

## Purpose

This inventory records the Google Stitch workflow exports provided for Phase 1 UI/UX Completion. The exports are held as controlled local reference material so later implementation steps can rebuild the workflows in the repository's React patterns without importing raw Stitch output.

Raw zip exports and extracted Stitch files are ignored by Git and must not be committed. Stitch is source reference only; production UI must be rebuilt with repo-native components, Step 6 mock data, and Step 7 mock services.

## Source Summary

| Uploaded zip file | Phase step | Flow area | Found | Extracted | Approx. detected screen folders | code.html files | screen.png files |
| --- | --- | --- | --- | --- | ---: | ---: | ---: |
| Membership Purchase Onboarding.zip | Step 9 | Membership purchase and onboarding | Yes | Yes | 13 | 13 | 13 |
| RBP Application Portals (3).zip | Step 10 | Portal/dashboard mock experience | Yes | Yes | 216 | 214 | 216 |
| Decision Desk Sign Up Process.zip | Step 11 | Decision Desk flow | Yes | Yes | 6 | 6 | 6 |
| DocuShare Onboarding Process.zip | Step 12 | DocuShare / Document Nucleus flow | Yes | Yes | 9 | 9 | 9 |
| Marketplace Listing Process and Pages.zip | Step 13 | Marketplace listing/enquiry flow | Yes | Yes | 20 | 19 | 20 |
| NBN Sign Up Process.zip | Step 14 | NBN/connectivity flow | Yes | Yes | 7 | 7 | 7 |
| Risk Advisor Onboarding Proces.zip | Step 15 | Risk Advisor flow | Yes | Yes | 4 | 4 | 4 |
| The Fixer Onboarding Process.zip | Step 16 | The Fixer flow | Yes | Yes | 4 | 4 | 4 |

## Totals

| Metric | Count |
| --- | ---: |
| Expected zip files | 8 |
| Zip files found and copied locally | 8 |
| Missing zip files | 0 |
| Detected screen folders | 279 |
| code.html files | 276 |
| screen.png files | 279 |

## Missing Files

- None. All expected Stitch exports were found.

## Local-Only Reference Folders

- docs/stitch/_source-zips/
- docs/stitch/_extracted/

These folders are intentionally ignored. Do not link to their raw contents as GitHub assets, and do not copy raw Stitch HTML, screenshots, or generated code into src/app.
