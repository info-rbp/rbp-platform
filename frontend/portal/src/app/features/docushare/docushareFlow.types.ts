import type { MockTimelineItem } from "../../mock";

export const docuShareFlowStorageKey = "rbp.mockDocuShareOnboardingFlow";

export interface DocuShareFlowForm {
  businessName: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  industry: string;
  location: string;
  jurisdiction: string;
  businessContext: string;
  documentGroup: string;
  documentCategory: string;
  documentType: string;
  intendedUse: string;
  purpose: string;
  audience: string;
  audienceNotes: string;
  requirementsAnswers: Record<string, string>;
  stylePreference: string;
  brandingPreference: string;
  brandNotes: string;
  supportingNotes: string;
  supportingLinks: string;
  supportingInformationAcknowledged: boolean;
  acceptedTerms: boolean;
}

export interface DocuShareStoredState {
  reference: string;
  status: "submitted";
  documentsHref: string;
  servicesHref: string;
  dashboardHref: string;
  businessName: string;
  documentType: string;
  documentGroup: string;
  timeline: MockTimelineItem[];
}
