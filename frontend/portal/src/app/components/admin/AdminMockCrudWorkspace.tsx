import { useLocation } from "react-router";
import { Edit3, HelpCircle, Plus, Save, Trash2, X } from "lucide-react";

import {
  publicResources,
  resourceCategoryFilters,
  resourceTypeFilters,
  type PublicResource,
  type ResourceType,
} from "../../data/resources";

import {
  helpArticles,
  helpCategories,
  helpSections,
  type HelpArticle,
  type HelpSectionId,
} from "../../data/helpCenter";

import {
  offerCategoryFilters,
  publicOffers,
  type OfferCategory,
  type PublicOffer,
} from "../../data/offers";

import {
  marketplaceSections,
  type MarketplaceSection,
} from "../../data/marketplace";

import {
  membershipPages,
  type MembershipPageItem,
} from "../../data/membership";

import {
  legalPages,
  type LegalPage,
  type LegalPageStatus,
} from "../../data/legalPages";

import {
  applicationCategories,
  type ApplicationCategory,
} from "../../data/applications";

import {
  onDemandServices,
  type OnDemandService,
} from "../../data/onDemandServices";

import {
  managedServices,
  type ManagedService,
} from "../../data/managedServices";

import { useAdminLocalCrud } from "../../hooks/useAdminLocalCrud";
import { useAdminTableControls } from "../../hooks/useAdminTableControls";

import {
  createMockRecordId,
  hasRequiredTextFields,
  slugify,
  withFallbackHref,
} from "../../utils/adminCrud";

import { AdminEmptyState } from "./AdminEmptyState";
import { AdminFormShell } from "./AdminFormShell";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { AdminTable, type AdminTableColumn } from "./AdminTable";
import { AdminTableControls } from "./AdminTableControls";

type ContentStatus =
  | "ready"
  | "placeholder"
  | "content-required"
  | "backend-later"
  | "legal-review-required";

type ResourceDraft = Pick<
  PublicResource,
  "title" | "summary" | "type" | "category" | "readTime" | "href" | "status"
>;

type HelpDraft = Pick<
  HelpArticle,
  "question" | "answer" | "section" | "category" | "status"
>;

type OfferDraft = Pick<
  PublicOffer,
  "title" | "partner" | "summary" | "category" | "offerType" | "href" | "status"
>;

type MarketplaceListingType =
  | "rbp-product"
  | "rbp-asset"
  | "third-party-product"
  | "third-party-asset"
  | "service"
  | "process";

interface AdminMarketplaceRecord {
  id: string;
  title: string;
  summary: string;
  href: string;
  status: ContentStatus;
  listingType: MarketplaceListingType;
  supplierName: string;
  price: string;
  enquiryRequired: "yes" | "no";
}

type MarketplaceDraft = Pick<
  AdminMarketplaceRecord,
  "title" | "summary" | "href" | "status" | "listingType" | "supplierName" | "price" | "enquiryRequired"
>;

type MembershipPageType =
  | "overview"
  | "plan"
  | "inclusions"
  | "pricing"
  | "usage"
  | "payment"
  | "signup"
  | "faq";

interface AdminMembershipRecord {
  id: string;
  title: string;
  summary: string;
  href: string;
  status: ContentStatus;
  pageType: MembershipPageType;
  planName: string;
  price: string;
  billingPeriod: "monthly" | "quarterly" | "annual" | "custom" | "not-applicable";
  requiresPayment: "yes" | "no";
  memberVisibility: "public" | "members" | "admin";
}

type MembershipDraft = Pick<
  AdminMembershipRecord,
  "title" | "summary" | "href" | "status" | "pageType" | "planName" | "price" | "billingPeriod" | "requiresPayment" | "memberVisibility"
>;

type LegalPolicyType =
  | "privacy-policy"
  | "terms-of-use"
  | "terms-of-engagement"
  | "payment-policy"
  | "services-policy"
  | "other";

type LegalApprovalStatus = "draft" | "review" | "approved" | "published";

interface AdminLegalRecord {
  id: string;
  title: string;
  summary: string;
  href: string;
  status: LegalPageStatus;
  policyType: LegalPolicyType;
  effectiveDate: string;
  version: string;
  approvalStatus: LegalApprovalStatus;
  approvedBy: string;
  approvedAt: string;
}

type LegalDraft = Pick<
  AdminLegalRecord,
  "title" | "summary" | "href" | "status" | "policyType" | "effectiveDate" | "version" | "approvalStatus" | "approvedBy" | "approvedAt"
>;

type ApplicationDraft = Pick<
  ApplicationCategory,
  "title" | "summary" | "href" | "status"
>;

interface AdminServiceRecord {
  id: string;
  title: string;
  summary: string;
  href: string;
  category: string;
  serviceType: "on-demand" | "managed";
  linkType: "route" | "anchor";
  status: ContentStatus;
}

type ServiceDraft = Pick<
  AdminServiceRecord,
  "title" | "summary" | "href" | "category" | "serviceType" | "linkType" | "status"
>;


function createResourceDraft(): ResourceDraft {
  return {
    title: "",
    summary: "",
    type: "articles",
    category: "operations",
    readTime: "",
    href: "/resources",
    status: "ready",
  };
}

function createHelpDraft(): HelpDraft {
  return {
    question: "",
    answer: "",
    section: "faqs",
    category: "other",
    status: "ready",
  };
}

function createOfferDraft(): OfferDraft {
  return {
    title: "",
    partner: "",
    summary: "",
    category: "operations",
    offerType: "standard",
    href: "/offers",
    status: "ready",
  };
}

function createMarketplaceDraft(): MarketplaceDraft {
  return {
    title: "",
    summary: "",
    href: "/marketplace",
    status: "ready",
    listingType: "service",
    supplierName: "",
    price: "Enquire",
    enquiryRequired: "yes",
  };
}

