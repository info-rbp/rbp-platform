import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

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
import { DocumentProductCard, PortalStatusCard } from "../../components/domain";
import { ReviewStatusBadge, StatusBadge } from "../../components/status";
import {
  mockDocuShareAudienceOptions,
  mockDocuShareBrandingOptions,
  mockDocuShareDocumentGroups,
  mockDocuShareGroupQuestions,
  mockDocuSharePurposeOptions,
  mockDocuShareStyleOptions,
  mockDocuShareTimeline,
  mockDocumentProducts,
} from "../../mock";
import {
  getMockDocumentProducts,
  submitMockDocuShareBrief,
  type MockDocuShareBriefResult,
} from "../../services/mock/docushare.mockService";
import {
  docuShareFlowStorageKey,
  type DocuShareFlowForm,
  type DocuShareStoredState,
} from "./docushareFlow.types";

type SubmissionState = "idle" | "loading" | "success" | "error";

const flowSteps: StepperStep[] = [
  { id: "welcome", label: "Start", description: "Mock brief" },
  { id: "business", label: "Business", description: "Context" },
  { id: "group", label: "Group", description: "Document type" },
  { id: "purpose", label: "Purpose", description: "Use and audience" },
  { id: "questions", label: "Details", description: "Tailored inputs" },
  { id: "style", label: "Style", description: "Branding" },
  { id: "supporting", label: "Supporting", description: "Mock files" },
  { id: "review", label: "Review", description: "Submit" },
  { id: "confirmation", label: "Status", description: "Portal handoff" },
];

const initialForm: DocuShareFlowForm = {
  businessName: "",
  contactName: "",
  contactEmail: "",
  phone: "",
  industry: "",
  location: "",
  jurisdiction: "Australia",
  businessContext: "",
  documentGroup: "",
  documentCategory: "",
  documentType: "",
  intendedUse: "",
  purpose: "",
  audience: "",
  audienceNotes: "",
  requirementsAnswers: {},
  stylePreference: "",
  brandingPreference: "",
  brandNotes: "",
  supportingNotes: "",
  supportingLinks: "",
  supportingInformationAcknowledged: false,
  acceptedTerms: false,
};

function listValue(items: string[], fallback = "None selected") {
  return items.length > 0 ? items.join(", ") : fallback;
}

function getGroupTitle(groupId: string) {
  return mockDocuShareDocumentGroups.find((group) => group.id === groupId)?.title ?? groupId;
}

