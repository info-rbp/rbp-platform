import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Archive, Database, RefreshCw, Save, UploadCloud } from "lucide-react";

import {
  resourceCategoryFilters,
  resourceTypeFilters,
  type PublicResource,
  type ResourceType,
} from "../../data/resources";
import {
  helpCategories,
  helpSections,
  type HelpArticle,
  type HelpSectionId,
} from "../../data/helpCenter";
import { createMockRecordId } from "../../utils/adminCrud";
import {
  archiveHelpArticleRecord,
  archiveResourceRecord,
  isFirebaseConfigured,
  listHelpArticleRecords,
  listResourceRecords,
  saveHelpArticleRecord,
  saveResourceRecord,
  seedStaticHelpArticlesToFirestore,
  seedStaticResourcesToFirestore,
} from "../../services/publicContentBackend";

import { AdminFormShell } from "./AdminFormShell";
import { AdminStatusBadge } from "./AdminStatusBadge";

type ContentStatus = "ready" | "placeholder" | "content-required" | "backend-later";

const inputClass =
  "w-full border border-slate-200 bg-white text-slate-900 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function createResourceDraft(): PublicResource {
  return {
    id: "",
    title: "",
    summary: "",
    type: "articles",
    category: "operations",
    readTime: "",
    href: "/resources",
    status: "ready",
  };
}

function createHelpDraft(): HelpArticle {
  return {
    id: "",
    section: "faqs",
    category: "other",
    question: "",
    answer: "",
    status: "ready",
  };
}

function BackendStatusNotice() {
  return (
    <div
      className={`rounded-2xl border p-4 text-sm ${
        isFirebaseConfigured
          ? "border-emerald-100 bg-emerald-50 text-emerald-800"
          : "border-amber-100 bg-amber-50 text-amber-800"
      }`}
    >
      <strong>{isFirebaseConfigured ? "Firebase configured." : "Firebase not configured."}</strong>{" "}
      {isFirebaseConfigured
        ? "Reads and writes will use Firestore for Resources and Help Center."
        : "The interface will still work using local/static fallback data until .env.local is configured."}
    </div>
  );
}

function BackendRecordCard({
  title,
  subtitle,
  status,
  onEdit,
  onArchive,
}: {
  title: string;
  subtitle: string;
  status: ContentStatus;
  onEdit: () => void;
  onArchive: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="font-bold text-slate-900">{title}</div>
        <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
        <div className="mt-3">
          <AdminStatusBadge label={status} status={status} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
        >
          Edit
        </button>
        <button
          onClick={onArchive}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 transition-all"
        >
          <Archive className="w-4 h-4" />
          Archive
        </button>
      </div>
    </div>
  );
}

