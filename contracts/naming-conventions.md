# RBP Phase 2 Backend Contracts
# 02-naming-conventions.md

## Document Status

| Field | Value |
|---|---|
| Document | Naming Conventions |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/02-naming-conventions.md` |
| Intended Final Location | `rbp-platform/contracts/02-naming-conventions.md` |
| Primary Consumers | Frontend, Frappe backend, integration, QA, documentation |

---

## 1. Purpose

This document defines the naming conventions for the Remote Business Partner Platform across frontend, backend, Frappe DocTypes, APIs, workflows, permissions, payments, file handling, notifications, errors, tests, documentation, and repository structure.

The goal is to prevent naming drift between:

```text
React UI / Frappe Website UI
        ↓
Frontend API Client
        ↓
rbp_app.api.*
        ↓
rbp_app.services.*
        ↓
Frappe DocTypes / Workflows / Permissions
        ↓
Frappe Desk / Portal / Notifications / Payments / Files
```

Names must be predictable, consistent, searchable, and easy to map from UI route to API endpoint to service method to DocType to workflow state.

This document is a Phase 2 contract standard. It does not implement backend behaviour. It defines the naming rules that Phase 3 implementation must follow.

---

## 2. Core Naming Principles

All naming across the platform must follow these principles:

| Principle | Rule |
|---|---|
| Consistency | The same concept must use the same name across frontend, backend, DocTypes, docs, and tests. |
| Domain first | Names should identify the product domain before the specific object or action. |
| Human-readable DocTypes | Frappe DocTypes should use clear title case names. |
| Machine-readable fields | API fields, Python variables, JSON keys, and database-facing fields should use `snake_case`. |
| Predictable actions | API method names should use standard verbs such as `create`, `update`, `submit`, `get`, `list`, `attach`, `admin`. |
| No abbreviations unless approved | Avoid unclear abbreviations. Use `decision_desk`, not `dd`. |
| No duplicate meanings | Do not use `status`, `state`, and `stage` interchangeably. |
| Searchability | Names should be easy to search in GitHub, Frappe, logs, and docs. |
| No frontend-only truth | Backend contract names must become the source of truth for Phase 3 build. |
| No vibes | If a name is ambiguous, define it here or in the relevant contract document. Vibes remain tragically unversioned. |

---

## 3. Approved Product Domain Names

These are the canonical product domains for contracts, APIs, services, files, folders, and tests.

| Product / Area | Human Name | Slug | Python Module | TypeScript Name Stem |
|---|---|---|---|---|
| Membership | Membership | `membership` | `membership` | `Membership` |
| Decision Desk | Decision Desk | `decision-desk` | `decision_desk` | `DecisionDesk` |
| DocuShare | DocuShare | `docushare` | `docushare` | `DocuShare` |
| Marketplace | Marketplace | `marketplace` | `marketplace` | `Marketplace` |
| Connectivity / NBN | Connectivity | `connectivity` | `connectivity` | `Connectivity` |
| Risk Advisor | Risk Advisor | `risk-advisor` | `risk_advisor` | `RiskAdvisor` |
| The Fixer | The Fixer | `fixer` | `fixer` | `Fixer` |
| Portal / Dashboard | Portal | `portal` | `portal` | `Portal` |
| Applications Portal | Applications | `applications` | `applications` | `Applications` |
| Documents | Documents | `documents` | `documents` | `Documents` |
| Billing / Payments | Billing | `billing` | `billing` | `Billing` |
| Notifications | Notifications | `notifications` | `notifications` | `Notifications` |
| Admin Operations | Admin | `admin` | `admin` | `Admin` |
| Tenant / Account Management | Tenancy | `tenancy` | `tenancy` | `Tenancy` |
| Entitlements | Entitlements | `entitlements` | `entitlements` | `Entitlements` |
| Files | Files | `files` | `files` | `Files` |
| Audit | Audit | `audit` | `audit` | `Audit` |

### Rules

Use:

```text
decision-desk       for routes and public URL slugs
decision_desk       for Python modules, API method paths, JSON keys where domain appears
DecisionDesk        for TypeScript types/classes/components
Decision Desk       for user-facing copy and Frappe labels
```

Do not use:

```text
decisiondesk
decisionDesk in Python
Decision_Desk
DD
deskDecision
```

The machines already suffer enough.

---

## 4. Repository and Folder Naming

### 4.1 Current Repository Names

| Repository | Role |
|---|---|
| `info-rbp/Uiuxdesignassistance` | Phase 1 UI/UX completion |
| `info-rbp/frappe-project` | Phase 3 Frappe platform completion |
| `info-rbp/rbp-platform` | Phase 4+ final consolidated source of truth |

### 4.2 Final Repository Structure

Final repository folders should use lowercase kebab-case or simple lowercase where appropriate:

```text
rbp-platform/
├── apps/
│   └── rbp_app/
├── frontend/
│   └── portal/
├── specs/
│   └── onboarding-flows/
├── contracts/
│   ├── api/
│   ├── doctypes/
│   ├── workflows/
│   ├── permissions/
│   └── errors/
├── infra/
│   ├── bench/
│   ├── docker/
│   ├── deployment/
│   └── ci/
├── docs/
│   ├── architecture/
│   ├── product-flows/
│   ├── qa/
│   └── launch/
└── tests/
    ├── frontend/
    ├── backend/
    └── integration/
