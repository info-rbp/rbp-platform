# RBP Cross-App Workflow Register

## Purpose

This document defines the cross-app backend workflows that the RBP master application should support.

The goal is to coordinate capabilities from multiple installed Frappe apps through `rbp_app`, while keeping each underlying app responsible for its own domain.

This document focuses on **backend workflow orchestration**, not frontend UX/UI.

## Core Principle

Cross-app workflows should follow this model:

```text
Trigger
    ↓
rbp_app workflow service
    ↓
tenant, subscription, entitlement and permission checks
    ↓
primary app adapter
    ↓
shared capability services
    ↓
audit log
    ↓
notification or analytics event
    ↓
structured API response
```

The workflow service should coordinate apps. It should not become a replacement for the apps themselves.

In other words:

```text
HRMS owns HR records.
Learning owns courses.
Drive owns files.
Mail owns email.
rbp_app coordinates the workflow.
```

A small mercy for future maintainers, who already have enough reasons to sigh at screens.

---

# Workflow Safety Rules

Every cross-app workflow must check:

```text
1. Is the user logged in?
2. Can the current tenant be resolved?
3. Is the tenant active?
4. Is the subscription active or allowed?
5. Is the primary app entitled?
6. Are all required supporting capabilities entitled?
7. Does the user role allow the workflow?
8. Does Frappe permission allow access to the source record?
9. Are all required apps installed?
10. Are all required DocTypes available?
```

If any check fails, the workflow must return a safe structured response.

## Standard Success Response

```json
{
  "ok": true,
  "workflow_key": "employee_onboarding",
  "status": "ready",
  "message": "Employee onboarding workflow is available.",
  "actions": [],
  "warnings": []
}
```

## Standard Unavailable Response

```json
{
  "ok": false,
  "workflow_key": "employee_onboarding",
  "status": "unavailable",
  "message": "Employee onboarding cannot run because required capabilities are unavailable.",
  "missing_apps": [],
  "missing_entitlements": [],
  "warnings": []
}
```

## Standard Forbidden Response

```json
{
  "ok": false,
  "workflow_key": "employee_onboarding",
  "status": "forbidden",
  "message": "The current user is not allowed to run this workflow.",
  "missing_apps": [],
  "missing_entitlements": [],
  "warnings": []
}
```

---

# Workflow Service Structure

Cross-app workflow services should live in:

```text
rbp_app/rbp_app/services/workflows/
```

Recommended files:

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

Workflow APIs should live in:

```text
rbp_app/rbp_app/api/workflows.py
```

Initial API endpoints:

```python
get_available_workflows()
get_workflow_status(workflow_key)
```

Later API endpoints:

```python
start_employee_onboarding(employee_id)
process_sales_follow_up(record_type, record_name)
process_support_ticket(ticket_id)
process_lending_application(application_id)
create_project_workspace(project_id)
attach_document_to_record(app_key, doctype, name, file_id)
```

---

# Shared Service Dependencies

Workflow services should use shared services instead of directly calling supporting apps.

Shared services should live in:

```text
rbp_app/rbp_app/services/shared/
```

Recommended shared services:

```text
documents.py
mail.py
whatsapp.py
meet.py
payments.py
wiki.py
analytics.py
ai.py
audit.py
notifications.py
```

## Shared Service Responsibilities

| Shared Service | Responsibility |
|---|---|
| `documents.py` | Drive/file attachment/folder operations |
| `mail.py` | Email sending and email thread lookup |
| `whatsapp.py` | WhatsApp messages and template messages |
| `meet.py` | Meeting links and meeting records |
| `payments.py` | Payment requests and payment status |
| `wiki.py` | Knowledge base search and article suggestions |
| `analytics.py` | Insights events, KPIs and dashboard links |
| `ai.py` | Summaries, drafts and suggestions |
| `audit.py` | Platform audit logging |
| `notifications.py` | Platform/user notifications |

Shared services should initially return safe placeholder responses.

Do not send real emails, WhatsApp messages, payment requests or AI requests until those integrations are explicitly enabled and tested.

---

# Workflow 1: Employee Onboarding

## Workflow Key

```text
employee_onboarding
```

## Purpose

Coordinate employee onboarding across HRMS, Learning, Drive, Mail, Gameplan and Insights.

