import { AdminSectionTemplate, TemplateRow } from "./AdminSectionTemplate";

const ROWS: TemplateRow[] = [
  { id: 1, name: "Membership Plans Overview",     category: "Memberships",     status: "Published",         visibility: "Public",       lastUpdated: "4 May 2026" },
  { id: 2, name: "Essential Plan",                category: "Memberships",     status: "Published",         visibility: "Public",       lastUpdated: "2 May 2026" },
  { id: 3, name: "Advisory Plus Plan",            category: "Memberships",     status: "Published",         visibility: "Public",       lastUpdated: "2 May 2026" },
  { id: 4, name: "Growth Partner Plan",           category: "Memberships",     status: "Published",         visibility: "Public",       lastUpdated: "2 May 2026" },
  { id: 5, name: "Member Records",                category: "Members",         status: "Ready",             visibility: "Admin Only",   lastUpdated: "5 May 2026" },
  { id: 6, name: "Payment History & Invoicing",   category: "Payments",        status: "Draft",             visibility: "Admin Only",   lastUpdated: "1 May 2026" },
  { id: 7, name: "Portal Access Management",      category: "Portal Access",   status: "Content Required",  visibility: "Admin Only",   lastUpdated: "29 Apr 2026" },
  { id: 8, name: "Membership Terms & Conditions", category: "Legal",           status: "Draft",             visibility: "Public",       lastUpdated: "20 Apr 2026" },
];

export function AdminMembership() {
  return (
    <AdminSectionTemplate
      title="Membership"
      description="Manage memberships, member records, payments, and portal access."
      badge="Placeholder"
      badgeVariant="slate"
      publicRoute="/membership"
      portalRoute="/portal/dashboard"
      stats={{ published: 4, draft: 3, pending: 2, content: 1 }}
      rows={ROWS}
      relatedSections={[
        "Memberships",
        "Members",
        "Payments",
        "Portal Access",
      ]}
    />
  );
}
