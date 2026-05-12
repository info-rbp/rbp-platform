# Milestone 7: Tenant and Account Provisioning

## Implemented

This milestone adds backend provisioning for customer account context.

Implemented files:

- `services/tenancy.py`
- `services/signup.py`
- `api/membership.py`

The exact app path is resolved inside the consolidated repository using the existing `services/tenancy.py` location.

## API methods

- `rbp_app.api.membership.create_signup`
- `rbp_app.api.membership.ensure_my_account_context`
- `rbp_app.api.membership.get_my_context`
- `rbp_app.api.membership.get_business_profile`
- `rbp_app.api.membership.update_business_profile`

## Provisioning flow

1. Create or link Frappe `User`.
2. Create or link `RBP Tenant`.
3. Create or update `RBP Business Profile`.
4. Create or link `RBP Subscription`.
5. Grant baseline `RBP App Entitlement` records.
6. Return a portal-safe account context payload.

## Baseline entitlements

- `portal`
- `membership`
- `notifications`
- `applications_interest`

## Acceptance criteria covered

- New customer has tenant.
- Tenant links to primary owner.
- Business profile links to tenant.
- Subscription links to tenant and member.
- Entitlements link to tenant and user.
- Portal dashboard can resolve context through `get_my_context`.
- Admin can inspect tenant, profile, subscription and entitlement records in Frappe Desk.