## Trigger

A new employee is created or activated in HRMS.

## Primary App

```text
hrms
```

## Apps Used

```text
HRMS
Learning
Drive
Mail
Gameplan
Insights
```

## Backend Flow

```text
Employee created or activated in HRMS
    ↓
Resolve tenant and user context
    ↓
Check HRMS entitlement
    ↓
Check Learning entitlement
    ↓
Check Drive entitlement
    ↓
Check Mail entitlement if email sending is enabled
    ↓
Check Gameplan entitlement if task creation is enabled
    ↓
Create or identify employee Drive folder
    ↓
Assign onboarding course in Learning
    ↓
Create onboarding task/project in Gameplan
    ↓
Send welcome email through Mail
    ↓
Record analytics event in Insights
    ↓
Write RBP Audit Log entry
    ↓
Return workflow response
```

## Required Capabilities

```text
employee_management
employee_onboarding
course_management
file_storage
email_send
team_collaboration
analytics_events
```

## Required Entitlements

```text
hrms
lms
drive
```

## Optional Entitlements

```text
mail
gameplan
insights
```

## Proposed Service File

```text
rbp_app/rbp_app/services/workflows/onboarding.py
```

## Proposed Function

```python
start_employee_onboarding(employee_id, tenant=None, user=None)
```

## Minimum First Implementation

The first implementation should:

```text
validate login
resolve tenant
check HRMS availability
check Learning availability
check Drive availability
check entitlements
return a structured ready/unavailable response
not create real records yet
not send real emails yet
```

## Later Implementation

Later versions can:

```text
create Drive folder
assign LMS course
create Gameplan onboarding checklist
send Mail welcome email
record Insights event
create RBP Notification
write RBP Audit Log
```

## Data Exposure Rules

Do not expose:

```text
employee personal details
salary details
leave records
medical details
private HR notes
identity documents
```

---

# Workflow 2: CRM Sales Follow-Up

## Workflow Key

```text
sales_follow_up
```

## Purpose

Coordinate sales follow-up using CRM, Mail, WhatsApp, Meet, Drive, Insights and ERPNext.

## Trigger

A lead or deal is created, updated or moved to a new pipeline stage in CRM.

## Primary App

```text
crm
```

## Apps Used

```text
CRM
Mail
WhatsApp
Meet
Drive
Insights
ERPNext
```

## Backend Flow

```text
CRM lead or deal created/updated
    ↓
Resolve tenant and user context
    ↓
Check CRM entitlement
    ↓
Check communication capability availability
    ↓
Optionally send follow-up email through Mail
    ↓
Optionally send WhatsApp follow-up
    ↓
Optionally create Meet link
    ↓
Attach proposal or files through Drive
    ↓
Record pipeline event in Insights
    ↓
If deal is won, optionally create/link ERPNext customer
    ↓
Write RBP Audit Log entry
    ↓
Return workflow response
```

## Required Capabilities

```text
lead_management
deal_management
customer_communication
sales_documents
sales_meetings
analytics_events
```

## Required Entitlements

```text
crm
```

## Optional Entitlements

```text
mail
frappe_whatsapp
meet
drive
insights
erpnext
```

## Proposed Service File

```text
rbp_app/rbp_app/services/workflows/sales.py
```

## Proposed Function

```python
process_sales_follow_up(record_type, record_name, tenant=None, user=None)
```

## Minimum First Implementation

The first implementation should:

```text
validate login
resolve tenant
check CRM availability
check CRM entitlement
check source record permission
return available actions based on installed supporting apps
not send real messages
not create ERPNext records yet
```

## Later Implementation

Later versions can:

```text
send email
send WhatsApp
create meeting link
create Drive proposal folder
create ERPNext customer on won deal
record Insights sales event
```

## Data Exposure Rules

Do not expose:

```text
private contact details
internal notes
deal values
full communication history
customer financial data
```

unless explicitly permission-controlled.

---

# Workflow 3: Helpdesk Ticket Resolution

## Workflow Key

```text
support_ticket_resolution
```

## Purpose

Coordinate support ticket handling using Helpdesk, Mail, Drive, Wiki, AI, Insights and Meet.

## Trigger

A Helpdesk ticket is created or updated.

