import type {
  AdminAuthService,
  AuthService,
  PendingAccountIntent,
  PortalAdminAuthUser,
  PortalCustomerAuthUser,
} from "../../types/portal";
import {
  clearAuthSession,
  getAuthSession,
  isAdminUser,
  setMockAuthSession,
} from "../../auth/authSession";
import { mockFailure, mockSuccess } from "./mockClient";

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
    const session = getAuthSession();

    if (session && !isAdminUser(session)) {
      return {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
    }

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

    const user = {
      ...DEMO_CUSTOMER,
      email,
      name: email === DEMO_CUSTOMER.email ? DEMO_CUSTOMER.name : "RBP Customer",
    };

    writeJson(CUSTOMER_AUTH_KEY, user);
    setMockAuthSession({
      user,
      roles: ["Website User", "RBP Member", "RBP Business Owner"],
    });
    return mockSuccess("/mock/auth/signin", user, "Mock customer signed in.");
  },

  async signUp(payload) {
    if (!payload.email || !payload.name) {
      return mockFailure("/mock/auth/signup", "Name and email are required.", [
        { field: "name", code: "required", message: "Name is required." },
        { field: "email", code: "required", message: "Email is required." },
      ]);
    }

    const user: PortalCustomerAuthUser = {
      id: `cust-${Date.now()}`,
      name: payload.name,
      email: payload.email.trim().toLowerCase(),
      businessName: payload.businessName,
    };

    writeJson(CUSTOMER_AUTH_KEY, user);
    setMockAuthSession({
      user,
      roles: ["Website User", "RBP Member", "RBP Business Owner"],
    });
    return mockSuccess("/mock/auth/signup", user, "Mock customer account created.");
  },

  async signOut() {
    clearAuthSession();
    window.localStorage.removeItem(CUSTOMER_AUTH_KEY);
    return mockSuccess("/mock/auth/signout", { signedOut: true }, "Mock customer signed out.");
  },

  isAuthenticated() {
    return Boolean(getAuthSession() ?? this.getCurrentUser());
  },
};

export const mockAdminAuthService: AdminAuthService = {
  getCurrentAdmin() {
    const session = getAuthSession();

    if (session && isAdminUser(session)) {
      return {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: "admin",
      };
    }

    if (window.localStorage.getItem(LEGACY_ADMIN_AUTH_KEY) === "true") {
      return DEMO_ADMIN;
    }

    return readJson<PortalAdminAuthUser>(ADMIN_AUTH_KEY);
  },

  async signIn(payload) {
    const email = payload.email.trim().toLowerCase();

    if (!email || !payload.password) {
      return mockFailure("/mock/admin/signin", "Email and password are required.", [
        { field: "email", code: "required", message: "Email is required." },
        { field: "password", code: "required", message: "Password is required." },
      ]);
    }

    const admin = {
      ...DEMO_ADMIN,
      email,
      name: email === DEMO_ADMIN.email ? DEMO_ADMIN.name : "RBP Mock Administrator",
    };

    writeJson(ADMIN_AUTH_KEY, admin);
    window.localStorage.setItem(LEGACY_ADMIN_AUTH_KEY, "true");
    setMockAuthSession({
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
      roles: ["RBP Admin"],
    });
    return mockSuccess("/mock/admin/signin", admin, "Mock admin signed in.");
  },

  async signOut() {
    clearAuthSession();
    window.localStorage.removeItem(ADMIN_AUTH_KEY);
    window.localStorage.removeItem(LEGACY_ADMIN_AUTH_KEY);
    return mockSuccess("/mock/admin/signout", { signedOut: true }, "Mock admin signed out.");
  },

  isAuthenticated() {
    return Boolean(this.getCurrentAdmin());
  },
};
