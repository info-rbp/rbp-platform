import {
  freeMembershipTier,
  premiumMembershipTier,
} from "../data/membershipTiers";
import {
  premiumMembershipPlan,
  premiumMembershipRoutes,
} from "../data/premiumMembership";
import type { MockMoney, MockTimelineItem } from "./types.mock";

export interface MockMembershipPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: MockMoney;
  billingCycle: "none" | "weekly" | "monthly" | "annual";
  inclusions: string[];
  ctaHref: string;
  status: "available" | "placeholder";
}

export const mockMembershipPlans: MockMembershipPlan[] = [
  {
    id: "membership-rbp-free",
    name: freeMembershipTier.name,
    slug: "rbp-free-membership",
    description:
      "Create a free RBP account to purchase products and services online, access all member offers, use limited included benefits, and manage your basic member profile.",
    price: {
      amount: 0,
      currency: "AUD",
      gstIncluded: true,
      label: "$0",
    },
    billingCycle: "none",
    inclusions: [
      "Purchase RBP products and services online",
      "One Business Advisor use per month",
      "One Nucleus template per month",
      "Access all member offers",
      "1 user per account",
      "Services available at advertised price",
    ],
    ctaHref: "/membership/sign-up-now?tier=free",
    status: "available",
  },
  {
    id: "membership-rbp-premium-weekly",
    name: premiumMembershipPlan.name,
    slug: "rbp-premium-membership",
    description: premiumMembershipTier.description,
    price: {
      amount: 25,
      currency: "AUD",
      gstIncluded: false,
      label: premiumMembershipPlan.earlyBirdPrice,
    },
    billingCycle: "weekly",
    inclusions: [
      "Unlimited Business Advisor",
      "Unlimited Decision Desk",
      "Unlimited The Fixer",
      "Unlimited Risk Advisor",
      "Unlimited Nucleus access",
      "25% off On-Demand, Managed, and Custom Services",
      "$1,000 annual service credit per category",
      "10% marketplace discount",
      "Access to all member offers",
      "Operations benefits and referral rewards",
    ],
    ctaHref: "/membership/sign-up-now?tier=premium",
    status: "available",
  },
];

export const freeMembershipTimeline: MockTimelineItem[] = [
  {
    id: "free-membership-selected",
    label: "Free Membership selected",
    description: "The Free Membership tier has been selected.",
    status: "draft",
    timestamp: "2026-05-07T09:00:00Z",
  },
  {
    id: "free-account-details-confirmed",
    label: "Account details confirmed",
    description: "Member account details have been confirmed.",
    status: "submitted",
    timestamp: "2026-05-07T09:03:00Z",
  },
  {
    id: "free-membership-activated",
    label: "Free Membership activated",
    description: "No payment is required for Free Membership activation.",
    status: "active",
    timestamp: "2026-05-07T09:05:00Z",
  },
  {
    id: "free-onboarding-started",
    label: "Onboarding started",
    description: "The shared membership onboarding process is ready to continue.",
    status: "in-progress",
    timestamp: "2026-05-07T09:08:00Z",
  },
];

export const premiumMembershipTimeline: MockTimelineItem[] = [
  {
    id: "premium-membership-selected",
    label: "Premium Membership selected",
    description: "The Premium Membership tier has been selected.",
    status: "draft",
    timestamp: "2026-05-07T09:00:00Z",
  },
  {
    id: "premium-account-details-confirmed",
    label: "Account details confirmed",
    description: "Member account details have been confirmed.",
    status: "submitted",
    timestamp: "2026-05-07T09:03:00Z",
  },
  {
    id: "premium-payment-preview-completed",
    label: "Payment preview completed",
    description: "The Premium Membership payment preview has been completed.",
    status: "active",
    timestamp: "2026-05-07T09:05:00Z",
  },
  {
    id: "premium-membership-preview-active",
    label: "Premium Membership preview active",
    description: "The Premium Membership preview is active for portal demonstration.",
    status: "active",
    timestamp: "2026-05-07T09:10:00Z",
  },
  {
    id: "premium-onboarding-started",
    label: "Onboarding started",
    description: "The shared membership onboarding process is ready to continue.",
    status: "in-progress",
    timestamp: "2026-05-07T09:12:00Z",
  },
];

export const mockMembershipTimeline: MockTimelineItem[] = premiumMembershipTimeline;

export const mockMembershipSignupFields = [
  "selected_plan",
  "membership_tier",
  "billing_cycle",
  "business_name",
  "abn_or_business_identifier",
  "industry",
  "business_size",
  "primary_contact_name",
  "email",
  "phone",
  "billing_address",
  "payment_method_preview",
  "accepted_terms",
  "marketing_consent",
];

export const mockMembershipExtras = [
  {
    id: "extra-bid-management-onboarding",
    title: "Bid Management Onboarding",
    description: "Free members can access onboarding at $500 + GST. Premium members receive the discounted $250 + GST onboarding fee.",
    priceLabel: "Tier-specific price",
  },
  {
    id: "extra-document-customisation",
    title: "Document Customisation",
    description: "Free members can request customisation at add-on or advertised price. Premium includes 3 customisations per quarter where eligible.",
    priceLabel: "Tier-specific access",
  },
  {
    id: "extra-additional-service",
    title: "Additional Services",
    description: "Free members pay advertised prices. Premium members may receive eligible service discounts.",
    priceLabel: "Advertised price or member discount",
  },
];

export const mockMembershipGoalOptions = [
  "Improve operations",
  "Increase revenue",
  "Improve cash flow",
  "Access finance",
  "Improve documentation",
  "Set up systems and processes",
  "Manage staff or teams",
  "Improve marketing and sales",
  "Explore managed services",
  "Get advisory support",
  "Review business insurance",
  "Improve reporting and decision-making",
];

export const mockMembershipManagedServiceOptions = [
  {
    id: "managed-hr",
    title: "Managed HR",
    description: "People, team setup, and operational support.",
  },
  {
    id: "managed-finance",
    title: "Finance and insurance",
    description: "Finance, lending, insurance, and planning support.",
  },
  {
    id: "managed-documents",
    title: "Documents and systems",
    description: "Nucleus, process documentation, and app setup support.",
  },
  {
    id: "managed-growth",
    title: "Growth advisory",
    description: "Sales, reporting, strategy, and adviser support.",
  },
];
