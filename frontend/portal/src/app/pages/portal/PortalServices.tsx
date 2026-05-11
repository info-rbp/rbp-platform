import { useState } from "react";
import { Link } from "react-router";
import { PortalAdminReference } from "./PortalAdminReference";
import {
  decisionDeskFlowStorageKey,
  type DecisionDeskStoredState,
} from "../../features/decision-desk";
import {
  docuShareFlowStorageKey,
  type DocuShareStoredState,
} from "../../features/docushare";
import { mockPortalServiceRequests } from "../../mock";
import {
  Zap, ArrowRight, ChevronRight, CheckCircle, Clock,
  AlertCircle, Plus, FileText, Tag, Calculator, BarChart2,
  Wifi, ShieldAlert, Wrench,
} from "lucide-react";

export type ServiceStatus = "Active" | "In Progress" | "Requested" | "Outcome Ready" | "Completed" | "Available";

export interface Service {
  id: string;
  title: string;
  category: string;
  status: ServiceStatus;
  description: string;
  lastUpdated: string;
  nextAction: string;
  buttonLabel: string;
  icon: React.ElementType;
}

function statusLabel(status: string): ServiceStatus {
  if (status === "in-review" || status === "in-progress") return "In Progress";
  if (status === "submitted" || status === "pending") return "Requested";
  if (status === "outcome-ready") return "Outcome Ready";
  if (status === "assigned" || status === "active") return "Active";
  if (status === "closed") return "Completed";
  return "Available";
}

const sourceIcon = {
  "Decision Desk": Zap,
  DocuShare: FileText,
  Connectivity: Wifi,
  "Risk Advisor": ShieldAlert,
  "The Fixer": Wrench,
};

export const SERVICES: Service[] = [
  ...mockPortalServiceRequests.map((request) => ({
    id: request.id,
    title: request.source,
    category: request.category,
    status: statusLabel(request.status),
    description: request.description,
    lastUpdated: request.lastUpdated,
    nextAction: request.nextAction,
    buttonLabel: request.ctaLabel,
    icon: sourceIcon[request.source],
  })),
  {
    id: "business-health-snapshot",
    title: "Business Health Snapshot",
    category: "Advisory",
    status: "Active",
    description: "A structured review of growth, finance and operational priorities.",
    lastUpdated: "1 May 2026",
    nextAction: "View snapshot",
    buttonLabel: "Open",
    icon: BarChart2,
  },
  {
    id: "finance-calculator-pack",
    title: "Finance Calculator Pack",
    category: "Operations Tool",
    status: "Available",
    description: "Planning tools for lending, cash flow and business finance.",
    lastUpdated: "—",
    nextAction: "Activate when ready",
    buttonLabel: "Activate",
    icon: Calculator,
  },
  {
    id: "xero-partner-offer",
    title: "Xero Partner Offer",
    category: "Partner Offer",
    status: "Completed",
    description: "Partner offer activated through the RBP marketplace.",
    lastUpdated: "20 Apr 2026",
    nextAction: "Offer active",
    buttonLabel: "View Offer",
    icon: Tag,
  },
];

function readDecisionDeskServiceState(): DecisionDeskStoredState | null {
  const rawValue = window.sessionStorage.getItem(decisionDeskFlowStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as DecisionDeskStoredState;
  } catch {
    return null;
  }
}

function readDocuShareServiceState(): DocuShareStoredState | null {
  const rawValue = window.sessionStorage.getItem(docuShareFlowStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as DocuShareStoredState;
  } catch {
    return null;
  }
}

