# QA Seed Validation Evidence

Record seed validation and apply evidence for the QA environment.

## Commands

```sh
npm run appwrite:seed:validate
npm run appwrite:seed:qa -- --apply
npm run appwrite:seed:validate
```

## Run Metadata

- Date:
- Operator:
- Branch or commit:
- Notes:

## Required Seed Checks

- `membership_plans` include `free` and `premium`.
- `plan_entitlements` map free and premium correctly.
- `entitlements` include base access, service request access, application interest access, and no customer provisioning entitlement.
- `applications` include expected catalog entries.
- QA tenant exists.
- QA smoke user is linked to QA tenant.
- QA admin user is linked where expected.
- Email templates are present.

## Environment Alignment

| Variable | Expected Source | Confirmed |
|---|---|---|
| `QA_SMOKE_USER_ID` | seeded user profile |  |
| `QA_SMOKE_ADMIN_USER_ID` | seeded admin profile |  |
| `QA_SMOKE_TENANT_ID` | seeded tenant |  |
| `QA_SMOKE_PLAN_CODE` | membership plan seed |  |

## Sign-Off

- Result:
- Reviewer:
- Remaining caveats:
