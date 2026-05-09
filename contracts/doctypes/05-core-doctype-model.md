# RBP Phase 2 Backend Contracts
# 05-core-doctype-model.md

## Document Status

| Field | Value |
|---|---|
| Document | Core DocType Model |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/05-core-doctype-model.md` |
| Intended Final Location | `rbp-platform/contracts/doctypes/core-doctype-model.md` |
| Primary Consumers | Frappe backend, frontend API integration, QA, admin operations, data modelling |

---

## 1. Purpose

This document defines the core Frappe DocType model for the Remote Business Partner Platform.

It describes the required platform-level and product-level DocTypes that Phase 3 must implement inside `rbp_app`.

The purpose is to define:

```text
- what data is created
- who owns it
- how it relates to tenants and users
- which workflows it participates in
- which roles can access it
- which APIs create, read, update, or submit it
- which files, payments, notifications, and audit events relate to it
- what validation and indexing rules are required
```

This document is a Phase 2 planning contract. It is not Frappe implementation code.

The entire point is to stop the backend from improvising database tables like a jazz musician with unresolved childhood issues.

---

## 2. Scope

This document covers:

```text
Platform-level DocTypes
Product-level DocTypes
Shared field standards
Relationships between DocTypes
Tenant and ownership rules
Workflow participation
Payment event linkage
File reference linkage
Notification linkage
Audit logging
API mapping
Validation requirements
Permission requirements
Test requirements
Open items for final lock
```

This document does not define every final form field from the frontend. UI-dependent form fields belong in:

```text
12-form-field-specifications.md
```

This document does not define final route-to-endpoint mapping. That belongs in:

```text
11-route-to-endpoint-map.md
```

This document does not define full permission rules. Those belong in:

```text
04-permission-model-draft.md
```

---

## 3. Related Phase 2 Documents

This document should be read with:

```text
index.md
01-api-response-envelope-standard.md
02-naming-conventions.md
03-role-matrix.md
04-permission-model-draft.md
06-workflow-state-standards.md
07-error-catalogue.md
08-payment-state-model.md
09-upload-file-rules.md
14-notification-triggers.md
11-route-to-endpoint-map.md
12-form-field-specifications.md
13-validation-rules.md
15-admin-actions.md
16-mock-to-real-api-map.md
17-phase-2-acceptance-gate.md
```

---

## 4. Core Modelling Principles

All DocTypes must follow these principles:

| Principle | Rule |
|---|---|
| RBP prefix | All custom DocTypes must start with `RBP`. |
| Tenant-first | Customer/business records must link to `RBP Tenant` where relevant. |
| Owner-aware | User-created records must record ownership and creator context. |
| Workflow-ready | Submission-based product records must support workflow state. |
| Permission-ready | DocTypes must support server-side permission enforcement. |
| API-ready | Fields must map cleanly to API payloads and DTOs. |
| File-ready | Records that accept uploads must link through `RBP File Reference`. |
| Payment-ready | Records requiring payment must link to `RBP Payment Event`. |
| Notification-ready | Important lifecycle events must support notifications. |
| Audit-ready | Important actions must support audit logging. |
| No Frappe core edits | Custom platform work belongs in `rbp_app`, not Frappe core. |

---

## 5. Naming Standard

### 5.1 DocType Naming

All custom DocTypes must use:

```text
RBP <Clear Title Case Name>
```

Examples:

```text
RBP Tenant
RBP Business Profile
RBP Decision Desk Request
RBP Payment Event
```

Do not use:

```text
Decision Desk Request
RBPDecisionDeskRequest
Remote Business Partner Decision Desk Request
RBP DD Request
```

### 5.2 Field Naming

Frappe fieldnames must use `snake_case`.

Examples:

```text
tenant
owner
workflow_state
submitted_on
assigned_to
payment_provider
related_doctype
related_name
```

### 5.3 API Field Naming

API JSON keys should also use `snake_case`.

Frontend TypeScript may map DTOs into camelCase UI models, but backend contracts should remain snake_case.

---

## 6. DocType Groups

## 6.1 Platform-Level DocTypes

These DocTypes support the platform foundation:

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

## 6.2 Product-Level DocTypes

These DocTypes support product/service flows:

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

---

## 7. Shared Fields for Product Records

Every submission-based product DocType should include these shared fields unless there is a documented reason not to.

| Fieldname | Type | Required | Purpose |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Yes | Customer/business tenant |
| `owner` | Data / User reference | Yes | Creator or record owner |
| `status` | Select | Yes | Simplified frontend/display status |
| `workflow_state` | Select / Workflow field | Yes | Formal workflow state |
| `submitted_on` | Datetime | Conditional | When the record was submitted |
| `assigned_to` | Link: User | Conditional | Advisor/support/admin assignment |
| `priority` | Select | Conditional | Operational priority |
| `source_channel` | Select | Yes | Website, portal, admin, import, integration |
| `created_from_flow` | Data | Conditional | Frontend/mock/onboarding flow source |
| `audit_reference` | Link: RBP Audit Log | Conditional | Key audit reference if needed |
| `created_by` | User | Yes | User who created the record |
| `modified_by` | User | Yes | Last modifying user |
| `closed_on` | Datetime | Conditional | When the record was closed |
| `cancelled_on` | Datetime | Conditional | When the record was cancelled |
| `rejection_reason` | Small Text | Conditional | Reason for rejected state |
| `internal_notes` | Long Text | No | Admin/support-only notes |

### Shared Product Record Rules

```text
tenant must be set on all customer/business records.
owner must be preserved for user-created records.
workflow_state must match the workflow model.
status must be mapped to frontend-safe API values.
internal_notes must never be returned to customer users unless explicitly allowed.
assigned_to must not grant access unless assignment checks pass.
```

---

## 8. Shared Fields for System/Operational Records

Operational DocTypes should include:

| Fieldname | Type | Required | Purpose |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Conditional | Tenant context if applicable |
| `user` | Link: User | Conditional | User context |
| `related_doctype` | Data / Link | Conditional | Linked record type |
| `related_name` | Dynamic Link / Data | Conditional | Linked record name |
| `status` | Select | Conditional | Current operational status |
| `source_channel` | Select | Conditional | Source of creation |
| `created_on` | Datetime | Yes | Creation timestamp |
| `processed_on` | Datetime | Conditional | Processing timestamp |
| `raw_payload` | Long Text / JSON | Conditional | Raw integration payload |
| `internal_notes` | Long Text | No | Admin/system notes |

---

# PLATFORM-LEVEL DOCTYPES

---

## 9. RBP Tenant

## 9.1 Purpose

Represents a customer/business workspace.

This is the primary boundary for tenant-scoped records, permissions, subscriptions, entitlements, files, notifications, and product requests.

## 9.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant_name` | Data | Yes | Human-readable tenant/business name |
| `business_profile` | Link: RBP Business Profile | Conditional | Main business profile |
| `status` | Select | Yes | Active, Pending, Suspended, Archived |
| `primary_owner` | Link: User | Yes | Main account owner |
| `billing_account` | Data / Link | Conditional | Payment provider or billing reference |
| `created_from_membership` | Link: RBP Subscription / Data | Conditional | Membership source |
| `legacy_tenant_reference` | Data | No | Migration/reference field |
| `default_currency` | Data | Conditional | Example: AUD |
| `country` | Data | Conditional | Tenant country |
| `region` | Data | Conditional | State/region |
| `created_on` | Datetime | Yes | Creation timestamp |

