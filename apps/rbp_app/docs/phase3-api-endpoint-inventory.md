# Phase 3 API Endpoint Inventory

Repository:
info-rbp/frappe-project

App:
rbp_app

Branch:
phase3/api-endpoint-inventory

Scope:
Documentation only. Do not implement backend code, frontend code, QA automation, launch changes, repo consolidation, Frappe core edits, generated bench artifacts, or custom admin backend work.

Purpose:
Create a concrete API endpoint inventory and integration handoff map for Phase 3 backend modules.

Current backend state:
- Platform foundation merged
- Membership/onboarding merged
- Decision Desk backend merged
- DocuShare backend merged
- Marketplace backend merged
- Connectivity backend merged
- Risk Advisor backend merged
- The Fixer backend merged
- Backend hardening validation merged
- Integration readiness plan merged

Current focused backend validation:
- 141 tests passing

Inventory format:
For each endpoint, document:
- API module
- whitelisted method
- service method called
- purpose
- expected payload
- expected response shape
- permission model
- tenant assumptions
- audit behavior
- notification behavior
- frontend/client consumer notes
- open integration questions

API modules to inventory:
- rbp_app.api.membership
- rbp_app.api.decision_desk
- rbp_app.api.docushare
- rbp_app.api.marketplace
- rbp_app.api.connectivity
- rbp_app.api.risk_advisor
- rbp_app.api.the_fixer
- rbp_app.api.notifications
- rbp_app.api.entitlements
- rbp_app.api.documents

## Membership / Onboarding

Module: `rbp_app.api.membership`

Shared behavior:
- Payload coercion: JSON string payloads are decoded; dict-like payloads are copied.
- Permission model: every method requires an authenticated user through `require_login()`, except `admin_complete_onboarding`, which requires `require_system_manager()`.
- Tenant assumptions: membership plans are global/public records; onboarding flow and step records are user-scoped and may carry tenant/business profile links from their DocTypes. Non-admin users may only act on their own onboarding flow.
- Audit behavior: service methods record `onboarding_started`, `onboarding_step_updated`, `onboarding_submitted`, and `onboarding_completed` audit events where applicable.
- Notification behavior: submit creates an "Onboarding submitted" notification for the current user; admin completion creates an "Onboarding completed" notification for the flow owner. Listing plans, reading onboarding, and updating individual steps do not create notifications.

### `list_membership_plans`

- API module: `rbp_app.api.membership`
- Whitelisted method: `list_membership_plans()`
- Service method called: `rbp_app.services.membership.list_membership_plans(user=user, public_only=True)`
- Purpose: return active public membership plans for plan selection.
- Expected payload or arguments: none.
- Expected response shape: `{"plans": [plan rows], "count": number}`. Plan rows include `name`, `plan_code`, `plan_name`, `description`, `billing_cycle`, `amount`, `currency`, `included_apps`, `included_capabilities`, `is_public`, and `sort_order`.
- Permission model: authenticated user required.
- Tenant assumptions: no current tenant is required by the service for listing plans.
- Audit behavior: none.
- Notification behavior: none.
- Frontend/client notes: use as the source for plan pickers; handle empty `plans` when the DocType is not installed.
- Open integration questions: confirm whether unauthenticated marketing pages should eventually get a separate public plan endpoint.

### `start_onboarding`

- API module: `rbp_app.api.membership`
- Whitelisted method: `start_onboarding(plan_code=None, source_channel="portal")`
- Service method called: `rbp_app.services.membership.start_onboarding(user=user, plan_code=plan_code, source_channel=source_channel)`
- Purpose: create or return the current user's active onboarding flow.
- Expected payload or arguments: `plan_code` optional; `source_channel` optional, defaulting to `portal`.
- Expected response shape: `{"name", "status", "current_step_key", "membership_plan"}`.
- Permission model: authenticated user required.
- Tenant assumptions: flow is linked to the current user; selected membership plan is resolved by lowercase `plan_code` when supplied.
- Audit behavior: creates `onboarding_started` when a new flow is inserted; returning an existing active flow does not add a new audit event.
- Notification behavior: none.
- Frontend/client notes: idempotent for active `Draft`, `In Progress`, or `Submitted` flows; clients should store `name` as `flow_name` for subsequent step updates/submission.
- Open integration questions: confirm whether plan changes after an active flow exists should be supported or intentionally ignored.

### `get_my_onboarding`

- API module: `rbp_app.api.membership`
- Whitelisted method: `get_my_onboarding()`
- Service method called: `rbp_app.services.membership.get_my_onboarding(user=user)`
- Purpose: fetch the latest onboarding flow and ordered step list for the current user.
- Expected payload or arguments: none.
- Expected response shape: `{"flow": flow object or null, "steps": [step rows]}`. Flow includes tenant, business profile, membership plan, subscription, status, current step key, source channel, and timestamps. Step rows include name, step key/label, status, sort order, started/completed timestamps, and modified timestamp.
- Permission model: authenticated user required.
- Tenant assumptions: lookup is by `user`; tenant is returned from the flow when present.
- Audit behavior: none.
- Notification behavior: none.
- Frontend/client notes: use `flow is null` to decide whether to call `start_onboarding`.
- Open integration questions: confirm whether clients need expanded membership plan/subscription details or only linked IDs.

### `update_onboarding_step`

- API module: `rbp_app.api.membership`
- Whitelisted method: `update_onboarding_step(flow_name, step_key, payload=None, status="Completed")`
- Service method called: `rbp_app.services.membership.update_onboarding_step(...)`
- Purpose: persist one onboarding step payload and status.
- Expected payload or arguments: `flow_name`; `step_key`; optional `payload` object/string stored as JSON; optional `status`, default `Completed`.
- Expected response shape: `{"name", "step_key", "status"}` for the updated step.
- Permission model: flow owner or admin/system manager through service-level check.
- Tenant assumptions: ownership is enforced by flow `user`; tenant is inherited by existing flow/step.
- Audit behavior: creates `onboarding_step_updated` with step metadata.
- Notification behavior: none.
- Frontend/client notes: service sets the parent flow `current_step_key` to the updated `step_key` and flow status to `In Progress`.
- Open integration questions: confirm valid frontend step status values and whether partial/in-progress autosaves should use a non-completed status.

### `submit_onboarding`

- API module: `rbp_app.api.membership`
- Whitelisted method: `submit_onboarding(flow_name)`
- Service method called: `rbp_app.services.membership.submit_onboarding(flow_name=flow_name, user=user)`
- Purpose: submit a user's onboarding flow for review/completion.
- Expected payload or arguments: `flow_name`.
- Expected response shape: `{"name", "status", "submitted_on"}`.
- Permission model: flow owner or admin/system manager through service-level check.
- Tenant assumptions: ownership is enforced by flow `user`.
- Audit behavior: creates `onboarding_submitted`.
- Notification behavior: creates a user notification with trigger source `membership.submit_onboarding`.
- Frontend/client notes: client should refresh onboarding state after submit because flow status and timestamps change.
- Open integration questions: confirm whether admin/staff notification on submission is required.

