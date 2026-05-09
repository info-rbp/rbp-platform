import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/data/backendCollectionContracts.ts",
  "docs/backend-collection-contracts.md",
];

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

const contractMarkers = [
  "export type BackendCollectionId",
  "export type BackendFieldType",
  "export type BackendRiskLevel",
  "export type BackendImplementationPhase",
  "export interface BackendFieldContract",
  "export interface BackendCollectionContract",
  "backendCollectionContracts",
  "getBackendCollectionContract",
  "getBackendContractsByPhase",
  "getBackendContractsByRisk",
  "getPhaseOneBackendContracts",
  "getApprovalRequiredBackendContracts",
  "getAuditRequiredBackendContracts",
];

const workflowMarkers = [
  "approvalRequired",
  "archiveInsteadOfDelete",
  "auditLogRequired",
  "phase-1-foundation",
  "phase-2-commercial",
  "phase-3-membership",
  "phase-4-governance",
  "platform-support",
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

add("# Backend Collection Contracts Audit");
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
add("## Contract marker checks");

if (exists("src/app/data/backendCollectionContracts.ts")) {
  const contracts = read("src/app/data/backendCollectionContracts.ts");

  for (const marker of contractMarkers) {
    if (contracts.includes(marker)) {
      pass(`Contract marker present: ${marker}`);
    } else {
      fail(`Contract marker missing: ${marker}`);
    }
  }

  add("");
  add("## Required collection checks");

  for (const collection of requiredCollections) {
    if (contracts.includes(`id: "${collection}"`) && contracts.includes(`collectionName: "${collection}"`)) {
      pass(`Collection contract present: ${collection}`);
    } else {
      fail(`Collection contract missing or incomplete: ${collection}`);
    }
  }

  add("");
  add("## Workflow marker checks");

  for (const marker of workflowMarkers) {
    if (contracts.includes(marker)) {
      pass(`Workflow marker present: ${marker}`);
    } else {
      fail(`Workflow marker missing: ${marker}`);
    }
  }

  const contractCount = (contracts.match(/collectionName:/g) ?? []).length;
  add("");
  add(`Detected collection contract count: ${contractCount}`);

  if (contractCount >= requiredCollections.length) {
    pass("Detected expected number of collection contracts");
  } else {
    fail(`Expected at least ${requiredCollections.length} collection contracts but found ${contractCount}`);
  }
}

add("");
add("## Documentation checks");

if (exists("docs/backend-collection-contracts.md")) {
  const doc = read("docs/backend-collection-contracts.md");
  const terms = ["Firebase", "Firestore", "security", "audit", "backendCollectionContracts"];

  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Backend collection contract documentation contains expected terms");
  } else {
    fail(`Backend collection contract documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Backend collection contracts are structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/backend-collection-contracts-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
