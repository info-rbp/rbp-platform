export interface PremiumMembershipInclusionItem {
  name: string;
  value: string;
  notes: string;
}

export interface PremiumMembershipInclusionGroup {
  category: string;
  items: PremiumMembershipInclusionItem[];
}

export interface PremiumMembershipFaqItem {
  question: string;
  answer: string;
  includeTermsLink?: boolean;
}

export interface PremiumMembershipFaqGroup {
  title: string;
  items: PremiumMembershipFaqItem[];
}

export interface PremiumMembershipTermsSection {
  title: string;
  bullets: string[];
}

export const premiumMembershipRoutes = {
  overview: "/membership/overview",
  inclusions: "/membership/inclusions",
  signup: "/membership/sign-up-now",
  faq: "/membership/faq",
  terms: "/membership/terms",
} as const;

export const premiumMembershipPlan = {
  name: "RBP Premium Membership",
  earlyBirdPrice: "$25 + GST per week",
  standardPrice: "$100 + GST per week",
  offerLabel: "Limited Early Bird Premium Membership Offer",
  offerNote: "Early bird pricing available for a limited time.",
  heroTitle: "Finally, A Membership Built For Small Business Owners",
  heroBody:
    "RBP Premium Membership gives small business owners one digital place to access Core Services, Nucleus resources, business tools, member offers, applications, marketplace benefits, and discounted On-Demand, Managed, and Custom Services.",
  summaryBody:
    "RBP Premium Membership gives small business owners access to Core Services, Nucleus resources, service discounts, marketplace savings, member offers, operations benefits, and referral rewards.",
  termsDisclaimer:
    "Service credits, gift cards, discounts, and referral credits may be subject to eligibility, fair use, and membership terms.",
  topHighlights: [
    "Unlimited Core Services",
    "Unlimited Nucleus templates, documentation suites, and toolkits",
    "25% off On-Demand, Managed, and Custom Services",
    "$1,000 annual service credit per category",
    "10% Marketplace discount",
    "Access to all member offers",
  ],
  planHighlights: [
    "Unlimited Business Advisor",
    "Unlimited Decision Desk",
    "Unlimited The Fixer",
    "Unlimited Risk Advisor",
    "Unlimited Nucleus access",
    "25% off services",
    "$1,000 annual service credit per category",
    "10% marketplace discount",
  ],
} as const;

export const premiumMembershipBenefitCards = [
  {
    title: "Unlimited Core Services",
    copy:
      "Access Business Advisor, Decision Desk, The Fixer, and Risk Advisor with unlimited usage.",
  },
  {
    title: "Nucleus Access",
    copy:
      "Use all templates, documentation suites, and toolkits included in Nucleus.",
  },
  {
    title: "Service Discounts",
    copy:
      "Save 25% on On-Demand Services, Managed Services, and Custom Services.",
  },
  {
    title: "Annual Service Credits",
    copy: "Receive a standard $1,000 annual credit per category. T&Cs apply.",
  },
  {
    title: "Marketplace & Offers",
    copy: "Receive 10% off marketplace listings and access all member offers.",
  },
  {
    title: "Operations Benefits",
    copy:
      "Access finance, insurance, and NBN benefits available to premium members.",
  },
] as const;

export const premiumMembershipBuiltFor = [
  {
    title: "Faster support",
    copy:
      "Access key support pathways without starting from scratch each time.",
  },
  {
    title: "Better resources",
    copy:
      "Use Nucleus templates, suites, toolkits, and document support.",
  },
  {
    title: "Lower service costs",
    copy: "Save on eligible RBP services through premium member pricing.",
  },
  {
    title: "More platform value",
    copy:
      "Access offers, marketplace savings, credits, and referral rewards.",
  },
] as const;

export const premiumMembershipSummaryCards = [
  { title: "Core Services", value: "Unlimited usage" },
  {
    title: "Nucleus",
    value: "Unlimited templates, suites, and toolkits",
  },
  { title: "Services", value: "25% discount" },
  { title: "Annual Credit", value: "$1,000 per category" },
  { title: "Marketplace", value: "10% discount" },
  {
    title: "Referral Bonus",
    value: "$500 credit split between user and referee",
  },
] as const;

