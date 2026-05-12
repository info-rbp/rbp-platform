import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const files = {
  page: "src/app/pages/confirmation/MembershipConfirmationPage.tsx",
  service: "src/app/services/membershipConfirmationService.ts",
  runtime: "src/app/config/runtime.ts",
  purchaseFlow: "src/app/features/membership/MembershipPurchaseOnboardingFlow.tsx",
  tierFlow: "src/app/features/membership/MembershipTierSignupFlow.tsx",
  packageJson: "package.json",
  docs: "docs/MEMBERSHIP_CONFIRMATION.md",
};

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

function filePath(relativePath) {
  return path.join(root, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(filePath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(filePath(relativePath), "utf8");
}

function walkSourceFiles(dir) {
  const absoluteRoot = filePath(dir);
  const output = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const absolutePath = path.join(currentDir, entry.name);
      const relativePath = path.relative(root, absolutePath);

      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === "dist") {
          continue;
        }
        walk(absolutePath);
        continue;
      }

      if (/\.(ts|tsx|js|jsx|mjs|md)$/.test(entry.name)) {
        output.push(relativePath);
      }
    }
  }

  walk(absoluteRoot);
  return output;
}

add("# Membership Confirmation Safety Audit");
add("");
add(`Generated: ${new Date().toISOString()}`);
add("");

add("## Required files");
for (const [label, relativePath] of Object.entries(files)) {
  if (exists(relativePath)) {
    pass(`${label}: ${relativePath}`);
  } else {
    fail(`${label} missing: ${relativePath}`);
  }
}

const page = exists(files.page) ? read(files.page) : "";
const service = exists(files.service) ? read(files.service) : "";
const runtime = exists(files.runtime) ? read(files.runtime) : "";
const purchaseFlow = exists(files.purchaseFlow) ? read(files.purchaseFlow) : "";
const tierFlow = exists(files.tierFlow) ? read(files.tierFlow) : "";
const packageJson = exists(files.packageJson) ? JSON.parse(read(files.packageJson)) : {};
const docs = exists(files.docs) ? read(files.docs) : "";

add("");
add("## Runtime guard");
if (runtime.includes("import.meta.env.DEV")) {
  pass("runtime guard uses import.meta.env.DEV");
} else {
  fail("runtime guard must use import.meta.env.DEV");
}

if (runtime.includes("VITE_ENABLE_MOCK_MEMBERSHIP_CONFIRMATION")) {
  pass("runtime guard documents the explicit mock confirmation flag");
} else {
  fail("runtime guard missing VITE_ENABLE_MOCK_MEMBERSHIP_CONFIRMATION");
}

if (runtime.includes("return import.meta.env.DEV &&")) {
  pass("mock confirmation is gated to development builds");
} else {
  fail("mock confirmation must not be enabled by default in production builds");
}

add("");
add("## Confirmation page");
if (!page.includes("sessionStorage.getItem")) {
  pass("confirmation page does not read sessionStorage directly");
} else {
  fail("confirmation page must not call sessionStorage.getItem directly");
}

if (!page.includes("membershipFlowStorageKey")) {
  pass("confirmation page does not depend on the raw mock storage key");
} else {
  fail("confirmation page must use the confirmation service boundary, not the raw storage key");
}

if (page.includes("getMembershipConfirmation") && page.includes("getDevelopmentMembershipConfirmationFromBrowserSession")) {
  pass("confirmation page uses backend and dev-preview service boundaries");
} else {
  fail("confirmation page must use membership confirmation service functions");
}

if (page.includes("Development preview only") && page.includes("No real membership, payment, account, or portal access has been created.")) {
  pass("mock confirmation copy is clearly development-only");
} else {
  fail("mock confirmation copy must clearly say it is development-only and not real");
}

if (page.includes("We could not verify a membership confirmation for this session")) {
  pass("safe fallback copy is present");
} else {
  fail("safe fallback copy is missing");
}

if (!page.includes("/portal/dashboard") || (page.includes("isAuthenticated()") && page.includes("backendConfirmation"))) {
  pass("portal dashboard CTA is guarded by backend confirmation or auth context");
} else {
  fail("/portal/dashboard appears to be used without backend confirmation or auth/session context");
}

add("");
add("## Service boundary");
if (service.includes('source: "backend" | "mock-dev"')) {
  pass("membership confirmation type distinguishes backend and mock-dev sources");
} else {
  fail("membership confirmation type must distinguish backend and mock-dev sources");
}

if (service.includes("getMembershipConfirmation") && service.includes("Future Frappe integration point")) {
  pass("backend confirmation placeholder service is present");
} else {
  fail("backend confirmation service boundary is missing");
}

if (service.includes("isMockMembershipConfirmationEnabled()") && service.includes("sessionStorage.getItem(membershipFlowStorageKey)")) {
  pass("browser mock confirmation read is behind the runtime guard");
} else {
  fail("browser mock confirmation read must be behind the runtime guard");
}

add("");
add("## Mock flow writes");
for (const [label, content] of [
  ["purchase onboarding flow", purchaseFlow],
  ["tier signup flow", tierFlow],
]) {
  if (content.includes("isMockMembershipConfirmationEnabled()") && content.includes("return false;") && content.includes("sessionStorage.setItem")) {
    pass(`${label} guards mock confirmation storage writes`);
  } else {
    fail(`${label} must guard mock confirmation storage writes`);
  }
}

add("");
add("## Unsafe markers");
const sourceFiles = exists("src/app") ? walkSourceFiles("src/app") : [];
const unsafeMarkers = ["MEM-MOCK-PREVIEW", "MEM-PREVIEW-001"];

for (const marker of unsafeMarkers) {
  const matches = sourceFiles.filter((relativePath) => read(relativePath).includes(marker));
  if (matches.length === 0) {
    pass(`${marker} is not present in src/app`);
  } else {
    fail(`${marker} appears in: ${matches.join(", ")}`);
  }
}

add("");
add("## Package and docs");
if (packageJson.scripts?.["audit:membership-confirmation-safety"] === "node scripts/audit-membership-confirmation-safety.mjs") {
  pass("package script audit:membership-confirmation-safety exists");
} else {
  fail("package script audit:membership-confirmation-safety missing or incorrect");
}

if (
  docs.includes("development-only") &&
  docs.includes("Frappe") &&
  docs.includes("sessionStorage") &&
  docs.includes("portal dashboard CTA")
) {
  pass("membership confirmation documentation covers safety requirements");
} else {
  fail("membership confirmation documentation is missing required safety notes");
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Membership confirmation cannot present browser mock state as a production confirmation.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

console.log(report.join("\n"));

if (failures > 0) {
  process.exitCode = 1;
}
