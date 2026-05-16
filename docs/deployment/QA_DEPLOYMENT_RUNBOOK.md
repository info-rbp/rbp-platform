# QA Deployment Runbook

1. Validate frontend environment variables.
2. Validate Appwrite schema and function definitions.
3. Deploy Appwrite schema to QA.
4. Deploy Appwrite Functions to QA.
5. Seed QA data.
6. Trigger Cloudflare QA frontend build.
7. Run smoke checks.

## Appwrite Functions Deployment

Function IDs are sourced from `appwrite/appwrite.config.json`. Each configured ID must have a matching directory under `appwrite/functions/<function-id>` with an `index.ts` entrypoint.

Dry-run:

```sh
npm run appwrite:functions:deploy
```

The dry-run writes `appwrite/functions/deployment-manifest.json` and does not mutate Appwrite.

Live apply:

```sh
APPWRITE_ENDPOINT=... \
APPWRITE_PROJECT_ID=... \
APPWRITE_API_KEY=... \
npm run appwrite:functions:deploy -- --apply
```

The apply path creates missing Appwrite Functions, updates existing Functions with the configured runtime/build settings, packages each function plus `appwrite/functions/_shared` into a temporary `.tar.gz`, and uploads an activated deployment. Temporary archives are deleted after upload.

Verify the live function IDs after deploy:

```sh
npm run appwrite:functions:verify
```

Deployment is complete only when the verify output reports `"missing": []`.
