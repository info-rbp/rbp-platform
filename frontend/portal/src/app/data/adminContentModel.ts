export type AdminEntityStatus =
  | "ready-for-admin-planning"
  | "backend-later"
  | "legal-review-required"
  | "future-enhancement";

export type AdminEntityAccess =
  | "admin-only"
  | "admin-and-member"
  | "public-managed"
  | "system-managed";

export interface AdminContentEntity {
  id: string;
  label: string;
  description: string;
  publicDataFile: string;
  publicRoutes: string[];
  adminPath: string;
  access: AdminEntityAccess;
  status: AdminEntityStatus;
  backendRequired: boolean;
  notes?: string;
}

export const adminContentEntities: AdminContentEntity[] = [
  {
    id: "public-navigation",
    label: "Public Navigation",
    description: "Controls the public mega menu structure, labels, descriptions, links, and CTAs.",
    publicDataFile: "src/app/data/publicNavigation.ts",
    publicRoutes: ["/"],
    adminPath: "/admin/site-content/navigation",
    access: "admin-only",
    status: "ready-for-admin-planning",
    backendRequired: true,
    notes: "Should eventually support ordering, grouping, visibility, and draft/published states.",
  },
  {
    id: "public-sitemap",
    label: "Public Sitemap",
    description: "Tracks public routes, anchors, query destinations, page status, and backend requirements.",
    publicDataFile: "src/app/data/publicSitemap.ts",
    publicRoutes: ["/"],
    adminPath: "/admin/site-content/sitemap",
    access: "admin-only",
    status: "ready-for-admin-planning",
    backendRequired: true,
    notes: "Useful as the future Site Content registry.",
  },
  {
    id: "service-categories",
    label: "Business Categories",
    description: "Shared taxonomy used across resources, offers, services, applications, and future reporting.",
    publicDataFile: "src/app/data/serviceCategories.ts",
    publicRoutes: ["/resources", "/offers", "/on-demand/services"],
    adminPath: "/admin/settings/business-categories",
    access: "admin-only",
    status: "ready-for-admin-planning",
    backendRequired: true,
  },
  {
    id: "on-demand-services",
    label: "On-Demand Services",
    description: "Core public on-demand services and advisory categories.",
    publicDataFile: "src/app/data/onDemandServices.ts",
    publicRoutes: ["/on-demand", "/on-demand/services"],
    adminPath: "/admin/on-demand/services",
    access: "public-managed",
    status: "ready-for-admin-planning",
    backendRequired: true,
  },
  {
    id: "managed-services",
    label: "Managed Services",
    description: "Route-backed and anchor-backed managed service areas.",
    publicDataFile: "src/app/data/managedServices.ts",
    publicRoutes: ["/managed-services"],
    adminPath: "/admin/managed-services",
    access: "public-managed",
    status: "ready-for-admin-planning",
    backendRequired: true,
  },
  {
    id: "applications",
    label: "Applications",
    description: "Public application categories and future configurable application catalogue areas.",
    publicDataFile: "src/app/data/applications.ts",
    publicRoutes: ["/applications"],
    adminPath: "/admin/applications",
    access: "public-managed",
    status: "ready-for-admin-planning",
    backendRequired: true,
  },
  {
    id: "operations",
    label: "Operations",
    description: "Business finance, insurance, connectivity, calculators, and operations pathways.",
    publicDataFile: "src/app/data/operations.ts",
    publicRoutes: ["/operations"],
    adminPath: "/admin/operations",
    access: "public-managed",
    status: "ready-for-admin-planning",
    backendRequired: true,
  },
  {
    id: "marketplace",
    label: "Marketplace",
    description: "Marketplace sections and future product or asset listings.",
    publicDataFile: "src/app/data/marketplace.ts",
    publicRoutes: ["/marketplace", "/marketplace/product/:id"],
    adminPath: "/admin/marketplace",
    access: "public-managed",
    status: "backend-later",
    backendRequired: true,
    notes: "Will need listing approval, seller/source fields, media, pricing, status, and enquiry workflow.",
  },
  {
    id: "membership",
    label: "Membership",
    description: "Membership overview, inclusions, pricing, usage, payment terms, sign-up, and FAQ content.",
    publicDataFile: "src/app/data/membership.ts",
    publicRoutes: ["/membership", "/membership/overview", "/membership/pricing", "/membership/sign-up-now"],
    adminPath: "/admin/membership",
    access: "admin-and-member",
    status: "backend-later",
    backendRequired: true,
    notes: "Pricing, sign-up, payment, and member access workflows require careful backend planning.",
  },
  {
    id: "offers",
    label: "Offers",
    description: "Public and future member offers, partner benefits, categories, and visibility rules.",
    publicDataFile: "src/app/data/offers.ts",
    publicRoutes: ["/offers"],
    adminPath: "/admin/offers",
    access: "admin-and-member",
    status: "backend-later",
    backendRequired: true,
    notes: "Will need partner records, offer validity, member visibility, redemption links, and tracking.",
  },
  {
    id: "resources",
    label: "Resources",
    description: "Articles, guides, tools, downloads, and educational resources.",
    publicDataFile: "src/app/data/resources.ts",
    publicRoutes: ["/resources"],
    adminPath: "/admin/resources",
    access: "admin-and-member",
    status: "ready-for-admin-planning",
    backendRequired: true,
    notes: "Will need content types, categories, files, publication status, and member-only visibility.",
  },
  {
    id: "help-center",
    label: "Help Center",
    description: "FAQs, knowledge base entries, troubleshooting content, and support guidance.",
    publicDataFile: "src/app/data/helpCenter.ts",
    publicRoutes: ["/help"],
    adminPath: "/admin/help-center",
    access: "public-managed",
    status: "ready-for-admin-planning",
    backendRequired: true,
  },
  {
    id: "legal-pages",
    label: "Legal Pages",
    description: "Privacy policy, terms of use, terms of engagement, payment policy, and services policy.",
    publicDataFile: "src/app/data/legalPages.ts",
    publicRoutes: ["/legal"],
    adminPath: "/admin/site-content/legal",
    access: "admin-only",
    status: "legal-review-required",
    backendRequired: true,
    notes: "Admin editing should include strict version history and approval controls.",
  },
];

export const adminContentModelSummary = {
  totalEntities: adminContentEntities.length,
  backendRequired: adminContentEntities.filter((entity) => entity.backendRequired).length,
  legalReviewRequired: adminContentEntities.filter((entity) => entity.status === "legal-review-required").length,
  backendLater: adminContentEntities.filter((entity) => entity.status === "backend-later").length,
};
