import path from "node:path";
import { readJson } from "./_lib";

const plans = readJson<Array<Record<string, unknown>>>(path.join(process.cwd(), "appwrite", "seeds", "qa", "membership_plans.json"));
const free = plans.find((plan) => String(plan.plan_code) === "free");
const premium = plans.find((plan) => String(plan.plan_code) === "premium");

if (!free || !premium) {
  console.error("Missing free or premium membership plan in seed data.");
  process.exit(1);
}

if (Number(free.amount ?? 0) !== 0) {
  console.error("Free membership plan must remain zero-cost.");
  process.exit(1);
}

if (!String(free.stripe_price_id ?? "").startsWith("price_test_")) {
  console.error("Free membership plan must use a test Stripe price id.");
  process.exit(1);
}

if (!premium.stripe_price_id) {
  console.error("Premium membership plan is missing stripe_price_id.");
  process.exit(1);
}

if (!String(premium.stripe_price_id).startsWith("price_test_")) {
  console.error("Premium membership plan must use a test Stripe price id.");
  process.exit(1);
}

if (premium.active !== true) {
  console.error("Premium membership plan must be active for QA validation.");
  process.exit(1);
}

console.log("Stripe plan mapping validation passed.");