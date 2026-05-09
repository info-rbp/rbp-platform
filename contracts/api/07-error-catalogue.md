# RBP Phase 2 Backend Contracts
# 07-error-catalogue.md

## Document Status

| Field | Value |
|---|---|
| Document | Error Catalogue |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/07-error-catalogue.md` |
| Intended Final Location | `rbp-platform/contracts/errors/error-catalogue.md` |
| Primary Consumers | Frontend, Frappe backend, QA, admin operations, support, integrations |

---

## 1. Purpose

This document defines the standard error catalogue for the Remote Business Partner Platform.

It establishes:

```text
- standard error response shape
- canonical error codes
- HTTP status mapping
- validation error format
- authentication and permission errors
- tenant and ownership errors
- workflow errors
- payment errors
- file/upload errors
- notification errors
- admin action errors
- integration/provider errors
- system/internal errors
- frontend handling expectations
- Frappe implementation guidance
- QA test requirements
```

This is a Phase 2 contract document. It defines how errors must be represented before Phase 3 Frappe implementation begins.

The goal is to make every API error predictable, safe, and useful. Apparently this has to be written down, because otherwise one endpoint returns `false`, another throws HTML, and a third responds with “Something went wrong” like a haunted toaster.

---

## 2. Scope

This catalogue applies to all backend APIs under:

```text
/api/method/rbp_app.api.*
```

Including:

```text
rbp_app.api.me
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
rbp_app.api.files
rbp_app.api.tenancy
rbp_app.api.entitlements
rbp_app.api.audit
```

This catalogue also applies to:

```text
frontend API client error handling
mock-to-real API migration
Frappe service-layer exceptions
workflow transition failures
payment provider/webhook failures
file upload validation
permission denial
admin action denial
QA test assertions
```

---

## 3. Related Phase 2 Documents

This document depends on:

```text
index.md
01-api-response-envelope-standard.md
02-naming-conventions.md
03-role-matrix.md
04-permission-model-draft.md
05-core-doctype-model.md
06-workflow-state-standards.md
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

Most importantly:

```text
01-api-response-envelope-standard.md
```

defines the response envelope. This file defines the error codes that go inside it.

---

## 4. Error Response Standard

All API errors must use the standard response envelope.

## 4.1 Error Envelope

```json
{
  "ok": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "business_name",
      "code": "required",
      "message": "Business name is required"
    }
  ],
  "meta": {
    "request_id": "uuid",
    "timestamp": "2026-05-07T00:00:00Z"
  }
}
```

## 4.2 Required Top-Level Fields

| Field | Type | Required | Purpose |
|---|---|---:|---|
| `ok` | Boolean | Yes | Always `false` for errors |
| `data` | Object / Null | Yes | Usually `null` for errors |
| `message` | String | Yes | General safe summary |
| `errors` | Array | Yes | Structured error list |
| `meta` | Object | Yes | Request metadata |

## 4.3 Required Error Object Fields

| Field | Type | Required | Purpose |
|---|---|---:|---|
| `field` | String / Null | Yes | Field related to error, or `null` |
| `code` | String | Yes | Machine-readable error code |
| `message` | String | Yes | Safe user-facing or developer-facing message |

## 4.4 Optional Error Object Fields

| Field | Type | Purpose |
|---|---|---|
| `details` | Object | Additional safe structured context |
| `hint` | String | Safe corrective guidance |
| `severity` | String | `info`, `warning`, `error`, `critical` |
| `retryable` | Boolean | Whether retry may work |
| `docs_ref` | String | Internal contract reference |

Optional fields must never expose secrets, raw payment payloads, private file paths, stack traces, or internal infrastructure details.

---

## 5. Error Code Naming Rules

Error codes must use lowercase snake_case.

Use:

```text
required
invalid_format
permission_denied
workflow_transition_denied
payment_failed
file_too_large
```

Do not use:

```text
Required
REQUIRED
requiredField
field-required
MissingValue
error_001
something_wrong
```

Error codes must be stable once frontend and QA start depending on them.

Changing an error code is a breaking contract change. Tiny chaos pebble, large integration avalanche.

---

## 6. HTTP Status Mapping

Frappe APIs often return method responses through its own handling layer, but the contract should still define the intended HTTP meaning.

| HTTP Status | Use Case | Example Error Codes |
|---:|---|---|
| 400 | Bad request / malformed payload | `bad_request`, `invalid_json`, `missing_payload` |
| 401 | Not authenticated | `not_authenticated`, `session_expired` |
| 403 | Authenticated but not allowed | `permission_denied`, `tenant_access_denied`, `entitlement_required` |
| 404 | Not found or not visible | `not_found`, `record_not_found`, `file_not_found` |
| 409 | Conflict / duplicate / invalid state | `duplicate_record`, `workflow_transition_denied`, `record_locked` |
| 413 | Payload too large | `payload_too_large`, `file_too_large` |
| 415 | Unsupported media/file type | `unsupported_media_type`, `unsupported_file_type` |
| 422 | Validation error | `validation_failed`, `required`, `invalid_value` |
| 429 | Rate limiting | `rate_limited`, `too_many_requests` |
| 500 | Internal system error | `server_error`, `unexpected_error` |
| 502 | External provider failure | `provider_unavailable`, `integration_failed` |
| 503 | Service unavailable | `service_unavailable`, `maintenance_mode` |
| 504 | Timeout | `provider_timeout`, `request_timeout` |

