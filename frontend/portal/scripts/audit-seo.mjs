import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/config/seo.ts",
  "src/app/config/structuredData.ts",
  "src/app/components/SEO.tsx",
  "public/robots.txt",
  "public/sitemap.xml",
];

const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/core-services",
  "/core-services/decision-desk",
  "/core-services/risk-advisor",
  "/core-services/the-fixer",
  "/docushare",
  "/document-nucleus/overview",
  "/operations/connectivity/nbn-phone",
  "/marketplace",
  "/membership",
  "/applications",
  "/offers",
  "/resources",
  "/help",
  "/legal/privacy-policy",
  "/legal/terms",
];

const forbiddenApplicationPhrases = [
  "Open app",
  "Launch app",
  "Request setup",
  "Available now",
  "Provision instantly",
];

let failed = false;

function fail(message) {
  console.error(`SEO audit failed: ${message}`);
  failed = true;
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    fail(`Missing required file: ${file}`);
  }
}

const seoPath = path.join(root, "src/app/config/seo.ts");
const seoText = fs.existsSync(seoPath) ? fs.readFileSync(seoPath, "utf8") : "";

for (const route of publicRoutes) {
  if (!seoText.includes(`"${route}"`)) {
    fail(`Missing SEO registry entry for ${route}`);
  }
}

if (!seoText.includes("noindex,nofollow")) {
  fail("SEO registry must include noindex,nofollow for protected routes.");
}

const applicationPages = [
  path.join(root, "src/app/pages/BusinessApplicationsPage.tsx"),
  path.join(root, "src/app/pages/portal/PortalApps.tsx"),
];

for (const candidate of applicationPages) {
  if (!fs.existsSync(candidate)) continue;
  const text = fs.readFileSync(candidate, "utf8");
  for (const phrase of forbiddenApplicationPhrases) {
    if (text.includes(phrase)) {
      fail(`Forbidden Applications phrase \"${phrase}\" found in ${candidate}`);
    }
  }
}

const robots = fs.existsSync(path.join(root, "public/robots.txt"))
  ? fs.readFileSync(path.join(root, "public/robots.txt"), "utf8")
  : "";

for (const protectedPath of ["/portal/", "/admin/", "/signin", "/signup", "/signout"]) {
  if (!robots.includes(`Disallow: ${protectedPath}`)) {
    fail(`robots.txt must disallow ${protectedPath}`);
  }
}

if (failed) process.exit(1);
console.log("SEO audit passed.");
