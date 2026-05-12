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
import type { DocuShareService } from "../../types/portal";
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  mockSuccess,
  requireFields,
  type MockValidationError,
} from "./mockClient";
import { listMockPortalActivity, recordMockPortalActivity } from "./portal.mockService";

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

export async function submitMockDocuShareBrief(payload: MockDocuShareBriefPayload) {
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

  const response = await mockPost(
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
        "No real files were uploaded. Supporting information is represented by Phase 1 mock placeholders only.",
    }),
    "Mock DocuShare brief submitted."
  );

  if (response.ok && response.data) {
    await recordMockPortalActivity({
      id: "docushare-current",
      product: "docushare",
      title: `${String(payload.documentType ?? "DocuShare")} brief`,
      description: String(payload.businessContext ?? "DocuShare brief submitted through the customer portal."),
      status: "submitted",
      reference: response.data.reference,
      href: "/portal/services/docushare/start",
      adminHref: "/admin/docushare",
      nextAction: "Await document review",
    });
  }

  return response;
}

export function listMyDocuShareBriefs() {
  return Promise.resolve(listMockPortalActivity("docushare"));
}

export const mockDocuShareService: DocuShareService = {
  createDraft(payload) {
    return recordMockPortalActivity({
      product: "docushare",
      title: `${String(payload.documentType ?? "DocuShare")} brief draft`,
      description: String(payload.businessContext ?? "Draft DocuShare brief."),
      status: "draft",
      href: "/portal/services/docushare/start",
      adminHref: "/admin/docushare",
      nextAction: "Complete document requirements",
    });
  },

  updateDraft(id, payload) {
    return recordMockPortalActivity({
      id,
      product: "docushare",
      title: `${String(payload.documentType ?? "DocuShare")} brief draft`,
      description: String(payload.businessContext ?? "Updated DocuShare brief."),
      status: "in-progress",
      href: "/portal/services/docushare/start",
      adminHref: "/admin/docushare",
      nextAction: "Review and submit document brief",
    });
  },

  submitBrief(id) {
    return recordMockPortalActivity({
      id,
      product: "docushare",
      title: "DocuShare brief",
      description: "DocuShare brief submitted through the customer portal.",
      status: "submitted",
      reference: createMockReference("DOC"),
      href: "/portal/services/docushare/start",
      adminHref: "/admin/docushare",
      nextAction: "Await document review",
    });
  },

  listMyBriefs() {
    return Promise.resolve(listMockPortalActivity("docushare"));
  },

  async getBrief(id) {
    const response = listMockPortalActivity("docushare");
    return mockSuccess(
      "/mock/docushare/brief/detail",
      response.data?.find((item) => item.id === id) ?? null,
      "Mock DocuShare brief returned."
    );
  },
};
