import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const portalRoot = path.join(root, "frontend", "portal");

function assertPortalRoot() {
  const pkg = path.join(portalRoot, "package.json");
  if (!fs.existsSync(pkg)) {
    console.error("Run this from the rbp-platform repository root. Could not find frontend/portal/package.json.");
    process.exit(1);
  }
}

function writeFile(relativePath, content) {
  const filePath = path.join(portalRoot, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trimStart(), "utf8");
  console.log(`[write] ${relativePath}`);
}

function patchFile(relativePath, patcher) {
  const filePath = path.join(portalRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    console.warn(`[skip] ${relativePath} not found`);
    return;
  }

  const before = fs.readFileSync(filePath, "utf8");
  const after = patcher(before);

  if (after === before) {
    console.log(`[unchanged] ${relativePath}`);
    return;
  }

  fs.writeFileSync(filePath, after, "utf8");
  console.log(`[patch] ${relativePath}`);
}

assertPortalRoot();

writeFile("src/app/config/environment.ts", `
function readBoolean(value: unknown, fallback: boolean) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
}

function readString(value: unknown, fallback: string) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

export const environment = {
  qaEnvironment: readBoolean(import.meta.env.VITE_QA_ENVIRONMENT, false),
  publicSiteUrl: readString(import.meta.env.VITE_PUBLIC_SITE_URL, "http://localhost:5173"),
  apiBaseUrl: readString(import.meta.env.VITE_API_BASE_URL, ""),
  features: {
    applications: readBoolean(import.meta.env.VITE_ENABLE_APPLICATIONS, false),
    application_interest: readBoolean(import.meta.env.VITE_ENABLE_APPLICATION_INTEREST, true),
    application_provisioning: readBoolean(import.meta.env.VITE_ENABLE_APPLICATION_PROVISIONING, false),
    admin_applications: readBoolean(import.meta.env.VITE_ENABLE_ADMIN_APPLICATIONS, true),
    stripe_checkout: readBoolean(import.meta.env.VITE_ENABLE_STRIPE_CHECKOUT, true),
    email_notifications: readBoolean(import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS, true),
    mock_auth: readBoolean(import.meta.env.VITE_ENABLE_MOCK_AUTH, true),
  },
} as const;

export type RuntimeEnvironment = typeof environment;
`);

writeFile("src/app/config/runtime.ts", `
import { environment, type RuntimeEnvironment } from "./environment";

export type RuntimeConfig = RuntimeEnvironment;

export function getRuntimeConfig(): RuntimeConfig {
  return environment;
}

export function canShowPublicApplications(config: RuntimeConfig = environment) {
  return config.features.applications || config.features.application_interest;
}
`);

writeFile("src/app/hooks/useRuntimeConfig.ts", `
import { getRuntimeConfig } from "../config/runtime";

export function useRuntimeConfig() {
  return {
    config: getRuntimeConfig(),
  };
}
`);

writeFile("src/app/components/EnvironmentBanner.tsx", `
import { environment } from "../config/environment";

export function EnvironmentBanner() {
  if (!environment.qaEnvironment) {
    return null;
  }

  const flags = [
    environment.features.stripe_checkout ? "Stripe checkout enabled" : "Stripe checkout disabled",
    environment.features.application_provisioning ? "Applications provisioning enabled" : "Applications provisioning delayed",
    environment.features.email_notifications ? "Email notifications enabled" : "Email notifications disabled",
  ];

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-bold text-amber-900">
      QA Environment · {flags.join(" · ")}
    </div>
  );
}
`);

