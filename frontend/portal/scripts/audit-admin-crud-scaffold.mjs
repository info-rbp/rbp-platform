import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/pages/admin/AdminCrudPage.tsx",
  "src/app/data/adminContentModel.ts",
  "src/app/routes.tsx",
  "src/app/pages/admin/AdminLayout.tsx",
  "docs/admin-crud-scaffold.md",
];

const requiredRouteMarkers = [
  'import { AdminCrudPage } from "./pages/admin/AdminCrudPage";',
  '{ path: "on-demand", Component: AdminCrudPage }',
  '{ path: "on-demand/*", Component: AdminCrudPage }',
  '{ path: "managed-services", Component: AdminCrudPage }',
  '{ path: "managed-services/*", Component: AdminCrudPage }',
  '{ path: "applications", Component: AdminCrudPage }',
  '{ path: "applications/*", Component: AdminCrudPage }',
  '{ path: "operations", Component: AdminCrudPage }',
  '{ path: "operations/*", Component: AdminCrudPage }',
  '{ path: "marketplace", Component: AdminCrudPage }',
  '{ path: "marketplace/*", Component: AdminCrudPage }',
  '{ path: "membership", Component: AdminCrudPage }',
  '{ path: "membership/*", Component: AdminCrudPage }',
  '{ path: "offers", Component: AdminCrudPage }',
  '{ path: "offers/*", Component: AdminCrudPage }',
  '{ path: "resources", Component: AdminCrudPage }',
  '{ path: "resources/*", Component: AdminCrudPage }',
  '{ path: "help-center", Component: AdminCrudPage }',
  '{ path: "help-center/*", Component: AdminCrudPage }',
  '{ path: "site-content", Component: AdminCrudPage }',
  '{ path: "site-content/*", Component: AdminCrudPage }',
  '{ path: "settings", Component: AdminCrudPage }',
  '{ path: "settings/*", Component: AdminCrudPage }',
];

const requiredComponentMarkers = [
  "export function AdminCrudPage",
  "adminContentEntities",
  "getEntityForPath",
  "createFallbackEntity",
  "createRows",
  "Admin CRUD Scaffold",
  "Backend Required",
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

add("# Admin CRUD Scaffold Audit");
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
add("## Route checks");

if (exists("src/app/routes.tsx")) {
  const routes = read("src/app/routes.tsx");

  for (const marker of requiredRouteMarkers) {
    if (routes.includes(marker)) {
      pass(`Route marker present: ${marker}`);
    } else {
      fail(`Route marker missing: ${marker}`);
    }
  }
}

add("");
add("## Component checks");

if (exists("src/app/pages/admin/AdminCrudPage.tsx")) {
  const component = read("src/app/pages/admin/AdminCrudPage.tsx");

  for (const marker of requiredComponentMarkers) {
    if (component.includes(marker)) {
      pass(`Component marker present: ${marker}`);
    } else {
      fail(`Component marker missing: ${marker}`);
    }
  }
}

add("");
add("## Layout link coverage");

if (exists("src/app/pages/admin/AdminLayout.tsx") && exists("src/app/routes.tsx")) {
  const layout = read("src/app/pages/admin/AdminLayout.tsx");
  const routes = read("src/app/routes.tsx");

  const adminGroups = [
    "/admin/on-demand",
    "/admin/managed-services",
    "/admin/applications",
    "/admin/operations",
    "/admin/marketplace",
    "/admin/membership",
    "/admin/offers",
    "/admin/resources",
    "/admin/help-center",
    "/admin/site-content",
    "/admin/settings",
  ];

  for (const group of adminGroups) {
    const groupKey = group.replace("/admin/", "");
    const routeMarker = `{ path: "${groupKey}`;
    if (layout.includes(group) && routes.includes(routeMarker)) {
      pass(`Sidebar group has route coverage: ${group}`);
    } else {
      fail(`Sidebar group missing route coverage: ${group}`);
    }
  }
}

add("");
add("## Audit result");
add("");

if (failures === 0) {
  add("✅ Audit passed. Admin CRUD scaffolding is structurally ready.");
} else {
  add(`❌ Audit found ${failures} issue(s). Fix these before continuing.`);
}

const output = report.join("\n");
fs.writeFileSync(filePath("docs/admin-crud-scaffold-audit.md"), output);
console.log(output);

if (failures > 0) {
  process.exitCode = 1;
}
