import { AdminSectionTemplate, TemplateRow } from "./AdminSectionTemplate";

const ROWS: TemplateRow[] = [
  { id: 1, name: "Marketplace Overview",          category: "Overview",          status: "Placeholder",       visibility: "Public",       lastUpdated: "5 May 2026" },
  { id: 2, name: "Active Marketplace Listings",   category: "Listings",          status: "Draft",             visibility: "Public",       lastUpdated: "3 May 2026" },
  { id: 3, name: "Buying Process Guide",          category: "Buying Process",    status: "Content Required",  visibility: "Public",       lastUpdated: "1 May 2026" },
  { id: 4, name: "List With Us Page",             category: "List With Us",      status: "Placeholder",       visibility: "Public",       lastUpdated: "28 Apr 2026" },
  { id: 5, name: "Marketplace FAQs",              category: "Support",           status: "Draft",             visibility: "Public",       lastUpdated: "24 Apr 2026" },
  { id: 6, name: "Seller Onboarding Notes",       category: "Internal",          status: "Hidden",            visibility: "Admin Only",   lastUpdated: "20 Apr 2026" },
];

export function AdminMarketplace() {
  return (
    <AdminSectionTemplate
      title="Marketplace"
      description="Manage marketplace listings, buying process content, and list-with-us enquiries."
      badge="Placeholder"
      badgeVariant="slate"
      publicRoute="/marketplace"
      portalRoute="/portal/offers"
      stats={{ published: 0, draft: 3, pending: 4, content: 2 }}
      rows={ROWS}
      relatedSections={[
        "Marketplace",
        "Listings",
        "Buying Process",
        "List With Us",
      ]}
    />
  );
}
