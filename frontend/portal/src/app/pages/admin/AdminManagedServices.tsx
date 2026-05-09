import { AdminSectionTemplate, TemplateRow } from "./AdminSectionTemplate";

const ROWS: TemplateRow[] = [
  { id: 1, name: "Managed Services Overview",        category: "Overview",              status: "Placeholder",       visibility: "Public",       lastUpdated: "5 May 2026" },
  { id: 2, name: "Bid Management Service Page",      category: "Bid Management",        status: "Draft",             visibility: "Public",       lastUpdated: "3 May 2026" },
  { id: 3, name: "Real Estate Advisory Page",        category: "Real Estate",           status: "Content Required",  visibility: "Public",       lastUpdated: "1 May 2026" },
  { id: 4, name: "HR Services Overview",             category: "HR Services",           status: "Published",         visibility: "Public",       lastUpdated: "28 Apr 2026" },
  { id: 5, name: "Document Management Service",      category: "Document Management",   status: "Placeholder",       visibility: "Public",       lastUpdated: "26 Apr 2026" },
  { id: 6, name: "Business Sale Support Page",       category: "Business Sale Support", status: "Content Required",  visibility: "Public",       lastUpdated: "24 Apr 2026" },
  { id: 7, name: "Custom Solutions Enquiry",         category: "Custom Solutions",      status: "Draft",             visibility: "Public",       lastUpdated: "20 Apr 2026" },
  { id: 8, name: "Managed Services Pricing",         category: "Pricing",               status: "Hidden",            visibility: "Admin Only",   lastUpdated: "15 Apr 2026" },
];

export function AdminManagedServices() {
  return (
    <AdminSectionTemplate
      title="Managed Services"
      description="Manage ongoing managed service areas, service descriptions, and future delivery workflows."
      badge="Placeholder"
      badgeVariant="slate"
      publicRoute="/managed-services"
      portalRoute="/portal/services"
      stats={{ published: 1, draft: 3, pending: 5, content: 2 }}
      rows={ROWS}
      relatedSections={[
        "Bid Management",
        "Real Estate",
        "HR Services",
        "Document Management",
        "Business Sale Support",
        "Custom Solutions",
      ]}
    />
  );
}
