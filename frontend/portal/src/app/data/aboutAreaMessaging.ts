export const aboutAreaPositioning = {
  core:
    "Remote Business Partner is a remote-first business support platform built to help small businesses access practical advisory, services, documents, applications, marketplace opportunities, membership support, and business resources from one connected ecosystem.",
  distinction:
    "RBP is not just a consultancy. It is a platform model designed around the operating needs of small businesses.",
};

export const aboutAreaPages = [
  {
    label: "About Us",
    href: "/about",
    purpose:
      "Explain who RBP is, why it exists, what has been built, and why users should trust it.",
    primaryMessage:
      "Remote Business Partner gives small businesses a smarter way to access advice, services, tools, documents, marketplace opportunities, membership support, and practical business resources.",
    primaryCta: {
      label: "Book Discovery Call",
      href: "/about/discovery-call",
    },
    secondaryCta: {
      label: "Explore Our Platform",
      href: "/about/our-platform",
    },
  },
  {
    label: "Our Platform",
    href: "/about/our-platform",
    purpose:
      "Explain the RBP ecosystem: services, documents, membership, marketplace, applications, resources, and support pathways.",
    primaryMessage:
      "RBP brings advisory, services, documents, applications, marketplace access, membership, and business support pathways into one connected platform.",
    primaryCta: {
      label: "Explore Services",
      href: "/core-services",
    },
    secondaryCta: {
      label: "View Membership",
      href: "/membership",
    },
  },
  {
    label: "Discovery Call",
    href: "/about/discovery-call",
    purpose:
      "Give users a dedicated conversion path to start a focused business conversation.",
    primaryMessage:
      "Book a discovery call to explain where your business is now, what you are trying to solve, and which RBP pathway may fit best.",
    primaryCta: {
      label: "Request Discovery Call",
      href: "/about/discovery-call",
    },
    secondaryCta: {
      label: "Explore Our Platform",
      href: "/about/our-platform",
    },
  },
  {
    label: "Work With Us",
    href: "/about/work-with-us",
    purpose:
      "Invite organisations, advisors, suppliers, service providers, marketplace partners, and collaborators to explore partnerships.",
    primaryMessage:
      "Partner with Remote Business Partner to support small businesses through advisory, services, applications, marketplace offers, resources, and specialist delivery pathways.",
    primaryCta: {
      label: "Submit Partnership Enquiry",
      href: "/about/work-with-us",
    },
    secondaryCta: {
      label: "Book Discovery Call",
      href: "/about/discovery-call",
    },
  },
  {
    label: "Work For Us",
    href: "/about/work-for-us",
    purpose:
      "Let individuals register interest in future employment, contractor, advisory, internship, or specialist opportunities.",
    primaryMessage:
      "Register interest in future opportunities with Remote Business Partner.",
    primaryCta: {
      label: "Register Interest",
      href: "/about/work-for-us",
    },
    secondaryCta: {
      label: "Work With Us",
      href: "/about/work-with-us",
    },
  },
  {
    label: "Contact Us",
    href: "/contact",
    purpose:
      "Handle general enquiries and route users to the right place.",
    primaryMessage:
      "Tell us what you need and we will route your enquiry to the right RBP pathway or contact point.",
    primaryCta: {
      label: "Send Enquiry",
      href: "/contact",
    },
    secondaryCta: {
      label: "Book Discovery Call",
      href: "/about/discovery-call",
    },
  },
];

export const aboutAreaCtaRoutes = {
  bookDiscoveryCall: "/about/discovery-call",
  explorePlatform: "/about/our-platform",
  exploreServices: "/core-services",
  viewMembership: "/membership",
  partnerWithUs: "/about/work-with-us",
  workWithUs: "/about/work-with-us",
  workForUs: "/about/work-for-us",
  registerInterest: "/about/work-for-us",
  contactUs: "/contact",
};

export const aboutAreaMessagingRules = [
  "Do not send Discovery Call traffic to Contact Us.",
  "Do not mix partnerships and employment.",
  "Do not describe RBP as only a consultancy.",
  "Do not expose mock, Phase 1, shell, or backend implementation notes to public users.",
  "Each About page must have one clear purpose.",
  "Each page should include one primary CTA and no more than two secondary CTA paths.",
  "The Contact page should route users, not absorb every intent.",
  "The About area should tell a story, not merely list pages.",
];

export const aboutAreaUserJourney = [
  {
    route: "/about",
    story: "Who RBP is and why it exists.",
  },
  {
    route: "/about/our-platform",
    story: "What RBP has built and how the ecosystem works.",
  },
  {
    route: "/about/discovery-call",
    story: "How to start a focused conversation.",
  },
  {
    route: "/about/work-with-us",
    story: "How organisations can partner with RBP.",
  },
  {
    route: "/about/work-for-us",
    story: "How individuals can register interest in future roles.",
  },
  {
    route: "/contact",
    story: "How to send general enquiries.",
  },
];
