import { useLocation } from "react-router";
import { FileText, Info, Save } from "lucide-react";

import {
  adminCrudEntities,
  type AdminCrudEntity,
  type AdminCrudField,
} from "../../data/adminCrudSchema";

import { AdminEmptyState } from "./AdminEmptyState";
import { AdminFieldRenderer } from "./AdminFieldRenderer";
import { AdminFormShell } from "./AdminFormShell";
import { AdminStatusBadge } from "./AdminStatusBadge";

const pathAliases: Record<string, string> = {
  "/admin/settings/business-categories": "business-categories",
  "/admin/resources": "resources",
  "/admin/help-center": "help-center",
  "/admin/offers": "offers",
  "/admin/applications": "applications",
  "/admin/services": "services",
  "/admin/on-demand": "services",
  "/admin/managed-services": "services",
  "/admin/operations": "services",
  "/admin/marketplace": "marketplace",
  "/admin/membership": "membership",
  "/admin/site-content/legal": "legal-pages",
};

function getCrudEntityForPath(pathname: string): AdminCrudEntity | null {
  const directMatch = [...adminCrudEntities]
    .sort((a, b) => b.adminPath.length - a.adminPath.length)
    .find((entity) => pathname === entity.adminPath || pathname.startsWith(entity.adminPath + "/"));

  if (directMatch) return directMatch;

  const alias = Object.entries(pathAliases)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => pathname === path || pathname.startsWith(path + "/"));

  if (!alias) return null;

  return adminCrudEntities.find((entity) => entity.id === alias[1]) ?? null;
}

function mapFieldType(field: AdminCrudField): "text" | "textarea" | "select" | "checkbox" | "readonly" {
  if (field.type === "textarea" || field.type === "rich-text" || field.type === "json") {
    return "textarea";
  }

  if (field.type === "select" || field.type === "multi-select") {
    return "select";
  }

  if (field.type === "boolean") {
    return "checkbox";
  }

  if (
    field.name === "createdAt" ||
    field.name === "updatedAt" ||
    field.name === "publishedAt" ||
    field.name === "createdBy" ||
    field.name === "updatedBy"
  ) {
    return "readonly";
  }

  return "text";
}

function sampleValueForField(field: AdminCrudField): string | boolean {
  if (field.type === "boolean") return false;
  if (field.options?.length) return field.options[0];

  const samples: Record<string, string> = {
    title: "Example Record Title",
    slug: "example-record-title",
    summary: "Short summary for this admin-managed record.",
    body: "Long-form content will be edited here once rich text editing is connected.",
    question: "Example question?",
    answer: "Example answer content.",
    partner: "Example Partner",
    category: "operations",
    status: "draft",
    visibility: "public",
    sortOrder: "1",
    readTime: "10 min read",
    price: "$0",
    version: "1.0",
    createdAt: "System generated",
    updatedAt: "System generated",
    publishedAt: "Not published",
    createdBy: "System generated",
    updatedBy: "System generated",
  };

  return samples[field.name] ?? "";
}

export function AdminRecordFormPreview() {
  const location = useLocation();
  const entity = getCrudEntityForPath(location.pathname);

  if (!entity) {
    return (
      <AdminFormShell
        title="Record Form Scaffold"
        description="No CRUD schema is mapped to this admin route yet."
      >
        <AdminEmptyState
          icon={Info}
          title="No schema mapped"
          description="This route exists as an admin scaffold, but it does not yet have a CRUD schema entry. Add one to adminCrudSchema.ts when this area is ready for form generation."
        />
      </AdminFormShell>
    );
  }

  return (
    <AdminFormShell
      title={`${entity.label} Form Scaffold`}
      description={`Generated from ${entity.collectionName}. This is a read-only form preview until backend persistence is implemented.`}
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <AdminStatusBadge label={entity.defaultStatus} status={entity.defaultStatus} />
            <AdminStatusBadge label={entity.defaultVisibility} status={entity.defaultVisibility} />
            {entity.requiresApproval && (
              <AdminStatusBadge label="Approval Required" status="approval" />
            )}
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-all">
            <Save className="w-4 h-4" />
            Save Disabled
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <FileText className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-1">Schema-driven form preview</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Fields below are generated from the planned CRUD schema. They are read-only for now because real create, edit, validation, and persistence belong in the backend phase.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {entity.fields.map((field) => (
          <AdminFieldRenderer
            key={field.name}
            label={`${field.label}${field.required ? " *" : ""}`}
            type={mapFieldType(field)}
            value={sampleValueForField(field)}
            placeholder={field.required ? "Required field" : "Optional field"}
            options={field.options ?? []}
            helpText={field.helpText ?? (field.relationTo ? `Relation: ${field.relationTo}` : undefined)}
            readOnly
          />
        ))}
      </div>
    </AdminFormShell>
  );
}
