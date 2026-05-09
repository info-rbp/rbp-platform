# RBP Phase 2 Backend Contracts
# 03-role-matrix.md

## Document Status

| Field | Value |
|---|---|
| Document | Role Matrix |
| Phase | Phase 2: Backend Contract Planning |
| Project | Remote Business Partner Platform |
| Status | Draft until Phase 1 UI/UX Completion |
| Intended Location Now | `RBP_Phase_2_Backend_Contracts/03-role-matrix.md` |
| Intended Final Location | `rbp-platform/contracts/permissions/role-matrix.md` |
| Primary Consumers | Product, frontend, Frappe backend, QA, admin operations |

---

## 1. Purpose

This document defines the platform role model for the Remote Business Partner Platform.

It identifies:

```text
- which roles exist
- what each role represents
- where each role can access the platform
- what each role can create, read, update, submit, approve, reject, assign, or administer
- how roles interact with tenants, records, workflows, files, payments, notifications, and admin actions
- what permissions must be enforced by Frappe during Phase 3
```

This document is part of Phase 2: Backend Contract Planning. It is not implementation code. It is the role contract that backend permissions, route guards, workflow rules, and QA tests must follow.

The purpose is brutally simple: prevent the platform from becoming one of those systems where everyone is either “Admin” or “Not Admin,” which is how small permission issues become production folklore.

---

## 2. Scope

This document covers platform-level roles and their expected authority across:

```text
Public website
Authentication
Portal/dashboard
Membership
Decision Desk
DocuShare
Marketplace
Connectivity / NBN
Risk Advisor
The Fixer
Applications portal
Documents
Billing / payments
Notifications
Admin operations
Tenant/account management
File uploads
Audit logs
Workflow transitions
```

This document does not define every DocType-level permission in full field detail. That belongs in:

```text
04-permission-model-draft.md
```

However, this file defines the role structure that the permission model must use.

---

## 3. Source Contract Requirements

The Phase 2 backend contract planning deliverables require a dedicated role matrix and permission matrix. The platform plan identifies Phase 2 as the point where APIs, DocTypes, workflows, permissions, payment states, and field maps are defined before Frappe build begins.

The baseline role set is:

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

The baseline permission model also establishes the following broad rules:

| Role | Can Create | Can Read | Can Update | Can Submit | Can Admin Review |
|---|---|---|---|---|---|
| Guest | limited public forms only | public | no | no | no |
| Website User | own draft records | own records | own drafts | own records | no |
| RBP Member | member-only requests | own/team records | own drafts | own records | no |
| RBP Advisor | assigned advisory records | assigned records | advisor fields | recommendations | no |
| RBP Admin | all RBP records | all RBP records | all | all | yes |
| System Manager | all | all | all | all | yes |

This document expands that baseline into a fuller working contract.

---

## 4. Role Naming Standard

### 4.1 Frappe Role Labels

Roles must be created in Frappe using these exact labels:

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

### 4.2 API Role Values

When returned through API responses, roles should use lowercase snake_case:

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

### 4.3 Role Naming Rules

Use the `RBP` prefix for all custom platform roles except inherited Frappe roles.

Do not create vague duplicate roles such as:

```text
Member
Admin
Advisor
Seller
Buyer
Customer
Client
```

Those are role-shaped landmines. Use the canonical role list.

---

## 5. Role Categories

| Category | Roles | Purpose |
|---|---|---|
| Public / anonymous | Guest | Unauthenticated public visitor |
| Authenticated user | Website User | Logged-in user without active membership authority |
| Member roles | RBP Member, RBP Business Owner, RBP Team Member | Customer-side business users |
| Product-specific roles | RBP Marketplace Seller, RBP Marketplace Buyer | Marketplace participation |
| Service delivery roles | RBP Advisor, RBP Support Agent | Internal or assigned operators |
| Admin roles | RBP Admin, System Manager, Administrator | Platform administration and system control |

---

## 6. Role Definitions

## 6.1 Guest

### Description

Unauthenticated public visitor.

### Typical Capabilities

```text
- View public website pages
- View public service information
- View public marketplace listings if enabled
- Start limited public forms if allowed
- Submit public lead/enquiry forms if supported
- Cannot access portal
- Cannot access admin
- Cannot read private records
- Cannot upload private files unless a specific public form allows temporary upload handling
```

### Typical Users

```text
Prospects
Anonymous visitors
Search traffic
Unregistered buyers
```

### Backend Notes

Guest access must be explicitly allowed per API method. Default should be deny.

---

## 6.2 Website User

### Description

Authenticated user account without full member-level authority.

This may include a newly registered user, a user with incomplete onboarding, or a user whose membership has not yet been activated.

### Typical Capabilities

```text
- Access own profile
- Access limited portal onboarding views
- Create own draft records where allowed
- Read own records
- Update own draft records
- Submit allowed public/authenticated forms
- Cannot access member-only services unless entitlement permits
- Cannot access tenant-wide records unless linked to a tenant
- Cannot access admin
```

