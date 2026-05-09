Update the existing Remote Business Partner public navigation mega menu with the final fixes below.

Important:
- Do NOT add “Home” to the desktop main menu.
- The Remote Business Partner logo in the top utility/header bar already links to “/” and should remain the home link.
- Do not redesign the full site.
- Only update the public navigation/header mega menu and route/link behavior where needed.
- Keep the current two-tier header structure.

CURRENT HEADER STRUCTURE TO KEEP

Top utility/header bar:
- Remote Business Partner logo linking to /
- Search icon/search trigger
- Sign In button linking to /sign-in
- Join Now button linking to /sign-in

Main desktop mega menu row:
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

Do not add Home to this row.

FIX 1: USE “HELP CENTER” CONSISTENTLY

Change the menu label from “Help Centre” to:

Help Center

Also update any CTA text or internal menu text that says “Support Centre” or “Visit Support Centre” to use:

Support Center
Visit Support Center

Use consistent “Center” spelling across the public navigation.

FIX 2: COMPLETE THE HELP CENTER MEGA MENU

The Help Center mega menu must include these four sections:

1. Frequently Asked Questions
2. Knowledge Base
3. Troubleshooting
4. Support Center

Each of the first three sections must include the same full category list:

- Our Platform
- On-Demand Services
- Managed Services
- Applications
- Operations
- Marketplace
- Membership
- Offers
- Resources
- Other

The Support Center section should include:
- Support Center

Use these links for now so the content can be handled later on the existing Help page:

Frequently Asked Questions:
- Our Platform → /help?section=faqs&category=our-platform
- On-Demand Services → /help?section=faqs&category=on-demand-services
- Managed Services → /help?section=faqs&category=managed-services
- Applications → /help?section=faqs&category=applications
- Operations → /help?section=faqs&category=operations
- Marketplace → /help?section=faqs&category=marketplace
- Membership → /help?section=faqs&category=membership
- Offers → /help?section=faqs&category=offers
- Resources → /help?section=faqs&category=resources
- Other → /help?section=faqs&category=other

Knowledge Base:
- Our Platform → /help?section=knowledge-base&category=our-platform
- On-Demand Services → /help?section=knowledge-base&category=on-demand-services
- Managed Services → /help?section=knowledge-base&category=managed-services
- Applications → /help?section=knowledge-base&category=applications
- Operations → /help?section=knowledge-base&category=operations
- Marketplace → /help?section=knowledge-base&category=marketplace
- Membership → /help?section=knowledge-base&category=membership
- Offers → /help?section=knowledge-base&category=offers
- Resources → /help?section=knowledge-base&category=resources
- Other → /help?section=knowledge-base&category=other

Troubleshooting:
- Our Platform → /help?section=troubleshooting&category=our-platform
- On-Demand Services → /help?section=troubleshooting&category=on-demand-services
- Managed Services → /help?section=troubleshooting&category=managed-services
- Applications → /help?section=troubleshooting&category=applications
- Operations → /help?section=troubleshooting&category=operations
- Marketplace → /help?section=troubleshooting&category=marketplace
- Membership → /help?section=troubleshooting&category=membership
- Offers → /help?section=troubleshooting&category=offers
- Resources → /help?section=troubleshooting&category=resources
- Other → /help?section=troubleshooting&category=other

Support Center:
- Support Center → /help?section=support

Help Center CTA:
Text: Need direct help?
Button label: Visit Support Center
Button link: /help?section=support

Do not use /help/faqs/... or /help/knowledge-base/... or /help/troubleshooting/... paths unless matching routes are also added. For now, use the query-parameter links above so everything resolves to the existing /help page.

FIX 3: FIX MANAGED SERVICES LINKS THAT DO NOT HAVE ROUTES

The following Managed Services items should not link to missing routes:

- Document Management
- Business Sale Support
- Custom Solutions
- Engagement Process

Change them from standalone routes to anchors on the existing Managed Services page:

- Document Management → /managed-services#document-management
- Business Sale Support → /managed-services#business-sale-support
- Custom Solutions → /managed-services#custom-solutions
- Engagement Process → /managed-services#engagement-process

Keep these existing route links as they are:

- Our Managed Services → /managed-services
- Bid Management → /managed-services/bid-management
- Real Estate → /managed-services/real-estate
- HR Services → /managed-services/hr-services

Managed Services CTA:
Text: Need ongoing business support?
Button label: View Managed Services
Button link: /managed-services

FIX 4: CHECK OTHER MEGA MENU LINKS RESOLVE TO EXISTING ROUTES OR SAFE ANCHORS

