import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/components/admin/AdminMockCrudWorkspace.tsx",
  "src/app/hooks/useAdminLocalCrud.ts",
  "src/app/data/marketplace.ts",
  "docs/admin-marketplace-mock-crud.md",
];

const workspaceMarkers = [
  "MarketplaceMockCrud",
  "marketplaceSections",
  "type MarketplaceSection",
  "MarketplaceDraft",
  "AdminMarketplaceRecord",
  "MarketplaceListingType",
  "createMarketplaceDraft",
  "createMarketplaceRecords",
  "inferMarketplaceListingType",
  "useAdminLocalCrud<AdminMarketplaceRecord, MarketplaceDraft>",
  "/admin/marketplace",
  "Mock Marketplace Records",
  "Add Mock Listing",
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

add("# Admin Marketplace Mock CRUD Audit");
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

if (exists("docs/admin-marketplace-mock-crud.md")) {
  const doc = read("docs/admin-marketplace-mock-crud.md");
  const terms = ["Marketplace", "useAdminLocalCrud", "CRUD", "local", "commercial"];

  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Marketplace mock CRUD documentation contains expected terms");
  } else {
    fail(`Marketplace mock CRUD documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Marketplace mock CRUD is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-marketplace-mock-crud-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
