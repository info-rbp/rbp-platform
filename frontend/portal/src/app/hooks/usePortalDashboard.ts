import { useCallback, useEffect, useState } from "react";

import { getPortalDashboard } from "../api/dashboard.api";
import type { PortalDashboardPayload } from "../api/types";
import { mockPortalDashboard } from "../mock";

const useMockPortalFallback = import.meta.env.VITE_USE_MOCK_PORTAL === "true";

export interface PortalDashboardState {
  data: PortalDashboardPayload | null;
  loading: boolean;
  error: string | null;
  unauthenticated: boolean;
  refresh: () => Promise<void>;
}

function createMockDashboardPayload(): PortalDashboardPayload {
  return {
    current_user: {
      user: mockPortalDashboard.user.contact.email,
      name: mockPortalDashboard.user.contact.email,
      email: mockPortalDashboard.user.contact.email,
      full_name: mockPortalDashboard.user.contact.name,
      user_type: "Website User",
      roles: [],
      is_guest: false,
      is_system_manager: false,
      is_admin: false,
    },
    available_apps: mockPortalDashboard.quickLinks.map((link) => ({
      id: link.id,
      label: link.label,
      title: link.label,
      route: link.href,
      href: link.href,
      category: link.icon,
      status: link.emphasis,
    })),
    apps_by_category: {},
    quick_links: mockPortalDashboard.quickLinks.map((link) => ({
      label: link.label,
      route: link.href,
    })),
    platform_modules: [],
    notifications: mockPortalDashboard.notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      status: notification.status,
      route: notification.href,
    })),
    billing: {
      status: "preview",
      plan: "Preview data",
    },
    integrations: [],
  };
}

export function usePortalDashboard(): PortalDashboardState {
  const [data, setData] = useState<PortalDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthenticated, setUnauthenticated] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUnauthenticated(false);

    if (useMockPortalFallback) {
      setData(createMockDashboardPayload());
      setLoading(false);
      return;
    }

    const response = await getPortalDashboard();

    if (!response.ok || !response.data) {
      setData(null);
      setError(response.error ?? "Dashboard data could not be loaded.");
      setUnauthenticated(Boolean(response.unauthenticated));
      setLoading(false);
      return;
    }

    setData(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    data,
    loading,
    error,
    unauthenticated,
    refresh,
  };
}
