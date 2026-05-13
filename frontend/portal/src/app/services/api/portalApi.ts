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
  const name = String(raw.reference ?? raw.name ?? raw.id ?? `api-activity-${index + 1}`);

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
          id: String(record.name ?? record.id ?? `api-notification-${index + 1}`),
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
