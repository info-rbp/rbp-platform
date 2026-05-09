import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Phone,
  Router,
  ShieldCheck,
  Wifi,
  Zap,
} from "lucide-react";

import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  ConfirmationPanel,
  MockSubmissionState,
  ReviewSubmit,
  StatusTimeline,
  StepNavigation,
  WizardShell,
} from "../../components/flow";
import {
  CheckboxField,
  FormSection,
  RadioCardGroup,
  SelectField,
  TextField,
  TermsAcceptance,
} from "../../components/forms";
import {
  OrderSummaryCard,
  PaymentSimulationPanel,
  PlanSelectionCard,
  ServiceabilityCheckPanel,
} from "../../components/domain";
import { StatusBadge } from "../../components/status";
import {
  mockConnectivityHardwareOptions,
  mockConnectivityPlans,
  mockConnectivityServiceFamilies,
  mockConnectivityTimeline,
  type MockConnectivityHardwareType,
} from "../../mock";
import {
  checkMockServiceability,
  submitMockConnectivityOrder,
} from "../../services/mock/connectivity.mockService";

const steps = [
  { id: "service", label: "Service", description: "Choose family/provider." },
  { id: "address", label: "Address", description: "Mock serviceability." },
  { id: "plan", label: "Plan", description: "Select a business plan." },
  { id: "hardware", label: "Hardware", description: "Choose modem/router." },
  { id: "details", label: "Details", description: "Business/contact info." },
  { id: "payment", label: "Payment", description: "Mock billing setup." },
  { id: "review", label: "Review", description: "Submit mock order." },
];

type SubmissionState = "idle" | "loading" | "success" | "error";

interface ConnectivityFormState {
  serviceFamily: "TotalBiz" | "ProBiz";
  provider: "NBN" | "Superloop";
  serviceAddress: string;
  serviceabilityStatus: "not-checked" | "available" | "manual-review" | "not-available";
  selectedPlanId: string;
  selectedHardwareId: MockConnectivityHardwareType;
  businessName: string;
  abn: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentMethodMock: string;
  acceptedTerms: boolean;
}

function getPlan(id: string) {
  return mockConnectivityPlans.find((plan) => plan.id === id) ?? mockConnectivityPlans[0];
}

function getHardware(id: string) {
  return mockConnectivityHardwareOptions.find((item) => item.id === id) ?? mockConnectivityHardwareOptions[0];
}

function getInitialFamilyFromPath(pathname: string): "TotalBiz" | "ProBiz" {
  if (pathname.includes("superloop")) return "ProBiz";
  return "TotalBiz";
}

function ConnectivityHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.18)_0%,_transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200">
            <Wifi className="h-3.5 w-3.5" />
            Connectivity Mock Order
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simulate business NBN and connectivity ordering.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Choose TotalBiz or ProBiz style plans, run a mock serviceability check, select hardware, review billing, and submit a frontend-only order simulation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#order"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-400"
            >
              Start mock order <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/portal/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              View portal status
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
            Phase 1 business rules
          </p>
          <div className="mt-5 space-y-4">
            {[
              ["Plan families", "TotalBiz and ProBiz"],
              ["Contract term", "36-month mock contract"],
              ["Provisioning", "14-day mock provisioning lead time"],
              ["Premium discount", "10% mock display state"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white p-4 text-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 text-lg font-black">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ConnectivityOverviewCards() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
            Connectivity options
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Business connectivity without real provisioning
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            These mock products support the Phase 1 order simulation. No carrier serviceability, provisioning, billing, or payment is performed.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {mockConnectivityServiceFamilies.map((family) => (
            <article key={family.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                {family.id === "TotalBiz" ? <Router className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
              </div>
              <h3 className="text-2xl font-bold text-slate-950">{family.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{family.description}</p>
              <p className="mt-4 text-sm font-semibold text-slate-800">{family.idealFor}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ConnectivityOrderFlow() {
  const location = useLocation();
  const initialFamily = getInitialFamilyFromPath(location.pathname);

  const [step, setStep] = useState("service");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [reference, setReference] = useState("");
  const [form, setForm] = useState<ConnectivityFormState>({
    serviceFamily: initialFamily,
    provider: initialFamily === "ProBiz" ? "Superloop" : "NBN",
    serviceAddress: "",
    serviceabilityStatus: "not-checked",
    selectedPlanId: initialFamily === "ProBiz" ? "probiz-500-200" : "totalbiz-100-40",
    selectedHardwareId: "tp-link",
    businessName: "",
    abn: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    paymentMethodMock: "mock-card",
    acceptedTerms: false,
  });

  const currentStepIndex = steps.findIndex((item) => item.id === step);
  const canBack = currentStepIndex > 0;
  const canForward = currentStepIndex < steps.length - 1;

  const availablePlans = useMemo(
    () => mockConnectivityPlans.filter((plan) => plan.family === form.serviceFamily),
    [form.serviceFamily]
  );

  const selectedPlan = getPlan(form.selectedPlanId);
  const selectedHardware = getHardware(form.selectedHardwareId);

  function updateFamily(value: "TotalBiz" | "ProBiz") {
    const nextPlan = mockConnectivityPlans.find((plan) => plan.family === value);
    setForm({
      ...form,
      serviceFamily: value,
      provider: value === "ProBiz" ? "Superloop" : "NBN",
      selectedPlanId: nextPlan?.id ?? form.selectedPlanId,
    });
  }

  async function handleServiceability() {
    setSubmissionState("loading");
    const result = await checkMockServiceability({
      serviceAddress: form.serviceAddress,
    });

    if (result.ok && result.data) {
      setForm({
        ...form,
        serviceabilityStatus: result.data.serviceabilityStatus,
      });
      setSubmissionState("idle");
      return;
    }

    setSubmissionState("error");
  }

  async function handleSubmit() {
    setSubmissionState("loading");

    const result = await submitMockConnectivityOrder({
      serviceAddress: form.serviceAddress,
      selectedPlanId: form.selectedPlanId,
      selectedHardwareId: form.selectedHardwareId,
      businessName: form.businessName,
      abn: form.abn,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      paymentMethodMock: form.paymentMethodMock,
      acceptedTerms: form.acceptedTerms,
    });

    if (result.ok && result.data) {
      setReference(result.data.reference);
      setSubmissionState("success");
      return;
    }

    setSubmissionState("error");
  }

  if (submissionState === "success") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <section className="py-12">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
            <ConfirmationPanel
              title="Connectivity order submitted"
              message="Your mock connectivity order has been submitted. No real serviceability check, payment, NBN order, Superloop order, or provisioning action has occurred."
              reference={reference}
              statusLabel="Mock order received"
              primaryAction={
                <Link className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white" to="/portal/services">
                  View portal status
                </Link>
              }
              secondaryAction={
                <Link className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" to="/operations/connectivity">
                  Back to connectivity
                </Link>
              }
            />
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 font-bold text-slate-950">Mock status timeline</h3>
              <StatusTimeline items={mockConnectivityTimeline} />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ConnectivityHero />
      <ConnectivityOverviewCards />

      <section id="order" className="scroll-mt-28 bg-slate-50 py-12">
        <WizardShell
          eyebrow="Connectivity order"
          title="Business connectivity mock order"
          description="Simulate serviceability, plan selection, hardware, business details, mock billing, review, and status tracking."
          steps={steps}
          currentStepId={step}
          aside={
            <OrderSummaryCard
              title="Connectivity summary"
              lines={[
                { label: "Family", value: form.serviceFamily },
                { label: "Provider", value: form.provider },
                { label: "Plan", value: selectedPlan.name },
                { label: "Speed", value: selectedPlan.speedLabel },
                { label: "Hardware", value: selectedHardware.name },
                { label: "Contract", value: selectedPlan.contractTermLabel },
                { label: "Provisioning", value: selectedPlan.provisioningLabel },
                { label: "Price", value: selectedPlan.price.label },
              ]}
            />
          }
        >
          <div className="space-y-6">
            <MockSubmissionState
              state={submissionState}
              idleMessage="Ready for mock connectivity order input."
              loadingMessage="Running mock serviceability/order simulation..."
              successMessage="Mock connectivity order completed."
              errorMessage="Mock connectivity validation failed. Review required fields."
            />

            {step === "service" ? (
              <FormSection
                title="Choose service family"
                description="Select the mock business connectivity family. This does not check real provider availability."
              >
                <RadioCardGroup
                  name="serviceFamily"
                  label="Service family"
                  value={form.serviceFamily}
                  onChange={(value) => updateFamily(value as "TotalBiz" | "ProBiz")}
                  options={mockConnectivityServiceFamilies.map((family) => ({
                    value: family.id,
                    label: family.title,
                    description: family.description,
                  }))}
                />
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-5 w-5 text-blue-700" />
                    <div>
                      <p className="font-semibold text-slate-950">Phase 1 business rules</p>
                      <p className="mt-1 text-sm text-slate-700">
                        36-month mock contract, 14-day provisioning lead time, and premium customer 10% discount display state.
                      </p>
                    </div>
                  </div>
                </div>
              </FormSection>
            ) : null}

            {step === "address" ? (
              <FormSection
                title="Address and serviceability"
                description="Run a simulated serviceability check. No NBN or Superloop systems are queried."
              >
                <TextField
                  label="Service address"
                  value={form.serviceAddress}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      serviceAddress: event.currentTarget.value,
                      serviceabilityStatus: "not-checked",
                    })
                  }
                  helpText="Example: 100 Demo Street, Melbourne VIC"
                />
                <button
                  type="button"
                  onClick={handleServiceability}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm"
                >
                  Run mock serviceability check
                </button>
                <ServiceabilityCheckPanel
                  address={form.serviceAddress}
                  status={form.serviceabilityStatus}
                />
              </FormSection>
            ) : null}

            {step === "plan" ? (
              <FormSection
                title="Select plan"
                description="Choose a mock connectivity plan for frontend order simulation."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {availablePlans.map((plan) => (
                    <PlanSelectionCard
                      key={plan.id}
                      title={`${plan.name} - ${plan.speedLabel}`}
                      description={plan.description}
                      priceLabel={plan.price.label}
                      selected={form.selectedPlanId === plan.id}
                      onSelect={() => setForm({ ...form, selectedPlanId: plan.id })}
                    />
                  ))}
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {selectedPlan.bestFor.map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                      <CheckCircle className="mb-2 h-4 w-4 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </FormSection>
            ) : null}

            {step === "hardware" ? (
              <FormSection
                title="Hardware options"
                description="Select a mock modem/router option. No hardware is ordered in Phase 1."
              >
                <RadioCardGroup
                  name="hardware"
                  label="Hardware"
                  value={form.selectedHardwareId}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      selectedHardwareId: value as MockConnectivityHardwareType,
                    })
                  }
                  options={mockConnectivityHardwareOptions.map((item) => ({
                    value: item.id,
                    label: `${item.name} - ${item.priceLabel}`,
                    description: item.description,
                  }))}
                />
              </FormSection>
            ) : null}

            {step === "details" ? (
              <FormSection
                title="Business and contact details"
                description="Capture mock order contact details. No account is created."
              >
                <TextField
                  label="Business name"
                  value={form.businessName}
                  onChange={(event) => setForm({ ...form, businessName: event.currentTarget.value })}
                />
                <TextField
                  label="ABN or business identifier"
                  value={form.abn}
                  onChange={(event) => setForm({ ...form, abn: event.currentTarget.value })}
                />
                <TextField
                  label="Contact name"
                  value={form.contactName}
                  onChange={(event) => setForm({ ...form, contactName: event.currentTarget.value })}
                />
                <TextField
                  label="Contact email"
                  type="email"
                  value={form.contactEmail}
                  onChange={(event) => setForm({ ...form, contactEmail: event.currentTarget.value })}
                />
                <TextField
                  label="Contact phone"
                  value={form.contactPhone}
                  onChange={(event) => setForm({ ...form, contactPhone: event.currentTarget.value })}
                />
              </FormSection>
            ) : null}

            {step === "payment" ? (
              <FormSection
                title="Mock billing setup"
                description="Select a simulated payment method. No payment method is stored or charged."
              >
                <PaymentSimulationPanel
                  title="Mock connectivity payment simulation"
                  amountLabel={`${selectedPlan.price.label}. Premium customers may see a 10% mock discount display state. No real charge is processed.`}
                />
                <SelectField
                  label="Mock payment method"
                  value={form.paymentMethodMock}
                  onChange={(event) => setForm({ ...form, paymentMethodMock: event.currentTarget.value })}
                  options={[
                    { label: "Mock card", value: "mock-card" },
                    { label: "Mock invoice", value: "mock-invoice" },
                    { label: "Mock account billing", value: "mock-account-billing" },
                  ]}
                />
                <TermsAcceptance
                  checked={form.acceptedTerms}
                  onChange={(checked) => setForm({ ...form, acceptedTerms: checked })}
                />
                <CheckboxField
                  checked
                  readOnly
                  label="I understand this is a 36-month mock contract display only"
                  description="No real contract is created in Phase 1."
                />
              </FormSection>
            ) : null}

            {step === "review" ? (
              <ReviewSubmit
                title="Review connectivity order"
                description="Confirm the mock order details before submitting the simulation."
                sections={[
                  {
                    title: "Service",
                    items: [
                      { label: "Family", value: form.serviceFamily },
                      { label: "Provider", value: form.provider },
                      { label: "Address", value: form.serviceAddress || "Not provided" },
                      { label: "Serviceability", value: <StatusBadge status={form.serviceabilityStatus} /> },
                    ],
                  },
                  {
                    title: "Plan and hardware",
                    items: [
                      { label: "Plan", value: selectedPlan.name },
                      { label: "Speed", value: selectedPlan.speedLabel },
                      { label: "Price", value: selectedPlan.price.label },
                      { label: "Hardware", value: selectedHardware.name },
                      { label: "Contract", value: selectedPlan.contractTermLabel },
                      { label: "Provisioning", value: selectedPlan.provisioningLabel },
                    ],
                  },
                  {
                    title: "Contact",
                    items: [
                      { label: "Business", value: form.businessName || "Not provided" },
                      { label: "ABN", value: form.abn || "Not provided" },
                      { label: "Contact", value: form.contactName || "Not provided" },
                      { label: "Email", value: form.contactEmail || "Not provided" },
                      { label: "Phone", value: form.contactPhone || "Not provided" },
                    ],
                  },
                  {
                    title: "Mock billing",
                    items: [
                      { label: "Method", value: form.paymentMethodMock },
                      { label: "Terms accepted", value: form.acceptedTerms ? "Yes" : "No" },
                    ],
                  },
                ]}
                submitLabel="Submit mock connectivity order"
                isSubmitting={submissionState === "loading"}
                onSubmit={handleSubmit}
              />
            ) : null}

            {step !== "review" ? (
              <StepNavigation
                canGoBack={canBack}
                canContinue={canForward}
                onBack={() => setStep(steps[Math.max(0, currentStepIndex - 1)].id)}
                onContinue={() => setStep(steps[Math.min(steps.length - 1, currentStepIndex + 1)].id)}
              />
            ) : (
              <StepNavigation
                canGoBack
                canContinue={false}
                continueLabel="Submit from review"
                onBack={() => setStep("payment")}
              />
            )}
          </div>
        </WizardShell>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            {
              title: "No real serviceability",
              text: "The address check is simulated and does not query NBN, Superloop, or any carrier system.",
              icon: <Wifi className="h-5 w-5" />,
            },
            {
              title: "No real payment",
              text: "Payment and billing screens are mock-only. No card, invoice, or billing profile is created.",
              icon: <ShieldCheck className="h-5 w-5" />,
            },
            {
              title: "Mock provisioning",
              text: "14-day provisioning is displayed as a mock state for portal and workflow testing.",
              icon: <Clock className="h-5 w-5" />,
            },
          ].map((item) => (
            <article key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
