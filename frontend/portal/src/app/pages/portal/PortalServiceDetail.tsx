import { Link, useParams } from "react-router";
import {
  ChevronRight, CheckCircle, Clock, FileText, CalendarCheck,
  Users, AlertCircle, ArrowRight, MessageSquare, Download,
} from "lucide-react";
import { SERVICES, type ServiceStatus } from "./portalServicesModel";

// ── Timeline step types ──────────────────────────────────────────────────────
type StepState = "done" | "active" | "pending";

interface TimelineStep {
  label: string;
  note?: string;
  state: StepState;
}

// ── Mock detail data keyed by service ID ─────────────────────────────────────
interface ServiceDetail {
  consultant?: { name: string; role: string; initials: string };
  timeline: TimelineStep[];
  documents: { name: string; date: string; size: string }[];
  sessions: { title: string; date: string; consultant: string }[];
  activity: { text: string; date: string; type: "system" | "consultant" | "client" }[];
}

const DETAIL_DATA: Record<string, ServiceDetail> = {
  "decision-desk": {
    consultant: { name: "James Reynolds", role: "Senior Business Adviser", initials: "JR" },
    timeline: [
      { label: "Requested",       note: "3 May 2026",  state: "done" },
      { label: "Reviewed",        note: "4 May 2026",  state: "done" },
      { label: "In Progress",     note: "Active now",  state: "active" },
      { label: "Awaiting Client", note: "Pending",     state: "pending" },
      { label: "Completed",       note: "—",           state: "pending" },
    ],
    documents: [
      { name: "Decision Brief — Initial Submission", date: "3 May 2026", size: "480 KB" },
    ],
    sessions: [
      { title: "Decision Desk Check-In", date: "Fri 9 May 2026, 11:00 AM", consultant: "James Reynolds" },
    ],
    activity: [
      { text: "Consultant has reviewed your brief and added 3 clarifying questions.",   date: "4 May 2026",  type: "consultant" },
      { text: "Request status updated to In Progress.",                                 date: "4 May 2026",  type: "system" },
      { text: "You submitted your Decision Desk request.",                              date: "3 May 2026",  type: "client" },
    ],
  },
  "hr-services": {
    consultant: { name: "Amanda Kowalski", role: "HR Advisory Specialist", initials: "AK" },
    timeline: [
      { label: "Requested",       note: "30 Apr 2026", state: "done" },
      { label: "Reviewed",        note: "Pending",     state: "active" },
      { label: "In Progress",     note: "—",           state: "pending" },
      { label: "Awaiting Client", note: "—",           state: "pending" },
      { label: "Completed",       note: "—",           state: "pending" },
    ],
    documents: [],
    sessions: [],
    activity: [
      { text: "Request received. A consultant will review within 1–2 business days.", date: "30 Apr 2026", type: "system" },
      { text: "You submitted an HR Services request.",                                date: "30 Apr 2026", type: "client" },
    ],
  },
  "business-health-snapshot": {
    consultant: { name: "James Reynolds", role: "Senior Business Adviser", initials: "JR" },
    timeline: [
      { label: "Requested",       note: "15 Mar 2026", state: "done" },
      { label: "Reviewed",        note: "17 Mar 2026", state: "done" },
      { label: "In Progress",     note: "20 Mar 2026", state: "done" },
      { label: "Awaiting Client", note: "25 Mar 2026", state: "done" },
      { label: "Completed",       note: "1 May 2026",  state: "active" },
    ],
    documents: [
      { name: "Business Health Assessment Report", date: "1 May 2026",  size: "1.2 MB" },
      { name: "Q2 Strategy Action Plan",            date: "1 May 2026",  size: "840 KB" },
    ],
    sessions: [
      { title: "Business Health Review Session",  date: "Wed 25 Mar 2026, 10:00 AM", consultant: "James Reynolds" },
      { title: "Monthly Strategy Session",        date: "Tue 12 May 2026, 10:00 AM", consultant: "James Reynolds" },
    ],
    activity: [
      { text: "Business Health Snapshot report finalised and uploaded to Documents.",  date: "1 May 2026",  type: "consultant" },
      { text: "Awaiting your sign-off on the action plan.",                            date: "26 Mar 2026", type: "system" },
      { text: "Review session completed. Action plan drafted.",                        date: "25 Mar 2026", type: "consultant" },
      { text: "Data collection phase started.",                                        date: "20 Mar 2026", type: "system" },
      { text: "Request reviewed and accepted.",                                        date: "17 Mar 2026", type: "system" },
      { text: "You activated the Business Health Snapshot service.",                   date: "15 Mar 2026", type: "client" },
    ],
  },
  "finance-calculator-pack": {
    timeline: [
      { label: "Requested",   state: "pending" },
      { label: "Reviewed",    state: "pending" },
      { label: "In Progress", state: "pending" },
      { label: "Awaiting Client", state: "pending" },
      { label: "Completed",   state: "pending" },
    ],
    documents: [],
    sessions: [],
    activity: [],
  },
  "xero-partner-offer": {
    consultant: { name: "James Reynolds", role: "Senior Business Adviser", initials: "JR" },
    timeline: [
      { label: "Requested",       note: "20 Apr 2026", state: "done" },
      { label: "Reviewed",        note: "20 Apr 2026", state: "done" },
      { label: "In Progress",     note: "20 Apr 2026", state: "done" },
      { label: "Awaiting Client", note: "—",           state: "done" },
      { label: "Completed",       note: "20 Apr 2026", state: "done" },
    ],
    documents: [
      { name: "Xero Offer Confirmation", date: "20 Apr 2026", size: "210 KB" },
    ],
    sessions: [],
    activity: [
      { text: "Xero partner offer activated successfully. 3 months free subscription applied.", date: "20 Apr 2026", type: "system" },
      { text: "You redeemed the Xero partner offer.",                                           date: "20 Apr 2026", type: "client" },
    ],
  },
};

