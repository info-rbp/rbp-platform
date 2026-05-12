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
import type { DecisionDeskService } from "../../types/portal";
import { createMockReference, mockFailure, mockGet, mockPost, mockSuccess, requireFields } from "./mockClient";
import { listMockPortalActivity, recordMockPortalActivity } from "./portal.mockService";

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

export async function submitMockDecisionDeskRequest(payload: MockDecisionDeskPayload) {
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

  const response = await mockPost(
    "/mock/decision-desk/request",
    payload,
    () => ({
      reference: createMockReference("DD"),
      status: "submitted" as const,
      requestHref: "/portal/services/decision-desk/start",
      timeline: mockDecisionDeskTimeline,
    }),
    "Mock Decision Desk request submitted."
  );

  if (response.ok && response.data) {
    await recordMockPortalActivity({
      id: "decision-desk-current",
      product: "decision-desk",
      title: String(payload.decisionTitle ?? "Decision Desk request"),
      description: String(payload.decisionSummary ?? "Decision Desk request submitted through the customer portal."),
      status: "submitted",
      reference: response.data.reference,
      href: "/portal/services/decision-desk/start",
      adminHref: "/admin/decision-desk",
      nextAction: "Await adviser review",
    });
  }

  return response;
}

export function listMyDecisionDeskRequests() {
  return Promise.resolve(listMockPortalActivity("decision-desk"));
}

export const mockDecisionDeskService: DecisionDeskService = {
  createDraft(payload) {
    return recordMockPortalActivity({
      product: "decision-desk",
      title: String(payload.decisionTitle ?? "Decision Desk draft"),
      description: String(payload.decisionSummary ?? "Draft Decision Desk request."),
      status: "draft",
      href: "/portal/services/decision-desk/start",
      adminHref: "/admin/decision-desk",
      nextAction: "Complete business details and decision context",
    });
  },

  updateDraft(id, payload) {
    return recordMockPortalActivity({
      id,
      product: "decision-desk",
      title: String(payload.decisionTitle ?? "Decision Desk draft"),
      description: String(payload.decisionSummary ?? "Updated Decision Desk draft."),
      status: "in-progress",
      href: "/portal/services/decision-desk/start",
      adminHref: "/admin/decision-desk",
      nextAction: "Review and submit request",
    });
  },

  submitRequest(id) {
    return recordMockPortalActivity({
      id,
      product: "decision-desk",
      title: "Decision Desk request",
      description: "Decision Desk request submitted through the customer portal.",
      status: "submitted",
      reference: createMockReference("DD"),
      href: "/portal/services/decision-desk/start",
      adminHref: "/admin/decision-desk",
      nextAction: "Await adviser review",
    });
  },

  listMyRequests() {
    return Promise.resolve(listMockPortalActivity("decision-desk"));
  },

  async getRequest(id) {
    const response = listMockPortalActivity("decision-desk");
    return mockSuccess(
      "/mock/decision-desk/request/detail",
      response.data?.find((item) => item.id === id) ?? null,
      "Mock Decision Desk request returned."
    );
  },
};
