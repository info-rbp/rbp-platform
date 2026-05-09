export type BackendCollectionId =
  | "businessCategories"
  | "resources"
  | "helpArticles"
  | "applications"
  | "services"
  | "operations"
  | "offers"
  | "marketplaceListings"
  | "membershipPages"
  | "legalPages"
  | "mediaAssets"
  | "auditLogs"
  | "adminUsers";

export type BackendFieldType =
  | "string"
  | "slug"
  | "textarea"
  | "richText"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "url"
  | "email"
  | "select"
  | "multiSelect"
  | "relation"
  | "json"
  | "array";

export type BackendRiskLevel = "low" | "medium" | "high" | "restricted";

export type BackendImplementationPhase =
  | "phase-1-foundation"
  | "phase-2-commercial"
  | "phase-3-membership"
  | "phase-4-governance"
  | "platform-support";

export type BackendAccessRole =
  | "public"
  | "member"
  | "admin"
  | "editor"
  | "commercial-admin"
  | "legal-admin"
  | "super-admin"
  | "system";

export interface BackendFieldContract {
  name: string;
  label: string;
  type: BackendFieldType;
  required: boolean;
  indexed?: boolean;
  unique?: boolean;
  publicReadable?: boolean;
  adminWritable?: boolean;
  sensitive?: boolean;
  defaultValue?: string | number | boolean | null;
  enumValues?: string[];
  relationTo?: BackendCollectionId;
  notes?: string;
}

export interface BackendIndexContract {
  name: string;
  fields: string[];
  purpose: string;
}

export interface BackendWorkflowContract {
  draftSupported: boolean;
  publishSupported: boolean;
  approvalRequired: boolean;
  approvalRole?: BackendAccessRole;
  archiveInsteadOfDelete: boolean;
  auditLogRequired: boolean;
}

export interface BackendSecurityContract {
  readableBy: BackendAccessRole[];
  writableBy: BackendAccessRole[];
  deletableBy: BackendAccessRole[];
  notes: string;
}

export interface BackendCollectionContract {
  id: BackendCollectionId;
  collectionName: string;
  label: string;
  description: string;
  implementationPhase: BackendImplementationPhase;
  riskLevel: BackendRiskLevel;
  adminPath: string;
  publicRoutes: string[];
  fields: BackendFieldContract[];
  indexes: BackendIndexContract[];
  workflow: BackendWorkflowContract;
  security: BackendSecurityContract;
  migrationNotes: string[];
  firebaseNotes: string[];
}

const commonContentFields: BackendFieldContract[] = [
  {
    name: "id",
    label: "Document ID",
    type: "string",
    required: true,
    indexed: true,
    unique: true,
    publicReadable: true,
    adminWritable: false,
  },
  {
    name: "title",
    label: "Title",
    type: "string",
    required: true,
    indexed: true,
    publicReadable: true,
    adminWritable: true,
  },
  {
    name: "slug",
    label: "Slug",
    type: "slug",
    required: true,
    indexed: true,
    unique: true,
    publicReadable: true,
    adminWritable: true,
  },
  {
    name: "summary",
    label: "Summary",
    type: "textarea",
    required: true,
    publicReadable: true,
    adminWritable: true,
  },
  {
    name: "href",
    label: "Public Link",
    type: "url",
    required: true,
    indexed: true,
    publicReadable: true,
    adminWritable: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    indexed: true,
    publicReadable: true,
    adminWritable: true,
    defaultValue: "draft",
    enumValues: ["draft", "ready", "published", "archived", "content-required", "backend-later", "legal-review-required"],
  },
  {
    name: "sortOrder",
    label: "Sort Order",
    type: "number",
    required: false,
    indexed: true,
    publicReadable: true,
    adminWritable: true,
    defaultValue: 0,
  },
  {
    name: "createdAt",
    label: "Created At",
    type: "datetime",
    required: true,
    indexed: true,
    publicReadable: false,
    adminWritable: false,
  },
  {
    name: "updatedAt",
    label: "Updated At",
    type: "datetime",
    required: true,
    indexed: true,
    publicReadable: false,
    adminWritable: false,
  },
];

const publishedContentWorkflow: BackendWorkflowContract = {
  draftSupported: true,
  publishSupported: true,
  approvalRequired: false,
  archiveInsteadOfDelete: true,
  auditLogRequired: true,
};

const approvalWorkflow: BackendWorkflowContract = {
  draftSupported: true,
  publishSupported: true,
  approvalRequired: true,
  approvalRole: "admin",
  archiveInsteadOfDelete: true,
  auditLogRequired: true,
};

