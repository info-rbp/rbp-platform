export type PermissionAction = "read" | "create" | "update" | "delete";

export type PermissionSpec = Partial<Record<PermissionAction, string[]>>;

export type PermissionOptions = {
  adminTeamId?: string;
};

const ACTIONS: PermissionAction[] = ["read", "create", "update", "delete"];

function requireAdminTeamId(options: PermissionOptions) {
  if (!options.adminTeamId) {
    throw new Error("APPWRITE_ADMIN_TEAM_ID is required to resolve team:admins permissions.");
  }

  return options.adminTeamId;
}

export function normalizePermissionTarget(target: string, options: PermissionOptions = {}) {
  const value = target.trim();

  if (!value) {
    throw new Error("Permission target cannot be empty.");
  }

  const lower = value.toLowerCase();

  if (lower === "role:all" || lower === "any") {
    return "any";
  }

  if (lower === "role:users" || lower === "users") {
    return "users";
  }

  if (lower === "role:guests" || lower === "guests") {
    return "guests";
  }

  if (lower === "team:admins") {
    return `team:${requireAdminTeamId(options)}`;
  }

  if (lower.startsWith("role:team:")) {
    return value.replace(/^role:/i, "");
  }

  if (lower.startsWith("team:")) {
    return value;
  }

  if (lower.startsWith("user:")) {
    return value;
  }

  return value;
}

export function buildPermission(action: PermissionAction, target: string, options: PermissionOptions = {}) {
  const trimmed = target.trim();

  if (/^(read|create|update|delete)\(".+"\)$/.test(trimmed)) {
    return trimmed;
  }

  const normalizedTarget = normalizePermissionTarget(trimmed, options);
  return `${action}("${normalizedTarget}")`;
}

export function buildPermissions(spec: PermissionSpec | string[] | undefined, options: PermissionOptions = {}) {
  if (!spec) {
    return [];
  }

  const permissions: string[] = [];

  if (Array.isArray(spec)) {
    for (const target of spec) {
      permissions.push(buildPermission("read", target, options));
    }
    return [...new Set(permissions)];
  }

  for (const action of ACTIONS) {
    for (const target of spec[action] || []) {
      permissions.push(buildPermission(action, target, options));
    }
  }

  return [...new Set(permissions)];
}
