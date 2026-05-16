import assert from "node:assert/strict";
import test from "node:test";

import { createAuditEvent, sanitizeAuditPayload } from "../../appwrite/functions/_shared/audit";
import { buildIdempotencyKey, getStripeConfig, mapStripeEventToStatus } from "../../appwrite/functions/_shared/stripe";
import { buildIdempotencyKey, getStripeConfig, isCheckoutAbandonmentEvent, mapStripeEventToStatus } from "../../appwrite/functions/_shared/stripe";
import { fail, ok, parseJsonBody } from "../../appwrite/functions/_shared/response";

test("response helpers return consistent envelopes", () => {
  const success = ok({ hello: "world" }, "done", 201);
  const failure = fail("nope", 422, [{ field: "email" }]);

  assert.equal(success.statusCode, 201);
  assert.deepEqual(JSON.parse(success.body), { ok: true, message: "done", data: { hello: "world" } });
  assert.equal(failure.statusCode, 422);
  assert.equal(JSON.parse(failure.body).ok, false);
});

test("parseJsonBody accepts strings and objects", () => {
  assert.deepEqual(parseJsonBody({ req: { body: "{\"planCode\":\"free\"}" } }), { planCode: "free" });
  assert.deepEqual(parseJsonBody({ req: { body: { planCode: "free" } } }), { planCode: "free" });
});

test("audit sanitization redacts secret-like keys across common naming styles", () => {
  const payload = sanitizeAuditPayload({
    password: "secret",
    apiKey: "abc",
    apikey: "def",
    api_key: "ghi",
    clientSecret: "jkl",
    nested: { authorization_token: "123", safe: true },
  }) as Record<string, unknown>;

  assert.equal(payload.password, "[redacted]");
  assert.equal(payload.apiKey, "[redacted]");
  assert.equal(payload.apikey, "[redacted]");
  assert.equal(payload.api_key, "[redacted]");
  assert.equal(payload.clientSecret, "[redacted]");
  assert.deepEqual(payload.nested, { authorization_token: "[redacted]", safe: true });
});

test("audit events preserve event names and sanitize payloads", () => {
  const event = createAuditEvent("stripe_webhook", { webhookSecret: "abc", state: "processed" });
  assert.equal(event.event_name, "stripe_webhook");
  assert.equal((event.payload as Record<string, unknown>).webhookSecret, "[redacted]");
});

test("stripe helpers expose deterministic idempotency and event mapping", () => {
  assert.equal(buildIdempotencyKey("evt_123"), "stripe:evt_123");
  assert.equal(mapStripeEventToStatus("checkout.session.completed"), "active");
  assert.equal(mapStripeEventToStatus("invoice.payment_failed"), "suspended");
  assert.equal(mapStripeEventToStatus("checkout.session.expired"), "revoked");
  assert.equal(mapStripeEventToStatus("unknown.event"), "pending");
  assert.equal(mapStripeEventToStatus("checkout.session.expired"), "expired");
  assert.equal(mapStripeEventToStatus("unknown.event"), "pending");
  assert.equal(isCheckoutAbandonmentEvent("checkout.session.expired"), true);
  assert.equal(isCheckoutAbandonmentEvent("customer.subscription.deleted"), false);
});

test("stripe config reads environment-driven values", () => {
  process.env.STRIPE_DEFAULT_CURRENCY = "USD";
  const config = getStripeConfig();
  assert.equal(config.defaultCurrency, "USD");
});
