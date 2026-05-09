import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/data/publicSitemap.ts",
  "src/app/data/publicNavigation.ts",
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
  "src/app/routes.tsx"
];

const wiredPageChecks = [
  {
    page: "src/app/pages/ResourcesPage.tsx",
    imports: ["../data/resources", "../hooks/usePublicBackendContent"],
    markers: ["usePublicBackendContent", "resourceTypeFilters", "resourceCategoryFilters", "resources.filter"]
  },
  {
    page: "src/app/pages/OffersPage.tsx",
    imports: ["../data/offers"],
    markers: ["publicOffers", "offerCategoryFilters"]
  },
  {
    page: "src/app/pages/HelpCenterPage.tsx",
    imports: ["../data/helpCenter", "../hooks/usePublicBackendContent"],
    markers: ["usePublicBackendContent", "helpSections", "structuredHelpArticles.filter"]
  },
  {
    page: "src/app/pages/BusinessApplicationsPage.tsx",
    imports: ["../data/applications"],
    markers: ["applicationCategories"]
  },
  {
    page: "src/app/pages/ServicesPage.tsx",
    imports: ["../data/onDemandServices"],
    markers: ["advisoryCategories"]
  },
  {
    page: "src/app/pages/ManagedServicesPage.tsx",
    imports: ["../data/managedServices"],
    markers: ["managedServices"]
  }
];

const anchorChecks = [
  {
    page: "src/app/pages/ServicesPage.tsx",
    sources: ["src/app/data/onDemandServices.ts"],
    anchors: [
      "operations-advisory",
      "human-resource-advisory",
      "accounting-finance",
      "sales-marketing",
      "management-consulting",
      "change-management",
      "ai-advisory",
      "research-development",
      "information-technology",
      "public-relations",
      "customised-solutions"
    ]
  },
  {
    page: "src/app/pages/ManagedServicesPage.tsx",
    sources: ["src/app/data/managedServices.ts"],
    anchors: [
      "document-management",
      "change-management",
      "business-sale-support",
      "franchise",
      "lms",
      "custom-solutions",
      "engagement-process"
    ]
  },
  {
    page: "src/app/pages/BusinessApplicationsPage.tsx",
    sources: ["src/app/data/applications.ts"],
    anchors: [
      "how-these-work",
      "integrations",
      "operations-finance",
      "people-hr",
      "sales-crm",
      "documents",
      "support-desk",
      "learning",
      "analytics",
      "payments-billing",
      "fleet-management",
      "business-watchlist"
    ]
  },
  {
    page: "src/app/pages/MarketplacePage.tsx",
    sources: [],
    anchors: [
      "rbp-products",
      "rbp-assets",
      "third-party-products-assets",
      "buying-process",
      "list-with-us"
    ]
  },
  {
    page: "src/app/pages/OffersPage.tsx",
    sources: [],
    anchors: ["exclusive", "top"]
  }
];