### Typical Users

```text
New user after signup
User awaiting membership/payment completion
User invited but not fully assigned to tenant
```

---

## 6.3 RBP Member

### Description

A customer-side user with active membership access.

### Typical Capabilities

```text
- Access member portal
- Create member-only service requests
- Submit Decision Desk requests
- Submit DocuShare briefs
- Submit Risk Advisor assessments
- Submit Fixer requests
- View own records
- View tenant/team records if tenant rules allow
- Update own draft records
- Attach files to own/member-authorised records
- View own notifications
- View membership entitlements
```

### Typical Users

```text
Active customer
Business subscriber
Member portal user
```

### Backend Notes

Member permissions must always be scoped by tenant, ownership, team membership, and entitlement.

---

## 6.4 RBP Business Owner

### Description

Primary authority for a tenant/business account.

### Typical Capabilities

```text
- Manage tenant/business profile
- Manage membership and subscription views
- Invite or manage team members, if enabled
- View tenant-level records
- Create and submit service requests
- View billing/payment summaries
- View tenant notifications
- Assign internal team visibility, if supported
- Cannot perform platform admin review
```

### Typical Users

```text
Business owner
Primary account holder
Membership purchaser
Tenant administrator
```

### Backend Notes

`RBP Business Owner` should usually be the `primary_owner` of `RBP Tenant`.

---

## 6.5 RBP Team Member

### Description

A user invited under a tenant or business account.

### Typical Capabilities

```text
- Access tenant portal if invited
- View records assigned/shared within the tenant
- Create drafts if allowed by tenant/business owner
- Submit records only if permission is granted
- Attach files to allowed tenant records
- Cannot manage billing unless explicitly granted
- Cannot manage membership ownership
- Cannot manage platform-level settings
```

### Typical Users

```text
Employee
Assistant
Operations team member
Internal business user
```

### Backend Notes

Team access must be tenant-scoped and should not automatically equal owner access.

---

## 6.6 RBP Advisor

### Description

Internal or contracted advisor assigned to advisory/product records.

### Typical Capabilities

```text
- View assigned advisory records
- View files attached to assigned records when visibility permits
- Update advisor-only fields
- Add notes/recommendations
- Mark recommendation or outcome ready if workflow permits
- Request more information
- Cannot see unassigned customer records by default
- Cannot perform full platform admin actions unless also assigned RBP Admin
```

### Typical Users

```text
Decision Desk advisor
Risk Advisor specialist
Business consultant
Document/recommendation reviewer
```

### Backend Notes

Advisor access should be assignment-based, not global.

---

## 6.7 RBP Marketplace Seller

### Description

User permitted to create and manage marketplace listings.

### Typical Capabilities

```text
- Create marketplace listing drafts
- Submit listings for review
- Upload listing media
- View own listings
- Update own draft or rejected listings
- View enquiries for own listings where permitted
- Cannot approve or publish own listings
- Cannot view other sellers' private listing management data
```

### Typical Users

```text
Vendor
Business seller
Partner listing owner
```

### Backend Notes

Seller role may be combined with `RBP Member` or `Website User` depending on marketplace access rules.

---

## 6.8 RBP Marketplace Buyer

### Description

User permitted to make marketplace enquiries or purchases where supported.

### Typical Capabilities

```text
- View public/available marketplace listings
- Submit buyer enquiries
- View own enquiries
- Update own enquiry drafts if supported
- Cannot edit listings
- Cannot see seller-private data
- Cannot access admin review
```

### Typical Users

```text
Prospective buyer
Registered buyer
Member seeking marketplace services
```

---

## 6.9 RBP Support Agent

### Description

Operational support user who assists customers but does not have full system administration authority.

### Typical Capabilities

```text
- View support-relevant records
- View assigned or queued requests
- Request more information
- Update support notes
- Assist with workflow handling where permitted
- View relevant file references
- Cannot change platform configuration
- Cannot override payment state unless granted by admin
- Cannot bypass tenant isolation
```

### Typical Users

```text
Customer support
Operations assistant
Service coordinator
Provisioning support
```

### Backend Notes

Support Agent permissions should be carefully separated from `RBP Admin`.

---

## 6.10 RBP Admin

### Description

Platform admin role for RBP operational staff.

### Typical Capabilities

```text
- View all RBP operational records
- Review submitted service requests
- Assign advisors
- Approve or reject marketplace listings
- Manage workflow states
- Request more information
- View payment event records
- View file references according to admin visibility
- Manage notifications and operational actions
- Access admin dashboard
```

### Typical Users

```text
RBP operations manager
Platform administrator
Service delivery lead
```

### Backend Notes

`RBP Admin` is powerful, but still custom-platform scoped. It should not automatically equal Frappe `Administrator`.

---

## 6.11 System Manager

### Description

