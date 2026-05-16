import assert from "node:assert/strict";
import test from "node:test";

import { collectionIds, setAdminContextFactoryForTests } from "../../appwrite/functions/_shared/appwriteAdmin";
import { runNamedHandler } from "../../appwrite/functions/_shared/runtime";

type Document = Record<string, unknown> & { $id: string };
type Store = Record<string, Document[]>;

function parseQuery(query: string) {
  try {
    return JSON.parse(query) as { method?: string; attribute?: string; values?: unknown[] };
  } catch {
    return {};
  }
}

function createMemoryAdmin(seed: Partial<Store> = {}, adminUserIds: string[] = []) {
  const store: Store = {
    [collectionIds.tenants]: [],
    [collectionIds.businessProfiles]: [],
    [collectionIds.userProfiles]: [],
    [collectionIds.teamMemberships]: [],
    [collectionIds.membershipPlans]: [],
    [collectionIds.planEntitlements]: [],
    [collectionIds.subscriptions]: [],
    [collectionIds.tenantEntitlements]: [],
    [collectionIds.paymentEvents]: [],
    [collectionIds.auditEvents]: [],
    [collectionIds.notifications]: [],
    [collectionIds.notificationDeliveries]: [],
    [collectionIds.serviceRequests]: [],
    [collectionIds.applications]: [],
    [collectionIds.applicationInterest]: [],
    ...seed,
  };

  let sequence = 0;
  const ensure = (collectionId: string) => {
    store[collectionId] ||= [];
    return store[collectionId];
  };
  const matches = (document: Document, queries: string[]) => queries.every((query) => {
    const parsed = parseQuery(query);
    if (parsed.method !== "equal" || !parsed.attribute) return true;
    return (parsed.values || []).map(String).includes(String(document[parsed.attribute]));
  });

  const admin = {
    teams: {
      async listMemberships() {
        return {
          memberships: adminUserIds.map((userId) => ({ userId })),
        };
      },
    },
    async listDocuments(collectionId: string, queries: string[] = []) {
      return { documents: ensure(collectionId).filter((document) => matches(document, queries)) };
    },
    async getDocument(collectionId: string, documentId: string) {
      const document = ensure(collectionId).find((entry) => entry.$id === documentId);
      if (!document) throw new Error(`Missing ${collectionId}:${documentId}`);
      return document;
    },
    async createDocument(collectionId: string, data: Record<string, unknown>) {
      const document = { $id: `${collectionId}_${++sequence}`, ...data };
      ensure(collectionId).push(document);
      return document;
    },
    async updateDocument(collectionId: string, documentId: string, data: Record<string, unknown>) {
      const documents = ensure(collectionId);
      const index = documents.findIndex((entry) => entry.$id === documentId);
      if (index === -1) throw new Error(`Missing ${collectionId}:${documentId}`);
      documents[index] = { $id: documentId, ...data };
      return documents[index];
    },
    async findOne(collectionId: string, queries: string[]) {
      return (await this.listDocuments(collectionId, queries)).documents[0] || null;
    },
    async upsertByQuery(collectionId: string, queries: string[], data: Record<string, unknown>) {
      const existing = await this.findOne(collectionId, queries);
      if (existing) {
        return { operation: "updated" as const, document: await this.updateDocument(collectionId, existing.$id, data) };
      }

      return { operation: "created" as const, document: await this.createDocument(collectionId, data) };
    },
  };

  return { admin, store };
}

function parseBody(response: { body: string }) {
  return JSON.parse(response.body) as Record<string, unknown>;
}

test.afterEach(() => {
  setAdminContextFactoryForTests(null);
  delete process.env.APPWRITE_ADMIN_TEAM_ID;
  delete process.env.APPWRITE_TRUSTED_FUNCTION_TOKEN;
  delete process.env.RBP_INTERNAL_FUNCTION_TOKEN;
});