---

## 7. Error Severity Levels

| Severity | Meaning | Example |
|---|---|---|
| `info` | User can continue normally | Optional field skipped |
| `warning` | User should correct or review | Payment pending |
| `error` | Action failed but platform is stable | Validation failed |
| `critical` | Serious operational/system issue | Payment webhook integrity failure |

Default severity is:

```text
error
```

---

## 8. Retryability Rules

Each error should be considered either retryable or non-retryable.

| Retryable | Meaning | Examples |
|---|---|---|
| `true` | The same action may work later | `provider_timeout`, `service_unavailable`, `rate_limited` |
| `false` | User must change input or permissions | `required`, `permission_denied`, `unsupported_file_type` |

Frontend should use this to decide whether to show:

```text
Try again
Fix fields
Contact support/admin
Wait and retry
Upgrade/activate membership
```

---

# CANONICAL ERROR CATALOGUE

---

## 9. General Request Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `bad_request` | 400 | No | null | The request is invalid. | Request does not match expected structure |
| `missing_payload` | 400 | No | null | Request payload is required. | POST body is missing |
| `invalid_json` | 400 | No | null | Request payload must be valid JSON. | JSON cannot be parsed |
| `invalid_method` | 405 | No | null | This request method is not supported. | Wrong HTTP method |
| `unsupported_operation` | 400 | No | null | This operation is not supported. | Endpoint/action not supported |
| `invalid_parameter` | 400 | No | field name | One or more parameters are invalid. | Query/path parameter invalid |
| `missing_parameter` | 400 | No | field name | A required parameter is missing. | Query/path parameter required |

### Example

