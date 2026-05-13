# Milestone 10: Service Request Persistence Implementation

## Summary
Milestone 10 is completed in code for backend service request persistence hardening. Portal service submissions now persist operational records with server-resolved tenant ownership, human-readable reference IDs, submission lifecycle fields, notification/email hooks, audit events, admin-only status updates, and portal activity aggregation.

Bench runtime validation remains a blocker for this checkout because the repository is not inside the available Frappe bench worktree.

## Finalisation Pass

This pass started from latest `origin/main` on branch `complete/milestone-10-finalisation`. The inventory below records the PR #47 baseline before this pass, then the final implemented state.

### Target DocType Inventory Before Changes
| DocType | tenant | owner | reference_id | status | workflow_state | submitted_on | source_channel | assigned_to | reviewed_on | closed_on |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `RBP Decision Desk Request` | yes | `owner_user` | no | yes | yes | yes | yes | yes | yes | yes |
| `RBP DocuShare Document` | yes | `owner_user` | no | yes | no | no | yes | no | no | no |
| `RBP Connectivity Request` | yes | `owner_user` | no | yes | yes | yes | no | yes | yes | yes |
| `RBP Risk Advisor Assessment` | yes | `owner_user` | no | yes | yes | yes | no | yes | yes | yes |
| `RBP Fixer Case` | yes | `owner_user` | no | yes | yes | yes | yes | yes | yes | yes |
| `RBP Marketplace Listing` | yes | `owner_user` | no | yes | no | no | no | no | no | no |
| `RBP Marketplace Order` | yes | `buyer_user` as owner equivalent | no | yes | no | no | no | no | no | no |

### Target DocType Final State
| DocType | tenant | owner | reference_id | status | workflow_state | submitted_on | source_channel | assigned_to | reviewed_on | closed_on |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `RBP Decision Desk Request` | yes | `owner_user` | yes | yes | yes | yes | yes | yes | yes | yes |
| `RBP DocuShare Document` | yes | `owner_user` | yes | yes | yes | yes | yes | yes | yes | yes |
| `RBP Connectivity Request` | yes | `owner_user` | yes | yes | yes | yes | yes | yes | yes | yes |
| `RBP Risk Advisor Assessment` | yes | `owner_user` | yes | yes | yes | yes | yes | yes | yes | yes |
| `RBP Fixer Case` | yes | `owner_user` | yes | yes | yes | yes | yes | yes | yes | yes |
| `RBP Marketplace Listing` | yes | `owner_user` | yes | yes | yes | yes | yes | yes | yes | yes |
| `RBP Marketplace Order` | yes | `buyer_user` as owner equivalent | yes | yes | yes | yes | yes | yes | yes | yes |

`reference_id` is read-only and list-visible. It is intentionally not marked unique in this pass to avoid migration risk on legacy rows until the backfill has run in the target bench database.

### Create Flow Inventory Before Changes
| Service | Draft by default | Submitted/operational create | `payload.submit` | reference_id | submitted_on | source_channel | notifications | email hook | routes in DTO |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Decision Desk | yes | only via `submit_request` | no | conditional no-op until schema | set too early on create | yes | submit only | submit only | no |
| DocuShare | yes | no final brief create | no | conditional no-op until schema | conditional no-op until schema | yes | no create notifications | no | no |
| Connectivity/NBN | yes | only via `submit_request` | no | conditional no-op until schema | set too early on create | conditional no-op until schema | submit only | submit only | no |
| Risk Advisor | yes | only via `submit_assessment` | no | conditional no-op until schema | set too early on create | conditional no-op until schema | submit only | submit only | no |
| The Fixer | yes | only via `submit_case` | no | conditional no-op until schema | set too early on create | yes | submit only | submit only | no |
| Marketplace Listing | yes | no review-first create | no | conditional no-op until schema | conditional no-op until schema | conditional no-op until schema | owner only | listing hook existed | no |
| Marketplace Enquiry | Requested | requested order create | n/a | conditional no-op until schema | conditional no-op until schema | conditional no-op until schema | vendor only | enquiry hook existed | no |

