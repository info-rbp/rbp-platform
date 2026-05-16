import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const checks = ["auth", "billing", "stripe-webhook", "service-requests", "admin", "permissions"];

for (const check of checks) {
  test(`smoke script ${check} fails clearly when env is missing`, () => {
    const result = spawnSync(process.execPath, ["scripts/smoke/run-smoke-check.mjs", check], {
      env: { PATH: process.env.PATH },
      encoding: "utf8",
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, new RegExp(`Smoke check \\\"${check}\\\" blocked: missing required environment variables`));
  });
}

test("application-interest smoke boundary remains explicit", () => {
  const result = spawnSync(process.execPath, ["scripts/smoke/run-smoke-check.mjs", "service-requests"], {
    env: { PATH: process.env.PATH },
    encoding: "utf8",
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /missing required environment variables/);
});