function inferMarketplaceListingType(section: MarketplaceSection): MarketplaceListingType {
  if (section.id.includes("rbp-products")) return "rbp-product";
  if (section.id.includes("rbp-assets")) return "rbp-asset";
  if (section.id.includes("third-party")) return "third-party-product";
  if (section.id.includes("buying-process")) return "process";
  return "service";
}

function createMarketplaceRecords(): AdminMarketplaceRecord[] {
  return marketplaceSections.map((section) => ({
    id: section.id,
    title: section.title,
    summary: section.summary,
    href: section.href,
    status: section.status,
    listingType: inferMarketplaceListingType(section),
    supplierName: section.id.startsWith("rbp") ? "Remote Business Partner" : "Marketplace Partner",
    price: section.id.includes("process") || section.id.includes("list-with-us") ? "N/A" : "Enquire",
    enquiryRequired: section.id.includes("process") ? "no" : "yes",
  }));
}

function createMembershipDraft(): MembershipDraft {
  return {
    title: "",
    summary: "",
    href: "/membership",
    status: "ready",
    pageType: "overview",
    planName: "",
    price: "TBC",
    billingPeriod: "not-applicable",
    requiresPayment: "no",
    memberVisibility: "public",
  };
}

function inferMembershipPageType(page: MembershipPageItem): MembershipPageType {
  if (page.id.includes("pricing")) return "pricing";
  if (page.id.includes("payment")) return "payment";
  if (page.id.includes("sign-up")) return "signup";
  if (page.id.includes("faq") || page.id.includes("frequently")) return "faq";
  if (page.id.includes("inclusions")) return "inclusions";
  if (page.id.includes("usage")) return "usage";
  if (page.id.includes("membership")) return "plan";
  return "overview";
}

function createMembershipRecords(): AdminMembershipRecord[] {
  return membershipPages.map((page) => {
    const pageType = inferMembershipPageType(page);

    return {
      id: page.id,
      title: page.title,
      summary: page.summary,
      href: page.href,
      status: page.status,
      pageType,
      planName: pageType === "plan" || pageType === "pricing" ? "Remote Business Partner Membership" : "",
      price: pageType === "pricing" ? "TBC" : pageType === "payment" ? "See payment terms" : "N/A",
      billingPeriod: pageType === "pricing" ? "monthly" : "not-applicable",
      requiresPayment: pageType === "pricing" || pageType === "payment" || pageType === "signup" ? "yes" : "no",
      memberVisibility: pageType === "usage" || pageType === "inclusions" ? "members" : "public",
    };
  });
}

function createLegalDraft(): LegalDraft {
  return {
    title: "",
    summary: "",
    href: "/legal",
    status: "legal-review-required",
    policyType: "other",
    effectiveDate: "",
    version: "1.0",
    approvalStatus: "draft",
    approvedBy: "",
    approvedAt: "",
  };
}

function inferLegalPolicyType(page: LegalPage): LegalPolicyType {
  if (page.id === "privacy-policy") return "privacy-policy";
  if (page.id === "terms-of-use") return "terms-of-use";
  if (page.id === "terms-of-engagement") return "terms-of-engagement";
  if (page.id === "payment-policy") return "payment-policy";
  if (page.id === "services-policy") return "services-policy";
  return "other";
}

function createLegalRecords(): AdminLegalRecord[] {
  return legalPages.map((page) => ({
    id: page.id,
    title: page.title,
    summary: page.summary,
    href: page.href,
    status: page.status,
    policyType: inferLegalPolicyType(page),
    effectiveDate: "",
    version: "1.0",
    approvalStatus: "review",
    approvedBy: "",
    approvedAt: "",
  }));
}

function createApplicationDraft(): ApplicationDraft {
  return {
    title: "",
    summary: "",
    href: "/applications",
    status: "ready",
  };
}

function createServiceDraft(): ServiceDraft {
  return {
    title: "",
    summary: "",
    href: "/on-demand",
    category: "operations",
    serviceType: "on-demand",
    linkType: "route",
    status: "ready",
  };
}

function createServiceRecords(): AdminServiceRecord[] {
  const onDemandRecords: AdminServiceRecord[] = onDemandServices.map((service: OnDemandService) => ({
    id: service.id,
    title: service.title,
    summary: service.summary,
    href: service.href,
    category: service.category,
    serviceType: "on-demand",
    linkType: "route",
    status: service.status,
  }));

  const managedRecords: AdminServiceRecord[] = managedServices.map((service: ManagedService) => ({
    id: service.id,
    title: service.title,
    summary: service.summary,
    href: service.href,
    category: "operations",
    serviceType: "managed",
    linkType: service.type,
    status: service.status,
  }));

  return [...onDemandRecords, ...managedRecords];
}

const inputClass =
  "w-full border border-slate-200 bg-white text-slate-900 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function MockNotice() {
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
      <strong>Local mock state only.</strong> Changes stay in browser memory and reset on refresh. Backend persistence comes later, because apparently data needs somewhere to live.
    </div>
  );
}

function getRecordStringValue(record: unknown, keys: string[]) {
  const source = record as Record<string, unknown>;

  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
  }

  return "";
}

function createRecordSearchText(record: unknown) {
  return Object.values(record as Record<string, unknown>)
    .filter((value) => ["string", "number", "boolean"].includes(typeof value))
    .join(" ");
}