## 9.3 Relationships

```text
RBP Tenant
  ├── RBP Business Profile
  ├── RBP Subscription
  ├── RBP App Entitlement
  ├── RBP Decision Desk Request
  ├── RBP Document Brief
  ├── RBP Marketplace Listing
  ├── RBP Connectivity Order
  ├── RBP Risk Assessment
  ├── RBP Fixer Request
  ├── RBP File Reference
  ├── RBP Notification
  ├── RBP Payment Event
  └── RBP Audit Log
```

## 9.4 Ownership and Permissions

| Role | Access |
|---|---|
| RBP Business Owner | Read/update own tenant profile fields |
| RBP Team Member | Limited read if linked to tenant |
| RBP Member | Read own tenant context |
| RBP Admin | Full operational access |
| System Manager | Full access |
| Administrator | Full access |

## 9.5 API Mapping

```text
GET  /api/method/rbp_app.api.me.get_context
GET  /api/method/rbp_app.api.tenancy.get_tenant
POST /api/method/rbp_app.api.tenancy.update_tenant
```

## 9.6 Validation Rules

```text
tenant_name is required.
primary_owner is required.
status must be one of the approved tenant statuses.
primary_owner must be an active user.
business_profile must belong to the same tenant if linked.
```

## 9.7 Indexing

Recommended indexes:

```text
primary_owner
status
business_profile
```

---

## 10. RBP Business Profile

## 10.1 Purpose

Stores business identity and onboarding information.

## 10.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `business_name` | Data | Yes | Trading/business name |
| `legal_name` | Data | Conditional | Legal registered name |
| `business_identifier` | Data | Conditional | ABN/ACN/business ID |
| `industry` | Data / Select | Conditional | Industry classification |
| `business_size` | Select | Conditional | Size band |
| `country` | Data | Conditional | Country |
| `region` | Data | Conditional | State/region |
| `primary_contact` | Link: User / Data | Yes | Primary contact user |
| `phone` | Data | Conditional | Contact phone |
| `email` | Data | Yes | Contact email |
| `website` | Data | Conditional | Website URL |
| `membership_status` | Select | Yes | None, Pending, Active, Suspended, Cancelled |
| `tenant` | Link: RBP Tenant | Conditional | Linked tenant |
| `created_from_signup` | Check | No | Whether created through signup flow |

## 10.3 Relationships

```text
RBP Business Profile
  ├── RBP Tenant
  ├── RBP Subscription
  └── Product records through tenant
```

## 10.4 Ownership and Permissions

| Role | Access |
|---|---|
| Website User | Create/update own onboarding draft |
| RBP Business Owner | Read/update tenant business profile |
| RBP Team Member | Limited read |
| RBP Admin | Full operational access |
| System Manager | Full access |

## 10.5 API Mapping

```text
POST /api/method/rbp_app.api.membership.create_signup
GET  /api/method/rbp_app.api.business_profile.get_profile
POST /api/method/rbp_app.api.business_profile.update_profile
```

## 10.6 Validation Rules

```text
business_name is required.
email must be valid.
business_identifier format must match jurisdiction rules where applicable.
tenant must match the user's authorised tenant if set.
membership_status must use approved values.
```

## 10.7 Indexing

```text
tenant
business_identifier
email
membership_status
```

---

## 11. RBP Membership Plan

## 11.1 Purpose

Defines available membership plans, pricing, billing cycle, and included entitlements.

## 11.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `plan_name` | Data | Yes | Display name |
| `plan_code` | Data | Yes | Unique code |
| `billing_cycle` | Select | Yes | Monthly, Annual, Once-off, Custom |
| `price` | Currency | Yes | Plan price |
| `currency` | Data | Yes | Example: AUD |
| `included_services` | Long Text / Table | Conditional | Included service summary |
| `entitlements` | Table / JSON | Conditional | Entitlement keys |
| `active` | Check | Yes | Whether plan is available |
| `sort_order` | Int | Conditional | Display order |
| `description` | Long Text | Conditional | Public description |
| `payment_provider_plan_id` | Data | Conditional | Provider price/plan ID |

## 11.3 Relationships

```text
RBP Membership Plan
  ├── RBP Subscription
  └── RBP App Entitlement
```

## 11.4 Ownership and Permissions

| Role | Access |
|---|---|
| Guest | Public read of active plan summary |
| Website User | Read active plan summary |
| RBP Member | Read active plan summary |
| RBP Admin | Create/update plans |
| System Manager | Full access |

## 11.5 API Mapping

```text
GET  /api/method/rbp_app.api.membership.get_plans
POST /api/method/rbp_app.api.membership.admin_create_plan
POST /api/method/rbp_app.api.membership.admin_update_plan
```

## 11.6 Validation Rules

```text
plan_name is required.
plan_code must be unique.
price must be greater than or equal to zero.
currency is required.
billing_cycle must use approved values.
active must be explicitly set.
```

## 11.7 Indexing

```text
plan_code
active
sort_order
```

---

## 12. RBP Subscription

## 12.1 Purpose

Tracks tenant/user membership subscription status and payment-provider relationship.

## 12.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Yes | Subscription tenant |
| `member` | Link: User | Yes | Primary member/user |
| `plan` | Link: RBP Membership Plan | Yes | Current plan |
| `status` | Select | Yes | Pending, Active, Past Due, Cancelled, Suspended, Expired |
| `billing_cycle` | Select | Yes | Monthly, Annual, etc. |
| `payment_provider` | Data / Select | Conditional | Stripe or other provider |
| `provider_customer_id` | Data | Conditional | Provider customer reference |
| `provider_subscription_id` | Data | Conditional | Provider subscription reference |
| `current_period_start` | Date | Conditional | Billing period start |
| `current_period_end` | Date | Conditional | Billing period end |
| `cancel_at_period_end` | Check | Conditional | Scheduled cancellation |
| `last_payment_event` | Link: RBP Payment Event | Conditional | Latest payment event |

## 12.3 Relationships

```text
RBP Subscription
  ├── RBP Tenant
  ├── RBP Membership Plan
  ├── RBP App Entitlement
  └── RBP Payment Event
```

## 12.4 Ownership and Permissions

| Role | Access |
|---|---|
| RBP Member | View own safe subscription summary |
| RBP Business Owner | View/manage tenant subscription |
| RBP Team Member | No access by default |
| RBP Admin | Full operational access |
| System Manager | Full access |

## 12.5 API Mapping

```text
POST /api/method/rbp_app.api.membership.create_signup
GET  /api/method/rbp_app.api.membership.get_subscription
POST /api/method/rbp_app.api.membership.cancel_subscription
POST /api/method/rbp_app.api.billing.admin_reconcile_subscription
```

