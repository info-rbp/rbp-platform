import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AlertCircle, ArrowRight, Clock, FileText, Plus, RefreshCw, Search, Zap } from "lucide-react";

import { listMyServices, type PortalServiceFilters, type PortalServiceListItem } from "../../api/portalServices.api";
import { PortalAdminReference } from "./PortalAdminReference";

const useMockPortalFallback = import.meta.env.VITE_USE_MOCK_PORTAL === "true";

const serviceTypes = [
  { value: "", label: "All services" },
  { value: "decision-desk", label: "Decision Desk" },
  { value: "docushare", label: "DocuShare" },
  { value: "connectivity", label: "Connectivity" },
  { value: "risk-advisor", label: "Risk Advisor" },
  { value: "the-fixer", label: "The Fixer" },
  { value: "marketplace", label: "Marketplace" },
];

async function mockServices(): Promise<PortalServiceListItem[]> {
  const { mockPortalServiceRequests } = await import("../../mock");
  return mockPortalServiceRequests.map((item) => ({
    id: item.id,
    reference: item.id,
    service_type: item.source.toLowerCase().replace(/\s+/g, "-"),
    service_label: item.source,
    title: item.source,
    summary: item.description,
    status: item.status,
    workflow_state: item.status,
    priority: "Normal",
    modified_on: item.lastUpdated,
    next_action: item.nextAction,
    detail_route: `/portal/services/${item.id}`,
    source_doctype: "Mock Portal Service",
    source_name: item.id,
  }));
}

function badgeClass(value?: string) {
  const text = (value ?? "").toLowerCase();
  if (text.includes("urgent") || text.includes("critical") || text.includes("high")) return "bg-red-50 text-red-700";
  if (text.includes("ready") || text.includes("complete") || text.includes("closed")) return "bg-emerald-50 text-emerald-700";
  if (text.includes("review") || text.includes("progress") || text.includes("assigned")) return "bg-amber-50 text-amber-700";
  return "bg-blue-50 text-blue-700";
}

export function PortalServices() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [filters, setFilters] = useState<PortalServiceFilters>({ service_type: params.get("type") ?? "" });
  const [services, setServices] = useState<PortalServiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthenticated, setUnauthenticated] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUnauthenticated(false);

    if (useMockPortalFallback) {
      setServices(await mockServices());
      setLoading(false);
      return;
    }

    const response = await listMyServices(filters);
    if (!response.ok || !response.data) {
      setServices([]);
      setError(response.error ?? "Services could not be loaded.");
      setUnauthenticated(Boolean(response.unauthenticated));
      setLoading(false);
      return;
    }

    setServices(response.data.services);
    setLoading(false);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (unauthenticated) {
      navigate(`/login?redirect-to=${encodeURIComponent(`${location.pathname}${location.search}`)}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate, unauthenticated]);

  const summary = useMemo(() => ({
    total: services.length,
    active: services.filter((item) => /active|progress|assigned|review/i.test(item.status ?? "")).length,
    ready: services.filter((item) => /ready|quoted|waiting/i.test(item.status ?? "")).length,
    closed: services.filter((item) => /complete|closed|resolved|fulfilled/i.test(item.status ?? "")).length,
  }), [services]);

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <PortalAdminReference portalRoute="/portal/services" controlledBy={["Admin On-Demand Services", "Admin Managed Services"]} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">Services</h2>
          <p className="text-sm text-slate-500">Track live requested, active and completed RBP services.</p>
        </div>
        <Link to="/portal/services/request" className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex-shrink-0">
          <Plus className="w-3.5 h-3.5" /> Request Service
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ["Total", summary.total],
          ["Active", summary.active],
          ["Needs review", summary.ready],
          ["Closed", summary.closed],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-slate-900">{value}</div>
            <div className="text-xs font-semibold text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_160px_160px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filters.search ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Search services"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select value={filters.service_type ?? ""} onChange={(event) => setFilters((current) => ({ ...current, service_type: event.target.value }))} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600">
          {serviceTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <input value={filters.status ?? ""} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} placeholder="Status" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600" />
        <input value={filters.priority ?? ""} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))} placeholder="Priority" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600" />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-500">Loading services...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          <div className="font-bold">Services could not be loaded.</div>
          <p className="mt-1 text-xs">{error}</p>
          <button onClick={() => void load()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-red-700">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center text-center">
          <FileText className="mb-3 h-8 w-8 text-slate-300" />
          <div className="text-sm font-bold text-slate-700 mb-2">No services yet</div>
          <p className="text-xs text-slate-400 leading-relaxed mb-5 max-w-xs">Services you request or activate from RBP will appear here.</p>
          <Link to="/portal/services/request" className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl">
            <Plus className="w-3.5 h-3.5" /> Request Service
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-blue-700" />
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">{service.service_label}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${badgeClass(service.status)}`}>{service.status ?? "Open"}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${badgeClass(service.priority)}`}>{service.priority ?? "Normal"}</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 mb-1">{service.title}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{service.summary || service.reference}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400">
                {service.modified_on ? <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {service.modified_on}</span> : null}
                <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {service.next_action ?? "Open for details"}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
                <Link to={`/portal/services/${service.id}`} className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
                  View details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