function useMockTableControls<TRecord>(records: TRecord[]) {
  return useAdminTableControls({
    records,
    getSearchText: createRecordSearchText,
    getStatus: (record) => getRecordStringValue(record, ["status", "approvalStatus"]),
    getCategory: (record) =>
      getRecordStringValue(record, [
        "category",
        "type",
        "section",
        "offerType",
        "listingType",
        "serviceType",
        "pageType",
        "policyType",
        "memberVisibility",
      ]),
    sortOptions: [
      {
        id: "title",
        label: "Title",
        getValue: (record) => getRecordStringValue(record, ["title", "question"]),
      },
      {
        id: "status",
        label: "Status",
        getValue: (record) => getRecordStringValue(record, ["status", "approvalStatus"]),
      },
      {
        id: "category",
        label: "Category",
        getValue: (record) =>
          getRecordStringValue(record, [
            "category",
            "type",
            "section",
            "offerType",
            "listingType",
            "serviceType",
            "pageType",
            "policyType",
            "memberVisibility",
          ]),
      },
    ],
    defaultSortId: "title",
  });
}


function ResourceMockCrud() {
  const {
    records,
    draft,
    editingRecord,
    canSave,
    updateDraft,
    resetForm,
    startEdit,
    saveRecord,
    deleteRecord,
  } = useAdminLocalCrud<PublicResource, ResourceDraft>({
    initialRecords: publicResources,
    createDraft: createResourceDraft,
    toDraft: (record) => ({
      title: record.title,
      summary: record.summary,
      type: record.type,
      category: record.category,
      readTime: record.readTime ?? "",
      href: record.href,
      status: record.status,
    }),
    fromDraft: (currentDraft, existingRecord) => ({
      id: existingRecord?.id ?? createMockRecordId("resource", currentDraft.title),
      ...currentDraft,
      href: withFallbackHref(currentDraft.href, "/resources"),
    }),
    validateDraft: (currentDraft) =>
      hasRequiredTextFields(currentDraft.title, currentDraft.summary),
  });

  const table = useMockTableControls(records);

  const columns: AdminTableColumn<PublicResource>[] = [
    {
      key: "title",
      header: "Resource",
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.title}</div>
          <div className="text-xs text-slate-500 mt-1">{row.summary}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row) => <AdminStatusBadge label={row.type} status="ready" />,
    },
    {
      key: "category",
      header: "Category",
      render: (row) => <span className="text-slate-600">{row.category}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <AdminStatusBadge label={row.status} status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => startEdit(row)}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
            title="Edit resource"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteRecord(row.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-all"
            title="Delete resource"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">Mock Resource Records</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and delete resource records in local component state.
          </p>
        </div>
        <AdminTableControls controls={table} />
        <AdminTable rows={table.rows as Array<{ id: string }>} columns={columns} />
      </div>

      <AdminFormShell
        title={editingRecord ? "Edit Resource" : "Create Resource"}
        description="Local mock form for resources. This previews future admin behaviour without backend persistence."
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={saveRecord}
              disabled={!canSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-40 transition-all"
            >
              {editingRecord ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingRecord ? "Save Mock Edit" : "Add Mock Resource"}
            </button>
          </div>
        }
      >
        <MockNotice />

        <Field label="Title">
          <input
            className={inputClass}
            value={draft.title}
            onChange={(event) => updateDraft({ title: event.target.value })}
            placeholder="Example Resource Title"
          />
        </Field>

        <Field label="Summary">
          <textarea
            className={inputClass}
            value={draft.summary}
            onChange={(event) => updateDraft({ summary: event.target.value })}
            placeholder="Short resource summary"
            rows={4}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Type">
            <select
              className={inputClass}
              value={draft.type}
              onChange={(event) => updateDraft({ type: event.target.value as ResourceType })}
            >
              {resourceTypeFilters.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Category">
            <select
              className={inputClass}
              value={draft.category}
              onChange={(event) => updateDraft({ category: event.target.value })}
            >
              {resourceCategoryFilters.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Read Time">
          <input
            className={inputClass}
            value={draft.readTime ?? ""}
            onChange={(event) => updateDraft({ readTime: event.target.value })}
            placeholder="10 min read"
          />
        </Field>
      </AdminFormShell>
    </section>
  );
}

function HelpCenterMockCrud() {
  const {
    records,
    draft,
    editingRecord,
    canSave,
    updateDraft,
    resetForm,
    startEdit,
    saveRecord,
    deleteRecord,
  } = useAdminLocalCrud<HelpArticle, HelpDraft>({
    initialRecords: helpArticles,
    createDraft: createHelpDraft,
    toDraft: (record) => ({
      question: record.question,
      answer: record.answer,
      section: record.section,
      category: record.category,
      status: record.status,
    }),
    fromDraft: (currentDraft, existingRecord) => ({
      id: existingRecord?.id ?? createMockRecordId("help", currentDraft.question),
      ...currentDraft,
    }),
    validateDraft: (currentDraft) =>
      hasRequiredTextFields(currentDraft.question, currentDraft.answer),
  });

  const table = useMockTableControls(records);

  const columns: AdminTableColumn<HelpArticle>[] = [
    {
      key: "question",
      header: "Question",
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.question}</div>
          <div className="text-xs text-slate-500 mt-1 line-clamp-2">{row.answer}</div>
        </div>
      ),
    },
    {
      key: "section",
      header: "Section",
      render: (row) => <AdminStatusBadge label={row.section} status="ready" />,
    },
    {
      key: "category",
      header: "Category",
      render: (row) => <span className="text-slate-600">{row.category}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <AdminStatusBadge label={row.status} status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => startEdit(row)}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
            title="Edit help article"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteRecord(row.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-all"
            title="Delete help article"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">Mock Help Center Records</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and delete help content in local component state.
          </p>
        </div>
        <AdminTableControls controls={table} />
        <AdminTable rows={table.rows as Array<{ id: string }>} columns={columns} />
      </div>

      <AdminFormShell
        title={editingRecord ? "Edit Help Article" : "Create Help Article"}
        description="Local mock form for FAQs, knowledge base entries, troubleshooting items, and support guidance."
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={saveRecord}
              disabled={!canSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-40 transition-all"
            >
              {editingRecord ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingRecord ? "Save Mock Edit" : "Add Mock Help Article"}
            </button>
          </div>
        }
      >
        <MockNotice />

        <Field label="Question">
          <input
            className={inputClass}
            value={draft.question}
            onChange={(event) => updateDraft({ question: event.target.value })}
            placeholder="Example help question?"
          />
        </Field>

        <Field label="Answer">
          <textarea
            className={inputClass}
            value={draft.answer}
            onChange={(event) => updateDraft({ answer: event.target.value })}
            placeholder="Answer content"
            rows={4}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section">
            <select
              className={inputClass}
              value={draft.section}
              onChange={(event) => updateDraft({ section: event.target.value as HelpSectionId })}
            >
              {helpSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Category">
            <select
              className={inputClass}
              value={draft.category}
              onChange={(event) => updateDraft({ category: event.target.value })}
            >
              {helpCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </AdminFormShell>
    </section>
  );
}

function LegalPagesMockCrud() {
  const {
    records,
    draft,
    editingRecord,
    canSave,
    updateDraft,
    resetForm,
    startEdit,
    saveRecord,
    deleteRecord,
  } = useAdminLocalCrud<AdminLegalRecord, LegalDraft>({
    initialRecords: createLegalRecords(),
    createDraft: createLegalDraft,
    toDraft: (record) => ({
      title: record.title,
      summary: record.summary,
      href: record.href,
      status: record.status,
      policyType: record.policyType,
      effectiveDate: record.effectiveDate,
      version: record.version,
      approvalStatus: record.approvalStatus,
      approvedBy: record.approvedBy,
      approvedAt: record.approvedAt,
    }),
    fromDraft: (currentDraft, existingRecord) => ({
      id: existingRecord?.id ?? createMockRecordId("legal", currentDraft.title),
      ...currentDraft,
      href: withFallbackHref(currentDraft.href, "/legal"),
    }),
    validateDraft: (currentDraft) =>
      hasRequiredTextFields(currentDraft.title, currentDraft.summary, currentDraft.version),
  });

  const table = useMockTableControls(records);

  const columns: AdminTableColumn<AdminLegalRecord>[] = [
    {
      key: "title",
      header: "Legal Page",
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.title}</div>
          <div className="text-xs text-slate-500 mt-1">{row.summary}</div>
        </div>
      ),
    },
    {
      key: "policyType",
      header: "Policy Type",
      render: (row) => <AdminStatusBadge label={row.policyType} status="review" />,
    },
    {
      key: "version",
      header: "Version",
      render: (row) => <span className="text-slate-600">{row.version}</span>,
    },
    {
      key: "approvalStatus",
      header: "Approval",
      render: (row) => <AdminStatusBadge label={row.approvalStatus} status={row.approvalStatus} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <AdminStatusBadge label={row.status} status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => startEdit(row)}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
            title="Edit legal page"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteRecord(row.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-all"
            title="Delete legal page"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">Mock Legal Page Records</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and delete legal page records in local component state.
          </p>
        </div>
        <AdminTableControls controls={table} />
        <AdminTable rows={table.rows as Array<{ id: string }>} columns={columns} />
      </div>

      <AdminFormShell
        title={editingRecord ? "Edit Legal Page" : "Create Legal Page"}
        description="Local mock form for legal pages, policy versioning, effective dates, and approval tracking. Real legal controls come later."
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={saveRecord}
              disabled={!canSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-40 transition-all"
            >
              {editingRecord ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingRecord ? "Save Mock Edit" : "Add Mock Legal Page"}
            </button>
          </div>
        }
      >
        <MockNotice />

        <Field label="Title">
          <input
            className={inputClass}
            value={draft.title}
            onChange={(event) => updateDraft({ title: event.target.value })}
            placeholder="Example Legal Page"
          />
        </Field>

        <Field label="Summary">
          <textarea
            className={inputClass}
            value={draft.summary}
            onChange={(event) => updateDraft({ summary: event.target.value })}
            placeholder="Short legal page summary"
            rows={4}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Policy Type">
            <select
              className={inputClass}
              value={draft.policyType}
              onChange={(event) =>
                updateDraft({ policyType: event.target.value as LegalPolicyType })
              }
            >
              <option value="privacy-policy">Privacy Policy</option>
              <option value="terms-of-use">Terms of Use</option>
              <option value="terms-of-engagement">Terms of Engagement</option>
              <option value="payment-policy">Payment Policy</option>
              <option value="services-policy">Services Policy</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Approval Status">
            <select
              className={inputClass}
              value={draft.approvalStatus}
              onChange={(event) =>
                updateDraft({ approvalStatus: event.target.value as LegalApprovalStatus })
              }
            >
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Version">
            <input
              className={inputClass}
              value={draft.version}
              onChange={(event) => updateDraft({ version: event.target.value })}
              placeholder="1.0"
            />
          </Field>

          <Field label="Effective Date">
            <input
              className={inputClass}
              value={draft.effectiveDate}
              onChange={(event) => updateDraft({ effectiveDate: event.target.value })}
              placeholder="YYYY-MM-DD"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Approved By">
            <input
              className={inputClass}
              value={draft.approvedBy}
              onChange={(event) => updateDraft({ approvedBy: event.target.value })}
              placeholder="Approver name"
            />
          </Field>

          <Field label="Approved At">
            <input
              className={inputClass}
              value={draft.approvedAt}
              onChange={(event) => updateDraft({ approvedAt: event.target.value })}
              placeholder="YYYY-MM-DD"
            />
          </Field>
        </div>

        <Field label="Public Link">
          <input
            className={inputClass}
            value={draft.href}
            onChange={(event) => updateDraft({ href: event.target.value })}
            placeholder="/legal/example"
          />
        </Field>

        <Field label="Page Status">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(event) => updateDraft({ status: event.target.value as LegalPageStatus })}
          >
            <option value="legal-review-required">Legal Review Required</option>
            <option value="placeholder">Placeholder</option>
            <option value="ready">Ready</option>
          </select>
        </Field>
      </AdminFormShell>
    </section>
  );
}