Standard Frappe system role with broad application management capability.

### Typical Capabilities

```text
- Manage Frappe-level system configuration
- Manage users and roles where permitted
- Access broad system records
- Support app configuration
- Run administrative operations
```

### Backend Notes

This role is inherited from Frappe conventions. It should be treated as high-trust and limited to technical/platform operators.

---

## 6.12 Administrator

### Description

Top-level Frappe administrator account.

### Typical Capabilities

```text
- Full technical/system access
- Emergency platform access
- Installation/setup authority
- Can bypass normal business permissions where Frappe allows
```

### Backend Notes

This role should not be used for daily business operations.

If everyone becomes Administrator, the permission model has already lost the war and is just writing poetry in the ruins.

---

## 7. Role Hierarchy

The practical authority hierarchy is:

```text
Administrator
    ↓
System Manager
    ↓
RBP Admin
    ↓
RBP Support Agent / RBP Advisor
    ↓
RBP Business Owner
    ↓
RBP Member
    ↓
RBP Team Member
    ↓
RBP Marketplace Seller / RBP Marketplace Buyer
    ↓
Website User
    ↓
Guest
```

This hierarchy is not always linear. For example:

```text
RBP Advisor may have more access than RBP Business Owner for assigned advisory fields.
RBP Business Owner may have more tenant authority than RBP Advisor.
RBP Marketplace Seller may manage listings but not Decision Desk records.
RBP Marketplace Buyer may submit enquiries but not create listings.
```

Permission rules must therefore be action-based, tenant-scoped, and domain-specific rather than relying only on hierarchy.

---

## 8. Tenant and Ownership Model

### 8.1 Key Concepts

| Concept | Meaning |
|---|---|
| Tenant | Business/customer workspace, represented by `RBP Tenant` |
| Owner | Frappe document owner or creator |
| Primary Owner | Main business owner for the tenant |
| Team Member | User connected to a tenant with limited authority |
| Assigned User | Advisor/support/admin user assigned to a record |
| Entitlement | Access granted by subscription, plan, or app setting |

### 8.2 Tenant Scoping Rules

```text
Guest:
  No tenant access.

Website User:
  Own records only unless linked to tenant.

RBP Member:
  Own records plus tenant/team records according to membership rules.

RBP Business Owner:
  Tenant-wide access for the business account, except internal/admin-only records.

RBP Team Member:
  Tenant records only where shared, assigned, or allowed by owner/team policy.

RBP Advisor:
  Assigned records only, across tenants only when explicitly assigned.

RBP Support Agent:
  Support queue, assigned records, or operationally permitted records.

RBP Admin:
  All RBP records for operations.

System Manager / Administrator:
  System-level access.
```

### 8.3 Tenant Isolation Rule

No user may access records from another tenant unless:

```text
- they are RBP Admin, System Manager, or Administrator
- they are RBP Advisor assigned to that record
- they are RBP Support Agent assigned or permitted to that support context
- a deliberate cross-tenant/shared-marketplace rule exists
```

Tenant isolation must be enforced server-side. A hidden frontend button is not security. It is theatre.

---

## 9. Global Role Capability Matrix

| Capability | Guest | Website User | RBP Member | Business Owner | Team Member | Advisor | Seller | Buyer | Support Agent | RBP Admin | System Manager | Administrator |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| View public website | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Register / login | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Access portal | No | Limited | Yes | Yes | Yes | Limited | Limited | Limited | Limited | Yes | Yes | Yes |
| Access admin area | No | No | No | No | No | No | No | No | Limited | Yes | Yes | Yes |
| Create own drafts | Limited | Yes | Yes | Yes | Conditional | Assigned-only | Yes | Yes | Conditional | Yes | Yes | Yes |
| Read own records | No | Yes | Yes | Yes | Yes | Assigned-only | Yes | Yes | Assigned/queue | Yes | Yes | Yes |
| Read tenant records | No | No | Conditional | Yes | Conditional | No | No | No | Conditional | Yes | Yes | Yes |
| Update own drafts | No | Yes | Yes | Yes | Conditional | No | Yes | Yes | Conditional | Yes | Yes | Yes |
| Submit own records | No | Conditional | Yes | Yes | Conditional | Conditional | Yes | Yes | Conditional | Yes | Yes | Yes |
| Upload files | No | Conditional | Yes | Yes | Conditional | Assigned-only | Yes | Conditional | Conditional | Yes | Yes | Yes |
| View private files | No | Own only | Own/tenant | Tenant | Conditional | Assigned | Own listing/enquiry | Own enquiry | Assigned/queue | Yes | Yes | Yes |
| Manage membership | No | No | View only | Yes | No | No | No | No | No | Yes | Yes | Yes |
| View billing/payment summary | No | No | Own/limited | Yes | No | No | No | No | Conditional | Yes | Yes | Yes |
| Record payment event | No | No | No | No | No | No | No | No | No | Yes/System | Yes | Yes |
| Assign advisor | No | No | No | No | No | No | No | No | Conditional | Yes | Yes | Yes |
| Admin review records | No | No | No | No | No | No | No | No | Conditional | Yes | Yes | Yes |
| Approve/reject listings | No | No | No | No | No | No | No | No | No | Yes | Yes | Yes |
| Configure system | No | No | No | No | No | No | No | No | No | Limited | Yes | Yes |

