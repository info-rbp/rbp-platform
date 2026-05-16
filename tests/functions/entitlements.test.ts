import assert from "node:assert/strict";
import test from "node:test";

import { businessEntitlementKeys, entitlementKeys, isKnownEntitlementKey, legacyEntitlementKeys } from "../../appwrite/functions/_shared/entitlements";

const approvedBusinessKeys = [
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

test("approved business entitlement keys are exported", () => {
  assert.deepEqual([...businessEntitlementKeys], approvedBusinessKeys);
});

test("legacy entitlement keys remain available for runtime compatibility", () => {
  assert.equal(legacyEntitlementKeys.includes("applications_interest"), true);
  assert.equal(legacyEntitlementKeys.includes("applications_provisioning"), true);
  assert.equal(entitlementKeys.includes("portal_access"), true);
  assert.equal(entitlementKeys.includes("applications_interest"), true);
});

test("known entitlement guard accepts business and legacy keys", () => {
  assert.equal(isKnownEntitlementKey("document_nucleus_unlimited"), true);
  assert.equal(isKnownEntitlementKey("applications_interest"), true);
  assert.equal(isKnownEntitlementKey("not_a_real_entitlement"), false);
});