function MembershipMockCrud() {
  const {
    records,
    draft,
    editingRecord,
    canSave,
    updateDraft,
    resetForm,
    startEdit,
    saveRecord,
    deleteRecord,
  } = useAdminLocalCrud<AdminMembershipRecord, MembershipDraft>({
    initialRecords: createMembershipRecords(),
    createDraft: createMembershipDraft,
    toDraft: (record) => ({
      title: record.title,
      summary: record.summary,
      href: record.href,
      status: record.status,
      pageType: record.pageType,
      planName: record.planName,
      price: record.price,
      billingPeriod: record.billingPeriod,
      requiresPayment: record.requiresPayment,
      memberVisibility: record.memberVisibility,
    }),
    fromDraft: (currentDraft, existingRecord) => ({
      id: existingRecord?.id ?? createMockRecordId("membership", currentDraft.title),
      ...currentDraft,
      href: withFallbackHref(currentDraft.href, "/membership"),
    }),
    validateDraft: (currentDraft) =>
      hasRequiredTextFields(currentDraft.title, currentDraft.summary),
  });

  const table = useMockTableControls(records);

  const columns: AdminTableColumn<AdminMembershipRecord>[] = [
    {
      key: "title",
      header: "Membership Content",
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.title}</div>
          <div className="text-xs text-slate-500 mt-1">{row.summary}</div>
        </div>
      ),
    },
    {
      key: "pageType",
      header: "Type",
      render: (row) => <AdminStatusBadge label={row.pageType} status="ready" />,
    },
    {
      key: "price",
      header: "Price",
      render: (row) => <span className="text-slate-600">{row.price}</span>,
    },
    {
      key: "visibility",
      header: "Visibility",
      render: (row) => <AdminStatusBadge label={row.memberVisibility} status={row.memberVisibility} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <AdminStatusBadge label={row.status} status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => startEdit(row)}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
            title="Edit membership content"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteRecord(row.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-all"
            title="Delete membership content"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">Mock Membership Records</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and delete membership content records in local component state.
          </p>
        </div>
        <AdminTableControls controls={table} />
        <AdminTable rows={table.rows as Array<{ id: string }>} columns={columns} />
      </div>

      <AdminFormShell
        title={editingRecord ? "Edit Membership Content" : "Create Membership Content"}
        description="Local mock form for membership pages, plans, inclusions, pricing, usage, payment terms, and sign-up content."
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={saveRecord}
              disabled={!canSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-40 transition-all"
            >
              {editingRecord ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingRecord ? "Save Mock Edit" : "Add Mock Membership"}
            </button>
          </div>
        }
      >
        <MockNotice />

        <Field label="Title">
          <input
            className={inputClass}
            value={draft.title}
            onChange={(event) => updateDraft({ title: event.target.value })}
            placeholder="Example Membership Page"
          />
        </Field>

        <Field label="Summary">
          <textarea
            className={inputClass}
            value={draft.summary}
            onChange={(event) => updateDraft({ summary: event.target.value })}
            placeholder="Short membership summary"
            rows={4}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Page Type">
            <select
              className={inputClass}
              value={draft.pageType}
              onChange={(event) =>
                updateDraft({ pageType: event.target.value as MembershipPageType })
              }
            >
              <option value="overview">Overview</option>
              <option value="plan">Plan</option>
              <option value="inclusions">Inclusions</option>
              <option value="pricing">Pricing</option>
              <option value="usage">Usage</option>
              <option value="payment">Payment</option>
              <option value="signup">Sign-up</option>
              <option value="faq">FAQ</option>
            </select>
          </Field>

          <Field label="Member Visibility">
            <select
              className={inputClass}
              value={draft.memberVisibility}
              onChange={(event) =>
                updateDraft({ memberVisibility: event.target.value as MembershipDraft["memberVisibility"] })
              }
            >
              <option value="public">Public</option>
              <option value="members">Members</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
        </div>

        <Field label="Plan Name">
          <input
            className={inputClass}
            value={draft.planName}
            onChange={(event) => updateDraft({ planName: event.target.value })}
            placeholder="Remote Business Partner Membership"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Price / Display Price">
            <input
              className={inputClass}
              value={draft.price}
              onChange={(event) => updateDraft({ price: event.target.value })}
              placeholder="TBC"
            />
          </Field>

          <Field label="Billing Period">
            <select
              className={inputClass}
              value={draft.billingPeriod}
              onChange={(event) =>
                updateDraft({ billingPeriod: event.target.value as MembershipDraft["billingPeriod"] })
              }
            >
              <option value="not-applicable">Not applicable</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
              <option value="custom">Custom</option>
            </select>
          </Field>
        </div>

        <Field label="Requires Payment">
          <select
            className={inputClass}
            value={draft.requiresPayment}
            onChange={(event) =>
              updateDraft({ requiresPayment: event.target.value as MembershipDraft["requiresPayment"] })
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>

        <Field label="Public Link">
          <input
            className={inputClass}
            value={draft.href}
            onChange={(event) => updateDraft({ href: event.target.value })}
            placeholder="/membership/example"
          />
        </Field>

        <Field label="Status">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(event) => updateDraft({ status: event.target.value as ContentStatus })}
          >
            <option value="ready">Ready</option>
            <option value="placeholder">Placeholder</option>
            <option value="content-required">Content Required</option>
            <option value="backend-later">Backend Later</option>
            <option value="legal-review-required">Legal Review Required</option>
          </select>
        </Field>
      </AdminFormShell>
    </section>
  );
}

