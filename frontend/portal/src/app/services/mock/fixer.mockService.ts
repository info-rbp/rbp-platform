import {
  mockFixerDesiredOutcomes,
  mockFixerImpactOptions,
  mockFixerIssueCategories,
  mockFixerRequests,
  mockFixerScopeOptions,
  mockFixerSupportingInfoTypes,
  mockFixerTimeline,
  mockFixerUrgencyOptions,
} from "../../mock";
import type { FixerService } from "../../types/portal";
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  requireFields,
} from "./mockClient";
import { listMockPortalActivity, recordMockPortalActivity } from "./portal.mockService";

export interface MockFixerRequestPayload extends Record<string, unknown> {
  issueTitle?: string;
  issueCategory?: string;
  issueDescription?: string;
  urgency?: string;
  businessImpact?: string;
  scope?: string;
  affectedStakeholders?: string;
  whatHasBeenTried?: string;
  desiredResolution?: string;
  supportingInfoAcknowledged?: boolean;
}

export interface MockFixerRequestResult {
  reference: string;
  status: "submitted";
  requestHref: string;
  portalHref: string;
  adminHref: string;
  timeline: typeof mockFixerTimeline;
}

export function getMockFixerSetup() {
  return mockGet(
    "/mock/fixer/setup",
    {
      categories: mockFixerIssueCategories,
      requests: mockFixerRequests,
      urgencyOptions: mockFixerUrgencyOptions,
      impactOptions: mockFixerImpactOptions,
      scopeOptions: mockFixerScopeOptions,
      desiredOutcomes: mockFixerDesiredOutcomes,
      supportingInfoTypes: mockFixerSupportingInfoTypes,
      timeline: mockFixerTimeline,
    },
    "Mock Fixer setup returned."
  );
}

export async function submitMockFixerRequest(payload: MockFixerRequestPayload) {
  const errors = requireFields(payload, [
    "issueTitle",
    "issueCategory",
    "issueDescription",
    "urgency",
    "businessImpact",
    "scope",
    "affectedStakeholders",
    "whatHasBeenTried",
    "desiredResolution",
  ]);

  if (!payload.supportingInfoAcknowledged) {
    errors.push({
      field: "supportingInfoAcknowledged",
      code: "required",
      message: "Supporting information acknowledgement is required for this mock Fixer request.",
    });
  }

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockFixerRequestResult>(
        "/mock/fixer/request",
        "Mock Fixer validation failed.",
        errors
      )
    );
  }

  const response = await mockPost(
    "/mock/fixer/request",
    payload,
    () => ({
      reference: createMockReference("FIX"),
      status: "submitted" as const,
      requestHref: "/on-demand/the-fixer",
      portalHref: "/portal/services",
      adminHref: "/admin/the-fixer",
      timeline: mockFixerTimeline,
    }),
    "Mock Fixer request submitted."
  );

  if (response.ok && response.data) {
    await recordMockPortalActivity({
      id: "the-fixer-current",
      product: "the-fixer",
      title: String(payload.issueTitle ?? "The Fixer request"),
      description: String(payload.issueDescription ?? "Fixer request submitted through the customer portal."),
      status: "assigned",
      reference: response.data.reference,
      href: "/portal/services/the-fixer/start",
      adminHref: "/admin/the-fixer",
      nextAction: "Assigned for triage",
    });
  }

  return response;
}

export function listMyFixerRequests() {
  return Promise.resolve(listMockPortalActivity("the-fixer"));
}

export const mockFixerService: FixerService = {
  createRequestDraft(payload) {
    return recordMockPortalActivity({
      product: "the-fixer",
      title: String(payload.issueTitle ?? "The Fixer request draft"),
      description: String(payload.issueDescription ?? "Draft Fixer request."),
      status: "draft",
      href: "/portal/services/the-fixer/start",
      adminHref: "/admin/the-fixer",
      nextAction: "Complete issue context and desired resolution",
    });
  },

  submitRequest(id) {
    return recordMockPortalActivity({
      id,
      product: "the-fixer",
      title: "The Fixer request",
      description: "Fixer request submitted through the customer portal.",
      status: "assigned",
      reference: createMockReference("FIX"),
      href: "/portal/services/the-fixer/start",
      adminHref: "/admin/the-fixer",
      nextAction: "Assigned for triage",
    });
  },

  listMyRequests() {
    return Promise.resolve(listMockPortalActivity("the-fixer"));
  },
};
