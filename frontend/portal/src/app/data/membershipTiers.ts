import {
  premiumMembershipInclusions,
  premiumMembershipPlan,
  premiumMembershipRoutes,
} from "./premiumMembership";

export type MembershipTierCode = "free" | "premium";

export interface MembershipTierInclusionItem {
  name: string;
  value: string;
  notes: string;
}

export interface MembershipTierInclusionGroup {
  category: string;
  items: MembershipTierInclusionItem[];
}

export interface MembershipTier {
  code: MembershipTierCode;
  name: string;
  shortName: string;
  priceLabel: string;
  billingLabel: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  status: "available" | "coming-soon";
  recommended?: boolean;
  checkoutRequired?: boolean;
  stripeRequired?: boolean;
  inclusions: MembershipTierInclusionGroup[];
  highlights: string[];
  limitations: string[];
}

export interface MembershipTierComparisonRow {
  category: string;
  feature: string;
  free: string;
  premium: string;
  notes: string;
}

export const freeMembershipInclusions: MembershipTierInclusionGroup[] = [
  {
    category: "Core",
    items: [
      {
        name: "Business Advisor",
        value: "One Per Month",
        notes: "Free members receive one Business Advisor use per month.",
      },
      {
        name: "Decision Desk",
        value: "Advertised Price",
        notes: "Available to Free members at advertised price.",
      },
      {
        name: "The Fixer",
        value: "Advertised Price",
        notes: "Available to Free members at advertised price.",
      },
      {
        name: "Risk Advisor",
        value: "Advertised Price",
        notes: "Available to Free members at advertised price.",
      },
      {
        name: "Bid Management",
        value: "$500 + GST",
        notes: "Free member Bid Management onboarding fee is $500 + GST.",
      },
    ],
  },
  {
    category: "Nucleus",
    items: [
      {
        name: "Templates",
        value: "One Per Month",
        notes: "Free members receive one template use, download, or access per month.",
      },
      {
        name: "Documentation Suites",
        value: "Advertised Price",
        notes: "Available to Free members at advertised price.",
      },
      {
        name: "Toolkits",
        value: "Advertised Price",
        notes: "Available to Free members at advertised price.",
      },
      {
        name: "Customisation",
        value: "Add-On Price / Advertised Price",
        notes: "Available as an add-on at the advertised price.",
      },
    ],
  },
  {
    category: "Services",
    items: [
      {
        name: "On-Demand Services",
        value: "Advertised Price",
        notes: "Available to Free members at advertised price.",
      },
      {
        name: "Managed Services",
        value: "Advertised Price",
        notes: "Available to Free members at advertised price.",
      },
      {
        name: "Custom Services",
        value: "Advertised Price",
        notes: "Available to Free members at advertised price.",
      },
      {
        name: "Annual Service Credit",
        value: "No Annual Service Credit",
        notes: "Free members do not receive annual service credit.",
      },
    ],
  },
  {
    category: "Marketplace",
    items: [
      {
        name: "Marketplace Discount",
        value: "No discount",
        notes: "Free members can access marketplace listings, but no marketplace discount applies.",
      },
    ],
  },
  {
    category: "Offers",
    items: [
      {
        name: "Member Offers",
        value: "All offers available",
        notes: "Free members can access all member offers.",
      },
    ],
  },
  {
    category: "Operations",
    items: [
      {
        name: "Finance",
        value: "No Offer",
        notes: "No finance gift card or premium finance offer applies.",
      },
      {
        name: "Insurance",
        value: "No Offer",
        notes: "No insurance gift card or premium insurance offer applies.",
      },
      {
        name: "NBN",
        value: "Advertised Price",
        notes: "Available to Free members at advertised price.",
      },
    ],
  },
  {
    category: "Other",
    items: [
      {
        name: "Included Users",
        value: "1 User per account",
        notes: "Free Membership includes one user per account.",
      },
      {
        name: "Additional Users",
        value: "TBC or advertised add-on price",
        notes: "Additional Free Membership user pricing is confirmed separately where available.",
      },
      {
        name: "Referral Bonus",
        value: "No Offer",
        notes: "Free members do not receive a referral bonus.",
      },
    ],
  },
];

export const freeMembershipTier: MembershipTier = {
  code: "free",
  name: "RBP Free Membership",
  shortName: "Free Membership",
  priceLabel: "$0",
  billingLabel: "Free account",
  description:
    "Create a free RBP account to purchase products and services online, access member offers, save your business details, and manage your basic member profile.",
  ctaLabel: "Create Free Membership",
  ctaHref: "/membership/sign-up-now?tier=free",
  status: "available",
  checkoutRequired: false,
  stripeRequired: false,
  inclusions: freeMembershipInclusions,
  highlights: [
    "Create a free RBP account",
    "Purchase RBP products and services online",
    "Access all member offers",
    "One Business Advisor use per month",
    "One Nucleus template per month",
    "1 user per account",
  ],
  limitations: [
    "No annual service credit",
    "No marketplace discount",
    "No premium operations offers",
    "No referral bonus",
    "Services are charged at advertised price unless otherwise stated",
  ],
};

export const premiumMembershipTier: MembershipTier = {
  code: "premium",
  name: premiumMembershipPlan.name,
  shortName: "Premium Membership",
  priceLabel: premiumMembershipPlan.earlyBirdPrice,
  billingLabel: "Early bird weekly subscription",
  description:
    "Unlock the full RBP Premium Membership with Core Services, Nucleus access, service discounts, annual service credits, marketplace savings, operations benefits, and referral rewards.",
  ctaLabel: "Start Premium Membership",
  ctaHref: "/membership/sign-up-now?tier=premium",
  status: "available",
  recommended: true,
  checkoutRequired: true,
  stripeRequired: true,
  inclusions: premiumMembershipInclusions,
  highlights: [
    "Unlimited Core Services",
    "Unlimited Nucleus templates, suites, and toolkits",
    "25% off On-Demand, Managed, and Custom Services",
    "$1,000 annual service credit per category",
    "10% Marketplace discount",
    "Premium operations and referral benefits",
  ],
  limitations: [],
};

