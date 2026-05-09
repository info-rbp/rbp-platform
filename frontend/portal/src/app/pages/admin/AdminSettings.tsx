import { AdminSectionTemplate, TemplateRow } from "./AdminSectionTemplate";

const ROWS: TemplateRow[] = [
  { id: 1, name: "Platform Settings",             category: "Platform",          status: "Draft",            visibility: "Admin Only",   lastUpdated: "5 May 2026" },
  { id: 2, name: "Admin Users Management",        category: "Admin Users",       status: "Ready",            visibility: "Admin Only",   lastUpdated: "4 May 2026" },
  { id: 3, name: "Integration Settings",          category: "Integrations",      status: "Content Required", visibility: "Admin Only",   lastUpdated: "3 May 2026" },
  { id: 4, name: "Xero Integration",              category: "Integrations",      status: "Placeholder",      visibility: "Admin Only",   lastUpdated: "1 May 2026" },
  { id: 5, name: "Stripe Integration",            category: "Integrations",      status: "Placeholder",      visibility: "Admin Only",   lastUpdated: "1 May 2026" },
  { id: 6, name: "Firebase Readiness Checklist",  category: "Firebase",          status: "Draft",            visibility: "Admin Only",   lastUpdated: "2 May 2026" },
  { id: 7, name: "Access Control & Permissions",  category: "Access Control",    status: "Placeholder",      visibility: "Admin Only",   lastUpdated: "28 Apr 2026" },
  { id: 8, name: "Role Definitions",              category: "Access Control",    status: "Hidden",           visibility: "Admin Only",   lastUpdated: "20 Apr 2026" },
];

export function AdminSettings() {
  return (
    <AdminSectionTemplate
      title="Settings"
      description="Manage platform settings, admin users, integration settings, Firebase readiness, and access control."
      badge="Placeholder"
      badgeVariant="slate"
      publicRoute={null}
      portalRoute={null}
      stats={{ published: 0, draft: 3, pending: 5, content: 3 }}
      rows={ROWS}
      relatedSections={[
        "Platform Settings",
        "Admin Users",
        "Integration Settings",
        "Firebase Readiness",
        "Access Control",
      ]}
      note="This section manages platform-level configuration. Firebase integration, access control rules, and admin user permissions will be fully implemented in GitHub/Firebase Studio. No changes should be made to production settings until Firebase is connected."
    />
  );
}