Legend:

```text
Yes = allowed by default if record context matches
No = not allowed
Limited = allowed only for constrained screens/actions
Conditional = allowed only if tenant, assignment, entitlement, or workflow rules permit
Assigned-only = allowed only for records assigned to that user
System = allowed through payment/webhook/system process, not normal user UI
```

---

## 10. Product Domain Role Matrix

## 10.1 Membership

| Action | Guest | Website User | RBP Member | Business Owner | Team Member | Support Agent | RBP Admin | System Manager |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| View plans | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Start signup | Yes | Yes | Yes | Yes | Conditional | No | Yes | Yes |
| Create business profile | Conditional | Yes | Yes | Yes | No | Conditional | Yes | Yes |
| Create tenant | No | Conditional | Conditional | Yes | No | No | Yes | Yes |
| View membership status | No | Own | Own | Tenant | Conditional | Conditional | All | All |
| Manage subscription | No | No | Limited | Yes | No | No | Yes | Yes |
| Cancel subscription | No | No | No | Yes | No | No | Yes | Yes |
| View payment history | No | No | Own | Tenant | No | Conditional | All | All |

## 10.2 Decision Desk

| Action | Guest | Website User | RBP Member | Business Owner | Team Member | Advisor | Support Agent | RBP Admin |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| View service page | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Create draft request | No | Conditional | Yes | Yes | Conditional | No | Yes | Yes |
| Update draft request | No | Own | Own | Tenant | Conditional | No | Conditional | Yes |
| Submit request | No | Conditional | Yes | Yes | Conditional | No | Conditional | Yes |
| View submitted request | No | Own | Own/Tenant | Tenant | Conditional | Assigned | Assigned/Queue | All |
| Attach supporting file | No | Own draft | Own/Tenant | Tenant | Conditional | Assigned | Assigned/Queue | All |
| Assign advisor | No | No | No | No | No | No | Conditional | Yes |
| Add recommendation | No | No | No | No | No | Assigned | No | Yes |
| Mark recommendation ready | No | No | No | No | No | Assigned | No | Yes |
| Close request | No | No | Own/conditional | Tenant/conditional | No | Assigned/conditional | Conditional | Yes |

## 10.3 DocuShare

| Action | Guest | Website User | RBP Member | Business Owner | Team Member | Advisor/Reviewer | Support Agent | RBP Admin |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| View service page | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Create document brief draft | No | Conditional | Yes | Yes | Conditional | No | Conditional | Yes |
| Update draft brief | No | Own | Own/Tenant | Tenant | Conditional | No | Conditional | Yes |
| Submit brief | No | Conditional | Yes | Yes | Conditional | No | Conditional | Yes |
| Attach reference files | No | Own draft | Own/Tenant | Tenant | Conditional | Assigned | Conditional | Yes |
| View submitted brief | No | Own | Own/Tenant | Tenant | Conditional | Assigned | Assigned/Queue | All |
| Update review/admin fields | No | No | No | No | No | Assigned | Conditional | Yes |
| Close brief | No | No | Conditional | Conditional | No | Assigned/conditional | Conditional | Yes |

## 10.4 Marketplace

| Action | Guest | Website User | RBP Member | Seller | Buyer | Business Owner | Support Agent | RBP Admin |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| View public listings | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Submit buyer enquiry | Conditional | Yes | Yes | Yes | Yes | Yes | Conditional | Yes |
| View own enquiries | No | Own | Own | Own | Own | Tenant | Conditional | All |
| Create listing draft | No | Conditional | Conditional | Yes | No | Yes | Conditional | Yes |
| Upload listing media | No | Conditional | Conditional | Yes | No | Yes | Conditional | Yes |
| Submit listing for review | No | Conditional | Conditional | Yes | No | Yes | Conditional | Yes |
| Update own draft/rejected listing | No | Conditional | Conditional | Yes | No | Yes | Conditional | Yes |
| Approve listing | No | No | No | No | No | No | No | Yes |
| Reject listing | No | No | No | No | No | No | No | Yes |
| Publish listing | No | No | No | No | No | No | No | Yes |
| Archive listing | No | No | Own/conditional | Own | No | Tenant | Conditional | Yes |

## 10.5 Connectivity / NBN