const queryChecks = [
  {
    page: "src/app/pages/ContactPage.tsx",
    markers: ["useSearchParams", "reasonLabels", "reasonTitles", "selectedReasonTitle"]
  },
  {
    page: "src/app/pages/OffersPage.tsx",
    markers: ["useSearchParams", "selectedCategory", "filteredOffers"]
  },
  {
    page: "src/app/pages/ResourcesPage.tsx",
    markers: ["useSearchParams", "selectedType", "selectedCategory", "filteredResources"]
  },
  {
    page: "src/app/pages/HelpCenterPage.tsx",
    markers: ["useSearchParams", "sectionParam", "categoryParam", "querySectionLabel"]
  }
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

function countMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function hasAnchor(text, anchor) {
  return (
    text.includes(`id="${anchor}"`) ||
    text.includes(`id='${anchor}'`) ||
    text.includes(`id: "${anchor}"`) ||
    text.includes(`id: '${anchor}'`)
  );
}

const report = [];
let failures = 0;

function add(line = "") {
  report.push(line);
}

function pass(message) {
  add(`✅ ${message}`);
}

function warn(message) {
  add(`⚠️ ${message}`);
}

function fail(message) {
  failures += 1;
  add(`❌ ${message}`);
}

add("# Public Content Readiness Audit");
add("");
add(`Generated: ${new Date().toISOString()}`);
add("");

add("## Required foundation files");
for (const file of requiredFiles) {
  if (exists(file)) {
    pass(file);
  } else {
    fail(`${file} is missing`);
  }
}

add("");
add("## Page wiring checks");
for (const check of wiredPageChecks) {
  if (!exists(check.page)) {
    fail(`${check.page} is missing`);
    continue;
  }

  const text = read(check.page);
  const missingImports = check.imports.filter((item) => !text.includes(item));
  const missingMarkers = check.markers.filter((item) => !text.includes(item));

  if (missingImports.length === 0 && missingMarkers.length === 0) {
    pass(`${check.page} is wired to public content data`);
  } else {
    if (missingImports.length) {
      fail(`${check.page} missing imports: ${missingImports.join(", ")}`);
    }
    if (missingMarkers.length) {
      fail(`${check.page} missing markers: ${missingMarkers.join(", ")}`);
    }
  }
}

add("");
add("## Anchor destination checks");
for (const check of anchorChecks) {
  if (!exists(check.page)) {
    fail(`${check.page} is missing`);
    continue;
  }

  const pageText = read(check.page);
  const sourceTexts = (check.sources || [])
    .filter((source) => {
      if (!exists(source)) {
        warn(`${check.page} references missing anchor source ${source}`);
        return false;
      }
      return true;
    })
    .map((source) => read(source));

  const combinedText = [pageText, ...sourceTexts].join("\n");
  const rendersDynamicIds =
    pageText.includes("id={item.id}") ||
    pageText.includes("id={service.id}") ||
    pageText.includes("id={section.id}");

  const missing = check.anchors.filter((anchor) => !hasAnchor(combinedText, anchor));

  if (missing.length === 0 && (rendersDynamicIds || check.sources.length === 0)) {
    pass(`${check.page} has expected anchor markers`);
  } else if (missing.length === 0) {
    warn(`${check.page} has anchor data but dynamic id rendering was not detected`);
  } else {
    fail(`${check.page} missing anchor markers: ${missing.join(", ")}`);
  }
}

add("");
add("## Query parameter handling checks");
for (const check of queryChecks) {
  if (!exists(check.page)) {
    fail(`${check.page} is missing`);
    continue;
  }

  const text = read(check.page);
  const missing = check.markers.filter((marker) => !text.includes(marker));

  if (missing.length === 0) {
    pass(`${check.page} handles expected query state`);
  } else {
    fail(`${check.page} missing query markers: ${missing.join(", ")}`);
  }
}

add("");
add("## Sitemap status summary");

if (exists("src/app/data/publicSitemap.ts")) {
  const sitemap = read("src/app/data/publicSitemap.ts");

  const statuses = [
    "ready",
    "placeholder",
    "content-required",
    "backend-later",
    "legal-review-required"
  ];

  for (const status of statuses) {
    const count = countMatches(sitemap, new RegExp(`status: "${status}"`, "g"));
    add(`- ${status}: ${count}`);
  }

  const backendRequired = countMatches(sitemap, /backendRequired: true/g);
  const totalItems = countMatches(sitemap, /title: "/g);

  add("");
  add(`Total sitemap items detected: ${totalItems}`);
  add(`Backend-required items detected: ${backendRequired}`);
} else {
  fail("Cannot summarise sitemap because publicSitemap.ts is missing");
}

add("");
add("## Recommended next content priorities");
add("");
add("1. Review legal and payment wording before launch.");
add("2. Expand Membership pricing and sign-up copy after commercial decisions are final.");
add("3. Add richer Marketplace listings before backend work.");
add("4. Add more Help Center, Offers, and Resources records before admin editing.");
add("5. Prepare admin content models from the static data structure.");
add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Public content foundation is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
const outputPath = filePath("docs/public-content-readiness-audit.md");

fs.writeFileSync(outputPath, output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
