# RBP Phase 2 Backend Contracts
# 06-workflow-state-standards.md

## Document Status

| Field | Value |
|---|---|
| Document | Workflow State Standards |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/06-workflow-state-standards.md` |
| Intended Final Location | `rbp-platform/contracts/workflows/workflow-state-standards.md` |
| Primary Consumers | Frappe backend, frontend, QA, admin operations, service delivery |

---

## 1. Purpose

This document defines the workflow state standards for the Remote Business Partner Platform.

It establishes:

```text
- canonical workflow states
- state meanings
- API status values
- allowed transitions
- role permissions per transition
- field editability by state
- frontend display expectations
- notification triggers
- audit log events
- payment-state interaction
- file-upload rules by state
- admin action requirements
- product-specific workflow patterns
- QA test requirements
```

This document is part of Phase 2: Backend Contract Planning. It is not implementation code. It defines the workflow contract that Phase 3 Frappe implementation must follow.

The goal is to stop each product from inventing its own little government of statuses. Humans already did that with tax systems. No need to repeat it in software.

---

## 2. Scope

This document applies to workflow-enabled platform records, including:

```text
RBP Decision Desk Request
RBP Document Brief
RBP Marketplace Listing
RBP Marketplace Enquiry
RBP Connectivity Order
RBP Risk Assessment
RBP Fixer Request
RBP Subscription, where lifecycle state applies
RBP File Reference, where approval/visibility state applies
RBP Payment Event, where payment state applies
```

This document covers workflow standards only.

Detailed role permissions are defined in:

```text
03-role-matrix.md
04-permission-model-draft.md
```

Detailed DocType fields are defined in:

```text
05-core-doctype-model.md
```

Detailed payment states are defined in:

```text
08-payment-state-model.md
```

Detailed notification triggers are defined in:

```text
14-notification-triggers.md
```

---

## 3. Workflow Principles

All workflows must follow these principles:

| Principle | Rule |
|---|---|
| Predictable lifecycle | Similar products should use the same state names wherever possible. |
| Backend authority | Workflow state is controlled by the backend/Frappe workflow, not the frontend. |
| State is meaningful | Every state must define what the record means, who owns the next action, and what can happen next. |
| No duplicate labels | Do not create multiple states with the same meaning, such as `Under Review`, `In Review`, and `Reviewing`. |
| Role-based transitions | Every transition must define who can perform it. |
| Audit every meaningful transition | Submission, assignment, outcome, rejection, cancellation, and closure should create audit logs. |
| Notify on important moments | User-facing and admin-facing status changes should trigger notifications where relevant. |
| Lock records when appropriate | Customer-editable fields should usually lock after submission. |
| Payment is separate but connected | Payment state must not be confused with workflow state, but workflow may depend on payment. |
| API values must be stable | Frontend should receive predictable snake_case status values. |

---

## 4. `status` vs `workflow_state`

The platform should distinguish between `status` and `workflow_state`.

| Field | Purpose | Example |
|---|---|---|
| `workflow_state` | Formal Frappe workflow state controlling transitions and permissions | `In Review` |
| `status` | API/frontend-safe simplified state value | `in_review` |

### 4.1 Rule

For workflow-enabled records:

```text
workflow_state = formal Frappe workflow label
status = frontend/API value derived from workflow_state unless a product-specific reason exists
```

### 4.2 Example

```json
{
  "workflow_state": "In Review",
  "status": "in_review"
}
```

Do not use `stage`, `step`, `phase`, and `status` interchangeably. That is how dashboards become riddles.

---

## 5. Canonical Workflow States

## 5.1 Core States

These are the standard states for submission-based product records.

| Frappe Label | API Value | Meaning |
|---|---|---|
| Draft | `draft` | Record exists but has not been submitted. |
| Submitted | `submitted` | Customer/user has submitted the record for processing. |
| In Review | `in_review` | Admin/support team is reviewing the submission. |
| Assigned | `assigned` | Record has been assigned to an advisor/support/operator. |
| In Progress | `in_progress` | Assigned person/team is actively working on the record. |
| Outcome Ready | `outcome_ready` | Recommendation, result, or outcome is ready for user/admin action. |
| Closed | `closed` | Record lifecycle is complete. |

## 5.2 Optional States

These states may be used where the product requires them.

| Frappe Label | API Value | Meaning |
|---|---|---|
| Payment Pending | `payment_pending` | Workflow is waiting for payment authorisation or confirmation. |
| Payment Failed | `payment_failed` | Required payment failed and action is blocked or paused. |
| More Information Required | `more_information_required` | User/customer must provide additional information. |
| Rejected | `rejected` | Submission was reviewed and rejected. |
| Cancelled | `cancelled` | User/admin cancelled the record before completion. |
| Archived | `archived` | Record is retained but removed from active operational views. |

## 5.3 Product-Specific Labels

Product-specific labels are allowed only when they describe a clear business state that does not fit a generic state.

Approved examples:

| Product | State Label | API Value | Maps To |
|---|---|---|---|
| Decision Desk | Advisor Assigned | `advisor_assigned` | Assigned |
| Decision Desk | Recommendation Ready | `recommendation_ready` | Outcome Ready |
| Marketplace | Pending Review | `pending_review` | Submitted/In Review |
| Marketplace | Published | `published` | Outcome Ready/Closed depending on listing lifecycle |
| Connectivity | Provisioning | `provisioning` | In Progress |
| Connectivity | Complete | `complete` | Closed |
| File Reference | Quarantined | `quarantined` | Operational/safety hold |

### 5.4 Product-Specific State Rule

Every product-specific state must document:

```text
- why the generic state is insufficient
- which generic state it maps to
- allowed roles
- allowed transitions
- notification triggers
- frontend label
- API value
```

---

## 6. State Definitions

## 6.1 Draft

### Meaning

A record has been created but not submitted.

### Owner of Next Action

Usually the customer/user.

### Typical Allowed Roles

```text
Website User
RBP Member
RBP Business Owner
RBP Team Member, conditional
RBP Marketplace Seller, for listing drafts
RBP Admin
System Manager
Administrator
```

### Allowed Actions

```text
read own draft
update editable fields
attach supporting files where allowed
delete/cancel draft if product permits
submit draft
```

### Restricted Actions

```text
admin review not normally required
advisor assignment not normally allowed
customer cannot set internal fields
payment state cannot be manually set by frontend
```

### Editable Fields

Customer-facing form fields are editable.

Internal fields are not editable:

```text
assigned_to
internal_notes
admin_review_status
recommendation_summary
resolution_summary
workflow_state
payment_status
audit_reference
```

### Entry Conditions

```text
Record created from frontend form, admin creation, import, or mock-to-real API transition.
```

### Exit Conditions

```text
Required fields completed.
Validation passes.
Entitlement/payment checks pass where required.
User submits record.
```

### Typical Transitions

```text
Draft → Submitted
Draft → Payment Pending
Draft → Cancelled
Draft → Archived, admin/system only
```

---

## 6.2 Payment Pending

### Meaning

The record requires payment before it can proceed.

### Owner of Next Action

Customer/payment provider/backend payment process.

### Typical Allowed Roles

```text
Website User, own record
RBP Member, own/tenant record
RBP Business Owner, tenant record
RBP Admin
System Manager
Administrator
```

### Allowed Actions

```text
view payment status summary
retry payment if supported
cancel request if allowed
admin reconcile payment
payment webhook can update payment event
```

### Restricted Actions

```text
customer cannot mark payment as paid
customer cannot edit provider payment fields
workflow should not proceed to operational review until payment requirement is satisfied, unless admin override exists
```

### Entry Conditions

```text
A payment is required and has not yet been confirmed.
```

### Exit Conditions

```text
Payment authorised or paid.
Payment fails.
Payment is cancelled.
Admin marks payment not required or reconciled.
```

### Typical Transitions

```text
Payment Pending → Submitted
Payment Pending → Payment Failed
Payment Pending → Cancelled
Payment Pending → Archived, admin/system only
```

---

## 6.3 Payment Failed

### Meaning

Required payment failed, was declined, expired, or could not be confirmed.

### Owner of Next Action

Customer or admin/billing support.

### Typical Allowed Roles

```text
Website User, own record
RBP Member, own/tenant record
RBP Business Owner, tenant record
RBP Support Agent, conditional
RBP Admin
System Manager
Administrator
```

### Allowed Actions

```text
view safe payment failure message
retry payment if supported
cancel request
admin reconcile payment
admin mark payment not required, if business rule allows
```

### Restricted Actions

```text
customer cannot bypass payment requirement
operational review should remain blocked unless admin override exists
```

### Entry Conditions

```text
Payment provider or backend payment service records a failed payment event.
```

### Exit Conditions

```text
Payment succeeds after retry.
Admin reconciliation resolves the issue.
User cancels the record.
```

### Typical Transitions

```text
Payment Failed → Payment Pending
Payment Failed → Submitted, admin/system after reconciliation only
Payment Failed → Cancelled
Payment Failed → Archived, admin/system only
```

---

## 6.4 Submitted

### Meaning

The user has formally submitted the record.

### Owner of Next Action

Admin/support/operations.

### Typical Allowed Roles

```text
Owner/customer can read
Business Owner can read tenant record
Team Member can read if permitted
RBP Support Agent can review if assigned/queue authorised
RBP Admin can review
System Manager/Administrator can review
```

### Allowed Actions

```text
customer can view submitted status
customer can attach additional files if product permits
admin/support can begin review
admin can move to In Review
admin/support can request more information
admin can reject/cancel where appropriate
```

### Restricted Actions

```text
customer should not edit core submission fields
customer cannot assign advisor
customer cannot change workflow state directly
customer cannot edit internal/admin fields
```

### Entry Conditions

```text
Draft submission passed validation and payment/entitlement checks.
```

### Exit Conditions

```text
Admin/support starts review.
Admin/support requests more information.
Admin rejects/cancels.
```

### Typical Transitions

```text
Submitted → In Review
Submitted → More Information Required
Submitted → Rejected
Submitted → Cancelled
Submitted → Archived, admin/system only
```

---

## 6.5 In Review

### Meaning

The submission is being assessed by RBP operations, support, or admin.

### Owner of Next Action

RBP Admin, Support Agent, or operations team.

### Typical Allowed Roles

```text
RBP Support Agent, conditional
RBP Admin
System Manager
Administrator
```

### Allowed Actions

```text
review submitted fields
view allowed files
add internal notes
request more information
assign advisor/operator
reject
cancel
move to assigned/in progress depending on product
```

### Restricted Actions

```text
customer cannot edit core fields unless sent to More Information Required
advisor should not access unless assigned or queue-authorised
```

### Entry Conditions

```text
Admin/support begins review of submitted record.
```

### Exit Conditions

```text
Record assigned.
More information requested.
Record rejected/cancelled.
```

### Typical Transitions

```text
In Review → Assigned
In Review → In Progress, if no separate assignment step
In Review → More Information Required
In Review → Rejected
In Review → Cancelled
```

---

## 6.6 More Information Required

### Meaning

The customer/user must provide additional information before processing can continue.

### Owner of Next Action

Customer/user.

### Typical Allowed Roles

```text
Website User, own record if allowed
RBP Member, own/tenant record
RBP Business Owner, tenant record
RBP Team Member, conditional
RBP Admin
System Manager
Administrator
```

### Allowed Actions

```text
customer can view request for information
customer can update specified editable fields
customer can attach requested files
customer can resubmit
admin/support can clarify request
admin can cancel/reject if no response
```

### Restricted Actions

```text
customer cannot edit internal/admin fields
customer cannot edit fields outside the allowed correction scope if product restricts this
advisor assignment should usually wait unless already assigned
```

### Entry Conditions

```text
Admin/support/advisor requests additional information.
```

### Exit Conditions

```text
Customer submits additional information.
Admin cancels/rejects.
```

### Typical Transitions

```text
More Information Required → Submitted
More Information Required → In Review, admin/system only
More Information Required → Cancelled
More Information Required → Rejected, admin/system only
```

---

## 6.7 Assigned

### Meaning

The record has been assigned to an advisor, support agent, reviewer, or operator.

### Owner of Next Action

Assigned user/team.

### Typical Allowed Roles

```text
RBP Advisor, assigned records only
RBP Support Agent, assigned/queue records only
RBP Admin
System Manager
Administrator
```

### Allowed Actions

```text
assigned user can read assigned record
assigned user can update assigned/advisor/support fields
assigned user can move to In Progress where permitted
admin can reassign
admin can request more information
admin can cancel/reject
```

### Restricted Actions

```text
unassigned advisors cannot view or update
customer cannot change assignment
seller/buyer cannot approve or self-assign operational review
```

### Entry Conditions

```text
Admin/support assigns record to user/team.
```

### Exit Conditions

```text
Assigned user begins work.
Record is reassigned.
More information is required.
Record is cancelled/rejected.
```

### Typical Transitions

```text
Assigned → In Progress
Assigned → More Information Required
Assigned → Rejected
Assigned → Cancelled
Assigned → Archived, admin/system only
```

---

## 6.8 In Progress

### Meaning

The assigned user/team is actively working on the record.

### Owner of Next Action

Assigned advisor/support/operator.

### Typical Allowed Roles

```text
Assigned RBP Advisor
Assigned RBP Support Agent
RBP Admin
System Manager
Administrator
```

### Allowed Actions

```text
update advisor/support fields
add internal notes
attach internal or outcome files
request more information
mark outcome ready
admin reassign or cancel
```

### Restricted Actions

```text
customer cannot edit core submission fields
unassigned advisors cannot access
payment state cannot be modified unless billing/admin flow permits
```

### Entry Conditions

```text
Assigned user/team begins work.
```

### Exit Conditions

```text
Outcome/recommendation is ready.
More information is required.
Record is cancelled/rejected.
```

### Typical Transitions

```text
In Progress → Outcome Ready
In Progress → More Information Required
In Progress → Rejected
In Progress → Cancelled
```

---

## 6.9 Outcome Ready

### Meaning

The service outcome, recommendation, result, or next-step response is ready.

### Owner of Next Action

Customer/user, advisor, admin, or support depending on product.

### Typical Allowed Roles

```text
Owner/customer can view safe outcome
Business Owner can view tenant outcome
Assigned advisor/support can view/update outcome fields where allowed
RBP Admin
System Manager
Administrator
```

### Allowed Actions

```text
customer can view outcome
customer can download/view authorised files
admin/advisor can update outcome summary if not closed
customer/admin can close if product permits
admin can request more information if outcome is challenged
```

### Restricted Actions

```text
customer cannot edit internal notes
customer cannot edit advisor recommendation fields
customer cannot reopen unless product supports reopen flow
```

### Entry Conditions

```text
Advisor/support/admin marks outcome as ready.
```

### Exit Conditions

```text
Customer acknowledges/closes.
Admin closes.
Record is reopened or moved back to In Progress if correction is needed.
```

### Typical Transitions

```text
Outcome Ready → Closed
Outcome Ready → In Progress, admin/advisor correction only
Outcome Ready → More Information Required, if clarification needed
Outcome Ready → Archived, admin/system only
```

---

## 6.10 Closed

### Meaning

The record lifecycle is complete.

### Owner of Next Action

No ordinary next action. Admin/system may archive or reopen if product permits.

### Typical Allowed Roles

```text
Owner/customer can read safe final record
Business Owner can read tenant final record
Advisor/support can read assigned final record where allowed
RBP Admin
System Manager
Administrator
```

### Allowed Actions

```text
view final status
view final authorised files
admin archive
admin reopen, only if product explicitly permits
audit retained
```

### Restricted Actions

```text
customer cannot edit
advisor/support cannot edit unless reopened or admin-authorised
normal workflow transitions are locked
```

### Entry Conditions

```text
Outcome completed, request fulfilled, listing archived/complete, order complete, or admin closes record.
```

### Exit Conditions

```text
Archive.
Reopen only if product-specific contract allows.
```

### Typical Transitions

```text
Closed → Archived
Closed → In Progress, admin-only reopen if explicitly allowed
```

---

## 6.11 Rejected

### Meaning

The submission was reviewed and rejected.

### Owner of Next Action

Customer may review reason or create a new submission. Admin may archive.

### Typical Allowed Roles

```text
Owner/customer can read rejection reason if safe
Business Owner can read tenant rejection reason
RBP Admin
System Manager
Administrator
```

### Allowed Actions

```text
view rejection status
view safe rejection reason
create new submission if allowed
admin archive
admin reopen if error occurred
```

### Restricted Actions

```text
customer cannot force approval
customer cannot edit rejected record unless product allows resubmission
```

### Entry Conditions

```text
Admin/support rejects record.
```

### Exit Conditions

```text
Archive.
Reopen/resubmit only if product supports it.
```

### Typical Transitions

```text
Rejected → Archived
Rejected → Draft, admin/customer resubmission only if product allows
Rejected → In Review, admin-only correction
```

---

## 6.12 Cancelled

### Meaning

The record was cancelled before normal completion.

### Owner of Next Action

No ordinary next action. Admin/system may archive.

### Typical Allowed Roles

```text
Owner/customer can view own cancelled record
Business Owner can view tenant cancelled record
RBP Admin
System Manager
Administrator
```

### Allowed Actions

```text
view cancellation status
view safe cancellation reason
admin archive
admin reopen only if product allows
```

### Restricted Actions

```text
customer cannot update cancelled record
workflow should not continue without admin/system action
```

### Entry Conditions

```text
Customer cancels before processing cutoff.
Admin cancels.
System cancels due to expiry/payment failure/business rule.
```

### Exit Conditions

```text
Archive.
Admin reopen only if explicitly allowed.
```

### Typical Transitions

```text
Cancelled → Archived
Cancelled → Draft or Submitted, admin-only if product allows
```

---

## 6.13 Archived

### Meaning

The record is retained for history but removed from active operational views.

### Owner of Next Action

Admin/system only.

### Typical Allowed Roles

```text
RBP Admin
System Manager
Administrator
```

Customer roles may see archived records only if product UX deliberately exposes history.

### Allowed Actions

```text
admin/system read
audit retention
restore if product/admin policy permits
```

### Restricted Actions

```text
customer cannot edit
customer cannot transition
advisor/support cannot edit unless restored
```

### Entry Conditions

```text
Admin/system archives closed, rejected, cancelled, stale, or migrated record.
```

### Exit Conditions

```text
Restore/reopen only by admin/system if policy permits.
```

### Typical Transitions

```text
Archived → Closed, admin restore
Archived → In Review, admin restore for correction only
```

---

## 7. Generic Workflow Pattern

The standard submission workflow is:

```text
Draft
  ↓
