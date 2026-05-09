import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/data/adminCrudSchema.ts",
  "src/app/data/adminContentModel.ts",
  "docs/admin-crud-schema.md",
  "docs/admin-crud-implementation-plan.md",
  "docs/admin-content-model.md",
  "docs/admin-implementation-roadmap.md",
];

const expectedEntities = [
  "business-categories",
  "resources",
  "help-center",
  "offers",
  "applications",
  "services",
  "marketplace",
  "membership",
  "legal-pages",
];

const expectedMarkers = [
  "adminCrudEntities",
  "adminCrudSchemaSummary",
  "collectionName",
  "fields",
  "supportsDraftPublishing",
  "supportsOrdering",
  "supportsFeatured",
  "requiresApproval",
  "backendRequired",
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

add("# Admin CRUD Schema Audit");
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
add("## Entity checks");

if (exists("src/app/data/adminCrudSchema.ts")) {
  const schema = read("src/app/data/adminCrudSchema.ts");

  for (const entity of expectedEntities) {
    if (schema.includes(`id: "${entity}"`)) {
      pass(`CRUD entity registered: ${entity}`);
    } else {
      fail(`CRUD entity missing: ${entity}`);
    }
  }

  for (const marker of expectedMarkers) {
    if (schema.includes(marker)) {
      pass(`Schema marker present: ${marker}`);
    } else {
      fail(`Schema marker missing: ${marker}`);
    }
  }
}

add("");
add("## Documentation checks");

for (const doc of ["docs/admin-crud-schema.md", "docs/admin-crud-implementation-plan.md"]) {
  if (!exists(doc)) {
    fail(`${doc} is missing`);
    continue;
  }

  const text = read(doc);
  const requiredTerms = ["CRUD", "Admin", "backend", "schema"];

  const missing = requiredTerms.filter((term) => !text.toLowerCase().includes(term.toLowerCase()));

  if (missing.length === 0) {
    pass(`${doc} contains expected planning language`);
  } else {
    fail(`${doc} missing expected terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Admin CRUD schema planning is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-crud-schema-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