### `admin_complete_onboarding`

- API module: `rbp_app.api.membership`
- Whitelisted method: `admin_complete_onboarding(flow_name)`
- Service method called: `rbp_app.services.membership.complete_onboarding(flow_name=flow_name, user=user)`
- Purpose: mark an onboarding flow complete after platform review.
- Expected payload or arguments: `flow_name`.
- Expected response shape: `{"name", "status", "completed_on"}`.
- Permission model: current user must be System Manager.
- Tenant assumptions: admin can complete any flow; completion notification is sent to flow owner.
- Audit behavior: creates `onboarding_completed`.
- Notification behavior: creates a user notification with trigger source `membership.complete_onboarding`.
- Frontend/client notes: admin-only action; not intended for member self-service UI.
- Open integration questions: confirm whether completion should provision entitlements/subscriptions in a later integration phase.

## Decision Desk

Module: `rbp_app.api.decision_desk`

Shared behavior:
- Payload coercion: `payload` and `filters` accept JSON strings or dict-like values.
- Permission model: member/advisor endpoints require login; `admin_assign_request` and `admin_update_status` require System Manager at the API layer. Service access allows admins, owners, and assigned users depending on operation.
- Tenant assumptions: non-admin users must have a current tenant. Request records are tenant-scoped; non-admin list/read access is limited to same-tenant records owned by or assigned to the user.
- Audit behavior: create/update/submit/assign/status/option mutations create Decision Desk audit events.
- Notification behavior: submission notifies owner and System Managers; assignment notifies assignee; status changes notify owner, with extra high-priority success notification when outcome is ready.
- Frontend/client notes: `create_request`, `update_draft_request`, `submit_request`, and `get_request` return the full request serializer; `list_my_requests` returns summary rows.

### Endpoint Inventory

| Whitelisted method | Service method called | Purpose | Expected payload or arguments | Expected response shape | Permission model | Tenant assumptions | Audit behavior | Notification behavior | Frontend/client notes | Open integration questions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `create_request(payload=None)` | `service.create_request(user, payload)` | Create a draft Decision Desk request. | Payload fields: `business_profile`, `title`, `category`, `summary`, `business_context`, `urgency`, `deadline`, `desired_outcome`, `constraints`, `source_channel`, `supporting_file_reference`, `notes`. | Request object with request fields plus empty `options`. | Login required. | Requires current tenant; owner is current user. | `decision_desk_request_created`. | None. | Defaults `status/workflow_state` to `Draft`, `urgency` to `Normal`, `source_channel` to `portal`. | Confirm required fields and file upload/reference flow. |
| `update_draft_request(request_name, payload=None)` | `service.update_draft_request(user, request_name, payload)` | Update an owned draft request. | `request_name`; same draft fields as create. | Full request object. | Login; owner only unless admin. | Request tenant must match user tenant for non-admins. | `decision_desk_request_updated`. | None. | Only `Draft` can be updated by owner. | Confirm whether assigned advisors should ever edit request intake fields. |
| `submit_request(request_name)` | `service.submit_request(user, request_name)` | Submit a draft request for review. | `request_name`. | Full request object with `Submitted` status and `submitted_on`. | Login; owner only unless admin. | Same-tenant owner for non-admins. | `decision_desk_request_submitted`. | Owner plus admin recipients. | After submit, draft editing is blocked. | Confirm admin recipient strategy outside System Manager users. |
| `list_my_requests(filters=None)` | `service.list_my_requests(user, filters)` | List accessible Decision Desk requests. | Optional filters: `status`, `category`, `urgency`. | `{"requests": [summary rows], "count": number}`. | Login; admins see all matching rows, non-admins see owned/assigned rows. | Non-admin query is tenant-filtered. | None. | None. | Rows are sorted by `modified desc`; no pagination args currently exposed. | Confirm pagination/search requirements. |
| `get_request(request_name)` | `service.get_request(user, request_name)` | Read one request with options. | `request_name`. | Full request object with `options` list. | Login; admin, owner, or assignee. | Non-admin tenant must match request tenant. | None. | None. | Options are ordered by `sort_order asc, modified asc`. | Confirm whether customer can view all advisor options before outcome ready. |
| `admin_assign_request(request_name, assigned_to)` | `service.admin_assign_request(user, request_name, assigned_to)` | Assign a request to an advisor. | `request_name`, `assigned_to`. | Full request object with `Assigned` status. | System Manager required. | Admin can assign any request. | `decision_desk_request_assigned`. | Assignee notification. | Sets `reviewed_on` and workflow state to `Assigned`. | Confirm if assignee must belong to same tenant or internal advisor pool. |
| `admin_update_status(request_name, status, payload=None)` | `service.admin_update_status(user, request_name, status, payload)` | Change request workflow status/admin fields. | `request_name`; `status` in `Draft`, `Submitted`, `In Review`, `Assigned`, `In Progress`, `Outcome Ready`, `Closed`, `Cancelled`; payload fields `assigned_to`, `notes`, `supporting_file_reference`. | Full request object. | System Manager required. | Admin can update any tenant. | `decision_desk_status_updated`. | Owner on status change; extra outcome-ready notification. | No transition matrix is enforced beyond valid statuses. | Confirm if stricter status transitions are desired. |
| `create_option(request_name, payload=None)` | `service.create_option(user, request_name, payload)` | Add a decision option to a request. | `request_name`; payload fields `option_label`, `option_summary`, `pros`, `cons`, `estimated_cost`, `risk_level`, `recommended`, `sort_order`, `notes`. | Option object. | Login; admin, owner, or assignee can add. | Option tenant is inherited from parent request. | `decision_desk_option_created`. | None. | Defaults `risk_level=Medium`, `recommended=0`, `sort_order=0`. | Confirm if owners should be allowed to create/edit advisor options. |
| `update_option(option_name, payload=None)` | `service.update_option(user, option_name, payload)` | Update an existing decision option. | `option_name`; option payload fields. | Option object. | Login; admin, owner, or assignee on parent request. | Option tenant must match parent request tenant. | `decision_desk_option_updated`. | None. | Client should refresh parent request to see ordered option list. | Confirm customer edit rights for options. |
| `delete_option(option_name)` | `service.delete_option(user, option_name)` | Delete a decision option. | `option_name`. | `{"deleted": true, "name": option_name}`. | Login; admin, owner, or assignee on parent request. | Option tenant must match parent request tenant. | `decision_desk_option_deleted`. | None. | Hard delete via DocType delete. | Confirm whether soft-delete/audit retention is required for options. |

## DocuShare

Module: `rbp_app.api.docushare`