## Primary App

```text
helpdesk
```

## Apps Used

```text
Helpdesk
Mail
Drive
Wiki
OpenAI Integration
Insights
Meet
```

## Backend Flow

```text
Helpdesk ticket created
    ↓
Resolve tenant and user context
    ↓
Check Helpdesk entitlement
    ↓
Check ticket permission
    ↓
Attach submitted files to Drive
    ↓
Search Wiki for suggested articles
    ↓
Generate AI draft response if enabled
    ↓
Send reply through Mail if enabled
    ↓
Create Meet support call if needed
    ↓
Record support analytics event in Insights
    ↓
Write RBP Audit Log entry
    ↓
Return workflow response
```

## Required Capabilities

```text
ticket_management
ticket_attachments
knowledge_base
support_email
support_ai_drafts
analytics_events
video_meetings
```

## Required Entitlements

```text
helpdesk
```

## Optional Entitlements

```text
mail
drive
wiki
frappe_openai_integration
insights
meet
```

## Proposed Service File

```text
rbp_app/rbp_app/services/workflows/support.py
```

## Proposed Function

```python
process_support_ticket(ticket_id, tenant=None, user=None)
```

## Minimum First Implementation

The first implementation should:

```text
validate login
resolve tenant
check Helpdesk availability
check ticket permission
check optional supporting app availability
return recommended available actions
not send real email
not call AI
not attach files automatically
```

## Later Implementation

Later versions can:

```text
attach ticket files to Drive
suggest Wiki articles
draft AI ticket reply
send Mail reply
schedule Meet call
record Insights event
create notification
write audit log
```

## Data Exposure Rules

Do not expose:

```text
internal support notes
private ticket comments
tickets from other tenants
attachments from other records
agent-only metadata
```

---

# Workflow 4: Lending Application Processing

## Workflow Key

```text
lending_application_processing
```

## Purpose

Coordinate loan application processing using Lending, ERPNext, Payments, Drive, Mail, WhatsApp, Insights and AI.

## Trigger

A loan application is created or changes status in Lending.

## Primary App

```text
lending
```

## Apps Used

```text
Lending
ERPNext
Payments
Drive
Mail
WhatsApp
Insights
OpenAI Integration
```

## Backend Flow

```text
Loan application created
    ↓
Resolve tenant and user context
    ↓
Check Lending entitlement
    ↓
Check loan application permission
    ↓
Store borrower documents in Drive
    ↓
Create or link borrower/customer in ERPNext
    ↓
Create payment or repayment record through Payments
    ↓
Send borrower communication through Mail or WhatsApp
    ↓
Summarise documents with AI if enabled
    ↓
Record lending analytics event in Insights
    ↓
Write RBP Audit Log entry
    ↓
Return workflow response
```

## Required Capabilities

```text
loan_applications
borrower_management
loan_documents
customer_management
payment_collection
lending_reporting
```

## Required Entitlements

```text
lending
drive
```

## Optional Entitlements

```text
erpnext
payments
mail
frappe_whatsapp
insights
frappe_openai_integration
```

## Proposed Service File

```text
rbp_app/rbp_app/services/workflows/lending.py
```

## Proposed Function

```python
process_lending_application(application_id, tenant=None, user=None)
```

## Minimum First Implementation

The first implementation should:

```text
validate login
resolve tenant
check Lending availability
check loan application permission
check Drive availability
return safe available/unavailable response
not create payment records
not create ERPNext records
not send borrower communication
```

## Later Implementation

Later versions can:

```text
create Drive document folder
link ERPNext customer
create payment request
send Mail or WhatsApp notification
record Insights event
summarise documents with AI
write audit log
```

## Data Exposure Rules

Do not expose:

```text
borrower personal details
loan balances
repayment amounts
identity documents
credit notes
financial hardship information
```

unless strict entitlement and permission controls are enforced.

---

# Workflow 5: Project Collaboration Workspace

## Workflow Key

```text
project_collaboration_workspace
```

## Purpose

Coordinate project and collaboration workspace creation using Gameplan, Drive, Meet, Mail, Insights, CRM, ERPNext and Helpdesk.

## Trigger

A project, implementation, client delivery activity or collaboration workspace is created.

## Primary App