```json
{
  "ok": false,
  "data": null,
  "message": "Request payload is required",
  "errors": [
    {
      "field": null,
      "code": "missing_payload",
      "message": "Request payload is required."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

---

## 10. Validation Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `validation_failed` | 422 | No | null | Validation failed. | General validation wrapper |
| `required` | 422 | No | field name | This field is required. | Required field missing |
| `invalid_value` | 422 | No | field name | This value is invalid. | Field value not allowed |
| `invalid_format` | 422 | No | field name | This field has an invalid format. | Email, phone, URL, ABN, etc. invalid |
| `invalid_length` | 422 | No | field name | This field has an invalid length. | Too short/long |
| `too_short` | 422 | No | field name | This value is too short. | Min length failed |
| `too_long` | 422 | No | field name | This value is too long. | Max length failed |
| `out_of_range` | 422 | No | field name | This value is outside the allowed range. | Number/date range invalid |
| `invalid_date` | 422 | No | field name | This date is invalid. | Date parse failed |
| `date_in_past` | 422 | No | field name | Date cannot be in the past. | Future date required |
| `date_too_far_future` | 422 | No | field name | Date is too far in the future. | Business limit exceeded |
| `invalid_email` | 422 | No | `email` | Email address is invalid. | Email invalid |
| `invalid_phone` | 422 | No | `phone` | Phone number is invalid. | Phone invalid |
| `invalid_url` | 422 | No | field name | URL is invalid. | Website/link invalid |
| `invalid_business_identifier` | 422 | No | `business_identifier` | Business identifier is invalid. | ABN/ACN/business ID invalid |
| `invalid_currency` | 422 | No | `currency` | Currency is invalid. | Unsupported currency |
| `invalid_amount` | 422 | No | `amount` | Amount is invalid. | Negative/invalid amount |
| `invalid_selection` | 422 | No | field name | Selected value is not allowed. | Select/dropdown mismatch |
| `terms_not_accepted` | 422 | No | `accepted_terms` | Terms must be accepted. | Required terms unchecked |
| `duplicate_value` | 409 | No | field name | This value is already in use. | Unique field conflict |

### Example: Multiple Field Validation Errors

```json
{
  "ok": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "business_name",
      "code": "required",
      "message": "Business name is required."
    },
    {
      "field": "email",
      "code": "invalid_email",
      "message": "Email address is invalid."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

---

## 11. Authentication Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `not_authenticated` | 401 | No | null | Authentication is required. | User is not logged in |
| `session_expired` | 401 | Yes | null | Your session has expired. | Session expired |
| `invalid_session` | 401 | Yes | null | Session is invalid. | Invalid session/cookie |
| `csrf_token_missing` | 401 | Yes | null | Security token is missing. | CSRF missing |
| `csrf_token_invalid` | 401 | Yes | null | Security token is invalid. | CSRF invalid |
| `account_disabled` | 403 | No | null | Account is disabled. | Disabled user |
| `account_suspended` | 403 | No | null | Account is suspended. | Suspended user |
| `login_required` | 401 | No | null | Please log in to continue. | UI-friendly auth required |

### Example

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

---

## 12. Permission and Access Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `permission_denied` | 403 | No | null | Permission denied. | User lacks role/action authority |
| `role_required` | 403 | No | null | Required role is missing. | Specific role needed |
| `tenant_access_denied` | 403 | No | null | You do not have access to this tenant record. | Tenant mismatch |
| `owner_access_denied` | 403 | No | null | You do not own this record. | Ownership required |
| `assignment_required` | 403 | No | null | This record is not assigned to you. | Advisor/support assignment required |
| `admin_required` | 403 | No | null | Admin access is required. | Admin-only endpoint/action |
| `support_access_required` | 403 | No | null | Support access is required. | Support-only queue/action |
| `advisor_access_required` | 403 | No | null | Advisor access is required. | Advisor-only action |
| `seller_access_required` | 403 | No | null | Seller access is required. | Marketplace seller action |
| `buyer_access_required` | 403 | No | null | Buyer access is required. | Marketplace buyer action |
| `entitlement_required` | 403 | No | null | Entitlement is required. | Plan/app access missing |
| `membership_required` | 403 | No | null | Active membership is required. | Member-only flow |
| `subscription_inactive` | 403 | No | null | Subscription is not active. | Subscription blocks access |
| `team_access_denied` | 403 | No | null | Team access is not permitted. | Team member not allowed |
| `field_permission_denied` | 403 | No | field name | You cannot update this field. | Protected field mutation |
| `action_not_allowed` | 403 | No | null | This action is not allowed. | General action denial |

### Example: Entitlement Required

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

---

## 13. Record and Data Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `not_found` | 404 | No | null | The requested resource was not found. | Generic not found |
| `record_not_found` | 404 | No | null | The requested record was not found. | DocType record missing or hidden |
| `doctype_not_found` | 404 | No | `doctype` | The requested record type was not found. | Invalid/missing DocType |
| `duplicate_record` | 409 | No | null | A duplicate record already exists. | Duplicate DocType record |
| `record_locked` | 409 | No | null | This record is locked. | Current state blocks edits |
| `record_archived` | 409 | No | null | This record is archived. | Active operation on archived record |
| `record_cancelled` | 409 | No | null | This record is cancelled. | Active operation on cancelled record |
| `record_closed` | 409 | No | null | This record is closed. | Edit blocked after closure |
| `invalid_record_state` | 409 | No | `workflow_state` | Record is not in a valid state for this action. | Wrong lifecycle state |
| `relationship_invalid` | 422 | No | null | Related records are invalid. | Bad parent/child relation |
| `tenant_mismatch` | 403 | No | `tenant` | Record does not belong to the expected tenant. | Tenant consistency failure |
| `owner_mismatch` | 403 | No | `owner` | Record does not belong to the expected owner. | Owner mismatch |
| `stale_record` | 409 | Yes | null | This record has changed. Refresh and try again. | Optimistic concurrency conflict |
| `missing_related_record` | 422 | No | field name | Related record is required. | Required relation missing |

### Example: Record Locked

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

---

## 14. Workflow Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `workflow_transition_denied` | 409 | No | `workflow_state` | This workflow transition is not allowed. | Invalid state transition |
| `workflow_state_invalid` | 422 | No | `workflow_state` | Workflow state is invalid. | State not recognised |
| `workflow_state_required` | 422 | No | `workflow_state` | Workflow state is required. | Missing workflow state |
| `workflow_action_required` | 422 | No | null | Workflow action is required. | Missing transition/action |
| `workflow_action_denied` | 403 | No | null | You cannot perform this workflow action. | Role cannot transition |
| `workflow_locked` | 409 | No | null | Workflow is locked. | Locked final state |
| `submit_not_allowed` | 403 | No | null | This record cannot be submitted. | Submit denied |
| `cancel_not_allowed` | 403 | No | null | This record cannot be cancelled. | Cancel denied |
| `close_not_allowed` | 403 | No | null | This record cannot be closed. | Close denied |
| `archive_not_allowed` | 403 | No | null | This record cannot be archived. | Archive denied |
| `more_information_not_allowed` | 403 | No | null | More information cannot be requested for this record. | Bad request-info action |
| `assignment_not_allowed` | 403 | No | `assigned_to` | This record cannot be assigned. | Assignment invalid |
| `invalid_assignee` | 422 | No | `assigned_to` | Assigned user is invalid. | User missing/not role-qualified |
| `outcome_not_ready` | 409 | No | null | Outcome is not ready. | Required outcome fields missing |

### Example: Workflow Transition Denied

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

---

## 15. Payment and Billing Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `payment_required` | 402 / 403 | No | `payment_status` | Payment is required. | Payment needed before proceeding |
| `payment_pending` | 409 | Yes | `payment_status` | Payment is pending. | Awaiting confirmation |
| `payment_failed` | 402 / 409 | Yes | `payment_status` | Payment failed. | Provider/backend says failed |
| `payment_cancelled` | 409 | No | `payment_status` | Payment was cancelled. | User/provider cancelled |
| `payment_disputed` | 409 | No | `payment_status` | Payment is disputed. | Dispute blocks action |
| `payment_not_found` | 404 | No | null | Payment record was not found. | Missing payment event |
| `payment_already_processed` | 409 | No | null | Payment has already been processed. | Duplicate event/action |
| `payment_provider_error` | 502 | Yes | null | Payment provider returned an error. | Provider failure |
| `payment_provider_unavailable` | 503 | Yes | null | Payment provider is unavailable. | Provider outage |
| `payment_provider_timeout` | 504 | Yes | null | Payment provider timed out. | Provider timeout |
| `payment_webhook_invalid` | 400 | No | null | Payment webhook is invalid. | Bad webhook |
| `payment_webhook_signature_invalid` | 401 | No | null | Payment webhook signature is invalid. | Signature verification failed |
| `payment_webhook_duplicate` | 409 | No | null | Payment webhook has already been processed. | Idempotency duplicate |
| `subscription_required` | 403 | No | null | Subscription is required. | Subscription needed |
| `subscription_not_found` | 404 | No | null | Subscription was not found. | Missing subscription |
| `subscription_inactive` | 403 | No | null | Subscription is not active. | Subscription inactive |
| `subscription_cancelled` | 403 | No | null | Subscription is cancelled. | Cancelled subscription |
| `billing_account_required` | 422 | No | `billing_account` | Billing account is required. | Billing setup missing |
| `invalid_payment_state` | 422 | No | `payment_status` | Payment state is invalid. | Unknown payment state |
| `raw_payment_payload_restricted` | 403 | No | null | Raw payment payload is restricted. | Customer tried to access raw payload |

### Example: Payment Failed

```json
{
  "ok": false,
  "data": null,
  "message": "Payment failed",
  "errors": [
    {
      "field": "payment_status",
      "code": "payment_failed",
      "message": "Payment could not be completed. Please try again or use a different payment method."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

---

## 16. File and Upload Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `file_required` | 422 | No | field name | File is required. | Required file missing |
| `file_not_found` | 404 | No | null | File was not found. | Missing file/reference |
| `file_too_large` | 413 | No | field name | File is too large. | Upload exceeds size limit |
| `file_empty` | 422 | No | field name | File is empty. | Zero-byte file |
| `unsupported_file_type` | 415 | No | field name | File type is not supported. | Extension/MIME invalid |
| `file_upload_failed` | 500 | Yes | field name | File upload failed. | Upload process failed |
| `file_attach_denied` | 403 | No | null | File cannot be attached to this record. | Related record access/state denied |
| `file_visibility_denied` | 403 | No | null | File visibility change is not allowed. | Visibility change denied |
| `file_visibility_invalid` | 422 | No | `visibility` | File visibility is invalid. | Bad visibility value |
| `file_access_denied` | 403 | No | null | You do not have access to this file. | File view denied |
| `file_quarantined` | 403 | No | null | File is not available. | Quarantine/security hold |
| `file_removed` | 404 | No | null | File has been removed. | Removed/deleted file |
| `max_files_exceeded` | 422 | No | field name | Maximum number of files exceeded. | Too many uploads |
| `upload_not_allowed_in_state` | 409 | No | `workflow_state` | Uploads are not allowed in the current state. | State blocks uploads |
| `public_file_requires_approval` | 403 | No | `visibility` | Public files require approval. | Public visibility blocked |

### Example: File Too Large

```json
{
  "ok": false,
  "data": null,
  "message": "File upload failed",
  "errors": [
    {
      "field": "supporting_documents",
      "code": "file_too_large",
      "message": "File exceeds the maximum allowed size."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

---

## 17. Notification Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `notification_not_found` | 404 | No | null | Notification was not found. | Missing notification |
| `notification_access_denied` | 403 | No | null | You do not have access to this notification. | Recipient/tenant mismatch |
| `notification_type_invalid` | 422 | No | `notification_type` | Notification type is invalid. | Bad trigger/type |
| `notification_recipient_required` | 422 | No | null | Notification recipient is required. | No user/role/tenant recipient |
| `notification_send_failed` | 500 | Yes | null | Notification could not be sent. | Delivery failure |
| `email_send_failed` | 502 | Yes | null | Email could not be sent. | Email provider failure |
| `notification_template_missing` | 500 | No | null | Notification template is missing. | Template not configured |
| `notification_already_read` | 409 | No | null | Notification is already marked as read. | Duplicate mark-read |
| `notification_channel_invalid` | 422 | `channel` | No | Notification channel is invalid. | Unsupported channel |

---

## 18. Admin Action Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `admin_action_denied` | 403 | No | null | Admin action denied. | User cannot perform admin action |
| `admin_action_invalid` | 422 | No | null | Admin action is invalid. | Unknown/bad admin action |
| `admin_action_requires_reason` | 422 | No | `reason` | Reason is required for this admin action. | Rejection/cancel/archive reason needed |
| `admin_action_not_available` | 409 | No | null | Admin action is not available for this record. | Wrong state/context |
| `admin_assignment_required` | 422 | No | `assigned_to` | Assignment target is required. | Missing assignee |
| `admin_rejection_reason_required` | 422 | No | `rejection_reason` | Rejection reason is required. | Reject action missing reason |
| `admin_archive_reason_required` | 422 | No | `archive_reason` | Archive reason is required. | Archive action missing reason |
| `admin_override_denied` | 403 | No | null | Admin override denied. | Role lacks override authority |
| `admin_review_already_completed` | 409 | No | null | Admin review has already been completed. | Duplicate review action |

---

## 19. Integration and Provider Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `integration_failed` | 502 | Yes | null | Integration failed. | Generic provider failure |
| `provider_unavailable` | 503 | Yes | null | External provider is unavailable. | Provider down |
| `provider_timeout` | 504 | Yes | null | External provider timed out. | Provider timeout |
| `provider_response_invalid` | 502 | Yes | null | External provider returned an invalid response. | Bad provider response |
| `provider_auth_failed` | 502 | No | null | External provider authentication failed. | API key/auth failure |
| `provider_rate_limited` | 429 | Yes | null | External provider rate limit reached. | Provider throttling |
| `integration_not_configured` | 500 | No | null | Integration is not configured. | Missing config |
| `adapter_not_available` | 500 | No | null | Integration adapter is not available. | Missing adapter/service |
| `serviceability_check_failed` | 502 | Yes | null | Serviceability check failed. | Connectivity provider failure |
| `crm_sync_failed` | 502 | Yes | null | CRM sync failed. | CRM integration failure |
| `email_provider_failed` | 502 | Yes | null | Email provider failed. | Email provider issue |

---

## 20. Rate Limit and Availability Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `rate_limited` | 429 | Yes | null | Too many requests. Please try again later. | Rate limit hit |
| `too_many_requests` | 429 | Yes | null | Too many requests. | Generic throttling |
| `service_unavailable` | 503 | Yes | null | Service is temporarily unavailable. | Temporary outage |
| `maintenance_mode` | 503 | Yes | null | Service is currently under maintenance. | Maintenance mode |
| `request_timeout` | 504 | Yes | null | Request timed out. | Server timeout |
| `background_job_pending` | 202 / 409 | Yes | null | This action is still processing. | Async-like job pending |

---

## 21. System and Internal Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `server_error` | 500 | Yes | null | Server error. | Generic server error |
| `unexpected_error` | 500 | Yes | null | An unexpected error occurred. | Unhandled exception |
| `configuration_error` | 500 | No | null | System configuration error. | Missing/invalid config |
| `database_error` | 500 | Yes | null | Database error. | DB operation failed |
| `transaction_failed` | 500 | Yes | null | Transaction failed. | Commit/rollback issue |
| `background_job_failed` | 500 | Yes | null | Background job failed. | Worker job failure |
| `audit_log_failed` | 500 | Yes | null | Audit log could not be recorded. | Audit creation failure |
| `response_build_failed` | 500 | Yes | null | Response could not be built. | DTO/envelope failure |
| `unsafe_error_redacted` | 500 | No | null | Internal error details were redacted. | Sensitive exception masked |

### Rule

Internal errors must never expose:

```text
stack traces
database passwords
API keys
provider secrets
raw payment payloads
private file paths
server filesystem paths
internal SQL
framework internals not needed by the frontend
```

The user does not need a guided tour of the server’s organs.

---

# DOMAIN-SPECIFIC ERRORS

---

## 22. Membership Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `membership_plan_not_found` | 404 | No | `plan` | Membership plan was not found. | Invalid plan |
| `membership_plan_inactive` | 409 | No | `plan` | Membership plan is not active. | Plan disabled |
| `membership_already_active` | 409 | No | null | Membership is already active. | Duplicate signup |
| `membership_signup_incomplete` | 422 | No | null | Membership signup is incomplete. | Required onboarding missing |
| `business_profile_required` | 422 | No | `business_profile` | Business profile is required. | Missing profile |
| `tenant_creation_failed` | 500 | Yes | null | Tenant could not be created. | Tenant creation failed |
| `subscription_creation_failed` | 500 | Yes | null | Subscription could not be created. | Subscription creation failed |
| `entitlement_creation_failed` | 500 | Yes | null | Entitlements could not be created. | Entitlement provisioning failed |
| `billing_cycle_invalid` | 422 | No | `billing_cycle` | Billing cycle is invalid. | Unsupported billing cycle |

---

## 23. Decision Desk Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `decision_request_not_found` | 404 | No | null | Decision Desk request was not found. | Missing/hidden request |
| `decision_title_required` | 422 | No | `decision_title` | Decision title is required. | Missing title |
| `decision_summary_required` | 422 | No | `decision_summary` | Decision summary is required. | Missing summary |
| `decision_option_required` | 422 | No | `options_considered` | At least one option is required. | Options required by final rules |
| `decision_deadline_invalid` | 422 | No | `deadline` | Decision deadline is invalid. | Bad deadline |
| `decision_request_not_editable` | 409 | No | null | Decision Desk request is not editable. | State locked |
| `advisor_assignment_required` | 422 | No | `assigned_to` | Advisor assignment is required. | Assignment action missing advisor |
| `recommendation_required` | 422 | No | `recommendation_summary` | Recommendation is required. | Mark ready without outcome |
| `decision_desk_entitlement_required` | 403 | No | null | Decision Desk entitlement is required. | Missing entitlement |

---

## 24. DocuShare Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `document_brief_not_found` | 404 | No | null | Document brief was not found. | Missing/hidden brief |
| `document_type_required` | 422 | No | `document_type` | Document type is required. | Missing type |
| `document_category_invalid` | 422 | No | `document_category` | Document category is invalid. | Invalid category |
| `jurisdiction_required` | 422 | No | `jurisdiction` | Jurisdiction is required. | Required by form |
| `document_requirements_missing` | 422 | No | `required_sections` | Document requirements are missing. | Missing requirements |
| `document_brief_not_editable` | 409 | No | null | Document brief is not editable. | State locked |
| `document_reviewer_invalid` | 422 | No | `assigned_to` | Reviewer is invalid. | Bad reviewer assignment |
| `docushare_entitlement_required` | 403 | No | null | DocuShare entitlement is required. | Missing entitlement |

---

## 25. Marketplace Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `listing_not_found` | 404 | No | null | Marketplace listing was not found. | Missing/hidden listing |
| `listing_title_required` | 422 | No | `listing_title` | Listing title is required. | Missing title |
| `listing_category_required` | 422 | No | `listing_category` | Listing category is required. | Missing category |
| `listing_description_required` | 422 | No | `description` | Listing description is required. | Missing description |
| `listing_price_invalid` | 422 | No | `price` | Listing price is invalid. | Negative/invalid price |
| `listing_not_editable` | 409 | No | null | Listing is not editable. | Locked listing |
| `listing_not_published` | 409 | No | null | Listing is not published. | Public/enquiry action blocked |
| `listing_already_published` | 409 | No | null | Listing is already published. | Duplicate publish |
| `seller_cannot_approve_own_listing` | 403 | No | null | Seller cannot approve their own listing. | Self-approval attempt |
| `seller_required` | 403 | No | null | Seller access is required. | Listing creation needs seller |
| `buyer_email_required` | 422 | No | `buyer_email` | Buyer email is required. | Enquiry missing email |
| `enquiry_message_required` | 422 | No | `message` | Enquiry message is required. | Enquiry missing message |
| `marketplace_entitlement_required` | 403 | No | null | Marketplace entitlement is required. | Missing entitlement |

---

## 26. Connectivity / NBN Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `connectivity_order_not_found` | 404 | No | null | Connectivity order was not found. | Missing/hidden order |
| `service_address_required` | 422 | No | `service_address` | Service address is required. | Missing address |
| `selected_plan_required` | 422 | No | `selected_plan` | Selected plan is required. | Missing plan |
| `serviceability_required` | 422 | No | `serviceability_status` | Serviceability check is required. | Must check before submit |
| `serviceability_failed` | 422 | No | `serviceability_status` | Address is not serviceable. | Not serviceable |
| `serviceability_manual_review_required` | 409 | No | `serviceability_status` | Manual serviceability review is required. | Manual review needed |
| `hardware_option_invalid` | 422 | No | `hardware_option` | Hardware option is invalid. | Bad hardware |
| `installation_preference_invalid` | 422 | No | `installation_preference` | Installation preference is invalid. | Bad install preference |
| `connectivity_order_not_editable` | 409 | No | null | Connectivity order is not editable. | State locked |
| `provisioning_update_denied` | 403 | No | null | Provisioning update denied. | Non-admin/support tries provisioning update |

---

## 27. Risk Advisor Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `risk_assessment_not_found` | 404 | No | null | Risk assessment was not found. | Missing/hidden assessment |
| `risk_categories_required` | 422 | No | `risk_categories` | Risk categories are required. | Missing categories |
| `assessment_answers_required` | 422 | No | `assessment_answers` | Assessment answers are required. | Missing answers |
| `risk_appetite_invalid` | 422 | No | `risk_appetite` | Risk appetite is invalid. | Bad risk appetite |
| `risk_score_invalid` | 422 | No | `calculated_score` | Risk score is invalid. | Score out of range |
| `risk_assessment_not_editable` | 409 | No | null | Risk assessment is not editable. | State locked |
| `advisor_notes_restricted` | 403 | No | `advisor_notes` | Advisor notes are restricted. | Customer tries to edit advisor notes |
| `risk_advisor_entitlement_required` | 403 | No | null | Risk Advisor entitlement is required. | Missing entitlement |

---

## 28. The Fixer Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `fixer_request_not_found` | 404 | No | null | Fixer request was not found. | Missing/hidden request |
| `issue_title_required` | 422 | No | `issue_title` | Issue title is required. | Missing title |
| `issue_description_required` | 422 | No | `issue_description` | Issue description is required. | Missing description |
| `urgency_invalid` | 422 | No | `urgency` | Urgency is invalid. | Bad urgency |
| `business_impact_required` | 422 | No | `business_impact` | Business impact is required. | Required by final form |
| `fixer_request_not_editable` | 409 | No | null | Fixer request is not editable. | State locked |
| `resolution_summary_required` | 422 | No | `resolution_summary` | Resolution summary is required. | Closing without outcome |
| `fixer_entitlement_required` | 403 | No | null | Fixer entitlement is required. | Missing entitlement |

---

## 29. Portal and Dashboard Errors

| Code | HTTP | Retryable | Field | Message | Use When |
|---|---:|---:|---|---|---|
| `portal_access_denied` | 403 | No | null | Portal access denied. | User cannot access portal |
| `portal_context_missing` | 422 | No | null | Portal context is missing. | No tenant/user context |
| `dashboard_unavailable` | 503 | Yes | null | Dashboard is unavailable. | Dashboard data failure |
| `user_context_unavailable` | 500 | Yes | null | User context is unavailable. | Context build failed |
| `tenant_context_required` | 422 | No | `tenant` | Tenant context is required. | Tenant missing |
| `navigation_access_denied` | 403 | No | null | Navigation item is not available. | Restricted route/action |

---

# ERROR HANDLING CONTRACTS

---

## 30. Frontend Handling Requirements

The frontend API client must:

```text
- normalise all API errors into one client error shape
- inspect ok === false
- read top-level message for summary display
- read errors[] for field and action messages
- map field errors to form fields
- map permission errors to access denied views or disabled actions
- map authentication errors to login/session handling
- map workflow errors to status refresh prompts
- map payment errors to payment retry or billing messaging
- map upload errors to upload field messages
- preserve request_id for support/debugging
```

## 30.1 Recommended TypeScript Types

```ts
export type ApiErrorItem = {
  field: string | null;
  code: string;
  message: string;
  details?: Record<string, unknown>;
  hint?: string;
  severity?: "info" | "warning" | "error" | "critical";
  retryable?: boolean;
};

export type ApiErrorResponse = {
  ok: false;
  data: null;
  message: string;
  errors: ApiErrorItem[];
  meta: {
    request_id?: string;
    timestamp?: string;
  };
};
```

## 30.2 Recommended Frontend Error Groups

```ts
const authenticationErrorCodes = [
  "not_authenticated",
  "session_expired",
  "invalid_session"
];

const permissionErrorCodes = [
  "permission_denied",
  "tenant_access_denied",
  "entitlement_required",
  "membership_required"
];

const validationErrorCodes = [
  "validation_failed",
  "required",
  "invalid_value",
  "invalid_format"
];

const workflowErrorCodes = [
  "workflow_transition_denied",
  "record_locked",
  "invalid_record_state"
];

const paymentErrorCodes = [
  "payment_required",
  "payment_pending",
  "payment_failed"
];

const uploadErrorCodes = [
  "file_too_large",
  "unsupported_file_type",
  "file_upload_failed"
];
```

---

## 31. Backend Implementation Requirements

## 31.1 Frappe Service-Layer Pattern

Backend service methods should raise or return structured application errors, then API methods should convert them into the standard response envelope.

Recommended modules:

```text
rbp_app/errors.py
rbp_app/responses.py
rbp_app/guards.py
rbp_app/permissions.py
```

## 31.2 Suggested Error Class

```python
class RBPError(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        field: str | None = None,
        http_status: int = 400,
        details: dict | None = None,
        retryable: bool = False,
        severity: str = "error",
    ):
        self.code = code
        self.message = message
        self.field = field
        self.http_status = http_status
        self.details = details or {}
        self.retryable = retryable
        self.severity = severity
        super().__init__(message)
```

## 31.3 Suggested Response Builder

```python
def error_response(
    message: str,
    errors: list[dict],
    request_id: str | None = None,
    meta: dict | None = None,
):
    return {
        "ok": False,
        "data": None,
        "message": message,
        "errors": errors,
        "meta": {
            "request_id": request_id,
            **(meta or {}),
        },
    }
```

## 31.4 Suggested Guard Usage

```python
def require_authenticated_user():
    if frappe.session.user == "Guest":
        raise RBPError(
            code="not_authenticated",
            message="You must be logged in to perform this action.",
            http_status=401,
        )
```

## 31.5 Backend Rules

Backend must:

```text
- never return raw Python/Frappe exceptions to frontend
- never expose stack traces in API responses
- never expose raw payment payloads to customer users
- never leak whether another tenant's record exists
- map Frappe validation errors into standard error objects
- map permission failures into standard permission errors
- log internal details server-side with request_id
- return safe user-facing messages
```

---

## 32. Security and Privacy Rules

Error messages must not leak sensitive information.

## 32.1 Safe Error Message

Use:

```text
You do not have access to this record.
```

Do not use:

```text
Record RBP-DDR-0001 belongs to tenant RBP-TENANT-9999 and your tenant is RBP-TENANT-0001.
```

That second one is not an error message. It is a data leak wearing a nametag.

## 32.2 Tenant Privacy

For inaccessible tenant records, use:

```text
permission_denied
tenant_access_denied
not_found
```

depending on the endpoint policy.

When revealing existence is unsafe, prefer:

```text
record_not_found
```

rather than confirming the record exists but belongs to another tenant.

## 32.3 Payment Privacy

Never expose:

```text
raw webhook payload
payment provider secrets
card details
provider API keys
fraud/dispute internal notes
full provider error if it contains sensitive data
```

## 32.4 File Privacy

Never expose:

```text
private file paths
storage backend paths
unapproved public URLs
files attached to another tenant
quarantined file details
```

---

## 33. Logging and Audit Requirements

Every error response should include or correlate to:

```text
request_id
timestamp
user
tenant, if known
endpoint
error code
related_doctype, if known
related_name, if safe/known
```

## 33.1 Errors That Should Be Audited

```text
permission_denied
tenant_access_denied
owner_access_denied
admin_action_denied
workflow_transition_denied
payment_webhook_signature_invalid
payment_webhook_duplicate
file_access_denied
raw_payment_payload_restricted
provider_auth_failed
unsafe_error_redacted
```

## 33.2 Errors That Usually Do Not Need Audit Logs

```text
required
invalid_email
too_long
invalid_selection
missing_payload
```

Validation errors may be logged for debugging but should not flood audit logs like a confetti cannon of minor human failure.

---

## 34. Mock-to-Real API Error Mapping

During Phase 1, mock services may return simplified errors. During Phase 5, mock errors must map to this catalogue.

| Mock Error | Real Error Code |
|---|---|
| Missing required field | `required` |
| Invalid email | `invalid_email` |
| Payment simulation failed | `payment_failed` |
| Upload mock rejected file | `unsupported_file_type` or `file_too_large` |
| Mock service unavailable | `service_unavailable` |
| Mock permission denied | `permission_denied` |
| Mock record not found | `record_not_found` |
| Mock status transition invalid | `workflow_transition_denied` |

Mock service errors must not invent new codes if an approved code already exists.

---

## 35. Error Code Change Control

Once accepted, error code changes require a contract update.

A change request must include:

```text
- existing code
- proposed code
- reason for change
- affected APIs
- affected frontend forms/pages
- affected tests
- migration/backward compatibility plan
```

Template:

```md
## Error Code Change Request

| Field | Value |
|---|---|
| Existing Code |  |
| Proposed Code |  |
| Reason |  |
| Affected APIs |  |
| Affected Frontend Areas |  |
| Affected Tests |  |
| Backward Compatible | Yes / No |
| Approved By |  |
| Date |  |
```

No silent renaming. Silent renaming is how frontend error handling becomes folklore.

---

## 36. QA Test Requirements

## 36.1 Envelope Tests

```text
test_error_response_has_ok_false
test_error_response_has_data_null
test_error_response_has_message
test_error_response_has_errors_array
test_error_response_has_meta_request_id
test_error_object_has_field_code_message
```

## 36.2 Validation Error Tests

```text
test_required_field_returns_required_code
test_invalid_email_returns_invalid_email_code
test_invalid_selection_returns_invalid_selection_code
test_multiple_validation_errors_return_multiple_error_items
```

## 36.3 Authentication and Permission Tests

```text
test_guest_access_protected_api_returns_not_authenticated
test_expired_session_returns_session_expired
test_member_access_other_tenant_returns_tenant_access_denied_or_not_found
test_user_without_entitlement_returns_entitlement_required
test_admin_only_action_returns_admin_required_for_non_admin
```

## 36.4 Workflow Error Tests

```text
test_invalid_transition_returns_workflow_transition_denied
test_closed_record_update_returns_record_closed_or_record_locked
test_unassigned_advisor_transition_returns_assignment_required
test_customer_direct_workflow_state_update_returns_workflow_action_denied
```

## 36.5 Payment Error Tests

```text
test_payment_required_returns_payment_required
test_payment_failed_returns_payment_failed
test_duplicate_webhook_returns_payment_webhook_duplicate
test_invalid_webhook_signature_returns_payment_webhook_signature_invalid
test_customer_raw_payload_access_returns_raw_payment_payload_restricted
```

## 36.6 File Error Tests

```text
test_large_file_returns_file_too_large
test_bad_file_type_returns_unsupported_file_type
test_file_upload_to_closed_record_returns_upload_not_allowed_in_state
test_private_file_other_user_returns_file_access_denied
test_public_visibility_without_approval_returns_public_file_requires_approval
```

## 36.7 Admin Error Tests

```text
test_non_admin_assign_advisor_returns_admin_action_denied
test_reject_without_reason_returns_admin_rejection_reason_required
test_archive_without_reason_returns_admin_archive_reason_required
test_duplicate_admin_review_returns_admin_review_already_completed
```

## 36.8 System Error Tests

```text
test_unhandled_exception_returns_server_error_without_stack_trace
test_provider_timeout_returns_provider_timeout
test_service_unavailable_returns_service_unavailable
test_internal_error_logs_request_id
```

---

## 37. Open Items for Final Phase 2 Lock

These items must be confirmed after Phase 1 UI/UX completion and final API contract mapping:

| Item | Status | Notes |
|---|---|---|
| Final field-specific validation errors per form | Draft | Depends on final forms |
| Final domain-specific error messages | Draft | Depends on final UX wording |
| Final payment provider error mapping | Draft | Depends on provider selection/configuration |
| Final upload file type and size errors | Draft | Depends on upload contract |
| Final serviceability/provider errors | Draft | Depends on connectivity provider assumptions |
| Final marketplace moderation errors | Draft | Depends on marketplace admin workflow |
| Final admin reason requirements | Draft | Depends on admin action contract |
| Final audit list for denied actions | Draft | Depends on security review |
| Final frontend error display rules | Draft | Depends on design system and form components |
| Final HTTP handling in Frappe | Draft | Depends on implementation detail |

---

## 38. Error Catalogue Acceptance Checklist

This document is ready for Phase 2 draft use when:

```text
Standard error envelope is defined.
Required error object fields are defined.
Error code naming rules are defined.
HTTP status mapping is defined.
Severity and retryability are defined.
General request errors are defined.
Validation errors are defined.
Authentication errors are defined.
Permission errors are defined.
Record/data errors are defined.
Workflow errors are defined.
Payment and billing errors are defined.
File/upload errors are defined.
Notification errors are defined.
Admin action errors are defined.
Integration/provider errors are defined.
Rate limit and availability errors are defined.
System/internal errors are defined.
Domain-specific errors are defined.
Frontend handling requirements are defined.
Backend implementation guidance is defined.
Security and privacy rules are defined.
Logging and audit requirements are defined.
Mock-to-real error mapping is defined.
Error code change control is defined.
QA test requirements are defined.
Open items are listed for final Phase 2 lock.
```

---

## 39. Phase 2 Sign-Off Criteria

The Error Catalogue can be signed off only when:

```text
Every API contract references standard error responses.
Every form field validation maps to an error code.
Every permission denial maps to an error code.
Every workflow transition failure maps to an error code.
Every payment failure state maps to an error code.
Every file upload failure maps to an error code.
Every admin action failure maps to an error code.
Every domain-specific flow has required domain errors.
Frontend error handling can be implemented without guessing.
Backend service-layer exceptions can be mapped into this catalogue.
QA tests assert the correct error codes and envelope shape.
No endpoint returns raw, inconsistent, or unsafe errors.
```

---

## 40. Final Rule

Every failed request must answer four questions:

```text
What failed?
Where did it fail?
Can the user fix it?
Can support/admin trace it?
```

If an error cannot answer those questions safely, it is not an error contract. It is a shrug in JSON.