function getOptionLabel(options: Array<{ label: string; value: string }>, value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function writeDocuShareSession(payload: DocuShareStoredState) {
  window.sessionStorage.setItem(docuShareFlowStorageKey, JSON.stringify(payload));
}

export function DocuShareOnboardingFlow() {
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category") ?? "";
  const requestedProduct = searchParams.get("product") ?? "";
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [form, setForm] = useState<DocuShareFlowForm>(() => {
    const product = mockDocumentProducts.find((item) => item.id === requestedProduct);
    const category = product?.category ?? requestedCategory;

    return {
      ...initialForm,
      documentGroup: category,
      documentCategory: category,
      documentType: product?.title ?? "",
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [submitResult, setSubmitResult] = useState<MockDocuShareBriefResult | null>(null);
  const [setupReady, setSetupReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    getMockDocumentProducts().then((response) => {
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
  const selectedGroup = mockDocuShareDocumentGroups.find(
    (group) => group.id === form.documentGroup
  );
  const selectedProduct = mockDocumentProducts.find(
    (product) => product.title === form.documentType || product.id === form.documentType
  );
  const groupProducts = mockDocumentProducts.filter(
    (product) => product.category === form.documentGroup
  );
  const groupQuestions = mockDocuShareGroupQuestions[form.documentGroup] ?? [];
  const answeredQuestions = groupQuestions.filter((question) =>
    form.requirementsAnswers[question]?.trim()
  );

  const statusLines = useMemo(
    () => [
      { label: "Business", value: form.businessName || "Draft" },
      { label: "Group", value: selectedGroup?.title ?? "Not selected" },
      { label: "Document", value: form.documentType || "Not selected" },
      {
        label: "Status",
        value: submitResult
          ? "Submitted"
          : submissionState === "loading"
            ? "Submitting"
            : "Draft",
      },
    ],
    [form.businessName, form.documentType, selectedGroup?.title, submissionState, submitResult]
  );

  function updateField<K extends keyof DocuShareFlowForm>(
    field: K,
    value: DocuShareFlowForm[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updateGroup(groupId: string) {
    const firstProduct = mockDocumentProducts.find((product) => product.category === groupId);

    setForm((current) => ({
      ...current,
      documentGroup: groupId,
      documentCategory: groupId,
      documentType:
        current.documentGroup === groupId
          ? current.documentType
          : firstProduct?.title ?? getGroupTitle(groupId),
      requirementsAnswers: {},
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next.documentGroup;
      delete next.documentCategory;
      delete next.documentType;
      return next;
    });
  }

  function updateQuestion(question: string, value: string) {
    setForm((current) => ({
      ...current,
      requirementsAnswers: {
        ...current.requirementsAnswers,
        [question]: value,
      },
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next.requirementsAnswers;
      return next;
    });
  }

  function requireStepFields(fields: Array<keyof DocuShareFlowForm>) {
    const nextErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = form[field];
      const missing = Array.isArray(value) ? value.length === 0 : !value;

      if (missing) {
        nextErrors[field] = "Required for this Phase 1 mock document brief.";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateCurrentStep() {
    if (currentStep.id === "business") {
      return requireStepFields([
        "businessName",
        "contactName",
        "contactEmail",
        "businessContext",
        "jurisdiction",
      ]);
    }

    if (currentStep.id === "group") {
      return requireStepFields(["documentGroup", "documentCategory", "documentType"]);
    }

    if (currentStep.id === "purpose") {
      return requireStepFields(["intendedUse", "purpose", "audience"]);
    }

    if (currentStep.id === "questions") {
      if (groupQuestions.length > 0 && answeredQuestions.length === 0) {
        setErrors({
          requirementsAnswers: "Answer at least one tailored question for this document group.",
        });
        return false;
      }
    }

    if (currentStep.id === "style") {
      return requireStepFields(["stylePreference", "brandingPreference"]);
    }

    if (currentStep.id === "supporting" && !form.supportingInformationAcknowledged) {
      setErrors({
        supportingInformationAcknowledged:
          "Confirm that supporting information is represented by mock placeholders only.",
      });
      return false;
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

  async function submitBrief() {
    if (!validateCurrentStep()) {
      return;
    }

    setSubmissionState("loading");
    setErrors({});

    const response = await submitMockDocuShareBrief({
      businessName: form.businessName,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      documentGroup: form.documentGroup,
      documentType: form.documentType,
      documentCategory: form.documentCategory,
      businessContext: form.businessContext,
      jurisdiction: form.jurisdiction,
      intendedUse: form.intendedUse,
      audience: form.audience,
      purpose: form.purpose,
      stylePreference: form.stylePreference,
      supportingInformationAcknowledged: form.supportingInformationAcknowledged,
    });

    if (!response.ok || !response.data) {
      setSubmissionState("error");
      setErrors(
        Object.fromEntries(response.errors.map((error) => [error.field, error.message]))
      );
      return;
    }

    setSubmitResult(response.data);
    setSubmissionState("success");
    writeDocuShareSession({
      reference: response.data.reference,
      status: response.data.status,
      documentsHref: response.data.documentsHref,
      servicesHref: response.data.servicesHref,
      dashboardHref: response.data.dashboardHref,
      businessName: form.businessName,
      documentType: form.documentType,
      documentGroup: form.documentGroup,
      timeline: response.data.timeline,
    });
    setCurrentStepIndex(flowSteps.findIndex((step) => step.id === "confirmation"));
  }

  const canUseDefaultNavigation = !["review", "confirmation"].includes(currentStep.id);

  return (
    <WizardShell
      eyebrow="DocuShare mock flow"
      title="Create a Document Nucleus brief"
      description="A Phase 1 frontend-only document brief based on the DocuShare Stitch screens. No real files are uploaded, no document is generated or delivered, and no backend, auth, payment or Frappe services are connected."
      steps={flowSteps}
      currentStepId={currentStep.id}
      aside={
        <div className="space-y-4">
          <PortalStatusCard
            title="Document brief"
            description={
              submitResult
                ? `${submitResult.reference} is ready for the mock portal documents handoff.`
                : setupReady
                  ? "Draft brief is using the Step 7 mock DocuShare setup data."
                  : "Loading mock document setup data."
            }
            status={submitResult ? "submitted" : "draft"}
            href="/portal/documents"
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
              <StatusBadge status={form.documentGroup ? "active" : "draft"} label="Group" />
              <StatusBadge status={form.purpose ? "active" : "draft"} label="Purpose" />
              <StatusBadge
                status={form.supportingInformationAcknowledged ? "placeholder" : "draft"}
                label="Mock uploads"
              />
              <StatusBadge status={submitResult ? "submitted" : "draft"} label="Mock submit" />
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            This is a Phase 1 mock document brief. No files are uploaded and no document is
            produced in this flow.
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {currentStep.id === "welcome" ? (
          <div className="space-y-6">
            <FormSection
              title="Let us customise your document"
              description="Start a structured DocuShare brief, choose the kind of document you need, add requirements, then submit a simulated status for frontend review."
            >
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["1", "Tell us the business context"],
                  ["2", "Choose a document group"],
                  ["3", "Review the mock portal handoff"],
                ].map(([number, label]) => (
                  <div key={number} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                      {number}
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-900">{label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-slate-950">Frontend-only guardrails</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <li>No real upload or file storage happens in Phase 1.</li>
                  <li>No document is generated, reviewed, delivered or downloaded.</li>
                  <li>The reference, timeline and portal handoff are simulated mock states.</li>
                </ul>
              </div>
            </FormSection>
            <div className="grid gap-4 md:grid-cols-2">
              {mockDocumentProducts.slice(0, 2).map((product) => (
                <DocumentProductCard
                  key={product.id}
                  title={product.title}
                  category={getGroupTitle(product.category)}
                  description={product.description}
                  href={`/document-nucleus/product/${product.id}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {currentStep.id === "business" ? (
          <FormSection
            title="Tell us about your business"
            description="Capture the business context that will shape this mock document brief."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Business name"
                value={form.businessName}
                onChange={(event) => updateField("businessName", event.currentTarget.value)}
                error={errors.businessName}
                placeholder="Aster Ridge Advisory"
              />
              <TextField
                label="Contact name"
                value={form.contactName}
                onChange={(event) => updateField("contactName", event.currentTarget.value)}
                error={errors.contactName}
                placeholder="Alex Taylor"
              />
              <TextField
                label="Contact email"
                type="email"
                value={form.contactEmail}
                onChange={(event) => updateField("contactEmail", event.currentTarget.value)}
                error={errors.contactEmail}
                placeholder="alex@example.com.au"
              />
              <TextField
                label="Phone"
                value={form.phone}
                onChange={(event) => updateField("phone", event.currentTarget.value)}
                placeholder="0400 000 000"
              />
              <TextField
                label="Industry"
                value={form.industry}
                onChange={(event) => updateField("industry", event.currentTarget.value)}
                placeholder="Professional services"
              />
              <TextField
                label="Location"
                value={form.location}
                onChange={(event) => updateField("location", event.currentTarget.value)}
                placeholder="Perth, WA"
              />
              <SelectField
                label="Jurisdiction"
                value={form.jurisdiction}
                onChange={(event) => updateField("jurisdiction", event.currentTarget.value)}
                error={errors.jurisdiction}
                options={[
                  { label: "Australia", value: "Australia" },
                  { label: "United Kingdom", value: "United Kingdom" },
                  { label: "New Zealand", value: "New Zealand" },
                  { label: "Other / not sure", value: "Other / not sure" },
                ]}
              />
            </div>
            <TextAreaField
              label="Business context"
              value={form.businessContext}
              onChange={(event) => updateField("businessContext", event.currentTarget.value)}
              error={errors.businessContext}
              placeholder="What does the business do, how is it structured, and what context should the document reflect?"
            />
          </FormSection>
        ) : null}

        {currentStep.id === "group" ? (
          <FormSection
            title="What type of document do you need?"
            description="Choose the Document Nucleus group and confirm the document context for this mock brief."
          >
            <SelectableCardGrid
              options={mockDocuShareDocumentGroups.map((group) => ({
                id: group.id,
                title: group.title,
                description: group.description,
                meta: <StatusBadge status="placeholder" label={group.tag} />,
              }))}
              selectedId={form.documentGroup}
              onSelect={updateGroup}
            />
            {errors.documentGroup ? (
              <p className="text-sm font-medium text-red-600">{errors.documentGroup}</p>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Document or product context"
                value={form.documentType}
                onChange={(event) => updateField("documentType", event.currentTarget.value)}
                error={errors.documentType}
                options={(groupProducts.length ? groupProducts : mockDocumentProducts).map((product) => ({
                  label: product.title,
                  value: product.title,
                }))}
              />
              <SelectField
                label="Document category"
                value={form.documentCategory}
                onChange={(event) => updateField("documentCategory", event.currentTarget.value)}
                error={errors.documentCategory}
                options={mockDocuShareDocumentGroups.map((group) => ({
                  label: group.title,
                  value: group.id,
                }))}
              />
            </div>
          </FormSection>
        ) : null}

        {currentStep.id === "purpose" ? (
          <FormSection
            title="What is this document for?"
            description="Define the intended use, reader group and outcome so the simulated brief can show a useful review state."
          >
            <TextField
              label="Intended use"
              value={form.intendedUse}
              onChange={(event) => updateField("intendedUse", event.currentTarget.value)}
              error={errors.intendedUse}
              placeholder="Internal operations, board approval, client onboarding, sales proposal"
            />
            <RadioCardGroup
              name="purpose"
              label="Primary purpose"
              value={form.purpose}
              onChange={(value) => updateField("purpose", value)}
              options={mockDocuSharePurposeOptions}
            />
            {errors.purpose ? (
              <p className="text-sm font-medium text-red-600">{errors.purpose}</p>
            ) : null}
            <RadioCardGroup
              name="audience"
              label="Primary audience"
              value={form.audience}
              onChange={(value) => updateField("audience", value)}
              options={mockDocuShareAudienceOptions}
            />
            {errors.audience ? (
              <p className="text-sm font-medium text-red-600">{errors.audience}</p>
            ) : null}
            <TextAreaField
              label="Audience notes"
              value={form.audienceNotes}
              onChange={(event) => updateField("audienceNotes", event.currentTarget.value)}
              placeholder="Add reader expectations, knowledge level, tone sensitivities or approval constraints."
            />
          </FormSection>
        ) : null}

        {currentStep.id === "questions" ? (
          <FormSection
            title={`Tell us the key details for ${selectedGroup?.title ?? "this document group"}`}
            description="These group-specific questions mirror the Stitch dynamic branch as repo-native React fields."
          >
            {groupQuestions.length > 0 ? (
              <div className="space-y-4">
                {groupQuestions.map((question) => (
                  <TextAreaField
                    key={question}
                    label={question}
                    value={form.requirementsAnswers[question] ?? ""}
                    onChange={(event) => updateQuestion(question, event.currentTarget.value)}
                    placeholder="Add the relevant details for the mock brief."
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">No group selected yet</p>
                <p className="mt-2 text-sm text-slate-600">
                  Go back and choose a document group to load tailored mock questions.
                </p>
              </div>
            )}
            {errors.requirementsAnswers ? (
              <p className="text-sm font-medium text-red-600">{errors.requirementsAnswers}</p>
            ) : null}
          </FormSection>
        ) : null}

        {currentStep.id === "style" ? (
          <FormSection
            title="How should the document look and feel?"
            description="Select style and branding preferences for the mock brief. These do not generate a real document."
          >
            <RadioCardGroup
              name="style-preference"
              label="Style preference"
              value={form.stylePreference}
              onChange={(value) => updateField("stylePreference", value)}
              options={mockDocuShareStyleOptions}
            />
            {errors.stylePreference ? (
              <p className="text-sm font-medium text-red-600">{errors.stylePreference}</p>
            ) : null}
            <RadioCardGroup
              name="branding-preference"
              label="Branding preference"
              value={form.brandingPreference}
              onChange={(value) => updateField("brandingPreference", value)}
              options={mockDocuShareBrandingOptions}
            />
            {errors.brandingPreference ? (
              <p className="text-sm font-medium text-red-600">{errors.brandingPreference}</p>
            ) : null}
            <TextAreaField
              label="Branding notes"
              value={form.brandNotes}
              onChange={(event) => updateField("brandNotes", event.currentTarget.value)}
              placeholder="Logo use, colour preferences, tone of voice, style references, formatting expectations."
            />
          </FormSection>
        ) : null}

        {currentStep.id === "supporting" ? (
          <FormSection
            title="Upload any supporting information"
            description="Represent supporting materials with mock placeholders only. No real file data leaves the browser."
          >
            <FileUploadMock
              title="Supporting document placeholders"
              description="No real files are uploaded. This placeholder represents brand assets, existing policies, sample documents, notes or links."
            />
            <CheckboxField
              checked={form.supportingInformationAcknowledged}
              onChange={(event) =>
                updateField("supportingInformationAcknowledged", event.currentTarget.checked)
              }
              label="I understand no files are uploaded in Phase 1"
              description="This confirms the upload area is only a frontend mock placeholder."
            />
            {errors.supportingInformationAcknowledged ? (
              <p className="text-sm font-medium text-red-600">
                {errors.supportingInformationAcknowledged}
              </p>
            ) : null}
            <TextAreaField
              label="Supporting notes"
              value={form.supportingNotes}
              onChange={(event) => updateField("supportingNotes", event.currentTarget.value)}
              placeholder="Summarise any supporting material you would provide in a real flow."
            />
            <TextField
              label="Relevant links"
              value={form.supportingLinks}
              onChange={(event) => updateField("supportingLinks", event.currentTarget.value)}
              placeholder="https://example.com"
            />
          </FormSection>
        ) : null}

        {currentStep.id === "review" ? (
          <div className="space-y-4">
            <MockSubmissionState
              state={submissionState}
              idleMessage="Ready to submit this Phase 1 mock DocuShare brief."
              loadingMessage="Submitting mock DocuShare brief..."
              successMessage="Mock DocuShare brief submitted."
              errorMessage="Mock submission failed. Review the highlighted fields."
            />
            <ReviewSubmit
              title="Review your document brief"
              description="Confirm the mock details before submitting. No real document will be produced, delivered or stored."
              submitLabel="Submit mock document brief"
              isSubmitting={submissionState === "loading"}
              onSubmit={submitBrief}
              sections={[
                {
                  title: "Business details",
                  items: [
                    { label: "Business", value: form.businessName || "Missing" },
                    { label: "Contact", value: form.contactName || "Missing" },
                    { label: "Email", value: form.contactEmail || "Missing" },
                    { label: "Jurisdiction", value: form.jurisdiction || "Missing" },
                    { label: "Context", value: form.businessContext || "Missing" },
                  ],
                },
                {
                  title: "Document selection",
                  items: [
                    { label: "Group", value: selectedGroup?.title ?? "Missing" },
                    { label: "Document", value: form.documentType || "Missing" },
                    { label: "Product context", value: selectedProduct?.id ?? "Custom mock brief" },
                  ],
                },
                {
                  title: "Purpose and audience",
                  items: [
                    { label: "Intended use", value: form.intendedUse || "Missing" },
                    {
                      label: "Purpose",
                      value: getOptionLabel(mockDocuSharePurposeOptions, form.purpose) || "Missing",
                    },
                    {
                      label: "Audience",
                      value: getOptionLabel(mockDocuShareAudienceOptions, form.audience) || "Missing",
                    },
                    { label: "Audience notes", value: form.audienceNotes || "Not provided" },
                  ],
                },
                {
                  title: "Tailored questions",
                  items: [
                    {
                      label: "Answered",
                      value: `${answeredQuestions.length} of ${groupQuestions.length} questions`,
                    },
                    {
                      label: "Question topics",
                      value: listValue(answeredQuestions, "No tailored answers yet"),
                    },
                  ],
                },
                {
                  title: "Style, branding and supporting information",
                  items: [
                    {
                      label: "Style",
                      value:
                        getOptionLabel(mockDocuShareStyleOptions, form.stylePreference) ||
                        "Missing",
                    },
                    {
                      label: "Branding",
                      value:
                        getOptionLabel(mockDocuShareBrandingOptions, form.brandingPreference) ||
                        "Missing",
                    },
                    {
                      label: "Mock uploads",
                      value: form.supportingInformationAcknowledged
                        ? "Acknowledged as placeholder only"
                        : "Missing acknowledgement",
                    },
                    { label: "Supporting notes", value: form.supportingNotes || "Not provided" },
                  ],
                },
              ]}
            />
            <TermsAcceptance
              checked={form.acceptedTerms}
              onChange={(checked) => updateField("acceptedTerms", checked)}
            />
            {errors.acceptedTerms ? (
              <p className="text-sm font-medium text-red-600">{errors.acceptedTerms}</p>
            ) : null}
          </div>
        ) : null}

        {currentStep.id === "confirmation" ? (
          <div className="space-y-6">
            <ConfirmationPanel
              title="Your document brief has been submitted"
              message="This is a Phase 1 mock submission. No files were uploaded, no document is being produced, and the status below is simulated for frontend review."
              reference={submitResult?.reference}
              statusLabel="Mock brief submitted"
              primaryAction={
                <Link
                  to={submitResult?.documentsHref ?? "/portal/documents"}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  View portal documents
                </Link>
              }
              secondaryAction={
                <Link
                  to={submitResult?.servicesHref ?? "/portal/services"}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  View portal services
                </Link>
              }
            />
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-950">Simulated status timeline</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    This status is simulated for frontend review and portal handoff testing.
                  </p>
                </div>
                <Link
                  to={submitResult?.dashboardHref ?? "/portal/dashboard"}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Go to dashboard
                </Link>
              </div>
              <div className="mt-5">
                <StatusTimeline items={submitResult?.timeline ?? mockDocuShareTimeline} />
              </div>
            </div>
          </div>
        ) : null}

        {canUseDefaultNavigation ? (
          <StepNavigation
            canGoBack={currentStepIndex > 0}
            backLabel={currentStep.id === "welcome" ? "Back" : "Back"}
            continueLabel={currentStep.id === "welcome" ? "Start brief" : "Continue"}
            onBack={goBack}
            onContinue={goNext}
          />
        ) : null}
      </div>
    </WizardShell>
  );
}
