# RBP Phase 2 Backend Contracts
# 10-contract-templates.md

## Document Status

| Field | Value |
|---|---|
| Document | Contract Templates |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/10-contract-templates.md` |
| Intended Final Location | `rbp-platform/contracts/contract-templates.md` |
| Primary Consumers | Product, frontend, Frappe backend, QA, admin operations, integration |

---

## 1. Purpose

This document provides reusable contract templates for Phase 2: Backend Contract Planning.

These templates standardise how the project documents:

```text
- API contracts
- route-to-endpoint mappings
- DocType models
- field specifications
- validation rules
- workflow states
- permission rules
- role access
- payment states
- file/upload rules
- notification triggers
- admin actions
- error states
- mock-to-real API mappings
- QA acceptance checks
```

The purpose is to make every Phase 2 contract file consistent, complete, and useful for Phase 3 Frappe implementation.

Without templates, every domain contract becomes a creative writing exercise. Backend planning should not have a “free jazz” option.

---

## 2. How to Use These Templates

Use this document as the source for copying and filling in contract sections for each product domain.

Recommended product contract files:

```text
contracts/api/membership.contract.md
contracts/api/decision-desk.contract.md
contracts/api/docushare.contract.md
contracts/api/marketplace.contract.md
contracts/api/connectivity.contract.md
contracts/api/risk-advisor.contract.md
contracts/api/fixer.contract.md
contracts/api/portal.contract.md
```

Each domain contract should use the templates that apply to that domain.

For example, `decision-desk.contract.md` should include:

```text
Document header
Domain overview
Route-to-endpoint map
API endpoint contracts
DocType mapping
Field specifications
Validation rules
Workflow states
Role/permission rules
Upload/file rules
Notification triggers
Admin actions
Error states
Mock-to-real API mapping
QA checklist
Open items
Acceptance gate
```

---

## 3. Template Rules

All templates must follow these rules:

| Rule | Requirement |
|---|---|
| Use Markdown | All Phase 2 contract files should be `.md`. |
| Use consistent headings | Preserve section headings unless there is a strong reason to change them. |
| Use tables for structured contracts | APIs, fields, permissions, errors, and mappings should use tables. |
| Use code blocks for payloads | JSON, endpoint lists, routes, and state diagrams should use fenced code blocks. |
| Use canonical names | Follow `02-naming-conventions.md`. |
| Use standard response envelope | Follow `01-api-response-envelope-standard.md`. |
| Use standard error codes | Follow `07-error-catalogue.md`. |
| Mark uncertainty | Use `Draft`, `TBC`, or `Open Item` rather than pretending unfinished decisions are complete. |
| Avoid implementation guessing | Contract requirements should guide implementation, not fake it. |
| Make Phase 3 buildable | Every contract should be specific enough for Frappe build work. |

---

## 4. Contract Status Values

Use these status labels in every contract:

| Status | Meaning |
|---|---|
| Draft | Initial contract created, subject to change. |
| Pending UI Lock | Waiting for Phase 1 UI/UX completion. |
| Pending Backend Review | Needs Frappe/backend review. |
| Pending Product Review | Needs product/business approval. |
| Ready for Build | Contract is specific enough for Phase 3 implementation. |
| Implemented | Backend implementation exists. |
| Tested | QA tests confirm contract behaviour. |
| Deprecated | Contract replaced or no longer relevant. |

Recommended status line:

```md
| Status | Draft until Phase 1 UI/UX Completion |
```

---

# CORE DOCUMENT TEMPLATES

---

## 5. Standard Contract Header Template

Use this at the top of every Phase 2 contract document.

```md
# RBP Phase 2 Backend Contracts
# <DOCUMENT_NAME>.md

## Document Status

| Field | Value |
|---|---|
| Document | <Document Title> |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/<DOCUMENT_NAME>.md` |
| Intended Final Location | `rbp-platform/contracts/<path>/<filename>.md` |
| Primary Consumers | Product, frontend, Frappe backend, QA, admin operations |
```

---

## 6. Domain Contract Header Template

Use this for each product/domain contract.

```md
# RBP Phase 2 Backend Contracts
# <domain>.contract.md

## Document Status

| Field | Value |
|---|---|
| Document | <Domain Name> Backend Contract |
| Domain | <Domain Name> |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Frontend Source | `Uiuxdesignassistance` |
| Backend Target | `frappe-project / rbp_app` |
| Final Location | `rbp-platform/contracts/api/<domain>.contract.md` |
| Primary Consumers | Frontend, Frappe backend, QA, admin operations |
```

