import assert from "node:assert/strict";
import test from "node:test";
import Stripe from "stripe";

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

function memoryAdmin(seed: Partial<Store> = {}) {
  const store: Store = {
    [collectionIds.userProfiles]: [],
    [collectionIds.subscriptions]: [],
    [collectionIds.paymentEvents]: [],
    [collectionIds.tenantEntitlements]: [],
    [collectionIds.planEntitlements]: [
      { $id: "plan_1", plan_code: "paid", entitlement_key: "membership", enabled: true },
    ],
    [collectionIds.notifications]: [],
    [collectionIds.notificationDeliveries]: [],
    [collectionIds.auditEvents]: [],
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
    teams: { async listMemberships() { return { memberships: [] }; } },
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
      if (existing) return { operation: "updated" as const, document: await this.updateDocument(collectionId, existing.$id, data) };
      return { operation: "created" as const, document: await this.createDocument(collectionId, data) };
    },
  };
  return { admin, store };
}

function signedEvent(id: string, type: string, object: Record<string, unknown>) {
  const event = {
    id,
    object: "event",
    api_version: "2025-02-24.acacia",
    created: 123,
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    type,
    data: { object },
  };
  const payload = JSON.stringify(event);
  return {
    payload,
    signature: Stripe.webhooks.generateTestHeaderString({
      payload,
      secret: process.env.STRIPE_WEBHOOK_SECRET || "whsec_test",
    }),
  };
}

async function runWebhook(id: string, type: string) {
  const { payload, signature } = signedEvent(id, type, {
    id: type === "customer.subscription.deleted" ? "sub_test" : `${type}_object`,
    object: type === "customer.subscription.deleted" ? "subscription" : "checkout.session",
    subscription: "sub_test",
    metadata: { tenant_id: "tenant_1", plan_code: "paid" },
  });
  return runNamedHandler("stripe-webhook", {
    req: { headers: { "stripe-signature": signature }, body: payload },
  });
}

test.afterEach(() => {
  setAdminContextFactoryForTests(null);
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_WEBHOOK_SECRET;
  delete process.env.QA_EMAIL_ALLOWLIST;
});

test("stripe webhook fixtures activate, suspend, revoke, and replay idempotently", async () => {
  const { admin, store } = memoryAdmin({
    [collectionIds.subscriptions]: [
      { $id: "subscription_1", tenant_id: "tenant_1", plan_code: "free", status: "pending", stripe_subscription_id: "sub_test" },
    ],
  });
  setAdminContextFactoryForTests(() => admin as never);
  process.env.STRIPE_SECRET_KEY = "sk_test_fixture";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

  const success = await runWebhook("evt_success", "checkout.session.completed");
  assert.equal(success.statusCode, 200);
  assert.equal(store[collectionIds.subscriptions][0].status, "active");
  assert.equal(store[collectionIds.tenantEntitlements][0].enabled, true);

  const failure = await runWebhook("evt_failure", "invoice.payment_failed");
  assert.equal(failure.statusCode, 200);
  assert.equal(store[collectionIds.subscriptions][0].status, "suspended");
  assert.equal(store[collectionIds.tenantEntitlements][0].enabled, false);

  const deletion = await runWebhook("evt_deleted", "customer.subscription.deleted");
  assert.equal(deletion.statusCode, 200);
  assert.equal(store[collectionIds.subscriptions][0].status, "revoked");

  const beforeReplayEvents = store[collectionIds.paymentEvents].length;
  const replay = await runWebhook("evt_success", "checkout.session.completed");
  assert.equal(replay.statusCode, 200);
  assert.equal(store[collectionIds.paymentEvents].length, beforeReplayEvents);
});

test("email notification delivery records allowlisted and blocked recipients safely", async () => {
  const { admin, store } = memoryAdmin();
  setAdminContextFactoryForTests(() => admin as never);
  process.env.QA_EMAIL_ALLOWLIST = "allowed@example.com";

  const allowed = await runNamedHandler("send-notification", {
    req: {
      body: JSON.stringify({
        title: "Allowed",
        message: "Allowed recipient",
        recipient: "allowed@example.com",
        channel: "email",
      }),
    },
  });
  assert.equal(allowed.statusCode, 200);
  assert.equal(store[collectionIds.notificationDeliveries][0].status, "pending");
  assert.equal(store[collectionIds.notificationDeliveries][0].attempt_count, 1);
  assert.match(String(store[collectionIds.notificationDeliveries][0].provider_message_id), /^fake-/);

  const blocked = await runNamedHandler("send-notification", {
    req: {
      body: JSON.stringify({
        title: "Blocked",
        message: "Blocked recipient",
        recipient: "blocked@example.com",
        channel: "email",
      }),
    },
  });
  assert.equal(blocked.statusCode, 200);
  assert.equal(store[collectionIds.notificationDeliveries][1].status, "skipped");
  assert.match(String(store[collectionIds.notificationDeliveries][1].error_message), /allowlist/i);
});
