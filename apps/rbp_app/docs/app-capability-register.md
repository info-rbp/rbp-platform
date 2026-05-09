# RBP App Capability Register

## Purpose

This document defines how the RBP master application will use installed Frappe applications as backend capability providers.

The goal is to create one unified, white-labelled RBP platform that uses selected Frappe apps as core backend modules while also reusing supporting Frappe apps for shared capabilities across the platform.

This document focuses on **backend capability architecture**, not frontend UX/UI.

## Core Principle

The platform must follow this model:

```text
Frappe apps provide capability.
rbp_app controls access, tenancy, subscriptions, entitlements, orchestration and API contracts.
The frontend controls the customer experience.
```

The RBP master application should not become nine disconnected products stitched together with a logo. That is not a platform. That is a software quilt with trust issues.

Instead:

```text
ERPNext, Frappe HR, Learning, Insights, CRM, Helpdesk, Lending, Gameplan and Drive
= primary white-labelled backend modules

Other installed Frappe apps
= supporting backend capabilities

rbp_app
= orchestration, access control, entitlement, tenant context, API and workflow layer
```

---

# Primary White-Labelled Applications

The following apps are the first-class modules for the RBP master application.

| RBP Module | Frappe App | App Key | Category | Role |
|---|---|---|---|---|
| Operations | ERPNext | `erpnext` | Operations | Primary module |
| People | Frappe HR / HRMS | `hrms` | People | Primary module |
| Learning | LMS | `lms` | Learning | Primary module |
| Analytics | Insights | `insights` | Analytics | Primary module and shared analytics service |
| Sales | CRM | `crm` | Sales | Primary module |
| Support | Helpdesk | `helpdesk` | Support | Primary module |
| Lending | Lending | `lending` | Finance | Primary specialist module |
| Collaboration | Gameplan | `gameplan` | Collaboration | Primary module |
| Documents | Drive | `drive` | Documents | Primary module and shared document service |

---

# Supporting Applications

The following apps should initially be treated as backend capability providers, not standalone customer modules.

| App | App Key | Primary Capability | Used By |
|---|---|---|---|
| Payments | `payments` | Payment requests, payment providers, billing records | Billing, ERPNext, Lending, Webshop |
| Mail | `mail` | Email sending, receiving, threading | CRM, Helpdesk, HRMS, Learning, Billing |
| Frappe WhatsApp | `frappe_whatsapp` | WhatsApp messages and notifications | CRM, Helpdesk, HRMS, Lending |
| Telephony | `telephony` | Calls, call logs, phone workflows | CRM, Helpdesk |
| Meet | `meet` | Video meetings and meeting links | CRM, Helpdesk, Learning, Gameplan |
| Wiki | `wiki` | Knowledge base and documentation | Helpdesk, Learning, HRMS, Support |
| Blog | `blog` | Content publishing | Marketing, Learning, public content |
| Newsletter | `newsletter` | Broadcast emails and campaigns | CRM, Learning, Marketing |
| Webshop | `webshop` | Ecommerce storefront | ERPNext, Payments, CRM |
| Ecommerce Integrations | `ecommerce_integrations` | Commerce platform sync | ERPNext, Webshop |
| Education | `education` | Academic and student workflows | Learning, education-sector clients |
| School Automations | `school_automations` | School automation workflows | Education, Learning |
| Assignment Portal | `ff_assignment_portal` | Assignment submissions and learning tasks | Learning, Education |
| SaaS Helper | `fc_saas_helper` | SaaS account lifecycle and provisioning support | Tenant provisioning, billing |
| OpenAI Integration | `frappe_openai_integration` | AI summaries, drafts, assistant workflows | CRM, Helpdesk, HRMS, Learning, Drive |
| ERPNext Australian Localisation | `erpnext_australian_localisation` | Australian accounting/tax localisation | ERPNext, Billing |
| Business Hub | `business_hub` | Requires source review | To be classified |

---

# Backend Capability Taxonomy

Capabilities should be described consistently across all apps.

## Operations

Used primarily by ERPNext.

```text
company_management
customer_management
supplier_management
sales_orders
purchase_orders
sales_invoices
purchase_invoices
inventory_management
item_management
project_management
task_management
asset_management
accounting
tax_compliance
regional_localisation
```

## People

Used primarily by Frappe HR / HRMS.

