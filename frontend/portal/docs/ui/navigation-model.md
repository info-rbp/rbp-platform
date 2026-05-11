# Phase 1 Navigation Model

## Purpose

This document defines the Phase 1 navigation model for the Remote Business Partner application.

The goal is to create a clear route and navigation source of truth before deeper frontend implementation and later backend contract planning.

Phase 1 navigation should support:

- Public website navigation
- Footer navigation
- Utility navigation
- Mobile navigation
- Portal sidebar navigation
- Admin concept navigation
- Breadcrumb rules
- CTA rules
- Legacy redirect rules

This document is a planning and implementation reference. The matching TypeScript configuration lives in:

    src/app/config/navigation.ts
    src/app/config/redirects.ts

## Navigation Principles

The application should use navigation configuration rather than scattered hardcoded navigation arrays.

Navigation must be:

- Route-aware
- Mobile-friendly
- Consistent across desktop and mobile
- Friendly to future backend/admin management
- Safe for Phase 1 frontend-only implementation
- Free of real backend, auth, payment, upload, or Frappe dependencies

## Public Navigation

The public navigation should include:

    On-Demand Services
    Managed Services
    Applications
    Operations
    Marketplace
    Membership
    Offers
    Resources
    Help Center
    About Us

The logo should link to:

    /

Utility navigation should include:

    Search
    Contact
    Sign In
    Join Now

Join Now should point to:

    /membership/sign-up-now

Sign In should point to:

    /sign-in

## Public Navigation Sections

### On-Demand Services

    Overview -> /on-demand
    Business Advisor -> /on-demand/business-advisor
    Decision Desk -> /on-demand/decision-desk
    The Fixer -> /on-demand/the-fixer
    Risk Advisor -> /on-demand/risk-advisor
    On-Demand Services -> /on-demand/services
    Document Nucleus -> /document-nucleus/overview
    Templates -> /document-nucleus/category/templates
    Documentation Suites -> /document-nucleus/category/documentation-suites
    Toolkits -> /document-nucleus/category/toolkits
    Process -> /document-nucleus/category/process

### Managed Services

    Overview -> /managed-services
    Bid Management -> /managed-services/bid-management
    Real Estate -> /managed-services/real-estate
    HR Services -> /managed-services/hr-services
    Document Management -> /managed-services#document-management
    Change Management -> /managed-services#change-management
    Business Sale Support -> /managed-services#business-sale-support
    Franchise -> /managed-services#franchise
    LMS -> /managed-services#lms
    Custom Solutions -> /managed-services#custom-solutions
    Engagement Process -> /managed-services#engagement-process

### Applications

    Overview -> /applications
    How These Work -> /applications#how-these-work
    Operations and Finance -> /applications#operations-finance
    People and HR -> /applications#people-hr
    Sales and CRM -> /applications#sales-crm
    Documents -> /applications#documents
    Support Desk -> /applications#support-desk
    Learning -> /applications#learning
    Analytics -> /applications#analytics
    Payments and Billing -> /applications#payments-billing
    Integrations -> /applications#integrations
    Fleet Management -> /applications#fleet-management
    Business Watchlist -> /applications#business-watchlist

### Operations

    Overview -> /operations
    Business Finance -> /operations/finance
    Business Lending -> /operations/finance/business-lending
    Business Insurance -> /operations/finance/business-insurance
    Financial Planning -> /operations/finance/financial-planning
    Credit and Funding -> /operations/finance/credit-and-funding
    Insurance -> /operations/insurance
    Connectivity -> /operations/connectivity
    NBN and Phone -> /operations/connectivity/nbn-phone
    Superloop Connectivity -> /operations/connectivity/superloop
    Calculators -> /operations/calculators
    Coming Soon -> /operations/coming-soon

### Marketplace

    Overview -> /marketplace
    RBP Products -> /marketplace#rbp-products
    RBP Assets -> /marketplace#rbp-assets
    Third Party Products and Assets -> /marketplace#third-party-products-assets
    Buying Process -> /marketplace#buying-process
    List With Us -> /marketplace#list-with-us

### Membership

    Overview -> /membership/overview
    Remote Business Partner Membership -> /membership/remote-business-partner-membership
    Inclusions -> /membership/inclusions
    Pricing -> /membership/pricing
    Usage -> /membership/usage
    Payment Terms -> /membership/payment-terms
    Sign Up Now -> /membership/sign-up-now
    Frequently Asked Questions -> /membership/frequently-asked-questions

### Offers

    Overview -> /offers
    Exclusive Offers -> /offers#exclusive
    Top Offers -> /offers#top
    Travel -> /offers?category=travel
    Fitness and Health -> /offers?category=fitness-health
    Home and Garden -> /offers?category=home-garden
    Delivery -> /offers?category=delivery
    Digital and Tech -> /offers?category=digital-tech
    Finance and Insurance -> /offers?category=finance-insurance
    Other -> /offers?category=other
    Operations -> /offers?category=operations
    Human Resources -> /offers?category=human-resources
    Admin and Finance -> /offers?category=admin-finance
    Sales and Marketing -> /offers?category=sales-marketing
    AI -> /offers?category=ai