### Create Flow Final State
| Service | Create behavior | Reference ID | Notifications | Email hook | DTO |
| --- | --- | --- | --- | --- | --- |
| Decision Desk | `create_request` remains draft-capable; `payload.submit=True` creates Submitted; `submit_request` preserved | `RBP-DD` | customer + admins on submit | `service.request_submitted` | normalized routes/fields |
| DocuShare | `create_document` remains draft-capable; `create_brief` forces submit | `RBP-DOC` | customer + admins on submit | `docushare.brief_submitted` | normalized routes/fields |
| Connectivity/NBN | `create_request` remains draft-capable; `create_order` forces submit | `RBP-NBN` | customer + admins on submit | `connectivity.nbn_order_submitted` | normalized routes/fields |
| Risk Advisor | `create_assessment` supports `payload.submit=True`; draft/update/submit preserved | `RBP-RISK` | customer + admins on submit | `risk_advisor.assessment_submitted` | normalized routes/fields |
| The Fixer | `create_case` remains draft-capable; `create_request` forces submit | `RBP-FIX` | customer + admins on submit | `fixer.request_submitted` | normalized routes/fields |
| Marketplace Listing | `create_listing` creates Under Review by default and never publishes by default | `RBP-MKT` | owner + admins | `marketplace.listing_submitted` | normalized routes/fields |
| Marketplace Enquiry | `create_enquiry`/`create_order` creates Requested enquiry/order | `RBP-MKT-ENQ` | buyer + vendor + admins | `marketplace.enquiry_submitted` | normalized routes/fields |

### Admin Status Endpoint Inventory
| Endpoint | System Manager guard |
| --- | --- |
| `rbp_app.api.decision_desk.admin_update_status` | yes |
| `rbp_app.api.docushare.admin_update_status` | added |
| `rbp_app.api.connectivity.admin_update_status` | yes |
| `rbp_app.api.risk_advisor.admin_update_status` | yes |
| `rbp_app.api.the_fixer.admin_update_status` | yes |
| `rbp_app.api.marketplace.admin_update_listing_status` | added |
| `rbp_app.api.marketplace.admin_update_enquiry_status` | added |

## Implemented Endpoints
- Decision Desk: `rbp_app.api.decision_desk.create_request`, `submit_request`, `list_my_requests`, `get_request`, `admin_update_status`
- DocuShare: `rbp_app.api.docushare.create_brief`, `create_document`, `list_my_briefs`, `get_brief`, `admin_update_status`
- Connectivity: `rbp_app.api.connectivity.create_order`, `create_request`, `list_my_orders`, `get_order`, `admin_update_status`
- Risk Advisor: `rbp_app.api.risk_advisor.create_assessment`, `list_my_assessments`, `get_assessment`, `admin_update_status`
- The Fixer: `rbp_app.api.the_fixer.create_request`, `create_case`, `list_my_requests`, `get_request`, `admin_update_status`
- Marketplace: `rbp_app.api.marketplace.create_listing`, `create_enquiry`, `list_my_orders`, `get_order`, `admin_update_listing_status`, `admin_update_enquiry_status`
- Portal: `rbp_app.api.portal.get_my_service_activity`

## Schema Fields Added
Added missing `reference_id`, `workflow_state`, `submitted_on`, `source_channel`, `assigned_to`, `reviewed_on`, and `closed_on` fields where absent across the seven target DocTypes. Existing fields and autoname rules were preserved.

Marketplace Listing statuses now include `Submitted`, `Under Review`, and `Rejected`. DocuShare Document statuses now include `Submitted`.

