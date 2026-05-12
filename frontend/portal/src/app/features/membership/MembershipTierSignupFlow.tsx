import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

import { ConfirmationPanel, StepNavigation, WizardShell, type StepperStep } from "../../components/flow";
import { StatusBadge } from "../../components/status";
import { isMockMembershipConfirmationEnabled } from "../../config/runtime";
import { membershipTierByCode, type MembershipTierCode } from "../../data/membershipTiers";
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
import { membershipFlowStorageKey } from "../../services/membershipConfirmationService";

type PaymentState = "idle" | "pending" | "simulated-success" | "simulated-failed";
type SubmissionState = "idle" | "loading" | "success" | "error";

interface MembershipFlowForm {
  selectedPlanId: string;
  primaryContactName: string;
  email: string;
  phone: string;
  businessName: string;
  acceptedTerms: boolean;
  inclusionConfirmed: boolean;
  paymentMethodMock: string;
  selectedExtras: string[];
  industry: string;
  businessSize: string;
  businessStage: string;
  biggestChallenge: string;
  urgency: string;
  goals: string[];
  managedServiceInterests: string[];
  teamInvites: string;
}

const steps: StepperStep[] = [
  { id: "plan", label: "Plan", description: "Choose tier" },
  { id: "account", label: "Account", description: "Member details" },
  { id: "inclusions", label: "Inclusions", description: "Review access" },
  { id: "extras", label: "Extras", description: "Optional extras" },
  { id: "payment", label: "Activation", description: "Payment or activation" },
  { id: "review", label: "Review", description: "Confirm details" },
  { id: "success", label: "Success", description: "Preview saved" },
  { id: "business", label: "Business", description: "Business profile" },
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
  acceptedTerms: false,
  inclusionConfirmed: false,
  paymentMethodMock: "mock-card",
  selectedExtras: [],
  industry: "",
  businessSize: "",
  businessStage: "",
  biggestChallenge: "",
  urgency: "medium",
  goals: [],
  managedServiceInterests: [],
  teamInvites: "",
};

function tierFromPlanId(planId?: string): MembershipTierCode {
  return planId?.includes("free") ? "free" : "premium";
}

function paymentLabel(tier: MembershipTierCode, paymentState: PaymentState) {
  if (tier === "free") return "No payment required";
  if (paymentState === "simulated-success") return "Payment preview complete";
  if (paymentState === "simulated-failed") return "Payment preview failed";
  if (paymentState === "pending") return "Payment preview pending";
  return "Payment preview not started";
}

function writeMembershipSession(payload: Record<string, unknown>) {
  if (!isMockMembershipConfirmationEnabled()) {
    return false;
  }

  window.sessionStorage.setItem(membershipFlowStorageKey, JSON.stringify(payload));
  return true;
}