```

### 4.3 Folder Naming Rules

| Folder Type | Convention | Example |
|---|---|---|
| Top-level folders | lowercase | `contracts/` |
| Domain folders | kebab-case | `decision-desk/` |
| Python app folder | snake_case | `rbp_app/` |
| Frontend source folders | lowercase or kebab-case | `src/api/`, `src/app/config/` |
| Documentation folders | lowercase or kebab-case | `product-flows/` |
| Contract folders | lowercase plural | `doctypes/`, `workflows/`, `permissions/` |

Do not create duplicate folder names with different casing:

```text
Do not use both:
contracts/
Contracts/
```

That way lies cross-platform filesystem nonsense, because apparently even folder names need diplomacy.

---

## 5. Markdown Document Naming

### 5.1 Local Phase 2 Contract Files

Local Phase 2 files in this workspace should use lowercase kebab-case:

```text
nn-lowercase-kebab-case.md
```

Example:

```text
index.md
01-api-response-envelope-standard.md
02-naming-conventions.md
03-role-matrix.md
04-permission-model-draft.md
05-core-doctype-model.md
06-workflow-state-standards.md
07-error-catalogue.md
08-payment-state-model.md
09-upload-file-rules.md
10-contract-templates.md
```

### 5.2 Final Repository Contract Files

When moved into `rbp-platform/contracts/`, domain-specific files should use lowercase kebab-case:

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

### 5.3 Documentation File Names

Cross-phase core docs may retain their established governance naming:

```text
MASTER_PLAN.md
ARCHITECTURE.md
REPOSITORY_STRATEGY.md
UI_ROUTE_MAP.md
API_CONTRACTS.md
DOCTYPE_MODEL.md
WORKFLOW_MODEL.md
PERMISSION_MODEL.md
INTEGRATION_PLAN.md
QA_PLAN.md
LAUNCH_PLAN.md
RUNBOOK.md
```

### Rules

Use uppercase names for major governance documents. Use lowercase kebab-case for domain contract files. Do not mix both styles for the same document type.

---

## 6. API Endpoint Naming

All Frappe API endpoints must follow this base pattern:

```text
/api/method/rbp_app.api.<domain>.<action>_<resource>
```

### 6.1 Standard API Actions

| Action | Pattern | Example |
|---|---|---|
| Create | `create_<resource>` | `create_request` |
| Update draft | `update_<resource>` | `update_request` |
| Submit | `submit_<resource>` | `submit_request` |
| Get one | `get_<resource>` | `get_request` |
| List my records | `list_my_<resources>` | `list_my_requests` |
| Attach file | `attach_file` | `attach_file` |
| Admin action | `admin_<action>` | `admin_assign_advisor` |

### 6.2 Endpoint Examples

```text
POST /api/method/rbp_app.api.membership.create_signup
GET  /api/method/rbp_app.api.membership.get_subscription
GET  /api/method/rbp_app.api.membership.list_my_subscriptions

