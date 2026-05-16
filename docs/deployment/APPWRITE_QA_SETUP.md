# Appwrite QA Setup

## Branch And Scope

- Target integration branch: `launch/appwrite-runtime-completion`
- PR #81 is already merged into the runtime-completion branch.
- Use short-lived implementation branches for follow-up repo work.
- Do not work directly on `main` for QA runtime completion.

## Required QA Environment Load

Load the QA environment before any live Appwrite, Stripe, email, or smoke command:

```sh
set -a
source .env.qa.local
set +a
```

Verify required variables are loaded without printing secret values:

```sh
for key in APPWRITE_ENDPOINT APPWRITE_PROJECT_ID APPWRITE_API_KEY APPWRITE_DATABASE_ID APPWRITE_STORAGE_BUCKET_ID APPWRITE_ADMIN_TEAM_ID STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET STRIPE_SUCCESS_URL STRIPE_CANCEL_URL QA_SMOKE_USER_EMAIL QA_SMOKE_USER_PASSWORD QA_SMOKE_USER_ID QA_SMOKE_ADMIN_USER_ID QA_SMOKE_TENANT_ID QA_SMOKE_PLAN_CODE QA_SMOKE_SERVICE_TYPE QA_EMAIL_ALLOWLIST QA_EMAIL_ALLOWED_RECIPIENT QA_EMAIL_BLOCKED_RECIPIENT; do
  value="$(printenv "$key")"
  if [ -n "$value" ]; then
    echo "$key=loaded"
  else
    echo "$key=MISSING"
  fi
done
```

## Apply Order

1. `npm run appwrite:schema:validate`
2. `npm run appwrite:permissions:validate`
3. `npm run appwrite:schema:deploy -- --apply`
4. `npm run appwrite:schema:diff`
5. `npm run appwrite:functions:validate`
6. `npm run appwrite:functions:deploy -- --apply`
7. `npm run appwrite:functions:verify`
8. `npm run appwrite:seed:qa -- --apply`
9. `npm run appwrite:seed:validate`

## Schema Permission Reconciliation

`appwrite:schema:deploy` now reconciles collection and bucket permissions against the repository definitions.

Dry-run mode:

```sh
npm run appwrite:schema:deploy
```

Apply mode:

```sh
npm run appwrite:schema:deploy -- --apply
```

Expected dry-run behavior:

- Missing collections, attributes, indexes, and buckets are reported without mutation.
- Permission drift is reported in `summary.drift`.
- Permission updates are only applied in `--apply` mode.

Important notes:

- `APPWRITE_ADMIN_TEAM_ID` is required when repository permissions include `team:admins` and apply mode is used.
- Missing `APPWRITE_ADMIN_TEAM_ID` during dry-run surfaces as manual action rather than silently passing.
- Permission reconciliation is security-sensitive but not destructive. No collection, bucket, function, index, or attribute deletion is performed by this workflow.

## Function Deployment Expectations

`appwrite:functions:deploy -- --apply` uses only `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, and `APPWRITE_API_KEY` for deployment access. Function runtime secrets such as Stripe, database, storage, and admin-team values remain managed as Appwrite Function or project environment variables and are not written into generated archives.

The function deployer reads expected IDs from `appwrite/appwrite.config.json`, requires matching `appwrite/functions/<function-id>/index.ts` source directories, creates or updates those Appwrite Function IDs, and uploads a temporary archive deployment for each function. Generated `.tar.gz` archives must not be committed.

## Evidence And Follow-Up Docs

Use these documents to record live QA completion evidence:

- `docs/deployment/QA_FUNCTION_DEPLOYMENT_EVIDENCE.md`
- `docs/qa/LEGACY_FUNCTION_DISPOSITION.md`
- `docs/qa/QA_SMOKE_EXECUTION_EVIDENCE.md`
- `docs/qa/STRIPE_WEBHOOK_QA_PROOF.md`
- `docs/qa/EMAIL_SANDBOX_QA_PROOF.md`
- `docs/qa/QA_SEED_VALIDATION_EVIDENCE.md`
- `docs/qa/CLOUDFLARE_FRONTEND_QA_EVIDENCE.md`
- `docs/qa/UAT_TEST_PLAN.md`
- `docs/qa/UAT_RESULTS.md`
- `docs/deployment/PRODUCTION_READINESS_CHECKLIST.md`
- `docs/deployment/ROLLBACK_RUNBOOK.md`
- `docs/deployment/BACKUP_RESTORE_RUNBOOK.md`