const standardAdminSecurity: BackendSecurityContract = {
  readableBy: ["public", "admin", "editor"],
  writableBy: ["admin", "editor"],
  deletableBy: ["admin", "super-admin"],
  notes: "Public reads should return published records only. Admin writes require authenticated admin or editor roles.",
};

function contentContract(params: {
  id: BackendCollectionId;
  collectionName: BackendCollectionId;
  label: string;
  description: string;
  phase: BackendImplementationPhase;
  risk: BackendRiskLevel;
  adminPath: string;
  publicRoutes?: string[];
  extraFields?: BackendFieldContract[];
  indexes?: BackendIndexContract[];
  workflow?: BackendWorkflowContract;
  security?: BackendSecurityContract;
  migrationNotes?: string[];
  firebaseNotes?: string[];
}): BackendCollectionContract {
  return {
    id: params.id,
    collectionName: params.collectionName,
    label: params.label,
    description: params.description,
    implementationPhase: params.phase,
    riskLevel: params.risk,
    adminPath: params.adminPath,
    publicRoutes: params.publicRoutes ?? [],
    fields: [...commonContentFields, ...(params.extraFields ?? [])],
    indexes: params.indexes ?? [
      {
        name: `${params.collectionName}_status_sortOrder`,
        fields: ["status", "sortOrder"],
        purpose: "Published content ordering and filtering.",
      },
      {
        name: `${params.collectionName}_slug`,
        fields: ["slug"],
        purpose: "Stable public route or detail lookup.",
      },
    ],
    workflow: params.workflow ?? publishedContentWorkflow,
    security: params.security ?? standardAdminSecurity,
    migrationNotes: params.migrationNotes ?? ["Seed from the current static frontend data file."],
    firebaseNotes: params.firebaseNotes ?? ["Public queries should filter for published or ready records only."],
  };
}