function MarketplaceMockCrud() {
  const {
    records,
    draft,
    editingRecord,
    canSave,
    updateDraft,
    resetForm,
    startEdit,
    saveRecord,
    deleteRecord,
  } = useAdminLocalCrud<AdminMarketplaceRecord, MarketplaceDraft>({
    initialRecords: createMarketplaceRecords(),
    createDraft: createMarketplaceDraft,
    toDraft: (record) => ({
      title: record.title,
      summary: record.summary,
      href: record.href,
      status: record.status,
      listingType: record.listingType,
      supplierName: record.supplierName,
      price: record.price,
      enquiryRequired: record.enquiryRequired,
    }),
    fromDraft: (currentDraft, existingRecord) => ({
      id: existingRecord?.id ?? createMockRecordId("marketplace", currentDraft.title),
      ...currentDraft,
      href: withFallbackHref(currentDraft.href, "/marketplace"),
    }),
    validateDraft: (currentDraft) =>
      hasRequiredTextFields(currentDraft.title, currentDraft.summary, currentDraft.supplierName),
  });

  const table = useMockTableControls(records);

  const columns: AdminTableColumn<AdminMarketplaceRecord>[] = [
    {
      key: "title",
      header: "Listing",
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.title}</div>
          <div className="text-xs text-slate-500 mt-1">{row.summary}</div>
        </div>
      ),
    },
    {
      key: "supplierName",
      header: "Supplier",
      render: (row) => <span className="text-slate-600">{row.supplierName}</span>,
    },
    {
      key: "listingType",
      header: "Type",
      render: (row) => <AdminStatusBadge label={row.listingType} status="ready" />,
    },
    {
      key: "price",
      header: "Price",
      render: (row) => <span className="text-slate-600">{row.price}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <AdminStatusBadge label={row.status} status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => startEdit(row)}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
            title="Edit marketplace listing"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteRecord(row.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-all"
            title="Delete marketplace listing"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">Mock Marketplace Records</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and delete marketplace listing records in local component state.
          </p>
        </div>
        <AdminTableControls controls={table} />
        <AdminTable rows={table.rows as Array<{ id: string }>} columns={columns} />
      </div>

      <AdminFormShell
        title={editingRecord ? "Edit Marketplace Listing" : "Create Marketplace Listing"}
        description="Local mock form for marketplace products, assets, supplier listings, pricing labels, and enquiry settings."
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={saveRecord}
              disabled={!canSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-40 transition-all"
            >
              {editingRecord ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingRecord ? "Save Mock Edit" : "Add Mock Listing"}
            </button>
          </div>
        }
      >
        <MockNotice />

        <Field label="Title">
          <input
            className={inputClass}
            value={draft.title}
            onChange={(event) => updateDraft({ title: event.target.value })}
            placeholder="Example Marketplace Listing"
          />
        </Field>

        <Field label="Supplier Name">
          <input
            className={inputClass}
            value={draft.supplierName}
            onChange={(event) => updateDraft({ supplierName: event.target.value })}
            placeholder="Example Supplier"
          />
        </Field>

        <Field label="Summary">
          <textarea
            className={inputClass}
            value={draft.summary}
            onChange={(event) => updateDraft({ summary: event.target.value })}
            placeholder="Short marketplace listing summary"
            rows={4}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Listing Type">
            <select
              className={inputClass}
              value={draft.listingType}
              onChange={(event) =>
                updateDraft({ listingType: event.target.value as MarketplaceListingType })
              }
            >
              <option value="rbp-product">RBP Product</option>
              <option value="rbp-asset">RBP Asset</option>
              <option value="third-party-product">Third Party Product</option>
              <option value="third-party-asset">Third Party Asset</option>
              <option value="service">Service</option>
              <option value="process">Process</option>
            </select>
          </Field>

          <Field label="Enquiry Required">
            <select
              className={inputClass}
              value={draft.enquiryRequired}
              onChange={(event) =>
                updateDraft({ enquiryRequired: event.target.value as MarketplaceDraft["enquiryRequired"] })
              }
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
        </div>

        <Field label="Price / Display Price">
          <input
            className={inputClass}
            value={draft.price}
            onChange={(event) => updateDraft({ price: event.target.value })}
            placeholder="Enquire"
          />
        </Field>

        <Field label="Public Link">
          <input
            className={inputClass}
            value={draft.href}
            onChange={(event) => updateDraft({ href: event.target.value })}
            placeholder="/marketplace#example"
          />
        </Field>

        <Field label="Status">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(event) => updateDraft({ status: event.target.value as ContentStatus })}
          >
            <option value="ready">Ready</option>
            <option value="placeholder">Placeholder</option>
            <option value="content-required">Content Required</option>
            <option value="backend-later">Backend Later</option>
          </select>
        </Field>
      </AdminFormShell>
    </section>
  );
}

