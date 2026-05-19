import test from "node:test";
import assert from "node:assert/strict";

import { readJson, readRepoFile } from "../helpers/env-files.mjs";

const plans = readJson("appwrite/seeds/qa/membership_plans.json");
const entitlements = readJson("appwrite/seeds/qa/entitlements.json");
const planEntitlements = readJson("appwrite/seeds/qa/plan_entitlements.json");
const pricingRules = readJson("appwrite/seeds/qa/pricing_rules.json");
const documentRules = readJson("appwrite/seeds/qa/document_nucleus_rules.json");
const supportRules = readJson("appwrite/seeds/qa/support_rules.json");
const membershipSeedRaw = readRepoFile("appwrite/seeds/qa/membership_plans.json");
const qaSeedFilesRaw = [
  "appwrite/seeds/qa/document_nucleus_rules.json",
  "appwrite/seeds/qa/entitlements.json",
  "appwrite/seeds/qa/membership_plans.json",
  "appwrite/seeds/qa/plan_entitlements.json",
  "appwrite/seeds/qa/pricing_rules.json",
  "appwrite/seeds/qa/support_rules.json",
].map(readRepoFile).join("\n");
const runtimeSource = readRepoFile("appwrite/functions/_shared/runtime.ts");
const stripeSource = readRepoFile("appwrite/functions/_shared/stripe.ts");
const appwriteMembershipApiSource = readRepoFile("frontend/portal/src/app/services/api/appwrite/appwriteMembershipApi.ts");

const planByCode = (code) => plans.find((plan) => plan.plan_code === code);
const ruleByKey = (key) => pricingRules.find((rule) => rule.rule_key === key);
const enabledEntitlements = (planCode) =>
  new Set(
    planEntitlements
      .filter((row) => row.plan_code === planCode && row.enabled === true)
      .map((row) => row.entitlement_key),
  );

test("QA Premium plan is AUD 25 weekly with the approved Stripe sandbox price", () => {
  const premium = planByCode("premium");

  assert.equal(premium.amount, 25);
  assert.equal(premium.currency, "AUD");
  assert.equal(premium.billing_cycle, "weekly");
  assert.equal(premium.stripe_product_id, "prod_UUkCHEv53d9xLJ");
  assert.equal(premium.stripe_price_id, "price_1TVlMC0xk2ucRLEh9h6bjNuc");
});

test("QA seed keeps Free active and does not hardcode live subscription checkout", () => {
  const free = planByCode("free");

  assert.equal(free.amount, 0);
  assert.equal(free.currency, "AUD");
  assert.equal(free.active, true);
  assert.equal(free.stripe_price_id, undefined);
  assert.doesNotMatch(membershipSeedRaw, /price_1TXcxN0mYebE7B3JIrRnhe4w/);
  assert.doesNotMatch(qaSeedFilesRaw, /price_1TXcxN0mYebE7B3JIrRnhe4w/);
});

test("account bootstrap defaults tenants to Free before any Premium checkout", () => {
  assert.match(runtimeSource, /const requestedPlanCode = String\(payload\.planCode \|\| "free"\);/);
  assert.match(runtimeSource, /const planCode = "free";/);
  assert.match(runtimeSource, /isCheckoutAbandonmentEvent\(event\.type\)/);
  assert.match(runtimeSource, /subscription_unchanged: true/);
  assert.match(stripeSource, /case "checkout\.session\.expired":\n\s+return "expired";/);
});

test("frontend membership plan labels avoid slash-none billing copy", () => {
  assert.match(appwriteMembershipApiSource, /return currency === "AUD" \? "AUD \$0" : `\$\{currency\} \$0`;/);
  assert.match(appwriteMembershipApiSource, /return `\$\{price\} \+ GST per week`;/);
  assert.doesNotMatch(appwriteMembershipApiSource, /AUD \$\$\{amount\.toLocaleString\("en-AU"\)\} \/ \$\{billing\}/);
});

test("Free and Premium checkout entitlements match subscription rules", () => {
  const free = enabledEntitlements("free");
  const premium = enabledEntitlements("premium");

  assert.equal(free.has("pay_per_use_checkout"), true);
  assert.equal(free.has("stripe_subscription_checkout"), false);
  assert.equal(premium.has("stripe_subscription_checkout"), true);
  assert.equal(premium.has("billing_management"), true);
});

test("Free receives advertised-price entitlements and Premium receives discounted-price entitlements", () => {
  const free = enabledEntitlements("free");
  const premium = enabledEntitlements("premium");

  assert.equal(free.has("service_requests_advertised_price"), true);
  assert.equal(free.has("on_demand_services_advertised_price"), true);
  assert.equal(free.has("managed_services_advertised_price"), true);
  assert.equal(free.has("service_requests_discounted_price"), false);
  assert.equal(free.has("on_demand_services_discounted_price"), false);
  assert.equal(free.has("managed_services_discounted_price"), false);

  assert.equal(premium.has("service_requests_discounted_price"), true);
  assert.equal(premium.has("on_demand_services_discounted_price"), true);
  assert.equal(premium.has("managed_services_discounted_price"), true);
});

test("customer application provisioning remains disabled for both plans", () => {
  const catalogRecord = entitlements.find((entitlement) => entitlement.entitlement_key === "customer_application_provisioning");
  assert.equal(catalogRecord.enabled_by_default, false);
  assert.equal(enabledEntitlements("free").has("customer_application_provisioning"), false);
  assert.equal(enabledEntitlements("premium").has("customer_application_provisioning"), false);
});

test("Document Nucleus Free and Premium rules are explicit", () => {
  assert.equal(documentRules.free.price_basis, "advertised_price");
  assert.equal(documentRules.free.entitlement_key, "document_nucleus_pay_per_use");
  assert.equal(documentRules.premium.access_model, "unlimited_current_documents");
  assert.equal(documentRules.premium.entitlement_key, "document_nucleus_unlimited");
  assert.equal(documentRules.delivery.direct_customer_download, false);
  assert.equal(documentRules.delivery.output_channel, "email");
  assert.equal(documentRules.delivery.editing_supported, true);
  assert.equal(documentRules.delivery.generation_supported, true);
  assert.equal(documentRules.custom_documents.included, false);
  assert.match(documentRules.premium.fair_use_policy, /ordinary business use/);
});

test("support SLA rules match Free and Premium commitments", () => {
  assert.deepEqual(supportRules.free.channels, ["email"]);
  assert.equal(supportRules.free.target_initial_response_business_hours, 48);
  assert.deepEqual(supportRules.premium.channels, ["portal", "email"]);
  assert.equal(supportRules.premium.target_initial_response_business_days, 1);
  assert.equal(supportRules.premium.escalation_workflow, "premium_admin_support");
  assert.equal(supportRules.emergency_support.included, false);
});

test("pricing rules cover service discounts and marketplace listing fees", () => {
  assert.equal(ruleByKey("on_demand_services_default").premium.discount_percent, 25);
  assert.equal(ruleByKey("managed_services_default").premium.discount_percent, 25);
  assert.equal(ruleByKey("on_demand_services_default").free.discount_percent, 0);
  assert.equal(ruleByKey("managed_services_default").free.discount_percent, 0);
  assert.equal(ruleByKey("marketplace_listing_default").free.base_fee, 100);
  assert.equal(ruleByKey("marketplace_listing_default").premium.base_fee, 50);
  assert.equal(ruleByKey("marketplace_listing_default").add_ons.status, "tbc");
});
