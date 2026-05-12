import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const routesPath = path.join(root, "src/app/routes.tsx");

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

function includesBetween(text, startMarker, endMarker, needle) {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker, start + startMarker.length);

  if (start === -1 || end === -1) {
    return false;
  }

  return text.slice(start, end).includes(needle);
}

if (!fs.existsSync(routesPath)) {
  console.error(`Missing routes file: ${routesPath}`);
  process.exit(1);
}

const routes = fs.readFileSync(routesPath, "utf8");

add("# Route Guard Audit");
add("");
add(`Generated: ${new Date().toISOString()}`);
add("");

add("## Imports");
if (routes.includes('import { RequireAuth } from "./auth/RequireAuth";')) {
  pass("RequireAuth is imported");
} else {
  fail("RequireAuth import is missing");
}

if (routes.includes('import { RequireAdmin } from "./auth/RequireAdmin";')) {
  pass("RequireAdmin is imported");
} else {
  fail("RequireAdmin import is missing");
}

add("");
add("## Portal guard");
const memberPortalMarker = "      // ── Member Portal";
const adminPortalMarker = "      // ── Admin Portal";
if (includesBetween(routes, memberPortalMarker, adminPortalMarker, "element: <RequireAuth />")) {
  pass("Member portal route group is wrapped by RequireAuth");
} else {
  fail("Member portal route group is not wrapped by RequireAuth");
}

if (
  includesBetween(routes, memberPortalMarker, adminPortalMarker, 'path: "portal"') &&
  includesBetween(routes, memberPortalMarker, adminPortalMarker, "Component: PortalLayout")
) {
  pass("PortalLayout remains in the protected portal group");
} else {
  fail("PortalLayout protected route group could not be confirmed");
}

add("");
add("## Admin guard");
const fallbackMarker = "      // ── Public fallback";
const adminBlockStart = routes.indexOf(adminPortalMarker);
const adminBlockEnd = routes.indexOf(fallbackMarker, adminBlockStart);
const adminBlock = adminBlockStart === -1 || adminBlockEnd === -1 ? "" : routes.slice(adminBlockStart, adminBlockEnd);
const signinIndex = adminBlock.indexOf('path: "signin"');
const requireAdminIndex = adminBlock.indexOf("element: <RequireAdmin />");

if (requireAdminIndex !== -1) {
  pass("Protected admin route group is wrapped by RequireAdmin");
} else {
  fail("Protected admin route group is not wrapped by RequireAdmin");
}

if (adminBlock.includes("Component: AdminLayout") && requireAdminIndex !== -1) {
  pass("AdminLayout remains in the protected admin group");
} else {
  fail("AdminLayout protected route group could not be confirmed");
}

if (signinIndex !== -1 && (requireAdminIndex === -1 || signinIndex < requireAdminIndex)) {
  pass("/admin/signin is declared before the RequireAdmin protected group");
} else {
  fail("/admin/signin appears to be missing or behind RequireAdmin");
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Portal and admin route guards are structurally present.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