| Action | Guest | Website User | RBP Member | Business Owner | Team Member | Support Agent | RBP Admin |
|---|---:|---:|---:|---:|---:|---:|---:|
| View service page | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Run serviceability check | Conditional | Yes | Yes | Yes | Conditional | Conditional | Yes |
| Create order draft | No | Conditional | Yes | Yes | Conditional | Conditional | Yes |
| Submit order | No | Conditional | Yes | Yes | Conditional | Conditional | Yes |
| View order | No | Own | Own/Tenant | Tenant | Conditional | Assigned/Queue | All |
| Update provisioning/admin status | No | No | No | No | No | Conditional | Yes |
| Attach order documents | No | Own | Own/Tenant | Tenant | Conditional | Conditional | Yes |
| Cancel order | No | Conditional | Conditional | Yes | No | Conditional | Yes |

## 10.6 Risk Advisor

| Action | Guest | Website User | RBP Member | Business Owner | Team Member | Advisor | Support Agent | RBP Admin |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| View service page | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Create assessment draft | No | Conditional | Yes | Yes | Conditional | No | Conditional | Yes |
| Update assessment draft | No | Own | Own/Tenant | Tenant | Conditional | No | Conditional | Yes |
| Submit assessment | No | Conditional | Yes | Yes | Conditional | No | Conditional | Yes |
| View assessment | No | Own | Own/Tenant | Tenant | Conditional | Assigned | Assigned/Queue | All |
| Add advisor assessment notes | No | No | No | No | No | Assigned | No | Yes |
| Mark assessment complete | No | No | No | No | No | Assigned | Conditional | Yes |

## 10.7 The Fixer

| Action | Guest | Website User | RBP Member | Business Owner | Team Member | Support Agent | RBP Admin |
|---|---:|---:|---:|---:|---:|---:|---:|
| View service page | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Create fixer request draft | No | Conditional | Yes | Yes | Conditional | Conditional | Yes |
| Update draft request | No | Own | Own/Tenant | Tenant | Conditional | Conditional | Yes |
| Submit request | No | Conditional | Yes | Yes | Conditional | Conditional | Yes |
| View request | No | Own | Own/Tenant | Tenant | Conditional | Assigned/Queue | All |
| Update operational status | No | No | No | No | No | Conditional | Yes |
| Attach supporting files | No | Own | Own/Tenant | Tenant | Conditional | Conditional | Yes |
| Close request | No | Conditional | Conditional | Tenant/conditional | No | Conditional | Yes |

---

## 11. Route Access Matrix

## 11.1 Public Routes

| Route Group | Guest | Website User | RBP Member | Admin Roles |
|---|---:|---:|---:|---:|
| Public home/about pages | Yes | Yes | Yes | Yes |
| On-demand service pages | Yes | Yes | Yes | Yes |
| Membership pages | Yes | Yes | Yes | Yes |
| Marketplace public pages | Yes | Yes | Yes | Yes |
| Legal pages | Yes | Yes | Yes | Yes |
| Confirmation pages | Conditional | Conditional | Conditional | Conditional |

## 11.2 Portal Routes

| Route Group | Guest | Website User | RBP Member | Business Owner | Team Member | Advisor | Support Agent | RBP Admin |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/portal` | No | Limited | Yes | Yes | Yes | Limited | Limited | Yes |
| `/portal/dashboard` | No | Limited | Yes | Yes | Yes | Limited | Limited | Yes |
| `/portal/requests` | No | Own | Own/Tenant | Tenant | Conditional | Assigned | Assigned/Queue | All |
| `/portal/documents` | No | Own | Own/Tenant | Tenant | Conditional | Assigned | Assigned/Queue | All |
| `/portal/billing` | No | No | Limited | Yes | No | No | Conditional | Yes |
| `/portal/notifications` | No | Own | Own/Tenant | Tenant | Conditional | Assigned | Assigned/Queue | All |

## 11.3 Admin Routes

| Route Group | Guest | Website User | RBP Member | Advisor | Support Agent | RBP Admin | System Manager | Administrator |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/admin` | No | No | No | No | Limited | Yes | Yes | Yes |
| `/admin/dashboard` | No | No | No | No | Limited | Yes | Yes | Yes |
| `/admin/decision-desk` | No | No | No | Assigned-only | Conditional | Yes | Yes | Yes |
| `/admin/documents` | No | No | No | Assigned-only | Conditional | Yes | Yes | Yes |
| `/admin/marketplace` | No | No | No | No | Conditional | Yes | Yes | Yes |
| `/admin/connectivity` | No | No | No | No | Conditional | Yes | Yes | Yes |
| `/admin/risk-advisor` | No | No | No | Assigned-only | Conditional | Yes | Yes | Yes |
| `/admin/fixer` | No | No | No | No | Conditional | Yes | Yes | Yes |

---

## 12. Workflow Transition Role Matrix

Generic workflow:

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

Optional workflow states:

```text
Payment Pending
Payment Failed
More Information Required
Rejected
Cancelled
Archived
```

