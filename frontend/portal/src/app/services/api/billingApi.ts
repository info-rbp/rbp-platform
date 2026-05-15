import { callFrappeMethod } from "./client";
import { selectApiImplementation } from "./provider";
import {
  appwriteBillingApi,
  type MembershipCheckoutSession,
} from "./appwrite/appwriteBillingApi";

const legacyBillingApi = {
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

export const billingApi = selectApiImplementation({
  appwrite: appwriteBillingApi,
  frappe: legacyBillingApi,
});
