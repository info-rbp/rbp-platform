/**
 * AdminSiteContent.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Expanded admin section for Site Content.
 * Visual scaffold only — no real CRUD, Firebase, or authentication.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import {
  Plus, Pencil, ExternalLink, Globe, Users,
  Info, FileText, CheckCircle, Clock, AlertTriangle,
  LayoutGrid, Layers, Zap, Settings, Activity,
  LayoutTemplate, Anchor, Navigation, Search, AlignLeft,
  List, Check, Eye } from "lucide-react";
import {
  CardShell, CardHeader, Badge, StatusBadge, VisibilityBadge,
  RowActions, StatCard, ItemStatus
} from "./AdminSectionTemplate";

// ─────────────────────────────────────────────────────────────────────────────
// Local badge types
// ─────────────────────────────────────────────────────────────────────────────

type AnchorStatus = "Ready" | "Needs Section ID" | "Query Planned" | "Planned" | "Content Required";
type SEOStatus = "Missing" | "Draft" | "Ready" | "Published";
type HeaderFooterStatus = "Placeholder" | "Content Required" | "Ready";

function AnchorStatusBadge({ status }: { status: AnchorStatus }) {
  const cls = {
    "Ready": "bg-emerald-50 text-emerald-700",
    "Needs Section ID": "bg-rose-50 text-rose-700",
    "Query Planned": "bg-blue-50 text-blue-700",
    "Planned": "bg-amber-50 text-amber-700",
    "Content Required": "bg-orange-50 text-orange-700"
  }[status];
  return <Badge label={status} className={cls} />;
}

function SEOStatusBadge({ status }: { status: SEOStatus }) {
  const cls = {
    "Missing": "bg-rose-50 text-rose-700",
    "Draft": "bg-amber-50 text-amber-700",
    "Ready": "bg-blue-50 text-blue-700",
    "Published": "bg-emerald-50 text-emerald-700"
  }[status];
  return <Badge label={status} className={cls} />;
}

function HFStatusBadge({ status }: { status: HeaderFooterStatus }) {
  const cls = {
    "Placeholder": "bg-slate-100 text-slate-500",
    "Content Required": "bg-amber-50 text-amber-700",
    "Ready": "bg-emerald-50 text-emerald-700"
  }[status];
  return <Badge label={status} className={cls} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

const PUBLIC_PAGES = [
  { name: "Home", route: "/", adminArea: "Site Content", status: "Content Required", lastUpdated: "5 May 2026" },
  { name: "About Us", route: "/about", adminArea: "Site Content", status: "Placeholder", lastUpdated: "5 May 2026" },
  { name: "Contact", route: "/contact", adminArea: "Site Content", status: "Ready", lastUpdated: "4 May 2026" },
  { name: "Help Center", route: "/help", adminArea: "Help Center", status: "Placeholder", lastUpdated: "4 May 2026" },
  { name: "On-Demand Services", route: "/on-demand", adminArea: "On-Demand Services", status: "Placeholder", lastUpdated: "3 May 2026" },
  { name: "Managed Services", route: "/managed-services", adminArea: "Managed Services", status: "Placeholder", lastUpdated: "3 May 2026" },
  { name: "Applications", route: "/applications", adminArea: "Applications", status: "Placeholder", lastUpdated: "3 May 2026" },
  { name: "Operations", route: "/operations", adminArea: "Operations", status: "Placeholder", lastUpdated: "2 May 2026" },
  { name: "Marketplace", route: "/marketplace", adminArea: "Marketplace", status: "Placeholder", lastUpdated: "2 May 2026" },
  { name: "Membership", route: "/membership", adminArea: "Membership", status: "Placeholder", lastUpdated: "1 May 2026" },
  { name: "Offers", route: "/offers", adminArea: "Offers", status: "Placeholder", lastUpdated: "1 May 2026" },
  { name: "Resources", route: "/resources", adminArea: "Resources", status: "Placeholder", lastUpdated: "1 May 2026" },
] as const;

const PAGE_SECTIONS = [
  { name: "On-Demand Services", sections: ["Overview", "Business Advisor", "Decision Desk", "The Fixer", "Document Nucleus", "Templates", "Documentation Suites", "Toolkits", "Process", "On-Demand Services"], status: "Placeholder", missingContent: 10, missingAnchors: 0 },
  { name: "Managed Services", sections: ["Overview", "Bid Management", "Real Estate", "HR Services", "Document Management", "Business Sale Support", "Custom Solutions"], status: "Placeholder", missingContent: 7, missingAnchors: 2 },
  { name: "Applications", sections: ["Overview", "Operations and Finance", "People and HR", "Sales and CRM", "Documents", "Support Desk", "Learning", "Analytics", "Payments and Billing", "Integrations"], status: "Draft", missingContent: 4, missingAnchors: 3 },
  { name: "Operations", sections: ["Overview", "Business Finance", "Business Insurance", "Superloop Connectivity", "Calculators"], status: "Placeholder", missingContent: 5, missingAnchors: 0 },
  { name: "Marketplace", sections: ["Overview", "Marketplace", "Buying Process", "List With Us"], status: "Placeholder", missingContent: 4, missingAnchors: 1 },
  { name: "Membership", sections: ["Overview", "Basic Membership", "Standard Membership", "Premium Membership", "Sign Up Today"], status: "Placeholder", missingContent: 5, missingAnchors: 1 },
  { name: "Offers", sections: ["Overview", "Exclusive Offers", "Top Offers", "Offer Categories"], status: "Placeholder", missingContent: 4, missingAnchors: 0 },
  { name: "Resources", sections: ["Overview", "Articles", "Guides", "Tools", "Downloads", "Educational"], status: "Placeholder", missingContent: 6, missingAnchors: 0 },
  { name: "Help Center", sections: ["Frequently Asked Questions", "Knowledge Base", "Troubleshooting", "Resources", "Support Center"], status: "Placeholder", missingContent: 5, missingAnchors: 0 },
  { name: "About Us", sections: ["About Us", "Our Purpose", "Our Platform", "Discovery Call", "Contact"], status: "Draft", missingContent: 2, missingAnchors: 0 },
] as const;

const ANCHOR_LINKS = [
  { route: "/applications#operations-finance", status: "Needs Section ID" },
  { route: "/applications#people-hr", status: "Needs Section ID" },
  { route: "/applications#integrations", status: "Planned" },
  { route: "/managed-services#document-management", status: "Needs Section ID" },
  { route: "/managed-services#business-sale-support", status: "Needs Section ID" },
  { route: "/marketplace#buying-process", status: "Needs Section ID" },
  { route: "/membership#premium", status: "Needs Section ID" },
  { route: "/offers?category=ai", status: "Query Planned" },
  { route: "/resources?type=guides", status: "Query Planned" },
  { route: "/help?section=faqs&category=applications", status: "Query Planned" },
] as const;

const MEGA_MENU = [
  { label: "On-Demand Services", route: "/on-demand", sections: 10, cta: "Book a call", status: "Placeholder" },
  { label: "Managed Services", route: "/managed-services", sections: 7, cta: "View Services", status: "Placeholder" },
  { label: "Applications", route: "/applications", sections: 10, cta: "Browse Apps", status: "Placeholder" },
  { label: "Operations", route: "/operations", sections: 5, cta: "Manage Operations", status: "Placeholder" },
  { label: "Marketplace", route: "/marketplace", sections: 4, cta: "View Listings", status: "Placeholder" },
  { label: "Membership", route: "/membership", sections: 5, cta: "Join Now", status: "Placeholder" },
  { label: "Offers", route: "/offers", sections: 4, cta: "View Offers", status: "Placeholder" },
  { label: "Resources", route: "/resources", sections: 6, cta: "View Resources", status: "Placeholder" },
  { label: "Help Center", route: "/help", sections: 5, cta: "Get Support", status: "Placeholder" },
  { label: "About Us", route: "/about", sections: 5, cta: "Contact Us", status: "Draft" },
] as const;

const SEO_ROWS = [
  { page: "Home", title: "Remote Business Partner", desc: "Your remote business partner...", ogImage: "Missing", indexing: "Allowed", status: "Draft" },
  { page: "Applications", title: "Applications | RBP", desc: "Browse our application catalogue...", ogImage: "Missing", indexing: "Allowed", status: "Draft" },
  { page: "About Us", title: "About Us | RBP", desc: "Learn more about us...", ogImage: "Missing", indexing: "Allowed", status: "Missing" },
] as const;

const HEADER_FOOTER = [
  { name: "Header Navigation", type: "Header", items: 10, status: "Placeholder" },
  { name: "Utility Links", type: "Header", items: 4, status: "Placeholder" },
  { name: "Public Mega Menu", type: "Header", items: 10, status: "Placeholder" },
  { name: "Footer Columns", type: "Footer", items: 4, status: "Placeholder" },
  { name: "Contact Details", type: "Footer", items: 3, status: "Ready" },
  { name: "Legal Links", type: "Footer", items: 2, status: "Placeholder" },
  { name: "Social Links", type: "Footer", items: 4, status: "Content Required" },
] as const;

const CONTENT_READINESS = [
  { area: "Home", route: "/", content: "Content Required", link: "Ready", seo: "Draft", lastUpdated: "5 May 2026" },
  { area: "Applications", route: "/applications", content: "Placeholder", link: "Needs Section ID", seo: "Draft", lastUpdated: "3 May 2026" },
  { area: "Managed Services", route: "/managed-services", content: "Placeholder", link: "Needs Section ID", seo: "Missing", lastUpdated: "3 May 2026" },
] as const;

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

export function AdminSiteContent() {
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
              <h2 className="text-xl font-extrabold text-white">Site Content</h2>
              <Badge label="Placeholder" className="bg-slate-100 text-slate-500" />
              <Badge label="/admin/site-content/pages" className="bg-slate-800 text-slate-400 font-mono" />
            </div>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              Manage the public website structure, page sections, mega menu content, SEO metadata, header and footer references, and content readiness.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <a href="/"
              className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> View Public Site
            </a>
            <button className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Content Item
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
                The front-facing website pages and navigation controlled by this admin area.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <code className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">/</code>
                <a href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors">
                  View Public Site <ExternalLink className="w-3 h-3" />
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
                Site Content does not directly control member-specific portal data, but some content may support portal resources and help content.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Badge label="Not applicable" className="bg-slate-100 text-slate-500" />
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400">
                  <span className="font-bold text-slate-500">Note:</span> Member-specific content is managed through Membership, Applications, Offers, Resources, Help Center, and related admin areas.
                </span>
              </div>
            </div>
          </div>
        </CardShell>
      </div>

      {/* ── 3. Summary Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={Globe}          color="bg-blue-50 text-blue-700"       border="border-blue-100"    value={12} label="Public Pages"      sub="Main sections" />
        <StatCard icon={Layers}         color="bg-indigo-50 text-indigo-700"   border="border-indigo-100"  value={61} label="Page Sections"     sub="Content blocks" />
        <StatCard icon={AlertTriangle}  color="bg-rose-50 text-rose-700"       border="border-rose-100"    value={8}  label="Content Required"  sub="Needs attention" />
        <StatCard icon={FileText}       color="bg-violet-50 text-violet-700"   border="border-violet-100"  value={15} label="Draft Sections"    sub="Not yet published" />
        <StatCard icon={CheckCircle}    color="bg-emerald-50 text-emerald-700" border="border-emerald-100" value={38} label="Published Sections"sub="Live and visible" />
        <StatCard icon={Anchor}         color="bg-amber-50 text-amber-700"     border="border-amber-100"   value={7}  label="Missing Anchors"   sub="Broken links" />
      </div>

      {/* ── 4. Public Pages Table ─────────────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">Public Pages</span>
            </>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/70">
                {["Page Name", "Public Route", "Related Admin Area", "Status", "Last Updated", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PUBLIC_PAGES.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">{row.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-[10px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{row.route}</code>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{row.adminArea}</td>
                  <td className="px-4 py-3"><StatusBadge status={row.status as ItemStatus} /></td>
                  <td className="px-4 py-3 text-[11px] text-slate-400 whitespace-nowrap">{row.lastUpdated}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all" title="Mark Ready">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardShell>

      {/* ── 5. Page Sections Panel ──────────────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">Page Sections</span>
              <Badge label={`${PAGE_SECTIONS.length} areas`} className="bg-slate-100 text-slate-500" />
            </>
          }
        />
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PAGE_SECTIONS.map((group, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-white p-4 flex flex-col gap-3 transition-all hover:shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-extrabold text-slate-800 leading-tight">{group.name}</div>
                  <div className="text-[10px] text-slate-400">{group.sections.length} sections</div>
                </div>
                <StatusBadge status={group.status as ItemStatus} />
              </div>
              
              <div className="flex-1 space-y-1 mt-1">
                {group.sections.slice(0, 4).map((sec, j) => (
                  <div key={j} className="text-[10px] text-slate-500 flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:bg-slate-200 before:rounded-full">
                    {sec}
                  </div>
                ))}
                {group.sections.length > 4 && (
                  <div className="text-[10px] text-slate-400 italic mt-1">+{group.sections.length - 4} more</div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-3 mt-1 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Missing Content</span>
                  <span className="text-xs font-bold text-slate-700">{group.missingContent}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Missing Anchors</span>
                  <span className={`text-xs font-bold ${group.missingAnchors > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {group.missingAnchors}
                  </span>
                </div>
                <div className="ml-auto">
                  <button className="text-[10px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1.5 rounded-lg transition-all">
                    Review Sections
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardShell>

      {/* ── 6. Anchor / Link Status Panel ─────────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <Anchor className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">Anchor and Link Status</span>
            </>
          }
        />
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <p className="text-xs text-slate-500">
            Track whether public mega menu links using anchors and query parameters have matching content sections.
          </p>
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
          {ANCHOR_LINKS.map((link, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors">
              <code className="text-xs font-mono text-slate-600 truncate">{link.route}</code>
              <AnchorStatusBadge status={link.status as AnchorStatus} />
            </div>
          ))}
        </div>
      </CardShell>

      {/* ── 7. Mega Menu Panel ────────────────────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <Navigation className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">Mega Menu</span>
            </>
          }
          right={
            <span className="text-[10px] text-slate-400 italic mr-2">Management view only</span>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/70">
                {["Menu Label", "Public Route", "Dropdown Sections", "CTA Link", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MEGA_MENU.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">{row.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-[10px] font-mono text-slate-500">{row.route}</code>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{row.sections} sections</td>
                  <td className="px-4 py-3 text-[11px] text-slate-500 whitespace-nowrap">{row.cta}</td>
                  <td className="px-4 py-3"><StatusBadge status={row.status as ItemStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="text-[10px] font-bold text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors whitespace-nowrap">View Menu</button>
                      <button className="text-[10px] font-bold text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors whitespace-nowrap">Review Links</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardShell>

      {/* ── 8. SEO / Metadata Panel ───────────────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">SEO / Metadata</span>
            </>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/70">
                {["Page", "Page Title", "Meta Description", "Open Graph Image", "Indexing Status", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {SEO_ROWS.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-xs font-semibold text-slate-800 whitespace-nowrap">{row.page}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[150px] truncate">{row.title}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate">{row.desc}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{row.ogImage}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{row.indexing}</td>
                  <td className="px-4 py-3"><SEOStatusBadge status={row.status as SEOStatus} /></td>
                  <td className="px-4 py-3"><RowActions /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardShell>

      {/* ── 9. Header / Footer Panel ──────────────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <LayoutTemplate className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">Header / Footer</span>
            </>
          }
        />
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {HEADER_FOOTER.map((item, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white hover:shadow-sm transition-all flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                  {item.type === "Header" ? <AlignLeft className="w-4 h-4 text-slate-400" /> : <List className="w-4 h-4 text-slate-400" />}
                </div>
                <HFStatusBadge status={item.status as HeaderFooterStatus} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">{item.name}</div>
                <div className="text-[10px] text-slate-500">{item.items} items</div>
              </div>
            </div>
          ))}
        </div>
      </CardShell>

      {/* ── 10. Content Status Dashboard ──────────────────────────────────── */}
      <CardShell>
        <CardHeader
          title={
            <>
              <Activity className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">Content Status Dashboard</span>
            </>
          }
        />
        
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-slate-600 font-medium">Ready <span className="text-slate-400">(24)</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            <span className="text-xs text-slate-600 font-medium">Placeholder <span className="text-slate-400">(45)</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-xs text-slate-600 font-medium">Content Required <span className="text-slate-400">(12)</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
            <span className="text-xs text-slate-600 font-medium">Draft <span className="text-slate-400">(18)</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-xs text-slate-600 font-medium">Published <span className="text-slate-400">(60)</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span className="text-xs text-slate-600 font-medium">Hidden <span className="text-slate-400">(3)</span></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-white">
                {["Area", "Public Route", "Content Status", "Link Status", "SEO Status", "Last Updated", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {CONTENT_READINESS.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-xs font-semibold text-slate-800 whitespace-nowrap">{row.area}</td>
                  <td className="px-4 py-3"><code className="text-[10px] font-mono text-slate-500">{row.route}</code></td>
                  <td className="px-4 py-3"><StatusBadge status={row.content as ItemStatus} /></td>
                  <td className="px-4 py-3"><AnchorStatusBadge status={row.link as AnchorStatus} /></td>
                  <td className="px-4 py-3"><SEOStatusBadge status={row.seo as SEOStatus} /></td>
                  <td className="px-4 py-3 text-[11px] text-slate-400 whitespace-nowrap">{row.lastUpdated}</td>
                  <td className="px-4 py-3"><RowActions /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardShell>

      {/* ── 11. Future Setup Note ─────────────────────────────────────────── */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 items-start">
        <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-700 block mb-1">Future Implementation Scaffold</strong>
          This Site Content area is scaffolded as the future control panel for public website content, page sections, mega menu references, SEO metadata, and content readiness. Final routing, live editing, publishing workflow, permissions, Firebase collections, and deployment behaviour will be completed later in GitHub/Firebase Studio.
        </div>
      </div>

    </div>
  );
}