POST /api/method/rbp_app.api.decision_desk.create_request
POST /api/method/rbp_app.api.decision_desk.update_request
POST /api/method/rbp_app.api.decision_desk.submit_request
GET  /api/method/rbp_app.api.decision_desk.get_request
GET  /api/method/rbp_app.api.decision_desk.list_my_requests
POST /api/method/rbp_app.api.decision_desk.attach_file
POST /api/method/rbp_app.api.decision_desk.admin_assign_advisor

POST /api/method/rbp_app.api.docushare.create_brief
POST /api/method/rbp_app.api.marketplace.create_listing
POST /api/method/rbp_app.api.connectivity.create_order
POST /api/method/rbp_app.api.risk_advisor.create_assessment
POST /api/method/rbp_app.api.fixer.create_request
```

### 6.3 API Naming Rules

Use:

```text
rbp_app.api.decision_desk.create_request
rbp_app.api.risk_advisor.create_assessment
rbp_app.api.marketplace.create_listing
```

Do not use:

```text
rbp_app.api.DecisionDesk.createRequest
rbp_app.api.dd.make
rbp_app.api.marketplace.submitForm
rbp_app.api.risk-advisor.create-assessment
```

Python and Frappe method paths must use `snake_case`.

---

## 7. Python Module and Function Naming

### 7.1 Backend Module Names

Backend Python modules must use `snake_case`.

```text
rbp_app/
└── rbp_app/
    ├── api/
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
```

### 7.2 API Function Names

API functions must use verb-first `snake_case`.

```python
create_request()
update_request()
submit_request()
get_request()
list_my_requests()
attach_file()
admin_assign_advisor()
```

### 7.3 Service Function Names

Service functions should match API actions where possible, but may include more specific business language when needed.

```python
create_request()
validate_request_payload()
submit_request()
assign_advisor()
record_payment_event()
create_file_reference()
trigger_notification()
```

### 7.4 Private Helper Names

Private backend helper functions should start with a single underscore.

```python
_validate_entitlement()
_build_request_dto()
_resolve_tenant()
```

Do not expose private helper names as whitelisted API methods.

---

## 8. TypeScript Naming

### 8.1 Frontend File Names

| File Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `DecisionDeskPage.tsx` |
| API clients | camelCase domain + `.api.ts` | `decisionDesk.api.ts` |
| Mock services | camelCase domain + `.mockService.ts` | `decisionDesk.mockService.ts` |
| Mock data | camelCase domain + `.mock.ts` | `decisionDesk.mock.ts` |
| Types | camelCase domain + `.types.ts` | `decisionDesk.types.ts` |
| Config files | camelCase | `navigation.ts`, `routes.registry.ts` |

### 8.2 TypeScript Types and Interfaces

Use PascalCase.

```ts
type DecisionDeskRequest = {};
type DecisionDeskRequestPayload = {};
type DecisionDeskRequestStatus = {};
type ApiResponse<T> = {};
```

### 8.3 Variables and Functions

Use camelCase.

```ts
const selectedPlan = "";
const decisionDeskRequest = {};
function createDecisionDeskRequest() {}
function mapDtoToDecisionDeskRequest() {}
```

### 8.4 Constants

Use uppercase snake_case only for true constants.

```ts
const DEFAULT_PAGE_SIZE = 20;
const MAX_UPLOAD_SIZE_MB = 25;
```

For config collections, use camelCase:

```ts
export const publicNavigation = [];
export const portalNavigation = [];
```

---

## 9. Route Naming

### 9.1 Public Route Paths

Routes must use lowercase kebab-case.

```text
/on-demand/decision-desk
/on-demand/documents
/on-demand/risk-advisor
/on-demand/the-fixer
/marketplace
/membership
/connectivity
```

### 9.2 Portal Route Paths

Authenticated portal routes should start with `/portal`.

```text
/portal
/portal/dashboard
/portal/requests
/portal/decision-desk
/portal/documents
/portal/billing
/portal/notifications
```

### 9.3 Admin Route Paths

Admin concept routes should start with `/admin`.

```text
/admin
/admin/dashboard
/admin/decision-desk
/admin/documents
/admin/marketplace
/admin/connectivity
/admin/risk-advisor
/admin/fixer
```

### 9.4 Route Registry Names

Route registry keys should use camelCase or snake_case consistently within the registry. Recommended: camelCase for frontend config.

```ts
export const routes = {
  decisionDesk: "/on-demand/decision-desk",
  riskAdvisor: "/on-demand/risk-advisor",
  fixer: "/on-demand/the-fixer",
};
```

Do not hardcode route strings throughout components. Put them in the route registry. Humans can barely keep calendars straight; scattered routes are asking too much.

---

## 10. Frappe DocType Naming

### 10.1 DocType Prefix

All custom platform DocTypes must start with:

```text
RBP
```

### 10.2 DocType Format

DocTypes must use title case:

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

### 10.3 DocType Naming Rules

Use:

```text
RBP Decision Desk Request
RBP Marketplace Listing
RBP Payment Event
```

Do not use:

```text
Decision Desk Request
RBPDecisionDeskRequest
RBP DecisionDesk Request
Remote Business Partner Decision Desk Request
RBP DD Request
```

The `RBP` prefix must make custom platform records immediately identifiable inside Frappe Desk and database tables.

---

## 11. Frappe Field Naming

### 11.1 Fieldname Convention

Frappe fieldnames must use `snake_case`.

```text
tenant
owner
status
workflow_state
submitted_on
assigned_to
priority
source_channel
created_from_flow
audit_reference
```

### 11.2 Field Label Convention

Frappe field labels should use clear title case.

| Fieldname | Label |
|---|---|
| `business_name` | Business Name |
| `workflow_state` | Workflow State |
| `submitted_on` | Submitted On |
| `assigned_to` | Assigned To |
| `payment_provider` | Payment Provider |

### 11.3 Common Field Names

Use these canonical fieldnames across product DocTypes where applicable:

```text
tenant
owner
status
workflow_state
submitted_on
assigned_to
priority
source_channel
created_from_flow
audit_reference
```

### 11.4 Business Identity Fields

```text
business_name
legal_name
business_identifier
industry
business_size
country
region
primary_contact
phone
email
website
membership_status
tenant
```

### 11.5 Payment Fields

```text
payment_provider
provider_customer_id
provider_subscription_id
provider_event_id
provider_payment_id
amount
currency
status
event_type
raw_payload
processed_on
```

### 11.6 File Fields

```text
related_doctype
related_name
file
file_type
visibility
uploaded_by
uploaded_on
status
```

### 11.7 Field Naming Rules

Do not invent synonyms for canonical field names.

Use:

```text
workflow_state
assigned_to
submitted_on
related_doctype
related_name
```

Do not use:

```text
stage
assignee
submission_date
linked_type
linked_record
```

If a new field is required, add it first to the relevant Phase 2 field specification document.

---

## 12. Status and Workflow State Naming

### 12.1 Distinction Between `status` and `workflow_state`

| Name | Meaning |
|---|---|
| `status` | General record status for display, filtering, or simplified frontend use |
| `workflow_state` | Formal Frappe workflow state controlling transitions and permissions |

Use both only when needed. Do not use `stage` unless a specific business process requires it and Phase 2 approves it.

### 12.2 Workflow State Format

Workflow state labels should use title case:

```text
Draft
Submitted
In Review
Assigned
In Progress
Outcome Ready
Closed
```

Optional workflow states:

```text
Payment Pending
Payment Failed
More Information Required
Rejected
Cancelled
Archived
```

### 12.3 API Status Values

API status values should use lowercase snake_case.

| Workflow Label | API Value |
|---|---|
| Draft | `draft` |
| Submitted | `submitted` |
| In Review | `in_review` |
| Assigned | `assigned` |
| In Progress | `in_progress` |
| Outcome Ready | `outcome_ready` |
| Closed | `closed` |
| Payment Pending | `payment_pending` |
| Payment Failed | `payment_failed` |
| More Information Required | `more_information_required` |
| Rejected | `rejected` |
| Cancelled | `cancelled` |
| Archived | `archived` |

### 12.4 Frontend Display Labels

Frontend should map API status values to user-facing labels.

```ts
const statusLabels = {
  in_review: "In Review",
  outcome_ready: "Outcome Ready",
};
```

Do not return random display strings from every endpoint. That is not flexibility. That is entropy with a keyboard.

---

## 13. Role Naming

### 13.1 Canonical Roles

Roles must use title case labels in Frappe:

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

### 13.2 API Role Values

When roles are returned via API, use lowercase snake_case.

| Frappe Role | API Value |
|---|---|
| Guest | `guest` |
| Website User | `website_user` |
| RBP Member | `rbp_member` |
| RBP Business Owner | `rbp_business_owner` |
| RBP Team Member | `rbp_team_member` |
| RBP Advisor | `rbp_advisor` |
| RBP Marketplace Seller | `rbp_marketplace_seller` |
| RBP Marketplace Buyer | `rbp_marketplace_buyer` |
| RBP Support Agent | `rbp_support_agent` |
| RBP Admin | `rbp_admin` |
| System Manager | `system_manager` |
| Administrator | `administrator` |

### 13.3 Role Naming Rules

Use the `RBP` prefix for custom project roles. Do not create generic roles such as:

```text
Member
Admin
Advisor
Seller
Buyer
```

Those names are too broad inside Frappe and will eventually collide with something. Because naturally, platforms collect ambiguous roles like lint.

---

## 14. Permission Naming

Permission documents and matrices should use the action names:

```text
create
read
update
submit
cancel
delete
admin_review
assign
approve
reject
archive
```

Permission matrix columns should use title case labels:

```text
Can Create
Can Read
Can Update
Can Submit
Can Cancel
Can Delete
Can Admin Review
Can Assign
Can Approve
Can Reject
Can Archive
```

Backend permission helper functions should use snake_case:

```python
can_create_request()
can_read_request()
can_update_request()
can_submit_request()
can_admin_review_request()
```

---

## 15. Payment Naming

### 15.1 Payment DocType

Use:

```text
RBP Payment Event
```

### 15.2 Payment State Labels

Frappe labels:

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

### 15.3 Payment Event Fields

Use canonical payment provider fields:

```text
payment_provider
provider_event_id
provider_customer_id
provider_payment_id
provider_subscription_id
amount
currency
status
event_type
raw_payload
processed_on
```

### 15.4 Payment Event Type Values

Use snake_case for event type values:

```text
checkout_created
payment_authorised
payment_paid
payment_failed
subscription_created
subscription_renewed
subscription_cancelled
refund_created
dispute_created
webhook_received
```

Do not name events after a provider unless the event is stored inside `raw_payload`. The platform contract should remain provider-neutral.

---

## 16. File and Upload Naming

### 16.1 File Reference DocType

Use:

```text
RBP File Reference
```

### 16.2 File Visibility Values

Frappe labels:

```text
Private to Owner
Tenant Visible
Advisor Visible
Admin Only
Public
```

API values:

```text
private_to_owner
tenant_visible
advisor_visible
admin_only
public
```

### 16.3 Upload API Naming

Use:

```text
attach_file()
```

Endpoint:

```text
POST /api/method/rbp_app.api.<domain>.attach_file
```

### 16.4 File Metadata Fields

```text
tenant
owner
related_doctype
related_name
file
file_type
visibility
uploaded_by
uploaded_on
status
```

### 16.5 Frontend Mock Upload Fields

During Phase 1 and early Phase 2, mock upload fields may use `_mock` suffix:

```text
supporting_documents_mock
reference_files_mock
media_mock
payment_method_mock
serviceability_status_mock
```

When mapped to backend, remove `_mock` and map to real file/payment/serviceability entities.

---

## 17. Notification Naming

### 17.1 Notification DocType

Use:

```text
RBP Notification
```

### 17.2 Notification Trigger Names

Use lowercase snake_case trigger keys.

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

### 17.3 Notification Template Names

Use domain plus trigger:

```text
membership.purchased
decision_desk.request_submitted
decision_desk.advisor_assigned
docushare.brief_submitted
marketplace.listing_approved
connectivity.order_received
risk_advisor.assessment_completed
fixer.request_accepted
billing.payment_failed
billing.subscription_renewed
```

### 17.4 Notification Function Names

Backend functions:

```python
trigger_notification()
create_notification()
send_membership_purchased_notification()
send_decision_desk_request_submitted_notification()
```

---

## 18. Error Naming

### 18.1 Error Codes

API error codes must use lowercase snake_case.

```text
required
invalid_format
invalid_value
not_authenticated
permission_denied
not_found
duplicate_record
workflow_transition_denied
payment_required
payment_failed
file_too_large
unsupported_file_type
validation_failed
server_error
```

### 18.2 Error Object Fields

Every API error object should use:

```json
{
  "field": "business_name",
  "code": "required",
  "message": "Business name is required"
}
```

### 18.3 Error Catalogue File Names

Use:

```text
contracts/errors/error-catalogue.md
```

or local Phase 2 file:

```text
07-error-catalogue.md
```

### 18.4 Error Naming Rules

Do not use inconsistent error codes:

```text
missing
is_required
required_field
fieldRequired
```

Use:

```text
required
```

The frontend should not need a forensic linguist to understand an error response.

---

## 19. Mock-to-Real API Naming

### 19.1 Mock Endpoint Format

Mock endpoints should use:

```text
/mock/<domain>/<resource>
```

Examples:

```text
GET  /mock/me
GET  /mock/membership/plans
POST /mock/membership/signup
POST /mock/decision-desk/request
POST /mock/docushare/brief
POST /mock/marketplace/listing
POST /mock/connectivity/order
POST /mock/risk-advisor/assessment
POST /mock/fixer/request
GET  /mock/portal/dashboard
GET  /mock/portal/notifications
```

### 19.2 Real Endpoint Format

Real endpoints must use:

```text
/api/method/rbp_app.api.<domain>.<action>_<resource>
```

Examples:

```text
POST /api/method/rbp_app.api.membership.create_signup
POST /api/method/rbp_app.api.decision_desk.create_request
POST /api/method/rbp_app.api.docushare.create_brief
POST /api/method/rbp_app.api.marketplace.create_listing
POST /api/method/rbp_app.api.connectivity.create_order
POST /api/method/rbp_app.api.risk_advisor.create_assessment
POST /api/method/rbp_app.api.fixer.create_request
GET  /api/method/rbp_app.api.portal.get_dashboard
GET  /api/method/rbp_app.api.notifications.list_my_notifications
```

### 19.3 Adapter Naming

Frontend service interfaces:

```ts
MembershipService
DecisionDeskService
DocuShareService
MarketplaceService
ConnectivityService
RiskAdvisorService
FixerService
PortalService
NotificationService
```

Mock implementations:

```ts
mockMembershipService
mockDecisionDeskService
mockDocuShareService
mockMarketplaceService
mockConnectivityService
mockRiskAdvisorService
mockFixerService
mockPortalService
mockNotificationService
```

Real implementations:

```ts
frappeMembershipService
frappeDecisionDeskService
frappeDocuShareService
frappeMarketplaceService
frappeConnectivityService
frappeRiskAdvisorService
frappeFixerService
frappePortalService
frappeNotificationService
```

---

## 20. DTO and Payload Naming

### 20.1 Payload Types

Use:

```ts
CreateMembershipSignupPayload
CreateDecisionDeskRequestPayload
UpdateDecisionDeskRequestPayload
SubmitDecisionDeskRequestPayload
CreateDocumentBriefPayload
CreateMarketplaceListingPayload
CreateConnectivityOrderPayload
CreateRiskAssessmentPayload
CreateFixerRequestPayload
```

### 20.2 DTO Types

Use:

```ts
MembershipPlanDto
SubscriptionDto
DecisionDeskRequestDto
DocumentBriefDto
MarketplaceListingDto
ConnectivityOrderDto
RiskAssessmentDto
FixerRequestDto
NotificationDto
PaymentEventDto
FileReferenceDto
```

### 20.3 UI Model Types

Use:

```ts
MembershipPlan
Subscription
DecisionDeskRequest
DocumentBrief
MarketplaceListing
ConnectivityOrder
RiskAssessment
FixerRequest
Notification
PaymentEvent
FileReference
```

### 20.4 Mapping Function Names

Use:

```ts
mapDecisionDeskRequestDtoToModel()
mapCreateDecisionDeskRequestFormToPayload()
mapPaymentEventDtoToModel()
```

Rules:

```text
Payload = data sent to backend.
Dto = data returned by backend.
Model = frontend-friendly representation.
```

Do not blur these names unless you enjoy debugging soup.

---

## 21. Test Naming

### 21.1 Backend Test Files

Use:

```text
test_membership.py
test_decision_desk.py
test_docushare.py
test_marketplace.py
test_connectivity.py
test_risk_advisor.py
test_fixer.py
test_permissions.py
test_workflows.py
test_payment_events.py
test_file_references.py
test_notifications.py
```

### 21.2 Frontend Test Files

Use:

```text
DecisionDeskPage.test.tsx
MembershipSignupFlow.test.tsx
MarketplaceListingForm.test.tsx
decisionDesk.api.test.ts
decisionDesk.mockService.test.ts
```

### 21.3 Test Case Names

Backend:

```python
def test_decision_desk_request_can_be_created_by_member():
    ...