| Transition | Website User | RBP Member | Business Owner | Team Member | Advisor | Support Agent | RBP Admin | System Manager |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Create Draft | Yes | Yes | Yes | Conditional | No | Conditional | Yes | Yes |
| Draft → Submitted | Conditional | Yes | Yes | Conditional | No | Conditional | Yes | Yes |
| Submitted → In Review | No | No | No | No | No | Conditional | Yes | Yes |
| In Review → Assigned | No | No | No | No | No | Conditional | Yes | Yes |
| Assigned → In Progress | No | No | No | No | Assigned | Conditional | Yes | Yes |
| In Progress → Outcome Ready | No | No | No | No | Assigned | Conditional | Yes | Yes |
| Outcome Ready → Closed | Conditional | Conditional | Conditional | No | Conditional | Conditional | Yes | Yes |
| Any → More Information Required | No | No | No | No | Assigned | Conditional | Yes | Yes |
| More Information Required → Submitted | Conditional | Yes | Yes | Conditional | No | Conditional | Yes | Yes |
| Any → Rejected | No | No | No | No | No | Conditional | Yes | Yes |
| Any → Cancelled | Own/conditional | Own/conditional | Tenant/conditional | No | No | Conditional | Yes | Yes |
| Any → Archived | No | No | No | No | No | Conditional | Yes | Yes |

Domain-specific workflow contracts may narrow these rules.

---

## 13. File Access Role Matrix

File visibility values:

```text
private_to_owner
tenant_visible
advisor_visible
admin_only
public
```

| File Visibility | Guest | Website User | RBP Member | Business Owner | Team Member | Advisor | Support Agent | RBP Admin | System Manager |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `public` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| `private_to_owner` | No | Owner only | Owner only | Owner/Tenant policy | Owner/conditional | No | Conditional | Yes | Yes |
| `tenant_visible` | No | No | Tenant | Tenant | Conditional | No | Conditional | Yes | Yes |
| `advisor_visible` | No | No | Conditional | Conditional | No | Assigned | Conditional | Yes | Yes |
| `admin_only` | No | No | No | No | No | No | Conditional | Yes | Yes |

File access must also check:

```text
related_doctype
related_name
tenant
owner
uploaded_by
visibility
assignment
workflow_state
```

---

## 14. Payment and Billing Role Matrix

| Action | Guest | Website User | RBP Member | Business Owner | Team Member | Support Agent | RBP Admin | System Manager |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| View plan pricing | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Start payment | Conditional | Yes | Yes | Yes | No | No | Conditional | Yes |
| View own payment result | No | Own | Own | Tenant | No | Conditional | All | All |
| View subscription | No | No | Own/Limited | Tenant | No | Conditional | All | All |
| Manage subscription | No | No | No | Yes | No | No | Yes | Yes |
| Record payment event | No | No | No | No | No | No | Yes/System | Yes/System |
| Reconcile payment issue | No | No | No | No | No | Conditional | Yes | Yes |
| View raw payment payload | No | No | No | No | No | No | Conditional | Yes |

Payment state must never be trusted from the frontend. Frontend payment result screens may display status, but backend payment events must be authoritative.

---

## 15. Notification Role Matrix

| Action | Guest | Website User | RBP Member | Business Owner | Team Member | Advisor | Support Agent | RBP Admin |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Receive public confirmation | Conditional | Yes | Yes | Yes | Conditional | No | No | No |
| View own notifications | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| View tenant notifications | No | No | Conditional | Yes | Conditional | No | Conditional | Yes |
| Create notification manually | No | No | No | No | No | No | Conditional | Yes |
| Trigger system notification | No | No | No | No | No | Conditional | Conditional | Yes |
| Manage notification templates | No | No | No | No | No | No | No | Yes/System Manager |

Notification triggers must be created server-side from workflow, payment, file, or admin actions.

---

## 16. Audit Log Role Matrix

| Action | Guest | Website User | RBP Member | Business Owner | Team Member | Advisor | Support Agent | RBP Admin | System Manager |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Create audit log | System | System | System | System | System | System | System | System | System |
| View own audit entries | No | No | Limited | Limited | No | No | No | Yes | Yes |
| View tenant audit entries | No | No | No | Conditional | No | No | Conditional | Yes | Yes |
| View all RBP audit logs | No | No | No | No | No | No | No | Yes | Yes |
| Delete audit logs | No | No | No | No | No | No | No | No | Administrator only |

Audit logs should not be editable by normal users. That would somewhat defeat the purpose, in the way removing brakes improves the aesthetic of a car.

---

## 17. Role Assignment Rules

## 17.1 Manual Assignment

| Role | Who Can Assign |
|---|---|
| Website User | System/auth process |
| RBP Member | RBP Admin, System Manager, membership activation process |
| RBP Business Owner | RBP Admin, System Manager, membership/tenant creation process |
| RBP Team Member | RBP Business Owner if enabled, RBP Admin, System Manager |
| RBP Advisor | RBP Admin, System Manager |
| RBP Marketplace Seller | RBP Admin, System Manager, approved seller onboarding process |
| RBP Marketplace Buyer | System/auth process, RBP Admin |
| RBP Support Agent | RBP Admin, System Manager |
| RBP Admin | System Manager, Administrator |
| System Manager | Administrator |
| Administrator | System/bootstrap only |

