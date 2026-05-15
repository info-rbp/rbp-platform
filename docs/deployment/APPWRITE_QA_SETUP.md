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
- `npm run appwrite:functions:deploy -- --apply`
- `npm run appwrite:seed:qa -- --apply`
