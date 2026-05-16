# QA Function Deployment Evidence

Record console confirmation for each expected Appwrite Function after `npm run appwrite:functions:deploy -- --apply` and `npm run appwrite:functions:verify`.

## Verification Summary

- Date:
- Operator:
- Branch or commit:
- Verify command result:
- Notes:

## Expected Functions

| Function | Exists | Enabled | Deployment Active | Runtime | Env Checked | Notes |
|---|---|---|---|---|---|---|
| bootstrap-tenant |  |  |  |  |  |  |
| create-membership-checkout |  |  |  |  |  |  |
| stripe-webhook |  |  |  |  |  |  |
| get-subscription-status |  |  |  |  |  |  |
| cancel-subscription |  |  |  |  |  |  |
| list-my-entitlements |  |  |  |  |  |  |
| admin-update-entitlements |  |  |  |  |  |  |
| send-notification |  |  |  |  |  |  |
| process-notification-queue |  |  |  |  |  |  |
| create-service-request |  |  |  |  |  |  |
| list-my-service-requests |  |  |  |  |  |  |
| admin-list-service-requests |  |  |  |  |  |  |
| admin-update-service-status |  |  |  |  |  |  |
| admin-operations |  |  |  |  |  |  |

## Evidence Checklist

- Function exists in Appwrite Console.
- Function is enabled.
- Runtime matches expected Node runtime.
- Entrypoint matches built output.
- Active deployment exists.
- Deployment status is ready or succeeded.
- Build logs show no errors.
- Required environment variables are configured.
- Execution permissions are correct for the function type.

## Required Env Categories

### Core Appwrite Admin

- `APPWRITE_ENDPOINT`
- `APPWRITE_PROJECT_ID`
- `APPWRITE_API_KEY`
- `APPWRITE_DATABASE_ID`
- `APPWRITE_STORAGE_BUCKET_ID`
- `APPWRITE_ADMIN_TEAM_ID`

### Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`

### Email And Notifications

- `QA_EMAIL_ALLOWLIST`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`

### Trusted Internal Tokens

- `RBP_INTERNAL_FUNCTION_TOKEN`
- `APPWRITE_TRUSTED_FUNCTION_TOKEN`

## Manual Sign-Off

- Reviewer:
- Result:
- Follow-up actions:
