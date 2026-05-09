import type { MockPriority, MockStatus, MockTimelineItem } from "./types.mock";

export type MockFixerIssueCategory =
  | "Operational issue"
  | "People issue"
  | "Supplier issue"
  | "Customer issue"
  | "Compliance issue"
  | "Technology issue"
  | "Finance issue"
  | "Other";

export type MockFixerBusinessImpact =
  | "minor"
  | "moderate"
  | "major"
  | "critical";

export type MockFixerScope =
  | "single-issue"
  | "team-wide"
  | "business-wide"
  | "external-stakeholders";

export interface MockFixerRequest {
  id: string;
  reference: string;
  issueTitle: string;
  issueCategory: MockFixerIssueCategory;
  issueDescription: string;
  urgency: MockPriority;
  businessImpact: string;
  scope: MockFixerScope;
  desiredResolution: string;
  status: MockStatus;
}

export interface MockFixerOption {
  id: string;
  title: string;
  description: string;
}

export interface MockFixerOutcome {
  id: string;
  title: string;
  description: string;
}

export const mockFixerRequests: MockFixerRequest[] = [
  {
    id: "fixer-001",
    reference: "FIX-MOCK-001",
    issueTitle: "Urgent process breakdown",
    issueCategory: "Operational issue",
    issueDescription: "Mock urgent request used for frontend review and status tracking.",
    urgency: "urgent",
    businessImpact: "Delays to customer delivery",
    scope: "business-wide",
    desiredResolution: "Stabilise the process, identify immediate actions, and create a handover plan.",
    status: "assigned",
  },
];

export const mockFixerIssueCategories: MockFixerIssueCategory[] = [
  "Operational issue",
  "People issue",
  "Supplier issue",
  "Customer issue",
  "Compliance issue",
  "Technology issue",
  "Finance issue",
  "Other",
];

export const mockFixerUrgencyOptions: MockFixerOption[] = [
  {
    id: "low",
    title: "Low",
    description: "The issue is important but can be planned into normal business cadence.",
  },
  {
    id: "medium",
    title: "Medium",
    description: "The issue is affecting work and should be addressed soon.",
  },
  {
    id: "high",
    title: "High",
    description: "The issue is causing disruption and needs prompt attention.",
  },
  {
    id: "urgent",
    title: "Urgent",
    description: "The issue is materially disrupting the business and needs immediate triage.",
  },
];

export const mockFixerImpactOptions: MockFixerOption[] = [
  {
    id: "minor",
    title: "Minor impact",
    description: "Limited disruption with manageable short-term workarounds.",
  },
  {
    id: "moderate",
    title: "Moderate impact",
    description: "Visible disruption to a team, process, customer, or supplier relationship.",
  },
  {
    id: "major",
    title: "Major impact",
    description: "Significant disruption to operations, revenue, delivery, compliance, or team stability.",
  },
  {
    id: "critical",
    title: "Critical impact",
    description: "Immediate business continuity, customer, legal, financial, or reputational risk.",
  },
];

export const mockFixerScopeOptions: MockFixerOption[] = [
  {
    id: "single-issue",
    title: "Single issue",
    description: "One contained issue, process, supplier, customer, or team concern.",
  },
  {
    id: "team-wide",
    title: "Team-wide",
    description: "The issue affects a team, department, or operating group.",
  },
  {
    id: "business-wide",
    title: "Business-wide",
    description: "The issue affects multiple parts of the business.",
  },
  {
    id: "external-stakeholders",
    title: "External stakeholders",
    description: "The issue involves customers, suppliers, regulators, partners, or other external parties.",
  },
];

export const mockFixerDesiredOutcomes: MockFixerOutcome[] = [
  {
    id: "stabilise",
    title: "Stabilise the issue",
    description: "Identify immediate actions to reduce disruption and restore control.",
  },
  {
    id: "diagnose",
    title: "Diagnose the root cause",
    description: "Understand what is causing the issue and what needs to change.",
  },
  {
    id: "action-plan",
    title: "Create an action plan",
    description: "Define owners, priorities, timelines, and next steps.",
  },
  {
    id: "handover",
    title: "Create a handover pack",
    description: "Prepare a clear internal handover for team implementation.",
  },
];

export const mockFixerSupportingInfoTypes = [
  {
    id: "timeline",
    title: "Issue timeline",
    description: "A short sequence of what happened and when.",
  },
  {
    id: "screenshots",
    title: "Screenshots or examples",
    description: "Mock upload placeholder only. No real files are uploaded in Phase 1.",
  },
  {
    id: "stakeholders",
    title: "Stakeholder list",
    description: "People, teams, suppliers, or customers affected by the issue.",
  },
  {
    id: "documents",
    title: "Relevant documents",
    description: "Mock document placeholder only. No real document storage is connected.",
  },
];

export const mockFixerTimeline: MockTimelineItem[] = [
  {
    id: "fixer-started",
    label: "Request started",
    description: "The Fixer request was started in mock mode.",
    status: "draft",
    timestamp: "2026-05-07T13:00:00Z",
  },
  {
    id: "fixer-submitted",
    label: "Request submitted",
    description: "The mock Fixer request was submitted for triage.",
    status: "submitted",
    timestamp: "2026-05-07T13:10:00Z",
  },
  {
    id: "fixer-triage",
    label: "Mock triage",
    description: "A simulated triage state has been created for portal/admin review.",
    status: "in-review",
    timestamp: "2026-05-07T13:20:00Z",
  },
  {
    id: "fixer-assigned",
    label: "Mock assignment",
    description: "A simulated assignment state is available for frontend status tracking.",
    status: "assigned",
    timestamp: "2026-05-07T13:30:00Z",
  },
];
