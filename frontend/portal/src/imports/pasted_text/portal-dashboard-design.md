You are helping design the Remote Business Partner customer/member portal UI.

Context:
The portal sidebar navigation has already been implemented and should remain consistent across all portal pages.

Current portal sidebar items:
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

Product model:
The public website is the discovery/catalogue layer.
The membership portal is the private customer workspace where users activate, manage, track and receive services, offers, documents, applications and support.

Core customer loop:
Browse service on public site
→ request or activate it in the portal
→ track it in My Services
→ see status and next actions on Dashboard

Objective:
Design and update the Portal Dashboard and My Services experience so the portal feels coherent, useful and customer-ready.

Do not redesign the whole public website.
Do not redesign login.
Do not redesign the admin/Desk experience.
Focus only on the authenticated member portal.

Routes / screens to design:
1. Portal Dashboard
2. My Services
3. Service Request / Activation state
4. Service Detail / Tracking state

Design language:
Use the existing Remote Business Partner dashboard style:
- clean white/soft grey background
- blue primary action colour
- rounded cards
- subtle borders
- compact professional sidebar
- clear status badges
- calm business SaaS feel
- premium but simple
- suitable for small business owners and members

Screen 1: Portal Dashboard

Purpose:
The Dashboard is the customer command centre.

It should answer:
- What services do I have active?
- What needs my attention?
- What sessions or actions are coming up?
- What documents or offers are waiting?
- Where do I go next?

Keep the current membership dashboard structure, but update it to align with the service activation model.

Dashboard sections:
1. Welcome banner
   - Title: “Welcome back”
   - Subtitle explaining open action items, active services and upcoming sessions
   - Primary CTA: “Open My Services”
   - Secondary CTA: “Book a Session”

2. Metric cards
   Include four cards:
   - Active Services
   - Pending Requests
   - Documents
   - Action Items

3. Recent Activity
   Example items:
   - “Decision Desk request submitted”
   - “Business Health Snapshot ready”
   - “Xero partner offer activated”
   - “Cash Flow Forecast Template downloaded”

4. Quick Actions
   Include:
   - Request a Service
   - Book a Session
   - View Documents
   - Browse Partner Offers
   - Open Applications
   - Contact Support

5. Upcoming Sessions
   Show at least two example sessions, plus a clean empty state version.

6. Your Consultant
   Keep a consultant/advisor card similar to the current design.
   Include fallback empty state copy:
   “Your consultant will appear here once assigned.”

7. Business Health Snapshot
   Keep the progress bar style, but do not imply live data unless clearly marked as a snapshot/demo state.
   Metrics:
   - Revenue Growth
   - Operational Efficiency
   - Strategic Milestone Progress

Screen 2: My Services

Purpose:
My Services is where users manage services they have activated, requested, purchased, or completed.

This screen is the bridge between public website categories and the portal.

Service states:
- Available
- Requested
- In Progress
- Active
- Completed

Create a clean My Services page with:
1. Page header
   - Title: “My Services”
   - Subtitle: “Track your requested, active and completed RBP services.”
   - Primary CTA: “Request a Service”

2. Service status summary cards
   - Active
   - In Progress
   - Pending Requests
   - Completed

3. Filter tabs
   - All
   - Active
   - Requested
   - In Progress
   - Completed
   - Available

4. Service cards/list
   Each service card should show:
   - Service name
   - Category
   - Status badge
   - Short description
   - Last updated date
   - Next action
   - Primary action button

Example services:
- Decision Desk
  Category: On-Demand Service
  Status: In Progress
  Description: “A focused advisory request for a key business decision.”
  Next action: “Review consultant questions”
  Button: “View Request”

- HR Services
  Category: Managed Service
  Status: Requested
  Description: “Managed HR support for policies, onboarding and compliance.”
  Next action: “Awaiting review”
  Button: “View Status”

- Business Health Snapshot
  Category: Advisory
  Status: Active
  Description: “A structured review of growth, finance and operational priorities.”
  Next action: “View snapshot”
  Button: “Open”

- Finance Calculator Pack
  Category: Operations Tool
  Status: Available
  Description: “Planning tools for lending, cash flow and business finance.”
  Next action: “Activate when ready”
  Button: “Activate”

- Xero Partner Offer
  Category: Partner Offer
  Status: Completed
  Description: “Partner offer activated through the RBP marketplace.”
  Next action: “Offer active”
  Button: “View Offer”

5. Empty state
   If no services exist:
   - Title: “No services yet”
   - Copy: “Services you request or activate from the RBP website will appear here.”
   - CTA: “Explore Services”

Screen 3: Service Request / Activation

Purpose:
When a user clicks “Request a Service” or activates a public-site CTA, they should land in a simple portal request screen.

Design a simple request/activation page:
- Page title: “Request a Service”
- Service selector
- Brief business context field
- Priority selector
- Preferred contact method
- Upload supporting document optional
- Submit button: “Submit Request”

After submission, show a confirmation state:
- “Request submitted”
- Explain that the RBP team will review it
- CTA: “Back to My Services”

Screen 4: Service Detail / Tracking

Purpose:
When a user opens a service from My Services, they should see detail and progress.

Design a service detail page with:
- Service title
- Status badge
- Category
- Description
- Timeline / progress steps
- Assigned consultant or team
- Related documents
- Related sessions
- Activity log
- Action buttons

Example timeline:
- Requested
- Reviewed
- In Progress
- Awaiting Client
- Completed

Public-to-portal mapping:
Use this product logic:
- Public /on-demand → Portal /services
- Public /managed-services → Portal /services
- Public /applications → Portal /apps
- Public /marketplace or /offers → Portal /offers
- Public /docushare or documents → Portal /documents
- Public /resources → Portal /resources
- Public /contact → Portal /sessions or /support

Navigation behaviour:
- Keep sidebar visible on all portal screens.
- Highlight the active sidebar item.
- My Services should be highlighted for service request, activation and detail screens.
- Do not link customers to Frappe Desk.
- Do not create a custom login screen.

Responsive requirements:
- Desktop: persistent left sidebar
- Tablet: compact sidebar or collapsible navigation
- Mobile: top navigation / drawer pattern
- Cards should stack cleanly on small screens

Output requirements:
- Update the existing portal dashboard design.
- Add a new My Services screen.
- Add a Service Request / Activation screen.
- Add a Service Detail / Tracking screen.
- Keep visual styling consistent with the existing Remote Business Partner portal.
- Use realistic placeholder data, but make it clear this is a UI model.
- Avoid hardcoding one consultant or one company as if universal.