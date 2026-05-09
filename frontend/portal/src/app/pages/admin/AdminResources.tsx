import { AdminSectionTemplate, TemplateRow } from "./AdminSectionTemplate";

const ROWS: TemplateRow[] = [
  { id: 1, name: "Resources Overview Page",        category: "Overview",       status: "Placeholder",       visibility: "Public",       lastUpdated: "5 May 2026" },
  { id: 2, name: "Articles Section",               category: "Articles",       status: "Draft",             visibility: "Public",       lastUpdated: "3 May 2026" },
  { id: 3, name: "Business Setup Guide",           category: "Guides",         status: "Published",         visibility: "Public",       lastUpdated: "1 May 2026" },
  { id: 4, name: "Cash Flow Management Guide",     category: "Guides",         status: "Published",         visibility: "Members Only", lastUpdated: "28 Apr 2026" },
  { id: 5, name: "Business Tools Library",         category: "Tools",          status: "Content Required",  visibility: "Members Only", lastUpdated: "25 Apr 2026" },
  { id: 6, name: "Downloadable Templates",         category: "Downloads",      status: "Draft",             visibility: "Members Only", lastUpdated: "22 Apr 2026" },
  { id: 7, name: "Cash Flow Forecast Template",    category: "Downloads",      status: "Published",         visibility: "Members Only", lastUpdated: "20 Apr 2026" },
  { id: 8, name: "Educational Video Series",       category: "Educational",    status: "Placeholder",       visibility: "Members Only", lastUpdated: "15 Apr 2026" },
];

export function AdminResources() {
  return (
    <AdminSectionTemplate
      title="Resources"
      description="Manage articles, guides, tools, downloads, and educational resources."
      badge="Placeholder"
      badgeVariant="slate"
      publicRoute="/resources"
      portalRoute="/portal/resources"
      stats={{ published: 3, draft: 3, pending: 2, content: 1 }}
      rows={ROWS}
      relatedSections={[
        "Articles",
        "Guides",
        "Tools",
        "Downloads",
        "Educational",
      ]}
    />
  );
}
