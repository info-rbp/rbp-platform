# API Response Envelope Standard

**Project:** Remote Business Partner Platform  
**Phase:** Phase 2 - Backend Contract Planning  
**Document Type:** Backend Contract Standard  
**Recommended Location:** `RBP_Phase_2_Backend_Contracts/01-api-response-envelope-standard.md`  
**Status:** Draft Standard  
**Last Updated:** 2026-05-07

---

## 1. Purpose

This document defines the standard response envelope that every Remote Business Partner Platform API must return.

The goal is to ensure that frontend code, Frappe API methods, service-layer logic, validation handling, permission handling, workflow transitions, payments, uploads, and admin actions all communicate using a predictable structure.

Without this standard, each endpoint invents its own response shape, and then the frontend has to behave like a detective in a badly written crime drama. This document prevents that.

---

## 2. Scope

This standard applies to all backend API responses returned by `rbp_app.api.*` methods, including:

- public website APIs
- authenticated portal APIs
- admin APIs
- membership APIs
- Decision Desk APIs
- DocuShare APIs
- Marketplace APIs
- Connectivity / NBN APIs
- Risk Advisor APIs
- The Fixer APIs
- billing and payment APIs
- file upload APIs
- notification APIs
- portal dashboard APIs
- workflow/admin action APIs

This standard applies to both successful and failed responses.

---

## 3. Standard Response Shape

Every API response must return the following top-level structure:

```json
{
  "ok": true,
  "data": {},
  "message": "Request completed successfully",
  "errors": [],
  "meta": {
    "request_id": "uuid",
    "timestamp": "2026-05-07T00:00:00Z"
  }
}
```

Every response must include these five keys:

| Key | Type | Required | Purpose |
|---|---:|---:|---|
| `ok` | boolean | Yes | Indicates whether the API operation succeeded. |
| `data` | object, array, string, number, boolean, or null | Yes | Contains the successful response payload. Must be `null` when the request fails unless partial data is deliberately supported. |
| `message` | string | Yes | Human-readable summary suitable for UI display, toast messages, admin logs, or debugging context. |
| `errors` | array | Yes | List of structured error objects. Must be empty on success. |
| `meta` | object | Yes | Operational metadata such as request ID, timestamp, pagination, and debug-safe context. |

---

## 4. Success Response Standard

### 4.1 Basic Success Response

Use this shape when an operation completes successfully and returns a single record or object.

```json
{
  "ok": true,
  "data": {
    "name": "RBP-DD-0001",
    "status": "Submitted",
    "workflow_state": "Submitted"
  },
  "message": "Decision Desk request submitted",
  "errors": [],
  "meta": {
    "request_id": "9e53d31e-ef1c-4dd8-9351-6247bb857c3d",
    "timestamp": "2026-05-07T00:00:00Z"
  }
}
```

### 4.2 Success Requirements

A successful response must satisfy all of the following:

- `ok` must be `true`.
- `errors` must be an empty array.
- `message` must be clear and specific.
- `data` must contain the result expected by the frontend contract.
- `meta.request_id` must be present.
- `meta.timestamp` must be present.
- Sensitive internal fields must not be returned unless explicitly required by the frontend contract.

---

## 5. Error Response Standard

### 5.1 Basic Error Response

