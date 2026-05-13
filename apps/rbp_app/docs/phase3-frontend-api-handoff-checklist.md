# Phase 3 Frontend/API Handoff Checklist

Repository: `info-rbp/frappe-project`

App: `rbp_app`

Scope: documentation only. This checklist maps Phase 3 backend APIs to expected client flows. Do not implement frontend code, backend code, QA automation, launch changes, repo consolidation, Frappe core edits, generated bench artifacts, custom admin backend work, or changes under `start/apps/*` or `start/sites/*`.

Source documents:
- `rbp_app/docs/phase3-api-endpoint-inventory.md`
- `rbp_app/docs/phase3-integration-readiness-plan.md`
- `rbp_app/docs/phase3-backend-environment-validation.md`

Current validation baseline:
- Focused rbp_app unittest validation passed with 141 tests.
- Bench app validation on `rbp-minimal.localhost` passed with 173 rbp_app tests.
- `bench --site rbp-minimal.localhost migrate` passed.
- Generated bench artifacts from migrate/test runs must remain outside PR scope.

## Cross-Cutting Client Assumptions

- All endpoints are Frappe whitelisted methods callable through the standard Frappe RPC mechanism.
- All listed endpoints require an authenticated session unless a future endpoint explicitly says otherwise.
- `require_login()` rejects `Guest`; `require_system_manager()` requires Administrator or System Manager.
- Payload-bearing methods accept JSON strings or dict-like objects; frontend clients should send JSON objects and preserve backend field names exactly.
- Responses are plain backend serializer objects, not Frappe REST resource envelopes.
- Non-admin domain flows generally require a current tenant resolved for the user.
- System Manager/admin users bypass most tenant, owner, and assignment restrictions.
- List endpoints generally do not expose pagination yet; frontend lists should be designed to tolerate current bounded/unbounded backend behavior and future pagination.
- Audit writes are best-effort and only occur when `RBP Audit Log` exists.
- Notification writes are best-effort and only occur when `RBP Notification` exists.
- Generic file reference APIs reference existing Frappe `File` records; they do not upload file bytes.
- Entitlement checks currently have scaffold-safe behavior: if no entitlement rows exist, non-admin app access defaults to allowed.

## Membership / Onboarding

### Expected User / Client Flow

1. Authenticated user opens onboarding or plan selection.
2. Client calls `list_membership_plans()` to populate available public plans.
3. Client calls `get_my_onboarding()` to determine whether the user already has a flow.
4. If no flow exists, client calls `start_onboarding(plan_code, source_channel)`.
5. Client saves each step with `update_onboarding_step(flow_name, step_key, payload, status)`.
6. Client calls `submit_onboarding(flow_name)` when the user finishes.
7. Admin-only completion is handled outside member self-service through `admin_complete_onboarding(flow_name)`.

### API Endpoints Involved

- `rbp_app.api.membership.list_membership_plans()`
- `rbp_app.api.membership.get_my_onboarding()`
- `rbp_app.api.membership.start_onboarding(plan_code=None, source_channel="portal")`
- `rbp_app.api.membership.update_onboarding_step(flow_name, step_key, payload=None, status="Completed")`
- `rbp_app.api.membership.submit_onboarding(flow_name)`
- `rbp_app.api.membership.admin_complete_onboarding(flow_name)`

### Required Payloads

- `start_onboarding`: optional `plan_code`; optional `source_channel`, default `portal`.
- `update_onboarding_step`: required `flow_name`; required `step_key`; optional `payload` object stored as JSON; optional `status`, default `Completed`.
- `submit_onboarding`: required `flow_name`.
- `admin_complete_onboarding`: required `flow_name`; System Manager only.

### Expected Responses

- `list_membership_plans`: `{"plans": [plan rows], "count": number}`. Plan rows include `name`, `plan_code`, `plan_name`, `description`, `billing_cycle`, `amount`, `currency`, `included_apps`, `included_capabilities`, `is_public`, and `sort_order`.
- `get_my_onboarding`: `{"flow": flow object or null, "steps": [step rows]}`. Flow includes tenant, business profile, membership plan, subscription, status, current step key, source channel, and timestamps.
- `start_onboarding`: `{"name", "status", "current_step_key", "membership_plan"}`.
- `update_onboarding_step`: `{"name", "step_key", "status"}`.
- `submit_onboarding`: `{"name", "status", "submitted_on"}`.
- `admin_complete_onboarding`: `{"name", "status", "completed_on"}`.

### Auth / Session Assumptions

- Plan listing and member onboarding APIs require login.
- `admin_complete_onboarding` requires System Manager.
- Active onboarding start is idempotent for existing `Draft`, `In Progress`, or `Submitted` flows.

### Tenant Assumptions

- Membership plans are global/public records.
- Onboarding flows are user-scoped and may include tenant/business profile links.
- Non-admin users may act only on their own onboarding flow.

### Entitlement Assumptions

- Onboarding itself is not currently gated by entitlement APIs.
- Completion may later provision subscriptions or entitlements; that behavior is not part of the current handoff.

### Permission / Error Handling

- Treat unauthenticated access as a session failure and redirect to login.
- Treat owner mismatch as forbidden.
- `get_my_onboarding().flow === null` is a valid empty state, not an error.
- Empty plan list should render a no-plans state.

### Empty State Behavior

- If `list_membership_plans` returns `plans: []`, show that no plans are currently available and avoid starting onboarding without a selected/confirmed plan.
- If `get_my_onboarding` returns `flow: null`, show the onboarding start/plan-selection entry state.
- If `steps: []` is returned for an existing flow, render the current flow status and allow the client-owned step sequence to initialize from its configured first step.

### Audit Side Effects

- New flow: `onboarding_started`.
- Step save: `onboarding_step_updated`.
- Submit: `onboarding_submitted`.
- Admin completion: `onboarding_completed`.

### Notification Side Effects

- `submit_onboarding` creates an "Onboarding submitted" notification for the current user.
- `admin_complete_onboarding` creates an "Onboarding completed" notification for the flow owner.
- Listing plans, reading onboarding, and updating individual steps do not notify.

### Frontend Notes

- Store returned flow `name` as `flow_name`.
- Refresh onboarding after submit because status and timestamps change.
- Step payload schema is frontend-owned for now; backend stores it as JSON.
- Admin completion is not intended for the member-facing onboarding UI.

### Open Integration Questions

