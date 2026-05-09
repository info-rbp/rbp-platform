import type { MockMoney, MockStatus, MockTimelineItem } from "./types.mock";

export type MockConnectivityProvider = "NBN" | "Superloop" | "Phone";
export type MockConnectivityPlanFamily = "TotalBiz" | "ProBiz";
export type MockConnectivityServiceabilityStatus =
  | "not-checked"
  | "available"
  | "manual-review"
  | "not-available";
export type MockConnectivityHardwareType =
  | "byo"
  | "tp-link"
  | "amazon-eero";

export interface MockConnectivityPlan {
  id: string;
  provider: MockConnectivityProvider;
  family: MockConnectivityPlanFamily;
  name: string;
  speedLabel: string;
  price: MockMoney;
  description: string;
  contractTermLabel: string;
  provisioningLabel: string;
  premiumDiscountAvailable: boolean;
  bestFor: string[];
}

export interface MockConnectivityHardwareOption {
  id: MockConnectivityHardwareType;
  name: string;
  description: string;
  priceLabel: string;
  recommended?: boolean;
}

export interface MockConnectivityOrder {
  id: string;
  reference: string;
  serviceAddress: string;
  selectedPlanId: string;
  selectedHardwareId: MockConnectivityHardwareType;
  serviceabilityStatus: MockConnectivityServiceabilityStatus;
  status: MockStatus;
  contractTermLabel: string;
  provisioningLabel: string;
}

export interface MockConnectivityServiceFamily {
  id: MockConnectivityPlanFamily;
  title: string;
  description: string;
  idealFor: string;
}

export const mockConnectivityServiceFamilies: MockConnectivityServiceFamily[] = [
  {
    id: "TotalBiz",
    title: "TotalBiz",
    description: "Mock business connectivity plan family for everyday business operations.",
    idealFor: "Small teams, office connectivity, voice/data bundles, and general business use.",
  },
  {
    id: "ProBiz",
    title: "ProBiz",
    description: "Mock premium business connectivity plan family for heavier usage and priority service expectations.",
    idealFor: "Growing teams, higher speed needs, cloud tools, multi-site operations, and premium support expectations.",
  },
];

export const mockConnectivityPlans: MockConnectivityPlan[] = [
  {
    id: "totalbiz-100-40",
    provider: "NBN",
    family: "TotalBiz",
    name: "TotalBiz 100",
    speedLabel: "100/40 Mbps",
    price: {
      amount: 99,
      currency: "AUD",
      gstIncluded: false,
      label: "$99 + GST per month",
    },
    description: "Mock TotalBiz NBN plan for reliable business connectivity simulation.",
    contractTermLabel: "36-month mock contract",
    provisioningLabel: "14-day mock provisioning lead time",
    premiumDiscountAvailable: true,
    bestFor: ["Small offices", "Cloud tools", "General business browsing", "Video meetings"],
  },
  {
    id: "totalbiz-250-100",
    provider: "NBN",
    family: "TotalBiz",
    name: "TotalBiz 250",
    speedLabel: "250/100 Mbps",
    price: {
      amount: 139,
      currency: "AUD",
      gstIncluded: false,
      label: "$139 + GST per month",
    },
    description: "Mock faster TotalBiz plan for businesses with heavier collaboration needs.",
    contractTermLabel: "36-month mock contract",
    provisioningLabel: "14-day mock provisioning lead time",
    premiumDiscountAvailable: true,
    bestFor: ["Hybrid teams", "Video-heavy work", "Cloud storage", "Larger offices"],
  },
  {
    id: "probiz-500-200",
    provider: "Superloop",
    family: "ProBiz",
    name: "ProBiz 500",
    speedLabel: "500/200 Mbps",
    price: {
      amount: 199,
      currency: "AUD",
      gstIncluded: false,
      label: "$199 + GST per month",
    },
    description: "Mock ProBiz plan for performance-focused business connectivity.",
    contractTermLabel: "36-month mock contract",
    provisioningLabel: "14-day mock provisioning lead time",
    premiumDiscountAvailable: true,
    bestFor: ["High usage teams", "SaaS-heavy operations", "Video production", "Multiple departments"],
  },
  {
    id: "probiz-1000-400",
    provider: "Superloop",
    family: "ProBiz",
    name: "ProBiz 1000",
    speedLabel: "1000/400 Mbps",
    price: {
      amount: 299,
      currency: "AUD",
      gstIncluded: false,
      label: "$299 + GST per month",
    },
    description: "Mock premium connectivity option for intensive business operations.",
    contractTermLabel: "36-month mock contract",
    provisioningLabel: "14-day mock provisioning lead time",
    premiumDiscountAvailable: true,
    bestFor: ["Large teams", "Data-heavy work", "Multi-site planning", "Priority workloads"],
  },
];

export const mockConnectivityHardwareOptions: MockConnectivityHardwareOption[] = [
  {
    id: "byo",
    name: "Bring your own modem/router",
    description: "Use existing compatible hardware. Phase 1 does not validate compatibility.",
    priceLabel: "$0 upfront",
  },
  {
    id: "tp-link",
    name: "TP-Link business modem",
    description: "Mock hardware option for standard business connectivity scenarios.",
    priceLabel: "$149 mock hardware cost",
    recommended: true,
  },
  {
    id: "amazon-eero",
    name: "Amazon eero mesh kit",
    description: "Mock mesh Wi-Fi option for office coverage planning.",
    priceLabel: "$299 mock hardware cost",
  },
];

export const mockConnectivityOrders: MockConnectivityOrder[] = [
  {
    id: "connectivity-order-001",
    reference: "NBN-MOCK-001",
    serviceAddress: "100 Demo Street, Melbourne VIC",
    selectedPlanId: "totalbiz-100-40",
    selectedHardwareId: "tp-link",
    serviceabilityStatus: "available",
    status: "submitted",
    contractTermLabel: "36-month mock contract",
    provisioningLabel: "14-day mock provisioning lead time",
  },
];

export const mockConnectivityTimeline: MockTimelineItem[] = [
  {
    id: "connectivity-address",
    label: "Address entered",
    description: "Service address captured for mock serviceability check.",
    status: "draft",
    timestamp: "2026-05-07T11:00:00Z",
  },
  {
    id: "connectivity-serviceability",
    label: "Serviceability simulated",
    description: "Mock serviceability result returned. No real NBN or Superloop check was performed.",
    status: "active",
    timestamp: "2026-05-07T11:05:00Z",
  },
  {
    id: "connectivity-order",
    label: "Order submitted",
    description: "Mock connectivity order submitted for Phase 1 status testing.",
    status: "submitted",
    timestamp: "2026-05-07T11:15:00Z",
  },
  {
    id: "connectivity-review",
    label: "Provisioning review",
    description: "Mock 14-day provisioning state created for portal tracking.",
    status: "in-review",
    timestamp: "2026-05-07T11:20:00Z",
  },
];
