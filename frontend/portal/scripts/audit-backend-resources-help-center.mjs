import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/lib/firebase.ts",
  "src/app/services/publicContentBackend.ts",
  "src/app/hooks/usePublicBackendContent.ts",
  "src/app/components/admin/AdminBackendContentWorkspace.tsx",
  "src/app/components/admin/index.ts",
  "src/app/pages/ResourcesPage.tsx",
  "src/app/pages/HelpCenterPage.tsx",
  "src/app/pages/admin/AdminCrudPage.tsx",
  "docs/backend-resources-help-center.md",
  ".env.example",
];

const firebaseMarkers = [
  "initializeApp",
  "getFirestore",
  "isFirebaseConfigured",
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_PROJECT_ID",
];

const serviceMarkers = [
  "listResourceRecords",
  "listHelpArticleRecords",
  "saveResourceRecord",
  "saveHelpArticleRecord",
  "archiveResourceRecord",
  "archiveHelpArticleRecord",
  "seedStaticResourcesToFirestore",
  "seedStaticHelpArticlesToFirestore",
  "resources",
  "helpArticles",
];

const hookMarkers = [
  "usePublicBackendContent",
  "listResourceRecords",
  "listHelpArticleRecords",
  "backendEnabled",
];

const adminMarkers = [
  "AdminBackendContentWorkspace",
  "ResourcesBackendWorkspace",
  "HelpCenterBackendWorkspace",
  "seedStaticResourcesToFirestore",
  "seedStaticHelpArticlesToFirestore",
  "saveResourceRecord",
  "saveHelpArticleRecord",
];

const pageMarkers = [
  "usePublicBackendContent",
  "resources.filter",
  "structuredHelpArticles.filter",
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

add("# Backend Resources and Help Center Audit");
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
add("## Dependency checks");

if (exists("package.json")) {
  const pkg = JSON.parse(read("package.json"));

  if (pkg.dependencies?.firebase) {
    pass(`firebase dependency present: ${pkg.dependencies.firebase}`);
  } else {
    fail("firebase dependency missing from package.json");
  }
}

checkMarkers("src/app/lib/firebase.ts", firebaseMarkers, "Firebase client checks");
checkMarkers("src/app/services/publicContentBackend.ts", serviceMarkers, "Backend service checks");
checkMarkers("src/app/hooks/usePublicBackendContent.ts", hookMarkers, "Public backend hook checks");
checkMarkers("src/app/components/admin/AdminBackendContentWorkspace.tsx", adminMarkers, "Admin backend workspace checks");

add("");
add("## Page wiring checks");

if (exists("src/app/pages/ResourcesPage.tsx")) {
  const resourcesPage = read("src/app/pages/ResourcesPage.tsx");

  if (resourcesPage.includes("usePublicBackendContent") && resourcesPage.includes("resources.filter")) {
    pass("ResourcesPage uses backend-aware content hook");
  } else {
    fail("ResourcesPage is not wired to backend-aware content hook");
  }
}

if (exists("src/app/pages/HelpCenterPage.tsx")) {
  const helpPage = read("src/app/pages/HelpCenterPage.tsx");

  if (helpPage.includes("usePublicBackendContent") && helpPage.includes("structuredHelpArticles.filter")) {
    pass("HelpCenterPage uses backend-aware content hook");
  } else {
    fail("HelpCenterPage is not wired to backend-aware content hook");
  }
}

if (exists("src/app/pages/admin/AdminCrudPage.tsx")) {
  const adminPage = read("src/app/pages/admin/AdminCrudPage.tsx");

  if (adminPage.includes("AdminBackendContentWorkspace")) {
    pass("AdminCrudPage renders backend content workspace");
  } else {
    fail("AdminCrudPage does not render backend content workspace");
  }
}

add("");
add("## Environment example checks");

if (exists(".env.example")) {
  const env = read(".env.example");
  const envMarkers = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
  ];

  for (const marker of envMarkers) {
    if (env.includes(marker)) {
      pass(`Environment marker present: ${marker}`);
    } else {
      fail(`Environment marker missing: ${marker}`);
    }
  }
}

add("");
add("## Documentation checks");

if (exists("docs/backend-resources-help-center.md")) {
  const doc = read("docs/backend-resources-help-center.md");
  const terms = ["resources", "helpArticles", "Firebase", "Firestore", "static fallback"];

  const missing = terms.filter((term) => !doc.includes(term));

  if (missing.length === 0) {
    pass("Backend Resources and Help Center documentation contains expected terms");
  } else {
    fail(`Backend Resources and Help Center documentation missing terms: ${missing.join(", ")}`);
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Resources and Help Center backend phase is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/backend-resources-help-center-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
