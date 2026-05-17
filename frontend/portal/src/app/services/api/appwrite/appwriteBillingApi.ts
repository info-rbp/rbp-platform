import { apiFailure, apiSuccess } from "../client";
import { invokeAppwriteFunction } from "../../../lib/appwrite/functions";

export interface MembershipCheckoutSession {
  requires_checkout?: boolean;
  checkout_url?: string | null;
  url?: string | null;
  checkout_session_id?: string | null;
  session_id?: string | null;
  status?: string;
  message?: string;
  entitlements?: unknown;
  plan_code?: string;
}

export const appwriteBillingApi = {
  async createMembershipCheckoutSession(payload: Record<string, unknown>) {
    try {
      const response = await invokeAppwriteFunction<MembershipCheckoutSession>(
        "create-membership-checkout",
        payload
      );
      return apiSuccess("appwrite/functions/create-membership-checkout", response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create a Stripe checkout session.";
      return apiFailure<MembershipCheckoutSession>("appwrite/functions/create-membership-checkout", message, [
        { field: "billing", code: "invalid", message },
      ]);
    }
  },

  getSubscriptionStatus() {
    return invokeAppwriteFunction("get-subscription-status", {});
  },

  getMyPaymentSummary() {
    return invokeAppwriteFunction("get-subscription-status", { includePayments: true });
  },

  cancelSubscription() {
    return invokeAppwriteFunction("cancel-subscription", {});
  },
};
