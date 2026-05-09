# RBP Phase 2 Backend Contracts
# 14-notification-triggers.md

## Document Status

| Field | Value |
|---|---|
| Document | Final Notification Trigger Map |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Ready for backend review |
| Generated | 2026-05-07 |
| Source Repository | `info-rbp/Uiuxdesignassistance` |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/14-notification-triggers.md` |
| Intended Final Location | `rbp-platform/contracts/notifications/notification-triggers.md` |

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

This document defines when the platform should create `RBP Notification` records and, where appropriate, send email or admin notifications.

Phase 1 deliberately excluded real notification delivery and allowed only mock notification records. This contract turns the mock status moments into real backend triggers.

---

## 2. Notification Trigger Table

| Trigger Key | Domain | Source Event | Recipient | Channel | Required |
|---|---|---|---|---|---|
| `membership_draft_created` | Membership | Draft created | User | Portal | No |
| `membership_submitted` | Membership | Record submitted | User + RBP Admin | Portal / Email | Yes |
| `membership_in_review` | Membership | Admin begins review | User optional | Portal | Conditional |
| `membership_assigned` | Membership | Advisor/support assigned | Assigned user + user optional | Portal / Email | Yes |
| `membership_more_information_requested` | Membership | More information required | User / Business Owner | Portal / Email | Yes |
| `membership_outcome_ready` | Membership | Outcome/recommendation ready | User / Business Owner | Portal / Email | Yes |
| `membership_closed` | Membership | Record closed | User / Business Owner | Portal | Conditional |
| `membership_rejected` | Membership | Record rejected | User / Business Owner | Portal / Email | Yes |
| `decision_desk_draft_created` | Decision Desk | Draft created | User | Portal | No |
| `decision_desk_submitted` | Decision Desk | Record submitted | User + RBP Admin | Portal / Email | Yes |
| `decision_desk_in_review` | Decision Desk | Admin begins review | User optional | Portal | Conditional |
| `decision_desk_assigned` | Decision Desk | Advisor/support assigned | Assigned user + user optional | Portal / Email | Yes |
| `decision_desk_more_information_requested` | Decision Desk | More information required | User / Business Owner | Portal / Email | Yes |
| `decision_desk_outcome_ready` | Decision Desk | Outcome/recommendation ready | User / Business Owner | Portal / Email | Yes |
| `decision_desk_closed` | Decision Desk | Record closed | User / Business Owner | Portal | Conditional |
| `decision_desk_rejected` | Decision Desk | Record rejected | User / Business Owner | Portal / Email | Yes |
| `docushare_draft_created` | DocuShare / Document Nucleus | Draft created | User | Portal | No |
| `docushare_submitted` | DocuShare / Document Nucleus | Record submitted | User + RBP Admin | Portal / Email | Yes |
| `docushare_in_review` | DocuShare / Document Nucleus | Admin begins review | User optional | Portal | Conditional |
| `docushare_assigned` | DocuShare / Document Nucleus | Advisor/support assigned | Assigned user + user optional | Portal / Email | Yes |
| `docushare_more_information_requested` | DocuShare / Document Nucleus | More information required | User / Business Owner | Portal / Email | Yes |
| `docushare_outcome_ready` | DocuShare / Document Nucleus | Outcome/recommendation ready | User / Business Owner | Portal / Email | Yes |
| `docushare_closed` | DocuShare / Document Nucleus | Record closed | User / Business Owner | Portal | Conditional |
| `docushare_rejected` | DocuShare / Document Nucleus | Record rejected | User / Business Owner | Portal / Email | Yes |
| `marketplace_draft_created` | Marketplace | Draft created | User | Portal | No |
| `marketplace_submitted` | Marketplace | Record submitted | User + RBP Admin | Portal / Email | Yes |
| `marketplace_in_review` | Marketplace | Admin begins review | User optional | Portal | Conditional |
| `marketplace_assigned` | Marketplace | Advisor/support assigned | Assigned user + user optional | Portal / Email | Yes |
| `marketplace_more_information_requested` | Marketplace | More information required | User / Business Owner | Portal / Email | Yes |
| `marketplace_outcome_ready` | Marketplace | Outcome/recommendation ready | User / Business Owner | Portal / Email | Yes |
| `marketplace_closed` | Marketplace | Record closed | User / Business Owner | Portal | Conditional |
| `marketplace_rejected` | Marketplace | Record rejected | User / Business Owner | Portal / Email | Yes |
| `connectivity_draft_created` | Connectivity / NBN | Draft created | User | Portal | No |
| `connectivity_submitted` | Connectivity / NBN | Record submitted | User + RBP Admin | Portal / Email | Yes |
| `connectivity_in_review` | Connectivity / NBN | Admin begins review | User optional | Portal | Conditional |
| `connectivity_assigned` | Connectivity / NBN | Advisor/support assigned | Assigned user + user optional | Portal / Email | Yes |
| `connectivity_more_information_requested` | Connectivity / NBN | More information required | User / Business Owner | Portal / Email | Yes |
| `connectivity_outcome_ready` | Connectivity / NBN | Outcome/recommendation ready | User / Business Owner | Portal / Email | Yes |
| `connectivity_closed` | Connectivity / NBN | Record closed | User / Business Owner | Portal | Conditional |
| `connectivity_rejected` | Connectivity / NBN | Record rejected | User / Business Owner | Portal / Email | Yes |
| `risk_advisor_draft_created` | Risk Advisor | Draft created | User | Portal | No |
| `risk_advisor_submitted` | Risk Advisor | Record submitted | User + RBP Admin | Portal / Email | Yes |
| `risk_advisor_in_review` | Risk Advisor | Admin begins review | User optional | Portal | Conditional |
| `risk_advisor_assigned` | Risk Advisor | Advisor/support assigned | Assigned user + user optional | Portal / Email | Yes |
| `risk_advisor_more_information_requested` | Risk Advisor | More information required | User / Business Owner | Portal / Email | Yes |
| `risk_advisor_outcome_ready` | Risk Advisor | Outcome/recommendation ready | User / Business Owner | Portal / Email | Yes |
| `risk_advisor_closed` | Risk Advisor | Record closed | User / Business Owner | Portal | Conditional |
| `risk_advisor_rejected` | Risk Advisor | Record rejected | User / Business Owner | Portal / Email | Yes |
| `fixer_draft_created` | The Fixer | Draft created | User | Portal | No |
| `fixer_submitted` | The Fixer | Record submitted | User + RBP Admin | Portal / Email | Yes |
| `fixer_in_review` | The Fixer | Admin begins review | User optional | Portal | Conditional |
| `fixer_assigned` | The Fixer | Advisor/support assigned | Assigned user + user optional | Portal / Email | Yes |
| `fixer_more_information_requested` | The Fixer | More information required | User / Business Owner | Portal / Email | Yes |
| `fixer_outcome_ready` | The Fixer | Outcome/recommendation ready | User / Business Owner | Portal / Email | Yes |
| `fixer_closed` | The Fixer | Record closed | User / Business Owner | Portal | Conditional |
| `fixer_rejected` | The Fixer | Record rejected | User / Business Owner | Portal / Email | Yes |
| `payment_pending` | Billing | Payment started but not confirmed | User | Portal / Email | Conditional |
| `payment_confirmed` | Billing | Payment confirmed | User + admin optional | Portal / Email | Yes |
| `payment_failed` | Billing | Payment failed | User + billing/admin | Portal / Email | Yes |
| `subscription_renewed` | Membership | Subscription renewed | User / Business Owner | Portal / Email | Yes |
| `file_uploaded` | Files | Customer uploaded a file | Admin/support optional | Portal | Conditional |
| `file_quarantined` | Files | File quarantined | Admin/security | Admin | Yes |

---

## 3. Trigger-to-Workflow Mapping

| Workflow Transition | Trigger Pattern | Notes |
|---|---|---|
| Draft → Submitted | `<domain>_submitted` | Must notify user and admin/support queue. |
| Submitted → In Review | `<domain>_in_review` | Optional user notification; required admin status update. |
| In Review → Assigned | `<domain>_assigned` | Must notify assigned advisor/support; user optional. |
| Any active state → More Information Required | `<domain>_more_information_requested` | Must notify user with requested fields/files. |
| In Progress → Outcome Ready | `<domain>_outcome_ready` | Must notify user. |
| Outcome Ready → Closed | `<domain>_closed` | Portal notification usually enough. |
| Any active state → Rejected | `<domain>_rejected` | Must notify user with safe reason. |
| Payment Pending → Payment Failed | `payment_failed` | Must notify user and billing/admin. |
| Payment Pending → Paid | `payment_confirmed` | Must notify user and activate next workflow action. |
| File uploaded during review | `file_uploaded` or `more_information_file_uploaded` | Notify assigned internal user if action is needed. |

---

## 4. Notification Payload Contract

```json
{
  "tenant": "RBP-TENANT-0001",
  "recipient_user": "user@example.com",
  "recipient_role": null,
  "notification_type": "decision_desk_submitted",
  "title": "Decision Desk request submitted",
  "message": "Your request has been submitted and is awaiting review.",
  "related_doctype": "RBP Decision Desk Request",
  "related_name": "RBP-DDR-0001",
  "channel": "portal",
  "status": "unread"
}
```

---

## 5. Recipient Rules

| Recipient Type | Rule |
|---|---|
| User/customer | Must be owner or authorised tenant user. |
| Business Owner | Tenant-level records and billing/subscription events. |
| Advisor | Assigned records only. |
| Support Agent | Assigned/queue records only. |
| RBP Admin | Operational queues, admin review, payment/file/security events. |
| System Manager | System errors, webhook failures, security/file quarantine events. |

---

## 6. Security Rules

```text
Do not expose internal notes in customer notifications.
Do not expose raw payment payloads.
Do not reveal cross-tenant record existence.
Do not send public file URLs for private files.
Do not send admin-only file links to customer users.
Notifications must be permission-safe when opened from portal routes.
```

---

## 7. Phase 3 Build Requirements

```text
Create RBP Notification records server-side.
Trigger notifications from service-layer workflow/payment/file/admin events.
Store related_doctype and related_name where relevant.
Support unread/read/archive status.
Provide list_my_notifications endpoint.
Support mark_read endpoint.
Add backend tests for each required trigger.
```