---

## 7. Domain Overview Template

```md
## 1. Domain Overview

| Field | Value |
|---|---|
| Domain Name | <Human-readable domain name> |
| Domain Slug | `<kebab-case-slug>` |
| Python Module | `rbp_app.api.<domain_module>` |
| Service Module | `rbp_app.services.<domain_module>` |
| Frontend Area | `<frontend route or feature area>` |
| Primary Users | <Roles/users> |
| Primary DocTypes | <DocTypes> |
| Requires Authentication | Yes / No / Conditional |
| Requires Membership | Yes / No / Conditional |
| Requires Payment | Yes / No / Conditional |
| Supports Uploads | Yes / No / Conditional |
| Has Workflow | Yes / No / Conditional |
| Has Admin Review | Yes / No / Conditional |

### Purpose

<Describe what this domain does and what backend capability is required.>

### Business Outcome

<Describe the business/user outcome this flow supports.>

### Backend Responsibilities

```text
- Create records
- Validate submitted data
- Enforce permissions
- Manage workflow state
- Attach files
- Record payment events, if applicable
- Trigger notifications
- Support admin actions
- Return safe frontend DTOs
```
```

---

## 8. Route-to-Endpoint Map Template

Use this to map frontend routes to backend APIs.

```md
## Route-to-Endpoint Map

| Frontend Route | Page / Component | User Type | Backend Endpoint | Method | Auth Required | Notes |
|---|---|---|---|---|---:|---|
| `/example/path` | `<ComponentName>` | Guest / Member / Admin | `/api/method/rbp_app.api.<domain>.<method>` | GET/POST | Yes/No | <Notes> |

### Route Notes

```text
- <Route-specific assumptions>
- <Mock service used during Phase 1>
- <Real API target for Phase 5>
```
```

### Example

```md
| `/on-demand/decision-desk` | `DecisionDeskPage` | Guest / Member | `/api/method/rbp_app.api.decision_desk.create_request` | POST | Yes | Creates request draft or submission |
```

---

## 9. API Endpoint Contract Template

Use this for every backend API endpoint.

```md
## API Contract: <method_name>

| Field | Value |
|---|---|
| Endpoint | `/api/method/rbp_app.api.<domain>.<method_name>` |
| Method | GET / POST |
| Purpose | <What this endpoint does> |
| Auth Required | Yes / No |
| Allowed Roles | <Roles> |
| Entitlement Required | Yes / No / `<entitlement_key>` |
| Payment Required | Yes / No / Conditional |
| Workflow Required | Yes / No |
| Creates DocType | <DocType or None> |
| Updates DocType | <DocType or None> |
| Returns | <DTO name> |
| Used By Routes | <Frontend routes> |

### Request Payload

```json
{
  "example_field": "example value"
}
```

### Request Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|
| `example_field` | string | Yes | Required, max 140 chars | Example field |

### Success Response

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

### Error Responses

| Error Code | HTTP | When |
|---|---:|---|
| `required` | 422 | Required field missing |
| `permission_denied` | 403 | User cannot perform action |
| `workflow_transition_denied` | 409 | Invalid workflow transition |

### Permission Rules

```text
- <Who can call this endpoint>
- <Tenant/ownership rules>
- <Assignment rules, if any>
```

### Workflow Rules

```text
- <Allowed source states>
- <Target state, if endpoint performs transition>
```

### Side Effects

```text
- Creates/updates DocType
- Creates audit log
- Triggers notification
- Records payment event
- Attaches file
```

### Open Items

| Item | Status | Notes |
|---|---|---|
| <Open question> | Draft | <Notes> |
```

---

## 10. API List Endpoint Template

Use this for APIs that return lists.

```md
## API Contract: list_<resources>

| Field | Value |
|---|---|
| Endpoint | `/api/method/rbp_app.api.<domain>.list_<resources>` |
| Method | GET |
| Purpose | List records visible to current user |
| Auth Required | Yes |
| Allowed Roles | <Roles> |
| Returns | Paginated list of `<DtoName>` |

### Query Parameters

| Parameter | Type | Required | Default | Notes |
|---|---|---:|---|---|
| `page` | integer | No | 1 | Page number |
| `page_size` | integer | No | 20 | Results per page |
| `status` | string | No | null | Filter by status |
| `workflow_state` | string | No | null | Filter by workflow state |
| `sort_by` | string | No | `created_on` | Sort field |
| `sort_order` | string | No | `desc` | `asc` or `desc` |

### Success Response

```json
{
  "ok": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 0,
      "total_pages": 0
    }
  },
  "message": "Records loaded",
  "errors": [],
  "meta": {
    "request_id": "uuid"
  }
}
```

### Server-Side Filtering Rules

```text
- Guest users must not access private lists.
- Customer users see only own/tenant-authorised records.
- Advisors see assigned records only.
- Admins see all operational records.
- Never return all records and expect frontend filtering.
```
```

