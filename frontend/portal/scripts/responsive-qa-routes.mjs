const breakpoints = [
  ["Mobile small", "360px"],
  ["Mobile", "390px"],
  ["Mobile large", "430px"],
  ["Tablet", "768px"],
  ["Tablet large", "834px"],
  ["Tablet wide", "1024px"],
  ["Desktop", "1280px"],
  ["Desktop large", "1440px"],
  ["Wide", "1920px"],
];

const routeGroups = {
  "Public website": [
    "/",
    "/membership",
    "/membership/overview",
    "/membership/sign-up-now",
    "/membership/confirmation",
    "/on-demand/decision-desk",
    "/on-demand/risk-advisor",
    "/on-demand/the-fixer",
    "/document-nucleus/overview",
    "/document-nucleus/brief",
    "/marketplace",
    "/marketplace/product/market-001",
    "/marketplace/enquiry/market-001",
    "/marketplace/listing/new",
    "/operations/connectivity",
    "/operations/connectivity/nbn-phone",
    "/operations/connectivity/superloop",
    "/offers",
    "/resources",
    "/help",
    "/contact",
  ],
  Portal: [
    "/portal/dashboard",
    "/portal/services",
    "/portal/documents",
    "/portal/offers",
    "/portal/apps",
    "/portal/resources",
    "/portal/support",
    "/portal/settings",
  ],
  Admin: [
    "/admin/dashboard",
    "/admin/content",
    "/admin/requests",
    "/admin/requests/decision-desk",
    "/admin/requests/docushare",
    "/admin/requests/connectivity",
    "/admin/requests/risk-advisor",
    "/admin/requests/fixer",
    "/admin/marketplace",
    "/admin/membership",
    "/admin/audit-review",
    "/admin/settings",
  ],
};

console.log("Phase 1 Responsive QA Route Matrix");
console.log("==================================");
console.log("");

console.log("Breakpoints:");
for (const [label, width] of breakpoints) {
  console.log(`- ${label}: ${width}`);
}

console.log("");

let totalRoutes = 0;

for (const [group, routes] of Object.entries(routeGroups)) {
  totalRoutes += routes.length;
  console.log(`${group}:`);
  for (const route of routes) {
    console.log(`- ${route}`);
  }
  console.log("");
}

console.log(`Total routes listed for responsive QA: ${totalRoutes}`);
console.log("");
console.log("Manual review still required. This script is a route checklist helper, not a browser automation test.");
