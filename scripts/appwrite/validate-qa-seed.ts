import path from "node:path";
import { readJson } from "./_lib";

const root = path.join(process.cwd(), "appwrite", "seeds", "qa");
const users = readJson<Array<Record<string, unknown>>>(path.join(root, "users.json"));
const tenants = readJson<Array<Record<string, unknown>>>(path.join(root, "tenants.json"));
const plans = readJson<Array<Record<string, unknown>>>(path.join(root, "membership_plans.json"));
const applications = readJson<Array<Record<string, unknown>>>(path.join(root, "applications.json"));
const interest = readJson<Array<Record<string, unknown>>>(path.join(root, "application_interest.json"));
const notifications = readJson<Array<Record<string, unknown>>>(path.join(root, "notifications.json"));
const serviceRequests = readJson<Array<Record<string, unknown>>>(path.join(root, "service_requests.json"));

const requiredUsers = [
  "qa.free@remotebusinesspartner.com.au",
  "qa.premium@remotebusinesspartner.com.au",
  "qa.admin@remotebusinesspartner.com.au",
  "qa.support@remotebusinesspartner.com.au",
];

for (const email of requiredUsers) {
  if (!users.find((user) => user.email === email)) {
    console.error(`Missing QA user seed: ${email}`);
    process.exit(1);
  }
}

if (!tenants.length) {
  console.error("Missing tenant seed data.");
  process.exit(1);
}

if (!plans.find((plan) => String(plan.plan_code) === "free") || !plans.find((plan) => String(plan.plan_code) === "premium")) {
  console.error("Missing free or premium membership plan seed data.");
  process.exit(1);
}

if (!applications.length) {
  console.error("Missing application seed data.");
  process.exit(1);
}

if (!interest.length) {
  console.error("Missing application interest seed data.");
  process.exit(1);
}

if (!notifications.length) {
  console.error("Missing notification seed data.");
  process.exit(1);
}

if (!serviceRequests.length) {
  console.error("Missing service request seed data.");
  process.exit(1);
}

console.log("QA seed validation passed for users, tenants, plans, applications, interest, notifications, and service requests.");