## 12.6 Validation Rules

```text
tenant is required.
member is required.
plan is required.
status must use approved subscription states.
provider_subscription_id must be unique when present.
current_period_end must be after current_period_start.
```

## 12.7 Indexing

```text
tenant
member
plan
status
provider_customer_id
provider_subscription_id
current_period_end
```

---

## 13. RBP App Entitlement

## 13.1 Purpose

Controls application/module/service availability per tenant or user.

## 13.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Conditional | Tenant-level entitlement |
| `user` | Link: User | Conditional | User-level entitlement |
| `app_key` | Data / Select | Yes | Entitlement key |
| `entitlement_type` | Select | Yes | Plan, Add-on, Trial, Manual, Admin Override |
| `status` | Select | Yes | Active, Pending, Suspended, Expired, Revoked |
| `source_subscription` | Link: RBP Subscription | Conditional | Source subscription |
| `starts_on` | Date | Conditional | Start date |
| `ends_on` | Date | Conditional | End date |
| `granted_by` | Link: User | Conditional | Admin/system grant source |
| `notes` | Small Text | No | Internal notes |

## 13.3 Approved App Keys

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
notifications
```

## 13.4 Relationships

```text
RBP App Entitlement
  ├── RBP Tenant
  ├── User
  └── RBP Subscription
```

## 13.5 Ownership and Permissions

| Role | Access |
|---|---|
| RBP Member | View own safe entitlement summary |
| RBP Business Owner | View tenant entitlement summary |
| RBP Admin | Full operational access |
| System Manager | Full access |

## 13.6 API Mapping

```text
GET  /api/method/rbp_app.api.me.get_context
GET  /api/method/rbp_app.api.entitlements.list_my_entitlements
POST /api/method/rbp_app.api.entitlements.admin_grant_entitlement
POST /api/method/rbp_app.api.entitlements.admin_revoke_entitlement
```

## 13.7 Validation Rules

```text
app_key is required.
Either tenant or user must be set.
status must use approved entitlement states.
ends_on must be after starts_on when both are set.
source_subscription must match tenant if provided.
```

## 13.8 Indexing

```text
tenant
user
app_key
status
source_subscription
ends_on
```

---

## 14. RBP Onboarding Flow

## 14.1 Purpose

Defines a structured onboarding flow for users, tenants, membership setup, or product onboarding.

## 14.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `flow_name` | Data | Yes | Display name |
| `flow_key` | Data | Yes | Unique key |
| `tenant` | Link: RBP Tenant | Conditional | Tenant-specific flow if applicable |
| `user` | Link: User | Conditional | User-specific flow if applicable |
| `status` | Select | Yes | Not Started, In Progress, Completed, Abandoned |
| `current_step` | Link: RBP Onboarding Step | Conditional | Current active step |
| `started_on` | Datetime | Conditional | Start timestamp |
| `completed_on` | Datetime | Conditional | Completion timestamp |
| `source_channel` | Select | Conditional | Website, portal, admin |

## 14.3 Relationships

```text
RBP Onboarding Flow
  └── RBP Onboarding Step
```

## 14.4 Ownership and Permissions

| Role | Access |
|---|---|
| Website User | Own onboarding flow |
| RBP Member | Own/tenant onboarding flow |
| RBP Business Owner | Tenant onboarding flow |
| RBP Admin | Full operational access |

## 14.5 API Mapping

```text
GET  /api/method/rbp_app.api.onboarding.get_flow
POST /api/method/rbp_app.api.onboarding.update_step
POST /api/method/rbp_app.api.onboarding.complete_flow
```

## 14.6 Validation Rules

```text
flow_name is required.
flow_key must be unique or unique per tenant/user context.
status must use approved onboarding states.
completed_on can be set only when status is Completed.
```

## 14.7 Indexing

```text
flow_key
tenant
user
status
```

---

## 15. RBP Onboarding Step

## 15.1 Purpose

Tracks individual onboarding steps within an onboarding flow.

## 15.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `flow` | Link: RBP Onboarding Flow | Yes | Parent flow |
| `step_key` | Data | Yes | Unique step key within flow |
| `step_label` | Data | Yes | Display label |
| `status` | Select | Yes | Not Started, In Progress, Completed, Skipped |
| `sort_order` | Int | Yes | Step order |
| `completed_on` | Datetime | Conditional | Completion timestamp |
| `data_snapshot` | Long Text / JSON | Conditional | Captured step data |
| `required` | Check | Yes | Whether step is mandatory |

## 15.3 Relationships

```text
RBP Onboarding Step
  └── RBP Onboarding Flow
```

## 15.4 Ownership and Permissions

Inherited from parent onboarding flow.

## 15.5 API Mapping

```text
POST /api/method/rbp_app.api.onboarding.update_step
POST /api/method/rbp_app.api.onboarding.complete_step
```

## 15.6 Validation Rules

```text
flow is required.
step_key is required.
step_label is required.
sort_order is required.
status must use approved step states.
step_key must be unique within the flow.
```

## 15.7 Indexing

```text
flow
step_key
status
sort_order
```

---

## 16. RBP Notification

## 16.1 Purpose

Stores platform notifications for users, tenants, admins, advisors, and operational teams.

## 16.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Conditional | Tenant context |
| `recipient_user` | Link: User | Conditional | Individual recipient |
| `recipient_role` | Data / Select | Conditional | Role-based recipient |
| `notification_type` | Data / Select | Yes | Trigger/type key |
| `title` | Data | Yes | Notification title |
| `message` | Small Text | Yes | Notification body |
| `related_doctype` | Data | Conditional | Linked record type |
| `related_name` | Dynamic Link / Data | Conditional | Linked record |
| `status` | Select | Yes | Unread, Read, Archived |
| `channel` | Select | Yes | Portal, Email, Admin, System |
| `sent_on` | Datetime | Conditional | Delivery timestamp |
| `read_on` | Datetime | Conditional | Read timestamp |

## 16.3 Trigger Examples

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

## 16.4 Relationships

```text
RBP Notification
  ├── RBP Tenant
  ├── User
  └── Related product/payment/file records
