import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const requiredFiles = [
  "src/app/config/phase1FlowStates.ts",
  "src/app/components/flow/FlowStateSummary.tsx",
  "docs/ui/flow-state-standardisation.md",
  "docs/qa/step-20-flow-state-checklist.md",
  "docs/implementation/step-20-flow-state-standardisation.codex.md",
];

const recommendedFlowFiles = [
  "src/app/features/membership/MembershipPurchaseOnboardingFlow.tsx",
  "src/app/features/decision-desk/DecisionDeskFlow.tsx",
  "src/app/features/docushare/DocuShareOnboardingFlow.tsx",
  "src/app/features/marketplace/MarketplaceEnquiryListingFlow.tsx",
  "src/app/features/connectivity/ConnectivityOrderFlow.tsx",
  "src/app/features/risk-advisor/RiskAdvisorFlow.tsx",
  "src/app/features/the-fixer/TheFixerFlow.tsx",
  "src/app/pages/portal/PortalDashboard.tsx",
  "src/app/pages/portal/PortalServices.tsx",
  "src/app/features/admin/AdminConcepts.tsx",
];

const stateKeywords = [
  "ReviewSubmit",
  "ConfirmationPanel",
  "MockSubmissionState",
  "StatusTimeline",
  "PortalStatusCard",
  "submit",
  "confirmation",
];

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

const missingRequired = requiredFiles.filter((file) => !exists(file));

console.log("Phase 1 flow-state audit");
console.log("========================");
console.log("");

if (missingRequired.length > 0) {
  console.log("Missing required Step 20 files:");
  for (const file of missingRequired) console.log(`- ${file}`);
  process.exitCode = 1;
} else {
  console.log("Required Step 20 files: OK");
}

console.log("");
console.log("Recommended flow-file scan:");

for (const file of recommendedFlowFiles) {
  if (!exists(file)) {
    console.log(`- ${file}: not found or not yet implemented`);
    continue;
  }

  const content = read(file);
  const found = stateKeywords.filter((keyword) => content.includes(keyword));
  console.log(`- ${file}: ${found.length}/${stateKeywords.length} state keywords found`);

  if (found.length > 0) {
    console.log(`  found: ${found.join(", ")}`);
  }
}

console.log("");
console.log("Audit complete. Missing recommended flow files are warnings only.");