```text
gameplan
```

## Apps Used

```text
Gameplan
Drive
Meet
Mail
Insights
CRM
ERPNext
Helpdesk
```

## Backend Flow

```text
Project or workspace created
    ↓
Resolve tenant and user context
    ↓
Check Gameplan entitlement
    ↓
Check Drive entitlement
    ↓
Create or identify Gameplan workspace
    ↓
Create project folder in Drive
    ↓
Create Meet room or meeting link if enabled
    ↓
Notify team through Mail if enabled
    ↓
Link CRM customer or ERPNext project if available
    ↓
Record collaboration event in Insights
    ↓
Write RBP Audit Log entry
    ↓
Return workflow response
```

## Required Capabilities

```text
team_collaboration
project_discussions
project_documents
meeting_links
team_notifications
analytics_events
```

## Required Entitlements

```text
gameplan
drive
```

## Optional Entitlements

```text
meet
mail
insights
crm
erpnext
helpdesk
```

## Proposed Service File

```text
rbp_app/rbp_app/services/workflows/collaboration.py
```

## Proposed Function

```python
create_project_workspace(project_id, tenant=None, user=None)
```

## Minimum First Implementation

The first implementation should:

```text
validate login
resolve tenant
check Gameplan availability
check Drive availability
check entitlement
return available/unavailable response
not create real workspace records yet
not create meeting links
not send notifications
```

## Later Implementation

Later versions can:

```text
create Gameplan workspace
create Drive folder
create Meet link
send Mail notification
link CRM/ERPNext records
record Insights event
write audit log
```

## Data Exposure Rules

Do not expose:

```text
private project discussions
internal-only tasks
customer data from other tenants
support escalation notes
```

---

# Workflow 6: Document Attachment and Exchange

## Workflow Key

```text
document_attachment_exchange
```

## Purpose

Provide a standard way for all primary modules to attach, retrieve and share files through Drive.

## Trigger

A user uploads or attaches a document to a record.

## Primary App

```text
drive
```

## Apps Used

```text
Drive
ERPNext
HRMS
CRM
Helpdesk
Lending
Learning
Gameplan
```

## Backend Flow

```text
Document upload requested
    ↓
Resolve tenant and user context
    ↓
Check Drive entitlement
    ↓
Check source app entitlement
    ↓
Check record permission
    ↓
Create or identify app/record folder
    ↓
Attach file in Drive
    ↓
Link file to source record
    ↓
Write RBP Audit Log entry
    ↓
Return file reference
```

## Required Capabilities

```text
file_storage
document_upload
record_attachments
document_permissions
client_document_exchange
```

## Required Entitlements

```text
drive
```

Also required:

```text
source app entitlement
```

For example:

```text
hrms
crm
helpdesk
lending
erpnext
lms
gameplan
```

## Proposed Service File

```text
rbp_app/rbp_app/services/workflows/documents.py
```

## Proposed Function

```python
attach_document_to_record(app_key, doctype, name, file_id, tenant=None, user=None)
```

## Minimum First Implementation

The first implementation should:

```text
validate login
resolve tenant
check Drive availability
check source app entitlement
check record permission
return safe placeholder response
not move files yet
not alter source records yet
```

## Later Implementation

Later versions can:

```text
create tenant folder
create app folder
create record folder
attach file
link file to source record
create audit log
create notification
```

## Data Exposure Rules

Never expose cross-tenant files.

Every file action must be scoped by:

```text
tenant
user
record
source app
permission
```

---

# Workflow 7: Subscription and App Entitlement Sync

## Workflow Key

```text
subscription_entitlement_sync
```

## Purpose

Synchronise billing/subscription state with app entitlements.

## Trigger

A subscription is created, updated, paid, past due, suspended or cancelled.

## Primary App

```text
rbp_app
```

## Apps Used

```text
rbp_app
Payments
ERPNext
Lending
Mail
Notifications
```

## Backend Flow

```text
Subscription event received
    ↓
Resolve tenant
    ↓
Update RBP Subscription
    ↓
Map subscription plan to app entitlements
    ↓
Enable or suspend app access
    ↓
Create notification
    ↓
Optionally create payment/customer record through Payments or ERPNext
    ↓
Write RBP Audit Log entry
    ↓
Return sync result
```