Make sure the mega menu links follow this rule:

Use real routes only where routes already exist.
Use anchors or query parameters where the final page content will be added later.

Keep these examples as-is:

Applications:
- Overview → /applications
- Operations and Finance → /applications#operations-finance
- People and HR → /applications#people-hr
- Sales and CRM → /applications#sales-crm
- Documents → /applications#documents
- Support Desk → /applications#support-desk
- Learning → /applications#learning
- Analytics → /applications#analytics
- Payments and Billing → /applications#payments-billing

Marketplace:
- Overview → /marketplace
- Marketplace → /marketplace
- Buying Process → /marketplace#buying-process
- List With Us → /marketplace#list-with-us

Membership:
- Overview → /membership
- Basic Membership → /membership#basic
- Standard Membership → /membership#standard
- Premium Membership → /membership#premium
- Sign Up Today → /sign-in

Offers:
- Overview → /offers
- Exclusive Offers → /offers#exclusive
- Top Offers → /offers#top
- Operations → /offers?category=operations
- Human Resources → /offers?category=human-resources
- Admin and Finance → /offers?category=admin-finance
- Sales and Marketing → /offers?category=sales-marketing
- AI → /offers?category=ai
- Finance and Insurance → /offers?category=finance-insurance

Resources:
- Overview → /resources
- Articles → /resources?type=articles
- Guides → /resources?type=guides
- Tools → /resources?type=tools
- Downloads → /resources?type=downloads
- Educational → /resources?type=educational

About Us:
- About Us → /about
- Our Purpose → /about#our-purpose
- Our Platform → /about#our-platform
- Discovery Call → /contact?reason=discovery-call
- Contact → /contact

FIX 5: DO NOT CHANGE THESE WORKING ON-DEMAND LINKS

Keep the current On-Demand Services structure and links:

- On-Demand Overview → /on-demand
- Business Advisor → /on-demand/business-advisor
- Decision Desk → /on-demand/decision-desk
- The Fixer → /on-demand/the-fixer

Document Nucleus:
- Document Nucleus Overview → /document-nucleus/overview
- Templates → /document-nucleus/category/templates
- Documentation Suites → /document-nucleus/category/documentation-suites
- Toolkits → /document-nucleus/category/toolkits
- Process → /document-nucleus/category/process

On-Demand Services:
- Operations Advisory → /on-demand/services#operations-advisory
- Human Resource Advisory → /on-demand/services#human-resource-advisory
- Management Consulting → /on-demand/services#management-consulting
- Change Management → /on-demand/services#change-management
- AI Implementation → /on-demand/services#ai-implementation
- Admin & Finance Consulting → /on-demand/services#admin-finance-consulting
- Customised Solutions → /on-demand/services#customised-solutions

FIX 6: MOBILE MENU

Ensure the mobile menu reflects the same structure as desktop:
- Logo still links to /
- Do not add Home as a desktop menu item
- Mobile may keep a Home link if already present
- Each mega menu should collapse into an accordion
- Help Center mobile accordion must include the completed FAQ, Knowledge Base, Troubleshooting, and Support Center structure
- Managed Services mobile links must use the corrected anchor links for Document Management, Business Sale Support, Custom Solutions, and Engagement Process

FIX 7: ROUTING SAFETY

Do not create new broken paths.

The following should resolve safely because they use existing pages:
- /help with query parameters
- /managed-services with anchors
- /applications with anchors
- /marketplace with anchors
- /membership with anchors
- /offers with query parameters
- /resources with query parameters
- /about with anchors
- /contact with query parameters

Do not add /help/faqs/... routes unless routes.tsx is also updated to support them.

IMPLEMENTATION TARGET FILES

Update:
- src/app/components/Navbar.tsx

Only update routes.tsx if absolutely necessary.
Preferred approach: use existing routes, anchors, and query parameters instead of creating many new placeholder pages.

FINAL ACCEPTANCE CRITERIA

The update is complete when:

1. Desktop main menu does not include Home.
2. Logo links to /.
3. Top utility bar only contains logo, search, Sign In, and Join Now.
4. Help Center uses “Center” spelling consistently.
5. Help Center includes all requested categories under FAQs, Knowledge Base, and Troubleshooting.
6. Help Center links resolve to /help using query parameters.
7. Managed Services extra links use /managed-services anchors, not missing standalone routes.
8. Existing working routes are not removed.
9. Mobile menu matches the corrected desktop menu structure.
10. Page content remains mostly unchanged and can be updated later in GitHub.