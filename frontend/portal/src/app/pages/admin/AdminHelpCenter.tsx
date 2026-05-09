import { AdminSectionTemplate, TemplateRow } from "./AdminSectionTemplate";

const ROWS: TemplateRow[] = [
  { id: 1, name: "Help Center Overview",            category: "Overview",       status: "Placeholder",       visibility: "Public",       lastUpdated: "5 May 2026" },
  { id: 2, name: "Frequently Asked Questions",      category: "FAQs",           status: "Draft",             visibility: "Public",       lastUpdated: "3 May 2026" },
  { id: 3, name: "Knowledge Base Articles",         category: "Knowledge Base", status: "Content Required",  visibility: "Public",       lastUpdated: "1 May 2026" },
  { id: 4, name: "Getting Started with RBP",        category: "Knowledge Base", status: "Published",         visibility: "Public",       lastUpdated: "28 Apr 2026" },
  { id: 5, name: "Troubleshooting Guide",           category: "Troubleshooting",status: "Draft",             visibility: "Public",       lastUpdated: "25 Apr 2026" },
  { id: 6, name: "Help Center Resources",           category: "Resources",      status: "Placeholder",       visibility: "Public",       lastUpdated: "22 Apr 2026" },
  { id: 7, name: "Support Centre Contact Info",     category: "Support Center", status: "Published",         visibility: "Public",       lastUpdated: "20 Apr 2026" },
  { id: 8, name: "Live Chat & Ticketing Setup",     category: "Support Center", status: "Hidden",            visibility: "Admin Only",   lastUpdated: "4 May 2026" },
];

export function AdminHelpCenter() {
  return (
    <AdminSectionTemplate
      title="Help Center"
      description="Manage FAQs, knowledge base content, troubleshooting content, resources, and support centre information."
      badge="Placeholder"
      badgeVariant="slate"
      publicRoute="/help"
      portalRoute="/portal/support"
      stats={{ published: 2, draft: 3, pending: 3, content: 2 }}
      rows={ROWS}
      relatedSections={[
        "Frequently Asked Questions",
        "Knowledge Base",
        "Troubleshooting",
        "Resources",
        "Support Center",
      ]}
    />
  );
}