```

## 16.5 Ownership and Permissions

| Role | Access |
|---|---|
| Website User | Own notifications |
| RBP Member | Own/tenant notifications according to visibility |
| RBP Business Owner | Tenant notifications |
| Advisor | Assigned notifications |
| Support Agent | Assigned/queue notifications |
| RBP Admin | All operational notifications |

## 16.6 API Mapping

```text
GET  /api/method/rbp_app.api.notifications.list_my_notifications
POST /api/method/rbp_app.api.notifications.mark_read
POST /api/method/rbp_app.api.notifications.admin_create_notification
```

## 16.7 Validation Rules

```text
notification_type is required.
title is required.
message is required.
At least recipient_user, recipient_role, or tenant must be set.
status must use approved notification states.
related_name must match related_doctype if provided.
```

## 16.8 Indexing

```text
tenant
recipient_user
recipient_role
notification_type
status
related_doctype
related_name
sent_on
```

---

## 17. RBP Audit Log

## 17.1 Purpose

Records security, workflow, admin, payment, file, and data-change events.

## 17.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Conditional | Tenant context |
| `user` | Link: User | Conditional | Acting user |
| `event_type` | Data / Select | Yes | Audit event key |
| `related_doctype` | Data | Conditional | Linked record type |
| `related_name` | Dynamic Link / Data | Conditional | Linked record |
| `previous_value` | Long Text / JSON | Conditional | Previous value |
| `new_value` | Long Text / JSON | Conditional | New value |
| `source_channel` | Select | Conditional | Website, portal, admin, API, webhook |
| `ip_address` | Data | Conditional | Request IP if available |
| `user_agent` | Small Text | Conditional | Browser/client if available |
| `created_on` | Datetime | Yes | Timestamp |

## 17.3 Event Examples

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

## 17.4 Relationships

```text
RBP Audit Log
  ├── RBP Tenant
  ├── User
  └── Related platform/product records
```

## 17.5 Ownership and Permissions

| Role | Access |
|---|---|
| Customer roles | None or limited safe history if explicitly exposed |
| Support Agent | Conditional operational access |
| RBP Admin | Operational audit access |
| System Manager | Full access |
| Administrator | Full access |

## 17.6 API Mapping

```text
GET /api/method/rbp_app.api.audit.admin_list_events
GET /api/method/rbp_app.api.audit.admin_get_event
```

## 17.7 Validation Rules

```text
event_type is required.
created_on is required.
related_name must match related_doctype when provided.
Audit logs should not be edited by normal users.
Audit logs should not be deleted except under explicit retention policy.
```

## 17.8 Indexing

```text
tenant
user
event_type
related_doctype
related_name
created_on
```

---

## 18. RBP Payment Event

## 18.1 Purpose

Records payment, subscription, refund, dispute, and webhook events.

Even if live payment is delayed, payment state must be modelled from the start.

## 18.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Conditional | Tenant context |
| `user` | Link: User | Conditional | Related user |
| `related_doctype` | Data | Conditional | Related record type |
| `related_name` | Dynamic Link / Data | Conditional | Related record |
| `payment_provider` | Data / Select | Yes | Provider name |
| `provider_event_id` | Data | Conditional | Unique provider event ID |
| `provider_customer_id` | Data | Conditional | Provider customer ID |
| `provider_payment_id` | Data | Conditional | Provider payment/session/payment intent ID |
| `amount` | Currency | Conditional | Payment amount |
| `currency` | Data | Conditional | Currency code |
| `status` | Select | Yes | Payment state |
| `event_type` | Data / Select | Yes | Event type |
| `raw_payload` | Long Text / JSON | Conditional | Raw provider payload |
| `processed_on` | Datetime | Conditional | Processing timestamp |
| `idempotency_key` | Data | Conditional | Deduplication key |

## 18.3 Payment States

```text
Not Required
Pending
Authorised
Paid
Failed
Refunded
Cancelled
Disputed
```

API values:

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

## 18.4 Relationships

```text
RBP Payment Event
  ├── RBP Tenant
  ├── RBP Subscription
  ├── Product records requiring payment
  └── RBP Audit Log
```

## 18.5 Ownership and Permissions

| Role | Access |
|---|---|
| RBP Member | Safe own payment summary only |
| RBP Business Owner | Safe tenant payment/subscription summary |
| Support Agent | Conditional payment support summary |
| RBP Admin | Operational payment access |
| System Manager | Full payment event access |
| Administrator | Full access |

## 18.6 API Mapping

```text
GET  /api/method/rbp_app.api.billing.get_my_payment_summary
GET  /api/method/rbp_app.api.billing.get_subscription_payment_events
POST /api/method/rbp_app.api.billing.handle_payment_webhook
POST /api/method/rbp_app.api.billing.admin_reconcile_payment
```

## 18.7 Validation Rules

```text
payment_provider is required.
status is required.
event_type is required.
amount must be greater than or equal to zero when provided.
currency is required when amount is provided.
provider_event_id should be unique when present.
idempotency_key should be unique when present.
raw_payload must not be exposed to customer users.
```

## 18.8 Indexing

```text
tenant
user
related_doctype
related_name
payment_provider
provider_event_id
provider_customer_id
provider_payment_id
status
event_type
processed_on
idempotency_key
```

---

## 19. RBP File Reference

## 19.1 Purpose

Wraps Frappe file handling with RBP-specific ownership, visibility, tenant, and related-record rules.

## 19.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Conditional | Tenant context |
| `owner` | Link: User | Yes | File owner |
| `related_doctype` | Data | Yes | Linked record type |
| `related_name` | Dynamic Link / Data | Yes | Linked record |
| `file` | Link: File | Yes | Frappe File |
| `file_type` | Data / Select | Conditional | Document, Image, Evidence, Recommendation, Other |
| `visibility` | Select | Yes | Visibility rule |
| `uploaded_by` | Link: User | Yes | Uploader |
| `uploaded_on` | Datetime | Yes | Upload timestamp |
| `status` | Select | Yes | Active, Removed, Quarantined, Archived |
| `description` | Small Text | Conditional | Optional description |

## 19.3 Visibility Values

```text
private_to_owner
tenant_visible
advisor_visible
admin_only
public
```

## 19.4 Relationships

```text
RBP File Reference
  ├── RBP Tenant
  ├── User
  ├── Frappe File
  └── Related product records
