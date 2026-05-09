const smokeGroups = {
  "Public navigation": [
    "/",
    "/membership",
    "/membership/overview",
    "/membership/remote-business-partner-membership",
    "/offers",
    "/resources",
    "/help",
    "/contact",
  ],
  "Membership purchase flow": [
    "/membership/sign-up-now",
    "/membership/confirmation",
    "/portal/dashboard",
  ],
  "Decision Desk flow": [
    "/on-demand/decision-desk",
    "/portal/services",
    "/admin/requests/decision-desk",
  ],
  "DocuShare flow": [
    "/document-nucleus/overview",
    "/document-nucleus/brief",
    "/document-nucleus/category/templates",
    "/document-nucleus/product/template-policy-001",
    "/portal/documents",
    "/admin/requests/docushare",
  ],
  "Marketplace flow": [
    "/marketplace",
    "/marketplace/product/market-001",
    "/marketplace/enquiry/market-001",
    "/marketplace/listing/new",
    "/admin/marketplace",
  ],
  "Connectivity flow": [
    "/operations/connectivity",
    "/operations/connectivity/nbn-phone",
    "/operations/connectivity/superloop",
    "/operations/superloop",
    "/portal/services",
    "/admin/requests/connectivity",
  ],
  "Risk Advisor flow": [
    "/on-demand/risk-advisor",
    "/portal/services",
    "/admin/requests/risk-advisor",
  ],
  "The Fixer flow": [
    "/on-demand/the-fixer",
    "/portal/services",
    "/admin/requests/fixer",
  ],
  "Portal dashboard/status views": [
    "/portal/dashboard",
    "/portal/services",
    "/portal/documents",
    "/portal/offers",
    "/portal/apps",
    "/portal/resources",
    "/portal/support",
    "/portal/settings",
  ],
  "Admin review concepts": [
    "/admin/dashboard",
    "/admin/content",
    "/admin/requests",
    "/admin/marketplace",
    "/admin/membership",
    "/admin/auditadmin/dashboard",
    "/admin/content",
    "/admin/requests",
    "/admin/marketplace",
    "/admin/membership",
    "/admin/audit-review",
    "/admin/settings",
  ],
  "Legal and fallback": [
    "/legal/privacy-policy",
    "/legal/terms-of-use",
    "/legal/payment-policy",
    "/not-a-real-route",
  ],
};

console.log("Phase 1 Smoke Test Route Matrix");
console.log("================================");
console.log("");

let total = 0;

for (const [group, routes] of Object.entries(smokeGroups)) {
  console.log(group);
  console.log("-".repeat(group.length));
  for (const route of routes) {
    total += 1;
    console.log(`- ${route}`);
  }
  console.log("");
}

console.log(`Total routes listed: ${total}`);
console.log("");
console.log("Manual browser review is still required. This helper lists routes; it does not prove pixels behave.");