writeFile("src/app/services/api/client.ts", `
import type {
  MockApiMeta,
  MockApiResponse,
  MockValidationError,
} from "../mock/mockClient";
import { environment } from "../../config/environment";

export type FrappeHttpMethod = "GET" | "POST";

interface FrappeCallOptions {
  method?: FrappeHttpMethod;
  headers?: Record<string, string>;
}

function createRequestId(prefix = "api") {
  return \`\${prefix}-\${Date.now()}-\${Math.random().toString(36).slice(2, 8)}\`;
}

function createMeta(endpoint: string): MockApiMeta {
  return {
    requestId: createRequestId("api"),
    timestamp: new Date().toISOString(),
    mockEndpoint: endpoint,
    simulated: true,
  };
}

export function apiSuccess<T>(
  endpoint: string,
  data: T,
  message = "API request completed successfully."
): MockApiResponse<T> {
  return {
    ok: true,
    data,
    message,
    errors: [],
    meta: createMeta(endpoint),
  };
}

export function apiFailure<T>(
  endpoint: string,
  message = "API request failed.",
  errors: MockValidationError[] = []
): MockApiResponse<T> {
  return {
    ok: false,
    data: null,
    message,
    errors,
    meta: createMeta(endpoint),
  };
}

function getBaseUrl() {
  return environment.apiBaseUrl.replace(/\\/$/, "");
}

function buildMethodUrl(method: string, params?: Record<string, unknown>, httpMethod: FrappeHttpMethod = "POST") {
  const baseUrl = getBaseUrl();
  const path = \`/api/method/\${method}\`;
  const url = new URL(\`\${baseUrl}\${path}\`, window.location.origin);

  if (httpMethod === "GET" && params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, typeof value === "string" ? value : JSON.stringify(value));
    });
  }

  return url.toString();
}

function extractFrappePayload<T>(raw: unknown): T {
  const value = raw as { message?: T };
  return value && Object.prototype.hasOwnProperty.call(value, "message")
    ? (value.message as T)
    : (raw as T);
}

export async function callFrappeMethod<T>(
  method: string,
  params: Record<string, unknown> = {},
  options: FrappeCallOptions = {}
): Promise<MockApiResponse<T>> {
  const httpMethod = options.method ?? "POST";
  const endpoint = \`/api/method/\${method}\`;
  const url = buildMethodUrl(method, params, httpMethod);

  try {
    const response = await fetch(url, {
      method: httpMethod,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(httpMethod === "POST" ? { "Content-Type": "application/json" } : {}),
        ...(options.headers ?? {}),
      },
      body: httpMethod === "POST" ? JSON.stringify(params) : undefined,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const raw = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
      const message =
        typeof raw === "object" && raw !== null && "message" in raw
          ? String((raw as { message?: unknown }).message ?? response.statusText)
          : response.statusText;

      return apiFailure<T>(endpoint, message, [
        {
          field: "api",
          code: "invalid",
          message,
        },
      ]);
    }

    return apiSuccess<T>(endpoint, extractFrappePayload<T>(raw));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network request failed.";
    return apiFailure<T>(endpoint, message, [
      {
        field: "network",
        code: "invalid",
        message,
      },
    ]);
  }
}
`);

writeFile("src/app/services/api/authApi.ts", `
import type { PortalCustomerAuthUser } from "../../types/portal";
import { apiFailure, apiSuccess, callFrappeMethod } from "./client";

interface FrappeUserPayload {
  user?: string;
  name?: string;
  email?: string;
  full_name?: string;
  user_type?: string;
  roles?: string[];
  is_admin?: boolean;
  is_system_manager?: boolean;
}

function normaliseUser(payload: FrappeUserPayload): PortalCustomerAuthUser {
  const email = payload.email ?? payload.user ?? payload.name ?? "";
  return {
    id: payload.name ?? payload.user ?? email,
    name: payload.full_name ?? email,
    email,
  };
}

export const authApi = {
  async getCurrentUser() {
    const response = await callFrappeMethod<FrappeUserPayload>("rbp_app.api.me.get_current_user", {}, { method: "GET" });

    if (!response.ok || !response.data) {
      return apiFailure<PortalCustomerAuthUser>(
        "/api/method/rbp_app.api.me.get_current_user",
        response.message,
        response.errors
      );
    }

    return apiSuccess("/api/method/rbp_app.api.me.get_current_user", normaliseUser(response.data));
  },

  async signIn(payload: { email: string; password: string }) {
    const response = await callFrappeMethod<unknown>("login", {
      usr: payload.email,
      pwd: payload.password,
    });

    if (!response.ok) {
      return apiFailure<PortalCustomerAuthUser>("/api/method/login", response.message, response.errors);
    }

    return this.getCurrentUser();
  },

  async signUp(payload: { name: string; email: string; businessName?: string }) {
    const response = await callFrappeMethod<unknown>("rbp_app.api.membership.create_signup", {
      payload: {
        name: payload.name,
        email: payload.email,
        business_name: payload.businessName,
      },
    });

    if (!response.ok) {
      return apiFailure<PortalCustomerAuthUser>(
        "/api/method/rbp_app.api.membership.create_signup",
        response.message,
        response.errors
      );
    }

    return apiSuccess("/api/method/rbp_app.api.membership.create_signup", {
      id: payload.email,
      name: payload.name,
      email: payload.email,
      businessName: payload.businessName,
    });
  },

  async signOut() {
    const response = await callFrappeMethod<unknown>("logout", {});
    if (!response.ok) {
      return apiFailure<{ signedOut: true }>("/api/method/logout", response.message, response.errors);
    }

    return apiSuccess("/api/method/logout", { signedOut: true });
  },
};
`);