Submitted
  ↓
In Review
  ↓
Assigned
  ↓
In Progress
  ↓
Outcome Ready
  ↓
Closed
```

Optional branches:

```text
Draft → Payment Pending → Submitted
Payment Pending → Payment Failed → Payment Pending
Submitted/In Review/Assigned/In Progress → More Information Required → Submitted
Submitted/In Review/Assigned/In Progress → Rejected
Draft/Submitted/In Review/Assigned/In Progress → Cancelled
Closed/Rejected/Cancelled → Archived
```

---

## 8. Generic Transition Matrix

| From State | To State | Allowed Roles | Notes |
|---|---|---|---|
| Draft | Submitted | Website User, RBP Member, Business Owner, Team Member conditional, RBP Admin | Must pass validation. |
| Draft | Payment Pending | Website User, RBP Member, Business Owner, System | When payment required. |
| Draft | Cancelled | Owner, Business Owner, RBP Admin | If product permits cancellation. |
| Payment Pending | Submitted | System, RBP Admin | After payment success/reconciliation. |
| Payment Pending | Payment Failed | System | Payment provider/backend event. |
| Payment Pending | Cancelled | Owner, Business Owner, RBP Admin | If cancellation allowed. |
| Payment Failed | Payment Pending | Owner, Business Owner, RBP Admin | Retry payment. |
| Payment Failed | Submitted | RBP Admin, System Manager | Admin reconciliation only. |
| Submitted | In Review | RBP Support Agent conditional, RBP Admin | Admin/support begins review. |
| Submitted | More Information Required | RBP Support Agent conditional, RBP Admin | Customer action needed. |
| Submitted | Rejected | RBP Admin | Submission rejected. |
| Submitted | Cancelled | Owner conditional, Business Owner conditional, RBP Admin | Depends on product stage. |
| In Review | Assigned | RBP Support Agent conditional, RBP Admin | Assign advisor/operator. |
| In Review | In Progress | RBP Support Agent conditional, RBP Admin | Used when no assignment step. |
| In Review | More Information Required | RBP Support Agent conditional, RBP Admin | Customer action needed. |
| In Review | Rejected | RBP Admin | Rejected after review. |
| Assigned | In Progress | Assigned Advisor/Support Agent, RBP Admin | Work begins. |
| Assigned | More Information Required | Assigned Advisor/Support Agent, RBP Admin | Customer action needed. |
| Assigned | Rejected | RBP Admin | Admin-only rejection. |
| In Progress | Outcome Ready | Assigned Advisor/Support Agent, RBP Admin | Work completed. |
| In Progress | More Information Required | Assigned Advisor/Support Agent, RBP Admin | Customer action needed. |
| Outcome Ready | Closed | Owner conditional, Business Owner conditional, Assigned Advisor conditional, RBP Admin | Product-specific closure. |
| Outcome Ready | In Progress | Assigned Advisor, RBP Admin | Correction/rework. |
| Closed | Archived | RBP Admin, System Manager | Retention/archive. |
| Rejected | Archived | RBP Admin, System Manager | Retention/archive. |
| Cancelled | Archived | RBP Admin, System Manager | Retention/archive. |
| Archived | Closed/In Review | RBP Admin, System Manager | Restore only when policy permits. |

---

## 9. Role Transition Summary

| Role | Typical Transition Authority |
|---|---|
| Guest | None, except public intake creation if explicitly allowed |
| Website User | Draft → Submitted for own allowed records |
| RBP Member | Draft → Submitted, More Information Required → Submitted, limited cancel/close |
| RBP Business Owner | Tenant-level submit/cancel/close where product permits |
| RBP Team Member | Conditional submit/update based on tenant policy |
| RBP Advisor | Assigned → In Progress, In Progress → Outcome Ready, request more info if assigned |
| RBP Marketplace Seller | Draft → Pending Review for own listings |
| RBP Marketplace Buyer | Create/submit own enquiries only |
| RBP Support Agent | Conditional review/assign/request-info transitions |
| RBP Admin | Full operational workflow transitions |
| System Manager | Full system workflow authority |
| Administrator | Full technical/system authority |

---

## 10. Field Editability by Workflow State

| State | Customer Editable Fields | Advisor/Support Editable Fields | Admin Editable Fields |
|---|---|---|---|
| Draft | Yes, form fields | No | Yes |
| Payment Pending | Limited payment/contact fields | No | Yes |
| Payment Failed | Limited payment retry/contact fields | No | Yes |
| Submitted | No, except allowed supplemental files | Limited | Yes |
| In Review | No | Limited support fields | Yes |
| More Information Required | Specified customer fields/files | Limited | Yes |
| Assigned | No | Assigned fields | Yes |
| In Progress | No | Assigned fields/outcome work | Yes |
| Outcome Ready | No, except acknowledgement if needed | Limited corrections | Yes |
| Closed | No | No, unless reopened | Limited/admin only |
| Rejected | No, unless resubmission allowed | No | Limited/admin only |
| Cancelled | No | No | Limited/admin only |
| Archived | No | No | System/admin only |

### 10.1 Customer Field Locking Rule

After submission, customer-editable form fields should be locked unless the record is moved to:

```text
More Information Required
Draft, if resubmission is deliberately supported
```

### 10.2 Internal Field Protection

These fields must not be customer-editable:

```text
workflow_state
status
assigned_to
internal_notes
advisor_notes
recommendation_summary
resolution_summary
admin_review_status
payment_status
latest_payment_event
audit_reference
rejection_reason, except where customer-facing copy is separately provided
```

---

## 11. File Upload Rules by Workflow State

| State | Customer Upload | Advisor/Support Upload | Admin Upload |
|---|---:|---:|---:|
| Draft | Yes, if product supports uploads | No | Yes |
| Payment Pending | Conditional | No | Yes |
| Payment Failed | Conditional | No | Yes |
| Submitted | Conditional supplemental upload | Conditional | Yes |
| In Review | Conditional if requested | Yes, internal/admin depending on role | Yes |
| More Information Required | Yes, requested files | Yes | Yes |
| Assigned | Conditional | Yes | Yes |
| In Progress | Conditional | Yes | Yes |
| Outcome Ready | No, unless dispute/clarification flow | Yes, outcome files | Yes |
| Closed | No | No | Admin only |
| Rejected | No, unless resubmission allowed | No | Admin only |
| Cancelled | No | No | Admin only |
| Archived | No | No | Admin/system only |

### 11.1 File Visibility Defaults

| State / Context | Default Visibility |
|---|---|
| Customer upload in Draft | `private_to_owner` or `tenant_visible` |
| Customer upload after More Information Required | `tenant_visible` or product-specific |
| Advisor working file | `advisor_visible` |
| Admin internal file | `admin_only` |
| Published marketplace media | `public` only after approval/publish |
| Final outcome file shared with customer | Product-specific, usually `tenant_visible` |

---

## 12. Payment Interaction Rules

Workflow state and payment state are related but separate.

| Workflow State | Payment Relationship |
|---|---|
| Draft | Payment may not yet exist. |
| Payment Pending | Payment required and awaiting confirmation. |
| Payment Failed | Payment failed and workflow cannot proceed unless reconciled. |
| Submitted | Payment requirement satisfied or not required. |
| In Review onward | Payment should generally already be resolved unless service permits post-payment. |
| Cancelled | Payment may require cancellation/refund handling. |
| Closed | Payment record retained for history. |

### 12.1 Payment Rule

Do not use `workflow_state = Paid`.

Payment state belongs in:

```text
RBP Payment Event
payment_status
latest_payment_event
```

Workflow may depend on payment, but payment is not the workflow itself. A subtle distinction, apparently too much for many systems, but we persist.

---

## 13. Notification Triggers by Workflow Transition

| Transition | Notification Trigger | Recipient |
|---|---|---|
| Draft → Submitted | `<domain>_submitted` | User/customer, admin/support |
| Draft → Payment Pending | `payment_pending` | User/customer |
| Payment Pending → Submitted | `payment_confirmed` | User/customer, admin/support |
| Payment Pending → Payment Failed | `payment_failed` | User/customer, billing/admin |
| Submitted → In Review | `<domain>_in_review` | User/customer optional, admin/support |
| Submitted/In Review → More Information Required | `more_information_requested` | User/customer |
| In Review → Assigned | `advisor_assigned` or `<domain>_assigned` | Assigned user, user/customer optional |
| Assigned → In Progress | `<domain>_in_progress` | User/customer optional |
| In Progress → Outcome Ready | `<domain>_outcome_ready` | User/customer |
| Outcome Ready → Closed | `<domain>_closed` | User/customer, admin optional |
| Any active → Rejected | `<domain>_rejected` | User/customer |
| Any active → Cancelled | `<domain>_cancelled` | User/customer, admin optional |
| Closed/Rejected/Cancelled → Archived | Usually none | Admin/system only |

### 13.1 Notification Rule

Not every state change needs a user notification. Every user-actionable state change should have one.

---

## 14. Audit Events by Workflow Transition

| Transition Type | Audit Event |
|---|---|
| Record created | `record_created` |
| Record submitted | `record_submitted` |
| Workflow state changed | `workflow_transitioned` |
| Advisor/support assigned | `advisor_assigned` or `record_assigned` |
| More information requested | `more_information_requested` |
| Outcome marked ready | `outcome_ready` |
| Record closed | `record_closed` |
| Record rejected | `record_rejected` |
| Record cancelled | `record_cancelled` |
| Record archived | `record_archived` |
| Payment workflow block | `payment_state_blocked_workflow` |
| Permission denied | `permission_denied` |
| Admin transition performed | `admin_action_performed` |

### 14.1 Audit Rule

Every workflow transition must record:

```text
- acting user or system actor
- source state
- target state
- related DocType
- related record
- timestamp
- reason, where supplied
- admin action, where applicable
```

---

## 15. API Contract Requirements for Workflow

## 15.1 Create

Create endpoints should usually create records in `Draft`.

```text
POST /api/method/rbp_app.api.<domain>.create_<resource>
```

Response should include:

```json
{
  "name": "RBP-XXX-0001",
  "status": "draft",
  "workflow_state": "Draft"
}
```

## 15.2 Update Draft

Update endpoints should allow customer edits only when workflow state allows them.

```text
POST /api/method/rbp_app.api.<domain>.update_<resource>
```

Must reject updates when state is not editable.

## 15.3 Submit

Submit endpoints should validate required fields and transition to `Submitted`, `Payment Pending`, or `Payment Failed` depending on product/payment requirements.

```text
POST /api/method/rbp_app.api.<domain>.submit_<resource>
```

## 15.4 Get

Get endpoints must return safe workflow fields:

```text
GET /api/method/rbp_app.api.<domain>.get_<resource>
```

Suggested workflow response fragment:

```json
{
  "status": "in_review",
  "workflow_state": "In Review",
  "can_edit": false,
  "can_submit": false,
  "can_cancel": true,
  "next_actions": [
    {
      "code": "view_status",
      "label": "View Status"
    }
  ]
}
```

## 15.5 Admin Transitions

Admin action endpoints must perform controlled workflow transitions:

```text
POST /api/method/rbp_app.api.<domain>.admin_<action>
```

Examples:

```text
admin_assign_advisor
admin_request_more_information
admin_approve_listing
admin_reject_listing
admin_close_request
admin_archive_record
```

## 15.6 Forbidden API Behaviour

APIs must not allow the frontend to send arbitrary workflow state changes.

Do not accept payloads like:

```json
{
  "workflow_state": "Closed"
}
```

unless the endpoint is an authorised admin workflow action and validates the transition.

The frontend does not get to appoint itself Minister for Workflow Affairs.

---

## 16. Standard Workflow Error Responses

All workflow errors must use the standard response envelope.

## 16.1 Invalid Transition

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

## 16.2 Record Locked

```json
{
  "ok": false,
  "data": null,
  "message": "Record is locked",
  "errors": [
    {
      "field": null,
      "code": "record_locked",
      "message": "This record can no longer be edited in its current state."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

## 16.3 Required Fields Missing Before Submit

```json
{
  "ok": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "decision_summary",
      "code": "required",
      "message": "Decision summary is required before submission."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

## 16.4 Payment Required

```json
{
  "ok": false,
  "data": null,
  "message": "Payment required",
  "errors": [
    {
      "field": "payment_status",
      "code": "payment_required",
      "message": "Payment must be completed before this request can proceed."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

---

# PRODUCT-SPECIFIC WORKFLOW STANDARDS

---

## 17. Decision Desk Workflow

## 17.1 Recommended States

```text
Draft
Submitted
In Review
Advisor Assigned
In Progress
Recommendation Ready
Closed
```

Optional:

```text
Payment Pending
Payment Failed
More Information Required
Rejected
Cancelled
Archived
```

## 17.2 API Values

| Label | API Value |
|---|---|
| Draft | `draft` |
| Submitted | `submitted` |
| In Review | `in_review` |
| Advisor Assigned | `advisor_assigned` |
| In Progress | `in_progress` |
| Recommendation Ready | `recommendation_ready` |
| Closed | `closed` |

## 17.3 Transition Pattern

```text
Draft
  ↓
Submitted
  ↓
In Review
  ↓
Advisor Assigned
  ↓
In Progress
  ↓
Recommendation Ready
  ↓
Closed
```

## 17.4 Key Rules

```text
Customer can edit only in Draft or More Information Required.
Admin assigns advisor.
Advisor can update recommendation fields only when assigned.
Recommendation Ready triggers customer notification.
Closed locks the record.
```

## 17.5 Admin Actions

```text
admin_assign_advisor
admin_request_more_information
admin_mark_recommendation_ready
admin_close_request
admin_reject_request
admin_archive_request
```

---

## 18. DocuShare Workflow

## 18.1 Recommended States

```text
Draft
Submitted
In Review
Assigned
In Progress
Outcome Ready
Closed
```

Optional:

```text
More Information Required
Rejected
Cancelled
Archived
Payment Pending
Payment Failed
```

## 18.2 Key Rules

```text
Customer creates document brief in Draft.
Customer submits when required document details are complete.
Reviewer/admin reviews submission.
Reviewer/admin may request more information.
Outcome Ready means document/review outcome is available.
Closed means document request is complete.
```

## 18.3 Admin Actions

```text
admin_assign_reviewer
admin_request_more_information
admin_mark_outcome_ready
admin_close_brief
admin_reject_brief
admin_archive_brief
```

---

## 19. Marketplace Listing Workflow

## 19.1 Recommended States

```text
Draft
Pending Review
Published
Rejected
Archived
```

Optional:

```text
Payment Pending
Payment Failed
Cancelled
```

## 19.2 API Values

| Label | API Value |
|---|---|
| Draft | `draft` |
| Pending Review | `pending_review` |
| Published | `published` |
| Rejected | `rejected` |
| Archived | `archived` |

## 19.3 Transition Pattern

```text
Draft
  ↓
Pending Review
  ↓      ↓
Published Rejected
  ↓
Archived
```

Optional payment branch:

```text
Draft → Payment Pending → Pending Review
Payment Pending → Payment Failed
Payment Failed → Payment Pending
```

## 19.4 Key Rules

```text
Seller can create and update own Draft listing.
Seller can submit listing for review.
Seller cannot approve, publish, or reject own listing.
RBP Admin approves or rejects.
Published listings become public-facing.
Public media becomes public only after Published.
Rejected listings may be edited and resubmitted if product rules allow.
```

## 19.5 Admin Actions

```text
admin_approve_listing
admin_reject_listing
admin_publish_listing
admin_archive_listing
admin_request_listing_changes
```

---

## 20. Marketplace Enquiry Workflow

## 20.1 Recommended States

```text
New
In Review
Sent to Seller
Closed
Spam
Archived
```

## 20.2 API Values

| Label | API Value |
|---|---|
| New | `new` |
| In Review | `in_review` |
| Sent to Seller | `sent_to_seller` |
| Closed | `closed` |
| Spam | `spam` |
| Archived | `archived` |

## 20.3 Key Rules

```text
Buyer creates enquiry.
Admin/system may review enquiry before sending to seller.
Seller can view enquiries for own listing only after visibility rules allow.
Spam enquiries should not notify seller unless overridden.
```

## 20.4 Admin Actions

```text
admin_review_enquiry
admin_send_enquiry_to_seller
admin_mark_enquiry_spam
admin_close_enquiry
admin_archive_enquiry
```

---

## 21. Connectivity / NBN Workflow

## 21.1 Recommended States

```text
Draft
Serviceability Check
Payment Pending
Submitted
In Review
Provisioning
Complete
Closed
```

Optional:

```text
Payment Failed
More Information Required
Cancelled
Archived
```

## 21.2 API Values

| Label | API Value |
|---|---|
| Draft | `draft` |
| Serviceability Check | `serviceability_check` |
| Payment Pending | `payment_pending` |
| Submitted | `submitted` |
| In Review | `in_review` |
| Provisioning | `provisioning` |
| Complete | `complete` |
| Closed | `closed` |

## 21.3 Key Rules

```text
Serviceability check may occur before order submission.
Payment may be required before submission or provisioning.
Support/admin updates provisioning state.
Customer cannot manually set serviceability, payment, or provisioning status.
Complete indicates service/order fulfilment.
Closed indicates operational closure.
```

## 21.4 Admin Actions

```text
admin_override_serviceability
admin_update_provisioning_status
admin_request_more_information
admin_mark_complete
admin_cancel_order
admin_archive_order
```

---

## 22. Risk Advisor Workflow

## 22.1 Recommended States

```text
Draft
Submitted
In Review
Assigned
In Progress
Outcome Ready
Closed
```

Optional:

```text
More Information Required
Rejected
Cancelled
Archived
Payment Pending
Payment Failed
```

## 22.2 Key Rules

```text
Customer completes risk intake in Draft.
Submitted locks customer answers unless More Information Required.
Advisor can access only assigned assessments.
Advisor/admin can mark assessment outcome ready.
Risk score fields must not be customer-editable after submission.
```

## 22.3 Admin Actions

```text
admin_assign_advisor
admin_request_more_information
admin_mark_assessment_complete
admin_close_assessment
admin_reject_assessment
admin_archive_assessment
```

---

## 23. The Fixer Workflow

## 23.1 Recommended States

```text
Draft
Submitted
In Review
Assigned
In Progress
Outcome Ready
Closed
```

Optional:

```text
More Information Required
Rejected
Cancelled
Archived
Payment Pending
Payment Failed
```

## 23.2 Key Rules

```text
Customer creates issue request in Draft.
Submitted locks core issue fields.
Support/admin reviews urgency and scope.
Support/admin may assign owner/operator.
Outcome Ready means resolution or next-step plan is available.
Closed means the request is complete.
```

## 23.3 Admin Actions

```text
admin_assign_request
admin_update_priority
admin_request_more_information
admin_mark_outcome_ready
admin_close_request
admin_cancel_request
admin_archive_request
```

---

## 24. Membership / Subscription Lifecycle

Membership/subscription state is partly workflow and partly billing lifecycle.

## 24.1 Recommended Subscription States

```text
Pending
Active
Past Due
Suspended
Cancelled
Expired
Archived
```

## 24.2 API Values

| Label | API Value |
|---|---|
| Pending | `pending` |
| Active | `active` |
| Past Due | `past_due` |
| Suspended | `suspended` |
| Cancelled | `cancelled` |
| Expired | `expired` |
| Archived | `archived` |

## 24.3 Key Rules

```text
Pending before payment/activation.
Active grants member entitlements.
Past Due may trigger warning and limited access.
Suspended may restrict entitlements.
Cancelled stops renewal and may end access depending on billing period.
Expired ends entitlement.
Archived removes subscription from active operational views.
```

## 24.4 Payment Events

Subscription state should be updated from:

```text
payment_success
payment_failed
subscription_created
subscription_renewed
subscription_cancelled
subscription_expired
admin_reconciled
```

---

## 25. File Reference Lifecycle

## 25.1 Recommended File States

```text
Active
Removed
Quarantined
Archived
```

## 25.2 API Values

| Label | API Value |
|---|---|
| Active | `active` |
| Removed | `removed` |
| Quarantined | `quarantined` |
| Archived | `archived` |

## 25.3 Key Rules

```text
Uploaded files start Active unless flagged.
Quarantined files are blocked from normal viewing.
Removed files are no longer user-visible.
Archived files are retained for history.
Public visibility requires explicit approval or a product rule.
```

---

## 26. Frappe Implementation Notes

Phase 3 should implement workflows using Frappe Workflow where appropriate.

Implementation should define:

```text
- Workflow document per workflow-enabled DocType
- states
- transitions
- allowed roles
- update field
- document status mapping where applicable
- role permissions
- transition actions
- audit logging hooks
- notification hooks
```

Recommended backend modules:

```text
rbp_app/
└── rbp_app/
    ├── services/
    │   ├── workflows.py
    │   ├── notifications.py
    │   ├── audit.py
    │   ├── billing.py
    │   └── files.py
    ├── permissions.py
    ├── guards.py
    └── hooks.py
```

### 26.1 Service-Layer Workflow Function Pattern

Recommended service functions:

```python
def transition_record(user: str, doctype: str, name: str, target_state: str, reason: str | None = None):
    ...

def validate_transition(user: str, doc, source_state: str, target_state: str):
    ...

def apply_transition_effects(user: str, doc, source_state: str, target_state: str):
    ...

def get_next_actions(user: str, doc) -> list[dict]:
    ...
```

### 26.2 API Pattern

Admin workflow APIs should call service-layer functions.

Example:

```python
@frappe.whitelist()
def admin_assign_advisor(request_name: str, advisor: str):
    return decision_desk_service.assign_advisor(
        user=frappe.session.user,
        request_name=request_name,
        advisor=advisor
    )
```

---

## 27. Frontend Workflow Contract

The frontend should not hardcode workflow logic inside individual pages.

Recommended frontend concepts:

```text
status badge
progress timeline
next action panel
admin action menu
workflow history panel
locked field display
more information required banner
payment pending/failed banner
```

Workflow state display should come from API DTOs:

```json
{
  "workflow_state": "More Information Required",
  "status": "more_information_required",
  "display_status": "More Information Required",
  "can_edit": true,
  "can_submit": true,
  "can_attach_file": true,
  "next_actions": [
    {
      "code": "provide_more_information",
      "label": "Provide More Information",
      "route": "/portal/requests/RBP-DDR-0001/edit"
    }
  ]
}
```

### 27.1 Frontend Rules

```text
Do not trust frontend state for permissions.
Do not allow arbitrary state change payloads.
Use API-provided can_* flags for UI convenience.
Always handle backend workflow errors.
Show user-friendly state labels.
Use consistent badge styles across domains.
```

---

## 28. Workflow History

Every workflow-enabled product record should support workflow history, either through Frappe workflow/action logs, `RBP Audit Log`, or both.

Workflow history should capture:

```text
source_state
target_state
transition_action
acted_by
acted_on
reason
admin_action
notification_triggered
```

Customer-facing workflow history should hide:

```text
internal_notes
internal rejection details
private admin comments
raw payment details
security-sensitive audit data
```

---

## 29. Validation Requirements

Before transition, backend must validate:

```text
current state
target state
allowed transition
user role
tenant access
ownership or assignment
entitlement
required fields
payment requirement
file requirement, if any
field-level editability
admin action payload, if any
```

### 29.1 Submit Validation

Before `Draft → Submitted`, validate:

```text
required form fields
accepted terms where applicable
entitlement or payment requirement
file requirements where applicable
tenant ownership
duplicate submission rules
```

### 29.2 Assignment Validation

Before `In Review → Assigned` or similar, validate:

```text
assigned user exists
assigned user has required role
assigned user is active
record is assignable in current state
admin/support user has assign authority
```

### 29.3 Outcome Validation

Before `In Progress → Outcome Ready`, validate:

```text
assigned user has authority
outcome/recommendation fields are complete
required files are attached where applicable
customer-visible outcome is safe
```

### 29.4 Closure Validation

Before `Outcome Ready → Closed`, validate:

```text
record has outcome or valid closure reason
payment/refund issues are settled where required
required notifications are sent or queued
audit event is recorded
```

---

## 30. QA Test Requirements

## 30.1 Generic Workflow Tests

```text
test_draft_can_be_submitted_when_valid
test_draft_cannot_be_submitted_when_required_fields_missing
test_customer_cannot_edit_submitted_record
test_admin_can_move_submitted_to_in_review
test_admin_can_request_more_information
test_customer_can_resubmit_more_information_required_record
test_unassigned_advisor_cannot_access_assigned_record
test_assigned_advisor_can_move_assigned_to_in_progress
test_assigned_advisor_can_mark_outcome_ready
test_customer_can_view_outcome_ready_record
test_closed_record_blocks_customer_edit
test_archived_record_removed_from_active_lists
```

## 30.2 Payment Workflow Tests

```text
test_payment_required_record_moves_to_payment_pending
test_payment_success_moves_payment_pending_to_submitted
test_payment_failure_moves_payment_pending_to_payment_failed
test_customer_cannot_manually_set_payment_paid
test_admin_can_reconcile_payment_failed_record
```

## 30.3 File Workflow Tests

```text
test_customer_can_upload_file_in_draft
test_customer_can_upload_requested_file_in_more_information_required
test_customer_cannot_upload_file_to_closed_record
test_admin_can_attach_file_to_closed_record_if_allowed
test_public_file_visibility_requires_published_listing
```

## 30.4 Product-Specific Tests

```text
test_decision_desk_admin_assigns_advisor
test_decision_desk_advisor_marks_recommendation_ready
test_marketplace_seller_submits_listing_for_review
test_marketplace_seller_cannot_publish_listing
test_marketplace_admin_approves_listing
test_connectivity_order_enters_provisioning
test_risk_advisor_assessment_locks_answers_after_submit
test_fixer_request_support_agent_updates_operational_status
```

## 30.5 Error Response Tests

```text
test_invalid_transition_returns_workflow_transition_denied
test_locked_record_returns_record_locked
test_missing_required_submit_field_returns_validation_error
test_payment_required_returns_payment_required
test_unauthorised_transition_returns_permission_denied
```

---

## 31. Open Items for Final Phase 2 Lock

These items must be finalised after Phase 1 UI/UX completion:

| Item | Status | Notes |
|---|---|---|
| Final state list per product | Draft | Depends on completed UI flows |
| Final route-specific status screens | Draft | Depends on frontend route audit |
| Final customer close/acknowledge behaviour | Draft | Product rule required |
| Final cancellation rules | Draft | Depends on operational policy |
| Final resubmission rules after rejection | Draft | Product rule required |
| Final payment-required transitions | Draft | Depends on commercial model |
| Final file-upload rules per state | Draft | Depends on upload contract |
| Final admin action list | Draft | Depends on admin UI concepts |
| Final advisor/support assignment logic | Draft | Depends on operations model |
| Final notification triggers | Draft | Depends on notification contract |
| Final workflow history UX | Draft | Depends on portal/admin UI |

---

## 32. Workflow Standards Acceptance Checklist

This document is ready for draft Phase 2 use when:

```text
Canonical workflow states are defined.
API values for workflow states are defined.
The distinction between status and workflow_state is defined.
Generic state meanings are defined.
Generic transition matrix is defined.
Role transition summary is defined.
Field editability by state is defined.
File upload rules by state are defined.
Payment interaction rules are defined.
Notification triggers by transition are defined.
Audit events by transition are defined.
API contract requirements are defined.
Standard workflow error responses are defined.
Product-specific workflows are defined.
Frappe implementation notes are defined.
Frontend workflow contract is defined.
Workflow history requirements are defined.
Validation requirements are defined.
QA test requirements are defined.
Open items are listed for final lock.
```

---

## 33. Phase 2 Sign-Off Criteria

This workflow standard can be signed off only when:

```text
Every Phase 1 product flow has a defined workflow or deliberate no-workflow decision.
Every workflow-enabled DocType has approved states.
Every state has a clear meaning.
Every transition has allowed roles.
Every transition has validation rules.
Every user-actionable transition has notification rules.
Every important transition has audit logging.
Every state defines customer/admin/advisor editability.
Every upload-capable state defines file rules.
Every payment-dependent flow defines payment interaction.
Every admin action maps to a workflow transition or deliberate no-transition action.
Every API contract returns consistent workflow fields.
Every invalid transition returns a standard error response.
QA tests cover the workflow transitions.
```

Until then, this remains a draft.

---

## 34. Final Rule

Workflow state is not decoration.

It decides:

```text
who owns the next action
who can edit
who can view
who can assign
who gets notified
what gets audited
what payment or file rule applies
what the frontend displays
what the admin can do next
```

If a state does not answer those questions, it is not a workflow state. It is a label having an identity crisis.
