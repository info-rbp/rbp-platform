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
- `npm run appwrite:functions:deploy -- --apply`
- `npm run appwrite:functions:verify`
- `npm run appwrite:seed:qa -- --apply`

`appwrite:functions:deploy -- --apply` uses only `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, and `APPWRITE_API_KEY` for deployment access. Function runtime secrets such as Stripe, database, storage, and admin-team values remain managed as Appwrite Function/project environment variables and are not written into generated archives.

The function deployer reads the expected IDs from `appwrite/appwrite.config.json`, requires matching `appwrite/functions/<function-id>/index.ts` source directories, creates or updates those exact Appwrite Function IDs, and uploads a temporary archive deployment for each function. Do not check in generated `.tar.gz` archives.