- Should unauthenticated marketing pages get a separate public plan endpoint?
- Should plan changes be supported after an active flow exists?
- What final step status values should frontend use for autosave or partial progress?
- Should admin/staff receive notifications when onboarding is submitted?
- Should completion provision subscriptions and entitlement rows in a later phase?

## Decision Desk

### Expected User / Client Flow

1. User opens Decision Desk and calls `list_my_requests(filters)` for the dashboard.
2. User creates a draft via `create_request(payload)`.
3. User edits the draft through `update_draft_request(request_name, payload)`.
4. User submits the request with `submit_request(request_name)`.
5. User reads status, details, and options with `get_request(request_name)`.
6. Admin assigns and updates workflow using admin endpoints.
7. Advisor/admin/allowed participant creates, updates, or deletes decision options.

### API Endpoints Involved

- `rbp_app.api.decision_desk.create_request(payload=None)`
- `rbp_app.api.decision_desk.update_draft_request(request_name, payload=None)`
- `rbp_app.api.decision_desk.submit_request(request_name)`
- `rbp_app.api.decision_desk.list_my_requests(filters=None)`
- `rbp_app.api.decision_desk.get_request(request_name)`
- `rbp_app.api.decision_desk.admin_assign_request(request_name, assigned_to)`
- `rbp_app.api.decision_desk.admin_update_status(request_name, status, payload=None)`
- `rbp_app.api.decision_desk.create_option(request_name, payload=None)`
- `rbp_app.api.decision_desk.update_option(option_name, payload=None)`
- `rbp_app.api.decision_desk.delete_option(option_name)`

### Required Payloads

- Request payload fields: `business_profile`, `title`, `category`, `summary`, `business_context`, `urgency`, `deadline`, `desired_outcome`, `constraints`, `source_channel`, `supporting_file_reference`, `notes`.
- List filters: optional `status`, `category`, `urgency`.
- Admin status values: `Draft`, `Submitted`, `In Review`, `Assigned`, `In Progress`, `Outcome Ready`, `Closed`, `Cancelled`.
- Admin status payload fields: `assigned_to`, `notes`, `supporting_file_reference`.
- Option payload fields: `option_label`, `option_summary`, `pros`, `cons`, `estimated_cost`, `risk_level`, `recommended`, `sort_order`, `notes`.

### Expected Responses

- Create/update/submit/get/admin status endpoints return a full request object with request fields and `options`.
- `list_my_requests`: `{"requests": [summary rows], "count": number}`.
- `create_option` and `update_option`: option object.
- `delete_option`: `{"deleted": true, "name": option_name}`.

### Auth / Session Assumptions

- Member/advisor endpoints require login.
- Assignment and admin status updates require System Manager.
- Service access allows admins, owners, and assigned users depending on operation.

### Tenant Assumptions

- Non-admin users must have a current tenant.
- Requests are tenant-scoped.
- Non-admin list/read access is limited to same-tenant records owned by or assigned to the user.
- Decision options inherit the parent request tenant.

### Entitlement Assumptions

- Frontend navigation should check `can_access_app("decision_desk")` or the agreed Decision Desk app key before launch.
- If entitlement rows do not exist, current scaffold behavior may allow access.

### Permission / Error Handling

- Owner can update only `Draft` requests.
- After submit, draft editing should be blocked in the client.
- Non-admin tenant mismatch should be shown as forbidden or unavailable.
- Admin status endpoint validates allowed statuses but does not enforce a strict transition matrix.

### Empty State Behavior

- If `list_my_requests` returns `requests: []`, show an empty Decision Desk dashboard with a create-request action.
- If filters return no rows, preserve the active filters and show a no-matching-requests state.
- If `get_request` returns an accessible request with `options: []`, show the request details and a pending/no-options-yet state rather than treating it as incomplete data.

### Audit Side Effects

- `decision_desk_request_created`
- `decision_desk_request_updated`
- `decision_desk_request_submitted`
- `decision_desk_request_assigned`
- `decision_desk_status_updated`
- `decision_desk_option_created`
- `decision_desk_option_updated`
- `decision_desk_option_deleted`

### Notification Side Effects

- Submission notifies owner and System Managers.
- Assignment notifies assignee.
- Status changes notify owner.
- `Outcome Ready` creates an additional high-priority success notification.
- Option mutations do not notify.

### Frontend Notes

- Defaults: request `status/workflow_state=Draft`, `urgency=Normal`, `source_channel=portal`; option `risk_level=Medium`, `recommended=0`, `sort_order=0`.
- Options are ordered by `sort_order asc, modified asc`.
- Supporting file references should be created through the Documents/file references flow before attaching the reference name.

### Open Integration Questions

- Which request fields are required in the client?
- What is the file upload/reference UX for supporting files?
- Who should receive admin notifications beyond System Manager users?
- Should pagination/search be added for the request list?
- Should customers be allowed to create or edit decision options?
- Should stricter status transitions be enforced?

## DocuShare

### Expected User / Client Flow

1. User opens DocuShare and lists folders/documents.
2. User creates folders with `create_folder(payload)`.
3. User creates a generic file reference for an existing Frappe `File`, then creates a DocuShare document with `create_document(payload)`.
4. User updates folders/documents they own.
5. User shares folders or documents with another user/email.
6. User revokes an active share when access should end.
7. Shared recipients see tenant-visible or explicitly shared records in list/detail endpoints.

### API Endpoints Involved

- `rbp_app.api.docushare.create_folder(payload=None)`
- `rbp_app.api.docushare.update_folder(folder_name, payload=None)`
- `rbp_app.api.docushare.list_folders(filters=None)`
- `rbp_app.api.docushare.get_folder(folder_name)`
- `rbp_app.api.docushare.create_document(payload=None)`
- `rbp_app.api.docushare.update_document(document_name, payload=None)`
- `rbp_app.api.docushare.list_documents(filters=None)`
- `rbp_app.api.docushare.get_document(document_name)`
- `rbp_app.api.docushare.share_folder(folder_name, payload=None)`
- `rbp_app.api.docushare.share_document(document_name, payload=None)`
- `rbp_app.api.docushare.revoke_share(share_name)`

### Required Payloads

