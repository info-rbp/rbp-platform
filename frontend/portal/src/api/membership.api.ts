import {
  mockMembershipPlans,
  mockMembershipTimeline,
  type MockMembershipPlan,
} from "../app/mock";
import type {
  MockMembershipOnboardingPayload,
  MockMembershipOnboardingResult,
  MockMembershipSignupPayload,
  MockMembershipSignupResult,
} from "../app/services/mock/membership.mockService";
import { callFrappeMethod, type RbpApiResponse } from "./client";

interface FrappeMembershipPlan {
  name?: string;
  plan_code?: string;
  plan_name?: string;
  description?: string;
  billing_cycle?: string;
  amount?: number;
  currency?: string;
  included_apps?: string[] | string;
  included_capabilities?: string[] | string;
  is_public?: boolean | number;
  sort_order?: number;
}

interface FrappePlanListResponse {
  plans?: FrappeMembershipPlan[];
  count?: number;
}

interface FrappeOnboardingFlowResponse {
  name: string;
  status: string;
  current_step_key?: string;
  membership_plan?: string;
  submitted_on?: string;
}

interface FrappeMyOnboardingResponse {
  flow?: {
    name: string;
    status: string;
    current_step_key?: string;
    membership_plan?: string;
  } | null;
  steps?: Array<{
    step_key: string;
    step_label: string;
    status: string;
  }>;
}

const flowStorageKey = "rbp.frappeMembershipFlowName";
const firstBackendStepKey = "account";

function splitMaybeList(value: string[] | string | undefined): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapBackendPlan(plan: FrappeMembershipPlan, index: number): MockMembershipPlan {
  const amount = Number(plan.amount || 0);
  const currency = plan.currency || "AUD";
  const billingCycle = String(plan.billing_cycle || "monthly").toLowerCase();

  const inclusions = [
    ...splitMaybeList(plan.included_apps),
    ...splitMaybeList(plan.included_capabilities),
  ];

  return {
    id: plan.plan_code || plan.name || `backend-plan-${index + 1}`,
    name: plan.plan_name || plan.name || `Membership Plan ${index + 1}`,
    slug: plan.plan_code || plan.name || `backend-plan-${index + 1}`,
    description: plan.description || "Membership plan loaded from rbp_app.",
    price: {
      amount,
      currency,
      gstIncluded: false,
      label:
        amount > 0
          ? `${currency} ${amount} ${billingCycle === "weekly" ? "per week" : billingCycle === "annual" ? "per year" : "per month"}`
          : "Price configured in backend",
    },
    billingCycle:
      billingCycle === "weekly" || billingCycle === "annual" ? billingCycle : "monthly",
    inclusions: inclusions.length ? inclusions : ["Backend membership plan"],
    ctaHref: "/membership/sign-up-now",
    status: "available",
  };
}

function mapErrors(response: RbpApiResponse<unknown>) {
  return response.errors.length
    ? response.errors
    : [
        {
          field: "root",
          code: "frappe_request_failed",
          message: response.message || "Frappe request failed.",
        },
      ];
}

function getStoredFlowName() {
  return window.sessionStorage.getItem(flowStorageKey) || "";
}

function storeFlowName(flowName: string) {
  window.sessionStorage.setItem(flowStorageKey, flowName);
}

async function getOrStartFlow(planCode?: string) {
  const existing = await callFrappeMethod<FrappeMyOnboardingResponse>(
    "rbp_app.api.membership.get_my_onboarding"
  );

  if (existing.ok && existing.data?.flow?.name) {
    storeFlowName(existing.data.flow.name);
    return existing.data.flow;
  }

  const started = await callFrappeMethod<FrappeOnboardingFlowResponse>(
    "rbp_app.api.membership.start_onboarding",
    {
      method: "POST",
      body: {
        plan_code: planCode,
        source_channel: "phase5_frontend_membership_pilot",
      },
    }
  );

  if (!started.ok || !started.data?.name) {
    throw new Error(started.message || "Unable to start onboarding.");
  }

  storeFlowName(started.data.name);
  return started.data;
}

