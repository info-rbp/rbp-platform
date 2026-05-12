import {
  mockConnectivityHardwareOptions,
  mockConnectivityOrders,
  mockConnectivityPlans,
  mockConnectivityServiceFamilies,
  mockConnectivityTimeline,
} from "../../mock";
import type { ConnectivityService } from "../../types/portal";
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  requireFields,
} from "./mockClient";
import { listMockPortalActivity, recordMockPortalActivity } from "./portal.mockService";

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

export async function submitMockConnectivityOrder(payload: MockConnectivityOrderPayload) {
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

  const response = await mockPost(
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

  if (response.ok && response.data) {
    await recordMockPortalActivity({
      id: "connectivity-current",
      product: "connectivity",
      title: "Business NBN order",
      description: `NBN order for ${String(payload.serviceAddress ?? "the selected service address")}.`,
      status: "submitted",
      reference: response.data.reference,
      href: "/portal/services/nbn/start",
      adminHref: "/admin/connectivity",
      nextAction: "Await serviceability confirmation",
    });
  }

  return response;
}

export function listMyConnectivityOrders() {
  return Promise.resolve(listMockPortalActivity("connectivity"));
}

export const mockConnectivityService: ConnectivityService = {
  checkAvailability(payload) {
    return checkMockServiceability(payload);
  },

  createOrderDraft(payload) {
    return recordMockPortalActivity({
      product: "connectivity",
      title: "Business NBN order draft",
      description: `Draft NBN order for ${String(payload.serviceAddress ?? "the selected service address")}.`,
      status: "draft",
      href: "/portal/services/nbn/start",
      adminHref: "/admin/connectivity",
      nextAction: "Complete address availability and plan selection",
    });
  },

  submitOrder(id) {
    return recordMockPortalActivity({
      id,
      product: "connectivity",
      title: "Business NBN order",
      description: "NBN order submitted through the customer portal.",
      status: "submitted",
      reference: createMockReference("NBN"),
      href: "/portal/services/nbn/start",
      adminHref: "/admin/connectivity",
      nextAction: "Await serviceability confirmation",
    });
  },

  listMyOrders() {
    return Promise.resolve(listMockPortalActivity("connectivity"));
  },
};
