# Appwrite QA Setup

## Configure

- QA project
- QA database
- QA collections from repository schema
- QA bucket
- function secrets for Stripe and notifications
- auth settings
- teams and admin roles
- messaging/email sandbox

## Apply

- `npm run appwrite:schema:validate`
- `npm run appwrite:schema:deploy -- --apply`
- `npm run appwrite:functions:validate`
<<<<<<< HEAD
- `npm run appwrite:functions:deploy`
- `npm run appwrite:functions:verify` after the Appwrite Git integration has produced live deployments
- `npm run appwrite:seed:qa -- --apply`

## Function verification

`npm run appwrite:functions:verify` reads `appwrite/appwrite.config.json`, lists live Appwrite Functions, and fails if any configured function ID is missing or disabled. It does not print secrets.

Some Functions require user context, Stripe signatures, or mutation payloads. For those, the verifier reports manual verification required after metadata is confirmed. Use `QA_VERIFY_APPWRITE_FUNCTIONS=true` in the deploy workflow to enable this live inventory gate.

## Trusted internal invocation

Trusted internal calls are disabled unless `APPWRITE_TRUSTED_FUNCTION_TOKEN` or `RBP_INTERNAL_FUNCTION_TOKEN` is configured. These values must be stored only in the QA secret manager or GitHub Actions secrets. Do not configure them for customer-facing flows.
=======
- `npm run appwrite:functions:deploy -- --apply`
- `npm run appwrite:functions:verify`
- `npm run appwrite:seed:qa -- --apply`

`appwrite:functions:deploy -- --apply` uses only `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, and `APPWRITE_API_KEY` for deployment access. Function runtime secrets such as Stripe, database, storage, and admin-team values remain managed as Appwrite Function/project environment variables and are not written into generated archives.

The function deployer reads the expected IDs from `appwrite/appwrite.config.json`, requires matching `appwrite/functions/<function-id>/index.ts` source directories, creates or updates those exact Appwrite Function IDs, and uploads a temporary archive deployment for each function. Do not check in generated `.tar.gz` archives.
>>>>>>> adcdb32 (Test Appwrite function deployment tooling)
