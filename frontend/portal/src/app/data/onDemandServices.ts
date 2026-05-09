export interface OnDemandService {
  id: string;
  title: string;
  summary: string;
  href: string;
  category: string;
  status: "ready" | "placeholder" | "content-required" | "backend-later";
}

export const onDemandServices: OnDemandService[] = [
  {
    id: "business-advisor",
    title: "Business Advisor",
    summary: "Practical advisory support for business owners who need guidance on structure, operations, priorities, and decision-making.",
    href: "/on-demand/business-advisor",
    category: "operations",
    status: "ready",
  },
  {
    id: "decision-desk",
    title: "Decision Desk",
    summary: "A structured written-response service for business questions, operational decisions, commercial choices, and planning issues.",
    href: "/on-demand/decision-desk",
    category: "strategy",
    status: "ready",
  },
  {
    id: "the-fixer",
    title: "The Fixer",
    summary: "Focused support for a specific business problem, process issue, documentation gap, workflow bottleneck, or operational obstacle.",
    href: "/on-demand/the-fixer",
    category: "operations",
    status: "ready",
  },
  {
    id: "risk-advisor",
    title: "Risk Advisor",
    summary: "Risk-focused advisory support to help identify operational, commercial, compliance, supplier, and decision-related risk areas.",
    href: "/on-demand/risk-advisor",
    category: "governance",
    status: "ready",
  },
];

export const advisoryCategories = [
  { id: "operations-advisory", title: "Operations Advisory", href: "/on-demand/services#operations-advisory" },
  { id: "human-resource-advisory", title: "Human Resource Advisory", href: "/on-demand/services#human-resource-advisory" },
  { id: "accounting-finance", title: "Accounting & Finance", href: "/on-demand/services#accounting-finance" },
  { id: "sales-marketing", title: "Sales & Marketing", href: "/on-demand/services#sales-marketing" },
  { id: "management-consulting", title: "Management Consulting", href: "/on-demand/services#management-consulting" },
  { id: "change-management", title: "Change Management", href: "/on-demand/services#change-management" },
  { id: "ai-advisory", title: "AI Advisory", href: "/on-demand/services#ai-advisory" },
  { id: "research-development", title: "Research & Development", href: "/on-demand/services#research-development" },
  { id: "information-technology", title: "Information Technology", href: "/on-demand/services#information-technology" },
  { id: "public-relations", title: "Public Relations", href: "/on-demand/services#public-relations" },
  { id: "customised-solutions", title: "Customised Solutions", href: "/on-demand/services#customised-solutions" },
];