Shared behavior:
- Permission model: all endpoints require login. Service-level access allows System Managers broadly, owners for management, same-tenant users for tenant-visible records, and explicit active shares for shared records.
- Tenant assumptions: create operations require a current tenant; folders, documents, and shares are tenant-scoped. Parent folders and file references must belong to the same tenant when present.
- Audit behavior: all create/update/share/revoke mutations create DocuShare audit events.
- Notification behavior: share and revoke operations notify the target user/email; create/update/list/get operations do not notify.
- Frontend/client notes: visibility values are `Private`, `Tenant`, and `Shared`; folder statuses are `Active`/`Archived`; document statuses are `Draft`/`Active`/`Archived`/`Deleted`.

### Endpoint Inventory

| Whitelisted method | Service method called | Purpose | Expected payload or arguments | Expected response shape | Permission model | Tenant assumptions | Audit behavior | Notification behavior | Frontend/client notes | Open integration questions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `create_folder(payload=None)` | `service.create_folder(user, payload)` | Create a folder. | Payload fields: `folder_name`, `parent_folder`, `description`, `status`, `visibility`, `created_from`, `notes`. | Folder object. | Login required. | Requires current tenant; parent folder must be same tenant and not archived. | `docushare_folder_created`. | None. | Defaults `status=Active`, `visibility=Private`. | Confirm folder naming/duplicate rules. |
| `update_folder(folder_name, payload=None)` | `service.update_folder(user, folder_name, payload)` | Update a folder. | `folder_name`; folder payload fields. | Folder object. | Owner or admin. | Folder and parent folder must be same tenant for non-admins. | `docushare_folder_updated`. | None. | Can archive by setting `status=Archived`. | Confirm whether archived folders should cascade to children. |
| `list_folders(filters=None)` | `service.list_folders(user, filters)` | List visible folders. | Optional filters: `status`, `visibility`, `parent_folder`. | `{"folders": [summary rows], "count": number}`. | Login; admin sees all matching rows. | Non-admin rows must be same-tenant and owned, tenant-visible, or shared to user/email. | None. | None. | No pagination args; rows include `modified`. | Confirm shared-by-email matching for users whose email differs from user id. |
| `get_folder(folder_name)` | `service.get_folder(user, folder_name)` | Read one visible folder. | `folder_name`. | Folder object. | Login; admin, owner, tenant-visible same-tenant user, or active share target. | Non-admin must be same tenant. | None. | None. | Does not include child folders/documents. | Confirm if folder detail should include children for UI tree rendering. |
| `create_document(payload=None)` | `service.create_document(user, payload)` | Create a DocuShare document linked to a file reference. | Payload fields: `folder`, `title`, `description`, `file_reference`, `document_type`, `status`, `visibility`, `version`, `source_channel`, `notes`. | Document object. | Login required. | Requires current tenant; folder and file reference must be same tenant when supplied. | `docushare_document_created`. | None. | Defaults `status=Draft`, `visibility=Private`, `version=1`, `source_channel=portal`. | Confirm relationship with generic `attach_file_reference`. |
| `update_document(document_name, payload=None)` | `service.update_document(user, document_name, payload)` | Update a document. | `document_name`; document payload fields. | Document object. | Owner or admin. | Document/folder/file reference tenant must align. | `docushare_document_updated`. | None. | Can make a document tenant-visible or shared. | Confirm document versioning behavior beyond string `version`. |
| `list_documents(filters=None)` | `service.list_documents(user, filters)` | List visible documents. | Optional filters: `status`, `visibility`, `folder`, `document_type`. | `{"documents": [summary rows], "count": number}`. | Login; admin sees all matching rows. | Non-admin rows must be same-tenant and owned, tenant-visible, or shared. | None. | None. | Rows include file reference id, not expanded file metadata. | Confirm whether frontend needs file URL expansion. |
| `get_document(document_name)` | `service.get_document(user, document_name)` | Read one visible document. | `document_name`. | Document object. | Login; admin, owner, tenant-visible same-tenant user, or active share target. | Non-admin must be same tenant. | None. | None. | Does not include share list. | Confirm if document detail should include active shares for owners. |
| `share_folder(folder_name, payload=None)` | `service.share_folder(user, folder_name, payload)` | Share a folder. | `folder_name`; payload fields `share_target_user`, `share_target_email`, `access_level`, `expires_on`, `notes`. | Share object. | Folder owner or admin. | Share inherits parent folder tenant. | `docushare_folder_shared`. | Target user/email receives notification. | Parent folder visibility is set to `Shared`; access levels are `View`, `Comment`, `Manage`. | Confirm email-only notification delivery expectations. |
| `share_document(document_name, payload=None)` | `service.share_document(user, document_name, payload)` | Share a document. | `document_name`; share payload fields. | Share object. | Document owner or admin. | Share inherits parent document tenant. | `docushare_document_shared`. | Target user/email receives notification. | Parent document visibility is set to `Shared`. | Confirm whether folder share should imply document access recursively. |
| `revoke_share(share_name)` | `service.revoke_share(user, share_name)` | Revoke an active share. | `share_name`. | Share object with `status=Revoked` and `revoked_on`. | Parent owner or admin. | Parent folder/document tenant controls access. | `docushare_share_revoked`. | Target user/email receives revoked notification. | Parent visibility is not automatically recalculated after revoke. | Confirm if last revoked share should return parent visibility to `Private`. |

## Marketplace

Module: `rbp_app.api.marketplace`

Shared behavior:
- Permission model: all methods require login. Vendor/listing management is allowed to vendor owners and admins; order status management is allowed to admins/vendor owners, with buyer cancellation allowed.
- Tenant assumptions: marketplace records are tenant-scoped. Non-admin users are filtered to current tenant. Listings can be visible to owners, same-tenant users, and public/tenant visibility within current service rules.
- Audit behavior: all vendor/listing/order mutations create marketplace audit events.
- Notification behavior: vendor creation notifies creator; listing creation notifies vendor owner; order creation notifies vendor owner; order status updates notify buyer and vendor owner.
- Frontend/client notes: marketplace order transitions are enforced by the service.

### Endpoint Inventory

