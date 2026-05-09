Yes, go ahead and make all four changes.

Please update only the admin sidebar/navigation logic needed to support collapsible groups:

1. Add `ChevronDown` to the icon imports.
2. Replace the flat `NAV_ITEMS` array with a grouped `NAV_GROUPS` structure.
3. Add open/close state for sidebar groups inside the sidebar component.
4. Update the top bar breadcrumb/page title logic so it works with grouped navigation.

Do not change:

* Admin dashboard content
* Cards
* Tables
* Top bar layout
* Sign-out area
* Admin user block
* Existing visual styling
* Public website navigation
* Member portal navigation

Use the grouped sidebar structure below.

Admin Dashboard

* Dashboard → /admin/dashboard
* To Do Tasks → /admin/tasks
* Discovery Calls → /admin/discovery-calls
* Other → /admin/other

On-Demand Services

* Dashboard → /admin/on-demand
* Business Advisor → /admin/on-demand/business-advisor
* Decision Desk → /admin/on-demand/decision-desk
* The Fixer → /admin/on-demand/the-fixer
* Document Nucleus → /admin/on-demand/document-nucleus
* Templates → /admin/on-demand/document-nucleus/templates
* Documentation Suites → /admin/on-demand/document-nucleus/documentation-suites
* Toolkits → /admin/on-demand/document-nucleus/toolkits
* Process → /admin/on-demand/document-nucleus/process
* On-Demand Services → /admin/on-demand/services

Managed Services

* Dashboard → /admin/managed-services
* Bid Management → /admin/managed-services/bid-management
* Real Estate → /admin/managed-services/real-estate
* HR Services → /admin/managed-services/hr-services
* Document Management → /admin/managed-services/document-management
* Business Sale Support → /admin/managed-services/business-sale-support
* Custom Solutions → /admin/managed-services/custom-solutions

Applications

* Dashboard → /admin/applications
* Operations and Finance → /admin/applications/operations-finance
* People and HR → /admin/applications/people-hr
* Sales and CRM → /admin/applications/sales-crm
* Documents → /admin/applications/documents
* Support Desk → /admin/applications/support-desk
* Learning → /admin/applications/learning
* Analytics → /admin/applications/analytics
* Payments and Billing → /admin/applications/payments-billing
* Integrations → /admin/applications/integrations

Operations

* Dashboard → /admin/operations
* Business Finance → /admin/operations/business-finance
* Business Insurance → /admin/operations/business-insurance
* Superloop Connectivity → /admin/operations/superloop-connectivity
* Calculators → /admin/operations/calculators

Marketplace

* Dashboard → /admin/marketplace
* Marketplace → /admin/marketplace/listings
* Listings → /admin/marketplace/listings
* Buying Process → /admin/marketplace/buying-process
* List With Us → /admin/marketplace/list-with-us

Membership

* Dashboard → /admin/membership
* Memberships → /admin/membership/memberships
* Members → /admin/membership/members
* Payments → /admin/membership/payments
* Portal Access → /admin/membership/portal-access

Offers

* Dashboard → /admin/offers
* All Offers → /admin/offers/all
* Offer Listings → /admin/offers/listings
* Offer Categories → /admin/offers/categories
* Redemptions → /admin/offers/redemptions

Resources

* Resource Dashboard → /admin/resources
* Articles → /admin/resources/articles
* Guides → /admin/resources/guides
* Tools → /admin/resources/tools
* Downloads → /admin/resources/downloads
* Educational → /admin/resources/educational

Help Center

* Dashboard → /admin/help-center
* Frequently Asked Questions → /admin/help-center/faqs
* Knowledge Base → /admin/help-center/knowledge-base
* Troubleshooting → /admin/help-center/troubleshooting
* Resources → /admin/help-center/resources
* Support Center → /admin/help-center/support

Site Content

* Public Pages → /admin/site-content/pages
* Page Sections → /admin/site-content/sections
* Mega Menu → /admin/site-content/mega-menu
* SEO / Metadata → /admin/site-content/seo
* Header / Footer → /admin/site-content/header-footer
* Content Status → /admin/site-content/status

Settings

* Platform Settings → /admin/settings/platform
* Admin Users → /admin/settings/admin-users
* Integration Settings → /admin/settings/integrations
* Firebase Readiness → /admin/settings/firebase-readiness
* Access Control → /admin/settings/access-control

Behaviour requirements:

* Sidebar groups should be collapsible.
* The active group should automatically be expanded based on the current route.
* The selected child item should show the strongest active style.
* The parent group should show an active state when any child route inside it is active.
* If a user manually opens or closes a group, preserve that behaviour while staying on the admin section.
* Keep the sidebar scrollable.
* Keep admin user/sign-out section pinned at the bottom.
* Keep the “View Site” top bar link unchanged.

For now, these can be placeholder routes. The actual pages and route components will be added later in GitHub/Firebase Studio. The goal of this step is only to update the sidebar structure and navigation data cleanly.
