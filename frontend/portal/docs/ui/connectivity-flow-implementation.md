# Connectivity Flow Implementation

## Summary

Step 14 implements a frontend-only NBN/connectivity mock order flow.

The flow supports:

- Connectivity overview
- TotalBiz and ProBiz service families
- NBN and Superloop-style mock provider states
- Address/serviceability mock check
- Plan selection
- Hardware/modem selection
- Business/contact details
- Mock payment/billing setup
- Review and submit
- Confirmation with mock reference
- Portal services handoff
- Mock provisioning/status timeline

## Routes Touched

- /operations/connectivity
- /operations/connectivity/nbn-phone
- /operations/connectivity/superloop
- /operations/superloop
- /portal/services

## Components Used

- WizardShell
- StepNavigation
- ReviewSubmit
- ConfirmationPanel
- MockSubmissionState
- StatusTimeline
- FormSection
- TextField
- SelectField
- RadioCardGroup
- CheckboxField
- TermsAcceptance
- PaymentSimulationPanel
- ServiceabilityCheckPanel
- PlanSelectionCard
- OrderSummaryCard
- StatusBadge

## Mock Data Used

- src/app/mock/connectivity.mock.ts

## Mock Services Used

- src/app/services/mock/connectivity.mockService.ts

## Stitch Screens Referenced

- Address / NBN availability
- Choose plan
- Modem / hardware choice
- Business details
- Review summary
- Payment setup / billing
- Confirmation success

## Business Rules Represented

- TotalBiz and ProBiz mock plan families
- 36-month mock contract display
- 14-day mock provisioning lead time
- Premium customer 10% mock discount display state
- BYO, TP-Link, and Amazon eero hardware choices
- RBP-styled connectivity flow, not carrier-branded production checkout

## States Implemented

- Service family selected
- Address entered
- Serviceability not checked
- Mock serviceability available
- Plan selected
- Hardware selected
- Business/contact details entered
- Mock payment method selected
- Review state
- Submitting/loading state
- Confirmation/reference state
- Mock provisioning timeline

## Known Placeholders

- No real NBN serviceability
- No real Superloop API
- No real carrier order
- No real payment
- No real contract
- No real hardware order
- No backend persistence

## Deferred Items

- Real serviceability API contract
- Real carrier order lifecycle
- Real payment/billing provider
- Real provisioning status updates
- Frappe backend contract planning

## Phase 1 Safety Confirmation

No real backend, Firebase, Firestore, Frappe, payment, upload, carrier API, auth, email, or production integration logic was added.
