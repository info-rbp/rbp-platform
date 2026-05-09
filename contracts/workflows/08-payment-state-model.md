# RBP Phase 2 Backend Contracts
# 08-payment-state-model.md

## Document Status

| Field | Value |
|---|---|
| Document | Payment State Model |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/08-payment-state-model.md` |
| Intended Final Location | `rbp-platform/contracts/payments/payment-state-model.md` |
| Primary Consumers | Frappe backend, frontend, billing/admin operations, QA, integrations |

---

## 1. Purpose

This document defines the payment state model for the Remote Business Partner Platform.

It establishes:

```text
- canonical payment states
- subscription states
- payment event types
- payment lifecycle rules
- payment-to-workflow interactions
- payment-to-entitlement interactions
- payment-related DocTypes
- payment API expectations
- webhook/idempotency requirements
- frontend payment display rules
- admin reconciliation rules
- security/privacy requirements
- error handling requirements
- QA test requirements
```

This is a Phase 2 backend contract document. It does not implement payments. It defines how payment state must be modelled before Phase 3 Frappe implementation begins.

The purpose is to ensure payment behaviour is explicit, auditable, and not left to “whatever the checkout page felt like today,” which is how billing systems become small claims court with buttons.

---

## 2. Scope

This document applies to payment and billing behaviour across:

```text
Membership signup
Membership subscriptions
Service purchases, where applicable
Marketplace listing fees, where applicable
Connectivity / NBN orders, where applicable
Paid add-ons or entitlements
Payment provider webhooks
Payment event recording
Subscription lifecycle
Admin reconciliation
Frontend payment result screens
Portal billing summaries
Notifications
Audit logs
```

This document covers payment state modelling only.

It does not define:

```text
- final payment provider selection
- final provider API implementation
- final pricing/commercial model
- final tax/invoice implementation
- final accounting integration
```

Those can be layered on later. Apparently money needs its own ecosystem of paperwork because civilization was a mistake, but here we are.

---

## 3. Related Phase 2 Documents

This document should be read with:

```text
index.md
01-api-response-envelope-standard.md
02-naming-conventions.md
03-role-matrix.md
04-permission-model-draft.md
05-core-doctype-model.md
06-workflow-state-standards.md
07-error-catalogue.md
09-upload-file-rules.md
14-notification-triggers.md
11-route-to-endpoint-map.md
12-form-field-specifications.md
13-validation-rules.md
15-admin-actions.md
16-mock-to-real-api-map.md
17-phase-2-acceptance-gate.md
```

Key dependencies:

```text
05-core-doctype-model.md
  Defines RBP Payment Event and RBP Subscription.

06-workflow-state-standards.md
  Defines Payment Pending and Payment Failed workflow interactions.

07-error-catalogue.md
  Defines payment-related API error codes.