- Folder payload fields: `folder_name`, `parent_folder`, `description`, `status`, `visibility`, `created_from`, `notes`.
- Folder filters: optional `status`, `visibility`, `parent_folder`.
- Document payload fields: `folder`, `title`, `description`, `file_reference`, `document_type`, `status`, `visibility`, `version`, `source_channel`, `notes`.
- Document filters: optional `status`, `visibility`, `folder`, `document_type`.
- Share payload fields: `share_target_user`, `share_target_email`, `access_level`, `expires_on`, `notes`.

### Expected Responses

- Folder endpoints return folder objects or `{"folders": [summary rows], "count": number}`.
- Document endpoints return document objects or `{"documents": [summary rows], "count": number}`.
- Share/revoke endpoints return share objects.

### Auth / Session Assumptions

- All endpoints require login.
- System Managers have broad access.
- Owners manage folders/documents and shares.
- Same-tenant users can access tenant-visible records.
- Explicit active share targets can access shared records.

### Tenant Assumptions

- Create operations require a current tenant.
- Folders, documents, and shares are tenant-scoped.
- Parent folders and file references must belong to the same tenant when present.
- Share records inherit parent folder/document tenant.

### Entitlement Assumptions

- Frontend navigation should check `can_access_app("docushare")` or the agreed DocuShare app key before launch.

### Permission / Error Handling

- Non-admin tenant mismatch should be treated as forbidden.
- Parent folder must be same-tenant and not archived.
- Owners/admins can archive by setting folder/document status.
- Active share revocation returns the share with `status=Revoked` and `revoked_on`.

### Empty State Behavior

- If `list_folders` returns `folders: []`, show an empty folder area with a create-folder action for users who can create folders.
- If `list_documents` returns `documents: []`, show an empty document area and direct the user to upload/select a file before creating a DocuShare document.
- If folder/document filters return no rows, show a filtered empty state and keep the filter controls visible.
- Because `get_folder` does not include children and `get_document` does not include shares, absence of child/share data on detail responses should not be treated as an error.

### Audit Side Effects

- `docushare_folder_created`
- `docushare_folder_updated`
- `docushare_document_created`
- `docushare_document_updated`
- `docushare_folder_shared`
- `docushare_document_shared`
- `docushare_share_revoked`

### Notification Side Effects

- Share operations notify the target user/email.
- Revoke operations notify the target user/email.
- Create, update, list, and get operations do not notify.

### Frontend Notes

- Visibility values: `Private`, `Tenant`, `Shared`.
- Folder statuses: `Active`, `Archived`.
- Document statuses: `Draft`, `Active`, `Archived`, `Deleted`.
- Defaults: folder `status=Active`, `visibility=Private`; document `status=Draft`, `visibility=Private`, `version=1`, `source_channel=portal`.
- List document rows include file reference ID but not expanded file metadata or file URL.
- `get_folder` does not include child folders/documents; `get_document` does not include active shares.

### Open Integration Questions

- Should folder names be unique within a parent?
- Should archived folders cascade to child folders/documents?
- Should folder detail include children for tree rendering?
- Should document detail include active shares for owners?
- Should folder sharing imply document access recursively?
- Should email-only shares send outbound email, portal notifications, or both?
- Should parent visibility return to `Private` when the last share is revoked?

## Marketplace

### Expected User / Client Flow

1. User opens Marketplace and lists vendors/listings.
2. Vendor user creates a vendor profile with `create_vendor(payload)`.
3. Vendor owner updates vendor profile and creates listings.
4. Buyer views active tenant/public listings and creates an order.
5. Buyer or vendor/admin tracks orders through list/detail endpoints.
6. Vendor owner/admin updates order workflow; buyer can cancel where allowed.

### API Endpoints Involved

- `rbp_app.api.marketplace.create_vendor(payload=None)`
- `rbp_app.api.marketplace.update_vendor(vendor_name, payload=None)`
- `rbp_app.api.marketplace.list_vendors(filters=None)`
- `rbp_app.api.marketplace.get_vendor(vendor_name)`
- `rbp_app.api.marketplace.create_listing(payload=None)`
- `rbp_app.api.marketplace.update_listing(listing_name, payload=None)`
- `rbp_app.api.marketplace.list_listings(filters=None)`
- `rbp_app.api.marketplace.get_listing(listing_name)`
- `rbp_app.api.marketplace.create_order(listing_name, payload=None)`
- `rbp_app.api.marketplace.update_order_status(order_name, status, payload=None)`
- `rbp_app.api.marketplace.list_my_orders(filters=None)`
- `rbp_app.api.marketplace.get_order(order_name)`

### Required Payloads

- Vendor payload fields: `vendor_name`, `description`, `contact_email`, `contact_phone`, `website`, `status`, `verification_status`, `notes`.
- Vendor filters: optional `status`, `verification_status`.
- Listing payload fields: required `vendor`; `title`, `category`, `description`, `price`, `currency`, `billing_model`, `status`, `visibility`, `notes`.
- Listing filters: optional `vendor`, `status`, `visibility`, `category`, `billing_model`.
- Order payload fields: `quantity`, `notes`.
- Order status values: `Requested`, `Approved`, `In Progress`, `Fulfilled`, `Cancelled`, `Rejected`.
- Order filters: optional `status`, `listing`, `vendor`.

### Expected Responses

- Vendor/listing/order create, update, get endpoints return the corresponding object.
- List endpoints return `{"vendors": [...]}`, `{"listings": [...]}`, or `{"orders": [...]}` with `count`.
- `create_order` returns an order object with calculated `total_amount`.

### Auth / Session Assumptions

- All methods require login.
- Vendor/listing management is allowed to vendor owners and admins.
- Order status management is allowed to admins/vendor owners; buyer cancellation is allowed.

### Tenant Assumptions

- Marketplace records are tenant-scoped.
- Non-admin users are filtered to current tenant.
- Listings are visible to owners, same-tenant users, and active tenant/public audiences under current service rules.
- Orders inherit tenant from the listing/vendor.

### Entitlement Assumptions

- Frontend navigation should check `can_access_app("marketplace")` or the agreed Marketplace app key before launch.

### Permission / Error Handling

- Suspended/archived vendors cannot receive new listings.
- Active listing and active vendor are required to create an order.
- Order status updates enforce a transition matrix.
- Private listings are owner/admin only.

### Empty State Behavior

- If `list_vendors` returns `vendors: []`, show an empty vendor directory and expose vendor setup only where the user should be able to create a profile.
- If `list_listings` returns `listings: []`, show an empty catalog state; for vendor owners, provide a create-listing path after a vendor exists.
- If `list_my_orders` returns `orders: []`, show an empty orders state with a path back to visible listings.
- If vendor/listing filters produce no results, show a no-matching-results state and preserve filters.

