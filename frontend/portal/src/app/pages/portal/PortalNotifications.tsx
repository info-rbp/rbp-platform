import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Bell, CheckCircle, RefreshCw } from "lucide-react";

import { useNotifications } from "../../hooks/useNotifications";

const priorityOptions = ["All", "Low", "Normal", "High", "Urgent"];
const typeOptions = ["All", "Info", "Success", "Warning", "Error"];

export function PortalNotifications() {
  const navigate = useNavigate();
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
  const [priority, setPriority] = useState("All");
  const [type, setType] = useState("All");
  const filters = useMemo(
    () => ({
      ...(readFilter === "unread" ? { is_read: false } : {}),
      ...(readFilter === "read" ? { is_read: true } : {}),
      ...(priority !== "All" ? { priority } : {}),
      ...(type !== "All" ? { notification_type: type } : {}),
    }),
    [readFilter, priority, type],
  );
  const state = useNotifications(filters);

  if (state.unauthenticated) {
    navigate(`/login?redirect-to=${encodeURIComponent("/portal/notifications")}`, { replace: true });
  }

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">Notifications</h2>
          <p className="text-sm text-slate-500">Track live RBP updates and unread activity.</p>
        </div>
        <button
          onClick={() => void state.markAllRead()}
          disabled={state.unreadCount === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <CheckCircle className="h-3.5 w-3.5" /> Mark all read
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["all", "unread", "read"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setReadFilter(item)}
            className={`rounded-xl px-3 py-2 text-xs font-bold capitalize ${
              readFilter === item ? "bg-blue-700 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        ))}
        <select value={priority} onChange={(event) => setPriority(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">
          {priorityOptions.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">
          {typeOptions.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      {state.loading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-500 shadow-sm">Loading notifications...</div>
      ) : state.error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          <div className="font-bold">Notifications could not be loaded.</div>
          <p className="mt-1 text-xs">{state.error}</p>
          <button onClick={() => void state.refresh()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-red-700">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      ) : state.notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-400">
          <Bell className="mx-auto mb-3 h-8 w-8 opacity-50" />
          <p className="text-sm font-bold text-slate-600">No notifications found</p>
          <p className="mt-1 text-xs">New RBP updates will appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {state.notifications.map((item) => (
            <div key={item.name} className="flex flex-col gap-3 border-b border-slate-50 px-5 py-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${item.is_read ? "bg-slate-300" : "bg-blue-600"}`} />
                  <h3 className="text-sm font-extrabold text-slate-900">{item.title}</h3>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{item.priority ?? "Normal"}</span>
                </div>
                {item.message ? <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.message}</p> : null}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                  {item.created_on ? <span>{item.created_on}</span> : null}
                  {item.related_doctype ? <span>{item.related_doctype}</span> : null}
                  {item.related_route || item.route ? (
                    <Link to={item.related_route ?? item.route ?? "#"} className="font-bold text-blue-700 hover:underline">
                      Open related record
                    </Link>
                  ) : null}
                </div>
              </div>
              {!item.is_read ? (
                <button onClick={() => void state.markRead(item.name)} className="self-start rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                  Mark read
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
