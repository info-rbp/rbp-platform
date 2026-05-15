import assert from "node:assert/strict";
import test from "node:test";

import { runNamedHandler } from "../../appwrite/functions/_shared/runtime";

test("unknown handlers are rejected clearly", async () => {
  const response = await runNamedHandler("missing-handler", {});
  assert.equal(response.statusCode, 404);
});

test("invalid JSON payloads fail clearly", async () => {
  const response = await runNamedHandler("bootstrap-tenant", { req: { body: "{" } });
  assert.equal(response.statusCode >= 400, true);
});

test("missing runtime configuration surfaces actionable errors", async () => {
  delete process.env.APPWRITE_ENDPOINT;
  delete process.env.APPWRITE_PROJECT_ID;
  delete process.env.APPWRITE_API_KEY;
  delete process.env.APPWRITE_DATABASE_ID;

  const response = await runNamedHandler("bootstrap-tenant", {
    req: { body: JSON.stringify({ accountId: "user_1", email: "qa@example.com", name: "QA User" }) },
  });

  assert.equal(response.statusCode, 500);
  assert.match(response.body, /APPWRITE_ENDPOINT|APPWRITE_PROJECT_ID|APPWRITE_API_KEY|APPWRITE_DATABASE_ID/);
});