export const premiumMembershipInclusions: PremiumMembershipInclusionGroup[] = [
  {
    category: "Core",
    items: [
      { name: "Business Advisor", value: "Unlimited", notes: "Unlimited usage." },
      { name: "Decision Desk", value: "Unlimited", notes: "Unlimited usage." },
      { name: "The Fixer", value: "Unlimited", notes: "Unlimited usage." },
      { name: "Risk Advisor", value: "Unlimited", notes: "Unlimited usage." },
      {
        name: "Bid Management",
        value: "Discounted onboarding",
        notes: "Discounted onboarding fee of $250 + GST.",
      },
    ],
  },
  {
    category: "Nucleus",
    items: [
      {
        name: "Templates",
        value: "Unlimited",
        notes: "All templates included. Unlimited use.",
      },
      {
        name: "Documentation Suites",
        value: "Unlimited",
        notes: "All documentation suites included. Unlimited use.",
      },
      {
        name: "Toolkits",
        value: "Unlimited",
        notes: "All toolkits included. Unlimited use.",
      },
      {
        name: "Customisation",
        value: "3 per quarter",
        notes:
          "For custom document requests not included in the catalogue.",
      },
    ],
  },
  {
    category: "Services",
    items: [
      {
        name: "On-Demand Services",
        value: "25% discount",
        notes: "Applies to all On-Demand Services.",
      },
      {
        name: "Managed Services",
        value: "25% discount",
        notes: "Applies to all Managed Services.",
      },
      {
        name: "Custom Services",
        value: "25% discount",
        notes: "Applies to all Custom Services.",
      },
      {
        name: "Annual Service Credit",
        value: "$1,000 per category annually",
        notes: "Standard $1,000 credit per category. T&Cs apply.",
      },
    ],
  },
  {
    category: "Marketplace",
    items: [
      {
        name: "Marketplace Discount",
        value: "10% discount",
        notes: "Applies to all marketplace listings.",
      },
    ],
  },
  {
    category: "Offers",
    items: [
      {
        name: "Member Offers",
        value: "Access to all offers",
        notes: "Applies to all offers.",
      },
    ],
  },
  {
    category: "Operations",
    items: [
      {
        name: "Finance",
        value: "$250 gift card",
        notes:
          "On financial disbursement, provided 90 days after.",
      },
      {
        name: "Insurance",
        value: "$50 gift card",
        notes:
          "After policy change-of-mind period expires and confirmation is received.",
      },
      {
        name: "NBN",
        value: "10% offer",
        notes: "10% off advertised prices.",
      },
    ],
  },
  {
    category: "Other",
    items: [
      { name: "Included Users", value: "1 user", notes: "1 user per account." },
      {
        name: "Additional Users",
        value: "$5 per user",
        notes: "Applies per additional user.",
      },
      {
        name: "Referral Bonus",
        value: "$500 referral credit",
        notes:
          "$250 for the user and $250 for the referee, added as credit.",
      },
    ],
  },
];

export const premiumMembershipTermsSummary = [
  "Service credits, gift cards, offers, discounts, and referral credits may be subject to eligibility and T&Cs.",
  "Finance gift card is provided after qualifying financial disbursement and the required waiting period.",
  "Insurance gift card is provided after the change-of-mind period expires and confirmation is received.",
  "Annual service credit is applied per eligible category annually.",
  "Referral credit is applied as account credit.",
] as const;

