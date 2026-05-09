import {
  mockConnectivityHardwareOptions,
  mockConnectivityOrders,
  mockConnectivityPlans,
  mockConnectivityServiceFamilies,
  mockConnectivityTimeline,
} from "../../mock";
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  requireFields,
} from "./mockClient";

export interface MockServiceabilityPayload extends Record<string, unknown> {
  serviceAddress?: string;
}

export interface MockConnectivityOrderPayload extends Record<string, unknown> {
  serviceAddress?: string;
  selectedPlanId?: string;
  selectedHardwareId?: string;
  contactName?: string;
  contactEmail?: string;
  businessName?: string;
  abn?: string;
  paymentMethodMock?: string;
  acceptedTerms?: boolean;
}

export interface MockServiceabilityResult {
  serviceabilityStatus: "available" | "manual-review" | "not-available";
  availablePlans: typeof mockConnectivityPlans;
  provisioningLabel: string;
}

export interface MockConnectivityOrderResult {
  reference: string;
  status: "submitted";
  orderHref: string;
  portalHref: string;
  timeline: typeof mockConnectivityTimeline;
}

export function getMockConnectivityPlans() {
  return mockGet(
    "/mock/connectivity/plans",
    {
      families: mockConnectivityServiceFamilies,
      plans: mockConnectivityPlans,
      hardwareOptions: mockConnectivityHardwareOptions,
      orders: mockConnectivityOrders,
      timeline: mockConnectivityTimeline,
    },
    "Mock connectivity plans returned."
  );
}

export function checkMockServiceability(payload: MockServiceabilityPayload) {
  const errors = requireFields(payload, ["serviceAddress"]);

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockServiceabilityResult>(
        "/mock/connectivity/serviceability",
        "Mock serviceability validation failed.",
        errors
      )
    );
  }

  return mockPost(
    "/mock/connectivity/serviceability",
    payload,
    () => ({
      serviceabilityStatus: "available" as const,
      availablePlans: mockConnectivityPlans,
      provisioningLabel: "14-day mock provisioning lead time",
    }),
    "Mock serviceability check completed."
  );
}

export function submitMockConnectivityOrder(payload: MockConnectivityOrderPayload) {
  const errors = requireFields(payload, [
    "serviceAddress",
    "selectedPlanId",
    "selectedHardwareId",
    "contactName",
    "contactEmail",
    "businessName",
    "paymentMethodMock",
  ]);

  if (!payload.acceptedTerms) {
    errors.push({
      field: "acceptedTerms",
      code: "required",
      message: "Terms must be accepted for this mock connectivity order.",
    });
  }

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockConnectivityOrderResult>(
        "/mock/connectivity/order",
        "Mock connectivity order validation failed.",
        errors
      )
    );
  }

  return mockPost(
    "/mock/connectivity/order",
    payload,
    () => ({
      reference: createMockReference("NBN"),
      status: "submitted" as const,
      orderHref: "/operations/connectivity",
      portalHref: "/portal/services",
      timeline: mockConnectivityTimeline,
    }),
    "Mock connectivity order submitted."
  );
}
