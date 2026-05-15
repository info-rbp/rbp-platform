import type { PortalProductActivity, PortalProductKey } from "../../../types/portal";
import { apiFailure, apiSuccess } from "../client";
import { invokeAppwriteFunction } from "../../../lib/appwrite/functions";

function toActivity(product: PortalProductKey, payload: Record<string, unknown>): PortalProductActivity {
  return {
    id: String(payload.id ?? payload.reference ?? `${product}-${Date.now()}`),
    product,
    title: String(payload.title ?? payload.businessName ?? "Submitted request"),
    description: String(payload.description ?? "Submitted to RBP for review."),
    status: "submitted",
    reference: String(payload.reference ?? payload.reference_id ?? ""),
    href: "/portal/services",
    nextAction: "Await RBP review",
    updatedAt: new Date().toLocaleDateString("en-AU"),
  };
}

export const appwriteServicesApi = {
  async createAndSubmitRequest(product: PortalProductKey, payload: Record<string, unknown>) {
    try {
      const response = await invokeAppwriteFunction<Record<string, unknown>>(
        "create-service-request",
        { product, payload }
      );
      return apiSuccess(
        "appwrite/functions/create-service-request",
        toActivity(product, response),
        "Service request submitted to Appwrite."
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : `No Appwrite function is mapped for ${product}.`;
      return apiFailure<PortalProductActivity>("appwrite/functions/create-service-request", message, [
        { field: "services", code: "invalid", message },
      ]);
    }
  },
};
