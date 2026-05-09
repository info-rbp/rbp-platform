import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const result = {
  passed: [],
  warnings: [],
  failed: [],
};

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function pass(message) {
  result.passed.push(message);
}

function warn(message) {
  result.warnings.push(message);
}

function fail(message) {
  result.failed.push(message);
}

function checkFile(relativePath, label = relativePath) {
  if (exists(relativePath)) {
    pass(`${label} exists`);
  } else {
    fail(`${label} missing: ${relativePath}`);
  }
}

function checkOneOf(paths, label) {
  const found = paths.find((filePath) => exists(filePath));

  if (found) {
    pass(`${label} exists: ${found}`);
  } else {
    fail(`${label} missing. Expected one of: ${paths.join(", ")}`);
  }
}

function walkFiles(dir, extensions = [".ts", ".tsx", ".js", ".jsx", ".mjs"]) {
  const absoluteDir = path.join(repoRoot, dir);

  if (!fs.existsSync(absoluteDir)) return [];

  const output = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(repoRoot, fullPath);

      if (entry.isDirectory()) {
        if (
          entry.name === "node_modules" ||
          entry.name === "dist" ||
          entry.name === ".git" ||
          entry.name === "_source-zips" ||
          entry.name === "_extracted"
        ) {
          continue;
        }

        walk(fullPath);
      } else if (extensions.includes(path.extname(entry.name))) {
        output.push(relativePath);
      }
    }
  }

  walk(absoluteDir);
  return output.sort();
}

const nestedRouteSignatures = {
  "/membership/confirmation": [
    "path: \"membership\"",
    "path: \"confirmation\"",
    "MembershipConfirmationPage",
  ],
  "/admin/content": [
    "path: \"admin\"",
    "path: \"content\"",
    "AdminCrudPage",
  ],
};

function checkRoute(route) {
  const routeFiles = [
    "src/app/routes.tsx",
    "src/app/config/routes.registry.ts",
    "src/app/config/navigation.ts",
  ].filter((filePath) => exists(filePath));

  const fileContents = routeFiles.map((filePath) => read(filePath));
  const foundExact = fileContents.some((content) => content.includes(route));

  const nestedSignature = nestedRouteSignatures[route];
  const foundNested = nestedSignature
    ? fileContents.some((content) =>
        nestedSignature.every((signature) => content.includes(signature))
      )
    : false;

  if (foundExact || foundNested) {
    pass(`route registered or documented: ${route}`);
  } else {
    fail(`route missing from route config/registry/navigation: ${route}`);
  }
}

function checkPackageScript(scriptName, expectedCommand) {
  if (!exists("package.json")) {
    fail("package.json missing");
    return;
  }

  const packageJson = JSON.parse(read("package.json"));
  const actual = packageJson.scripts?.[scriptName];

  if (actual === expectedCommand) {
    pass(`package script ${scriptName} exists`);
  } else {
    fail(`package script ${scriptName} missing or incorrect. Expected: ${expectedCommand}`);
  }
}

console.log("Phase 1 Audit");
console.log("=============");
console.log("");

const requiredRoutes = [
  "/membership/sign-up-now",
  "/membership/confirmation",
  "/on-demand/decision-desk",
  "/document-nucleus/overview",
  "/marketplace",
  "/operations/connectivity",
  "/on-demand/risk-advisor",
  "/on-demand/the-fixer",
  "/portal/dashboard",
  "/portal/services",
  "/portal/documents",
  "/portal/offers",
  "/portal/apps",
  "/portal/resources",
  "/portal/support",
  "/portal/settings",
  "/admin/dashboard",
  "/admin/content",
  "/admin/requests",
  "/admin/marketplace",
  "/admin/membership",
  "/admin/audit-review",
];