export const membershipTiers = [freeMembershipTier, premiumMembershipTier] as const;

export const membershipTierByCode: Record<MembershipTierCode, MembershipTier> = {
  free: freeMembershipTier,
  premium: premiumMembershipTier,
};

export const membershipTierComparisonRows: MembershipTierComparisonRow[] = [
  {
    category: "Platform",
    feature: "Purchase products and services online",
    free: "Included",
    premium: "Included",
    notes: "Both memberships support online purchasing access.",
  },
  {
    category: "Core",
    feature: "Business Advisor",
    free: "One per month",
    premium: "Unlimited",
    notes: "Free includes one use per month. Premium includes unlimited usage.",
  },
  {
    category: "Core",
    feature: "Decision Desk",
    free: "Advertised price",
    premium: "Unlimited",
    notes: "Free members can purchase at advertised price.",
  },
  {
    category: "Core",
    feature: "The Fixer",
    free: "Advertised price",
    premium: "Unlimited",
    notes: "Free members can purchase at advertised price.",
  },
  {
    category: "Core",
    feature: "Risk Advisor",
    free: "Advertised price",
    premium: "Unlimited",
    notes: "Free members can purchase at advertised price.",
  },
  {
    category: "Core",
    feature: "Bid Management",
    free: "$500 + GST",
    premium: "$250 + GST",
    notes: "Premium includes a discounted onboarding fee.",
  },
  {
    category: "Nucleus",
    feature: "Templates",
    free: "One per month",
    premium: "Unlimited",
    notes: "Premium includes all templates with unlimited use.",
  },
  {
    category: "Nucleus",
    feature: "Documentation Suites",
    free: "Advertised price",
    premium: "Unlimited",
    notes: "Free members can purchase at advertised price.",
  },
  {
    category: "Nucleus",
    feature: "Toolkits",
    free: "Advertised price",
    premium: "Unlimited",
    notes: "Free members can purchase at advertised price.",
  },
  {
    category: "Nucleus",
    feature: "Customisation",
    free: "Add-on price / advertised price",
    premium: "3 per quarter",
    notes: "Premium includes 3 customisations per quarter for requests not in the catalogue.",
  },
  {
    category: "Services",
    feature: "On-Demand Services",
    free: "Advertised price",
    premium: "25% discount",
    notes: "Premium discount applies to all On-Demand Services.",
  },
  {
    category: "Services",
    feature: "Managed Services",
    free: "Advertised price",
    premium: "25% discount",
    notes: "Premium discount applies to all Managed Services.",
  },
  {
    category: "Services",
    feature: "Custom Services",
    free: "Advertised price",
    premium: "25% discount",
    notes: "Premium discount applies to all Custom Services.",
  },
  {
    category: "Services",
    feature: "Annual Service Credit",
    free: "No Annual Service Credit",
    premium: "$1,000 per category annually",
    notes: "Premium annual credit is subject to terms.",
  },
  {
    category: "Marketplace",
    feature: "Marketplace Discount",
    free: "No discount",
    premium: "10% discount",
    notes: "Premium receives marketplace discount.",
  },
  {
    category: "Offers",
    feature: "Member Offers",
    free: "All offers available",
    premium: "All offers available",
    notes: "Both Free and Premium members can access all offers.",
  },
  {
    category: "Operations",
    feature: "Finance",
    free: "No Offer",
    premium: "$250 gift card",
    notes: "Premium finance gift card applies on qualifying financial disbursement and is provided 90 days after.",
  },
  {
    category: "Operations",
    feature: "Insurance",
    free: "No Offer",
    premium: "$50 gift card",
    notes: "Premium insurance gift card applies after policy change-of-mind period expires and confirmation is received.",
  },
  {
    category: "Operations",
    feature: "NBN",
    free: "Advertised Price",
    premium: "10% offer",
    notes: "Premium receives 10% off advertised NBN prices.",
  },
  {
    category: "Other",
    feature: "Included Users",
    free: "1 User per account",
    premium: "1 User per account",
    notes: "Both include one user per account.",
  },
  {
    category: "Other",
    feature: "Additional Users",
    free: "TBC or advertised add-on price",
    premium: "$5 per user",
    notes: "Premium additional users are $5 per user.",
  },
  {
    category: "Other",
    feature: "Referral Bonus",
    free: "No Offer",
    premium: "$500 referral credit",
    notes: "Premium referral credit is split $250 for the user and $250 for the referee.",
  },
];

export function getMembershipTierForPlanId(planId?: string): MembershipTier {
  return planId?.includes("free") ? freeMembershipTier : premiumMembershipTier;
}

export function getMembershipTierSignupHref(code: MembershipTierCode) {
  return `${premiumMembershipRoutes.signup}?tier=${code}`;
}

export type PurchasableMembershipTier = MembershipTierCode | "none" | null | undefined;

export function canPurchaseOnline(membershipTier: PurchasableMembershipTier) {
  return membershipTier === "free" || membershipTier === "premium";
}

export function getMarketplaceDiscount(membershipTier: PurchasableMembershipTier) {
  return membershipTier === "premium" ? 10 : 0;
}

export function getServiceDiscount(membershipTier: PurchasableMembershipTier) {
  return membershipTier === "premium" ? 25 : 0;
}

export function getAnnualServiceCredit(membershipTier: PurchasableMembershipTier) {
  return membershipTier === "premium" ? 1000 : 0;
}
