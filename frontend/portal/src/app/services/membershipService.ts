import {
  getMockMembershipPlans as getLocalMockMembershipPlans,
  submitMockMembershipOnboarding as submitLocalMockMembershipOnboarding,
  submitMockMembershipSignup as submitLocalMockMembershipSignup,
  type MockMembershipOnboardingPayload,
  type MockMembershipOnboardingResult,
  type MockMembershipSignupPayload,
  type MockMembershipSignupResult,
} from "./mock/membership.mockService";
import {
  getFrappeMembershipPlans,
  submitFrappeMembershipOnboarding,
  submitFrappeMembershipSignup,
} from "../../api/membership.api";

export type {
  MockMembershipOnboardingPayload,
  MockMembershipOnboardingResult,
  MockMembershipSignupPayload,
  MockMembershipSignupResult,
};

const apiMode = import.meta.env.VITE_RBP_API_MODE || "mock";

export function isFrappeMembershipMode() {
  return apiMode === "frappe";
}

export const getMockMembershipPlans = isFrappeMembershipMode()
  ? getFrappeMembershipPlans
  : getLocalMockMembershipPlans;

export const submitMockMembershipSignup = isFrappeMembershipMode()
  ? submitFrappeMembershipSignup
  : submitLocalMockMembershipSignup;

export const submitMockMembershipOnboarding = isFrappeMembershipMode()
  ? submitFrappeMembershipOnboarding
  : submitLocalMockMembershipOnboarding;
