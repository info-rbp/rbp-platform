import {
  mockDocuShareAudienceOptions,
  mockDocuShareBrandingOptions,
  mockDocuShareBriefs,
  mockDocuShareDocumentGroups,
  mockDocuShareGroupQuestions,
  mockDocuSharePurposeOptions,
  mockDocuShareStyleOptions,
  mockDocuShareTimeline,
  mockDocumentCategories,
  mockDocumentProducts,
  type MockTimelineItem,
} from "../../mock";
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  requireFields,
  type MockValidationError,
} from "./mockClient";

export interface MockDocuShareBriefPayload extends Record<string, unknown> {
  businessName?: string;
  contactName?: string;
  contactEmail?: string;
  documentGroup?: string;
  documentType?: string;
  documentCategory?: string;
  businessContext?: string;
  jurisdiction?: string;
  intendedUse?: string;
  audience?: string;
  purpose?: string;
  stylePreference?: string;
  supportingInformationAcknowledged?: boolean;
}

export interface MockDocuShareBriefResult {
  reference: string;
  status: "submitted";
  documentsHref: string;
  servicesHref: string;
  dashboardHref: string;
  timeline: MockTimelineItem[];
  filePlaceholderAcknowledgement: string;
}

export function getMockDocumentProducts() {
  return mockGet(
    "/mock/docushare/products",
    {
      groups: mockDocuShareDocumentGroups,
      categories: mockDocumentCategories,
      products: mockDocumentProducts,
      briefs: mockDocuShareBriefs,
      purposeOptions: mockDocuSharePurposeOptions,
      audienceOptions: mockDocuShareAudienceOptions,
      styleOptions: mockDocuShareStyleOptions,
      brandingOptions: mockDocuShareBrandingOptions,
      groupQuestions: mockDocuShareGroupQuestions,
      timeline: mockDocuShareTimeline,
    },
    "Mock document products returned."
  );
}

export function submitMockDocuShareBrief(payload: MockDocuShareBriefPayload) {
  const errors = requireFields(payload, [
    "businessName",
    "contactName",
    "contactEmail",
    "documentGroup",
    "documentType",
    "documentCategory",
    "businessContext",
    "jurisdiction",
    "intendedUse",
    "audience",
    "purpose",
    "stylePreference",
  ]);

  const extraErrors: MockValidationError[] = [];

  if (!payload.supportingInformationAcknowledged) {
    extraErrors.push({
      field: "supportingInformationAcknowledged",
      code: "required",
      message: "Acknowledge that supporting information is mock-only for Phase 1.",
    });
  }

  const allErrors = [...errors, ...extraErrors];

  if (allErrors.length > 0) {
    return Promise.resolve(
      mockFailure<MockDocuShareBriefResult>(
        "/mock/docushare/brief",
        "Mock DocuShare validation failed.",
        allErrors
      )
    );
  }

  return mockPost(
    "/mock/docushare/brief",
    payload,
    () => ({
      reference: createMockReference("DOC"),
      status: "submitted" as const,
      documentsHref: "/portal/documents",
      servicesHref: "/portal/services",
      dashboardHref: "/portal/dashboard",
      timeline: mockDocuShareTimeline,
      filePlaceholderAcknowledgement:
        "No real files were uploaded. Supporting information is represented by preview placeholders only.",
    }),
    "Mock DocuShare brief submitted."
  );
}
