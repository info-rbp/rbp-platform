import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildMembershipCheckoutPayload,
  getMembershipPaymentValidationErrors,
  redirectToCheckout,
  resolveMembershipCheckoutOutcome,
} from "../../frontend/portal/src/app/features/membership/MembershipPurchaseOnboardingFlow";

type MembershipForm = Parameters<typeof buildMembershipCheckoutPayload>[0];

function createForm(overrides: Partial<MembershipForm> = {}): MembershipForm {
  return {
    selectedPlanId: "premium-monthly",
    primaryContactName: "QA Member",
    email: "qa.member@example.com",
    phone: "+61 400 000 000",
    businessName: "QA Advisory",
    abnOrIdentifier: "12 345 678 901",
    billingAddress: "Level 2, 100 Example Street, Perth WA 6000",
    industry: "professional-services",
    businessSize: "1-5",
    businessStage: "growing",
    biggestChallenge: "Cash flow forecasting",
    triedAlready: "Manual spreadsheets",
    urgency: "high",
    teamInvites: "ops@example.com",
    paymentMethodMock: "mock-card",
    acceptedTerms: true,
    marketingConsent: true,
    inclusionConfirmed: true,
    selectedExtras: ["priority-support"],
    goals: ["Improve cash flow"],
    managedServiceInterests: ["fractional-cfo"],
    ...overrides,
  };
}

test("stripe-enabled checkout does not require a simulated payment preview", () => {
  const errors = getMembershipPaymentValidationErrors({
    enableStripeCheckout: true,
    paymentMethodMock: "",
    paymentState: "idle",
  });

  assert.deepEqual(errors, {});
});

test("membership checkout payload includes planCode and collected fields", () => {
  const payload = buildMembershipCheckoutPayload(createForm());

  assert.equal(payload.planCode, "premium-monthly");
  assert.equal(payload.plan_code, "premium-monthly");
  assert.equal(payload.selected_plan_id, "premium-monthly");
  assert.equal(payload.primary_contact_name, "QA Member");
  assert.equal(payload.business_name, "QA Advisory");
  assert.equal(payload.accepted_terms, true);
  assert.deepEqual(payload.selected_extras, ["priority-support"]);
});

test("stripe-enabled checkout resolves redirect responses and redirects to checkout_url", () => {
  const outcome = resolveMembershipCheckoutOutcome({
    response: {
      ok: true,
      data: {
        checkout_url: "https://checkout.stripe.test/session/abc123",
        checkout_session_id: "cs_test_123",
      },
    },
    form: createForm(),
  });

  assert.equal(outcome.kind, "redirect");
  assert.equal(outcome.checkoutUrl, "https://checkout.stripe.test/session/abc123");
  assert.equal(outcome.sessionId, "cs_test_123");

  let assignedUrl: string | null = null;
  redirectToCheckout(outcome.checkoutUrl, {
    assign(url: string) {
      assignedUrl = url;
    },
  });

  assert.equal(assignedUrl, "https://checkout.stripe.test/session/abc123");
});

test("stripe-enabled checkout surfaces a clear failure message", () => {
  const outcome = resolveMembershipCheckoutOutcome({
    response: {
      ok: false,
      data: null,
      message: "Stripe checkout could not be started.",
      errors: [{ field: "billing", message: "Missing planCode." }],
      meta: { requestId: "req-123" },
    },
    form: createForm(),
  });

  assert.equal(outcome.kind, "error");
  assert.equal(outcome.message, "Missing planCode. Reference: req-123.");
});

test("mock mode still requires the simulated payment fallback path", () => {
  const errors = getMembershipPaymentValidationErrors({
    enableStripeCheckout: false,
    paymentMethodMock: "",
    paymentState: "idle",
  });

  assert.equal(errors.paymentMethodMock, "Select a payment preview method.");
  assert.equal(errors.paymentState, "Preview a successful payment to continue.");
});
