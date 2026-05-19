import fs from "node:fs";
import path from "node:path";
import { readJson } from "./_lib";

type SeedRecord = Record<string, unknown>;
type PlanEntitlement = { plan_code?: string; entitlement_key?: string; enabled?: boolean };

const qaPremiumStripeProductId = "prod_UUkCHEv53d9xLJ";
const qaPremiumStripePriceId = "price_1TVlMC0xk2ucRLEh9h6bjNuc";

const root = path.join(process.cwd(), "appwrite", "seeds", "qa");
const users = readSeedFile<SeedRecord[]>("users");
const tenants = readSeedFile<SeedRecord[]>("tenants");
const plans = readSeedFile<SeedRecord[]>("membership_plans");
const applications = readSeedFile<SeedRecord[]>("applications");
const interest = readSeedFile<SeedRecord[]>("application_interest");
const notifications = readSeedFile<SeedRecord[]>("notifications");
const serviceRequests = readSeedFile<SeedRecord[]>("service_requests");
const entitlements = readSeedFile<SeedRecord[]>("entitlements");
const planEntitlements = readSeedFile<PlanEntitlement[]>("plan_entitlements");
const pricingRules = readSeedFile<SeedRecord[]>("pricing_rules");
const documentNucleusRules = readSeedFile<SeedRecord>("document_nucleus_rules");
const supportRules = readSeedFile<SeedRecord>("support_rules");

const approvedEntitlementKeys = [
  "portal_access",
  "profile_management",
  "application_interest",
  "application_setup_request",
  "customer_application_provisioning",
  "service_requests_advertised_price",
  "service_requests_discounted_price",
  "on_demand_services_advertised_price",
  "on_demand_services_discounted_price",
  "managed_services_advertised_price",
  "managed_services_discounted_price",
  "document_nucleus_pay_per_use",
  "document_nucleus_unlimited",
  "marketplace_listing_standard_fee",
  "marketplace_listing_discounted_fee",
  "basic_notifications",
  "premium_notifications",
  "email_support_48h",
  "premium_support",
  "billing_management",
  "stripe_subscription_checkout",
  "pay_per_use_checkout",
];

const freeEntitlements = [
  "portal_access",
  "profile_management",
  "application_interest",
  "application_setup_request",
  "service_requests_advertised_price",
  "on_demand_services_advertised_price",
  "managed_services_advertised_price",
  "document_nucleus_pay_per_use",
  "marketplace_listing_standard_fee",
  "basic_notifications",
  "email_support_48h",
  "pay_per_use_checkout",
];

const premiumEntitlements = [
  "portal_access",
  "profile_management",
  "application_interest",
  "application_setup_request",
  "service_requests_advertised_price",
  "service_requests_discounted_price",
  "on_demand_services_advertised_price",
  "on_demand_services_discounted_price",
  "managed_services_advertised_price",
  "managed_services_discounted_price",
  "document_nucleus_unlimited",
  "marketplace_listing_standard_fee",
  "marketplace_listing_discounted_fee",
  "basic_notifications",
  "premium_notifications",
  "premium_support",
  "billing_management",
  "stripe_subscription_checkout",
  "pay_per_use_checkout",
];

