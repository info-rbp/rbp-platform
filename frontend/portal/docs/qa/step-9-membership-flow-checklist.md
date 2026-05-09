# Step 9 Membership Flow Checklist

## Build Check

- [ ] Run `npm run build`.
- [ ] Confirm `dist/` is removed before commit if it is generated.

## Mock Payment Check

- [ ] Open `/membership/sign-up-now`.
- [ ] Continue to the payment step.
- [ ] Confirm the page states that no real payment is processed.
- [ ] Simulate payment failure and confirm the visible failure state appears.
- [ ] Simulate payment success and confirm the flow can continue to review.

## No Real Backend Check

- [ ] Confirm no Firebase Auth sign-up is triggered.
- [ ] Confirm no Firestore writes are introduced.
- [ ] Confirm no Frappe API calls are introduced.
- [ ] Confirm no Stripe or real payment provider code is introduced.
- [ ] Confirm no real uploads, emails, bookings, support tickets, or auth guards are introduced.

## Route Smoke List

- [ ] `/membership`
- [ ] `/membership/overview`
- [ ] `/membership/remote-business-partner-membership`
- [ ] `/membership/sign-up-now`
- [ ] `/membership/confirmation`
- [ ] `/portal/dashboard`

## Flow Smoke List

- [ ] Select a membership plan.
- [ ] Enter mock account and contact details.
- [ ] Confirm inclusions and mock terms.
- [ ] Select extras or skip them.
- [ ] Complete mock payment simulation.
- [ ] Review and submit membership sign-up.
- [ ] See mock membership confirmation/reference state.
- [ ] Continue into business onboarding.
- [ ] Complete business details, profile, goals, service interests, and team setup.
- [ ] See onboarding completion with mock reference.
- [ ] Continue to portal dashboard and see membership status card.

## Responsive Review Placeholders

- [ ] Mobile review.
- [ ] Tablet review.
- [ ] Desktop review.
