import { useState } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle,
  ClipboardCheck,
  ShieldAlert,
  ShieldCheck,
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
  FormSection,
  RadioCardGroup,
  SelectableCardGrid,
  TextAreaField,
  TextField,
} from "../../components/forms";
import { RiskScoreSummary } from "../../components/domain";
import { StatusBadge } from "../../components/status";
import {
  getMockRiskScoreBand,
  mockRiskAdvisorResultSummaries,
  mockRiskAppetiteOptions,
  mockRiskCategories,
  mockRiskControlMaturityOptions,
  mockRiskQuestions,
  mockRiskTimeline,
  type MockRiskAppetite,
  type MockRiskCategory,
  type MockRiskMaturity,
  type MockRiskScoreBand,
} from "../../mock";
import { submitMockRiskAssessment } from "../../services/mock/riskAdvisor.mockService";

const steps = [
  { id: "business", label: "Business", description: "Profile and context." },
  { id: "categories", label: "Categories", description: "Select risk areas." },
  { id: "controls", label: "Controls", description: "Current controls." },
  { id: "incidents", label: "Incidents", description: "Issues and compliance." },
  { id: "appetite", label: "Appetite", description: "Tolerance and outcome." },
  { id: "summary", label: "Score", description: "Mock score preview." },
  { id: "review", label: "Review", description: "Submit assessment." },
];

type SubmissionState = "idle" | "loading" | "success" | "error";

interface RiskFormState {
  businessName: string;
  industry: string;
  businessSize: string;
  riskCategories: MockRiskCategory[];
  currentControls: string;
  controlMaturity: MockRiskMaturity;
  incidentHistory: string;
  complianceConcerns: string;
  riskAppetite: MockRiskAppetite;
  priorityOutcome: string;
}

function estimatePreviewScore(form: RiskFormState): number {
  let score = 58 + form.riskCategories.length * 4;

  if (form.controlMaturity === "low") score += 18;
  if (form.controlMaturity === "developing") score += 10;
  if (form.controlMaturity === "managed") score -= 6;
  if (form.controlMaturity === "advanced") score -= 14;

  if (form.riskAppetite === "growth") score += 8;
  if (form.riskAppetite === "conservative") score -= 5;

  if (form.incidentHistory.length > 80) score += 5;
  if (form.complianceConcerns.length > 80) score += 5;

  return Math.max(12, Math.min(96, score));
}

function toggleCategory(categories: MockRiskCategory[], category: MockRiskCategory) {
  if (categories.includes(category)) {
    return categories.filter((item) => item !== category);
  }

  return [...categories, category];
}

function RiskAdvisorHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(248,113,113,0.18)_0%,_transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-200">
            <ShieldAlert className="h-3.5 w-3.5" />
            Risk Advisor
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simulate a business risk assessment.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Capture risk categories, control maturity, incidents, compliance concerns, and appetite to produce a mock risk score and frontend-only status.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#assessment"
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-red-400"
            >
              Start mock assessment <ArrowRight className="h-4 w-4" />
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
          <p className="text-sm font-semibold uppercase tracking-wide text-red-200">
            Mock assessment areas
          </p>
          <div className="mt-5 grid gap-3">
            {mockRiskCategories.slice(0, 6).map((category) => (
              <div key={category} className="rounded-2xl bg-white p-4 text-slate-950">
                <p className="font-bold">{category}</p>
                <p className="mt-1 text-xs text-slate-500">Frontend-only review category</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RiskAdvisorOverviewCards() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-700">
            Assessment model
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Risk visibility without real advisory assignment
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            This Phase 1 flow simulates the intake, score, recommendation, confirmation, and status states needed before backend contract planning.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Business profile",
              text: "Capture business size, industry, and operating context.",
              icon: <ClipboardCheck className="h-5 w-5" />,
            },
            {
              title: "Control maturity",
              text: "Review whether controls are informal, developing, managed, or advanced.",
              icon: <ShieldCheck className="h-5 w-5" />,
            },
            {
              title: "Mock result",
              text: "Generate a deterministic frontend-only risk score and summary.",
              icon: <BarChart3 className="h-5 w-5" />,
            },
          ].map((item) => (
            <article key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RiskAdvisorFlow() {
  const [step, setStep] = useState("business");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [reference, setReference] = useState("");
  const [resultScore, setResultScore] = useState(0);
  const [resultBand, setResultBand] = useState<MockRiskScoreBand | null>(null);

  const [form, setForm] = useState<RiskFormState>({
    businessName: "",
    industry: "",
    businessSize: "",
    riskCategories: ["Governance", "Cyber"],
    currentControls: "",
    controlMaturity: "developing",
    incidentHistory: "",
    complianceConcerns: "",
    riskAppetite: "balanced",
    priorityOutcome: "",
  });

  const currentStepIndex = steps.findIndex((item) => item.id === step);
  const canBack = currentStepIndex > 0;
  const canForward = currentStepIndex < steps.length - 1;
  const previewScore = estimatePreviewScore(form);
  const previewBand = getMockRiskScoreBand(previewScore);

  async function handleSubmit() {
    setSubmissionState("loading");

    const result = await submitMockRiskAssessment({
      businessName: form.businessName,
      industry: form.industry,
      businessSize: form.businessSize,
      riskCategories: form.riskCategories,
      currentControls: form.currentControls,
      controlMaturity: form.controlMaturity,
      incidentHistory: form.incidentHistory,
      complianceConcerns: form.complianceConcerns,
      riskAppetite: form.riskAppetite,
      priorityOutcome: form.priorityOutcome,
    });

    if (result.ok && result.data) {
      setReference(result.data.reference);
      setResultScore(result.data.mockScore);
      setResultBand(result.data.scoreBand);
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
            <div className="space-y-6">
              <ConfirmationPanel
                title="Risk Advisor assessment submitted"
                message="Your mock risk assessment has been submitted and a simulated risk score has been generated. No real advisor has been assigned and no backend assessment has been created."
                reference={reference}
                statusLabel="Mock outcome ready"
                primaryAction={
                  <Link className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white" to="/portal/services">
                    View portal status
                  </Link>
                }
                secondaryAction={
                  <Link className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" to="/on-demand/risk-advisor">
                    Start another mock assessment
                  </Link>
                }
              />
              <RiskScoreSummary
                score={resultScore}
                summary={resultBand?.description ?? "Mock score generated for frontend review."}
              />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 font-bold text-slate-950">Mock status timeline</h3>
              <StatusTimeline items={mockRiskTimeline} />
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
      <RiskAdvisorHero />
      <RiskAdvisorOverviewCards />

      <section id="assessment" className="scroll-mt-28 bg-slate-50 py-12">
        <WizardShell
          eyebrow="Risk Advisor assessment"
          title="Business risk mock assessment"
          description="Complete a frontend-only risk intake and generate a simulated score for Phase 1 review."
          steps={steps}
          currentStepId={step}
          aside={
            <div className="space-y-4">
              <RiskScoreSummary
                score={previewScore}
                summary={previewBand.description}
              />
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold text-slate-600">Preview band</p>
                <p className="mt-2 text-lg font-bold text-slate-950">{previewBand.label}</p>
                <p className="mt-1 text-sm text-slate-500">{previewBand.range}</p>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            <MockSubmissionState
              state={submissionState}
              idleMessage="Ready for mock risk assessment input."
              loadingMessage="Generating mock risk assessment..."
              successMessage="Mock risk assessment completed."
              errorMessage="Mock validation failed. Review required fields."
            />

            {step === "business" ? (
              <FormSection title="Business profile" description="Tell us about the business being assessed.">
                <TextField
                  label="Business name"
                  value={form.businessName}
                  onChange={(event) => setForm({ ...form, businessName: event.currentTarget.value })}
                />
                <TextField
                  label="Industry"
                  value={form.industry}
                  onChange={(event) => setForm({ ...form, industry: event.currentTarget.value })}
                  helpText="Example: Professional Services, Retail, Construction, Healthcare"
                />
                <TextField
                  label="Business size"
                  value={form.businessSize}
                  onChange={(event) => setForm({ ...form, businessSize: event.currentTarget.value })}
                  helpText="Example: 1-5, 6-20, 21-50, 51+ employees"
                />
              </FormSection>
            ) : null}

            {step === "categories" ? (
              <FormSection title="Risk categories" description="Select the areas that should be included in the mock assessment.">
                <SelectableCardGrid
                  selectedId=""
                  onSelect={(id) =>
                    setForm({
                      ...form,
                      riskCategories: toggleCategory(form.riskCategories, id as MockRiskCategory),
                    })
                  }
                  options={mockRiskCategories.map((category) => ({
                    id: category,
                    title: category,
                    description: form.riskCategories.includes(category)
                      ? "Selected for this mock assessment."
                      : "Click to include this category.",
                    meta: form.riskCategories.includes(category) ? (
                      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                        Selected
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        Not selected
                      </span>
                    ),
                  }))}
                />
              </FormSection>
            ) : null}

            {step === "controls" ? (
              <FormSection title="Current controls" description="Describe how risk is currently managed.">
                <RadioCardGroup
                  name="controlMaturity"
                  label="Control maturity"
                  value={form.controlMaturity}
                  onChange={(value) => setForm({ ...form, controlMaturity: value as MockRiskMaturity })}
                  options={mockRiskControlMaturityOptions.map((item) => ({
                    value: item.id,
                    label: item.title,
                    description: item.description,
                  }))}
                />
                <TextAreaField
                  label="Current controls"
                  value={form.currentControls}
                  onChange={(event) => setForm({ ...form, currentControls: event.currentTarget.value })}
                  helpText="Describe policies, systems, controls, review routines, or gaps."
                />
              </FormSection>
            ) : null}

            {step === "incidents" ? (
              <FormSection title="Incidents and compliance" description="Capture recent issues, concerns, or known obligations.">
                <TextAreaField
                  label="Incident history"
                  value={form.incidentHistory}
                  onChange={(event) => setForm({ ...form, incidentHistory: event.currentTarget.value })}
                  helpText="Mention recent disruptions, near misses, complaints, breaches, outages, or key risks."
                />
                <TextAreaField
                  label="Compliance concerns"
                  value={form.complianceConcerns}
                  onChange={(event) => setForm({ ...form, complianceConcerns: event.currentTarget.value })}
                  helpText="Mention licences, privacy, contracts, reporting, employment, finance, or industry obligations."
                />
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-1 h-5 w-5 text-amber-700" />
                    <p className="text-sm leading-6 text-slate-700">
                      This does not create a real compliance review, legal review, audit, or risk advisory engagement.
                    </p>
                  </div>
                </div>
              </FormSection>
            ) : null}

            {step === "appetite" ? (
              <FormSection title="Risk appetite and desired outcome" description="Set the mock tolerance profile and what you want out of the assessment.">
                <RadioCardGroup
                  name="riskAppetite"
                  label="Risk appetite"
                  value={form.riskAppetite}
                  onChange={(value) => setForm({ ...form, riskAppetite: value as MockRiskAppetite })}
                  options={mockRiskAppetiteOptions.map((item) => ({
                    value: item.id,
                    label: item.title,
                    description: item.description,
                  }))}
                />
                <TextAreaField
                  label="Priority outcome"
                  value={form.priorityOutcome}
                  onChange={(event) => setForm({ ...form, priorityOutcome: event.currentTarget.value })}
                  helpText="Example: reduce cyber risk, improve controls, prepare for growth, document compliance."
                />
              </FormSection>
            ) : null}

            {step === "summary" ? (
              <FormSection title="Mock result preview" description="Preview the simulated score before reviewing and submitting.">
                <RiskScoreSummary score={previewScore} summary={previewBand.description} />
                <div className="grid gap-4 md:grid-cols-3">
                  {mockRiskAdvisorResultSummaries.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <CheckCircle className="mb-3 h-5 w-5 text-emerald-500" />
                      <h3 className="font-bold text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                      <p className="mt-3 text-xs font-semibold text-blue-700">{item.recommendedAction}</p>
                    </article>
                  ))}
                </div>
              </FormSection>
            ) : null}

            {step === "review" ? (
              <ReviewSubmit
                title="Review Risk Advisor assessment"
                description="Confirm the mock assessment details before generating a simulated result."
                sections={[
                  {
                    title: "Business",
                    items: [
                      { label: "Business name", value: form.businessName || "Not provided" },
                      { label: "Industry", value: form.industry || "Not provided" },
                      { label: "Business size", value: form.businessSize || "Not provided" },
                    ],
                  },
                  {
                    title: "Risk profile",
                    items: [
                      {
                        label: "Categories",
                        value: form.riskCategories.length ? form.riskCategories.join(", ") : "None selected",
                      },
                      { label: "Control maturity", value: form.controlMaturity },
                      { label: "Risk appetite", value: form.riskAppetite },
                      { label: "Preview score", value: `${previewScore} - ${previewBand.label}` },
                    ],
                  },
                  {
                    title: "Inputs",
                    items: [
                      { label: "Controls", value: form.currentControls || "Not provided" },
                      { label: "Incident history", value: form.incidentHistory || "Not provided" },
                      { label: "Compliance concerns", value: form.complianceConcerns || "Not provided" },
                      { label: "Priority outcome", value: form.priorityOutcome || "Not provided" },
                    ],
                  },
                ]}
                submitLabel="Submit mock risk assessment"
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
                onBack={() => setStep("summary")}
              />
            )}
          </div>
        </WizardShell>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {mockRiskQuestions.slice(0, 3).map((item) => (
            <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <StatusBadge status="placeholder" label={item.category} />
              </div>
              <h3 className="text-lg font-bold text-slate-950">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.helpText}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
