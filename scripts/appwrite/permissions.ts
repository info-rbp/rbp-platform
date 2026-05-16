export type PermissionAction = "read" | "create" | "update" | "delete";

export type PermissionSpec = Partial<Record<PermissionAction, string[]>>;

export type PermissionOptions = {
  adminTeamId?: string;
};

const ACTIONS: PermissionAction[] = ["read", "create", "update", "delete"];
const PERMISSION_EXPRESSION = /^(read|create|update|delete)\("(.+)"\)$/;

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

export function normalizePermissionExpression(permission: string, options: PermissionOptions = {}) {
  const trimmed = permission.trim();
  const match = trimmed.match(PERMISSION_EXPRESSION);

  if (!match) {
    return trimmed;
  }

  const [, action, target] = match;
  return buildPermission(action as PermissionAction, target, options);
}

export function buildPermission(action: PermissionAction, target: string, options: PermissionOptions = {}) {
  const trimmed = target.trim();
  const existingExpression = trimmed.match(PERMISSION_EXPRESSION);

  if (existingExpression) {
    return buildPermission(existingExpression[1] as PermissionAction, existingExpression[2], options);
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
      const existingExpression = target.trim().match(PERMISSION_EXPRESSION);
      permissions.push(
        existingExpression
          ? normalizePermissionExpression(target, options)
          : buildPermission("read", target, options),
      );
    }
    return [...new Set(permissions)].sort((left, right) => left.localeCompare(right));
  }

  for (const action of ACTIONS) {
    for (const target of spec[action] || []) {
      permissions.push(buildPermission(action, target, options));
    }
  }

  return [...new Set(permissions)].sort((left, right) => left.localeCompare(right));
}

export function permissionFingerprint(permissions: string[] | PermissionSpec | undefined, options: PermissionOptions = {}) {
  return JSON.stringify(buildPermissions(permissions, options));
}
