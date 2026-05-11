import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, FileText, RefreshCw, Search, UploadCloud } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { getDocumentDownloadUrl, listMyDocuments, type PortalDocument, type PortalDocumentFilters } from "../../api/documents.api";
import { PortalAdminReference } from "./PortalAdminReference";

const useMockPortalFallback = import.meta.env.VITE_USE_MOCK_PORTAL === "true";

async function mockDocuments(): Promise<PortalDocument[]> {
  const { mockPortalDocumentActivity } = await import("../../mock");
  return mockPortalDocumentActivity.map((item) => ({
    name: item.id,
    title: item.name,
    file_name: item.name,
    file_type: item.category,
    related_label: item.category,
    visibility: "mock",
    status: item.status,
    uploaded_on: item.date,
    download_allowed: false,
    preview_allowed: false,
  }));
}

export function PortalDocuments() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PortalDocumentFilters>({});
  const [documents, setDocuments] = useState<PortalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (useMockPortalFallback) {
      setDocuments(await mockDocuments());
      setLoading(false);
      return;
    }

    const response = await listMyDocuments(filters);
    if (!response.ok || !response.data) {
      setDocuments([]);
      if (response.unauthenticated) {
        navigate(`/login?redirect-to=${encodeURIComponent("/portal/documents")}`, { replace: true });
        return;
      }
      setError(response.error ?? "Documents could not be loaded.");
      setLoading(false);
      return;
    }
    setDocuments(response.data.documents);
    setLoading(false);
  }, [JSON.stringify(filters), navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  const fileTypes = useMemo(() => ["", ...Array.from(new Set(documents.map((item) => item.file_type).filter(Boolean)))], [documents]);
  const statuses = useMemo(() => ["", ...Array.from(new Set(documents.map((item) => item.status).filter(Boolean)))], [documents]);

  async function handleDownload(name: string) {
    setPermissionError(null);
    const response = await getDocumentDownloadUrl(name);
    if (!response.ok || !response.data?.download_url) {
      setPermissionError(response.error ?? "You do not have permission to download this file.");
      return;
    }
    window.location.assign(response.data.download_url);
  }

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <PortalAdminReference portalRoute="/portal/documents" controlledBy={["Admin On-Demand Services > Document Nucleus"]} />

      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-1">Documents</h2>
        <p className="text-sm text-slate-500">Access live files shared with your member account.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/document-nucleus/brief" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800">
          Start DocuShare brief
        </Link>
        <Link to="/document-nucleus/overview" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
          View document options
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-start gap-3">
        <UploadCloud className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-extrabold text-blue-900">Uploads use supported service flows</div>
          <p className="text-[11px] text-blue-700 leading-relaxed">Direct upload is not enabled here. Files are added through DocuShare, Decision Desk, or other RBP service processes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents"
            value={filters.search ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select value={filters.file_type ?? ""} onChange={(event) => setFilters((current) => ({ ...current, file_type: event.target.value }))} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600">
          {fileTypes.map((item) => <option key={item} value={item}>{item || "All file types"}</option>)}
        </select>
        <select value={filters.status ?? ""} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600">
          {statuses.map((item) => <option key={item} value={item}>{item || "All statuses"}</option>)}
        </select>
      </div>

      {permissionError ? <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">{permissionError}</div> : null}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-slate-400">Loading documents...</div>
        ) : error ? (
          <div className="px-5 py-8 text-sm text-red-700">
            <div className="font-bold">Documents could not be loaded.</div>
            <p className="mt-1 text-xs">{error}</p>
            <button onClick={() => void load()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        ) : documents.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No documents found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {documents.map((doc) => (
              <div key={doc.name} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 truncate mb-0.5">{doc.title}</div>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                    {doc.uploaded_on || doc.modified ? <span>{doc.uploaded_on ?? doc.modified}</span> : null}
                    {doc.file_type ? <span>{doc.file_type}</span> : null}
                    {doc.file_size ? <span>{doc.file_size} bytes</span> : null}
                    {doc.visibility ? <span className="capitalize">{doc.visibility.replace(/_/g, " ")}</span> : null}
                  </div>
                </div>
                <button
                  disabled={!doc.download_allowed}
                  onClick={() => void handleDownload(doc.name)}
                  className="p-2 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                  title={doc.download_allowed ? "Download" : "Download not permitted"}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