```text
employee_management
leave_management
attendance_tracking
payroll
expense_claims
recruitment
performance_management
shift_management
employee_onboarding
employee_documents
```

## Learning

Used primarily by LMS, Education and Assignment Portal.

```text
course_management
lesson_management
batch_management
enrolment_tracking
learning_progress
quizzes
assignments
training_paths
certifications
student_management
academic_management
```

## Analytics

Used primarily by Insights.

```text
dashboards
reports
charts
data_exploration
cross_app_reporting
kpi_tracking
embedded_analytics
analytics_events
```

## Sales

Used primarily by CRM.

```text
lead_management
deal_management
pipeline_management
contact_management
organisation_management
sales_activity_tracking
customer_communication
sales_documents
sales_meetings
```

## Support

Used primarily by Helpdesk.

```text
ticket_management
support_queues
sla_tracking
agent_assignment
customer_support_portal
knowledge_base
ticket_attachments
support_email
support_ai_drafts
```

## Lending

Used primarily by Lending.

```text
loan_applications
loan_accounts
repayment_tracking
borrower_management
loan_documents
payment_collection
lending_reporting
```

## Collaboration

Used primarily by Gameplan.

```text
team_collaboration
project_discussions
planning_boards
meeting_links
project_documents
team_notifications
```

## Documents

Used primarily by Drive.

```text
file_storage
folder_management
document_upload
document_download
document_sharing
record_attachments
document_permissions
client_document_exchange
```

## Communications

Used by Mail, WhatsApp, Telephony, Meet and Newsletter.

```text
email_send
email_receive
email_threading
whatsapp_send
call_logging
video_meetings
broadcast_messaging
transactional_notifications
```

## Ecommerce

Used by Webshop, Ecommerce Integrations, ERPNext and Payments.

```text
storefront
cart
products
orders
commerce_sync
payment_collection
customer_checkout
```

## AI and Automation

Used by OpenAI Integration and cross-app workflow services.

```text
text_summarisation
draft_generation
document_summarisation
ticket_reply_suggestions
lead_summary
workflow_recommendations
```

---

# Primary Module Register

## ERPNext

### App Key

```text
erpnext
```

### Classification

```text
Primary white-labelled module
```

### RBP Module

```text
Operations
```

### Core Backend Functionality

ERPNext provides backend capability for:

- companies
- customers
- suppliers
- items
- inventory
- sales orders
- purchase orders
- sales invoices
- purchase invoices
- projects
- tasks
- assets
- accounting
- financial operations

### Capabilities Provided

```text
company_management
customer_management
supplier_management
sales_orders
purchase_orders
sales_invoices
purchase_invoices
inventory_management
item_management
project_management
task_management
asset_management
accounting
tax_compliance
```

### Supporting Capabilities Consumed

| Supporting App | Capability |
|---|---|
| Payments | payment requests and payment status |
| Drive | business documents and attachments |
| Insights | financial and operational dashboards |
| Mail | invoice and customer emails |
| Webshop | ecommerce orders |
| Ecommerce Integrations | external commerce sync |
| Australian Localisation | local accounting/tax support |

### Initial Adapter File

```text
rbp_app/rbp_app/services/adapters/erpnext.py
```

### Initial Summary Fields

The first adapter should expose aggregate-only counts:

```text
companies_count
customers_count
suppliers_count
items_count
sales_invoices_count
purchase_invoices_count
projects_count
tasks_count
```

### Data Exposure Rules

Do not expose:

- ledger details
- bank account information
- invoice line items
- supplier financial details
- customer private details
- tax-sensitive records

unless tenant, role and Frappe permissions explicitly allow it.

---

## Frappe HR / HRMS

### App Key

```text
hrms
```

### Classification

```text
Primary white-labelled module
```

### RBP Module

```text
People
```

### Core Backend Functionality

Frappe HR provides backend capability for:

- employee records
- leave
- attendance
- payroll
- expense claims
- recruitment
- shifts
- performance
- employee lifecycle management

### Capabilities Provided

```text
employee_management
leave_management
attendance_tracking
payroll
expense_claims
recruitment
performance_management
shift_management
employee_onboarding
employee_documents
```

### Supporting Capabilities Consumed