```

## 19.5 Ownership and Permissions

| Visibility | Who Can View |
|---|---|
| `private_to_owner` | Owner, authorised admin |
| `tenant_visible` | Tenant-authorised users, authorised admin |
| `advisor_visible` | Assigned advisor/support/admin |
| `admin_only` | RBP Admin/System Manager/Administrator |
| `public` | Public only when explicitly intended |

## 19.6 API Mapping

```text
POST /api/method/rbp_app.api.<domain>.attach_file
GET  /api/method/rbp_app.api.files.get_file_reference
GET  /api/method/rbp_app.api.files.list_files_for_record
POST /api/method/rbp_app.api.files.admin_change_visibility
```

## 19.7 Validation Rules

```text
owner is required.
related_doctype is required.
related_name is required.
file is required.
visibility is required.
uploaded_by is required.
uploaded_on is required.
User must be authorised to access related record before attaching file.
Public visibility must require explicit approval.
```

## 19.8 Indexing

```text
tenant
owner
related_doctype
related_name
file
visibility
uploaded_by
status
uploaded_on
```

---

# PRODUCT-LEVEL DOCTYPES

---

## 20. RBP Decision Desk Request

## 20.1 Purpose

Stores a submitted or draft Decision Desk request.

## 20.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Yes | Customer tenant |
| `owner` | Link: User | Yes | Request owner |
| `decision_title` | Data | Yes | Decision title |
| `decision_category` | Select / Data | Conditional | Category |
| `decision_summary` | Long Text | Yes | Decision overview |
| `urgency` | Select | Conditional | Low, Normal, High, Critical |
| `deadline` | Date | Conditional | Desired deadline |
| `business_context` | Long Text | Conditional | Business background |
| `constraints` | Long Text | Conditional | Constraints |
| `desired_outcome` | Long Text | Conditional | Desired outcome |
| `preferred_contact_method` | Select | Conditional | Email, phone, portal, meeting |
| `status` | Select | Yes | Frontend status |
| `workflow_state` | Select / Workflow | Yes | Formal workflow state |
| `assigned_to` | Link: User | Conditional | Advisor |
| `recommendation_summary` | Long Text | Conditional | Advisor/admin outcome |
| `submitted_on` | Datetime | Conditional | Submission timestamp |
| `closed_on` | Datetime | Conditional | Closure timestamp |

## 20.3 Child / Related DocTypes

```text
RBP Decision Desk Option
RBP File Reference
RBP Notification
RBP Audit Log
RBP Payment Event, if payment applies
```

## 20.4 Workflow

Recommended workflow:

```text
Draft → Submitted → In Review → Advisor Assigned → Recommendation Ready → Closed
```

Optional states:

```text
Payment Pending
Payment Failed
More Information Required
Rejected
Cancelled
Archived
```

## 20.5 API Mapping

```text
POST /api/method/rbp_app.api.decision_desk.create_request
POST /api/method/rbp_app.api.decision_desk.update_request
POST /api/method/rbp_app.api.decision_desk.submit_request
GET  /api/method/rbp_app.api.decision_desk.get_request
GET  /api/method/rbp_app.api.decision_desk.list_my_requests
POST /api/method/rbp_app.api.decision_desk.attach_file
POST /api/method/rbp_app.api.decision_desk.admin_assign_advisor
POST /api/method/rbp_app.api.decision_desk.admin_request_more_information
POST /api/method/rbp_app.api.decision_desk.admin_close_request
```

## 20.6 Validation Rules

```text
tenant is required.
owner is required.
decision_title is required.
decision_summary is required before submit.
workflow_state must be valid.
Customer users may update core request fields only while Draft or More Information Required.
assigned_to must be an authorised advisor/admin user.
```

## 20.7 Indexing

```text
tenant
owner
status
workflow_state
assigned_to
urgency
submitted_on
deadline
```

---

## 21. RBP Decision Desk Option

## 21.1 Purpose

Stores options being considered within a Decision Desk request.

## 21.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `decision_request` | Link: RBP Decision Desk Request | Yes | Parent request |
| `option_title` | Data | Yes | Option name |
| `option_description` | Long Text | Conditional | Option details |
| `pros` | Long Text | Conditional | Positive factors |
| `cons` | Long Text | Conditional | Negative factors |
| `estimated_cost` | Currency | Conditional | Estimated cost |
| `estimated_timeframe` | Data | Conditional | Estimated timeframe |
| `risk_level` | Select | Conditional | Low, Medium, High |
| `sort_order` | Int | Conditional | Display order |

## 21.3 Relationships

```text
RBP Decision Desk Option
  └── RBP Decision Desk Request
```

## 21.4 Permissions

Inherited from parent Decision Desk Request.

## 21.5 API Mapping

Usually embedded in Decision Desk create/update payloads.

Optional endpoints:

```text
POST /api/method/rbp_app.api.decision_desk.add_option
POST /api/method/rbp_app.api.decision_desk.update_option
POST /api/method/rbp_app.api.decision_desk.remove_option
```

## 21.6 Validation Rules

```text
decision_request is required.
option_title is required.
sort_order should be numeric when provided.
Parent request must be editable by current user.
```

## 21.7 Indexing

```text
decision_request
sort_order
risk_level
```

---

## 22. RBP Document Brief

## 22.1 Purpose

Stores DocuShare document brief requests.

## 22.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Yes | Customer tenant |
| `owner` | Link: User | Yes | Brief owner |
| `document_type` | Select / Data | Yes | Type of document |
| `document_category` | Select / Data | Conditional | Category |
| `business_context` | Long Text | Conditional | Business background |
| `jurisdiction` | Data / Select | Conditional | Jurisdiction |
| `intended_use` | Long Text | Conditional | Intended document use |
| `required_sections` | Long Text / Table | Conditional | Required content sections |
| `deadline` | Date | Conditional | Desired deadline |
| `review_required` | Check | Conditional | Whether review is required |
| `status` | Select | Yes | Frontend status |
| `workflow_state` | Select / Workflow | Yes | Formal workflow state |
| `assigned_to` | Link: User | Conditional | Reviewer/advisor |
| `submitted_on` | Datetime | Conditional | Submission timestamp |
| `closed_on` | Datetime | Conditional | Closure timestamp |

## 22.3 Relationships

```text
RBP Document Brief
  ├── RBP File Reference
  ├── RBP Notification
  ├── RBP Audit Log
  └── RBP Payment Event, if payment applies
```

## 22.4 Workflow

```text
Draft → Submitted → In Review → Assigned → In Progress → Outcome Ready → Closed
```

## 22.5 API Mapping

```text
POST /api/method/rbp_app.api.docushare.create_brief
POST /api/method/rbp_app.api.docushare.update_brief
POST /api/method/rbp_app.api.docushare.submit_brief
GET  /api/method/rbp_app.api.docushare.get_brief
GET  /api/method/rbp_app.api.docushare.list_my_briefs
POST /api/method/rbp_app.api.docushare.attach_file
POST /api/method/rbp_app.api.docushare.admin_assign_reviewer
```

## 22.6 Validation Rules

```text
tenant is required.
owner is required.
document_type is required.
workflow_state must be valid.
Customer edits are limited to Draft or More Information Required states.
```

## 22.7 Indexing

```text
tenant
owner
document_type
document_category
status
workflow_state
assigned_to
deadline
submitted_on
```

---

## 23. RBP Marketplace Listing

## 23.1 Purpose

Stores marketplace listings created by sellers or admins.

## 23.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Conditional | Seller tenant, if applicable |
| `owner` | Link: User | Yes | Listing owner |
| `seller_user` | Link: User | Conditional | Seller user |
| `listing_title` | Data | Yes | Listing title |
| `listing_category` | Select / Data | Yes | Listing category |
| `description` | Long Text | Yes | Listing description |
| `price` | Currency | Conditional | Listing price |
| `currency` | Data | Conditional | Currency |
| `location` | Data | Conditional | Location |
| `status` | Select | Yes | Draft, Pending Review, Published, Rejected, Archived |
| `workflow_state` | Select / Workflow | Yes | Formal workflow state |
| `admin_review_status` | Select | Conditional | Pending, Approved, Rejected |
| `published_on` | Datetime | Conditional | Publication timestamp |
| `rejection_reason` | Small Text | Conditional | Admin rejection reason |
| `listing_fee_status` | Select | Conditional | Payment status if listing fee applies |

## 23.3 Relationships

```text
RBP Marketplace Listing
  ├── RBP Marketplace Enquiry
  ├── RBP File Reference
  ├── RBP Payment Event, if listing fee applies
  ├── RBP Notification
  └── RBP Audit Log
