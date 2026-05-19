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

`appwrite:functions:deploy -- --apply` uses `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, and `APPWRITE_API_KEY` for deployment access. On apply it also reconciles Appwrite Function runtime variables from the current shell environment by key name without printing values. Required runtime variables are `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY`, and `APPWRITE_DATABASE_ID`; optional runtime variables include storage, admin-team, trusted-invocation, Stripe, and QA email sandbox keys when present.

The function deployer reads the expected IDs from `appwrite/appwrite.config.json`, requires matching `appwrite/functions/<function-id>/index.ts` source directories, creates or updates those exact Appwrite Function IDs, reconciles runtime variables, and uploads a temporary archive deployment for each function. Runtime values are stored in Appwrite Function variables and are not written into generated archives. Do not check in generated `.tar.gz` archives.
