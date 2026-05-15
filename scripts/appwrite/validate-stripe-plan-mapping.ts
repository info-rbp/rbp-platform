import path from "node:path";
import { readJson } from "./_lib";

const plans = readJson<Array<Record<string, unknown>>>(path.join(process.cwd(), "appwrite", "seeds", "qa", "membership_plans.json"));
const premium = plans.find((plan) => String(plan.plan_code) === "premium");

if (!premium) {
  console.error("Missing premium membership plan in seed data.");
  process.exit(1);
}

if (!premium.stripe_price_id) {
  console.error("Premium membership plan is missing stripe_price_id.");
  process.exit(1);
}

console.log("Stripe plan mapping validation passed.");