```

## 23.4 Workflow

```text
Draft → Pending Review → Published
Draft → Pending Review → Rejected
Published → Archived
```

Optional:

```text
Payment Pending
Payment Failed
Cancelled
```

## 23.5 API Mapping

```text
POST /api/method/rbp_app.api.marketplace.create_listing
POST /api/method/rbp_app.api.marketplace.update_listing
POST /api/method/rbp_app.api.marketplace.submit_listing
GET  /api/method/rbp_app.api.marketplace.get_listing
GET  /api/method/rbp_app.api.marketplace.list_my_listings
GET  /api/method/rbp_app.api.marketplace.list_public_listings
POST /api/method/rbp_app.api.marketplace.attach_file
POST /api/method/rbp_app.api.marketplace.admin_approve_listing
POST /api/method/rbp_app.api.marketplace.admin_reject_listing
POST /api/method/rbp_app.api.marketplace.admin_archive_listing
```

## 23.6 Validation Rules

```text
listing_title is required.
listing_category is required.
description is required before submit.
Seller cannot approve own listing.
Public media must not become public until listing is approved/published.
price must be greater than or equal to zero if provided.
```

## 23.7 Indexing

```text
tenant
owner
seller_user
listing_category
status
workflow_state
admin_review_status
published_on
```

---

## 24. RBP Marketplace Enquiry

## 24.1 Purpose

Stores buyer enquiries against marketplace listings.

## 24.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `listing` | Link: RBP Marketplace Listing | Yes | Related listing |
| `buyer_user` | Link: User | Conditional | Authenticated buyer |
| `buyer_name` | Data | Conditional | Guest/authenticated name |
| `buyer_email` | Data | Yes | Buyer email |
| `buyer_phone` | Data | Conditional | Buyer phone |
| `message` | Long Text | Yes | Enquiry message |
| `status` | Select | Yes | New, In Review, Sent to Seller, Closed, Spam |
| `workflow_state` | Select / Workflow | Conditional | Formal workflow state if needed |
| `submitted_on` | Datetime | Yes | Submission timestamp |
| `seller_notified_on` | Datetime | Conditional | Notification timestamp |

## 24.3 Relationships

```text
RBP Marketplace Enquiry
  ├── RBP Marketplace Listing
  ├── RBP Notification
  └── RBP Audit Log
```

## 24.4 API Mapping

```text
POST /api/method/rbp_app.api.marketplace.create_enquiry
GET  /api/method/rbp_app.api.marketplace.get_enquiry
GET  /api/method/rbp_app.api.marketplace.list_my_enquiries
GET  /api/method/rbp_app.api.marketplace.list_listing_enquiries
POST /api/method/rbp_app.api.marketplace.admin_mark_enquiry_spam
POST /api/method/rbp_app.api.marketplace.admin_close_enquiry
```

## 24.5 Validation Rules

```text
listing is required.
buyer_email is required and must be valid.
message is required.
Listing must be published or otherwise enquiry-enabled.
Guest enquiries must not grant portal access automatically.
```

## 24.6 Indexing

```text
listing
buyer_user
buyer_email
status
submitted_on
```

---

## 25. RBP Connectivity Order

## 25.1 Purpose

Stores Connectivity/NBN service orders.

## 25.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Yes | Customer tenant |
| `owner` | Link: User | Yes | Order owner |
| `service_address` | Long Text | Yes | Service address |
| `service_type` | Select / Data | Conditional | NBN, business internet, etc. |
| `selected_plan` | Data / Link | Yes | Selected service plan |
| `hardware_option` | Data / Select | Conditional | Hardware choice |
| `installation_preference` | Data / Select | Conditional | Install preference |
| `contact_details` | Long Text / JSON | Conditional | Contact data |
| `serviceability_status` | Select | Conditional | Serviceable, Not Serviceable, Manual Review |
| `order_status` | Select | Yes | Draft, Submitted, Provisioning, Complete, Cancelled |
| `payment_status` | Select | Conditional | Payment state |
| `status` | Select | Yes | Frontend status |
| `workflow_state` | Select / Workflow | Yes | Formal workflow state |
| `submitted_on` | Datetime | Conditional | Submission timestamp |
| `provisioning_reference` | Data | Conditional | External/internal reference |

## 25.3 Relationships

```text
RBP Connectivity Order
  ├── RBP Payment Event
  ├── RBP File Reference
  ├── RBP Notification
  └── RBP Audit Log
```

## 25.4 Workflow

```text
Draft → Submitted → In Review → Provisioning → Complete
```

Optional:

```text
Payment Pending
Payment Failed
More Information Required
Cancelled
Archived
```

## 25.5 API Mapping

```text
POST /api/method/rbp_app.api.connectivity.check_serviceability
POST /api/method/rbp_app.api.connectivity.create_order
POST /api/method/rbp_app.api.connectivity.update_order
POST /api/method/rbp_app.api.connectivity.submit_order
GET  /api/method/rbp_app.api.connectivity.get_order
GET  /api/method/rbp_app.api.connectivity.list_my_orders
POST /api/method/rbp_app.api.connectivity.attach_file
POST /api/method/rbp_app.api.connectivity.admin_update_provisioning_status
```

## 25.6 Validation Rules

```text
tenant is required.
owner is required.
service_address is required.
selected_plan is required.
serviceability_status must be checked or explicitly bypassed by admin before submit.
Payment status must be backend-controlled.
```

## 25.7 Indexing

```text
tenant
owner
service_type
serviceability_status
order_status
payment_status
workflow_state
submitted_on
provisioning_reference
```

---

## 26. RBP Risk Assessment

## 26.1 Purpose

Stores Risk Advisor assessment submissions.

## 26.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Yes | Customer tenant |
| `owner` | Link: User | Yes | Assessment owner |
| `business_name` | Data | Conditional | Captured business name |
| `industry` | Data / Select | Conditional | Industry |
| `risk_categories` | Long Text / Table | Conditional | Risk categories selected |
| `current_controls` | Long Text | Conditional | Existing controls |
| `known_incidents` | Long Text | Conditional | Known incidents |
| `compliance_requirements` | Long Text | Conditional | Compliance context |
| `risk_appetite` | Select | Conditional | Low, Medium, High |
| `assessment_answers` | Long Text / JSON | Conditional | Assessment response data |
| `mock_score` | Int | Conditional | Phase 1 mock score if used |
| `calculated_score` | Int | Conditional | Backend-calculated score if used |
| `advisor_notes` | Long Text | Conditional | Advisor-only notes |
| `status` | Select | Yes | Frontend status |
| `workflow_state` | Select / Workflow | Yes | Formal workflow state |
| `assigned_to` | Link: User | Conditional | Advisor |
| `submitted_on` | Datetime | Conditional | Submission timestamp |

## 26.3 Relationships

```text
RBP Risk Assessment
  ├── RBP File Reference
  ├── RBP Notification
  ├── RBP Audit Log
  └── RBP Payment Event, if payment applies
