import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/components/admin/AdminRecordFormPreview.tsx",
  "src/app/components/admin/AdminFormShell.tsx",
  "src/app/components/admin/AdminFieldRenderer.tsx",
  "src/app/components/admin/index.ts",
  "src/app/pages/admin/AdminCrudPage.tsx",
  "src/app/data/adminCrudSchema.ts",
  "docs/admin-record-form-scaffold.md",
];

const componentMarkers = [
  "export function AdminRecordFormPreview",
  "adminCrudEntities",
  "getCrudEntityForPath",
  "mapFieldType",
  "sampleValueForField",
  "AdminFormShell",
  "AdminFieldRenderer",
  "Schema-driven form preview",
];

const pageMarkers = [
  "AdminRecordFormPreview",
  "<AdminRecordFormPreview />",
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

add("# Admin Record Form Scaffold Audit");
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

if (exists("src/app/components/admin/AdminRecordFormPreview.tsx")) {
  const component = read("src/app/components/admin/AdminRecordFormPreview.tsx");

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

  if (indexFile.includes("AdminRecordFormPreview")) {
    pass("AdminRecordFormPreview exported from admin component index");
  } else {
    fail("AdminRecordFormPreview export missing from admin component index");
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

if (exists("docs/admin-record-form-scaffold.md")) {
  const doc = read("docs/admin-record-form-scaffold.md");
  const terms = ["AdminRecordFormPreview", "schema", "form", "CRUD"];
  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Admin record form documentation contains expected terms");
  } else {
    fail(`Admin record form documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Admin record form scaffold is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-record-form-scaffold-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