### Audit Side Effects

- `marketplace_vendor_created`
- `marketplace_vendor_updated`
- `marketplace_listing_created`
- `marketplace_listing_updated`
- `marketplace_order_created`
- `marketplace_order_status_updated`

### Notification Side Effects

- Vendor creation notifies creator.
- Listing creation notifies vendor owner.
- Order creation sends high-priority notification to vendor owner.
- Order status updates notify buyer and vendor owner.

### Frontend Notes

- Defaults: vendor `status=Draft`, `verification_status=Unverified`; listing `status=Draft`, `visibility=Private`, `currency=AUD`, `billing_model=One-off`; order `quantity=1`.
- Listing visibility values: `Private`, `Tenant`, `Public`.
- Billing models: `One-off`, `Recurring`, `Quote`.
- Vendor/listing/order detail endpoints do not expand related records by default.

### Open Integration Questions

- Who owns vendor approval and verification?
- Can non-admin vendors self-activate vendors or listings?
- Should marketplace discovery cross tenant boundaries?
- Should `Public` listings be globally visible or tenant-only for this implementation?
- What payment/billing handoff is required after order approval or fulfillment?
- Do order detail screens need listing/vendor snapshots?
- Which catalog search, filter, sort, and pagination features are required?

## Connectivity

### Expected User / Client Flow

1. User creates a draft connectivity request with service/location details.
2. User edits draft until ready and submits it.
3. Admin assigns the request and manages workflow.
4. Admin/assigned advisor manages providers and creates quotes.
5. Presented quotes become visible to the owner.
6. Owner accepts a quote, moving the request toward approved/provisioning flow.

### API Endpoints Involved

- `rbp_app.api.connectivity.create_request(payload=None)`
- `rbp_app.api.connectivity.update_draft_request(request_name, payload=None)`
- `rbp_app.api.connectivity.submit_request(request_name)`
- `rbp_app.api.connectivity.list_my_requests(filters=None)`
- `rbp_app.api.connectivity.get_request(request_name)`
- `rbp_app.api.connectivity.admin_assign_request(request_name, assigned_to)`
- `rbp_app.api.connectivity.admin_update_status(request_name, status, payload=None)`
- `rbp_app.api.connectivity.create_provider(payload=None)`
- `rbp_app.api.connectivity.update_provider(provider_name, payload=None)`
- `rbp_app.api.connectivity.list_providers(filters=None)`
- `rbp_app.api.connectivity.create_quote(request_name, payload=None)`
- `rbp_app.api.connectivity.update_quote(quote_name, payload=None)`
- `rbp_app.api.connectivity.accept_quote(quote_name)`

### Required Payloads

- Request payload fields: `business_profile`, `location_name`, `address_line_1`, `address_line_2`, `suburb`, `state`, `postcode`, `service_type`, `current_provider`, `current_plan`, `desired_speed`, `budget`, `notes`.
- Request filters: optional `status`, `assigned_to`, `service_type`.
- Admin status values: `Draft`, `Submitted`, `In Review`, `Quoted`, `Approved`, `In Progress`, `Completed`, `Cancelled`.
- Admin status payload fields: `assigned_to`, `notes`.
- Provider payload fields: optional `tenant`; `provider_name`, `contact_email`, `contact_phone`, `website`, `service_regions`, `service_types`, `status`, `notes`.
- Provider filters: optional `status`, `service_regions`, `service_types`.
- Quote payload fields: `provider`, `quote_title`, `speed_down`, `speed_up`, `monthly_cost`, `setup_cost`, `contract_months`, `status`, `recommended`, `notes`.

### Expected Responses

- Request create/update/submit/get/admin endpoints return a request object with `quotes`.
- `list_my_requests`: `{"requests": [summary rows], "count": number}`.
- Provider endpoints return provider objects or `{"providers": [summary rows], "count": number}`.
- Quote endpoints return quote objects.

### Auth / Session Assumptions

- Customer/advisor endpoints require login.
- Admin request/provider endpoints require System Manager.
- Quote creation/update is available to admins and assigned users.
- Quote acceptance is available to the request owner or admin.

### Tenant Assumptions

- Requests, providers, and quotes are tenant-scoped.
- Non-admin users require a current tenant and are limited to owned, assigned, or current-tenant records.
- Provider and quote tenant must align with the request tenant.

### Entitlement Assumptions

- Frontend navigation should check `can_access_app("connectivity")` or the agreed Connectivity app key before launch.

### Permission / Error Handling

- Only draft requests can be edited by owner.
- Admin status updates enforce a transition matrix.
- Provider status controls visibility and quote eligibility.
- Non-admin tenant mismatch should be shown as forbidden or unavailable.

### Empty State Behavior

- If `list_my_requests` returns `requests: []`, show an empty connectivity dashboard with a create-request action.
- If `list_providers` returns `providers: []`, hide provider pickers for customer flows and show an admin/provider setup state for System Manager views.
- If `get_request` returns `quotes: []`, show request status and a no-quotes-yet state.
- If filters return no rows, keep filters visible and show a no-matching-connectivity-requests state.

### Audit Side Effects

- `connectivity_request_created`
- `connectivity_request_updated`
- `connectivity_request_submitted`
- `connectivity_request_assigned`
- `connectivity_status_updated`
- `connectivity_provider_created`
- `connectivity_provider_updated`
- `connectivity_quote_created`
- `connectivity_quote_updated`
- `connectivity_quote_accepted`

### Notification Side Effects

- Request submit notifies owner and admins.
- Assignment notifies assignee with high priority.
- Status updates notify owner and assignee.
- Presented quotes notify owner.
- Accepted quotes notify owner and assignee if present.

### Frontend Notes

- Defaults: request `Draft`; provider `status=Active`; quote `status=Draft`, `recommended=0`.
- Submitted requests should lock draft fields.
- Quotes are ordered by modified descending.
- Quote status `Presented` moves request to `Quoted`.
- Accepted quote moves request to `Approved`.

### Open Integration Questions

- Which address and service fields are required?
- Should providers be tenant-specific or global?
- How should multi-value region/type search behave?
- Should draft quotes be hidden from customers?
- Is quote revision/versioning needed?
- What downstream provisioning/order workflow starts after quote acceptance?
- Who can mark connectivity requests completed outside System Manager?