const STATUS_COLOR: Record<ServiceStatus, string> = {
  Active:        "bg-emerald-50 text-emerald-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Requested:     "bg-blue-50 text-blue-700",
  Completed:     "bg-slate-100 text-slate-600",
  Available:     "bg-violet-50 text-violet-700",
};

const ACTIVITY_STYLE = {
  system:     { color: "bg-slate-100", icon: <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> },
  consultant: { color: "bg-blue-50",   icon: <Users       className="w-3.5 h-3.5 text-blue-500" /> },
  client:     { color: "bg-emerald-50",icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> },
};

export function PortalServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const service = SERVICES.find((s) => s.id === id);
  const detail = id ? DETAIL_DATA[id] : null;

  /* ── Not found ── */
  if (!service || !detail) {
    return (
      <div className="px-4 sm:px-6 py-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <FileText className="w-7 h-7 text-slate-300" />
        </div>
        <div className="text-sm font-bold text-slate-700 mb-2">Service not found</div>
        <p className="text-xs text-slate-400 mb-5">
          This service doesn't exist or has been removed.
        </p>
        <Link
          to="/portal/services"
          className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
        >
          Back to My Services <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const Icon = service.icon;
  const isAvailable = service.status === "Available";

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link to="/portal/services" className="hover:text-blue-700 transition-colors font-semibold">
          My Services
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 font-semibold">{service.title}</span>
      </nav>

      {/* Service header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 mb-0.5">{service.title}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                  {service.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_COLOR[service.status]}`}>
                  {service.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAvailable ? (
              <Link
                to="/portal/services/request"
                className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
              >
                Request This Service <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/portal/support"
                  className="inline-flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Message Team
                </Link>
                <Link
                  to="/portal/sessions"
                  className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  Book Session
                </Link>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed mt-4 border-t border-slate-50 pt-4">
          {service.description}
        </p>

        {!isAvailable && service.lastUpdated !== "—" && (
          <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-400">
            <Clock className="w-3 h-3" /> Last updated {service.lastUpdated}
          </div>
        )}
      </div>

      {/* Available CTA */}
      {isAvailable && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-blue-900 mb-0.5">This service is available to activate</div>
            <p className="text-xs text-blue-700">
              Submit a request and the RBP team will be in touch within 1–2 business days.
            </p>
          </div>
          <Link
            to="/portal/services/request"
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex-shrink-0"
          >
            Request Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main detail grid */}
      {!isAvailable && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT — Timeline + Activity */}
          <div className="lg:col-span-2 space-y-5">

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900">Progress</h3>
              </div>
              <div className="px-5 py-5">
                <ol className="relative">
                  {detail.timeline.map((step, i) => {
                    const isLast = i === detail.timeline.length - 1;
                    return (
                      <li key={step.label} className="flex gap-4 relative">
                        {/* Connector line */}
                        {!isLast && (
                          <div
                            className={`absolute left-[11px] top-7 w-0.5 h-full -mb-2 ${
                              step.state === "done" ? "bg-blue-200" : "bg-slate-100"
                            }`}
                          />
                        )}
                        {/* Step icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {step.state === "done" ? (
                            <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center">
                              <CheckCircle className="w-3.5 h-3.5 text-white" />
                            </div>
                          ) : step.state === "active" ? (
                            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center ring-4 ring-amber-100">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-200 bg-white" />
                          )}
                        </div>
                        {/* Step text */}
                        <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                          <div className={`text-xs font-bold ${
                            step.state === "done" ? "text-slate-800"
                            : step.state === "active" ? "text-amber-700"
                            : "text-slate-400"
                          }`}>
                            {step.label}
                            {step.state === "active" && (
                              <span className="ml-2 text-[10px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md">
                                Current
                              </span>
                            )}
                          </div>
                          {step.note && (
                            <div className="text-[10px] text-slate-400 mt-0.5">{step.note}</div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Activity log */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900">Activity Log</h3>
              </div>
              {detail.activity.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {detail.activity.map((item, i) => {
                    const style = ACTIVITY_STYLE[item.type];
                    return (
                      <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${style.color}`}>
                          {style.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-700 leading-relaxed">{item.text}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.date}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-5 py-8 text-center text-slate-400">
                  <Clock className="w-6 h-6 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">Activity will appear here once the service begins.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Consultant, Documents, Sessions */}
          <div className="space-y-5">

            {/* Assigned consultant */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900">Assigned Team</h3>
              </div>
              {detail.consultant ? (
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-white">{detail.consultant.initials}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-slate-900 truncate">{detail.consultant.name}</div>
                    <div className="text-[10px] text-blue-700 font-semibold">{detail.consultant.role}</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex items-center gap-3 text-slate-400">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-xs">Your consultant will appear here once assigned.</p>
                </div>
              )}
            </div>

            {/* Related documents */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">Documents</h3>
                <Link to="/portal/documents" className="text-xs font-semibold text-blue-700 hover:underline">
                  View all
                </Link>
              </div>
              {detail.documents.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {detail.documents.map((doc) => (
                    <div key={doc.name} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-slate-800 truncate">{doc.name}</div>
                        <div className="text-[10px] text-slate-400">{doc.date} · {doc.size}</div>
                      </div>
                      <button className="text-slate-400 hover:text-blue-700 transition-colors flex-shrink-0">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-slate-400">
                  <FileText className="w-5 h-5 mx-auto mb-1.5 opacity-40" />
                  <p className="text-xs">No documents yet</p>
                </div>
              )}
            </div>

            {/* Related sessions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">Sessions</h3>
                <Link to="/portal/sessions" className="text-xs font-semibold text-blue-700 hover:underline">
                  Book new
                </Link>
              </div>
              {detail.sessions.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {detail.sessions.map((s) => (
                    <div key={s.title} className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                      <CalendarCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] font-bold text-slate-800">{s.title}</div>
                        <div className="text-[10px] text-slate-400">{s.date}</div>
                        <div className="text-[10px] text-slate-400">{s.consultant}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-slate-400">
                  <CalendarCheck className="w-5 h-5 mx-auto mb-1.5 opacity-40" />
                  <p className="text-xs">No sessions linked yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