test("public tenant bootstrap ignores client admin role", async () => {
  const { admin, store } = createMemoryAdmin();
  setAdminContextFactoryForTests(() => admin as never);

  const response = await runNamedHandler("bootstrap-tenant", {
    req: {
      headers: { "x-appwrite-user-id": "user_public" },
      body: JSON.stringify({
        email: "owner@example.com",
        name: "Owner",
        businessName: "Acme",
        role: "admin",
      }),
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(store[collectionIds.userProfiles][0].role, "owner");
  assert.equal(store[collectionIds.teamMemberships][0].team_role, "owner");
});

test("payload role cannot grant admin access", async () => {
  const { admin } = createMemoryAdmin({
    [collectionIds.userProfiles]: [
      { $id: "profile_1", tenant_id: "tenant_1", appwrite_user_id: "user_admin_payload", email: "u@example.com", role: "admin" },
    ],
  });
  process.env.APPWRITE_ADMIN_TEAM_ID = "admins";
  setAdminContextFactoryForTests(() => admin as never);

  const response = await runNamedHandler("admin-operations", {
    req: {
      headers: { "x-appwrite-user-id": "user_admin_payload" },
      body: JSON.stringify({ action: "list_tenants" }),
    },
  });

  assert.equal(response.statusCode, 403);
});

test("duplicate business names create distinct tenants for unrelated users", async () => {
  const { admin, store } = createMemoryAdmin();
  setAdminContextFactoryForTests(() => admin as never);

  for (const userId of ["user_one", "user_two"]) {
    const response = await runNamedHandler("bootstrap-tenant", {
      req: {
        headers: { "x-appwrite-user-id": userId },
        body: JSON.stringify({ email: `${userId}@example.com`, name: userId, businessName: "Shared Co" }),
      },
    });
    assert.equal(response.statusCode, 200);
  }

  assert.equal(store[collectionIds.tenants].length, 2);
  assert.notEqual(store[collectionIds.userProfiles][0].tenant_id, store[collectionIds.userProfiles][1].tenant_id);
});

test("admin operations require Appwrite admin team membership or trusted internal invocation", async () => {
  const { admin } = createMemoryAdmin({
    [collectionIds.userProfiles]: [
      { $id: "profile_1", tenant_id: "tenant_1", appwrite_user_id: "member_user", email: "m@example.com", role: "owner" },
      { $id: "profile_2", tenant_id: "tenant_1", appwrite_user_id: "team_admin", email: "a@example.com", role: "member" },
    ],
  }, ["team_admin"]);
  process.env.APPWRITE_ADMIN_TEAM_ID = "admins";
  process.env.RBP_INTERNAL_FUNCTION_TOKEN = "trusted-token";
  setAdminContextFactoryForTests(() => admin as never);

  const denied = await runNamedHandler("admin-operations", {
    req: { headers: { "x-appwrite-user-id": "member_user" }, body: JSON.stringify({ action: "list_tenants" }) },
  });
  assert.equal(denied.statusCode, 403);

  const allowedByTeam = await runNamedHandler("admin-operations", {
    req: { headers: { "x-appwrite-user-id": "team_admin" }, body: JSON.stringify({ action: "list_tenants" }) },
  });
  assert.equal(allowedByTeam.statusCode, 200);

  const allowedByToken = await runNamedHandler("admin-operations", {
    req: { headers: { "x-rbp-internal-token": "trusted-token" }, body: JSON.stringify({ action: "list_tenants" }) },
  });
  assert.equal(allowedByToken.statusCode, 200);
});

test("customer notification actions are scoped to user and tenant", async () => {
  const { admin, store } = createMemoryAdmin({
    [collectionIds.userProfiles]: [
      { $id: "profile_1", tenant_id: "tenant_1", appwrite_user_id: "user_1", email: "one@example.com", role: "owner" },
      { $id: "profile_2", tenant_id: "tenant_2", appwrite_user_id: "user_2", email: "two@example.com", role: "owner" },
      { $id: "profile_3", tenant_id: "tenant_admin", appwrite_user_id: "admin_user", email: "admin@example.com", role: "member" },
    ],
    [collectionIds.notifications]: [
      { $id: "notif_1", tenant_id: "tenant_1", user_id: "user_1", title: "Mine", message: "m", status: "sent", channel: "in_app" },
      { $id: "notif_2", tenant_id: "tenant_2", user_id: "user_2", title: "Other", message: "o", status: "sent", channel: "in_app" },
      { $id: "notif_3", tenant_id: "tenant_1", user_id: "", title: "Tenant", message: "t", status: "sent", channel: "in_app" },
    ],
    [collectionIds.notificationDeliveries]: [
      { $id: "delivery_1", notification_id: "notif_1", delivery_type: "email", status: "sent", recipient: "one@example.com" },
    ],
  }, ["admin_user"]);
  process.env.APPWRITE_ADMIN_TEAM_ID = "admins";
  setAdminContextFactoryForTests(() => admin as never);

  const listed = await runNamedHandler("admin-operations", {
    req: { headers: { "x-appwrite-user-id": "user_1" }, body: JSON.stringify({ action: "list_my_notifications" }) },
  });
  assert.equal(listed.statusCode, 200);
  assert.deepEqual((parseBody(listed).data as { items: Document[] }).items.map((item) => item.$id).sort(), ["notif_1", "notif_3"]);

  const blocked = await runNamedHandler("admin-operations", {
    req: {
      headers: { "x-appwrite-user-id": "user_1" },
      body: JSON.stringify({ action: "mark_notification_read", payload: { notificationId: "notif_2" } }),
    },
  });
  assert.equal(blocked.statusCode, 403);

  const marked = await runNamedHandler("admin-operations", {
    req: {
      headers: { "x-appwrite-user-id": "user_1" },
      body: JSON.stringify({ action: "mark_notification_read", payload: { notificationId: "notif_1" } }),
    },
  });
  assert.equal(marked.statusCode, 200);
  assert.equal(store[collectionIds.notifications].find((entry) => entry.$id === "notif_1")?.status, "read");

  const deliveryLogs = await runNamedHandler("admin-operations", {
    req: { headers: { "x-appwrite-user-id": "user_1" }, body: JSON.stringify({ action: "list_notification_deliveries" }) },
  });
  assert.equal(deliveryLogs.statusCode, 403);

  const adminListed = await runNamedHandler("admin-operations", {
    req: { headers: { "x-appwrite-user-id": "admin_user" }, body: JSON.stringify({ action: "list_notifications" }) },
  });
  assert.equal(adminListed.statusCode, 200);
});