## Risk Advisor

### Expected User / Client Flow

1. User creates a draft risk assessment.
2. User edits draft details and submits for review.
3. Admin assigns assessment and manages review status.
4. Admin/assignee/allowed participant creates risks and mitigation actions.
5. User tracks assessment status, risks, and actions.
6. Assigned users complete mitigation actions.

### API Endpoints Involved

- `rbp_app.api.risk_advisor.create_assessment(payload=None)`
- `rbp_app.api.risk_advisor.update_draft_assessment(assessment_name, payload=None)`
- `rbp_app.api.risk_advisor.submit_assessment(assessment_name)`
- `rbp_app.api.risk_advisor.list_my_assessments(filters=None)`
- `rbp_app.api.risk_advisor.get_assessment(assessment_name)`
- `rbp_app.api.risk_advisor.admin_assign_assessment(assessment_name, assigned_to)`
- `rbp_app.api.risk_advisor.admin_update_assessment_status(assessment_name, status, payload=None)`
- `rbp_app.api.risk_advisor.create_risk(assessment_name, payload=None)`
- `rbp_app.api.risk_advisor.update_risk(risk_name, payload=None)`
- `rbp_app.api.risk_advisor.create_action(risk_name, payload=None)`
- `rbp_app.api.risk_advisor.update_action(action_name, payload=None)`
- `rbp_app.api.risk_advisor.complete_action(action_name)`

### Required Payloads

- Assessment payload fields: `business_profile`, `title`, `assessment_type`, `business_area`, `summary`, `notes`.
- Assessment filters: optional `status`, `assessment_type`, `business_area`, `risk_level`.
- Assessment status values: `Draft`, `Submitted`, `In Review`, `Reviewed`, `Closed`, `Cancelled`.
- Assessment status payload fields: `assigned_to`, `notes`, `risk_score`, `risk_level`.
- Risk payload fields: `title`, `category`, `description`, `likelihood`, `impact`, `status`, `owner_user`, `notes`.
- Action payload fields: `title`, `description`, `priority`, `status`, `assigned_to`, `due_date`, `notes`.

### Expected Responses

- Assessment create/update/submit/get/admin endpoints return an assessment object with `risks` and `actions`.
- `list_my_assessments`: `{"assessments": [summary rows], "count": number}`.
- Risk endpoints return risk objects.
- Action endpoints return action objects; `complete_action` returns an action object with `Completed` and `completed_on`.

### Auth / Session Assumptions

- All endpoints require login.
- Assignment/status endpoints require System Manager.
- Assessment access is admin, owner, or assignee.
- Risk/action mutation is allowed for admin, assessment owner, or assignee.

### Tenant Assumptions

- Assessments, risks, and actions are tenant-scoped.
- Non-admin users require a current tenant and only access owned/assigned assessments.
- Risks and actions inherit tenant through their parent assessment.

### Entitlement Assumptions

- Frontend navigation should check `can_access_app("risk_advisor")` or the agreed Risk Advisor app key before launch.

### Permission / Error Handling

- Owner can update only draft assessments.
- Submit enforces `Draft -> Submitted`.
- Admin assessment status updates enforce a transition matrix.
- Risk status transitions are not currently constrained beyond allowed values.
- Repeated `complete_action` calls reset `completed_on`; frontend should avoid duplicate submits.

### Empty State Behavior

- If `list_my_assessments` returns `assessments: []`, show an empty Risk Advisor dashboard with a create-assessment action.
- If `get_assessment` returns `risks: []`, show the assessment details with a no-risks-identified state.
- If `get_assessment` returns `actions: []`, show a no-actions state rather than hiding the assessment workflow.
- If filters return no rows, preserve filter selections and show a no-matching-assessments state.

### Audit Side Effects

- `risk_advisor_assessment_created`
- `risk_advisor_assessment_updated`
- `risk_advisor_assessment_submitted`
- `risk_advisor_assessment_assigned`
- `risk_advisor_assessment_status_updated`
- `risk_advisor_risk_created`
- `risk_advisor_risk_updated`
- `risk_advisor_action_created`
- `risk_advisor_action_updated`
- `risk_advisor_action_completed`

### Notification Side Effects

- Submit notifies owner and admins.
- Assignment notifies assignee with high priority.
- Assessment status changes notify owner.
- Risk creation notifies assessment owner.
- Action assignment and completion notify relevant users.
- Action assignee changes notify the new assignee.

### Frontend Notes

- Defaults: assessment `assessment_type=General`, `risk_score=0`, `risk_level=Low`; risk `likelihood=1`, `impact=1`, `status=Open`; action `priority=Normal`, `status=Open`.
- Risk score is `likelihood * impact`.
- Risk level is `Critical >=20`, `High >=12`, `Medium >=5`, otherwise `Low`.
- Actions are listed across the assessment, not only under each risk.

### Open Integration Questions

- Which assessment intake fields are required?
- Should admin-supplied risk score/level override derived risk rollups?
- Can customers create risks after submission?
- Can external customers assign actions to internal users?
- Should action and risk status transitions be constrained?
- Should repeated completion preserve the original `completed_on` timestamp?
- Can customers see internal action details?

## The Fixer

### Expected User / Client Flow

1. User creates a draft case, optionally from a related cross-app record.
2. User edits draft and submits for triage.
3. Admin assigns case and updates workflow.
4. Assigned internal user creates tasks and case updates.
5. Customer views customer-visible updates and status changes.
6. Internal user completes tasks and resolves the case.

### API Endpoints Involved

- `rbp_app.api.the_fixer.create_case(payload=None)`
- `rbp_app.api.the_fixer.update_draft_case(case_name, payload=None)`
- `rbp_app.api.the_fixer.submit_case(case_name)`
- `rbp_app.api.the_fixer.list_my_cases(filters=None)`
- `rbp_app.api.the_fixer.get_case(case_name)`
- `rbp_app.api.the_fixer.admin_assign_case(case_name, assigned_to)`
- `rbp_app.api.the_fixer.admin_update_case_status(case_name, status, payload=None)`
- `rbp_app.api.the_fixer.create_task(case_name, payload=None)`
- `rbp_app.api.the_fixer.update_task(task_name, payload=None)`
- `rbp_app.api.the_fixer.complete_task(task_name)`
- `rbp_app.api.the_fixer.add_case_update(case_name, payload=None)`
- `rbp_app.api.the_fixer.list_case_updates(case_name, filters=None)`

