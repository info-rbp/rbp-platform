import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/data/adminContentModel.ts",
  "docs/admin-content-model.md",
  "docs/admin-implementation-roadmap.md",
  "src/app/data/publicNavigation.ts",
  "src/app/data/publicSitemap.ts",
  "src/app/data/serviceCategories.ts",
  "src/app/data/onDemandServices.ts",
  "src/app/data/managedServices.ts",
  "src/app/data/applications.ts",
  "src/app/data/operations.ts",
  "src/app/data/marketplace.ts",
  "src/app/data/membership.ts",
  "src/app/data/offers.ts",
  "src/app/data/resources.ts",
  "src/app/data/helpCenter.ts",
  "src/app/data/legalPages.ts",
];

const expectedEntities = [
  "public-navigation",
  "public-sitemap",
  "service-categories",
  "on-demand-services",
  "managed-services",
  "applications",
  "operations",
  "marketplace",
  "membership",
  "offers",
  "resources",
  "help-center",
  "legal-pages",
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

add("# Admin Content Model Audit");
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
add("## Entity registry checks");

if (exists("src/app/data/adminContentModel.ts")) {
  const model = read("src/app/data/adminContentModel.ts");

  for (const entity of expectedEntities) {
    if (model.includes(`id: "${entity}"`)) {
      pass(`Entity registered: ${entity}`);
    } else {
      fail(`Entity missing: ${entity}`);
    }
  }

  const requiredMarkers = [
    "adminContentEntities",
    "adminContentModelSummary",
    "publicDataFile",
    "publicRoutes",
    "adminPath",
    "backendRequired",
  ];

  for (const marker of requiredMarkers) {
    if (model.includes(marker)) {
      pass(`Model marker present: ${marker}`);
    } else {
      fail(`Model marker missing: ${marker}`);
    }
  }
}

add("");
add("## Documentation checks");

for (const doc of ["docs/admin-content-model.md", "docs/admin-implementation-roadmap.md"]) {
  if (!exists(doc)) {
    fail(`${doc} is missing`);
    continue;
  }

  const text = read(doc);
  const requiredTerms = ["Admin", "public", "backend", "content"];

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
  add("✅ Audit passed. Admin content model planning is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-content-model-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
