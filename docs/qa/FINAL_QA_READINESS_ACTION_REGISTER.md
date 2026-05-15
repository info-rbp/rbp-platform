# Final QA Readiness Action Register

Date: 2026-05-15
Scope: Partial closeout for Milestones 6, 8, 9, and 12 to 17
Repositories: `info-rbp/frappe-project`, `info-rbp/rbp-platform`

## Execution limits recorded

A local checkout was attempted for both repositories, but the execution container could not resolve `github.com`. Because of that, command-level validation remains blocked in this run:

```text
fatal: unable to access 'https://github.com/info-rbp/frappe-project.git/': Could not resolve host: github.com
```

This register therefore records repository/PR reconciliation performed through the GitHub connector and separates implementation evidence from command/runtime proof. Nothing below is marked PASS unless the required command or manual proof actually ran.

## Partial milestone table

| Milestone | Current implementation state | Validation state | Environment proof state | Status | Next action | Evidence PR/doc/test command |
| --- | --- | --- | --- | --- | --- | --- |
| Milestone 6: Membership plans and Stripe mapping | Implemented on `frappe-project/main` through merged PR #44. `RBP Membership Plan` includes Stripe product/price fields; seed patch and membership service/test files are present. | Focused test file exists, but required bench commands were not run in this execution environment. Secret search via GitHub code search returned no `sk_live_`, `sk_test_`, or `whsec_` matches, but the required local grep scan remains blocked by no checkout. | BLOCKED: no local bench/site access and no clone access from this environment. Stripe test product/price still needs QA environment confirmation. | PARTIAL | Run compileall, bench migrate, clear-cache, focused Milestone 6 tests, full app tests, and local secret greps from the QA bench machine. | PR #44; `rbp_app/rbp_app/tests/test_milestone6_membership_stripe_mapping.py`; `python3 -m compileall rbp_app/rbp_app`; `bench --site hrms.localhost run-tests --app rbp_app --module rbp_app.tests.test_milestone6_membership_stripe_mapping` |
| Milestone 8: Entitlements and member benefits | Implemented on `frappe-project/main` through merged PR #44. PR #43 was compared and closed as superseded because its Milestone 8 files are now covered by PR #44; only a non-Milestone workflow tweak was unique. | Focused test file exists and covers disabled Applications provisioning, membership grants excluding provisioning, entitlement checks, and billing-to-entitlement sync. Required bench validation was not run here. | BLOCKED: no local bench/site access and no clone access from this environment. | PARTIAL | Run compileall, bench migrate, clear-cache, focused Milestone 8 tests, full app tests. Bring the old workflow tweak back only in a separate CI-only PR if still wanted. | PR #44; PR #43 closed as superseded; `rbp_app/rbp_app/tests/test_milestone8_entitlements.py`; `bench --site hrms.localhost run-tests --app rbp_app --module rbp_app.tests.test_milestone8_entitlements` |
| Milestone 9: Email notifications and email sandbox proof | Notification implementation/docs exist in the launch/platform closeout trail. Email sandbox documentation has been expanded in this branch with exact QA config, SMTP checklist, source-of-truth alignment checks, automated commands, and manual proof requirements. | Not validated in this run. No allowlisted send/fake-send, blocked-recipient test, notification log proof, or fail-open runtime proof was executed. | BLOCKED: SMTP/Frappe Email Account, sandbox allowlist, QA backend site, and delivery logs are external setup requirements. | BLOCKED | Configure QA email sandbox, confirm backend source-of-truth alignment, run focused notification tests, then record allowlisted delivery/fake-send and blocked-recipient evidence. | `docs/deployment/EMAIL_QA_SANDBOX.md`; `bench --site hrms.localhost run-tests --app rbp_app --module rbp_app.tests.test_milestone9_notifications` |
| Milestone 12: Frontend-to-backend verification | Later milestone docs and runtime-config guidance exist on `rbp-platform/main`. | Frontend build, SEO audit, and live route/API verification were not run here. | BLOCKED: no local checkout/npm execution and no confirmed QA URL/API URL from this run. | BLOCKED | From a real checkout, run frontend build and SEO audit; from QA network, curl public/protected routes and verify backend calls persist to Frappe. | `cd frontend/portal && npm ci && npm run build && npm run audit:seo`; QA curl matrix for `/`, `/signin`, `/signup`, `/portal/dashboard`, `/admin/signin` |
| Milestone 13: Applications delayed/register-interest verification | Boundary remains documented: Applications must remain delayed/register-interest only. Milestone 8 backend test coverage rejects `applications_provisioning`. | Targeted grep and rendered QA verification were not run locally because no checkout exists. | BLOCKED: no local checkout/browser QA session. | BLOCKED | Run CTA grep locally, verify `/applications` rendered copy, submit application interest to backend, and confirm admin can inspect interest records without enabling provisioning. | `grep -R "Open app\|Launch app\|Provision now\|Activate application\|Available now\|Start using" frontend/portal/src/app -n || true` |
| Milestone 14: Rendered copy review | Copy audit docs exist in `rbp-platform/main`; legal placeholder remediation was handled separately from this partial-milestone pass. | Rendered route review was not run here. | BLOCKED: no local build/browser session and no confirmed QA URL. | BLOCKED | Run live rendered review for public, protected, marketplace, admin boundary, and legal routes. Confirm no placeholder-only body copy and no live provisioning/payment claims. | `docs/content/PAGE_COPY_AUDIT.md`; route matrix: `/`, `/membership`, `/applications`, `/offers`, `/resources`, `/help`, legal pages |
| Milestone 15: SEO validation | SEO audit script and SEO docs are referenced in merged launch closeout docs. | `npm run audit:seo` was not run here. | BLOCKED: no local checkout/npm execution. | BLOCKED | Run fresh `npm ci`, build, and SEO audit after latest route/legal changes. Confirm metadata, noindex protected routes, sitemap exclusions, robots, and canonical config. | `cd frontend/portal && npm ci && npm run build && npm run audit:seo` |
| Milestone 16: QA infrastructure and smoke testing | QA external setup and rollback docs exist on `rbp-platform/main`. | Smoke tests were not run here. | BLOCKED: QA frontend host, backend site, HTTPS, SPA fallback, Frappe Desk, Stripe test config, email sandbox, deploy secrets, backup, and rollback proof all require environment access. | BLOCKED | Provision/confirm QA infrastructure and run curl smoke matrix plus backup/rollback dry run. | `docs/deployment/QA_EXTERNAL_SETUP_CHECKLIST.md`; `docs/deployment/QA_BACKUP_ROLLBACK.md`; QA curl matrix |
| Milestone 17: CI/CD proof | CI/CD finalisation doc exists and one Appwrite MCP workflow exists. Expected frontend, SEO, backend static, Frappe smoke, and QA deploy workflows are documented but not proven by this run. | Latest workflow-run proof was not available through this execution run; no local workflow execution was possible. | BLOCKED: deploy secrets and passing workflow runs still need verification in GitHub Actions. | BLOCKED | Confirm actual workflow files/runs for frontend validation, SEO validation, backend static validation, Frappe smoke/backend guidance, and QA deploy path. Record workflow name, branch, status, commit SHA, and failures. | `docs/deployment/MILESTONE_17_CICD_FINALISATION.md`; `.github/workflows/*`; GitHub Actions run history |

