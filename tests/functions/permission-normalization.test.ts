import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPermission,
  buildPermissions,
  normalizePermissionTarget,
} from "../../scripts/appwrite/permissions";

test("normalizes Appwrite legacy role targets", () => {
  assert.equal(normalizePermissionTarget("role:all"), "any");
  assert.equal(normalizePermissionTarget("role:users"), "users");
  assert.equal(normalizePermissionTarget("role:guests"), "guests");
});

test("normalizes admin team shorthand using APPWRITE_ADMIN_TEAM_ID", () => {
  assert.equal(
    normalizePermissionTarget("team:admins", { adminTeamId: "admin-team-id" }),
    "team:admin-team-id",
  );
});

test("builds Appwrite 1.9-compatible permission strings", () => {
  assert.equal(buildPermission("read", "role:users"), 'read("users")');
  assert.equal(buildPermission("create", "role:users"), 'create("users")');
  assert.equal(buildPermission("read", "role:all"), 'read("any")');
  assert.equal(buildPermission("read", "role:guests"), 'read("guests")');
  assert.equal(
    buildPermission("update", "team:admins", { adminTeamId: "admin-team-id" }),
    'update("team:admin-team-id")',
  );
  assert.equal(
    buildPermission("delete", "team:admins", { adminTeamId: "admin-team-id" }),
    'delete("team:admin-team-id")',
  );
});

test("builds collection permission payloads from repo shorthand", () => {
  assert.deepEqual(
    buildPermissions(
      {
        read: ["role:users", "team:admins"],
        create: ["role:users"],
        update: ["team:admins"],
        delete: ["team:admins"],
      },
      { adminTeamId: "admin-team-id" },
    ),
    [
      'create("users")',
      'delete("team:admin-team-id")',
      'read("team:admin-team-id")',
      'read("users")',
      'update("team:admin-team-id")',
    ],
  );
});

test("fails clearly when team:admins is used without APPWRITE_ADMIN_TEAM_ID", () => {
  assert.throws(
    () => buildPermission("update", "team:admins"),
    /APPWRITE_ADMIN_TEAM_ID is required/,
  );
});