function readSeedFile<T>(name: string) {
  return readJson<T>(path.join(root, `${name}.json`));
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function requireCondition(condition: unknown, message: string) {
  if (!condition) fail(message);
}

function planByCode(code: string) {
  return plans.find((plan) => String(plan.plan_code) === code);
}

function entitlementSetForPlan(planCode: string, enabled: boolean) {
  return new Set(
    planEntitlements
      .filter((row) => row.plan_code === planCode && row.enabled === enabled)
      .map((row) => String(row.entitlement_key)),
  );
}

function requireEnabled(planCode: string, keys: string[]) {
  const enabled = entitlementSetForPlan(planCode, true);
  for (const key of keys) {
    requireCondition(enabled.has(key), `Plan ${planCode} is missing enabled entitlement: ${key}`);
  }
}

function requireNotEnabled(planCode: string, key: string) {
  const enabled = entitlementSetForPlan(planCode, true);
  requireCondition(!enabled.has(key), `Plan ${planCode} must not enable entitlement: ${key}`);
}

function pricingRule(key: string) {
  return pricingRules.find((rule) => rule.rule_key === key) as SeedRecord | undefined;
}

function nestedNumber(value: unknown, key: string) {
  return Number((value as SeedRecord | undefined)?.[key]);
}

const requiredUsers = [
  "qa.free@remotebusinesspartner.com.au",
  "qa.premium@remotebusinesspartner.com.au",
  "qa.admin@remotebusinesspartner.com.au",
  "qa.support@remotebusinesspartner.com.au",
];

for (const email of requiredUsers) {
  requireCondition(users.find((user) => user.email === email), `Missing QA user seed: ${email}`);
}

requireCondition(tenants.length, "Missing tenant seed data.");
requireCondition(applications.length, "Missing application seed data.");
requireCondition(interest.length, "Missing application interest seed data.");
requireCondition(notifications.length, "Missing notification seed data.");
requireCondition(serviceRequests.length, "Missing service request seed data.");

const freePlan = planByCode("free");
const premiumPlan = planByCode("premium");
requireCondition(freePlan && premiumPlan, "Missing free or premium membership plan seed data.");
requireCondition(freePlan?.active === true, "Free membership plan must be active.");
requireCondition(Number(freePlan?.amount) === 0, "Free membership plan must remain AUD 0.");
requireCondition(String(freePlan?.currency) === "AUD", "Free membership plan must use AUD.");
requireCondition(!freePlan?.stripe_price_id, "Free membership plan must not require Stripe subscription checkout.");

requireCondition(premiumPlan?.active === true, "Premium membership plan must be active.");
requireCondition(String(premiumPlan?.billing_cycle) === "weekly", "Premium membership plan must bill weekly.");
requireCondition(String(premiumPlan?.currency) === "AUD", "Premium membership plan must use AUD.");
requireCondition(Number(premiumPlan?.amount) === 25, "Premium membership plan must be AUD 25 plus GST.");
requireCondition(
  premiumPlan?.stripe_product_id === qaPremiumStripeProductId,
  "QA Premium membership plan must use the approved Stripe sandbox product id.",
);
requireCondition(
  premiumPlan?.stripe_price_id === qaPremiumStripePriceId,
  "QA Premium membership plan must use the approved Stripe sandbox price id.",
);

const qaSeedText = fs.readdirSync(root)
  .filter((name) => name.endsWith(".json"))
  .map((name) => fs.readFileSync(path.join(root, name), "utf8"))
  .join("\n");
requireCondition(
  !qaSeedText.includes("price_1TXcxN0mYebE7B3JIrRnhe4w"),
  "Live Stripe Premium price id must not be hardcoded into QA seed data.",
);

const entitlementKeys = new Set(entitlements.map((entitlement) => String(entitlement.entitlement_key)));
for (const key of approvedEntitlementKeys) {
  requireCondition(entitlementKeys.has(key), `Missing approved entitlement key: ${key}`);
}

const planEntitlementKeys = new Set(planEntitlements.map((row) => String(row.entitlement_key)));
for (const key of planEntitlementKeys) {
  requireCondition(entitlementKeys.has(key), `Plan entitlement references unknown key: ${key}`);
}

requireEnabled("free", freeEntitlements);
requireEnabled("premium", premiumEntitlements);
requireNotEnabled("free", "stripe_subscription_checkout");
requireNotEnabled("free", "billing_management");
requireNotEnabled("free", "customer_application_provisioning");
requireNotEnabled("premium", "customer_application_provisioning");

const onDemand = pricingRule("on_demand_services_default");
const managed = pricingRule("managed_services_default");
const marketplace = pricingRule("marketplace_listing_default");
requireCondition(nestedNumber(onDemand?.premium, "discount_percent") === 25, "On-Demand Services Premium discount must be 25%.");
requireCondition(nestedNumber(managed?.premium, "discount_percent") === 25, "Managed Services Premium discount must be 25%.");
requireCondition(nestedNumber(onDemand?.free, "discount_percent") === 0, "On-Demand Services Free discount must be 0%.");
requireCondition(nestedNumber(managed?.free, "discount_percent") === 0, "Managed Services Free discount must be 0%.");
requireCondition(nestedNumber(marketplace?.free, "base_fee") === 100, "Marketplace listing Free base fee must be 100 + GST.");
requireCondition(nestedNumber(marketplace?.premium, "base_fee") === 50, "Marketplace listing Premium base fee must be 50 + GST.");
requireCondition(String((marketplace?.add_ons as SeedRecord | undefined)?.status) === "tbc", "Marketplace add-ons must remain TBC.");

requireCondition(
  String((documentNucleusRules.free as SeedRecord | undefined)?.price_basis) === "advertised_price",
  "Document Nucleus Free rule must use advertised price.",
);
requireCondition(
  String((documentNucleusRules.premium as SeedRecord | undefined)?.access_model) === "unlimited_current_documents",
  "Document Nucleus Premium rule must provide unlimited current-document access.",
);
requireCondition(
  (documentNucleusRules.delivery as SeedRecord | undefined)?.direct_customer_download === false,
  "Document Nucleus must not allow direct customer download.",
);
requireCondition(
  (documentNucleusRules.delivery as SeedRecord | undefined)?.editing_supported === true
    && (documentNucleusRules.delivery as SeedRecord | undefined)?.generation_supported === true,
  "Document Nucleus editing and generation must be supported.",
);
requireCondition(
  (documentNucleusRules.custom_documents as SeedRecord | undefined)?.included === false,
  "Document Nucleus custom documents must be quoted separately.",
);
requireCondition(
  String((documentNucleusRules.premium as SeedRecord | undefined)?.fair_use_policy || "").includes("ordinary business use"),
  "Document Nucleus Premium rule must include the fair-use policy.",
);

requireCondition(
  nestedNumber(supportRules.free, "target_initial_response_business_hours") === 48,
  "Free support SLA must target 48 business hours.",
);
requireCondition(
  nestedNumber(supportRules.premium, "target_initial_response_business_days") === 1,
  "Premium support SLA must target one business day.",
);
requireCondition(
  Array.isArray((supportRules.premium as SeedRecord | undefined)?.channels)
    && ((supportRules.premium as SeedRecord).channels as unknown[]).includes("portal")
    && ((supportRules.premium as SeedRecord).channels as unknown[]).includes("email"),
  "Premium support must include portal and email channels.",
);
requireCondition(
  (supportRules.emergency_support as SeedRecord | undefined)?.included === false,
  "Emergency support must not be included unless separately agreed.",
);

console.log("QA seed validation passed for Free/Premium business rules, entitlements, pricing, Document Nucleus, support, and existing QA seeds.");
