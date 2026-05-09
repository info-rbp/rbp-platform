export type BusinessCategoryId =
  | "strategy"
  | "finance"
  | "sales-marketing"
  | "research-development"
  | "information-technology"
  | "customer-service"
  | "human-resources"
  | "design"
  | "communications"
  | "governance"
  | "production"
  | "sourcing"
  | "quality-management"
  | "distribution"
  | "operations"
  | "other";

export interface BusinessCategory {
  id: BusinessCategoryId;
  label: string;
  description: string;
}

export const businessCategories: BusinessCategory[] = [
  { id: "strategy", label: "Strategy", description: "Planning, positioning, business models, and strategic decision-making." },
  { id: "finance", label: "Finance", description: "Funding, cash flow, financial planning, insurance, and commercial readiness." },
  { id: "sales-marketing", label: "Sales & Marketing", description: "Growth, customer acquisition, brand, campaigns, and sales process improvement." },
  { id: "research-development", label: "Research & Development", description: "Idea validation, product research, innovation, and business improvement initiatives." },
  { id: "information-technology", label: "Information Technology", description: "Systems, applications, technology planning, integrations, and digital operations." },
  { id: "customer-service", label: "Customer Service", description: "Support operations, customer experience, service delivery, and issue resolution." },
  { id: "human-resources", label: "Human Resources", description: "People operations, HR documentation, onboarding, roles, policies, and compliance support." },
  { id: "design", label: "Design", description: "Brand, UX, service design, visual content, and customer-facing materials." },
  { id: "communications", label: "Communications", description: "Internal and external communication, stakeholder messaging, and public relations." },
  { id: "governance", label: "Governance", description: "Policies, controls, accountability, compliance, and operating discipline." },
  { id: "production", label: "Production", description: "Delivery processes, output quality, production planning, and operational execution." },
  { id: "sourcing", label: "Sourcing", description: "Supplier search, procurement, vendor management, and supply chain support." },
  { id: "quality-management", label: "Quality Management", description: "Quality systems, review processes, documentation, and continuous improvement." },
  { id: "distribution", label: "Distribution", description: "Logistics, delivery, fulfilment, channel operations, and movement of goods or services." },
  { id: "operations", label: "Operations", description: "Workflow, systems, process management, administration, and business execution." },
  { id: "other", label: "Other", description: "Items that do not fit another standard category." },
];