## Required Capabilities

```text
subscription_management
app_entitlements
payment_status_tracking
tenant_access_control
notifications
audit_logging
```

## Required Entitlements

```text
billing
```

Optional:

```text
payments
erpnext
mail
```

## Proposed Service File

```text
rbp_app/rbp_app/services/workflows/billing.py
```

## Proposed Function

```python
sync_subscription_entitlements(subscription_id, tenant=None, user=None)
```

## Minimum First Implementation

The first implementation should:

```text
validate subscription exists
resolve tenant
read plan
calculate intended entitlements
return proposed changes
not write entitlement changes unless explicitly enabled
```

## Later Implementation

Later versions can:

```text
update RBP App Entitlement records
suspend app access
restore app access
send notifications
record audit logs
sync payment provider state
```

## Data Exposure Rules

Billing state should be visible only to:

```text
tenant admin
system manager
billing-authorised users
```

---

# Backend Workflow Dependencies

The workflow layer should depend on these services:

```text
rbp_app.services.tenancy
rbp_app.services.entitlements
rbp_app.services.billing
rbp_app.services.capabilities
rbp_app.services.adapters.*
rbp_app.services.shared.*
```

The workflow layer should not directly depend on frontend templates.

The workflow layer should not directly expose Frappe Desk routes.

The workflow layer should not hard import optional app modules at import time.

---

# Workflow Availability Rules

A workflow is available when:

```text
the user is logged in
tenant is resolved
subscription allows the workflow
all required app entitlements are enabled
required apps are installed
required DocTypes exist
user has permission to source records
```

A workflow is partially available when:

```text
the primary app is available
some optional supporting apps are missing
the workflow can still run in reduced mode
```

A workflow is unavailable when:

```text
primary app is missing
required entitlement is missing
tenant cannot be resolved
subscription is inactive
user lacks permission
```

---

# Workflow Metadata Shape

Each workflow should eventually be represented as metadata.

Example:

```python
{
    "key": "employee_onboarding",
    "label": "Employee Onboarding",
    "description": "Coordinate HRMS, Learning, Drive, Mail and Gameplan for employee onboarding.",
    "primary_app": "hrms",
    "required_apps": ["hrms", "lms", "drive"],
    "optional_apps": ["mail", "gameplan", "insights"],
    "required_capabilities": [
        "employee_management",
        "course_management",
        "file_storage",
    ],
    "category": "People",
    "enabled": True,
}
```

This metadata should live in:

```text
rbp_app/rbp_app/services/capabilities.py
```

or later:

```text
rbp_app/rbp_app/services/workflows/registry.py
```

Do not create a DocType for workflow metadata yet unless the platform needs runtime configuration.

Boring metadata files are cheaper than database furniture.

---

# API Contract

## API File

```text
rbp_app/rbp_app/api/workflows.py
```

## Initial Endpoints

```python
@frappe.whitelist()
def get_available_workflows():
    """
    Return workflows available to the current user and tenant.
    """

@frappe.whitelist()
def get_workflow_status(workflow_key):
    """
    Return availability, missing apps and missing entitlements for a workflow.
    """
```

## Later Endpoints

```python
@frappe.whitelist()
def start_employee_onboarding(employee_id):
    pass

@frappe.whitelist()
def process_sales_follow_up(record_type, record_name):
    pass

@frappe.whitelist()
def process_support_ticket(ticket_id):
    pass

@frappe.whitelist()
def process_lending_application(application_id):
    pass

@frappe.whitelist()
def create_project_workspace(project_id):
    pass

@frappe.whitelist()
def attach_document_to_record(app_key, doctype, name, file_id):
    pass

@frappe.whitelist()
def sync_subscription_entitlements(subscription_id):
    pass
```

All workflow APIs must call:

```python
require_login()
```

before doing anything else.

---

# Testing Requirements

Create:

```text
rbp_app/rbp_app/tests/test_workflows.py
```

## Tests

The tests should cover:

```text
guest users are rejected
missing tenant returns safe unavailable response
missing primary app returns unavailable response
missing supporting app returns partial availability
missing entitlement blocks workflow
workflow does not perform writes in placeholder mode
workflow response shape is consistent
```