| Whitelisted method | Service method called | Purpose | Expected payload or arguments | Expected response shape | Permission model | Tenant assumptions | Audit behavior | Notification behavior | Frontend/client notes | Open integration questions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `create_vendor(payload=None)` | `service.create_vendor(user, payload)` | Create a vendor profile. | Payload fields: `vendor_name`, `description`, `contact_email`, `contact_phone`, `website`, `status`, `verification_status`, `notes`. | Vendor object. | Login required. | Requires current tenant; owner is current user. | `marketplace_vendor_created`. | Creator notification. | Defaults `status=Draft`, `verification_status=Unverified`. | Confirm vendor approval/verification ownership. |
| `update_vendor(vendor_name, payload=None)` | `service.update_vendor(user, vendor_name, payload)` | Update vendor profile/status. | `vendor_name`; vendor payload fields. | Vendor object. | Vendor owner or admin. | Non-admin must match vendor tenant. | `marketplace_vendor_updated`. | None. | Allowed statuses: `Draft`, `Active`, `Suspended`, `Archived`. | Confirm whether non-admins may self-activate vendors. |
| `list_vendors(filters=None)` | `service.list_vendors(user, filters)` | List visible vendors. | Optional filters: `status`, `verification_status`. | `{"vendors": [summary rows], "count": number}`. | Login; admin sees all matching rows. | Non-admin rows are same-tenant and either owned by user or active. | None. | None. | No pagination args; sorted by modified. | Confirm marketplace discovery across tenants vs tenant-only. |
| `get_vendor(vendor_name)` | `service.get_vendor(user, vendor_name)` | Read one vendor. | `vendor_name`. | Vendor object. | Admin, same-tenant owner, or same-tenant user when vendor is active. | Non-admin must be same tenant. | None. | None. | Does not include listings. | Confirm whether vendor detail should include active listings. |
| `create_listing(payload=None)` | `service.create_listing(user, payload)` | Create a listing under a vendor. | Payload must include `vendor`; listing fields: `title`, `category`, `description`, `price`, `currency`, `billing_model`, `status`, `visibility`, `notes`. | Listing object. | Vendor owner or admin. | Listing tenant follows vendor tenant. | `marketplace_listing_created`. | Vendor owner notification. | Defaults `status=Draft`, `visibility=Private`, `currency=AUD`, `billing_model=One-off`. Cannot create for suspended/archived vendor. | Confirm non-admin listing activation rules. |
| `update_listing(listing_name, payload=None)` | `service.update_listing(user, listing_name, payload)` | Update listing. | `listing_name`; listing payload fields. | Listing object. | Vendor owner or admin. | Listing and vendor tenant must align for non-admins. | `marketplace_listing_updated`. | None. | Allowed visibility: `Private`, `Tenant`, `Public`; billing model: `One-off`, `Recurring`, `Quote`. | Confirm if public visibility should be globally visible outside tenant. |
| `list_listings(filters=None)` | `service.list_listings(user, filters)` | List visible listings. | Optional filters: `vendor`, `status`, `visibility`, `category`, `billing_model`. | `{"listings": [summary rows], "count": number}`. | Login; admin sees all matching rows. | Non-admin rows are same-tenant and owned or active with `Tenant`/`Public` visibility. | None. | None. | No full-text search or pagination currently. | Confirm catalog search/filter requirements. |
| `get_listing(listing_name)` | `service.get_listing(user, listing_name)` | Read one listing. | `listing_name`. | Listing object. | Admin, owner, or same-tenant user for active tenant/public listing. | Non-admin must be same tenant. | None. | None. | Private listings are owner/admin only. | Confirm whether listing detail needs vendor expansion. |
| `create_order(listing_name, payload=None)` | `service.create_order(user, listing_name, payload)` | Request/order an active listing. | `listing_name`; payload fields `quantity`, `notes`. | Order object. | Login and listing view access. | Order tenant follows listing/vendor tenant. | `marketplace_order_created`. | Vendor owner high-priority notification. | Requires active listing and active vendor; calculates `total_amount = price * quantity`; default quantity 1. | Confirm payment/billing handoff for approved/fulfilled orders. |
| `update_order_status(order_name, status, payload=None)` | `service.update_order_status(user, order_name, status, payload)` | Move an order through workflow. | `order_name`; `status` in `Requested`, `Approved`, `In Progress`, `Fulfilled`, `Cancelled`, `Rejected`; optional `notes`. | Order object. | Admin/vendor owner can manage; buyer can only cancel. | Non-admin must match order tenant. | `marketplace_order_status_updated`. | Buyer and vendor owner. | Enforces transition matrix; sets approved/fulfilled/cancelled timestamps. | Confirm whether buyer receives distinct approval/rejection copy. |
| `list_my_orders(filters=None)` | `service.list_my_orders(user, filters)` | List accessible marketplace orders. | Optional filters: `status`, `listing`, `vendor`. | `{"orders": [summary rows], "count": number}`. | Login; admin sees all matching rows; non-admin sees orders where buyer or vendor owner. | Non-admin query is current-tenant filtered. | None. | None. | Vendor owner access is derived from vendor records. | Confirm pagination and buyer/vendor tabs. |
| `get_order(order_name)` | `service.get_order(user, order_name)` | Read one order. | `order_name`. | Order object. | Admin, buyer, or vendor owner. | Non-admin must match order tenant. | None. | None. | Does not expand listing/vendor. | Confirm if order detail needs listing snapshot. |

## Connectivity

Module: `rbp_app.api.connectivity`

Shared behavior:
- Permission model: customer/advisor endpoints require login; admin request/provider endpoints require System Manager where wrapped that way. Quote creation/update is available to admins and assigned users.
- Tenant assumptions: requests, providers, and quotes are tenant-scoped. Non-admin users require a current tenant and are limited to owned/assigned/current-tenant records.
- Audit behavior: all create/update/submit/assign/status/provider/quote/accept mutations create connectivity audit events.
- Notification behavior: request submit notifies owner and admins; assignment notifies assignee; status updates notify owner and assignee; presented quotes notify owner; accepted quotes notify owner and assignee.
- Frontend/client notes: request and order-like status transitions are enforced for admin status updates.

### Endpoint Inventory

