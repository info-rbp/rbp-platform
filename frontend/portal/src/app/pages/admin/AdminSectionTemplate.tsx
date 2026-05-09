/**
 * AdminSectionTemplate.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable scaffold for all major RBP Admin Portal section pages.
 *
 * Usage — pass props to customise each section; every prop has a safe default
 * so the file renders meaningfully even with zero props supplied.
 *
 * Sections rendered (in order):
 *   1. Page Header
 *   2. Relationship Link Cards (Public Website + Member Portal)
 *   3. Summary Stat Cards
 *   4. Management Table
 *   5. Content Status Panel
 *   6. Related Sections Panel
 *   7. Future Setup / Notes
 *   8. Empty State Pattern (collapsible demo)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DO NOT modify: sidebar, NAV_GROUPS, breadcrumb, Admin Dashboard, routes.
 * This file is a visual scaffold only. No real CRUD / Firebase logic here.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import {
  Plus, Eye, Pencil, Archive, ExternalLink, Globe, Users,
  Info, FileText, CheckCircle, Clock, AlertTriangle,
  EyeOff, BookOpen, ChevronDown, ChevronUp, LayoutGrid,
  Layers, Link2, Lock, BadgeCheck,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ItemStatus     = "Ready" | "Placeholder" | "Content Required" | "Draft" | "Published" | "Hidden";
export type ItemVisibility = "Public" | "Members Only" | "Admin Only" | "Hidden";

export interface TemplateRow {
  id: number;
  name: string;
  category: string;
  status: ItemStatus;
  visibility: ItemVisibility;
  lastUpdated: string;
}

export interface SectionStat {
  published: number;
  draft: number;
  pending: number;
  content: number;
}

export interface AdminSectionTemplateProps {
  /** Page title shown in the header */
  title?: string;
  /** Short description below the title */
  description?: string;
  /** Badge label in the header (e.g. "Placeholder", "Live", "Draft") */
  badge?: string;
  /** Badge colour variant */
  badgeVariant?: "slate" | "amber" | "blue" | "emerald" | "rose" | "violet";
  /** Href for the "View Public Page" button — pass null to show "Not applicable" */
  publicRoute?: string | null;
  /** Href for the "View Portal Page" button — pass null to show "Not applicable" */
  portalRoute?: string | null;
  /** Override the four summary stat values */
  stats?: Partial<SectionStat>;
  /** Override the management table rows */
  rows?: TemplateRow[];
  /** Override the related sections list */
  relatedSections?: string[];
  /** Override the notes panel copy */
  note?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default / mock data
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_ROWS: TemplateRow[] = [
  { id: 1, name: "Section Overview",       category: "General",      status: "Placeholder",      visibility: "Public",       lastUpdated: "5 May 2026" },
  { id: 2, name: "Introduction Copy",      category: "Content",      status: "Content Required",  visibility: "Public",       lastUpdated: "2 May 2026" },
  { id: 3, name: "Pricing Information",    category: "Pricing",      status: "Draft",             visibility: "Public",       lastUpdated: "28 Apr 2026" },
  { id: 4, name: "Member Resources",       category: "Resources",    status: "Ready",             visibility: "Members Only", lastUpdated: "1 May 2026" },
  { id: 5, name: "Admin Workflow Notes",   category: "Internal",     status: "Draft",             visibility: "Admin Only",   lastUpdated: "30 Apr 2026" },
  { id: 6, name: "Legacy Archived Content",category: "Archive",      status: "Hidden",            visibility: "Hidden",       lastUpdated: "15 Mar 2026" },
];

const DEFAULT_RELATED: string[] = [
  "Overview",
  "Public Page Section",
  "Portal Section",
  "Admin Workflow",
  "Future Firebase Data",
];

const DEFAULT_STATS: SectionStat = {
  published: 2,
  draft:     3,
  pending:   4,
  content:   5,
};

const DEFAULT_NOTE =
  "This section is scaffolded for future content and data management. Final route wiring, live data, permissions, publishing workflow, and Firebase integration will be handled later in GitHub/Firebase Studio.";

// ─────────────────────────────────────────────────────────────────────────────
// Badge helpers
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CLS: Record<ItemStatus, string> = {
  Ready:            "bg-emerald-50 text-emerald-700",
  Placeholder:      "bg-slate-100 text-slate-500",
  "Content Required":"bg-amber-50 text-amber-700",
  Draft:            "bg-violet-50 text-violet-700",
  Published:        "bg-blue-50 text-blue-700",
  Hidden:           "bg-slate-200 text-slate-500",
};

const VISIBILITY_CLS: Record<ItemVisibility, string> = {
  Public:         "bg-blue-50 text-blue-600",
  "Members Only": "bg-violet-50 text-violet-600",
  "Admin Only":   "bg-orange-50 text-orange-600",
  Hidden:         "bg-slate-100 text-slate-400",
};