---

## 11. DTO Template

Use this to define safe API response objects.

```md
## DTO: <DtoName>

### Purpose

<Describe what this DTO represents.>

### Fields

| Field | Type | Required | Visible To | Notes |
|---|---|---:|---|---|
| `name` | string | Yes | All authorised users | Record name |
| `status` | string | Yes | All authorised users | API status value |
| `workflow_state` | string | Conditional | All authorised users | Frappe workflow label |

### Example

```json
{
  "name": "RBP-XXX-0001",
  "status": "draft",
  "workflow_state": "Draft"
}
```

### Restricted Fields

These fields must not be returned to customer users:

```text
internal_notes
raw_payload
admin_only_fields
payment_provider_secrets
private_file_paths
```
```

---

# DOCTYPE AND FIELD TEMPLATES

---

## 12. DocType Contract Template

Use this for every Frappe DocType.

```md
## DocType Contract: <RBP DocType Name>

| Field | Value |
|---|---|
| DocType | `<RBP DocType Name>` |
| Type | Platform / Product / Operational / Child |
| Module | `rbp_app` |
| Has Workflow | Yes / No |
| Is Tenant-Scoped | Yes / No / Conditional |
| Supports Files | Yes / No |
| Supports Payment | Yes / No / Conditional |
| Customer Visible | Yes / No / Conditional |
| Admin Visible | Yes |
| Primary APIs | <API methods> |

### Purpose

<Describe what this DocType stores and why it exists.>

### Key Fields

| Fieldname | Label | Type | Required | Default | Notes |
|---|---|---|---:|---|---|
| `tenant` | Tenant | Link: RBP Tenant | Yes | None | Customer tenant |

### Relationships

```text
<RBP DocType Name>
  ├── <Related DocType>
  └── <Related DocType>
```

### Ownership Rules

```text
- <Who owns the record>
- <How tenant is resolved>
- <Who can view it>
```

### Permission Rules

| Role | Create | Read | Update | Submit | Delete/Admin |
|---|---:|---:|---:|---:|---:|
| Guest | No | No | No | No | No |
| RBP Member | Yes | Own/Tenant | Draft only | Yes | No |
| RBP Admin | Yes | All | All | Yes | Yes |

### Workflow

```text
Draft → Submitted → In Review → Closed
```

### Validation Rules

```text
- <Required fields>
- <Relationship consistency rules>
- <Workflow validation>
```

### Indexing

```text
tenant
owner
status
workflow_state
created_on
```

### Notes

```text
- <Implementation notes>
```
```

---

## 13. Field Specification Template

Use this for forms and DocType fields.

```md
## Field Specification: <Form or DocType Name>

| Fieldname | UI Label | Type | Required | Source | Backend Field | Validation | Notes |
|---|---|---|---:|---|---|---|---|
| `business_name` | Business Name | string | Yes | User input | `business_name` | Required, max 140 | Business/trading name |

### Field Rules

```text
- <Field-specific notes>
- <Fields editable by state>
- <Fields visible by role>
```

### Field Visibility by Role

| Field | Guest | Website User | RBP Member | Business Owner | Advisor | RBP Admin |
|---|---:|---:|---:|---:|---:|---:|
| `example_field` | No | Own | Own | Tenant | Assigned | All |

### Field Editability by Workflow State

| Field | Draft | Submitted | In Review | More Information Required | Closed |
|---|---:|---:|---:|---:|---:|
| `example_field` | Yes | No | No | Conditional | No |
```

---

## 14. Validation Rule Template

