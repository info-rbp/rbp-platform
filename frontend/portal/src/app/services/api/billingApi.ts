import { callFrappeMethod } from "./client";

export interface MembershipCheckoutSession {
  checkout_url?: string;
  url?: string;
  checkout_session_id?: string;
  session_id?: string;
  status?: string;
  message?: string;
}

export const billingApi = {
  createMembershipCheckoutSession(payload: Record<string, unknown>) {
    return callFrappeMethod<MembershipCheckoutSession>(
      "rbp_app.api.billing.create_membership_checkout_session",
      payload
    );
  },

  getSubscriptionStatus() {
    return callFrappeMethod("rbp_app.api.billing.get_subscription_status", {}, { method: "GET" });
  },

  getMyPaymentSummary() {
    return callFrappeMethod("rbp_app.api.billing.get_my_payment_summary", {}, { method: "GET" });
  },

  cancelSubscription() {
    return callFrappeMethod("rbp_app.api.billing.cancel_subscription", {});
  },
};