writeFile("src/app/services/api/membershipApi.ts", `
import type { MockMembershipPlan } from "../../mock";
import { apiFailure, apiSuccess, callFrappeMethod } from "./client";

function normalisePlan(raw: Record<string, unknown>, index: number): MockMembershipPlan {
  const id = String(raw.plan_code ?? raw.name ?? raw.id ?? \`membership-plan-\${index + 1}\`);
  const name = String(raw.plan_name ?? raw.name ?? raw.title ?? "RBP Membership");
  const price = raw.price ?? raw.amount ?? raw.monthly_price ?? 0;
  const currency = String(raw.currency ?? "AUD");
  const billing = String(raw.billing_cycle ?? "Monthly");

  return {
    id,
    name,
    description: String(raw.description ?? "Remote Business Partner membership plan."),
    price: {
      amount: typeof price === "number" ? price : Number(price) || 0,
      currency,
      label: typeof price === "number" || Number(price)
        ? \`\${currency} $\${Number(price).toLocaleString("en-AU")} / \${billing.toLowerCase()}\`
        : String(raw.price_label ?? "Pricing available through RBP"),
    },
    status: raw.active === false ? "inactive" : "active",
    highlights: Array.isArray(raw.highlights) ? raw.highlights.map(String) : [],
  };
}

export const membershipApi = {
  async listMembershipPlans() {
    const response = await callFrappeMethod<unknown[] | { plans?: unknown[] }>(
      "rbp_app.api.membership.list_membership_plans",
      {},
      { method: "GET" }
    );

    if (!response.ok || !response.data) {
      return apiFailure<MockMembershipPlan[]>(
        "/api/method/rbp_app.api.membership.list_membership_plans",
        response.message,
        response.errors
      );
    }

    const rawPlans = Array.isArray(response.data)
      ? response.data
      : Array.isArray((response.data as { plans?: unknown[] }).plans)
        ? (response.data as { plans: unknown[] }).plans
        : [];

    return apiSuccess(
      "/api/method/rbp_app.api.membership.list_membership_plans",
      rawPlans.map((item, index) => normalisePlan(item as Record<string, unknown>, index)),
      "Membership plans returned from backend."
    );
  },

  startOnboarding(planCode: string) {
    return callFrappeMethod("rbp_app.api.membership.start_onboarding", {
      plan_code: planCode,
      source_channel: "portal",
    });
  },

  getMyOnboarding() {
    return callFrappeMethod("rbp_app.api.membership.get_my_onboarding", {}, { method: "GET" });
  },

  updateOnboardingStep(flowName: string, stepKey: string, payload: Record<string, unknown>) {
    return callFrappeMethod("rbp_app.api.membership.update_onboarding_step", {
      flow_name: flowName,
      step_key: stepKey,
      payload,
      status: "Completed",
    });
  },

  submitOnboarding(flowName: string) {
    return callFrappeMethod("rbp_app.api.membership.submit_onboarding", {
      flow_name: flowName,
    });
  },
};
`);

writeFile("src/app/services/api/billingApi.ts", `
import { callFrappeMethod } from "./client";

export interface MembershipCheckoutSession {
  checkout_url?: string;
  url?: string;
  checkout_session_id?: string;
  session_id?: string;
  status?: string;
  message?: string;
}

export const billingApi = {
  createMembershipCheckoutSession(payload: Record<string, unknown>) {
    return callFrappeMethod<MembershipCheckoutSession>(
      "rbp_app.api.billing.create_membership_checkout_session",
      { payload }
    );
  },

  getSubscriptionStatus() {
    return callFrappeMethod("rbp_app.api.billing.get_subscription_status", {}, { method: "GET" });
  },

  getMyPaymentSummary() {
    return callFrappeMethod("rbp_app.api.billing.get_my_payment_summary", {}, { method: "GET" });
  },

  cancelSubscription() {
    return callFrappeMethod("rbp_app.api.billing.cancel_subscription", {});
  },
};
`);

