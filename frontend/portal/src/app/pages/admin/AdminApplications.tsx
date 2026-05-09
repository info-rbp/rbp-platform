/**
 * AdminApplications.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Expanded admin section for the Applications area.
 * Visual scaffold only — no real CRUD, Firebase, or authentication.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import {
  Plus, Pencil, ExternalLink, Globe, Users,
  Info, FileText, CheckCircle, Clock, AlertTriangle,
  LayoutGrid, Layers, Zap, Settings, Activity,
  ShoppingBag, BookOpen, BarChart2, CreditCard, Plug,
  Headphones, GraduationCap, Briefcase, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  CardShell, CardHeader, Badge, StatusBadge, VisibilityBadge,
  RowActions, StatCard,
} from "./AdminSectionTemplate";

// ─────────────────────────────────────────────────────────────────────────────
// Local badge types
// ─────────────────────────────────────────────────────────────────────────────

type MemberAccess       = "Available" | "Assigned" | "Request Required" | "Coming Soon";
type IntegrationStatus  = "Available" | "Coming Soon" | "Manual Setup" | "Requested" | "Connected" | "Issue";
type SyncHealth         = "Not Connected" | "Healthy" | "Warning" | "Error" | "Manual Only";
type RequestStatus      = "New" | "Reviewing" | "In Setup" | "Waiting on Member" | "Completed";
type Priority           = "High" | "Medium" | "Low";
type AppStatus          = "Ready" | "Placeholder" | "Content Required" | "Draft" | "Published" | "Hidden";
type AppVisibility      = "Public" | "Members Only" | "Admin Only" | "Hidden";
type CategoryStatus     = "Ready" | "Placeholder" | "Content Required" | "Draft" | "Published";

const MEMBER_ACCESS_CLS: Record<MemberAccess, string> = {
  Available:         "bg-emerald-50 text-emerald-700",
  Assigned:          "bg-blue-50 text-blue-700",
  "Request Required":"bg-amber-50 text-amber-700",
  "Coming Soon":     "bg-slate-100 text-slate-500",
};

const INTEGRATION_STATUS_CLS: Record<IntegrationStatus, string> = {
  Available:     "bg-emerald-50 text-emerald-700",
  "Coming Soon": "bg-slate-100 text-slate-500",
  "Manual Setup":"bg-amber-50 text-amber-700",
  Requested:     "bg-violet-50 text-violet-700",
  Connected:     "bg-blue-50 text-blue-700",
  Issue:         "bg-rose-50 text-rose-700",
};

const SYNC_HEALTH_CLS: Record<SyncHealth, string> = {
  "Not Connected": "bg-slate-100 text-slate-400",
  Healthy:         "bg-emerald-50 text-emerald-700",
  Warning:         "bg-amber-50 text-amber-700",
  Error:           "bg-rose-50 text-rose-700",
  "Manual Only":   "bg-orange-50 text-orange-700",
};

const REQUEST_STATUS_CLS: Record<RequestStatus, string> = {
  New:                "bg-blue-50 text-blue-700",
  Reviewing:          "bg-violet-50 text-violet-700",
  "In Setup":         "bg-amber-50 text-amber-700",
  "Waiting on Member":"bg-orange-50 text-orange-700",
  Completed:          "bg-emerald-50 text-emerald-700",
};

const PRIORITY_CLS: Record<Priority, string> = {
  High:   "bg-rose-50 text-rose-700",
  Medium: "bg-amber-50 text-amber-700",
  Low:    "bg-slate-100 text-slate-500",
};

const CATEGORY_STATUS_CLS: Record<CategoryStatus, string> = {
  Ready:            "bg-emerald-50 text-emerald-700",
  Placeholder:      "bg-slate-100 text-slate-500",
  "Content Required":"bg-amber-50 text-amber-700",
  Draft:            "bg-violet-50 text-violet-700",
  Published:        "bg-blue-50 text-blue-700",
};

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

interface AppCategory {
  id: number;
  name: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  publicSection: string;
  adminRoute: string;
  portalLink: string;
  status: CategoryStatus;
  count: number;
  planned?: boolean;
}

const CATEGORIES: AppCategory[] = [
  { id: 1, name: "Operations and Finance",  icon: Briefcase,       iconBg: "bg-blue-50",    iconColor: "text-blue-600",    publicSection: "/applications#operations-finance", adminRoute: "/admin/applications/operations-finance", portalLink: "/portal/apps",         status: "Draft",            count: 8 },
  { id: 2, name: "People and HR",           icon: Users,           iconBg: "bg-violet-50",  iconColor: "text-violet-600",  publicSection: "/applications#people-hr",           adminRoute: "/admin/applications/people-hr",          portalLink: "/portal/apps",         status: "Placeholder",      count: 3 },
  { id: 3, name: "Sales and CRM",           icon: ShoppingBag,     iconBg: "bg-emerald-50", iconColor: "text-emerald-600", publicSection: "/applications#sales-crm",           adminRoute: "/admin/applications/sales-crm",          portalLink: "/portal/apps",         status: "Content Required", count: 2 },
  { id: 4, name: "Documents",               icon: FileText,        iconBg: "bg-cyan-50",    iconColor: "text-cyan-600",    publicSection: "/applications#documents",           adminRoute: "/admin/applications/documents",          portalLink: "/portal/apps",         status: "Published",        count: 3 },
  { id: 5, name: "Support Desk",            icon: Headphones,      iconBg: "bg-orange-50",  iconColor: "text-orange-600",  publicSection: "/applications#support-desk",        adminRoute: "/admin/applications/support-desk",       portalLink: "/portal/apps",         status: "Draft",            count: 2 },
  { id: 6, name: "Learning",                icon: GraduationCap,   iconBg: "bg-pink-50",    iconColor: "text-pink-600",    publicSection: "/applications#learning",            adminRoute: "/admin/applications/learning",           portalLink: "/portal/apps",         status: "Placeholder",      count: 1 },
  { id: 7, name: "Analytics",               icon: BarChart2,       iconBg: "bg-indigo-50",  iconColor: "text-indigo-600",  publicSection: "/applications#analytics",           adminRoute: "/admin/applications/analytics",          portalLink: "/portal/apps",         status: "Draft",            count: 2 },
  { id: 8, name: "Payments and Billing",    icon: CreditCard,      iconBg: "bg-teal-50",    iconColor: "text-teal-600",    publicSection: "/applications#payments-billing",    adminRoute: "/admin/applications/payments-billing",   portalLink: "/portal/apps",         status: "Content Required", count: 2 },
  { id: 9, name: "Integrations",            icon: Plug,            iconBg: "bg-slate-100",  iconColor: "text-slate-500",   publicSection: "/applications#integrations",        adminRoute: "/admin/applications/integrations",       portalLink: "/portal/integrations", status: "Placeholder",      count: 0, planned: true },
];

interface AppRow {
  id: number;
  name: string;
  category: string;
  status: AppStatus;
  visibility: AppVisibility;
  memberAccess: MemberAccess;
  relatedIntegrations: string;
  lastUpdated: string;
}

const APP_ROWS: AppRow[] = [
  { id: 1,  name: "ERPNext",             category: "Operations & Finance", status: "Published",        visibility: "Public",       memberAccess: "Available",         relatedIntegrations: "Xero, Stripe",         lastUpdated: "4 May 2026" },
  { id: 2,  name: "Frappe CRM",          category: "Sales & CRM",          status: "Draft",            visibility: "Members Only", memberAccess: "Request Required",   relatedIntegrations: "ERPNext",              lastUpdated: "2 May 2026" },
  { id: 3,  name: "HRMS",                category: "People & HR",          status: "Placeholder",      visibility: "Members Only", memberAccess: "Coming Soon",        relatedIntegrations: "—",                    lastUpdated: "1 May 2026" },
  { id: 4,  name: "Helpdesk",            category: "Support Desk",         status: "Published",        visibility: "Members Only", memberAccess: "Assigned",           relatedIntegrations: "ERPNext",              lastUpdated: "28 Apr 2026" },
  { id: 5,  name: "Frappe LMS",          category: "Learning",             status: "Draft",            visibility: "Members Only", memberAccess: "Coming Soon",        relatedIntegrations: "—",                    lastUpdated: "25 Apr 2026" },
  { id: 6,  name: "Frappe Wiki",         category: "Documents",            status: "Published",        visibility: "Members Only", memberAccess: "Available",          relatedIntegrations: "Frappe Drive",         lastUpdated: "22 Apr 2026" },
  { id: 7,  name: "Frappe Drive",        category: "Documents",            status: "Published",        visibility: "Members Only", memberAccess: "Available",          relatedIntegrations: "Google Drive",         lastUpdated: "22 Apr 2026" },
  { id: 8,  name: "Payments",            category: "Payments & Billing",   status: "Content Required", visibility: "Members Only", memberAccess: "Coming Soon",        relatedIntegrations: "Stripe, Xero",         lastUpdated: "20 Apr 2026" },
  { id: 9,  name: "Analytics Dashboard", category: "Analytics",            status: "Draft",            visibility: "Members Only", memberAccess: "Request Required",   relatedIntegrations: "ERPNext",              lastUpdated: "18 Apr 2026" },
  { id: 10, name: "OpenAI Assistant",    category: "Integrations",         status: "Placeholder",      visibility: "Members Only", memberAccess: "Coming Soon",        relatedIntegrations: "OpenAI",               lastUpdated: "5 May 2026" },
];

interface SetupRequest {
  id: number;
  requestRef: string;
  member: string;
  application: string;
  category: string;
  priority: Priority;
  status: RequestStatus;
  assignedTo: string;
}

const SETUP_REQUESTS: SetupRequest[] = [
  { id: 1, requestRef: "REQ-001", member: "Jane Smith",    application: "ERPNext",             category: "Operations & Finance", priority: "High",   status: "In Setup",           assignedTo: "RBP Admin" },
  { id: 2, requestRef: "REQ-002", member: "Tom Davis",     application: "Frappe CRM",          category: "Sales & CRM",          priority: "Medium", status: "Reviewing",          assignedTo: "—" },
  { id: 3, requestRef: "REQ-003", member: "Sarah Johnson", application: "HRMS",                category: "People & HR",          priority: "High",   status: "New",                assignedTo: "—" },
  { id: 4, requestRef: "REQ-004", member: "Mike Lee",      application: "Analytics Dashboard", category: "Analytics",            priority: "Low",    status: "Waiting on Member",  assignedTo: "RBP Admin" },
  { id: 5, requestRef: "REQ-005", member: "Emma Wilson",   application: "Frappe Drive",        category: "Documents",            priority: "Medium", status: "Completed",          assignedTo: "RBP Admin" },
];

interface IntegrationRow {
  id: number;
  name: string;
  provider: string;
  relatedApp: string;
  category: string;
  status: IntegrationStatus;
  memberAvailability: AppVisibility;
  syncHealth: SyncHealth;
}

const INTEGRATION_ROWS: IntegrationRow[] = [
  { id: 1,  name: "ERPNext",        provider: "Frappe",    relatedApp: "ERPNext",             category: "Operations",     status: "Connected",     memberAvailability: "Members Only", syncHealth: "Healthy" },
  { id: 2,  name: "Frappe CRM",     provider: "Frappe",    relatedApp: "Frappe CRM",          category: "Sales & CRM",    status: "Available",     memberAvailability: "Members Only", syncHealth: "Not Connected" },
  { id: 3,  name: "HRMS",           provider: "Frappe",    relatedApp: "HRMS",                category: "People & HR",    status: "Coming Soon",   memberAvailability: "Members Only", syncHealth: "Not Connected" },
  { id: 4,  name: "Helpdesk",       provider: "Frappe",    relatedApp: "Helpdesk",            category: "Support",        status: "Connected",     memberAvailability: "Members Only", syncHealth: "Healthy" },
  { id: 5,  name: "Payments",       provider: "Frappe",    relatedApp: "Payments",            category: "Payments",       status: "Manual Setup",  memberAvailability: "Members Only", syncHealth: "Manual Only" },
  { id: 6,  name: "OpenAI",         provider: "OpenAI",    relatedApp: "OpenAI Assistant",    category: "AI / Tools",     status: "Requested",     memberAvailability: "Members Only", syncHealth: "Not Connected" },
  { id: 7,  name: "Google Drive",   provider: "Google",    relatedApp: "Frappe Drive",        category: "Documents",      status: "Available",     memberAvailability: "Members Only", syncHealth: "Not Connected" },
  { id: 8,  name: "Microsoft 365",  provider: "Microsoft", relatedApp: "Documents",           category: "Documents",      status: "Coming Soon",   memberAvailability: "Members Only", syncHealth: "Not Connected" },
  { id: 9,  name: "Xero",           provider: "Xero",      relatedApp: "Payments",            category: "Finance",        status: "Manual Setup",  memberAvailability: "Members Only", syncHealth: "Warning" },
  { id: 10, name: "Stripe",         provider: "Stripe",    relatedApp: "Payments",            category: "Payments",       status: "Available",     memberAvailability: "Members Only", syncHealth: "Not Connected" },
  { id: 11, name: "Custom API",     provider: "Internal",  relatedApp: "Various",             category: "Custom",         status: "Coming Soon",   memberAvailability: "Admin Only",   syncHealth: "Not Connected" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Local badge components
// ─────────────────────────────────────────────────────────────────────────────

function MemberAccessBadge({ value }: { value: MemberAccess }) {
  return <Badge label={value} className={MEMBER_ACCESS_CLS[value]} />;
}
function IntegrationStatusBadge({ value }: { value: IntegrationStatus }) {
  return <Badge label={value} className={INTEGRATION_STATUS_CLS[value]} />;
}
function SyncHealthBadge({ value }: { value: SyncHealth }) {
  const dot: Record<SyncHealth, string> = {
    "Not Connected": "bg-slate-400", Healthy: "bg-emerald-500",
    Warning: "bg-amber-500", Error: "bg-rose-500", "Manual Only": "bg-orange-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-lg ${SYNC_HEALTH_CLS[value]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[value]}`} />
      {value}
    </span>
  );
}
function RequestStatusBadge({ value }: { value: RequestStatus }) {
  return <Badge label={value} className={REQUEST_STATUS_CLS[value]} />;
}
function PriorityBadge({ value }: { value: Priority }) {
  return <Badge label={value} className={PRIORITY_CLS[value]} />;
}
function CategoryStatusBadge({ value }: { value: CategoryStatus }) {
  return <Badge label={value} className={CATEGORY_STATUS_CLS[value]} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mini link pill
// ─────────────────────────────────────────────────────────────────────────────
function LinkPill({ label, href }: { label: string; href: string }) {
  return (
    <a href={href}
      className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-2 py-0.5 rounded-lg transition-all whitespace-nowrap">
      {label} <ExternalLink className="w-2.5 h-2.5" />
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function AdminApplications() {
  const [integrationsExpanded, setIntegrationsExpanded] = useState(true);

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">

      {/* ── 1. Page Header ────────────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl px-6 py-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-blue-700/20 rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 right-24 w-36 h-36 bg-slate-800 rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Section</span>
            </div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-xl font-extrabold text-white">Applications</h2>
              <Badge label="Placeholder" className="bg-slate-100 text-slate-500" />
              <Badge label="/admin/applications" className="bg-slate-800 text-slate-400 font-mono" />
            </div>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              Manage the application catalogue, application categories, setup requests, member access, and integrations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <a href="/applications"
              className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> View Public Applications
            </a>
            <button className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Application
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Relationship Link Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Public Website */}
        <CardShell>
          <div className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-slate-900 mb-1">Public Website</div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                The public-facing Applications page and application category sections.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <code className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">/applications</code>
                <a href="/applications" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors">
                  View Public Page <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </CardShell>

        {/* Member Portal */}
        <CardShell>
          <div className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-slate-900 mb-1">Member Portal</div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                The member-facing applications area where users view assigned apps, requested apps, and setup status.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <code className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">/portal/apps</code>
                <a href="/portal/apps" className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-800 transition-colors">
                  View Portal Page <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {/* Planned link reference */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                <Badge label="Planned" className="bg-amber-50 text-amber-700" />
                <span className="text-[10px] text-slate-400">Integrations portal route:</span>
                <code className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">/portal/integrations</code>
              </div>
            </div>
          </div>
        </CardShell>
      </div>

      {/* ── 3. Summary Stat Cards (6) ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={CheckCircle}    color="bg-emerald-50 text-emerald-700" border="border-emerald-100" value={4}  label="Published Apps"      sub="Live and visible" />
        <StatCard icon={FileText}       color="bg-violet-50 text-violet-700"   border="border-violet-100"  value={5}  label="Draft Applications"   sub="Not yet published" />
        <StatCard icon={Clock}          color="bg-amber-50 text-amber-700"     border="border-amber-100"   value={5}  label="Setup Requests"       sub="Awaiting action" />
        <StatCard icon={Users}          color="bg-blue-50 text-blue-700"       border="border-blue-100"    value={12} label="Member App Access"    sub="Active assignments" />
        <StatCard icon={Plug}           color="bg-indigo-50 text-indigo-700"   border="border-indigo-100"  value={3}  label="Integration Requests" sub="Pending review" />
        <StatCard icon={AlertTriangle}  color="bg-rose-50 text-rose-700"       border="border-rose-100"    value={4}  label="Content Required"     sub="Needs attention" />
      </div>

      {/* ── 4. Application Category Overview ─────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">Application Categories</span>
              <Badge label="9 categories" className="bg-slate-100 text-slate-500" />
            </>
          }
          right={
            <button className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          }
        />
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.id}
                className={`rounded-xl border p-4 flex flex-col gap-3 transition-all hover:shadow-sm ${cat.planned ? "border-dashed border-slate-200 bg-slate-50/50" : "border-slate-100 bg-white"}`}>
                {/* Cat header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${cat.iconBg}`}>
                      <Icon className={`w-4 h-4 ${cat.iconColor}`} />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-800 leading-tight">{cat.name}</div>
                      <div className="text-[10px] text-slate-400">{cat.count} {cat.count === 1 ? "app" : "apps"}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <CategoryStatusBadge value={cat.status} />
                    {cat.planned && <Badge label="Planned" className="bg-amber-50 text-amber-700" />}
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-2.5 h-2.5 text-slate-300 flex-shrink-0" />
                    <LinkPill label={cat.publicSection} href={cat.publicSection} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Settings className="w-2.5 h-2.5 text-slate-300 flex-shrink-0" />
                    <LinkPill label={cat.adminRoute} href={cat.adminRoute} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-2.5 h-2.5 text-slate-300 flex-shrink-0" />
                    <LinkPill label={cat.portalLink} href={cat.portalLink} />
                    {cat.planned && <Badge label="Planned" className="bg-amber-50 text-amber-600 text-[9px] py-0" />}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 pt-1 border-t border-slate-100">
                  <button className="flex-1 text-[10px] font-bold text-blue-700 hover:text-blue-800 hover:bg-blue-50 py-1.5 rounded-lg transition-all">
                    Manage
                  </button>
                  <button className="p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all">
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </CardShell>

      {/* ── 5. Application Catalogue Table ───────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <LayoutGrid className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">Application Catalogue</span>
              <Badge label={`${APP_ROWS.length} applications`} className="bg-slate-100 text-slate-500" />
            </>
          }
          right={
            <button className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Application
            </button>
          }
        />

        {/* Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/70">
                {["Application Name", "Category", "Status", "Visibility", "Member Access", "Related Integrations", "Last Updated", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {APP_ROWS.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-blue-700/10 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{row.category}</td>
                  <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                  <td className="px-4 py-3"><VisibilityBadge vis={row.visibility} /></td>
                  <td className="px-4 py-3"><MemberAccessBadge value={row.memberAccess} /></td>
                  <td className="px-4 py-3 text-[10px] text-slate-400 whitespace-nowrap">{row.relatedIntegrations}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-400 whitespace-nowrap">{row.lastUpdated}</td>
                  <td className="px-4 py-3"><RowActions /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="lg:hidden divide-y divide-slate-50">
          {APP_ROWS.map(row => (
            <div key={row.id} className="px-4 py-4 flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1.5">
                <div className="text-xs font-semibold text-slate-800">{row.name}</div>
                <div className="text-[10px] text-slate-400">{row.category}</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <StatusBadge status={row.status} />
                  <MemberAccessBadge value={row.memberAccess} />
                </div>
                <div className="text-[10px] text-slate-400">{row.lastUpdated}</div>
              </div>
              <RowActions />
            </div>
          ))}
        </div>
      </CardShell>

      {/* ── 6. Setup Requests Panel ───────────────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">Application Setup Requests</span>
              <Badge label={`${SETUP_REQUESTS.length} requests`} className="bg-amber-50 text-amber-700" />
            </>
          }
          right={
            <button className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all">
              View All
            </button>
          }
        />

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/70">
                {["Request", "Member", "Application", "Category", "Priority", "Status", "Assigned To", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {SETUP_REQUESTS.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{req.requestRef}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-white">{req.member.split(" ").map(w => w[0]).join("")}</span>
                      </div>
                      <span className="text-xs text-slate-700 whitespace-nowrap">{req.member}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-800 whitespace-nowrap">{req.application}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{req.category}</td>
                  <td className="px-4 py-3"><PriorityBadge value={req.priority} /></td>
                  <td className="px-4 py-3"><RequestStatusBadge value={req.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{req.assignedTo}</td>
                  <td className="px-4 py-3">
                    <button className="text-[10px] font-bold text-blue-700 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-slate-50">
          {SETUP_REQUESTS.map(req => (
            <div key={req.id} className="px-4 py-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{req.requestRef}</span>
                <RequestStatusBadge value={req.status} />
              </div>
              <div className="text-xs font-semibold text-slate-800">{req.application}</div>
              <div className="text-[10px] text-slate-500">{req.member} · {req.category}</div>
              <div className="flex items-center gap-2">
                <PriorityBadge value={req.priority} />
              </div>
            </div>
          ))}
        </div>
      </CardShell>

      {/* ── 7. Integrations Section ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Section toggle header */}
        <button
          onClick={() => setIntegrationsExpanded(v => !v)}
          className="w-full bg-white px-5 py-4 flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Plug className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">Integrations</span>
                <Badge label="Under Applications" className="bg-indigo-50 text-indigo-600" />
                <Badge label="Scaffold" className="bg-slate-100 text-slate-500" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Integration catalogue, connected members, setup requests, and sync status.</p>
            </div>
          </div>
          {integrationsExpanded
            ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
            : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
        </button>

        {integrationsExpanded && (
          <div className="border-t border-slate-100 bg-slate-50/30">

            {/* Integration mini stat cards */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Integration Catalogue",  value: 11, icon: BookOpen,  color: "bg-indigo-50 text-indigo-700",  border: "border-indigo-100" },
                { label: "Connected Members",       value: 6,  icon: Users,    color: "bg-blue-50 text-blue-700",     border: "border-blue-100" },
                { label: "Setup Requests",          value: 3,  icon: Clock,    color: "bg-amber-50 text-amber-700",   border: "border-amber-100" },
                { label: "Sync Status",             value: 2,  icon: Activity, color: "bg-emerald-50 text-emerald-700",border: "border-emerald-100" },
                { label: "Provider Management",     value: 8,  icon: Settings, color: "bg-slate-100 text-slate-600",  border: "border-slate-200" },
                { label: "Related Applications",    value: 10, icon: Zap,      color: "bg-violet-50 text-violet-700", border: "border-violet-100" },
              ].map(s => (
                <StatCard key={s.label} icon={s.icon} color={s.color} border={s.border} value={s.value} label={s.label} sub="Mock data" />
              ))}
            </div>

            {/* Integrations table */}
            <div className="mx-4 mb-4 bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Plug className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-extrabold text-slate-900">Integrations Catalogue</span>
                  <Badge label={`${INTEGRATION_ROWS.length} integrations`} className="bg-slate-100 text-slate-500" />
                </div>
                <button className="inline-flex items-center gap-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add Integration
                </button>
              </div>

              {/* Desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/70">
                      {["Integration Name", "Provider", "Related Application", "Category", "Status", "Member Availability", "Sync Health", "Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {INTEGRATION_ROWS.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Plug className="w-3.5 h-3.5 text-indigo-600" />
                            </div>
                            <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">{row.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{row.provider}</td>
                        <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{row.relatedApp}</td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{row.category}</td>
                        <td className="px-4 py-3"><IntegrationStatusBadge value={row.status} /></td>
                        <td className="px-4 py-3"><VisibilityBadge vis={row.memberAvailability} /></td>
                        <td className="px-4 py-3"><SyncHealthBadge value={row.syncHealth} /></td>
                        <td className="px-4 py-3"><RowActions /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="lg:hidden divide-y divide-slate-50">
                {INTEGRATION_ROWS.map(row => (
                  <div key={row.id} className="px-4 py-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                      <div className="text-xs font-semibold text-slate-800">{row.name}</div>
                      <div className="text-[10px] text-slate-400">{row.provider} · {row.category}</div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <IntegrationStatusBadge value={row.status} />
                        <SyncHealthBadge value={row.syncHealth} />
                      </div>
                    </div>
                    <RowActions />
                  </div>
                ))}
              </div>
            </div>

            {/* Integrations note */}
            <div className="mx-4 mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
              <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                <span className="font-bold">Integrations scaffold note:</span>{" "}
                Integrations are scaffolded as part of the Applications admin area. Real provider connections, sync logs, API credentials, member-specific access, and automation workflows will be handled later in GitHub/Firebase Studio.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── 8. Content Status Panel ───────────────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <Activity className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">Content Status by Section</span>
            </>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/70">
                {["Section", "Status", "Public Section Link", "Admin Route", "Content Required"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {CATEGORIES.map(cat => {
                const contentRequired = cat.status === "Content Required";
                return (
                  <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <cat.icon className={`w-3.5 h-3.5 ${cat.iconColor}`} />
                        <span className="text-xs font-semibold text-slate-800">{cat.name}</span>
                        {cat.planned && <Badge label="Planned" className="bg-amber-50 text-amber-700" />}
                      </div>
                    </td>
                    <td className="px-4 py-3"><CategoryStatusBadge value={cat.status} /></td>
                    <td className="px-4 py-3"><LinkPill label={cat.publicSection} href={cat.publicSection} /></td>
                    <td className="px-4 py-3"><LinkPill label={cat.adminRoute} href={cat.adminRoute} /></td>
                    <td className="px-4 py-3">
                      {contentRequired
                        ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg"><AlertTriangle className="w-3 h-3" /> Required</span>
                        : <span className="text-[10px] text-slate-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardShell>

      {/* ── 9. Future Setup Note ──────────────────────────────────────────── */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-500">Setup note:</span>{" "}
          This Applications admin area is a scaffold for future catalogue management, setup requests, member app access, and integrations. Final routing, live data, Firebase collections, permissions, publishing workflow, and integration APIs will be completed later in GitHub/Firebase Studio.
        </p>
      </div>

    </div>
  );
}