export function MembershipTierSignupFlow() {
  const [searchParams] = useSearchParams();
  const requestedTier = searchParams.get("tier") === "free" ? "free" : searchParams.get("tier") === "premium" ? "premium" : null;
  const returnTo = searchParams.get("returnTo") || "";

  const [plans, setPlans] = useState<MockMembershipPlan[]>([]);
  const [form, setForm] = useState<MembershipFlowForm>(initialForm);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [onboardingState, setOnboardingState] = useState<SubmissionState>("idle");
  const [signupResult, setSignupResult] = useState<MockMembershipSignupResult | null>(null);
  const [onboardingResult, setOnboardingResult] = useState<MockMembershipOnboardingResult | null>(null);
  const mockConfirmationEnabled = isMockMembershipConfirmationEnabled();

  useEffect(() => {
    let mounted = true;
    getMockMembershipPlans().then((response) => {
      if (!mounted || !response.data) return;
      const membershipPlans = response.data;
      const requestedPlan = requestedTier
        ? membershipPlans.find((plan) => tierFromPlanId(plan.id) === requestedTier)
        : undefined;
      setPlans(membershipPlans);
      setForm((current) => ({
        ...current,
        selectedPlanId: current.selectedPlanId || requestedPlan?.id || membershipPlans[0]?.id || "",
      }));
    });
    return () => {
      mounted = false;
    };
  }, [requestedTier]);

  const currentStep = steps[stepIndex] ?? steps[0];
  const selectedPlan = plans.find((plan) => plan.id === form.selectedPlanId);
  const selectedTierCode = tierFromPlanId(form.selectedPlanId);
  const selectedTier = membershipTierByCode[selectedTierCode];
  const isFree = selectedTierCode === "free";
  const selectedExtras = mockMembershipExtras.filter((extra) => form.selectedExtras.includes(extra.id));

  const summaryLines = useMemo(
    () => [
      ["Membership", selectedPlan?.name ?? selectedTier.name],
      ["Price", selectedPlan?.price.label ?? selectedTier.priceLabel],
      ["Payment", paymentLabel(selectedTierCode, paymentState)],
      [
        "Status",
        onboardingResult
          ? "Development onboarding preview complete"
          : signupResult
            ? "Development membership preview saved"
            : "Draft",
      ],
    ],
    [onboardingResult, paymentState, selectedPlan, selectedTier.name, selectedTier.priceLabel, selectedTierCode, signupResult]
  );

  function setField(field: keyof MembershipFlowForm, value: string | boolean | string[]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function toggleList(field: "selectedExtras" | "goals" | "managedServiceInterests", value: string) {
    const currentValues = form[field];
    setField(field, currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value]);
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    const requireText = (field: keyof MembershipFlowForm, message = "Required to continue.") => {
      const value = form[field];
      if (Array.isArray(value) ? value.length === 0 : !value) nextErrors[field] = message;
    };

    if (currentStep.id === "plan") requireText("selectedPlanId");
    if (currentStep.id === "account") ["primaryContactName", "email", "phone", "businessName"].forEach((field) => requireText(field as keyof MembershipFlowForm));
    if (currentStep.id === "inclusions") {
      if (!form.inclusionConfirmed) nextErrors.inclusionConfirmed = "Confirm the membership inclusions before continuing.";
      if (!form.acceptedTerms) nextErrors.acceptedTerms = "Accept the membership terms before continuing.";
    }
    if (currentStep.id === "payment" && !isFree && paymentState !== "simulated-success") nextErrors.paymentState = "Complete a successful payment preview to continue.";
    if (currentStep.id === "business") ["businessName", "industry", "businessSize", "businessStage"].forEach((field) => requireText(field as keyof MembershipFlowForm));
    if (currentStep.id === "goals") ["goals", "biggestChallenge", "urgency"].forEach((field) => requireText(field as keyof MembershipFlowForm));

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validate()) return;
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  }

  function goBack() {
    setErrors({});
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  function simulatePayment(nextState: Exclude<PaymentState, "idle" | "pending">) {
    setPaymentState("pending");
    window.setTimeout(() => setPaymentState(nextState), 500);
  }

  async function submitSignup() {
    setSubmissionState("loading");
    setErrors({});
    const response = await submitMockMembershipSignup({
      selectedPlanId: form.selectedPlanId,
      membershipTier: selectedTierCode,
      businessName: form.businessName,
      primaryContactName: form.primaryContactName,
      email: form.email,
      acceptedTerms: form.acceptedTerms,
      paymentMethodMock: isFree ? undefined : form.paymentMethodMock,
      selectedExtras: form.selectedExtras,
      paymentState: isFree ? "not-required" : paymentState,
    });

    if (!response.ok || !response.data) {
      setSubmissionState("error");
      setErrors(Object.fromEntries(response.errors.map((error) => [error.field, error.message])));
      return;
    }

    setSignupResult(response.data);
    setSubmissionState("success");
    writeMembershipSession({
      signupReference: response.data.reference,
      membershipTier: selectedTierCode,
      selectedPlanId: form.selectedPlanId,
      selectedPlan: selectedPlan?.name ?? selectedTier.name,
      membershipStatus: response.data.membershipStatus,
      paymentStatus: isFree ? "not-required" : "preview-complete",
      onboardingStatus: "in-progress",
      portalHref: response.data.portalHref,
      businessName: form.businessName,
      primaryContactName: form.primaryContactName,
      returnTo,
    });
    setStepIndex(steps.findIndex((step) => step.id === "success"));
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
      setErrors(Object.fromEntries(response.errors.map((error) => [error.field, error.message])));
      return;
    }

    setOnboardingResult(response.data);
    setOnboardingState("success");
    writeMembershipSession({
      signupReference: signupResult?.reference,
      onboardingReference: response.data.reference,
      membershipTier: selectedTierCode,
      selectedPlanId: form.selectedPlanId,
      selectedPlan: selectedPlan?.name ?? selectedTier.name,
      membershipStatus: response.data.membershipStatus,
      paymentStatus: isFree ? "not-required" : "preview-complete",
      onboardingStatus: response.data.onboardingStatus,
      portalHref: response.data.portalHref,
      businessName: form.businessName,
      primaryContactName: form.primaryContactName,
      goals: form.goals,
      managedServiceInterests: form.managedServiceInterests,
      returnTo,
    });
    setStepIndex(steps.findIndex((step) => step.id === "complete"));
  }

  return (
    <WizardShell
      eyebrow="RBP Membership Sign-Up"
      title={isFree ? "Create Your Free Membership" : "Start Your Premium Membership"}
      description="Choose Free Membership for online purchasing access, or Premium Membership for enhanced benefits, discounts, credits, and member support."
      steps={steps}
      currentStepId={currentStep.id}
      aside={
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-slate-950">Membership summary</h3>
          <dl className="space-y-3 text-sm">
            {summaryLines.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-0">
                <dt className="font-semibold text-slate-500">{label}</dt>
                <dd className="text-right font-bold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          <StatusBadge status={signupResult ? "active" : "draft"} label={signupResult ? "Development membership preview saved" : "Draft"} />
        </div>
      }
    >
      <div className="space-y-6">
        {currentStep.id === "plan" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Choose your membership</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Select Free to create an account for online purchasing, or Premium to unlock enhanced membership benefits.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {plans.map((plan) => {
                const planTier = membershipTierByCode[tierFromPlanId(plan.id)];
                return (
                  <button key={plan.id} type="button" onClick={() => setField("selectedPlanId", plan.id)} className={["rounded-3xl border p-6 text-left transition", form.selectedPlanId === plan.id ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"].join(" ")}>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-black text-slate-950">{plan.name}</h3>
                      {planTier.recommended && <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-bold text-white">Early Bird</span>}
                    </div>
                    <p className="mt-3 text-3xl font-black text-slate-950">{plan.price.label}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-700">
                      {plan.inclusions.map((item) => <li key={item}>- {item}</li>)}
                    </ul>
                  </button>
                );
              })}
            </div>
            {errors.selectedPlanId && <p className="mt-3 text-sm font-semibold text-red-600">{errors.selectedPlanId}</p>}
          </section>
        )}

        {currentStep.id === "account" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Create your member profile</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ["primaryContactName", "Primary contact name"],
                ["email", "Email address"],
                ["phone", "Phone number"],
                ["businessName", "Business name"],
              ].map(([field, label]) => (
                <label key={field} className="text-sm font-semibold text-slate-700">
                  {label}
                  <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={String(form[field as keyof MembershipFlowForm])} onChange={(event) => setField(field as keyof MembershipFlowForm, event.currentTarget.value)} />
                  {errors[field] && <span className="mt-1 block text-xs text-red-600">{errors[field]}</span>}
                </label>
              ))}
            </div>
          </section>
        )}

        {currentStep.id === "inclusions" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Confirm your {selectedTier.shortName} inclusions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{isFree ? "Review the Free Membership access that allows you to purchase products and services online and use selected RBP member benefits." : "Review your Premium Membership access before continuing."}</p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {selectedTier.inclusions.map((group) => (
                <article key={group.category} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-bold text-slate-950">{group.category}</h3>
                  <ul className="mt-4 space-y-3 text-sm">
                    {group.items.map((item) => <li key={item.name} className="flex justify-between gap-4"><span>{item.name}</span><span className="font-bold text-blue-700">{item.value}</span></li>)}
                  </ul>
                </article>
              ))}
            </div>
            <label className="mt-6 flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.inclusionConfirmed} onChange={(event) => setField("inclusionConfirmed", event.currentTarget.checked)} /> I understand the RBP {selectedTier.shortName} inclusions and terms.</label>
            <label className="mt-3 flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.acceptedTerms} onChange={(event) => setField("acceptedTerms", event.currentTarget.checked)} /> I accept the membership terms.</label>
            {errors.inclusionConfirmed && <p className="mt-2 text-sm font-semibold text-red-600">{errors.inclusionConfirmed}</p>}
            {errors.acceptedTerms && <p className="mt-2 text-sm font-semibold text-red-600">{errors.acceptedTerms}</p>}
          </section>
        )}

        {currentStep.id === "extras" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Select optional extras</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{isFree ? "Free members can add services at advertised or add-on prices." : "Premium members keep premium-relevant options and eligible discounts."}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {mockMembershipExtras.map((extra) => <button key={extra.id} type="button" onClick={() => toggleList("selectedExtras", extra.id)} className={["rounded-2xl border p-5 text-left", form.selectedExtras.includes(extra.id) ? "border-blue-600 bg-blue-50" : "border-slate-200"].join(" ")}><span className="block font-bold text-slate-950">{extra.title}</span><span className="mt-2 block text-sm text-slate-600">{extra.description}</span><span className="mt-3 block text-sm font-bold text-blue-700">{extra.priceLabel}</span></button>)}
            </div>
          </section>
        )}

        {currentStep.id === "payment" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">{isFree ? "Activate Free Membership" : "Payment Preview"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{isFree ? "No payment is required to create your Free Membership. Continue to review your account and onboarding details." : `Preview the ${selectedTier.priceLabel} Premium Membership payment state. No real payment is processed in this preview.`}</p>
            {isFree ? <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-800">Free Membership is ready to activate.</div> : <div className="mt-6 space-y-4"><div className="grid gap-3 sm:grid-cols-2">{mockPaymentMethods.map((method) => <button key={method.id} type="button" onClick={() => setField("paymentMethodMock", method.id)} className={["rounded-2xl border p-4 text-left text-sm", form.paymentMethodMock === method.id ? "border-blue-600 bg-blue-50" : "border-slate-200"].join(" ")}><span className="font-bold text-slate-950">{method.label}</span><span className="mt-1 block text-slate-600">{method.description}</span></button>)}</div><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => simulatePayment("simulated-success")} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Preview Payment Success</button><button type="button" onClick={() => simulatePayment("simulated-failed")} className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700">Preview Payment Failure</button></div><p className="text-sm font-semibold text-slate-700">{paymentLabel(selectedTierCode, paymentState)}</p></div>}
            {errors.paymentState && <p className="mt-2 text-sm font-semibold text-red-600">{errors.paymentState}</p>}
          </section>
        )}

        {currentStep.id === "review" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Review Your {selectedTier.shortName} Details</h2>
            <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2">
              <div><dt className="font-semibold text-slate-500">Primary contact</dt><dd className="font-bold text-slate-900">{form.primaryContactName}</dd></div>
              <div><dt className="font-semibold text-slate-500">Email</dt><dd className="font-bold text-slate-900">{form.email}</dd></div>
              <div><dt className="font-semibold text-slate-500">Business</dt><dd className="font-bold text-slate-900">{form.businessName}</dd></div>
              <div><dt className="font-semibold text-slate-500">Payment</dt><dd className="font-bold text-slate-900">{paymentLabel(selectedTierCode, paymentState)}</dd></div>
            </dl>
            {submissionState === "error" && <p className="mt-4 text-sm font-semibold text-red-600">Membership details need review.</p>}
            <div className="mt-6 flex gap-3"><button type="button" onClick={submitSignup} disabled={submissionState === "loading"} className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{isFree ? "Activate Free Membership" : "Confirm Premium Membership Preview"}</button><button type="button" onClick={goBack} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700">Back</button></div>
          </section>
        )}

        {currentStep.id === "success" && signupResult && (
          <ConfirmationPanel
            title={isFree ? "RBP Free Membership Development Preview Saved" : "RBP Premium Membership Development Preview Confirmed"}
            statusLabel="Development preview only"
            message={
              mockConfirmationEnabled
                ? "This is a development-only membership preview. No real membership, payment, account, or portal access has been created."
                : "Backend integration is required before this flow can issue a real membership confirmation."
            }
            reference={signupResult.reference}
            primaryAction={
              <button type="button" onClick={goNext} className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white">
                Continue to onboarding
              </button>
            }
            secondaryAction={
              mockConfirmationEnabled ? (
                <Link to="/membership/confirmation" className="rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700">
                  View development confirmation
                </Link>
              ) : (
                <Link to="/membership/overview" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                  Return to membership
                </Link>
              )
            }
          />
        )}

        {currentStep.id === "business" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black text-slate-950">Business profile</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{[["industry","Industry"],["businessSize","Business size"],["businessStage","Business stage"]].map(([field,label]) => <label key={field} className="text-sm font-semibold text-slate-700">{label}<input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={String(form[field as keyof MembershipFlowForm])} onChange={(event) => setField(field as keyof MembershipFlowForm, event.currentTarget.value)} />{errors[field] && <span className="mt-1 block text-xs text-red-600">{errors[field]}</span>}</label>)}</div></section>
        )}

        {currentStep.id === "goals" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black text-slate-950">Priorities</h2><div className="mt-6 grid gap-3 md:grid-cols-3">{mockMembershipGoalOptions.map((goal) => <button key={goal} type="button" onClick={() => toggleList("goals", goal)} className={["rounded-xl border px-4 py-3 text-left text-sm font-bold", form.goals.includes(goal) ? "border-blue-600 bg-blue-50" : "border-slate-200"].join(" ")}>{goal}</button>)}</div><label className="mt-4 block text-sm font-semibold text-slate-700">Biggest challenge<textarea className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.biggestChallenge} onChange={(event) => setField("biggestChallenge", event.currentTarget.value)} /></label></section>
        )}

        {currentStep.id === "services" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black text-slate-950">Service interests</h2><div className="mt-6 grid gap-3 md:grid-cols-2">{mockMembershipManagedServiceOptions.map((service) => <button key={service.id} type="button" onClick={() => toggleList("managedServiceInterests", service.id)} className={["rounded-xl border p-4 text-left", form.managedServiceInterests.includes(service.id) ? "border-blue-600 bg-blue-50" : "border-slate-200"].join(" ")}><span className="font-bold text-slate-950">{service.title}</span><span className="mt-1 block text-sm text-slate-600">{service.description}</span></button>)}</div></section>
        )}

        {currentStep.id === "team" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black text-slate-950">Team setup</h2><label className="mt-4 block text-sm font-semibold text-slate-700">Team invites<textarea className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.teamInvites} onChange={(event) => setField("teamInvites", event.currentTarget.value)} placeholder="Optional email addresses or notes" /></label><button type="button" onClick={submitOnboarding} className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white">Complete onboarding</button>{onboardingState === "error" && <p className="mt-2 text-sm font-semibold text-red-600">Onboarding details need review.</p>}</section>
        )}

        {currentStep.id === "complete" && onboardingResult && (
          <ConfirmationPanel
            title="Membership onboarding development preview complete"
            statusLabel="Development preview only"
            message={
              mockConfirmationEnabled
                ? "This onboarding handoff is a development-only preview. No real account or portal access has been created."
                : "Backend integration is required before onboarding can create a real member account or portal handoff."
            }
            reference={onboardingResult.reference}
            primaryAction={
              returnTo ? (
                <Link to={returnTo} className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white">
                  Continue purchase path
                </Link>
              ) : mockConfirmationEnabled ? (
                <Link to="/portal/dashboard" className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white">
                  Open development portal preview
                </Link>
              ) : (
                <Link to="/membership/overview" className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white">
                  Return to membership
                </Link>
              )
            }
            secondaryAction={
              <Link to="/marketplace" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                Browse Marketplace
              </Link>
            }
          />
        )}

        {!['review','success','team','complete'].includes(currentStep.id) && <StepNavigation canGoBack={stepIndex > 0} canContinue onBack={goBack} onContinue={goNext} continueLabel="Continue" />}
      </div>
    </WizardShell>
  );
}
