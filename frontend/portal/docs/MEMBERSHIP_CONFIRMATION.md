# Membership Confirmation Safety

Membership confirmation is intentionally split between a real backend confirmation path and a local development preview path.

## Current Development Preview

Local frontend QA can still use browser `sessionStorage` state written by the membership flows. That state is enabled only when `isMockMembershipConfirmationEnabled()` returns true, which is limited to development builds through `import.meta.env.DEV`.

The optional `VITE_ENABLE_MOCK_MEMBERSHIP_CONFIRMATION=true` flag can keep the local preview explicit, but production builds must not treat the browser mock state as a real confirmation.

When development preview data is shown, the page labels it as development-only and states that no real membership, payment, account, or portal access has been created.

## Production-Safe Behaviour

If there is no backend confirmation reference, the confirmation page shows a safe fallback:

- Return to membership
- Contact support
- Sign in

It does not show mock membership status, mock payment status, mock onboarding status, or a production-style success message.

If a `reference` or `confirmationId` query parameter is present, the page calls `getMembershipConfirmation(reference)`. Today that service is a placeholder and returns `null`; during Phase 5 Frappe integration it must call a backend endpoint that verifies the membership record.

## Required Frappe Integration

The future backend confirmation source must validate all of the following server-side:

- payment or no-payment eligibility
- membership record status
- linked customer/account record
- portal access status
- selected plan and onboarding status

Browser `sessionStorage` cannot be treated as a payment record, membership record, account record, or access grant. It is user-controlled state and exists only to help local frontend QA preview the flow.

## Portal Dashboard CTA

The portal dashboard CTA is allowed only when:

- the backend confirmation response includes a valid `portalHref`
- the user already has a valid authenticated session
- development mock confirmation is enabled and the CTA is clearly labelled as a development portal preview

Otherwise the confirmation page must use safe actions such as returning to membership, contacting support, or signing in.
