# Final QA Readiness Action Register

Date: 2026-05-15
Prepared from: attached milestone update, attached execution guide, live GitHub repository inspection, and open PR state
Scope: `info-rbp/rbp-platform` and `info-rbp/frappe-project`

## Validation scope for this register

- Direct `git pull` and local repository checkout were attempted previously from this execution environment and are still blocked by outbound GitHub access restrictions.
- Because of that limit, this register is based on live GitHub connector inspection rather than local clone/build execution.
- Any command-level build, bench, deploy, or browser validation remains pending until run from a machine or QA environment with repository and bench access.

## Repository state

### `info-rbp/rbp-platform`

- `main` is ahead of the older PR #64 base by one commit.
- `main` already contains `docs/launch/MILESTONES_6_TO_17_COMPLETION_SUMMARY.md`, `docs/content/PAGE_COPY_AUDIT.md`, `docs/deployment/QA_EXTERNAL_SETUP_CHECKLIST.md`, `docs/deployment/QA_BACKUP_ROLLBACK.md`, and `frontend/portal/scripts/audit-seo.mjs`.
- `main` also includes later documentation additions for Milestones 12, 13, 15, 16, and 17 plus the QA env example files.
- Public route stability fixes are still sitting in open PR #58 and are not on `main`.
- QA readiness artifacts are still isolated in open draft PR #54 and are not on `main`.

### `info-rbp/frappe-project`

- `main` is ahead of PR #48 base by three commits.
- Those three commits include the Milestone 4 Applications backend alignment and Milestone 5 Stripe foundation merge work.
- `main` contains `rbp_app/rbp_app/services/tenancy.py`, `rbp_app/rbp_app/api/membership.py`, and the `RBP Membership Plan` DocType fields needed for Stripe mapping validation.
- `main` does **not** yet contain `rbp_app/rbp_app/services/signup.py`, so Milestone 7 signup and provisioning has not landed on `main`.
- Milestone 7 remains open in PR #48.

## Discrepancies between the milestone update and current repo state

- The attached milestone update treated PR #48 as stale and needing refresh. Current repo state shows PR #48 is already refreshed, open, not draft, and mergeable.
- The attached milestone update treated Milestones 14, 15, 16, and 17 as broadly outstanding. Current `rbp-platform/main` already contains the copy audit, SEO audit script, external setup checklist, rollback documentation, and later milestone note files. What remains is environment proof and selected remediation PR work, not a blank implementation state.
- The attached milestone update still described PR #58 replacement work as future work. Current repo state still supports that conclusion: PR #58 is open and not mergeable, so a clean replacement PR is still the safer path.

## Open PR inventory

### `info-rbp/rbp-platform`

| PR | Title | Branch | Draft | Mergeable | Scope | Status call |
| --- | --- | --- | --- | --- | --- | --- |
| #54 | Add QA readiness artifacts and initial readiness report | `qa-readiness-artifacts` | Yes | No | Docs-only QA readiness report, smoke, security, rollback, UAT notes | Still useful as source material, but stale as the single source of truth. Keep scoped docs only or supersede after extracting unique value. |
| #58 | Fix public route crashes and add route error handling | `fix/public-route-crashes-and-error-boundary` | No | No | Frontend route stability for `/offers`, `/resources`, `/help`, and route error handling | Still needed in principle, but should not be merged as-is. Recreate only the still-missing fixes on a fresh branch after checking `main`. |
| #64 | Fix Appwrite MCP scaffold build and validation | `fix/appwrite-mcp-build` | No | Yes | Appwrite MCP scaffold repair under `mcp/appwrite` only | Not launch-critical for QA readiness. Recommend defer or close as out-of-scope unless Appwrite is explicitly brought back into scope. |

### `info-rbp/frappe-project`

| PR | Title | Branch | Draft | Mergeable | Scope | Status call |
| --- | --- | --- | --- | --- | --- | --- |
| #48 | Complete Milestone 7 provisioning and backend validation docs | `complete/milestone-7-provisioning-and-validation-docs` | No | Yes | Signup provisioning service, tenancy alignment, focused signup test, backend validation notes | Next critical backend PR. Needs real compile, bench migrate, clear-cache, focused tests, and full suite evidence before merge. |
| #43 | Implement Milestone 8 entitlements and member benefits | `launch/milestone-8-entitlements-member-benefits` | No | No | Entitlement service and API updates plus focused tests | Likely needs refresh after PR #48 and current `main` state. Do not merge before post-PR48 validation pass. |
| #42 | Add Milestone 2 backend baseline validation | `launch/backend-baseline-validation` | No | No | Backend baseline validation script and workflow | Looks superseded by later backend work. Review for any unique workflow content, otherwise close as superseded. |
| #11 | [codex] Update platform validation report | `codex/update-platform-validation-report` | Yes | No | Docs-only platform validation report | Stale docs-only branch. Likely close as superseded after confirming there is no unique evidence to keep. |
| #4 | chore(deps): bump `codecov/codecov-action` from 5 to 6 | `dependabot/github_actions/codecov/codecov-action-6` | No | No | Dependency bump | Not part of QA readiness critical path. |
| #3 | chore(deps): bump `actions/cache` from 4 to 5 | `dependabot/github_actions/actions/cache-5` | No | No | Dependency bump | Not part of QA readiness critical path. |
| #2 | chore(deps): bump `actions/github-script` from 8 to 9 | `dependabot/github_actions/actions/github-script-9` | No | No | Dependency bump | Not part of QA readiness critical path. |
| #1 | chore(deps): bump `bruceadams/get-release` from 1.3.1 to 1.3.2 | `dependabot/github_actions/bruceadams/get-release-1.3.2` | No | No | Dependency bump | Not part of QA readiness critical path. |