const STATUS_CONFIG: Record<ServiceStatus, { color: string; dot: string }> = {
  Active:      { color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  "In Progress": { color: "bg-amber-50 text-amber-700",   dot: "bg-amber-500" },
  Requested:   { color: "bg-blue-50 text-blue-700",       dot: "bg-blue-500" },
  "Outcome Ready": { color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  Completed:   { color: "bg-slate-100 text-slate-600",    dot: "bg-slate-400" },
  Available:   { color: "bg-violet-50 text-violet-700",   dot: "bg-violet-500" },
};

const STATUS_TABS: Array<ServiceStatus | "All"> = [
  "All", "Active", "Requested", "In Progress", "Outcome Ready", "Completed", "Available",
];

const SUMMARY_COUNTS: Array<{ label: string; key: ServiceStatus | null; color: string }> = [
  { label: "Active",           key: "Active",      color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  { label: "In Progress",      key: "In Progress", color: "text-amber-700 bg-amber-50 border-amber-100" },
  { label: "Pending Requests", key: "Requested",   color: "text-blue-700 bg-blue-50 border-blue-100" },
  { label: "Outcome Ready",    key: "Outcome Ready", color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
];

function getButtonStyle(status: ServiceStatus) {
  if (status === "Available")  return "bg-blue-700 hover:bg-blue-800 text-white";
  if (status === "Completed")  return "border border-slate-200 text-slate-600 hover:bg-slate-50";
  if (status === "Requested")  return "border border-slate-200 text-slate-700 hover:bg-slate-50";
  return "bg-blue-700 hover:bg-blue-800 text-white";
}

export function PortalServices() {
  const [activeFilter, setActiveFilter] = useState<ServiceStatus | "All">("All");
  const decisionDeskState = readDecisionDeskServiceState();
  const docuShareState = readDocuShareServiceState();
  const services = [
    ...(decisionDeskState
      ? [
        {
          id: "decision-desk",
          title: "Decision Desk",
          category: decisionDeskState.category,
          status: statusLabel(decisionDeskState.status),
          description: `${decisionDeskState.reference}: ${decisionDeskState.title}. This is a preview submission with no real advisor assigned.`,
          lastUpdated: "Just now",
          nextAction: "View mock status timeline",
          buttonLabel: "Open Decision Desk",
          icon: Zap,
        },
      ]
      : []),
    ...(docuShareState
      ? [
          {
            id: "docushare-brief",
            title: "DocuShare",
            category: docuShareState.documentGroup,
            status: statusLabel(docuShareState.status),
            description: `${docuShareState.reference}: ${docuShareState.documentType} brief for ${docuShareState.businessName}. No real document is being produced.`,
            lastUpdated: "Just now",
            nextAction: "View simulated document status",
            buttonLabel: "Open documents",
            icon: FileText,
          },
        ]
      : []),
    ...SERVICES.filter(
      (service) =>
        (!decisionDeskState || service.id !== "decision-desk") &&
        (!docuShareState || service.id !== "docushare-brief")
    ),
  ];

  const filtered =
    activeFilter === "All"
      ? services
      : services.filter((s) => s.status === activeFilter);

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <PortalAdminReference
        portalRoute="/portal/services"
        controlledBy={["Admin On-Demand Services", "Admin Managed Services"]}
      />

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">My Services</h2>
          <p className="text-sm text-slate-500">
            Track your requested, active and completed RBP services.
          </p>
        </div>
        <Link
          to="/portal/services/request"
          className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Request a Service
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {[
          { label: "Start Decision Desk", href: "/on-demand/decision-desk" },
          { label: "Start DocuShare", href: "/document-nucleus/brief" },
          { label: "Order Connectivity", href: "/operations/connectivity" },
          { label: "Run Risk Advisor", href: "/on-demand/risk-advisor" },
          { label: "Request The Fixer", href: "/on-demand/the-fixer" },
        ].map((cta) => (
          <Link
            key={cta.href}
            to={cta.href}
            className="inline-flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            {cta.label}
            <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
          </Link>
        ))}
      </div>

      {/* ── Status summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SUMMARY_COUNTS.map((s) => (
          <button
            key={s.label}
            onClick={() => setActiveFilter(s.key as ServiceStatus)}
            className={`rounded-2xl border p-4 text-left transition-all ${s.color} ${
              activeFilter === s.key ? "ring-2 ring-offset-1 ring-current" : "hover:opacity-80"
            }`}
          >
            <div className="text-2xl font-extrabold mb-0.5">
              {services.filter((sv) => sv.status === s.key).length}
            </div>
            <div className="text-xs font-semibold">{s.label}</div>
          </button>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFilter === tab
                ? "bg-blue-700 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab}
            {tab !== "All" && (
              <span className={`ml-1.5 text-[10px] ${activeFilter === tab ? "text-blue-200" : "text-slate-400"}`}>
                {services.filter((s) => s.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Service cards ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((svc) => {
            const cfg = STATUS_CONFIG[svc.status];
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                {/* Top row: icon + badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                      {svc.category}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {svc.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="text-sm font-extrabold text-slate-900 mb-1">{svc.title}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{svc.description}</p>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-4 text-[10px] text-slate-400">
                  {svc.lastUpdated !== "—" && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Updated {svc.lastUpdated}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    {svc.status === "Completed" ? (
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-slate-400" />
                    )}
                    {svc.nextAction}
                  </span>
                </div>

                {/* Action row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
                  <Link
                    to={`/portal/services/${svc.id}`}
                    className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    View details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={
                      svc.status === "Available"
                        ? "/portal/services/request"
                        : svc.status === "Completed" && svc.category === "Partner Offer"
                        ? "/portal/offers"
                        : `/portal/services/${svc.id}`
                    }
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors ${getButtonStyle(svc.status)}`}
                  >
                    {svc.buttonLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-slate-300" />
          </div>
          <div className="text-sm font-bold text-slate-700 mb-2">No services yet</div>
          <p className="text-xs text-slate-400 leading-relaxed mb-5 max-w-xs">
            Services you request or activate from the RBP website will appear here.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/portal/services/request"
              className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Request a Service
            </Link>
            <Link
              to="/on-demand"
              className="inline-flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
            >
              Explore Services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