writeFile("src/app/services/api/portalApi.ts", `
import type {
  PortalDashboardState,
  PortalProductActivity,
  PortalProductKey,
} from "../../types/portal";
import { apiFailure, apiSuccess, callFrappeMethod } from "./client";

function productFromKey(value: string): PortalProductKey {
  if (value.includes("decision")) return "decision-desk";
  if (value.includes("doc")) return "docushare";
  if (value.includes("connect") || value.includes("nbn")) return "connectivity";
  if (value.includes("risk")) return "risk-advisor";
  if (value.includes("fix")) return "the-fixer";
  if (value.includes("marketplace-listing")) return "marketplace-listing";
  if (value.includes("marketplace-offer")) return "marketplace-offer";
  return "membership";
}

function activityFromRaw(raw: Record<string, unknown>, index: number): PortalProductActivity {
  const product = productFromKey(String(raw.product ?? raw.source ?? raw.doctype ?? raw.type ?? "membership"));
  const name = String(raw.reference ?? raw.name ?? raw.id ?? \`api-activity-\${index + 1}\`);

  return {
    id: name,
    product,
    title: String(raw.title ?? raw.subject ?? raw.name ?? "Portal activity"),
    description: String(raw.description ?? raw.summary ?? raw.status ?? "Backend portal activity."),
    status: String(raw.status ?? "submitted").toLowerCase().replace(/ /g, "-") as PortalProductActivity["status"],
    reference: String(raw.reference ?? raw.name ?? ""),
    href: String(raw.href ?? "/portal/services"),
    nextAction: String(raw.next_action ?? raw.nextAction ?? "Review in portal"),
    updatedAt: String(raw.updated_at ?? raw.modified ?? raw.creation ?? new Date().toLocaleDateString("en-AU")),
  };
}

export const portalApi = {
  async getDashboardState() {
    const response = await callFrappeMethod<Record<string, unknown>>(
      "rbp_app.api.dashboard.get_home",
      {},
      { method: "GET" }
    );

    if (!response.ok || !response.data) {
      return apiFailure<PortalDashboardState>(
        "/api/method/rbp_app.api.dashboard.get_home",
        response.message,
        response.errors
      );
    }

    const raw = response.data;
    const user = (raw.user ?? raw.current_user ?? raw.me ?? {}) as Record<string, unknown>;
    const billing = (raw.billing ?? raw.subscription ?? {}) as Record<string, unknown>;
    const activitiesRaw = Array.isArray(raw.activities)
      ? raw.activities
      : Array.isArray(raw.requests)
        ? raw.requests
        : [];
    const notificationsRaw = Array.isArray(raw.notifications) ? raw.notifications : [];

    const state: PortalDashboardState = {
      membershipStatus: String(billing.status ?? raw.membership_status ?? "pending").toLowerCase() === "active"
        ? "active"
        : "pending",
      membershipPlan: String(billing.plan ?? raw.membership_plan ?? "RBP Membership"),
      customer: {
        id: String(user.name ?? user.user ?? user.email ?? "current-user"),
        name: String(user.full_name ?? user.name ?? user.email ?? "RBP Member"),
        email: String(user.email ?? user.user ?? ""),
        businessName: String(user.business_name ?? raw.business_name ?? "Your business"),
      },
      activities: activitiesRaw.map((item, index) => activityFromRaw(item as Record<string, unknown>, index)),
      notifications: notificationsRaw.map((item, index) => {
        const record = item as Record<string, unknown>;
        return {
          id: String(record.name ?? record.id ?? \`api-notification-\${index + 1}\`),
          title: String(record.title ?? "Notification"),
          message: String(record.message ?? record.description ?? ""),
          status: String(record.status ?? "submitted").toLowerCase() === "read" ? "active" : "submitted",
          href: String(record.href ?? "/portal/dashboard"),
        };
      }),
    };

    return apiSuccess("/api/method/rbp_app.api.dashboard.get_home", state, "Portal dashboard returned from backend.");
  },
};
`);

