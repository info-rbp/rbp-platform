# Membership Flow Implementation

## Routes Touched

- `/membership`
- `/membership/overview`
- `/membership/remote-business-partner-membership`
- `/membership/sign-up-now`
- `/membership/confirmation`
- `/portal/dashboard`

## Components Used

- `WizardShell`
- `Stepper`
- `StepNavigation`
- `ReviewSubmit`
- `ConfirmationPanel`
- `MockSubmissionState`
- `FormSection`
- `TextField`
- `TextAreaField`
- `SelectField`
- `CheckboxField`
- `RadioCardGroup`
- `SelectableCardGrid`
- `TermsAcceptance`
- `PaymentSimulationPanel`
- `PlanSelectionCard`
- `OrderSummaryCard`
- `PortalStatusCard`
- `StatusBadge`

## Mock Data Used

- `mockMembershipPlans`
- `mockMembershipTimeline`
- `mockMembershipExtras`
- `mockMembershipGoalOptions`
- `mockMembershipManagedServiceOptions`
- `mockPaymentMethods`

## Mock Services Used

- `getMockMembershipPlans`
- `submitMockMembershipSignup`
- `submitMockMembershipOnboarding`

All service calls use the local mock response shape from `src/app/services/mock/mockClient.ts`.

## Stitch Screens Referenced

- `public_membership_page`
- `signup_account_creation`
- `signup_inclusions_confirmation`
- `signup_extras_selection`
- `signup_payment_details`
- `signup_payment_success`
- `onboarding_business_details`
- `onboarding_business_profile`
- `onboarding_goals_priorities`
- `onboarding_managed_services_details`
- `onboarding_team_setup`
- `onboarding_completion_confirmation`
- `portal_membership_dashboard`

## States Implemented

- Plan selected
- Form incomplete
- Validation errors
- Mock payment pending
- Mock payment simulated success
- Mock payment simulated failure
- Account created
- Membership active
- Onboarding in progress
- Onboarding complete
- Portal access available

## Known Placeholders

- Browser `sessionStorage` carries the latest mock flow state between sign-up, confirmation, and portal dashboard.
- Payment fields are intentionally simulated and do not collect real card details.
- Team invite capture is text-only and does not send email.
- Portal dashboard status is illustrative and does not represent real entitlements.

## Deferred Items

- Firebase Auth account creation.
- Firestore or Frappe persistence.
- Real payment provider integration.
- Real email invitations.
- Real membership entitlement checks.
- Production portal provisioning.
