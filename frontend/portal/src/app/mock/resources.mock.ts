export interface MockResource {
  id: string;
  title: string;
  type: "articles" | "guides" | "tools" | "downloads" | "educational";
  category: string;
  description: string;
  href: string;
}

export const mockResources: MockResource[] = [
  {
    id: "resource-guide-finance-001",
    title: "Mock Finance Guide",
    type: "guides",
    category: "finance",
    description: "Frontend-only resource example for finance guides.",
    href: "/resources?type=guides&category=finance",
  },
  {
    id: "resource-tool-operations-001",
    title: "Mock Operations Tool",
    type: "tools",
    category: "operations",
    description: "Frontend-only resource example for operations tools.",
    href: "/resources?type=tools&category=operations",
  },
  {
    id: "resource-article-hr-001",
    title: "Mock Human Resources Article",
    type: "articles",
    category: "human-resources",
    description: "Frontend-only resource example for HR articles.",
    href: "/resources?type=articles&category=human-resources",
  },
];