## 17.2 Automatic Assignment Events

| Event | Role Assignment |
|---|---|
| User registers | Website User |
| Membership payment completes | RBP Member |
| Business profile/tenant is created from membership | RBP Business Owner for primary user |
| Business owner invites team member | RBP Team Member |
| Marketplace seller onboarding approved | RBP Marketplace Seller |
| Buyer account/enquiry created | RBP Marketplace Buyer where needed |
| Advisor is onboarded internally | RBP Advisor |
| Support operator is onboarded internally | RBP Support Agent |

## 17.3 Revocation Events

| Event | Role Impact |
|---|---|
| Subscription cancelled | Remove or suspend RBP Member entitlements according to business rules |
| User removed from tenant | Remove tenant-specific Team Member access |
| Advisor removed from assignment | Remove access to assigned records unless admin role applies |
| Seller suspended | Disable seller listing creation/update |
| Admin user offboarded | Remove RBP Admin/System Manager role immediately |
| Payment failed | Do not automatically remove all roles unless contract says so; update entitlement/payment state first |

Role revocation must not delete historical records. It should restrict future access while preserving auditability.

---

## 18. Entitlement Relationship

Roles and entitlements are related but not identical.

| Concept | Meaning |
|---|---|
| Role | What type of user this is |
| Entitlement | What products/apps/services the user or tenant can access |
| Permission | What action the user may perform on a specific record |
| Workflow Rule | What state transition the user may perform |

Example:

```text
A user may have RBP Member role but not have entitlement to a premium service.
A user may have RBP Marketplace Seller role but cannot publish listings without admin approval.
A user may be RBP Advisor but only access records assigned to them.
```

Entitlement checks should be handled by backend service logic, not frontend assumptions.

---

## 19. Frappe Implementation Notes

Phase 3 implementation should map this matrix into Frappe using:

```text
- Role records
- DocType permissions
- User Permission records where appropriate
- tenant filtering
- owner filtering
- assignment checks
- custom permission query conditions
- workflow transition rules
- route guards
- API service-layer checks
```

Recommended backend modules:

```text
rbp_app/
└── rbp_app/
    ├── permissions.py
    ├── guards.py
    ├── services/
    │   ├── tenancy.py
    │   ├── entitlements.py
    │   ├── audit.py
    │   └── files.py
    └── api/
        ├── me.py
        └── portal.py
```

### 19.1 API Enforcement

API modules must:

```text
Validate user session.
Validate arguments.
Call service layer.
Return standard response envelope.
Avoid business logic in API methods.
Avoid direct database logic where service layer should own it.
Enforce permissions at API and DocType level.
```

### 19.2 Service-Layer Enforcement

Service modules must:

```text
Resolve current user.
Resolve tenant.
Check role.
Check entitlement.
Check ownership.
Check assignment.
Check workflow state.
Check file visibility.
Record audit log where relevant.
Return safe DTO only.
```

### 19.3 Frontend Enforcement

Frontend may hide or disable actions based on role, but frontend checks are convenience only.

Backend must remain authoritative. The browser is not a courthouse.

---

## 20. API User Context Contract

The frontend should be able to request the current user context from:

```text
GET /api/method/rbp_app.api.me.get_context
```

Suggested response data:

```json
{
  "user": {
    "id": "user@example.com",
    "full_name": "Example User",
    "email": "user@example.com",
    "roles": [
      "website_user",
      "rbp_member",
      "rbp_business_owner"
    ]
  },
  "tenant": {
    "name": "RBP-TENANT-0001",
    "display_name": "Example Business",
    "role_in_tenant": "owner"
  },
  "entitlements": [
    "membership",
    "decision_desk",
    "docushare"
  ],
  "permissions": {
    "can_access_portal": true,
    "can_access_admin": false,
    "can_manage_billing": true,
    "can_create_decision_desk_request": true,
    "can_create_marketplace_listing": false
  }
}
```

This endpoint should not expose sensitive internal permission logic. It should provide safe UI-facing flags.

---

## 21. Error Handling for Role/Permission Failures

Role and permission errors must use the standard API response envelope.

### 21.1 Not Authenticated

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

### 21.2 Permission Denied

```json
{
  "ok": false,
  "data": null,
  "message": "Permission denied",
  "errors": [
    {
      "field": null,
      "code": "permission_denied",
      "message": "You do not have permission to access this record."
    }
  ],
  "meta": {
    "request_id": "uuid"
  }
}
```

### 21.3 Entitlement Required

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

## 22. Security Requirements

The role model must support these security requirements:

