# QA Deployment Runbook

## Scope

This runbook tracks the Appwrite QA runtime-completion sequence for `launch/appwrite-runtime-completion` after PR #81 merged.

## 1. Preflight

1. Validate the branch target is `launch/appwrite-runtime-completion` or a short-lived branch based on it.
2. Load `.env.qa.local`.
3. Confirm required QA, Stripe, and email variables are present.
4. Run the non-live validation set:

```sh
npm run test:unit
npm run test:integration
npm run test:smoke:dry-run
npm run appwrite:schema:validate
npm run appwrite:permissions:validate
npm run appwrite:functions:validate
npm run appwrite:seed:validate
npm run appwrite:stripe-plan-mapping:validate
```

## 2. Appwrite Schema Apply

Dry-run:

```sh
npm run appwrite:schema:deploy
```

Live apply:

```sh
npm run appwrite:schema:deploy -- --apply
npm run appwrite:schema:diff
```

Success target:

- `missingCollections = []`
- `missingAttributes = []`
- `missingIndexes = []`
- `missingBuckets = []`
- `permissionMismatches = []`

## 3. Appwrite Functions Deploy And Verify

Deploy:

```sh
npm run appwrite:functions:deploy -- --apply
```

Verify:

```sh
npm run appwrite:functions:verify
```

The verify output should report no missing expected functions. If the legacy function `69ff594b000beaeee38e` still exists, record its status in `docs/qa/LEGACY_FUNCTION_DISPOSITION.md` and delete it unless it is intentionally retained.

Record console proof in `docs/deployment/QA_FUNCTION_DEPLOYMENT_EVIDENCE.md`.

## 4. Seed Validation

```sh
npm run appwrite:seed:validate
npm run appwrite:seed:qa -- --apply
npm run appwrite:seed:validate
```

Record evidence in `docs/qa/QA_SEED_VALIDATION_EVIDENCE.md`.

## 5. Execute-Mode Smoke Checks

Run each QA smoke command individually:

```sh
npm run smoke:qa:auth -- --execute
npm run smoke:qa:billing -- --execute
npm run smoke:qa:stripe-webhook -- --execute
npm run smoke:qa:service-requests -- --execute
npm run smoke:qa:admin -- --execute
npm run smoke:qa:permissions -- --execute
npm run smoke:qa:email
```

Record results in `docs/qa/QA_SMOKE_EXECUTION_EVIDENCE.md`.

## 6. Stripe And Email Live Proof

- Record Stripe webhook proof in `docs/qa/STRIPE_WEBHOOK_QA_PROOF.md`.
- Record email allowlist and blocked-recipient proof in `docs/qa/EMAIL_SANDBOX_QA_PROOF.md`.

## 7. Cloudflare And Frontend QA

Run:

```sh
npm run cloudflare:env:validate
npm run build
```

Then complete the manual browser checklist in `docs/qa/CLOUDFLARE_FRONTEND_QA_EVIDENCE.md`.

## 8. UAT And Sign-Off

- Execute the scenarios in `docs/qa/UAT_TEST_PLAN.md`.
- Record pass/fail, defects, and sign-off in `docs/qa/UAT_RESULTS.md`.

## 9. Production Readiness Gate

Do not schedule production deployment until all of the following are true:

- Schema diff is clean.
- Functions verify is clean.
- Execute-mode smoke checks pass.
- Stripe webhook proof is complete.
- Email proof is complete.
- Cloudflare/frontend QA is complete.
- UAT is signed off.
- Backup and rollback runbooks are filled and tested.

Use:

- `docs/deployment/PRODUCTION_READINESS_CHECKLIST.md`
- `docs/deployment/ROLLBACK_RUNBOOK.md`
- `docs/deployment/BACKUP_RESTORE_RUNBOOK.md`
