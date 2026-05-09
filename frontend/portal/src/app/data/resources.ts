export type ResourceType = "articles" | "guides" | "tools" | "downloads" | "educational";

export interface ResourceTypeFilter {
  id: ResourceType;
  label: string;
}

export interface ResourceCategoryFilter {
  id: string;
  label: string;
}

export interface PublicResource {
  id: string;
  title: string;
  summary: string;
  type: ResourceType;
  category: string;
  readTime?: string;
  href: string;
  status: "ready" | "placeholder" | "content-required" | "backend-later";
}

export const resourceTypeFilters: ResourceTypeFilter[] = [
  { id: "articles", label: "Articles" },
  { id: "guides", label: "Guides" },
  { id: "tools", label: "Tools" },
  { id: "downloads", label: "Downloads" },
  { id: "educational", label: "Educational" },
];

export const resourceCategoryFilters: ResourceCategoryFilter[] = [
  { id: "strategy", label: "Strategy" },
  { id: "finance", label: "Finance" },
  { id: "sales-marketing", label: "Sales & Marketing" },
  { id: "research-development", label: "Research & Development" },
  { id: "information-technology", label: "Information Technology" },
  { id: "customer-service", label: "Customer Service" },
  { id: "human-resources", label: "Human Resources" },
  { id: "design", label: "Design" },
  { id: "communications", label: "Communications" },
  { id: "governance", label: "Governance" },
  { id: "production", label: "Production" },
  { id: "sourcing", label: "Sourcing" },
  { id: "quality-management", label: "Quality Management" },
  { id: "distribution", label: "Distribution" },
  { id: "operations", label: "Operations" },
  { id: "other", label: "Other" },
];

export const publicResources: PublicResource[] = [
  {
    id: "small-business-operations-playbook",
    title: "The Small Business Operations Playbook",
    summary: "A practical guide to organising workflows, responsibilities, documentation, reporting, and day-to-day business operations.",
    type: "guides",
    category: "operations",
    readTime: "20 min read",
    href: "/resources",
    status: "ready",
  },
  {
    id: "business-planning-template",
    title: "90-Day Business Planning Template",
    summary: "A downloadable planning framework to help business owners set priorities, actions, responsibilities, and progress checkpoints.",
    type: "downloads",
    category: "strategy",
    readTime: "Free download",
    href: "/resources",
    status: "ready",
  },
  {
    id: "finance-readiness-checklist",
    title: "Finance Readiness Checklist",
    summary: "A practical checklist for preparing financial records, business information, and key documents before seeking finance options.",
    type: "tools",
    category: "finance",
    readTime: "Checklist",
    href: "/resources",
    status: "ready",
  },
  {
    id: "hr-documentation-guide",
    title: "HR Documentation Guide",
    summary: "An introductory guide to employee records, onboarding documents, role clarity, and people-process documentation.",
    type: "guides",
    category: "human-resources",
    readTime: "15 min read",
    href: "/resources",
    status: "ready",
  },
];
