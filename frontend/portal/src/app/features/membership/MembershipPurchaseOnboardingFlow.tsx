import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import {
  ConfirmationPanel,
  MockSubmissionState,
  ReviewSubmit,
  StepNavigation,
  WizardShell,
  type StepperStep,
} from "../../components/flow";
import {
  CheckboxField,
  FormSection,
  RadioCardGroup,
  SelectableCardGrid,
  SelectField,
  TermsAcceptance,
  TextAreaField,
  TextField,
} from "../../components/forms";
import {
  OrderSummaryCard,
  PaymentSimulationPanel,
  PlanSelectionCard,
} from "../../components/domain";
import { StatusBadge } from "../../components/status";
import {
  premiumMembershipInclusions,
  premiumMembershipPlan,
  premiumMembershipRoutes,
} from "../../data/premiumMembership";
import {
  mockMembershipExtras,
  mockMembershipGoalOptions,
  mockMembershipManagedServiceOptions,
  mockPaymentMethods,
  type MockMembershipPlan,
} from "../../mock";
import {
  getMockMembershipPlans,
  submitMockMembershipOnboarding,
  submitMockMembershipSignup,
  type MockMembershipOnboardingResult,
  type MockMembershipSignupResult,
} from "../../services/mock/membership.mockService";
import { billingApi, membershipApi } from "../../services/api";

type PaymentState = "idle" | "pending" | "simulated-success" | "simulated-failed";
type SubmissionState = "idle" | "loading" | "success" | "error";

interface MembershipFlowForm {
  selectedPlanId: string;
  primaryContactName: string;
  email: string;
  phone: string;
  businessName: string;
  abnOrIdentifier: string;
  billingAddress: string;
  industry: string;
  businessSize: string;
  businessStage: string;
  biggestChallenge: string;
  triedAlready: string;
  urgency: string;
  teamInvites: string;
  paymentMethodMock: string;
  acceptedTerms: boolean;
  marketingConsent: boolean;
  inclusionConfirmed: boolean;
  selectedExtras: string[];
  goals: string[];
  managedServiceInterests: string[];
}

export const membershipFlowStorageKey = "rbp.mockMembershipPurchaseOnboarding";

const flowSteps: StepperStep[] = [
  { id: "plan", label: "Plan", description: "Confirm membership" },
  { id: "account", label: "Account", description: "Member details" },
  { id: "inclusions", label: "Inclusions", description: "Review access" },
  { id: "extras", label: "Extras", description: "Optional extras" },
  { id: "payment", label: "Payment", description: "Payment preview" },
  { id: "review", label: "Review", description: "Review details" },
  { id: "success", label: "Success", description: "Preview confirmed" },
  { id: "business-details", label: "Business", description: "Business details" },
  { id: "profile", label: "Profile", description: "Business profile" },
  { id: "goals", label: "Goals", description: "Priorities" },
  { id: "services", label: "Services", description: "Interests" },
  { id: "team", label: "Team", description: "Team setup" },
  { id: "complete", label: "Complete", description: "Portal handoff" },
];

const initialForm: MembershipFlowForm = {
  selectedPlanId: "",
  primaryContactName: "",
  email: "",
  phone: "",
  businessName: "",
  abnOrIdentifier: "",
  billingAddress: "",
  industry: "",
  businessSize: "",
  businessStage: "",
  biggestChallenge: "",
  triedAlready: "",
  urgency: "medium",
  teamInvites: "",
  paymentMethodMock: "mock-card",
  acceptedTerms: false,
  marketingConsent: false,
  inclusionConfirmed: false,
  selectedExtras: [],
  goals: [],
  managedServiceInterests: [],
};

const inclusionConfirmationGroups = [
  {
    title: "Core",
    items: premiumMembershipInclusions.find((group) => group.category === "Core")?.items ?? [],
  },
  {
    title: "Nucleus",
    items: premiumMembershipInclusions.find((group) => group.category === "Nucleus")?.items ?? [],
  },
  {
    title: "Services",
    items: premiumMembershipInclusions.find((group) => group.category === "Services")?.items ?? [],
  },
  {
    title: "Member Benefits",
    items: [
      ...(premiumMembershipInclusions.find((group) => group.category === "Marketplace")?.items ?? []),
      ...(premiumMembershipInclusions.find((group) => group.category === "Offers")?.items ?? []),
      ...(premiumMembershipInclusions.find((group) => group.category === "Operations")?.items ?? []),
      ...(premiumMembershipInclusions.find((group) => group.category === "Other")?.items ?? []),
    ],
  },
] as const;