```

Frontend:

```ts
it("creates a Decision Desk request from valid form input", () => {});
```

### 21.4 QA Test Naming

QA scenarios should use:

```text
DOMAIN-ACTION-EXPECTED_RESULT
```

Examples:

```text
DECISION_DESK-SUBMIT_REQUEST-CREATES_RECORD
MARKETPLACE-APPROVE_LISTING-UPDATES_STATUS
BILLING-PAYMENT_FAILED-CREATES_NOTIFICATION
FILES-PRIVATE_UPLOAD-BLOCKS_OTHER_TENANT_ACCESS
```

---

## 22. Branch and Version Naming

### 22.1 Branch Names

Use:

```text
main
develop
phase/phase-1-uiux
phase/phase-2-contracts
phase/phase-3-frappe
phase/phase-4-consolidation
phase/phase-5-integration
phase/phase-6-qa
phase/phase-7-launch
feature/<domain>-<description>
fix/<description>
release/<version>
hotfix/<description>
```

Examples:

```text
feature/decision-desk-api-contract
feature/membership-payment-state-model
fix/decision-desk-validation-errors
release/v0.2.0-contracts-complete
```

### 22.2 Version Tags

Use semantic release tags:

```text
v0.1.0-ui-complete
v0.2.0-contracts-complete
v0.3.0-frappe-platform-complete
v0.4.0-consolidated
v0.5.0-integrated
v0.6.0-qa-release-candidate
v1.0.0-launch
```

---

## 23. Environment Variable Naming

Environment variable names must use uppercase snake case.

```text
FRAPPE_SITE_NAME
FRAPPE_BASE_URL
RBP_APP_ENV
RBP_PAYMENT_PROVIDER
RBP_PAYMENT_WEBHOOK_SECRET
RBP_EMAIL_SENDER
RBP_FILE_MAX_UPLOAD_MB
RBP_PUBLIC_PORTAL_URL
```

Rules:

```text
Use RBP_ prefix for custom project settings.
Use provider-specific prefixes only for provider credentials.
Never commit real secrets.
```

Example provider-specific names:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

---

## 24. Audit Log Naming

### 24.1 DocType

Use:

```text
RBP Audit Log
```

### 24.2 Audit Event Names

Use lowercase snake_case:

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

### 24.3 Audit Fields

```text
tenant
user
event_type
related_doctype
related_name
previous_value
new_value
source_channel
created_on
```

---

## 25. Admin Action Naming

### 25.1 API Admin Actions

Use:

```text
admin_<verb>_<object>
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

