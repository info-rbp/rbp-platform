import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/components/admin/AdminPageHeader.tsx",
  "src/app/components/admin/AdminStatCard.tsx",
  "src/app/components/admin/AdminStatusBadge.tsx",
  "src/app/components/admin/AdminEmptyState.tsx",
  "src/app/components/admin/AdminTable.tsx",
  "src/app/components/admin/AdminFormShell.tsx",
  "src/app/components/admin/AdminFieldRenderer.tsx",
  "src/app/components/admin/index.ts",
  "src/app/pages/admin/AdminCrudPage.tsx",
  "docs/admin-ui-primitives.md",
];

const requiredExports = [
  "AdminEmptyState",
  "AdminFieldRenderer",
  "AdminFormShell",
  "AdminPageHeader",
  "AdminStatCard",
  "AdminStatusBadge",
  "AdminTable",
];

const adminCrudMarkers = [
  "AdminPageHeader",
  "AdminStatCard",
  "AdminStatusBadge",
  "AdminTable",
  "../../components/admin",
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

add("# Admin UI Primitives Audit");
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
add("## Export checks");

if (exists("src/app/components/admin/index.ts")) {
  const indexFile = read("src/app/components/admin/index.ts");

  for (const item of requiredExports) {
    if (indexFile.includes(item)) {
      pass(`Export present: ${item}`);
    } else {
      fail(`Export missing: ${item}`);
    }
  }
}

add("");
add("## AdminCrudPage integration checks");

if (exists("src/app/pages/admin/AdminCrudPage.tsx")) {
  const page = read("src/app/pages/admin/AdminCrudPage.tsx");

  for (const marker of adminCrudMarkers) {
    if (page.includes(marker)) {
      pass(`AdminCrudPage marker present: ${marker}`);
    } else {
      fail(`AdminCrudPage marker missing: ${marker}`);
    }
  }

  if (!page.includes("function StatCard(")) {
    pass("Local StatCard function removed from AdminCrudPage");
  } else {
    fail("Local StatCard function still exists in AdminCrudPage");
  }

  if (!page.includes("<table className=")) {
    pass("Inline table markup removed from AdminCrudPage");
  } else {
    fail("Inline table markup still exists in AdminCrudPage");
  }
}

add("");
add("## Documentation checks");

if (exists("docs/admin-ui-primitives.md")) {
  const doc = read("docs/admin-ui-primitives.md");
  const terms = ["AdminPageHeader", "AdminTable", "AdminFieldRenderer", "CRUD"];
  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Admin UI primitives documentation contains expected terms");
  } else {
    fail(`Admin UI primitives documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Admin UI primitives are structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-ui-primitives-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