function writeMembershipSession(payload: Record<string, unknown>) {
  window.sessionStorage.setItem(membershipFlowStorageKey, JSON.stringify(payload));
}

function currencyLine(plan?: MockMembershipPlan) {
  return plan?.price.label ?? "Plan not selected";
}

function listValue(items: string[], fallback = "None selected") {
  return items.length > 0 ? items.join(", ") : fallback;
}

function paymentStateLabel(state: PaymentState) {
  if (state === "simulated-success") {
    return "Payment preview complete";
  }

  if (state === "simulated-failed") {
    return "Payment preview failed";
  }

  if (state === "pending") {
    return "Payment preview pending";
  }

  return "Not started";
}

export function MembershipPurchaseOnboardingFlow() {
  const [plans, setPlans] = useState<MockMembershipPlan[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [form, setForm] = useState<MembershipFlowForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [accountCreated, setAccountCreated] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [onboardingState, setOnboardingState] = useState<SubmissionState>("idle");
  const [signupResult, setSignupResult] = useState<MockMembershipSignupResult | null>(null);
  const [onboardingResult, setOnboardingResult] =
    useState<MockMembershipOnboardingResult | null>(null);

  useEffect(() => {
    let mounted = true;

    membershipApi.listMembershipPlans().then(async (response) => {
      if (!response.ok || !response.data || response.data.length === 0) {
        response = await getMockMembershipPlans();
      }

      if (!mounted || !response.data) {
        return;
      }

      const membershipPlans = response.data;

      setPlans(membershipPlans);
      setForm((current) => ({
        ...current,
        selectedPlanId: current.selectedPlanId || membershipPlans[0]?.id || "",
      }));
    });

    return () => {
      mounted = false;
    };
  }, []);

  const currentStep = flowSteps[currentStepIndex] ?? flowSteps[0];
  const selectedPlan = plans.find((plan) => plan.id === form.selectedPlanId);
  const selectedExtras = mockMembershipExtras.filter((extra) =>
    form.selectedExtras.includes(extra.id)
  );

  const orderLines = useMemo(
    () => [
      { label: "Plan", value: selectedPlan?.name ?? premiumMembershipPlan.name },
      { label: "Membership", value: currencyLine(selectedPlan) },
      {
        label: "Extras",
        value: selectedExtras.length ? `${selectedExtras.length} selected` : "No extras selected",
      },
      { label: "Payment", value: paymentStateLabel(paymentState) },
      {
        label: "Status",
        value: onboardingResult
          ? "Onboarding complete"
          : signupResult
            ? "Preview confirmed"
            : accountCreated
              ? "Details captured"
              : "Draft",
      },
    ],
    [accountCreated, onboardingResult, paymentState, selectedExtras.length, selectedPlan, signupResult]
  );

  function updateField<K extends keyof MembershipFlowForm>(
    field: K,
    value: MembershipFlowForm[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function toggleListField(
    field: "selectedExtras" | "goals" | "managedServiceInterests",
    value: string
  ) {
    const currentValues = form[field];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    updateField(field, nextValues);
  }

  function requireStepFields(fields: Array<keyof MembershipFlowForm>) {
    const nextErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = form[field];
      const missing = Array.isArray(value) ? value.length === 0 : !value;

      if (missing) {
        nextErrors[field] = "Required to continue.";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateCurrentStep() {
    if (currentStep.id === "plan") {
      return requireStepFields(["selectedPlanId"]);
    }

    if (currentStep.id === "account") {
      const isValid = requireStepFields([
        "primaryContactName",
        "email",
        "phone",
        "businessName",
      ]);
      if (isValid) {
        setAccountCreated(true);
      }
      return isValid;
    }

    if (currentStep.id === "inclusions") {
      const nextErrors: Record<string, string> = {};
      if (!form.inclusionConfirmed) {
        nextErrors.inclusionConfirmed = "Confirm the membership inclusions before continuing.";
      }
      if (!form.acceptedTerms) {
        nextErrors.acceptedTerms = "Accept the membership terms before continuing.";
      }
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    if (currentStep.id === "payment") {
      const nextErrors: Record<string, string> = {};
      if (!form.paymentMethodMock) {
        nextErrors.paymentMethodMock = "Select a payment preview method.";
      }
      if (paymentState !== "simulated-success") {
        nextErrors.paymentState = "Preview a successful payment to continue.";
      }
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    if (currentStep.id === "business-details") {
      return requireStepFields(["businessName", "abnOrIdentifier", "billingAddress"]);
    }

    if (currentStep.id === "profile") {
      return requireStepFields(["industry", "businessSize", "businessStage"]);
    }

    if (currentStep.id === "goals") {
      return requireStepFields(["goals", "biggestChallenge", "urgency"]);
    }

    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) {
      return;
    }

    setCurrentStepIndex((index) => Math.min(index + 1, flowSteps.length - 1));
  }

  function goBack() {
    setErrors({});
    setCurrentStepIndex((index) => Math.max(index - 1, 0));
  }

  function simulatePayment(nextState: Exclude<PaymentState, "idle" | "pending">) {
    setPaymentState("pending");
    setErrors((current) => {
      const next = { ...current };
      delete next.paymentState;
      return next;
    });

    window.setTimeout(() => {
      setPaymentState(nextState);
    }, 600);
  }

  async function submitSignup() {
    setSubmissionState("loading");
    setErrors({});

    const checkoutResponse = await billingApi.createMembershipCheckoutSession({
      plan_code: form.selectedPlanId,
      selected_plan_id: form.selectedPlanId,
      primary_contact_name: form.primaryContactName,
      email: form.email,
      phone: form.phone,
      business_name: form.businessName,
      abn_or_identifier: form.abnOrIdentifier,
      billing_address: form.billingAddress,
      accepted_terms: form.acceptedTerms,
      marketing_consent: form.marketingConsent,
      selected_extras: form.selectedExtras,
    });

    const checkoutUrl = checkoutResponse.data?.checkout_url ?? checkoutResponse.data?.url;

    if (checkoutResponse.ok && checkoutUrl) {
      writeMembershipSession({
        checkoutSessionId: checkoutResponse.data?.checkout_session_id ?? checkoutResponse.data?.session_id,
        membershipStatus: "pending",
        paymentStatus: "stripe-checkout-started",
        onboardingStatus: "pending-payment",
        businessName: form.businessName,
        primaryContactName: form.primaryContactName,
        selectedPlan: selectedPlan?.name,
      });
      window.location.assign(checkoutUrl);
      return;
    }

    const response = await submitMockMembershipSignup({
      selectedPlanId: form.selectedPlanId,
      businessName: form.businessName,
      primaryContactName: form.primaryContactName,
      email: form.email,
      acceptedTerms: form.acceptedTerms,
      paymentMethodMock: form.paymentMethodMock,
      selectedExtras: form.selectedExtras,
      paymentState,
    });

    if (!response.ok || !response.data) {
      setSubmissionState("error");
      setErrors(
        Object.fromEntries(response.errors.map((error) => [error.field, error.message]))
      );
      return;
    }

    setSignupResult(response.data);
    setSubmissionState("success");
    writeMembershipSession({
      signupReference: response.data.reference,
      membershipStatus: response.data.membershipStatus,
      paymentStatus: response.data.paymentStatus,
      onboardingStatus: "in-progress",
      portalHref: response.data.portalHref,
      businessName: form.businessName,
      primaryContactName: form.primaryContactName,
      selectedPlan: selectedPlan?.name,
    });
    setCurrentStepIndex(flowSteps.findIndex((step) => step.id === "success"));
  }

  async function submitOnboarding() {
    setOnboardingState("loading");
    setErrors({});

    const response = await submitMockMembershipOnboarding({
      businessName: form.businessName,
      industry: form.industry,
      businessSize: form.businessSize,
      goals: form.goals,
      managedServiceInterests: form.managedServiceInterests,
      teamInvites: form.teamInvites,
    });

    if (!response.ok || !response.data) {
      setOnboardingState("error");
      setErrors(
        Object.fromEntries(response.errors.map((error) => [error.field, error.message]))
      );
      return;
    }

    setOnboardingResult(response.data);
    setOnboardingState("success");
    writeMembershipSession({
      signupReference: signupResult?.reference,
      onboardingReference: response.data.reference,
      membershipStatus: response.data.membershipStatus,
      paymentStatus: "simulated-success",
      onboardingStatus: response.data.onboardingStatus,
      portalHref: response.data.portalHref,
      businessName: form.businessName,
      primaryContactName: form.primaryContactName,
      selectedPlan: selectedPlan?.name,
      goals: form.goals,
      managedServiceInterests: form.managedServiceInterests,
    });
    setCurrentStepIndex(flowSteps.findIndex((step) => step.id === "complete"));
  }

  const canUseDefaultNavigation = !["review", "success", "team", "complete"].includes(
    currentStep.id
  );

  return (
    <WizardShell
      eyebrow="RBP Premium Membership Sign-Up"
      title="Start Your Premium Membership"
      description="Complete your membership details, confirm your inclusions, and continue to secure Stripe checkout when the backend checkout endpoint is available."
      steps={flowSteps}
      currentStepId={currentStep.id}
      aside={
        <div className="space-y-4">
          <OrderSummaryCard title="Membership summary" lines={orderLines} />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-950">Visible states</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge status={form.selectedPlanId ? "active" : "draft"} label="Plan selected" />
              <StatusBadge status={accountCreated ? "active" : "draft"} label="Member details" />
              <StatusBadge
                status={paymentState === "simulated-success" ? "active" : "pending"}
                label="Payment preview"
              />
              <StatusBadge status={signupResult ? "active" : "draft"} label="Preview confirmed" />
              <StatusBadge
                status={onboardingResult ? "active" : signupResult ? "in-progress" : "draft"}
                label="Onboarding"
              />
              <StatusBadge status={onboardingResult ? "active" : "draft"} label="Portal handoff" />
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {currentStep.id === "plan" ? (
          <FormSection
            title="Confirm your premium membership"
            description="Review the early bird RBP Premium Membership offer before adding your details."
          >
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              <span className="font-semibold">Early bird:</span> {premiumMembershipPlan.earlyBirdPrice}
              <span className="mx-2 text-blue-300">|</span>
              <span className="font-semibold">Normally:</span> {premiumMembershipPlan.standardPrice}
            </div>
            <div className="grid gap-4 md:grid-cols-1">
              {plans.map((plan) => (
                <PlanSelectionCard
                  key={plan.id}
                  title={plan.name}
                  description={plan.description}
                  priceLabel={plan.price.label}
                  selected={form.selectedPlanId === plan.id}
                  onSelect={() => updateField("selectedPlanId", plan.id)}
                />
              ))}
            </div>
            {errors.selectedPlanId ? (
              <p className="text-sm font-medium text-red-600">{errors.selectedPlanId}</p>
            ) : null}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Included in your premium membership</h3>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                {premiumMembershipPlan.planHighlights.map((inclusion) => (
                  <li key={inclusion}>- {inclusion}</li>
                ))}
              </ul>
            </div>
          </FormSection>
        ) : null}

        {currentStep.id === "account" ? (
          <FormSection
            title="Create your member profile"
            description="Capture the core contact and business details used for your membership sign-up preview."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Primary contact name"
                value={form.primaryContactName}
                onChange={(event) => updateField("primaryContactName", event.currentTarget.value)}
                error={errors.primaryContactName}
                placeholder="James Anderson"
              />
              <TextField
                label="Email address"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.currentTarget.value)}
                error={errors.email}
                placeholder="james@example.com.au"
              />
              <TextField
                label="Phone number"
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.currentTarget.value)}
                error={errors.phone}
                placeholder="+61 400 000 000"
              />
              <TextField
                label="Business name"
                value={form.businessName}
                onChange={(event) => updateField("businessName", event.currentTarget.value)}
                error={errors.businessName}
                placeholder="Anderson Advisory Pty Ltd"
              />
            </div>
            <CheckboxField
              checked={form.marketingConsent}
              onChange={(event) => updateField("marketingConsent", event.currentTarget.checked)}
              label="Send me membership updates"
              description="You can opt in to receive updates about membership, platform resources, and offers."
            />
          </FormSection>
        ) : null}

        {currentStep.id === "inclusions" ? (
          <FormSection
            title="Confirm your premium membership inclusions"
            description="Review your premium membership access before continuing."
          >
            <div className="grid gap-4 xl:grid-cols-2">
              {inclusionConfirmationGroups.map((group) => (
                <section
                  key={group.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-base font-bold text-slate-950">{group.title}</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    {group.items.map((item) => (
                      <li key={`${group.title}-${item.name}`} className="flex justify-between gap-4">
                        <span>{item.name}</span>
                        <span className="font-semibold text-slate-900">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <CheckboxField
              checked={form.inclusionConfirmed}
              onChange={(event) => updateField("inclusionConfirmed", event.currentTarget.checked)}
              label="I understand the RBP Premium Membership inclusions and terms."
              description="Required before continuing with your membership sign-up preview."
            />
            {errors.inclusionConfirmed ? (
              <p className="text-sm font-medium text-red-600">{errors.inclusionConfirmed}</p>
            ) : null}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm">
              <span className="text-slate-600">Need the detail behind eligibility, credits, and fair use?</span>
              <Link
                to={premiumMembershipRoutes.terms}
                className="font-bold text-blue-700 hover:text-blue-800 hover:underline"
              >
                View Membership Terms
              </Link>
            </div>
            <TermsAcceptance
              checked={form.acceptedTerms}
              onChange={(checked) => updateField("acceptedTerms", checked)}
            />
            {errors.acceptedTerms ? (
              <p className="text-sm font-medium text-red-600">{errors.acceptedTerms}</p>
            ) : null}
          </FormSection>
        ) : null}

        {currentStep.id === "extras" ? (
          <FormSection
            title="Select optional extras"
            description="Choose optional extras for your membership setup, or continue without adding anything."
          >
            <div className="grid gap-4 md:grid-cols-3">
              {mockMembershipExtras.map((extra) => {
                const selected = form.selectedExtras.includes(extra.id);

                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() => toggleListField("selectedExtras", extra.id)}
                    className={[
                      "rounded-2xl border p-5 text-left transition",
                      selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-300",
                    ].join(" ")}
                  >
                    <span className="block text-base font-semibold text-slate-950">{extra.title}</span>
                    <span className="mt-2 block text-sm leading-6 text-slate-600">{extra.description}</span>
                    <span className="mt-4 block text-sm font-semibold text-blue-700">{extra.priceLabel}</span>
                  </button>
                );
              })}
            </div>
          </FormSection>
        ) : null}

        {currentStep.id === "payment" ? (
          <FormSection
            title="Payment Preview"
            description="Review the early bird membership price. The final review step will request a Stripe checkout session from the backend when available."
          >
            <PaymentSimulationPanel
              title="Payment Preview"
              amountLabel={`RBP Premium Membership: ${currencyLine(selectedPlan)}. No real payment will be processed.`}
            />
            <RadioCardGroup
              name="payment-method"
              label="Payment preview method"
              value={form.paymentMethodMock}
              onChange={(value) => updateField("paymentMethodMock", value)}
              options={mockPaymentMethods.map((method) => ({
                label: method.label,
                value: method.id,
                description: method.description,
              }))}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => simulatePayment("simulated-success")}
                disabled={paymentState === "pending"}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {paymentState === "pending" ? "Previewing..." : "Preview Payment Success"}
              </button>
              <button
                type="button"
                onClick={() => simulatePayment("simulated-failed")}
                disabled={paymentState === "pending"}
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 disabled:opacity-50"
              >
                Preview Payment Failure
              </button>
            </div>
            <MockSubmissionState
              state={
                paymentState === "pending"
                  ? "loading"
                  : paymentState === "simulated-success"
                    ? "success"
                    : paymentState === "simulated-failed"
                      ? "error"
                      : "idle"
              }
              idleMessage="Payment preview is ready."
              loadingMessage="Payment preview pending..."
              successMessage="Payment preview completed. No funds were charged."
              errorMessage="Payment preview failed. Preview a successful payment to continue."
            />
            {errors.paymentState ? (
              <p className="text-sm font-medium text-red-600">{errors.paymentState}</p>
            ) : null}
          </FormSection>
        ) : null}

        {currentStep.id === "review" ? (
          <div className="space-y-4">
            <MockSubmissionState
              state={submissionState}
              idleMessage="Ready to confirm the membership preview."
              loadingMessage="Confirming membership preview..."
              successMessage="Membership preview confirmed."
              errorMessage="Membership preview could not be confirmed. Review the highlighted fields."
            />
            <ReviewSubmit
              title="Review Your Premium Membership Details"
              description="Confirm your membership details before completing the preview."
              submitLabel="Confirm Membership Preview"
              isSubmitting={submissionState === "loading"}
              onSubmit={submitSignup}
              sections={[
                {
                  title: "Member details",
                  items: [
                    { label: "Primary contact", value: form.primaryContactName || "Missing" },
                    { label: "Email", value: form.email || "Missing" },
                    { label: "Phone", value: form.phone || "Missing" },
                    { label: "Business", value: form.businessName || "Missing" },
                  ],
                },
                {
                  title: "Membership",
                  items: [
                    { label: "Plan", value: selectedPlan?.name ?? premiumMembershipPlan.name },
                    { label: "Price", value: currencyLine(selectedPlan) },
                    { label: "Extras", value: listValue(selectedExtras.map((extra) => extra.title)) },
                    { label: "Payment", value: paymentStateLabel(paymentState) },
                  ],
                },
              ]}
            />
            <StepNavigation canGoBack onBack={goBack} canContinue={false} />
          </div>
        ) : null}

        {currentStep.id === "success" && signupResult ? (
          <ConfirmationPanel
            title="RBP Premium Membership Preview Confirmed"
            statusLabel="Payment preview complete"
            message="Your premium membership preview has been completed. Continue to onboarding or review your confirmation details."
            reference={signupResult.reference}
            primaryAction={
              <button
                type="button"
                onClick={goNext}
                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
              >
                Continue to onboarding
              </button>
            }
            secondaryAction={
              <Link
                to="/membership/confirmation"
                className="rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700"
              >
                View confirmation
              </Link>
            }
          />
        ) : null}

        {currentStep.id === "business-details" ? (
          <FormSection
            title="Business details"
            description="Add the business identifiers needed to prepare your member portal profile."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Business name"
                value={form.businessName}
                onChange={(event) => updateField("businessName", event.currentTarget.value)}
                error={errors.businessName}
              />
              <TextField
                label="ABN or business identifier"
                value={form.abnOrIdentifier}
                onChange={(event) => updateField("abnOrIdentifier", event.currentTarget.value)}
                error={errors.abnOrIdentifier}
                placeholder="12 345 678 901"
              />
            </div>
            <TextAreaField
              label="Billing address"
              value={form.billingAddress}
              onChange={(event) => updateField("billingAddress", event.currentTarget.value)}
              error={errors.billingAddress}
              placeholder="Level 2, 100 Example Street, Perth WA 6000"
            />
          </FormSection>
        ) : null}

        {currentStep.id === "profile" ? (
          <FormSection
            title="Business profile"
            description="Capture the business profile used to shape the onboarding handoff."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Industry"
                value={form.industry}
                onChange={(event) => updateField("industry", event.currentTarget.value)}
                error={errors.industry}
                options={[
                  { label: "Professional services", value: "professional-services" },
                  { label: "Construction and trades", value: "construction-trades" },
                  { label: "Retail and ecommerce", value: "retail-ecommerce" },
                  { label: "Health and care", value: "health-care" },
                  { label: "Other", value: "other" },
                ]}
              />
              <SelectField
                label="Business size"
                value={form.businessSize}
                onChange={(event) => updateField("businessSize", event.currentTarget.value)}
                error={errors.businessSize}
                options={[
                  { label: "1-5 people", value: "1-5" },
                  { label: "6-20 people", value: "6-20" },
                  { label: "21-50 people", value: "21-50" },
                  { label: "51+ people", value: "51-plus" },
                ]}
              />
            </div>
            <RadioCardGroup
              name="business-stage"
              label="Business stage"
              value={form.businessStage}
              onChange={(value) => updateField("businessStage", value)}
              options={[
                { label: "Stabilising", value: "stabilising", description: "Getting control of operations and cash flow." },
                { label: "Growing", value: "growing", description: "Building repeatable sales, people, and delivery systems." },
                { label: "Scaling", value: "scaling", description: "Adding structure, reporting, and management capacity." },
                { label: "Transitioning", value: "transitioning", description: "Preparing for finance, sale, succession, or change." },
              ]}
            />
            {errors.businessStage ? (
              <p className="text-sm font-medium text-red-600">{errors.businessStage}</p>
            ) : null}
          </FormSection>
        ) : null}

        {currentStep.id === "goals" ? (
          <FormSection
            title="Priorities"
            description="Select the first areas where the member wants support."
          >
            <div className="grid gap-3 md:grid-cols-3">
              {mockMembershipGoalOptions.map((goal) => {
                const selected = form.goals.includes(goal);

                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleListField("goals", goal)}
                    className={[
                      "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-800"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300",
                    ].join(" ")}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
            {errors.goals ? <p className="text-sm font-medium text-red-600">{errors.goals}</p> : null}
            <TextAreaField
              label="Biggest challenge"
              value={form.biggestChallenge}
              onChange={(event) => updateField("biggestChallenge", event.currentTarget.value)}
              error={errors.biggestChallenge}
              placeholder="Describe the primary obstacle your business is facing..."
            />
            <TextAreaField
              label="What have you already tried?"
              value={form.triedAlready}
              onChange={(event) => updateField("triedAlready", event.currentTarget.value)}
              placeholder="List any solutions or strategies already attempted..."
            />
            <RadioCardGroup
              name="urgency"
              label="Priority urgency"
              value={form.urgency}
              onChange={(value) => updateField("urgency", value)}
              options={[
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
                { label: "Urgent", value: "urgent" },
              ]}
            />
          </FormSection>
        ) : null}

        {currentStep.id === "services" ? (
          <FormSection
            title="Service interests"
            description="Select the service areas your business may want support with after joining."
          >
            <SelectableCardGrid
              selectedId=""
              onSelect={(id) => toggleListField("managedServiceInterests", id)}
              options={mockMembershipManagedServiceOptions.map((option) => ({
                id: option.id,
                title: option.title,
                description: option.description,
                meta: form.managedServiceInterests.includes(option.id) ? (
                  <span className="text-sm font-semibold text-blue-700">Selected</span>
                ) : (
                  <span className="text-sm font-semibold text-slate-400">Optional</span>
                ),
              }))}
            />
          </FormSection>
        ) : null}

        {currentStep.id === "team" ? (
          <FormSection
            title="Team setup"
            description="Add optional team members for your membership account setup."
          >
            <TextAreaField
              label="Team invites"
              value={form.teamInvites}
              onChange={(event) => updateField("teamInvites", event.currentTarget.value)}
              placeholder="Name and email per line. This preview does not send real invitations."
            />
            <MockSubmissionState
              state={onboardingState}
              idleMessage="Ready to complete onboarding."
              loadingMessage="Completing onboarding..."
              successMessage="Onboarding completed."
              errorMessage="Onboarding could not be completed. Review the required fields."
            />
            <StepNavigation
              canGoBack
              backLabel="Back"
              continueLabel="Complete onboarding"
              canContinue={onboardingState !== "loading"}
              onBack={goBack}
              onContinue={submitOnboarding}
            />
          </FormSection>
        ) : null}

        {currentStep.id === "complete" && onboardingResult ? (
          <ConfirmationPanel
            title="Membership onboarding preview complete"
            statusLabel="Portal handoff ready"
            message="Your RBP Premium Membership preview and onboarding details have been completed. Continue to the member portal dashboard."
            reference={onboardingResult.reference}
            primaryAction={
              <Link
                to={onboardingResult.portalHref}
                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
              >
                Go to portal dashboard
              </Link>
            }
            secondaryAction={
              <Link
                to="/membership/confirmation"
                className="rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700"
              >
                View confirmation
              </Link>
            }
          />
        ) : null}

        {canUseDefaultNavigation ? (
          <StepNavigation
            canGoBack={currentStepIndex > 0}
            onBack={goBack}
            onContinue={goNext}
            continueLabel={currentStep.id === "payment" ? "Continue to review" : "Continue"}
          />
        ) : null}
      </div>
    </WizardShell>
  );
}
