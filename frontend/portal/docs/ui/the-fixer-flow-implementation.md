# The Fixer Flow Implementation

## Summary

Step 16 implements a frontend-only The Fixer urgent request mock flow.

The flow supports:

- Public The Fixer overview
- Problem intake
- Business impact
- Urgency and scope
- Context and actions already tried
- Supporting information placeholders
- Desired resolution
- Review and submit
- Confirmation with mock reference
- Simulated triage/status timeline
- Portal services handoff
- Admin concept handoff

## Routes Touched

- /on-demand/the-fixer
- /portal/services
- /portal/dashboard
- /admin/the-fixer
- /admin/requests

## Components Used

- WizardShell
- StepNavigation
- ReviewSubmit
- ConfirmationPanel
- MockSubmissionState
- StatusTimeline
- FormSection
- TextField
- TextAreaField
- SelectField
- RadioCardGroup
- SelectableCardGrid
- CheckboxField
- FileUploadMock
- PortalStatusCard
- StatusBadge

## Mock Data Used

- src/app/mock/fixer.mock.ts

## Mock Services Used

- src/app/services/mock/fixer.mockService.ts

## Stitch Screens Referenced

- The Fixer public landing page
- The Fixer onboarding wizard
- Member portal my Fixer requests
- Admin dashboard The Fixer requests

## States Implemented

- Problem intake draft
- Business impact selected
- Urgency selected
- Scope selected
- Context entered
- Supporting information placeholder
- Upload acknowledgement
- Desired resolution entered
- Review state
- Submitting/loading state
- Confirmation/reference state
- Mock triage timeline
- Portal handoff state
- Admin concept handoff state

## Known Placeholders

- No real ticket is created.
- No real advisor is assigned.
- No real upload occurs.
- No email is sent.
- No admin task persists.
- No backend workflow is triggered.
- No authentication is required.

## Deferred Items

- Real ticket lifecycle
- Real advisor assignment
- Admin request management
- Notification triggers
- File upload and storage
- Portal request history
- Frappe backend contract planning

## Phase 1 Safety Confirmation

No real backend, Firebase, Firestore, Frappe, auth, payment, upload, ticketing, email, support, advisor assignment, or production integration logic was added.
