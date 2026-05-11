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
  { title: "Commercial Finance", path: "/operations/finance/commercial-finance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Chattel Mortgage", path: "/operations/finance/chattel-mortgage", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Unsecured Business Loans", path: "/operations/finance/unsecured-business-loans", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Commercial Equipment Finance", path: "/operations/finance/commercial-equipment-finance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Business Vehicle Finance", path: "/operations/finance/business-vehicle-finance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Novated Leasing", path: "/operations/finance/novated-leasing", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Cashflow Finance", path: "/operations/finance/cashflow-finance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Debtor Finance", path: "/operations/finance/debtor-finance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Construction Loans", path: "/operations/finance/construction-loans", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Other Lending", path: "/operations/finance/other-lending", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Commercial Loan Calculator", path: "/operations/finance/commercial-loan-calculator", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Chattel Mortgage Calculator", path: "/operations/finance/chattel-mortgage-calculator", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Borrowing Capacity Calculator", path: "/operations/finance/borrowing-capacity-calculator", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Finance FAQs", path: "/operations/finance/faqs", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Get Funded", path: "/operations/finance/get-funded", section: "Operations", type: "full-page", status: "backend-later", backendRequired: false },
  { title: "Business Insurance", path: "/operations/insurance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Public Liability Insurance", path: "/operations/insurance/public-liability-insurance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Professional Indemnity", path: "/operations/insurance/professional-indemnity", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Cyber Liability", path: "/operations/insurance/cyber-liability", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Management Liability", path: "/operations/insurance/management-liability", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Personal Accident and Illness", path: "/operations/insurance/personal-accident-and-illness", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Tax Audit Insurance", path: "/operations/insurance/tax-audit-insurance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Building and Contents Insurance", path: "/operations/insurance/building-and-contents-insurance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Glass Insurance", path: "/operations/insurance/glass-insurance", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Business Interruption", path: "/operations/insurance/business-interruption", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Theft", path: "/operations/insurance/theft", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Employment Practices Liability", path: "/operations/insurance/employment-practices-liability", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Money", path: "/operations/insurance/money", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Employee Dishonesty", path: "/operations/insurance/employee-dishonesty", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Portable Equipment", path: "/operations/insurance/portable-equipment", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Machinery Breakdown", path: "/operations/insurance/machinery-breakdown", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Electronic Equipment", path: "/operations/insurance/electronic-equipment", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Goods in Transit", path: "/operations/insurance/goods-in-transit", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Statutory Liability", path: "/operations/insurance/statutory-liability", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Business Insurance Pack", path: "/operations/insurance/business-insurance-pack", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Industries Covered", path: "/operations/insurance/industries-covered", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Insurance Get A Quote", path: "/operations/insurance/get-a-quote", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Insurance FAQs", path: "/operations/insurance/faqs", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Connectivity", path: "/operations/connectivity", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Business NBN", path: "/operations/connectivity/nbn-phone", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "NBN Check Coverage", path: "/operations/connectivity/nbn-phone/check-coverage", section: "Operations", type: "full-page", status: "backend-later", backendRequired: false },
  { title: "Our NBN Plans", path: "/operations/connectivity/nbn-phone/our-nbn-plans", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Getting Connected", path: "/operations/connectivity/nbn-phone/getting-connected", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "WiFi Modems", path: "/operations/connectivity/nbn-phone/wifi-modems", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Connect Now", path: "/operations/connectivity/nbn-phone/connect-now", section: "Operations", type: "full-page", status: "backend-later", backendRequired: false },
  { title: "NBN FAQs", path: "/operations/connectivity/nbn-phone/faqs", section: "Operations", type: "full-page", status: "ready", backendRequired: false },
  { title: "Coming Soon", path: "/operations/coming-soon", section: "Operations", type: "full-page", status: "ready", backendRequired: false },

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
