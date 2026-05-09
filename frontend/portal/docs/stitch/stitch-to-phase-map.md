# Stitch To Phase Map

This map connects the local Stitch reference exports to the Phase 1 implementation sequence. Step 8A captures and maps the references; Step 8 creates the shared flow infrastructure; Steps 9 to 16 convert each workflow into repo-native React flows.

| Phase Step | Flow Area | Stitch Source Zip | Implementation Purpose | Implementation Rule |
| --- | --- | --- | --- | --- |
| Step 8A | Stitch reference intake and mapping | All copied Stitch exports | Capture inventory, map screens to Phase 1 steps, and define reusable pattern guidance. | Documentation only. Keep raw zips and extracted files ignored. Stitch screens are reference material, not production code. |
| Step 8 | Shared flow and wizard component infrastructure | Recurring patterns across all Stitch exports | Build reusable components for wizards, review screens, confirmation states, status timelines, and mock submissions. | Build infrastructure only. Do not build full workflows in Step 8. |
| Step 9 | Membership purchase and onboarding | Membership Purchase Onboarding.zip | Convert the membership purchase and onboarding screens into repo-native signup and member portal mock flows. | Convert to repo-native React flows using Step 6 mock data and Step 7 mock services. Do not import raw Stitch code. |
| Step 10 | Portal/dashboard mock experience | RBP Application Portals (3).zip | Use the portal/dashboard screens to guide the Phase 1 portal information architecture and mock dashboard states. | Convert to repo-native React flows using Step 6 mock data and Step 7 mock services. Do not import raw Stitch code. |
| Step 11 | Decision Desk flow | Decision Desk Sign Up Process.zip | Convert the Decision Desk intake sequence into a repo-native React request flow. | Convert to repo-native React flows using Step 6 mock data and Step 7 mock services. Do not import raw Stitch code. |
| Step 12 | DocuShare / Document Nucleus flow | DocuShare Onboarding Process.zip | Convert the document onboarding sequence into the Document Nucleus mock flow. | Convert to repo-native React flows using Step 6 mock data and Step 7 mock services. Do not import raw Stitch code. |
| Step 13 | Marketplace listing/enquiry flow | Marketplace Listing Process and Pages.zip | Convert seller listing, buyer enquiry, offer, and admin review screens into mock marketplace flows. | Convert to repo-native React flows using Step 6 mock data and Step 7 mock services. Do not import raw Stitch code. |
| Step 14 | NBN/connectivity flow | NBN Sign Up Process.zip | Convert the connectivity serviceability, plan selection, order, and confirmation screens into a mock NBN flow. | Convert to repo-native React flows using Step 6 mock data and Step 7 mock services. Do not import raw Stitch code. |
| Step 15 | Risk Advisor flow | Risk Advisor Onboarding Proces.zip | Convert the Risk Advisor intake and review screens into a repo-native mock advisory request flow. | Convert to repo-native React flows using Step 6 mock data and Step 7 mock services. Do not import raw Stitch code. |
| Step 16 | The Fixer flow | The Fixer Onboarding Process.zip | Convert The Fixer intake and support request screens into a repo-native mock request flow. | Convert to repo-native React flows using Step 6 mock data and Step 7 mock services. Do not import raw Stitch code. |

## Shared Rules

- Step 8A maps Stitch references and commits only documentation plus ignore rules.
- Step 8 builds reusable flow and wizard components based on recurring Stitch patterns.
- Steps 9 to 16 convert each Stitch workflow into repo-native React flows.
- Each converted flow must use Step 6 mock data and Step 7 mock services.
- Stitch screens are reference material, not production code.
