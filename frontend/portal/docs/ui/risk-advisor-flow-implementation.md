# Risk Advisor Flow Implementation

## Summary

Step 15 implements a frontend-only Risk Advisor mock assessment flow.

The flow supports:

- Public Risk Advisor overview
- Business profile
- Risk category selection
- Control maturity
- Incident and compliance inputs
- Risk appetite
- Mock score preview
- Review and submit
- Confirmation with mock reference
- Simulated status timeline
- Portal services handoff

## Routes Touched

- /on-demand/risk-advisor
- /portal/services
- /portal/dashboard
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
- RadioCardGroup
- SelectableCardGrid
- RiskScoreSummary
- StatusBadge

## Mock Data Used

- src/app/mock/riskAdvisor.mock.ts

## Mock Services Used

- src/app/services/mock/riskAdvisor.mockService.ts

## Stitch Screens Referenced

- Risk Advisor public landing page
- Member portal Risk Advisor intake
- Member portal my services
- Admin portal Risk Advisor management

## States Implemented

- Business profile draft
- Category selection
- Control maturity selection
- Incident/compliance input
- Risk appetite selection
- Mock score preview
- Review state
- Submitting/loading state
- Confirmation/reference state
- Mock status timeline
- Portal handoff state

## Known Placeholders

- No real advisor is assigned.
- No real risk assessment is created.
- No backend scoring service is called.
- No admin review action persists.
- No file upload is required.
- No authentication is required.

## Deferred Items

- Real assessment persistence
- Real scoring model
- Advisor assignment
- Admin review workflow
- Portal history
- Frappe backend contract planning

## Phase 1 Safety Confirmation

No real backend, Firebase, Firestore, Frappe, auth, payment, upload, scoring API, email, or production integration logic was added.
