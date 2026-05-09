import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/data/backendCollectionContracts.ts",
  "docs/backend-collection-contracts.md",
  "docs/firebase-backend-plan.md",
  "docs/firebase-security-rules-plan.md",
  "docs/admin-permissions-model.md",
];

const backendPlanMarkers = [
  "Firebase Backend Implementation Plan",
  "Firestore",
  "Firebase Auth",
  "Firebase Storage",
  "Phase 1",
  "Phase 2",
  "Phase 3",
  "Phase 4",
  "legalPages",
  "auditLogs",
  "adminUsers",
];

const securityPlanMarkers = [
  "Firebase Security Rules Plan",
  "security",
  "public read",
  "member read",
  "admin write",
  "commercial-admin",
  "legal-admin",
  "super-admin",
  "Storage rules",
  "Draft security rule pseudocode",
];

const permissionsMarkers = [
  "Admin Permissions Model",
  "public",
  "member",
  "editor",
  "admin",
  "commercial-admin",
  "legal-admin",
  "super-admin",
  "system",
  "Permission matrix",
  "Audit requirements",
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

function checkMarkers(file, markers, label) {
  add("");
  add(`## ${label}`);

  if (!exists(file)) {
    fail(`${file} is missing`);
    return;
  }

  const text = read(file);

  for (const marker of markers) {
    if (text.includes(marker)) {
      pass(`${label} marker present: ${marker}`);
    } else {
      fail(`${label} marker missing: ${marker}`);
    }
  }
}

add("# Firebase/Auth/Security Planning Audit");
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

checkMarkers("docs/firebase-backend-plan.md", backendPlanMarkers, "Firebase backend plan checks");
checkMarkers("docs/firebase-security-rules-plan.md", securityPlanMarkers, "Security rules plan checks");
checkMarkers("docs/admin-permissions-model.md", permissionsMarkers, "Permissions model checks");

add("");
add("## Backend contract dependency checks");

if (exists("src/app/data/backendCollectionContracts.ts")) {
  const contracts = read("src/app/data/backendCollectionContracts.ts");

  const requiredCollections = [
    "businessCategories",
    "resources",
    "helpArticles",
    "applications",
    "services",
    "operations",
    "offers",
    "marketplaceListings",
    "membershipPages",
    "legalPages",
    "mediaAssets",
    "auditLogs",
    "adminUsers",
  ];

  for (const collection of requiredCollections) {
    if (contracts.includes(`collectionName: "${collection}"`)) {
      pass(`Backend contract collection present: ${collection}`);
    } else {
      fail(`Backend contract collection missing: ${collection}`);
    }
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Firebase/Auth/security planning is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/firebase-auth-security-plan-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
