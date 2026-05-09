You are designing the Remote Business Partner customer/member portal UI.

Context:
The portal sidebar navigation has already been implemented and should remain consistent across all portal pages.

Current portal sidebar:
- Dashboard
- My Services
- Advisory Sessions
- Documents
- Partner Offers
- Applications
- Resources
- Support
- Settings
- Sign Out

Task:
Update the Applications page in the member dashboard/portal.

Route / screen:
Applications
Equivalent product route:
/portal/apps

Purpose:
The Applications page is the customer-facing software capability launcher for the RBP platform.

It should show business tools and platform capabilities available to the member, not public service categories.

Important distinction:
- Services are things the customer buys, requests, or receives from RBP.
- Applications are tools/capabilities the customer opens and uses inside the RBP platform.
- Offers are partner benefits the customer activates.
- Documents are files, templates, deliverables and uploads.

Do not list these as applications:
- On-Demand Services
- Managed Services
- Partner Offers
- Advisory Sessions
- Resources
- Support

Those belong in other portal sections.

Applications to include:
1. Operations & Finance
   Backend capability: ERPNext
   Description: Manage accounting, operations, projects, purchasing, sales and finance workflows.
   Status: Active
   Primary action: Open

2. People & HR
   Backend capability: HRMS
   Description: Manage employees, leave, attendance, payroll and HR workflows.
   Status: Available
   Primary action: Request Access

3. Sales & CRM
   Backend capability: CRM
   Description: Manage leads, deals, customers, pipelines and relationship tracking.
   Status: Available
   Primary action: Request Access

4. Documents
   Backend capability: Drive / document layer
   Description: Store, share and manage business documents, templates and deliverables.
   Status: Active
   Primary action: Open

5. Support Desk
   Backend capability: Helpdesk
   Description: Track support requests, service tickets and help workflows.
   Status: Active
   Primary action: Open

6. Learning
   Backend capability: LMS
   Description: Access onboarding, training, courses and learning content.
   Status: Coming Soon
   Primary action: Learn More

7. Analytics
   Backend capability: Insights
   Description: View dashboards, reports and business performance insights.
   Status: Available
   Primary action: Request Access

8. Payments & Billing
   Backend capability: Payments
   Description: Manage payments, billing, invoices and payment-related workflows.
   Status: Coming Soon
   Primary action: Learn More

Page layout:
1. Page header
   Title: “Applications”
   Subtitle: “Access the business tools and platform capabilities available through RBP.”
   Primary CTA: “Request an Application”
   Secondary CTA: “Contact Support”

2. Summary cards
   Include four compact summary cards:
   - Active Applications
   - Available to Activate
   - Coming Soon
   - Admin Managed

3. Filter tabs
   Include:
   - All
   - Active
   - Available
   - Coming Soon
   - Admin Managed

4. Application cards grid
   Each card should include:
   - Icon area
   - Application name
   - Backend capability label in small text
   - Short description
   - Status badge
   - Primary action button
   - Secondary “View Details” link

5. Featured / recommended application
   Include one highlighted card:
   “Recommended for your business”
   Suggested application: Operations & Finance
   Include copy:
   “Start here to manage your core business workflows.”

6. Empty state
   Design an empty state for when no applications are active:
   Title: “No active applications yet”
   Copy: “Applications you activate through RBP will appear here.”
   CTA: “Request an Application”

7. Detail preview / side panel concept
   Include a design pattern for when a user selects an application:
   - Application name
   - Description
   - Status
   - What this helps with
   - Included capabilities
   - Next step button
   - Back to Applications

Visual style:
Use the existing Remote Business Partner member portal style:
- white and soft grey background
- blue primary actions
- rounded cards
- subtle borders
- clean professional spacing
- clear status badges
- premium business SaaS feel
- consistent with the existing portal sidebar and dashboard design

Status badge colours:
- Active: green or blue
- Available: blue or neutral
- Coming Soon: grey or amber
- Admin Managed: neutral/dark

Behaviour:
- Keep the portal sidebar visible.
- Highlight “Applications” in the sidebar.
- Do not link users to Frappe Desk.
- Do not create or redesign login.
- Do not show raw backend app names as the main customer label.
- Backend names can appear as small supporting labels only.

Responsive requirements:
- Desktop: card grid with sidebar
- Tablet: two-column card grid
- Mobile: stacked cards with collapsible/drawer navigation

Output:
Update the Applications page design only.
Keep the rest of the portal consistent.
Use realistic placeholder data.
Make it clear this is a customer-facing application launcher, not an admin/backend app list.