```md
## Validation Rules: <Domain/Form/DocType>

| Field | Rule | Error Code | Error Message | Applies When |
|---|---|---|---|---|
| `business_name` | Required | `required` | Business name is required. | Submit |
| `email` | Valid email | `invalid_email` | Email address is invalid. | Create / update |

### Cross-Field Validation

| Rule | Error Code | Message |
|---|---|---|
| `current_period_end` must be after `current_period_start` | `invalid_date` | End date must be after start date. |

### Submit Validation

```text
- Required fields complete
- Entitlement check passes
- Payment check passes, if applicable
- Upload requirements satisfied, if applicable
```

### Backend Validation Notes

```text
- Frontend may pre-validate.
- Backend remains authoritative.
- All validation errors must use standard error envelope.
```
```

---

# WORKFLOW, PERMISSION, AND ROLE TEMPLATES

---

## 15. Workflow Contract Template

```md
## Workflow Contract: <Domain / DocType>

| Field | Value |
|---|---|
| Workflow Name | `<Workflow Name>` |
| Applies To | `<DocType>` |
| Status Field | `workflow_state` |
| Has Payment Branch | Yes / No |
| Has More Information Branch | Yes / No |
| Has Admin Review | Yes / No |

### States

| State Label | API Value | Meaning | Owner of Next Action |
|---|---|---|---|
| Draft | `draft` | Record is editable but not submitted | Customer |

### Transitions

| From | To | Allowed Roles | Trigger / API | Notification | Audit Event |
|---|---|---|---|---|---|
| Draft | Submitted | RBP Member, Business Owner | `submit_<resource>` | `<domain>_submitted` | `record_submitted` |

### Field Editability by State

| Field Group | Draft | Submitted | In Review | More Information Required | Closed |
|---|---:|---:|---:|---:|---:|
| Customer fields | Yes | No | No | Conditional | No |
| Admin fields | Yes | Yes | Yes | Yes | Limited |
| Advisor fields | No | No | Assigned only | Assigned only | No |

### Workflow Error States

| Scenario | Error Code |
|---|---|
| Invalid transition | `workflow_transition_denied` |
| Record locked | `record_locked` |
| Missing submit fields | `validation_failed` |
```

---

## 16. Permission Contract Template

```md
## Permission Contract: <Domain / DocType>

### Permission Dimensions

```text
- Role
- Tenant
- Ownership
- Assignment
- Entitlement
- Workflow state
- File/payment/notification visibility
```

### Role Permission Matrix

| Role | Create | Read | Update | Submit | Admin Review | Notes |
|---|---:|---:|---:|---:|---:|---|
| Guest | No | Public only | No | No | No | Public pages only |
| Website User | Conditional | Own | Own draft | Conditional | No | Authenticated intake |
| RBP Member | Yes | Own/Tenant | Draft only | Yes | No | Entitlement required |
| RBP Business Owner | Yes | Tenant | Draft/tenant | Yes | No | Tenant authority |
| RBP Advisor | No | Assigned | Advisor fields | Conditional | No | Assignment required |
| RBP Admin | Yes | All | All | Yes | Yes | Operational admin |

### Access Rules

```text
- <Tenant rule>
- <Owner rule>
- <Assignment rule>
- <Entitlement rule>
- <Admin rule>
```

### Permission Errors

| Scenario | Error Code |
|---|---|
| Not logged in | `not_authenticated` |
| Missing role | `permission_denied` |
| Wrong tenant | `tenant_access_denied` |
| Missing entitlement | `entitlement_required` |
```

---

## 17. Role Access Template

```md
## Role Access: <Domain>

| Role | Domain Access | Notes |
|---|---|---|
| Guest | Public pages only | No private record access |
| Website User | Own drafts / onboarding | Conditional |
| RBP Member | Own/member service records | Requires entitlement |
| RBP Business Owner | Tenant records | Tenant authority |
| RBP Team Member | Shared/assigned tenant records | Conditional |
| RBP Advisor | Assigned records | No global tenant browsing |
| RBP Support Agent | Assigned/queue records | Conditional |
| RBP Admin | All operational records | Admin review |
```

---

# PAYMENT, FILE, NOTIFICATION, AND ADMIN TEMPLATES

---

## 18. Payment Contract Template

