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
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  requireFields,
} from "./mockClient";

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

export function submitMockFixerRequest(payload: MockFixerRequestPayload) {
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

  return mockPost(
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
}
