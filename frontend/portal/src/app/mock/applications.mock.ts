export interface MockApplicationCategory {
  id: string;
  label: string;
  href: string;
  description: string;
  status: "available" | "planned" | "placeholder";
}

export const mockApplicationCategories: MockApplicationCategory[] = [
  {
    id: "operations-finance",
    label: "Operations and Finance",
    href: "/applications#operations-finance",
    description: "Mock application category for finance, reporting and operations workflows.",
    status: "placeholder",
  },
  {
    id: "people-hr",
    label: "People and HR",
    href: "/applications#people-hr",
    description: "Mock application category for people, HR and workforce processes.",
    status: "placeholder",
  },
  {
    id: "integrations",
    label: "Integrations",
    href: "/applications#integrations",
    description: "Mock placeholder for future integration capabilities.",
    status: "planned",
  },
  {
    id: "fleet-management",
    label: "Fleet Management",
    href: "/applications#fleet-management",
    description: "Mock placeholder for fleet management capabilities.",
    status: "planned",
  },
  {
    id: "business-watchlist",
    label: "Business Watchlist",
    href: "/applications#business-watchlist",
    description: "Mock placeholder for supplier and company risk register concepts.",
    status: "planned",
  },
];