```text
No guest access to portal records.
No cross-tenant data leakage.
No unauthorised admin routes.
No client-side-only permission enforcement.
CSRF/session handling works.
Uploaded files are not publicly exposed unless intended.
Payment webhook/event handling is idempotent.
Sensitive fields are not returned to frontend unnecessarily.
```

Additional role-specific rules:

```text
RBP Advisor cannot browse all tenant records.
RBP Support Agent cannot silently become RBP Admin.
RBP Business Owner cannot override admin review workflows.
RBP Marketplace Seller cannot approve their own listings.
RBP Team Member cannot manage subscription billing by default.
Website User cannot access member-only services without entitlement.
Guest cannot call authenticated APIs unless explicitly whitelisted.
```

---

## 23. QA Requirements

The QA plan must include role-based tests.

### 23.1 Backend Permission Tests

```text
test_guest_cannot_access_portal_records
test_website_user_can_read_own_record_only
test_rbp_member_can_create_member_request
test_business_owner_can_view_tenant_records
test_team_member_cannot_view_unshared_tenant_record
test_advisor_can_view_assigned_record
test_advisor_cannot_view_unassigned_record
test_support_agent_can_view_assigned_queue_record
test_marketplace_seller_cannot_approve_own_listing
test_rbp_admin_can_admin_review_record
test_cross_tenant_access_is_blocked
test_private_file_visibility_is_enforced
test_admin_only_file_blocked_from_member
test_payment_event_raw_payload_not_visible_to_member
```

### 23.2 Frontend Route Guard Tests

```text
guest_is_redirected_from_portal
website_user_sees_limited_onboarding_portal
member_can_access_portal_dashboard
business_owner_can_access_billing_view
team_member_cannot_access_billing_by_default
advisor_can_access_assigned_work_queue
support_agent_can_access_support_queue
admin_can_access_admin_dashboard
seller_can_access_listing_management
buyer_can_access_own_enquiries
```

### 23.3 End-to-End Role Tests

```text
guest_to_membership_purchase_to_business_owner
member_submits_decision_desk_request
admin_assigns_advisor
advisor_adds_recommendation
member_views_recommendation_ready_status
seller_submits_marketplace_listing
admin_approves_marketplace_listing
buyer_submits_marketplace_enquiry
business_owner_invites_team_member
team_member_access_is_limited_to_tenant_policy
```

---

## 24. Role Matrix Completion Checklist

This role matrix is complete when:

```text
All platform roles are listed.
Each role has a clear business meaning.
Each role has a canonical Frappe label.
Each role has a canonical API value.
Role hierarchy and exceptions are defined.
Tenant and ownership rules are defined.
Global capability matrix is defined.
Product domain role matrices are defined.
Route access rules are defined.
Workflow transition access is defined.
File visibility access is defined.
Payment and billing access is defined.
Notification access is defined.
Audit log access is defined.
Role assignment and revocation rules are defined.
Entitlement relationship is defined.
Frappe implementation notes are defined.
Permission error handling is defined.
Security requirements are defined.
QA requirements are defined.
```

---

## 25. Phase 2 Acceptance Criteria

For Phase 2 sign-off, this document must support the following:

```text
Every role has permissions defined.
Every Phase 1 screen can be mapped to role-based access.
Every product flow can identify who can create, submit, review, and close records.
Every workflow can identify who can move records between states.
Every file upload can identify who can upload, view, and administer files.
Every payment touchpoint can identify who can view or administer payment state.
Every notification can identify sender, recipient, and visibility.
Every admin action can identify who is authorised to perform it.
Frappe build can begin without guessing role authority.
```

---

## 26. Open Items for Final Phase 2 Lock

These items should be confirmed after Phase 1 UI/UX is complete:

| Item | Status | Notes |
|---|---|---|
| Final portal route list | Draft | Depends on Phase 1 route audit |
| Final admin route list | Draft | Depends on admin UI concepts |
| Whether Team Members can submit all services | Draft | Business rule needed |
| Whether Marketplace Seller requires active membership | Draft | Product/commercial rule needed |
| Whether Buyers can remain Guest users | Draft | Marketplace rule needed |
| Whether Support Agents can trigger workflow transitions | Draft | Operational rule needed |
| Whether Business Owner can close service requests | Draft | Workflow rule needed |
| Exact entitlement-to-service mapping | Draft | Depends on membership/product packaging |
| Billing visibility for non-owner members | Draft | Business rule needed |
| Advisor access to files by visibility type | Draft | Final file contract needed |

---

## 27. Final Rule

A user action is allowed only when all required checks pass:

```text
Authenticated, unless public action
+ Correct role
+ Correct tenant
+ Correct ownership or assignment
+ Correct entitlement
+ Correct workflow state
+ Correct file/payment/notification visibility
+ Correct API permission
= Action allowed
```

If one of those checks fails, the backend must deny the action.

Not the UI. Not a hidden button. Not a hopeful comment in the code. The backend.