```

---

## 4. Payment Model Principles

All payment modelling must follow these principles:

| Principle | Rule |
|---|---|
| Backend authority | Payment state must be controlled by backend/provider events, not frontend claims. |
| Provider-neutral model | Platform states must not be hardcoded to one payment provider. |
| Event-based recordkeeping | Payment changes must create `RBP Payment Event` records. |
| Idempotency | Duplicate provider events must not create duplicate business effects. |
| Auditability | Payment changes, failures, reconciliations, and overrides must be auditable. |
| Workflow-aware | Payment state may block or advance product workflows. |
| Entitlement-aware | Paid membership or add-ons must control entitlements. |
| Privacy-first | Raw payment payloads and provider details must be restricted. |
| Safe frontend | Frontend sees safe summaries, never raw provider payloads. |
| Admin reconciliation | Admins need controlled correction tools for real-world payment messiness. |
| No mystery money | Every paid action must map to a record, state, event, and audit trail. |

---

## 5. Core Payment DocTypes

## 5.1 RBP Payment Event

### Purpose

Records payment, subscription, refund, dispute, webhook, and reconciliation events.

### Required Fields

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
| `provider_subscription_id` | Data | Conditional | Provider subscription ID |
| `amount` | Currency | Conditional | Payment amount |
| `currency` | Data | Conditional | Currency code |
| `status` | Select | Yes | Payment state |
| `event_type` | Data / Select | Yes | Payment event type |
| `raw_payload` | Long Text / JSON | Conditional | Raw provider payload, restricted |
| `processed_on` | Datetime | Conditional | Processing timestamp |
| `idempotency_key` | Data | Conditional | Deduplication key |
| `reconciliation_status` | Select | Conditional | Unreviewed, Reconciled, Needs Review |
| `notes` | Small Text | No | Admin/internal notes |

### Rules

```text
Every provider webhook should create or update an RBP Payment Event.
provider_event_id should be unique when provided.
idempotency_key should be unique when provided.
raw_payload must be restricted to authorised admin/system roles.
Payment Event records must not be edited by customer-side users.
```

---

## 5.2 RBP Subscription

### Purpose

Tracks tenant/user membership subscription status and provider relationship.

### Payment-Relevant Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Yes | Subscription tenant |
| `member` | Link: User | Yes | Primary member |
| `plan` | Link: RBP Membership Plan | Yes | Membership plan |
| `status` | Select | Yes | Subscription lifecycle state |
| `billing_cycle` | Select | Yes | Monthly, Annual, etc. |
| `payment_provider` | Data / Select | Conditional | Provider |
| `provider_customer_id` | Data | Conditional | Provider customer |
| `provider_subscription_id` | Data | Conditional | Provider subscription |
| `current_period_start` | Date | Conditional | Billing period start |
| `current_period_end` | Date | Conditional | Billing period end |
| `cancel_at_period_end` | Check | Conditional | Scheduled cancellation |
| `last_payment_event` | Link: RBP Payment Event | Conditional | Latest payment event |

### Rules

```text
Subscription status controls membership entitlement.
Subscription state must be updated by payment events, backend services, or authorised admin actions.
Customer users must not directly update subscription state.
```

---

## 5.3 RBP App Entitlement

### Purpose

Controls service/product access based on subscription, add-ons, trials, or admin grants.

### Payment-Relevant Fields

| Fieldname | Type | Required | Notes |
|---|---|---:|---|
| `tenant` | Link: RBP Tenant | Conditional | Tenant entitlement |
| `user` | Link: User | Conditional | User entitlement |
| `app_key` | Data / Select | Yes | Entitlement key |
| `entitlement_type` | Select | Yes | Plan, Add-on, Trial, Manual, Admin Override |
| `status` | Select | Yes | Active, Pending, Suspended, Expired, Revoked |
| `source_subscription` | Link: RBP Subscription | Conditional | Subscription source |
| `starts_on` | Date | Conditional | Start |
| `ends_on` | Date | Conditional | End |
| `granted_by` | Link: User | Conditional | Admin/system source |

### Rules

```text
Payment success may activate entitlements.
Payment failure may suspend or restrict entitlements depending on subscription policy.
Entitlement state must not be assumed from frontend payment result screens.
```

---

## 6. Canonical Payment States

Payment states must use these Frappe labels and API values.

| Frappe Label | API Value | Meaning |
|---|---|---|
| Not Required | `not_required` | No payment is required for this action/record. |
| Pending | `pending` | Payment has started or is awaiting confirmation. |
| Authorised | `authorised` | Payment is authorised but not fully captured/settled. |
| Paid | `paid` | Payment has been confirmed as paid/successful. |
| Failed | `failed` | Payment attempt failed. |
| Refunded | `refunded` | Payment has been refunded fully or partially. |
| Cancelled | `cancelled` | Payment process was cancelled. |
| Disputed | `disputed` | Payment is disputed or under chargeback/dispute handling. |

### 6.1 State Rules

```text
Payment state belongs to payment records, not general product workflow state.
Use workflow_state = Payment Pending only when workflow is blocked by payment.
Use payment status = pending/paid/failed/etc. for actual payment lifecycle.
Do not create workflow_state = Paid.
Do not trust frontend to set payment status.
```

---

## 7. Payment State Definitions

## 7.1 Not Required

### Meaning

The action, record, service, or entitlement does not require payment.

### Typical Use Cases

```text
Free public enquiry
Included member service
Admin-created no-charge request
Trial or manually granted entitlement
Payment waived by admin
```

### Allowed Effects

```text
Workflow may proceed without payment.
Entitlement may be granted if other rules pass.
Payment Event may be optional unless an admin waiver should be audited.
```

### Audit Requirement

Audit admin waivers or manual no-payment decisions.

---

## 7.2 Pending

### Meaning

A payment has been initiated but is not yet confirmed.

### Typical Use Cases

```text
Checkout session created
Payment intent/session pending
Bank/direct debit pending
Provider webhook not yet received
Manual invoice awaiting confirmation
```

### Allowed Effects

```text
Record may move to Payment Pending workflow state.
Entitlement should remain Pending unless business rules allow provisional access.
Frontend may show payment pending screen.
Admin may view pending payment.
```

### Exit Conditions

```text
Provider confirms authorisation or payment.
Provider confirms failure.
Customer cancels.
Payment expires.
Admin reconciles.
```

---

## 7.3 Authorised

### Meaning

Payment has been authorised but not fully captured, settled, or finalised.

### Typical Use Cases

```text
Card authorisation succeeded but capture is delayed.
Provider marks payment authorised.
Manual process confirms authorisation but not final settlement.
```

### Allowed Effects

```text
Workflow may proceed if business rules allow authorised payments.
Entitlement may remain Pending or become Active depending on product rules.
Admin may monitor for capture/settlement.
```

### Exit Conditions

```text
Payment becomes Paid.
Payment fails, expires, or is cancelled.
```

---

## 7.4 Paid

### Meaning

Payment has been confirmed successful.

### Typical Use Cases

```text
Membership payment completed.
Subscription renewal completed.
Listing fee paid.
Connectivity order payment completed.
Service purchase completed.
```

### Allowed Effects

```text
Workflow may proceed from Payment Pending to Submitted or next operational state.
Subscription may become Active.
Entitlements may become Active.
Confirmation notifications may be triggered.
Audit event must be recorded.
```

### Exit Conditions

```text
Refunded
Disputed
Admin reconciliation
Subscription lifecycle changes later
```

---

## 7.5 Failed

### Meaning

Payment failed, was declined, expired, or could not be completed.

### Typical Use Cases

```text
Card declined
Checkout expired
Provider failed payment
Webhook reports failure
Manual invoice unpaid past threshold
```

### Allowed Effects

```text
Workflow may move to Payment Failed.
Entitlement should not activate.
Subscription may remain Pending, become Past Due, or Suspended depending on context.
Payment failed notification should be triggered.
User may retry payment if supported.
Admin may reconcile.
```

---

## 7.6 Refunded

### Meaning

Payment has been refunded fully or partially.

### Typical Use Cases

```text
Admin refund
Provider refund event
Cancelled order refund
Dispute resolved with refund
```

### Allowed Effects

```text
Related entitlement may be revoked or left active depending on policy.
Subscription may remain Active, Cancelled, or Suspended depending on refund reason.
Admin/support notification may be triggered.
Audit event required.
```

### Required Data

```text
refund amount
currency
provider refund reference
reason
related original payment event
processed_on
```

---

## 7.7 Cancelled

### Meaning

Payment process was cancelled before success.

### Typical Use Cases

```text
Customer cancels checkout
Payment session expires
Admin cancels pending payment
Order cancelled before payment
```

### Allowed Effects

```text
Workflow may move to Cancelled or remain Draft depending on product.
Entitlement should not activate.
Subscription should not become Active.
```

---

## 7.8 Disputed

### Meaning

Payment is disputed, charged back, or under provider dispute handling.

### Typical Use Cases

```text
Chargeback opened
Payment dispute webhook received
Provider flags dispute
Admin marks payment under review
```

### Allowed Effects

```text
Admin review required.
Entitlement may be suspended depending on policy.
Subscription may become Suspended or Needs Review.
Customer-facing message should be careful and safe.
Audit required.
```

---

## 8. Payment Event Types

Payment event types must use lowercase snake_case.

| Event Type | Meaning |
|---|---|
| `checkout_created` | Checkout/session created |
| `payment_pending` | Payment awaiting confirmation |
| `payment_authorised` | Payment authorised |
| `payment_paid` | Payment confirmed successful |
| `payment_failed` | Payment failed |
| `payment_cancelled` | Payment cancelled |
| `payment_refunded` | Payment refunded |
| `payment_disputed` | Payment disputed |
| `subscription_created` | Subscription created |
| `subscription_renewed` | Subscription renewed |
| `subscription_updated` | Subscription updated |
| `subscription_cancelled` | Subscription cancelled |
| `subscription_expired` | Subscription expired |
| `subscription_past_due` | Subscription became past due |
| `subscription_suspended` | Subscription suspended |
| `webhook_received` | Provider webhook received |
| `webhook_ignored` | Webhook ignored by rule |
| `webhook_duplicate` | Duplicate webhook detected |
| `admin_reconciled` | Admin reconciled payment state |
| `admin_payment_waived` | Admin marked payment not required |
| `admin_refund_recorded` | Admin recorded refund event |

### Rules

```text
Use provider-neutral event types.
Store provider-specific event name in raw_payload or provider_event_type if needed.
Do not let provider event names become platform state names.
```

---

## 9. Subscription States

Subscription states are related to, but separate from, payment states.

| Frappe Label | API Value | Meaning |
|---|---|---|
| Pending | `pending` | Subscription created but not active yet. |
| Active | `active` | Subscription is active and can grant entitlements. |
| Past Due | `past_due` | Payment failed or overdue, grace period may apply. |
| Suspended | `suspended` | Access restricted due to payment/admin issue. |
| Cancelled | `cancelled` | Subscription has been cancelled. |
| Expired | `expired` | Subscription period ended. |
| Archived | `archived` | Historical subscription no longer active operationally. |

## 9.1 Subscription State Rules

```text
Subscription state controls membership access.
Payment state records individual payment events.
One subscription may have many payment events.
Subscription can remain Active even after one failed renewal during a grace period, if business rules allow.
Subscription cancellation does not automatically delete tenant, records, or audit history.
```

---

## 10. Entitlement States

Entitlement states must use the following labels and API values.

| Frappe Label | API Value | Meaning |
|---|---|---|
| Pending | `pending` | Entitlement exists but is not active yet. |
| Active | `active` | User/tenant can access the app/service. |
| Suspended | `suspended` | Temporarily restricted. |
| Expired | `expired` | End date passed or subscription ended. |
| Revoked | `revoked` | Admin/system removed entitlement. |

## 10.1 Entitlement Activation Rules

Entitlements may activate when:

```text
Payment status becomes Paid.
Subscription status becomes Active.
Admin grants entitlement.
Trial entitlement starts.
Manual override grants access.
```

Entitlements may suspend or expire when:

```text
Subscription becomes Past Due beyond grace period.
Subscription becomes Suspended.
Subscription is Cancelled and current period ends.
Subscription expires.
Admin revokes entitlement.
Payment is disputed and policy requires suspension.
```

---

## 11. Payment-to-Workflow Interaction

Payment state may block or advance workflow state.

## 11.1 General Rule

```text
Payment state is not workflow state.
Workflow may enter Payment Pending or Payment Failed when payment blocks the business process.
```

## 11.2 Workflow Interaction Matrix

| Payment State | Typical Workflow Effect |
|---|---|
| `not_required` | Workflow can proceed normally. |
| `pending` | Workflow may move to Payment Pending. |
| `authorised` | Workflow may proceed if product allows authorised payment. |
| `paid` | Workflow may move from Payment Pending to Submitted/In Review. |
| `failed` | Workflow may move to Payment Failed. |
| `refunded` | Workflow may require admin review, cancellation, or entitlement update. |
| `cancelled` | Workflow may stay Draft or move to Cancelled. |
| `disputed` | Workflow may require admin review and suspend access. |

## 11.3 Product Workflow Examples

### Membership

```text
Signup Draft
  ↓
