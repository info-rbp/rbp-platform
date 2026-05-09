export type AdminFieldType =
  | "text"
  | "textarea"
  | "rich-text"
  | "slug"
  | "select"
  | "multi-select"
  | "boolean"
  | "number"
  | "date"
  | "url"
  | "image"
  | "file"
  | "json"
  | "relation";

export type AdminCrudStatus =
  | "draft"
  | "planned"
  | "ready-for-scaffold"
  | "backend-later"
  | "legal-review-required";

export type AdminVisibility =
  | "public"
  | "members"
  | "admin"
  | "hidden";

export interface AdminCrudField {
  name: string;
  label: string;
  type: AdminFieldType;
  required: boolean;
  helpText?: string;
  options?: string[];
  relationTo?: string;
}

export interface AdminCrudEntity {
  id: string;
  label: string;
  description: string;
  adminPath: string;
  collectionName: string;
  publicDataFile: string;
  publicRoutes: string[];
  fields: AdminCrudField[];
  defaultStatus: AdminCrudStatus;
  defaultVisibility: AdminVisibility;
  supportsDraftPublishing: boolean;
  supportsOrdering: boolean;
  supportsFeatured: boolean;
  requiresApproval: boolean;
  backendRequired: boolean;
  notes?: string;
}

const sharedPublishingFields: AdminCrudField[] = [
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: ["draft", "review", "published", "archived"],
    helpText: "Controls whether the item is visible or still being prepared.",
  },
  {
    name: "visibility",
    label: "Visibility",
    type: "select",
    required: true,
    options: ["public", "members", "admin", "hidden"],
    helpText: "Controls who should be able to see this content.",
  },
  {
    name: "sortOrder",
    label: "Sort Order",
    type: "number",
    required: false,
    helpText: "Used for manual ordering in public lists and admin tables.",
  },
  {
    name: "isFeatured",
    label: "Featured",
    type: "boolean",
    required: false,
    helpText: "Marks the item as featured where supported.",
  },
];

const sharedAuditFields: AdminCrudField[] = [
  {
    name: "createdAt",
    label: "Created At",
    type: "date",
    required: false,
  },
  {
    name: "updatedAt",
    label: "Updated At",
    type: "date",
    required: false,
  },
  {
    name: "publishedAt",
    label: "Published At",
    type: "date",
    required: false,
  },
  {
    name: "createdBy",
    label: "Created By",
    type: "text",
    required: false,
  },
  {
    name: "updatedBy",
    label: "Updated By",
    type: "text",
    required: false,
  },
];

const baseContentFields: AdminCrudField[] = [
  {
    name: "title",
    label: "Title",
    type: "text",
    required: true,
  },
  {
    name: "slug",
    label: "Slug",
    type: "slug",
    required: true,
  },
  {
    name: "summary",
    label: "Summary",
    type: "textarea",
    required: true,
  },
  {
    name: "body",
    label: "Body",
    type: "rich-text",
    required: false,
  },
];

