import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import {
  ConfirmationPanel,
  MockSubmissionState,
  ReviewSubmit,
  StatusTimeline,
  StepNavigation,
  WizardShell,
  type StepperStep,
} from "../../components/flow";
import {
  CheckboxField,
  FileUploadMock,
  FormSection,
  RadioCardGroup,
  SelectableCardGrid,
  SelectField,
  TermsAcceptance,
  TextAreaField,
  TextField,
} from "../../components/forms";
import { PortalStatusCard } from "../../components/domain";
import { ReviewStatusBadge, StatusBadge } from "../../components/status";
import {
  mockDecisionDeskBusinessSizeOptions,
  mockDecisionDeskBusinessStageOptions,
  mockDecisionDeskCategories,
  mockDecisionDeskConstraintOptions,
  mockDecisionDeskHelpTypes,
  mockDecisionDeskOutcomeOptions,
  mockDecisionDeskSupportingInfoTypes,
  mockDecisionDeskUrgencyOptions,
} from "../../mock";
import {
  getMockDecisionDeskSetup,
  submitMockDecisionDeskRequest,
  type MockDecisionDeskSubmitResult,
} from "../../services/mock/decisionDesk.mockService";
import type { MockDecisionDeskPayload } from "../../services/mock/decisionDesk.mockService";
import {
  decisionDeskFlowStorageKey,
  type DecisionDeskFlowForm,
  type DecisionDeskStoredState,
} from "./decisionDeskFlow.types";

type SubmissionState = "idle" | "loading" | "success" | "error";

const flowSteps: StepperStep[] = [
  { id: "business", label: "Business", description: "Your context" },
  { id: "issue", label: "Issue", description: "Core decision" },
  { id: "situation", label: "Situation", description: "What is happening" },
  { id: "constraints", label: "Constraints", description: "Options and urgency" },
  { id: "supporting", label: "Supporting", description: "Mock files" },
  { id: "review", label: "Review", description: "Submit request" },
  { id: "confirmation", label: "Status", description: "Portal handoff" },
];

const initialForm: DecisionDeskFlowForm = {
  fullName: "",
  email: "",
  businessName: "",
  industry: "",
  location: "",
  businessSize: "",
  businessStage: "",
  decisionCategory: "",
  helpType: "",
  decisionTitle: "",
  decisionSummary: "",
  desiredOutcome: "",
  currentSituation: "",
  situationDuration: "",
  trigger: "",
  stakeholders: "",
  triedAlready: "",
  currentTools: "",
  optionsConsidered: "",
  constraints: [],
  budgetRange: "",
  targetDeadline: "",
  urgency: "medium",
  internalCapacity: "",
  mainRisks: "",
  preferredOutcomeType: "",
  supportingInfoTypes: [],
  supportingNotes: "",
  relevantLinks: "",
  filesAcknowledged: false,
  acceptedTerms: false,
};

function listValue(items: string[], fallback = "None selected") {
  return items.length > 0 ? items.join(", ") : fallback;
}

function writeDecisionDeskSession(payload: DecisionDeskStoredState) {
  window.sessionStorage.setItem(decisionDeskFlowStorageKey, JSON.stringify(payload));
}

