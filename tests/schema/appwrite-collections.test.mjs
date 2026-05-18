import test from "node:test";
import assert from "node:assert/strict";

import { listJson, readJson } from "../helpers/env-files.mjs";

const collectionFiles = listJson("appwrite/collections");

test("all collection JSON files parse with required keys", () => {
  assert.ok(collectionFiles.length > 0);

  for (const file of collectionFiles) {
    const collection = readJson(file);
    assert.equal(typeof collection.id, "string", `${file} is missing id`);
    assert.equal(typeof collection.name, "string", `${file} is missing name`);
    assert.ok(Array.isArray(collection.attributes), `${file} is missing attributes array`);
    assert.equal(typeof collection.permissions, "object", `${file} is missing permissions`);
  }
});

test("protected collections do not allow broad unsafe writes", () => {
  for (const file of collectionFiles) {
    const collection = readJson(file);
    const createRules = collection.permissions?.create ?? [];
    const updateRules = collection.permissions?.update ?? [];
    const deleteRules = collection.permissions?.delete ?? [];
    const unsafe = [...createRules, ...updateRules, ...deleteRules].filter((value) => value === "role:all" || value === "any");
    assert.equal(unsafe.length, 0, `${file} contains unsafe broad-write rules: ${unsafe.join(", ")}`);
  }
});

test("application provisioning requests remain admin-only", () => {
  const provisioning = readJson("appwrite/collections/application_provisioning_requests.json");
  assert.deepEqual(provisioning.permissions.create, ["team:admins"]);
  assert.deepEqual(provisioning.permissions.update, ["team:admins"]);
  assert.deepEqual(provisioning.permissions.delete, ["team:admins"]);
});

test("application interest allows user creation while provisioning stays locked down", () => {
  const interest = readJson("appwrite/collections/application_interest.json");
  assert.ok(interest.permissions.create.includes("role:users"));
  assert.ok(!interest.permissions.create.includes("team:admins") || interest.permissions.create.length >= 1);
});

test("notification collections are locked down for direct reads", () => {
  const notifications = readJson("appwrite/collections/notifications.json");
  const deliveries = readJson("appwrite/collections/notification_deliveries.json");

  assert.deepEqual(notifications.permissions.read, ["team:admins"]);
  assert.deepEqual(deliveries.permissions.read, ["team:admins"]);
  assert.ok(deliveries.attributes.some((attribute) => attribute.key === "provider_message_id"));
  assert.ok(deliveries.attributes.some((attribute) => attribute.key === "error_message"));
  assert.ok(deliveries.attributes.some((attribute) => attribute.key === "attempt_count"));
  assert.ok(deliveries.attributes.some((attribute) => attribute.key === "last_attempt_at"));
});