### 25.2 Frontend Admin Action IDs

Use camelCase:

```ts
adminAssignAdvisor
adminRequestMoreInformation
adminApproveListing
adminRejectListing
adminCloseRequest
adminArchiveRecord
```

### 25.3 Display Labels

Use title case:

```text
Assign Advisor
Request More Information
Approve Listing
Reject Listing
Close Request
Archive Record
```

---

## 26. Search and Filter Naming

Search query parameters should use snake_case:

```text
q
status
workflow_state
assigned_to
tenant
created_from
created_to
submitted_from
submitted_to
page
page_size
sort_by
sort_order
```

Use `q` for free-text search. Use explicit field filters for structured values.

Sort order values:

```text
asc
desc
```

---

## 27. Banned Naming Patterns

Do not use these patterns:

| Banned Pattern | Why |
|---|---|
| `data1`, `data2`, `thing`, `stuff` | Meaningless |
| `stage` as a synonym for workflow state | Ambiguous |
| `adminStatus` beside `status` without definition | Causes drift |
| `DD` for Decision Desk | Unclear |
| `docu_share` | Not canonical |
| `riskadvisor` | Not canonical |
| `the_fixer` as module name | Use `fixer` |
| `user_id` when Frappe uses user email/name | Ambiguous unless explicitly defined |
| `owner_user` if `owner` is sufficient | Duplicates Frappe convention |
| `createdDate` in backend payloads | Use `created_on` or `created_at` consistently |
| `fileUrl` in backend fields | Use `file` or `file_url` only if contract defines it |
| `success` instead of `ok` in API envelope | Breaks response standard |
| `error` instead of `errors` array | Breaks response standard |