Use this shape when an operation fails.

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
    "request_id": "9e53d31e-ef1c-4dd8-9351-6247bb857c3d",
    "timestamp": "2026-05-07T00:00:00Z"
  }
}
```

### 5.2 Error Requirements

An error response must satisfy all of the following:

- `ok` must be `false`.
- `data` should be `null`, unless the contract explicitly supports partial results.
- `errors` must contain at least one structured error object.
- `message` must summarize the failure in plain language.
- `meta.request_id` must be present.
- Internal stack traces must never be returned to the frontend.
- Sensitive values, tokens, secrets, or raw payment payloads must never be returned.

---

## 6. Error Object Standard

Every item in the `errors` array must use this structure:

```json
{
  "field": "business_name",
  "code": "required",
  "message": "Business name is required",
  "details": {}
}
```

| Key | Type | Required | Purpose |
|---|---:|---:|---|
| `field` | string or null | Yes | Field related to the error. Use `null` for non-field errors. |
| `code` | string | Yes | Stable machine-readable error code. Used by the frontend for mapping and handling. |
| `message` | string | Yes | Human-readable message. |
| `details` | object | No | Extra safe context, such as allowed values, min/max limits, or workflow transition details. |

### 6.1 Field-Level Error Example

```json
{
  "field": "email",
  "code": "invalid_email",
  "message": "Enter a valid email address",
  "details": {}
}
```

### 6.2 Non-Field Error Example

```json
{
  "field": null,
  "code": "permission_denied",
  "message": "You do not have permission to access this record",
  "details": {
    "required_role": "RBP Admin"
  }
}
```

---

## 7. Required Metadata

The `meta` object must always include operational metadata that helps debugging, audit trails, frontend logging, and support review.

### 7.1 Minimum Metadata

```json
{
  "request_id": "uuid",
  "timestamp": "2026-05-07T00:00:00Z"
}
```

| Key | Type | Required | Purpose |
|---|---:|---:|---|
| `request_id` | string | Yes | Unique identifier for tracing request handling across frontend, API, service layer, and logs. |
| `timestamp` | string | Yes | ISO 8601 timestamp generated by the backend. |

### 7.2 Recommended Metadata

Depending on the endpoint, the following fields may be added:

| Key | Type | Use When |
|---|---:|---|
| `pagination` | object | List endpoints. |
| `filters` | object | Search/filter endpoints. |
| `workflow` | object | Workflow transition endpoints. |
| `entitlement` | object | Entitlement-gated endpoints. |
| `payment` | object | Payment-related endpoints. |
| `file_upload` | object | Upload-related endpoints. |
| `debug` | object | Local development only. Must never expose secrets or stack traces. |

---

## 8. Pagination Standard

List endpoints must return pagination inside `meta.pagination`.

### 8.1 Paginated Response Example

```json
{
  "ok": true,
  "data": [
    {
      "name": "RBP-DD-0001",
      "decision_title": "Choose accounting platform",
      "status": "Submitted"
    }
  ],
  "message": "Decision Desk requests retrieved",
  "errors": [],
  "meta": {
    "request_id": "9e53d31e-ef1c-4dd8-9351-6247bb857c3d",
    "timestamp": "2026-05-07T00:00:00Z",
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 48,
      "total_pages": 3,
      "has_next": true,
      "has_previous": false
    }
  }
}
```

### 8.2 Pagination Requirements

List endpoints must define:

- default page size
- maximum page size
- sort order
- filter behavior
- empty-state behavior
- permission-aware filtering

A user must never receive records they cannot access, even if they manipulate pagination, filters, or query parameters. Delightful that this has to be said, but here we are.

---

## 9. Standard Error Codes

Error codes must be stable and machine-readable. The frontend should rely on these codes, not on message text.

### 9.1 Validation Error Codes

| Code | Meaning |
|---|---|
| `required` | Required field missing. |
| `invalid_format` | Value format is invalid. |
| `invalid_email` | Email value is invalid. |
| `invalid_phone` | Phone value is invalid. |
| `invalid_date` | Date value is invalid. |
| `invalid_choice` | Value is not one of the permitted options. |
| `min_length` | Value is shorter than allowed. |
| `max_length` | Value is longer than allowed. |
| `min_value` | Numeric value is too low. |
| `max_value` | Numeric value is too high. |
| `date_in_past` | Date cannot be in the past. |
| `date_too_soon` | Date does not meet minimum lead-time rule. |
| `duplicate` | Record already exists. |

### 9.2 Authentication and Session Error Codes

| Code | Meaning |
|---|---|
| `unauthenticated` | User is not logged in. |
| `session_expired` | Session has expired. |
| `csrf_failed` | CSRF token is missing or invalid. |
| `login_required` | Endpoint requires authentication. |

### 9.3 Permission Error Codes

| Code | Meaning |
|---|---|
| `permission_denied` | User lacks permission for this action. |
| `role_required` | User does not hold required role. |
| `tenant_access_denied` | Record does not belong to the user's tenant. |
| `admin_required` | Action requires admin permission. |
| `advisor_assignment_required` | Advisor must be assigned before action is allowed. |

### 9.4 Record and Workflow Error Codes

| Code | Meaning |
|---|---|
| `not_found` | Record does not exist or is not visible to the user. |
| `invalid_state` | Record is not in a state that allows this action. |
| `invalid_transition` | Workflow transition is not allowed. |
| `already_submitted` | Record has already been submitted. |
| `already_closed` | Record is already closed. |
| `more_information_required` | Record requires additional user input before progressing. |
| `conflict` | Record changed since the user last loaded it. |

### 9.5 Payment Error Codes

| Code | Meaning |
|---|---|
| `payment_required` | Payment or active entitlement is required. |
| `payment_pending` | Payment is still pending. |
| `payment_failed` | Payment failed. |
| `subscription_inactive` | Subscription is inactive. |
| `entitlement_required` | User or tenant lacks the required entitlement. |
| `payment_event_duplicate` | Payment event has already been processed. |

### 9.6 File Upload Error Codes

| Code | Meaning |
|---|---|
| `file_required` | File is required. |
| `file_too_large` | File exceeds size limit. |
| `file_type_not_allowed` | File type is not permitted. |
| `file_upload_failed` | Upload failed. |
| `file_visibility_invalid` | Requested file visibility is not allowed. |
| `file_access_denied` | User cannot access the file. |

### 9.7 System Error Codes

| Code | Meaning |
|---|---|
| `internal_error` | Unexpected server error. |
| `service_unavailable` | Required service is unavailable. |
| `rate_limited` | Too many requests. |
| `timeout` | Operation timed out. |
| `configuration_error` | Backend configuration is missing or invalid. |

---

## 10. HTTP Status Mapping

The HTTP status code should align with the response envelope.

| Scenario | HTTP Status | `ok` | Notes |
|---|---:|---:|---|
| Successful create | 200 or 201 | `true` | Frappe may commonly return 200; document endpoint-specific behavior. |
| Successful read/list | 200 | `true` | Use for `get_*` and `list_*`. |
| Successful update | 200 | `true` | Use for draft updates and admin actions. |
| Validation failed | 400 or 422 | `false` | Prefer 422 where feasible. |
| Unauthenticated | 401 | `false` | Login/session required. |
| Permission denied | 403 | `false` | Authenticated but not allowed. |
| Not found | 404 | `false` | Also use when record exists but must not be revealed. |
| Conflict | 409 | `false` | Use for concurrency/state conflict. |
| Rate limited | 429 | `false` | Include retry information where safe. |
| Server error | 500 | `false` | Return safe message only. |

If Frappe constraints make exact HTTP status mapping difficult, the envelope remains mandatory and `ok` becomes the frontend source of truth.

---

## 11. Domain Response Examples

### 11.1 Membership Signup Success

```json
{
  "ok": true,
  "data": {
    "tenant": "RBP-TENANT-0001",
    "business_profile": "RBP-BUSINESS-0001",
    "subscription": "RBP-SUB-0001",
    "membership_status": "Active",
    "portal_redirect": "/portal"
  },
  "message": "Membership created successfully",
  "errors": [],
  "meta": {
    "request_id": "9e53d31e-ef1c-4dd8-9351-6247bb857c3d",
    "timestamp": "2026-05-07T00:00:00Z"
  }
}
```

### 11.2 Decision Desk Validation Failure

```json
{
  "ok": false,
  "data": null,
  "message": "Decision Desk request could not be submitted",
  "errors": [
    {
      "field": "decision_title",
      "code": "required",
      "message": "Decision title is required"
    },
    {
      "field": "deadline",
      "code": "date_too_soon",
      "message": "Deadline must allow enough review time",
      "details": {
        "minimum_lead_days": 2
      }
    }
  ],
  "meta": {
    "request_id": "9e53d31e-ef1c-4dd8-9351-6247bb857c3d",
    "timestamp": "2026-05-07T00:00:00Z"
  }
}
```

### 11.3 Permission Denied

```json
{
  "ok": false,
  "data": null,
  "message": "You do not have permission to perform this action",
  "errors": [
    {
      "field": null,
      "code": "permission_denied",
      "message": "You do not have permission to perform this action"
    }
  ],
  "meta": {
    "request_id": "9e53d31e-ef1c-4dd8-9351-6247bb857c3d",
    "timestamp": "2026-05-07T00:00:00Z"
  }
}
```

### 11.4 Payment Required

```json
{
  "ok": false,
  "data": null,
  "message": "An active membership or payment is required",
  "errors": [
    {
      "field": null,
      "code": "payment_required",
      "message": "An active membership or payment is required to continue",
      "details": {
        "required_entitlement": "decision_desk_access"
      }
    }
  ],
  "meta": {
    "request_id": "9e53d31e-ef1c-4dd8-9351-6247bb857c3d",
    "timestamp": "2026-05-07T00:00:00Z"
  }
}
```

### 11.5 File Upload Failure

```json
{
  "ok": false,
  "data": null,
  "message": "File upload failed",
  "errors": [
    {
      "field": "supporting_documents",
      "code": "file_type_not_allowed",
      "message": "This file type is not allowed",
      "details": {
        "allowed_types": ["pdf", "docx", "png", "jpg"]
      }
    }
  ],
  "meta": {
    "request_id": "9e53d31e-ef1c-4dd8-9351-6247bb857c3d",
    "timestamp": "2026-05-07T00:00:00Z"
  }
}
```

---

## 12. Frappe Implementation Requirements

All whitelisted API methods under `rbp_app.api.*` must return this response envelope.

### 12.1 API Layer Responsibilities

The API layer must:

- validate authentication/session requirements
- validate request shape at the boundary
- call the correct service-layer method
- catch known validation, permission, workflow, payment, and file errors
- convert service results into the standard response envelope
- avoid placing business logic directly inside API methods
- avoid returning raw Frappe exceptions to the frontend

### 12.2 Service Layer Responsibilities

The service layer must:

- enforce business rules
- create and update DocTypes
- enforce tenant ownership and access rules
- trigger workflows
- trigger notifications
- record audit logs where required
- record payment events where required
- return safe DTOs to the API layer

### 12.3 Suggested Python Helper

A shared response helper should be created so endpoints do not handcraft envelopes repeatedly like tiny artisanal disasters.

Recommended file:

```text
rbp_app/rbp_app/api/response.py
```

Suggested helper structure:

```python
from datetime import datetime, timezone
import uuid


