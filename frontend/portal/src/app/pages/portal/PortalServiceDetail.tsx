import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowRight, ChevronRight, Clock, FileText, RefreshCw } from "lucide-react";

import { getServiceRecord, type PortalServiceDetail as PortalServiceDetailDto } from "../../api/portalServices.api";

export function PortalServiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<PortalServiceDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const response = await getServiceRecord(id);
    if (!response.ok || !response.data) {
      if (response.unauthenticated) {
        navigate(`/login?redirect-to=${encodeURIComponent(`/portal/services/${id}`)}`, { replace: true });
        return;
      }
      setDetail(null);
      setError(response.error ?? "Service detail could not be loaded.");
      setLoading(false);
      return;
    }
    setDetail(response.data);
    setLoading(false);
  }, [id, navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <div className="px-4 sm:px-6 py-6 text-sm text-slate-500">Loading service detail...</div>;
  }

  if (error || !detail) {
    return (
      <div className="px-4 sm:px-6 py-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          <div className="font-bold">Service not available</div>
          <p className="mt-1 text-xs">{error ?? "This service does not exist or you do not have access."}</p>
          <button onClick={() => void load()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-red-700">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const service = detail.metadata;

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link to="/portal/services" className="hover:text-blue-700 transition-colors font-semibold">Services</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 font-semibold">{service.title}</span>
      </nav>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">{service.title}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{service.service_label}</span>
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">{service.status ?? "Open"}</span>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">{service.priority ?? "Normal"}</span>
            </div>
          </div>
          <Link to="/portal/support" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
            Contact support <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <p className="mt-4 border-t border-slate-50 pt-4 text-sm leading-relaxed text-slate-500">{service.summary || service.reference}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-extrabold text-slate-900">Progress</h3>
            </div>
            <div className="px-5 py-5">
              {detail.status_timeline.length ? (
                <ol className="space-y-4">
                  {detail.status_timeline.map((item, index) => (
                    <li key={`${item.label}-${index}`} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{item.label}</div>
                        <div className="text-[10px] text-slate-400">{item.at ?? item.status}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs text-slate-400">No timeline entries are available yet.</p>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-extrabold text-slate-900">Notes</h3>
            </div>
            <div className="px-5 py-5">
              {detail.notes.length ? (
                detail.notes.map((note, index) => <p key={index} className="text-xs leading-relaxed text-slate-600">{note.message}</p>)
              ) : (
                <p className="text-xs text-slate-400">No customer-visible notes are available.</p>
              )}
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Attached files</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {detail.attached_files.length ? (
              detail.attached_files.map((file, index) => (
                <div key={String(file.name ?? index)} className="flex items-center gap-3 px-5 py-3">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="truncate text-xs font-semibold text-slate-700">{String(file.title ?? file.file_name ?? file.name)}</span>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-xs text-slate-400">No files attached.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