export function DecisionDeskFlow() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [form, setForm] = useState<DecisionDeskFlowForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [submitResult, setSubmitResult] = useState<MockDecisionDeskSubmitResult | null>(null);
  const [setupReady, setSetupReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    getMockDecisionDeskSetup().then((response) => {
      if (!mounted) {
        return;
      }

      setSetupReady(response.ok);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const currentStep = flowSteps[currentStepIndex] ?? flowSteps[0];
  const selectedConstraintLabels = mockDecisionDeskConstraintOptions
    .filter((option) => form.constraints.includes(option.id))
    .map((option) => option.title);
  const selectedSupportingTypes = form.supportingInfoTypes;

  const statusLines = useMemo(
    () => [
      { label: "Business", value: form.businessName || "Draft" },
      { label: "Category", value: form.decisionCategory || "Not selected" },
      { label: "Urgency", value: form.urgency || "Not selected" },
      {
        label: "Status",
        value: submitResult
          ? "Submitted"
          : submissionState === "loading"
            ? "Submitting"
            : "Draft",
      },
    ],
    [form.businessName, form.decisionCategory, form.urgency, submissionState, submitResult]
  );

  function updateField<K extends keyof DecisionDeskFlowForm>(
    field: K,
    value: DecisionDeskFlowForm[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function toggleListField(field: "constraints" | "supportingInfoTypes", value: string) {
    const currentValues = form[field];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    updateField(field, nextValues);
  }

  function requireStepFields(fields: Array<keyof DecisionDeskFlowForm>) {
    const nextErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = form[field];
      const missing = Array.isArray(value) ? value.length === 0 : !value;

      if (missing) {
        nextErrors[field] = "Required for this Phase 1 mock flow.";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateCurrentStep() {
    if (currentStep.id === "business") {
      return requireStepFields(["businessName", "industry"]);
    }

    if (currentStep.id === "issue") {
      return requireStepFields([
        "decisionCategory",
        "helpType",
        "decisionTitle",
        "decisionSummary",
        "desiredOutcome",
      ]);
    }

    if (currentStep.id === "situation") {
      return requireStepFields(["currentSituation"]);
    }

    if (currentStep.id === "constraints") {
      return requireStepFields(["optionsConsidered", "constraints", "urgency"]);
    }

    if (currentStep.id === "review" && !form.acceptedTerms) {
      setErrors({ acceptedTerms: "Accept the mock Phase 1 terms before submitting." });
      return false;
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

  async function submitRequest() {
    if (!validateCurrentStep()) {
      return;
    }

    setSubmissionState("loading");
    setErrors({});

    const response = await submitMockDecisionDeskRequest(form as unknown as MockDecisionDeskPayload);

    if (!response.ok || !response.data) {
      setSubmissionState("error");
      setErrors(
        Object.fromEntries(response.errors.map((error) => [error.field, error.message]))
      );
      return;
    }

    setSubmitResult(response.data);
    setSubmissionState("success");
    writeDecisionDeskSession({
      reference: response.data.reference,
      status: response.data.status,
      requestHref: response.data.requestHref,
      title: form.decisionTitle,
      businessName: form.businessName,
      category: form.decisionCategory,
      urgency: form.urgency,
      timeline: response.data.timeline,
    });
    setCurrentStepIndex(flowSteps.findIndex((step) => step.id === "confirmation"));
  }

  const canUseDefaultNavigation = !["review", "confirmation"].includes(currentStep.id);

  return (
    <WizardShell
      eyebrow="Decision Desk mock flow"
      title="Submit a Decision Desk request"
      description="A Phase 1 frontend-only advisory intake based on the Decision Desk Stitch screens. No real advisor is assigned, no files are uploaded, and no backend, auth, payment, or Frappe services are connected."
      steps={flowSteps}
      currentStepId={currentStep.id}
      aside={
        <div className="space-y-4">
          <PortalStatusCard
            title="Decision Desk request"
            description={
              submitResult
                ? `${submitResult.reference} is ready for the mock portal services handoff.`
                : setupReady
                  ? "Draft request is using the Step 7 mock setup data."
                  : "Loading mock setup data."
            }
            status={submitResult ? "submitted" : "draft"}
            href="/portal/services"
          />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-950">Flow state</h3>
              <ReviewStatusBadge state={submitResult ? "pending" : "needs-info"} />
            </div>
            <dl className="mt-4 space-y-3">
              {statusLines.map((line) => (
                <div key={line.label} className="flex items-center justify-between gap-4 text-sm">
                  <dt className="text-slate-500">{line.label}</dt>
                  <dd className="text-right font-semibold text-slate-900">{line.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge status={form.businessName ? "active" : "draft"} label="Business" />
              <StatusBadge status={form.decisionTitle ? "active" : "draft"} label="Issue" />
              <StatusBadge status={form.currentSituation ? "active" : "draft"} label="Situation" />
              <StatusBadge status={submitResult ? "submitted" : "draft"} label="Mock submit" />
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {currentStep.id === "business" ? (
          <FormSection
            title="About your business"
            description="Start with the business context that will frame the mock advisory response."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Full name"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.currentTarget.value)}
                placeholder="Alex Taylor"
              />
              <TextField
                label="Email address"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.currentTarget.value)}
                placeholder="alex@example.com.au"
              />
              <TextField
                label="Business name"
                value={form.businessName}
                onChange={(event) => updateField("businessName", event.currentTarget.value)}
                error={errors.businessName}
                placeholder="Aster Ridge Advisory"
              />
              <SelectField
                label="Industry"
                value={form.industry}
                onChange={(event) => updateField("industry", event.currentTarget.value)}
                error={errors.industry}
                options={mockDecisionDeskCategories.map((category) => ({
                  label: category,
                  value: category,
                }))}
              />
              <TextField
                label="Location"
                value={form.location}
                onChange={(event) => updateField("location", event.currentTarget.value)}
                placeholder="Perth, WA"
              />
              <SelectField
                label="Business stage"
                value={form.businessStage}
                onChange={(event) => updateField("businessStage", event.currentTarget.value)}
                options={mockDecisionDeskBusinessStageOptions}
              />
            </div>
            <RadioCardGroup
              name="business-size"
              label="Business size"
              value={form.businessSize}
              onChange={(value) => updateField("businessSize", value)}
              options={mockDecisionDeskBusinessSizeOptions.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
            />
          </FormSection>
        ) : null}

        {currentStep.id === "issue" ? (
          <FormSection
            title="The issue or decision"
            description="Define the main question, decision type, and outcome you want from the mock advisory review."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Issue category"
                value={form.decisionCategory}
                onChange={(event) => updateField("decisionCategory", event.currentTarget.value)}
                error={errors.decisionCategory}
                options={mockDecisionDeskCategories.map((category) => ({
                  label: category,
                  value: category,
                }))}
              />
              <TextField
                label="Decision being considered"
                value={form.decisionTitle}
                onChange={(event) => updateField("decisionTitle", event.currentTarget.value)}
                error={errors.decisionTitle}
                placeholder="Choose operating model for expansion"
              />
            </div>
            <SelectableCardGrid
              options={mockDecisionDeskHelpTypes}
              selectedId={form.helpType}
              onSelect={(value) => updateField("helpType", value)}
            />
            {errors.helpType ? (
              <p className="text-sm font-medium text-red-600">{errors.helpType}</p>
            ) : null}
            <TextAreaField
              label="The main question"
              value={form.decisionSummary}
              onChange={(event) => updateField("decisionSummary", event.currentTarget.value)}
              error={errors.decisionSummary}
              placeholder="What keeps you up at night about this decision?"
            />
            <TextField
              label="Desired outcome"
              value={form.desiredOutcome}
              onChange={(event) => updateField("desiredOutcome", event.currentTarget.value)}
              error={errors.desiredOutcome}
              placeholder="A practical recommendation and first three next steps"
            />
          </FormSection>
        ) : null}

        {currentStep.id === "situation" ? (
          <FormSection
            title="Current situation"
            description="Add the current context, stakeholders, attempts so far, and systems or processes involved."
          >
            <TextAreaField
              label="What is happening"
              value={form.currentSituation}
              onChange={(event) => updateField("currentSituation", event.currentTarget.value)}
              error={errors.currentSituation}
              placeholder="Describe the current state of affairs in detail."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="How long has it been happening"
                value={form.situationDuration}
                onChange={(event) => updateField("situationDuration", event.currentTarget.value)}
                placeholder="3 months"
              />
              <TextField
                label="What triggered the issue"
                value={form.trigger}
                onChange={(event) => updateField("trigger", event.currentTarget.value)}
                placeholder="New client demand, staff change, funding decision"
              />
            </div>
            <TextField
              label="Who is involved"
              value={form.stakeholders}
              onChange={(event) => updateField("stakeholders", event.currentTarget.value)}
              placeholder="Owners, leadership team, finance partner, key customers"
            />
            <TextAreaField
              label="What has already been tried"
              value={form.triedAlready}
              onChange={(event) => updateField("triedAlready", event.currentTarget.value)}
              placeholder="List previous attempts to resolve the issue."
            />
            <TextAreaField
              label="Current tools, systems, or processes"
              value={form.currentTools}
              onChange={(event) => updateField("currentTools", event.currentTarget.value)}
              placeholder="Describe the systems, workflows, spreadsheets, or meetings currently involved."
            />
          </FormSection>
        ) : null}

        {currentStep.id === "constraints" ? (
          <FormSection
            title="Options, constraints and urgency"
            description="Capture the paths already being considered, practical limits, and how quickly this needs a mock response."
          >
            <TextAreaField
              label="Options already being considered"
              value={form.optionsConsidered}
              onChange={(event) => updateField("optionsConsidered", event.currentTarget.value)}
              error={errors.optionsConsidered}
              placeholder="Internal restructuring, managed service, contractor support, waiting until next quarter."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Budget range"
                value={form.budgetRange}
                onChange={(event) => updateField("budgetRange", event.currentTarget.value)}
                options={[
                  { label: "Under $5k", value: "under-5k" },
                  { label: "$5k-$25k", value: "5k-25k" },
                  { label: "$25k-$100k", value: "25k-100k" },
                  { label: "$100k+", value: "100k-plus" },
                  { label: "Not sure yet", value: "not-sure" },
                ]}
              />
              <TextField
                label="Target deadline"
                type="date"
                value={form.targetDeadline}
                onChange={(event) => updateField("targetDeadline", event.currentTarget.value)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {mockDecisionDeskConstraintOptions.map((option) => (
                <CheckboxField
                  key={option.id}
                  checked={form.constraints.includes(option.id)}
                  onChange={() => toggleListField("constraints", option.id)}
                  label={option.title}
                  description={option.description}
                />
              ))}
            </div>
            {errors.constraints ? (
              <p className="text-sm font-medium text-red-600">{errors.constraints}</p>
            ) : null}
            <RadioCardGroup
              name="urgency"
              label="Urgency level"
              value={form.urgency}
              onChange={(value) => updateField("urgency", value as DecisionDeskFlowForm["urgency"])}
              options={mockDecisionDeskUrgencyOptions}
            />
            {errors.urgency ? (
              <p className="text-sm font-medium text-red-600">{errors.urgency}</p>
            ) : null}
            <RadioCardGroup
              name="internal-capacity"
              label="Internal capacity"
              value={form.internalCapacity}
              onChange={(value) => updateField("internalCapacity", value)}
              options={[
                { label: "Low", value: "low", description: "The team has limited room to execute." },
                { label: "Moderate", value: "moderate", description: "Some capacity exists with trade-offs." },
                { label: "Strong", value: "strong", description: "The team can act once direction is clear." },
              ]}
            />
            <TextAreaField
              label="Main risks or concerns"
              value={form.mainRisks}
              onChange={(event) => updateField("mainRisks", event.currentTarget.value)}
              placeholder="Legal exposure, customer impact, competitor response, team retention, cash flow."
            />
            <SelectableCardGrid
              options={mockDecisionDeskOutcomeOptions}
              selectedId={form.preferredOutcomeType}
              onSelect={(value) => updateField("preferredOutcomeType", value)}
            />
          </FormSection>
        ) : null}

        {currentStep.id === "supporting" ? (
          <FormSection
            title="Supporting information"
            description="Add mock-only attachment intent, notes, and links. No files are uploaded in Phase 1."
          >
            <FileUploadMock
              title="Supporting attachments"
              description="No real files are uploaded. This placeholder represents financial snapshots, proposals, process notes, or stakeholder feedback."
            />
            <CheckboxField
              checked={form.filesAcknowledged}
              onChange={(event) => updateField("filesAcknowledged", event.currentTarget.checked)}
              label="I understand no files are uploaded in Phase 1"
              description="This keeps the mock flow explicit and frontend-only."
            />
            <div className="grid gap-3 md:grid-cols-2">
              {mockDecisionDeskSupportingInfoTypes.map((type) => (
                <CheckboxField
                  key={type}
                  checked={form.supportingInfoTypes.includes(type)}
                  onChange={() => toggleListField("supportingInfoTypes", type)}
                  label={type}
                  description="Mark this as a mock supporting information placeholder."
                />
              ))}
            </div>
            <TextAreaField
              label="Additional context and notes"
              value={form.supportingNotes}
              onChange={(event) => updateField("supportingNotes", event.currentTarget.value)}
              placeholder="Tell us about nuances, history, assumptions, or data not covered elsewhere."
            />
            <TextField
              label="Relevant links"
              type="url"
              value={form.relevantLinks}
              onChange={(event) => updateField("relevantLinks", event.currentTarget.value)}
              placeholder="https://example.com"
            />
          </FormSection>
        ) : null}

        {currentStep.id === "review" ? (
          <div className="space-y-4">
            <MockSubmissionState
              state={submissionState}
              idleMessage="Ready to submit this Phase 1 mock Decision Desk request."
              loadingMessage="Submitting mock Decision Desk request..."
              successMessage="Mock Decision Desk request submitted."
              errorMessage="Mock submission failed. Review the highlighted fields."
            />
            <ReviewSubmit
              title="Review and submit"
              description="Ensure the mock request is accurate before submitting. This is not a real advisory engagement and no real advisor has been assigned."
              submitLabel="Submit advisory request"
              isSubmitting={submissionState === "loading"}
              onSubmit={submitRequest}
              sections={[
                {
                  title: "Business context",
                  items: [
                    { label: "Business", value: form.businessName || "Missing" },
                    { label: "Industry", value: form.industry || "Missing" },
                    { label: "Size", value: form.businessSize || "Not provided" },
                    { label: "Stage", value: form.businessStage || "Not provided" },
                  ],
                },
                {
                  title: "Decision",
                  items: [
                    { label: "Category", value: form.decisionCategory || "Missing" },
                    { label: "Decision", value: form.decisionTitle || "Missing" },
                    { label: "Main question", value: form.decisionSummary || "Missing" },
                    { label: "Desired outcome", value: form.desiredOutcome || "Missing" },
                  ],
                },
                {
                  title: "Situation and constraints",
                  items: [
                    { label: "Current situation", value: form.currentSituation || "Missing" },
                    { label: "Options", value: form.optionsConsidered || "Missing" },
                    { label: "Constraints", value: listValue(selectedConstraintLabels) },
                    { label: "Urgency", value: form.urgency || "Missing" },
                  ],
                },
                {
                  title: "Supporting information",
                  description: "These are placeholders only; Phase 1 does not upload files.",
                  items: [
                    { label: "Mock file acknowledgement", value: form.filesAcknowledged ? "Accepted" : "Not accepted" },
                    { label: "Info types", value: listValue(selectedSupportingTypes) },
                    { label: "Notes", value: form.supportingNotes || "Not provided" },
                    { label: "Links", value: form.relevantLinks || "Not provided" },
                  ],
                },
              ]}
            />
            <div className="space-y-2">
              <TermsAcceptance
                checked={form.acceptedTerms}
                onChange={(checked) => updateField("acceptedTerms", checked)}
              />
              {errors.acceptedTerms ? (
                <p className="text-sm font-medium text-red-600">{errors.acceptedTerms}</p>
              ) : null}
              {Object.entries(errors)
                .filter(([field]) => field !== "acceptedTerms")
                .map(([field, message]) => (
                  <p key={field} className="text-sm font-medium text-red-600">
                    {message}
                  </p>
                ))}
            </div>
            <StepNavigation canGoBack onBack={goBack} canContinue={false} />
          </div>
        ) : null}

        {currentStep.id === "confirmation" && submitResult ? (
          <div className="space-y-6">
            <ConfirmationPanel
              title="Decision Desk request submitted"
              statusLabel="Phase 1 mock submission received"
              message="Your request has moved into a simulated submitted state. No real advisor has been assigned and no backend record, upload, payment, auth session, or Frappe document was created."
              reference={submitResult.reference}
              primaryAction={
                <Link
                  to="/portal/services"
                  className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
                >
                  View portal services
                </Link>
              }
              secondaryAction={
                <Link
                  to="/portal/dashboard"
                  className="rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700"
                >
                  Go to dashboard
                </Link>
              }
            />
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Mock status timeline</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    The timeline is returned by the mock Decision Desk service.
                  </p>
                </div>
                <StatusBadge status="submitted" label="Portal handoff ready" />
              </div>
              <StatusTimeline items={submitResult.timeline} />
            </section>
          </div>
        ) : null}

        {canUseDefaultNavigation ? (
          <StepNavigation
            canGoBack={currentStepIndex > 0}
            onBack={goBack}
            onContinue={goNext}
            continueLabel={
              currentStep.id === "supporting" ? "Next: Review and submit" : "Continue"
            }
          />
        ) : null}
      </div>
    </WizardShell>
  );
}
