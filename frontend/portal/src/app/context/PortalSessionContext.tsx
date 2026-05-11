import { createContext, useContext, useMemo, type ReactNode } from "react";

import type {
  BillingSummary,
  CurrentUser,
  FrappeNotificationPayload,
  NotificationSummary,
  PortalDashboardPayload,
} from "../api/types";
import { usePortalDashboard } from "../hooks/usePortalDashboard";

export interface PortalSessionContextValue {
  user: CurrentUser | null;
  email: string;
  fullName: string;
  roles: string[];
  userType?: string;
  isGuest: boolean;
  isAdmin: boolean;
  initials: string;
  billing: BillingSummary | null;
  membershipStatus?: string;
  notificationCount: number;
  dashboard: PortalDashboardPayload | null;
  loading: boolean;
  error: string | null;
  unauthenticated: boolean;
  refresh: () => Promise<void>;
}

const PortalSessionContext = createContext<PortalSessionContextValue | null>(null);

export function deriveInitials(fullName?: string, email?: string) {
  const source = fullName?.trim() || email?.split("@")[0] || "Member";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function getNotifications(payload: PortalDashboardPayload | null): FrappeNotificationPayload {
  const notifications = payload?.notifications;

  if (!notifications) {
    return { notifications: [], unread_count: 0 };
  }

  if (Array.isArray(notifications)) {
    return { notifications, unread_count: notifications.filter((item) => item.status !== "Read").length };
  }

  return {
    notifications: notifications.notifications as NotificationSummary[],
    unread_count: notifications.unread_count,
  };
}

export function PortalSessionProvider({ children }: { children: ReactNode }) {
  const dashboardState = usePortalDashboard();
  const value = useMemo<PortalSessionContextValue>(() => {
    const user = dashboardState.data?.current_user ?? null;
    const email = user?.email ?? user?.user ?? "";
    const fullName = user?.full_name?.trim() || email || "Member";
    const notifications = getNotifications(dashboardState.data);
    const billing = dashboardState.data?.billing ?? null;

    return {
      user,
      email,
      fullName,
      roles: user?.roles ?? [],
      userType: user?.user_type,
      isGuest: Boolean(user?.is_guest),
      isAdmin: Boolean(user?.is_admin || user?.is_system_manager),
      initials: deriveInitials(fullName, email),
      billing,
      membershipStatus: billing?.status ?? billing?.subscription_status,
      notificationCount: notifications.unread_count,
      dashboard: dashboardState.data,
      loading: dashboardState.loading,
      error: dashboardState.error,
      unauthenticated: dashboardState.unauthenticated,
      refresh: dashboardState.refresh,
    };
  }, [dashboardState]);

  return <PortalSessionContext.Provider value={value}>{children}</PortalSessionContext.Provider>;
}

export function usePortalSession() {
  const context = useContext(PortalSessionContext);

  if (!context) {
    throw new Error("usePortalSession must be used inside PortalSessionProvider.");
  }

  return context;
}