function OfferMockCrud() {
  const {
    records,
    draft,
    editingRecord,
    canSave,
    updateDraft,
    resetForm,
    startEdit,
    saveRecord,
    deleteRecord,
  } = useAdminLocalCrud<PublicOffer, OfferDraft>({
    initialRecords: publicOffers,
    createDraft: createOfferDraft,
    toDraft: (record) => ({
      title: record.title,
      partner: record.partner,
      summary: record.summary,
      category: record.category,
      offerType: record.offerType,
      href: record.href,
      status: record.status,
    }),
    fromDraft: (currentDraft, existingRecord) => ({
      id: existingRecord?.id ?? createMockRecordId("offer", currentDraft.title),
      ...currentDraft,
      href: withFallbackHref(currentDraft.href, "/offers"),
    }),
    validateDraft: (currentDraft) =>
      hasRequiredTextFields(currentDraft.title, currentDraft.partner, currentDraft.summary),
  });

  const table = useMockTableControls(records);

  const columns: AdminTableColumn<PublicOffer>[] = [
    {
      key: "title",
      header: "Offer",
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.title}</div>
          <div className="text-xs text-slate-500 mt-1">{row.summary}</div>
        </div>
      ),
    },
    {
      key: "partner",
      header: "Partner",
      render: (row) => <span className="text-slate-600">{row.partner}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (row) => <AdminStatusBadge label={row.category} status="ready" />,
    },
    {
      key: "offerType",
      header: "Type",
      render: (row) => <AdminStatusBadge label={row.offerType} status={row.offerType} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <AdminStatusBadge label={row.status} status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => startEdit(row)}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
            title="Edit offer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteRecord(row.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-all"
            title="Delete offer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">Mock Offer Records</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and delete offer records in local component state.
          </p>
        </div>
        <AdminTableControls controls={table} />
        <AdminTable rows={table.rows as Array<{ id: string }>} columns={columns} />
      </div>

      <AdminFormShell
        title={editingRecord ? "Edit Offer" : "Create Offer"}
        description="Local mock form for partner offers, categories, and offer visibility. Redemption tracking and commercial approval come later."
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={saveRecord}
              disabled={!canSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-40 transition-all"
            >
              {editingRecord ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingRecord ? "Save Mock Edit" : "Add Mock Offer"}
            </button>
          </div>
        }
      >
        <MockNotice />

        <Field label="Title">
          <input
            className={inputClass}
            value={draft.title}
            onChange={(event) => updateDraft({ title: event.target.value })}
            placeholder="Example Offer Title"
          />
        </Field>

        <Field label="Partner">
          <input
            className={inputClass}
            value={draft.partner}
            onChange={(event) => updateDraft({ partner: event.target.value })}
            placeholder="Example Partner"
          />
        </Field>

        <Field label="Summary">
          <textarea
            className={inputClass}
            value={draft.summary}
            onChange={(event) => updateDraft({ summary: event.target.value })}
            placeholder="Short offer summary"
            rows={4}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Category">
            <select
              className={inputClass}
              value={draft.category}
              onChange={(event) => updateDraft({ category: event.target.value as OfferCategory })}
            >
              {offerCategoryFilters.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Offer Type">
            <select
              className={inputClass}
              value={draft.offerType}
              onChange={(event) =>
                updateDraft({ offerType: event.target.value as OfferDraft["offerType"] })
              }
            >
              <option value="exclusive">Exclusive</option>
              <option value="top">Top</option>
              <option value="standard">Standard</option>
            </select>
          </Field>
        </div>

        <Field label="Public Link">
          <input
            className={inputClass}
            value={draft.href}
            onChange={(event) => updateDraft({ href: event.target.value })}
            placeholder="/offers"
          />
        </Field>

        <Field label="Status">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(event) => updateDraft({ status: event.target.value as ContentStatus })}
          >
            <option value="ready">Ready</option>
            <option value="placeholder">Placeholder</option>
            <option value="content-required">Content Required</option>
            <option value="backend-later">Backend Later</option>
          </select>
        </Field>
      </AdminFormShell>
    </section>
  );
}