export const adminCrudEntities: AdminCrudEntity[] = [
  {
    id: "business-categories",
    label: "Business Categories",
    description: "Shared taxonomy for services, resources, offers, operations, and reporting.",
    adminPath: "/admin/settings/business-categories",
    collectionName: "businessCategories",
    publicDataFile: "src/app/data/serviceCategories.ts",
    publicRoutes: ["/resources", "/offers", "/on-demand/services"],
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      ...sharedPublishingFields,
      ...sharedAuditFields,
    ],
    defaultStatus: "ready-for-scaffold",
    defaultVisibility: "public",
    supportsDraftPublishing: true,
    supportsOrdering: true,
    supportsFeatured: false,
    requiresApproval: false,
    backendRequired: true,
  },
  {
    id: "resources",
    label: "Resources",
    description: "Articles, guides, tools, downloads, and educational resources.",
    adminPath: "/admin/resources",
    collectionName: "resources",
    publicDataFile: "src/app/data/resources.ts",
    publicRoutes: ["/resources"],
    fields: [
      ...baseContentFields,
      { name: "type", label: "Resource Type", type: "select", required: true, options: ["articles", "guides", "tools", "downloads", "educational"] },
      { name: "category", label: "Business Category", type: "relation", required: true, relationTo: "businessCategories" },
      { name: "readTime", label: "Read Time", type: "text", required: false },
      { name: "fileUrl", label: "File URL", type: "file", required: false },
      { name: "heroImage", label: "Hero Image", type: "image", required: false },
      ...sharedPublishingFields,
      ...sharedAuditFields,
    ],
    defaultStatus: "ready-for-scaffold",
    defaultVisibility: "public",
    supportsDraftPublishing: true,
    supportsOrdering: true,
    supportsFeatured: true,
    requiresApproval: false,
    backendRequired: true,
  },
  {
    id: "help-center",
    label: "Help Center",
    description: "FAQs, knowledge base records, troubleshooting entries, and support guidance.",
    adminPath: "/admin/help-center",
    collectionName: "helpArticles",
    publicDataFile: "src/app/data/helpCenter.ts",
    publicRoutes: ["/help"],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "rich-text", required: true },
      { name: "section", label: "Help Section", type: "select", required: true, options: ["faqs", "knowledge-base", "troubleshooting", "support"] },
      { name: "category", label: "Help Category", type: "select", required: true, options: ["our-platform", "on-demand-services", "managed-services", "applications", "operations", "marketplace", "membership", "offers", "resources", "other"] },
      ...sharedPublishingFields,
      ...sharedAuditFields,
    ],
    defaultStatus: "ready-for-scaffold",
    defaultVisibility: "public",
    supportsDraftPublishing: true,
    supportsOrdering: true,
    supportsFeatured: false,
    requiresApproval: false,
    backendRequired: true,
  },
  {
    id: "offers",
    label: "Offers",
    description: "Partner offers, member benefits, discounts, and promotional offers.",
    adminPath: "/admin/offers",
    collectionName: "offers",
    publicDataFile: "src/app/data/offers.ts",
    publicRoutes: ["/offers"],
    fields: [
      ...baseContentFields,
      { name: "partner", label: "Partner", type: "text", required: true },
      { name: "category", label: "Offer Category", type: "select", required: true, options: ["travel", "fitness-health", "home-garden", "delivery", "digital-tech", "finance-insurance", "other", "operations", "human-resources", "admin-finance", "sales-marketing", "ai"] },
      { name: "offerType", label: "Offer Type", type: "select", required: true, options: ["exclusive", "top", "standard"] },
      { name: "redeemUrl", label: "Redeem URL", type: "url", required: false },
      { name: "validFrom", label: "Valid From", type: "date", required: false },
      { name: "validUntil", label: "Valid Until", type: "date", required: false },
      ...sharedPublishingFields,
      ...sharedAuditFields,
    ],
    defaultStatus: "backend-later",
    defaultVisibility: "members",
    supportsDraftPublishing: true,
    supportsOrdering: true,
    supportsFeatured: true,
    requiresApproval: true,
    backendRequired: true,
    notes: "Offers may need partner records and redemption tracking later.",
  },
  {
    id: "applications",
    label: "Applications",
    description: "Application catalogue categories and future application records.",
    adminPath: "/admin/applications",
    collectionName: "applications",
    publicDataFile: "src/app/data/applications.ts",
    publicRoutes: ["/applications"],
    fields: [
      ...baseContentFields,
      { name: "category", label: "Application Category", type: "text", required: false },
      { name: "setupRequired", label: "Setup Required", type: "boolean", required: false },
      { name: "integrationNotes", label: "Integration Notes", type: "textarea", required: false },
      ...sharedPublishingFields,
      ...sharedAuditFields,
    ],
    defaultStatus: "ready-for-scaffold",
    defaultVisibility: "public",
    supportsDraftPublishing: true,
    supportsOrdering: true,
    supportsFeatured: true,
    requiresApproval: false,
    backendRequired: true,
  },
  {
    id: "services",
    label: "Services",
    description: "On-demand and managed service catalogue records.",
    adminPath: "/admin/services",
    collectionName: "services",
    publicDataFile: "src/app/data/onDemandServices.ts",
    publicRoutes: ["/on-demand", "/managed-services"],
    fields: [
      ...baseContentFields,
      { name: "serviceType", label: "Service Type", type: "select", required: true, options: ["on-demand", "managed", "operation", "membership"] },
      { name: "category", label: "Category", type: "relation", required: false, relationTo: "businessCategories" },
      { name: "ctaLabel", label: "CTA Label", type: "text", required: false },
      { name: "ctaHref", label: "CTA URL", type: "url", required: false },
      ...sharedPublishingFields,
      ...sharedAuditFields,
    ],
    defaultStatus: "ready-for-scaffold",
    defaultVisibility: "public",
    supportsDraftPublishing: true,
    supportsOrdering: true,
    supportsFeatured: true,
    requiresApproval: false,
    backendRequired: true,
  },
  {
    id: "marketplace",
    label: "Marketplace",
    description: "Products, assets, third-party listings, supplier listings, and buying process content.",
    adminPath: "/admin/marketplace",
    collectionName: "marketplaceListings",
    publicDataFile: "src/app/data/marketplace.ts",
    publicRoutes: ["/marketplace", "/marketplace/product/:id"],
    fields: [
      ...baseContentFields,
      { name: "listingType", label: "Listing Type", type: "select", required: true, options: ["rbp-product", "rbp-asset", "third-party-product", "third-party-asset", "service"] },
      { name: "supplierName", label: "Supplier Name", type: "text", required: false },
      { name: "price", label: "Price", type: "text", required: false },
      { name: "enquiryRequired", label: "Enquiry Required", type: "boolean", required: false },
      { name: "media", label: "Media", type: "image", required: false },
      ...sharedPublishingFields,
      ...sharedAuditFields,
    ],
    defaultStatus: "backend-later",
    defaultVisibility: "public",
    supportsDraftPublishing: true,
    supportsOrdering: true,
    supportsFeatured: true,
    requiresApproval: true,
    backendRequired: true,
  },
  {
    id: "membership",
    label: "Membership",
    description: "Membership plans, inclusions, pricing, usage, payment terms, and member-facing content.",
    adminPath: "/admin/membership",
    collectionName: "membershipContent",
    publicDataFile: "src/app/data/membership.ts",
    publicRoutes: ["/membership"],
    fields: [
      ...baseContentFields,
      { name: "planName", label: "Plan Name", type: "text", required: false },
      { name: "price", label: "Price", type: "text", required: false },
      { name: "billingPeriod", label: "Billing Period", type: "select", required: false, options: ["monthly", "quarterly", "annual", "custom"] },
      { name: "inclusions", label: "Inclusions", type: "multi-select", required: false },
      { name: "requiresPayment", label: "Requires Payment", type: "boolean", required: false },
      ...sharedPublishingFields,
      ...sharedAuditFields,
    ],
    defaultStatus: "backend-later",
    defaultVisibility: "public",
    supportsDraftPublishing: true,
    supportsOrdering: true,
    supportsFeatured: true,
    requiresApproval: true,
    backendRequired: true,
    notes: "Payment, sign-up, and member access workflows need separate backend design.",
  },
  {
    id: "legal-pages",
    label: "Legal Pages",
    description: "Legal and policy content requiring review, approval, and version history.",
    adminPath: "/admin/site-content/legal",
    collectionName: "legalPages",
    publicDataFile: "src/app/data/legalPages.ts",
    publicRoutes: ["/legal"],
    fields: [
      ...baseContentFields,
      { name: "policyType", label: "Policy Type", type: "select", required: true, options: ["privacy-policy", "terms-of-use", "terms-of-engagement", "payment-policy", "services-policy"] },
      { name: "effectiveDate", label: "Effective Date", type: "date", required: false },
      { name: "version", label: "Version", type: "text", required: true },
      { name: "approvedBy", label: "Approved By", type: "text", required: false },
      { name: "approvedAt", label: "Approved At", type: "date", required: false },
      ...sharedPublishingFields,
      ...sharedAuditFields,
    ],
    defaultStatus: "legal-review-required",
    defaultVisibility: "public",
    supportsDraftPublishing: true,
    supportsOrdering: false,
    supportsFeatured: false,
    requiresApproval: true,
    backendRequired: true,
    notes: "Requires strict version control and approval workflow.",
  },
];

export const adminCrudSchemaSummary = {
  totalEntities: adminCrudEntities.length,
  readyForScaffold: adminCrudEntities.filter((entity) => entity.defaultStatus === "ready-for-scaffold").length,
  backendLater: adminCrudEntities.filter((entity) => entity.defaultStatus === "backend-later").length,
  legalReviewRequired: adminCrudEntities.filter((entity) => entity.defaultStatus === "legal-review-required").length,
  approvalRequired: adminCrudEntities.filter((entity) => entity.requiresApproval).length,
};
