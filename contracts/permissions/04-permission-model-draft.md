# RBP Phase 2 Backend Contracts
# 04-permission-model-draft.md

## Document Status

| Field | Value |
|---|---|
| Document | Permission Model Draft |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/04-permission-model-draft.md` |
| Intended Final Location | `rbp-platform/contracts/permissions/permission-model.md` |
| Primary Consumers | Frappe backend, frontend, QA, admin operations, security review |

---

## 1. Purpose

This document defines the draft permission model for the Remote Business Partner Platform.

It translates the role matrix into enforceable backend rules covering:

```text
- authentication
- role checks
- tenant isolation
- ownership
- team access
- advisor assignment
- support/admin access
- entitlements
- workflow state rules
- file visibility
- payment visibility
- notification visibility
- admin actions
- API access
- DocType access
- field-level access
- QA permission tests
```

This is a Phase 2 planning document. It does not implement permissions. It defines what Phase 3 Frappe implementation must enforce.

The purpose is simple: the platform must never rely on the frontend alone to protect records, actions, payments, files, or admin functions. A hidden button is not a permission model. It is decorative security, which is security’s most embarrassing cousin.

---

## 2. Scope

This document applies to the following platform areas:

```text
Public website
Authentication and user context
Portal/dashboard
Membership
Decision Desk
DocuShare
Marketplace
Connectivity / NBN
Risk Advisor
The Fixer
Applications portal
Documents
Billing / payments
Notifications
File uploads
Admin operations
Tenant/account management
Audit logging
Workflow transitions
```

This document covers:

```text
- API permission checks
- service-layer permission checks
- Frappe DocType permissions
- Frappe workflow permissions
- tenant and owner filtering
- file and payment visibility
- admin action authority
- frontend permission hints
- QA/security requirements
```

This document does not define final field lists for every DocType. Those belong in:

```text
05-core-doctype-model.md
12-form-field-specifications.md
```

This document does not define final workflow transitions in full detail. Those belong in:

```text
06-workflow-state-standards.md
```

---

## 3. Related Phase 2 Documents

This permission model depends on:

```text
index.md
01-api-response-envelope-standard.md
02-naming-conventions.md
03-role-matrix.md
05-core-doctype-model.md
06-workflow-state-standards.md
07-error-catalogue.md
08-payment-state-model.md
09-upload-file-rules.md
14-notification-triggers.md
15-admin-actions.md
16-mock-to-real-api-map.md
```

The most important dependency is:

```text
03-role-matrix.md
```

The role matrix defines who exists. This permission model defines what those roles can actually do.

---

## 4. Permission Model Principles

All permission rules must follow these principles:

| Principle | Rule |
|---|---|
| Backend is authoritative | Permissions must be enforced by Frappe/backend, not only by frontend route guards. |
| Tenant isolation first | Customer records must be scoped to the correct tenant before any broader access is granted. |
| Least privilege | Users receive only the access required for their role, assignment, entitlement, and workflow state. |
| Role is not enough | Access must also consider owner, tenant, entitlement, assignment, workflow state, and visibility. |
| Admin is scoped | `RBP Admin` manages RBP platform operations but should not be treated as the same as Frappe `Administrator`. |
| Assignments matter | Advisors and support users should access assigned or queued records, not all records by default. |
| Files are protected records | File access must use explicit visibility rules and related-record checks. |
| Payment data is sensitive | Payment events and raw payloads must be restricted. |
| Auditability | Permission-sensitive actions must create audit records where appropriate. |
| Predictable errors | Permission failures must use the standard API response envelope and error catalogue. |

---

## 5. Permission Decision Formula

An action is allowed only when all required checks pass:

```text
Authentication
+ Role
+ Tenant
+ Ownership or assignment
+ Entitlement
+ Workflow state
+ File/payment/notification visibility
+ API method permission
+ DocType permission
= Action allowed
```

If any required check fails, the backend must deny the action.

Recommended internal decision flow:

```text
1. Resolve current user.
2. Resolve user roles.
3. Resolve tenant context.
4. Resolve target record.
5. Check record tenant.
6. Check ownership/team access.
7. Check assignment, if advisor/support flow.
8. Check entitlement, if product access depends on plan/app rights.
9. Check workflow state.
10. Check requested action.
11. Check field/file/payment visibility.
12. Return allowed or denied.
13. Record audit event if required.
```

---

## 6. Canonical Roles

The permission model uses the canonical roles from the role matrix:

```text
Guest
Website User
RBP Member
RBP Business Owner
RBP Team Member
RBP Advisor
RBP Marketplace Seller
RBP Marketplace Buyer
RBP Support Agent
RBP Admin
System Manager
Administrator
```

API role values:

```text
guest
website_user
rbp_member
rbp_business_owner
rbp_team_member
rbp_advisor
rbp_marketplace_seller
rbp_marketplace_buyer
rbp_support_agent
rbp_admin
system_manager
administrator
```

---

## 7. Permission Action Names

Permission actions must use these canonical action names:

```text
create
read
update
submit
cancel
delete
assign
approve
reject
archive
admin_review
request_more_information
attach_file
view_file
view_payment
manage_payment
view_notification
manage_notification
view_audit_log
manage_user
manage_role
manage_tenant
```

Backend helper functions should use `can_<action>_<resource>` or `can_<action>` patterns:

```python
can_create_request()
can_read_request()
can_update_request()
can_submit_request()
can_attach_file()
can_assign_advisor()
can_admin_review_request()
can_view_payment_event()
can_view_file_reference()
```

Do not create random action names such as:

```text
make
do_submit
adminThing
reviewNow
processStuff
```

Humanity has already suffered enough from vague verbs.

---

## 8. Core Permission Dimensions

## 8.1 Authentication

| User State | Access Rule |
|---|---|
| Guest | Public pages and explicitly whitelisted APIs only |
| Authenticated | Own context and role-authorised resources |
| Session expired | Deny protected actions with `not_authenticated` |
| Disabled user | Deny all non-public actions |
| Suspended user | Deny portal, submission, upload, and payment actions unless admin override applies |

Authentication must be checked before role, tenant, or ownership checks.

---

## 8.2 Role

Roles determine broad capability, but they do not grant final access alone.

Example:

```text
RBP Member can create a Decision Desk request only if:
- user is authenticated
- user has active member role
- user has required entitlement
- user belongs to a tenant
- target record belongs to their tenant or is being created for their tenant
```

---

## 8.3 Tenant

Tenant access is the central platform boundary.

A user may access tenant records only when:

```text
- they are the business owner of that tenant
- they are a team member of that tenant and the record is shared/allowed
- they created/own the record and the record belongs to that tenant
- they are assigned to the record as advisor/support
- they are RBP Admin, System Manager, or Administrator
```

Cross-tenant access must be denied by default.

---

## 8.4 Ownership

Ownership checks apply to customer-created records.

A user can usually read/update their own draft records if:

```text
- they created the record
- the record belongs to their tenant
- the record is in a workflow state that permits customer edits
```

Ownership alone does not permit admin actions, workflow overrides, payment changes, or access to another tenant.

---

## 8.5 Assignment

Assignment applies mainly to:

```text
RBP Advisor
RBP Support Agent
Admin operations
```

Advisor/support access should be granted only when:

```text
- the record is assigned to the user, or
- the user belongs to an authorised queue/team, or
- an RBP Admin grants explicit operational access
```

---

## 8.6 Entitlement

Entitlements determine whether a tenant/user can access a product or service.

Example entitlement keys:

```text
membership
decision_desk
docushare
marketplace
connectivity
risk_advisor
fixer
portal
billing
```

A user may have the right role but still lack entitlement.

Example:

```text
A user with RBP Member role may be blocked from premium Decision Desk requests if their plan does not include that entitlement.
```

Entitlements must be checked in the service layer before record creation or submission.

---

## 8.7 Workflow State

Workflow state controls what actions are permitted at a point in the record lifecycle.

Example:

```text
Draft:
  customer can update and submit

