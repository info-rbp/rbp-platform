import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/hooks/useAdminLocalCrud.ts",
  "src/app/components/admin/AdminMockCrudWorkspace.tsx",
  "docs/admin-local-crud-foundation.md",
];

const hookMarkers = [
  "export function useAdminLocalCrud",
  "initialRecords",
  "createDraft",
  "toDraft",
  "fromDraft",
  "validateDraft",
  "updateDraft",
  "saveRecord",
  "deleteRecord",
  "startEdit",
  "resetForm",
];

const workspaceMarkers = [
  "useAdminLocalCrud",
  "ResourceMockCrud",
  "HelpCenterMockCrud",
  "updateDraft",
  "canSave",
  "saveRecord",
  "deleteRecord",
  "startEdit",
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

add("# Admin Local CRUD Foundation Audit");
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
add("## Hook checks");

if (exists("src/app/hooks/useAdminLocalCrud.ts")) {
  const hook = read("src/app/hooks/useAdminLocalCrud.ts");

  for (const marker of hookMarkers) {
    if (hook.includes(marker)) {
      pass(`Hook marker present: ${marker}`);
    } else {
      fail(`Hook marker missing: ${marker}`);
    }
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

  if (!workspace.includes("useState<PublicResource[]>") && !workspace.includes("useState<HelpArticle[]>")) {
    pass("Duplicated record useState calls removed from AdminMockCrudWorkspace");
  } else {
    fail("Duplicated record useState calls still exist in AdminMockCrudWorkspace");
  }
}

add("");
add("## Documentation checks");

if (exists("docs/admin-local-crud-foundation.md")) {
  const doc = read("docs/admin-local-crud-foundation.md");
  const terms = ["useAdminLocalCrud", "Resources", "Help Center", "CRUD"];
  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Admin local CRUD foundation documentation contains expected terms");
  } else {
    fail(`Admin local CRUD foundation documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Admin local CRUD foundation is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-local-crud-foundation-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