### Required Payloads

- Case payload fields: `business_profile`, `title`, `category`, `issue_summary`, `issue_details`, `urgency`, `impact`, `source_channel`, `related_decision_request`, `related_docushare_document`, `related_marketplace_order`, `related_connectivity_request`, `related_risk_assessment`, `notes`.
- Case filters: optional `status`, `category`, `urgency`, `impact`.
- Case status values: `Draft`, `Submitted`, `Triage`, `Assigned`, `In Progress`, `Waiting on Customer`, `Resolved`, `Closed`, `Cancelled`.
- Case status payload fields: `assigned_to`, `notes`, and related record references.
- Task payload fields: `title`, `description`, `priority`, `status`, `assigned_to`, `due_date`, `notes`.
- Update payload fields: `update_type`, `message`, `visible_to_customer`, `notes`.
- Update filters: optional `update_type`.

### Expected Responses

- Case create/update/submit/get/admin endpoints return a case object with `tasks` and `updates`.
- `list_my_cases`: `{"cases": [summary rows], "count": number}`.
- Task endpoints return task objects.
- `add_case_update` returns an update object.
- `list_case_updates`: `{"updates": [rows], "count": number}`.

### Auth / Session Assumptions

- All endpoints require login.
- Assignment/status endpoints require System Manager.
- Case access is admin, owner, or assignee.
- Task creation/update/completion and internal updates require admin or assigned user.

### Tenant Assumptions

- Cases, tasks, and updates are tenant-scoped.
- Related records must be same-tenant when present.
- Tasks and updates inherit parent case tenant.

### Entitlement Assumptions

- Frontend navigation should check `can_access_app("the_fixer")` or the agreed Fixer app key before launch.

### Permission / Error Handling

- Owners can update only draft cases.
- Admin status updates enforce a transition matrix.
- Owners see only customer-visible updates; assigned users/admins see internal updates.
- Task status constants exist, but service does not currently enforce all task status values.
- Repeated `complete_task` calls reset `completed_on`; frontend should avoid duplicate submits.

### Empty State Behavior

- If `list_my_cases` returns `cases: []`, show an empty Fixer dashboard with a create-case action.
- If `get_case` returns `tasks: []`, show the case details with no internal/customer task content as appropriate for the viewer role.
- If `get_case` or `list_case_updates` returns `updates: []`, show a no-updates-yet timeline state.
- If filters return no rows, preserve filter selections and show a no-matching-cases state.

### Audit Side Effects

- `fixer_case_created`
- `fixer_case_updated`
- `fixer_case_submitted`
- `fixer_case_assigned`
- `fixer_case_status_updated`
- `fixer_task_created`
- `fixer_task_updated`
- `fixer_task_completed`
- `fixer_update_added`

### Notification Side Effects

- Submit notifies owner and admins.
- Assignment notifies assignee with high priority.
- Task assignment notifies assignee.
- Customer-visible updates notify owner.
- Status changes notify owner, with extra success notification when resolved.
- Task completion notifies case owner.

### Frontend Notes

- Defaults: case `urgency=Medium`, `impact=Medium`, `source_channel=portal`, `status=Draft`; task `status=Open`, `priority=Medium`.
- Update types: `Internal Note`, `Customer Update`, `Status Change`, `Resolution Note`.
- Cross-app launch points can pass related Decision Desk, DocuShare, Marketplace, Connectivity, or Risk Advisor references.
- `get_case` includes visible updates based on role; `list_case_updates` applies the same visibility rule.

### Open Integration Questions

- Which case intake fields are required?
- Should customers edit cases after submission?
- Should customers see task lists?
- Can assignees update status without System Manager?
- Should customers be allowed to add visible updates?
- Is pagination needed for long-running case updates?
- Should task completion preserve the original completion timestamp?

## Notifications

### Expected User / Client Flow

1. Authenticated user opens portal shell or notification drawer.
2. Client calls `get_notifications()` for latest notifications and unread count.
3. User marks a single notification read with `mark_notification_read(name)`.
4. User marks all current unread notifications read with `mark_all_notifications_read()`.

### API Endpoints Involved

- `rbp_app.api.notifications.get_notifications()`
- `rbp_app.api.notifications.mark_notification_read(name)`
- `rbp_app.api.notifications.mark_all_notifications_read()`

### Required Payloads

- `get_notifications`: no payload.
- `mark_notification_read`: required notification `name`.
- `mark_all_notifications_read`: no payload.

### Expected Responses

- `get_notifications`: `{"notifications": [rows], "unread_count": number}`.
- Notification rows include title, message, type, priority, channel, route, related record, trigger source, workflow, status, read fields, and modified timestamp.
- `mark_notification_read`: `{"name", "is_read", "status", "read_on"}`.
- `mark_all_notifications_read`: `{"updated": number}`.

### Auth / Session Assumptions

- All notification endpoints require login.
- A user may mark only their own notification read unless admin.

### Tenant Assumptions

- Notifications are user-scoped.
- There is no explicit tenant filter in `get_notifications`.
- Notification creation attempts to infer tenant from the recipient when tenant is not supplied.

### Entitlement Assumptions

- Notification drawer should remain available to authenticated users regardless of app-specific entitlements.
- Individual notification routes may lead to app screens that should still enforce app entitlement/client gating.

### Permission / Error Handling

- Treat unknown or inaccessible notification names as not found/forbidden.
- Mark-all updates unread, non-archived notifications for the current user.
- Archived notification read behavior is an open question.

### Empty State Behavior

- If `get_notifications` returns `notifications: []`, show an empty notification drawer/state with `unread_count` treated as zero.
- If all returned rows have `is_read=1` or `unread_count=0`, show the normal notification list without unread badges.
- If a notification route points to an inaccessible app or record, fall back to the app shell/notification list and show the app-specific denied or unavailable state.

### Audit Side Effects

- These read/update endpoints do not create audit records.
- Notification creation elsewhere records `notification_created`.

### Notification Side Effects

- These endpoints do not emit secondary notifications.

### Frontend Notes

- `get_notifications` returns up to 20 notifications, ordered unread first then modified descending.
- Use `route` when present for click-through navigation.
- Consider optimistic UI for read state, followed by response reconciliation.

### Open Integration Questions