---

## 28. Naming Change Control

Once this document is accepted, naming changes require contract updates.

A naming change must include:

```text
1. Existing name
2. Proposed new name
3. Affected layer: frontend, API, service, DocType, workflow, permission, docs, tests
4. Migration impact
5. Backward compatibility impact
6. Approval status
```

Template:

```md
## Naming Change Request

| Field | Value |
|---|---|
| Existing Name |  |
| Proposed Name |  |
| Reason |  |
| Affected Files / Contracts |  |
| Migration Required | Yes / No |
| Backward Compatible | Yes / No |
| Approved By |  |
| Date |  |
```

No silent renames. Silent renames are how repositories become archaeological sites.

---

## 29. Phase 2 Acceptance Criteria for Naming

This naming convention document is complete when:

```text
All product domains have canonical names.
Frontend route, component, API client, mock, and type naming rules are defined.
Backend API module, service module, and function naming rules are defined.
Frappe DocType and field naming rules are defined.
Workflow state and API status naming rules are defined.
Role and permission naming rules are defined.
Payment, file, notification, audit, and error naming rules are defined.
Mock-to-real API naming rules are defined.
Documentation, branch, version, and environment variable naming rules are defined.
Banned naming patterns are documented.
Naming change control is documented.
Phase 3 backend implementation can follow this file without guessing.
```