function ApplicationMockCrud() {
  const {
    records,
    draft,
    editingRecord,
    canSave,
    updateDraft,
    resetForm,
    startEdit,
    saveRecord,
    deleteRecord,
  } = useAdminLocalCrud<ApplicationCategory, ApplicationDraft>({
    initialRecords: applicationCategories,
    createDraft: createApplicationDraft,
    toDraft: (record) => ({
      title: record.title,
      summary: record.summary,
      href: record.href,
      status: record.status,
    }),
    fromDraft: (currentDraft, existingRecord) => ({
      id: existingRecord?.id ?? createMockRecordId("application", currentDraft.title),
      ...currentDraft,
      href: withFallbackHref(currentDraft.href, `/applications#${slugify(currentDraft.title)}`),
    }),
    validateDraft: (currentDraft) =>
      hasRequiredTextFields(currentDraft.title, currentDraft.summary),
  });

  const table = useMockTableControls(records);

  const columns: AdminTableColumn<ApplicationCategory>[] = [
    {
      key: "title",
      header: "Application Area",
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.title}</div>
          <div className="text-xs text-slate-500 mt-1">{row.summary}</div>
        </div>
      ),
    },
    {
      key: "href",
      header: "Public Link",
      render: (row) => <span className="text-slate-600">{row.href}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <AdminStatusBadge label={row.status} status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => startEdit(row)}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
            title="Edit application"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteRecord(row.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-all"
            title="Delete application"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">Mock Application Records</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and delete application catalogue records in local component state.
          </p>
        </div>
        <AdminTableControls controls={table} />
        <AdminTable rows={table.rows as Array<{ id: string }>} columns={columns} />
      </div>

      <AdminFormShell
        title={editingRecord ? "Edit Application" : "Create Application"}
        description="Local mock form for application catalogue areas."
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={saveRecord}
              disabled={!canSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-40 transition-all"
            >
              {editingRecord ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingRecord ? "Save Mock Edit" : "Add Mock Application"}
            </button>
          </div>
        }
      >
        <MockNotice />

        <Field label="Title">
          <input
            className={inputClass}
            value={draft.title}
            onChange={(event) => updateDraft({ title: event.target.value })}
            placeholder="Example Application Area"
          />
        </Field>

        <Field label="Summary">
          <textarea
            className={inputClass}
            value={draft.summary}
            onChange={(event) => updateDraft({ summary: event.target.value })}
            placeholder="Short application summary"
            rows={4}
          />
        </Field>

        <Field label="Public Link">
          <input
            className={inputClass}
            value={draft.href}
            onChange={(event) => updateDraft({ href: event.target.value })}
            placeholder="/applications#example"
          />
        </Field>

        <Field label="Status">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(event) => updateDraft({ status: event.target.value as ContentStatus })}
          >
            <option value="ready">Ready</option>
            <option value="placeholder">Placeholder</option>
            <option value="content-required">Content Required</option>
            <option value="backend-later">Backend Later</option>
          </select>
        </Field>
      </AdminFormShell>
    </section>
  );
}