const BADGE_VARIANT_CLS: Record<NonNullable<AdminSectionTemplateProps["badgeVariant"]>, string> = {
  slate:   "bg-slate-100 text-slate-500",
  amber:   "bg-amber-50 text-amber-700",
  blue:    "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
  rose:    "bg-rose-50 text-rose-700",
  violet:  "bg-violet-50 text-violet-700",
};

function Badge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: ItemStatus }) {
  return <Badge label={status} className={STATUS_CLS[status]} />;
}

function VisibilityBadge({ vis }: { vis: ItemVisibility }) {
  return <Badge label={vis} className={VISIBILITY_CLS[vis]} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared card atoms
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, color, border, value, label, sub }: {
  icon: React.ElementType; color: string; border: string;
  value: number; label: string; sub: string;
}) {
  return (
    <div className={`bg-white rounded-2xl p-4 border ${border} shadow-sm`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-2xl font-extrabold text-slate-900 mb-0.5">{value}</div>
      <div className="text-xs font-semibold text-slate-700 mb-0.5">{label}</div>
      <div className="text-[10px] text-slate-400">{sub}</div>
    </div>
  );
}

function CardShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, right }: { title: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">{title}</div>
      {right && <div className="flex items-center gap-2 flex-wrap">{right}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Action button row (View / Edit / Archive)
// ─────────────────────────────────────────────────────────────────────────────

function RowActions() {
  return (
    <div className="flex items-center gap-1">
      <button title="View"    className="p-1.5 rounded-lg text-slate-300 hover:text-blue-600   hover:bg-blue-50   transition-all"><Eye     className="w-3.5 h-3.5" /></button>
      <button title="Edit"    className="p-1.5 rounded-lg text-slate-300 hover:text-slate-700  hover:bg-slate-100 transition-all"><Pencil  className="w-3.5 h-3.5" /></button>
      <button title="Archive" className="p-1.5 rounded-lg text-slate-300 hover:text-amber-600  hover:bg-amber-50  transition-all"><Archive className="w-3.5 h-3.5" /></button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Status Panel — status legend
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_LEGEND: { status: ItemStatus; icon: React.ElementType; description: string }[] = [
  { status: "Ready",            icon: BadgeCheck,    description: "Content confirmed and ready for review or publishing." },
  { status: "Placeholder",      icon: Layers,        description: "Section exists but content has not yet been written." },
  { status: "Content Required", icon: AlertTriangle, description: "Content is missing and must be added before publishing." },
  { status: "Draft",            icon: FileText,      description: "Content is being written and is not yet finalised." },
  { status: "Published",        icon: CheckCircle,   description: "Live and visible to the intended audience." },
  { status: "Hidden",           icon: EyeOff,        description: "Not visible publicly. Archived or disabled." },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main template component
// ─────────────────────────────────────────────────────────────────────────────

export function AdminSectionTemplate({
  title          = "Section Title",
  description    = "Short description of what this admin section manages and its relationship to the public website and member portal.",
  badge          = "Placeholder",
  badgeVariant   = "slate",
  publicRoute    = "/public-route",
  portalRoute    = "/portal-route",
  stats: statOverrides,
  rows           = DEFAULT_ROWS,
  relatedSections = DEFAULT_RELATED,
  note           = DEFAULT_NOTE,
}: AdminSectionTemplateProps) {

  const [emptyStateVisible, setEmptyStateVisible] = useState(false);
  const stats = { ...DEFAULT_STATS, ...statOverrides };

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">

      {/* ── 1. Page Header ────────────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl px-6 py-6 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-blue-700/20 rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 right-24 w-36 h-36 bg-slate-800 rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          {/* Title block */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Section</span>
            </div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-xl font-extrabold text-white">{title}</h2>
              <Badge label={badge} className={BADGE_VARIANT_CLS[badgeVariant]} />
            </div>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">{description}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> View Public Page
            </button>
            <button className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Relationship Link Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Public Website card */}
        <CardShell>
          <div className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-sm font-extrabold text-slate-900">Public Website</div>
                {publicRoute === null && (
                  <Badge label="Not applicable" className="bg-slate-100 text-slate-400" />
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                The public-facing page or section connected to this admin area.
              </p>
              {publicRoute !== null ? (
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <code className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg truncate max-w-[140px]">
                    {publicRoute}
                  </code>
                  <a href={publicRoute}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors">
                    View Public Page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  This section does not have a direct public website equivalent.
                </p>
              )}
            </div>
          </div>
        </CardShell>

        {/* Member Portal card */}
        <CardShell>
          <div className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-sm font-extrabold text-slate-900">Member Portal</div>
                {portalRoute === null && (
                  <Badge label="Not applicable" className="bg-slate-100 text-slate-400" />
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                The member-facing portal page connected to this admin area.
              </p>
              {portalRoute !== null ? (
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <code className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg truncate max-w-[140px]">
                    {portalRoute}
                  </code>
                  <a href={portalRoute ?? "#"}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-800 transition-colors">
                    View Portal Page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  This section does not have a direct member portal equivalent.
                </p>
              )}
            </div>
          </div>
        </CardShell>
      </div>

      {/* ── 3. Summary Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={CheckCircle} color="bg-emerald-50 text-emerald-700" border="border-emerald-100" value={stats.published} label="Published Items"  sub="Live and visible" />
        <StatCard icon={FileText}    color="bg-violet-50 text-violet-700"   border="border-violet-100"  value={stats.draft}     label="Draft Items"      sub="Not yet published" />
        <StatCard icon={Clock}       color="bg-amber-50 text-amber-700"     border="border-amber-100"   value={stats.pending}   label="Pending Requests" sub="Awaiting action" />
        <StatCard icon={AlertTriangle} color="bg-rose-50 text-rose-700"    border="border-rose-100"    value={stats.content}   label="Content Required" sub="Needs attention" />
      </div>

      {/* ── 4. Management Table ───────────────────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">Content Items</span>
              <Badge label={`${rows.length} items`} className="bg-slate-100 text-slate-500" />
            </>
          }
          right={
            <button className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          }
        />

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/70">
                {["Name", "Category", "Status", "Visibility", "Last Updated", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-blue-700/10 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{row.category}</td>
                  <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                  <td className="px-4 py-3"><VisibilityBadge vis={row.visibility} /></td>
                  <td className="px-4 py-3 text-[11px] text-slate-400 whitespace-nowrap">{row.lastUpdated}</td>
                  <td className="px-4 py-3"><RowActions /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-slate-50">
          {rows.map(row => (
            <div key={row.id} className="px-4 py-4 flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1.5">
                <div className="text-xs font-semibold text-slate-800">{row.name}</div>
                <div className="text-[10px] text-slate-400">{row.category}</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <StatusBadge status={row.status} />
                  <VisibilityBadge vis={row.visibility} />
                </div>
                <div className="text-[10px] text-slate-400">{row.lastUpdated}</div>
              </div>
              <RowActions />
            </div>
          ))}
        </div>
      </CardShell>

      {/* ── 5 & 6. Content Status + Related Sections (side by side on lg+) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Content Status Panel — spans 2 columns */}
        <CardShell className="lg:col-span-2">
          <CardHeader
            title={
              <>
                <BadgeCheck className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-extrabold text-slate-900">Content Status</span>
              </>
            }
          />
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STATUS_LEGEND.map(({ status, icon: Icon, description }) => (
              <div key={status}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${STATUS_CLS[status]}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={status} />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardShell>

        {/* Related Sections Panel — 1 column */}
        <CardShell>
          <CardHeader
            title={
              <>
                <Link2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-extrabold text-slate-900">Related Sections</span>
              </>
            }
          />
          <div className="p-4 space-y-2">
            {relatedSections.map((sec, i) => (
              <div key={i}
                className="flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all group cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-3 h-3 text-blue-500" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 truncate">{sec}</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
              </div>
            ))}
          </div>

          {/* Visibility legend — compact footer */}
          <div className="px-4 py-3 border-t border-slate-100 space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Visibility keys</p>
            {(Object.entries(VISIBILITY_CLS) as [ItemVisibility, string][]).map(([vis, cls]) => {
              const icons: Record<ItemVisibility, React.ElementType> = {
                Public: Globe, "Members Only": Users, "Admin Only": Lock, Hidden: EyeOff,
              };
              const Icon = icons[vis];
              return (
                <div key={vis} className="flex items-center gap-2">
                  <Badge label={vis} className={cls} />
                  <Icon className="w-3 h-3 text-slate-300" />
                </div>
              );
            })}
          </div>
        </CardShell>
      </div>

      {/* ── 7. Future Setup / Notes ──────────────────────────────────────── */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-500">Setup note:</span>{" "}{note}
        </p>
      </div>

      {/* ── 8. Empty State Pattern ─────────────────────────────────────── */}
      <CardShell>
        <button
          onClick={() => setEmptyStateVisible(v => !v)}
          className="w-full px-5 py-4 flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-extrabold text-slate-900">Empty State Pattern</span>
            <Badge label="Template reference" className="bg-slate-100 text-slate-400" />
          </div>
          {emptyStateVisible
            ? <ChevronUp   className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {emptyStateVisible && (
          <div className="border-t border-slate-100">
            {/* Empty state demo area */}
            <div className="px-6 py-12 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Layers className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-800 mb-1.5">No items yet</div>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Add your first item when this section is connected to live data.
                </p>
              </div>
              <button className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            {/* Usage note */}
            <div className="mx-5 mb-5 flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                <span className="font-bold">How to use this pattern:</span>{" "}
                Replace the management table with this empty state when a section has no items. Toggle this panel to show or hide it as a reference while building.
              </p>
            </div>
          </div>
        )}
      </CardShell>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Re-export shared atoms so individual section pages can import them directly
// ─────────────────────────────────────────────────────────────────────────────

export { StatCard, CardShell, CardHeader, RowActions, StatusBadge, VisibilityBadge, Badge };
export { STATUS_CLS, VISIBILITY_CLS };