# Public Website Shell Checklist

## Summary of Step 5 Changes

Step 5 reconciles the Phase 1 public website shell so the route-backed public experience is coherent, navigable, and explicitly frontend-only. The implementation keeps the existing route structure, Navbar, Footer, Tailwind-style visual language, and static/mock content approach.

## Pages Reviewed

Reviewed the public route model covering:

    /
    /about
    /about/what-we-do
    /about/our-process
    /about/work-with-us
    /contact
    /contact/success
    /help
    /sign-in
    /on-demand
    /on-demand/business-advisor
    /on-demand/decision-desk
    /on-demand/the-fixer
    /on-demand/risk-advisor
    /on-demand/services
    /on-demand/documents
    /document-nucleus/overview
    /document-nucleus/category/:id
    /document-nucleus/product/:id
    /managed-services
    /managed-services/bid-management
    /managed-services/real-estate
    /managed-services/hr-services
    /applications
    /operations
    /operations/finance
    /operations/finance/business-lending
    /operations/finance/business-insurance
    /operations/finance/financial-planning
    /operations/finance/credit-and-funding
    /operations/insurance
    /operations/connectivity
    /operations/connectivity/nbn-phone
    /operations/connectivity/superloop
    /operations/superloop
    /operations/calculators
    /operations/coming-soon
    /marketplace
    /marketplace/product/:id
    /membership
    /membership/overview
    /membership/remote-business-partner-membership
    /membership/inclusions
    /membership/pricing
    /membership/usage
    /membership/payment-terms
    /membership/sign-up-now
    /membership/frequently-asked-questions
    /membership/confirmation
    /offers
    /resources
    /legal
    /legal/privacy-policy
    /legal/terms-of-use
    /legal/terms-of-engagement
    /legal/payment-policy
    /legal/services-policy
    /thank-you
    /booking-confirmation
    /confirmation/thank-you
    /confirmation/contact-success
    /confirmation/booking-confirmation
    /confirmation/membership-confirmation
    public fallback route

## Pages Improved

Updated the shared public hero CTA rendering so PageHero primary and secondary CTAs display consistently across public shell pages.

Updated public CTA destinations to use Phase 1-safe routes:

    Book Discovery Call -> /contact?reason=discovery-call
    Request App Setup -> /contact?reason=application-setup
    Request Managed Services -> /contact?reason=managed-services
    List With Us -> /marketplace#list-with-us
    Join Now -> /membership/sign-up-now
    Sign In -> /sign-in
    Contact Support -> /help?section=support
    Browse Resources -> /resources
    Browse Offers -> /offers
    View Marketplace -> /marketplace

Improved frontend-only language in contact, support, resources, and marketplace areas where users might otherwise expect real submission, ticketing, email, payment, or backend behaviour.

## Anchor Sections Confirmed

Confirmed or added the required public anchor IDs:

    /on-demand/services
    overview
    how-it-works
    core-services
    advisory-categories
    operations-advisory
    human-resource-advisory
    accounting-finance
    sales-marketing
    management-consulting
    change-management
    ai-advisory
    research-development
    information-technology
    public-relations
    customised-solutions

    /managed-services
    overview
    document-management
    change-management
    business-sale-support
    franchise
    lms
    custom-solutions
    engagement-process
    how-managed-services-work

    /applications
    overview
    how-these-work
    operations-finance
    people-hr
    sales-crm
    documents
    support-desk
    learning
    analytics
    payments-billing
    integrations
    fleet-management
    business-watchlist

    /marketplace
    overview
    rbp-products
    rbp-assets
    third-party-products-assets
    buying-process
    list-with-us

    /offers
    overview
    exclusive
    top

    /about
    our-purpose
    our-platform

## Query Parameter Handling Confirmed

Confirmed or preserved public-shell query handling:

    /contact?reason=discovery-call
    /contact?reason=application-setup
    /contact?reason=managed-services
    /help?section=faqs
    /help?section=knowledge-base
    /help?section=troubleshooting
    /help?section=support
    /offers?category=travel
    /offers?category=digital-tech
    /offers?category=operations
    /offers?category=ai
    /resources?type=guides
    /resources?category=finance
    /resources?type=guides&category=finance

## Known Placeholders

The contact form, newsletter subscribe area, support path, marketplace enquiry, offers claiming, payment references, and application setup CTAs remain frontend-only placeholders.

Confirmation states are illustrative and do not send email, create CRM records, create tickets, process payments, upload files, authenticate users, or persist records.

## Deferred to Later Phase 1 Flow Work

The following items remain for later Phase 1 flow completion:

    Full mock membership sign-up flow states
    Full mock Decision Desk flow states
    Full mock DocuShare flow states
    Full mock marketplace enquiry/listing states
    Full mock NBN/connectivity order simulation states
    Full mock Risk Advisor assessment states
    Full mock The Fixer request states
    Broader mobile/tablet/desktop QA screenshots
    Phase 1 audit script coverage

## Backend-Safe Confirmation

No backend, Firebase Auth, Firestore, Frappe API, real payment processing, live upload, real email, booking system, support ticket backend, production authentication guard, admin permissions, or member entitlement logic was added for Step 5.
