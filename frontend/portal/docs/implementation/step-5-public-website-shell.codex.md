# Step 5: Complete the Public Website Shell

## Goal

Complete and reconcile the public-facing website shell for Phase 1 UI/UX Completion.

This is a frontend-only implementation task.

The public site should feel coherent, navigable, and complete enough that a user can understand the Remote Business Partner platform and move into public CTA paths, mock enquiry paths, membership sign-up, document/product browsing, marketplace browsing, resources, offers, help, legal, and confirmation pages.

## Critical Scope Rules

Do not implement backend logic.

Do not implement:

- Firebase Auth
- Firestore persistence
- Frappe APIs
- Real payment processing
- Real file uploads
- Real email sending
- Real booking systems
- Real marketplace checkout
- Real offer redemption
- Real support ticket backend
- Real authentication guards
- Real admin permissions
- Real member entitlements

Use frontend-only page shells, static content, placeholder data, and mock-safe CTAs only.

## Branch

Work on:

    feature/step-5-public-website-shell

Do not work directly on main, develop, or phase/phase-1-uiux-completion.

## Existing Repo Context

The app already has a broad public route structure in:

    src/app/routes.tsx

The route file already imports and routes many public shell pages, including:

- Core public pages
- About pages
- On-Demand pages
- Document Nucleus pages
- Managed Services pages
- Applications pages
- Operations pages
- Marketplace page
- Membership pages
- Offers and Resources pages
- Legal pages
- Confirmation pages
- Public Not Found fallback

The public shell work should improve and reconcile these existing pages rather than replacing the route structure unnecessarily.

## Source of Truth Files

Use these existing Phase 1 files as guidance:

    docs/phase-1-scope.md
    docs/phase-1-definition-of-done.md
    docs/phase-1-exclusions.md
    docs/ui/route-audit.md
    docs/ui/navigation-model.md
    src/app/config/routes.registry.ts
    src/app/config/navigation.ts
    src/app/config/redirects.ts

## Step 5 Deliverables

Create or update:

    docs/ui/public-website-shell-checklist.md

Update public page components as needed so every major public page has:

- Navbar
- Footer
- Hero section
- Short intro/value proposition
- Main content sections
- Related links
- Primary CTA
- Secondary CTA where useful
- Empty/placeholder states where content is not final
- Clear frontend-only language where submission/payment/auth would normally occur
- Responsive layout using existing styling conventions

## Public Pages To Review and Complete

Review and improve these route-backed public pages:

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

## Required Anchor Sections

Ensure the following pages contain matching section IDs.

### /on-demand/services

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

### /managed-services

    overview
    document-management
    change-management
    business-sale-support
    franchise
    lms
    custom-solutions
    engagement-process
    how-managed-services-work

### /applications

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

### /marketplace

    overview
    rbp-products
    rbp-assets
    third-party-products-assets
    buying-process
    list-with-us

### /offers

    overview
    exclusive
    top

### /about

    our-purpose
    our-platform

## Query Parameter Handling

Do a light public-shell pass only.

Do not build real backend behaviour.

### /contact

Read the reason query parameter if the page already supports or can safely support it.

Examples:

    /contact?reason=discovery-call
    /contact?reason=application-setup
    /contact?reason=managed-services

Show or preselect a frontend-only enquiry reason if practical.

### /help

Support public shell display for:

    /help?section=faqs
    /help?section=knowledge-base
    /help?section=troubleshooting
    /help?section=support

### /offers

Support or preserve category query shell behaviour:

    /offers?category=travel
    /offers?category=digital-tech
    /offers?category=operations
    /offers?category=ai

### /resources

Support or preserve type/category query shell behaviour:

    /resources?type=guides
    /resources?category=finance
    /resources?type=guides&category=finance

## CTA Paths

Use these safe frontend-only CTA destinations:

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

## Visual Rules

Use the existing application design language:

- White backgrounds
- Slate text
- Blue primary CTAs
- Rounded cards
- Subtle borders
- Responsive layouts
- Existing Navbar and Footer
- Existing Tailwind-style utility classes
- Existing icon system if already used

Do not introduce a new design system.

Do not install new dependencies unless absolutely required. This task should not need new dependencies.

## Documentation Requirement

Create:

    docs/ui/public-website-shell-checklist.md

Include:

- Summary of Step 5 changes
- Pages reviewed
- Pages improved
- Anchor sections confirmed
- Query parameter handling confirmed
- CTA paths confirmed
- Known placeholders
- Items deferred to later Phase 1 flow work
- Confirmation that no backend/auth/payment/upload/Frappe logic was added

## Do Not Modify

Avoid modifying member portal and admin portal pages unless required to fix a build error caused by public shell changes.

Do not refactor routes broadly unless required.

Do not delete existing routes.

Do not remove legacy compatibility routes.

Do not delete existing branches or files unrelated to the public shell.

## Acceptance Criteria

Step 5 is complete when:

- Public website route shells render coherently.
- Major public pages have Navbar and Footer.
- Major public pages have hero, intro, main sections, CTA, related links, and placeholder-safe content.
- Required anchor section IDs exist.
- Public CTAs point to safe frontend-only routes.
- Legal pages exist and remain placeholder-safe.
- Confirmation pages exist and do not imply real backend actions.
- Not Found fallback exists.
- No backend/Firebase/Frappe/payment/upload logic is introduced.
- docs/ui/public-website-shell-checklist.md exists.
- npm run build passes.
- dist/ is removed before commit.
