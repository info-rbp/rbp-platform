# Step 12: DocuShare / Document Nucleus Mock Onboarding Flow

## Branch

- Base branch: `phase/phase-1-uiux-completion`
- Feature branch: `feature/step-12-docushare-onboarding-flow`

## Prompt Summary

Implement the Phase 1 frontend-only DocuShare / Document Nucleus onboarding flow using the Stitch reference screens, Step 8 reusable flow/form/status components, Step 6 mock data, Step 7 mock API simulation layer, existing routes/pages/styles, and public website/portal patterns.

Do not implement real backend services, real auth, real uploads, real document storage, real payments, Frappe APIs, Firebase Auth, Firestore persistence, real email, booking, support ticket, marketplace checkout, member entitlement, or production integration logic.

## Routes Touched

- `/document-nucleus/overview`
- `/document-nucleus/brief`
- `/document-nucleus/category/:id`
- `/document-nucleus/product/:id`
- `/docushare`
- `/portal/documents`
- `/portal/services`
- `/portal/dashboard`

## Components Used

- `WizardShell`
- `Stepper`
- `StepNavigation`
- `ReviewSubmit`
- `ConfirmationPanel`
- `StatusTimeline`
- `MockSubmissionState`
- `FormSection`
- `TextField`
- `TextAreaField`
- `SelectField`
- `CheckboxField`
- `RadioCardGroup`
- `SelectableCardGrid`
- `FileUploadMock`
- `TermsAcceptance`
- `PortalStatusCard`
- `StatusBadge`
- `DocumentProductCard`
- `ReviewStatusBadge`

## Components Created Or Updated

- Created `src/app/features/docushare/DocuShareOnboardingFlow.tsx`
- Created `src/app/features/docushare/docushareFlow.types.ts`
- Created `src/app/features/docushare/index.ts`
- Created `src/app/pages/DocuShareOnboardingPage.tsx`
- Updated Document Nucleus public pages to link into the mock brief flow.
- Updated portal document/service/dashboard touchpoints for mock DocuShare handoff states.

## Mock Data Used

- `src/app/mock/docushare.mock.ts`
- `src/app/mock/documents.mock.ts`
- `src/app/mock/portal.mock.ts`
- `src/app/mock/notifications.mock.ts`
- `src/app/mock/user.mock.ts`

## Mock Data Updated

- Added `mockDocuShareDocumentGroups`.
- Added purpose, audience, style, and branding options.
- Added group-specific questions.
- Added DocuShare timeline/status values.
- Added mock DocuShare document placeholders.
- Updated portal DocuShare CTAs to point at the new flow.

## Mock Services Used

- `getMockDocumentProducts`
- `submitMockDocuShareBrief`

## Mock Services Updated

- `getMockDocumentProducts` returns groups, products, options, questions and timeline.
- `submitMockDocuShareBrief` validates the required mock brief concepts and returns mock reference, portal hrefs, timeline, submitted status, and file placeholder acknowledgement.

## Stitch Screens Referenced

- Welcome / start
- Business details
- Document group selection
- Purpose and audience
- Group-specific questions
- Style and branding
- Supporting uploads
- Review and submit
- Confirmation

Local extracted Stitch files were used only as UX reference. Raw Stitch HTML was not copied into React components.

## Flow Steps Implemented

1. Welcome / start
2. Business details
3. Document group selection
4. Purpose and audience
5. Group-specific questions
6. Style and branding
7. Supporting information / mock uploads
8. Review and submit
9. Mock confirmation/status

## States Implemented

- Start state
- Draft/input state
- Validation errors
- Document group selected
- Purpose/audience selected
- Group-specific questions answered
- Style/branding preference selected
- Mock supporting upload placeholder
- Review state
- Submitting/loading state
- Successful submission
- Confirmation state
- Status timeline
- Portal documents handoff state
- Empty/fallback states for unknown category/product routes

## Public Page CTAs Updated

- Overview CTAs now link to `/document-nucleus/brief`.
- Category CTAs now link to `/document-nucleus/brief?category=:id`.
- Product CTAs now link to `/document-nucleus/brief?category=:category&product=:id`.
- DocuShare landing page has a direct mock brief CTA.

## Portal Touchpoints Updated

- `/portal/documents` shows mock upload/storage/download notices and can display a submitted DocuShare brief placeholder from session storage.
- `/portal/services` can display a submitted DocuShare brief as a requested mock service state.
- `/portal/dashboard` can display a DocuShare brief status card after mock submission.

## Known Placeholders

- Mock upload UI only.
- Mock reference generation only.
- Mock timeline/status only.
- Session storage handoff only.
- Mock pricing labels only.

## Deferred Items

- Real backend persistence
- Real authentication and entitlements
- Real uploads, storage, downloads, and permissions
- Real document production or delivery
- Real payment processing
- Real Firebase, Firestore, Frappe, Stripe, email, booking, support ticket, or marketplace checkout logic

## Confirmation

This Step 12 implementation is frontend-only and mock-only. No real backend/auth/payment/upload/storage/Frappe logic was added.
