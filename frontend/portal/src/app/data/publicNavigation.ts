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

export interface PublicNavigationRuntimeFlags {
  application_provisioning: boolean;
  application_interest: boolean;
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
      { label: "Business Insurance Overview", href: "/operations/insurance" },
      { label: "Business Finance Overview", href: "/operations/finance" },
      { label: "Business NBN Overview", href: "/operations/connectivity/nbn-phone" },
      { label: "Coming Soon", href: "/operations/coming-soon" },
    ],
    groups: [
      {
        heading: "Business Insurance",
        links: [
          { label: "Business Insurance Overview", href: "/operations/insurance" },
          { label: "Public Liability Insurance", href: "/operations/insurance/public-liability-insurance" },
          { label: "Professional Indemnity", href: "/operations/insurance/professional-indemnity" },
          { label: "Cyber Liability", href: "/operations/insurance/cyber-liability" },
          { label: "Management Liability", href: "/operations/insurance/management-liability" },
          { label: "Business Insurance Pack", href: "/operations/insurance/business-insurance-pack" },
          { label: "Industries Covered", href: "/operations/insurance/industries-covered" },
          { label: "Get A Quote", href: "/operations/insurance/get-a-quote" },
          { label: "Insurance FAQs", href: "/operations/insurance/faqs" },
        ],
      },
      {
        heading: "Business Finance",
        links: [
          { label: "Business Finance Overview", href: "/operations/finance" },
          { label: "Commercial Finance", href: "/operations/finance/commercial-finance" },
          { label: "Chattel Mortgage", href: "/operations/finance/chattel-mortgage" },
          { label: "Unsecured Business Loans", href: "/operations/finance/unsecured-business-loans" },
          { label: "Commercial Equipment Finance", href: "/operations/finance/commercial-equipment-finance" },
          { label: "Business Vehicle Finance", href: "/operations/finance/business-vehicle-finance" },
          { label: "Debtor Finance", href: "/operations/finance/debtor-finance" },
          { label: "Finance Calculators", href: "/operations/finance/commercial-loan-calculator" },
          { label: "Finance FAQs", href: "/operations/finance/faqs" },
        ],
      },
      {
        heading: "Business NBN",
        links: [
          { label: "Business NBN Overview", href: "/operations/connectivity/nbn-phone" },
          { label: "Check Coverage", href: "/operations/connectivity/nbn-phone/check-coverage" },
          { label: "Our NBN Plans", href: "/operations/connectivity/nbn-phone/our-nbn-plans" },
          { label: "Getting Connected", href: "/operations/connectivity/nbn-phone/getting-connected" },
          { label: "WiFi Modems", href: "/operations/connectivity/nbn-phone/wifi-modems" },
          { label: "Order through account", href: "/operations/connectivity/nbn-phone/connect-now" },
          { label: "FAQs", href: "/operations/connectivity/nbn-phone/faqs" },
        ],
      },
      {
        heading: "Coming Soon",
        links: [{ label: "Coming Soon", href: "/operations/coming-soon" }],
      },
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

export function filterPublicNavigationForRuntime(
  menus: MegaConfig[],
  flags: PublicNavigationRuntimeFlags,
): MegaConfig[] {
  const showApplications = flags.application_provisioning || flags.application_interest;

  return menus.map((menu) => {
    if (menu.key !== "platform" || showApplications) {
      return menu;
    }

    return {
      ...menu,
      links: menu.links.filter((link) => link.href !== "/applications"),
      groups: menu.groups?.map((group) => ({
        ...group,
        links: group.links.filter((link) => link.href !== "/applications"),
      })),
    };
  });
}
