import {
  mockDecisionDeskBusinessSizeOptions,
  mockDecisionDeskBusinessStageOptions,
  mockDecisionDeskCategories,
  mockDecisionDeskConstraintOptions,
  mockDecisionDeskHelpTypes,
  mockDecisionDeskOutcomeOptions,
  mockDecisionDeskRequests,
  mockDecisionDeskSupportingInfoTypes,
  mockDecisionDeskTimeline,
  mockDecisionDeskUrgencyOptions,
} from "../../mock";
import { createMockReference, mockFailure, mockGet, mockPost, requireFields } from "./mockClient";

export interface MockDecisionDeskPayload extends Record<string, unknown> {
  businessName?: string;
  industry?: string;
  decisionTitle?: string;
  decisionCategory?: string;
  decisionSummary?: string;
  currentSituation?: string;
  urgency?: string;
  desiredOutcome?: string;
}

export interface MockDecisionDeskSubmitResult {
  reference: string;
  status: "submitted";
  requestHref: string;
  timeline: typeof mockDecisionDeskTimeline;
}

export function getMockDecisionDeskSetup() {
  return mockGet(
    "/mock/decision-desk/setup",
    {
      categories: mockDecisionDeskCategories,
      businessSizes: mockDecisionDeskBusinessSizeOptions,
      businessStages: mockDecisionDeskBusinessStageOptions,
      helpTypes: mockDecisionDeskHelpTypes,
      urgencyOptions: mockDecisionDeskUrgencyOptions,
      constraintOptions: mockDecisionDeskConstraintOptions,
      outcomeOptions: mockDecisionDeskOutcomeOptions,
      supportingInfoTypes: mockDecisionDeskSupportingInfoTypes,
      examples: mockDecisionDeskRequests,
    },
    "Mock Decision Desk setup returned."
  );
}

export function submitMockDecisionDeskRequest(payload: MockDecisionDeskPayload) {
  const errors = requireFields(payload, [
    "businessName",
    "industry",
    "decisionTitle",
    "decisionCategory",
    "decisionSummary",
    "currentSituation",
    "urgency",
    "desiredOutcome",
  ]);

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockDecisionDeskSubmitResult>(
        "/mock/decision-desk/request",
        "Mock Decision Desk validation failed.",
        errors
      )
    );
  }

  return mockPost(
    "/mock/decision-desk/request",
    payload,
    () => ({
      reference: createMockReference("DD"),
      status: "submitted" as const,
      requestHref: "/portal/services",
      timeline: mockDecisionDeskTimeline,
    }),
    "Mock Decision Desk request submitted."
  );
}