Payment Pending
  ↓
Paid
  ↓
Subscription Active
  ↓
Entitlements Active
  ↓
Portal Access Available
```

### Marketplace Listing Fee

```text
Listing Draft
  ↓
Payment Pending
  ↓
Paid
  ↓
Pending Review
  ↓
Published, after admin approval
```

### Connectivity Order

```text
Order Draft
  ↓
Serviceability Check
  ↓
Payment Pending, if payment required
  ↓
Submitted
  ↓
Provisioning
```

---

## 12. Payment-to-Entitlement Interaction

Payment state affects entitlement state.

| Payment / Subscription Condition | Entitlement Effect |
|---|---|
| Payment pending | Entitlement remains Pending unless provisional access is approved. |
| Payment paid | Entitlement may become Active. |
| Payment failed | Entitlement remains Pending or becomes Suspended. |
| Subscription active | Subscription-backed entitlements should be Active. |
| Subscription past due | Entitlements may remain Active during grace period or become Suspended. |
| Subscription suspended | Entitlements should usually become Suspended. |
| Subscription cancelled | Entitlements remain Active until period end if policy allows, then Expired. |
| Subscription expired | Entitlements become Expired. |
| Payment refunded | Entitlement may be Revoked, Suspended, or unchanged depending on refund policy. |
| Payment disputed | Entitlement may be Suspended pending admin review. |
| Admin override | Entitlement follows admin grant/revocation rules. |

## 12.1 Entitlement Keys

Approved entitlement keys:

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

---

## 13. Payment-Relevant Products

## 13.1 Membership

Payment role:

```text
Primary subscription/payment flow.
Payment success creates or activates subscription and entitlements.
```

Relevant DocTypes:

```text
RBP Membership Plan
RBP Subscription
RBP App Entitlement
RBP Payment Event
RBP Tenant
RBP Business Profile
```

Payment states used:

```text
pending
paid
failed
cancelled
refunded
disputed
```

## 13.2 Decision Desk

Payment role:

```text
May be included in membership or may require entitlement/payment depending on commercial model.
```

Possible states:

```text
not_required
pending
paid
failed
refunded
```

## 13.3 DocuShare

Payment role:

```text
May be included in membership, entitlement-based, or paid per request.
```

Possible states:

```text
not_required
pending
paid
failed
refunded
```

## 13.4 Marketplace

Payment role:

```text
May require listing fee, success fee, promoted listing fee, or no payment depending on marketplace model.
```

Possible states:

```text
not_required
pending
paid
failed
cancelled
refunded
disputed
```

## 13.5 Connectivity / NBN

Payment role:

```text
May require payment for hardware, installation, plan activation, or deposit depending on provider model.
```

Possible states:

```text
not_required
pending
authorised
paid
failed
cancelled
refunded
disputed
```

## 13.6 Risk Advisor

Payment role:

```text
May be membership-included, entitlement-based, or paid assessment.
```

Possible states:

```text
not_required
pending
paid
failed
refunded
```

## 13.7 The Fixer

Payment role:

```text
May be membership-included, entitlement-based, or paid request.
```

Possible states:

```text
not_required
pending
paid
failed
refunded
```

---

## 14. Payment API Standards

All payment APIs must use the standard response envelope.

## 14.1 Suggested Public/Auth APIs

```text
GET  /api/method/rbp_app.api.billing.get_my_payment_summary
GET  /api/method/rbp_app.api.membership.get_subscription
POST /api/method/rbp_app.api.membership.create_signup
POST /api/method/rbp_app.api.billing.create_checkout_session
POST /api/method/rbp_app.api.billing.cancel_checkout_session
POST /api/method/rbp_app.api.billing.retry_payment
```

## 14.2 Suggested Provider/System APIs

```text
POST /api/method/rbp_app.api.billing.handle_payment_webhook
POST /api/method/rbp_app.api.billing.record_payment_event
```

## 14.3 Suggested Admin APIs

```text
GET  /api/method/rbp_app.api.billing.admin_list_payment_events
GET  /api/method/rbp_app.api.billing.admin_get_payment_event
POST /api/method/rbp_app.api.billing.admin_reconcile_payment
POST /api/method/rbp_app.api.billing.admin_mark_payment_not_required
POST /api/method/rbp_app.api.billing.admin_record_refund
POST /api/method/rbp_app.api.billing.admin_suspend_subscription
POST /api/method/rbp_app.api.billing.admin_restore_subscription
```

## 14.4 API Naming Rules

Use provider-neutral names.

Use:

```text
create_checkout_session
handle_payment_webhook
record_payment_event
admin_reconcile_payment
```

Do not use provider-specific names in contract-level APIs unless explicitly required:

```text
create_stripe_session
stripe_webhook
```

Provider-specific logic belongs in adapters/services, not the contract surface.

---

## 15. Payment API Response DTOs

## 15.1 Safe Payment Summary DTO

Customer-facing payment summaries may include:

```json
{
  "subscription_status": "active",
  "payment_status": "paid",
  "plan": {
    "plan_code": "rbp_member_monthly",
    "plan_name": "RBP Member Monthly"
  },
  "amount": 99.00,
  "currency": "AUD",
  "current_period_start": "2026-05-01",
  "current_period_end": "2026-06-01",
  "cancel_at_period_end": false,
  "latest_payment": {
    "status": "paid",
    "processed_on": "2026-05-07T00:00:00Z"
  }
}
```

Customer-facing payment summaries must not include:

```text
raw_payload
provider secrets
full webhook body
internal reconciliation notes
fraud/dispute notes unless deliberately customer-facing
sensitive provider metadata
```

## 15.2 Admin Payment Event DTO

Admin DTOs may include operational details:

```json
{
  "name": "RBP-PAY-0001",
  "tenant": "RBP-TENANT-0001",
  "user": "user@example.com",
  "related_doctype": "RBP Subscription",
  "related_name": "RBP-SUB-0001",
  "payment_provider": "stripe",
  "provider_event_id": "evt_123",
  "provider_customer_id": "cus_123",
  "provider_payment_id": "pi_123",
  "amount": 99.00,
  "currency": "AUD",
  "status": "paid",
  "event_type": "payment_paid",
  "processed_on": "2026-05-07T00:00:00Z",
  "reconciliation_status": "reconciled"
}
```

Raw payload should be restricted even for admins unless necessary.

---

## 16. Webhook Handling Requirements

Payment provider webhook handling must be idempotent, safe, and auditable.

## 16.1 Webhook Processing Flow

```text
1. Receive webhook.
2. Verify provider signature/security.
3. Parse provider payload.
4. Determine provider_event_id.
5. Build idempotency_key.
6. Check if event already processed.
7. Map provider event to platform event_type.
8. Map provider payment state to platform status.
9. Create/update RBP Payment Event.
10. Update related subscription/product/workflow/entitlement if required.
11. Trigger notifications if required.
12. Record audit log.
13. Return safe response.
```

## 16.2 Idempotency Rules

```text
provider_event_id should be unique when provider supplies it.
idempotency_key should be generated when provider_event_id is unavailable.
Duplicate webhook must not duplicate subscription activation, entitlement grants, notifications, or audit records.
Duplicate webhook may be logged as webhook_duplicate.
```

## 16.3 Webhook Error Handling

Use standard error codes:

```text
payment_webhook_invalid
payment_webhook_signature_invalid
payment_webhook_duplicate
payment_provider_error
provider_response_invalid
```

## 16.4 Webhook Security

Webhook endpoints must:

```text
verify provider signature or equivalent
reject unsigned/invalid webhooks
avoid exposing detailed provider validation errors
log safe details with request_id
avoid customer-facing access
process idempotently
```

---

## 17. Admin Reconciliation

Admin reconciliation handles real-world payment anomalies.

## 17.1 Reconciliation Use Cases

```text
Payment succeeded at provider but webhook failed.
Payment failed but user retried successfully.
Subscription status mismatched provider.
Refund issued manually.
Payment marked not required.
Dispute opened or resolved.
Duplicate provider event received.
Customer support needs to resolve billing issue.
```

## 17.2 Admin Reconciliation Actions

```text
admin_reconcile_payment
admin_mark_payment_not_required
admin_record_refund
admin_suspend_subscription
admin_restore_subscription
admin_cancel_subscription
admin_retry_entitlement_provisioning
```

## 17.3 Required Fields for Admin Reconciliation

| Field | Required | Notes |
|---|---:|---|
| `related_doctype` | Yes | Target record type |
| `related_name` | Yes | Target record |
| `action` | Yes | Reconciliation action |
| `reason` | Yes | Reason for audit |
| `payment_event` | Conditional | Related event |
| `new_status` | Conditional | Target payment/subscription state |
| `effective_date` | Conditional | Date for action |
| `notes` | Conditional | Admin notes |

## 17.4 Rules

```text
Every reconciliation must create an audit log.
Every reconciliation must record acting admin.
Every reconciliation must validate admin authority.
Every reconciliation must avoid silently overwriting provider truth.
Every reconciliation must preserve previous state.
```

---

## 18. Notifications

Payment-related notification triggers:

| Trigger | Recipient | When |
|---|---|---|
| `payment_pending` | User/customer | Payment started but not confirmed |
| `payment_confirmed` | User/customer, admin optional | Payment becomes paid |
| `payment_failed` | User/customer, billing/admin | Payment fails |
| `payment_cancelled` | User/customer | Payment cancelled |
| `payment_refunded` | User/customer, admin | Refund recorded |
| `payment_disputed` | Admin/billing, customer if policy allows | Dispute opened |
| `subscription_created` | User/customer, admin optional | Subscription created |
| `subscription_active` | User/customer | Subscription active |
| `subscription_past_due` | User/customer, billing/admin | Subscription past due |
| `subscription_suspended` | User/customer, billing/admin | Subscription suspended |
| `subscription_cancelled` | User/customer | Subscription cancelled |
| `subscription_renewed` | User/customer | Subscription renewed |
| `entitlement_activated` | User/customer optional | Entitlement activated |
| `entitlement_suspended` | User/customer optional | Entitlement suspended |

Notification rules must be finalised in:

```text
14-notification-triggers.md
```

---

## 19. Audit Events

Payment-related audit events:

```text
payment_event_recorded
payment_status_changed
payment_webhook_received
payment_webhook_duplicate
payment_webhook_signature_invalid
payment_reconciled
payment_marked_not_required
payment_refund_recorded
payment_dispute_recorded
subscription_created
subscription_activated
subscription_past_due
subscription_suspended
subscription_cancelled
subscription_expired
entitlement_activated
entitlement_suspended
entitlement_revoked
```

Audit events must capture:

```text
acting user or system actor
tenant
related_doctype
related_name
previous state
new state
event_type
provider_event_id, if safe
request_id
timestamp
reason, if admin action
```

---

## 20. Permission and Role Rules

## 20.1 Customer-Side Access

| Role | Payment Access |
|---|---|
| Guest | Public pricing only, no private payment events |
| Website User | Own pending checkout/payment result only |
| RBP Member | Own safe payment/subscription summary |
| RBP Business Owner | Tenant billing/subscription summary |
| RBP Team Member | No billing access by default |
| RBP Marketplace Seller | Own listing fee/payment summary if applicable |
| RBP Marketplace Buyer | Own enquiry/purchase summary if applicable |

## 20.2 Internal/Admin Access

| Role | Payment Access |
|---|---|
| RBP Advisor | No payment access by default |
| RBP Support Agent | Conditional safe billing support access |
| RBP Admin | Operational payment event and reconciliation access |
| System Manager | Full payment configuration/event access |
| Administrator | Full technical access |

## 20.3 Restricted Fields

These fields must not be exposed to customer users:

```text
raw_payload
provider secrets
provider API response internals
internal reconciliation notes
fraud/dispute details unless deliberately customer-facing
full webhook verification details
```

---

## 21. Security and Privacy Requirements

Payment handling must follow these rules:

```text
Frontend must not set payment state.
Frontend must not set subscription state.
Frontend must not activate entitlements.
Raw payment payloads must be restricted.
Provider secrets must never be returned by APIs.
Webhook signature verification must be enforced.
Duplicate provider events must be idempotent.
Payment state changes must be auditable.
Customer users must only see safe payment summaries.
Cross-tenant payment access must be denied.
Admin reconciliation must require reason and audit log.
```

## 21.1 Sensitive Data Rule

Do not store or expose card data unless the chosen payment provider and compliance model explicitly require it.

The platform should prefer provider-hosted/payment-token flows where sensitive card details remain with the provider.

---

## 22. Frontend Payment Contract

The frontend must treat payment state as backend-provided state.

## 22.1 Frontend Responsibilities

```text
Display pricing and selected plan.
Start checkout/payment flow through backend API.
Show pending/success/failure states from backend response.
Poll or refresh payment summary if needed.
Handle payment_required, payment_pending, and payment_failed errors.
Never directly mark records as paid.
Never activate entitlements locally.
Never unlock product access based only on a client-side redirect.
```

## 22.2 Frontend UI States

| UI State | Backend Source |
|---|---|
| Payment not required | `payment_status = not_required` |
| Payment pending | `payment_status = pending` or workflow `Payment Pending` |
| Payment authorised | `payment_status = authorised` |
| Payment successful | `payment_status = paid` |
| Payment failed | `payment_status = failed` |
| Payment cancelled | `payment_status = cancelled` |
| Refunded | `payment_status = refunded` |
| Disputed / under review | `payment_status = disputed` |

## 22.3 Payment Result Screens

Payment result pages must verify backend state.

Do not assume success from:

```text
success URL redirect
query parameter
client-side checkout callback
local mock state
```

Use backend confirmation endpoint or payment summary endpoint.

---

## 23. API Error Requirements

Payment APIs must use standard error codes from `07-error-catalogue.md`.

Key payment errors:

```text
payment_required
payment_pending
payment_failed
payment_cancelled
payment_disputed
payment_not_found
payment_already_processed
payment_provider_error
payment_provider_unavailable
payment_provider_timeout
payment_webhook_invalid
payment_webhook_signature_invalid
payment_webhook_duplicate
subscription_required
subscription_not_found
subscription_inactive
subscription_cancelled
billing_account_required
invalid_payment_state
raw_payment_payload_restricted
```

## 23.1 Example: Payment Required

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

## 23.2 Example: Duplicate Webhook

```json
{
  "ok": false,
  "data": null,
  "message": "Payment webhook already processed",
  "errors": [
    {
      "field": null,
      "code": "payment_webhook_duplicate",
      "message": "Payment webhook has already been processed."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

---

## 24. Frappe Implementation Notes

Recommended backend structure:

```text
rbp_app/
└── rbp_app/
    ├── api/
    │   └── billing.py
    ├── services/
    │   ├── billing.py
    │   ├── entitlements.py
    │   ├── notifications.py
    │   └── audit.py
    ├── integrations/
    │   └── payments/
    │       ├── base.py
    │       ├── stripe.py
    │       └── manual.py
    ├── doctype/
    │   ├── rbp_payment_event/
    │   ├── rbp_subscription/
    │   └── rbp_app_entitlement/
    ├── permissions.py
    ├── guards.py
    └── hooks.py
```

## 24.1 Service-Layer Function Examples

```python
def create_checkout_session(user: str, payload: dict):
    ...

def handle_payment_webhook(provider: str, headers: dict, payload: dict):
    ...

def record_payment_event(provider: str, event: dict):
    ...

def map_provider_event_to_payment_state(provider: str, event: dict) -> str:
    ...

def activate_subscription_from_payment(payment_event: str):
    ...

def update_entitlements_from_subscription(subscription: str):
    ...

def reconcile_payment(user: str, payload: dict):
    ...

def get_safe_payment_summary(user: str):
    ...
```

## 24.2 Adapter Pattern

Payment provider logic should use adapters:

```text
PaymentProviderAdapter
  ├── create_checkout_session
  ├── verify_webhook
  ├── parse_event
  ├── map_event_type
  ├── map_payment_state
  └── build_safe_reference
```

This keeps provider-specific chaos out of the platform contract, which is the closest software gets to hygiene.

---

## 25. Mock-to-Real Payment Mapping

Phase 1 mock payment fields must map into real payment records or provider flows.

| Mock Field / State | Real Mapping |
|---|---|
| `payment_method_mock` | Provider checkout/session/payment method token |
| `payment_simulated_success` | `RBP Payment Event` with `status = paid` in mock/test only |
| `payment_simulated_failure` | `RBP Payment Event` with `status = failed` in mock/test only |
| `payment_pending` | `RBP Payment Event.status = pending` |
| `membership_active` | `RBP Subscription.status = active` and entitlements active |
| `listing_fee_mock` | `RBP Payment Event` linked to `RBP Marketplace Listing` |
| `serviceability_status_mock` | Not payment, maps to Connectivity Order serviceability |
| `payment_required` | Product/workflow rule plus payment event requirement |

Mock-only payment states must not become production truth.

---

## 26. Validation Rules

Payment-related validation must include:

```text
payment_provider is required for payment events.
status is required for payment events.
event_type is required for payment events.
amount must be >= 0 when provided.
currency is required when amount is provided.
provider_event_id should be unique when present.
idempotency_key should be unique when present.
related_doctype and related_name must both be valid when linking payment to a record.
Subscription must have tenant, member, and plan.
Subscription status must be valid.
Entitlement activation must match subscription/payment rules.
Admin reconciliation requires a reason.
Webhook processing requires signature verification when provider supports it.
```

---

## 27. Indexing Requirements

Recommended indexes for payment-related DocTypes:

```text
RBP Payment Event:
  tenant
  user
  related_doctype
  related_name
  payment_provider
  provider_event_id
  provider_customer_id
  provider_payment_id
  provider_subscription_id
  status
  event_type
  processed_on
  idempotency_key
  reconciliation_status

RBP Subscription:
  tenant
  member
  plan
  status
  payment_provider
  provider_customer_id
  provider_subscription_id
  current_period_end

RBP App Entitlement:
  tenant
  user
  app_key
  status
  source_subscription
  ends_on
```

---

## 28. Reporting Requirements

Admin/billing views should eventually support:

```text
payment event list
failed payments
pending payments
disputed payments
refunded payments
subscription status list
past due subscriptions
suspended subscriptions
entitlement activation failures
payment events needing reconciliation
provider webhook failures
```

Recommended filters:

```text
tenant
user
payment_provider
status
event_type
processed_from
processed_to
amount_min
amount_max
currency
reconciliation_status
related_doctype
related_name
```

---

## 29. QA Test Requirements

## 29.1 Payment Event Tests

```text
test_payment_event_requires_provider_status_and_event_type
test_payment_event_provider_event_id_unique_when_present
test_payment_event_idempotency_key_unique_when_present
test_payment_event_links_to_related_record
test_customer_cannot_view_raw_payment_payload
test_admin_can_view_payment_event_summary
```

## 29.2 Webhook Tests

```text
test_valid_webhook_creates_payment_event
test_invalid_webhook_signature_returns_payment_webhook_signature_invalid
test_duplicate_webhook_returns_payment_webhook_duplicate
test_duplicate_webhook_does_not_duplicate_entitlements
test_payment_paid_webhook_activates_subscription
test_payment_failed_webhook_marks_payment_failed
test_provider_timeout_returns_provider_timeout
```

## 29.3 Subscription Tests

```text
test_paid_membership_creates_active_subscription
test_failed_membership_payment_keeps_subscription_pending
test_subscription_renewal_updates_current_period
test_cancelled_subscription_sets_cancel_at_period_end
test_expired_subscription_expires_entitlements
test_past_due_subscription_policy_applied
```

## 29.4 Entitlement Tests

```text
test_paid_subscription_activates_entitlements
test_failed_payment_does_not_activate_entitlements
test_suspended_subscription_suspends_entitlements
test_admin_grant_creates_manual_entitlement
test_admin_revoke_revokes_entitlement
```

## 29.5 Workflow Interaction Tests

```text
test_payment_required_request_moves_to_payment_pending
test_payment_success_moves_payment_pending_to_submitted
test_payment_failure_moves_payment_pending_to_payment_failed
test_customer_cannot_force_paid_state
test_admin_payment_reconciliation_advances_workflow_when_allowed
```

## 29.6 Frontend/API Tests

```text
test_payment_required_error_uses_standard_envelope
test_payment_failed_error_uses_standard_envelope
test_safe_payment_summary_excludes_raw_payload
test_payment_result_page_verifies_backend_state
test_payment_retry_uses_backend_endpoint
```

## 29.7 Security Tests

```text
test_cross_tenant_payment_event_access_denied
test_team_member_cannot_view_billing_by_default
test_raw_payment_payload_restricted_from_member
test_webhook_endpoint_rejects_unsigned_payload
test_admin_reconciliation_requires_reason
```

---

## 30. Open Items for Final Phase 2 Lock

These items must be confirmed before Phase 2 sign-off:

| Item | Status | Notes |
|---|---|---|
| Final payment provider | Draft | Provider-specific adapter depends on decision |
| Final membership pricing | Draft | Depends on commercial model |
| Final billing cycles | Draft | Monthly/annual/once-off/custom to confirm |
| Final products requiring payment | Draft | Depends on product packaging |
| Final included-service entitlements | Draft | Depends on membership plan design |
| Final grace period policy | Draft | Needed for past-due subscriptions |
| Final cancellation policy | Draft | Needed for subscription lifecycle |
| Final refund policy | Draft | Needed for refunded state effects |
| Final dispute policy | Draft | Needed for disputed state effects |
| Final tax/invoice requirements | Draft | May require extra DocTypes later |
| Final payment confirmation UX | Draft | Depends on frontend route design |
| Final admin reconciliation UX | Draft | Depends on admin UI concepts |
| Final webhook endpoint security model | Draft | Depends on provider |
| Final accounting/CRM sync rules | Draft | Depends on integrations |

---

## 31. Payment State Model Acceptance Checklist

This document is ready for Phase 2 draft use when:

```text
Canonical payment states are defined.
Payment state labels and API values are defined.
Payment event types are defined.
Subscription states are defined.
Entitlement states are defined.
Payment-to-workflow interaction is defined.
Payment-to-entitlement interaction is defined.
Payment-relevant products are listed.
Payment API standards are defined.
Payment DTO rules are defined.
Webhook handling requirements are defined.
Idempotency rules are defined.
Admin reconciliation rules are defined.
Notification triggers are defined.
Audit events are defined.
Role/permission rules are defined.
Security/privacy requirements are defined.
Frontend payment contract is defined.
Payment error requirements are defined.
Frappe implementation notes are defined.
Mock-to-real payment mapping is defined.
Validation and indexing requirements are defined.
Reporting requirements are defined.
QA tests are defined.
Open items are listed for final lock.
```

---

## 32. Phase 2 Sign-Off Criteria

This Payment State Model can be signed off only when:

```text
Every payment touchpoint from Phase 1 has a backend payment rule.
Every paid flow maps to RBP Payment Event.
Every subscription flow maps to RBP Subscription.
Every entitlement effect maps to RBP App Entitlement.
Every payment-dependent workflow defines pending/success/failure behaviour.
Every payment error maps to the Error Catalogue.
Every payment notification maps to the Notification Trigger contract.
Every admin reconciliation action is defined.
Every customer-facing payment summary excludes restricted fields.
Every provider webhook requirement is defined.
Every mock payment state maps to a real payment model.
Every payment QA test has an expected state, event, and response.
```

Until then, this remains a draft.

---

## 33. Final Rule

Money is not a boolean.

Payment state must answer:

```text
What was attempted?
Who attempted it?
What provider handled it?
What record did it relate to?
What happened?
Was it already processed?
What workflow did it block or unlock?
What entitlement did it grant, suspend, or revoke?
Who was notified?
What was audited?
```

If the system cannot answer those questions, it does not have payment handling. It has accounting-flavoured optimism.

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

