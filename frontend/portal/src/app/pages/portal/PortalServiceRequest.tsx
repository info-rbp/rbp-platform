import { useState } from "react";
import { Link } from "react-router";
import { PortalAdminReference } from "./PortalAdminReference";
import { createServiceRequestRouter } from "../../api/portalServices.api";
import {
  ChevronRight, Zap, Users, BarChart2, Calculator, Tag,
  FileText, Upload, CheckCircle, ArrowRight, X,
} from "lucide-react";

const SERVICE_OPTIONS = [
  { id: "decision-desk",           label: "Decision Desk",          category: "On-Demand Service",   icon: Zap },
  { id: "docushare",               label: "DocuShare",              category: "Document Service",     icon: FileText },
  { id: "connectivity",            label: "Connectivity",           category: "Operations",           icon: Calculator },
  { id: "risk-advisor",            label: "Risk Advisor",           category: "Advisory",             icon: BarChart2 },
  { id: "the-fixer",               label: "The Fixer",              category: "On-Demand Service",    icon: Users },
];

const PRIORITY_OPTIONS = [
  { value: "low",    label: "Low",    sub: "No specific deadline",          color: "text-slate-600 border-slate-200 bg-slate-50" },
  { value: "normal", label: "Normal", sub: "Within 5–7 business days",      color: "text-blue-700 border-blue-200 bg-blue-50" },
  { value: "high",   label: "High",   sub: "Within 2–3 business days",      color: "text-amber-700 border-amber-200 bg-amber-50" },
  { value: "urgent", label: "Urgent", sub: "Response needed within 24 hours",color: "text-red-700 border-red-200 bg-red-50" },
];

const CONTACT_OPTIONS = [
  { value: "email",     label: "Email" },
  { value: "phone",     label: "Phone Call" },
  { value: "video",     label: "Video Call" },
  { value: "no_pref",   label: "No Preference" },
];

export function PortalServiceRequest() {
  const [selectedService, setSelectedService] = useState<string>("");
  const [context, setContext] = useState("");
  const [priority, setPriority] = useState("normal");
  const [contact, setContact] = useState("email");
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!selectedService) e.service = "Please select a service.";
    if (context.trim().length < 20)
      e.context = "Please provide at least 20 characters of context.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);
    const response = await createServiceRequestRouter(selectedService, {
      title: SERVICE_OPTIONS.find((item) => item.id === selectedService)?.label,
      summary: context,
      business_context: context,
      issue_summary: context,
      issue_details: context,
      notes: context,
      priority,
      urgency: priority === "urgent" ? "Urgent" : priority === "high" ? "High" : priority === "low" ? "Low" : "Normal",
      contact_method: contact,
      source_channel: "portal",
      submit: true,
    });
    setSubmitting(false);
    if (!response.ok) {
      setSubmitError(response.error ?? "Service request could not be submitted.");
      return;
    }
    setSubmitted(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
  }

  /* ── Confirmation state ── */
  if (submitted) {
    return (
      <div className="px-4 sm:px-6 py-6 flex items-start justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm max-w-md w-full p-8 flex flex-col items-center text-center mt-8">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 mb-2">Request submitted</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-2">
            Your service request has been received by the RBP team.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            A consultant will review your request and be in touch within <span className="font-semibold text-slate-600">1–2 business days</span>. You can track the progress under <span className="font-semibold text-slate-600">My Services</span>.
          </p>
          <div className="flex flex-col gap-2 w-full">
            <Link
              to="/portal/services"
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm py-3 rounded-xl transition-all"
            >
              Back to My Services <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/portal/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm py-3 rounded-xl transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-2xl">
      <PortalAdminReference
        portalRoute="/portal/services/request"
        controlledBy={["Admin On-Demand Services", "Admin Managed Services", "Admin The Fixer"]}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link to="/portal/services" className="hover:text-blue-700 transition-colors font-semibold">
          My Services
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 font-semibold">Request a Service</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-1">Request a Service</h2>
        <p className="text-sm text-slate-500">
          Tell us what you need and the RBP team will review your request within 1–2 business days.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Service selector */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-3">
            Select a service <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICE_OPTIONS.map((svc) => {
              const Icon = svc.icon;
              const selected = selectedService === svc.id;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => { setSelectedService(svc.id); setErrors((e) => ({ ...e, service: "" })); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                    selected
                      ? "border-blue-700 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    selected ? "bg-blue-700" : "bg-slate-100"
                  }`}>
                    <Icon className={`w-4 h-4 ${selected ? "text-white" : "text-slate-500"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-bold truncate ${selected ? "text-blue-700" : "text-slate-800"}`}>
                      {svc.label}
                    </div>
                    <div className="text-[10px] text-slate-400">{svc.category}</div>
                  </div>
                  {selected && <CheckCircle className="w-4 h-4 text-blue-700 flex-shrink-0 ml-auto" />}
                </button>
              );
            })}
          </div>
          {errors.service && (
            <p className="mt-2 text-xs text-red-600">{errors.service}</p>
          )}
        </div>

        {/* Business context */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            Business context <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Briefly describe what you need and any relevant background. The more context you provide, the faster we can help.
          </p>
          <textarea
            rows={4}
            value={context}
            onChange={(e) => { setContext(e.target.value); setErrors((err) => ({ ...err, context: "" })); }}
            placeholder="e.g. We are a 5-person trade business looking to tender for a local council contract and need guidance on how to put together a compliant submission..."
            className={`w-full px-4 py-3 text-sm border rounded-xl bg-white text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.context ? "border-red-300" : "border-slate-200"
            }`}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.context
              ? <p className="text-xs text-red-600">{errors.context}</p>
              : <span className="text-[10px] text-slate-400">Minimum 20 characters</span>
            }
            <span className="text-[10px] text-slate-400">{context.length} chars</span>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-3">Priority</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRIORITY_OPTIONS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${
                  priority === p.value
                    ? `border-current ${p.color}`
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="text-xs font-bold">{p.label}</span>
                <span className="text-[10px] opacity-70 leading-tight">{p.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact method */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-3">Preferred contact method</label>
          <div className="flex items-center gap-2 flex-wrap">
            {CONTACT_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setContact(c.value)}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                  contact === c.value
                    ? "bg-blue-700 border-blue-700 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* File upload */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            Supporting document <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Attach any relevant files — briefs, contracts, spreadsheets, or existing documentation.
          </p>
          {fileName ? (
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
              <FileText className="w-4 h-4 text-blue-700 flex-shrink-0" />
              <span className="text-xs font-semibold text-blue-800 flex-1 truncate">{fileName}</span>
              <button
                type="button"
                onClick={() => setFileName(null)}
                className="text-blue-400 hover:text-blue-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 px-4 py-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-all">
              <Upload className="w-6 h-6 text-slate-300" />
              <span className="text-xs font-semibold text-slate-500">Click to upload a file</span>
              <span className="text-[10px] text-slate-400">PDF, DOCX, XLSX or PNG up to 10 MB</span>
              <input type="file" className="sr-only" onChange={handleFileChange} />
            </label>
          )}
        </div>

        {/* Submit */}
        {submitError ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {submitError}
          </div>
        ) : null}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all"
          >
            {submitting ? "Submitting..." : "Submit Request"} <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            to="/portal/services"
            className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
