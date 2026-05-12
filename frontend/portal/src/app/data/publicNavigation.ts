/* Public navbar mega-menu configuration */

// -- Types ---------------------------------------------------------------------

export interface MegaLink {
  label: string;
  href: string;
  desc?: string;
}

export interface MegaConfig {
  key: string;
  label: string;
  description: string;
  links: MegaLink[];
  groups?: Array<{
    heading: string;
    links: MegaLink[];
  }>;
}

// -- Mega menu data -------------------------------------------------------------
// The public header intentionally uses only five top-level menu groups. Each
// group renders through the existing side-by-side mega-menu layout.

export const publicNavigation: MegaConfig[] = [
  {
    key: "services",
    label: "Services",
    description:
      "Explore RBP's core advisory, document, on-demand, managed, and custom business support services.",
    links: [
      { label: "Core", href: "/core-services" },
      { label: "Nucleus", href: "/document-nucleus/overview" },
      { label: "On-Demand", href: "/on-demand" },
      { label: "Managed Services", href: "/managed-services" },
      { label: "Custom Solutions", href: "/managed-services#custom-solutions" },
    ],
  },
  {
    key: "platform",
    label: "Platform",
    description:
      "Access business applications, marketplace listings, partner offers, and practical business resources.",
    links: [
      { label: "Applications", href: "/applications" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Offers", href: "/offers" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    description: "Explore Business Insurance, Business Finance, Business NBN, and upcoming operational support pathways.",
    links: [
      { label: "Business Finance", href: "/operations/finance" },
      { label: "Business Insurance", href: "/operations/insurance" },
      { label: "Business NBN", href: "/operations/connectivity/nbn-phone" },
      { label: "Operations Resources", href: "/resources?category=operations" },
      { label: "Coming Soon", href: "/operations/coming-soon" },
    ],
  },
  {
    key: "membership",
    label: "Membership",
    description:
      "Review membership benefits, current offers, referral options, FAQs, and sign-up pathways.",
    links: [
      { label: "Early Bird Offer", href: "/membership/overview#early-bird-offer" },
      { label: "What's Included", href: "/membership/inclusions" },
      { label: "Frequently Asked Questions", href: "/membership/faq" },
      { label: "Referral Program", href: "/membership/referral-program" },
      { label: "Create account to continue", href: "/portal/membership/checkout" },
    ],
  },
  {
    key: "help-center",
    label: "Help Center",
    description: "Find answers, support articles, troubleshooting guidance, and help options.",
    links: [
      { label: "Frequently Asked Questions", href: "/help?section=faqs" },
      { label: "Knowledge Base", href: "/help?section=knowledge-base" },
      { label: "Troubleshooting", href: "/help?section=troubleshooting" },
      { label: "Support Centre", href: "/help?section=support" },
    ],
  },
  {
    key: "about-us",
    label: "About Us",
    description:
      "Learn who we are, how the platform works, how to start a conversation, and how to connect with Remote Business Partner.",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Platform", href: "/about/our-platform" },
      { label: "Discovery Call", href: "/about/discovery-call" },
      { label: "Work With Us", href: "/about/work-with-us" },
      { label: "Work For Us", href: "/about/work-for-us" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];
