# Step 11 Decision Desk Flow QA Checklist

## Build check

- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Confirm any Vite large chunk warning is non-blocking
- [ ] Remove `dist/` after build review

## Route smoke list

- [ ] `/on-demand/decision-desk`
- [ ] `/portal/services`
- [ ] `/portal/dashboard`

## Validation state check

- [ ] Attempt to continue from About your business with blank `businessName`
- [ ] Attempt to continue from About your business with blank `industry`
- [ ] Attempt to continue from The issue or decision with blank required decision fields
- [ ] Attempt to continue from Current situation with blank current situation
- [ ] Attempt to continue from Options, constraints and urgency with no options or constraints
- [ ] Attempt to submit review without accepting the mock Phase 1 terms

## Mock submit check

- [ ] Complete all required fields
- [ ] Submit from Review and submit
- [ ] Confirm loading state appears
- [ ] Confirm mock reference is returned
- [ ] Confirm no network-backed API request is required

## Confirmation/status check

- [ ] Confirmation panel appears after submit
- [ ] Mock reference is visible
- [ ] Timeline is visible
- [ ] Copy states that no real advisor has been assigned
- [ ] Copy states that the submission is Phase 1 mock-only

## Portal handoff check

- [ ] Open `/portal/services` after submission
- [ ] Confirm Decision Desk submitted state is visible in the service list
- [ ] Open `/portal/dashboard` after submission
- [ ] Confirm Decision Desk portal status card is visible
- [ ] Confirm portal fallback still works in a fresh session with no submission

## No real backend check

- [ ] Confirm no production backend services were added
- [ ] Confirm no `fetch` or `axios` integration was added for Decision Desk
- [ ] Confirm mock service helpers remain the submission path

## No real auth check

- [ ] Confirm no auth guard was added to `/on-demand/decision-desk`
- [ ] Confirm no Firebase Auth implementation was added
- [ ] Confirm no member entitlement enforcement was added

## No real upload check

- [ ] Confirm `FileUploadMock` is used
- [ ] Confirm no file input upload handler sends files
- [ ] Confirm no storage service was added

## No Frappe API check

- [ ] Confirm no Frappe client or endpoint was added
- [ ] Confirm no Frappe document creation logic was added

## Responsive review placeholders

- [ ] Mobile review at `/on-demand/decision-desk`
- [ ] Tablet review at `/on-demand/decision-desk`
- [ ] Desktop review at `/on-demand/decision-desk`
- [ ] Mobile review at `/portal/services`
- [ ] Tablet review at `/portal/services`
- [ ] Desktop review at `/portal/services`
- [ ] Mobile review at `/portal/dashboard`
- [ ] Tablet review at `/portal/dashboard`
- [ ] Desktop review at `/portal/dashboard`
