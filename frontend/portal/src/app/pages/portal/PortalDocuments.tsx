import { FileText, Download, Eye, Search, Filter, Clock, CheckCircle, AlertCircle, UploadCloud } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { PortalAdminReference } from "./PortalAdminReference";
import { mockPortalDocumentActivity } from "../../mock";
import { getCurrentMockPortalState } from "../../services/mock/portal.mockService";

const categoryIcon: Record<string, string> = {
  Advisory: "bg-blue-50 text-blue-700",
  Finance:  "bg-violet-50 text-violet-700",
  HR:       "bg-emerald-50 text-emerald-700",
  Bids:     "bg-amber-50 text-amber-700",
  Membership: "bg-blue-50 text-blue-700",
  "Decision Desk": "bg-amber-50 text-amber-700",
  DocuShare: "bg-blue-50 text-blue-700",
};

const statusColor: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  ready: "bg-emerald-50 text-emerald-700",
  "outcome-ready": "bg-emerald-50 text-emerald-700",
  "in-progress": "bg-amber-50 text-amber-700",
  "in-review": "bg-blue-50 text-blue-700",
  submitted: "bg-blue-50 text-blue-700",
};

export function PortalDocuments() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const portalState = getCurrentMockPortalState();
  const docuShareDocuments = portalState.activities
    .filter((activity) => activity.product === "docushare")
    .map((activity) => ({
      id: `document-${activity.id}`,
      name: `${activity.title} placeholder`,
      category: "DocuShare",
      date: activity.updatedAt,
      size: "Mock file",
      status: activity.status,
    }));
  const documents = [...docuShareDocuments, ...mockPortalDocumentActivity];
  const categories = ["All", ...Array.from(new Set(documents.map((document) => document.category)))];

  const filtered = documents.filter((d) => {
    const matchCat = activeCategory === "All" || d.category === activeCategory;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <PortalAdminReference
        portalRoute="/portal/documents"
        controlledBy={["Admin On-Demand Services > Document Nucleus"]}
      />

      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-1">Documents</h2>
        <p className="text-sm text-slate-500">Access mock document activity, file placeholders, and document-related CTAs.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/portal/services/docushare/start"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
        >
          Submit through your account
        </Link>
        <Link
          to="/document-nucleus/overview"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          View document options
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-start gap-3">
        <UploadCloud className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-extrabold text-blue-900">Uploads are simulated only</div>
          <p className="text-[11px] text-blue-700 leading-relaxed">
            This portal shows mock file placeholders from the shared mock data. No real upload, storage, or permission-backed download is implemented.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: documents.length.toString(), icon: FileText, color: "bg-slate-50 text-slate-700 border-slate-100" },
          { label: "Awaiting Review", value: documents.filter(d => d.status === "in-review" || d.status === "submitted").length.toString(), icon: AlertCircle, color: "bg-blue-50 text-blue-700 border-blue-100" },
          { label: "Ready Placeholder", value: documents.filter(d => d.status === "active" || d.status === "ready" || d.status === "outcome-ready").length.toString(), icon: CheckCircle, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 flex items-center gap-3 ${s.color}`}>
            <s.icon className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="text-xl font-extrabold">{s.value}</div>
              <div className="text-[10px] font-semibold">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeCategory === cat
                  ? "bg-blue-700 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No documents found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((doc) => (
              <div key={doc.name} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 truncate mb-0.5">{doc.name}</div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" /> {doc.date}
                    </span>
                    <span className="text-[10px] text-slate-400">{doc.size}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${categoryIcon[doc.category] ?? "bg-slate-50 text-slate-500"}`}>
                      {doc.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg hidden sm:inline-block capitalize ${statusColor[doc.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {doc.status.replace(/-/g, " ")}
                  </span>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors" title="Mock preview only">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors" title="No real download in Phase 1">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