const requiredFiles = [
  "src/app/config/routes.registry.ts",
  "src/app/config/navigation.ts",
  "src/app/config/redirects.ts",
  "src/app/config/phase1FlowStates.ts",

  "src/app/components/flow/WizardShell.tsx",
  "src/app/components/flow/Stepper.tsx",
  "src/app/components/flow/StepNavigation.tsx",
  "src/app/components/flow/ReviewSubmit.tsx",
  "src/app/components/flow/ConfirmationPanel.tsx",
  "src/app/components/flow/StatusTimeline.tsx",
  "src/app/components/flow/MockSubmissionState.tsx",

  "src/app/components/forms/FormSection.tsx",
  "src/app/components/forms/TextField.tsx",
  "src/app/components/forms/TextAreaField.tsx",
  "src/app/components/forms/SelectField.tsx",
  "src/app/components/forms/CheckboxField.tsx",
  "src/app/components/forms/RadioCardGroup.tsx",
  "src/app/components/forms/SelectableCardGrid.tsx",
  "src/app/components/forms/FileUploadMock.tsx",
  "src/app/components/forms/TermsAcceptance.tsx",

  "src/app/components/status/StatusBadge.tsx",
  "src/app/components/status/ReviewStatusBadge.tsx",

  "src/app/mock/membership.mock.ts",
  "src/app/mock/decisionDesk.mock.ts",
  "src/app/mock/docushare.mock.ts",
  "src/app/mock/marketplace.mock.ts",
  "src/app/mock/connectivity.mock.ts",
  "src/app/mock/riskAdvisor.mock.ts",
  "src/app/mock/fixer.mock.ts",
  "src/app/mock/admin.mock.ts",
  "src/app/mock/portal.mock.ts",

  "src/app/services/mock/membership.mockService.ts",
  "src/app/services/mock/decisionDesk.mockService.ts",
  "src/app/services/mock/docushare.mockService.ts",
  "src/app/services/mock/marketplace.mockService.ts",
  "src/app/services/mock/connectivity.mockService.ts",
  "src/app/services/mock/riskAdvisor.mockService.ts",
  "src/app/services/mock/fixer.mockService.ts",
  "src/app/services/mock/admin.mockService.ts",
  "src/app/services/mock/portal.mockService.ts",

  "docs/ui/design-system.md",
  "docs/ui/flow-state-standardisation.md",
  "docs/qa/responsive-qa.md",
  "docs/source-material/external-files-register.md",
];

const requiredDocs = [
  "docs/ui/membership-flow-implementation.md",
  "docs/ui/portal-dashboard-implementation.md",
  "docs/ui/decision-desk-flow-implementation.md",
  "docs/ui/docushare-flow-implementation.md",
  "docs/ui/marketplace-flow-implementation.md",
  "docs/ui/connectivity-flow-implementation.md",
  "docs/ui/risk-advisor-flow-implementation.md",
  "docs/ui/the-fixer-flow-implementation.md",
  "docs/ui/admin-ui-concepts-implementation.md",
];

const featureFileOptions = [
  {
    label: "Membership feature flow",
    paths: ["src/app/features/membership/MembershipPurchaseOnboardingFlow.tsx"],
  },
  {
    label: "Decision Desk feature flow",
    paths: ["src/app/features/decision-desk/DecisionDeskFlow.tsx"],
  },
  {
    label: "DocuShare feature flow",
    paths: [
      "src/app/features/docushare/DocuShareOnboardingFlow.tsx",
      "src/app/features/docushare/DocushareOnboardingFlow.tsx",
    ],
  },
  {
    label: "Marketplace feature flow",
    paths: ["src/app/features/marketplace/MarketplaceEnquiryListingFlow.tsx"],
  },
  {
    label: "Connectivity feature flow",
    paths: ["src/app/features/connectivity/ConnectivityOrderFlow.tsx"],
  },
  {
    label: "Risk Advisor feature flow",
    paths: ["src/app/features/risk-advisor/RiskAdvisorFlow.tsx"],
  },
  {
    label: "The Fixer feature flow",
    paths: ["src/app/features/the-fixer/TheFixerFlow.tsx"],
  },
  {
    label: "Admin concept feature",
    paths: ["src/app/features/admin/AdminConcepts.tsx"],
  },
];

for (const filePath of requiredFiles) {
  checkFile(filePath);
}

for (const filePath of requiredDocs) {
  checkFile(filePath);
}

for (const item of featureFileOptions) {
  checkOneOf(item.paths, item.label);
}

