import { AdminSectionTemplate, TemplateRow } from "./AdminSectionTemplate";

const ROWS: TemplateRow[] = [
  { id: 1, name: "Operations Overview",           category: "Overview",              status: "Placeholder",       visibility: "Public",       lastUpdated: "5 May 2026" },
  { id: 2, name: "Business Finance Overview",     category: "Business Finance",      status: "Published",         visibility: "Public",       lastUpdated: "2 May 2026" },
  { id: 3, name: "Business Insurance Overview",   category: "Business Insurance",    status: "Published",         visibility: "Public",       lastUpdated: "28 Apr 2026" },
  { id: 4, name: "Superloop Connectivity Page",   category: "Connectivity",          status: "Draft",             visibility: "Public",       lastUpdated: "25 Apr 2026" },
  { id: 5, name: "Finance Calculators",           category: "Calculators",           status: "Content Required",  visibility: "Public",       lastUpdated: "20 Apr 2026" },
  { id: 6, name: "Operations Pricing Notes",      category: "Pricing",               status: "Hidden",            visibility: "Admin Only",   lastUpdated: "15 Apr 2026" },
];

export function AdminOperations() {
  return (
    <AdminSectionTemplate
      title="Operations"
      description="Manage operational support areas including finance, insurance, connectivity, and calculators."
      badge="Placeholder"
      badgeVariant="slate"
      publicRoute="/operations"
      portalRoute="/portal/resources"
      stats={{ published: 2, draft: 2, pending: 3, content: 1 }}
      rows={ROWS}
      relatedSections={[
        "Business Finance",
        "Business Insurance",
        "Superloop Connectivity",
        "Calculators",
      ]}
    />
  );
}
