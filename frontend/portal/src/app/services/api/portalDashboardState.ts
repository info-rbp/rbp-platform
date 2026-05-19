import type { PortalCustomerAuthUser, PortalDashboardState } from "../../types/portal";

type PortalDashboardPayloadWrapper = {
  ok?: unknown;
  message?: unknown;
  data?: unknown;
  result?: unknown;
  portalState?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function hasDashboardStateShape(value: unknown): value is Partial<PortalDashboardState> {
  if (!isRecord(value)) return false;

  return (
    "customer" in value ||
    "activities" in value ||
    "notifications" in value ||
    "membershipStatus" in value ||
    "membershipPlan" in value
  );
}

export function unwrapPortalDashboardPayload(raw: unknown): unknown {
  if (!isRecord(raw)) return raw;

  const payload = raw as PortalDashboardPayloadWrapper;

  if (hasDashboardStateShape(raw)) {
    return raw;
  }

  for (const key of ["data", "result", "portalState"] as const) {
    if (payload[key] !== undefined) {
      return unwrapPortalDashboardPayload(payload[key]);
    }
  }

  return raw;
}

function normaliseCustomer(rawCustomer: unknown, fallbackCustomer: PortalCustomerAuthUser) {
  const customer = isRecord(rawCustomer) ? rawCustomer : {};
  const email = typeof customer.email === "string" ? customer.email : fallbackCustomer.email;
  const name = typeof customer.name === "string" && customer.name ? customer.name : fallbackCustomer.name || email;

  return {
    id: typeof customer.id === "string" && customer.id ? customer.id : fallbackCustomer.id,
    name: name || "RBP Member",
    email,
    businessName:
      typeof customer.businessName === "string" && customer.businessName
        ? customer.businessName
        : fallbackCustomer.businessName || "Your business",
  };
}

export function normalisePortalDashboardState(
  raw: unknown,
  fallbackState: PortalDashboardState,
): PortalDashboardState {
  const unwrapped = unwrapPortalDashboardPayload(raw);
  const payload = isRecord(unwrapped) ? unwrapped : {};

  const membershipStatus = payload.membershipStatus;

  return {
    membershipStatus:
      membershipStatus === "active" || membershipStatus === "pending"
        ? membershipStatus
        : fallbackState.membershipStatus === "none"
          ? "pending"
          : fallbackState.membershipStatus,
    membershipPlan:
      typeof payload.membershipPlan === "string" && payload.membershipPlan
        ? payload.membershipPlan
        : fallbackState.membershipPlan,
    customer: normaliseCustomer(payload.customer, fallbackState.customer),
    activities: Array.isArray(payload.activities)
      ? (payload.activities as PortalDashboardState["activities"])
      : fallbackState.activities,
    notifications: Array.isArray(payload.notifications)
      ? (payload.notifications as PortalDashboardState["notifications"])
      : fallbackState.notifications,
  };
}
