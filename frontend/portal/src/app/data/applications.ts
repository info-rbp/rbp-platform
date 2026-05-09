export interface ApplicationCategory {
  id: string;
  title: string;
  summary: string;
  href: string;
  status: "ready" | "placeholder" | "content-required" | "backend-later";
}

export const applicationCategories: ApplicationCategory[] = [
  { id: "how-these-work", title: "How These Work", summary: "Applications are configured around business workflows, user roles, operating needs, and future support requirements.", href: "/applications#how-these-work", status: "ready" },
  { id: "operations-finance", title: "Operations and Finance", summary: "Application options for operations, reporting, accounting, inventory, process control, and management visibility.", href: "/applications#operations-finance", status: "ready" },
  { id: "people-hr", title: "People and HR", summary: "Tools for employee records, onboarding, leave, payroll structure, policies, performance, and people operations.", href: "/applications#people-hr", status: "ready" },
  { id: "sales-crm", title: "Sales and CRM", summary: "CRM and sales tools for lead tracking, contact management, opportunities, communications, and customer follow-up.", href: "/applications#sales-crm", status: "ready" },
  { id: "documents", title: "Documents", summary: "Document management tools for files, templates, records, knowledge bases, version control, and internal documentation.", href: "/applications#documents", status: "ready" },
  { id: "support-desk", title: "Support Desk", summary: "Support desk tools for tickets, requests, customer service workflows, issue tracking, and response management.", href: "/applications#support-desk", status: "ready" },
  { id: "learning", title: "Learning", summary: "Learning tools for onboarding, training, internal education, course delivery, and staff development.", href: "/applications#learning", status: "ready" },
  { id: "analytics", title: "Analytics", summary: "Dashboards and reporting tools for visibility across customers, finances, workflows, operations, and business performance.", href: "/applications#analytics", status: "ready" },
  { id: "payments-billing", title: "Payments and Billing", summary: "Tools for invoicing, billing, payments, subscriptions, customer accounts, and financial workflows.", href: "/applications#payments-billing", status: "ready" },
  { id: "integrations", title: "Integrations", summary: "Integration support for connecting business systems, reducing duplicate work, and improving information flow.", href: "/applications#integrations", status: "ready" },
  { id: "fleet-management", title: "Fleet Management", summary: "Future application support for fleet, vehicle, asset, maintenance, allocation, and usage workflows.", href: "/applications#fleet-management", status: "placeholder" },
  { id: "business-watchlist", title: "Business Watchlist", summary: "Future risk-focused application concept for supplier, customer, company, or operating watchlists.", href: "/applications#business-watchlist", status: "placeholder" },
];