---

## 30. Quick Reference

| Concept | Convention | Example |
|---|---|---|
| Public route | kebab-case | `/on-demand/decision-desk` |
| Python module | snake_case | `decision_desk.py` |
| API function | snake_case verb-first | `create_request()` |
| API endpoint | Frappe method path | `/api/method/rbp_app.api.decision_desk.create_request` |
| DocType | `RBP` + Title Case | `RBP Decision Desk Request` |
| Frappe fieldname | snake_case | `workflow_state` |
| Frappe role | Title Case | `RBP Business Owner` |
| API status value | snake_case | `in_review` |
| Workflow label | Title Case | `In Review` |
| TypeScript component | PascalCase | `DecisionDeskPage.tsx` |
| TypeScript variable | camelCase | `decisionDeskRequest` |
| Markdown governance doc | established governance naming | `API_CONTRACTS.md` |
| Domain contract doc | kebab-case | `decision-desk.contract.md` |
| Branch | slash + kebab-case | `feature/decision-desk-api-contract` |
| Version tag | semantic + suffix | `v0.2.0-contracts-complete` |
| Environment variable | uppercase snake_case | `RBP_PAYMENT_PROVIDER` |

---

## 31. Final Rule

A name is acceptable only if it can be traced cleanly across:

```text
UI route
→ frontend model
→ API payload
→ API endpoint
→ service function
→ Frappe DocType
→ Frappe field
→ workflow state
→ permission rule
→ test case
→ documentation
```

If it cannot survive that path, rename it before implementation. Better now than during integration, where all bad decisions gather for a reunion.
