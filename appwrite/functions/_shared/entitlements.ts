import { Query } from "node-appwrite";
import { collectionIds, createAdminContext } from "./appwriteAdmin";

export const businessEntitlementKeys = [
  "portal_access",
  "profile_management",
  "application_interest",
  "application_setup_request",
  "customer_application_provisioning",
  "service_requests_advertised_price",
  "service_requests_discounted_price",
  "on_demand_services_advertised_price",
  "on_demand_services_discounted_price",
  "managed_services_advertised_price",
  "managed_services_discounted_price",
  "document_nucleus_pay_per_use",
  "document_nucleus_unlimited",
  "marketplace_listing_standard_fee",
  "marketplace_listing_discounted_fee",
  "basic_notifications",
  "premium_notifications",
  "email_support_48h",
  "premium_support",
  "billing_management",
  "stripe_subscription_checkout",
  "pay_per_use_checkout",
] as const;

export const legacyEntitlementKeys = [
  "membership",
  "portal",
  "billing",
  "notifications",
  "offers",
  "resources",
  "documents",
  "decision_desk",
  "docushare",
  "marketplace",
  "connectivity",
  "risk_advisor",
  "fixer",
  "applications_interest",
  "applications_provisioning",
] as const;

export const entitlementKeys = [...businessEntitlementKeys, ...legacyEntitlementKeys] as const;

export type EntitlementKey = typeof entitlementKeys[number];

export type EntitlementStatus = "active" | "suspended" | "revoked";

export function isKnownEntitlementKey(value: string): value is EntitlementKey {
  return (entitlementKeys as readonly string[]).includes(value);
}

export async function resolvePlanEntitlements(planCode: string) {
  const admin = createAdminContext();
  const listed = await admin.listDocuments<Record<string, unknown>>(
    collectionIds.planEntitlements,
    [Query.equal("plan_code", [planCode])],
  );
  return listed.documents.map((document) => ({
    entitlement_key: String(document.entitlement_key),
    enabled: document.enabled !== false,
  }));
}

export async function grantTenantEntitlements(tenantId: string, planCode: string) {
  const admin = createAdminContext();
  const entitlements = await resolvePlanEntitlements(planCode);

  for (const entitlement of entitlements) {
    if (!entitlement.enabled) continue;
    await admin.upsertByQuery(
      collectionIds.tenantEntitlements,
      [
        Query.equal("tenant_id", [tenantId]),
        Query.equal("entitlement_key", [entitlement.entitlement_key]),
      ],
      {
        tenant_id: tenantId,
        entitlement_key: entitlement.entitlement_key,
        enabled: true,
      },
    );
  }

  return entitlements;
}

export async function revokeTenantEntitlements(tenantId: string, keys?: string[]) {
  const admin = createAdminContext();
  const listed = await admin.listDocuments<Record<string, unknown> & { $id: string }>(
    collectionIds.tenantEntitlements,
    [Query.equal("tenant_id", [tenantId])],
  );

  for (const document of listed.documents) {
    const key = String(document.entitlement_key || "");
    if (keys && !keys.includes(key)) continue;
    await admin.updateDocument(collectionIds.tenantEntitlements, String(document.$id), {
      tenant_id: tenantId,
      entitlement_key: key,
      enabled: false,
    });
  }
}

export async function listTenantEntitlements(tenantId: string) {
  const admin = createAdminContext();
  const listed = await admin.listDocuments<Record<string, unknown>>(
    collectionIds.tenantEntitlements,
    [Query.equal("tenant_id", [tenantId])],
  );
  return listed.documents.map((document) => ({
    entitlement_key: String(document.entitlement_key || ""),
    status: document.enabled === false ? "revoked" : "active",
  })) as Array<{ entitlement_key: string; status: EntitlementStatus }>;
}

export async function hasEntitlement(tenantId: string, entitlementKey: string) {
  const listed = await listTenantEntitlements(tenantId);
  return listed.some((document) => document.entitlement_key === entitlementKey && document.status === "active");
}