- Is pagination/load-more required?
- Should notification APIs filter by current tenant?
- Can archived notifications be marked read?
- Should routes be normalized across modules before frontend launch?

## Entitlements

### Expected User / Client Flow

1. Authenticated portal shell loads current entitlement rows with `get_my_entitlements()`.
2. Client checks each app launch/navigation gate with `can_access_app(app_key)`.
3. If access is denied, client hides the app, disables launch, or shows the agreed upgrade/permission message.
4. Admin users should be treated as allowed by the entitlement service.

### API Endpoints Involved

- `rbp_app.api.entitlements.get_my_entitlements()`
- `rbp_app.api.entitlements.can_access_app(app_key)`

### Required Payloads

- `get_my_entitlements`: no payload.
- `can_access_app`: required `app_key`.

### Expected Responses

- `get_my_entitlements`: `{"entitlements": [rows]}`.
- Entitlement rows include `name`, `tenant`, `user`, `app_key`, `app_label`, `entitlement_type`, `status`, `enabled`, `roles_allowed`, `starts_on`, `ends_on`, and `source_subscription`.
- `can_access_app`: `{"app_key": app_key, "can_access": boolean}`.

### Auth / Session Assumptions

- All endpoints require login.
- System Manager/admin users return allowed for app access.

### Tenant Assumptions

- Entitlement rows can be user-specific, tenant-specific, role-specific, date-windowed, active, and enabled.
- Non-admin rows are filtered by current tenant, user, roles, and date window.

### Entitlement Assumptions

- App keys are normalized to lowercase in service checks.
- If no entitlement records exist, non-admin users currently default to allowed.
- Once entitlement records exist, only matching active user entitlements allow access.

### Permission / Error Handling

- Empty `entitlements` does not necessarily mean deny while scaffold-safe fallback remains active.
- Use `can_access_app(app_key)` for the final allow/deny decision.
- Multi-tenant admin response scope needs confirmation before exposing all returned rows in UI.

### Empty State Behavior

- If `get_my_entitlements` returns `entitlements: []`, keep app gating driven by `can_access_app(app_key)` because scaffold-safe behavior may still allow access.
- If `can_access_app` returns `can_access: false`, show the agreed denied/upgrade/contact-support state for that app and do not launch the protected flow.
- If entitlement rows exist but no rows match a visible app, avoid presenting raw entitlement internals to the user; use app-level access states instead.

### Audit Side Effects

- None.

### Notification Side Effects

- None.

### Frontend Notes

- Use entitlement checks for app launch/navigation, not as the only server-side protection.
- Keep denied-state copy generic until subscription/upgrade flows are finalized.
- Cache carefully; role, tenant, and date-window changes can affect access.

### Open Integration Questions

- What are the final app key strings for each Phase 3 app?
- When should scaffold-safe "no rows means allow" behavior be removed or feature-flagged?
- Should admin `get_my_entitlements` response be narrowed for multi-tenant UI?
- What upgrade/contact-support flow should users see when access is denied?

## Documents / File References

### Expected User / Client Flow

1. User uploads or selects a file through the existing Frappe file flow, producing a `File` record.
2. Client calls `attach_file_reference(payload)` to create an RBP file reference for that existing file.
3. Client stores the returned file reference `name`.
4. Client passes that reference into domain flows such as DocuShare document creation or Decision Desk supporting files.
5. User can list available file references with `get_documents()`.

### API Endpoints Involved

- `rbp_app.api.documents.get_documents()`
- `rbp_app.api.documents.attach_file_reference(payload=None)`

### Required Payloads

- `get_documents`: no payload.
- `attach_file_reference`: required `file`; optional `tenant`, `related_doctype`, `related_name`, `visibility`, `file_type`, `notes`.

### Expected Responses

- `get_documents`: `{"documents": [file reference rows], "count": number, "module_enabled": true}`.
- File reference rows include `name`, `tenant`, `owner_user`, `related_doctype`, `related_name`, `file`, `file_type`, `visibility`, `uploaded_by`, `uploaded_on`, `status`, and `modified`.
- `attach_file_reference`: `{"name", "file", "related_doctype", "related_name", "visibility", "status"}`.

### Auth / Session Assumptions

- All endpoints require login.
- The module references existing Frappe `File` records and does not upload file bytes.

### Tenant Assumptions

- Generic file references use current tenant when available.
- Non-admin listing is tenant-filtered when the user has a tenant, otherwise owner-filtered.
- Admin sees all non-archived references.
- `attach_file_reference` uses tenant from payload or current tenant.

### Entitlement Assumptions

- Documents/file references are shared infrastructure.
- Domain app entitlement should gate the app flow that consumes the reference.

### Permission / Error Handling

- Missing file is invalid for `attach_file_reference`.
- Cross-tenant related record validation is not fully enforced by the generic attachment endpoint; frontend should avoid sending mismatched related records.
- If no references exist, show an empty document/file-reference state.

### Empty State Behavior

- If `get_documents` returns `documents: []`, show an empty file-reference picker/library state and direct the user to the existing Frappe file upload/select flow.
- If a consuming domain flow expects a file reference but none exists, keep the domain form in a draft/select-file state until `attach_file_reference` succeeds.
- If `module_enabled` is not true in a future response shape, treat the document reference feature as unavailable and avoid showing attach actions.

### Audit Side Effects

- `attach_file_reference` records `file_reference_created`.
- `get_documents` has no audit side effects.

### Notification Side Effects

- None.

### Frontend Notes

- Default visibility is `Private To Owner`; allowed visibility values are governed by DocType/service consumers.
- `get_documents` returns up to 100 rows, sorted by modified descending.
- No filter args are exposed by the current wrapper.
- DocuShare document rows include the file reference ID, not expanded file metadata or file URL.

### Open Integration Questions

- Which related doctypes are allowed for generic file references?
- Should `attach_file_reference` validate related record tenancy?
- Do clients need filters, pagination, search, or related-record lookup for file references?
- Should the API expand file URLs or file metadata for frontend consumption?
- What is the final file upload UX before `attach_file_reference` is called?

## QA / UAT Entry Checklist

- Documentation-only changes only.
- No backend code changes.
- No frontend code changes.
- No Frappe core changes.
- No `start/apps/*` changes.
- No `start/sites/*` generated artifacts.
- Redis services are running before full bench validation.
- `bench --site rbp-minimal.localhost migrate` can run in an aligned environment.
- Focused rbp_app unittest suite still passes.
- Full `bench --site rbp-minimal.localhost run-tests --app rbp_app` can be attempted in an aligned environment.
- Mail submodule compatibility remains checked if full bench tests are run.