## Reference ID Prefixes
- Decision Desk: `RBP-DD`
- DocuShare: `RBP-DOC`
- Connectivity/NBN: `RBP-NBN`
- Risk Advisor: `RBP-RISK`
- The Fixer: `RBP-FIX`
- Marketplace Listing: `RBP-MKT`
- Marketplace Enquiry/Offer: `RBP-MKT-ENQ`

## Backfill Patch Behavior
Patch: `rbp_app.patches.backfill_service_request_reference_ids`

The patch is idempotent, skips missing DocTypes/fields, reads target records, and updates only rows whose `reference_id` is empty. It uses `generate_reference_id(prefix)` and `frappe.db.set_value(..., update_modified=False)`.

## Portal Activity Aggregation Behavior
`rbp_app.services.portal.get_my_service_activity` now computes admin state once per call. System Managers can aggregate all configured records. Non-admin users only see records when the DocType has tenant protection matching their tenant and an owner/assigned field matching their user. DocTypes without tenant protection are skipped for non-admin users unless explicitly configured as safe.

## Admin Status Update Behavior
Admin status updates require System Manager at the API layer and service-layer admin permission checks. Updates validate allowed statuses, sync `workflow_state`, set `reviewed_on` for review/progress states, set `closed_on` for terminal states, notify customers, emit email notification events, record audit events, and return normalized DTOs.

## Notification/Email Behavior
Submitted create paths create internal customer notifications and admin notifications. Email notification hooks reuse `emit_event_notification` with safe contexts containing `reference_id`, `service_name`, `status`, `portal_url`, and `admin_url`. Notification/email failures are caught and logged with `frappe.log_error` without blocking record persistence.

## Tests Added
- Added `apps/rbp_app/rbp_app/tests/test_service_request_persistence.py`
- Updated `apps/rbp_app/rbp_app/tests/test_portal_service_activity.py`
- Updated existing service tests to account for reference ID generation and marketplace review-first listing behavior.

Coverage includes guest denial, submitted create DTOs, server-resolved tenant ownership, notification/email hooks, admin permission wrappers, status lifecycle updates, portal activity hardening, and backfill idempotency.

## Commands Run
- `git fetch origin main`
- `git checkout -B complete/milestone-10-finalisation origin/main`
- `python3 -m compileall apps/rbp_app/rbp_app` - passed
- `jq empty` over all seven target DocType JSON files - passed
- `git diff --check` - passed
- `PYTHONPATH=apps/rbp_app python3 -m unittest apps.rbp_app.rbp_app.tests.test_service_request_persistence apps.rbp_app.rbp_app.tests.test_portal_service_activity` - blocked because this checkout has no importable `frappe` package outside bench
- `bench --site hrms.localhost migrate` from repo root - failed immediately because the command was not executed in a bench directory
- `gh pr view 47 --repo info-rbp/rbp-platform --json ...` - inspected PR #47 checks

## Commands Not Run
Bench commands were not run from this checkout:
- `bench --site <site-name> migrate`
- `bench --site <site-name> clear-cache`
- `bench --site <site-name> run-tests --app rbp_app`
- `bench --site <site-name> run-tests --app rbp_app --module rbp_app.tests.test_service_request_persistence`
- `bench --site <site-name> run-tests --app rbp_app --module rbp_app.tests.test_portal_service_activity`

Reason: this repository checkout does not contain `sites/` or a bench runtime. A separate bench exists at `../rbp-bench`, but its `apps/rbp_app` is not this Git worktree, so running there would not validate these changes.

## Appwrite Status
PR #47 is merged. Its GitHub rollup showed `Validate repository structure` succeeded, while the Appwrite status context `rbp-platform (New project)` failed and points to an Appwrite Cloud function URL. That status appears unrelated to the Frappe/backend service persistence code changed here. It remains unresolved outside this milestone.

## Remaining Limitations
- Bench migration and Frappe test execution still need to be run in a bench where this exact branch is installed.
- `reference_id` uniqueness should be enabled only after the target database has run the backfill and confirmed no blank/duplicate legacy values remain.
