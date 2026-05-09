import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/components/admin/AdminMockCrudWorkspace.tsx",
  "src/app/hooks/useAdminLocalCrud.ts",
  "src/app/data/legalPages.ts",
  "docs/admin-legal-pages-mock-crud.md",
];

const workspaceMarkers = [
  "LegalPagesMockCrud",
  "legalPages",
  "type LegalPage",
  "type LegalPageStatus",
  "LegalDraft",
  "AdminLegalRecord",
  "LegalPolicyType",
  "LegalApprovalStatus",
  "createLegalDraft",
  "createLegalRecords",
  "inferLegalPolicyType",
  "useAdminLocalCrud<AdminLegalRecord, LegalDraft>",
  "/admin/site-content/legal",
  "/admin/legal",
  "Mock Legal Page Records",
  "Add Mock Legal Page",
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

add("# Admin Legal Pages Mock CRUD Audit");
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

if (exists("docs/admin-legal-pages-mock-crud.md")) {
  const doc = read("docs/admin-legal-pages-mock-crud.md");
  const terms = ["Legal", "useAdminLocalCrud", "CRUD", "local", "approval", "version"];

  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Legal pages mock CRUD documentation contains expected terms");
  } else {
    fail(`Legal pages mock CRUD documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Legal pages mock CRUD is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-legal-pages-mock-crud-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
