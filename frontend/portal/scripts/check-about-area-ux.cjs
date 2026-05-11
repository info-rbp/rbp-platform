const fs = require("fs");
const path = require("path");

const root = process.cwd();
const errors = [];

function read(relativePath) {
  const fullPath = path.join(root, relativePath);

  if (!fs.existsSync(fullPath)) {
    errors.push("Missing file: " + relativePath);
    return "";
  }

  return fs.readFileSync(fullPath, "utf8");
}

function walk(dir, result = []) {
  if (!fs.existsSync(dir)) return result;

  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath, result);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      result.push(fullPath);
    }
  }

  return result;
}

const navigation = read("src/app/data/publicNavigation.ts");
const routes = read("src/app/routes.tsx");
read("src/app/components/Footer.tsx");
read("src/app/pages/AboutPage.tsx");
read("src/app/pages/ContactPage.tsx");
read("src/app/pages/about/OurPlatformPage.tsx");
read("src/app/pages/about/DiscoveryCallPage.tsx");
read("src/app/pages/about/WorkWithUsPage.tsx");
read("src/app/pages/about/WorkForUsPage.tsx");

const expectedNavigationLinks = [
  '{ label: "About Us", href: "/about" }',
  '{ label: "Our Platform", href: "/about/our-platform" }',
  '{ label: "Discovery Call", href: "/about/discovery-call" }',
  '{ label: "Work With Us", href: "/about/work-with-us" }',
  '{ label: "Work For Us", href: "/about/work-for-us" }',
  '{ label: "Contact Us", href: "/contact" }',
];

for (const link of expectedNavigationLinks) {
  if (!navigation.includes(link)) {
    errors.push("Missing About Us navigation link: " + link);
  }
}

const expectedRoutes = [
  'path: "about/our-platform"',
  'path: "about/discovery-call"',
  'path: "about/work-with-us"',
  'path: "about/work-for-us"',
];

for (const route of expectedRoutes) {
  if (!routes.includes(route)) {
    errors.push("Missing route entry: " + route);
  }
}

const badPatterns = [
  "/contact?reason=discovery-call",
  "Phase 1 shell",
  "mock confirmation",
  "+1 (234) 567-890",
];

const sourceFiles = walk(path.join(root, "src/app"));

for (const fullPath of sourceFiles) {
  const content = fs.readFileSync(fullPath, "utf8");
  const relativePath = path.relative(root, fullPath);

  for (const pattern of badPatterns) {
    if (content.includes(pattern)) {
      errors.push('Bad pattern "' + pattern + '" found in ' + relativePath);
    }
  }
}

console.log("About area UX conversion check");
console.log("--------------------------------");

if (errors.length > 0) {
  console.log("Errors:");
  for (const error of errors) {
    console.log("- " + error);
  }
  process.exit(1);
}

console.log("All About area UX conversion checks passed.");
