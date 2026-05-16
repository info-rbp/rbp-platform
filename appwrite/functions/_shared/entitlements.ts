import { Query } from "node-appwrite";
import { collectionIds, createAdminContext } from "./appwriteAdmin";

export const entitlementKeys = [
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

export type EntitlementStatus = "active" | "suspended" | "revoked";

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