```

## 26.4 Workflow

```text
Draft → Submitted → In Review → Assigned → In Progress → Outcome Ready → Closed
```

## 26.5 API Mapping

```text
POST /api/method/rbp_app.api.risk_advisor.create_assessment
POST /api/method/rbp_app.api.risk_advisor.update_assessment
POST /api/method/rbp_app.api.risk_advisor.submit_assessment
GET  /api/method/rbp_app.api.risk_advisor.get_assessment
GET  /api/method/rbp_app.api.risk_advisor.list_my_assessments
POST /api/method/rbp_app.api.risk_advisor.attach_file
POST /api/method/rbp_app.api.risk_advisor.admin_assign_advisor
POST /api/method/rbp_app.api.risk_advisor.admin_mark_assessment_complete
```

## 26.6 Validation Rules

```text
tenant is required.
owner is required.
assessment_answers are required before submit if final UI requires questionnaire.
risk_appetite must use approved values.
Customer users cannot edit advisor_notes.
mock_score must be phased out or mapped before production if real scoring is implemented.
```

## 26.7 Indexing

```text
tenant
owner
industry
risk_appetite
status
workflow_state
assigned_to
submitted_on
calculated_score
```

---

## 27. RBP Fixer Request

## 27.1 Purpose

Stores The Fixer operational/problem-solving requests.

## 27.2 Key Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Yes | Customer tenant |
| `owner` | Link: User | Yes | Request owner |
| `issue_title` | Data | Yes | Issue title |
| `issue_description` | Long Text | Yes | Issue description |
| `urgency` | Select | Conditional | Low, Normal, High, Critical |
| `business_impact` | Long Text | Conditional | Business impact |
| `desired_resolution` | Long Text | Conditional | Desired resolution |
| `scope_constraints` | Long Text | Conditional | Constraints |
| `preferred_contact_method` | Select | Conditional | Contact method |
| `status` | Select | Yes | Frontend status |
| `workflow_state` | Select / Workflow | Yes | Formal workflow state |
| `assigned_to` | Link: User | Conditional | Support/admin owner |
| `submitted_on` | Datetime | Conditional | Submission timestamp |
| `closed_on` | Datetime | Conditional | Closure timestamp |
| `resolution_summary` | Long Text | Conditional | Outcome/resolution |

## 27.3 Relationships

```text
RBP Fixer Request
  ├── RBP File Reference
  ├── RBP Notification
  ├── RBP Audit Log
  └── RBP Payment Event, if payment applies
```

## 27.4 Workflow

```text
Draft → Submitted → In Review → Assigned → In Progress → Outcome Ready → Closed
```

Optional:

```text
More Information Required
Rejected
Cancelled
Archived
```

## 27.5 API Mapping

```text
POST /api/method/rbp_app.api.fixer.create_request
POST /api/method/rbp_app.api.fixer.update_request
POST /api/method/rbp_app.api.fixer.submit_request
GET  /api/method/rbp_app.api.fixer.get_request
GET  /api/method/rbp_app.api.fixer.list_my_requests
POST /api/method/rbp_app.api.fixer.attach_file
POST /api/method/rbp_app.api.fixer.admin_assign_request
POST /api/method/rbp_app.api.fixer.admin_close_request
```

## 27.6 Validation Rules

```text
tenant is required.
owner is required.
issue_title is required.
issue_description is required.
urgency must use approved values.
Customer-side edits should be restricted after submission.
resolution_summary must not be editable by customer users unless explicitly allowed.
```

## 27.7 Indexing

```text
tenant
owner
urgency
status
workflow_state
assigned_to
submitted_on
closed_on
```

---

# CROSS-CUTTING MODEL REQUIREMENTS

---

## 28. Workflow Field Requirements

Submission-based product DocTypes must support workflow state.

Minimum shared workflow states:

```text
Draft
Submitted
In Review
Assigned
In Progress
Outcome Ready
Closed
```

Optional states:

```text
Payment Pending
Payment Failed
More Information Required
Rejected
Cancelled
Archived
```

Every workflow-enabled DocType must define:

```text
- allowed states
- allowed transitions
- allowed roles per transition
- fields editable per state
- notification triggers per transition
- audit events per transition
```

---

## 29. Payment Linkage Requirements

Any DocType that may require payment must support linkage to `RBP Payment Event`.

Payment linkage fields may include:

```text
payment_status
latest_payment_event
payment_required
payment_amount
payment_currency
```

Payment must be modelled for:

```text
RBP Subscription
RBP Marketplace Listing, if listing fee applies
RBP Connectivity Order, if payment applies
Any service request requiring paid access or entitlement
```

Payment state must be backend-controlled.

---

## 30. File Linkage Requirements

Any DocType that supports uploads must link files through:

```text
RBP File Reference
```

Upload-supporting product DocTypes include:

```text
RBP Decision Desk Request
RBP Document Brief
RBP Marketplace Listing
RBP Connectivity Order
RBP Risk Assessment
RBP Fixer Request
```

Files must not be represented only as frontend mock arrays once backend implementation begins.

---

## 31. Notification Requirements

DocTypes must trigger notifications for major lifecycle events.

Examples:

| Event | Related DocType | Notification Type |
|---|---|---|
| Membership purchased | RBP Subscription | `membership_purchased` |
| Decision Desk submitted | RBP Decision Desk Request | `decision_desk_request_submitted` |
| Advisor assigned | RBP Decision Desk Request / RBP Risk Assessment | `advisor_assigned` |
| More information requested | Product records | `more_information_requested` |
| Document brief submitted | RBP Document Brief | `document_brief_submitted` |
| Marketplace listing approved | RBP Marketplace Listing | `marketplace_listing_approved` |
| Connectivity order received | RBP Connectivity Order | `connectivity_order_received` |
| Risk assessment completed | RBP Risk Assessment | `risk_assessment_completed` |
| Fixer request accepted | RBP Fixer Request | `fixer_request_accepted` |
| Payment failed | RBP Payment Event | `payment_failed` |
| Subscription renewed | RBP Subscription | `subscription_renewed` |

---

## 32. Audit Requirements

Audit logs should be created for:

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

Audit-sensitive DocTypes:

```text
RBP Tenant
RBP Subscription
RBP App Entitlement
RBP Payment Event
RBP File Reference
All product records
```

---

## 33. API DTO Requirements

Every DocType exposed to the frontend must have a safe DTO.

DTOs must:

```text
- use snake_case in backend response
- exclude internal-only fields unless admin endpoint
- exclude raw payment payloads from customer responses
- exclude internal_notes from customer responses
- map workflow_state to frontend-safe status labels where needed
- include only files the user is authorised to view
- include only notifications the user is authorised to view
```

Example safe product DTO:

```json
{
  "name": "RBP-DDR-0001",
  "tenant": "RBP-TENANT-0001",
  "status": "submitted",
  "workflow_state": "Submitted",
  "submitted_on": "2026-05-07T00:00:00Z",
  "assigned_to": null,
  "title": "Choose operating model",
  "files": [],
  "next_actions": []
}
```

---

## 34. API Response Envelope Requirement

All DocType APIs must use the standard response envelope:

```json
{
  "ok": true,
  "data": {},
  "message": "Request completed",
  "errors": [],
  "meta": {
    "request_id": "uuid",
    "timestamp": "2026-05-07T00:00:00Z"
  }
}
```

Errors must use the standard error object:

```json
{
  "field": "business_name",
  "code": "required",
  "message": "Business name is required"
}
```

---

## 35. Permission Requirements

Every DocType must define:

```text
- who can create
- who can read
- who can update
- who can submit
- who can cancel
- who can delete
- who can administer
- who can view files
- who can view payment summaries
- who can view internal/admin fields
```

Permission rules must be enforced server-side through Frappe permissions, query conditions, workflow rules, and service-layer checks.

---

## 36. Validation Requirements

Every DocType must define:

```text
- required fields
- allowed status values
- allowed workflow states
- allowed payment states where relevant
- allowed file visibility values where relevant
- relationship consistency rules
- tenant consistency rules
- field editability by workflow state
- field editability by role
```

Validation errors must use the standard API envelope.

---

## 37. Indexing and Search Requirements

Frequently queried fields should be indexed or optimised.

Common indexing targets:

```text
tenant
owner
status
workflow_state
assigned_to
submitted_on
created_on
related_doctype
related_name
payment_provider
provider_event_id
recipient_user
notification_type
```

List APIs must support safe filtering by:

```text
status
workflow_state
created_from
created_to
submitted_from
submitted_to
assigned_to
tenant, admin only
page
page_size
sort_by
sort_order
```

---

## 38. Frappe Implementation Structure

Recommended backend structure:

```text
rbp_app/
└── rbp_app/
    ├── api/
    │   ├── me.py
    │   ├── membership.py
    │   ├── decision_desk.py
    │   ├── docushare.py
    │   ├── marketplace.py
    │   ├── connectivity.py
    │   ├── risk_advisor.py
    │   ├── fixer.py
    │   ├── portal.py
    │   ├── billing.py
    │   └── notifications.py
    ├── services/
    │   ├── membership.py
    │   ├── decision_desk.py
    │   ├── docushare.py
    │   ├── marketplace.py
    │   ├── connectivity.py
    │   ├── risk_advisor.py
    │   ├── fixer.py
    │   ├── tenancy.py
    │   ├── entitlements.py
    │   ├── billing.py
    │   ├── files.py
    │   ├── notifications.py
    │   └── audit.py
    ├── doctype/
    ├── config/
    ├── guards.py
    ├── permissions.py
    └── hooks.py
