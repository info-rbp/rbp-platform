import type { MockCta } from "./types.mock";

export interface MockPublicSection {
  id: string;
  title: string;
  description: string;
  cta: MockCta;
}

export const mockPublicSections: MockPublicSection[] = [
  {
    id: "on-demand",
    title: "On-Demand Services",
    description: "Mock public section for advisory and specialist service journeys.",
    cta: {
      label: "Explore On-Demand",
      href: "/on-demand",
    },
  },
  {
    id: "membership",
    title: "Membership",
    description: "Mock public section for membership value and sign-up journeys.",
    cta: {
      label: "Join Now",
      href: "/membership/sign-up-now",
    },
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description: "Mock public section for marketplace browsing and enquiry journeys.",
    cta: {
      label: "View Marketplace",
      href: "/marketplace",
    },
  },
];