| Supporting App | Capability |
|---|---|
| Learning | employee onboarding and training |
| Drive | employee documents |
| Mail | employee communication |
| WhatsApp | reminders and HR notifications |
| Insights | HR analytics |
| ERPNext | payroll/accounting links |
| Gameplan | onboarding tasks |
| OpenAI Integration | policy summaries and draft content |

### Initial Adapter File

```text
rbp_app/rbp_app/services/adapters/hrms.py
```

### Initial Summary Fields

```text
employees_count
leave_applications_count
attendance_count
expense_claims_count
salary_slips_count
```

### Data Exposure Rules

Do not expose:

- employee personal data
- salary values
- leave reasons
- medical information
- private HR notes
- payroll records
- identity documents

Default summaries must be aggregate-only.

---

## Learning / LMS

### App Key

```text
lms
```

### Classification

```text
Primary white-labelled module
```

### RBP Module

```text
Learning
```

### Core Backend Functionality

Learning provides backend capability for:

- courses
- lessons
- batches
- enrolments
- quizzes
- assignments
- course progress
- training content

### Capabilities Provided

```text
course_management
lesson_management
batch_management
enrolment_tracking
learning_progress
quizzes
assignments
training_paths
certifications
```

### Supporting Capabilities Consumed

| Supporting App | Capability |
|---|---|
| HRMS | employee/student assignment context |
| Education | academic workflows |
| Assignment Portal | assignment submissions |
| Drive | course files and materials |
| Slides | training decks |
| Mail | course notifications |
| Meet | live learning sessions |
| Insights | learning analytics |
| OpenAI Integration | lesson summaries and quiz drafts |

### Initial Adapter File

```text
rbp_app/rbp_app/services/adapters/lms.py
```

### Initial Summary Fields

```text
courses_count
lessons_count
batches_count
enrolments_count
active_courses_count
```

### Data Exposure Rules

Do not expose learner progress broadly.

Progress should be scoped to:

```text
current user
tenant
manager/admin role
Frappe record permissions
```

---

## Insights

### App Key

```text
insights
```

### Classification

```text
Primary white-labelled module and shared analytics provider
```

### RBP Module

```text
Analytics
```

### Core Backend Functionality

Insights provides backend capability for:

- dashboards
- reports
- charts
- analytics
- data exploration
- cross-app reporting

### Capabilities Provided

```text
dashboards
reports
charts
data_exploration
cross_app_reporting
kpi_tracking
embedded_analytics
analytics_events
```

### Apps Supported By Insights

Insights should support analytics across:

```text
ERPNext
HRMS
CRM
Helpdesk
Lending
Learning
Gameplan
Drive
```

### Initial Adapter File

```text
rbp_app/rbp_app/services/adapters/insights.py
```

### Initial Summary Fields

```text
dashboards_count
reports_count
charts_count
```

### Shared Service File

```text
rbp_app/rbp_app/services/shared/analytics.py
```

### Shared Service Functions

```python
record_analytics_event(...)
get_module_kpis(...)
get_dashboard_links(...)
```

### Data Exposure Rules

Insights can expose sensitive cross-app data.

All Insights data must be controlled by:

```text
tenant
subscription
entitlement
user role
Frappe permission
dashboard/report permission
```

---

## CRM

### App Key

```text
crm
```

### Classification

```text
Primary white-labelled module
```

### RBP Module

```text
Sales
```

### Core Backend Functionality

CRM provides backend capability for:

- leads
- deals
- contacts
- organisations
- pipeline
- sales activity
- customer relationship management

### Capabilities Provided

```text
lead_management
deal_management
pipeline_management
contact_management
organisation_management
sales_activity_tracking
customer_communication
sales_documents
sales_meetings
```

### Supporting Capabilities Consumed

| Supporting App | Capability |
|---|---|
| Mail | sales emails and email history |
| WhatsApp | sales follow-ups |
| Telephony | call logging |
| Meet | sales meetings |
| Drive | proposals and sales documents |
| ERPNext | customers and invoices |
| Insights | sales analytics |
| OpenAI Integration | lead summaries and email drafts |
| Newsletter | campaigns |

### Initial Adapter File

```text
rbp_app/rbp_app/services/adapters/crm.py
```

### Initial Summary Fields

```text
leads_count
deals_count
contacts_count
organisations_count
open_deals_count
won_deals_count
```

### Data Exposure Rules

Do not expose:

