import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const routesPath = path.join(root, "src/app/routes.tsx");
const navPath = path.join(root, "src/app/data/publicNavigation.ts");

if (!fs.existsSync(routesPath)) {
  console.error("[route-smoke] Missing routes file:", routesPath);
  process.exit(1);
}

if (!fs.existsSync(navPath)) {
  console.error("[route-smoke] Missing public navigation file:", navPath);
  process.exit(1);
}

const routesSource = fs.readFileSync(routesPath, "utf8");
const navSource = fs.readFileSync(navPath, "utf8");

const routePaths = new Set();
const routePattern = /path:\s*["'`]([^"'`]+)["'`]/g;

let match;
while ((match = routePattern.exec(routesSource))) {
  routePaths.add(match[1]);
}

const navLinks = [];
const hrefPattern = /href:\s*["'`]([^"'`]+)["'`]/g;

while ((match = hrefPattern.exec(navSource))) {
  navLinks.push(match[1]);
}

function cleanHref(href) {
  return href.split("?")[0].split("#")[0].replace(/^\/+/, "").replace(/\/+$/, "");
}

function routeToRegex(route) {
  const cleaned = route.replace(/^\/+/, "").replace(/\/+$/, "");
  const parts = cleaned.split("/").map((part) => {
    if (part === "*") return ".*";
    if (part.startsWith(":")) return "[^/]+";
    return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });
  return new RegExp(`^${parts.join("/")}$`);
}

const routeRegexes = [...routePaths].map(routeToRegex);

const failures = [];

for (const href of navLinks) {
  if (!href.startsWith("/")) continue;

  const cleaned = cleanHref(href);

  if (cleaned === "") continue;

  const exactMatch = routePaths.has(cleaned);
  const dynamicMatch = routeRegexes.some((regex) => regex.test(cleaned));

  const parentRouteMatch = [...routePaths].some((route) => {
    const routeCleaned = route.replace(/^\/+/, "").replace(/\/+$/, "");
    return routeCleaned && cleaned.startsWith(`${routeCleaned}/`);
  });

  if (!exactMatch && !dynamicMatch && !parentRouteMatch) {
    failures.push(href);
  }
}

const requiredScripts = ["build", "typecheck", "lint", "test", "test:e2e", "route:smoke", "qa"];
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const missingScripts = requiredScripts.filter((script) => !pkg.scripts?.[script]);

if (missingScripts.length > 0) {
  console.error("[route-smoke] Missing package scripts:");
  for (const script of missingScripts) console.error(`  - ${script}`);
  process.exit(1);
}

if (failures.length > 0) {
  console.error("[route-smoke] Navigation links without matching routes:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`[route-smoke] Checked ${navLinks.length} navigation links.`);
console.log(`[route-smoke] Checked ${routePaths.size} route path declarations.`);
console.log("[route-smoke] OK");