## Milestone status based on current repo evidence

### Complete in repository state

- Milestone 1
- Milestone 2
- Milestone 3
- Milestone 4
- Milestone 5

### Partial or implemented but still requiring validation or environment proof

- Milestone 6: membership and Stripe mapping appears present on `main`, but final post-Stripe validation is still required against the QA bench and test Stripe configuration.
- Milestone 8: entitlement work exists in open PR #43, but it is not landed or revalidated after current backend merges.
- Milestone 9: email documentation and QA checklist state exist, but SMTP sandbox and allowlist proof remain external setup work.
- Milestone 10: launch repo documentation says runtime validation was closed, but deployed backend persistence still needs confirmation against the actual QA backend source of truth.
- Milestone 11: Desk-first admin direction is documented, but real Frappe Desk QA verification is still required against the deployed backend.
- Milestone 12: frontend integration documentation exists, but live frontend-to-backend QA verification is still required.
- Milestone 13: delay/register-interest posture is documented, but final QA verification is still required after route and deploy checks.
- Milestone 14: copy audit is documented complete for QA readiness, but rendered browser review in live QA is still required.
- Milestone 15: SEO baseline is implemented and the audit script exists, but a fresh `npm run audit:seo` after route remediation is still required.
- Milestone 16: infrastructure guidance exists, but real QA infrastructure setup and smoke testing remain incomplete.
- Milestone 17: CI/CD guidance exists, but passing live runs and backend deploy path closure remain incomplete.

### Not done or not yet landed on the source-of-truth path

- Milestone 7: not complete until PR #48 is validated and merged into `frappe-project/main`.
- PR #58 replacement route-stability work: not complete.
- PR #54 cleanup/supersedure decision: not complete.
- PR #64 QA-scope decision: not complete.

## Validation still required

### Backend validation still required

Run from a machine with bench access and the target QA site:

```bash
python3 -m compileall rbp_app/rbp_app
bench --site <qa-site> migrate
bench --site <qa-site> clear-cache
bench --site <qa-site> run-tests --app rbp_app --module rbp_app.tests.test_signup
bench --site <qa-site> run-tests --app rbp_app
```

Also still required after PR #48 merges:

```bash
bench --site <qa-site> run-tests --app rbp_app --module rbp_app.tests.test_entitlements_member_benefits
bench --site <qa-site> run-tests --app rbp_app --module rbp_app.tests.test_membership_checkout
```

If the focused modules differ from the actual repo test names, record the exact replacements used.

### Frontend validation still required

Run from a machine with repository checkout access:

```bash
cd frontend/portal
npm ci
npm run build
npm run audit:seo
```

### Live QA validation still required

- Public route matrix after the PR #58 replacement work.
- Member signup to tenant/business/subscription context resolution after PR #48 merge.
- Stripe test-mode membership checkout and signed webhook flow.
- Applications register-interest only flow with no provisioning.
- Marketplace enquiry/listing request gating and reviewed messaging.
- Frappe Desk admin visibility for tenant, business, subscription, entitlement, support, and service records.
- Email sandbox delivery and blocked-recipient behavior.

## External setup still required

- QA domain and frontend host verification.
- QA backend site confirmation.
- GitHub Actions deploy secrets: `QA_HOST`, `QA_USER`, `QA_SSH_KEY`, and optional `QA_FRONTEND_PATH`.
- Stripe test product, recurring test price, test webhook endpoint, and webhook secret.
- Bench config values for QA environment, Stripe test mode, email sandbox mode, and disabled application provisioning.
- SMTP/email sandbox configuration and allowlist.
- Backend deploy and restart path proof.
- Backup artifact creation and rollback dry run.

## Immediate next PRs to fix or close

1. Validate PR #48 against the actual QA bench, update the PR with real results, and merge it if all required commands pass.
2. Recreate PR #58 as a clean replacement branch from current `rbp-platform/main`, carrying only the still-missing route stability fixes, then run `npm ci`, `npm run build`, and `npm run audit:seo`.
3. Reassess PR #43 immediately after PR #48 lands. Refresh only the Milestone 8 entitlement changes that are still missing from `main`.
4. Review PR #54 for unique docs content that still matters after this action register. Close it as superseded if the remaining material is redundant.
5. Decide PR #64 explicitly: defer/close as out-of-scope for QA readiness unless Appwrite is being brought back into the approved QA path.
6. Close or defer the stale non-QA-critical `frappe-project` docs and Dependabot PRs so the active QA path is easier to read.

## Boundaries confirmed unchanged by this register

- Applications remain delayed and register-interest only.
- Customer-facing Application provisioning is still not approved.
- Stripe remains test-mode only for QA.
- No live payment behavior is approved.
- Marketplace listing and enquiry flows remain reviewed, gated, or interest-based.
- Frappe Desk remains the operational admin backend.
- React `/admin` is not treated as authoritative unless backed by Frappe persistence.
