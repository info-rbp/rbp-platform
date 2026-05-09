# Phase 1 Route and Screen Audit

## Purpose

This audit records the current route and screen state for Phase 1 UI/UX Completion.

The goal is to identify what exists, what is routed, what is usable, what is decorative, and what is missing before backend contract planning begins.

## Audit Status Legend

- Complete
- Mostly complete
- Partial
- Placeholder
- Duplicate / legacy
- Missing
- Needs redirect
- Needs navigation placement

## Route Groups To Audit

- Public website
- About
- Contact
- Help
- On-Demand Services
- Document Nucleus / DocuShare
- Managed Services
- Applications
- Operations
- Marketplace
- Membership
- Offers
- Resources
- Legal
- Confirmation pages
- Portal/dashboard
- Admin concepts
- Fallback / Not Found
- Legacy redirects

## Route Audit Table

| Path | Page Component | Route Group | Access | Purpose | Current Status | Required Mock Data | Required Mock Service | Required Confirmation / Status State | Mobile QA Status | Desktop QA Status | Build Risk | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| / | HomePage | Public website | public | Public homepage and primary platform entry point. | Partial | Public content, service cards, CTA data | None yet | Contact / membership CTA states | Not reviewed | Not reviewed | Low | Needs visual/content review. |
| /about | AboutPage | About | public | Public about page. | Partial | Public page content | None yet | None | Not reviewed | Not reviewed | Low | Confirm page completeness. |
| /about/what-we-do | WhatWeDoPage | About | public | Explains what RBP does. | Partial | Public page content | None yet | None | Not reviewed | Not reviewed | Low | Confirm route/page exists and is polished. |
| /about/our-process | OurProcessPage | About | public | Explains RBP process. | Partial | Public page content | None yet | None | Not reviewed | Not reviewed | Low | Confirm route/page exists and is polished. |
| /about/work-with-us | WorkWithUsPage | About | public | Work with us / engagement pathway page. | Partial | Public page content | Contact reason options | Contact success state | Not reviewed | Not reviewed | Low | Should route toward contact/discovery CTA. |
| /contact | ContactPage | Contact | public | Public contact and enquiry page. | Partial | Contact reason options | Mock contact submission | Contact success / thank-you | Not reviewed | Not reviewed | Medium | Needs query handling for reason. |
| /contact/success | ContactSuccessPage | Confirmation pages | public | Contact form success page. | Partial | Confirmation content | None | Success state | Not reviewed | Not reviewed | Low | Must not imply real backend submission. |
| /help | HelpCenterPage | Help | public | Help center with FAQ, knowledge base, troubleshooting, and support sections. | Partial | Help articles and categories | None yet | Support CTA state | Not reviewed | Not reviewed | Medium | Needs query support for section/category. |
| /sign-in | SignInPage | Public website | public | Mock sign-in entry page. | Partial | Mock auth messaging | None | None | Not reviewed | Not reviewed | Low | No real auth in Phase 1. |
| /on-demand | OnDemandPage | On-Demand Services | public | On-Demand Services landing page. | Partial | Service catalogue | None yet | Service CTA states | Not reviewed | Not reviewed | Medium | Needs route/content review. |
| /on-demand/business-advisor | BusinessAdvisorPage | On-Demand Services | public | Business Advisor service page. | Partial | Service content | Mock service request | Review/submit/status | Not reviewed | Not reviewed | Medium | Should connect to mock request flow later. |
| /on-demand/decision-desk | DecisionDeskPage | On-Demand Services | public | Decision Desk public/service flow page. | Partial | Decision Desk mock data | Mock Decision Desk service | Review/submit/confirmation/status | Not reviewed | Not reviewed | High | Major Phase 1 flow. |
| /on-demand/the-fixer | TheFixerPage | On-Demand Services | public | The Fixer public/service flow page. | Partial | Fixer mock data | Mock Fixer service | Review/submit/confirmation/status | Not reviewed | Not reviewed | High | Major Phase 1 flow. |
| /on-demand/risk-advisor | RiskAdvisorPage | On-Demand Services | public | Risk Advisor public/service flow page. | Partial | Risk categories, questions | Mock Risk Advisor service | Review/submit/score/status | Not reviewed | Not reviewed | High | Major Phase 1 flow. |
| /on-demand/services | ServicesPage | On-Demand Services | public | On-Demand advisory categories and services page. | Partial | Advisory service categories | None yet | CTA status states | Not reviewed | Not reviewed | Medium | Needs anchor section review. |
| /document-nucleus/overview | DocumentOverviewPage | Document Nucleus / DocuShare | public | Document Nucleus / DocuShare overview. | Partial | Document product catalogue | Mock DocuShare service | Review/submit/confirmation/status | Not reviewed | Not reviewed | High | Major Phase 1 flow. |
| /document-nucleus/category/:id | DocumentCategoryPage | Document Nucleus / DocuShare | public | Document category listing page. | Partial | Document category data | None yet | Product CTA state | Not reviewed | Not reviewed | Medium | Dynamic route must handle unknown IDs. |
| /document-nucleus/product/:id | DocumentProductPage | Document Nucleus / DocuShare | public | Document product detail page. | Partial | Document product data | Mock DocuShare service | Brief/review/submit/status | Not reviewed | Not reviewed | High | Dynamic route must handle unknown IDs. |
| /managed-services | ManagedServicesPage | Managed Services | public | Managed Services landing page. | Partial | Managed services catalogue | Mock enquiry service | Enquiry confirmation/status | Not reviewed | Not reviewed | Medium | Needs anchor section review. |
| /managed-services/bid-management | BidManagementPage | Managed Services | public | Bid Management service page. | Partial | Managed service content | Mock enquiry service | Enquiry confirmation/status | Not reviewed | Not reviewed | Medium | Confirm page polish. |
| /managed-services/real-estate | RealEstatePage | Managed Services | public | Real Estate managed service page. | Partial | Managed service content | Mock enquiry service | Enquiry confirmation/status | Not reviewed | Not reviewed | Medium | Confirm page polish. |
| /managed-services/hr-services | HRServicesPage | Managed Services | public | HR Services managed service page. | Partial | Managed service content | Mock enquiry service | Enquiry confirmation/status | Not reviewed | Not reviewed | Medium | Confirm page polish. |
| /applications | BusinessApplicationsPage | Applications | public | Public applications overview. | Partial | Application catalogue | Mock application enquiry | Request/review/status | Not reviewed | Not reviewed | Medium | Needs sections for integrations, fleet, business watchlist. |
| /operations | OperationsCenterPage | Operations | public | Operations landing page. | Partial | Operations catalogue | None yet | CTA states | Not reviewed | Not reviewed | Medium | Confirm public route. |
| /operations/finance | FinancePage | Operations | public | Finance operations page. | Partial | Finance service content | Mock enquiry service | Enquiry status | Not reviewed | Not reviewed | Medium | Confirm route and content. |
| /operations/finance/business-lending | BusinessLendingPage | Operations | public | Business lending page. | Partial | Lending product content | Mock enquiry service | Enquiry confirmation/status | Not reviewed | Not reviewed | Medium | Confirm flow depth. |
| /operations/finance/business-insurance | BusinessInsurancePage | Operations | public | Business insurance page under finance. | Partial | Insurance product content | Mock enquiry service | Enquiry confirmation/status | Not reviewed | Not reviewed | Medium | Confirm duplication with /operations/insurance. |
| /operations/finance/financial-planning | FinancialPlanningPage | Operations | public | Financial planning page. | Partial | Financial planning content | Mock enquiry service | Enquiry confirmation/status | Not reviewed | Not reviewed | Medium | Confirm flow depth. |
| /operations/finance/credit-and-funding | CreditFundingPage | Operations | public | Credit and funding page. | Partial | Credit/funding content | Mock enquiry service | Enquiry confirmation/status | Not reviewed | Not reviewed | Medium | Confirm flow depth. |
| /operations/insurance | BusinessInsurancePage | Operations | public | Business insurance operations page. | Partial | Insurance product content | Mock enquiry service | Enquiry confirmation/status | Not reviewed | Not reviewed | Medium | Confirm duplication strategy. |
| /operations/connectivity | ConnectivityPage | Operations | public | Connectivity overview page. | Partial | Connectivity plans | Mock connectivity service | Review/submit/order status | Not reviewed | Not reviewed | High | Major Phase 1 flow. |
| /operations/connectivity/nbn-phone | NbnPhonePage | Operations | public | NBN and phone connectivity page. | Partial | NBN/phone plan data | Mock connectivity service | Serviceability/order status | Not reviewed | Not reviewed | High | Major Phase 1 flow. |
| /operations/connectivity/superloop | SuperloopPage | Operations | public | Superloop connectivity page. | Partial | Superloop mock plans | Mock connectivity service | Serviceability/order status | Not reviewed | Not reviewed | High | Major Phase 1 flow. |
| /operations/superloop | SuperloopPage | Legacy redirects | public | Legacy Superloop route. | Needs redirect | Connectivity mock plans | Mock connectivity service | Serviceability/order status | Not reviewed | Not reviewed | Medium | Should remain compatible or redirect to /operations/connectivity/superloop. |
| /operations/calculators | FinanceCalculatorsPage | Operations | public | Finance calculators page. | Partial | Calculator content | None yet | None | Not reviewed | Not reviewed | Medium | Confirm calculator behaviour is frontend-only. |
| /operations/coming-soon | OperationsComingSoonPage | Operations | public | Coming soon operations categories. | Partial | Coming soon categories | None | None | Not reviewed | Not reviewed | Low | Needs anchor section review. |
| /marketplace | MarketplacePage | Marketplace | public | Marketplace landing and listings page. | Partial | Marketplace listings | Mock marketplace service | Enquiry/listing/review/status | Not reviewed | Not reviewed | High | Major Phase 1 flow. |
| /marketplace/product/:id | MarketplaceProductPage | Marketplace | public | Marketplace product/listing detail page. | Partial | Marketplace item data | Mock marketplace service | Enquiry/listing confirmation/status | Not reviewed | Not reviewed | High | Dynamic route must handle unknown IDs. |
| /membership | MembershipPage | Membership | public | Membership landing page. | Partial | Membership plans | Mock membership service | Purchase/review/confirmation/status | Not reviewed | Not reviewed | High | Major Phase 1 flow. |
| /membership/overview | MembershipOverviewPage | Membership | public | Membership overview page. | Partial | Membership plan data | Mock membership service | Purchase status | Not reviewed | Not reviewed | High | Confirm nested membership route. |
| /membership/remote-business-partner-membership | RemoteBusinessPartnerMembershipPage | Membership | public | Main RBP membership product page. | Partial | Membership plan data | Mock membership service | Purchase status | Not reviewed | Not reviewed | High | Confirm page polish. |
| /membership/inclusions | MembershipInclusionsPage | Membership | public | Membership inclusions page. | Partial | Inclusions data | None yet | None | Not reviewed | Not reviewed | Medium | Confirm content. |
| /membership/pricing | MembershipPricingPage | Membership | public | Membership pricing page. | Partial | Pricing mock data | Mock membership service | Payment simulation state | Not reviewed | Not reviewed | High | Pricing should be clearly placeholder/draft if not final. |
| /membership/usage | MembershipUsagePage | Membership | public | Membership usage page. | Partial | Usage rules | None yet | None | Not reviewed | Not reviewed | Medium | Confirm terms are placeholder. |
| /membership/payment-terms | MembershipPaymentTermsPage | Membership | public | Membership payment terms page. | Partial | Payment terms copy | Mock payment simulation only | Payment simulation state | Not reviewed | Not reviewed | High | No real payment processing. |
| /membership/sign-up-now | MembershipSignUpPage | Membership | public | Membership sign-up flow entry. | Partial | Membership plans and form fields | Mock membership signup service | Review/submit/confirmation/status | Not reviewed | Not reviewed | High | Major Phase 1 flow. |
| /membership/frequently-asked-questions | MembershipFaqPage | Membership | public | Membership FAQ page. | Partial | FAQ content | None | None | Not reviewed | Not reviewed | Low | Confirm page polish. |
| /membership/confirmation | MembershipConfirmationPage | Confirmation pages | public | Membership confirmation page. | Partial | Confirmation content | None | Success/status state | Not reviewed | Not reviewed | Low | Must not imply real payment. |
| /offers | OffersPage | Offers | public | Offers listing page. | Partial | Offers mock data | Mock offer interaction if needed | CTA/status state | Not reviewed | Not reviewed | Medium | Needs category query filtering. |
| /resources | ResourcesPage | Resources | public | Resources library page. | Partial | Resources mock data | None yet | Download/read CTA states | Not reviewed | Not reviewed | Medium | Needs type/category query filtering. |
| /legal | LegalIndexPage | Legal | public | Legal index page. | Partial | Legal page content | None | None | Not reviewed | Not reviewed | Low | Placeholder legal copy only. |
| /legal/privacy-policy | PrivacyPolicyPage | Legal | public | Privacy policy page. | Partial | Legal placeholder copy | None | None | Not reviewed | Not reviewed | Low | Legal review later. |
| /legal/terms-of-use | TermsOfUsePage | Legal | public | Terms of use page. | Partial | Legal placeholder copy | None | None | Not reviewed | Not reviewed | Low | Legal review later. |
| /legal/terms-of-engagement | TermsOfEngagementPage | Legal | public | Terms of engagement page. | Partial | Legal placeholder copy | None | None | Not reviewed | Not reviewed | Low | Legal review later. |
| /legal/payment-policy | PaymentPolicyPage | Legal | public | Payment policy page. | Partial | Legal placeholder copy | None | None | Not reviewed | Not reviewed | Low | Legal review later. |
| /legal/services-policy | ServicesPolicyPage | Legal | public | Services policy page. | Partial | Legal placeholder copy | None | None | Not reviewed | Not reviewed | Low | Legal review later. |
| /thank-you | ThankYouPage | Confirmation pages | public | Generic thank-you page. | Partial | Confirmation content | None | Success state | Not reviewed | Not reviewed | Low | Must remain frontend-only. |
| /booking-confirmation | BookingConfirmationPage | Confirmation pages | public | Booking confirmation page. | Partial | Confirmation content | None | Success state | Not reviewed | Not reviewed | Low | Must not imply real booking backend. |
| /portal/dashboard | PortalDashboard | Portal/dashboard | portal | Member dashboard mock screen. | Partial | Portal mock records | Mock portal service | Status cards | Not reviewed | Not reviewed | High | Requires polished mock dashboard. |
| /portal/services | PortalServices | Portal/dashboard | portal | Member services area. | Partial | Service request mock records | Mock portal service | Request status | Not reviewed | Not reviewed | High | Confirm route and polish. |
| /portal/documents | PortalDocuments | Portal/dashboard | portal | Member documents area. | Partial | Document mock records | Mock portal service | Document status | Not reviewed | Not reviewed | High | No live uploads. |
| /portal/offers | PortalOffers | Portal/dashboard | portal | Member offers area. | Partial | Offer mock records | Mock portal service | Offer status | Not reviewed | Not reviewed | Medium | Confirm mock content. |
| /portal/apps | PortalApps | Portal/dashboard | portal | Member applications area. | Partial | Application mock records | Mock portal service | App status | Not reviewed | Not reviewed | Medium | Confirm mock content. |
| /portal/resources | PortalResources | Portal/dashboard | portal | Member resources area. | Partial | Resource mock records | Mock portal service | Resource state | Not reviewed | Not reviewed | Medium | Confirm mock content. |
| /portal/support | PortalSupport | Portal/dashboard | portal | Member support area. | Partial | Support mock records | Mock portal service | Ticket status | Not reviewed | Not reviewed | High | No real support backend. |
| /portal/settings | PortalSettings | Portal/dashboard | portal | Member settings area. | Partial | Mock user profile | Mock portal service | Save confirmation | Not reviewed | Not reviewed | Medium | No real account updates. |
| /admin/dashboard | AdminDashboard | Admin concepts | admin | Admin dashboard concept. | Partial | Admin mock records | Mock admin service | Review/status queues | Not reviewed | Not reviewed | High | Admin concept only. |
| /admin/site-content | AdminSiteContentPage | Admin concepts | admin | Admin site content concept. | Partial | Content mock records | Mock admin service | Review/publish states | Not reviewed | Not reviewed | High | No real CMS backend. |
| /admin/requests | AdminRequestsPage | Admin concepts | admin | Admin requests review concept. | Partial | Request mock records | Mock admin service | Review/status states | Not reviewed | Not reviewed | High | Covers major submissions. |
| /admin/marketplace | AdminMarketplacePage | Admin concepts | admin | Admin marketplace review concept. | Partial | Marketplace mock records | Mock admin service | Approve/reject/status | Not reviewed | Not reviewed | High | No real publishing. |
| /admin/membership | AdminMembershipPage | Admin concepts | admin | Admin membership review concept. | Partial | Membership mock records | Mock admin service | Review/status states | Not reviewed | Not reviewed | High | No real billing/admin backend. |
| /admin/audit-review | AdminAuditReviewPage | Admin concepts | admin | Admin audit/review concept. | Partial | Audit mock records | Mock admin service | Review timeline | Not reviewed | Not reviewed | High | Mock only. |
| * | NotFoundPage | Fallback / Not Found | public | Public fallback route. | Partial | None | None | 404 state | Not reviewed | Not reviewed | Medium | Confirm bad public routes render Not Found. |

## Manual Review Required

This audit is a controlled Step 2 planning artifact. It should now be manually reviewed against the actual repository routes and screens.

For every route, confirm:

- Whether the page is visually complete or only a placeholder.
- Whether the route should remain, redirect, or be marked legacy.
- Whether the page needs mock data.
- Whether the page needs a mock service.
- Whether the page needs review, submit, confirmation, or status states.
- Whether mobile and desktop layouts are acceptable.
- Whether the route creates build or navigation risk.

## Exit Criteria

Every route must be accounted for. No mystery pages should remain.
