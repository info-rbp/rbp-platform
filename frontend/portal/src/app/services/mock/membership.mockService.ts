import {
  mockMembershipPlans,
  mockMembershipTimeline,
  type MockPaymentStatus,
} from "../../mock";
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  requireFields,
} from "./mockClient";

export interface MockMembershipSignupPayload extends Record<string, unknown> {
  selectedPlanId?: string;
  businessName?: string;
  primaryContactName?: string;
  email?: string;
  acceptedTerms?: boolean;
  paymentMethodMock?: string;
}

export interface MockMembershipSignupResult {
  reference: string;
  membershipStatus: "active" | "pending";
  paymentStatus: MockPaymentStatus;
  portalHref: string;
  timeline: typeof mockMembershipTimeline;
}

export interface MockMembershipOnboardingPayload extends Record<string, unknown> {
  businessName?: string;
  industry?: string;
  businessSize?: string;
  goals?: string[];
  managedServiceInterests?: string[];
  teamInvites?: string;
}

export interface MockMembershipOnboardingResult {
  reference: string;
  onboardingStatus: "complete";
  membershipStatus: "active";
  portalHref: string;
  nextSteps: string[];
}

export function getMockMembershipPlans() {
  return mockGet(
    "/mock/membership/plans",
    mockMembershipPlans,
    "Mock membership plans returned."
  );
}

export function submitMockMembershipSignup(payload: MockMembershipSignupPayload) {
  const errors = requireFields(payload, [
    "selectedPlanId",
    "businessName",
    "primaryContactName",
    "email",
    "paymentMethodMock",
  ]);

  if (!payload.acceptedTerms) {
    errors.push({
      field: "acceptedTerms",
      code: "required",
      message: "Terms must be accepted for this mock membership submission.",
    });
  }

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockMembershipSignupResult>(
        "/mock/membership/signup",
        "Mock membership validation failed.",
        errors
      )
    );
  }

  return mockPost(
    "/mock/membership/signup",
    payload,
    () => ({
      reference: createMockReference("MEM"),
      membershipStatus: "active" as const,
      paymentStatus: "simulated-success" as const,
      portalHref: "/portal/dashboard",
      timeline: mockMembershipTimeline,
    }),
    "Mock membership sign-up submitted."
  );
}

export function submitMockMembershipOnboarding(payload: MockMembershipOnboardingPayload) {
  const errors = requireFields(payload, ["businessName", "industry", "businessSize"]);

  if (!Array.isArray(payload.goals) || payload.goals.length === 0) {
    errors.push({
      field: "goals",
      code: "required",
      message: "At least one mock business priority is required.",
    });
  }

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockMembershipOnboardingResult>(
        "/mock/membership/onboarding",
        "Mock onboarding validation failed.",
        errors
      )
    );
  }

  return mockPost(
    "/mock/membership/onboarding",
    payload,
    () => ({
      reference: createMockReference("ONB"),
      onboardingStatus: "complete" as const,
      membershipStatus: "active" as const,
      portalHref: "/portal/dashboard",
      nextSteps: [
        "Portal access available",
        "Mock adviser assignment queued",
        "First strategy session placeholder ready",
      ],
    }),
    "Mock membership onboarding completed."
  );
}
