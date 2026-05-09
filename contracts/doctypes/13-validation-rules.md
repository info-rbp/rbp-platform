# RBP Phase 2 Backend Contracts
# 13-validation-rules.md

## Document Status

| Field | Value |
|---|---|
| Document | Final Validation Rules |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Ready for backend review |
| Generated | 2026-05-07 |
| Source Repository | `info-rbp/Uiuxdesignassistance` |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/13-validation-rules.md` |
| Intended Final Location | `rbp-platform/contracts/validation/validation-rules.md` |

## Repository Review Basis

This file was generated after reviewing the connected `info-rbp/Uiuxdesignassistance` repository.

Key repository facts used:

```text
- `src/app/routes.tsx` contains the live React route tree.
- `src/app/config/routes.registry.ts` is a Phase 1 route registry and explicitly says it supports later backend contract mapping.
- `docs/ui/route-audit.md` lists route groups, access types, mock data, mock service needs, confirmation/status states, and build risk.
- `docs/phase-1-exclusions.md` confirms Phase 1 intentionally excluded real Frappe APIs, real payment processing, real file upload persistence, real auth, real notification delivery, and real admin permissions.
- `docs/phase-1-definition-of-done.md` defines the intended completed mock flows and required Phase 1 states.
- Current product pages include a mix of placeholder/public service pages and one more concrete portal request form. Where a field is not literally present in the code but is required by the Phase 1 completion gate and previous Phase 2 planning, it is marked as `contract-required`.
```

### Source Confidence Labels

| Label | Meaning |
|---|---|
| `repo-observed` | Directly visible in the reviewed repository source. |
| `route-audit-observed` | Present in the route audit or route registry. |
| `definition-of-done-required` | Required by the Phase 1 definition of done. |
| `contract-required` | Required for Phase 2 backend buildability even if the current UI source still uses placeholders. |
| `phase-3-target` | Intended Frappe backend target for implementation. |


## 1. Purpose

This document defines backend validation rules for the fields and flows mapped in `12-form-field-specifications.md`.

The repository shows local frontend validation in the portal service request: service selection is required and business context must be at least 20 characters. Backend validation must preserve that and expand it across the Frappe contracts. Because trusting only the browser is security theatre with nicer fonts.

---

## 2. Global Validation Rules

| Rule | Error Code | Applies To | Notes |
|---|---|---|---|
| Required field missing | `required` | All required fields | Must return field-specific error |
| Invalid selection | `invalid_selection` | Select/radio fields | Backend allowed values are authoritative |
| Invalid email | `invalid_email` | Email fields | Standard email format |
| Invalid phone | `invalid_phone` | Phone fields | Country-aware validation later |
| Invalid date | `invalid_date` | Deadline/date fields | Must parse and be logical |
| Date in past | `date_in_past` | Future deadlines | Use where deadline cannot be historical |
| Text too short | `too_short` | Minimum text fields | Portal context currently uses min 20 chars |
| Text too long | `too_long` | Long text fields | Backend limit required |
| Invalid file type | `unsupported_file_type` | Uploads | See upload rules |
| File too large | `file_too_large` | Uploads | See upload rules |
| Max files exceeded | `max_files_exceeded` | Uploads | See upload rules |
| Entitlement missing | `entitlement_required` | Member-only services | Server-side only |
| Payment required | `payment_required` | Paid flows | Server-side only |
| Workflow transition invalid | `workflow_transition_denied` | Submit/admin transitions | Server-side only |
| Tenant mismatch | `tenant_access_denied` | Tenant records | Must not leak cross-tenant data |

---

## 3. Field-Level Validation by Domain

### Membership

| Field | Validation Rule | Error Code | Applies On |
|---|---|---|---|
| `selected_plan` | required | `required` | Create / update / submit |
| `billing_cycle` | required, allowed value | `invalid_selection` | Create / update / submit |
| `business_name` | required, max length | `required` | Create / update / submit |
| `business_identifier` | format by jurisdiction | `invalid_value` | Create / update / submit |
| `industry` | allowed value | `invalid_selection` | Create / update / submit |
| `business_size` | allowed value | `invalid_selection` | Create / update / submit |
| `primary_contact_name` | required | `required` | Create / update / submit |
| `email` | required, email | `invalid_email` | Create / update / submit |
| `phone` | phone format | `invalid_phone` | Create / update / submit |
| `billing_address` | required if live billing | `required` | Create / update / submit |
| `payment_method` | required if payment required | `required` | Create / update / submit |
| `accepted_terms` | must be true | `invalid_value` | Create / update / submit |
| `marketing_consent` | boolean | `invalid_value` | Create / update / submit |

#### Submit Validation

```text
- Resolve current user and tenant.
- Validate required fields.
- Validate entitlement for `membership` where required.
- Validate payment requirement where applicable.
- Validate upload/file rules where applicable.
- Lock customer-editable fields after successful submit.
- Move workflow to the correct submitted/payment state.
```

### Decision Desk

| Field | Validation Rule | Error Code | Applies On |
|---|---|---|---|
| `decision_title` | required | `required` | Create / update / submit |
| `decision_category` | allowed value | `invalid_selection` | Create / update / submit |
| `decision_summary` | required, min length | `required` | Create / update / submit |
| `urgency` | low/normal/high/urgent | `invalid_selection` | Create / update / submit |
| `deadline` | valid date | `invalid_date` | Create / update / submit |
| `business_context` | required, min 20 chars | `required` | Create / update / submit |
| `options_considered` | optional until final UI decides | `invalid_value` | Create / update / submit |
| `constraints` | max length | `invalid_value` | Create / update / submit |
| `desired_outcome` | max length | `invalid_value` | Create / update / submit |
| `supporting_documents` | allowed type/size/count | `invalid_selection` | Create / update / submit |
| `preferred_contact_method` | email/phone/video/no_pref | `invalid_email` | Create / update / submit |

#### Submit Validation

```text
- Resolve current user and tenant.
- Validate required fields.
- Validate entitlement for `decision_desk` where required.
- Validate payment requirement where applicable.
- Validate upload/file rules where applicable.
- Lock customer-editable fields after successful submit.
- Move workflow to the correct submitted/payment state.
```

### DocuShare / Document Nucleus

| Field | Validation Rule | Error Code | Applies On |
|---|---|---|---|
| `document_type` | required | `required` | Create / update / submit |
| `document_category` | required | `required` | Create / update / submit |
| `selected_format` | allowed document format | `invalid_selection` | Create / update / submit |
| `business_context` | required before submit | `required` | Create / update / submit |
| `jurisdiction` | required where legal/compliance doc | `invalid_selection` | Create / update / submit |
| `intended_use` | max length | `invalid_value` | Create / update / submit |
| `required_sections` | section list | `invalid_value` | Create / update / submit |
| `reference_files` | allowed type/size/count | `invalid_selection` | Create / update / submit |
| `deadline` | valid date | `invalid_date` | Create / update / submit |
| `review_required` | boolean | `invalid_value` | Create / update / submit |

#### Submit Validation

```text
- Resolve current user and tenant.
- Validate required fields.
- Validate entitlement for `docushare` where required.
- Validate payment requirement where applicable.
- Validate upload/file rules where applicable.
- Lock customer-editable fields after successful submit.
- Move workflow to the correct submitted/payment state.
```

### Marketplace

| Field | Validation Rule | Error Code | Applies On |
|---|---|---|---|
| `listing_title` | required | `required` | Create / update / submit |
| `listing_category` | required | `required` | Create / update / submit |
| `description` | required | `required` | Create / update / submit |
| `price` | valid amount or price label | `invalid_value` | Create / update / submit |
| `currency` | currency code | `invalid_value` | Create / update / submit |
| `location` | optional | `invalid_value` | Create / update / submit |
| `media` | public only after approval | `unsupported_file_type` | Create / update / submit |
| `seller_contact` | required for third-party listing | `required` | Create / update / submit |
| `listing_fee` | if fee applies | `invalid_value` | Create / update / submit |
| `buyer_enquiry_message` | required for enquiry | `required` | Create / update / submit |

#### Submit Validation

```text
- Resolve current user and tenant.
- Validate required fields.
- Validate entitlement for `marketplace` where required.
- Validate payment requirement where applicable.
- Validate upload/file rules where applicable.
- Lock customer-editable fields after successful submit.
- Move workflow to the correct submitted/payment state.
```

### Connectivity / NBN

| Field | Validation Rule | Error Code | Applies On |
|---|---|---|---|
| `service_address` | required | `required` | Create / update / submit |
| `service_type` | connectivity/nbn_phone/superloop | `invalid_phone` | Create / update / submit |
| `selected_plan` | required | `required` | Create / update / submit |
| `hardware_option` | allowed value | `invalid_selection` | Create / update / submit |
| `installation_preference` | allowed value | `invalid_selection` | Create / update / submit |
| `contact_details` | email/phone required | `invalid_email` | Create / update / submit |
| `payment_method` | if payment required | `required` | Create / update / submit |
| `serviceability_status` | serviceable/not_serviceable/manual_review | `invalid_selection` | Create / update / submit |
| `order_status` | workflow-derived | `invalid_value` | Create / update / submit |

#### Submit Validation

```text
- Resolve current user and tenant.
- Validate required fields.
- Validate entitlement for `connectivity` where required.
- Validate payment requirement where applicable.
- Validate upload/file rules where applicable.
- Lock customer-editable fields after successful submit.
- Move workflow to the correct submitted/payment state.
```

### Risk Advisor

| Field | Validation Rule | Error Code | Applies On |
|---|---|---|---|
| `business_name` | required | `required` | Create / update / submit |
| `industry` | allowed value | `invalid_selection` | Create / update / submit |
| `risk_categories` | at least one | `invalid_value` | Create / update / submit |
| `current_controls` | max length | `invalid_value` | Create / update / submit |
| `known_incidents` | max length | `invalid_value` | Create / update / submit |
| `compliance_requirements` | max length | `invalid_value` | Create / update / submit |
| `risk_appetite` | low/medium/high | `invalid_selection` | Create / update / submit |
| `assessment_answers` | required before submit | `required` | Create / update / submit |
| `mock_score` | 0-100 | `out_of_range` | Create / update / submit |

#### Submit Validation

```text
- Resolve current user and tenant.
- Validate required fields.
- Validate entitlement for `risk_advisor` where required.
- Validate payment requirement where applicable.
- Validate upload/file rules where applicable.
- Lock customer-editable fields after successful submit.
- Move workflow to the correct submitted/payment state.
```

### The Fixer

| Field | Validation Rule | Error Code | Applies On |
|---|---|---|---|
| `issue_title` | required | `required` | Create / update / submit |
| `issue_description` | required | `required` | Create / update / submit |
| `urgency` | low/normal/high/urgent | `invalid_selection` | Create / update / submit |
| `business_impact` | required if urgent | `required` | Create / update / submit |
| `desired_resolution` | max length | `invalid_value` | Create / update / submit |
| `scope_constraints` | max length | `invalid_value` | Create / update / submit |
| `supporting_documents` | allowed type/size/count | `invalid_selection` | Create / update / submit |
| `preferred_contact_method` | email/phone/video/no_pref | `invalid_email` | Create / update / submit |

#### Submit Validation

```text
- Resolve current user and tenant.
- Validate required fields.
- Validate entitlement for `fixer` where required.
- Validate payment requirement where applicable.
- Validate upload/file rules where applicable.
- Lock customer-editable fields after successful submit.
- Move workflow to the correct submitted/payment state.
```

### Portal / Dashboard

| Field | Validation Rule | Error Code | Applies On |
|---|---|---|---|
| `active_services` | tenant scoped | `invalid_value` | Create / update / submit |
| `pending_requests` | tenant scoped | `invalid_value` | Create / update / submit |
| `documents` | visibility scoped | `invalid_value` | Create / update / submit |
| `action_items` | tenant/user scoped | `invalid_selection` | Create / update / submit |
| `recent_activity` | safe visibility | `invalid_value` | Create / update / submit |
| `upcoming_sessions` | safe visibility | `invalid_value` | Create / update / submit |
| `consultant` | safe visibility | `invalid_value` | Create / update / submit |
| `notifications` | recipient scoped | `invalid_value` | Create / update / submit |

#### Submit Validation

```text
- Resolve current user and tenant.
- Validate required fields.
- Validate entitlement for `portal` where required.
- Validate payment requirement where applicable.
- Validate upload/file rules where applicable.
- Lock customer-editable fields after successful submit.
- Move workflow to the correct submitted/payment state.
```

---

## 4. Cross-Field Validation

| Rule | Applies To | Error Code |
|---|---|---|
| `current_period_end` must be after `current_period_start` | Membership subscription | `invalid_date` |
| `deadline` must be future or explicitly allowed | Decision Desk, DocuShare, Fixer | `date_in_past` |
| Payment amount requires currency | Paid flows | `invalid_currency` |
| Payment status cannot be set by customer payload | Paid flows | `field_permission_denied` |
| Public marketplace media requires published listing or admin approval | Marketplace | `public_file_requires_approval` |
| Advisor-only outcome fields require assigned advisor/admin | Advisory workflows | `advisor_access_required` |
| Admin action reason required for reject/cancel/archive | Admin actions | `admin_action_requires_reason` |
| Team member actions require tenant policy | Portal/team flows | `team_access_denied` |

---

## 5. Validation Response Shape

All validation failures must use the standard envelope:

```json
{
  "ok": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "business_context",
      "code": "too_short",
      "message": "Please provide at least 20 characters of context."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

---

## 6. Phase 3 Build Requirements

```text
Frontend validation may improve user experience.
Frappe service-layer validation is mandatory.
DocType validation should enforce required field and relationship rules.
API validation should reject forbidden customer-controlled fields.
Workflow validation should block invalid state changes.
Validation tests must assert error code and field name.
```