export const premiumMembershipFaqGroups: PremiumMembershipFaqGroup[] = [
  {
    title: "Membership Basics",
    items: [
      {
        question: "What is RBP Premium Membership?",
        answer:
          "RBP Premium Membership is a small business membership that gives owners access to Core Services, Nucleus resources, service discounts, marketplace savings, member offers, operations benefits, and referral rewards through the Remote Business Partner platform.",
      },
      {
        question: "Who is RBP Premium Membership for?",
        answer:
          "It is designed for small business owners who want practical support, digital resources, business tools, and access to service pathways without managing everything through disconnected systems.",
      },
      {
        question: "How much does it cost?",
        answer:
          "The early bird offer is $25 + GST per week. The standard price is normally $100 + GST per week.",
      },
    ],
  },
  {
    title: "Core Services",
    items: [
      {
        question: "Which Core Services are included?",
        answer:
          "Premium members receive unlimited usage of Business Advisor, Decision Desk, The Fixer, and Risk Advisor.",
      },
      {
        question: "Is Bid Management included?",
        answer:
          "Bid Management is available with a discounted onboarding fee of $250 + GST.",
      },
      {
        question: "What does unlimited usage mean?",
        answer:
          "Unlimited usage applies to the listed Core Services included in the premium membership. Fair use, service scope, and operational limits may apply under the membership terms.",
        includeTermsLink: true,
      },
    ],
  },
  {
    title: "Nucleus",
    items: [
      {
        question: "What Nucleus resources are included?",
        answer:
          "Premium members receive unlimited use of all templates, documentation suites, and toolkits included in Nucleus.",
      },
      {
        question: "Are custom documents included?",
        answer:
          "Premium members receive 3 customisations per quarter for custom document requests that are not already included in the catalogue.",
      },
    ],
  },
  {
    title: "Services, Credits, and Discounts",
    items: [
      {
        question: "What service discounts are included?",
        answer:
          "Premium members receive 25% off all On-Demand Services, Managed Services, and Custom Services.",
      },
      {
        question: "What is the annual service credit?",
        answer:
          "Premium members receive a standard $1,000 annual credit per eligible service category. T&Cs apply.",
        includeTermsLink: true,
      },
      {
        question: "Can I use discounts and credits together?",
        answer:
          "This depends on the service, category, and membership terms. Details are outlined in the Membership Terms.",
        includeTermsLink: true,
      },
    ],
  },
  {
    title: "Marketplace, Offers, and Operations",
    items: [
      {
        question: "What Marketplace discount do members receive?",
        answer: "Premium members receive 10% off marketplace listings.",
      },
      {
        question: "What offers are included?",
        answer:
          "Premium members receive access to all member offers available through the RBP platform.",
      },
      {
        question: "What Operations benefits are included?",
        answer:
          "Premium members can access finance, insurance, and NBN benefits, including gift card and discount offers where eligibility requirements are met.",
        includeTermsLink: true,
      },
      {
        question: "How does the finance gift card work?",
        answer:
          "The $250 finance gift card applies on qualifying financial disbursement and is provided 90 days after disbursement.",
      },
      {
        question: "How does the insurance gift card work?",
        answer:
          "The $50 insurance gift card is provided after the policy change-of-mind period expires and confirmation is received.",
      },
      {
        question: "What is the NBN offer?",
        answer: "Premium members receive 10% off advertised NBN prices.",
      },
    ],
  },
  {
    title: "Users and Referrals",
    items: [
      {
        question: "How many users are included?",
        answer: "RBP Premium Membership includes 1 user per account.",
      },
      {
        question: "Can I add more users?",
        answer: "Yes. Additional users are $5 per user.",
      },
      {
        question: "How does the referral bonus work?",
        answer:
          "The referral bonus is a $500 credit split between both parties: $250 for the referring user and $250 for the referred user.",
        includeTermsLink: true,
      },
    ],
  },
];

