import type { MockStatus, MockTimelineItem } from "./types.mock";

export type MockRiskCategory =
  | "Governance"
  | "Cyber"
  | "Finance"
  | "People"
  | "Operations"
  | "Compliance"
  | "Supplier"
  | "Reputation";

export type MockRiskMaturity = "low" | "developing" | "managed" | "advanced";
export type MockRiskAppetite = "conservative" | "balanced" | "growth";

export interface MockRiskQuestion {
  id: string;
  category: MockRiskCategory;
  question: string;
  helpText: string;
}

export interface MockRiskAssessment {
  id: string;
  reference: string;
  businessName: string;
  industry: string;
  score: number;
  scoreBand: "low" | "moderate" | "elevated" | "high";
  status: MockStatus;
  summary: string;
}

export interface MockRiskScoreBand {
  id: "low" | "moderate" | "elevated" | "high";
  range: string;
  label: string;
  description: string;
}

export interface MockRiskAdvisorResultSummary {
  id: string;
  title: string;
  description: string;
  recommendedAction: string;
}

export const mockRiskCategories: MockRiskCategory[] = [
  "Governance",
  "Cyber",
  "Finance",
  "People",
  "Operations",
  "Compliance",
  "Supplier",
  "Reputation",
];

export const mockRiskQuestions: MockRiskQuestion[] = [
  {
    id: "risk-q-001",
    category: "Governance",
    question: "Does the business have documented roles, responsibilities, and decision authority?",
    helpText: "Consider policies, delegations, meeting cadence, approval limits, and board/advisor involvement.",
  },
  {
    id: "risk-q-002",
    category: "Cyber",
    question: "Are critical systems protected by multi-factor authentication and access controls?",
    helpText: "Consider email, accounting, CRM, document storage, admin portals, and password management.",
  },
  {
    id: "risk-q-003",
    category: "Finance",
    question: "Are cash flow, funding, insurance, and financial controls reviewed regularly?",
    helpText: "Consider forecasting, reconciliations, approval controls, debt obligations, and insurance renewals.",
  },
  {
    id: "risk-q-004",
    category: "People",
    question: "Are employment obligations, onboarding, role clarity, and performance issues actively managed?",
    helpText: "Consider employment agreements, HR policies, payroll obligations, and workforce planning.",
  },
  {
    id: "risk-q-005",
    category: "Operations",
    question: "Are key operating processes documented, reviewed, and resilient to staff absence?",
    helpText: "Consider SOPs, handover, supplier dependencies, bottlenecks, and business continuity.",
  },
  {
    id: "risk-q-006",
    category: "Compliance",
    question: "Does the business track licences, regulatory obligations, privacy, and contract requirements?",
    helpText: "Consider industry compliance, permits, privacy, reporting, and contractual commitments.",
  },
];

export const mockRiskControlMaturityOptions = [
  {
    id: "low",
    title: "Low maturity",
    description: "Controls are informal, inconsistent, or mostly held in people's heads.",
  },
  {
    id: "developing",
    title: "Developing maturity",
    description: "Some controls exist, but ownership, evidence, and review are inconsistent.",
  },
  {
    id: "managed",
    title: "Managed maturity",
    description: "Controls are documented, owned, reviewed, and generally operating.",
  },
  {
    id: "advanced",
    title: "Advanced maturity",
    description: "Controls are monitored, measured, improved, and connected to business reporting.",
  },
];

export const mockRiskAppetiteOptions = [
  {
    id: "conservative",
    title: "Conservative",
    description: "Prefer lower risk exposure and stronger controls, even if growth is slower.",
  },
  {
    id: "balanced",
    title: "Balanced",
    description: "Accept moderate risk where controls and monitoring are in place.",
  },
  {
    id: "growth",
    title: "Growth-focused",
    description: "Accept higher risk to move quickly, while identifying critical guardrails.",
  },
];

export const mockRiskScoreBands: MockRiskScoreBand[] = [
  {
    id: "low",
    range: "0-39",
    label: "Low risk exposure",
    description: "The mock assessment suggests risks are generally understood and managed.",
  },
  {
    id: "moderate",
    range: "40-64",
    label: "Moderate risk exposure",
    description: "The mock assessment suggests some risks are controlled but improvement areas remain.",
  },
  {
    id: "elevated",
    range: "65-84",
    label: "Elevated risk exposure",
    description: "The mock assessment suggests several priority areas require review.",
  },
  {
    id: "high",
    range: "85-100",
    label: "High risk exposure",
    description: "The mock assessment suggests urgent controls, governance, or advisory review may be required.",
  },
];

export const mockRiskAdvisorResultSummaries: MockRiskAdvisorResultSummary[] = [
  {
    id: "governance-review",
    title: "Governance review",
    description: "Review decision ownership, policies, approval limits, and operating cadence.",
    recommendedAction: "Create a governance action plan and prioritise decision controls.",
  },
  {
    id: "cyber-baseline",
    title: "Cyber baseline",
    description: "Check MFA, password controls, user access, backups, and data handling.",
    recommendedAction: "Prioritise access controls and backup validation.",
  },
  {
    id: "process-resilience",
    title: "Process resilience",
    description: "Identify undocumented processes and key person dependencies.",
    recommendedAction: "Document critical operating workflows and fallback owners.",
  },
];

export const mockRiskAssessments: MockRiskAssessment[] = [
  {
    id: "risk-assessment-001",
    reference: "RISK-MOCK-001",
    businessName: "Demo Business Pty Ltd",
    industry: "Professional Services",
    score: 72,
    scoreBand: "elevated",
    status: "outcome-ready",
    summary: "Mock assessment score for frontend-only Risk Advisor flow.",
  },
];

export const mockRiskTimeline: MockTimelineItem[] = [
  {
    id: "risk-draft",
    label: "Assessment started",
    description: "Risk Advisor assessment was started in mock mode.",
    status: "draft",
    timestamp: "2026-05-07T12:00:00Z",
  },
  {
    id: "risk-controls",
    label: "Controls reviewed",
    description: "Current controls and risk categories were captured for mock review.",
    status: "in-review",
    timestamp: "2026-05-07T12:10:00Z",
  },
  {
    id: "risk-score",
    label: "Mock score generated",
    description: "A simulated risk score was generated for frontend testing.",
    status: "outcome-ready",
    timestamp: "2026-05-07T12:20:00Z",
  },
];

export function getMockRiskScoreBand(score: number): MockRiskScoreBand {
  if (score < 40) return mockRiskScoreBands[0];
  if (score < 65) return mockRiskScoreBands[1];
  if (score < 85) return mockRiskScoreBands[2];
  return mockRiskScoreBands[3];
}
