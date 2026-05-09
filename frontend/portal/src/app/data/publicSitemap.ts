export type PublicPageStatus =
  | "ready"
  | "placeholder"
  | "content-required"
  | "backend-later"
  | "legal-review-required";

export type PublicDestinationType =
  | "full-page"
  | "anchor"
  | "query-filter"
  | "dynamic-detail"
  | "legacy"
  | "confirmation"
  | "legal";

export interface PublicSitemapItem {
  title: string;
  path: string;
  section: string;
  type: PublicDestinationType;
  status: PublicPageStatus;
  backendRequired: boolean;
  notes?: string;
}

export const publicSitemap: PublicSitemapItem[] = [
  { title: "Home", path: "/", section: "Core", type: "full-page", status: "ready", backendRequired: false },
  { title: "About", path: "/about", section: "About", type: "full-page", status: "ready", backendRequired: false },
  { title: "What We Do", path: "/about/what-we-do", section: "About", type: "full-page", status: "ready", backendRequired: false },
  { title: "Our Process", path: "/about/our-process", section: "About", type: "full-page", status: "ready", backendRequired: false },
  { title: "Work With Us", path: "/about/work-with-us", section: "About", type: "full-page", status: "ready", backendRequired: false },
  { title: "Contact", path: "/contact", section: "Core", type: "full-page", status: "backend-later", backendRequired: true },
  { title: "Contact Success", path: "/contact/success", section: "Confirmation", type: "confirmation", status: "placeholder", backendRequired: false },
  { title: "Help Center", path: "/help", section: "Help", type: "full-page", status: "ready", backendRequired: false },
  { title: "Sign In", path: "/sign-in", section: "Core", type: "full-page", status: "backend-later", backendRequired: true },

  { title: "On-Demand Services", path: "/on-demand", section: "On-Demand", type: "full-page", status: "ready", backendRequired: false },
  { title: "Business Advisor", path: "/on-demand/business-advisor", section: "On-Demand", type: "full-page", status: "ready", backendRequired: false },
  { title: "Decision Desk", path: "/on-demand/decision-desk", section: "On-Demand", type: "full-page", status: "ready", backendRequired: false },
  { title: "The Fixer", path: "/on-demand/the-fixer", section: "On-Demand", type: "full-page", status: "ready", backendRequired: false },
  { title: "Risk Advisor", path: "/on-demand/risk-advisor", section: "On-Demand", type: "full-page", status: "ready", backendRequired: false },
  { title: "On-Demand Services Categories", path: "/on-demand/services", section: "On-Demand", type: "full-page", status: "ready", backendRequired: false },

  { title: "Document Nucleus", path: "/document-nucleus/overview", section: "Document Nucleus", type: "full-page", status: "ready", backendRequired: false },
  { title: "Document Category", path: "/document-nucleus/category/:id", section: "Document Nucleus", type: "dynamic-detail", status: "backend-later", backendRequired: true },
  { title: "Document Product", path: "/document-nucleus/product/:id", section: "Document Nucleus", type: "dynamic-detail", status: "backend-later", backendRequired: true },

  { title: "Managed Services", path: "/managed-services", section: "Managed Services", type: "full-page", status: "ready", backendRequired: false },
  { title: "Bid Management", path: "/managed-services/bid-management", section: "Managed Services", type: "full-page", status: "ready", backendRequired: false },
  { title: "Real Estate", path: "/managed-services/real-estate", section: "Managed Services", type: "full-page", status: "ready", backendRequired: false },
  { title: "HR Services", path: "/managed-services/hr-services", section: "Managed Services", type: "full-page", status: "ready", backendRequired: false },

  { title: "Applications", path: "/applications", section: "Applications", type: "full-page", status: "ready", backendRequired: false },

  { title: "Operations", path: "/operations", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Business Finance", path: "/operations/finance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Business Lending", path: "/operations/finance/business-lending", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Business Insurance", path: "/operations/finance/business-insurance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Financial Planning", path: "/operations/finance/financial-planning", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Credit and Funding", path: "/operations/finance/credit-and-funding", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Insurance", path: "/operations/insurance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Connectivity", path: "/operations/connectivity", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "NBN & Phone", path: "/operations/connectivity/nbn-phone", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Superloop Connectivity", path: "/operations/connectivity/superloop", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Calculators", path: "/operations/calculators", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Coming Soon", path: "/operations/coming-soon", section: "Operations", type: "full-page", status: "placeholder", backendRequired: false },

  { title: "Marketplace", path: "/marketplace", section: "Marketplace", type: "full-page", status: "ready", backendRequired: false },
  { title: "Marketplace Product", path: "/marketplace/product/:id", section: "Marketplace", type: "dynamic-detail", status: "backend-later", backendRequired: true },

  { title: "Membership", path: "/membership", section: "Membership", type: "full-page", status: "ready", backendRequired: false },
  { title: "Membership Overview", path: "/membership/overview", section: "Membership", type: "full-page", status: "ready", backendRequired: false },
  { title: "Membership Pricing", path: "/membership/pricing", section: "Membership", type: "full-page", status: "ready", backendRequired: false },
  { title: "Membership Sign Up", path: "/membership/sign-up-now", section: "Membership", type: "full-page", status: "backend-later", backendRequired: true },
  { title: "Membership Confirmation", path: "/membership/confirmation", section: "Confirmation", type: "confirmation", status: "placeholder", backendRequired: false },

  { title: "Offers", path: "/offers", section: "Offers", type: "full-page", status: "ready", backendRequired: false },
  { title: "Resources", path: "/resources", section: "Resources", type: "full-page", status: "ready", backendRequired: false },

  { title: "Privacy Policy", path: "/legal/privacy-policy", section: "Legal", type: "legal", status: "legal-review-required", backendRequired: false },
  { title: "Terms of Use", path: "/legal/terms-of-use", section: "Legal", type: "legal", status: "legal-review-required", backendRequired: false },
  { title: "Terms of Engagement", path: "/legal/terms-of-engagement", section: "Legal", type: "legal", status: "legal-review-required", backendRequired: false },
  { title: "Payment Policy", path: "/legal/payment-policy", section: "Legal", type: "legal", status: "legal-review-required", backendRequired: false },
  { title: "Services Policy", path: "/legal/services-policy", section: "Legal", type: "legal", status: "legal-review-required", backendRequired: false },

  { title: "Thank You", path: "/thank-you", section: "Confirmation", type: "confirmation", status: "placeholder", backendRequired: false },
  { title: "Booking Confirmation", path: "/booking-confirmation", section: "Confirmation", type: "confirmation", status: "placeholder", backendRequired: false },

  { title: "Offer Category Filter", path: "/offers?category=:category", section: "Offers", type: "query-filter", status: "backend-later", backendRequired: true },
  { title: "Resource Type Filter", path: "/resources?type=:type", section: "Resources", type: "query-filter", status: "backend-later", backendRequired: true },
  { title: "Resource Category Filter", path: "/resources?category=:category", section: "Resources", type: "query-filter", status: "backend-later", backendRequired: true },
  { title: "Help Query Filter", path: "/help?section=:section&category=:category", section: "Help", type: "query-filter", status: "backend-later", backendRequired: true },
];
