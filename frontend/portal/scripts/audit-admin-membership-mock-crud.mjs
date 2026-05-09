import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/components/admin/AdminMockCrudWorkspace.tsx",
  "src/app/hooks/useAdminLocalCrud.ts",
  "src/app/data/membership.ts",
  "docs/admin-membership-mock-crud.md",
];

const workspaceMarkers = [
  "MembershipMockCrud",
  "membershipPages",
  "type MembershipPageItem",
  "MembershipDraft",
  "AdminMembershipRecord",
  "MembershipPageType",
  "createMembershipDraft",
  "createMembershipRecords",
  "inferMembershipPageType",
  "useAdminLocalCrud<AdminMembershipRecord, MembershipDraft>",
  "/admin/membership",
  "Mock Membership Records",
  "Add Mock Membership",
  "legal-review-required",
];

function filePath(relativePath) {
  return path.join(root, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(filePath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(filePath(relativePath), "utf8");
}

const report = [];
let failures = 0;

function add(line = "") {
  report.push(line);
}

function pass(message) {
  add(`✅ ${message}`);
}

function fail(message) {
  failures += 1;
  add(`❌ ${message}`);
}

add("# Admin Membership Mock CRUD Audit");
add("");
add(`Generated: ${new Date().toISOString()}`);
add("");

add("## Required files");
for (const file of requiredFiles) {
  if (exists(file)) {
    pass(file);
  } else {
    fail(`${file} is missing`);
  }
}

add("");
add("## Workspace checks");

if (exists("src/app/components/admin/AdminMockCrudWorkspace.tsx")) {
  const workspace = read("src/app/components/admin/AdminMockCrudWorkspace.tsx");

  for (const marker of workspaceMarkers) {
    if (workspace.includes(marker)) {
      pass(`Workspace marker present: ${marker}`);
    } else {
      fail(`Workspace marker missing: ${marker}`);
    }
  }
}

add("");
add("## Documentation checks");

if (exists("docs/admin-membership-mock-crud.md")) {
  const doc = read("docs/admin-membership-mock-crud.md");
  const terms = ["Membership", "useAdminLocalCrud", "CRUD", "local", "payment"];

  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Membership mock CRUD documentation contains expected terms");
  } else {
    fail(`Membership mock CRUD documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Membership mock CRUD is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-membership-mock-crud-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
