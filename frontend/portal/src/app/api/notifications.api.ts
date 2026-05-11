import { postFrappeMethod } from "./client";

export interface PortalNotification {
  name: string;
  title: string;
  message?: string;
  notification_type?: string;
  status?: string;
  is_read: boolean;
  related_doctype?: string;
  related_name?: string;
  related_route?: string;
  route?: string;
  priority?: string;
  created_on?: string;
  read_on?: string;
  actor?: string;
}

export interface PortalNotificationFilters {
  is_read?: boolean;
  priority?: string;
  notification_type?: string;
}

export interface PortalNotificationListResponse {
  notifications: PortalNotification[];
  unread_count: number;
  count?: number;
}

export function listMyNotifications(filters: PortalNotificationFilters = {}) {
  return postFrappeMethod<PortalNotificationListResponse>("rbp_app.api.notifications.list_my_notifications", { filters });
}

export function getUnreadCount() {
  return postFrappeMethod<{ unread_count: number }>("rbp_app.api.notifications.get_unread_count", {});
}

export function markNotificationRead(name: string) {
  return postFrappeMethod<{ name: string; is_read: boolean; status: string; read_on?: string }>(
    "rbp_app.api.notifications.mark_notification_read",
    { name },
  );
}

export function markAllNotificationsRead() {
  return postFrappeMethod<{ updated: number }>("rbp_app.api.notifications.mark_all_notifications_read", {});
}
