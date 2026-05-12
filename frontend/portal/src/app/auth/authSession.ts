import type { AuthRole, AuthSession, AuthUser } from "./authTypes";

export const MOCK_AUTH_SESSION_KEY = "rbp_mock_auth_session";

export const ADMIN_ROLES: AuthRole[] = ["Administrator", "System Manager", "RBP Admin"];

export const AUTHENTICATED_MEMBER_ROLES: AuthRole[] = [
  "Website User",
  "RBP Member",
  "RBP Business Owner",
  "RBP Team Member",
  "RBP Advisor",
  "RBP Support Agent",
];

const ALL_ROLES = new Set<AuthRole>([...ADMIN_ROLES, ...AUTHENTICATED_MEMBER_ROLES]);

function canUseBrowserStorage() {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

function normaliseRoles(roles: string[] | undefined): AuthRole[] {
  if (!roles) {
    return [];
  }

  return roles.filter((role): role is AuthRole => ALL_ROLES.has(role as AuthRole));
}

// Development bridge only. Replace this storage-backed session with the real
// Frappe session/API during integration. Frappe permissions must remain the
// source of truth for server-side access control.
export function getAuthSession(): AuthSession | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(MOCK_AUTH_SESSION_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<AuthSession>;
    const roles = normaliseRoles(parsed.roles);

    if (
      parsed.status !== "authenticated" ||
      !parsed.user?.id ||
      !parsed.user.email ||
      roles.length === 0
    ) {
      return null;
    }

    return {
      status: "authenticated",
      user: {
        id: parsed.user.id,
        name: parsed.user.name ?? parsed.user.email,
        email: parsed.user.email,
      },
      roles,
      source: "mock",
      createdAt: parsed.createdAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function setMockAuthSession({
  user,
  roles,
}: {
  user: AuthUser;
  roles: AuthRole[];
}): AuthSession | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const session: AuthSession = {
    status: "authenticated",
    user,
    roles: normaliseRoles(roles),
    source: "mock",
    createdAt: new Date().toISOString(),
  };

  window.sessionStorage.setItem(MOCK_AUTH_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearAuthSession() {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.sessionStorage.removeItem(MOCK_AUTH_SESSION_KEY);
}

export function hasAnyRole(roles: AuthRole[], session = getAuthSession()) {
  return Boolean(session && roles.some((role) => session.roles.includes(role)));
}

export function isAuthenticated(session = getAuthSession()) {
  return Boolean(session);
}

export function isAdminUser(session = getAuthSession()) {
  return hasAnyRole(ADMIN_ROLES, session);
}
