import type { MockMembershipPlan } from "../../../mock";
import { apiFailure, apiSuccess } from "../client";
import { listDocuments } from "../../../lib/appwrite/databases";
import { invokeAppwriteFunction } from "../../../lib/appwrite/functions";

function formatMembershipPrice(amount: number, currency: string, billing: string) {
  if (amount <= 0) {
    return currency === "AUD" ? "AUD $0" : `${currency} $0`;
  }

  const price = currency === "AUD"
    ? `$${amount.toLocaleString("en-AU")}`
    : `${currency} $${amount.toLocaleString("en-AU")}`;
  const normalizedBilling = billing.toLowerCase();

  if (normalizedBilling === "weekly" || normalizedBilling === "week") {
    return `${price} + GST per week`;
  }

  return `${price} + GST / ${normalizedBilling}`;
}

function normalisePlan(raw: Record<string, unknown>, index: number): MockMembershipPlan {
  const id = String(raw.plan_code ?? raw.$id ?? `membership-plan-${index + 1}`);
  const amount = Number(raw.amount ?? 0);
  const currency = String(raw.currency ?? "AUD");
  const billing = String(raw.billing_cycle ?? "monthly");

  return {
    id,
    name: String(raw.plan_name ?? raw.name ?? "RBP Membership"),
    description: String(raw.description ?? "Remote Business Partner membership plan."),
    price: {
      amount,
      currency: "AUD",
      gstIncluded: amount <= 0,
      label: formatMembershipPrice(amount, currency, billing),
    },
    status: raw.active === false ? "inactive" : "active",
    highlights: Array.isArray(raw.included_entitlements) ? raw.included_entitlements.map(String) : [],
  };
}

export const appwriteMembershipApi = {
  async listMembershipPlans() {
    try {
      const response = await listDocuments<Record<string, unknown>>("membership_plans");
      return apiSuccess(
        "appwrite/membership_plans",
        (response.documents ?? []).map((item, index) => normalisePlan(item, index)),
        "Membership plans returned from Appwrite."
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load membership plans from Appwrite.";
      return apiFailure<MockMembershipPlan[]>("appwrite/membership_plans", message, [
        { field: "membership", code: "invalid", message },
      ]);
    }
  },

  startOnboarding(planCode: string) {
    return invokeAppwriteFunction("bootstrap-tenant", { planCode, sourceChannel: "portal" });
  },

  getMyOnboarding() {
    return invokeAppwriteFunction("get-subscription-status", {});
  },

  updateOnboardingStep(flowName: string, stepKey: string, payload: Record<string, unknown>) {
    return invokeAppwriteFunction("bootstrap-tenant", { flowName, stepKey, payload, status: "completed" });
  },

  submitOnboarding(flowName: string) {
    return invokeAppwriteFunction("bootstrap-tenant", { flowName, submit: true });
  },
};