| Whitelisted method | Service method called | Purpose | Expected payload or arguments | Expected response shape | Permission model | Tenant assumptions | Audit behavior | Notification behavior | Frontend/client notes | Open integration questions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `create_request(payload=None)` | `service.create_request(user, payload)` | Create draft connectivity request. | Payload fields: `business_profile`, `location_name`, `address_line_1`, `address_line_2`, `suburb`, `state`, `postcode`, `service_type`, `current_provider`, `current_plan`, `desired_speed`, `budget`, `notes`. | Request object with `quotes` list. | Login required. | Requires current tenant; owner is current user. | `connectivity_request_created`. | None. | Defaults `Draft` status/workflow. | Confirm required address/service fields. |
| `update_draft_request(request_name, payload=None)` | `service.update_draft_request(user, request_name, payload)` | Update owned draft request. | `request_name`; request payload fields. | Request object. | Owner or admin; draft only for owner. | Non-admin must be same tenant. | `connectivity_request_updated`. | None. | Only `Draft` can be edited by owner. | Confirm advisor edit workflow. |
| `submit_request(request_name)` | `service.submit_request(user, request_name)` | Submit draft connectivity request. | `request_name`. | Request object with `Submitted` status and `submitted_on`. | Owner or admin; draft only. | Non-admin must be same tenant. | `connectivity_request_submitted`. | Owner and admin notifications. | Client should lock draft fields after submit. | Confirm admin recipient list. |
| `list_my_requests(filters=None)` | `service.list_my_requests(user, filters)` | List accessible requests. | Optional filters: `status`, `assigned_to`, `service_type`. | `{"requests": [summary rows], "count": number}`. | Login; admin sees all matching rows; non-admin sees owned/assigned rows. | Non-admin query tenant-filtered. | None. | None. | No pagination args. | Confirm dashboard summary fields. |
| `get_request(request_name)` | `service.get_request(user, request_name)` | Read request with quotes. | `request_name`. | Request object with `quotes`. | Admin, owner, or assignee. | Non-admin must be same tenant. | None. | None. | Quotes ordered by modified desc. | Confirm quote visibility before presentation. |
| `admin_assign_request(request_name, assigned_to)` | `service.admin_assign_request(user, request_name, assigned_to)` | Assign request. | `request_name`, `assigned_to`. | Request object. | System Manager required. | Admin can assign any tenant. | `connectivity_request_assigned`. | Assignee high-priority notification. | Submitted requests move to `In Review`; otherwise workflow mirrors current status. | Confirm assignee tenant/internal role constraints. |
| `admin_update_status(request_name, status, payload=None)` | `service.admin_update_status(user, request_name, status, payload)` | Move connectivity request status. | `request_name`; status in `Draft`, `Submitted`, `In Review`, `Quoted`, `Approved`, `In Progress`, `Completed`, `Cancelled`; optional `assigned_to`, `notes`. | Request object. | System Manager required. | Admin can update any tenant. | `connectivity_status_updated`. | Owner and assignee notifications. | Enforces transition matrix and sets reviewed/closed dates. | Confirm who can mark completed outside System Manager. |
| `create_provider(payload=None)` | `service.create_provider(user, payload)` | Create connectivity provider. | Payload fields: optional `tenant`; `provider_name`, `contact_email`, `contact_phone`, `website`, `service_regions`, `service_types`, `status`, `notes`. | Provider object. | System Manager required. | Tenant from payload or admin current tenant. | `connectivity_provider_created`. | None. | Defaults `status=Active`; allowed statuses `Active`, `Inactive`, `Archived`. | Confirm if providers should be tenant-specific or global. |
| `update_provider(provider_name, payload=None)` | `service.update_provider(user, provider_name, payload)` | Update provider. | `provider_name`; provider payload fields. | Provider object. | System Manager required. | Existing provider tenant remains unless changed by DocType behavior; payload does not include tenant in allowed fields. | `connectivity_provider_updated`. | None. | Provider status controls visibility/quote eligibility. | Confirm tenant migration/edit behavior. |
| `list_providers(filters=None)` | `service.list_providers(user, filters)` | List providers. | Optional filters: `status`, `service_regions`, `service_types`. | `{"providers": [summary rows], "count": number}`. | Login; admin sees all matching rows. | Non-admin sees active providers in current tenant. | None. | None. | Region/type filtering is exact field filtering. | Confirm search semantics for multi-value regions/types. |
| `create_quote(request_name, payload=None)` | `service.create_quote(user, request_name, payload)` | Create a quote for a request. | `request_name`; payload fields `provider`, `quote_title`, `speed_down`, `speed_up`, `monthly_cost`, `setup_cost`, `contract_months`, `status`, `recommended`, `notes`. | Quote object. | Admin or assigned user. | Quote and provider must match request tenant. | `connectivity_quote_created`. | Owner if quote status is `Presented`. | Defaults `status=Draft`, `recommended=0`; `Presented` moves request to `Quoted`. | Confirm whether draft quotes should be hidden from customers. |
| `update_quote(quote_name, payload=None)` | `service.update_quote(user, quote_name, payload)` | Update quote. | `quote_name`; quote payload fields. | Quote object. | Admin or assigned user. | Provider, quote, and request tenant must align. | `connectivity_quote_updated`. | Owner when status newly becomes `Presented`. | Presented quote moves request to `Quoted`. | Confirm quote revision/versioning. |
| `accept_quote(quote_name)` | `service.accept_quote(user, quote_name)` | Accept a draft/presented quote. | `quote_name`. | Quote object with `status=Accepted`. | Request owner or admin. | Quote tenant must match request tenant. | `connectivity_quote_accepted`. | Owner and assignee if present. | Also moves request to `Approved`. | Confirm downstream provisioning/order workflow. |

## Risk Advisor

Module: `rbp_app.api.risk_advisor`

Shared behavior:
- Permission model: all endpoints require login; admin assignment/status endpoints require System Manager at API layer. Assessment access is admin, owner, or assignee.
- Tenant assumptions: assessments, risks, and actions are tenant-scoped. Non-admin users require a current tenant and only access owned/assigned assessments.
- Audit behavior: all mutations create risk advisor audit events.
- Notification behavior: submit notifies owner and admins; assignment notifies assignee; assessment status changes notify owner; risk creation notifies assessment owner; action assignment/completion notifies relevant users.
- Frontend/client notes: risk score is derived as `likelihood * impact`; risk level is `Critical >=20`, `High >=12`, `Medium >=5`, otherwise `Low`.

### Endpoint Inventory

