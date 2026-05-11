import { useCallback, useEffect, useState } from "react";

import {
  getUnreadCount,
  listMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type PortalNotification,
  type PortalNotificationFilters,
} from "../api/notifications.api";

const useMockPortalFallback = import.meta.env.VITE_USE_MOCK_PORTAL === "true";

async function mockPayload(): Promise<PortalNotification[]> {
  const { mockNotifications } = await import("../mock/notifications.mock");
  return mockNotifications.map((item) => ({
    name: item.id,
    title: item.title,
    message: item.message,
    notification_type: "Info",
    status: item.status,
    is_read: item.status === "closed",
    related_route: item.href,
    route: item.href,
    priority: "Normal",
    created_on: item.createdAt,
  }));
}

export function useNotifications(filters: PortalNotificationFilters = {}) {
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthenticated, setUnauthenticated] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUnauthenticated(false);

    if (useMockPortalFallback) {
      const data = await mockPayload();
      setNotifications(data);
      setUnreadCount(data.filter((item) => !item.is_read).length);
      setLoading(false);
      return;
    }

    const response = await listMyNotifications(filters);
    if (!response.ok || !response.data) {
      setNotifications([]);
      setUnreadCount(0);
      setError(response.error ?? "Notifications could not be loaded.");
      setUnauthenticated(Boolean(response.unauthenticated));
      setLoading(false);
      return;
    }

    setNotifications(response.data.notifications);
    setUnreadCount(response.data.unread_count);
    setLoading(false);
  }, [JSON.stringify(filters)]);

  const refreshUnreadCount = useCallback(async () => {
    if (useMockPortalFallback) return;
    const response = await getUnreadCount();
    if (response.ok && response.data) {
      setUnreadCount(response.data.unread_count);
    }
  }, []);

  const markRead = useCallback(async (name: string) => {
    if (useMockPortalFallback) {
      setNotifications((items) => items.map((item) => (item.name === name ? { ...item, is_read: true, status: "Read" } : item)));
      setUnreadCount((count) => Math.max(0, count - 1));
      return;
    }
    const response = await markNotificationRead(name);
    if (!response.ok) {
      setError(response.error ?? "Notification could not be marked read.");
      return;
    }
    await refresh();
  }, [refresh]);

  const markAllRead = useCallback(async () => {
    if (useMockPortalFallback) {
      setNotifications((items) => items.map((item) => ({ ...item, is_read: true, status: "Read" })));
      setUnreadCount(0);
      return;
    }
    const response = await markAllNotificationsRead();
    if (!response.ok) {
      setError(response.error ?? "Notifications could not be marked read.");
      return;
    }
    await refresh();
  }, [refresh]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    unauthenticated,
    refresh,
    refreshUnreadCount,
    markRead,
    markAllRead,
  };
}