writeFile("src/app/services/api/applicationsApi.ts", `
import { callFrappeMethod } from "./client";

export const applicationsApi = {
  listPortalApplications() {
    return callFrappeMethod("rbp_app.api.apps.get_available_apps", {}, { method: "GET" });
  },

  listPublicApplications() {
    return callFrappeMethod("rbp_app.api.applications.list_public_applications", {}, { method: "GET" });
  },

  registerInterest(payload: Record<string, unknown>) {
    return callFrappeMethod("rbp_app.api.applications.register_application_interest", {
      payload,
    });
  },
};
`);

writeFile("src/app/services/api/servicesApi.ts", `
import type {
  PortalProductActivity,
  PortalProductKey,
} from "../../types/portal";
import { apiFailure, apiSuccess, callFrappeMethod } from "./client";

function extractName(data: unknown) {
  const record = data as Record<string, unknown>;
  return String(record?.name ?? record?.id ?? record?.request_name ?? record?.assessment_name ?? record?.case_name ?? "");
}

function normaliseActivity(
  product: PortalProductKey,
  raw: unknown,
  fallbackPayload: Record<string, unknown>
): PortalProductActivity {
  const record = (raw ?? {}) as Record<string, unknown>;
  const name = extractName(record) || \`\${product}-\${Date.now()}\`;

  return {
    id: name,
    product,
    title: String(record.title ?? fallbackPayload.title ?? fallbackPayload.businessName ?? "Submitted request"),
    description: String(record.description ?? record.summary ?? "Submitted to RBP for review."),
    status: "submitted",
    reference: String(record.reference ?? record.reference_id ?? name),
    href: String(record.href ?? "/portal/services"),
    nextAction: "Await RBP review",
    updatedAt: new Date().toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
}

const endpointMap: Partial<Record<PortalProductKey, {
  create: string;
  submit?: string;
  submitParam?: string;
}>> = {
  "decision-desk": {
    create: "rbp_app.api.decision_desk.create_request",
    submit: "rbp_app.api.decision_desk.submit_request",
    submitParam: "request_name",
  },
  connectivity: {
    create: "rbp_app.api.connectivity.create_request",
    submit: "rbp_app.api.connectivity.submit_request",
    submitParam: "request_name",
  },
  "risk-advisor": {
    create: "rbp_app.api.risk_advisor.create_assessment",
    submit: "rbp_app.api.risk_advisor.submit_assessment",
    submitParam: "assessment_name",
  },
  "the-fixer": {
    create: "rbp_app.api.the_fixer.create_case",
    submit: "rbp_app.api.the_fixer.submit_case",
    submitParam: "case_name",
  },
  docushare: {
    create: "rbp_app.api.docushare.create_document",
  },
  "marketplace-listing": {
    create: "rbp_app.api.marketplace.create_listing",
  },
};

export const servicesApi = {
  async createAndSubmitRequest(product: PortalProductKey, payload: Record<string, unknown>) {
    const endpoint = endpointMap[product];

    if (!endpoint) {
      return apiFailure<PortalProductActivity>("/api/method/rbp_app.api.unknown", \`No backend endpoint is mapped for \${product}.\`);
    }

    const created = await callFrappeMethod<Record<string, unknown>>(endpoint.create, { payload });

    if (!created.ok || !created.data) {
      return apiFailure<PortalProductActivity>(\`/api/method/\${endpoint.create}\`, created.message, created.errors);
    }

    let finalData: unknown = created.data;
    const name = extractName(created.data);

    if (endpoint.submit && endpoint.submitParam && name) {
      const submitted = await callFrappeMethod<Record<string, unknown>>(endpoint.submit, {
        [endpoint.submitParam]: name,
      });

      if (submitted.ok && submitted.data) {
        finalData = submitted.data;
      }
    }

    return apiSuccess(
      \`/api/method/\${endpoint.create}\`,
      normaliseActivity(product, finalData, payload),
      "Service request submitted to backend."
    );
  },
};
`);

writeFile("src/app/services/api/notificationsApi.ts", `
import { callFrappeMethod } from "./client";

export const notificationsApi = {
  listMyNotifications() {
    return callFrappeMethod("rbp_app.api.notifications.get_notifications", {}, { method: "GET" });
  },

  markRead(name: string) {
    return callFrappeMethod("rbp_app.api.notifications.mark_notification_read", { name });
  },

  markAllRead() {
    return callFrappeMethod("rbp_app.api.notifications.mark_all_notifications_read", {});
  },
};
`);

