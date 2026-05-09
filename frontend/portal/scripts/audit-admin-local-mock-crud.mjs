import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/components/admin/AdminMockCrudWorkspace.tsx",
  "src/app/components/admin/index.ts",
  "src/app/pages/admin/AdminCrudPage.tsx",
  "src/app/data/resources.ts",
  "src/app/data/helpCenter.ts",
  "docs/admin-local-mock-crud.md",
];

const componentMarkers = [
  "export function AdminMockCrudWorkspace",
  "ResourceMockCrud",
  "HelpCenterMockCrud",
  "useAdminLocalCrud",
  "saveRecord",
  "deleteRecord",
  "startEdit",
  "publicResources",
  "helpArticles",
];

const pageMarkers = [
  "AdminMockCrudWorkspace",
  "<AdminMockCrudWorkspace />",
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

add("# Admin Local Mock CRUD Audit");
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
add("## Component checks");

if (exists("src/app/components/admin/AdminMockCrudWorkspace.tsx")) {
  const component = read("src/app/components/admin/AdminMockCrudWorkspace.tsx");

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

  if (indexFile.includes("AdminMockCrudWorkspace")) {
    pass("AdminMockCrudWorkspace exported from admin component index");
  } else {
    fail("AdminMockCrudWorkspace export missing from admin component index");
  }
}

add("");
add("## AdminCrudPage integration checks");

if (exists("src/app/pages/admin/AdminCrudPage.tsx")) {
  const page = read("src/app/pages/admin/AdminCrudPage.tsx");

  for (const marker of pageMarkers) {
    if (page.includes(marker)) {
      pass(`AdminCrudPage marker present: ${marker}`);
    } else {
      fail(`AdminCrudPage marker missing: ${marker}`);
    }
  }
}

add("");
add("## Documentation checks");

if (exists("docs/admin-local-mock-crud.md")) {
  const doc = read("docs/admin-local-mock-crud.md");
  const terms = ["Resources", "Help Center", "local", "CRUD"];
  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Admin local mock CRUD documentation contains expected terms");
  } else {
    fail(`Admin local mock CRUD documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Admin local mock CRUD is structurally ready with hook-based local state.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-local-mock-crud-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