## API Response Contract Decision

Phase 5 frontend integration will use the existing raw dictionary / serialized DocType response contract.

The backend will not introduce a global `{ ok, data, errors, meta }` envelope during Phase 3 closeout or at the start of Phase 5.

### Successful Responses

Successful API responses will continue to return plain dictionaries, lists, or serialized document payloads.

Product create, get, update, submit, assign, and status methods return the service serializer response for the affected record or workflow action.

List methods return dictionaries using the existing module-specific response shape, for example:

```json
{
  "requests": [],
  "count": 0
}
```

```json
{
  "notifications": [],
  "unread_count": 0
}
```

```json
{
  "documents": [],
  "count": 0
}
```

### Error Handling

Error behaviour will continue to use Frappe exceptions and standard Frappe HTTP/API method handling.

Expected error sources:

- Authentication failures raise Frappe permission errors.
- Permission failures raise Frappe permission errors.
- Validation failures raise Frappe validation errors.
- Missing records raise Frappe missing-record errors.

### Rationale

- Current APIs already return service-level dictionaries and serialized payloads.
- Current tests validate the existing response shapes.
- The API smoke test plan asserts current raw dictionary payloads unless a future contract change is explicitly approved.
- Avoiding an envelope refactor reduces risk before frontend integration.
- A mixed model, where some APIs use envelopes and others return raw payloads, would create avoidable frontend integration ambiguity.

### Future Consideration

A standard response envelope may be introduced later if external API clients, API gateway integration, or frontend error normalization require it.

That should be handled as a deliberate API contract migration, not as an incidental Phase 3 cleanup task.

## The Fixer API Naming Decision

`rbp_app.api.the_fixer` is the canonical Phase 3 backend API module for The Fixer.

No `rbp_app.api.fixer` alias will be added during Phase 3 closeout.

### Decision

Frontend and integration clients should call:

```text
rbp_app.api.the_fixer
```

The backend will not introduce a second `rbp_app.api.fixer` module unless a future integration layer explicitly requires backward compatibility.

### Rationale

- The implemented API module is already `rbp_app.api.the_fixer`.
- The implemented service module is already `rbp_app.services.the_fixer`.
- The focused backend tests validate the existing `the_fixer` naming.
- Adding a `fixer` alias now would create two valid endpoint paths for the same backend capability.
- Duplicate API names increase integration ambiguity without adding Phase 3 value.

### Phase 5 Integration Note

Phase 5 frontend/backend integration should treat `rbp_app.api.the_fixer` as canonical.

If a shorter `/fixer` frontend route is desired, it should be handled at the frontend route layer, not by duplicating backend API module names.

## Entitlement Gating Policy Decision

Phase 3 confirms that app entitlement modelling, entitlement APIs, and app launcher visibility are implemented.

The backend will not retrofit hard entitlement gates across every product service during Phase 3 closeout.

### Decision

For Phase 5 frontend/backend integration:

- App discovery and app launcher visibility should use `RBP App Entitlement`.
- Frontend clients should use entitlement APIs to determine visible and accessible modules.
- Product APIs will continue to rely on authenticated access, tenant ownership, record ownership, assigned-user access, and admin checks.
- Product APIs will not be globally blocked by app entitlement checks during Phase 3 closeout.
- Hard service-level entitlement enforcement may be added later as a deliberate launch-hardening task.

### Current Behaviour

Current entitlement behaviour supports:

- Tenant-level entitlements
- User-level entitlements
- Role-scoped entitlement metadata
- Subscription-linked entitlement metadata
- Enabled/disabled entitlement states
- Start and end date windows
- App launcher visibility

Current product services enforce:

- Authentication
- Tenant ownership
- Owner access
- Assigned-user access where applicable
- System Manager / Administrator access for admin operations
- Product-specific workflow and status rules

### Rationale

- Entitlement records and app discovery are already implemented.
- Current backend tests validate tenant, owner, assigned-user, and admin access paths.
- Retrofitting hard entitlement checks into every product service would be a backend behaviour change, not a documentation cleanup.
- Phase 5 can safely integrate against entitlement-aware app discovery while backend service-level entitlement enforcement remains a documented launch-hardening decision.
- This avoids introducing late Phase 3 regressions in already validated product flows.

### Phase 5 Integration Note

Phase 5 frontend/backend integration should:

- Read available apps from the app discovery APIs.
- Hide or disable modules the current user is not entitled to access.
- Treat backend permission errors as authoritative if a user attempts unsupported access.
- Avoid assuming that frontend visibility alone is a security boundary.

### Future Hardening Option

Before production launch, the project may add explicit service-level entitlement gates for selected product APIs.

If implemented, the change should include:

- A shared entitlement enforcement helper
- Product-level app key mapping
- Negative entitlement tests for every gated product module
- Clear admin bypass rules
- Updated API smoke tests
- Updated frontend/API handoff documentation
## Milestone 10 Service Persistence Handoff

Use these backend methods for persisted portal service submissions and activity:

- Decision Desk: `rbp_app.api.decision_desk.create_request`, `rbp_app.api.decision_desk.submit_request`, `rbp_app.api.decision_desk.list_my_requests`, `rbp_app.api.decision_desk.get_request`
- DocuShare: `rbp_app.api.docushare.create_brief`, `rbp_app.api.docushare.list_my_briefs`, `rbp_app.api.docushare.get_brief`
- Connectivity: `rbp_app.api.connectivity.create_order`, `rbp_app.api.connectivity.list_my_orders`, `rbp_app.api.connectivity.get_order`
- Risk Advisor: `rbp_app.api.risk_advisor.create_assessment`, `rbp_app.api.risk_advisor.list_my_assessments`, `rbp_app.api.risk_advisor.get_assessment`
- The Fixer: `rbp_app.api.the_fixer.create_request`, `rbp_app.api.the_fixer.list_my_requests`, `rbp_app.api.the_fixer.get_request`
- Marketplace: `rbp_app.api.marketplace.create_listing`, `rbp_app.api.marketplace.create_enquiry`, `rbp_app.api.marketplace.list_my_orders`, `rbp_app.api.marketplace.get_order`
- Portal: `rbp_app.api.portal.get_my_service_activity`
