export interface ApplicationCategory {
  id: string;
  title: string;
  summary: string;
  href: string;
  status: "ready" | "placeholder" | "content-required" | "backend-later";
  cta: string;
}

export const applicationCategories: ApplicationCategory[] = [
  {
    id: "how-these-work",
    title: "How RBP Applications Will Work",
    summary:
      "Applications will be configured around your workflows, user roles, approvals, records, reporting needs, and support requirements.",
    href: "/applications#how-these-work",
    status: "ready",
    cta: "Learn How Applications Will Work",
  },
  {
    id: "operations-finance",
    title: "Operations and Finance",
    summary:
      "Planned tools for operating workflows, reporting, accounting visibility, stock, tasks, approvals, and management control.",
    href: "/applications#operations-finance",
    status: "ready",
    cta: "Discuss Operations Tools",
  },
  {
    id: "people-hr",
    title: "People and HR",
    summary:
      "Planned support for employee records, onboarding, leave, policies, payroll structure, performance, and people operations.",
    href: "/applications#people-hr",
    status: "ready",
    cta: "Discuss HR Tools",
  },
  {
    id: "sales-crm",
    title: "Sales and CRM",
    summary:
      "Planned CRM tools for leads, contacts, opportunities, pipeline tracking, customer communication, and follow-up workflows.",
    href: "/applications#sales-crm",
    status: "ready",
    cta: "Discuss CRM Needs",
  },
  {
    id: "documents",
    title: "Documents and Records",
    summary:
      "Planned tools for document storage, templates, knowledge bases, version control, internal records, and document workflows.",
    href: "/applications#documents",
    status: "ready",
    cta: "Discuss Document Tools",
  },
  {
    id: "support-desk",
    title: "Support Desk",
    summary:
      "Planned tools for customer requests, internal tickets, issue tracking, service workflows, response management, and support visibility.",
    href: "/applications#support-desk",
    status: "ready",
    cta: "Discuss Support Tools",
  },
  {
    id: "learning",
    title: "Learning and Training",
    summary:
      "Planned tools for onboarding, staff training, internal education, learning pathways, courses, and team development.",
    href: "/applications#learning",
    status: "ready",
    cta: "Discuss Learning Tools",
  },
  {
    id: "analytics",
    title: "Analytics and Reporting",
    summary:
      "Planned dashboards for customer activity, finance, workflows, operations, team performance, and business visibility.",
    href: "/applications#analytics",
    status: "ready",
    cta: "Discuss Reporting Needs",
  },
  {
    id: "payments-billing",
    title: "Payments and Billing",
    summary:
      "Planned tools for invoicing, payments, subscriptions, customer accounts, billing records, and financial workflows.",
    href: "/applications#payments-billing",
    status: "ready",
    cta: "Discuss Billing Tools",
  },
  {
    id: "integrations",
    title: "Integrations",
    summary:
      "Planned support for connecting business systems, reducing duplicate entry, improving data flow, and linking core workflows.",
    href: "/applications#integrations",
    status: "ready",
    cta: "Discuss Integrations",
  },
  {
    id: "fleet-management",
    title: "Fleet and Asset Management",
    summary:
      "Planned tools for vehicles, assets, maintenance, allocation, inspections, usage records, and operational tracking.",
    href: "/applications#fleet-management",
    status: "placeholder",
    cta: "Discuss Fleet Tools",
  },
  {
    id: "business-watchlist",
    title: "Business Watchlist",
    summary:
      "A planned risk-focused application for monitoring suppliers, customers, companies, assets, or operational watchlists.",
    href: "/applications#business-watchlist",
    status: "placeholder",
    cta: "Discuss Watchlist Needs",
  },
];
