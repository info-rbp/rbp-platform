import { apiFailure, apiSuccess } from "../client";
import { invokeAppwriteFunction } from "../../../lib/appwrite/functions";

export interface MembershipCheckoutSession {
  checkout_url?: string;
  url?: string;
  checkout_session_id?: string;
  session_id?: string;
  status?: string;
  message?: string;
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