## PR decisions

### `info-rbp/frappe-project` PR #43

Decision: closed as superseded.

Reason: PR #44 already merged the Milestone 8 entitlement/member-benefit implementation files now needed on `main`, including entitlement service/API, billing-to-entitlement sync, focused tests, and docs. PR #43's only unique file after comparison was `.github/workflows/linters.yml`, which is CI hygiene rather than Milestone 8 entitlement functionality. If that workflow tweak is still useful, it should be reintroduced separately as a CI-only PR.

### Whether PR #44 fully covers Milestone 8 after comparison

Implementation coverage: yes for the Milestone 8 backend files compared in this pass.

Validation coverage: no. PR #44 itself recorded that QA bench validation remained required. Milestone 8 stays PARTIAL until compileall, migrate, clear-cache, focused tests, and full app tests pass on the QA bench/site.

## Email sandbox config status

Status: BLOCKED pending external setup.

Required QA values:

```bash
RBP_ENABLE_EMAIL_NOTIFICATIONS=true
RBP_EMAIL_SANDBOX_MODE=true
RBP_QA_EMAIL_RECIPIENTS=<allowlisted QA emails>
RBP_ADMIN_NOTIFICATION_RECIPIENTS=<admin QA emails>
```

Also required: Frappe Email Account/SMTP host, port, username, password outside Git, sender, reply-to, allowlist, admin recipients, blocked-recipient test case, delivery log location, and rollback/disable switch.

## Live QA URL status

Status: BLOCKED.

No QA URL was confirmed or curl-tested in this run. Required route checks remain:

```bash
curl -I https://qa.remotebusinesspartner.com.au
curl -I https://qa.remotebusinesspartner.com.au/signin
curl -I https://qa.remotebusinesspartner.com.au/signup
curl -I https://qa.remotebusinesspartner.com.au/applications
curl -I https://qa.remotebusinesspartner.com.au/membership
curl -I https://qa.remotebusinesspartner.com.au/portal/dashboard
curl -I https://qa.remotebusinesspartner.com.au/admin/signin
curl -I https://qa.remotebusinesspartner.com.au/robots.txt
curl -I https://qa.remotebusinesspartner.com.au/sitemap.xml
```

## Stripe test-mode config status

Status: PARTIAL/BLOCKED.

Repository implementation evidence exists for Stripe product/price mapping and checkout validation. QA runtime proof still requires Stripe test product, recurring test price, test webhook endpoint, webhook secret in QA config only, signed webhook test, and confirmation that no live payment behavior is enabled.

## Frappe Desk validation status

Status: BLOCKED.

Frappe Desk remains the operational admin backend by project boundary. Real validation still requires Desk access on the QA backend and confirmation that tenant, business, subscription, entitlement, notification, service request, application-interest, and marketplace records are visible/administered there.

## CI/CD workflow status

Status: BLOCKED.

Observed repository evidence confirms an Appwrite MCP validation workflow exists, but that workflow is not QA-critical for frontend/backend launch validation. The expected frontend validation, SEO validation, backend static validation, Frappe smoke/backend guidance, and QA deploy proof still need run-history evidence or workflow creation/repair.

## Remaining external blockers

- QA bench/site access.
- Local repository checkout or runner with working GitHub DNS/network access.
- QA frontend host and deployed backend URL.
- QA `VITE_API_BASE_URL` confirmation.
- Mock auth disabled in QA.
- Stripe test product/price/webhook/secret configured outside Git.
- SMTP/Frappe Email Account sandbox and allowlist.
- Frappe Desk admin access.
- GitHub Actions deploy secrets.
- Backup artifact and rollback proof.
- Live rendered route review and curl smoke matrix.

## Boundaries reconfirmed

- Applications remain delayed/register-interest only.
- Customer-facing Application provisioning remains disabled.
- Stripe remains test-mode only for QA.
- No live payment behavior is approved.
- Marketplace listing/enquiry flows remain reviewed, gated, or interest-based.
- Frappe Desk remains the operational admin backend.
- React `/admin` is not authoritative unless backed by Frappe persistence.