export async function getFrappeMembershipPlans(): Promise<RbpApiResponse<MockMembershipPlan[]>> {
  const response = await callFrappeMethod<FrappePlanListResponse>(
    "rbp_app.api.membership.list_membership_plans"
  );

  if (!response.ok) {
    return {
      ...response,
      data: mockMembershipPlans,
      message: "Frappe plan request failed. Falling back to mock membership plans.",
    };
  }

  const backendPlans = response.data?.plans || [];
  const plans = backendPlans.length
    ? backendPlans.map(mapBackendPlan)
    : mockMembershipPlans.map((plan) => ({
        ...plan,
        status: "available" as const,
      }));

  return {
    ok: true,
    data: plans,
    message: backendPlans.length
      ? "Membership plans loaded from rbp_app."
      : "No backend plans found. Using local fallback plan for integration pilot.",
    errors: [],
    meta: response.meta,
  };
}

export async function submitFrappeMembershipSignup(
  payload: MockMembershipSignupPayload
): Promise<RbpApiResponse<MockMembershipSignupResult>> {
  try {
    const flow = await getOrStartFlow(payload.selectedPlanId);

    return {
      ok: true,
      data: {
        reference: flow.name,
        membershipStatus: "active",
        paymentStatus: "simulated-success",
        portalHref: "/portal/dashboard",
        timeline: mockMembershipTimeline,
      },
      message: "Membership onboarding flow started in rbp_app.",
      errors: [],
      meta: {
        requestId: flow.name,
        timestamp: new Date().toISOString(),
        source: "frappe",
        method: "rbp_app.api.membership.start_onboarding",
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: "Unable to start membership onboarding in rbp_app.",
      errors: [
        {
          field: "root",
          code: "membership_start_failed",
          message: error instanceof Error ? error.message : "Unable to start onboarding.",
        },
      ],
      meta: {
        requestId: `membership-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: "frappe",
        method: "rbp_app.api.membership.start_onboarding",
      },
    };
  }
}

export async function submitFrappeMembershipOnboarding(
  payload: MockMembershipOnboardingPayload
): Promise<RbpApiResponse<MockMembershipOnboardingResult>> {
  const flowName = getStoredFlowName();

  try {
    const flow = flowName ? { name: flowName } : await getOrStartFlow();

    const stepResponse = await callFrappeMethod<{ name: string; step_key: string; status: string }>(
      "rbp_app.api.membership.update_onboarding_step",
      {
        method: "POST",
        body: {
          flow_name: flow.name,
          step_key: firstBackendStepKey,
          payload,
          status: "Completed",
        },
      }
    );

    if (!stepResponse.ok) {
      return {
        ok: false,
        message: stepResponse.message,
        errors: mapErrors(stepResponse),
        meta: stepResponse.meta,
      };
    }

    const submitResponse = await callFrappeMethod<FrappeOnboardingFlowResponse>(
      "rbp_app.api.membership.submit_onboarding",
      {
        method: "POST",
        body: {
          flow_name: flow.name,
        },
      }
    );

    if (!submitResponse.ok || !submitResponse.data) {
      return {
        ok: false,
        message: submitResponse.message,
        errors: mapErrors(submitResponse),
        meta: submitResponse.meta,
      };
    }

    return {
      ok: true,
      data: {
        reference: submitResponse.data.name,
        onboardingStatus: "complete",
        membershipStatus: "active",
        portalHref: "/portal/dashboard",
        nextSteps: [
          "Onboarding submitted to rbp_app",
          "Admin review can continue in Frappe",
          "Portal handoff remains available",
        ],
      },
      message: "Membership onboarding submitted to rbp_app.",
      errors: [],
      meta: submitResponse.meta,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Unable to submit membership onboarding to rbp_app.",
      errors: [
        {
          field: "root",
          code: "membership_onboarding_submit_failed",
          message:
            error instanceof Error
              ? error.message
              : "Unable to submit membership onboarding.",
        },
      ],
      meta: {
        requestId: `onboarding-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: "frappe",
        method: "rbp_app.api.membership.submit_onboarding",
      },
    };
  }
}
