export type AdminKnownStatus =
  | "ready"
  | "placeholder"
  | "content-required"
  | "backend-later"
  | "legal-review-required"
  | "draft"
  | "review"
  | "approved"
  | "published"
  | "archived"
  | "active"
  | "inactive"
  | "public"
  | "members"
  | "admin"
  | "hidden"
  | string;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createMockRecordId(prefix: string, label: string) {
  return slugify(label) || `${prefix}-${Date.now()}`;
}

export function hasRequiredTextFields(...values: Array<string | null | undefined>) {
  return values.every((value) => Boolean(value?.trim()));
}

export function withFallbackHref(value: string | null | undefined, fallback: string) {
  return value?.trim() ? value : fallback;
}

export function formatAdminLabel(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getAdminRouteSection(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] !== "admin") {
    return "public";
  }

  return parts[1] ?? "dashboard";
}

export function isLegalReviewStatus(status: AdminKnownStatus) {
  return String(status).includes("legal-review");
}

export function isBackendLaterStatus(status: AdminKnownStatus) {
  return String(status).includes("backend");
}

export function isReadyStatus(status: AdminKnownStatus) {
  return String(status).includes("ready") || String(status).includes("published") || String(status).includes("active");
}
