import {
  publicResources,
  type PublicResource,
  type ResourceType,
} from "../data/resources";
import {
  helpArticles,
  type HelpArticle,
  type HelpSectionId,
} from "../data/helpCenter";

type PublicResourceStatus = PublicResource["status"];
type HelpArticleStatus = HelpArticle["status"];

export const isFirebaseConfigured = false;

function normaliseResourceType(value: unknown): ResourceType {
  const allowed: ResourceType[] = ["articles", "guides", "tools", "downloads", "educational"];
  return allowed.includes(value as ResourceType) ? (value as ResourceType) : "articles";
}

function normaliseResourceStatus(value: unknown): PublicResourceStatus {
  const allowed: PublicResourceStatus[] = [
    "ready",
    "placeholder",
    "content-required",
    "backend-later",
  ];

  if (value === "published") {
    return "ready";
  }

  return allowed.includes(value as PublicResourceStatus)
    ? (value as PublicResourceStatus)
    : "ready";
}

function normaliseHelpSection(value: unknown): HelpSectionId {
  const allowed: HelpSectionId[] = ["faqs", "knowledge-base", "troubleshooting", "support"];
  return allowed.includes(value as HelpSectionId) ? (value as HelpSectionId) : "faqs";
}

function normaliseHelpStatus(value: unknown): HelpArticleStatus {
  const allowed: HelpArticleStatus[] = [
    "ready",
    "placeholder",
    "content-required",
    "backend-later",
  ];

  if (value === "published") {
    return "ready";
  }

  return allowed.includes(value as HelpArticleStatus)
    ? (value as HelpArticleStatus)
    : "ready";
}

function sortBySortOrderThenTitle<T extends { title?: string; question?: string }>(
  records: Array<T & { sortOrder?: number }>
) {
  return [...records].sort((a, b) => {
    const sortA = typeof a.sortOrder === "number" ? a.sortOrder : 0;
    const sortB = typeof b.sortOrder === "number" ? b.sortOrder : 0;

    if (sortA !== sortB) {
      return sortA - sortB;
    }

    const labelA = a.title ?? a.question ?? "";
    const labelB = b.title ?? b.question ?? "";

    return labelA.localeCompare(labelB);
  });
}

export async function listResourceRecords(_options?: { publicOnly?: boolean }) {
  return sortBySortOrderThenTitle(
    publicResources.map((resource, index) => ({
      ...resource,
      type: normaliseResourceType(resource.type),
      status: normaliseResourceStatus(resource.status),
      sortOrder: index + 1,
    }))
  );
}

export async function listHelpArticleRecords(_options?: { publicOnly?: boolean }) {
  return sortBySortOrderThenTitle(
    helpArticles.map((article, index) => ({
      ...article,
      section: normaliseHelpSection(article.section),
      status: normaliseHelpStatus(article.status),
      sortOrder: index + 1,
    }))
  );
}

export async function saveResourceRecord(record: PublicResource) {
  return record;
}

export async function saveHelpArticleRecord(record: HelpArticle) {
  return record;
}

export async function archiveResourceRecord(_id: string) {
  return;
}

export async function archiveHelpArticleRecord(_id: string) {
  return;
}

export async function seedStaticResourcesToFirestore() {
  return {
    enabled: false,
    count: 0,
  };
}

export async function seedStaticHelpArticlesToFirestore() {
  return {
    enabled: false,
    count: 0,
  };
}
