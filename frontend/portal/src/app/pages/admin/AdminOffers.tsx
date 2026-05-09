import { AdminSectionTemplate, TemplateRow } from "./AdminSectionTemplate";

const ROWS: TemplateRow[] = [
  { id: 1, name: "Offers Overview Page",          category: "Overview",          status: "Published",         visibility: "Public",       lastUpdated: "4 May 2026" },
  { id: 2, name: "Q2 Member Discount Offer",      category: "All Offers",        status: "Draft",             visibility: "Members Only", lastUpdated: "3 May 2026" },
  { id: 3, name: "Partner Technology Offers",     category: "Offer Listings",    status: "Placeholder",       visibility: "Public",       lastUpdated: "1 May 2026" },
  { id: 4, name: "Business Services Offers",      category: "Offer Listings",    status: "Content Required",  visibility: "Public",       lastUpdated: "28 Apr 2026" },
  { id: 5, name: "Offer Categories Management",   category: "Offer Categories",  status: "Draft",             visibility: "Admin Only",   lastUpdated: "25 Apr 2026" },
  { id: 6, name: "Redemptions Tracking",          category: "Redemptions",       status: "Placeholder",       visibility: "Admin Only",   lastUpdated: "20 Apr 2026" },
];

export function AdminOffers() {
  return (
    <AdminSectionTemplate
      title="Offers"
      description="Manage public offers, partner offers, categories, listings, and redemptions."
      badge="Placeholder"
      badgeVariant="slate"
      publicRoute="/offers"
      portalRoute="/portal/offers"
      stats={{ published: 1, draft: 3, pending: 4, content: 2 }}
      rows={ROWS}
      relatedSections={[
        "All Offers",
        "Offer Listings",
        "Offer Categories",
        "Redemptions",
      ]}
    />
  );
}
