import { callFrappeMethod } from "./client";

export const notificationsApi = {
  listMyNotifications() {
    return callFrappeMethod("rbp_app.api.notifications.get_notifications", {}, { method: "GET" });
  },

  markRead(name: string) {
    return callFrappeMethod("rbp_app.api.notifications.mark_notification_read", { name });
  },

  markAllRead() {
    return callFrappeMethod("rbp_app.api.notifications.mark_all_notifications_read", {});
  },
};