| Whitelisted method | Service method called | Purpose | Expected payload or arguments | Expected response shape | Permission model | Tenant assumptions | Audit behavior | Notification behavior | Frontend/client notes | Open integration questions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `create_assessment(payload=None)` | `service.create_assessment(user, payload)` | Create draft risk assessment. | Payload fields: `business_profile`, `title`, `assessment_type`, `business_area`, `summary`, `notes`. | Assessment object with `risks` and `actions`. | Login required. | Requires current tenant; owner is current user. | `risk_advisor_assessment_created`. | None. | Defaults `assessment_type=General`, `risk_score=0`, `risk_level=Low`. | Confirm required intake fields. |
| `update_draft_assessment(assessment_name, payload=None)` | `service.update_draft_assessment(user, assessment_name, payload)` | Update owned draft assessment. | `assessment_name`; draft assessment fields. | Assessment object. | Owner or admin; draft only for owner. | Non-admin tenant must match. | `risk_advisor_assessment_updated`. | None. | Only `Draft` can be edited by owner. | Confirm admin edit permissions. |
| `submit_assessment(assessment_name)` | `service.submit_assessment(user, assessment_name)` | Submit assessment for review. | `assessment_name`. | Assessment object with `Submitted` status. | Owner or admin; draft only. | Non-admin tenant must match. | `risk_advisor_assessment_submitted`. | Owner and admin notifications. | Enforces transition `Draft -> Submitted`. | Confirm admin recipient model. |
| `list_my_assessments(filters=None)` | `service.list_my_assessments(user, filters)` | List accessible assessments. | Optional filters: `status`, `assessment_type`, `business_area`, `risk_level`. | `{"assessments": [summary rows], "count": number}`. | Login; admin sees all; non-admin sees owned/assigned. | Non-admin tenant-filtered. | None. | None. | No pagination args. | Confirm dashboard risk summary requirements. |
| `get_assessment(assessment_name)` | `service.get_assessment(user, assessment_name)` | Read assessment with risks/actions. | `assessment_name`. | Assessment object with `risks` and `actions`. | Admin, owner, or assignee. | Non-admin tenant must match. | None. | None. | Actions are listed across assessment, not only per risk. | Confirm whether customer can see all internal actions. |
| `admin_assign_assessment(assessment_name, assigned_to)` | `service.admin_assign_assessment(user, assessment_name, assigned_to)` | Assign assessment to advisor. | `assessment_name`, `assigned_to`. | Assessment object with `In Review`. | System Manager required. | Admin can assign any tenant. | `risk_advisor_assessment_assigned`. | Assignee high-priority notification. | Sets `reviewed_on`; enforces transition to `In Review`. | Confirm assignee role/tenant validation. |
| `admin_update_assessment_status(assessment_name, status, payload=None)` | `service.admin_update_assessment_status(user, assessment_name, status, payload)` | Update assessment status/admin fields. | `assessment_name`; status in `Draft`, `Submitted`, `In Review`, `Reviewed`, `Closed`, `Cancelled`; payload fields `assigned_to`, `notes`, `risk_score`, `risk_level`. | Assessment object. | System Manager required. | Admin can update any tenant. | `risk_advisor_assessment_status_updated`. | Owner on status change. | Enforces transition matrix; sets reviewed/closed dates. | Confirm whether admin-supplied risk score/level should override derived risk rollups. |
| `create_risk(assessment_name, payload=None)` | `service.create_risk(user, assessment_name, payload)` | Add risk to assessment. | `assessment_name`; payload fields `title`, `category`, `description`, `likelihood`, `impact`, `status`, `owner_user`, `notes`. | Risk object. | Admin, assessment owner, or assignee. | Risk tenant inherits assessment tenant. | `risk_advisor_risk_created`. | Assessment owner notification. | Defaults likelihood/impact to 1 and status to `Open`; calculates score/level. | Confirm owner/customer ability to create risks post-submission. |
| `update_risk(risk_name, payload=None)` | `service.update_risk(user, risk_name, payload)` | Update risk. | `risk_name`; risk payload fields. | Risk object. | Admin, assessment owner, or assignee. | Risk tenant must match assessment tenant. | `risk_advisor_risk_updated`. | None. | Allowed risk statuses: `Open`, `Monitoring`, `Mitigated`, `Accepted`, `Closed`. | Confirm if risk status transitions should be constrained. |
| `create_action(risk_name, payload=None)` | `service.create_action(user, risk_name, payload)` | Create mitigation/action item for a risk. | `risk_name`; payload fields `title`, `description`, `priority`, `status`, `assigned_to`, `due_date`, `notes`. | Action object. | Admin, assessment owner, or assignee. | Action tenant inherits assessment tenant. | `risk_advisor_action_created`. | Assignee notification if assigned. | Defaults priority `Normal`, status `Open`. | Confirm whether external customers can assign actions to internal users. |
| `update_action(action_name, payload=None)` | `service.update_action(user, action_name, payload)` | Update action. | `action_name`; action payload fields. | Action object. | Admin, assessment owner, or assignee. | Action/risk/assessment tenant must align. | `risk_advisor_action_updated`. | New assignee notification when assignee changes. | Sets `completed_on` if status becomes `Completed`. | Confirm action status transition rules. |
| `complete_action(action_name)` | `service.complete_action(user, action_name)` | Mark action complete. | `action_name`. | Action object with `Completed` and `completed_on`. | Admin, assessment owner, or assignee. | Action/risk/assessment tenant must align. | `risk_advisor_action_completed`. | Assessment owner and action assignee. | Idempotency is not explicit; repeated calls reset `completed_on`. | Confirm whether repeated complete should preserve timestamp. |

## The Fixer

Module: `rbp_app.api.the_fixer`

Shared behavior:
- Permission model: all endpoints require login; admin assignment/status endpoints require System Manager at API layer. Case access is admin, owner, or assignee. Task creation/update/completion and internal updates require admin or assigned user.
- Tenant assumptions: cases, tasks, and updates are tenant-scoped. Related records are validated to be same tenant when present.
- Audit behavior: all mutations create Fixer audit events.
- Notification behavior: submit notifies owner and admins; assignment/task assignment/customer-visible updates/status changes/task completion notify relevant users.
- Frontend/client notes: customer-visible updates are controlled by `visible_to_customer`; non-assigned customers cannot see internal updates.

### Endpoint Inventory