function ServiceMockCrud() {
  const {
    records,
    draft,
    editingRecord,
    canSave,
    updateDraft,
    resetForm,
    startEdit,
    saveRecord,
    deleteRecord,
  } = useAdminLocalCrud<AdminServiceRecord, ServiceDraft>({
    initialRecords: createServiceRecords(),
    createDraft: createServiceDraft,
    toDraft: (record) => ({
      title: record.title,
      summary: record.summary,
      href: record.href,
      category: record.category,
      serviceType: record.serviceType,
      linkType: record.linkType,
      status: record.status,
    }),
    fromDraft: (currentDraft, existingRecord) => ({
      id: existingRecord?.id ?? createMockRecordId("service", currentDraft.title),
      ...currentDraft,
      href: withFallbackHref(currentDraft.href, "/on-demand"),
    }),
    validateDraft: (currentDraft) =>
      hasRequiredTextFields(currentDraft.title, currentDraft.summary),
  });

  const table = useMockTableControls(records);

  const columns: AdminTableColumn<AdminServiceRecord>[] = [
    {
      key: "title",
      header: "Service",
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.title}</div>
          <div className="text-xs text-slate-500 mt-1">{row.summary}</div>
        </div>
      ),
    },
    {
      key: "serviceType",
      header: "Type",
      render: (row) => <AdminStatusBadge label={row.serviceType} status="ready" />,
    },
    {
      key: "linkType",
      header: "Link",
      render: (row) => <span className="text-slate-600">{row.linkType}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <AdminStatusBadge label={row.status} status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => startEdit(row)}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
            title="Edit service"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteRecord(row.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-all"
            title="Delete service"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">Mock Service Records</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and delete on-demand and managed service records in local component state.
          </p>
        </div>
        <AdminTableControls controls={table} />
        <AdminTable rows={table.rows as Array<{ id: string }>} columns={columns} />
      </div>

      <AdminFormShell
        title={editingRecord ? "Edit Service" : "Create Service"}
        description="Local mock form for on-demand and managed service catalogue records."
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={saveRecord}
              disabled={!canSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-40 transition-all"
            >
              {editingRecord ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingRecord ? "Save Mock Edit" : "Add Mock Service"}
            </button>
          </div>
        }
      >
        <MockNotice />

        <Field label="Title">
          <input
            className={inputClass}
            value={draft.title}
            onChange={(event) => updateDraft({ title: event.target.value })}
            placeholder="Example Service"
          />
        </Field>

        <Field label="Summary">
          <textarea
            className={inputClass}
            value={draft.summary}
            onChange={(event) => updateDraft({ summary: event.target.value })}
            placeholder="Short service summary"
            rows={4}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Service Type">
            <select
              className={inputClass}
              value={draft.serviceType}
              onChange={(event) =>
                updateDraft({ serviceType: event.target.value as ServiceDraft["serviceType"] })
              }
            >
              <option value="on-demand">On-Demand</option>
              <option value="managed">Managed</option>
            </select>
          </Field>

          <Field label="Link Type">
            <select
              className={inputClass}
              value={draft.linkType}
              onChange={(event) =>
                updateDraft({ linkType: event.target.value as ServiceDraft["linkType"] })
              }
            >
              <option value="route">Route</option>
              <option value="anchor">Anchor</option>
            </select>
          </Field>
        </div>

        <Field label="Category">
          <input
            className={inputClass}
            value={draft.category}
            onChange={(event) => updateDraft({ category: event.target.value })}
            placeholder="operations"
          />
        </Field>

        <Field label="Public Link">
          <input
            className={inputClass}
            value={draft.href}
            onChange={(event) => updateDraft({ href: event.target.value })}
            placeholder="/on-demand/example"
          />
        </Field>

        <Field label="Status">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(event) => updateDraft({ status: event.target.value as ContentStatus })}
          >
            <option value="ready">Ready</option>
            <option value="placeholder">Placeholder</option>
            <option value="content-required">Content Required</option>
            <option value="backend-later">Backend Later</option>
          </select>
        </Field>
      </AdminFormShell>
    </section>
  );
}

export function AdminMockCrudWorkspace() {
  const location = useLocation();

  if (location.pathname.startsWith("/admin/resources")) {
    return <ResourceMockCrud />;
  }

  if (location.pathname.startsWith("/admin/offers")) {
    return <OfferMockCrud />;
  }

  if (location.pathname.startsWith("/admin/marketplace")) {
    return <MarketplaceMockCrud />;
  }

  if (location.pathname.startsWith("/admin/membership")) {
    return <MembershipMockCrud />;
  }

  if (
    location.pathname.startsWith("/admin/site-content/legal") ||
    location.pathname.startsWith("/admin/legal")
  ) {
    return <LegalPagesMockCrud />;
  }

  if (location.pathname.startsWith("/admin/help-center")) {
    return <HelpCenterMockCrud />;
  }

  if (location.pathname.startsWith("/admin/applications")) {
    return <ApplicationMockCrud />;
  }

  if (
    location.pathname.startsWith("/admin/services") ||
    location.pathname.startsWith("/admin/on-demand") ||
    location.pathname.startsWith("/admin/managed-services")
  ) {
    return <ServiceMockCrud />;
  }

  return (
    <AdminFormShell
      title="Local Mock CRUD"
      description="This route is not enabled for local mock CRUD yet."
    >
      <AdminEmptyState
        icon={HelpCircle}
        title="Mock CRUD not enabled for this section"
        description="Resources, Help Center, Applications, Operations, Services, Offers, Marketplace, Membership, and Legal Pages are enabled for local mock CRUD. Backend persistence comes later, because chaos deserves a queue."
      />
    </AdminFormShell>
  );
}