```md
## Payment Contract: <Domain / Flow>

| Field | Value |
|---|---|
| Payment Required | Yes / No / Conditional |
| Payment Timing | Before submit / After submit / Before fulfilment / Not applicable |
| Payment DocType | `RBP Payment Event` |
| Subscription DocType | `RBP Subscription`, if applicable |
| Entitlement DocType | `RBP App Entitlement`, if applicable |
| Payment Provider | TBC / Provider name |
| Supports Refund | Yes / No / Conditional |
| Supports Admin Waiver | Yes / No |

### Payment States

| State | API Value | Meaning | Workflow Effect |
|---|---|---|---|
| Not Required | `not_required` | No payment needed | Workflow proceeds |
| Pending | `pending` | Awaiting confirmation | Payment Pending |
| Paid | `paid` | Payment confirmed | Proceed |
| Failed | `failed` | Payment failed | Payment Failed |

### Payment Events

| Event Type | Trigger | Side Effects |
|---|---|---|
| `payment_paid` | Provider confirms success | Activate entitlement / advance workflow |
| `payment_failed` | Provider confirms failure | Block workflow / notify user |

### Payment Errors

| Scenario | Error Code |
|---|---|
| Payment required | `payment_required` |
| Payment failed | `payment_failed` |
| Duplicate webhook | `payment_webhook_duplicate` |

### Admin Reconciliation

```text
- <Allowed admin actions>
- <Required reason>
- <Audit event>
```
```

---

## 19. Upload / File Contract Template

```md
## Upload / File Contract: <Domain / Flow>

| Field | Value |
|---|---|
| Supports Uploads | Yes / No / Conditional |
| File DocType | `RBP File Reference` |
| Uses Frappe File | Yes |
| Default Visibility | `<visibility>` |
| Public Files Allowed | Yes / No / Conditional |
| Admin Approval Required for Public | Yes / No |

### Upload Fields

| UI Field | Backend Mapping | File Type | Required | Max Files | Max Size |
|---|---|---|---:|---:|---:|
| `supporting_documents_mock` | `RBP File Reference` | `supporting_document` | No | 10 | 25 MB |

### Allowed File Types

```text
.pdf
.docx
.xlsx
.jpg
.png
```

### Visibility Rules

| Visibility | Who Can View |
|---|---|
| `private_to_owner` | Owner and authorised admin |
| `tenant_visible` | Authorised tenant users |
| `advisor_visible` | Assigned advisor/support/admin |
| `admin_only` | Admin/system roles |
| `public` | Public users, only after approval |

### Workflow Upload Rules

| State | Customer Upload | Advisor Upload | Admin Upload |
|---|---:|---:|---:|
| Draft | Yes | No | Yes |
| Submitted | Conditional | Conditional | Yes |
| Closed | No | No | Admin only |

### File Errors

| Scenario | Error Code |
|---|---|
| File too large | `file_too_large` |
| Unsupported type | `unsupported_file_type` |
| Not allowed in state | `upload_not_allowed_in_state` |
| No access | `file_access_denied` |
```

---

## 20. Notification Trigger Template

```md
## Notification Triggers: <Domain>

| Trigger Key | Event | Recipient | Channel | Template | Required |
|---|---|---|---|---|---:|
| `<domain>_submitted` | Record submitted | User + Admin | Portal / Email | `<domain>.submitted` | Yes |

### Trigger Details: <trigger_key>

| Field | Value |
|---|---|
| Trigger | `<trigger_key>` |
| Source Event | <Workflow/API/Admin action> |
| Related DocType | `<DocType>` |
| Recipient | <User / role / tenant / admin> |
| Channel | Portal / Email / Admin / System |
| Template | `<template_key>` |
| Creates RBP Notification | Yes / No |
| Sends Email | Yes / No / Conditional |
| Audit Required | Yes / No |

### Notification Payload

```json
{
  "title": "Example notification",
  "message": "Example message",
  "related_doctype": "RBP Example",
  "related_name": "RBP-EX-0001"
}
```
```

---

## 21. Admin Action Template

```md
## Admin Action: <admin_action_name>

| Field | Value |
|---|---|
| API Endpoint | `/api/method/rbp_app.api.<domain>.admin_<action>` |
| Method | POST |
| Allowed Roles | RBP Admin, System Manager |
| Target DocType | `<DocType>` |
| Source States | <States> |
| Target State | <State, if transition> |
| Requires Reason | Yes / No |
| Triggers Notification | Yes / No |
| Creates Audit Log | Yes |
| Frontend Admin UI | <Route/component> |

### Request Payload

```json
{
  "record_name": "RBP-XXX-0001",
  "reason": "Reason text"
}
```

### Validation Rules

```text
- User must have admin authority.
- Target record must exist.
- Source workflow state must allow action.
- Required fields must be present.
- Tenant/record permissions must pass.
```

### Side Effects

```text
- Updates record
- Changes workflow state
- Sends notification
- Creates audit log
```

### Error Responses

| Scenario | Error Code |
|---|---|
| Non-admin user | `admin_action_denied` |
| Missing reason | `admin_action_requires_reason` |
| Invalid state | `admin_action_not_available` |
```

