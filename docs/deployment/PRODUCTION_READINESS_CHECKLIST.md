# Production Readiness Checklist

Use this checklist only after QA runtime completion and UAT sign-off.

## 1. Environment Separation

- [ ] Production Appwrite project confirmed.
- [ ] Production database confirmed.
- [ ] Production storage bucket confirmed.
- [ ] Production Functions confirmed.
- [ ] Production Stripe account, products, and prices confirmed.
- [ ] Production webhook endpoint confirmed.
- [ ] Production email sender and domain confirmed.
- [ ] Production Cloudflare Pages environment confirmed.

## 2. Secret Inventory

List names only, never values.

- [ ] `APPWRITE_ENDPOINT`
- [ ] `APPWRITE_PROJECT_ID`
- [ ] `APPWRITE_API_KEY`
- [ ] `APPWRITE_DATABASE_ID`
- [ ] `APPWRITE_STORAGE_BUCKET_ID`
- [ ] `APPWRITE_ADMIN_TEAM_ID`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `SMTP_*`
- [ ] `RBP_INTERNAL_FUNCTION_TOKEN`

## 3. Backup

- [ ] What is backed up is documented.
- [ ] Backup frequency is documented.
- [ ] Backup owner is named.
- [ ] Restore test procedure is documented.
- [ ] Evidence storage location is documented.

## 4. Rollback

- [ ] Frontend rollback path documented.
- [ ] Appwrite schema rollback path documented.
- [ ] Appwrite Function rollback path documented.
- [ ] Stripe webhook rollback path documented.
- [ ] Email provider rollback path documented.
- [ ] Cloudflare environment rollback path documented.

## 5. Monitoring

- [ ] Function execution failures monitored.
- [ ] Stripe webhook failures monitored.
- [ ] Email delivery failures monitored.
- [ ] Auth and signup failures monitored.
- [ ] Admin operation failures monitored.
- [ ] Schema drift checks scheduled.

## 6. Launch Gates

- [ ] `appwrite:schema:diff` clean.
- [ ] `appwrite:functions:verify` clean.
- [ ] Execute-mode smoke tests passed.
- [ ] Stripe webhook proof passed.
- [ ] Email proof passed.
- [ ] Cloudflare/frontend QA passed.
- [ ] UAT signed off.
- [ ] Backup and rollback tests completed.
- [ ] Legal and payment copy approved.

## Final Decision

- Go or no-go:
- Decision date:
- Decision owner:
- Notes:
