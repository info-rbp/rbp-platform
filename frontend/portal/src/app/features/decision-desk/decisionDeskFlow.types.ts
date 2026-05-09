import type { MockPriority, MockTimelineItem } from "../../mock";

export const decisionDeskFlowStorageKey = "rbp.mockDecisionDeskFlow";

export interface DecisionDeskFlowForm {
  fullName: string;
  email: string;
  businessName: string;
  industry: string;
  location: string;
  businessSize: string;
  businessStage: string;
  decisionCategory: string;
  helpType: string;
  decisionTitle: string;
  decisionSummary: string;
  desiredOutcome: string;
  currentSituation: string;
  situationDuration: string;
  trigger: string;
  stakeholders: string;
  triedAlready: string;
  currentTools: string;
  optionsConsidered: string;
  constraints: string[];
  budgetRange: string;
  targetDeadline: string;
  urgency: MockPriority | "";
  internalCapacity: string;
  mainRisks: string;
  preferredOutcomeType: string;
  supportingInfoTypes: string[];
  supportingNotes: string;
  relevantLinks: string;
  filesAcknowledged: boolean;
  acceptedTerms: boolean;
}

export interface DecisionDeskStoredState {
  reference: string;
  status: "submitted";
  requestHref: string;
  title: string;
  businessName: string;
  category: string;
  urgency: string;
  timeline: MockTimelineItem[];
}