Submitted:
  customer usually cannot edit core fields
  admin/support can review

In Review:
  admin/support/advisor actions begin

Assigned:
  advisor can work on assigned record

Outcome Ready:
  customer can view outcome
  admin/advisor can close

Closed:
  edits are locked except admin/archive actions
```

---

## 8.8 Visibility

Visibility applies to files, notifications, payment records, audit logs, and internal notes.

Visibility must be explicit. If visibility is not set, default to the safest option.

Recommended defaults:

| Object | Default Visibility |
|---|---|
| Customer-created service record | Owner/tenant scoped |
| Uploaded file | `private_to_owner` |
| Advisor note | Assigned advisor/admin only |
| Admin note | Admin only |
| Payment event | Admin/business owner summary only |
| Raw payment payload | System Manager/Administrator only |
| Audit log | Admin/system only |
| Notification | Intended recipient/tenant/admin scoped |

---

## 9. Permission Enforcement Layers

Permission enforcement must happen across multiple layers.

## 9.1 Frontend Layer

Frontend may:

```text
- hide unavailable routes
- hide unavailable buttons
- disable actions
- show permission messages
- use user-context flags
- route unauthenticated users to login
```

Frontend must not be the final permission authority.

---

## 9.2 API Layer

API methods must:

```text
- validate session
- validate request arguments
- call service layer
- never trust frontend role claims
- never trust frontend tenant IDs without verification
- return standard response envelope
```

API module examples:

```text
rbp_app.api.membership
rbp_app.api.decision_desk
rbp_app.api.docushare
rbp_app.api.marketplace
rbp_app.api.connectivity
rbp_app.api.risk_advisor
rbp_app.api.fixer
rbp_app.api.portal
rbp_app.api.billing
rbp_app.api.notifications
```

---

## 9.3 Service Layer

Service layer must own business permission logic.

Service modules should check:

```text
- current user
- roles
- tenant
- ownership
- entitlement
- workflow state
- assignment
- file visibility
- payment visibility
- admin authority
```

Recommended service modules:

```text
rbp_app.services.tenancy
rbp_app.services.entitlements
rbp_app.services.files
rbp_app.services.billing
rbp_app.services.notifications
rbp_app.services.audit
```

---

## 9.4 Frappe DocType Layer

Frappe DocType permissions must provide baseline protection.

DocType-level permissions should define:

```text
- read
- write
- create
- delete
- submit
- cancel
- amend
- report
- export
- import
- print
- email
```

For sensitive objects, default to restrictive permissions and expand through service methods.

---

## 9.5 Frappe Workflow Layer

Workflow transitions must define which roles can move records between states.

Workflow permissions must be aligned with:

```text
06-workflow-state-standards.md
```

---

## 9.6 Query Filtering Layer

List APIs must filter records server-side.

Example list methods:

```text
list_my_requests
list_my_briefs
list_my_listings
list_my_orders
list_my_assessments
list_my_notifications
```

These methods must never return all records and expect frontend filtering.

---

## 10. Global Role Permission Baseline

| Role | Create | Read | Update | Submit | Admin Review | Notes |
|---|---:|---:|---:|---:|---:|---|
| Guest | Limited public forms only | Public only | No | No | No | Explicit whitelist required |
| Website User | Own drafts | Own records | Own drafts | Conditional | No | Limited onboarding/account access |
| RBP Member | Member records | Own/team records | Own drafts | Own/member records | No | Entitlement required |
| RBP Business Owner | Tenant/member records | Tenant records | Tenant drafts/profile | Tenant/member records | No | Tenant authority |
| RBP Team Member | Conditional | Shared/assigned tenant records | Conditional | Conditional | No | Tenant policy required |
| RBP Advisor | No customer creation | Assigned records | Advisor fields | Recommendations/outcomes | No | Assignment required |
| RBP Marketplace Seller | Listing drafts | Own listings/enquiries | Own draft/rejected listings | Listings for review | No | Cannot approve own listings |
| RBP Marketplace Buyer | Enquiries | Own enquiries | Own draft enquiries | Enquiries | No | Buyer-only marketplace access |
| RBP Support Agent | Conditional | Assigned/queue records | Support fields | Conditional | Conditional | Operationally constrained |
| RBP Admin | Yes | All RBP records | All operational records | Yes | Yes | Platform admin |
| System Manager | Yes | All | All | Yes | Yes | System-level |
| Administrator | Yes | All | All | Yes | Yes | Top-level technical access |

---

## 11. Core DocType Permission Matrix

## 11.1 Platform-Level DocTypes

Core platform DocTypes:

```text
RBP Tenant
RBP Business Profile
RBP Membership Plan
RBP Subscription
RBP App Entitlement
RBP Onboarding Flow
RBP Onboarding Step
RBP Notification
RBP Audit Log
RBP Payment Event
RBP File Reference
```

| DocType | Guest | Website User | RBP Member | Business Owner | Team Member | Advisor | Support Agent | RBP Admin | System Manager |
|---|---|---|---|---|---|---|---|---|---|
| RBP Tenant | None | None/own pending | Tenant read | Tenant read/update limited | Read limited | None | Conditional | Full | Full |
| RBP Business Profile | None | Own draft | Own/tenant read | Tenant read/update | Read limited | None | Conditional | Full | Full |
| RBP Membership Plan | Public read | Read | Read | Read | Read | Read | Read | Full | Full |
| RBP Subscription | None | Own limited | Own limited | Tenant read/manage | None | None | Conditional | Full | Full |
| RBP App Entitlement | None | Own limited | Own/tenant read | Tenant read | Limited | None | Conditional | Full | Full |
| RBP Onboarding Flow | Public/conditional | Own | Own | Tenant | Conditional | None | Conditional | Full | Full |
| RBP Onboarding Step | Public/conditional | Own | Own | Tenant | Conditional | None | Conditional | Full | Full |
| RBP Notification | None | Own | Own/tenant | Tenant | Conditional | Assigned | Assigned/queue | Full | Full |
| RBP Audit Log | None | None | Limited/own if exposed | Limited/tenant if exposed | None | None | Conditional | Read/full operational | Full |
| RBP Payment Event | None | None | Own summary only | Tenant summary/manage limited | None | None | Conditional | Full | Full |
| RBP File Reference | None | Own visible | Own/tenant visible | Tenant visible | Conditional | Assigned visible | Assigned/queue visible | Full | Full |

### Notes

```text
Full = create/read/update/delete/admin according to operational need.
Limited = restricted to specific fields or summary views.
Conditional = requires assignment, tenant, workflow, or service context.
None = no access.
```

---

## 12. Product DocType Permission Matrix

Product DocTypes:

```text
RBP Decision Desk Request
RBP Decision Desk Option
RBP Document Brief
RBP Marketplace Listing
RBP Marketplace Enquiry
RBP Connectivity Order
RBP Risk Assessment
RBP Fixer Request
```

| DocType | Website User | RBP Member | Business Owner | Team Member | Advisor | Seller | Buyer | Support Agent | RBP Admin |
|---|---|---|---|---|---|---|---|---|---|
| RBP Decision Desk Request | Own draft/conditional | Own/tenant | Tenant | Conditional | Assigned | None | None | Assigned/queue | Full |
| RBP Decision Desk Option | Own/conditional | Own/tenant | Tenant | Conditional | Assigned read | None | None | Assigned/queue | Full |
| RBP Document Brief | Own draft/conditional | Own/tenant | Tenant | Conditional | Assigned/reviewer | None | None | Assigned/queue | Full |
| RBP Marketplace Listing | Own draft if seller | Conditional | Tenant if owner/seller | Conditional | None | Own | None | Conditional | Full |
| RBP Marketplace Enquiry | Own | Own | Tenant if related | Conditional | None | Own listing enquiries | Own | Conditional | Full |
| RBP Connectivity Order | Own draft/conditional | Own/tenant | Tenant | Conditional | None | None | None | Assigned/queue | Full |
| RBP Risk Assessment | Own draft/conditional | Own/tenant | Tenant | Conditional | Assigned | None | None | Assigned/queue | Full |
| RBP Fixer Request | Own draft/conditional | Own/tenant | Tenant | Conditional | None/assigned if relevant | None | None | Assigned/queue | Full |

---

## 13. Domain Permission Rules

## 13.1 Membership

### Create

Allowed:

```text
Guest or Website User may start signup if public signup is enabled.
Website User may create own business profile during onboarding.
RBP Business Owner may manage tenant membership.
RBP Admin/System Manager may create or correct membership records.
```

Denied:

```text
Guest cannot access private membership records.
Team Member cannot manage subscription by default.
Member cannot alter payment state directly.
```

### Read

```text
RBP Member may read own membership status.
Business Owner may read tenant membership/subscription.
RBP Admin may read all membership operational records.
```

### Update

```text
Business Owner may update tenant business profile.
RBP Admin may update operational fields.
Payment/subscription state should be updated by backend payment event processing or admin-authorised actions.
```

---

## 13.2 Decision Desk

### Create/Submit

```text
RBP Member and Business Owner may create and submit Decision Desk requests if entitled.
Website User may only create/submit if the service allows authenticated non-member intake.
Team Member may create/submit only if tenant policy permits.
```

### Read

```text
Owner may read own request.
Business Owner may read tenant requests.
Team Member may read shared/assigned tenant requests.
Advisor may read assigned requests.
Support Agent may read assigned/queue requests.
RBP Admin may read all.
```

### Update

```text
Customer-side users may update draft records only.
Advisor may update advisor/recommendation fields on assigned records.
Support Agent may update support/admin fields where permitted.
RBP Admin may update operational fields and workflow state.
```

### Admin Review

```text
Only RBP Admin, System Manager, or explicitly permitted Support Agent may perform admin review.
```

---

## 13.3 DocuShare

### Create/Submit

```text
RBP Member and Business Owner may create and submit document briefs if entitled.
Team Member requires tenant permission.
Website User requires explicit non-member service access.
```

### Read/Update

```text
Customer users may read own/tenant briefs.
Customer users may update draft briefs only.
Reviewers/advisors may access assigned briefs.
RBP Admin may access all.
```

### Files

```text
Reference files must follow RBP File Reference visibility rules.
Admin-only review files must not be visible to customer users unless explicitly shared.
```

---

## 13.4 Marketplace

### Public Listing Access

```text
Guest may view published public listings.
Website User/RBP Member may view published listings.
```

### Seller Access

```text
RBP Marketplace Seller may create listing drafts.
Seller may update own draft or rejected listings.
Seller may submit listings for review.
Seller may not approve, publish, or reject their own listing.
```

### Buyer Access

```text
RBP Marketplace Buyer or authenticated users may create enquiries where allowed.
Buyer may view own enquiries.
Buyer may not view seller-private data.
```

### Admin Access

```text
RBP Admin may approve, reject, publish, archive, or moderate listings.
```

---

## 13.5 Connectivity / NBN

### Create/Submit

```text
Website User may create order draft if public/authenticated intake is enabled.
RBP Member and Business Owner may create/submit orders.
Team Member requires tenant permission.
```

### Read

```text
Owner may view own order.
Business Owner may view tenant orders.
Support Agent may view assigned/provisioning queue orders.
RBP Admin may view all.
```

### Update

```text
Customer may update draft order only.
Support/Admin may update provisioning/admin status.
Payment/serviceability state must be backend-controlled.
```

---

## 13.6 Risk Advisor

### Create/Submit

```text
RBP Member and Business Owner may create and submit risk assessments if entitled.
Team Member requires tenant permission.
```

### Read/Update

```text
Customer may view own/tenant assessments.
Advisor may view assigned assessments.
Advisor may update advisor-only assessment fields.
RBP Admin may update all operational fields.
```

---

## 13.7 The Fixer

### Create/Submit

```text
RBP Member and Business Owner may create and submit Fixer requests if entitled.
Website User access is conditional on product rules.
Team Member requires tenant permission.
```

### Read/Update

```text
Customer may update draft requests only.
Support/Admin may update operational state.
Customer may view submitted status and outcome fields.
Internal notes remain hidden unless explicitly shared.
```

---

## 14. Field-Level Permission Rules

Some records need field-level restrictions.

## 14.1 Customer-Editable Fields

Customer-editable fields are generally allowed only in `Draft` or `More Information Required` states.

Examples:

```text
business_context
decision_summary
options_considered
constraints
desired_outcome
supporting_documents
preferred_contact_method
deadline
urgency
```

## 14.2 Internal/Admin Fields

Internal/admin fields must not be editable by customer-side users.

Examples:

```text
assigned_to
internal_notes
admin_review_status
priority_override
workflow_state
admin_outcome_summary
rejection_reason
audit_reference
payment_reconciliation_status
```

## 14.3 Advisor Fields

Advisor fields are editable by assigned advisors and admins only.

Examples:

```text
advisor_notes
recommendation_summary
recommendation_document
risk_comments
review_outcome
advisor_status
```

## 14.4 Payment Fields

Payment fields are backend/admin controlled.

Examples:

```text
payment_provider
provider_customer_id
provider_subscription_id
provider_event_id
provider_payment_id
payment_status
raw_payload
processed_on
```

Customer users may view safe summaries only.

## 14.5 File Visibility Fields

File visibility must be set by backend defaults or authorised admin action.

Examples:

```text
visibility
related_doctype
related_name
uploaded_by
uploaded_on
status
```

---

## 15. Workflow Permission Rules

Generic workflow states:

```text
Draft
Submitted
In Review
Assigned
In Progress
Outcome Ready
Closed
Payment Pending
Payment Failed
More Information Required
Rejected
Cancelled
Archived
```

## 15.1 Customer-Side Transitions

Customer-side users may generally perform:

```text
Draft → Submitted
More Information Required → Submitted
Draft → Cancelled
Submitted → Cancelled, only if product rules permit
Outcome Ready → Closed, only if product rules permit
```

## 15.2 Admin Transitions

RBP Admin may generally perform:

```text
Submitted → In Review
In Review → Assigned
Assigned → In Progress
In Progress → Outcome Ready
Any active state → More Information Required
Any active state → Rejected
Any active state → Cancelled
Any complete/inactive state → Archived
```

## 15.3 Advisor Transitions

Assigned Advisor may generally perform:

```text
Assigned → In Progress
In Progress → Outcome Ready
Any active assigned state → More Information Required, if permitted
```

## 15.4 Support Agent Transitions

Support Agent may perform operational transitions only where explicitly permitted:

```text
Submitted → In Review
In Review → Assigned
Any active state → More Information Required
```

Support Agent transition authority must be product-specific.

---

## 16. File Permission Rules

File visibility values:

```text
private_to_owner
tenant_visible
advisor_visible
admin_only
public
```

## 16.1 Upload Rules

A user may upload a file only if:

```text
- user is authenticated unless public upload is explicitly allowed
- user can access the related record
- user can attach files to that record type
- workflow state allows attachment
- file type is allowed
- file size is within limit
- file is linked to correct related_doctype and related_name
```

## 16.2 View Rules

A user may view a file only if:

```text
- file visibility allows it
- user can access the related record
- tenant matches or admin/assignment exception applies
- file is not admin-only unless user is authorised
```

## 16.3 Default Visibility

| Upload Context | Default Visibility |
|---|---|
| Customer supporting document | `private_to_owner` or `tenant_visible` depending on product |
| Advisor uploaded recommendation | `advisor_visible` until shared |
| Admin uploaded document | `admin_only` unless shared |
| Marketplace public media | `public` only after listing is approved/published |
| Payment evidence | `admin_only` |

---

## 17. Payment Permission Rules

Payment states:

```text
not_required
pending
authorised
paid
failed
refunded
cancelled
disputed
```

## 17.1 Customer Visibility

Customer-side users may view:

```text
- payment status summary
- amount
- currency
- related subscription/order/request
- safe provider reference if needed
```

Customer-side users must not view:

```text
- raw webhook payloads
- provider secrets
- reconciliation notes
- internal fraud/dispute notes
```

## 17.2 Admin Visibility

RBP Admin may view and reconcile operational payment information.

System Manager and Administrator may view full technical payment event information where required.

## 17.3 Mutation Rules

Payment event creation and updates must be controlled by:

```text
- payment provider webhook processing
- backend service methods
- authorised admin reconciliation actions
```

Frontend must never be trusted to set final payment state.

---

## 18. Notification Permission Rules

A user may view a notification only if:

```text
- they are the intended recipient
- the notification belongs to their tenant and tenant visibility permits it
- they are assigned to the related record
- they are RBP Admin/System Manager
```

Notification creation must be triggered by backend events such as:

```text
membership_purchased
decision_desk_request_submitted
advisor_assigned
more_information_requested
document_brief_submitted
marketplace_listing_approved
connectivity_order_received
risk_assessment_completed
fixer_request_accepted
payment_failed
subscription_renewed
```

Manual notification creation should be admin-only or support-admin controlled.

---

## 19. Audit Log Permission Rules

Audit logs must be created for permission-sensitive actions.

Examples:

```text
record_created
record_updated
record_submitted
workflow_transitioned
advisor_assigned
payment_event_recorded
file_attached
notification_created
permission_denied
admin_action_performed
```

## 19.1 Audit Access

| User Type | Audit Access |
|---|---|
| Guest | None |
| Website User | None |
| RBP Member | None or very limited safe history |
| Business Owner | Limited tenant activity summary if product requires |
| Advisor | None by default |
| Support Agent | Conditional operational access |
| RBP Admin | Operational audit access |
| System Manager | Full audit access |
| Administrator | Full audit access |

Audit logs should not be deleted by ordinary admin operations.

---

## 20. Admin Action Permission Rules

Admin actions must be explicit, named, and permission-checked.

Examples:

```text
admin_assign_advisor
admin_request_more_information
admin_approve_listing
admin_reject_listing
admin_publish_listing
admin_close_request
admin_archive_record
admin_reconcile_payment
admin_share_file
admin_change_file_visibility
```

## 20.1 Admin Action Requirements

Every admin action must define:

```text
- action name
- allowed roles
- target DocType
- allowed source workflow states
- resulting workflow state, if any
- required fields
- notification trigger
- audit log event
- error states
```

## 20.2 Admin Action Access

| Role | Admin Action Authority |
|---|---|
| RBP Admin | Full RBP operational admin actions |
| System Manager | Full RBP and system actions |
| Administrator | Full access |
| RBP Support Agent | Limited product-specific actions only |
| RBP Advisor | Assigned advisory actions only |
| Customer-side roles | No admin actions |

---

## 21. Public and Guest Permission Rules

Guest users may access:

```text
- public website pages
- public service descriptions
- public legal pages
- public marketplace listings if enabled
- public membership plan summaries
- explicitly whitelisted lead/enquiry endpoints
```

Guest users must not access:

```text
- portal records
- tenant records
- billing records
- payment events
- private files
- admin routes
- internal status fields
- workflow actions
```

If public form submission is allowed, it must create a restricted lead/intake record, not a fully privileged tenant/member record unless the signup/payment/onboarding process completes.

---

## 22. API Permission Rules

Every protected API endpoint must follow this pattern:

```text
1. Validate method/session.
2. Validate payload.
3. Resolve user context.
4. Resolve tenant context.
5. Check role/entitlement.
6. Check record access if record exists.
7. Check action permission.
8. Perform service operation.
9. Return standard response envelope.
```

## 22.1 Create APIs

Create APIs must check:

```text
- authenticated or explicitly public
- role can create this resource
- tenant can be resolved or created safely
- entitlement permits creation
- payload does not include forbidden fields
```

Example:

```text
POST /api/method/rbp_app.api.decision_desk.create_request
```

## 22.2 Update APIs

Update APIs must check:

```text
- user can read target record
- user can update target record
- record workflow state allows update
- payload fields are editable by this user
```

## 22.3 Submit APIs

Submit APIs must check:

```text
- user can read target record
- user can submit target record
- required fields are complete
- validation rules pass
- entitlement/payment requirements pass
- workflow transition is allowed
```

## 22.4 List APIs

List APIs must:

```text
- filter records server-side
- apply tenant, owner, assignment, and admin rules
- never expose records from other tenants
- return safe DTOs only
```

## 22.5 Admin APIs

Admin APIs must:

```text
- require admin/support/advisor authority as appropriate
- validate workflow state
- validate target DocType
- record audit log
- trigger notification if required
```

---

## 23. Frontend Permission Contract

The frontend should use a safe user context endpoint such as:

```text
GET /api/method/rbp_app.api.me.get_context
```

The response should include safe flags such as:

```json
{
  "permissions": {
    "can_access_portal": true,
    "can_access_admin": false,
    "can_manage_billing": true,
    "can_create_decision_desk_request": true,
    "can_create_marketplace_listing": false
  }
}
```

Frontend may use these flags to:

```text
- show/hide navigation
- show/hide CTAs
- disable buttons
- show upgrade prompts
- redirect unauthorised users
```

Frontend must still handle backend permission failures gracefully.

---

## 24. Standard Permission Error Responses

Permission failures must use the standard API envelope.

## 24.1 Not Authenticated

```json
{
  "ok": false,
  "data": null,
  "message": "Authentication required",
  "errors": [
    {
      "field": null,
      "code": "not_authenticated",
      "message": "You must be logged in to perform this action."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

## 24.2 Permission Denied

```json
{
  "ok": false,
  "data": null,
  "message": "Permission denied",
  "errors": [
    {
      "field": null,
      "code": "permission_denied",
      "message": "You do not have permission to access this record."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

## 24.3 Entitlement Required

```json
{
  "ok": false,
  "data": null,
  "message": "Entitlement required",
  "errors": [
    {
      "field": null,
      "code": "entitlement_required",
      "message": "Your current plan does not include access to this service."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

## 24.4 Workflow Transition Denied

```json
{
  "ok": false,
  "data": null,
  "message": "Workflow transition denied",
  "errors": [
    {
      "field": "workflow_state",
      "code": "workflow_transition_denied",
      "message": "This record cannot be moved to the requested state."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

## 24.5 Cross-Tenant Access Denied

```json
{
  "ok": false,
  "data": null,
  "message": "Permission denied",
  "errors": [
    {
      "field": null,
      "code": "tenant_access_denied",
      "message": "You do not have access to this tenant record."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

---

## 25. Recommended Backend Helper Functions

Recommended module:

```text
rbp_app/permissions.py
```

Suggested functions:

```python
def get_user_roles(user: str) -> list[str]:
    ...

def get_user_tenants(user: str) -> list[str]:
    ...

def resolve_tenant(user: str, payload: dict | None = None) -> str:
    ...

def can_access_tenant(user: str, tenant: str) -> bool:
    ...

def can_read_record(user: str, doctype: str, name: str) -> bool:
    ...

def can_update_record(user: str, doctype: str, name: str) -> bool:
    ...

def can_submit_record(user: str, doctype: str, name: str) -> bool:
    ...

def can_attach_file(user: str, doctype: str, name: str) -> bool:
    ...

def can_view_file(user: str, file_reference: str) -> bool:
    ...

def can_view_payment_event(user: str, payment_event: str) -> bool:
    ...

def can_perform_admin_action(user: str, action: str, doctype: str, name: str) -> bool:
    ...

def require_permission(condition: bool, code: str, message: str):
    ...
```

Recommended guard module:

```text
rbp_app/guards.py
```

Suggested guard functions:

```python
require_authenticated_user()
require_role(user, roles)
require_tenant_access(user, tenant)
require_entitlement(user, tenant, entitlement_key)
require_record_access(user, doctype, name, action)
require_admin_action(user, action, doctype, name)
```

---

## 26. Frappe DocPerm Draft Guidance

Frappe DocType permissions should follow these broad defaults.

## 26.1 Customer Product Records

Examples:

```text
RBP Decision Desk Request
RBP Document Brief
RBP Connectivity Order
RBP Risk Assessment
RBP Fixer Request
```

Recommended baseline:

| Role | Read | Write | Create | Submit | Delete |
|---|---:|---:|---:|---:|---:|
| RBP Member | Own/Tenant | Draft only | Yes | Yes | No |
| RBP Business Owner | Tenant | Draft only | Yes | Yes | No |
| RBP Team Member | Conditional | Conditional | Conditional | Conditional | No |
| RBP Advisor | Assigned | Advisor fields | No | Conditional | No |
| RBP Support Agent | Assigned/Queue | Support fields | Conditional | Conditional | No |
| RBP Admin | All | All | Yes | Yes | Conditional |
| System Manager | All | All | Yes | Yes | Yes |

## 26.2 Operational Records

Examples:

```text
RBP Payment Event
RBP Audit Log
RBP File Reference
RBP Notification
```

Recommended baseline:

| Role | Read | Write | Create | Delete |
|---|---:|---:|---:|---:|
| Customer roles | Limited/safe only | No | No | No |
| Advisor | Assigned/safe only | Limited | No | No |
| Support Agent | Conditional | Conditional | Conditional | No |
| RBP Admin | Yes | Yes | Yes | Conditional |
| System Manager | Yes | Yes | Yes | Conditional |
| Administrator | Yes | Yes | Yes | Yes |

## 26.3 Configuration Records

Examples:

```text
RBP Membership Plan
RBP App Entitlement
RBP Onboarding Flow
RBP Onboarding Step
```

Recommended baseline:

| Role | Read | Write | Create | Delete |
|---|---:|---:|---:|---:|
| Guest | Public read only where applicable | No | No | No |
| Customer roles | Read where applicable | No | No | No |
| RBP Admin | Yes | Yes | Yes | Conditional |
| System Manager | Yes | Yes | Yes | Yes |
| Administrator | Yes | Yes | Yes | Yes |

---

## 27. Permission Query Conditions

List views and APIs must enforce query-level restrictions.

Examples:

## 27.1 Customer List Query Logic

```text
Return records where:
- record.owner == current user
OR
- record.tenant in current_user_tenants AND role permits tenant visibility
```

## 27.2 Business Owner List Query Logic

```text
Return records where:
- record.tenant == business_owner_tenant
```

## 27.3 Team Member List Query Logic

```text
Return records where:
- record.tenant in user_tenants
AND record is shared with user or team policy permits access
```

## 27.4 Advisor List Query Logic

```text
Return records where:
- record.assigned_to == current user
OR
- record has advisor assignment entry for current user
```

## 27.5 Support Agent List Query Logic

```text
Return records where:
- record.assigned_to == current user
OR
- record is in a support queue assigned to the user
OR
- product-specific support permissions allow queue access
```

## 27.6 Admin List Query Logic

```text
Return RBP records according to admin role and operational filters.
```

No list endpoint should return unfiltered records and expect the frontend to behave like a responsible adult.

---

## 28. Security Requirements

The permission model must support these non-negotiable security requirements:

```text
No guest access to portal records.
No cross-tenant data leakage.
No unauthorised admin route access.
No client-side-only permission enforcement.
No customer-side mutation of internal/admin fields.
No unauthorised workflow transitions.
No unauthorised advisor access to unassigned records.
No marketplace seller approval of own listings.
No exposure of raw payment provider payloads to customer users.
No public exposure of private uploaded files.
No unauthorised visibility changes for files.
No deletion of audit logs by normal users.
```

---

## 29. QA Permission Test Requirements

## 29.1 Tenant Isolation Tests

```text
test_member_cannot_read_other_tenant_decision_desk_request
test_business_owner_cannot_read_other_tenant_subscription
test_team_member_cannot_read_unshared_tenant_record
test_advisor_cannot_read_unassigned_other_tenant_record
test_support_agent_cannot_read_unassigned_private_record
```

## 29.2 Role Tests

```text
test_guest_cannot_access_portal_api
test_website_user_can_create_own_draft_only
test_member_can_submit_entitled_service_request
test_business_owner_can_view_tenant_records
test_team_member_access_requires_tenant_policy
test_advisor_can_update_assigned_advisor_fields
test_seller_cannot_approve_own_listing
test_buyer_cannot_edit_listing
test_support_agent_has_limited_admin_actions
test_rbp_admin_can_admin_review_record
```

## 29.3 Workflow Tests

```text
test_customer_can_submit_draft
test_customer_cannot_edit_submitted_core_fields
test_admin_can_move_submitted_to_in_review
test_advisor_can_move_assigned_to_in_progress
test_unassigned_advisor_cannot_transition_record
test_closed_record_rejects_customer_update
```

## 29.4 File Tests

```text
test_private_file_visible_to_owner_only
test_tenant_visible_file_visible_to_business_owner
test_advisor_visible_file_visible_to_assigned_advisor
test_admin_only_file_hidden_from_member
test_marketplace_media_public_only_after_approval
```

## 29.5 Payment Tests

```text
test_member_can_view_payment_summary_only
test_business_owner_can_view_tenant_subscription_summary
test_member_cannot_view_raw_payment_payload
test_frontend_cannot_set_paid_status
test_payment_webhook_records_payment_event
test_admin_can_reconcile_payment_event
```

## 29.6 API Error Tests

```text
test_not_authenticated_returns_standard_envelope
test_permission_denied_returns_standard_envelope
test_entitlement_required_returns_standard_envelope
test_workflow_transition_denied_returns_standard_envelope
test_tenant_access_denied_returns_standard_envelope
```

---

## 30. Open Items for Final Phase 2 Lock

These items must be confirmed after Phase 1 UI/UX is complete:

| Item | Status | Notes |
|---|---|---|
| Final public form guest permissions | Draft | Depends on final UI flows |
| Final Team Member authority | Draft | Business rule required |
| Final entitlement-to-service mapping | Draft | Depends on membership packaging |
| Final marketplace guest/buyer rules | Draft | Depends on marketplace model |
| Final admin route list | Draft | Depends on admin UI completion |
| Final advisor workflow powers | Draft | Depends on service delivery process |
| Final support queue permissions | Draft | Depends on operations model |
| Final payment summary visibility | Draft | Depends on billing UX |
| Final file visibility defaults per product | Draft | Depends on upload/file contract |
| Final field-level permission map | Draft | Depends on form fields and DocTypes |
| Final notification visibility rules | Draft | Depends on trigger map |

---

## 31. Permission Model Acceptance Checklist

This document is ready for Phase 2 draft use when:

```text
All canonical roles are referenced.
All permission dimensions are defined.
Permission decision formula is documented.
Tenant isolation rules are documented.
Ownership, assignment, entitlement, workflow, and visibility checks are documented.
API permission rules are documented.
DocType permission assumptions are documented.
Field-level permission rules are documented.
File permission rules are documented.
Payment permission rules are documented.
Notification permission rules are documented.
Audit log permission rules are documented.
Admin action permission rules are documented.
Frontend permission contract is documented.
Standard permission error responses are documented.
Backend helper functions are proposed.
Frappe DocPerm guidance is included.
Permission query conditions are included.
Security requirements are included.
QA permission tests are included.
Open items are listed for Phase 1-dependent finalisation.
```

---

## 32. Phase 2 Sign-Off Criteria

This permission model can be signed off only when:

```text
Every Phase 1 screen has a defined access rule.
Every form has create/update/submit permission rules.
Every product flow has role, tenant, entitlement, and workflow checks.
Every DocType has read/write/create/submit/admin rules.
Every upload has visibility and access rules.
Every payment touchpoint has view/manage rules.
Every notification has recipient and visibility rules.
Every admin action has allowed roles and audit requirements.
Every mock API has a real endpoint with permission rules.
Every denied action has a standard error response.
QA tests cover tenant isolation and role enforcement.
```

Until then, this remains a draft.

Draft is not failure. Draft is just honesty in a file extension.

---

## 33. Final Rule

Permissions must be enforced where the data lives:

```text
Frappe/backend first.
Frontend second.
Documentation always.
```

The frontend may guide the user. The backend must protect the platform.

---

## Phase 5 Contract Reconciliation Addendum

This contract has been reconciled against the Phase 3 rbp_app implementation for Phase 5 preflight.

Authoritative reconciliation record:

    docs/architecture/phase5-reconciliation/CONTRACT_PHASE3_RECONCILIATION.md

If this document conflicts with the Phase 3 implementation in endpoint names, response shapes, DocType names, role behavior, file handling, or payment behavior, the reconciliation record governs Phase 5 integration until a later contract-change PR updates the underlying contract.

Key Phase 5 decisions:

- rbp_app.api.the_fixer is the canonical backend API module for The Fixer.
- Phase 5 frontend integration will use the Phase 3 raw dictionary / serialized DocType response shape unless a later contract-change PR introduces a shared envelope.
- Phase 3 canonical DocType names may differ from early Phase 2 planning names.
- RBP File Reference is the canonical file wrapper.
- RBP Subscription and RBP Payment Event are the canonical payment/subscription models.
- Live payment provider integration and raw upload implementation remain deferred unless explicitly opened in Phase 5.

