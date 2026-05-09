# DocuShare / Document Nucleus Flow Implementation

## Summary

Step 12 implements a repo-native Phase 1 mock DocuShare onboarding flow for Document Nucleus. The flow lets users start a mock document brief, enter business details, choose a document group/product context, describe purpose and audience, answer group-specific questions, add style and branding preferences, acknowledge mock supporting uploads, review the brief, submit through the mock service, and view a simulated confirmation/status handoff.

No real backend, auth, upload, file storage, payment, email, download permissioning, or Frappe logic was added.

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

## Components Created

- `src/app/features/docushare/DocuShareOnboardingFlow.tsx`
- `src/app/features/docushare/docushareFlow.types.ts`
- `src/app/features/docushare/index.ts`
- `src/app/pages/DocuShareOnboardingPage.tsx`

## Mock Data Used And Updated

- `src/app/mock/docushare.mock.ts`
  - Added document groups, purpose options, audience options, style options, branding options, group-specific questions, timeline values, and brief status values.
- `src/app/mock/documents.mock.ts`
  - Added a mock DocuShare brief placeholder document.
- `src/app/mock/portal.mock.ts`
  - Updated DocuShare flow/service CTAs to point at the new mock brief route.

## Mock Services Used And Updated

- `src/app/services/mock/docushare.mockService.ts`
  - `getMockDocumentProducts` now returns groups, products, options, questions, existing briefs, and timeline data.
  - `submitMockDocuShareBrief` validates required mock brief fields and returns a simulated reference, portal document/service/dashboard hrefs, timeline state, and mock file acknowledgement.

## Stitch Screens Referenced

Local-only Stitch references were used as UX reference and were not copied into React:

- `welcome_docushare_onboarding`
- `business_details_docushare_onboarding`
- `document_group_selection_docushare_onboarding`
- `purpose_audience_docushare_onboarding`
- `tailored_requirements_docushare_onboarding`
- `style_branding_docushare_onboarding`
- `supporting_uploads_docushare_onboarding`
- `review_submit_docushare_onboarding`
- `confirmation_docushare_onboarding`

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
- Product/document context selected
- Purpose and audience selected
- Group-specific questions answered
- Style and branding selected
- Mock supporting upload placeholder acknowledged
- Review state
- Submitting/loading state
- Successful submission
- Confirmation state
- Status timeline
- Portal documents/services/dashboard handoff
- Unknown category/product fallback states

## Public Page CTAs Updated

- `/document-nucleus/overview` now links users into `/document-nucleus/brief`.
- `/document-nucleus/category/:id` now supports mock group IDs such as `templates` and `documentation-suites`, with CTAs into the brief flow.
- `/document-nucleus/product/:id` now supports mock product IDs such as `template-policy-001` and `suite-operations-001`, with CTAs into the brief flow.
- `/docushare` now includes a direct mock brief CTA.

## Portal Touchpoints Updated

- `/portal/documents` can show the latest submitted mock DocuShare brief from session storage and includes mock-only upload/download notices.
- `/portal/services` can show the latest submitted mock DocuShare brief as a requested service state.
- `/portal/dashboard` can show a DocuShare status card after mock submission.

## Known Placeholders

- Mock file uploads are visual placeholders only.
- Mock document references are generated client-side by the mock service helper.
- Portal handoff state uses session storage for frontend review only.
- Product pricing labels remain mock-only catalogue labels.

## Deferred Items

- Real document creation
- Real file upload and storage
- Real document download and permissioning
- Real authentication or entitlements
- Real payment or checkout
- Real Frappe, Firebase, Firestore, email, or backend integration
