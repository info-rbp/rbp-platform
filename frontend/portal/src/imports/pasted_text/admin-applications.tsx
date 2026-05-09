Expand only the Admin Applications page.

Important context:
The admin sidebar has already been updated into grouped, collapsible NAV_GROUPS.
The Applications sidebar group already includes:
- Dashboard
- Operations and Finance
- People and HR
- Sales and CRM
- Documents
- Support Desk
- Learning
- Analytics
- Payments and Billing
- Integrations

Do not modify:
- Admin sidebar
- NAV_GROUPS
- Sidebar open/close behaviour
- Breadcrumb/page title logic
- Admin Dashboard
- Public website navigation
- Member portal navigation
- routes.tsx
- Firebase logic
- Authentication
- Permissions

Focus only on the Admin Applications page main content area.

Purpose:
This page should act as the admin control area for the public Applications page, member portal applications, setup requests, and future integrations.

Use the existing admin visual style:
- White cards
- Rounded corners
- Slate and blue palette
- Small stat cards
- Clean tables
- Status badges
- Relationship link cards
- Placeholder/mock data only

PAGE HEADER

Title:
Applications

Description:
Manage the application catalogue, application categories, setup requests, member access, and integrations.

Route label:
/admin/applications

Status badge:
Placeholder

Primary button:
Add Application

Secondary button:
View Public Applications

RELATIONSHIP LINK CARDS

Add two standard relationship cards.

Card 1:
Title: Public Website
Description: The public-facing Applications page and application category sections.
Route: /applications
Button: View Public Page

Card 2:
Title: Member Portal
Description: The member-facing applications area where users view assigned apps, requested apps, and setup status.
Route: /portal/apps
Button: View Portal Page

Add a small planned link reference:
Integrations portal route: /portal/integrations
Badge: Planned

SUMMARY STAT CARDS

Create stat cards for:
- Published Applications
- Draft Applications
- Setup Requests
- Member App Access
- Integration Requests
- Content Required

Use mock numbers only.

APPLICATION CATEGORY OVERVIEW

Create a category grid or table using these categories:

1. Operations and Finance
Public section: /applications#operations-finance
Admin route label: /admin/applications/operations-finance
Portal link: /portal/apps

2. People and HR
Public section: /applications#people-hr
Admin route label: /admin/applications/people-hr
Portal link: /portal/apps

3. Sales and CRM
Public section: /applications#sales-crm
Admin route label: /admin/applications/sales-crm
Portal link: /portal/apps

4. Documents
Public section: /applications#documents
Admin route label: /admin/applications/documents
Portal link: /portal/apps

5. Support Desk
Public section: /applications#support-desk
Admin route label: /admin/applications/support-desk
Portal link: /portal/apps

6. Learning
Public section: /applications#learning
Admin route label: /admin/applications/learning
Portal link: /portal/apps

7. Analytics
Public section: /applications#analytics
Admin route label: /admin/applications/analytics
Portal link: /portal/apps

8. Payments and Billing
Public section: /applications#payments-billing
Admin route label: /admin/applications/payments-billing
Portal link: /portal/apps

9. Integrations
Public section: /applications#integrations
Admin route label: /admin/applications/integrations
Portal link: /portal/integrations
Badge: Planned

For each category, show:
- Category name
- Public section link
- Admin route label
- Portal link
- Status badge
- Item count
- Actions

Status examples:
- Ready
- Placeholder
- Content Required
- Draft
- Published

APPLICATION CATALOGUE TABLE

Create a table called Application Catalogue.

Columns:
- Application Name
- Category
- Status
- Visibility
- Member Access
- Related Integrations
- Last Updated
- Actions

Use mock application examples:
- ERPNext
- Frappe CRM
- HRMS
- Helpdesk
- Frappe LMS
- Frappe Wiki
- Frappe Drive
- Payments
- Analytics Dashboard
- OpenAI Assistant

Visibility examples:
- Public
- Members Only
- Admin Only
- Hidden

Member Access examples:
- Available
- Assigned
- Request Required
- Coming Soon

Actions:
- View
- Edit
- Archive

SETUP REQUESTS PANEL

Create a panel or table called Application Setup Requests.

Columns:
- Request
- Member
- Application
- Category
- Priority
- Status
- Assigned To
- Action

Use placeholder rows only.

Status examples:
- New
- Reviewing
- In Setup
- Waiting on Member
- Completed

INTEGRATIONS SECTION

Create a dedicated section on this page called Integrations.

This should not be a top-level admin group.
It should live under Applications.

Include these cards:
- Integration Catalogue
- Connected Members
- Setup Requests
- Sync Status
- Provider Management
- Related Applications

Create an Integrations table.

Columns:
- Integration Name
- Provider
- Related Application
- Category
- Status
- Member Availability
- Sync Health
- Actions

Use mock integration examples:
- ERPNext
- Frappe CRM
- HRMS
- Helpdesk
- Payments
- OpenAI
- Google Drive
- Microsoft 365
- Xero
- Stripe
- Custom API

Status examples:
- Available
- Coming Soon
- Manual Setup
- Requested
- Connected
- Issue

Sync Health examples:
- Not Connected
- Healthy
- Warning
- Error
- Manual Only

Add a note:
Integrations are scaffolded as part of the Applications admin area. Real provider connections, sync logs, API credentials, member-specific access, and automation workflows will be handled later in GitHub/Firebase Studio.

CONTENT STATUS PANEL

Add a content status panel for the Applications page sections:
- Operations and Finance
- People and HR
- Sales and CRM
- Documents
- Support Desk
- Learning
- Analytics
- Payments and Billing
- Integrations

Each should have:
- Status badge
- Public section link
- Admin route label
- Content required indicator

FUTURE SETUP NOTE

Add a subtle note card:

This Applications admin area is a scaffold for future catalogue management, setup requests, member app access, and integrations. Final routing, live data, Firebase collections, permissions, publishing workflow, and integration APIs will be completed later in GitHub/Firebase Studio.

Do not:
- Modify the sidebar
- Modify NAV_GROUPS
- Create new route wiring
- Modify routes.tsx
- Build real CRUD
- Add Firebase
- Add real API integrations
- Add authentication or permissions
- Change public website pages
- Change member portal pages

This step is only to expand the Admin Applications page visually using mock/static content.