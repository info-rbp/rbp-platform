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
    name: "Lifetime RBP Membership",
    slug: "remote-business-partner-membership",
    description:
      "Grab the early bird offer with a discounted membership fee and all the inclusions you need to run your business.",
    price: {
      amount: 25,
      currency: "AUD",
      gstIncluded: false,
      label: "$25 + GST per week",
    },
    billingCycle: "weekly",
    inclusions: [
      "Unlimited Use of Core Services",
      "Unlimited Access to Nucleus",
      "25% Discount on On-Demand Services",
      "Plus Much More",
    ],
    ctaHref: "/membership/remote-business-partner-membership",
    status: "available",
  },
];

export const mockMembershipTimeline: MockTimelineItem[] = [
  {
    id: "membership-started",
    label: "Membership started",
    description: "The membership sign-up flow has been started.",
    status: "draft",
    timestamp: "2026-05-07T09:00:00Z",
  },
  {
    id: "membership-payment-simulated",
    label: "Payment simulated",
    description: "No real payment has been processed.",
    status: "pending",
    timestamp: "2026-05-07T09:05:00Z",
  },
  {
    id: "membership-active",
    label: "Membership active",
    description: "Membership status is active for portal demonstration.",
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
    id: "extra-core-services",
    title: "Core service access",
    description: "Use core business support services as part of your membership.",
    priceLabel: "Included",
  },
  {
    id: "extra-nucleus",
    title: "Nucleus access",
    description: "Access business resources, documents, tools, and platform assets.",
    priceLabel: "Included",
  },
  {
    id: "extra-on-demand-discount",
    title: "On-demand service discount",
    description: "Receive 25% off eligible on-demand services.",
    priceLabel: "25% discount",
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
    description: "DocuShare, process documentation, and app setup interest.",
  },
  {
    id: "managed-growth",
    title: "Growth advisory",
    description: "Sales, reporting, strategy, and adviser support interest.",
  },
];