def success(data=None, message="Request completed successfully", meta=None):
    return {
        "ok": True,
        "data": data if data is not None else {},
        "message": message,
        "errors": [],
        "meta": build_meta(meta),
    }


def failure(message="Request failed", errors=None, data=None, meta=None):
    return {
        "ok": False,
        "data": data,
        "message": message,
        "errors": errors or [],
        "meta": build_meta(meta),
    }


def error(field=None, code="internal_error", message="An error occurred", details=None):
    payload = {
        "field": field,
        "code": code,
        "message": message,
    }
    if details is not None:
        payload["details"] = details
    return payload


def build_meta(extra=None):
    meta = {
        "request_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    if extra:
        meta.update(extra)
    return meta
```

### 12.4 Frappe Endpoint Example

```python
import frappe
from rbp_app.api.response import success, failure, error
from rbp_app.services import decision_desk as decision_desk_service


@frappe.whitelist()
def create_request(payload=None):
    try:
        user = frappe.session.user
        result = decision_desk_service.create_request(user=user, payload=payload)
        return success(
            data=result,
            message="Decision Desk request created"
        )
    except ValueError as exc:
        return failure(
            message="Validation failed",
            errors=[error(code="invalid_request", message=str(exc))]
        )
    except frappe.PermissionError:
        return failure(
            message="You do not have permission to perform this action",
            errors=[error(code="permission_denied", message="You do not have permission to perform this action")]
        )
```

---

## 13. Frontend Client Requirements

The frontend API client must treat the response envelope as the standard contract.

### 13.1 Frontend Client Responsibilities

The frontend client must:

- parse the response envelope consistently
- use `ok` as the primary success/failure flag
- map `errors[].field` to form fields
- map `errors[].code` to frontend behavior where required
- show `message` for page, toast, or inline summaries
- preserve `meta.request_id` for support/debug reporting
- redirect on `unauthenticated`, `session_expired`, or `login_required`
- show permission states for `permission_denied`, `admin_required`, and `tenant_access_denied`
- handle payment states such as `payment_required`, `payment_pending`, and `payment_failed`

### 13.2 Suggested TypeScript Types

```ts
export interface ApiEnvelope<T = unknown> {
  ok: boolean;
  data: T | null;
  message: string;
  errors: ApiError[];
  meta: ApiMeta;
}

export interface ApiError {
  field: string | null;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  request_id: string;
  timestamp: string;
  pagination?: ApiPagination;
  [key: string]: unknown;
}

export interface ApiPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}
```

### 13.3 Frontend Handling Example

```ts
export async function handleApiResponse<T>(response: Response): Promise<T> {
  const envelope = (await response.json()) as ApiEnvelope<T>;

  if (!envelope.ok) {
    throw {
      message: envelope.message,
      errors: envelope.errors,
      requestId: envelope.meta.request_id,
    };
  }

  return envelope.data as T;
}
```

---

## 14. Security Rules

The response envelope must not expose:

- stack traces
- raw database errors
- raw payment provider payloads
- secrets
- API keys
- session tokens
- CSRF tokens
- internal file paths
- private tenant data from another tenant
- admin-only fields to non-admin users
- permission logic internals that would help bypass access controls

For records that exist but are not visible to the current user, the API may return `not_found` rather than `permission_denied` where revealing the record's existence would be unsafe.

---

## 15. Logging and Audit Requirements

For every failed API response, the backend should log:

- `request_id`
- user
- endpoint
- request method
- error code
- safe error summary
- related DocType and record name where applicable
- timestamp

For admin, payment, workflow, file, and entitlement actions, the backend should also create or update the relevant audit record where required by the domain contract.

---

## 16. Testing Requirements

Every API contract test must verify:

- the response contains `ok`
- the response contains `data`
- the response contains `message`
- the response contains `errors`
- the response contains `meta`
- success responses return `ok: true`
- success responses return `errors: []`
- failure responses return `ok: false`
- failure responses return at least one structured error
- validation errors include the relevant `field`
- permission errors use a stable permission error code
- `request_id` is present
- `timestamp` is present
- no raw stack traces are returned
- no sensitive fields are returned

### 16.1 Minimum Test Matrix

| Scenario | Expected Result |
|---|---|
| Valid create request | `ok: true`, created record in `data`. |
| Missing required field | `ok: false`, `required` field error. |
| Invalid field format | `ok: false`, stable validation code. |
| Unauthenticated request | `ok: false`, `unauthenticated` or `login_required`. |
| Unauthorized tenant access | `ok: false`, `tenant_access_denied` or `not_found`. |
| Invalid workflow transition | `ok: false`, `invalid_transition`. |
| Payment required | `ok: false`, `payment_required`. |
| Invalid upload type | `ok: false`, `file_type_not_allowed`. |
| Internal exception | `ok: false`, safe `internal_error`, no stack trace. |

---

## 17. Acceptance Criteria

This document is complete when:

- the standard success envelope is defined
- the standard failure envelope is defined
- all required top-level keys are defined
- error object shape is defined
- metadata shape is defined
- pagination shape is defined
- standard error codes are defined
- HTTP status mapping is defined
- Frappe helper requirements are defined
- frontend client requirements are defined
- security rules are defined
- testing requirements are defined
- all future domain API contracts can reference this document instead of redefining the response shape

---

## 18. Open Decisions

The following decisions should be confirmed during Phase 2 finalization:

| Decision | Options | Recommended |
|---|---|---|
| HTTP status strictness | Strict REST-style status codes vs Frappe-normalized 200 responses | Use best available HTTP status, but always rely on `ok`. |
| Request ID source | Generated per helper call vs inherited from request middleware | Prefer middleware if available, otherwise helper-generated UUID. |
| Timestamp source | API helper vs database/server middleware | API helper is acceptable for Phase 3. |
| Debug metadata | Never returned vs local-only | Local-only, never production. |
| Partial success | Allowed vs disallowed | Disallow by default; allow only in explicitly documented batch endpoints. |

---

## 19. Related Phase 2 Documents

This standard should be referenced by:

- `02-naming-conventions.md`
- `07-error-catalogue.md`
- `11-route-to-endpoint-map.md`
- `12-form-field-specifications.md`
- `13-validation-rules.md`
- `16-mock-to-real-api-map.md`
- all domain API contract files under `contracts/api/`

---

## 20. Final Rule

Every API should return the same envelope shape, every frontend API client should expect that shape, and every backend test should enforce it.

That is the entire point: one response standard, everywhere, so nobody has to inspect twelve incompatible return formats while muttering at their monitor like a Victorian ghost.
