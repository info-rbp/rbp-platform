import {
  getMockRiskScoreBand,
  mockRiskAdvisorResultSummaries,
  mockRiskAppetiteOptions,
  mockRiskAssessments,
  mockRiskCategories,
  mockRiskControlMaturityOptions,
  mockRiskQuestions,
  mockRiskTimeline,
} from "../../mock";
import type { RiskAdvisorService } from "../../types/portal";
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  requireFields,
} from "./mockClient";
import { listMockPortalActivity, recordMockPortalActivity } from "./portal.mockService";

export interface MockRiskAssessmentPayload extends Record<string, unknown> {
  businessName?: string;
  industry?: string;
  businessSize?: string;
  riskCategories?: string[];
  currentControls?: string;
  controlMaturity?: string;
  incidentHistory?: string;
  complianceConcerns?: string;
  riskAppetite?: string;
  priorityOutcome?: string;
}

export interface MockRiskAssessmentResult {
  reference: string;
  status: "outcome-ready";
  mockScore: number;
  scoreBand: ReturnType<typeof getMockRiskScoreBand>;
  summaryHref: string;
  timeline: typeof mockRiskTimeline;
}

function calculateMockRiskScore(payload: MockRiskAssessmentPayload): number {
  const categoryCount = payload.riskCategories?.length ?? 0;
  const maturity = payload.controlMaturity;
  const appetite = payload.riskAppetite;

  let score = 58 + categoryCount * 4;

  if (maturity === "low") score += 18;
  if (maturity === "developing") score += 10;
  if (maturity === "managed") score -= 6;
  if (maturity === "advanced") score -= 14;

  if (appetite === "growth") score += 8;
  if (appetite === "conservative") score -= 5;

  if (String(payload.incidentHistory ?? "").length > 80) score += 5;
  if (String(payload.complianceConcerns ?? "").length > 80) score += 5;

  return Math.max(12, Math.min(96, score));
}

export function getMockRiskAdvisorSetup() {
  return mockGet(
    "/mock/risk-advisor/setup",
    {
      categories: mockRiskCategories,
      questions: mockRiskQuestions,
      assessments: mockRiskAssessments,
      controlMaturityOptions: mockRiskControlMaturityOptions,
      riskAppetiteOptions: mockRiskAppetiteOptions,
      resultSummaries: mockRiskAdvisorResultSummaries,
      timeline: mockRiskTimeline,
    },
    "Mock Risk Advisor setup returned."
  );
}

export async function submitMockRiskAssessment(payload: MockRiskAssessmentPayload) {
  const errors = requireFields(payload, [
    "businessName",
    "industry",
    "businessSize",
    "currentControls",
    "controlMaturity",
    "incidentHistory",
    "complianceConcerns",
    "riskAppetite",
    "priorityOutcome",
  ]);

  if (!payload.riskCategories || payload.riskCategories.length === 0) {
    errors.push({
      field: "riskCategories",
      code: "required",
      message: "At least one risk category is required for this mock assessment.",
    });
  }

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockRiskAssessmentResult>(
        "/mock/risk-advisor/assessment",
        "Mock Risk Advisor validation failed.",
        errors
      )
    );
  }

  const response = await mockPost(
    "/mock/risk-advisor/assessment",
    payload,
    () => {
      const score = calculateMockRiskScore(payload);

      return {
        reference: createMockReference("RISK"),
        status: "outcome-ready" as const,
        mockScore: score,
        scoreBand: getMockRiskScoreBand(score),
        summaryHref: "/portal/services",
        timeline: mockRiskTimeline,
      };
    },
    "Mock Risk Advisor assessment submitted."
  );

  if (response.ok && response.data) {
    await recordMockPortalActivity({
      id: "risk-advisor-current",
      product: "risk-advisor",
      title: `${String(payload.businessName ?? "Business")} risk assessment`,
      description: `Mock score ${response.data.mockScore}/100: ${response.data.scoreBand.label}.`,
      status: "outcome-ready",
      reference: response.data.reference,
      href: "/portal/services/risk-advisor/start",
      adminHref: "/admin/risk-advisor",
      nextAction: "Review risk outcome",
    });
  }

  return response;
}

export function listMyRiskAdvisorAssessments() {
  return Promise.resolve(listMockPortalActivity("risk-advisor"));
}

export const mockRiskAdvisorService: RiskAdvisorService = {
  createAssessmentDraft(payload) {
    return recordMockPortalActivity({
      product: "risk-advisor",
      title: `${String(payload.businessName ?? "Business")} risk assessment draft`,
      description: String(payload.priorityOutcome ?? "Draft Risk Advisor assessment."),
      status: "draft",
      href: "/portal/services/risk-advisor/start",
      adminHref: "/admin/risk-advisor",
      nextAction: "Complete risk categories and controls",
    });
  },

  submitAssessment(id) {
    return recordMockPortalActivity({
      id,
      product: "risk-advisor",
      title: "Risk Advisor assessment",
      description: "Risk Advisor assessment submitted through the customer portal.",
      status: "outcome-ready",
      reference: createMockReference("RISK"),
      href: "/portal/services/risk-advisor/start",
      adminHref: "/admin/risk-advisor",
      nextAction: "Review risk outcome",
    });
  },

  listMyAssessments() {
    return Promise.resolve(listMockPortalActivity("risk-advisor"));
  },
};