```

Implementation must remain inside `rbp_app`. Frappe core files must not be modified.

---

## 39. Required Backend Tests

Backend test categories:

```text
DocType creation tests
DocType validation tests
Permission tests
Workflow transition tests
API validation tests
Service-layer tests
Tenant isolation tests
Entitlement tests
Notification tests
Payment event tests
File attachment tests
Audit log tests
```

Example tests:

```text
test_business_profile_requires_business_name
test_subscription_requires_tenant_member_and_plan
test_member_can_create_decision_desk_request
test_member_cannot_read_other_tenant_request
test_advisor_can_read_assigned_request
test_seller_cannot_approve_own_listing
test_payment_event_is_idempotent
test_file_reference_visibility_blocks_unauthorised_user
test_notification_created_on_request_submission
test_audit_log_created_on_admin_action
```

---

## 40. Mock-to-Real Mapping Requirements

Phase 1 mock fields must map cleanly into real DocTypes.

Examples:

| Mock Field | Real Mapping |
|---|---|
| `supporting_documents_mock` | `RBP File Reference` linked to product record |
| `reference_files_mock` | `RBP File Reference` linked to `RBP Document Brief` |
| `media_mock` | `RBP File Reference` linked to `RBP Marketplace Listing` |
| `payment_method_mock` | Payment provider flow and `RBP Payment Event` |
| `serviceability_status_mock` | `serviceability_status` on `RBP Connectivity Order` |
| `mock_score` | `mock_score` initially; later `calculated_score` if real scoring exists |

Mock-only fields must either be removed, renamed, or mapped before production integration.

---

## 41. Open Items for Final Phase 2 Lock

These items must be confirmed after Phase 1 UI/UX is complete:

| Item | Status | Notes |
|---|---|---|
| Final form fields for each product | Draft | Depends on completed UI forms |
| Final admin-only fields | Draft | Depends on admin UI concepts |
| Final workflow states per product | Draft | Depends on final product flows |
| Final payment-required products | Draft | Depends on commercial rules |
| Final entitlement mapping | Draft | Depends on membership packaging |
| Final file visibility defaults per flow | Draft | Depends on upload/file contract |
| Final notification trigger set | Draft | Depends on status and admin actions |
| Final marketplace seller/buyer model | Draft | Depends on marketplace rules |
| Final NBN/serviceability data model | Draft | Depends on connectivity provider assumptions |
| Final risk scoring model | Draft | Depends on Risk Advisor product design |
| Final team member access model | Draft | Depends on business account rules |
| Final naming series for DocTypes | Draft | Depends on Frappe implementation preference |

---

## 42. Phase 2 Acceptance Checklist

This document is ready for Phase 2 draft use when:

```text
All platform-level DocTypes are listed.
All product-level DocTypes are listed.
Each DocType has a purpose.
Each DocType has key fields.
Each DocType has relationships.
Each DocType has ownership and permission notes.
Each DocType has API mapping.
Each DocType has validation rules.
Each DocType has indexing guidance.
Shared product record fields are defined.
Shared operational record fields are defined.
Workflow, payment, file, notification, and audit requirements are defined.
API DTO and response envelope requirements are defined.
Frappe implementation structure is defined.
Backend test requirements are defined.
Mock-to-real mapping requirements are defined.
Open items are listed for final Phase 2 lock.
```

---

## 43. Phase 2 Sign-Off Criteria

This Core DocType Model can be signed off only when:

```text
Every Phase 1 screen has a mapped backend DocType or deliberate no-persistence decision.
Every form has mapped fields.
Every submit action creates or updates a defined DocType.
Every uploaded file maps to RBP File Reference.
Every payment touchpoint maps to RBP Payment Event or deliberate no-payment decision.
Every notification trigger has a related DocType.
Every workflow-enabled record has a workflow state model.
Every role has clear access rules for each DocType.
Every admin action has a target DocType.
Every API contract references the correct DocType.
Every mock API has a real DocType mapping.
Phase 3 Frappe build can begin without inventing data models.
```

---

## 44. Final Rule

If a piece of user, tenant, product, payment, file, notification, or workflow data matters to the platform, it must have a defined home.

```text
No orphan fields.
No mystery JSON blobs unless explicitly justified.
No frontend-only business state.
No backend tables invented during implementation because someone “just needed somewhere to put it.”
```

That last one is how platforms become haunted.
