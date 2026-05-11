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
  billingCycle: "weekly" | "monthly" | "annual";
  inclusions: string[];
  ctaHref: string;
  status: "available" | "placeholder";
}

export const mockMembershipPlans: MockMembershipPlan[] = [
  {
    id: "membership-rbp-premium-weekly",
    name: premiumMembershipPlan.name,
    slug: "rbp-premium-membership",
    description: premiumMembershipPlan.heroBody,
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
    ctaHref: premiumMembershipRoutes.inclusions,
    status: "available",
  },
];

export const mockMembershipTimeline: MockTimelineItem[] = [
  {
    id: "membership-started",
    label: "Membership preview started",
    description: "The premium membership sign-up preview has been started.",
    status: "draft",
    timestamp: "2026-05-07T09:00:00Z",
  },
  {
    id: "membership-payment-simulated",
    label: "Payment preview completed",
    description: "No real payment has been processed.",
    status: "pending",
    timestamp: "2026-05-07T09:05:00Z",
  },
  {
    id: "membership-active",
    label: "Membership preview active",
    description: "The membership preview is active for portal demonstration.",
    status: "active",
    timestamp: "2026-05-07T09:10:00Z",
  },
];

export const mockMembershipSignupFields = [
  "selected_plan",
  "billing_cycle",
  "business_name",
  "abn_or_business_identifier",
  "industry",
  "business_size",
  "primary_contact_name",
  "email",
  "phone",
  "billing_address",
  "payment_method_mock",
  "accepted_terms",
  "marketing_consent",
];

export const mockMembershipExtras = [
  {
    id: "extra-bid-management-onboarding",
    title: "Bid Management Discounted Onboarding",
    description: "Discounted Bid Management onboarding available to premium members.",
    priceLabel: "$250 + GST once-off",
  },
  {
    id: "extra-additional-user",
    title: "Additional Premium Member User",
    description: "Add another user to the membership account.",
    priceLabel: "$5 per user",
  },
  {
    id: "extra-service-credit-review",
    title: "Service Credit Review",
    description: "Review eligible service credit categories and how they may apply.",
    priceLabel: "Included",
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