function ResourcesBackendWorkspace() {
  const [records, setRecords] = useState<PublicResource[]>([]);
  const [draft, setDraft] = useState<PublicResource>(createResourceDraft());
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function loadRecords() {
    setIsLoading(true);
    setNotice("");

    try {
      const loaded = await listResourceRecords({ publicOnly: false });
      setRecords(loaded);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to load resources.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function saveDraft() {
    if (!draft.title.trim() || !draft.summary.trim()) {
      setNotice("Title and summary are required.");
      return;
    }

    const record: PublicResource = {
      ...draft,
      id: draft.id || createMockRecordId("resource", draft.title),
      href: draft.href || "/resources",
    };

    await saveResourceRecord(record);
    setRecords((current) => {
      const exists = current.some((item) => item.id === record.id);
      return exists
        ? current.map((item) => (item.id === record.id ? record : item))
        : [...current, record];
    });
    setDraft(createResourceDraft());
    setNotice(isFirebaseConfigured ? "Resource saved to Firestore." : "Resource saved locally. Configure Firebase to persist it.");
  }

  async function archiveRecord(id: string) {
    await archiveResourceRecord(id);
    setRecords((current) => current.filter((item) => item.id !== id));
    setNotice(isFirebaseConfigured ? "Resource archived in Firestore." : "Resource removed locally. Configure Firebase to persist archives.");
  }

  async function seedRecords() {
    const result = await seedStaticResourcesToFirestore();
    setNotice(
      result.enabled
        ? `Seeded ${result.count} static resources into Firestore.`
        : "Firebase is not configured. Add .env.local values before seeding."
    );
    await loadRecords();
  }

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Backend Resources</h2>
              <p className="text-xs text-slate-500 mt-1">
                Firestore-backed Resources collection with static fallback.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadRecords}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={seedRecords}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                <UploadCloud className="w-4 h-4" />
                Seed
              </button>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {isLoading && <div className="text-sm text-slate-500">Loading resources...</div>}
            {!isLoading && records.length === 0 && (
              <div className="text-sm text-slate-500">No resource records found.</div>
            )}
            {records.map((record) => (
              <BackendRecordCard
                key={record.id}
                title={record.title}
                subtitle={`${record.type} · ${record.category}`}
                status={record.status}
                onEdit={() => setDraft(record)}
                onArchive={() => archiveRecord(record.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <AdminFormShell
        title={draft.id ? "Edit Backend Resource" : "Create Backend Resource"}
        description="Create or update Resources records. Firestore is used when configured; static/local fallback is used otherwise."
        footer={
          <button
            onClick={saveDraft}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Resource
          </button>
        }
      >
        <BackendStatusNotice />
        {notice && <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">{notice}</div>}

        <Field label="Title">
          <input
            className={inputClass}
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            placeholder="Resource title"
          />
        </Field>

        <Field label="Summary">
          <textarea
            className={inputClass}
            value={draft.summary}
            onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))}
            rows={4}
            placeholder="Resource summary"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Type">
            <select
              className={inputClass}
              value={draft.type}
              onChange={(event) =>
                setDraft((current) => ({ ...current, type: event.target.value as ResourceType }))
              }
            >
              {resourceTypeFilters.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Category">
            <select
              className={inputClass}
              value={draft.category}
              onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
            >
              {resourceCategoryFilters.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Read Time">
          <input
            className={inputClass}
            value={draft.readTime ?? ""}
            onChange={(event) => setDraft((current) => ({ ...current, readTime: event.target.value }))}
            placeholder="10 min read"
          />
        </Field>

        <Field label="Public Link">
          <input
            className={inputClass}
            value={draft.href}
            onChange={(event) => setDraft((current) => ({ ...current, href: event.target.value }))}
            placeholder="/resources"
          />
        </Field>

        <Field label="Status">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as ContentStatus }))}
          >
            <option value="ready">Ready</option>
            <option value="placeholder">Placeholder</option>
            <option value="content-required">Content Required</option>
            <option value="backend-later">Backend Later</option>
          </select>
        </Field>
      </AdminFormShell>
    </section>
  );
}

function HelpCenterBackendWorkspace() {
  const [records, setRecords] = useState<HelpArticle[]>([]);
  const [draft, setDraft] = useState<HelpArticle>(createHelpDraft());
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function loadRecords() {
    setIsLoading(true);
    setNotice("");

    try {
      const loaded = await listHelpArticleRecords({ publicOnly: false });
      setRecords(loaded);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to load help articles.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function saveDraft() {
    if (!draft.question.trim() || !draft.answer.trim()) {
      setNotice("Question and answer are required.");
      return;
    }

    const record: HelpArticle = {
      ...draft,
      id: draft.id || createMockRecordId("help", draft.question),
    };

    await saveHelpArticleRecord(record);
    setRecords((current) => {
      const exists = current.some((item) => item.id === record.id);
      return exists
        ? current.map((item) => (item.id === record.id ? record : item))
        : [...current, record];
    });
    setDraft(createHelpDraft());
    setNotice(isFirebaseConfigured ? "Help article saved to Firestore." : "Help article saved locally. Configure Firebase to persist it.");
  }

  async function archiveRecord(id: string) {
    await archiveHelpArticleRecord(id);
    setRecords((current) => current.filter((item) => item.id !== id));
    setNotice(isFirebaseConfigured ? "Help article archived in Firestore." : "Help article removed locally. Configure Firebase to persist archives.");
  }

  async function seedRecords() {
    const result = await seedStaticHelpArticlesToFirestore();
    setNotice(
      result.enabled
        ? `Seeded ${result.count} static help articles into Firestore.`
        : "Firebase is not configured. Add .env.local values before seeding."
    );
    await loadRecords();
  }

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Backend Help Articles</h2>
              <p className="text-xs text-slate-500 mt-1">
                Firestore-backed Help Center collection with static fallback.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadRecords}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={seedRecords}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                <UploadCloud className="w-4 h-4" />
                Seed
              </button>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {isLoading && <div className="text-sm text-slate-500">Loading help articles...</div>}
            {!isLoading && records.length === 0 && (
              <div className="text-sm text-slate-500">No help article records found.</div>
            )}
            {records.map((record) => (
              <BackendRecordCard
                key={record.id}
                title={record.question}
                subtitle={`${record.section} · ${record.category}`}
                status={record.status}
                onEdit={() => setDraft(record)}
                onArchive={() => archiveRecord(record.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <AdminFormShell
        title={draft.id ? "Edit Backend Help Article" : "Create Backend Help Article"}
        description="Create or update Help Center records. Firestore is used when configured; static/local fallback is used otherwise."
        footer={
          <button
            onClick={saveDraft}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Help Article
          </button>
        }
      >
        <BackendStatusNotice />
        {notice && <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">{notice}</div>}

        <Field label="Question">
          <input
            className={inputClass}
            value={draft.question}
            onChange={(event) => setDraft((current) => ({ ...current, question: event.target.value }))}
            placeholder="Help question"
          />
        </Field>

        <Field label="Answer">
          <textarea
            className={inputClass}
            value={draft.answer}
            onChange={(event) => setDraft((current) => ({ ...current, answer: event.target.value }))}
            rows={4}
            placeholder="Help answer"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section">
            <select
              className={inputClass}
              value={draft.section}
              onChange={(event) =>
                setDraft((current) => ({ ...current, section: event.target.value as HelpSectionId }))
              }
            >
              {helpSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Category">
            <select
              className={inputClass}
              value={draft.category}
              onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
            >
              {helpCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Status">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as ContentStatus }))}
          >
            <option value="ready">Ready</option>
            <option value="placeholder">Placeholder</option>
            <option value="content-required">Content Required</option>
            <option value="backend-later">Backend Later</option>
          </select>
        </Field>
      </AdminFormShell>
    </section>
  );
}

export function AdminBackendContentWorkspace() {
  const location = useLocation();

  if (location.pathname.startsWith("/admin/resources")) {
    return <ResourcesBackendWorkspace />;
  }

  if (location.pathname.startsWith("/admin/help-center")) {
    return <HelpCenterBackendWorkspace />;
  }

  return null;
}

export function AdminBackendContentSummary() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
      <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
        <Database className="w-4 h-4" />
        Backend phase one
      </div>
      Resources and Help Center are the first Firestore-backed content areas.
    </div>
  );
}