- private contact details
- internal notes
- deal values
- full communication history

unless explicitly permission-controlled.

---

## Helpdesk

### App Key

```text
helpdesk
```

### Classification

```text
Primary white-labelled module
```

### RBP Module

```text
Support
```

### Core Backend Functionality

Helpdesk provides backend capability for:

- tickets
- support queues
- agents
- teams
- support SLAs
- priorities
- customer support workflows

### Capabilities Provided

```text
ticket_management
support_queues
sla_tracking
agent_assignment
customer_support_portal
ticket_attachments
```

### Supporting Capabilities Consumed

| Supporting App | Capability |
|---|---|
| Mail | ticket replies |
| WhatsApp | support notifications |
| Drive | ticket attachments |
| Wiki | knowledge suggestions |
| OpenAI Integration | support reply drafts |
| Insights | support analytics |
| Telephony | support calls |
| Meet | support meetings |

### Initial Adapter File

```text
rbp_app/rbp_app/services/adapters/helpdesk.py
```

### Initial Summary Fields

```text
tickets_count
open_tickets_count
resolved_tickets_count
overdue_tickets_count
high_priority_tickets_count
```

### Data Exposure Rules

Do not expose:

- internal agent notes
- private support comments
- tickets from other tenants
- unrelated attachments

Customer-facing support data must be scoped to the tenant and user.

---

## Lending

### App Key

```text
lending
```

### Classification

```text
Primary white-labelled specialist module
```

### RBP Module

```text
Lending
```

### Core Backend Functionality

Lending provides backend capability for:

- loan applications
- loan accounts
- repayments
- borrowers
- lending workflows
- loan documentation

### Capabilities Provided

```text
loan_applications
loan_accounts
repayment_tracking
borrower_management
loan_documents
payment_collection
lending_reporting
```

### Supporting Capabilities Consumed

| Supporting App | Capability |
|---|---|
| ERPNext | customer/accounting records |
| Payments | repayments and payment collection |
| Drive | loan documents |
| Mail | borrower communication |
| WhatsApp | repayment reminders |
| Insights | lending analytics |
| OpenAI Integration | document summaries |

### Initial Adapter File

```text
rbp_app/rbp_app/services/adapters/lending.py
```

### Initial Summary Fields

```text
loan_applications_count
loan_accounts_count
active_loans_count
overdue_loans_count
repayments_count
```

### Data Exposure Rules

Lending data is highly sensitive.

Do not expose:

- borrower personal details
- repayment amounts
- loan balances
- identity documents
- hardship notes
- credit-related information

without strict entitlement and permission checks.

---

## Gameplan

### App Key

```text
gameplan
```

### Classification

```text
Primary white-labelled module
```

### RBP Module

```text
Collaboration
```

### Core Backend Functionality

Gameplan provides backend capability for:

- collaboration
- projects
- discussions
- planning
- workspaces
- teams

### Capabilities Provided

```text
team_collaboration
project_discussions
planning_boards
team_notifications
project_documents
```

### Supporting Capabilities Consumed

| Supporting App | Capability |
|---|---|
| Drive | project files |
| Meet | project meetings |
| Mail | team notifications |
| Insights | collaboration analytics |
| HRMS | employee/team context |
| CRM | customer/project handover |
| Helpdesk | escalation projects |

### Initial Adapter File

```text
rbp_app/rbp_app/services/adapters/gameplan.py
```

### Initial Summary Fields

```text
projects_count
discussions_count
teams_count
open_items_count
```

### Data Exposure Rules

Project discussions may contain confidential information.

Default summaries should be aggregate-only.

---

## Drive

### App Key

```text
drive
```

### Classification

```text
Primary white-labelled module and shared document provider
```

### RBP Module

```text
Documents
```

### Core Backend Functionality

Drive provides backend capability for:

- files
- folders
- document storage
- document sharing
- attachments
- document organisation

### Capabilities Provided

```text
file_storage
folder_management
document_upload
document_download
document_sharing
record_attachments
document_permissions
client_document_exchange
```

### Apps Supported By Drive

Drive should support:

```text
ERPNext
HRMS
CRM
Helpdesk
Lending
Learning
Gameplan
Wiki
```

### Initial Adapter File

```text
rbp_app/rbp_app/services/adapters/drive.py
```

### Initial Summary Fields