writeFile("src/app/services/api/entitlementsApi.ts", `
import { callFrappeMethod } from "./client";

export const entitlementsApi = {
  listMyEntitlements() {
    return callFrappeMethod("rbp_app.api.entitlements.list_my_entitlements", {}, { method: "GET" });
  },
};
`);

writeFile("src/app/services/api/index.ts", `
export * from "./client";
export * from "./authApi";
export * from "./membershipApi";
export * from "./billingApi";
export * from "./portalApi";
export * from "./applicationsApi";
export * from "./servicesApi";
export * from "./notificationsApi";
export * from "./entitlementsApi";
`);

patchFile("src/app/services/mock/auth.mockService.ts", (source) => {
  if (source.includes("../api/authApi")) {
    return source;
  }

  return source
    .replace(
      `import { mockFailure, mockSuccess } from "./mockClient";`,
      `import { mockFailure, mockSuccess } from "./mockClient";
import { environment } from "../../config/environment";
import { authApi } from "../api/authApi";`
    )
    .replace(
      `  async signIn(payload) {
    const email = payload.email.trim().toLowerCase();`,
      `  async signIn(payload) {
    const email = payload.email.trim().toLowerCase();`
    )
    .replace(
      `    if (!email || !payload.password) {`,
      `    if (!email || !payload.password) {`
    )
    .replace(
      `    const user = {
      ...DEMO_CUSTOMER,
      email,
      name: email === DEMO_CUSTOMER.email ? DEMO_CUSTOMER.name : "RBP Customer",
    };

    writeJson(CUSTOMER_AUTH_KEY, user);
    return mockSuccess("/mock/auth/signin", user, "Mock customer signed in.");`,
      `    const apiResponse = await authApi.signIn(payload);

    if (apiResponse.ok && apiResponse.data) {
      writeJson(CUSTOMER_AUTH_KEY, apiResponse.data);
      return apiResponse;
    }

    if (!environment.features.mock_auth) {
      return apiResponse;
    }

    const user = {
      ...DEMO_CUSTOMER,
      email,
      name: email === DEMO_CUSTOMER.email ? DEMO_CUSTOMER.name : "RBP Customer",
    };

    writeJson(CUSTOMER_AUTH_KEY, user);
    return mockSuccess("/mock/auth/signin", user, "Mock customer signed in after backend fallback.");`
    )
    .replace(
      `    const user: PortalCustomerAuthUser = {
      id: \`cust-\${Date.now()}\`,
      name: payload.name,
      email: payload.email.trim().toLowerCase(),
      businessName: payload.businessName,
    };

    writeJson(CUSTOMER_AUTH_KEY, user);
    return mockSuccess("/mock/auth/signup", user, "Mock customer account created.");`,
      `    const apiResponse = await authApi.signUp(payload);

    if (apiResponse.ok && apiResponse.data) {
      writeJson(CUSTOMER_AUTH_KEY, apiResponse.data);
      return apiResponse;
    }

    if (!environment.features.mock_auth) {
      return apiResponse;
    }

    const user: PortalCustomerAuthUser = {
      id: \`cust-\${Date.now()}\`,
      name: payload.name,
      email: payload.email.trim().toLowerCase(),
      businessName: payload.businessName,
    };

    writeJson(CUSTOMER_AUTH_KEY, user);
    return mockSuccess("/mock/auth/signup", user, "Mock customer account created after backend fallback.");`
    )
    .replace(
      `  async signOut() {
    window.localStorage.removeItem(CUSTOMER_AUTH_KEY);
    return mockSuccess("/mock/auth/signout", { signedOut: true }, "Mock customer signed out.");
  },`,
      `  async signOut() {
    await authApi.signOut();
    window.localStorage.removeItem(CUSTOMER_AUTH_KEY);
    return mockSuccess("/mock/auth/signout", { signedOut: true }, "Customer signed out.");
  },`
    );
});

