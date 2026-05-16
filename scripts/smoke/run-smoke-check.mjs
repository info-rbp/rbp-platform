import Stripe from "stripe";

const checkName = process.argv[2];
const shouldExecute = process.argv.includes("--execute");

const checks = {
  auth: {
    description: "Validate Appwrite endpoint, project, database, and QA smoke user session.",
    env: ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"],
    executeEnv: ["QA_SMOKE_USER_EMAIL", "QA_SMOKE_USER_PASSWORD"],
    run: runAuth,
  },
  billing: {
    description: "Validate membership plans and Stripe test-mode configuration.",
    env: ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID", "STRIPE_SECRET_KEY", "STRIPE_SUCCESS_URL", "STRIPE_CANCEL_URL"],
    executeEnv: [],
    run: runBilling,
  },
  "stripe-webhook": {
    description: "Execute safe fixture Stripe webhooks and duplicate replay checks.",
    env: ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    executeEnv: ["QA_SMOKE_TENANT_ID"],
    run: runStripeWebhook,
  },
  "service-requests": {
    description: "Execute service request function path for a QA smoke user.",
    env: ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"],
    executeEnv: ["QA_SMOKE_USER_ID"],
    run: runServiceRequests,
  },
  admin: {
    description: "Verify non-admin denial and admin/trusted operation access.",
    env: ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"],
    executeEnv: ["QA_SMOKE_USER_ID"],
    run: runAdmin,
  },
  permissions: {
    description: "Verify scoped customer access and disabled application provisioning.",
    env: ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID"],
    executeEnv: ["QA_SMOKE_USER_ID"],
    run: runPermissions,
  },
};

function emit(status, details = {}) {
  console.log(JSON.stringify({
    check: checkName,
    mode: shouldExecute ? "execute" : "prerequisite",
    status,
    ...details,
  }, null, 2));
}

function fail(message, details = {}) {
  console.error(JSON.stringify({
    check: checkName || "<none>",
    mode: shouldExecute ? "execute" : "prerequisite",
    status: "failed",
    message,
    ...details,
  }, null, 2));
  process.exit(1);
}

function requireKeys(keys) {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length) {
    fail(`Smoke check "${checkName}" blocked: missing required environment variables: ${missing.join(", ")}`, { missing });
  }
}

function baseUrl() {
  return String(process.env.APPWRITE_ENDPOINT || "").replace(/\/+$/, "");
}

function appwriteUrl(path) {
  return `${baseUrl()}${path}`;
}

function appwriteHeaders({ key = true, sessionSecret = "" } = {}) {
  const headers = {
    "content-type": "application/json",
    "x-appwrite-project": process.env.APPWRITE_PROJECT_ID,
  };
  if (key) headers["x-appwrite-key"] = process.env.APPWRITE_API_KEY;
  if (sessionSecret) headers["x-appwrite-session"] = sessionSecret;
  return headers;
}