```text
files_count
folders_count
recent_files_count
shared_files_count
```

### Shared Service File

```text
rbp_app/rbp_app/services/shared/documents.py
```

### Shared Service Functions

```python
attach_file_to_record(...)
get_files_for_record(...)
create_tenant_folder(...)
create_user_folder(...)
create_app_folder(...)
```

### Data Exposure Rules

Drive must enforce:

```text
tenant isolation
record-level permissions
folder permissions
file permissions
user roles
```

No cross-tenant file exposure is acceptable.

That should not need to be said, but here we are.

---

# Supporting Service Register

## Payments

### App Key

```text
payments
```

### Classification

```text
Supporting backend service
```

### Used By

```text
billing
erpnext
lending
webshop
subscriptions
```

### Shared Service File

```text
rbp_app/rbp_app/services/shared/payments.py
```

### Initial Functions

```python
create_payment_request(...)
get_payment_status(...)
sync_payment_result(...)
```

### Initial Behaviour

Return safe placeholder responses until provider-specific billing flows are implemented.

---

## Mail

### App Key

```text
mail
```

### Classification

```text
Supporting backend service
```

### Used By

```text
crm
helpdesk
hrms
learning
billing
lending
gameplan
```

### Shared Service File

```text
rbp_app/rbp_app/services/shared/mail.py
```

### Initial Functions

```python
send_email(...)
send_template_email(...)
get_email_threads_for_record(...)
```

### Initial Behaviour

Do not send live emails until configuration and permissions are confirmed.

---

## WhatsApp

### App Key

```text
frappe_whatsapp
```

### Classification

```text
Supporting backend service
```

### Used By

```text
crm
helpdesk
hrms
lending
billing
```

### Shared Service File

```text
rbp_app/rbp_app/services/shared/whatsapp.py
```

### Initial Functions

```python
send_whatsapp_message(...)
send_template_message(...)
```

### Initial Behaviour

Return safe placeholder responses until messaging credentials and templates are confirmed.

---

## Meet

### App Key

```text
meet
```

### Classification

```text
Supporting backend service
```

### Used By

```text
crm
helpdesk
learning
gameplan
hrms
```

### Shared Service File

```text
rbp_app/rbp_app/services/shared/meet.py
```

### Initial Functions

```python
create_meeting_link(...)
get_meetings_for_record(...)
```

---

## Wiki

### App Key

```text
wiki
```

### Classification

```text
Supporting backend service
```

### Used By

```text
helpdesk
learning
hrms
support
internal_admin
```

### Shared Service File

```text
rbp_app/rbp_app/services/shared/wiki.py
```

### Initial Functions

```python
search_knowledge_base(...)
get_article_suggestions(...)
link_article_to_ticket(...)
```

---

## AI

### App Key

```text
frappe_openai_integration
```

### Classification

```text
Supporting backend service
```

### Used By

```text
crm
helpdesk
hrms
learning
drive
lending
```

### Shared Service File

```text
rbp_app/rbp_app/services/shared/ai.py
```

### Initial Functions

```python
summarise_text(...)
draft_response(...)
summarise_document(...)
suggest_next_action(...)
```

### Initial Behaviour

All AI actions must be permission-controlled and auditable.

No private records should be sent into AI services without explicit design approval.

---

# Backend Files Planned

## Capability Registry

```text
rbp_app/rbp_app/services/capabilities.py
```

## Entitlement Service

```text
rbp_app/rbp_app/services/entitlements.py
```

## Adapter Base

```text
rbp_app/rbp_app/services/adapters/base.py
```

## Primary App Adapters

```text
rbp_app/rbp_app/services/adapters/erpnext.py
rbp_app/rbp_app/services/adapters/hrms.py
rbp_app/rbp_app/services/adapters/lms.py
rbp_app/rbp_app/services/adapters/insights.py
rbp_app/rbp_app/services/adapters/crm.py
rbp_app/rbp_app/services/adapters/helpdesk.py
rbp_app/rbp_app/services/adapters/lending.py
rbp_app/rbp_app/services/adapters/gameplan.py
rbp_app/rbp_app/services/adapters/drive.py
```

## Shared Services