patchFile("src/app/services/mock/portal.mockService.ts", (source) => {
  let next = source;

  if (!next.includes("../api/portalApi")) {
    next = next.replace(
      `import { mockGet, mockSuccess } from "./mockClient";`,
      `import { mockGet, mockSuccess } from "./mockClient";
import { portalApi, servicesApi } from "../api";`
    );
  }

  if (!next.includes("servicesApi.createAndSubmitRequest")) {
    next = next.replace(
      `export async function recordMockPortalActivity(
  payload: Omit<PortalProductActivity, "id" | "updatedAt"> & {
    id?: string;
    updatedAt?: string;
  }
) {
  const state = readPortalState();`,
      `export async function recordMockPortalActivity(
  payload: Omit<PortalProductActivity, "id" | "updatedAt"> & {
    id?: string;
    updatedAt?: string;
  }
) {
  const apiResponse = await servicesApi.createAndSubmitRequest(payload.product, payload as unknown as Record<string, unknown>);
  const state = readPortalState();`
    );

    next = next.replace(
      `  const activity: PortalProductActivity = {
    ...payload,
    id: payload.id ?? \`\${payload.product}-\${Date.now()}\`,
    updatedAt: payload.updatedAt ?? nowLabel(),
  };`,
      `  const activity: PortalProductActivity = apiResponse.ok && apiResponse.data
    ? {
        ...apiResponse.data,
        href: apiResponse.data.href || payload.href,
        adminHref: payload.adminHref,
      }
    : {
        ...payload,
        id: payload.id ?? \`\${payload.product}-\${Date.now()}\`,
        updatedAt: payload.updatedAt ?? nowLabel(),
      };`
    );
  }

  if (!next.includes("portalApi.getDashboardState")) {
    next = next.replace(
      `  getDashboard() {
    return mockGet(
      "/mock/portal/state",
      readPortalState(),
      "Mock shared portal state returned."
    );
  },`,
      `  async getDashboard() {
    const response = await portalApi.getDashboardState();

    if (response.ok && response.data) {
      writePortalState(response.data);
      return response;
    }

    return mockGet(
      "/mock/portal/state",
      readPortalState(),
      "Mock shared portal state returned after backend fallback."
    );
  },`
    );
  }

  return next;
});

patchFile("src/app/pages/portal/PortalDashboard.tsx", (source) => {
  let next = source;

  if (!next.includes(`import { useEffect, useState } from "react";`)) {
    next = next.replace(
      `import { Link } from "react-router";`,
      `import { useEffect, useState } from "react";
import { Link } from "react-router";`
    );
  }

  next = next.replace(
    `import { getCurrentMockPortalState } from "../../services/mock/portal.mockService";`,
    `import { getCurrentMockPortalState, mockPortalService } from "../../services/mock/portal.mockService";`
  );

  if (!next.includes("setPortalState(response.data)")) {
    next = next.replace(
      `export function PortalDashboard() {
  const portalState = getCurrentMockPortalState();`,
      `export function PortalDashboard() {
  const [portalState, setPortalState] = useState(() => getCurrentMockPortalState());

  useEffect(() => {
    let mounted = true;

    mockPortalService.getDashboard().then((response) => {
      if (mounted && response.ok && response.data) {
        setPortalState(response.data);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);`
    );
  }

  return next;
});

