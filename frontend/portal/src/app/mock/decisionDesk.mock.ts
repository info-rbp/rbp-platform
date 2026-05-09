import type { MockPriority, MockStatus, MockTimelineItem } from "./types.mock";

export interface MockDecisionDeskRequest {
  id: string;
  reference: string;
  title: string;
  category: string;
  summary: string;
  businessName: string;
  industry: string;
  currentSituation: string;
  desiredOutcome: string;
  urgency: MockPriority;
  status: MockStatus;
  deadline: string;
  optionsConsidered: string[];
  constraints: string[];
}

export const mockDecisionDeskRequests: MockDecisionDeskRequest[] = [
  {
    id: "decision-001",
    reference: "DD-MOCK-001",
    title: "Choose operating model for expansion",
    category: "Strategy",
    summary: "Mock decision request used for Phase 1 review, submit and status states.",
    businessName: "Aster Ridge Advisory",
    industry: "Professional services",
    currentSituation: "The business is deciding how to support new client demand without stretching internal delivery capacity.",
    desiredOutcome: "Select a practical operating model and first three implementation actions.",
    urgency: "high",
    status: "in-review",
    deadline: "2026-06-15",
    optionsConsidered: ["Hire internally", "Use managed service", "Hybrid operating model"],
    constraints: ["Budget confidence", "Internal capacity", "Timing pressure"],
  },
];

export const mockDecisionDeskTimeline: MockTimelineItem[] = [
  {
    id: "dd-draft",
    label: "Draft created",
    description: "Decision Desk request was started.",
    status: "draft",
    timestamp: "2026-05-07T10:00:00Z",
  },
  {
    id: "dd-submitted",
    label: "Submitted",
    description: "Mock request submitted for review.",
    status: "submitted",
    timestamp: "2026-05-07T10:15:00Z",
  },
  {
    id: "dd-review",
    label: "In review",
    description: "Mock advisor review state.",
    status: "in-review",
    timestamp: "2026-05-07T10:30:00Z",
  },
];

export const mockDecisionDeskCategories = [
  "Strategy",
  "Finance",
  "Operations",
  "Human Resources",
  "Technology",
  "Sales and Marketing",
  "Governance",
  "Other",
];

export const mockDecisionDeskBusinessSizeOptions = [
  { label: "1-5 people", value: "1-5" },
  { label: "6-20 people", value: "6-20" },
  { label: "21-50 people", value: "21-50" },
  { label: "51+ people", value: "51-plus" },
];

export const mockDecisionDeskBusinessStageOptions = [
  { label: "Starting", value: "starting" },
  { label: "Stabilising", value: "stabilising" },
  { label: "Growing", value: "growing" },
  { label: "Scaling", value: "scaling" },
  { label: "Transitioning", value: "transitioning" },
];

export const mockDecisionDeskHelpTypes = [
  {
    id: "choose-option",
    title: "Choose between options",
    description: "Compare paths and decide which one to pursue.",
  },
  {
    id: "fix-problem",
    title: "Fix a business issue",
    description: "Understand what is happening and identify practical next steps.",
  },
  {
    id: "validate-plan",
    title: "Validate a plan",
    description: "Pressure-test an intended action before committing resources.",
  },
  {
    id: "prioritise-actions",
    title: "Prioritise actions",
    description: "Turn a messy situation into a clearer sequence of work.",
  },
];

export const mockDecisionDeskUrgencyOptions = [
  {
    label: "Low",
    value: "low",
    description: "Useful guidance, but no immediate decision deadline.",
  },
  {
    label: "Medium",
    value: "medium",
    description: "Decision needed within the next few weeks.",
  },
  {
    label: "High",
    value: "high",
    description: "Decision needed this week or it blocks current work.",
  },
  {
    label: "Urgent",
    value: "urgent",
    description: "A near-term business impact needs a rapid mock response.",
  },
];

export const mockDecisionDeskConstraintOptions = [
  {
    id: "budget",
    title: "Budget",
    description: "Cost, cash flow, or funding limits affect the decision.",
  },
  {
    id: "capacity",
    title: "Internal capacity",
    description: "The team may not have enough time, people, or expertise.",
  },
  {
    id: "timing",
    title: "Timing",
    description: "Deadlines, seasonality, or market windows are important.",
  },
  {
    id: "risk",
    title: "Risk exposure",
    description: "Legal, financial, operational, or reputational risks matter.",
  },
  {
    id: "stakeholders",
    title: "Stakeholders",
    description: "Owners, staff, partners, lenders, or customers need alignment.",
  },
];

export const mockDecisionDeskOutcomeOptions = [
  {
    id: "recommendation",
    title: "Recommended direction",
    description: "A preferred option with practical rationale.",
  },
  {
    id: "next-steps",
    title: "Next-step plan",
    description: "A short action list to move the decision forward.",
  },
  {
    id: "risk-check",
    title: "Risk check",
    description: "Key risks, assumptions, and questions to resolve.",
  },
  {
    id: "comparison",
    title: "Option comparison",
    description: "A side-by-side view of the trade-offs.",
  },
];

export const mockDecisionDeskSupportingInfoTypes = [
  "Financial snapshot",
  "Existing proposal",
  "Process notes",
  "Stakeholder feedback",
  "Relevant links",
];
