# Decision Desk Flow Implementation

## Routes touched

- `/on-demand/decision-desk`
- `/portal/services`
- `/portal/dashboard`

## Components used

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
- `ReviewStatusBadge`

## Mock data used

- `src/app/mock/decisionDesk.mock.ts`
- `src/app/mock/portal.mock.ts`

Decision Desk mock data now includes categories, business size and stage options, help types, urgency options, constraint options, preferred outcome options, supporting information placeholder types, a sample request, and timeline states.

## Mock services used

- `getMockDecisionDeskSetup`
- `submitMockDecisionDeskRequest`

The submit service validates the required mock concepts:

- `businessName`
- `industry`
- `decisionTitle`
- `decisionCategory`
- `decisionSummary`
- `currentSituation`
- `urgency`
- `desiredOutcome`

## Stitch screens referenced

- `step_1_about_your_business`
- `step_2_the_issue_or_decision`
- `step_3_current_situation`
- `step_4_options_constraints_and_urgency`
- `step_5_supporting_information`
- `step_6_review_and_submit`

These were used as UX reference only. Raw Stitch HTML, screenshots, extracted files, and source zips were not copied into `src/app`.

## Flow steps implemented

1. About your business
2. The issue or decision
3. Current situation
4. Options, constraints and urgency
5. Supporting information
6. Review and submit
7. Mock confirmation and status

## States implemented

- Draft/input state
- Required-field validation errors
- Mock supporting information and upload placeholder state
- Review state
- Submitting/loading state
- Successful submission state
- Confirmation panel
- Status timeline
- Portal handoff state via session storage
- Portal fallback state when no Decision Desk session submission exists

## Known placeholders

- Supporting files are represented by `FileUploadMock` and checkbox placeholders only.
- Submission status is stored in browser session storage for same-session portal handoff only.
- Timeline data is static mock data returned from the mock service.
- The portal displays mock Decision Desk state without any real membership entitlement or auth check.

## Deferred items

- Real advisor assignment
- Real uploads
- Real portal persistence
- Real notifications or email
- Real backend request records
- Real auth or member entitlement checks
- Real Frappe integration

## Backend/auth/payment/upload/Frappe confirmation

No real backend, authentication, payment, upload, email, booking, Firebase, Firestore, Stripe, or Frappe logic was added. The implementation is frontend-only and uses existing Phase 1 mock data, reusable components, and mock service helpers.
