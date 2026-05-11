import {
  freeMembershipTimeline,
  mockMembershipPlans,
  premiumMembershipTimeline,
  type MockPaymentStatus,
} from "../../mock";
import type { MembershipTierCode } from "../../data/membershipTiers";
import {
  createMockReference,
  mockFailure,
  mockGet,
  mockPost,
  requireFields,
} from "./mockClient";

export interface MockMembershipSignupPayload extends Record<string, unknown> {
  selectedPlanId?: string;
  membershipTier?: MembershipTierCode;
  businessName?: string;
  primaryContactName?: string;
  email?: string;
  acceptedTerms?: boolean;
  paymentMethodMock?: string;
  paymentState?: string;
}

export interface MockMembershipSignupResult {
  reference: string;
  membershipStatus: "active" | "pending";
  membershipTier: MembershipTierCode;
  paymentStatus: MockPaymentStatus;
  portalHref: string;
  timeline: typeof freeMembershipTimeline;
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
    "Membership plans returned."
  );
}

function resolveMembershipTier(payload: MockMembershipSignupPayload): MembershipTierCode {
  if (payload.membershipTier === "free" || payload.selectedPlanId?.includes("free")) {
    return "free";
  }

  return "premium";
}

export function submitMockMembershipSignup(payload: MockMembershipSignupPayload) {
  const membershipTier = resolveMembershipTier(payload);
  const errors = requireFields(payload, [
    "selectedPlanId",
    "membershipTier",
    "businessName",
    "primaryContactName",
    "email",
  ]);

  if (!payload.acceptedTerms) {
    errors.push({
      field: "acceptedTerms",
      code: "required",
      message: "Membership terms must be accepted before continuing.",
    });
  }

  if (membershipTier === "premium") {
    if (!payload.paymentMethodMock) {
      errors.push({
        field: "paymentMethodMock",
        code: "required",
        message: "Payment preview method is required for Premium Membership.",
      });
    }

    if (payload.paymentState !== "simulated-success") {
      errors.push({
        field: "paymentState",
        code: "required",
        message: "Payment preview must be completed before continuing.",
      });
    }
  }

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockMembershipSignupResult>(
        "/mock/membership/signup",
        "Membership details need review.",
        errors
      )
    );
  }

  return mockPost(
    "/mock/membership/signup",
    payload,
    () => ({
      reference: createMockReference(membershipTier === "free" ? "FREE" : "MEM"),
      membershipStatus: "active" as const,
      membershipTier,
      paymentStatus: membershipTier === "free" ? "not-required" as const : "simulated-success" as const,
      portalHref: "/portal/dashboard",
      timeline: membershipTier === "free" ? freeMembershipTimeline : premiumMembershipTimeline,
    }),
    membershipTier === "free"
      ? "Free Membership activated."
      : "Premium Membership preview submitted."
  );
}

export function submitMockMembershipOnboarding(payload: MockMembershipOnboardingPayload) {
  const errors = requireFields(payload, ["businessName", "industry", "businessSize"]);

  if (!Array.isArray(payload.goals) || payload.goals.length === 0) {
    errors.push({
      field: "goals",
      code: "required",
      message: "At least one business priority is required.",
    });
  }

  if (errors.length > 0) {
    return Promise.resolve(
      mockFailure<MockMembershipOnboardingResult>(
        "/mock/membership/onboarding",
        "Onboarding details need review.",
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
        "Adviser assignment ready for review",
        "First strategy session pathway ready",
      ],
    }),
    "Membership onboarding preview completed."
  );
}