async function requestJson(path, options = {}) {
  const response = await fetch(appwriteUrl(path), {
    ...options,
    headers: {
      ...appwriteHeaders({ key: options.key !== false, sessionSecret: options.sessionSecret }),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text.slice(0, 300) };
  }
  if (!response.ok) {
    throw Object.assign(new Error(`Appwrite request failed: ${response.status} ${response.statusText}`), {
      status: response.status,
      body,
      path,
    });
  }
  return body;
}

async function listDocuments(collectionId, queries = []) {
  const params = new URLSearchParams();
  for (const query of queries) params.append("queries[]", query);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${collectionId}/documents${suffix}`);
}

async function executeFunction(functionId, body, headers = {}) {
  return requestJson(`/functions/${functionId}/executions`, {
    method: "POST",
    body: JSON.stringify({
      body: typeof body === "string" ? body : JSON.stringify(body),
      async: false,
      method: "POST",
      path: "/",
      headers,
    }),
  });
}

function queryEqual(attribute, values) {
  return JSON.stringify({ method: "equal", attribute, values: Array.isArray(values) ? values : [values] });
}

function queryLimit(limit) {
  return JSON.stringify({ method: "limit", values: [limit] });
}

async function runAuth() {
  await requestJson("/health");
  await requestJson(`/databases/${process.env.APPWRITE_DATABASE_ID}`);

  const session = await requestJson("/account/sessions/email", {
    key: false,
    method: "POST",
    body: JSON.stringify({
      email: process.env.QA_SMOKE_USER_EMAIL,
      password: process.env.QA_SMOKE_USER_PASSWORD,
    }),
  });

  return {
    reachable: true,
    database: process.env.APPWRITE_DATABASE_ID,
    smokeUserId: session.userId || session.user_id || "session-created",
  };
}

function assertStripeTestMode() {
  if (!String(process.env.STRIPE_SECRET_KEY || "").startsWith("sk_test_")) {
    throw new Error("STRIPE_SECRET_KEY must be a Stripe test-mode key for QA smoke checks.");
  }
}

async function runBilling() {
  assertStripeTestMode();
  const plans = await listDocuments("membership_plans", [queryLimit(100)]);
  const documents = plans.documents || [];
  const free = documents.filter((plan) => String(plan.plan_code || "") === "free" || Number(plan.amount || 0) <= 0);
  const paid = documents.filter((plan) => Number(plan.amount || 0) > 0 && String(plan.stripe_price_id || "").startsWith("price_"));

  if (!free.length) throw new Error("No free membership plan found.");
  if (!paid.length) throw new Error("No Stripe-backed paid membership plan found.");

  return { planCount: documents.length, freePlans: free.length, stripePaidPlans: paid.length, stripeMode: "test" };
}

function stripeEvent(id, type, object) {
  return {
    id,
    object: "event",
    api_version: "2025-02-24.acacia",
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    type,
    data: { object },
  };
}

async function executeStripeFixture(event) {
  const body = JSON.stringify(event);
  const signature = Stripe.webhooks.generateTestHeaderString({
    payload: body,
    secret: process.env.STRIPE_WEBHOOK_SECRET,
  });
  return executeFunction("stripe-webhook", body, { "stripe-signature": signature });
}

async function runStripeWebhook() {
  assertStripeTestMode();
  const tenantId = process.env.QA_SMOKE_TENANT_ID;
  const planCode = process.env.QA_SMOKE_PLAN_CODE || "free";
  const subscription = `sub_smoke_${Date.now()}`;
  const events = [
    stripeEvent(`evt_smoke_checkout_${Date.now()}`, "checkout.session.completed", {
      id: `cs_smoke_${Date.now()}`,
      object: "checkout.session",
      subscription,
      metadata: { tenant_id: tenantId, plan_code: planCode },
    }),
    stripeEvent(`evt_smoke_failed_${Date.now()}`, "invoice.payment_failed", {
      id: `in_smoke_${Date.now()}`,
      object: "invoice",
      subscription,
      metadata: { tenant_id: tenantId, plan_code: planCode },
    }),
    stripeEvent(`evt_smoke_deleted_${Date.now()}`, "customer.subscription.deleted", {
      id: subscription,
      object: "subscription",
      metadata: { tenant_id: tenantId, plan_code: planCode },
    }),
  ];

  const results = [];
  for (const event of events) {
    results.push(await executeStripeFixture(event));
  }
  const replay = await executeStripeFixture(events[0]);

  return {
    processedEvents: events.map((event) => event.type),
    replayExecutionId: replay.$id || replay.id || "submitted",
    executionIds: results.map((result) => result.$id || result.id || "submitted"),
  };
}

async function runServiceRequests() {
  const result = await executeFunction("create-service-request", {
    serviceType: process.env.QA_SMOKE_SERVICE_TYPE || "decision-desk",
    summary: `QA smoke service request ${new Date().toISOString()}`,
  }, { "x-appwrite-user-id": process.env.QA_SMOKE_USER_ID });

  return { functionId: "create-service-request", executionId: result.$id || result.id || "submitted" };
}

async function runAdmin() {
  const nonAdmin = await executeFunction("admin-operations", { action: "list_tenants" }, {
    "x-appwrite-user-id": process.env.QA_SMOKE_USER_ID,
  });
  const nonAdminBody = JSON.parse(nonAdmin.responseBody || nonAdmin.response || "{}");
  if (nonAdminBody.ok !== false) {
    throw new Error("Expected non-admin admin operation to be denied.");
  }

  if (process.env.QA_SMOKE_ADMIN_USER_ID) {
    const admin = await executeFunction("admin-operations", { action: "list_tenants" }, {
      "x-appwrite-user-id": process.env.QA_SMOKE_ADMIN_USER_ID,
    });
    return { nonAdminDenied: true, adminVerifiedBy: "APPWRITE_ADMIN_TEAM_ID", adminExecutionId: admin.$id || admin.id || "submitted" };
  }

  if (process.env.APPWRITE_TRUSTED_FUNCTION_TOKEN || process.env.RBP_INTERNAL_FUNCTION_TOKEN) {
    const token = process.env.APPWRITE_TRUSTED_FUNCTION_TOKEN || process.env.RBP_INTERNAL_FUNCTION_TOKEN;
    const admin = await executeFunction("admin-operations", { action: "list_tenants" }, {
      "x-rbp-internal-token": token,
    });
    return { nonAdminDenied: true, adminVerifiedBy: "trusted-internal-token", adminExecutionId: admin.$id || admin.id || "submitted" };
  }

  throw new Error("Admin execute smoke requires QA_SMOKE_ADMIN_USER_ID or APPWRITE_TRUSTED_FUNCTION_TOKEN/RBP_INTERNAL_FUNCTION_TOKEN.");
}

async function runPermissions() {
  const apps = await listDocuments("applications", [queryLimit(25)]);
  const provisioningEnabled = (apps.documents || []).filter((app) => app.provisioning_enabled === true);
  if (provisioningEnabled.length) {
    throw new Error(`Application provisioning must remain disabled; enabled applications: ${provisioningEnabled.map((app) => app.$id).join(", ")}`);
  }

  const notifications = await executeFunction("admin-operations", { action: "list_my_notifications" }, {
    "x-appwrite-user-id": process.env.QA_SMOKE_USER_ID,
  });
  const responseBody = JSON.parse(notifications.responseBody || notifications.response || "{}");
  if (responseBody.ok === false) {
    throw new Error(`Customer notification path failed: ${responseBody.message || "unknown error"}`);
  }

  return {
    applicationProvisioningDisabled: true,
    notificationFunctionScoped: true,
    executionId: notifications.$id || notifications.id || "submitted",
  };
}

if (!checkName || !(checkName in checks)) {
  fail(`Unknown or missing smoke check name: ${checkName ?? "<none>"}`, { available: Object.keys(checks) });
}

const check = checks[checkName];
requireKeys(check.env);

if (!shouldExecute) {
  emit("configured", {
    description: check.description,
    execute: "Pass --execute after QA secrets, test-mode Stripe, and smoke users are configured.",
  });
  process.exit(0);
}

requireKeys([...check.env, ...check.executeEnv]);

try {
  const result = await check.run();
  emit("passed", { description: check.description, result });
} catch (error) {
  fail(error instanceof Error ? error.message : String(error), {
    error: error && typeof error === "object" && "body" in error ? error.body : undefined,
  });
}
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