## Workflow-Specific Tests

### Employee Onboarding

```text
HRMS missing returns unavailable
Learning missing returns unavailable or partial depending on implementation
Drive missing returns unavailable
Mail missing remains optional
```

### Sales Follow-Up

```text
CRM missing returns unavailable
Mail missing returns partial
Meet missing returns partial
Drive missing returns partial
```

### Support Ticket Resolution

```text
Helpdesk missing returns unavailable
Wiki missing returns partial
AI missing returns partial
Mail missing returns partial
```

### Lending Application Processing

```text
Lending missing returns unavailable
Drive missing returns unavailable
Payments missing returns partial
ERPNext missing returns partial
```

### Project Collaboration Workspace

```text
Gameplan missing returns unavailable
Drive missing returns unavailable
Meet missing returns partial
Mail missing returns partial
```

### Document Attachment Exchange

```text
Drive missing returns unavailable
source app missing returns unavailable
record permission denied returns forbidden
```

### Subscription Entitlement Sync

```text
subscription missing returns unavailable
tenant missing returns unavailable
plan maps to intended entitlements
placeholder mode does not write changes
```

---

# Implementation Order

## Phase 1: Workflow Metadata

Add workflow definitions only.

No execution.

Files:

```text
rbp_app/rbp_app/services/capabilities.py
rbp_app/rbp_app/tests/test_capabilities.py
```

## Phase 2: Workflow API Status

Add:

```text
rbp_app/rbp_app/api/workflows.py
```

Implement:

```python
get_available_workflows()
get_workflow_status(workflow_key)
```

## Phase 3: Workflow Service Skeletons

Add:

```text
rbp_app/rbp_app/services/workflows/
```

Each workflow returns safe placeholder responses.

## Phase 4: Shared Service Skeletons

Add:

```text
rbp_app/rbp_app/services/shared/
```

Shared services return safe placeholder responses.

## Phase 5: First Real Workflow

Implement:

```text
employee_onboarding
```

Start with:

```text
HRMS
Learning
Drive
Mail
```

Keep all writes behind explicit checks.

## Phase 6: Next Workflows

Implement in this order:

```text
CRM Sales Follow-Up
Helpdesk Ticket Resolution
Lending Application Processing
Project Collaboration Workspace
Document Attachment Exchange
Subscription Entitlement Sync
```

---

# Validation Commands

Run compile checks:

```sh
cd /Users/gianpaulocoletti/frappe-1

start/env/bin/python -m compileall -q rbp_app/rbp_app/services rbp_app/rbp_app/api
```

Run focused tests:

```sh
start/env/bin/python -m unittest rbp_app.tests.test_workflows
```

Run full bench tests:

```sh
cd /Users/gianpaulocoletti/frappe-1/start

bench --site frappe.localhost clear-cache
bench --site frappe.localhost run-tests --app rbp_app
```

Run clean minimal validation:

```sh
bench --site rbp-minimal.localhost clear-cache
bench --site rbp-minimal.localhost run-tests --app rbp_app
```

---

# Risks and Controls

## Risk: Workflows bypass permissions

Control:

```text
Every workflow must check tenant, entitlement, role and Frappe record permission.
```

## Risk: Supporting apps are missing

Control:

```text
Check installed apps before use.
Return partial or unavailable workflow status.
Do not hard import optional apps.
```

## Risk: Workflow sends real messages too early

Control:

```text
Initial shared services must be placeholders.
Real sending requires explicit enablement and tests.
```

## Risk: Sensitive data leaks across modules

Control:

```text
Use aggregate summaries first.
Do not expose private records.
Scope data by tenant and user.
```

## Risk: rbp_app becomes too large

Control:

```text
Keep app-specific logic in adapters.
Keep reusable capabilities in shared services.
Keep cross-app coordination in workflows.
Keep API functions thin.
```

---

# Final Workflow Model

The RBP master application should support this backend model:

```text
Primary app adapters
    ↓
Shared capability services
    ↓
Cross-app workflow services
    ↓
Tenant/subscription/entitlement checks
    ↓
API layer
    ↓
Frontend UX
```

This allows the platform to reuse all installed app capabilities without exposing every installed app directly to customers or turning the backend into a bowl of spaghetti with a subscription button.