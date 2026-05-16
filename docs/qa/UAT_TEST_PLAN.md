# UAT Test Plan

Use this plan only after the QA runtime gates are green.

## Prerequisites

- PR #81 merged.
- Permission drift resolved or documented.
- Legacy function removed or intentionally documented.
- Function deployment confirmed.
- Execute-mode smoke tests passed.
- Stripe webhook proof passed.
- Email proof passed.
- Seed validation passed.
- Cloudflare frontend QA passed.

## UAT 1: New Tenant Signup

- Visit QA frontend.
- Create new user.
- Complete business profile.
- Verify tenant created.
- Verify user profile created.
- Verify role is owner or member, not admin.
- Verify audit event recorded.

Expected:

- No user can self-assign admin.
- Tenant is unique.
- Business name duplication does not merge unrelated tenants.

## UAT 2: Login And Session

- Login.
- Refresh.
- Logout.
- Attempt protected route after logout.

Expected:

- Session persists correctly.
- Protected routes require auth.

## UAT 3: Free Plan

- Activate free plan.
- Check entitlements.
- Check subscription status.

Expected:

- Free plan active.
- Correct free entitlements only.
- No premium entitlement leakage.

## UAT 4: Premium Checkout

- Start premium checkout.
- Complete Stripe test checkout.
- Return to success URL.
- Trigger or confirm webhook.
- Check subscription and entitlements.

Expected:

- Premium subscription active.
- Premium entitlements granted.
- Payment event and audit event recorded.

## UAT 5: Failed Payment

- Send Stripe failure event.
- Check subscription status.
- Check entitlements.
- Check notification.

Expected:

- Status suspended or past due according to rules.
- Entitlements revoked or limited according to rules.

## UAT 6: Service Request

- Create service request.
- View own service request.
- Admin views request.
- Admin updates status.
- Customer sees update and notification.

Expected:

- Tenant and user scoping are correct.
- Audit trail exists.

## UAT 7: Application Interest

- Submit application interest.
- Admin reviews interest.

Expected:

- Interest recorded.
- Provisioning request is not created by customer.

## UAT 8: Cross-Tenant Denial

- Attempt to access another tenant's records.

Expected:

- Access is denied.
- No data leakage occurs.

## UAT 9: Admin Or Support Access

- Non-admin tries admin route.
- Admin user tries admin route.
- Support user behavior checked if role exists.

Expected:

- Non-admin denied.
- Admin allowed.
- Support follows defined rules.

## UAT 10: Notifications And Email

- Send notification to allowlisted recipient.
- Send notification to blocked recipient.
- Mark notification read.

Expected:

- Allowed delivery recorded.
- Blocked delivery not sent.
- Read status updates.