### Resources

    Overview -> /resources
    Articles -> /resources?type=articles
    Guides -> /resources?type=guides
    Tools -> /resources?type=tools
    Downloads -> /resources?type=downloads
    Educational -> /resources?type=educational
    Strategy -> /resources?category=strategy
    Finance -> /resources?category=finance
    Sales and Marketing -> /resources?category=sales-marketing
    Research and Development -> /resources?category=research-development
    Information Technology -> /resources?category=information-technology
    Customer Service -> /resources?category=customer-service
    Human Resources -> /resources?category=human-resources
    Design -> /resources?category=design
    Communications -> /resources?category=communications
    Governance -> /resources?category=governance
    Production -> /resources?category=production
    Sourcing -> /resources?category=sourcing
    Quality Management -> /resources?category=quality-management
    Distribution -> /resources?category=distribution
    Operations -> /resources?category=operations
    Other -> /resources?category=other

### Help Center

    Help Center -> /help
    FAQs -> /help?section=faqs
    Knowledge Base -> /help?section=knowledge-base
    Troubleshooting -> /help?section=troubleshooting
    Support -> /help?section=support

### About Us

    About Us -> /about
    What We Do -> /about/what-we-do
    Our Process -> /about/our-process
    Work With Us -> /about/work-with-us
    Discovery Call -> /contact?reason=discovery-call
    Contact Us -> /contact

## Footer Navigation

Footer navigation should include:

    Home
    About
    Contact
    Help Center
    On-Demand Services
    Managed Services
    Applications
    Operations
    Marketplace
    Membership
    Offers
    Resources
    Legal

Footer legal links should include:

    Privacy Policy
    Terms of Use
    Terms of Engagement
    Payment Policy
    Services Policy

## Portal Navigation

Portal navigation should include:

    Dashboard
    My Services
    Advisory Sessions
    Documents
    Partner Offers
    Applications
    Resources
    Support
    Settings

Priority 2 portal navigation uses live Frappe session state and live portal data by default.

Canonical member portal routes:

    /portal/dashboard
    /portal/membership
    /portal/services
    /portal/services/request
    /portal/services/:id
    /portal/documents
    /portal/offers
    /portal/apps
    /portal/resources
    /portal/billing
    /portal/notifications
    /portal/support
    /portal/settings

Portal sidebar navigation:

    Dashboard
    Membership
    Services
    Documents
    Offers
    Applications
    Resources
    Billing
    Notifications
    Support
    Settings

Portal data fallback rule:

    Mock portal services, documents and notifications may only be loaded when VITE_USE_MOCK_PORTAL=true or an equivalent explicit development flag is enabled.

## Portal Route Compatibility

| Old route | Canonical route | Redirect behaviour | Owner |
| --- | --- | --- | --- |
| /portal/account | /portal/settings | React Navigate and Frappe website_redirects | Frontend and backend |
| /portal/library | /portal/documents | React Navigate and Frappe website_redirects | Frontend and backend |
| /portal/decision-desk | /portal/services?type=decision-desk | React Navigate and Frappe website_redirects | Frontend and backend |
| /portal/decision-desk/history | /portal/services?type=decision-desk | React Navigate and Frappe website_redirects | Frontend and backend |
| /portal/finance | /portal/services?type=finance | React Navigate and Frappe website_redirects | Frontend and backend |
| /portal/finance/enquiries | /portal/services?type=finance | React Navigate and Frappe website_redirects | Frontend and backend |
| /portal/sessions | /portal/services?type=session | React Navigate and Frappe website_redirects | Frontend and backend |

## Admin Concept Navigation

Admin concept navigation should include:

    Admin Dashboard
    Site Content
    Requests
    Marketplace
    Membership
    Offers
    Resources
    Audit and Review
    Settings

Phase 1 admin navigation uses mock records only.

## CTA Rules

Core public CTAs should map as follows:

    Book Discovery Call -> /contact?reason=discovery-call
    Request App Setup -> /contact?reason=application-setup
    Request Managed Services -> /contact?reason=managed-services
    List With Us -> /marketplace#list-with-us
    Join Now -> /membership/sign-up-now
    Sign In -> /sign-in
    Contact Support -> /help?section=support

## Legacy Redirect Rules

Legacy routes should remain safe.

Recommended redirects or compatibility rules:

    /business-advisor -> /on-demand/business-advisor
    /decision-desk -> /on-demand/decision-desk
    /the-fixer -> /on-demand/the-fixer
    /risk-advisor -> /on-demand/risk-advisor
    /docushare -> /document-nucleus/overview
    /services -> /on-demand/services
    /finance -> /operations/finance
    /finance/business-lending -> /operations/finance/business-lending
    /finance/business-insurance -> /operations/finance/business-insurance
    /finance/financial-planning -> /operations/finance/financial-planning
    /finance/credit-and-funding -> /operations/finance/credit-and-funding
    /operations/superloop -> /operations/connectivity/superloop
    /membership/sign-up -> /membership/sign-up-now
    /membership/faq -> /membership/frequently-asked-questions
    /privacy-policy -> /legal/privacy-policy
    /terms-of-use -> /legal/terms-of-use

## Step 4 Exit Criteria

Step 4 is complete when:

    Public navigation is defined in configuration.
    Footer navigation is defined in configuration.
    Utility navigation is defined in configuration.
    Mobile navigation has a clear source.
    Portal navigation is defined in configuration.
    Admin concept navigation is defined in configuration.
    CTA rules are defined.
    Legacy redirect rules are defined.
    TypeScript build passes.
    The working tree is clean after commit.
