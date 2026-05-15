import type {
  AdminAuthService,
  AuthService,
  PendingAccountIntent,
  PortalAdminAuthUser,
  PortalCustomerAuthUser,
} from "../../types/portal";
import { mockFailure, mockSuccess } from "./mockClient";
import { environment } from "../../config/environment";
import { authApi } from "../api/authApi";

const CUSTOMER_AUTH_KEY = "rbp_customer_auth";
const ADMIN_AUTH_KEY = "rbp_admin_auth_user";
const LEGACY_ADMIN_AUTH_KEY = "rbp_admin_auth";
const PENDING_INTENT_KEY = "rbp_pending_account_intent";

const DEMO_CUSTOMER: PortalCustomerAuthUser = {
  id: "cust-demo",
  name: "Remote Business Partner",
  email: "info@remotebusinesspartner.com.au",
  businessName: "Demo Business Pty Ltd",
};

const DEMO_ADMIN: PortalAdminAuthUser = {
  id: "admin-demo",
  name: "RBP Administrator",
  email: "admin@remotebusinesspartner.com.au",
  role: "admin",
};

function readJson<T>(key: string): T | null {
  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function isSafeReturnTo(value: string | null | undefined): value is string {
  return Boolean(value && value.startsWith("/") && !value.startsWith("//"));
}

export function getSafeReturnTo(value: string | null | undefined, fallback = "/portal/dashboard") {
  return isSafeReturnTo(value) ? value : fallback;
}

export function savePendingAccountIntent(intent: Omit<PendingAccountIntent, "createdAt">) {
  window.sessionStorage.setItem(
    PENDING_INTENT_KEY,
    JSON.stringify({ ...intent, createdAt: new Date().toISOString() })
  );
}

export function getPendingAccountIntent(): PendingAccountIntent | null {
  const rawValue = window.sessionStorage.getItem(PENDING_INTENT_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PendingAccountIntent;
  } catch {
    return null;
  }
}

export function clearPendingAccountIntent() {
  window.sessionStorage.removeItem(PENDING_INTENT_KEY);
}

export function createAuthHref(returnTo: string, path = "/signin") {
  return `${path}?returnTo=${encodeURIComponent(returnTo)}`;
}

export const mockAuthService: AuthService = {
  getCurrentUser() {
    return readJson<PortalCustomerAuthUser>(CUSTOMER_AUTH_KEY);
  },

  async signIn(payload) {
    const email = payload.email.trim().toLowerCase();

    if (email === "admin@remotebusinesspartner.com.au") {
      return mockFailure("/mock/auth/signin", "Use the separate admin sign-in for administrator access.", [
        {
          field: "email",
          code: "invalid",
          message: "Admin accounts cannot sign in through the customer portal.",
        },
      ]);
    }

    if (!email || !payload.password) {
      return mockFailure("/mock/auth/signin", "Email and password are required.", [
        { field: "email", code: "required", message: "Email is required." },
        { field: "password", code: "required", message: "Password is required." },
      ]);
    }

    const apiResponse = await authApi.signIn(payload);

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
    return mockSuccess("/mock/auth/signin", user, "Mock customer signed in after backend fallback.");
  },

  async signUp(payload) {
    if (!payload.email || !payload.name) {
      return mockFailure("/mock/auth/signup", "Name and email are required.", [
        { field: "name", code: "required", message: "Name is required." },
        { field: "email", code: "required", message: "Email is required." },
      ]);
    }

    if (!payload.password && !environment.features.mock_auth) {
      return mockFailure("/mock/auth/signup", "Password is required.", [
        { field: "password", code: "required", message: "Password is required." },
      ]);
    }

    const apiResponse = await authApi.signUp(payload);

    if (apiResponse.ok && apiResponse.data) {
      writeJson(CUSTOMER_AUTH_KEY, apiResponse.data);
      return apiResponse;
    }

    if (!environment.features.mock_auth) {
      return apiResponse;
    }

    const user: PortalCustomerAuthUser = {
      id: `cust-${Date.now()}`,
      name: payload.name,
      email: payload.email.trim().toLowerCase(),
      businessName: payload.businessName,
    };

    writeJson(CUSTOMER_AUTH_KEY, user);
    return mockSuccess("/mock/auth/signup", user, "Mock customer account created after backend fallback.");
  },

  async signOut() {
    await authApi.signOut();
    window.localStorage.removeItem(CUSTOMER_AUTH_KEY);
    return mockSuccess("/mock/auth/signout", { signedOut: true }, "Customer signed out.");
  },

  isAuthenticated() {
    return Boolean(this.getCurrentUser());
  },
};

export const mockAdminAuthService: AdminAuthService = {
  getCurrentAdmin() {
    if (window.localStorage.getItem(LEGACY_ADMIN_AUTH_KEY) === "true") {
      return DEMO_ADMIN;
    }

    return readJson<PortalAdminAuthUser>(ADMIN_AUTH_KEY);
  },

  async signIn(payload) {
    if (
      payload.email.trim().toLowerCase() !== DEMO_ADMIN.email ||
      payload.password !== "Admin2024!"
    ) {
      return mockFailure("/mock/admin/signin", "Invalid admin credentials.", [
        { field: "email", code: "invalid", message: "Admin credentials do not match." },
      ]);
    }

    writeJson(ADMIN_AUTH_KEY, DEMO_ADMIN);
    window.localStorage.setItem(LEGACY_ADMIN_AUTH_KEY, "true");
    return mockSuccess("/mock/admin/signin", DEMO_ADMIN, "Mock admin signed in.");
  },

  async signOut() {
    window.localStorage.removeItem(ADMIN_AUTH_KEY);
    window.localStorage.removeItem(LEGACY_ADMIN_AUTH_KEY);
    return mockSuccess("/mock/admin/signout", { signedOut: true }, "Mock admin signed out.");
  },

  isAuthenticated() {
    return Boolean(this.getCurrentAdmin());
  },
};