export const premiumMembershipTermsSections: PremiumMembershipTermsSection[] = [
  {
    title: "Early Bird Pricing Terms",
    bullets: [
      "The early bird membership rate is $25 + GST per week for a limited introductory period.",
      "The standard membership rate is $100 + GST per week once introductory pricing is no longer available.",
      "Early bird availability may be limited, withdrawn, or updated without notice for future sign-ups.",
    ],
  },
  {
    title: "Weekly Billing and GST",
    bullets: [
      "Membership fees are quoted weekly and are subject to GST where applicable.",
      "Billing timing, invoices, and payment handling may depend on the final commercial rollout of the membership offering.",
      "This frontend preview does not process a real payment or create a live account.",
    ],
  },
  {
    title: "Additional User Pricing",
    bullets: [
      "Each membership includes 1 user per account.",
      "Additional users are priced at $5 per user.",
      "Additional user access may be subject to account administration and billing setup requirements.",
    ],
  },
  {
    title: "Fair Use",
    bullets: [
      "Unlimited usage statements are subject to fair use, operational capacity, service scope, and reasonable platform use standards.",
      "Membership inclusions do not override service-specific delivery requirements, booking processes, or engagement rules.",
      "RBP may manage access patterns where use is inconsistent with fair operational use.",
    ],
  },
  {
    title: "Annual Service Credit Conditions",
    bullets: [
      "The standard annual service credit is $1,000 per eligible category per year.",
      "Credits may only be applied to eligible services and may not be redeemable for cash.",
      "Unused credits may expire according to the final membership terms in force at the time of issue.",
    ],
  },
  {
    title: "Finance Gift Card Conditions",
    bullets: [
      "The finance gift card offer applies on qualifying financial disbursement.",
      "The $250 gift card is provided 90 days after disbursement where eligibility requirements are met.",
      "Verification, settlement, and provider confirmation may be required before the gift card is issued.",
    ],
  },
  {
    title: "Insurance Gift Card Conditions",
    bullets: [
      "The insurance gift card offer is issued after the applicable change-of-mind period expires and confirmation is received.",
      "The $50 gift card is only available for eligible policies and qualifying member transactions.",
      "Provider confirmation and policy validation may be required before issue.",
    ],
  },
  {
    title: "Referral Credit Conditions",
    bullets: [
      "Referral benefits are provided as account credit.",
      "The referral credit is split as $250 for the referring user and $250 for the referred user.",
      "Referral credits may be subject to eligibility, successful sign-up criteria, and final account standing requirements.",
    ],
  },
  {
    title: "Marketplace and Offers Conditions",
    bullets: [
      "Marketplace discounts and member offers apply only where the relevant listing or partner offer participates in the membership program.",
      "Offer availability, exclusions, and redemption requirements may vary by provider or product.",
      "Discounts and offers may not always be combined with other promotions unless stated otherwise.",
    ],
  },
  {
    title: "Cancellation and Renewal Terms",
    bullets: [
      "Renewal, pause, cancellation, and notice settings may be updated as the live membership program is finalised.",
      "Any live membership activation will be governed by the commercial terms presented at the point of purchase.",
      "Support, credits, offers, and discounts may change if a membership is cancelled, paused, or becomes inactive.",
    ],
  },
];

export const premiumMembershipNavigationPages = [
  {
    id: "overview",
    title: "Overview",
    summary:
      "Sell the offer and introduce the RBP Premium Membership value proposition.",
    href: premiumMembershipRoutes.overview,
    status: "ready",
  },
  {
    id: "inclusions",
    title: "Inclusions",
    summary:
      "List the included services, resources, discounts, credits, and member benefits.",
    href: premiumMembershipRoutes.inclusions,
    status: "ready",
  },
  {
    id: "sign-up-now",
    title: "Sign Up Now",
    summary:
      "Guide visitors through the premium membership sign-up preview flow.",
    href: premiumMembershipRoutes.signup,
    status: "ready",
  },
  {
    id: "faq",
    title: "FAQ",
    summary:
      "Answer common questions about pricing, access, benefits, and eligibility.",
    href: premiumMembershipRoutes.faq,
    status: "ready",
  },
  {
    id: "terms",
    title: "Membership Terms",
    summary:
      "Hidden support page covering pricing, eligibility, fair use, credits, and offer conditions.",
    href: premiumMembershipRoutes.terms,
    status: "legal-review-required",
  },
] as const;
