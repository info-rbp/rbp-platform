Expand only the Admin Site Content page.

Important context:
The admin sidebar has already been updated into grouped, collapsible NAV_GROUPS.
The Site Content sidebar group already includes:
- Public Pages
- Page Sections
- Mega Menu
- SEO / Metadata
- Header / Footer
- Content Status

The Admin Dashboard has already been updated separately.

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

Focus only on the Admin Site Content page main content area.

Purpose:
This page should act as the admin control area for the public-facing website structure, page sections, mega menu content, SEO metadata, header/footer references, and future content status tracking.

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
Site Content

Description:
Manage the public website structure, page sections, mega menu content, SEO metadata, header and footer references, and content readiness.

Route label:
/admin/site-content/pages

Status badge:
Placeholder

Primary button:
Add Content Item

Secondary button:
View Public Site

RELATIONSHIP LINK CARDS

Add two standard relationship cards.

Card 1:
Title: Public Website
Description: The front-facing website pages and navigation controlled by this admin area.
Route: /
Button: View Public Site

Card 2:
Title: Member Portal
Description: Site Content does not directly control member-specific portal data, but some content may support portal resources and help content.
Route: Not applicable
Badge: Not applicable

Add a note:
Member-specific content is managed through Membership, Applications, Offers, Resources, Help Center, and related admin areas.

SUMMARY STAT CARDS

Create stat cards for:
- Public Pages
- Page Sections
- Content Required
- Draft Sections
- Published Sections
- Broken / Missing Anchors

Use mock numbers only.

PUBLIC PAGES TABLE

Create a table called Public Pages.

Columns:
- Page Name
- Public Route
- Related Admin Area
- Status
- Last Updated
- Actions

Use these rows:

Home
Route: /
Related Admin Area: Site Content
Status: Content Required

About Us
Route: /about
Related Admin Area: Site Content
Status: Placeholder

Contact
Route: /contact
Related Admin Area: Site Content
Status: Ready

Help Center
Route: /help
Related Admin Area: Help Center
Status: Placeholder

On-Demand Services
Route: /on-demand
Related Admin Area: On-Demand Services
Status: Placeholder

Managed Services
Route: /managed-services
Related Admin Area: Managed Services
Status: Placeholder

Applications
Route: /applications
Related Admin Area: Applications
Status: Placeholder

Operations
Route: /operations
Related Admin Area: Operations
Status: Placeholder

Marketplace
Route: /marketplace
Related Admin Area: Marketplace
Status: Placeholder

Membership
Route: /membership
Related Admin Area: Membership
Status: Placeholder

Offers
Route: /offers
Related Admin Area: Offers
Status: Placeholder

Resources
Route: /resources
Related Admin Area: Resources
Status: Placeholder

Actions:
- View
- Edit
- Mark Ready

PAGE SECTIONS PANEL

Create a section called Page Sections.

Show grouped cards for each public page area.

On-Demand Services sections:
- Overview
- Business Advisor
- Decision Desk
- The Fixer
- Document Nucleus
- Templates
- Documentation Suites
- Toolkits
- Process
- On-Demand Services

Managed Services sections:
- Overview
- Bid Management
- Real Estate
- HR Services
- Document Management
- Business Sale Support
- Custom Solutions

Applications sections:
- Overview
- Operations and Finance
- People and HR
- Sales and CRM
- Documents
- Support Desk
- Learning
- Analytics
- Payments and Billing
- Integrations

Operations sections:
- Overview
- Business Finance
- Business Insurance
- Superloop Connectivity
- Calculators

Marketplace sections:
- Overview
- Marketplace
- Buying Process
- List With Us

Membership sections:
- Overview
- Basic Membership
- Standard Membership
- Premium Membership
- Sign Up Today

Offers sections:
- Overview
- Exclusive Offers
- Top Offers
- Offer Categories

Resources sections:
- Overview
- Articles
- Guides
- Tools
- Downloads
- Educational

Help Center sections:
- Frequently Asked Questions
- Knowledge Base
- Troubleshooting
- Resources
- Support Center

About Us sections:
- About Us
- Our Purpose
- Our Platform
- Discovery Call
- Contact

For each group, show:
- Section count
- Content status
- Missing content count
- Missing anchor count
- Action: Review Sections

ANCHOR / LINK STATUS PANEL

Create a card called Anchor and Link Status.

Purpose:
Track whether public mega menu links using anchors and query parameters have matching content sections.

Include example rows:

/applications#operations-finance
Status: Needs section ID

/applications#people-hr
Status: Needs section ID

/applications#integrations
Status: Planned

/managed-services#document-management
Status: Needs section ID

/managed-services#business-sale-support
Status: Needs section ID

/marketplace#buying-process
Status: Needs section ID

/membership#premium
Status: Needs section ID

/offers?category=ai
Status: Query filter planned

/resources?type=guides
Status: Query filter planned

/help?section=faqs&category=applications
Status: Query view planned

Use status badges:
- Ready
- Needs Section ID
- Query Planned
- Planned
- Content Required

MEGA MENU PANEL

Create a section called Mega Menu.

Show a table or grouped cards for the public mega menu structure:

- On-Demand Services
- Managed Services
- Applications
- Operations
- Marketplace
- Membership
- Offers
- Resources
- Help Center
- About Us

Columns:
- Menu Label
- Public Route
- Dropdown Sections
- CTA Link
- Status
- Actions

Example actions:
- View Menu
- Review Links
- Mark Ready

Do not modify the actual public Navbar or mega menu code in this step.
This is only a Site Content management view.

SEO / METADATA PANEL

Create a section called SEO / Metadata.

Show a placeholder table with:
- Page
- Page Title
- Meta Description
- Open Graph Image
- Indexing Status
- Status
- Actions

Use status examples:
- Missing
- Draft
- Ready
- Published

HEADER / FOOTER PANEL

Create a section called Header / Footer.

Include placeholder cards for:
- Header navigation
- Utility links
- Public mega menu
- Footer columns
- Contact details
- Legal links
- Social links

Show status badges:
- Placeholder
- Content Required
- Ready

CONTENT STATUS DASHBOARD

Create a section called Content Status.

Show grouped status counts:
- Ready
- Placeholder
- Content Required
- Draft
- Published
- Hidden

Also show a table called Content Readiness.

Columns:
- Area
- Public Route
- Content Status
- Link Status
- SEO Status
- Last Updated
- Actions

Use mock rows only.

FUTURE SETUP NOTE

Add a subtle note card:

This Site Content area is scaffolded as the future control panel for public website content, page sections, mega menu references, SEO metadata, and content readiness. Final routing, live editing, publishing workflow, permissions, Firebase collections, and deployment behaviour will be completed later in GitHub/Firebase Studio.

Do not:
- Modify the sidebar
- Modify NAV_GROUPS
- Modify the Admin Dashboard
- Modify public Navbar
- Modify member portal navigation
- Modify routes.tsx
- Build real CRUD
- Add Firebase
- Add real publishing workflow
- Add authentication or permissions
- Change public website pages

This step is only to expand the Admin Site Content page visually using mock/static content.