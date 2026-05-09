export interface OperationArea {
  id: string;
  title: string;
  summary: string;
  href: string;
  status: "ready" | "placeholder" | "content-required" | "backend-later";
}

export const operationAreas: OperationArea[] = [
  { id: "finance", title: "Business Finance", summary: "Finance education, funding readiness, planning pathways, referral support, and business finance guidance.", href: "/operations/finance", status: "ready" },
  { id: "business-lending", title: "Business Lending", summary: "Business lending information, preparation guidance, and referral pathways for suitable finance options.", href: "/operations/finance/business-lending", status: "ready" },
  { id: "business-insurance", title: "Business Insurance", summary: "Insurance guidance and referral pathways to help businesses understand cover, risk, and protection options.", href: "/operations/finance/business-insurance", status: "ready" },
  { id: "financial-planning", title: "Financial Planning", summary: "Planning guidance for business owners seeking better financial structure, visibility, and preparation.", href: "/operations/finance/financial-planning", status: "ready" },
  { id: "credit-and-funding", title: "Credit and Funding", summary: "Credit readiness, funding preparation, and commercial finance pathway guidance.", href: "/operations/finance/credit-and-funding", status: "ready" },
  { id: "insurance", title: "Insurance", summary: "Business insurance guidance covering protection, referral pathways, and operational risk awareness.", href: "/operations/insurance", status: "ready" },
  { id: "connectivity", title: "Connectivity", summary: "Business internet, NBN, phone, and connectivity support for operational reliability and communication.", href: "/operations/connectivity", status: "ready" },
  { id: "nbn-phone", title: "NBN & Phone", summary: "Business NBN and phone information for businesses reviewing connectivity and communications needs.", href: "/operations/connectivity/nbn-phone", status: "ready" },
  { id: "superloop", title: "Superloop Connectivity", summary: "Connectivity provider pathway and service information within the broader business connectivity area.", href: "/operations/connectivity/superloop", status: "ready" },
  { id: "calculators", title: "Calculators", summary: "Business calculators and tools for planning, finance readiness, operational decisions, and commercial scenarios.", href: "/operations/calculators", status: "ready" },
  { id: "coming-soon", title: "Coming Soon", summary: "Future operations features, tools, service pathways, and business support areas currently being prepared.", href: "/operations/coming-soon", status: "placeholder" },
];
