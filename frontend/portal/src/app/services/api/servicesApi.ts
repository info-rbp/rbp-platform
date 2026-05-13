import type {
  PortalProductActivity,
  PortalProductKey,
} from "../../types/portal";
import { apiFailure, apiSuccess, callFrappeMethod } from "./client";

function extractName(data: unknown) {
  const record = data as Record<string, unknown>;
  return String(record?.name ?? record?.id ?? record?.request_name ?? record?.assessment_name ?? record?.case_name ?? "");
}

function normaliseActivity(
  product: PortalProductKey,
  raw: unknown,
  fallbackPayload: Record<string, unknown>
): PortalProductActivity {
  const record = (raw ?? {}) as Record<string, unknown>;
  const name = extractName(record) || `${product}-${Date.now()}`;

  return {
    id: name,
    product,
    title: String(record.title ?? fallbackPayload.title ?? fallbackPayload.businessName ?? "Submitted request"),
    description: String(record.description ?? record.summary ?? "Submitted to RBP for review."),
    status: "submitted",
    reference: String(record.reference ?? record.reference_id ?? name),
    href: String(record.href ?? "/portal/services"),
    nextAction: "Await RBP review",
    updatedAt: new Date().toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
}

const endpointMap: Partial<Record<PortalProductKey, {
  create: string;
  submit?: string;
  submitParam?: string;
}>> = {
  "decision-desk": {
    create: "rbp_app.api.decision_desk.create_request",
    submit: "rbp_app.api.decision_desk.submit_request",
    submitParam: "request_name",
  },
  connectivity: {
    create: "rbp_app.api.connectivity.create_request",
    submit: "rbp_app.api.connectivity.submit_request",
    submitParam: "request_name",
  },
  "risk-advisor": {
    create: "rbp_app.api.risk_advisor.create_assessment",
    submit: "rbp_app.api.risk_advisor.submit_assessment",
    submitParam: "assessment_name",
  },
  "the-fixer": {
    create: "rbp_app.api.the_fixer.create_case",
    submit: "rbp_app.api.the_fixer.submit_case",
    submitParam: "case_name",
  },
  docushare: {
    create: "rbp_app.api.docushare.create_document",
  },
  "marketplace-listing": {
    create: "rbp_app.api.marketplace.create_listing",
  },
};

export const servicesApi = {
  async createAndSubmitRequest(product: PortalProductKey, payload: Record<string, unknown>) {
    const endpoint = endpointMap[product];

    if (!endpoint) {
      return apiFailure<PortalProductActivity>("/api/method/rbp_app.api.unknown", `No backend endpoint is mapped for ${product}.`);
    }

    const created = await callFrappeMethod<Record<string, unknown>>(endpoint.create, { payload });

    if (!created.ok || !created.data) {
      return apiFailure<PortalProductActivity>(`/api/method/${endpoint.create}`, created.message, created.errors);
    }

    let finalData: unknown = created.data;
    const name = extractName(created.data);

    if (endpoint.submit && endpoint.submitParam && name) {
      const submitted = await callFrappeMethod<Record<string, unknown>>(endpoint.submit, {
        [endpoint.submitParam]: name,
      });

      if (submitted.ok && submitted.data) {
        finalData = submitted.data;
      }
    }

    return apiSuccess(
      `/api/method/${endpoint.create}`,
      normaliseActivity(product, finalData, payload),
      "Service request submitted to backend."
    );
  },
};
