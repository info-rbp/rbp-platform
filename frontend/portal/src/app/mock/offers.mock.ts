export interface MockOffer {
  id: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  href: string;
}

export const mockOffers: MockOffer[] = [
  {
    id: "offer-travel-001",
    title: "Mock Travel Partner Offer",
    category: "travel",
    description: "Frontend-only offer example for category filtering.",
    badge: "Mock offer",
    href: "/offers?category=travel",
  },
  {
    id: "offer-digital-001",
    title: "Mock Digital and Tech Offer",
    category: "digital-tech",
    description: "Frontend-only offer example for digital and tech filtering.",
    badge: "Mock offer",
    href: "/offers?category=digital-tech",
  },
  {
    id: "offer-operations-001",
    title: "Mock Operations Offer",
    category: "operations",
    description: "Frontend-only business operations offer example.",
    badge: "Mock offer",
    href: "/offers?category=operations",
  },
];
