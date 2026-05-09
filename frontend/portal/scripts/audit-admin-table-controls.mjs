import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/hooks/useAdminTableControls.ts",
  "src/app/components/admin/AdminTableControls.tsx",
  "src/app/components/admin/index.ts",
  "src/app/components/admin/AdminMockCrudWorkspace.tsx",
  "docs/admin-table-controls.md",
];

const hookMarkers = [
  "export function useAdminTableControls",
  "searchTerm",
  "statusFilter",
  "categoryFilter",
  "sortId",
  "sortDirection",
  "statusOptions",
  "categoryOptions",
  "resetControls",
];

const componentMarkers = [
  "export function AdminTableControls",
  "Search",
  "All statuses",
  "All categories",
  "Sort:",
  "Reset",
  "filteredCount",
  "totalCount",
];

const workspaceMarkers = [
  "useAdminTableControls",
  "AdminTableControls",
  "useMockTableControls",
  "createRecordSearchText",
  "getRecordStringValue",
  "rows={table.rows}",
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

add("# Admin Table Controls Audit");
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

if (exists("src/app/hooks/useAdminTableControls.ts")) {
  const hook = read("src/app/hooks/useAdminTableControls.ts");

  for (const marker of hookMarkers) {
    if (hook.includes(marker)) {
      pass(`Hook marker present: ${marker}`);
    } else {
      fail(`Hook marker missing: ${marker}`);
    }
  }
}

add("");
add("## Component checks");

if (exists("src/app/components/admin/AdminTableControls.tsx")) {
  const component = read("src/app/components/admin/AdminTableControls.tsx");

  for (const marker of componentMarkers) {
    if (component.includes(marker)) {
      pass(`Component marker present: ${marker}`);
    } else {
      fail(`Component marker missing: ${marker}`);
    }
  }
}

add("");
add("## Export checks");

if (exists("src/app/components/admin/index.ts")) {
  const indexFile = read("src/app/components/admin/index.ts");

  if (indexFile.includes("AdminTableControls")) {
    pass("AdminTableControls exported from admin component index");
  } else {
    fail("AdminTableControls export missing from admin component index");
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

  if (!workspace.includes("AdminTable rows={records}")) {
    pass("Direct unfiltered AdminTable rows removed from mock workspace");
  } else {
    fail("Direct unfiltered AdminTable rows still exist in mock workspace");
  }
}

add("");
add("## Documentation checks");

if (exists("docs/admin-table-controls.md")) {
  const doc = read("docs/admin-table-controls.md");
  const terms = ["search", "filter", "sort", "AdminTableControls", "useAdminTableControls"];

  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Admin table controls documentation contains expected terms");
  } else {
    fail(`Admin table controls documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Admin table controls are structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-table-controls-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
