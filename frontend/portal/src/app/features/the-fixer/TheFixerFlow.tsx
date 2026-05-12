import { useState } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ClipboardList,
  Flame,
  LifeBuoy,
  Siren,
  Wrench,
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
  FileUploadMock,
  FormSection,
  RadioCardGroup,
  SelectField,
  SelectableCardGrid,
  TextAreaField,
  TextField,
} from "../../components/forms";
import { PortalStatusCard } from "../../components/domain";
import { StatusBadge } from "../../components/status";
import {
  mockFixerDesiredOutcomes,
  mockFixerImpactOptions,
  mockFixerIssueCategories,
  mockFixerScopeOptions,
  mockFixerSupportingInfoTypes,
  mockFixerTimeline,
  mockFixerUrgencyOptions,
  type MockFixerBusinessImpact,
  type MockFixerIssueCategory,
  type MockFixerScope,
  type MockPriority,
} from "../../mock";
import { submitMockFixerRequest } from "../../services/mock/fixer.mockService";

const steps = [
  { id: "problem", label: "Problem", description: "Describe the issue." },
  { id: "impact", label: "Impact", description: "Assess business impact." },
  { id: "urgency", label: "Urgency", description: "Set priority and scope." },
  { id: "context", label: "Context", description: "What has been tried." },
  { id: "supporting", label: "Supporting info", description: "Mock uploads only." },
  { id: "resolution", label: "Resolution", description: "Desired outcome." },
  { id: "review", label: "Review", description: "Submit request." },
];

type SubmissionState = "idle" | "loading" | "success" | "error";

interface FixerFormState {
  issueTitle: string;
  issueCategory: MockFixerIssueCategory;
  issueDescription: string;
  urgency: MockPriority;
  businessImpact: MockFixerBusinessImpact;
  scope: MockFixerScope;
  affectedStakeholders: string;
  whatHasBeenTried: string;
  desiredResolution: string;
  supportingInfoAcknowledged: boolean;
}

function getUrgencyLabel(urgency: string) {
  return mockFixerUrgencyOptions.find((item) => item.id === urgency)?.title ?? urgency;
}

function getImpactLabel(impact: string) {
  return mockFixerImpactOptions.find((item) => item.id === impact)?.title ?? impact;
}

function getScopeLabel(scope: string) {
  return mockFixerScopeOptions.find((item) => item.id === scope)?.title ?? scope;
}

function TheFixerHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-orange-950 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,146,60,0.18)_0%,_transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-200">
            <Siren className="h-3.5 w-3.5" />
            The Fixer
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simulate urgent business issue triage.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Capture the issue, impact, urgency, context, supporting information, desired resolution, and mock triage status without creating a real ticket or backend request.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#fixer-request"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-orange-400"
            >
              Start request <ArrowRight className="h-4 w-4" />
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
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-200">
            Mock triage states
          </p>
          <div className="mt-5 grid gap-3">
            {[
              ["Submitted", "Request received in frontend mock state"],
              ["In review", "Simulated triage queue"],
              ["Assigned", "Mock assignment for portal/admin view"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white p-4 text-slate-950">
                <p className="font-bold">{label}</p>
                <p className="mt-1 text-xs text-slate-500">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TheFixerOverviewCards() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-700">
            Issue response model
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Capture urgent issues without real ticketing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            This Phase 1 flow demonstrates issue intake, triage, review, confirmation, and status states before backend contract planning.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Problem intake",
              text: "Capture what is happening, who is affected, and why it matters.",
              icon: <ClipboardList className="h-5 w-5" />,
            },
            {
              title: "Urgency triage",
              text: "Select urgency, impact, and scope to shape the mock response state.",
              icon: <Flame className="h-5 w-5" />,
            },
            {
              title: "Status tracking",
              text: "Show confirmation, timeline, portal handoff, and admin review placeholders.",
              icon: <LifeBuoy className="h-5 w-5" />,
            },
          ].map((item) => (
            <article key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-600 text-white">
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

export function TheFixerFlow({ embedded = false }: { embedded?: boolean }) {
  const [step, setStep] = useState("problem");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [reference, setReference] = useState("");

  const [form, setForm] = useState<FixerFormState>({
    issueTitle: "",
    issueCategory: "Operational issue",
    issueDescription: "",
    urgency: "high",
    businessImpact: "major",
    scope: "team-wide",
    affectedStakeholders: "",
    whatHasBeenTried: "",
    desiredResolution: "",
    supportingInfoAcknowledged: false,
  });

  const currentStepIndex = steps.findIndex((item) => item.id === step);
  const canBack = currentStepIndex > 0;
  const canForward = currentStepIndex < steps.length - 1;

  async function handleSubmit() {
    setSubmissionState("loading");

    const result = await submitMockFixerRequest({
      issueTitle: form.issueTitle,
      issueCategory: form.issueCategory,
      issueDescription: form.issueDescription,
      urgency: form.urgency,
      businessImpact: form.businessImpact,
      scope: form.scope,
      affectedStakeholders: form.affectedStakeholders,
      whatHasBeenTried: form.whatHasBeenTried,
      desiredResolution: form.desiredResolution,
      supportingInfoAcknowledged: form.supportingInfoAcknowledged,
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
        {!embedded ? <Navbar /> : null}
        <section className="py-12">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
            <div className="space-y-6">
              <ConfirmationPanel
                title="The Fixer request submitted"
                message="Your mock urgent issue request has been submitted for simulated triage. No real ticket, advisor assignment, backend workflow, email, or admin task has been created."
                reference={reference}
                statusLabel="Mock triage started"
                primaryAction={
                  <Link className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white" to="/portal/services">
                    View portal status
                  </Link>
                }
                secondaryAction={
                  <Link className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" to="/admin/the-fixer">
                    View admin concept
                  </Link>
                }
              />
              <PortalStatusCard
                title="The Fixer request"
                description="Mock request is visible as a simulated service status card for the member portal."
                status="submitted"
                href="/portal/services"
              />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 font-bold text-slate-950">Mock status timeline</h3>
              <StatusTimeline items={mockFixerTimeline} />
            </div>
          </div>
        </section>
        {!embedded ? <Footer /> : null}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {!embedded ? <Navbar /> : null}
      {!embedded ? <TheFixerHero /> : null}
      {!embedded ? <TheFixerOverviewCards /> : null}

      <section id="fixer-request" className="scroll-mt-28 bg-slate-50 py-12">
        <WizardShell
          eyebrow="The Fixer request"
          title="Urgent issue mock request"
          description="Complete a frontend-only intake for triage, supporting information, desired resolution, review, and confirmation."
          steps={steps}
          currentStepId={step}
          aside={
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-600">Current priority</p>
                <p className="mt-2 text-2xl font-black text-orange-700">
                  {getUrgencyLabel(form.urgency)}
                </p>
                <p className="mt-1 text-sm text-slate-500">{getImpactLabel(form.businessImpact)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge status={form.urgency} />
                  <StatusBadge status={form.scope} label={getScopeLabel(form.scope)} />
                </div>
              </div>
              <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
                <p className="font-bold text-slate-950">Phase 1 mock-only notice</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  No real ticket, escalation, email, upload, advisor assignment, or admin workflow is created.
                </p>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            <MockSubmissionState
              state={submissionState}
              idleMessage="Ready for mock Fixer request input."
              loadingMessage="Submitting mock Fixer request..."
              successMessage="Mock Fixer request completed."
              errorMessage="Mock validation failed. Review required fields."
            />

            {step === "problem" ? (
              <FormSection title="Problem intake" description="Describe what is happening and classify the issue.">
                <TextField
                  label="Issue title"
                  value={form.issueTitle}
                  onChange={(event) => setForm({ ...form, issueTitle: event.currentTarget.value })}
                  helpText="Example: Supplier delay has stopped customer deliveries"
                />
                <SelectField
                  label="Issue category"
                  value={form.issueCategory}
                  onChange={(event) =>
                    setForm({ ...form, issueCategory: event.currentTarget.value as MockFixerIssueCategory })
                  }
                  options={mockFixerIssueCategories.map((category) => ({
                    label: category,
                    value: category,
                  }))}
                />
                <TextAreaField
                  label="Issue description"
                  value={form.issueDescription}
                  onChange={(event) => setForm({ ...form, issueDescription: event.currentTarget.value })}
                  helpText="Explain the issue, what changed, and what is currently blocked."
                />
              </FormSection>
            ) : null}

            {step === "impact" ? (
              <FormSection title="Business impact" description="Describe who or what is affected.">
                <RadioCardGroup
                  name="businessImpact"
                  label="Impact level"
                  value={form.businessImpact}
                  onChange={(value) =>
                    setForm({ ...form, businessImpact: value as MockFixerBusinessImpact })
                  }
                  options={mockFixerImpactOptions.map((item) => ({
                    value: item.id,
                    label: item.title,
                    description: item.description,
                  }))}
                />
                <TextAreaField
                  label="Affected stakeholders"
                  value={form.affectedStakeholders}
                  onChange={(event) => setForm({ ...form, affectedStakeholders: event.currentTarget.value })}
                  helpText="List affected customers, teams, suppliers, partners, regulators, or internal owners."
                />
              </FormSection>
            ) : null}

            {step === "urgency" ? (
              <FormSection title="Urgency and scope" description="Set the priority and scale of the issue.">
                <RadioCardGroup
                  name="urgency"
                  label="Urgency"
                  value={form.urgency}
                  onChange={(value) => setForm({ ...form, urgency: value as MockPriority })}
                  options={mockFixerUrgencyOptions.map((item) => ({
                    value: item.id,
                    label: item.title,
                    description: item.description,
                  }))}
                />
                <RadioCardGroup
                  name="scope"
                  label="Scope"
                  value={form.scope}
                  onChange={(value) => setForm({ ...form, scope: value as MockFixerScope })}
                  options={mockFixerScopeOptions.map((item) => ({
                    value: item.id,
                    label: item.title,
                    description: item.description,
                  }))}
                />
              </FormSection>
            ) : null}

            {step === "context" ? (
              <FormSection title="Context and actions taken" description="Tell us what has already been tried.">
                <TextAreaField
                  label="What has been tried?"
                  value={form.whatHasBeenTried}
                  onChange={(event) => setForm({ ...form, whatHasBeenTried: event.currentTarget.value })}
                  helpText="Include workarounds, conversations, internal actions, supplier/customer responses, or blockers."
                />
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-1 h-5 w-5 text-amber-700" />
                    <p className="text-sm leading-6 text-slate-700">
                      This mock flow does not create legal, HR, operational, or compliance advice. It only captures the intended frontend experience.
                    </p>
                  </div>
                </div>
              </FormSection>
            ) : null}

            {step === "supporting" ? (
              <FormSection title="Supporting information" description="Use mock placeholders only. No files are uploaded.">
                <SelectableCardGrid
                  options={mockFixerSupportingInfoTypes.map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                  }))}
                />
                <FileUploadMock title="Mock Fixer supporting information upload" />
                <CheckboxField
                  checked={form.supportingInfoAcknowledged}
                  onChange={(event) =>
                    setForm({ ...form, supportingInfoAcknowledged: event.currentTarget.checked })
                  }
                  label="I understand no files are uploaded in Phase 1"
                  description="This acknowledgement supports the mock review state only."
                />
              </FormSection>
            ) : null}

            {step === "resolution" ? (
              <FormSection title="Desired resolution" description="Tell us what good looks like.">
                <SelectableCardGrid
                  options={mockFixerDesiredOutcomes.map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                  }))}
                />
                <TextAreaField
                  label="Desired resolution"
                  value={form.desiredResolution}
                  onChange={(event) => setForm({ ...form, desiredResolution: event.currentTarget.value })}
                  helpText="Example: Stabilise this week, create an owner/action plan, and document next steps."
                />
              </FormSection>
            ) : null}

            {step === "review" ? (
              <ReviewSubmit
                title="Review The Fixer request"
                description="Confirm the mock urgent issue request before submitting for simulated triage."
                sections={[
                  {
                    title: "Problem",
                    items: [
                      { label: "Title", value: form.issueTitle || "Not provided" },
                      { label: "Category", value: form.issueCategory },
                      { label: "Description", value: form.issueDescription || "Not provided" },
                    ],
                  },
                  {
                    title: "Impact and urgency",
                    items: [
                      { label: "Impact", value: getImpactLabel(form.businessImpact) },
                      { label: "Urgency", value: getUrgencyLabel(form.urgency) },
                      { label: "Scope", value: getScopeLabel(form.scope) },
                      { label: "Affected stakeholders", value: form.affectedStakeholders || "Not provided" },
                    ],
                  },
                  {
                    title: "Context and outcome",
                    items: [
                      { label: "What has been tried", value: form.whatHasBeenTried || "Not provided" },
                      { label: "Desired resolution", value: form.desiredResolution || "Not provided" },
                      {
                        label: "Upload acknowledgement",
                        value: form.supportingInfoAcknowledged ? "Accepted" : "Not accepted",
                      },
                    ],
                  },
                ]}
                submitLabel="Submit mock Fixer request"
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
                onBack={() => setStep("resolution")}
              />
            )}
          </div>
        </WizardShell>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            {
              title: "No real ticketing",
              text: "The Fixer request does not create a support ticket, admin task, email, or backend workflow.",
              icon: <Wrench className="h-5 w-5" />,
            },
            {
              title: "No real uploads",
              text: "Supporting files are represented by placeholders only. Nothing is stored or transmitted.",
              icon: <ClipboardList className="h-5 w-5" />,
            },
            {
              title: "Mock triage only",
              text: "The confirmation and assignment states are simulated for Phase 1 frontend testing.",
              icon: <CheckCircle className="h-5 w-5" />,
            },
          ].map((item) => (
            <article key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-600 text-white">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {!embedded ? <Footer /> : null}
    </div>
  );
}