```text
rbp_app/rbp_app/services/shared/__init__.py
rbp_app/rbp_app/services/shared/documents.py
rbp_app/rbp_app/services/shared/mail.py
rbp_app/rbp_app/services/shared/whatsapp.py
rbp_app/rbp_app/services/shared/meet.py
rbp_app/rbp_app/services/shared/payments.py
rbp_app/rbp_app/services/shared/wiki.py
rbp_app/rbp_app/services/shared/analytics.py
rbp_app/rbp_app/services/shared/ai.py
rbp_app/rbp_app/services/shared/audit.py
rbp_app/rbp_app/services/shared/notifications.py
```

## Workflow Services

```text
rbp_app/rbp_app/services/workflows/__init__.py
rbp_app/rbp_app/services/workflows/onboarding.py
rbp_app/rbp_app/services/workflows/sales.py
rbp_app/rbp_app/services/workflows/support.py
rbp_app/rbp_app/services/workflows/lending.py
rbp_app/rbp_app/services/workflows/collaboration.py
rbp_app/rbp_app/services/workflows/documents.py
rbp_app/rbp_app/services/workflows/billing.py
```

## APIs

```text
rbp_app/rbp_app/api/capabilities.py
rbp_app/rbp_app/api/workflows.py
```

Existing APIs should continue to be used:

```text
rbp_app/rbp_app/api/apps.py
rbp_app/rbp_app/api/integrations.py
rbp_app/rbp_app/api/dashboard.py
rbp_app/rbp_app/api/billing.py
rbp_app/rbp_app/api/documents.py
rbp_app/rbp_app/api/notifications.py
rbp_app/rbp_app/api/me.py
```

---

# Implementation Order

## Phase 1: Capability Registry

Create:

```text
rbp_app/rbp_app/services/capabilities.py
rbp_app/rbp_app/tests/test_capabilities.py
```

Acceptance criteria:

- all primary modules are registered
- supporting apps are registered
- capabilities are mapped to apps
- apps are mapped to capabilities
- workflow metadata exists
- missing optional apps do not crash
- no optional app is hard imported

## Phase 2: Adapter Standardisation

Create:

```text
rbp_app/rbp_app/services/adapters/base.py
```

Update adapters to expose:

```python
is_available(user=None)
get_summary(user=None)
get_allowed_actions(user=None)
get_capabilities(user=None)
```

Acceptance criteria:

- every primary app adapter returns the same response shape
- missing apps fail safely
- summary data is aggregate-only
- no sensitive data is exposed by default

## Phase 3: Shared Services

Create:

```text
rbp_app/rbp_app/services/shared/
```

Acceptance criteria:

- shared services exist
- shared services return safe placeholder responses
- no real emails, payments, AI calls or messages are sent without explicit enablement
- missing supporting apps do not crash

## Phase 4: Entitlement Service

Create:

```text
rbp_app/rbp_app/services/entitlements.py
```

Acceptance criteria:

- entitlement checks are centralised
- adapters can check app access
- workflows can check required capabilities
- subscription state can be considered
- tenant state can be considered

## Phase 5: Workflow Skeletons

Create:

```text
rbp_app/rbp_app/services/workflows/
```

Acceptance criteria:

- workflows are represented as safe backend services
- no destructive writes occur yet
- workflows check tenant, subscription, entitlement and user role
- workflows return structured responses

---

# Standard Safety Rules

All backend capability code must follow these rules:

```text
Do not hard import optional apps at module import time.
Use frappe.get_installed_apps() to check installed apps.
Check DocTypes before querying.
Use Frappe permission checks.
Return safe unavailable responses if missing or forbidden.
Never expose stack traces to the frontend.
Never expose sensitive records by default.
Prefer aggregate summaries first.
Do not send emails, payments, WhatsApp messages or AI requests until explicitly enabled.
```

# Final Backend Model

The RBP master application should become:

```text
Primary modules:
ERPNext
Frappe HR
Learning
Insights
CRM
Helpdesk
Lending
Gameplan
Drive

Supporting services:
Payments
Mail
WhatsApp
Telephony
Meet
Wiki
Newsletter
Blog
Webshop
Education
Assignment Portal
OpenAI Integration
SaaS Helper
Australian Localisation
Ecommerce Integrations

rbp_app:
capability registry
tenant control
subscription control
entitlement control
shared services
cross-app workflows
API contracts
audit logging
notification orchestration
```

This creates one master platform backend instead of a zoo of unrelated apps wearing the same shirt.