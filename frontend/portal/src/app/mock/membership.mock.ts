import {
  premiumMembershipInclusions,
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
    id: "membership-rbp-weekly",
    name: premiumMembershipPlan.name,
    slug: "rbp-premium-membership",
    description:
      "Access Core Services, Nucleus resources, service discounts, marketplace savings, member offers, and operations benefits through a premium weekly membership.",
    price: {
      amount: 25,
      currency: "AUD",
      gstIncluded: false,
      label: premiumMembershipPlan.earlyBirdPrice,
    },
    billingCycle: "weekly",
    inclusions: premiumMembershipInclusions.flatMap((group) =>
      group.items.slice(0, group.category === "Core" ? 4 : 1).map((item) => {
        if (group.category === "Core") {
          return `${item.name}: ${item.value} usage`;
        }
        return `${item.name}: ${item.value}`;
      })
    ),
    ctaHref: premiumMembershipRoutes.signup,
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
    label: "Membership preview confirmed",
    description: "Premium membership preview is active for portal demonstration.",
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
    id: "extra-advisory-session",
    title: "Priority advisory session",
    description: "Preview an added strategy session during the onboarding experience.",
    priceLabel: "$220 + GST once-off",
  },
  {
    id: "extra-docushare-setup",
    title: "Nucleus setup session",
    description: "Preview a document workspace setup and starter template mapping session.",
    priceLabel: "$180 + GST once-off",
  },
  {
    id: "extra-reporting-pack",
    title: "Reporting pack",
    description: "Preview a dashboard briefing for cash flow and decision visibility.",
    priceLabel: "$150 + GST once-off",
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
    description: "Finance, lending, insurance, and planning interest capture.",
  },
  {
    id: "managed-documents",
    title: "Documents and systems",
    description: "Nucleus, process documentation, and app setup interest.",
  },
  {
    id: "managed-growth",
    title: "Growth advisory",
    description: "Sales, reporting, strategy, and adviser support interest.",
  },
];
