import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/utils/adminCrud.ts",
  "src/app/components/admin/AdminMockCrudWorkspace.tsx",
  "docs/admin-utility-functions.md",
];

const utilityMarkers = [
  "export function slugify",
  "export function createMockRecordId",
  "export function hasRequiredTextFields",
  "export function withFallbackHref",
  "export function formatAdminLabel",
  "export function getAdminRouteSection",
  "export function isLegalReviewStatus",
  "export function isBackendLaterStatus",
  "export function isReadyStatus",
];

const workspaceMarkers = [
  "../../utils/adminCrud",
  "createMockRecordId",
  "hasRequiredTextFields",
  "withFallbackHref",
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

add("# Admin Utility Functions Audit");
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
add("## Utility file checks");

if (exists("src/app/utils/adminCrud.ts")) {
  const utilities = read("src/app/utils/adminCrud.ts");

  for (const marker of utilityMarkers) {
    if (utilities.includes(marker)) {
      pass(`Utility marker present: ${marker}`);
    } else {
      fail(`Utility marker missing: ${marker}`);
    }
  }
}

add("");
add("## Workspace integration checks");

if (exists("src/app/components/admin/AdminMockCrudWorkspace.tsx")) {
  const workspace = read("src/app/components/admin/AdminMockCrudWorkspace.tsx");

  for (const marker of workspaceMarkers) {
    if (workspace.includes(marker)) {
      pass(`Workspace marker present: ${marker}`);
    } else {
      fail(`Workspace marker missing: ${marker}`);
    }
  }

  if (!workspace.includes("function slugify(value: string)")) {
    pass("Local slugify function removed from AdminMockCrudWorkspace");
  } else {
    fail("Local slugify function still exists in AdminMockCrudWorkspace");
  }

  if (!workspace.includes("|| `resource-${Date.now()}`") && !workspace.includes("|| `help-${Date.now()}`")) {
    pass("Direct mock ID fallback patterns reduced in AdminMockCrudWorkspace");
  } else {
    fail("Direct mock ID fallback patterns still exist in AdminMockCrudWorkspace");
  }
}

add("");
add("## Documentation checks");

if (exists("docs/admin-utility-functions.md")) {
  const doc = read("docs/admin-utility-functions.md");
  const terms = ["slugify", "createMockRecordId", "hasRequiredTextFields", "withFallbackHref"];

  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Admin utility documentation contains expected terms");
  } else {
    fail(`Admin utility documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Admin utility functions are structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-utility-functions-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
