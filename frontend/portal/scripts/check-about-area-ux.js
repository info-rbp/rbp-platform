const fs = require("fs");
const path = require("path");

const root = process.cwd();

const filesToCheck = [
"src/app/data/publicNavigation.ts",
"src/app/routes.tsx",
"src/app/pages/AboutPage.tsx",
"src/app/pages/ContactPage.tsx",
"src/app/pages/about/OurPlatformPage.tsx",
"src/app/pages/about/DiscoveryCallPage.tsx",
"src/app/pages/about/WorkWithUsPage.tsx",
"src/app/pages/about/WorkForUsPage.tsx",
];

const requiredRoutes = [
"/about",
"/about/our-platform",
"/about/discovery-call",
"/about/work-with-us",
"/about/work-for-us",
"/contact",
];

const badPatterns = [
{
label: "Discovery Call should not route to Contact query",
pattern: "/contact?reason=discovery-call",
},
{
label: "Public pages should not mention Phase 1 shell",
pattern: "Phase 1 shell",
},
{
label: "Public pages should not mention mock confirmation",
pattern: "mock confirmation",
},
{
label: "Public pages should not mention no backend submission",
pattern: "No real email or backend submission",
},
{
label: "Placeholder phone number should not appear",
pattern: "+1 (234) 567-890",
},
];

const expectedNavigationLinks = [
'{ label: "About Us", href: "/about" }',
'{ label: "Our Platform", href: "/about/our-platform" }',
'{ label: "Discovery Call", href: "/about/discovery-call" }',
'{ label: "Work With Us", href: "/about/work-with-us" }',
'{ label: "Work For Us", href: "/about/work-for-us" }',
'{ label: "Contact Us", href: "/contact" }',
];

const errors = [];
const warnings = [];

function readFile(relativePath) {
const absolutePath = path.join(root, relativePath);

if (!fs.existsSync(absolutePath)) {
errors.push(Missing file: ${relativePath});
return "";
}

return fs.readFileSync(absolutePath, "utf8");
}

const fileContents = new Map();

for (const file of filesToCheck) {
fileContents.set(file, readFile(file));
}

const allContent = Array.from(fileContents.values()).join("\n\n");

for (const route of requiredRoutes) {
if (!allContent.includes(route) && route !== "/about") {
warnings.push(Route/path string not found in checked files: ${route});
}
}

const navigation = fileContents.get("src/app/data/publicNavigation.ts") || "";

for (const navLink of expectedNavigationLinks) {
if (!navigation.includes(navLink)) {
errors.push(Missing About Us navigation link: ${navLink});
}
}

for (const file of filesToCheck) {
const content = fileContents.get(file) || "";

for (const item of badPatterns) {
if (content.includes(item.pattern)) {
errors.push(${item.label} in ${file}: found "${item.pattern}");
}
}
}

const routes = fileContents.get("src/app/routes.tsx") || "";

const routeChecks = [
'path: "about/our-platform"',
'path: "about/discovery-call"',
'path: "about/work-with-us"',
'path: "about/work-for-us"',
];

for (const routeCheck of routeChecks) {
if (!routes.includes(routeCheck)) {
errors.push(Missing route entry in routes.tsx: ${routeCheck});
}
}

console.log("About area UX conversion check");
console.log("--------------------------------");

if (warnings.length) {
console.log("\nWarnings:");
for (const warning of warnings) {
console.log(- ${warning});
}
}

if (errors.length) {
console.log("\nErrors:");
for (const error of errors) {
console.log(- ${error});
}

process.exit(1);
}

console.log("All About area UX conversion checks passed.");
