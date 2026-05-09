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
} from "../../services/membershipService";

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

const storageKey = "rbp.mockMembershipPurchaseOnboarding";

const flowSteps: StepperStep[] = [
  { id: "plan", label: "Plan", description: "Choose membership" },
  { id: "account", label: "Account", description: "Contact details" },
  { id: "inclusions", label: "Inclusions", description: "Confirm access" },
  { id: "extras", label: "Extras", description: "Optional add-ons" },
  { id: "payment", label: "Payment", description: "Mock only" },
  { id: "review", label: "Review", description: "Submit sign-up" },
  { id: "success", label: "Success", description: "Membership active" },
  { id: "business-details", label: "Business", description: "Core details" },
  { id: "profile", label: "Profile", description: "Business profile" },
  { id: "goals", label: "Goals", description: "Priorities" },
  { id: "services", label: "Services", description: "Interests" },
  { id: "team", label: "Team", description: "Invite team" },
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

function writeMembershipSession(payload: Record<string, unknown>) {
  window.sessionStorage.setItem(storageKey, JSON.stringify(payload));
}

function currencyLine(plan?: MockMembershipPlan) {
  return plan?.price.label ?? "Plan not selected";
}

function listValue(items: string[], fallback = "None selected") {
  return items.length > 0 ? items.join(", ") : fallback;
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

    getMockMembershipPlans().then((response) => {
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
      { label: "Plan", value: selectedPlan?.name ?? "Not selected" },
      { label: "Membership", value: currencyLine(selectedPlan) },
      { label: "Extras", value: selectedExtras.length ? `${selectedExtras.length} selected` : "Skipped" },
      {
        label: "Payment",
        value:
          paymentState === "simulated-success"
            ? "Simulated success"
            : paymentState === "simulated-failed"
              ? "Simulated failure"
              : "Mock pending",
      },
      {
        label: "Status",
        value: onboardingResult
          ? "Onboarding complete"
          : signupResult
            ? "Membership active"
            : accountCreated
              ? "Account created"
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
        nextErrors[field] = "Required for this mock flow.";
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
      const isValid = requireStepFields(["primaryContactName", "email", "businessName"]);
      if (isValid) {
        setAccountCreated(true);
      }
      return isValid;
    }

    if (currentStep.id === "inclusions") {
      const nextErrors: Record<string, string> = {};
      if (!form.inclusionConfirmed) {
        nextErrors.inclusionConfirmed = "Confirm the mock inclusions before continuing.";
      }
      if (!form.acceptedTerms) {
        nextErrors.acceptedTerms = "Accept the mock Phase 1 terms before continuing.";
      }
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    if (currentStep.id === "payment") {
      const nextErrors: Record<string, string> = {};
      if (!form.paymentMethodMock) {
        nextErrors.paymentMethodMock = "Select a mock payment method.";
      }
      if (paymentState !== "simulated-success") {
        nextErrors.paymentState = "Simulate a successful mock payment to continue.";
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
      eyebrow="Membership purchase onboarding"
      title="Remote Business Partner membership"
      description="A Phase 5 integration pilot for choosing a membership, simulating payment, completing onboarding, and handing off to the portal. In Frappe mode, membership plan and onboarding calls use rbp_app APIs."
      steps={flowSteps}
      currentStepId={currentStep.id}
      aside={
        <div className="space-y-4">
          <OrderSummaryCard title="Membership state" lines={orderLines} />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-950">Visible states</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge status={form.selectedPlanId ? "active" : "draft"} label="Plan selected" />
              <StatusBadge status={accountCreated ? "active" : "draft"} label="Account created" />
              <StatusBadge status={paymentState === "simulated-success" ? "active" : "pending"} label="Mock payment" />
              <StatusBadge status={signupResult ? "active" : "draft"} label="Membership active" />
              <StatusBadge status={onboardingResult ? "active" : signupResult ? "in-progress" : "draft"} label="Onboarding" />
              <StatusBadge status={onboardingResult ? "active" : "draft"} label="Portal access" />
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {currentStep.id === "plan" ? (
          <FormSection
            title="Select a membership plan"
            description="The Stitch reference presents a premium Remote Business Partner membership entry point with plan selection before account creation."
          >
            <div className="grid gap-4 md:grid-cols-2">
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
              <h3 className="text-sm font-semibold text-slate-900">Included in the mock plan</h3>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                {(selectedPlan?.inclusions ?? []).map((inclusion) => (
                  <li key={inclusion}>- {inclusion}</li>
                ))}
              </ul>
            </div>
          </FormSection>
        ) : null}

        {currentStep.id === "account" ? (
          <FormSection
            title="Create your mock member account"
            description="Capture the core contact and business details used through the rest of the frontend flow."
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
              label="Send me mock membership updates"
              description="Frontend-only preference for testing account creation state."
            />
          </FormSection>
        ) : null}

        {currentStep.id === "inclusions" ? (
          <FormSection
            title="Confirm membership inclusions"
            description="Review the mock inclusions before moving into optional extras and payment simulation."
          >
            <div className="grid gap-3 md:grid-cols-2">
              {(selectedPlan?.inclusions ?? []).map((inclusion) => (
                <div key={inclusion} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">
                  {inclusion}
                </div>
              ))}
            </div>
            <CheckboxField
              checked={form.inclusionConfirmed}
              onChange={(event) => updateField("inclusionConfirmed", event.currentTarget.checked)}
              label="I confirm these mock inclusions"
              description="Required to demonstrate the inclusion confirmation state."
            />
            {errors.inclusionConfirmed ? (
              <p className="text-sm font-medium text-red-600">{errors.inclusionConfirmed}</p>
            ) : null}
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
            description="Choose extras for the mock order, or continue without adding anything."
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
            title="Simulate payment details"
            description="This step intentionally demonstrates payment states without collecting or processing real payment details."
          >
            <PaymentSimulationPanel amountLabel={`${currencyLine(selectedPlan)}. No real payment will be processed.`} />
            <RadioCardGroup
              name="payment-method"
              label="Mock payment method"
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
                {paymentState === "pending" ? "Simulating..." : "Simulate payment success"}
              </button>
              <button
                type="button"
                onClick={() => simulatePayment("simulated-failed")}
                disabled={paymentState === "pending"}
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 disabled:opacity-50"
              >
                Simulate payment failure
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
              idleMessage="Mock payment is ready to simulate."
              loadingMessage="Mock payment pending..."
              successMessage="Mock payment simulated successfully. No funds were charged."
              errorMessage="Mock payment simulated failure. Try success to continue."
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
              idleMessage="Ready to submit the membership sign-up."
              loadingMessage="Submitting membership sign-up..."
              successMessage="Membership sign-up submitted."
              errorMessage="Membership sign-up failed. Review the highlighted fields."
            />
            <ReviewSubmit
              title="Review membership sign-up"
              description="Confirm the mock membership purchase details before activating the simulated membership."
              submitLabel="Submit membership sign-up"
              isSubmitting={submissionState === "loading"}
              onSubmit={submitSignup}
              sections={[
                {
                  title: "Account",
                  items: [
                    { label: "Contact", value: form.primaryContactName || "Missing" },
                    { label: "Email", value: form.email || "Missing" },
                    { label: "Business", value: form.businessName || "Missing" },
                  ],
                },
                {
                  title: "Membership",
                  items: [
                    { label: "Plan", value: selectedPlan?.name ?? "Missing" },
                    { label: "Price", value: currencyLine(selectedPlan) },
                    { label: "Extras", value: listValue(selectedExtras.map((extra) => extra.title)) },
                    { label: "Payment state", value: paymentState.replace(/-/g, " ") },
                  ],
                },
              ]}
            />
            <StepNavigation canGoBack onBack={goBack} canContinue={false} />
          </div>
        ) : null}

        {currentStep.id === "success" && signupResult ? (
          <ConfirmationPanel
            title="Membership active"
            statusLabel="Payment simulated"
            message="Your membership flow is active and onboarding can begin. In Frappe mode, an rbp_app onboarding flow has been started."
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
            title="Business onboarding details"
            description="Use the account details as a starting point and add the business identifiers needed for the mock onboarding handoff."
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
            description="Capture the profile fields used to shape the mock portal state."
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
            title="Goals and priorities"
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
              label="Biggest current business challenge"
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
            title="Managed services interests"
            description="Select areas that should be visible to the mock adviser during portal handoff."
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
            description="Capture optional team invite placeholders, then complete onboarding."
          >
            <TextAreaField
              label="Team members to invite"
              value={form.teamInvites}
              onChange={(event) => updateField("teamInvites", event.currentTarget.value)}
              placeholder="Name and email per line. This does not send real invitations."
            />
            <MockSubmissionState
              state={onboardingState}
              idleMessage="Ready to complete onboarding."
              loadingMessage="Completing onboarding..."
              successMessage="Onboarding completed."
              errorMessage="Onboarding failed. Review required fields."
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
            title="Onboarding complete"
            statusLabel="Portal access available"
            message="The membership onboarding state is complete. In Frappe mode, the onboarding flow has been submitted to rbp_app."
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

export { storageKey as membershipFlowStorageKey };
