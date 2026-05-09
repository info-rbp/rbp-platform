export type OfferCategory =
  | "travel"
  | "fitness-health"
  | "home-garden"
  | "delivery"
  | "digital-tech"
  | "finance-insurance"
  | "other"
  | "operations"
  | "human-resources"
  | "admin-finance"
  | "sales-marketing"
  | "ai";

export interface OfferCategoryFilter {
  id: OfferCategory;
  label: string;
}

export interface PublicOffer {
  id: string;
  title: string;
  partner: string;
  summary: string;
  category: OfferCategory;
  offerType: "exclusive" | "top" | "standard";
  href: string;
  status: "ready" | "placeholder" | "content-required" | "backend-later";
}

export const offerCategoryFilters: OfferCategoryFilter[] = [
  { id: "travel", label: "Travel" },
  { id: "fitness-health", label: "Fitness & Health" },
  { id: "home-garden", label: "Home & Garden" },
  { id: "delivery", label: "Delivery" },
  { id: "digital-tech", label: "Digital & Tech" },
  { id: "finance-insurance", label: "Finance & Insurance" },
  { id: "other", label: "Other" },
  { id: "operations", label: "Operations" },
  { id: "human-resources", label: "Human Resources" },
  { id: "admin-finance", label: "Admin and Finance" },
  { id: "sales-marketing", label: "Sales and Marketing" },
  { id: "ai", label: "AI" },
];

export const publicOffers: PublicOffer[] = [
  {
    id: "digital-tech-partner-offer",
    title: "Digital & Tech Partner Offer",
    partner: "Remote Business Partner Network",
    summary: "A launch-safe placeholder for future digital, software, and technology partner offers available to members and clients.",
    category: "digital-tech",
    offerType: "exclusive",
    href: "/offers",
    status: "ready",
  },
  {
    id: "finance-insurance-partner-offer",
    title: "Finance & Insurance Partner Offer",
    partner: "Remote Business Partner Network",
    summary: "A launch-safe placeholder for future finance, insurance, lending, and protection partner offers.",
    category: "finance-insurance",
    offerType: "top",
    href: "/offers",
    status: "ready",
  },
  {
    id: "operations-support-offer",
    title: "Operations Support Offer",
    partner: "Remote Business Partner",
    summary: "A placeholder offer for operational support packages, process improvement, documentation, and business support services.",
    category: "operations",
    offerType: "standard",
    href: "/offers",
    status: "ready",
  },
  {
    id: "human-resources-support-offer",
    title: "Human Resources Support Offer",
    partner: "Remote Business Partner",
    summary: "A placeholder offer for HR documentation, onboarding, people operations, and practical employment administration support.",
    category: "human-resources",
    offerType: "standard",
    href: "/offers",
    status: "ready",
  },
];
