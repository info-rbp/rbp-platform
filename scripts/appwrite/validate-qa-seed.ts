import path from "node:path";
import { readJson } from "./_lib";

const users = readJson<Array<Record<string, unknown>>>(path.join(process.cwd(), "appwrite", "seeds", "qa", "users.json"));
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

console.log("QA seed validation passed for required user accounts.");
