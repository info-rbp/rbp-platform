import type { MockMembershipPlan } from "../../mock";
import { apiFailure, apiSuccess, callFrappeMethod } from "./client";

function normalisePlan(raw: Record<string, unknown>, index: number): MockMembershipPlan {
  const id = String(raw.plan_code ?? raw.name ?? raw.id ?? `membership-plan-${index + 1}`);
  const name = String(raw.plan_name ?? raw.name ?? raw.title ?? "RBP Membership");
  const price = raw.price ?? raw.amount ?? raw.monthly_price ?? 0;
  const currency = String(raw.currency ?? "AUD");
  const billing = String(raw.billing_cycle ?? "Monthly");

  return {
    id,
    name,
    description: String(raw.description ?? "Remote Business Partner membership plan."),
    price: {
      amount: typeof price === "number" ? price : Number(price) || 0,
      currency,
      label: typeof price === "number" || Number(price)
        ? `${currency} $${Number(price).toLocaleString("en-AU")} / ${billing.toLowerCase()}`
        : String(raw.price_label ?? "Pricing available through RBP"),
    },
    status: raw.active === false ? "inactive" : "active",
    highlights: Array.isArray(raw.highlights) ? raw.highlights.map(String) : [],
  };
}

export const membershipApi = {
  async listMembershipPlans() {
    const response = await callFrappeMethod<unknown[] | { plans?: unknown[] }>(
      "rbp_app.api.membership.list_membership_plans",
      {},
      { method: "GET" }
    );

    if (!response.ok || !response.data) {
      return apiFailure<MockMembershipPlan[]>(
        "/api/method/rbp_app.api.membership.list_membership_plans",
        response.message,
        response.errors
      );
    }

    const rawPlans = Array.isArray(response.data)
      ? response.data
      : Array.isArray((response.data as { plans?: unknown[] }).plans)
        ? (response.data as { plans: unknown[] }).plans
        : [];

    return apiSuccess(
      "/api/method/rbp_app.api.membership.list_membership_plans",
      rawPlans.map((item, index) => normalisePlan(item as Record<string, unknown>, index)),
      "Membership plans returned from backend."
    );
  },

  startOnboarding(planCode: string) {
    return callFrappeMethod("rbp_app.api.membership.start_onboarding", {
      plan_code: planCode,
      source_channel: "portal",
    });
  },

  getMyOnboarding() {
    return callFrappeMethod("rbp_app.api.membership.get_my_onboarding", {}, { method: "GET" });
  },

  updateOnboardingStep(flowName: string, stepKey: string, payload: Record<string, unknown>) {
    return callFrappeMethod("rbp_app.api.membership.update_onboarding_step", {
      flow_name: flowName,
      step_key: stepKey,
      payload,
      status: "Completed",
    });
  },

  submitOnboarding(flowName: string) {
    return callFrappeMethod("rbp_app.api.membership.submit_onboarding", {
      flow_name: flowName,
    });
  },
};
