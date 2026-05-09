import { AdminSectionTemplate, TemplateRow } from "./AdminSectionTemplate";

const ROWS: TemplateRow[] = [
  { id: 1,  name: "On-Demand Services Overview",        category: "Overview",         status: "Placeholder",       visibility: "Public",       lastUpdated: "5 May 2026" },
  { id: 2,  name: "Business Advisor Service Page",      category: "Business Advisor", status: "Draft",             visibility: "Public",       lastUpdated: "3 May 2026" },
  { id: 3,  name: "Decision Desk Service Page",         category: "Decision Desk",    status: "Content Required",  visibility: "Public",       lastUpdated: "1 May 2026" },
  { id: 4,  name: "The Fixer Service Page",             category: "The Fixer",        status: "Published",         visibility: "Public",       lastUpdated: "28 Apr 2026" },
  { id: 5,  name: "Document Nucleus Overview",          category: "Document Nucleus", status: "Draft",             visibility: "Public",       lastUpdated: "2 May 2026" },
  { id: 6,  name: "Templates Library",                  category: "Document Nucleus", status: "Placeholder",       visibility: "Members Only", lastUpdated: "30 Apr 2026" },
  { id: 7,  name: "Documentation Suites Catalogue",     category: "Document Nucleus", status: "Content Required",  visibility: "Members Only", lastUpdated: "27 Apr 2026" },
  { id: 8,  name: "Toolkits Collection",                category: "Document Nucleus", status: "Placeholder",       visibility: "Members Only", lastUpdated: "25 Apr 2026" },
  { id: 9,  name: "Process Guides",                     category: "Document Nucleus", status: "Draft",             visibility: "Members Only", lastUpdated: "22 Apr 2026" },
  { id: 10, name: "On-Demand Pricing & Packages",       category: "Pricing",          status: "Content Required",  visibility: "Public",       lastUpdated: "4 May 2026" },
];

export function AdminOnDemand() {
  return (
    <AdminSectionTemplate
      title="On-Demand Services"
      description="Manage on-demand service content, requests, Document Nucleus items, and service-related workflows."
      badge="Placeholder"
      badgeVariant="slate"
      publicRoute="/on-demand"
      portalRoute="/portal/services"
      stats={{ published: 1, draft: 4, pending: 6, content: 3 }}
      rows={ROWS}
      relatedSections={[
        "Business Advisor",
        "Decision Desk",
        "The Fixer",
        "Document Nucleus",
        "Templates",
        "Documentation Suites",
        "Toolkits",
        "Process",
        "On-Demand Services",
      ]}
    />
  );
}