---

# ERROR AND MOCK MAPPING TEMPLATES

---

## 22. Error Contract Template

```md
## Error Contract: <Domain / API>

| Scenario | Error Code | HTTP | Field | User Message | Notes |
|---|---|---:|---|---|---|
| Required field missing | `required` | 422 | `<field>` | This field is required. | Validation |

### Example Error Response

```json
{
  "ok": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "example_field",
      "code": "required",
      "message": "Example field is required."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```
```

---

## 23. Mock-to-Real API Mapping Template

```md
## Mock-to-Real API Mapping

| Phase 1 Mock Service / Endpoint | Mock Method | Real API Endpoint | Real Method | Real DocType | Notes |
|---|---|---|---|---|---|
| `/mock/example/resource` | POST | `/api/method/rbp_app.api.<domain>.create_<resource>` | POST | `<RBP DocType>` | Replace in Phase 5 |

### Mock Fields to Backend Fields

| Mock Field | Backend Field / DocType | Notes |
|---|---|---|
| `supporting_documents_mock` | `RBP File Reference` | Replace mock array with upload references |
| `payment_method_mock` | `RBP Payment Event` / provider checkout | Replace simulated payment |

### Mock Status to Workflow Mapping

| Mock Status | Backend `status` | Backend `workflow_state` |
|---|---|---|
| `submitted` | `submitted` | Submitted |
| `in_review` | `in_review` | In Review |
```

---

## 24. Open Item Template

```md
## Open Items

| ID | Item | Owner | Status | Required Before | Notes |
|---|---|---|---|---|---|
| OI-001 | <Open question> | Product / Frontend / Backend / QA | Open | Phase 2 Sign-off | <Notes> |
```

Status values:

```text
Open
In Review
Resolved
Deferred
Blocked
```

---

## 25. Change Request Template

```md
## Contract Change Request

| Field | Value |
|---|---|
| Change ID | CCR-001 |
| Requested By |  |
| Date |  |
| Contract Affected |  |
| Current Requirement |  |
| Proposed Change |  |
| Reason |  |
| Affected Frontend Routes |  |
| Affected APIs |  |
| Affected DocTypes |  |
| Affected Workflows |  |
| Affected Permissions |  |
| Affected Tests |  |
| Backward Compatible | Yes / No |
| Approved By |  |
| Status | Draft / Approved / Rejected / Implemented |
```

---

# FULL DOMAIN CONTRACT TEMPLATE

---

## 26. Complete Domain Contract Skeleton

Copy this when starting a new domain contract.

```md
# RBP Phase 2 Backend Contracts
# <domain>.contract.md

## Document Status

| Field | Value |
|---|---|
| Document | <Domain Name> Backend Contract |
| Domain | <Domain Name> |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Frontend Source | `Uiuxdesignassistance` |
| Backend Target | `frappe-project / rbp_app` |
| Final Location | `rbp-platform/contracts/api/<domain>.contract.md` |
| Primary Consumers | Frontend, Frappe backend, QA, admin operations |

---

## 1. Domain Overview

| Field | Value |
|---|---|
| Domain Name |  |
| Domain Slug |  |
| Python Module |  |
| Service Module |  |
| Frontend Routes |  |
| Primary Users |  |
| Primary DocTypes |  |
| Requires Authentication |  |
| Requires Membership |  |
| Requires Payment |  |
| Supports Uploads |  |
| Has Workflow |  |
| Has Admin Review |  |

### Purpose

<TBC>

### Backend Responsibilities

```text
- TBC
```

---

## 2. Frontend Routes

| Frontend Route | Page / Component | User Type | Purpose | Mock Source | Backend Dependency |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

---

## 3. Route-to-Endpoint Map

| Frontend Route | Backend Endpoint | Method | Auth Required | Roles | Notes |
|---|---|---|---:|---|---|
|  |  |  |  |  |  |

---

## 4. API Contracts

### 4.1 API Contract: create_<resource>

| Field | Value |
|---|---|
| Endpoint | `/api/method/rbp_app.api.<domain>.create_<resource>` |
| Method | POST |
| Purpose |  |
| Auth Required |  |
| Allowed Roles |  |
| Entitlement Required |  |
| Payment Required |  |
| Creates DocType |  |
| Returns |  |

#### Request Payload

```json
{}
```

#### Request Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|
|  |  |  |  |  |

#### Success Response

```json
{
  "ok": true,
  "data": {},
  "message": "Created",
  "errors": [],
  "meta": {
    "request_id": "uuid"
  }
}
```

#### Error Responses

| Error Code | HTTP | When |
|---|---:|---|
|  |  |  |

---

## 5. DocType Mapping

| UI Object / Form | Backend DocType | Relationship | Notes |
|---|---|---|---|
|  |  |  |  |

---

## 6. Field Specifications

| UI Field | Backend Field | Type | Required | Editable States | Visible To | Validation |
|---|---|---|---:|---|---|---|
|  |  |  |  |  |  |  |

---

## 7. Validation Rules

| Field / Rule | Error Code | Applies On | Notes |
|---|---|---|---|
|  |  |  |  |

---

## 8. Workflow

### States

| State | API Value | Meaning | Owner of Next Action |
|---|---|---|---|
| Draft | `draft` |  |  |

### Transitions

| From | To | Allowed Roles | Trigger / API | Notification | Audit Event |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

---

## 9. Permissions

| Role | Create | Read | Update | Submit | Admin Review |
|---|---:|---:|---:|---:|---:|
| Guest |  |  |  |  |  |
| Website User |  |  |  |  |  |
| RBP Member |  |  |  |  |  |
| RBP Business Owner |  |  |  |  |  |
| RBP Team Member |  |  |  |  |  |
| RBP Advisor |  |  |  |  |  |
| RBP Support Agent |  |  |  |  |  |
| RBP Admin |  |  |  |  |  |

---

## 10. Payment Rules

| Field | Value |
|---|---|
| Payment Required |  |
| Payment Timing |  |
| Payment States Used |  |
| Payment Event Link |  |
| Entitlement Impact |  |

---

## 11. Upload / File Rules

| Field | Value |
|---|---|
| Supports Uploads |  |
| Default Visibility |  |
| Allowed File Types |  |
| Max Files |  |
| Max Size |  |

---

## 12. Notification Triggers

| Trigger | Event | Recipient | Channel | Required |
|---|---|---|---|---:|
|  |  |  |  |  |

---

## 13. Admin Actions

| Action | Endpoint | Allowed Roles | Source State | Target State | Notification | Audit |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

---

## 14. Error Catalogue

| Scenario | Error Code | HTTP | Field | Notes |
|---|---|---:|---|---|
|  |  |  |  |  |

---

## 15. Mock-to-Real Mapping

| Mock Endpoint / Service | Real Endpoint | Real DocType | Notes |
|---|---|---|---|
|  |  |  |  |

| Mock Field | Real Field / DocType | Notes |
|---|---|---|
|  |  |  |

---

## 16. QA Requirements

```text
- TBC
```

---

## 17. Open Items

| ID | Item | Owner | Status | Required Before | Notes |
|---|---|---|---|---|---|
| OI-001 |  |  | Open | Phase 2 Sign-off |  |

---

## 18. Acceptance Criteria

This domain contract is ready for Phase 3 build when:

```text
Every route is mapped to an endpoint.
Every form field is mapped to a backend field.
Every API has payload and response definitions.
Every DocType is identified.
Every workflow state and transition is defined.
Every role permission is defined.
Every upload rule is defined.
Every payment rule is defined.
Every notification trigger is defined.
Every admin action is defined.
Every error state uses the standard Error Catalogue.
Every mock service has a real API target.
QA tests can be written from this contract.
```
```

---

# QA AND ACCEPTANCE TEMPLATES

---

## 27. QA Checklist Template

```md
## QA Checklist: <Domain>

### API Tests

```text
test_create_<resource>_success
test_create_<resource>_validation_error
test_get_<resource>_success
test_get_<resource>_permission_denied
test_list_my_<resources>_tenant_scoped
```

### Permission Tests

```text
test_guest_cannot_access_private_<resource>
test_member_can_access_own_<resource>
test_member_cannot_access_other_tenant_<resource>
test_admin_can_access_all_<resource>
```

### Workflow Tests

```text
test_draft_can_be_submitted
test_submitted_cannot_be_edited_by_customer
test_admin_can_move_to_in_review
test_invalid_transition_denied
```

### File Tests

```text
test_upload_allowed_in_draft
test_upload_blocked_in_closed
test_private_file_access_denied_to_other_user
```

### Payment Tests

```text
test_payment_required_blocks_submit
test_payment_success_advances_workflow
test_payment_failed_sets_payment_failed_state
```

### Error Envelope Tests

```text
test_error_response_has_standard_envelope
test_validation_error_uses_error_catalogue
```
```

---

## 28. Acceptance Gate Template

```md
## Acceptance Gate: <Contract / Domain>

This contract is complete only when:

```text
All routes are documented.
All APIs are documented.
All request payloads are documented.
All response DTOs are documented.
All error responses are documented.
All DocTypes are mapped.
All fields are specified.
All validation rules are defined.
All workflow states are defined.
All permissions are defined.
All payment rules are defined.
All file/upload rules are defined.
All notifications are defined.
All admin actions are defined.
All mock-to-real mappings are defined.
All QA requirements are defined.
All open items are either resolved or explicitly deferred.
```

### Sign-Off

| Role | Name | Date | Status |
|---|---|---|---|
| Product |  |  | Pending |
| Frontend |  |  | Pending |
| Backend / Frappe |  |  | Pending |
| QA |  |  | Pending |
| Admin / Operations |  |  | Pending |
```

---

## 29. Phase 2 Final Sign-Off Template

```md
# Phase 2 Final Sign-Off

## Summary

| Field | Value |
|---|---|
| Phase | Phase 2: Backend Contract Planning |
| Status | Pending / Approved |
| Date |  |
| Approved By |  |

## Required Deliverables

| Deliverable | File | Status |
|---|---|---|
| API response envelope standard | `01-api-response-envelope-standard.md` |  |
| Naming conventions | `02-naming-conventions.md` |  |
| Role matrix | `03-role-matrix.md` |  |
| Permission model | `04-permission-model-draft.md` |  |
| Core DocType model | `05-core-doctype-model.md` |  |
| Workflow state standards | `06-workflow-state-standards.md` |  |
| Error catalogue | `07-error-catalogue.md` |  |
| Payment state model | `08-payment-state-model.md` |  |
| Upload/file rules | `09-upload-file-rules.md` |  |
| Contract templates | `10-contract-templates.md` |  |
| Route-to-endpoint map | `11-route-to-endpoint-map.md` |  |
| Form field specifications | `12-form-field-specifications.md` |  |
| Validation rules | `13-validation-rules.md` |  |
| Notification triggers | `14-notification-triggers.md` |  |
| Admin actions | `15-admin-actions.md` |  |
| Mock-to-real API map | `16-mock-to-real-api-map.md` |  |
| Phase 2 acceptance gate | `17-phase-2-acceptance-gate.md` |  |

## Final Gate

Phase 2 is complete only when:

```text
Every Phase 1 screen has mapped backend requirements.
Every form has field definitions.
Every product flow has API contracts.
Every workflow has state definitions.
Every role has permissions defined.
Every upload has storage/ownership rules.
Every payment touchpoint has state handling.
Every mock API has a real Frappe endpoint target.
Frappe build can begin without guessing.
```

## Approval

| Area | Approver | Status | Notes |
|---|---|---|---|
| Product |  | Pending |  |
| Frontend |  | Pending |  |
| Backend / Frappe |  | Pending |  |
| QA |  | Pending |  |
| Operations/Admin |  | Pending |  |
```

---

## 30. Template Completion Checklist

This template pack is complete when it includes:

```text
Standard contract header template.
Domain contract header template.
Domain overview template.
Route-to-endpoint map template.
API endpoint contract template.
API list endpoint template.
DTO template.
DocType contract template.
Field specification template.
Validation rule template.
Workflow contract template.
Permission contract template.
Role access template.
Payment contract template.
Upload/file contract template.
Notification trigger template.
Admin action template.
Error contract template.
Mock-to-real API mapping template.
Open item template.
Change request template.
Complete domain contract skeleton.
QA checklist template.
Acceptance gate template.
Phase 2 final sign-off template.
```

---

## 31. Phase 2 Usage Rule

Every Phase 2 domain contract must be traceable from:

```text
Frontend route
→ user action
→ API endpoint
→ request payload
→ validation rule
→ permission rule
→ DocType
→ workflow state
→ notification trigger
→ admin action
→ error response
→ QA test
```

If a contract section cannot trace that path, it is incomplete.

Not “almost done.” Not “good enough for now.” Incomplete. A small word doing heroic work.
