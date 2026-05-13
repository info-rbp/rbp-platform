import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  BarChart2,
  CheckCircle,
  ChevronRight,
  CreditCard,
  ExternalLink,
  FileText,
  GraduationCap,
  HeadphonesIcon,
  Layers,
  Lock,
  Plug,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { PortalAdminReference } from "./PortalAdminReference";
import { EntitlementBadge } from "../../components/status";
import { mockPortalApplications, mockPortalIntegrations } from "../../mock";
import { useRuntimeConfig } from "../../hooks/useRuntimeConfig";
import { applicationsApi } from "../../services/api";

const iconMap = {
  layers: Layers,
  users: Users,
  trending: TrendingUp,
  file: FileText,
  support: HeadphonesIcon,
  learning: GraduationCap,
  chart: BarChart2,
  billing: CreditCard,
};

const iconTone = {
  included: "bg-blue-700 text-white",
  available: "bg-emerald-600 text-white",
  locked: "bg-slate-700 text-white",
  "coming-soon": "bg-amber-500 text-white",
};

const filterTabs = ["All", "included", "available", "locked", "coming-soon"] as const;
type FilterTab = typeof filterTabs[number];

export function PortalApps() {
  const { config } = useRuntimeConfig();
  const [activeTab, setActiveTab] = useState<"Applications" | "Integrations">("Applications");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [selectedId, setSelectedId] = useState(mockPortalApplications[0]?.id);
  const [interestState, setInterestState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");

  const selectedApp =
    mockPortalApplications.find((application) => application.id === selectedId) ??
    mockPortalApplications[0];

  const filtered =
    activeFilter === "All"
      ? mockPortalApplications
      : mockPortalApplications.filter((application) => application.accessState === activeFilter);
  const provisioningEnabled = config.features.application_provisioning;
  const interestEnabled = config.features.application_interest;
  const requestActionLabel = provisioningEnabled
    ? "Request Access"
    : interestEnabled
      ? "Register Interest"
      : "Requests Disabled";

  async function handleRegisterInterest(applicationKey = selectedApp?.id) {
    if (!interestEnabled || !applicationKey) return;

    setInterestState("submitting");
    const response = await applicationsApi.registerInterest({
      application_key: applicationKey,
      application_name: selectedApp?.name,
      source_channel: "portal",
    });

    setInterestState(response.ok ? "submitted" : "error");
  }

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <PortalAdminReference
        portalRoute="/portal/apps"
        controlledBy={["Admin Applications"]}
        status="Live"
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">Applications & Tools</h2>
          <p className="text-sm text-slate-500">
            Mock application tiles with access, entitlement, locked, and planned states.
          </p>
        </div>
        {interestEnabled || provisioningEnabled ? (
          <button
            type="button"
            onClick={() => handleRegisterInterest()}
            disabled={!interestEnabled || interestState === "submitting"}
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            {interestState === "submitted" ? "Interest Registered" : requestActionLabel} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-500">
            {requestActionLabel}
          </span>
        )}
      </div>

      {!provisioningEnabled ? (
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
          Customer application provisioning is disabled by the current runtime flags.
          {interestEnabled ? " Members can register interest, but no provisioning action is exposed." : " Member interest capture is disabled too."}
        </div>
      ) : null}

      <div className="flex items-center gap-4 border-b border-slate-200">
        {(["Applications", "Integrations"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Applications" ? (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-5">
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {(["included", "available", "locked", "coming-soon"] as const).map((state) => (
                <button
                  key={state}
                  onClick={() => setActiveFilter(state)}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    activeFilter === state ? "ring-2 ring-blue-600 ring-offset-1" : "hover:bg-slate-50"
                  } bg-white border-slate-100`}
                >
                  <div className="text-2xl font-extrabold text-slate-900 mb-0.5">
                    {mockPortalApplications.filter((application) => application.accessState === state).length}
                  </div>
                  <div className="text-xs font-semibold capitalize text-slate-600">
                    {state.replace("-", " ")}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    activeFilter === tab
                      ? "bg-blue-700 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {tab === "All" ? "All" : tab.replace("-", " ")}
                </button>
              ))}
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((application) => {
                  const Icon = iconMap[application.icon];
                  const isSelected = selectedApp?.id === application.id;

                  return (
                    <article
                      key={application.id}
                      className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow ${
                        isSelected ? "border-blue-200 ring-2 ring-blue-100" : "border-slate-100"
                      }`}
                    >
                      {application.id === "operations-finance" ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg w-fit">
                          <Sparkles className="w-3 h-3" /> Recommended
                        </div>
                      ) : null}
                      <div className="flex items-start justify-between gap-2">
                        <div className={`w-10 h-10 ${iconTone[application.accessState]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <EntitlementBadge state={application.accessState} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-extrabold text-slate-900 mb-0.5">{application.name}</h3>
                        <p className="text-[10px] font-medium text-slate-400 mb-2">{application.backendLabel}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{application.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
                        <button
                          onClick={() => setSelectedId(application.id)}
                          className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                        >
                          View details <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          to={application.accessState === "included" || !provisioningEnabled ? "/portal/apps" : "/portal/support"}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                            application.accessState === "included"
                              ? "bg-blue-700 hover:bg-blue-800 text-white"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {!provisioningEnabled && application.accessState !== "included"
                            ? requestActionLabel
                            : application.actionLabel}
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center text-center">
                <Layers className="w-8 h-8 text-slate-300 mb-3" />
                <div className="text-sm font-bold text-slate-700 mb-1">No applications in this state</div>
                <p className="text-xs text-slate-400 max-w-xs">
                  Empty access states are supported by the shared mock data.
                </p>
              </div>
            )}
          </div>

          {selectedApp ? (
            <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-fit">
              <div className="px-5 py-4 border-b border-slate-100">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-extrabold text-slate-900">{selectedApp.name}</h3>
                  <EntitlementBadge state={selectedApp.accessState} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{selectedApp.backendLabel}</p>
              </div>
              <div className="p-5 space-y-5">
                <p className="text-sm text-slate-700 leading-relaxed">{selectedApp.description}</p>
                {(selectedApp.accessState === "locked" || selectedApp.accessState === "coming-soon") ? (
                  <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 flex items-start gap-2">
                    <Lock className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      This is a mock access state only. No provisioning, account creation, or entitlement enforcement is implemented.
                    </p>
                  </div>
                ) : null}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">What this helps with</h4>
                  <ul className="space-y-2">
                    {selectedApp.helpsWith.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.capabilities.map((capability) => (
                      <span key={capability} className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
                {provisioningEnabled || interestEnabled ? (
                  <button
                    type="button"
                    onClick={() => handleRegisterInterest(selectedApp.id)}
                    disabled={!interestEnabled || interestState === "submitting"}
                    className="w-full inline-flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition-all"
                  >
                    {interestState === "submitted" ? "Interest Registered" : provisioningEnabled ? "Mock Access Request" : "Register Interest"} <ExternalLink className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </aside>
          ) : null}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3">
            <Plug className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
            <div>
              <strong className="font-extrabold text-blue-900 block">Integration management is planned.</strong>
              Integration rows are placeholders only. No real Frappe, API, Stripe, or platform connection is created here.
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                  <th className="px-4 py-3">Integration</th>
                  <th className="px-4 py-3">Connection Status</th>
                  <th className="px-4 py-3">Sync / Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {mockPortalIntegrations.map((integration) => (
                  <tr key={integration.name} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-800">{integration.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                        {integration.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        {integration.sync === "Healthy" ? <RefreshCw className="w-3.5 h-3.5 text-emerald-500" /> : null}
                        {integration.sync}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