| Whitelisted method | Service method called | Purpose | Expected payload or arguments | Expected response shape | Permission model | Tenant assumptions | Audit behavior | Notification behavior | Frontend/client notes | Open integration questions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `create_case(payload=None)` | `service.create_case(user, payload)` | Create draft Fixer case. | Payload fields: `business_profile`, `title`, `category`, `issue_summary`, `issue_details`, `urgency`, `impact`, `source_channel`, `related_decision_request`, `related_docushare_document`, `related_marketplace_order`, `related_connectivity_request`, `related_risk_assessment`, `notes`. | Case object with `tasks` and `updates`. | Login required. | Requires current tenant; related records must be same tenant. | `fixer_case_created`. | None. | Defaults `urgency=Medium`, `impact=Medium`, `source_channel=portal`, `status=Draft`. | Confirm required intake fields and cross-app launch points. |
| `update_draft_case(case_name, payload=None)` | `service.update_draft_case(user, case_name, payload)` | Update owned draft case. | `case_name`; draft case fields. | Case object. | Owner or admin; draft only. | Non-admin tenant must match; related refs same tenant. | `fixer_case_updated`. | None. | Only draft cases can be edited by owner. | Confirm whether customers can edit after submission. |
| `submit_case(case_name)` | `service.submit_case(user, case_name)` | Submit case for triage. | `case_name`. | Case object with `Submitted` status. | Owner or admin; draft only. | Non-admin tenant must match. | `fixer_case_submitted`. | Owner and admin notifications. | Client should move from draft to case detail after submit. | Confirm admin recipient model. |
| `list_my_cases(filters=None)` | `service.list_my_cases(user, filters)` | List accessible cases. | Optional filters: `status`, `category`, `urgency`, `impact`. | `{"cases": [summary rows], "count": number}`. | Login; admin sees all; non-admin sees owned/assigned. | Non-admin tenant-filtered. | None. | None. | No pagination/search args. | Confirm support queue filtering needs. |
| `get_case(case_name)` | `service.get_case(user, case_name)` | Read case with tasks and visible updates. | `case_name`. | Case object with `tasks` and `updates`. | Admin, owner, or assignee. | Non-admin tenant must match. | None. | None. | Owners see only customer-visible updates; assigned users/admins see internal updates. | Confirm whether customers should see task list. |
| `admin_assign_case(case_name, assigned_to)` | `service.admin_assign_case(user, case_name, assigned_to)` | Assign case. | `case_name`, `assigned_to`. | Case object with `Assigned` status. | System Manager required. | Admin can assign any tenant. | `fixer_case_assigned`. | Assignee high-priority notification. | Sets `reviewed_on`. | Confirm assignee role validation. |
| `admin_update_case_status(case_name, status, payload=None)` | `service.admin_update_case_status(user, case_name, status, payload)` | Move case workflow/status and admin fields. | `case_name`; status in `Draft`, `Submitted`, `Triage`, `Assigned`, `In Progress`, `Waiting on Customer`, `Resolved`, `Closed`, `Cancelled`; payload fields `assigned_to`, `notes`, and related refs. | Case object. | System Manager required. | Related refs must be same tenant. | `fixer_case_status_updated`. | Owner on status change; extra success notification when resolved. | Enforces transition matrix and sets reviewed/resolved/closed dates. | Confirm whether assignees should update status without System Manager. |
| `create_task(case_name, payload=None)` | `service.create_task(user, case_name, payload)` | Add internal task to case. | `case_name`; payload fields `title`, `description`, `priority`, `status`, `assigned_to`, `due_date`, `notes`. | Task object. | Admin or assigned case user. | Task tenant inherits case tenant. | `fixer_task_created`. | Task assignee notification if assigned. | Defaults `status=Open`, `priority=Medium`. | Confirm customer visibility of tasks. |
| `update_task(task_name, payload=None)` | `service.update_task(user, task_name, payload)` | Update task. | `task_name`; task payload fields. | Task object. | Admin or assigned case user. | Task tenant must match case tenant. | `fixer_task_updated`. | Assignee notification when `assigned_to` payload present; owner notification when completed. | Sets `completed_on` if status becomes `Completed`. | Confirm task status validation; constants exist but service does not currently enforce them. |
| `complete_task(task_name)` | `service.complete_task(user, task_name)` | Complete task. | `task_name`. | Task object with `Completed`. | Admin or assigned case user. | Task tenant must match case tenant. | `fixer_task_completed`. | Case owner notification. | Repeated calls reset `completed_on`. | Confirm idempotency expectations. |
| `add_case_update(case_name, payload=None)` | `service.add_case_update(user, case_name, payload)` | Add internal or customer-visible case update. | `case_name`; payload fields `update_type`, `message`, `visible_to_customer`, `notes`. | Update object. | Admin/assignee for internal updates; owner, assignee, or admin for customer-visible updates. | Update tenant inherits case tenant. | `fixer_update_added`. | Owner notification when visible to customer. | Update types: `Internal Note`, `Customer Update`, `Status Change`, `Resolution Note`. | Confirm whether customers should be able to add visible updates or only staff. |
| `list_case_updates(case_name, filters=None)` | `service.list_case_updates(user, case_name, filters)` | List visible updates for a case. | `case_name`; optional filter `update_type`. | `{"updates": [rows], "count": number}`. | Admin, owner, or assignee. | Rows filtered to case tenant. | None. | None. | Owners only see `visible_to_customer=1`; assignees/admins see all. | Confirm pagination for long-running cases. |

## Notifications

Module: `rbp_app.api.notifications`

Shared behavior:
- Permission model: all endpoints require login.
- Tenant assumptions: notifications are user-scoped; notification creation attempts to infer tenant from the notification recipient when tenant is not supplied.
- Audit behavior: creating notifications records `notification_created`; read operations do not create audit records.
- Notification behavior: these endpoints read or mutate notification state; they do not emit secondary notifications.

### Endpoint Inventory

| Whitelisted method | Service method called | Purpose | Expected payload or arguments | Expected response shape | Permission model | Tenant assumptions | Audit behavior | Notification behavior | Frontend/client notes | Open integration questions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `get_notifications()` | `get_notifications_service(user)` | Return current user's portal notifications. | None. | `{"notifications": [rows], "unread_count": number}`. Rows include title, message, type, priority, channel, route, related record, trigger source, workflow, status, read fields, modified. | Login required. | User-scoped; no explicit tenant filter in query. | None. | None. | Returns up to 20, ordered unread first then modified desc. | Confirm pagination/load-more and tenant filter needs. |
| `mark_notification_read(name)` | `mark_notification_read_service(name, user)` | Mark one notification as read. | `name`. | `{"name", "is_read", "status", "read_on"}`. | Notification owner or admin. | Access by notification `user`; tenant is not separately checked. | None. | None. | Sets `is_read=1`, `status=Read`. | Confirm whether archived notifications can be marked read. |
| `mark_all_notifications_read()` | `mark_all_notifications_read_service(user)` | Mark all current-user unread, non-archived notifications read. | None. | `{"updated": number}`. | Login required. | User-scoped; no tenant filter. | None. | None. | Uses direct DB updates; useful for notification drawer action. | Confirm whether this should update only current tenant notifications. |

## Entitlements

Module: `rbp_app.api.entitlements`

Shared behavior:
- Permission model: all endpoints require login.
- Tenant assumptions: entitlement rows can be user-specific, tenant-specific, role-specific, date-windowed, and active/enabled. Admin/System Manager users bypass checks.
- Audit behavior: none.
- Notification behavior: none.
- Frontend/client notes: app keys are normalized to lowercase in service checks.

### Endpoint Inventory

| Whitelisted method | Service method called | Purpose | Expected payload or arguments | Expected response shape | Permission model | Tenant assumptions | Audit behavior | Notification behavior | Frontend/client notes | Open integration questions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `get_my_entitlements()` | `get_user_entitlements(user)` | Return active entitlement rows for current user. | None. | `{"entitlements": [rows]}`. Rows include `name`, `tenant`, `user`, `app_key`, `app_label`, `entitlement_type`, `status`, `enabled`, `roles_allowed`, `starts_on`, `ends_on`, `source_subscription`. | Login required; admins receive all active/enabled rows from the underlying query. | Non-admin rows are filtered by current tenant, user, roles, and date window. | None. | None. | Empty array means no explicit entitlement rows; pair with `can_access_app` for allow/deny behavior. | Confirm admin response scope in multi-tenant UI. |
| `can_access_app(app_key)` | `user_has_entitlement(app_key, user)` | Return app-level access decision. | `app_key`. | `{"app_key": app_key, "can_access": boolean}`. | Login required. | Admins return true. If no entitlement records exist, non-admins default to true as scaffold-safe behavior; once records exist, only matching active user entitlements allow access. | None. | None. | Use to gate app launch/navigation. | Confirm when scaffold-safe default should be removed or feature-flagged. |

## Documents / File References

Module: `rbp_app.api.documents`

Shared behavior:
- Permission model: all endpoints require login.
- Tenant assumptions: generic file references use current tenant when available; non-admin listing is tenant-filtered when the user has a tenant, otherwise owner-filtered.
- Audit behavior: attaching/creating file references records `file_reference_created`.
- Notification behavior: none.
- Frontend/client notes: this module references existing Frappe `File` records; it does not upload file bytes.