patchFile("src/app/features/membership/MembershipPurchaseOnboardingFlow.tsx", (source) => {
  let next = source;

  if (!next.includes(`../../services/api`)) {
    next = next.replace(
      `} from "../../services/mock/membership.mockService";`,
      `} from "../../services/mock/membership.mockService";
import { billingApi, membershipApi } from "../../services/api";`
    );
  }

  next = next.replace(
    `    getMockMembershipPlans().then((response) => {
      if (!mounted || !response.data) {
        return;
      }

      const membershipPlans = response.data;`,
    `    membershipApi.listMembershipPlans().then(async (response) => {
      if (!response.ok || !response.data || response.data.length === 0) {
        response = await getMockMembershipPlans();
      }

      if (!mounted || !response.data) {
        return;
      }

      const membershipPlans = response.data;`
  );

  if (!next.includes("createMembershipCheckoutSession")) {
    next = next.replace(
      `  async function submitSignup() {
    setSubmissionState("loading");
    setErrors({});`,
      `  async function submitSignup() {
    setSubmissionState("loading");
    setErrors({});

    const checkoutResponse = await billingApi.createMembershipCheckoutSession({
      plan_code: form.selectedPlanId,
      selected_plan_id: form.selectedPlanId,
      primary_contact_name: form.primaryContactName,
      email: form.email,
      phone: form.phone,
      business_name: form.businessName,
      abn_or_identifier: form.abnOrIdentifier,
      billing_address: form.billingAddress,
      accepted_terms: form.acceptedTerms,
      marketing_consent: form.marketingConsent,
      selected_extras: form.selectedExtras,
    });

    const checkoutUrl = checkoutResponse.data?.checkout_url ?? checkoutResponse.data?.url;

    if (checkoutResponse.ok && checkoutUrl) {
      writeMembershipSession({
        checkoutSessionId: checkoutResponse.data?.checkout_session_id ?? checkoutResponse.data?.session_id,
        membershipStatus: "pending",
        paymentStatus: "stripe-checkout-started",
        onboardingStatus: "pending-payment",
        businessName: form.businessName,
        primaryContactName: form.primaryContactName,
        selectedPlan: selectedPlan?.name,
      });
      window.location.assign(checkoutUrl);
      return;
    }`
    );
  }

  next = next.replace(
    `description="Complete your membership details, confirm your inclusions, and preview the onboarding flow for RBP Premium Membership. This frontend preview does not process a real payment or create a live account."`,
    `description="Complete your membership details, confirm your inclusions, and continue to secure Stripe checkout when the backend checkout endpoint is available."`
  );

  next = next.replace(
    `description="Review the early bird membership price and preview the payment state. No real payment is processed in this frontend preview."`,
    `description="Review the early bird membership price. The final review step will request a Stripe checkout session from the backend when available."`
  );

  return next;
});

patchFile("src/app/pages/portal/PortalApps.tsx", (source) => {
  let next = source;

  if (!next.includes(`../../services/api`)) {
    next = next.replace(
      `import { useRuntimeConfig } from "../../hooks/useRuntimeConfig";`,
      `import { useRuntimeConfig } from "../../hooks/useRuntimeConfig";
import { applicationsApi } from "../../services/api";`
    );
  }

  if (!next.includes("interestState")) {
    next = next.replace(
      `  const [selectedId, setSelectedId] = useState(mockPortalApplications[0]?.id);`,
      `  const [selectedId, setSelectedId] = useState(mockPortalApplications[0]?.id);
  const [interestState, setInterestState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");`
    );
  }

  if (!next.includes("handleRegisterInterest")) {
    next = next.replace(
      `  const requestActionLabel = provisioningEnabled
    ? "Request Access"
    : interestEnabled
      ? "Register Interest"
      : "Requests Disabled";`,
      `  const requestActionLabel = provisioningEnabled
    ? "Request Access"
    : interestEnabled
      ? "Register Interest"
      : "Requests Disabled";

  async function handleRegisterInterest(applicationKey = selectedApp?.id) {
    if (!interestEnabled || !applicationKey) return;

    setInterestState("submitting");
    const response = await applicationsApi.registerInterest({
      application_key: applicationKey,
      application_name: selectedApp?.name,
      source_channel: "portal",
    });

    setInterestState(response.ok ? "submitted" : "error");
  }`
    );
  }

  next = next.replace(
    `<Link
            to="/portal/support"
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            {requestActionLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Link>`,
    `<button
            type="button"
            onClick={() => handleRegisterInterest()}
            disabled={!interestEnabled || interestState === "submitting"}
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            {interestState === "submitted" ? "Interest Registered" : requestActionLabel} <ArrowRight className="w-3.5 h-3.5" />
          </button>`
  );

  next = next.replace(
    `<Link
                    to="/portal/support"
                    className="w-full inline-flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white transition-all"
                  >
                    {provisioningEnabled ? "Mock Access Request" : "Register Interest"} <ExternalLink className="w-4 h-4" />
                  </Link>`,
    `<button
                    type="button"
                    onClick={() => handleRegisterInterest(selectedApp.id)}
                    disabled={!interestEnabled || interestState === "submitting"}
                    className="w-full inline-flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition-all"
                  >
                    {interestState === "submitted" ? "Interest Registered" : provisioningEnabled ? "Mock Access Request" : "Register Interest"} <ExternalLink className="w-4 h-4" />
                  </button>`
  );

  return next;
});

console.log("Milestone 12 frontend API integration files and patches applied.");
