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
}

// -- Mega menu data -------------------------------------------------------------
// First level: the menu bar item.
// Second level: the horizontal tile links shown inside that menu's dropdown.
// All href values point to existing routes, with anchors/query params used where
// the target content lives on an existing hub page.

export const publicNavigation: MegaConfig[] = [
  {
    key: "core",
    label: "Core",
    description: "Core advisory services for targeted business guidance, decisions, problem solving, risk support, and bid management.",
    links: [
      { label: "Core Services", href: "/core-services" },
      { label: "Business Advisor", href: "/core-services/business-advisor" },
      { label: "Decision Desk", href: "/core-services/decision-desk" },
      { label: "The Fixer", href: "/core-services/the-fixer" },
      { label: "Risk Advisor", href: "/core-services/risk-advisor" },
      { label: "Bid Management", href: "/core-services/bid-management" },
    ],
  },
  {
    key: "nucleus",
    label: "Nucleus",
    description: "Nucleus brings together document templates, suites, toolkits, industry packs, process guidance, and customisation support.",
    links: [
      { label: "What is Nucleus?", href: "/document-nucleus/overview" },
      { label: "Templates", href: "/document-nucleus/category/templates" },
      { label: "Documentation Suites", href: "/document-nucleus/category/documentation-suites" },
      { label: "Toolkits", href: "/document-nucleus/category/toolkits" },
      { label: "Industry Packs", href: "/document-nucleus/category/industry-packs" },
      { label: "Process", href: "/document-nucleus/category/process" },
      { label: "Customisation", href: "/document-nucleus/category/customisation" },
    ],
  },
  {
    key: "on-demand",
    label: "On-Demand",
    description: "Flexible business support across operations, management, finance, sales, AI, change, and human resources.",
    links: [
      { label: "How it Works", href: "/on-demand" },
      { label: "On-Demand Services", href: "/on-demand/services" },
      { label: "Operations", href: "/on-demand/services#operations-advisory" },
      { label: "Management", href: "/on-demand/services#management-consulting" },
      { label: "Finance", href: "/on-demand/services#accounting-finance" },
      { label: "Sales", href: "/on-demand/services#sales-marketing" },
      { label: "AI", href: "/on-demand/services#ai-advisory" },
      { label: "Change", href: "/on-demand/services#change-management" },
      { label: "Human Resources", href: "/on-demand/services#human-resource-advisory" },
    ],
  },
  {
    key: "managed-services",
    label: "Managed Services",
    description: "Ongoing business support across operational, management, finance, sales, AI, change, and human resources functions.",
    links: [
      { label: "How it Works", href: "/managed-services#engagement-process" },
      { label: "Managed Services", href: "/managed-services" },
      { label: "Operations", href: "/managed-services#document-management" },
      { label: "Management", href: "/managed-services#engagement-process" },
      { label: "Finance", href: "/managed-services#custom-solutions" },
      { label: "Sales", href: "/managed-services#business-sale-support" },
      { label: "AI", href: "/managed-services#custom-solutions" },
      { label: "Change", href: "/managed-services#change-management" },
      { label: "Human Resources", href: "/managed-services/hr-services" },
    ],
  },
  {
    key: "custom-solutions",
    label: "Custom Solutions",
    description: "Tailored business solutions designed around specific goals, gaps, or operational needs.",
    links: [
      { label: "Process", href: "/managed-services#engagement-process" },
      { label: "Custom Solutions", href: "/managed-services#custom-solutions" },
    ],
  },
  {
    key: "applications",
    label: "Applications",
    description: "Business applications, platform tools, and upcoming digital capabilities for Remote Business Partner users.",
    links: [
      { label: "Applications", href: "/applications" },
      { label: "Coming Soon", href: "/applications#coming-soon" },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    description: "Operational support across finance, insurance, connectivity, resources, and upcoming services.",
    links: [
      { label: "The Operations Hub", href: "/operations" },
      { label: "Business Finance", href: "/operations/finance" },
      { label: "Business Insurance", href: "/operations/insurance" },
      { label: "Business NBN", href: "/operations/connectivity/nbn-phone" },
      { label: "Operations Resources", href: "/resources?category=operations" },
      { label: "Coming Soon", href: "/operations/coming-soon" },
    ],
  },
  {
    key: "marketplace",
    label: "Marketplace",
    description: "Explore RBP products, assets, third-party listings, and ways to list with Remote Business Partner.",
    links: [
      { label: "What is Marketplace?", href: "/marketplace" },
      { label: "RBP Products", href: "/marketplace#rbp-products" },
      { label: "RBP Assets", href: "/marketplace#rbp-assets" },
      { label: "Third Party", href: "/marketplace#third-party-products-assets" },
      { label: "List with Us", href: "/marketplace#list-with-us" },
    ],
  },
  {
    key: "membership",
    label: "Membership",
    description: "Membership offers, inclusions, sign-up pathways, and frequently asked questions for joining RBP.",
    links: [
      { label: "Early Bird Offer", href: "/membership/overview#early-bird-offer" },
      { label: "What’s Included", href: "/membership/inclusions" },
      { label: "Sign Up Now", href: "/membership/sign-up-now" },
      { label: "Frequently Asked Questions", href: "/membership/frequently-asked-questions" },
    ],
  },
  {
    key: "offers",
    label: "Offers",
    description: "Partner offers, exclusive promotions, top offers, and selected recommendations for members and visitors.",
    links: [
      { label: "Offers Hub", href: "/offers" },
      { label: "Top Offers", href: "/offers#top" },
      { label: "Exclusive Offers", href: "/offers#exclusive" },
      { label: "Our Picks", href: "/offers#our-picks" },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    description: "Articles, guides, tools, and other resources to support business improvement and decision making.",
    links: [
      { label: "Resources Hub", href: "/resources" },
      { label: "Articles", href: "/resources?type=articles" },
      { label: "Guides", href: "/resources?type=guides" },
      { label: "Tools", href: "/resources?type=tools" },
      { label: "Everything Else", href: "/resources?type=other" },
    ],
  },
  {
    key: "help",
    label: "Help",
    description: "Platform guidance, FAQs, knowledge base content, troubleshooting, and direct support options.",
    links: [
      { label: "Our Platform", href: "/help?category=our-platform" },
      { label: "Frequently Asked Questions", href: "/help?section=faqs" },
      { label: "Knowledge Base", href: "/help?section=knowledge-base" },
      { label: "Troubleshooting", href: "/help?section=troubleshooting" },
      { label: "Support Centre", href: "/help?section=support" },
    ],
  },
  {
    key: "about-us",
    label: "About Us",
    description: "Learn who we are, what we do, how we work, and the terms that apply.",
    links: [
      { label: "Who We Are", href: "/about" },
      { label: "What We Do", href: "/about/what-we-do" },
      { label: "Our Process", href: "/about/our-process" },
      { label: "Work with Us", href: "/about/work-with-us" },
      { label: "Terms and Conditions", href: "/legal/terms-of-use" },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    description: "Book a discovery call or contact the Remote Business Partner team.",
    links: [
      { label: "Book a Discovery Call", href: "/contact?reason=discovery-call" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];