### Endpoint Inventory

| Whitelisted method | Service method called | Purpose | Expected payload or arguments | Expected response shape | Permission model | Tenant assumptions | Audit behavior | Notification behavior | Frontend/client notes | Open integration questions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `get_documents()` | `get_documents_service(user)` | Return tenant-aware file references. | None. | `{"documents": [file reference rows], "count": number, "module_enabled": true}`. Rows include `name`, `tenant`, `owner_user`, `related_doctype`, `related_name`, `file`, `file_type`, `visibility`, `uploaded_by`, `uploaded_on`, `status`, `modified`. | Login required. | Admin sees all non-archived references; non-admin sees current-tenant references or own references if no tenant. | None. | None. | Limit is 100 rows, sorted by modified desc; no filter args are exposed by API wrapper. | Confirm whether clients need related record filters and pagination. |
| `attach_file_reference(payload=None)` | `attach_document_reference_service(user=user, **payload)` -> `create_file_reference(...)` | Attach an existing Frappe File to an RBP record. | Payload keyword fields: required `file`; optional `tenant`, `related_doctype`, `related_name`, `visibility`, `file_type`, `notes`. | `{"name", "file", "related_doctype", "related_name", "visibility", "status"}`. | Login required. | Tenant from payload or current tenant; owner/uploaded_by are current user. | `file_reference_created`. | None. | Default visibility is `Private To Owner`; expected visibility values are governed by the DocType/service consumers. | Confirm allowed related doctypes and whether cross-tenant related records should be validated here. |

## Cross-cutting integration assumptions

- All listed API methods are Frappe whitelisted functions callable through the standard Frappe RPC mechanism.
- Authenticated access is enforced by shared helpers: `require_login()` rejects `Guest`, and `require_system_manager()` requires Administrator or System Manager role.
- API wrappers generally do not validate request shape themselves; validation, allowed fields, defaults, tenant checks, audit writes, and notification writes are handled in service modules.
- Payload-bearing endpoints accept either JSON string payloads or dict-like objects. Clients should send objects where possible and preserve backend field names exactly.
- Non-admin Phase 3 domain modules generally require `get_current_tenant_name(user)` to resolve an RBP Tenant or legacy Tenant; absence of tenant raises `PermissionError` for create/list flows that require tenancy.
- System Manager/admin users bypass most tenant/ownership restrictions and can often see or mutate all matching records.
- Services use `ignore_permissions=True` for DocType writes after their own service-level access checks.
- Missing optional DocTypes are handled inconsistently by design: list endpoints often return empty collections, while create/mutate endpoints raise `DoesNotExistError` or `ValidationError`.
- Audit logging is best-effort and only writes when `RBP Audit Log` exists.
- Notification creation is best-effort and only writes when `RBP Notification` exists.
- Notification routes are service-defined and currently vary by module, for example `/portal/decision-desk/{name}`, `/portal/connectivity/{name}`, `/portal/risk-advisor/{name}`, `/portal/marketplace/{name}`, `/portal/docushare/{name}`, and `/app/rbp-fixer-case/{name}`.
- List endpoints generally do not expose pagination arguments yet; clients should be prepared for bounded or unbounded lists depending on service implementation.
- Response objects are backend serializers, not Frappe REST resource envelopes. Frontend integrations should treat them as plain JSON objects.

## Open integration questions

- Should public membership plan discovery be available to Guest users, or is authenticated-only plan selection intentional for Phase 3?
- What is the final admin/advisor role model beyond System Manager, especially for assigned users in Decision Desk, Connectivity, Risk Advisor, and The Fixer?
- Should assigned advisors be allowed to update workflow statuses without System Manager for modules where they can currently read or create child records?
- Which list endpoints need pagination, search, sorting, or date filters before frontend launch?
- Should notification APIs become tenant-filtered when a user can belong to multiple tenants?
- Should frontend consumers receive expanded linked records, such as file URLs, vendor/listing snapshots, membership plan details, or related cross-app record summaries?
- Should option/risk/action/task visibility differ between customer and internal advisor views?
- Should DocuShare email-only shares create outbound email delivery, portal notifications only, or both?
- Should "Public" marketplace listings be visible across tenants or only within the current tenant in this implementation?
- Should scaffold-safe entitlement fallback, where no entitlement rows means allow access, remain enabled in production?
- Should generic file reference attachment validate related record tenancy and an allowlist of related doctypes?
- Should status/date mutation endpoints be made idempotent where repeated calls currently refresh completion timestamps?
- Should audit metadata include before/after field diffs for administrative and workflow changes?

## Validation

Expected validation command:

start/env/bin/python -m compileall -q rbp_app/rbp_app

start/env/bin/python -m unittest \
  rbp_app.tests.test_the_fixer \
  rbp_app.tests.test_risk_advisor \
  rbp_app.tests.test_connectivity \
  rbp_app.tests.test_marketplace \
  rbp_app.tests.test_docushare \
  rbp_app.tests.test_decision_desk \
  rbp_app.tests.test_membership_onboarding \
  rbp_app.tests.test_phase3_partials \
  rbp_app.tests.test_platform_api \
  rbp_app.tests.test_tenancy \
  rbp_app.tests.test_api_integrations

Acceptance criteria:
- Documentation-only PR.
- No backend code changes.
- No frontend code changes.
- No Frappe core changes.
- No start/apps/* changes.
- No start/sites/* generated artifacts.
- Focused backend tests still pass.

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
## Milestone 10 Service Persistence Endpoints

These endpoints are the frontend handoff surface for persisted service requests:

- Decision Desk: `rbp_app.api.decision_desk.create_request`, `rbp_app.api.decision_desk.submit_request`, `rbp_app.api.decision_desk.list_my_requests`, `rbp_app.api.decision_desk.get_request`
- DocuShare: `rbp_app.api.docushare.create_brief`, `rbp_app.api.docushare.list_my_briefs`, `rbp_app.api.docushare.get_brief`
- Connectivity: `rbp_app.api.connectivity.create_order`, `rbp_app.api.connectivity.list_my_orders`, `rbp_app.api.connectivity.get_order`
- Risk Advisor: `rbp_app.api.risk_advisor.create_assessment`, `rbp_app.api.risk_advisor.list_my_assessments`, `rbp_app.api.risk_advisor.get_assessment`
- The Fixer: `rbp_app.api.the_fixer.create_request`, `rbp_app.api.the_fixer.list_my_requests`, `rbp_app.api.the_fixer.get_request`
- Marketplace: `rbp_app.api.marketplace.create_listing`, `rbp_app.api.marketplace.create_enquiry`, `rbp_app.api.marketplace.list_my_orders`, `rbp_app.api.marketplace.get_order`
- Portal: `rbp_app.api.portal.get_my_service_activity`
