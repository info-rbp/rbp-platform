import test from "node:test";
import assert from "node:assert/strict";

import { parseEnvExample } from "../helpers/env-files.mjs";

const rootEnv = parseEnvExample(".env.example");
const localEnv = parseEnvExample(".env.local.example");
const productionEnv = parseEnvExample(".env.production.example");
const frontendEnv = parseEnvExample("frontend/portal/.env.example");

for (const [label, env] of Object.entries({ rootEnv, localEnv, productionEnv, frontendEnv })) {
  test(`${label} defaults backend provider to appwrite`, () => {
    assert.equal(env.VITE_BACKEND_PROVIDER, "appwrite");
  });

  test(`${label} disables mock fallback by default`, () => {
    if ("VITE_ENABLE_MOCK_FALLBACK" in env) {
      assert.equal(env.VITE_ENABLE_MOCK_FALLBACK, "false");
    }
  });

  test(`${label} keeps application provisioning disabled`, () => {
    if ("VITE_ENABLE_APPLICATION_PROVISIONING" in env) {
      assert.equal(env.VITE_ENABLE_APPLICATION_PROVISIONING, "false");
    }
  });

  test(`${label} keeps application interest enabled when defined`, () => {
    if ("VITE_ENABLE_APPLICATION_INTEREST" in env) {
      assert.equal(env.VITE_ENABLE_APPLICATION_INTEREST, "true");
    }
  });

  test(`${label} does not allow a frappe provider route`, () => {
    assert.notEqual(env.VITE_BACKEND_PROVIDER, "frappe");
    const serialized = JSON.stringify(env).toLowerCase();
    assert.equal(serialized.includes("frappe"), false);
  });
}