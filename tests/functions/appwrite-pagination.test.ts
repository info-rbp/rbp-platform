import assert from "node:assert/strict";
import test from "node:test";

import { collectPaginatedItems } from "../../scripts/appwrite/_lib";
import { comparePermissions } from "../../scripts/appwrite/permissions";

test("collectPaginatedItems continues past the default Appwrite page limit", async () => {
  const calls: Array<{ limit: number; offset: number }> = [];
  const items = await collectPaginatedItems<{ id: string }>(
    async (limit, offset) => {
      calls.push({ limit, offset });
      if (offset === 0) {
        return {
          total: 28,
          collections: Array.from({ length: 25 }, (_, index) => ({ id: `collection-${index + 1}` })),
        };
      }

      return {
        total: 28,
        collections: Array.from({ length: 3 }, (_, index) => ({ id: `collection-${offset + index + 1}` })),
      };
    },
    "collections",
    25,
  );

  assert.equal(items.length, 28);
  assert.deepEqual(calls, [
    { limit: 25, offset: 0 },
    { limit: 25, offset: 25 },
  ]);
});

test("comparePermissions normalizes repo and live permission aliases before diffing", () => {
  const comparison = comparePermissions(
    {
      read: ["role:all"],
      update: ["team:admins"],
    },
    [
      'read("any")',
      'update("team:qa-admins")',
    ],
    { adminTeamId: "qa-admins" },
  );

  assert.equal(comparison.status, "match");
  assert.deepEqual(comparison.missing, []);
  assert.deepEqual(comparison.extra, []);
});

test("comparePermissions falls back to manual verification when team:admins cannot be resolved", () => {
  const comparison = comparePermissions(
    {
      update: ["team:admins"],
    },
    [
      'update("team:qa-admins")',
    ],
  );

  assert.equal(comparison.status, "manual");
  assert.match(String(comparison.reason || ""), /APPWRITE_ADMIN_TEAM_ID/);
});
