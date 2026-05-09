import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/components/admin/AdminMockCrudWorkspace.tsx",
  "src/app/hooks/useAdminLocalCrud.ts",
  "src/app/data/applications.ts",
  "src/app/data/onDemandServices.ts",
  "src/app/data/managedServices.ts",
  "docs/admin-applications-services-mock-crud.md",
];

const workspaceMarkers = [
  "ApplicationMockCrud",
  "ServiceMockCrud",
  "applicationCategories",
  "onDemandServices",
  "managedServices",
  "createServiceRecords",
  "useAdminLocalCrud<ApplicationCategory, ApplicationDraft>",
  "useAdminLocalCrud<AdminServiceRecord, ServiceDraft>",
  "/admin/applications",
  "/admin/services",
  "/admin/on-demand",
  "/admin/managed-services",
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

add("# Admin Applications and Services Mock CRUD Audit");
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

if (exists("docs/admin-applications-services-mock-crud.md")) {
  const doc = read("docs/admin-applications-services-mock-crud.md");
  const terms = ["Applications", "Services", "useAdminLocalCrud", "CRUD"];
  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Applications and services mock CRUD documentation contains expected terms");
  } else {
    fail(`Applications and services mock CRUD documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Applications and Services mock CRUD is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-applications-services-mock-crud-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
