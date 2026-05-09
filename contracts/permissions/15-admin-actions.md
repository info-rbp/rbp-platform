# RBP Phase 2 Backend Contracts
# 15-admin-actions.md

## Document Status

| Field | Value |
|---|---|
| Document | Final Admin Action Map |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Ready for backend review |
| Generated | 2026-05-07 |
| Source Repository | `info-rbp/Uiuxdesignassistance` |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/15-admin-actions.md` |
| Intended Final Location | `rbp-platform/contracts/admin/admin-actions.md` |

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

This document defines the backend admin actions required by the Phase 1 admin concepts.

The repository has `AdminCrudPage` and `adminContentModel` scaffolds showing admin records, backend-required flags, public route mappings, statuses, and future CRUD wiring. The contract below turns those admin mock buttons into explicit Frappe admin APIs. Tiny miracle: the “Edit” button must now mean something.

---

## 2. Admin Action Table

| Admin Area | API Method | Target DocType | Allowed Source State | Target State / Effect | Notification |
|---|---|---|---|---|---|
| `/admin/membership` | `/api/method/rbp_app.api.membership.admin_activate_subscription` | RBP Subscription | Pending/Paid | Active | `subscription_active` |
| `/admin/membership` | `/api/method/rbp_app.api.membership.admin_suspend_subscription` | RBP Subscription | Active/Past Due | Suspended | `subscription_suspended` |
| `/admin/membership` | `/api/method/rbp_app.api.membership.admin_cancel_subscription` | RBP Subscription | Active/Past Due/Suspended | Cancelled | `subscription_cancelled` |
| `/admin/membership` | `/api/method/rbp_app.api.entitlements.admin_grant_entitlement` | RBP App Entitlement | Any | Active | `entitlement_activated` |
| `/admin/membership` | `/api/method/rbp_app.api.entitlements.admin_revoke_entitlement` | RBP App Entitlement | Active/Suspended | Revoked | `entitlement_revoked` |
| `/admin/on-demand/decision-desk` | `/api/method/rbp_app.api.decision_desk.admin_assign_advisor` | RBP Decision Desk Request | In Review/Submitted | Assigned | `advisor_assigned` |
| `/admin/on-demand/decision-desk` | `/api/method/rbp_app.api.decision_desk.admin_request_more_information` | RBP Decision Desk Request | Submitted/In Review/Assigned/In Progress | More Information Required | `more_information_requested` |
| `/admin/on-demand/decision-desk` | `/api/method/rbp_app.api.decision_desk.admin_reject_request` | RBP Decision Desk Request | Submitted/In Review | Rejected | `decision_desk_rejected` |
| `/admin/on-demand/decision-desk` | `/api/method/rbp_app.api.decision_desk.admin_close_request` | RBP Decision Desk Request | Outcome Ready/In Progress | Closed | `decision_desk_closed` |
| `/admin/on-demand/decision-desk` | `/api/method/rbp_app.api.decision_desk.admin_archive_request` | RBP Decision Desk Request | Closed/Rejected/Cancelled | Archived | `none` |
| `/admin/on-demand/document-nucleus` | `/api/method/rbp_app.api.docushare.admin_request_more_information` | RBP Document Brief | Submitted/In Review/Assigned/In Progress | More Information Required | `more_information_requested` |
| `/admin/on-demand/document-nucleus` | `/api/method/rbp_app.api.docushare.admin_reject_brief` | RBP Document Brief | Submitted/In Review | Rejected | `docushare_rejected` |
| `/admin/on-demand/document-nucleus` | `/api/method/rbp_app.api.docushare.admin_close_brief` | RBP Document Brief | Outcome Ready/In Progress | Closed | `docushare_closed` |
| `/admin/on-demand/document-nucleus` | `/api/method/rbp_app.api.docushare.admin_archive_brief` | RBP Document Brief | Closed/Rejected/Cancelled | Archived | `none` |
| `/admin/marketplace` | `/api/method/rbp_app.api.marketplace.admin_approve_listing` | RBP Marketplace Listing | Pending Review | Published | `marketplace_listing_approved` |
| `/admin/marketplace` | `/api/method/rbp_app.api.marketplace.admin_reject_listing` | RBP Marketplace Listing | Pending Review | Rejected | `marketplace_listing_rejected` |
| `/admin/marketplace` | `/api/method/rbp_app.api.marketplace.admin_archive_listing` | RBP Marketplace Listing | Published/Rejected | Archived | `none` |
| `/admin/marketplace` | `/api/method/rbp_app.api.marketplace.admin_mark_enquiry_spam` | RBP Marketplace Enquiry | New/In Review | Spam | `none` |
| `/admin/marketplace` | `/api/method/rbp_app.api.marketplace.admin_close_enquiry` | RBP Marketplace Enquiry | Sent to Seller/In Review | Closed | `marketplace_enquiry_closed` |
| `/admin/operations/connectivity` | `/api/method/rbp_app.api.connectivity.admin_request_more_information` | RBP Connectivity Order | Submitted/In Review/Assigned/In Progress | More Information Required | `more_information_requested` |
| `/admin/operations/connectivity` | `/api/method/rbp_app.api.connectivity.admin_reject_order` | RBP Connectivity Order | Submitted/In Review | Rejected | `connectivity_rejected` |
| `/admin/operations/connectivity` | `/api/method/rbp_app.api.connectivity.admin_close_order` | RBP Connectivity Order | Outcome Ready/In Progress | Closed | `connectivity_closed` |
| `/admin/operations/connectivity` | `/api/method/rbp_app.api.connectivity.admin_archive_order` | RBP Connectivity Order | Closed/Rejected/Cancelled | Archived | `none` |
| `/admin/on-demand/risk-advisor` | `/api/method/rbp_app.api.risk_advisor.admin_assign_advisor` | RBP Risk Assessment | In Review/Submitted | Assigned | `advisor_assigned` |
| `/admin/on-demand/risk-advisor` | `/api/method/rbp_app.api.risk_advisor.admin_request_more_information` | RBP Risk Assessment | Submitted/In Review/Assigned/In Progress | More Information Required | `more_information_requested` |
| `/admin/on-demand/risk-advisor` | `/api/method/rbp_app.api.risk_advisor.admin_reject_assessment` | RBP Risk Assessment | Submitted/In Review | Rejected | `risk_advisor_rejected` |
| `/admin/on-demand/risk-advisor` | `/api/method/rbp_app.api.risk_advisor.admin_close_assessment` | RBP Risk Assessment | Outcome Ready/In Progress | Closed | `risk_advisor_closed` |
| `/admin/on-demand/risk-advisor` | `/api/method/rbp_app.api.risk_advisor.admin_archive_assessment` | RBP Risk Assessment | Closed/Rejected/Cancelled | Archived | `none` |
| `/admin/the-fixer` | `/api/method/rbp_app.api.fixer.admin_request_more_information` | RBP Fixer Request | Submitted/In Review/Assigned/In Progress | More Information Required | `more_information_requested` |
| `/admin/the-fixer` | `/api/method/rbp_app.api.fixer.admin_reject_request` | RBP Fixer Request | Submitted/In Review | Rejected | `fixer_rejected` |
| `/admin/the-fixer` | `/api/method/rbp_app.api.fixer.admin_close_request` | RBP Fixer Request | Outcome Ready/In Progress | Closed | `fixer_closed` |
| `/admin/the-fixer` | `/api/method/rbp_app.api.fixer.admin_archive_request` | RBP Fixer Request | Closed/Rejected/Cancelled | Archived | `none` |

---

## 3. Shared Admin Action Requirements

Every admin action must validate:

```text
- current user is authenticated
- current user has RBP Admin, System Manager, or Administrator role
- target record exists
- target record is within allowed operational scope
- source workflow state permits the action
- required reason is supplied for reject, cancel, archive, override, or visibility change
- action is audited
- safe notification is triggered where required
```

---

## 4. Admin Content / CMS Scaffold Actions

| Area | Action | Endpoint | Notes |
|---|---|---|---|
| Site Content | list content items | `/api/method/rbp_app.api.admin_content.list_items` | Future content DocType or page registry |
| Site Content | create content draft | `/api/method/rbp_app.api.admin_content.create_item` | Draft/publish workflow required |
| Site Content | publish content item | `/api/method/rbp_app.api.admin_content.admin_publish_item` | Requires version/audit |
| Resources | manage resources | `/api/method/rbp_app.api.admin_content.<action>` | Files, visibility, member/public rules |
| Help Center | manage help content | `/api/method/rbp_app.api.admin_content.<action>` | FAQ/knowledge base workflow |
| Legal Pages | update legal copy | `/api/method/rbp_app.api.admin_content.admin_update_legal_page` | Requires legal review/version history |
| Settings | manage platform config | `/api/method/rbp_app.api.admin_settings.<action>` | System Manager/Administrator only for sensitive config |

---

## 5. Required Admin Payload Pattern

```json
{
  "record_name": "RBP-XXX-0001",
  "action": "admin_request_more_information",
  "reason": "Additional information needed before review can continue.",
  "payload": {
    "requested_fields": ["business_context"],
    "message_to_customer": "Please add more detail about the business context."
  }
}
```

---

## 6. Required Error Codes

| Scenario | Error Code |
|---|---|
| User is not authenticated | `not_authenticated` |
| User lacks admin authority | `admin_action_denied` |
| Admin action is unavailable in current state | `admin_action_not_available` |
| Required reason missing | `admin_action_requires_reason` |
| Assignment target missing | `admin_assignment_required` |
| Rejection reason missing | `admin_rejection_reason_required` |
| Archive reason missing | `admin_archive_reason_required` |
| Invalid workflow transition | `workflow_transition_denied` |

---

## 7. Phase 3 Build Requirements

```text
Implement each admin action as a whitelisted Frappe API.
Keep API layer thin.
Enforce admin permissions in service layer and DocType permissions.
Record RBP Audit Log for every admin action.
Trigger RBP Notification where required.
Return standard API envelope.
Add tests for non-admin denial, invalid state, required reason, and successful transition.
```
