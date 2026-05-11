import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { getAdminDashboard, type AdminDashboardPayload } from "../../api/admin.api";
import { listAuditLogs, performAdminAction, type AuditLogEntry } from "../../api/adminActions.api";
import { mockAdminMetrics, mockAdminQueues, mockAdminReviewRecords, type MockAdminReviewRecord } from "../../mock";
import { submitMockAdminReviewAction } from "../../services/mock/admin.mockService";
import { FormSection, SelectField, TextAreaField } from "../../components/forms";
import { MockSubmissionState } from "../../components/flow";
import { StatusBadge } from "../../components/status";

type SubmissionState = "idle" | "loading" | "success" | "error";

const mockAdminEnabled = import.meta.env.DEV && import.meta.env.VITE_RBP_ENABLE_MOCK_ADMIN === "true";

const domainDefaults: Record<string, { domain: string; doctype: string }> = {
  decision: { domain: "decision_desk", doctype: "RBP Decision Desk Request" },
  docushare: { domain: "docushare", doctype: "RBP DocuShare Document" },
  connectivity: { domain: "connectivity", doctype: "RBP Connectivity Request" },
  risk: { domain: "risk_advisor", doctype: "RBP Risk Advisor Assessment" },
  fixer: { domain: "fixer", doctype: "RBP Fixer Case" },
  marketplace: { domain: "marketplace", doctype: "RBP Marketplace Listing" },
  membership: { domain: "membership", doctype: "RBP Onboarding Flow" },
};

function AdminShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const auditActive = location.pathname.includes("audit");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">RBP Desk command centre</p>
            <h1 className="mt-1 text-2xl font-black text-slate-950">
              {auditActive ? "Audit trail" : "Production admin dashboard"}
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Live operational metrics and workflow actions. Frappe Desk remains the system of record for CRUD, forms, permissions and reports.
            </p>
          </div>
          <a href="/desk" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">
            Open Desk <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:self-start">
          <nav className="space-y-1">
            {[
              { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
              { href: "/admin/requests", label: "Queues", icon: ClipboardList },
              { href: "/admin/audit-review", label: "Audit", icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.href || (item.href.includes("audit") && auditActive);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={[
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition",
                    active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

function MetricGrid({ dashboard }: { dashboard: AdminDashboardPayload }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {dashboard.metrics.map((metric) => (
        <a key={metric.key} href={metric.desk_url || "/desk"} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-600">{metric.label}</p>
            <StatusBadge status={metric.status} />
          </div>
          <p className="text-3xl font-black text-slate-950">{metric.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{metric.description}</p>
        </a>
      ))}
    </div>
  );
}

function QueueGrid({ dashboard }: { dashboard: AdminDashboardPayload }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {dashboard.queues.map((queue) => (
        <a key={queue.key} href={queue.desk_url || "/desk"} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-950">{queue.label}</h3>
              <p className="mt-2 text-sm text-slate-600">Open the Desk list view for triage and filtering.</p>
            </div>
            <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-black text-blue-700">{queue.count}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function RecentActivity({ dashboard }: { dashboard: AdminDashboardPayload }) {
  const items = dashboard.recent_activity.slice(0, 8);
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold text-slate-950">Recent audit activity</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {items.length ? (
          items.map((item) => (
            <a key={item.name} href={item.desk_url || "/desk"} className="block px-5 py-4 hover:bg-slate-50">
              <p className="text-sm font-semibold text-slate-950">{item.summary || item.event_type}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.actor} • {item.target_doctype} {item.target_name} • {item.timestamp}
              </p>
            </a>
          ))
        ) : (
          <p className="px-5 py-6 text-sm text-slate-600">No recent audit events are available yet.</p>
        )}
      </div>
    </div>
  );
}

function LiveActionPanel({ onSuccess }: { onSuccess: () => void }) {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [recordName, setRecordName] = useState("");
  const [domainKey, setDomainKey] = useState("decision");
  const [action, setAction] = useState("start_review");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [message, setMessage] = useState("");

  const selected = domainDefaults[domainKey];
  const notesRequired = action === "reject" || action === "request_more_information";
  const assignRequired = action === "assign";

  async function submitAction() {
    if (!recordName || (notesRequired && !notes.trim()) || (assignRequired && !assignedTo.trim())) {
      setSubmissionState("error");
      setMessage("Record name and required action details must be provided.");
      return;
    }

    setSubmissionState("loading");
    const result = await performAdminAction({
      domain: selected.domain,
      record_doctype: selected.doctype,
      record_name: recordName,
      action,
      notes,
      assigned_to: assignedTo || undefined,
    });
    setSubmissionState(result.ok && result.data?.ok ? "success" : "error");
    setMessage(result.data?.message || result.error || "Action submitted.");
    if (result.ok && result.data?.ok) onSuccess();
  }

  return (
    <FormSection title="Live admin action" description="Server-side workflow action with permission, state, audit and notification checks. Use Desk for full record editing.">
      <MockSubmissionState
        state={submissionState}
        idleMessage="Ready for live admin action."
        loadingMessage="Submitting action..."
        successMessage={message || "Action completed."}
        errorMessage={message || "Server validation failed."}
      />
      <SelectField
        label="Domain"
        value={domainKey}
        onChange={(event) => setDomainKey(event.currentTarget.value)}
        options={Object.entries(domainDefaults).map(([key, value]) => ({ value: key, label: value.doctype }))}
      />
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Record name
        <input
          value={recordName}
          onChange={(event) => setRecordName(event.currentTarget.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="RBP-..."
        />
      </label>
      <SelectField
        label="Action"
        value={action}
        onChange={(event) => setAction(event.currentTarget.value)}
        options={[
          "assign",
          "start_review",
          "request_more_information",
          "approve",
          "reject",
          "publish",
          "close",
          "cancel",
          "archive",
          "mark_outcome_ready",
          "mark_completed",
        ].map((value) => ({ value, label: value.replaceAll("_", " ") }))}
      />
      {assignRequired ? (
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Assignee
          <input value={assignedTo} onChange={(event) => setAssignedTo(event.currentTarget.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        </label>
      ) : null}
      <TextAreaField label={notesRequired ? "Notes required" : "Notes"} value={notes} onChange={(event) => setNotes(event.currentTarget.value)} />
      <button
        type="button"
        onClick={submitAction}
        disabled={submissionState === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {submissionState === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
        Submit action
      </button>
    </FormSection>
  );
}

function AuditPanel() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    listAuditLogs({ search }).then((result) => {
      if (!active) return;
      if (result.ok) setLogs(result.data?.audit_logs || []);
      else setError(result.error || "Could not load audit logs.");
    });
    return () => {
      active = false;
    };
  }, [search]);

  return (
    <div className="space-y-4">
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Search audit logs
        <input value={search} onChange={(event) => setSearch(event.currentTarget.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
      </label>
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}
      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white shadow-sm">
        {logs.map((log) => (
          <article key={log.name} className="px-5 py-4">
            <p className="text-sm font-bold text-slate-950">{log.summary || log.event_type}</p>
            <p className="mt-1 text-xs text-slate-500">
              {log.actor_label || log.actor} • {log.target_doctype} {log.target_name} • {log.timestamp}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function MockFallback() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [selectedRecordId, setSelectedRecordId] = useState(mockAdminReviewRecords[0]?.id ?? "");

  async function submitAction() {
    setSubmissionState("loading");
    const result = await submitMockAdminReviewAction({ recordId: selectedRecordId, action: "approve", notes: "Explicit dev fallback." });
    setSubmissionState(result.ok ? "success" : "error");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
        Explicit dev mock admin fallback is enabled by VITE_RBP_ENABLE_MOCK_ADMIN.
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockAdminMetrics.map((metric) => (
          <article key={metric.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-600">{metric.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{metric.value}</p>
          </article>
        ))}
      </div>
      <FormSection title="Dev mock action" description="No backend update, email, notification or permission check occurs.">
        <MockSubmissionState state={submissionState} idleMessage="Ready." loadingMessage="Submitting mock action..." successMessage="Mock action recorded." errorMessage="Mock action failed." />
        <SelectField
          label="Record"
          value={selectedRecordId}
          onChange={(event) => setSelectedRecordId(event.currentTarget.value)}
          options={(mockAdminReviewRecords as MockAdminReviewRecord[]).map((record) => ({ label: record.title, value: record.id }))}
        />
        <button type="button" onClick={submitAction} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white">
          Submit dev mock action
        </button>
      </FormSection>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockAdminQueues.map((queue) => (
          <article key={queue.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-bold text-slate-950">{queue.title}</p>
            <p className="mt-2 text-sm text-slate-600">{queue.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AdminConcepts() {
  const location = useLocation();
  const [dashboard, setDashboard] = useState<AdminDashboardPayload | null>(null);
  const [loading, setLoading] = useState(!mockAdminEnabled);
  const [error, setError] = useState("");
  const auditView = useMemo(() => location.pathname.includes("audit"), [location.pathname]);

  function refresh() {
    setLoading(true);
    getAdminDashboard().then((result) => {
      setLoading(false);
      if (result.ok) {
        setDashboard(result.data || null);
        setError("");
      } else {
        setError(result.error || "Admin dashboard unavailable.");
      }
    });
  }

  useEffect(() => {
    if (!mockAdminEnabled) refresh();
  }, []);

  return (
    <AdminShell>
      {mockAdminEnabled ? <MockFallback /> : null}
      {!mockAdminEnabled && loading ? (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-700">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          Loading live admin metrics...
        </div>
      ) : null}
      {!mockAdminEnabled && error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
          <div className="flex items-center gap-2">
            {error.includes("Permission") || error.includes("Login") ? <Lock className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {error}
          </div>
        </div>
      ) : null}
      {!mockAdminEnabled && dashboard ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button type="button" onClick={refresh} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
          {auditView ? (
            <AuditPanel />
          ) : (
            <>
              <MetricGrid dashboard={dashboard} />
              <QueueGrid dashboard={dashboard} />
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
                <RecentActivity dashboard={dashboard} />
                <LiveActionPanel onSuccess={refresh} />
              </div>
            </>
          )}
        </div>
      ) : null}
    </AdminShell>
  );
}
