const checkName = process.argv[2];
const shouldExecute = process.argv.includes("--execute");

const checks = {
  auth: {
    description: "Validate Appwrite auth smoke prerequisites.",
    env: ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "VITE_APPWRITE_ENDPOINT", "VITE_APPWRITE_PROJECT_ID"],
  },
  billing: {
    description: "Validate Stripe checkout smoke prerequisites.",
    env: [
      "APPWRITE_ENDPOINT",
      "APPWRITE_PROJECT_ID",
      "APPWRITE_API_KEY",
      "STRIPE_SECRET_KEY",
      "STRIPE_SUCCESS_URL",
      "STRIPE_CANCEL_URL",
    ],
  },
  "stripe-webhook": {
    description: "Validate Stripe webhook smoke prerequisites.",
    env: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY"],
  },
  "service-requests": {
    description: "Validate service-request smoke prerequisites.",
    env: ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"],
  },
  admin: {
    description: "Validate admin smoke prerequisites.",
    env: [
      "APPWRITE_ENDPOINT",
      "APPWRITE_PROJECT_ID",
      "APPWRITE_API_KEY",
      "APPWRITE_DATABASE_ID",
      "APPWRITE_ADMIN_TEAM_ID",
    ],
  },
  permissions: {
    description: "Validate permissions smoke prerequisites.",
    env: ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"],
  },
};

if (!checkName || !(checkName in checks)) {
  console.error(`Unknown or missing smoke check name: ${checkName ?? "<none>"}`);
  console.error(`Available checks: ${Object.keys(checks).join(", ")}`);
  process.exit(1);
}

const check = checks[checkName];
const missing = check.env.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Smoke check \"${checkName}\" blocked: missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

if (!shouldExecute) {
  console.log(`Smoke check \"${checkName}\" is configured.`);
  console.log(`${check.description} Pass --execute once reachable QA services and credentials are available.`);
  process.exit(0);
}

console.error(`Smoke check \"${checkName}\" execution is not yet implemented beyond prerequisite validation.`);
console.error("This repository now fails clearly instead of silently passing, but live smoke execution still needs follow-up implementation.");
process.exit(1);