export const backendCollectionContracts: BackendCollectionContract[] = [
  contentContract({
    id: "businessCategories",
    collectionName: "businessCategories",
    label: "Business Categories",
    description: "Shared category taxonomy used across resources, offers, operations, services, and marketplace records.",
    phase: "phase-1-foundation",
    risk: "low",
    adminPath: "/admin/settings/business-categories",
    extraFields: [
      {
        name: "parentId",
        label: "Parent Category",
        type: "relation",
        required: false,
        indexed: true,
        relationTo: "businessCategories",
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "usage",
        label: "Usage Areas",
        type: "multiSelect",
        required: false,
        indexed: true,
        publicReadable: false,
        adminWritable: true,
        enumValues: ["resources", "offers", "operations", "services", "marketplace", "membership"],
      },
    ],
  }),
  contentContract({
    id: "resources",
    collectionName: "resources",
    label: "Resources",
    description: "Articles, guides, tools, downloads, and educational resources displayed on the public Resources page.",
    phase: "phase-1-foundation",
    risk: "low",
    adminPath: "/admin/resources",
    publicRoutes: ["/resources"],
    extraFields: [
      {
        name: "type",
        label: "Resource Type",
        type: "select",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
        enumValues: ["articles", "guides", "tools", "downloads", "educational"],
      },
      {
        name: "category",
        label: "Category",
        type: "relation",
        required: true,
        indexed: true,
        relationTo: "businessCategories",
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "readTime",
        label: "Read Time",
        type: "string",
        required: false,
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "body",
        label: "Body",
        type: "richText",
        required: false,
        publicReadable: true,
        adminWritable: true,
      },
    ],
  }),
  contentContract({
    id: "helpArticles",
    collectionName: "helpArticles",
    label: "Help Center Articles",
    description: "FAQs, knowledge base articles, troubleshooting entries, and support guidance.",
    phase: "phase-1-foundation",
    risk: "low",
    adminPath: "/admin/help-center",
    publicRoutes: ["/help"],
    extraFields: [
      {
        name: "question",
        label: "Question",
        type: "string",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "answer",
        label: "Answer",
        type: "richText",
        required: true,
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "section",
        label: "Help Section",
        type: "select",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
        enumValues: ["faqs", "knowledge-base", "troubleshooting", "support-center"],
      },
      {
        name: "category",
        label: "Category",
        type: "relation",
        required: true,
        indexed: true,
        relationTo: "businessCategories",
        publicReadable: true,
        adminWritable: true,
      },
    ],
    indexes: [
      {
        name: "helpArticles_status_section_sortOrder",
        fields: ["status", "section", "sortOrder"],
        purpose: "Help section filtering.",
      },
      {
        name: "helpArticles_status_category_sortOrder",
        fields: ["status", "category", "sortOrder"],
        purpose: "Help category filtering.",
      },
    ],
  }),
  contentContract({
    id: "applications",
    collectionName: "applications",
    label: "Applications",
    description: "Public application catalogue areas such as operations, people, CRM, documents, analytics, billing, and integrations.",
    phase: "phase-1-foundation",
    risk: "low",
    adminPath: "/admin/applications",
    publicRoutes: ["/applications"],
    extraFields: [
      {
        name: "features",
        label: "Features",
        type: "array",
        required: false,
        publicReadable: true,
        adminWritable: true,
      },
    ],
  }),
  contentContract({
    id: "services",
    collectionName: "services",
    label: "Services",
    description: "Combined On-Demand and Managed Services catalogue records.",
    phase: "phase-1-foundation",
    risk: "low",
    adminPath: "/admin/services",
    publicRoutes: ["/on-demand", "/managed-services"],
    extraFields: [
      {
        name: "serviceType",
        label: "Service Type",
        type: "select",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
        enumValues: ["on-demand", "managed"],
      },
      {
        name: "category",
        label: "Category",
        type: "relation",
        required: false,
        indexed: true,
        relationTo: "businessCategories",
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "linkType",
        label: "Link Type",
        type: "select",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
        enumValues: ["route", "anchor"],
      },
    ],
  }),
  contentContract({
    id: "operations",
    collectionName: "operations",
    label: "Operations",
    description: "Operations pathways including finance, insurance, calculators, connectivity, and future operations areas.",
    phase: "phase-1-foundation",
    risk: "low",
    adminPath: "/admin/operations",
    publicRoutes: ["/operations"],
    extraFields: [
      {
        name: "operationType",
        label: "Operation Type",
        type: "select",
        required: false,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
        enumValues: ["finance", "insurance", "calculator", "connectivity", "coming-soon", "other"],
      },
    ],
  }),
  contentContract({
    id: "offers",
    collectionName: "offers",
    label: "Offers",
    description: "Partner and promotional offers shown in the Offers area.",
    phase: "phase-2-commercial",
    risk: "medium",
    adminPath: "/admin/offers",
    publicRoutes: ["/offers"],
    workflow: { ...approvalWorkflow, approvalRole: "commercial-admin" },
    security: {
      readableBy: ["public", "member", "admin", "editor", "commercial-admin"],
      writableBy: ["admin", "commercial-admin"],
      deletableBy: ["super-admin"],
      notes: "Commercial approvals required before publishing. Member-only offers must be hidden from public queries.",
    },
    extraFields: [
      {
        name: "partner",
        label: "Partner",
        type: "string",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "category",
        label: "Category",
        type: "relation",
        required: true,
        indexed: true,
        relationTo: "businessCategories",
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "offerType",
        label: "Offer Type",
        type: "select",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
        enumValues: ["exclusive", "top", "standard"],
      },
      {
        name: "memberOnly",
        label: "Member Only",
        type: "boolean",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
        defaultValue: false,
      },
    ],
  }),
  contentContract({
    id: "marketplaceListings",
    collectionName: "marketplaceListings",
    label: "Marketplace Listings",
    description: "Marketplace products, assets, supplier listings, service listings, and process entries.",
    phase: "phase-2-commercial",
    risk: "medium",
    adminPath: "/admin/marketplace",
    publicRoutes: ["/marketplace"],
    workflow: { ...approvalWorkflow, approvalRole: "commercial-admin" },
    security: {
      readableBy: ["public", "member", "admin", "commercial-admin"],
      writableBy: ["admin", "commercial-admin"],
      deletableBy: ["super-admin"],
      notes: "Marketplace publishing requires approval because listings may involve suppliers, commercial claims, pricing, and media.",
    },
    extraFields: [
      {
        name: "listingType",
        label: "Listing Type",
        type: "select",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
        enumValues: ["rbp-product", "rbp-asset", "third-party-product", "third-party-asset", "service", "process"],
      },
      {
        name: "supplierName",
        label: "Supplier Name",
        type: "string",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "price",
        label: "Price",
        type: "string",
        required: false,
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "mediaAssetIds",
        label: "Media Assets",
        type: "array",
        required: false,
        relationTo: "mediaAssets",
        publicReadable: true,
        adminWritable: true,
      },
    ],
  }),
  contentContract({
    id: "membershipPages",
    collectionName: "membershipPages",
    label: "Membership Pages",
    description: "Membership overview, plans, inclusions, usage, pricing, payment terms, sign-up content, and FAQs.",
    phase: "phase-3-membership",
    risk: "high",
    adminPath: "/admin/membership",
    publicRoutes: ["/membership"],
    workflow: approvalWorkflow,
    security: {
      readableBy: ["public", "member", "admin"],
      writableBy: ["admin"],
      deletableBy: ["super-admin"],
      notes: "Membership content may affect pricing, payment expectations, and entitlements. Publish with approval.",
    },
    extraFields: [
      {
        name: "pageType",
        label: "Page Type",
        type: "select",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
        enumValues: ["overview", "plan", "inclusions", "pricing", "usage", "payment", "signup", "faq"],
      },
      {
        name: "price",
        label: "Price",
        type: "string",
        required: false,
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "memberVisibility",
        label: "Member Visibility",
        type: "select",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
        enumValues: ["public", "members", "admin"],
      },
    ],
  }),
  contentContract({
    id: "legalPages",
    collectionName: "legalPages",
    label: "Legal Pages",
    description: "Privacy policy, terms of use, terms of engagement, payment policy, and services policy.",
    phase: "phase-4-governance",
    risk: "restricted",
    adminPath: "/admin/site-content/legal",
    publicRoutes: ["/privacy-policy", "/terms-of-use", "/terms-of-engagement", "/payment-policy", "/services-policy"],
    workflow: { ...approvalWorkflow, approvalRole: "legal-admin" },
    security: {
      readableBy: ["public", "admin", "legal-admin"],
      writableBy: ["legal-admin", "super-admin"],
      deletableBy: ["super-admin"],
      notes: "Legal records require restricted edit permissions, approval workflow, version history, and audit logging.",
    },
    extraFields: [
      {
        name: "policyType",
        label: "Policy Type",
        type: "select",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
        enumValues: ["privacy-policy", "terms-of-use", "terms-of-engagement", "payment-policy", "services-policy", "other"],
      },
      {
        name: "version",
        label: "Version",
        type: "string",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "effectiveDate",
        label: "Effective Date",
        type: "date",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "approvalStatus",
        label: "Approval Status",
        type: "select",
        required: true,
        indexed: true,
        publicReadable: false,
        adminWritable: true,
        enumValues: ["draft", "review", "approved", "published"],
      },
      {
        name: "body",
        label: "Legal Body",
        type: "richText",
        required: true,
        publicReadable: true,
        adminWritable: true,
      },
    ],
  }),
  {
    id: "mediaAssets",
    collectionName: "mediaAssets",
    label: "Media Assets",
    description: "Shared media metadata for marketplace listings, resources, services, and future content records.",
    implementationPhase: "platform-support",
    riskLevel: "medium",
    adminPath: "/admin/media",
    publicRoutes: [],
    fields: [
      {
        name: "id",
        label: "Document ID",
        type: "string",
        required: true,
        indexed: true,
        unique: true,
        publicReadable: false,
        adminWritable: false,
      },
      {
        name: "fileName",
        label: "File Name",
        type: "string",
        required: true,
        indexed: true,
        publicReadable: true,
        adminWritable: true,
      },
      {
        name: "storagePath",
        label: "Storage Path",
        type: "string",
        required: true,
        indexed: true,
        publicReadable: false,
        adminWritable: false,
        sensitive: true,
      },
      {
        name: "publicUrl",
        label: "Public URL",
        type: "url",
        required: false,
        publicReadable: true,
        adminWritable: false,
      },
      {
        name: "uploadedBy",
        label: "Uploaded By",
        type: "relation",
        required: true,
        indexed: true,
        relationTo: "adminUsers",
        publicReadable: false,
        adminWritable: false,
      },
    ],
    indexes: [
      {
        name: "mediaAssets_uploadedBy",
        fields: ["uploadedBy"],
        purpose: "Audit and ownership lookup.",
      },
    ],
    workflow: {
      draftSupported: false,
      publishSupported: false,
      approvalRequired: false,
      archiveInsteadOfDelete: true,
      auditLogRequired: true,
    },
    security: {
      readableBy: ["admin", "editor", "commercial-admin", "legal-admin"],
      writableBy: ["admin", "editor", "commercial-admin"],
      deletableBy: ["super-admin"],
      notes: "Storage rules must restrict uploads by file type, file size, and role.",
    },
    migrationNotes: ["No static seed required yet."],
    firebaseNotes: ["Backed by Firebase Storage. Keep metadata in Firestore and binary content in Storage."],
  },
  {
    id: "auditLogs",
    collectionName: "auditLogs",
    label: "Audit Logs",
    description: "Immutable audit trail for admin content changes, approvals, publishing, and restricted actions.",
    implementationPhase: "platform-support",
    riskLevel: "restricted",
    adminPath: "/admin/audit-logs",
    publicRoutes: [],
    fields: [
      {
        name: "id",
        label: "Document ID",
        type: "string",
        required: true,
        indexed: true,
        unique: true,
        adminWritable: false,
      },
      {
        name: "actorId",
        label: "Actor ID",
        type: "relation",
        required: true,
        indexed: true,
        relationTo: "adminUsers",
        sensitive: true,
      },
      {
        name: "action",
        label: "Action",
        type: "select",
        required: true,
        indexed: true,
        enumValues: ["create", "update", "archive", "publish", "approve", "reject", "delete", "login", "permission-change"],
      },
      {
        name: "collectionId",
        label: "Collection ID",
        type: "string",
        required: true,
        indexed: true,
      },
      {
        name: "recordId",
        label: "Record ID",
        type: "string",
        required: true,
        indexed: true,
      },
      {
        name: "createdAt",
        label: "Created At",
        type: "datetime",
        required: true,
        indexed: true,
      },
      {
        name: "metadata",
        label: "Metadata",
        type: "json",
        required: false,
        sensitive: true,
      },
    ],
    indexes: [
      {
        name: "auditLogs_collectionId_recordId_createdAt",
        fields: ["collectionId", "recordId", "createdAt"],
        purpose: "Record-level audit history.",
      },
    ],
    workflow: {
      draftSupported: false,
      publishSupported: false,
      approvalRequired: false,
      archiveInsteadOfDelete: false,
      auditLogRequired: false,
    },
    security: {
      readableBy: ["super-admin"],
      writableBy: ["system"],
      deletableBy: [],
      notes: "Audit logs should be append-only and not editable from normal admin UI.",
    },
    migrationNotes: ["No static seed required."],
    firebaseNotes: ["Write through trusted server functions where possible."],
  },
  {
    id: "adminUsers",
    collectionName: "adminUsers",
    label: "Admin Users",
    description: "Admin profile and role metadata layered on top of Firebase Auth.",
    implementationPhase: "platform-support",
    riskLevel: "restricted",
    adminPath: "/admin/settings/admin-users",
    publicRoutes: [],
    fields: [
      {
        name: "id",
        label: "User ID",
        type: "string",
        required: true,
        indexed: true,
        unique: true,
        sensitive: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        indexed: true,
        unique: true,
        sensitive: true,
      },
      {
        name: "displayName",
        label: "Display Name",
        type: "string",
        required: true,
        indexed: true,
      },
      {
        name: "roles",
        label: "Roles",
        type: "multiSelect",
        required: true,
        indexed: true,
        enumValues: ["admin", "editor", "commercial-admin", "legal-admin", "super-admin"],
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        indexed: true,
        enumValues: ["active", "inactive", "invited", "suspended"],
      },
    ],
    indexes: [
      {
        name: "adminUsers_email",
        fields: ["email"],
        purpose: "Admin user lookup.",
      },
      {
        name: "adminUsers_roles",
        fields: ["roles"],
        purpose: "Role-based admin filtering.",
      },
    ],
    workflow: {
      draftSupported: false,
      publishSupported: false,
      approvalRequired: true,
      approvalRole: "super-admin",
      archiveInsteadOfDelete: true,
      auditLogRequired: true,
    },
    security: {
      readableBy: ["super-admin"],
      writableBy: ["super-admin"],
      deletableBy: ["super-admin"],
      notes: "Role changes must be restricted to super-admin and recorded in auditLogs.",
    },
    migrationNotes: ["Backfill only after Firebase Auth is enabled."],
    firebaseNotes: ["Use Firebase Auth for identity. Use custom claims or adminUsers role metadata for authorization."],
  },
];

export const backendPhaseOrder: BackendImplementationPhase[] = [
  "phase-1-foundation",
  "phase-2-commercial",
  "phase-3-membership",
  "phase-4-governance",
  "platform-support",
];

export function getBackendCollectionContract(id: BackendCollectionId) {
  return backendCollectionContracts.find((contract) => contract.id === id) ?? null;
}

export function getBackendContractsByPhase(phase: BackendImplementationPhase) {
  return backendCollectionContracts.filter((contract) => contract.implementationPhase === phase);
}

export function getBackendContractsByRisk(riskLevel: BackendRiskLevel) {
  return backendCollectionContracts.filter((contract) => contract.riskLevel === riskLevel);
}

export function getPhaseOneBackendContracts() {
  return getBackendContractsByPhase("phase-1-foundation");
}

export function getApprovalRequiredBackendContracts() {
  return backendCollectionContracts.filter((contract) => contract.workflow.approvalRequired);
}

export function getAuditRequiredBackendContracts() {
  return backendCollectionContracts.filter((contract) => contract.workflow.auditLogRequired);
}