for (const route of requiredRoutes) {
  checkRoute(route);
}

checkPackageScript("audit:phase1", "node scripts/phase1-audit.mjs");

const ignoredPathsToCheck = [
  "docs/stitch/_source-zips",
  "docs/stitch/_extracted",
  "docs/source-material/_incoming",
  "docs/source-material/_raw",
];

for (const ignoredPath of ignoredPathsToCheck) {
  if (!exists(".gitignore")) {
    fail(".gitignore missing");
    break;
  }

  const gitignore = read(".gitignore");
  const normalized = `/${ignoredPath}/`;

  if (gitignore.includes(normalized)) {
    pass(`ignored path registered: ${normalized}`);
  } else {
    warn(`ignored path not found in .gitignore: ${normalized}`);
  }
}

const sourceFiles = walkFiles("src/app");
const forbiddenImportPatterns = [
  {
    label: "Firebase Auth import",
    pattern: /from\s+["']firebase\/auth["']|import\s+["']firebase\/auth["']/,
  },
  {
    label: "Firestore import",
    pattern: /from\s+["']firebase\/firestore["']|import\s+["']firebase\/firestore["']/,
  },
  {
    label: "Firebase storage import",
    pattern: /from\s+["']firebase\/storage["']|import\s+["']firebase\/storage["']/,
  },
  {
    label: "Frappe import",
    pattern: /from\s+["'][^"']*frappe[^"']*["']|import\s+["'][^"']*frappe[^"']*["']/i,
  },
  {
    label: "Stripe import",
    pattern: /from\s+["'][^"']*stripe[^"']*["']|import\s+["'][^"']*stripe[^"']*["']/i,
  },
  {
    label: "PayPal import",
    pattern: /from\s+["'][^"']*paypal[^"']*["']|import\s+["'][^"']*paypal[^"']*["']/i,
  },
];

const forbiddenRuntimePatterns = [
  {
    label: "Production API endpoint",
    pattern: /https?:\/\/(?!localhost|127\.0\.0\.1|example\.com|example\.org)[^\s"'`]+\/api\//i,
  },
  {
    label: "Live upload implementation",
    pattern: /uploadBytes|putObject|createPresignedPost|S3Client|StorageBucket/i,
  },
  {
    label: "Live payment checkout",
    pattern: /checkout\.sessions|stripe\.checkout|createPaymentIntent|paypal\.Buttons/i,
  },
];

for (const filePath of sourceFiles) {
  const content = read(filePath);

  for (const rule of forbiddenImportPatterns) {
    if (rule.pattern.test(content)) {
      fail(`${rule.label} found in ${filePath}`);
    }
  }

  for (const rule of forbiddenRuntimePatterns) {
    if (rule.pattern.test(content)) {
      fail(`${rule.label} found in ${filePath}`);
    }
  }
}

if (sourceFiles.length > 0) {
  pass(`scanned ${sourceFiles.length} source files for forbidden production integrations`);
} else {
  warn("No source files found under src/app");
}

if (exists("package.json")) {
  const packageJson = JSON.parse(read("package.json"));
  const dependencies = {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
  };

  const forbiddenPackages = [
    "stripe",
    "@stripe/stripe-js",
    "@paypal/react-paypal-js",
    "frappe-js-sdk",
    "firebase",
  ];

  for (const dependency of forbiddenPackages) {
    if (dependencies[dependency]) {
      warn(`Package present: ${dependency}. Confirm it is not used for real Phase 1 backend/payment/auth work.`);
    }
  }
}

console.log(`Passed: ${result.passed.length}`);
console.log(`Warnings: ${result.warnings.length}`);
console.log(`Failed: ${result.failed.length}`);
console.log("");

if (result.failed.length > 0) {
  console.log("Failures:");
  for (const message of result.failed) console.log(`- ${message}`);
  console.log("");
}

if (result.warnings.length > 0) {
  console.log("Warnings:");
  for (const message of result.warnings) console.log(`- ${message}`);
  console.log("");
}

if (result.failed.length > 0) {
  console.log("Phase 1 audit failed. Fix the failures above.");
  process.exit(1);
}

console.log("Phase 1 audit passed.");
